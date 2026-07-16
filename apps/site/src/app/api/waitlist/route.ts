import { NextResponse } from "next/server";
import {
  getWaitlistStore,
  hashIp,
  type WaitlistEntry,
} from "@/lib/waitlist";
import { rateLimitAllow } from "@/lib/rate-limit";

// FileAdapter uses node:fs — force the Node.js runtime, never Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CREW_SIZES = new Set(["1-5", "6-15", "16-50", "50+"]);

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function optionalString(value: unknown, maxLength = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIp(request);
  if (!rateLimitAllow(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, save nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const store = getWaitlistStore();
  if (!store) {
    return NextResponse.json(
      { error: "waitlist_unconfigured" },
      { status: 503 },
    );
  }

  const crewSize = optionalString(body.crewSize);
  const entry: WaitlistEntry = {
    name: name.slice(0, 200),
    email: email.slice(0, 320),
    company: optionalString(body.company),
    crewSize: crewSize && CREW_SIZES.has(crewSize) ? crewSize : undefined,
    currentSoftware: optionalString(body.currentSoftware),
    wantsDemo: body.wantsDemo === true,
    createdAt: new Date().toISOString(),
    source: "site",
    ip: ip === "unknown" ? undefined : hashIp(ip),
  };

  try {
    await store.save(entry);
  } catch (err) {
    console.error("waitlist save failed:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

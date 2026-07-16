import type { User as AuthUser } from "@supabase/supabase-js";
import { getStore, rowToOrg } from "./store";
import { createServerSupabase, isSupabaseConfigured } from "./supabase/server";
import { createServiceSupabase } from "./supabase/service";
import type { Org, User, UserRole } from "./types";

export interface Session {
  org: Org;
  user: User;
}

/**
 * The current session.
 *
 * - Supabase configured: resolves the signed-in auth user, then their org via
 *   the `memberships` table. If the user has no membership yet (e.g. they just
 *   confirmed their email), the org + membership are bootstrapped lazily from
 *   the company/name saved in auth metadata at signup (ensureOrgForUser).
 * - otherwise (dev): returns the single seeded demo org + its owner unchanged.
 *   Accessing the store here also triggers first-run seeding.
 */
export async function getSession(): Promise<Session> {
  if (isSupabaseConfigured()) {
    const session = await resolveSupabaseSession(true);
    if (!session) throw new Error("Not authenticated.");
    return session;
  }
  return getDemoSession();
}

/**
 * Like getSession() but returns null instead of throwing when there is no
 * signed-in user (or no membership yet). Read-only: it never bootstraps an org.
 * Used by the layout/nav, which render on public pages too.
 */
export async function getSessionOrNull(): Promise<Session | null> {
  if (isSupabaseConfigured()) {
    try {
      return await resolveSupabaseSession(false);
    } catch {
      return null;
    }
  }
  return getDemoSession();
}

/** The demo file-store session: first seeded org + its owner. */
async function getDemoSession(): Promise<Session> {
  const store = await getStore();
  const orgs = await store.listOrgs();
  const org = orgs[0];
  if (!org) throw new Error("No org has been seeded");
  const users = await store.listUsers(org.id);
  const user = users.find((u) => u.role === "owner") ?? users[0];
  if (!user) throw new Error("Demo org has no users");
  return { org, user };
}

/**
 * Resolves the org/user for the current Supabase auth user.
 * When `bootstrap` is true and the user has no membership, one is created
 * (org + membership) via the service client; when false, returns null instead.
 */
async function resolveSupabaseSession(
  bootstrap: boolean,
): Promise<Session | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Membership lookup failed: ${error.message}`);

  if (membership) {
    const m = membership as { org_id: string; name: string; role: UserRole };
    const { data: orgRow, error: orgErr } = await supabase
      .from("orgs")
      .select("*")
      .eq("id", m.org_id)
      .maybeSingle();
    if (orgErr) throw new Error(`Org lookup failed: ${orgErr.message}`);
    if (!orgRow) return null;
    return {
      org: rowToOrg(orgRow as Parameters<typeof rowToOrg>[0]),
      user: {
        id: user.id,
        orgId: m.org_id,
        email: user.email ?? "",
        name: m.name,
        role: m.role,
      },
    };
  }

  if (!bootstrap) return null;
  return ensureOrgForUser(user);
}

/**
 * Bootstraps the first org + owner membership for a user who has none yet.
 * Uses the SERVICE client because a brand-new user has no membership, so RLS
 * would otherwise block creating the org (chicken-and-egg). Idempotent: if a
 * membership already exists (e.g. created concurrently), it is reused.
 */
async function ensureOrgForUser(user: AuthUser): Promise<Session> {
  const service = createServiceSupabase();

  const existing = await service
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing.error) {
    throw new Error(`Membership lookup failed: ${existing.error.message}`);
  }

  const metadata = user.user_metadata ?? {};
  const companyName =
    typeof metadata.company_name === "string" && metadata.company_name.trim()
      ? metadata.company_name.trim()
      : "My Company";
  const fullName =
    typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";

  if (existing.data) {
    const m = existing.data as { org_id: string; name: string; role: UserRole };
    const orgRow = await service
      .from("orgs")
      .select("*")
      .eq("id", m.org_id)
      .single();
    if (orgRow.error) throw new Error(`Org lookup failed: ${orgRow.error.message}`);
    return {
      org: rowToOrg(orgRow.data as Parameters<typeof rowToOrg>[0]),
      user: {
        id: user.id,
        orgId: m.org_id,
        email: user.email ?? "",
        name: m.name,
        role: m.role,
      },
    };
  }

  const orgInsert = await service
    .from("orgs")
    .insert({ name: companyName })
    .select()
    .single();
  if (orgInsert.error) throw new Error(`Org create failed: ${orgInsert.error.message}`);
  const org = rowToOrg(orgInsert.data as Parameters<typeof rowToOrg>[0]);

  const role: UserRole = "owner";
  const memberInsert = await service.from("memberships").insert({
    user_id: user.id,
    org_id: org.id,
    role,
    name: fullName,
  });
  if (memberInsert.error) {
    throw new Error(`Membership create failed: ${memberInsert.error.message}`);
  }

  return {
    org,
    user: {
      id: user.id,
      orgId: org.id,
      email: user.email ?? "",
      name: fullName,
      role,
    },
  };
}

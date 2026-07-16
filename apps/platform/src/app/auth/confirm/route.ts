import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Email-confirmation callback for Supabase Auth.
 *
 * Supabase sends the new user here (see signUp's `emailRedirectTo`) with either
 * a `token_hash` + `type` (the default OTP link) or a `code` (PKCE flow). We
 * verify/exchange it to establish the session cookie, then land the user on the
 * onboarding flow. Any failure sends them to /login with an error flag.
 *
 * Must stay reachable WITHOUT a prior session — see isPublicPath in
 * src/lib/supabase/middleware.ts. In demo mode (no Supabase) it is inert and
 * simply forwards to /onboarding.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createServerSupabase();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL("/onboarding", origin));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/onboarding", origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=Could%20not%20confirm%20your%20email.%20Please%20try%20logging%20in.", origin),
  );
}

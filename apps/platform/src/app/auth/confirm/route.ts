import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Email-confirmation callback for Supabase Auth.
 *
 * Supabase sends the new user here (see signUp's `emailRedirectTo`) with either
 * a `token_hash` + `type` (the default OTP link) or a `code` (PKCE flow). We
 * verify/exchange it to establish the session cookie, then land the user on the
 * onboarding flow.
 *
 * Confirmation links are ONE-TIME-USE, and email clients/security scanners
 * often prefetch them — consuming the token before the user's real click. So a
 * verification "failure" here frequently means "already confirmed": if a
 * session exists we continue to onboarding, and otherwise we send the user to
 * the login page with a friendly retry notice instead of a dead-end error.
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

  let verified = false;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    verified = !error;
    if (error) {
      console.error("[auth/confirm] verifyOtp failed:", error.code, error.message);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
    if (error) {
      console.error("[auth/confirm] code exchange failed:", error.code, error.message);
    }
  }

  if (verified) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  // The token may already have been consumed (prefetch, double-click, resend).
  // If this browser holds a session anyway, the user is confirmed — proceed.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  return NextResponse.redirect(new URL("/login?notice=confirm_retry", origin));
}

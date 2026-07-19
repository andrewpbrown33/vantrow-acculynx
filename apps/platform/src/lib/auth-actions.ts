"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase, isSupabaseConfigured } from "./supabase/server";
import { createServiceSupabase } from "./supabase/service";

/** Result surfaced back to the login/signup forms via useActionState. */
export interface AuthFormState {
  error?: string;
  notice?: string;
}

function field(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Idempotently create the org + owner membership for a freshly-signed-up user.
 * Uses the SERVICE client (bypasses RLS) because the user has no membership yet.
 */
async function bootstrapOrg(
  userId: string,
  companyName: string,
  fullName: string,
): Promise<void> {
  const service = createServiceSupabase();

  const existing = await service
    .from("memberships")
    .select("id")
    .eq("user_id", userId)
    // #4: match the ordering used elsewhere so this idempotency check and the
    // session resolver agree on "the" membership when duplicates exist.
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing.error) {
    throw new Error(`Membership lookup failed: ${existing.error.message}`);
  }
  if (existing.data) return; // already bootstrapped

  const orgInsert = await service
    .from("orgs")
    .insert({ name: companyName || "My Company" })
    .select()
    .single();
  if (orgInsert.error) {
    throw new Error(`Org create failed: ${orgInsert.error.message}`);
  }
  const orgId = (orgInsert.data as { id: string }).id;

  const memberInsert = await service.from("memberships").insert({
    user_id: userId,
    org_id: orgId,
    role: "owner",
    name: fullName,
  });
  if (memberInsert.error) {
    throw new Error(`Membership create failed: ${memberInsert.error.message}`);
  }
}

/**
 * Self-serve signup: create the auth user, then bootstrap their own org.
 * On success (session present) redirects to the pipeline; if the project
 * requires email confirmation, returns a "check your email" notice instead.
 */
export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Signup is unavailable in demo mode." };
  }

  const email = field(formData, "email");
  const password = formData.get("password");
  const passwordStr = typeof password === "string" ? password : "";
  const fullName = field(formData, "name");
  const companyName = field(formData, "company");

  if (!email || !passwordStr || !fullName || !companyName) {
    return { error: "Please fill in your name, company, email, and password." };
  }

  // Derive the site origin from the request so the confirmation email links back
  // to THIS deployment's /auth/confirm callback (handles preview/prod hosts).
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : "";

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: passwordStr,
    options: {
      // Saved so the org can still be bootstrapped on first login if the user
      // has to confirm their email before a session exists.
      data: { full_name: fullName, company_name: companyName },
      // After the user clicks the email link, land them on the onboarding flow
      // (via the /auth/confirm route handler, which verifies the token first).
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
    },
  });

  if (error) {
    // Full detail to the server logs (Vercel → your platform project → Logs).
    console.error("[signup] supabase.auth.signUp failed:", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    const msg = error.message.toLowerCase();
    if (error.code === "user_already_exists" || msg.includes("already registered")) {
      return { error: "An account with this email already exists. Try logging in." };
    }
    if (error.code === "weak_password" || msg.includes("password")) {
      return { error: "Please choose a stronger password (at least 6 characters)." };
    }
    if (msg.includes("rate limit") || msg.includes("too many") || error.status === 429) {
      return {
        error:
          "Too many attempts in a short window (Supabase's email/rate limit). Wait a few minutes and try again — or turn off Authentication → Email → “Confirm email” in Supabase to remove the email step.",
      };
    }
    if (msg.includes("sending") || (msg.includes("email") && msg.includes("confirm"))) {
      return {
        error:
          "Supabase couldn’t send the confirmation email. In Supabase → Authentication → Providers → Email, turn off “Confirm email” (or configure an email provider), then try again.",
      };
    }
    if (msg.includes("signups not allowed") || msg.includes("signup is disabled") || msg.includes("not allowed")) {
      return {
        error:
          "Signups are disabled for this project. In Supabase → Authentication → Sign In / Providers, enable email signups, then try again.",
      };
    }
    // Fall back to the real message so nothing is hidden while we get set up.
    return { error: `We couldn’t create your account: ${error.message}` };
  }

  if (data.user) {
    try {
      await bootstrapOrg(data.user.id, companyName, fullName);
    } catch (bootstrapErr) {
      const detail =
        bootstrapErr instanceof Error ? bootstrapErr.message : String(bootstrapErr);
      console.error("[signup] org bootstrap failed:", detail);
      return {
        error: `Your account was created, but setting up your workspace failed: ${detail}. This usually means the 0003 migration wasn’t applied or the service-role key is missing. Fix that, then log in — your workspace will finish setting up automatically.`,
      };
    }
  }

  if (!data.session) {
    // Email confirmation is on: the user finishes via the emailed link, which
    // lands on /auth/confirm → /onboarding once verified.
    return {
      notice:
        "Account created. Check your email for a confirmation link to finish setting up your workspace.",
    };
  }

  // Instant login (email confirmation off): go straight to onboarding.
  redirect("/onboarding");
}

/** Email + password sign-in. Redirects to the pipeline on success. */
export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Login is unavailable in demo mode." };
  }

  const email = field(formData, "email");
  const password = formData.get("password");
  const passwordStr = typeof password === "string" ? password : "";

  if (!email || !passwordStr) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: passwordStr,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("email not confirmed")) {
      return { error: "Please confirm your email first, then log in." };
    }
    return { error: "That email or password is incorrect." };
  }

  // Brand-new workspaces (no contacts, no jobs yet) land on onboarding so the
  // migration flow isn't missed when the confirm-link path was skipped or hit
  // a snag; everyone else goes to the pipeline. Best-effort: any failure in
  // this check falls back to the pipeline.
  let destination = "/pipeline";
  try {
    const { data: membership } = await supabase
      .from("memberships")
      .select("org_id")
      // #4: same earliest-wins ordering as the session resolver.
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    const orgId = (membership as { org_id: string } | null)?.org_id;
    if (!orgId) {
      // No membership yet: a brand-new account whose workspace bootstraps on
      // first load — definitely onboarding.
      destination = "/onboarding";
    } else {
      const [jobs, contacts] = await Promise.all([
        supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("org_id", orgId),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("org_id", orgId),
      ]);
      const jobCount = jobs.count ?? 0;
      const contactCount = contacts.count ?? 0;
      if (jobCount === 0 && contactCount === 0) {
        // Brand-new workspace — start the migration flow.
        destination = "/onboarding";
      } else if (jobCount === 0) {
        // #15: contacts imported but the pipeline is still empty — send them to
        // Contacts (where the bulk "Add to pipeline" lives), not the barren board.
        destination = "/contacts";
      }
    }
  } catch (e) {
    console.error("[signin] fresh-workspace check failed:", e);
  }

  redirect(destination);
}

/** Sign out and return to the login page. */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

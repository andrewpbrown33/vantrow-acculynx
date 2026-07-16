"use server";

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

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: passwordStr,
    options: {
      // Saved so the org can still be bootstrapped on first login if the user
      // has to confirm their email before a session exists.
      data: { full_name: fullName, company_name: companyName },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (error.code === "user_already_exists" || msg.includes("already registered")) {
      return { error: "An account with this email already exists. Try logging in." };
    }
    if (error.code === "weak_password" || msg.includes("password")) {
      return { error: "Please choose a stronger password (at least 6 characters)." };
    }
    return { error: "Could not create your account. Please try again." };
  }

  if (data.user) {
    await bootstrapOrg(data.user.id, companyName, fullName);
  }

  if (!data.session) {
    // Email confirmation is on: the org is created on first authenticated load.
    return {
      notice:
        "Account created. Check your email for a confirmation link, then log in.",
    };
  }

  redirect("/pipeline");
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

  redirect("/pipeline");
}

/** Sign out and return to the login page. */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

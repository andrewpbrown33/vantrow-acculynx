import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Is the real Supabase backend "on"?
 *
 * Supabase mode is enabled when BOTH the public URL and anon key are present.
 * When either is missing the app falls back to the dev file store + demo org
 * (see getStore/getSession). The service-role key is required only for the
 * public e-sign path and signup bootstrap and is validated separately.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * The USER-CONTEXT Supabase client for the current request.
 *
 * Built lazily (never at module load) via @supabase/ssr so RLS applies: every
 * query runs as the signed-in user and is org-scoped by the 0003 policies.
 * The App-Router cookie adapter reads the request cookies and writes refreshed
 * auth cookies back through Next's cookie store.
 *
 * IMPORTANT: this must only be called inside a request scope (Server Component,
 * Route Handler, or Server Action) because it reads `cookies()`.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` can be called from a Server Component render, where the
          // cookie store is read-only. The middleware refreshes the session, so
          // it is safe to ignore writes here.
        }
      },
    },
  });
}

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The SERVICE-ROLE Supabase client. Server-only.
 *
 * This client uses the secret service-role key, which BYPASSES row level
 * security by design. It is used for exactly two things:
 *   1. the PUBLIC e-sign path (`/sign/:token`), which is unauthenticated and
 *      must look an estimate up strictly by its `send_token`; and
 *   2. the signup → org bootstrap, which creates the first `orgs` +
 *      `memberships` rows for a brand-new user who has no membership yet (so
 *      RLS would otherwise block the writes — a chicken-and-egg).
 *
 * Never expose this key to the browser and never construct this client at
 * module load — always call it lazily inside a server function.
 */
export function createServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase service client is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

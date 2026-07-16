# Runbook 03 — Supabase Project (Waitlist Storage)

**Who:** Andrew. **Prereqs:** none (can be done before or after Vercel). **Time:** ~15 minutes.

> Scope note: this project stores **only** the marketing-site waitlist. The future product
> platform gets its **own** Supabase project — don't let this one become load-bearing.

## Steps

1. **Create the project.** https://supabase.com/dashboard → New project. Org: your
   Vantrow org (create one if needed). Name: `<brand>-site`. Region: closest to your
   customers (US East is a safe default). Generate a strong database password and store
   it in your password manager (you rarely need it again).
2. **Run the migration.** Dashboard → SQL Editor → New query → paste the entire contents
   of `supabase/migrations/0001_waitlist.sql` from this repo → Run. You should see
   "Success. No rows returned".
3. **Confirm security posture.** Dashboard → Table Editor → `waitlist_signups` →
   the table should show **RLS enabled** with **no policies**. That is correct and
   intentional: the anon/public key can do nothing; only the service-role key (used
   server-side by the API route) can insert.
4. **Copy the two values into Vercel** (Runbook 02 step 3):
   - Project Settings → API → Project URL → `SUPABASE_URL`
   - Project Settings → API → `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`
   Redeploy the site after saving env vars (Vercel → Deployments → ⋯ → Redeploy).
5. **Test end-to-end.** Submit the live `/early-access` form with a real-looking test
   entry. It should appear in Table Editor → `waitlist_signups` within seconds.
6. **Viewing / exporting signups later:** Table Editor for browsing; or SQL Editor:
   `select * from waitlist_signups order by created_at desc;` → Export CSV button.

## You're done when

- A test submission from the production site appears as a row in `waitlist_signups`,
  and the test row is deleted afterwards.

-- 0006_org_stripe_account.sql
--
-- Stripe Connect: each contractor (org) links their own connected account and
-- receives homeowner payments directly. We store the connected-account id and a
-- cached "can this account accept charges yet?" flag (kept in sync from the
-- onboarding return + the account.updated webhook).
--
-- These are read/written by the SERVICE-role client (server actions + the Stripe
-- webhook), so no new RLS policy is required.
--
-- How to apply: Supabase → SQL Editor → paste + Run (after 0002–0005). Idempotent.

alter table public.orgs
  add column if not exists stripe_account_id text;

alter table public.orgs
  add column if not exists stripe_charges_enabled boolean not null default false;

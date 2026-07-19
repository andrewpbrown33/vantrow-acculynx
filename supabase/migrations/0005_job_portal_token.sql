-- 0005_job_portal_token.sql
--
-- Adds the persistent homeowner-portal token to jobs (see the live client
-- dashboard, /portal/[token]). Unlike the estimate `send_token`, this token
-- spans the whole job lifecycle and does not expire.
--
-- The portal reads via the SERVICE-role client (getServiceStore), which bypasses
-- RLS, so no new RLS policy is needed — the token itself is the capability.
--
-- New jobs get a token at insert time (see SupabaseStore.createJob); existing
-- rows stay NULL until the contractor first shares the link (ensurePortalLink
-- backfills via updateJob). The unique index tolerates many NULLs.
--
-- How to apply: Supabase → SQL Editor → paste + Run (after 0002–0004). Idempotent.

alter table public.jobs
  add column if not exists portal_token text;

create unique index if not exists jobs_portal_token_idx
  on public.jobs (portal_token);

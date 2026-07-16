-- 0003_platform_auth_rls.sql
--
-- Turns 0002_platform.sql into a real multi-tenant backend backed by Supabase
-- Auth. It adds a `memberships` table linking each auth user to an org, drops
-- the unused `public.users` table, and replaces the RLS policy STUBS from 0002
-- with real org-scoped policies on every tenant table.
--
-- Access model after this migration:
--   * Authenticated users are ORG-ISOLATED: a signed-in user can read/write a
--     row only when its org_id is one of the orgs they belong to (via
--     `memberships`). One company can never see another company's data.
--   * The SERVICE-ROLE key still BYPASSES RLS by design. The server-side data
--     adapter uses it for exactly two things:
--       (a) the PUBLIC e-sign path (/sign/:token), which is unauthenticated and
--           looks an estimate up strictly by its send_token; and
--       (b) the signup -> org bootstrap, which creates the first orgs +
--           memberships rows for a brand-new user who has no membership yet
--           (RLS would otherwise block that chicken-and-egg write).
--   * The anon/public key can do nothing on tenant tables (no anon policies).
--
-- How to apply:
--   1. Apply 0002_platform.sql FIRST (it creates the tables + enums).
--   2. Open your Supabase project -> SQL Editor -> New query.
--   3. Paste this entire file and click "Run". It should report
--      "Success. No rows returned".
--   (Or, with the Supabase CLI linked: `supabase db push`.)
--
-- Order matters: 0002 then 0003. See docs/runbooks/07-platform-supabase-backend.md.

-- ---------------------------------------------------------------------------
-- Memberships: the auth user <-> org join (with per-org role + display name)
-- ---------------------------------------------------------------------------
create table public.memberships (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  org_id     uuid not null references public.orgs (id) on delete cascade,
  role       user_role not null default 'owner',
  name       text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, org_id)
);

create index memberships_user_idx on public.memberships (user_id);
create index memberships_org_idx  on public.memberships (org_id);

alter table public.memberships enable row level security;

-- A user may see and create only their OWN membership rows. (Creation of the
-- very first org+membership for a new user happens via the service-role key,
-- which bypasses RLS; these policies cover the authenticated client.)
create policy "members select own memberships"
  on public.memberships for select
  using (user_id = auth.uid());

create policy "members insert own memberships"
  on public.memberships for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Drop the now-unused public.users table.
--
-- In 0002 `users` modeled org members, but identity now lives in Supabase Auth
-- (auth.users) + `memberships`. `users` was never populated in production, so
-- it is safe to drop. (Dropping the table also drops its index + RLS state.)
-- ---------------------------------------------------------------------------
drop table if exists public.users cascade;

-- ---------------------------------------------------------------------------
-- Org-scoped RLS policies for every tenant table.
--
-- Helper predicate used throughout:
--   org_id in (select org_id from public.memberships where user_id = auth.uid())
-- i.e. "this row belongs to an org the current user is a member of".
-- Each table gets a SELECT policy and an ALL policy (insert/update/delete) with
-- a matching WITH CHECK so users cannot read, create, or move rows into an org
-- they do not belong to.
-- ---------------------------------------------------------------------------

-- orgs: scope by the org's own id.
create policy "members select their org"
  on public.orgs for select
  using (
    id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write their org"
  on public.orgs for all
  using (
    id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- contacts
create policy "members select contacts"
  on public.contacts for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write contacts"
  on public.contacts for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- jobs
create policy "members select jobs"
  on public.jobs for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write jobs"
  on public.jobs for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- estimates
create policy "members select estimates"
  on public.estimates for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write estimates"
  on public.estimates for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- signatures
create policy "members select signatures"
  on public.signatures for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write signatures"
  on public.signatures for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- invoices
create policy "members select invoices"
  on public.invoices for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write invoices"
  on public.invoices for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- payments
create policy "members select payments"
  on public.payments for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write payments"
  on public.payments for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

-- activities
create policy "members select activities"
  on public.activities for select
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );
create policy "members write activities"
  on public.activities for all
  using (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.memberships where user_id = auth.uid())
  );

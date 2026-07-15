-- 0001_waitlist.sql
--
-- Waitlist signups table for the marketing site's /api/waitlist endpoint.
--
-- How to apply:
--   1. Open your Supabase project dashboard → SQL Editor.
--   2. Paste this entire file and click "Run".
--   (Or, with the Supabase CLI linked to the project: `supabase db push`.)
--
-- Access model: row level security is ENABLED and NO policies are created,
-- on purpose. The site's API route writes with the service-role key, which
-- bypasses RLS. The anon and authenticated roles therefore have no read or
-- write access to this table by design.

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  crew_size text,
  current_software text,
  wants_demo boolean not null default false,
  source text not null default 'site',
  ip_hash text
);

alter table public.waitlist_signups enable row level security;

-- No RLS policies: service-role key bypasses RLS; anon/authenticated have
-- no access by design.

create index waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at);

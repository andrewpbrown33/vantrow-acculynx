-- 0002_platform.sql
--
-- Production schema for the Eaverow roofing platform: the multi-tenant
-- business loop of lead → estimate (good/better/best) → e-sign → invoice →
-- payment, plus the job pipeline.
--
-- How to apply:
--   1. Open your Supabase project dashboard → SQL Editor.
--   2. Paste this entire file and click "Run".
--   (Or, with the Supabase CLI linked to the project: `supabase db push`.)
--
-- NOTE: The dev app does NOT use this schema — it runs a file-backed store at
-- <repoRoot>/.data/platform.json (see apps/platform/src/lib/store.ts). This
-- migration documents the production target so the SupabaseStore adapter (a
-- follow-up) can drop in against a real project.
--
-- Access model: row level security is ENABLED on every tenant table. Policy
-- STUBS below show the intended org-scoping (a member may only see rows for an
-- org they belong to). They are commented out because they depend on an auth
-- + memberships model that ships with Supabase Auth integration. Until then,
-- as with 0001_waitlist.sql, writes happen via the service-role key, which
-- bypasses RLS by design; anon/authenticated roles have no access.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role      as enum ('owner', 'admin', 'sales', 'production');
create type job_stage       as enum ('lead', 'estimating', 'proposal_sent', 'won', 'invoiced', 'paid', 'dead');
create type job_priority    as enum ('low', 'normal', 'high');
create type estimate_status as enum ('draft', 'sent', 'signed', 'declined');
create type estimate_tier   as enum ('good', 'better', 'best');
create type invoice_status  as enum ('open', 'paid', 'void');
create type payment_method  as enum ('card', 'ach', 'check', 'cash');

-- ---------------------------------------------------------------------------
-- Tables (every tenant table carries org_id for multi-tenant isolation)
-- ---------------------------------------------------------------------------
create table public.orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table public.users (
  id     uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  email  text not null,
  name   text not null,
  role   user_role not null default 'sales',
  unique (org_id, email)
);

create table public.contacts (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs (id) on delete cascade,
  name       text not null,
  email      text,
  phone      text,
  address    text,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs (id) on delete cascade,
  contact_id  uuid not null references public.contacts (id) on delete restrict,
  title       text not null,
  stage       job_stage not null default 'lead',
  lead_source text,
  priority    job_priority not null default 'normal',
  dead_reason text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Estimates store their good/better/best options (with nested line items) as
-- JSONB. A normalized estimate_options / line_items pair is a valid alternative;
-- JSONB keeps the option tree atomic and matches the file store's shape.
create table public.estimates (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.orgs (id) on delete cascade,
  job_id         uuid not null references public.jobs (id) on delete cascade,
  status         estimate_status not null default 'draft',
  options        jsonb not null default '[]'::jsonb,
  selected_tier  estimate_tier,
  tax_rate_pct   numeric(5,2) not null default 0 check (tax_rate_pct >= 0 and tax_rate_pct <= 100),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  send_token     uuid unique,
  created_at     timestamptz not null default now(),
  sent_at        timestamptz,
  signed_at      timestamptz,
  signature_id   uuid
);

create table public.signatures (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.orgs (id) on delete cascade,
  estimate_id    uuid not null references public.estimates (id) on delete cascade,
  signer_name    text not null,
  signed_tier    estimate_tier not null,
  image_data_url text not null,
  ip             text,
  signed_at      timestamptz not null default now()
);

-- Deferred FK: estimates.signature_id → signatures.id (both created above).
alter table public.estimates
  add constraint estimates_signature_id_fkey
  foreign key (signature_id) references public.signatures (id) on delete set null;

create table public.invoices (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.orgs (id) on delete cascade,
  job_id            uuid not null references public.jobs (id) on delete cascade,
  estimate_id       uuid not null references public.estimates (id) on delete restrict,
  number            text not null,
  status            invoice_status not null default 'open',
  subtotal_cents    integer not null check (subtotal_cents >= 0),
  tax_cents         integer not null default 0 check (tax_cents >= 0),
  total_cents       integer not null check (total_cents >= 0),
  amount_paid_cents integer not null default 0 check (amount_paid_cents >= 0),
  created_at        timestamptz not null default now(),
  due_date          timestamptz not null,
  unique (org_id, number)
);

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.orgs (id) on delete cascade,
  invoice_id   uuid not null references public.invoices (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  method       payment_method not null,
  status       text not null default 'succeeded' check (status in ('succeeded')),
  provider_ref text not null,
  created_at   timestamptz not null default now()
);

create table public.activities (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs (id) on delete cascade,
  job_id     uuid not null references public.jobs (id) on delete cascade,
  type       text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (org scoping + common lookups)
-- ---------------------------------------------------------------------------
create index users_org_idx           on public.users (org_id);
create index contacts_org_idx        on public.contacts (org_id);
create index jobs_org_stage_idx      on public.jobs (org_id, stage);
create index jobs_contact_idx        on public.jobs (contact_id);
create index estimates_job_idx       on public.estimates (job_id);
create index estimates_org_idx       on public.estimates (org_id);
create index estimates_send_token_idx on public.estimates (send_token);
create index signatures_estimate_idx on public.signatures (estimate_id);
create index invoices_job_idx        on public.invoices (job_id);
create index invoices_org_idx        on public.invoices (org_id);
create index payments_invoice_idx    on public.payments (invoice_id);
create index activities_job_idx      on public.activities (job_id, created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.orgs       enable row level security;
alter table public.users      enable row level security;
alter table public.contacts   enable row level security;
alter table public.jobs       enable row level security;
alter table public.estimates  enable row level security;
alter table public.signatures enable row level security;
alter table public.invoices   enable row level security;
alter table public.payments   enable row level security;
alter table public.activities enable row level security;

-- Policy STUBS — enable once Supabase Auth + a memberships table land.
--
-- The intended model: a signed-in user may access rows only for orgs they
-- belong to. Assuming a public.memberships(user_id, org_id) table:
--
--   create policy "members read their org jobs"
--     on public.jobs for select
--     using (org_id in (
--       select org_id from public.memberships where user_id = auth.uid()
--     ));
--
--   create policy "members write their org jobs"
--     on public.jobs for all
--     using (org_id in (
--       select org_id from public.memberships where user_id = auth.uid()
--     ))
--     with check (org_id in (
--       select org_id from public.memberships where user_id = auth.uid()
--     ));
--
-- Repeat the same org-scoped select/all policies for every table above.
--
-- Public e-sign exception: the /sign/<token> flow is intentionally
-- unauthenticated. It must NOT rely on auth.uid(); it should go through a
-- security-definer RPC (or the service-role key) that looks an estimate up by
-- its send_token and writes the signature — never a blanket anon policy.
--
-- Until these ship, no policies exist: the service-role key (used by the
-- server-side data adapter) bypasses RLS; anon/authenticated have no access.

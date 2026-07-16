# Eaverow Platform (MVP v1)

The operations app behind the Eaverow roofing product. It implements the core
business loop end to end, plus a job pipeline board:

**lead → estimate (good / better / best) → native e-sign → invoice → collect payment**

All brand identity (name, colors, endorsement) is rendered from
`@vantrow/brand` — there are no hardcoded brand literals in the app.

## The loop

1. **New lead** (`/leads/new`) creates a Contact + a Job in the `lead` stage.
2. **Build estimate** (`/jobs/[id]/estimate/new`) drafts 1–3 tier options
   (good/better/best) with editable line items, tax, and discount. Live totals.
3. **Send for signature** (`/estimates/[id]`) mints a public, tokenized link.
4. **Homeowner e-sign** (`/sign/[token]`, public, no auth): pick a tier, draw a
   signature on the canvas, and approve. The job advances to `won`.
5. **Create invoice** (from the job) generates `INV-100x` from the signed tier.
6. **Record payment** (`/invoices/[id]`) collects against the balance; when
   covered, the invoice is `paid` and the job reaches the `paid` stage.

The **pipeline** (`/pipeline`) is a kanban board with a column per stage
(lead, estimating, proposal_sent, won, invoiced, paid) showing each job's
contact and value.

> No partner integrations in v1: no EagleView/Hover measurements, no supplier
> ordering, and no live payment processor. Payments are recorded directly in a
> demo mode — live card/ACH via a PSP (e.g. Stripe) is a planned follow-up.

## Running it

From the repo root:

```bash
pnpm install
pnpm dev:platform         # dev server (http://localhost:3000)
# or
pnpm build:platform && pnpm --filter platform start
```

Lint / typecheck just this app:

```bash
pnpm lint:platform
pnpm typecheck:platform
```

## Two modes: dev file store vs. Supabase (prod)

The app runs in one of two modes, chosen automatically at runtime by whether the
Supabase environment variables are present (mirroring the marketing site's
env-gated `waitlist.ts` adapter). No code changes are needed to switch.

### Dev / verification (default — zero setup)

- A **file-backed store** persists the entire dataset as JSON at
  `<repoRoot>/.data/platform.json` (git-ignored) and is the single source of
  truth. On first run — if the data file is absent — it **auto-seeds** a demo
  org, **"Summit Ridge Exteriors"**, with **no login** (`src/lib/session.ts`
  returns the demo org + its owner). The middleware is a **pass-through** (no
  auth). To reset, delete `.data/platform.json` and reload — it reseeds.
- The seed spreads jobs across every stage so the whole loop is demoable
  immediately: one `lead`, one `estimating` (draft 3-tier estimate), one
  `proposal_sent` (sent, with a live sign token), one `won` (signed), and one
  `paid` (invoice + payment).

### Prod (Supabase — real auth + RLS multi-tenancy)

- When the three env vars below are set, the app uses a **`SupabaseStore`** (in
  `src/lib/store.ts`) over the user-context client, so every query is
  **org-scoped by Postgres Row Level Security**. Auth is **email + password**
  with **self-serve signup**: each signup creates its own org, and one company
  can never see another's data.
- Schema: `supabase/migrations/0002_platform.sql` (tables/enums/indexes, RLS
  enabled) then `supabase/migrations/0003_platform_auth_rls.sql` (the
  `memberships` table + real org-scoped RLS policies). Apply **0002 first, then
  0003**.
- The `/sign/[token]` route stays deliberately **public and tokenized**: it and
  the signup→org bootstrap use the service-role client (which bypasses RLS) and
  match strictly by token / user id.

### Environment variables

Set these in `apps/platform/.env.local` (see `.env.local.example`) for local
prod-mode testing, and in the platform's Vercel project for deploys. Supabase
mode turns on only when the **URL + anon key** are both present.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service-role key — server-only; bypasses RLS for the public e-sign path + signup bootstrap |

**Full setup + tenant-isolation test:** see the runbook
[`docs/runbooks/07-platform-supabase-backend.md`](../../docs/runbooks/07-platform-supabase-backend.md).

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

## Data layer: dev file store vs. Supabase (prod)

- **Dev / verification (default):** a **file-backed store** persists the entire
  dataset as JSON at `<repoRoot>/.data/platform.json` (git-ignored). It is the
  single source of truth for the app and follows the same adapter pattern as
  the marketing site's `waitlist.ts`. On first run — if the data file is absent
  — it **auto-seeds** the demo org (see below).
- **Prod (follow-up):** `supabase/migrations/0002_platform.sql` is the
  production schema — multi-tenant (`org_id` on every table), enums/checks,
  indexes, and RLS enabled with org-scoping policy stubs. A `SupabaseStore`
  implementing the same `PlatformStore` interface lands once a Supabase project
  exists (see the `TODO(supabase)` in `src/lib/store.ts`).

To reset dev data, delete `.data/platform.json` and reload — it reseeds.

## Auth / demo org

v1 runs a **single seeded demo org, "Summit Ridge Exteriors", with no login**
(`src/lib/session.ts` returns the demo org + its owner). The `/sign/[token]`
route is deliberately public and tokenized. Real multi-user auth (Supabase
Auth + memberships) is a follow-up — see the `TODO(supabase-auth)` in
`session.ts` and the RLS notes in the migration.

The seed spreads jobs across every stage so the whole loop is demoable
immediately: one `lead`, one `estimating` (draft 3-tier estimate), one
`proposal_sent` (sent, with a live sign token), one `won` (signed), and one
`paid` (invoice + payment).

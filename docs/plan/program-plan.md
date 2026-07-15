# Vantrow White-Label Platform #1 — AccuLynx-Competitor Launch Plan

## Context

Vantrow is building a family of white-label vertical-SaaS subsidiaries, each connecting to personalized client dashboards built through Vantrow (vantrow-web). Subsidiary #1 is a competitor to **AccuLynx**, the dominant roofing-contractor CRM/job-management platform. This repo (`andrewpbrown33/vantrow-acculynx`, currently empty, branch `claude/acculynx-whitelabel-plan-tc10qv`) becomes the **monorepo** for everything: brand, competitive teardown, marketing website, integration spec, and eventually the product.

**Positioning:** the modern, AI-native roofing platform that is radically simpler and more affordable than AccuLynx — with live client dashboards (via Vantrow) as the headline hook.

### Decisions locked in with Andrew

| Decision | Choice |
|---|---|
| Brand name | Propose 12–15 candidates (Vantrow plays, AccuLynx evocations, hybrids/standalone) w/ domain availability + trademark quick-screens; Andrew picks |
| Research method | **Public sources only** (clean-room): marketing site, help center, public REST API docs, YouTube, G2/Capterra/Reddit, job postings |
| vantrow-web AEO page + LinkedIn | **Deferred** — repo not attached this session; revisit later |
| Architecture | Roofing clone first; generalize to white-label core later |
| Repo scope | Monorepo — docs + brand + site + future product all here |
| Stack | Next.js + Tailwind on Vercel; Supabase; GitHub; Network Solutions (registrar) |
| Vantrow dashboard integration | Doesn't exist yet — this plan defines the contract ("Vantrow Connect": REST + webhooks) |
| Initial site depth | Marketing site + waitlist/demo-request form |
| Positioning | Modern AI-native **and** simpler/cheaper |

### Legal guardrails (baked into every phase)

- **Clean-room protocol** written *before* research starts: describe and re-implement; never copy AccuLynx code, text, images, icons, or docs. Every factual claim traceable to a dated public source.
- **Trademark:** no "AccuLynx"-confusable mark in the final name/domain. The AccuLynx-evocation naming bucket is included per request but graded **elevated-risk** (well-funded incumbent, same trademark class) — candidates built on cadence/meaning (precision + speed), not shared "Accu"/"Lynx" strings. My screens are a first pass, **not legal clearance**.
- **Trade dress:** AccuLynx UI screenshots live in *internal research docs only* (repo stays private); our UI takes functional inspiration, never pixel copies.
- **Comparative advertising:** `/vs-acculynx` claims must be factual, dated, sourced, nominative-use only. "Cheaper" is weak-evidence (their pricing is quote-based) — hedge with sourced customer reports or lead with "simpler."
- **No fabricated integration promises:** EagleView/Hover/ABC Supply/Beacon/SRS require partner agreements — copy says "designed to integrate with," never implies live partnerships.

---

## Repo layout (additive — no restructuring when the product app arrives)

```
/
├── README.md
├── docs/
│   ├── plan/            program-plan.md, decision-log.md
│   ├── legal/           clean-room-protocol.md, comparative-advertising-checklist.md, trademark-screens.md
│   ├── brand/           naming-decision-memo.md, brand-guidelines.md (post-Gate-1)
│   ├── research/acculynx/   teardown docs 00–12 (below)
│   ├── specs/vantrow-connect/   overview.md, openapi.yaml, events.md, auth.md, fixtures/
│   └── runbooks/        01–06 user runbooks (below)
├── apps/site/           Next.js marketing site (apps/platform/ reserved for Phase 5)
├── packages/brand/      brand.config.ts — name/tagline/domain/colors/logo; the one-file brand swap
├── supabase/migrations/0001_waitlist.sql
├── .github/workflows/ci.yml   (lint + typecheck + build)
└── pnpm-workspace.yaml
```

Brand tokens live in `packages/brand` (exported as CSS variables consumed by Tailwind) so the site is brand-agnostic until Gate 1, the chosen name is a one-package diff — and this package is the seed of the white-label mechanism (subsidiary #2 = new brand config).

---

## Phases

```
Phase 0: Foundations (scaffold, legal protocol, plan docs)        [serial, fast]
   ├── Phase 1A: AccuLynx teardown (parallel research fan-out)  \
   ├── Phase 1B: Naming sprint (candidates + screens)            |  parallel
   ├── Phase 1C: Site scaffold (brand-agnostic)                  |
   └── Phase 1D: Vantrow Connect contract v0                    /
 GATE 1: Andrew picks name (register domain same day — availability decays)
Phase 2: Brand application + real marketing copy + /vs-acculynx + Supabase wiring
Phase 3: Runbooks + CI + launch checklist + draft PR
 GATE 2: Andrew executes runbooks (domain, Vercel, Supabase, legal pass) → launch
Phase 4 (deferred): vantrow-web AEO page port, LinkedIn page + insights
Phase 5 (deferred): Product platform build driven by teardown doc 11; white-label core extraction
```

### Phase 0 — Foundations
Scaffold monorepo skeleton per layout above; write `clean-room-protocol.md` **before any research doc exists**; write program plan + decision log; first commit.

### Phase 1A — AccuLynx clean-room teardown (`docs/research/acculynx/`)
Run as a parallel research workflow (one agent per doc/module), all appending to the sources log. Page budgets enforced; each doc has an "unknowns" section — recording what public sources can't reveal beats chasing it.

| Doc | Contents |
|---|---|
| `00-sources-log.md` | Every URL, access date, what was extracted (the clean-room provenance record) |
| `01-product-overview.md` | Positioning, ICP, module map, roles model, terminology glossary |
| `02-feature-inventory/` | One file per module: crm, sales-estimating, production, measurements, supplier-ordering, insurance-supplements, invoicing-payments, reporting, homeowner-portal, mobile, automations-comms, admin-permissions. Feature tables: name, description, roles, workflow steps, unknowns |
| `03-ui-walkthrough.md` | Screen-by-screen prose descriptions + navigation map; screenshot references internal-only |
| `04-inferred-data-model.md` | Entity tables (fields, types, relationships), job-status state machine, permission model |
| `05-public-api-teardown.md` | AccuLynx public REST API: resources, fields, webhooks, auth, rate limits — highest-fidelity data-model source, cross-checked vs 04 |
| `06-assumed-architecture.md` | Inferred stack (job postings, network-visible tech, press), multi-tenancy assumptions |
| `07-pricing-packaging.md` | Tiers/seats/fees from reviews & sales pages; every claim dated (pricing is quote-based) |
| `08-review-mining.md` | G2/Capterra/Reddit pain points quantified (frequency × severity), verbatim quotes + links |
| `09-integration-landscape.md` | EagleView/Hover, ABC/Beacon/SRS, QuickBooks, payments, CompanyCam — with a **partnership-prerequisites column** (open API vs signed agreement) |
| `10-market-landscape.md` | JobNimbus, Roofr, Leap, JobProgress, etc. — feature/pricing deltas; feeds naming-conflict checks |
| `11-copy-priority-matrix.md` | **Keystone doc**: every feature scored value × build-lift × gated-dependency → MVP cutline. Phase 5 executes from this |
| `12-differentiation-thesis.md` | Honest audit of AccuLynx's existing AI features; where AI-native architecture + live dashboards genuinely win; evidence quality of simpler/cheaper claims |

### Phase 1B — Naming sprint (`docs/brand/naming-decision-memo.md`)
12–15 candidates in three buckets (Vantrow plays / AccuLynx evocations / hybrids-standalone), each with: rationale, .com/.io availability evidence with lookup date, USPTO TESS + Google quick-screen note, risk grade, and a check against doc 10's competitor names + adjacent trades (siding/gutters/solar headroom). Recommended top 3. **Brand-architecture recommendation: endorsed brand** — standalone name + "a Vantrow company" endorsement, own domain (protects the parent, keeps the dashboard story).

### Phase 1C — Site scaffold (`apps/site/`)
Brand-agnostic Next.js + Tailwind build (placeholder tokens from `packages/brand`). Pages: `/` (hero: AI-native + live-dashboard hook), `/product` (module-by-module, mirrors teardown structure), `/vs-acculynx`, `/pricing` ("founding customer" framing, no fabricated tiers), `/about` (Vantrow story), `/early-access` (single merged waitlist + demo-request form: name, email, company, crew size, current software, demo checkbox), `/privacy`, `/terms`.

**Waitlist adapter pattern:** API route posts to a `WaitlistStore` interface — SupabaseAdapter when env vars are set; FileAdapter (gitignored JSONL) in dev so the form is testable today; 503 + mailto fallback if misconfigured in prod (never silently drop signups). Honeypot + basic per-IP rate limit; transactional email deferred.

### Phase 1D — Vantrow Connect contract (`docs/specs/vantrow-connect/`)
The cross-subsidiary asset — carries the Vantrow name regardless of subsidiary branding. Core design: **small vertical-agnostic core model** (`tenant`, `contact`, `project`, `invoice`, `metric`) + namespaced domain extensions (`roofing.*`); dashboards code against the core.
- `openapi.yaml` — URL-versioned `/v1`, read-only in v1: `GET /v1/{metrics,projects,invoices,contacts}` + health. Lints with `redocly`.
- `events.md` — webhook catalog, standard envelope (`id, type, occurred_at, tenant_id, version, data`), JSON Schema per event (`contact.created`, `project.created`, `project.status_changed`, `invoice.created`, `invoice.paid`, `roofing.claim.status_changed`), at-least-once + HMAC-SHA256 signatures + retry/idempotency semantics.
- `auth.md` — per-tenant scoped API keys, key rotation, OAuth as documented upgrade path.
- `fixtures/` — golden JSON payloads for every endpoint/event: **the executable test surface both future implementations validate against.**
Starts from a stub entity list; reconciled once teardown docs 04/05 land (one revision pass, not a blocker).

### Gate 1 — Name selection (in-session via AskUserQuestion when memo is ready)
Andrew picks name + confirms brand architecture → edit `packages/brand/brand.config.ts`, log in decision-log. Runbook 01 says: re-verify and register the domain the same day.

### Phase 2 — Brand application + copy
Fill brand tokens; write real marketing copy driven by doc 08 pain points; build `/vs-acculynx` last (depends on docs 07/12 + comparative-ad checklist); commit Supabase migration; wire SupabaseAdapter behind env vars. Privacy page ships before the form is considered launch-ready.

### Phase 3 — Runbooks, CI, PR
GitHub Actions CI (lint/typecheck/build); write runbooks; push branch; open **draft PR** with launch checklist; subscribe to PR activity.

**Runbooks** (`docs/runbooks/`, each with numbered steps + "you're done when" verification):
1. `01-domain-network-solutions.md` — re-verify availability, register .com, privacy + auto-renew, Vercel DNS records
2. `02-vercel-setup.md` — import repo, root dir `apps/site`, env-var table, custom domain
3. `03-supabase-setup.md` — create project, paste `0001_waitlist.sql` in SQL editor, RLS on (service-role inserts only), copy keys to Vercel, how to view/export signups
4. `04-launch-checklist.md` — ordered Gate 2 checklist ending in end-to-end form test on production
5. `05-legal-counsel-checklist.md` — real trademark clearance (screens ≠ clearance, in bold), comparative-ad review, ToS/privacy review
6. `06-linkedin.md` — deferred stub (page assets + insights content plan land in Phase 4)

### Phases 4–5 — Deferred (documented as roadmap stubs only)
vantrow-web AEO page port + LinkedIn (needs repo access / Andrew's account); product platform build executing doc 11's MVP cutline in `apps/platform/`; white-label core extraction for subsidiary #2.

---

## Verification

| Phase | Check |
|---|---|
| 0 | `pnpm install` clean; legal protocol committed before any research doc |
| 1A | Spot-check 10 random claims resolve to sources-log entries; doc 11 covers 100% of doc 02 features |
| 1B | Every candidate: dated domain evidence + TESS screen + risk grade; ≥4 per bucket |
| 1C | `pnpm lint && pnpm typecheck && pnpm build` pass; local `curl -X POST /api/waitlist` writes to `.data/waitlist.jsonl`; all routes 200; grep confirms zero brand-name strings in `apps/site` (only `@vantrow/brand` imports) |
| 1D | `redocly lint` passes; every event has a fixture; fixtures validate against schemas |
| 2 | Builds still green; brand swap is a single-package diff; every `/vs-acculynx` claim footnoted; migration SQL applies/lints cleanly |
| 3 | CI green on draft PR; fresh-agent readthrough of runbooks ("could a non-developer follow this?") |
| Gate 2 (Andrew) | Live production form submission appears in Supabase; DNS + Lighthouse pass |

## Key risks (full analysis in program-plan.md)

1. AccuLynx-evocation names are a trademark trap — bucket included but expect the winner elsewhere.
2. Gated integrations (EagleView, suppliers) are BD dependencies measured in months — matrix's third axis prevents the MVP silently assuming them.
3. "Cheaper" claim has weak public evidence — hedge or lead with "simpler."
4. AccuLynx already ships AI features — differentiate on architecture, not AI's mere presence.
5. Repo must stay private while it contains AccuLynx screenshots.
6. Teardown scope creep — page budgets + "research that doesn't change a doc-11 score is done."

## Execution in this session (post-approval)

0. Scaffold repo (Phase 0), commit.
1. Launch parallel workflows: teardown fan-out (1A), naming research (1B), site scaffold (1C), Vantrow Connect spec (1D).
2. Present naming memo via AskUserQuestion → Gate 1 → apply brand.
3. Phase 2 copy + wiring, Phase 3 runbooks + CI.
4. Push to `claude/acculynx-whitelabel-plan-tc10qv`, open draft PR, subscribe to PR activity, hand Andrew the Gate 2 checklist.

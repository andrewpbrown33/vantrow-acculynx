# 11 — Copy-Priority Matrix (KEYSTONE)

**Date:** 2026-07-16 · **Status:** Complete — this is the document the product build executes from.
**Inputs:** all twelve `02-feature-inventory/*.md` module docs, `07-pricing-packaging.md`,
`08-review-mining.md`, `09-integration-landscape.md`, `12-differentiation-thesis.md`,
`04-inferred-data-model.md`. Every feature row in every module inventory appears below —
**313 rows, none dropped**. Feature evidence and source refs live in the module docs; this doc
adds only our scoring (which is our own judgment, i.e. INFERENCE throughout the value/lift
columns).

---

## 1. Scoring model

### 1.1 Value (1–5) — revenue/retention impact for a roofing contractor

Anchored to review mining (`08-review-mining.md`): pain points P1–P13, praise themes L1–L7,
feature requests #1–#12, and churn triggers.

| Score | Meaning | Anchors |
|---|---|---|
| **5** | Table stakes for the core loop, or a documented churn/switch driver. Absence blocks sale or drives departure | L1 all-in-one job file, L4 measurement→estimate→order flow, P1 mobile, P2 bundling, P5 estimating flexibility |
| **4** | Strong daily-use value or repeatedly requested; materially improves close rate, cash collection, or retention | P4 search, P7 email reliability, P9 open API, requests #3–#9 |
| **3** | Valued by a meaningful segment (insurance back office, multi-location, enterprise) or a solid secondary workflow | Elite-tier trackers, multi-location, commissions |
| **2** | Nice-to-have, niche, or low-evidence demand | 3D viewers, per-provider variants, leaderboard tweaks |
| **1** | Marginal, superseded, or not a build item at all (packaging notes, vendor marketing claims) | "Plan gating" rows, vendor stats |

### 1.2 Build-lift (1–5) — engineering effort on our Next.js + Supabase stack

Assumes Supabase Postgres + RLS + Auth + Storage + Realtime + Edge Functions, Next.js app
router, one responsive web app serving desktop and mobile (PWA), commodity providers for
email/SMS/payments. All estimates are INFERENCE.

| Score | Effort | Typical shape |
|---|---|---|
| **1** | Days | Schema + CRUD + simple UI; a lookup table; a filter |
| **2** | ~1 week | A screen with real logic; a state field with rules; a share-link flow |
| **3** | 2–4 weeks | A workflow engine slice; an editor; an open-API integration; a background pipeline |
| **4** | 1–2 months | A complex engine (scheduler, report builder, doc editor); a partner-API integration incl. onboarding plumbing |
| **5** | 3+ months | Native mobile apps, offline-first sync, payfac-grade payments, BI infrastructure |

### 1.3 Gated-dependency — from `09-integration-landscape.md`

| Gate | Mapping from doc 09 | Meaning for sequencing |
|---|---|---|
| **NONE** | No third party involved | Pure software on our stack; schedule freely |
| **OPEN-API** | Doc-09 **OPEN** programs, plus commodity self-serve infrastructure (transactional email, SMS/A2P, PSPs like Stripe, maps, push, translation) | Build whenever; zero BD calendar risk |
| **PARTNER-REQUIRED** | Doc-09 **SEMI** (application/approval track) or **GATED** (negotiated agreement/data license) or 1P-equivalents that need a commercial deal (embedded lending) | Cannot ship on our schedule alone; lives in §4 gated roadmap. Per protocol §8, described publicly only as "designed to integrate with"/"planned" until signed |

**Best-available-path rule.** Where a capability is reachable through multiple providers, the
gate column reflects the *best open path* to a credible version of the feature (e.g. aerial
measurement import = OPEN-API via Hover + universal XML upload); partner-only expansions of the
same capability get their own rows and appear in §4.

**Cross-module duplicates.** The module inventories intentionally overlap (e.g. Automation
Manager appears in CRM, Production, and Automations & Comms). Every occurrence keeps its row
for auditability, scored identically, with the rationale pointing at the canonical module.

**Prioritization rule.** No single composite number: sort by value desc, then lift asc.
PARTNER-REQUIRED is a hard veto for MVP v1 regardless of value. The cutline in §3 applies
value ≥ 4, lift ≤ 3, gate ≠ PARTNER-REQUIRED, with named exceptions justified inline.

---

## 2. The matrix (313 rows)

### 2.1 CRM — [`02-feature-inventory/crm.md`](02-feature-inventory/crm.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Manual lead creation (web) | [crm](02-feature-inventory/crm.md) | 5 | 1 | NONE | Front door of the funnel; form + duplicate detection is trivial on Postgres |
| Mobile lead creation (Field App) | [crm](02-feature-inventory/crm.md) | 5 | 2 | NONE | Field-first trade (P1); same responsive form, mobile-tuned |
| Lead-service imports | [crm](02-feature-inventory/crm.md) | 3 | 3 | OPEN-API | SalesRabbit/Roofle/Zapier/HubSpot open; Angi/Spotio application-track → §4 |
| API lead intake | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | POST-a-lead edge function; anchors our open-API positioning (P9) |
| Lead source taxonomy | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Two-level lookup; feeds marketing-ROI reporting |
| Lead Intelligence (Lead Rank) | [crm](02-feature-inventory/crm.md) | 2 | 3 | OPEN-API | Third-party propensity vendor bolt-on; doc 12 shows score-AI is not the wedge — defer |
| Priority flag | [crm](02-feature-inventory/crm.md) | 3 | 1 | NONE | Enum column + filter |
| Unassigned-lead queue | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Filter on assigned flag; core triage surface |
| Quick Assign | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Dropdown + notification |
| Smart Assign | [crm](02-feature-inventory/crm.md) | 3 | 3 | NONE | Needs computed rep stats (close rate, distance, trailing sales) |
| Map Assign | [crm](02-feature-inventory/crm.md) | 3 | 2 | OPEN-API | Map view over geocoded jobs (Google Maps, self-serve) |
| Assignment notification | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Realtime + push notify on assignment |
| Job roles (rep slots) | [crm](02-feature-inventory/crm.md) | 3 | 1 | NONE | Assignment slots; we allow multi-user ownership (documented complaint) |
| Contact records | [crm](02-feature-inventory/crm.md) | 5 | 2 | NONE | Core entity; typed phones/emails per doc 04 schema |
| Contact types | [crm](02-feature-inventory/crm.md) | 2 | 1 | NONE | Lookup with default flag |
| Multi-contact jobs | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Join table with primary flag; drives invoicing recipient |
| Custom fields | [crm](02-feature-inventory/crm.md) | 4 | 3 | NONE | Definition/value model + form rendering + change webhooks |
| Milestone pipeline | [crm](02-feature-inventory/crm.md) | 5 | 2 | NONE | Fixed spine state machine (doc 04 §3); the backbone of everything |
| Custom workflow statuses & checklists | [crm](02-feature-inventory/crm.md) | 4 | 3 | NONE | Their Elite-tier feature; we bundle it — statuses per trade/type + attributed checklists |
| Dead-lead handling | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Lost reason + revert-to-unassigned + resurrect permission |
| Jobs/Leads list filtering | [crm](02-feature-inventory/crm.md) | 4 | 2 | NONE | Postgres filters + **fuzzy** search — direct attack on P4 |
| Lead history / audit trail | [crm](02-feature-inventory/crm.md) | 4 | 2 | NONE | Append-only audit events (doc 04 AuditEvent) |
| Job file activity hub | [crm](02-feature-inventory/crm.md) | 5 | 3 | NONE | L1 "everything in one place" is the #1 praise/retention engine |
| Communications inbox | [crm](02-feature-inventory/crm.md) | 4 | 3 | NONE | Cross-job threads, @mentions, tags; P3 message-board regression is our trust play |
| Task creation from messages | [crm](02-feature-inventory/crm.md) | 3 | 1 | NONE | Message → task with link back |
| Email from job file | [crm](02-feature-inventory/crm.md) | 4 | 2 | OPEN-API | Templated send via self-serve provider **with delivery/read receipts** (P7, request #8) |
| Two-way SMS | [crm](02-feature-inventory/crm.md) | 5 | 3 | OPEN-API | Commodity SMS provider + A2P 10DLC; bundled, not an add-on (P2, request #5) |
| Contact interaction logs | [crm](02-feature-inventory/crm.md) | 3 | 1 | NONE | Typed call/SMS/email touch log |
| Appointments & calendars | [crm](02-feature-inventory/crm.md) | 4 | 3 | OPEN-API | Calendar CRUD + Google/Outlook/Apple sync (all open); include calendar search (P4/P3) |
| Automation Manager | [crm](02-feature-inventory/crm.md) | 5 | 3 | NONE | Canonical row — trigger→action engine; add cascading tasks (request #4) |
| Follow-up surfacing | [crm](02-feature-inventory/crm.md) | 4 | 1 | NONE | Last-touched timestamp + stale filters |
| Lead/sales reporting | [crm](02-feature-inventory/crm.md) | 4 | 3 | NONE | Source ROI, closing % by rep — owner's buying criteria |
| Outbound webhooks / Zapier | [crm](02-feature-inventory/crm.md) | 4 | 3 | OPEN-API | Canonical row — subscription webhooks + self-serve Zapier app (P9) |

### 2.2 Sales & Estimating — [`02-feature-inventory/sales-estimating.md`](02-feature-inventory/sales-estimating.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Estimate builder | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | The daily core workflow; sectioned editor over our price book |
| Estimate templates | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | Reuse is the speed story; we design measurement→quantity formula binding ourselves (their internals unknown) |
| Aerial measurement import | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | OPEN-API | L4 moat leg; open path = Hover + universal XML; native provider ordering → §4 |
| Supplier catalogs & account pricing | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 4 | PARTNER-REQUIRED | The switching-cost moat; ABC/SRS application-track, QXO negotiated (§4) |
| Line-item model | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 2 | NONE | Dual units, per-line waste, measured/estimated/ordered quantities — schema work (doc 04) |
| Waste factors | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 1 | NONE | Per-line % grossing up quantities |
| Margin, overhead, tax, discount controls | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 2 | NONE | Rollup math + margin slider + lump-sum display |
| Multiple estimates per job; primary flag | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 1 | NONE | isPrimary drives the money spine |
| Good/Better/Best proposals | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | Top-5 request (P5); we do selectable tiers natively, not doc-field workarounds |
| SmartDocs templates (paid add-on) | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 4 | NONE | Merge-field doc template editor is a real build; bundled, attacks P2 |
| Document types | [sales-estimating](02-feature-inventory/sales-estimating.md) | 3 | 2 | NONE | Proposal/contract/change-order/lien-waiver variants ride the template engine |
| Document packets | [sales-estimating](02-feature-inventory/sales-estimating.md) | 3 | 3 | NONE | Multi-piece assembly + preview share link |
| E-signature | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | Native ESIGN/UETA-compliant capture (name/email/time/IP audit evidenced); bundling kills the "pay extra for docusigns" complaint (P2) |
| Mobile estimating (Field App) | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | P1 wedge + request #1; same responsive estimate editor, mobile-tuned |
| Estimate → material order | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 2 | NONE | Internal conversion is ours; electronic supplier submission gated separately (§4) |
| Estimate → financial worksheet | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | Money-spine linkage praised in reviews (L7); primary estimate seeds approved value |
| In-estimate financing (AccuFi) | [sales-estimating](02-feature-inventory/sales-estimating.md) | 3 | 4 | PARTNER-REQUIRED | Embedded-lending marketplace needs commercial + compliance onboarding (§4) |
| Payments in the sales flow (AccuPay) | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | OPEN-API | Payment requests from job/estimate via PSP-hosted flows (Stripe et al., self-serve) |
| Customer portal (add-on) | [sales-estimating](02-feature-inventory/sales-estimating.md) | 5 | 3 | NONE | Our headline differentiator, bundled on every plan (doc 12 §c) |
| Role-based permissions | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 3 | NONE | Canonical in admin module; RLS + policy sets |
| Public REST API for estimates | [sales-estimating](02-feature-inventory/sales-estimating.md) | 4 | 2 | NONE | We exceed their read-only surface with writes (P9) |

### 2.3 Production — [`02-feature-inventory/production.md`](02-feature-inventory/production.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Digital job file | [production](02-feature-inventory/production.md) | 5 | 3 | NONE | Same L1 retention engine; single record for all artifacts |
| Job classification & metadata | [production](02-feature-inventory/production.md) | 4 | 1 | NONE | Category/work type/trades/priority/geo columns |
| Milestone pipeline | [production](02-feature-inventory/production.md) | 5 | 2 | NONE | Duplicate of CRM row — one state machine |
| Custom workflow statuses (Workflow Manager) | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | Duplicate of CRM row; bundled instead of Elite-gated |
| Job checklists & Progress view | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Checklist items + who/when stamps + progress rollup |
| Tasks | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Assignee/priority/due + notify; add cascading (request #4) |
| Job messages & activity feed | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Duplicate of CRM activity-hub/threads rows |
| Production Calendar / Scheduler | [production](02-feature-inventory/production.md) | 5 | 4 | NONE | Drag-drop, bulk reschedule, conflict alerts — heavy UI; their redesign is disliked (P3), searchable calendar is our edge |
| "To Be Scheduled" drawer | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Unscheduled-orders queue beside the calendar |
| Order Manager | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | Ops console over orders; canonical row (also in supplier-ordering) |
| Labor Manager | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Subs/crews registry, trades, color codes, compliance docs |
| Labor orders → labor tickets (work orders) | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | Work-order object + crew-facing projection; we collapse to one entity (doc 04) |
| Labor checklists | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Reusable templates + live completion visibility |
| Crew App (paid add-on) | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | Canonical: crew-role PWA (EN/ES), bundled not add-on; native app later |
| Field App (staff mobile, free) | [production](02-feature-inventory/production.md) | 5 | 3 | NONE | Canonical: mobile-first responsive PWA = P1 attack; no separate codebase |
| Material delivery coordination | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Delivery date → calendar event kind; supplier-fed dates come with §4 |
| Automation Manager | [production](02-feature-inventory/production.md) | 5 | 3 | NONE | Duplicate of CRM canonical row |
| Dashboard quick-view trackers | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | Duplicate of reporting trackers row; live filtered views per module |
| Permit tracking (Elite) | [production](02-feature-inventory/production.md) | 3 | 2 | NONE | Status pipeline + tracker page; canonical in insurance module |
| Supplement tracking (Elite) | [production](02-feature-inventory/production.md) | 4 | 2 | NONE | Duplicate — canonical in insurance module |
| Mortgage check tracking (Elite) | [production](02-feature-inventory/production.md) | 3 | 2 | NONE | Duplicate — canonical in insurance module |
| Job costing during production | [production](02-feature-inventory/production.md) | 5 | 3 | NONE | Expenses vs forecast per job/trade; their weakness (manual, laggy) is our opening |
| Photo & video documentation | [production](02-feature-inventory/production.md) | 5 | 3 | NONE | Canonical media pipeline: unlimited uploads, annotation, albums, tags, share links (L5 praise) |
| Public API & webhooks | [production](02-feature-inventory/production.md) | 4 | 3 | NONE | We expose production objects (orders, crews, checklists) their API hides — P9 opportunity |
| Plan gating | [production](02-feature-inventory/production.md) | 1 | 1 | NONE | Packaging decision, not a build item; our answer is bundling (07 §6) |

### 2.4 Measurements — [`02-feature-inventory/measurements.md`](02-feature-inventory/measurements.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Measurements tab (per-job hub) | [measurements](02-feature-inventory/measurements.md) | 4 | 2 | NONE | Single intake point: order / upload / manual |
| EagleView ordering (native) | [measurements](02-feature-inventory/measurements.md) | 4 | 4 | PARTNER-REQUIRED | Sandbox open, production via partner track (2–4 mo, §4); most-cited provider in reviews |
| EagleView Roof + Wall report | [measurements](02-feature-inventory/measurements.md) | 2 | 2 | PARTNER-REQUIRED | Variant riding the same EagleView agreement |
| GAF QuickMeasure ordering (native) | [measurements](02-feature-inventory/measurements.md) | 3 | 4 | PARTNER-REQUIRED | No public dev program; negotiated GAF partnership (3–9 mo, §4) |
| Geospan ordering (native) | [measurements](02-feature-inventory/measurements.md) | 2 | 4 | PARTNER-REQUIRED | Partner-arranged only (3–6 mo, §4) |
| Interactive 3D roof model viewer | [measurements](02-feature-inventory/measurements.md) | 2 | 1 | NONE | Store + share provider 3D-model links; viewer is the provider's |
| Hover connection | [measurements](02-feature-inventory/measurements.md) | 4 | 3 | OPEN-API | Self-serve OAuth API (2–6 wks); our day-one measurement + photos + 3D provider |
| RoofSnap connection | [measurements](02-feature-inventory/measurements.md) | 2 | 3 | PARTNER-REQUIRED | Per-project scoped API access (1–3 mo, §4) |
| RoofScope connection | [measurements](02-feature-inventory/measurements.md) | 2 | 3 | PARTNER-REQUIRED | No public dev program (3–6 mo, §4) |
| Universal XML import | [measurements](02-feature-inventory/measurements.md) | 4 | 2 | NONE | Provider-agnostic ingestion kills day-one partner dependency |
| Manual measurement entry | [measurements](02-feature-inventory/measurements.md) | 4 | 1 | NONE | Form over the measurement-set schema (doc 04) |
| Order status tracking + notifications | [measurements](02-feature-inventory/measurements.md) | 3 | 2 | NONE | Requested/Ordered/Completed tracker + ready alerts |
| Measurement spend reconciliation | [measurements](02-feature-inventory/measurements.md) | 2 | 2 | NONE | Order-ID→job report for budget tracking |
| Report data payload | [measurements](02-feature-inventory/measurements.md) | 3 | 2 | NONE | Store/render imagery, diagrams, lengths/areas/pitch from reports |
| Measurements → estimate auto-population | [measurements](02-feature-inventory/measurements.md) | 5 | 3 | NONE | The L4 moat leg; we design the field→line-quantity formula mapping (their internals unpublished) |
| Waste factor engine | [measurements](02-feature-inventory/measurements.md) | 4 | 2 | NONE | Default + per-line waste grossing measured quantities |
| Measurements → material orders | [measurements](02-feature-inventory/measurements.md) | 4 | 2 | NONE | Quantities trace report→estimate→order; internal only until §4 |
| Mobile (Field App) measurement ops | [measurements](02-feature-inventory/measurements.md) | 3 | 1 | NONE | Responsive reuse of the hub |
| Public API: manual measurement ingest | [measurements](02-feature-inventory/measurements.md) | 3 | 2 | NONE | POST measurement sets; we add the GET they lack (P9) |
| Public API: external-provider order ingest | [measurements](02-feature-inventory/measurements.md) | 3 | 2 | NONE | Multipart register-an-order endpoint; enables any provider to push to us |

### 2.5 Supplier Ordering — [`02-feature-inventory/supplier-ordering.md`](02-feature-inventory/supplier-ordering.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Three distributor integrations | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 5 | 5 | PARTNER-REQUIRED | The switching-cost moat itself; ABC+SRS reachable semi-open, QXO negotiated (§4) |
| Integration activation & branch setup | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 2 | PARTNER-REQUIRED | Admin credential/branch config; only meaningful once a supplier is signed |
| Account price-list sync | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 5 | 4 | PARTNER-REQUIRED | Contractor-specific branch pricing exists only via supplier programs; no open substitute |
| Live catalog & stock availability | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 4 | PARTNER-REQUIRED | Branch stock while estimating; rides the same supplier APIs |
| Purchase-history recommendations (SRS) | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 2 | 3 | PARTNER-REQUIRED | Nice-to-have on top of SRS data |
| Estimate templates + custom materials library | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 5 | 3 | NONE | Contractor-defined price book is fully ours — the day-one substitute for live catalogs |
| Estimate → material order conversion | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 2 | NONE | Same-line-items conversion, no re-keying (L4) |
| Order from order template | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 2 | NONE | Saved load-outs |
| Electronic order submission w/ attachments | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 3 | PARTNER-REQUIRED | Direct-to-branch needs supplier APIs; v1 fallback = branded PDF/email submission (NONE) |
| Order status tracking in the job file | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 2 | NONE | Our own order state machine; supplier callbacks enrich it post-§4 |
| Delivery dates & milestone notifications | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 2 | NONE | Delivery date → calendar + change alerts; supplier-fed milestones later |
| Proof-of-delivery photos | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 1 | NONE | Manual attach day one; auto-feed arrives with supplier APIs |
| Order Manager | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 3 | NONE | Canonical row (also listed under production) |
| Material ↔ labor order linking | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 1 | NONE | Cross-link FK both ways |
| Order automations | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 4 | 2 | NONE | Order-event triggers ride the automation engine |
| Mobile surfaces | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 2 | NONE | Responsive estimate/order/verify flows |
| Materials Report (ReportsPlus) | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 2 | NONE | Spend by type/color/supplier for negotiation leverage |
| Supplier invoice visibility & accounting sync | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 3 | 3 | PARTNER-REQUIRED | Invoice data feed is supplier-side; QBO expense sync itself is open |
| Compliance warnings | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 1 | 2 | PARTNER-REQUIRED | Prop-65 flags ride ABC catalog data |
| Measurement-to-order pipeline | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 5 | 3 | NONE | Report→estimate→order traceability is internal and is the L4 story |
| Plan gating | [supplier-ordering](02-feature-inventory/supplier-ordering.md) | 1 | 1 | NONE | Packaging note — we bundle ordering at all tiers |

### 2.6 Insurance & Supplements — [`02-feature-inventory/insurance-supplements.md`](02-feature-inventory/insurance-supplements.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Insurance vs retail job classification | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 1 | NONE | Work-type config; drives insurance-mode UI |
| Job insurance record | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 5 | 2 | NONE | Core restoration record; we add ACV/RCV/deductible structure they publicly lack |
| Insurance company directory | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 1 | NONE | Carrier lookup with active flag |
| Adjuster record per job | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 1 | NONE | Contact + met/approved outcomes; we allow multiple adjusters (their gap) |
| Adjuster/inspection scheduling | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Rides calendar; dedicated adjuster-meeting event type (their gap) |
| Supplement records | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 5 | 3 | NONE | Restoration segment's core object; AccuLynx gates this at Elite — we bundle |
| Supplement statuses | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 1 | NONE | Configurable status list |
| Supplement line items | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Four-stage money per line (original/requested/approved/applied) |
| Supplementer assignment | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 1 | NONE | Ownership + assignment audit |
| Supplement notations | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Carrier-negotiation call log — the daily supplementer tool |
| Carrier/adjuster communication templates | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Email templates + evidence attach |
| Supplement → financial worksheet | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Applied amounts post as typed amendments |
| Company-wide supplements tracker | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Cross-job tracker view |
| Mortgage check tracker | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Canonical row; niche but loved by restoration offices |
| Permit tracker | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Canonical row; six-status pipeline + board |
| Claim evidence capture | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Rides the media pipeline; adjuster albums + annotated photos |
| Insurance-flavored documents | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Carrier-specific templates/checklists ride doc engine |
| Homeowner claim visibility | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 4 | 2 | NONE | Rides portal; claim-progress view is a doc-12 dashboard surface |
| Storm lead intake | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 2 | 4 | PARTNER-REQUIRED | Hail/wind data (HailWatch/CoreLogic) is licensed (§4); canvassing-lead import is open |
| Shared milestone pipeline | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 1 | NONE | Duplicate of milestone-pipeline row |
| Xactimate relationship | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Their gap is manual re-keying; v1 = scope-PDF upload + supplement mirroring, doc-12 AI drafting later |
| Public API for insurance data | [insurance-supplements](02-feature-inventory/insurance-supplements.md) | 3 | 2 | NONE | Claim + supplement endpoints; we add permits/mortgage checks they omit |

### 2.7 Invoicing & Payments — [`02-feature-inventory/invoicing-payments.md`](02-feature-inventory/invoicing-payments.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Financial worksheet as invoicing basis | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 5 | 3 | NONE | Single source of truth for job value; approval-gated (doc 04 money spine) |
| Four invoice-creation modes | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 3 | NONE | Full / partial-section / installment-sequence / manual |
| Invoice metadata & terms | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 1 | NONE | Name/date/terms → due date |
| Typed invoice sections & hierarchical line items | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | NONE | Section types mirror worksheet amendments; nesting via parent refs |
| Customer-facing preview & customization | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 2 | NONE | Edit descriptions/values from preview |
| Invoice delivery with embedded pay link | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 5 | 2 | OPEN-API | Email + PSP payment link; recipients-bound links |
| Invoice lifecycle & A/R aging | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | NONE | Draft/Unpaid/Paid/Void + aging clock from send |
| 2024 invoicing refresh | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 2 | NONE | Remaining-to-invoice summary box; negative values; amendment edits |
| AccuPay payment processing (add-on) | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 5 | 4 | OPEN-API | Card/ACH via Stripe Connect-style self-serve PSP; hosted onboarding trims v1 lift |
| Payment request channels | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | OPEN-API | Email link / keyed / in-person / portal — all PSP-hosted surfaces |
| Auto-posting & payment notifications | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | OPEN-API | PSP webhooks write payments to the job + notify |
| Settlement timing | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 2 | 1 | OPEN-API | PSP-determined; ours is disclosure copy, not a build |
| Fee pass-through (surcharge / convenience fee) | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 3 | OPEN-API | PSP surcharging features + state-rule compliance config |
| Three-category job payment ledger | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | NONE | Received / paid-out / expenses with signed amounts + provenance |
| Job payments overview | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 1 | NONE | Sales amount, balance, A/R age, % collected rollup |
| Company-wide payment tracker & disputes | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 3 | OPEN-API | PSP dispute APIs; console can trail v1 |
| A/R tracker | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | NONE | Aged receivables with last-contact context for collections calls |
| AccuFi homeowner financing (add-on) | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 4 | PARTNER-REQUIRED | Embedded-lending marketplace agreement (§4, 2–6 mo) |
| Financing status tracking & rep alerts | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 2 | 2 | PARTNER-REQUIRED | Rides the financing partner's status callbacks |
| Earlier GreenSky financing integration | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 1 | 4 | PARTNER-REQUIRED | Superseded by marketplace model — do not copy |
| QuickBooks two-way sync | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 5 | 4 | OPEN-API | QBO API self-serve; bookkeeper adoption-blocker; their sync-back is distrusted — reliability is our proof point |
| Accounting mapping & multi-location | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 3 | OPEN-API | Item→account mapping + class splits on the QBO rail |
| Sage Intacct two-way sync | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 2 | 4 | PARTNER-REQUIRED | Paid dev program (~$2.5k/yr + per-call, §4); enterprise-only demand |
| Per-job sync status & recording | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 2 | OPEN-API | Sync-state surface + invoice recording action |
| Commissions & pre-commissions | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 3 | 3 | NONE | Reviewers want more depth (request #7); status-tracked comp records |
| Public API & webhooks (financial) | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 4 | 2 | NONE | We add the invoice-create/send API integrators publicly lack (P9) |
| Automation & packaging | [invoicing-payments](02-feature-inventory/invoicing-payments.md) | 2 | 1 | NONE | Underwriting ops + packaging note; automation rides the engine |

### 2.8 Reporting — [`02-feature-inventory/reporting.md`](02-feature-inventory/reporting.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Standard report catalog (Reports tab) | [reporting](02-feature-inventory/reporting.md) | 4 | 3 | NONE | ~15 named reports evidenced; ship the owner's decision set first (sales, source ROI, A/R, profitability) |
| Base report editing | [reporting](02-feature-inventory/reporting.md) | 3 | 3 | NONE | Column toggles, date ranges, grouping |
| Report export | [reporting](02-feature-inventory/reporting.md) | 4 | 1 | NONE | CSV/Excel; doubles as our anti-lock-in trust position (P12) |
| Sales Leader Board | [reporting](02-feature-inventory/reporting.md) | 3 | 2 | NONE | Monthly rep ranking; cheap motivation surface |
| Sales pipeline snapshot | [reporting](02-feature-inventory/reporting.md) | 4 | 2 | NONE | Revenue-by-milestone forecast view |
| Operational quick-view trackers | [reporting](02-feature-inventory/reporting.md) | 4 | 3 | NONE | Canonical row — live filtered views over module data (14 trackers, phased) |
| ReportsPlus add-on (custom reporting) | [reporting](02-feature-inventory/reporting.md) | 3 | 4 | NONE | Drag-drop report builder is a heavy build; bundle when shipped |
| ReportsPlus report library | [reporting](02-feature-inventory/reporting.md) | 3 | 3 | NONE | Pre-built set over the builder |
| Dashboard library (role-based) | [reporting](02-feature-inventory/reporting.md) | 3 | 3 | NONE | Per-role KPI defaults |
| Custom dashboards | [reporting](02-feature-inventory/reporting.md) | 3 | 4 | NONE | Composable dashboards; per-user layouts answer request #10 |
| Scheduled report delivery | [reporting](02-feature-inventory/reporting.md) | 3 | 2 | OPEN-API | Cron + email provider |
| Sharing, bookmarking, cross-location copy | [reporting](02-feature-inventory/reporting.md) | 2 | 2 | NONE | Share/bookmark/copy semantics |
| ReportsPlus mobile app | [reporting](02-feature-inventory/reporting.md) | 2 | 2 | NONE | Responsive dashboards make a separate app unnecessary |
| Trade-level reporting | [reporting](02-feature-inventory/reporting.md) | 3 | 2 | NONE | Trade tags on money lines → profitability by trade |
| Appointments Report | [reporting](02-feature-inventory/reporting.md) | 2 | 1 | NONE | Flat listing with filters |
| Data Mart / DataMart add-on | [reporting](02-feature-inventory/reporting.md) | 3 | 2 | NONE | We're Postgres-native — read-replica/BI access is cheap for us, an enterprise add-on for them |
| Multi-location reporting | [reporting](02-feature-inventory/reporting.md) | 3 | 3 | NONE | Location dimension across reports |
| Scheduled-reports API | [reporting](02-feature-inventory/reporting.md) | 1 | 1 | NONE | Run-instance listing; low demand |
| Plan gating | [reporting](02-feature-inventory/reporting.md) | 1 | 1 | NONE | Packaging note — reporting bundled |

### 2.9 Homeowner Portal & Customer Comms — [`02-feature-inventory/homeowner-portal.md`](02-feature-inventory/homeowner-portal.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Portal invitation | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | We extend: live from first appointment, not post-approval (doc 12 §c) |
| Branded portal page | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Tenant branding on the client dashboard |
| Job status tracking | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 5 | 2 | NONE | Heart of the live-client-dashboard thesis; auto-syncs from the job file |
| Appointment & delivery visibility | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 1 | NONE | Read-only calendar slice |
| Selective content sharing | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Per-item share flags with sensible per-job defaults |
| Document access & signing | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Rides doc engine + native e-sign |
| Billing transparency | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 1 | NONE | Cost, history, balance views |
| In-portal payments (AccuPay) | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 5 | 2 | OPEN-API | PSP checkout incl. on-demand partial payments |
| Financing application (AccuFi) | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 2 | 2 | PARTNER-REQUIRED | Surfaces only after a lending partner exists (§4) |
| Two-way portal messaging | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Routes into the same job threads |
| New-content notifications | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 2 | OPEN-API | Email/SMS notify with receipts (turns P7 into a proof point) |
| Auto-expiring access | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 2 | 1 | NONE | We deliberately invert it: access persists through warranty (doc 12); expiry stays an option |
| Portal preview | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 1 | NONE | View-as-customer |
| Engagement tracking | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 1 | NONE | Last-visit stamp for follow-up |
| Packaging | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 1 | 1 | NONE | Not a build item: bundled on every plan is the doc-12 pillar |
| Photo album share links | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Auto-updating album links with expiry/revocation (L5 praise) |
| Photos-to-PDF | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 2 | NONE | Adjuster-friendly export |
| E-sign delivery links (Smart(er) Docs) | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 5 | 2 | NONE | Rides native e-sign engine (canonical in sales-estimating) |
| Signature reminders & expiration | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 1 | NONE | Scheduled nudges + doc expiry |
| Two-way SMS (Text Messaging add-on) | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 5 | 3 | OPEN-API | Duplicate of CRM canonical row; bundled |
| Automated homeowner emails/texts | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | OPEN-API | Automation engine + providers; recipes shipped |
| Review requests (via automation) | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 3 | 1 | NONE | Completion-trigger recipe with review link |
| Threaded communications view | [homeowner-portal](02-feature-inventory/homeowner-portal.md) | 4 | 2 | NONE | Story view over all channels; restores what their message-board removal broke (P3) |

### 2.10 Mobile — [`02-feature-inventory/mobile.md`](02-feature-inventory/mobile.md)

Strategy: v1 mobile = the same Next.js app as an installable, mobile-first PWA (one codebase =
automatic desktop parity, the exact P1 complaint). Native wrappers/apps are a v2 decision.

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Packaging & platforms (Field App) | [mobile](02-feature-inventory/mobile.md) | 3 | 1 | NONE | PWA free with every seat; no app-store gate in v1 |
| Job file access from field | [mobile](02-feature-inventory/mobile.md) | 5 | 2 | NONE | Full job record on phone — the parity promise (P1) |
| Mobile lead creation | [mobile](02-feature-inventory/mobile.md) | 5 | 1 | NONE | Duplicate of CRM row |
| Lead triage in field | [mobile](02-feature-inventory/mobile.md) | 4 | 1 | NONE | Sort/filter/mark-dead on mobile lists |
| Milestone/status/checklist updates | [mobile](02-feature-inventory/mobile.md) | 4 | 1 | NONE | Same state machine, mobile UI |
| Photo capture & upload | [mobile](02-feature-inventory/mobile.md) | 5 | 3 | NONE | Queued/background/resumable uploads — the #1 mobile complaint; core engineering focus |
| Photo annotation & editing | [mobile](02-feature-inventory/mobile.md) | 4 | 3 | NONE | Canvas annotation (arrows/text/measure), save-as-copy |
| Location Stamps | [mobile](02-feature-inventory/mobile.md) | 3 | 2 | NONE | GPS/address/timestamp overlay for insurance-grade evidence |
| Albums, tags, search | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Rides media pipeline; fix their list-position-reset bug class (P6) |
| Photo/album sharing | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Duplicate of portal album-links row |
| Video support | [mobile](02-feature-inventory/mobile.md) | 3 | 3 | NONE | Upload + transcode pipeline |
| Document scanning | [mobile](02-feature-inventory/mobile.md) | 3 | 3 | NONE | Camera-to-PDF; can lean on OS share sheet first |
| Measurement ordering (mobile) | [mobile](02-feature-inventory/mobile.md) | 3 | 1 | NONE | Responsive reuse of measurements hub; provider gates unchanged |
| Mobile estimating | [mobile](02-feature-inventory/mobile.md) | 5 | 2 | NONE | Duplicate of sales-estimating row; PWA gets it free — years before they had it |
| Proposals + eSignature (mobile) | [mobile](02-feature-inventory/mobile.md) | 5 | 2 | NONE | In-person signing on the rep's phone |
| Payment recording | [mobile](02-feature-inventory/mobile.md) | 4 | 1 | NONE | Record payment + balance view in the field |
| Job messaging & texting | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Threads + SMS inbox on mobile |
| Caller ID | [mobile](02-feature-inventory/mobile.md) | 2 | 4 | NONE | Requires native app + OS call APIs; defer to native-app phase |
| Tasks & MyDay | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Due-task surface + notifications |
| Calendar & schedules | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Mobile calendar views |
| Call/meeting logging | [mobile](02-feature-inventory/mobile.md) | 3 | 1 | NONE | Interaction-log entry from the field |
| Configurable dashboard | [mobile](02-feature-inventory/mobile.md) | 3 | 2 | NONE | Recent jobs + activity feed home |
| Navigation handoff | [mobile](02-feature-inventory/mobile.md) | 3 | 1 | NONE | geo:/universal links to preferred maps app |
| Sync to web | [mobile](02-feature-inventory/mobile.md) | 5 | 2 | NONE | One app + Supabase Realtime = parity by construction, not sync code |
| Canvassing adjacency | [mobile](02-feature-inventory/mobile.md) | 2 | 2 | OPEN-API | SalesRabbit open API; Spotio via §4 |
| Offline behavior | [mobile](02-feature-inventory/mobile.md) | 4 | 5 | NONE | Offline-first (queued writes, conflict handling) is a doc-08/12 differentiator but a 3+ month build — explicit v2 bet |
| Packaging & platforms (Crew App) | [mobile](02-feature-inventory/mobile.md) | 3 | 2 | NONE | Crew-role PWA, EN/ES, bundled (they charge for it) |
| Labor-order ticket | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Crew view of work order: dates, address, docs, photos, checklist |
| Accept/reject jobs | [mobile](02-feature-inventory/mobile.md) | 3 | 1 | NONE | State toggle + office notification |
| Crew scheduling & self-management | [mobile](02-feature-inventory/mobile.md) | 3 | 3 | NONE | Sub-managed crews, reassignment, availability |
| Labor checklists | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Duplicate of production row; live completion |
| GPS check-in/check-out | [mobile](02-feature-inventory/mobile.md) | 4 | 2 | NONE | Web geolocation + timestamps; attendance visibility |
| Progress photos | [mobile](02-feature-inventory/mobile.md) | 4 | 1 | NONE | Rides the photo pipeline |
| Two-way messaging (crew) | [mobile](02-feature-inventory/mobile.md) | 3 | 2 | NONE | Crew↔office threads logged to job |
| EN↔ES translation | [mobile](02-feature-inventory/mobile.md) | 3 | 3 | OPEN-API | Self-serve translation API; Spanish crews are a real adoption factor (request #11) |
| Document scan/upload (crew) | [mobile](02-feature-inventory/mobile.md) | 2 | 1 | NONE | Upload path reuse |

### 2.11 Automations & Communications — [`02-feature-inventory/automations-comms.md`](02-feature-inventory/automations-comms.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Automation Manager | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 3 | NONE | Canonical row (also in CRM/production); rules list + toggle + guided setup |
| Job-event triggers | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | NONE | Event taxonomy rides the engine |
| Milestone triggers | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 1 | NONE | The most-used trigger class (welcome email, permit task) |
| Order triggers | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | NONE | Order created/status/filled events |
| Financing triggers | [automations-comms](02-feature-inventory/automations-comms.md) | 2 | 1 | PARTNER-REQUIRED | Meaningless until a financing partner exists (§4) |
| Relative timing | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | NONE | Offset scheduling (pg_cron/queue) — reminders N days before/after |
| Action: automated email | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 2 | OPEN-API | Templated sends with delivery receipts |
| Action: automated SMS | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 2 | OPEN-API | From tenant-local number; trigger-annotated logging |
| Action: create task | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | NONE | Plus cascading task-on-task-completion — their documented gap (request #4) |
| Dynamic tags | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | NONE | Merge-field resolver over job-file data |
| Starter content | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Shipped recipe library shortens time-to-value (P13) |
| Email Template Builder | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 3 | NONE | Visual builder; v1 can ship structured templates first |
| Template library | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Foldered, role-gated template management |
| Send from job file | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | OPEN-API | Duplicate of CRM email row |
| Two-way texting | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 3 | OPEN-API | Duplicate of CRM canonical SMS row |
| Company-local number | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | OPEN-API | Number provisioning via SMS provider |
| Conversation logging | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | NONE | Every message auto-attached to the job — table stakes |
| Messaging preferences | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Consent flags; TCPA hygiene (STOP/HELP handled at provider) |
| Add-on pricing (texting) | [automations-comms](02-feature-inventory/automations-comms.md) | 1 | 1 | NONE | Packaging note — we bundle (P2) |
| Vendor-claimed impact | [automations-comms](02-feature-inventory/automations-comms.md) | 1 | 1 | NONE | Vendor marketing stat; nothing to build, never repeat as fact |
| Job message threads | [automations-comms](02-feature-inventory/automations-comms.md) | 5 | 3 | NONE | Canonical threads row; pins/tags/mentions/reactions; "never remove it" trust position (P3) |
| Task from message | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Duplicate of CRM row |
| Message search | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | NONE | Postgres FTS across threads (P4) |
| @Me feed | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | NONE | Personal notification queue with dismissal |
| Workflow-status alerts | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Status-change notifications ride events |
| Appointment alerts | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 1 | NONE | Attendee notify on create/change |
| Mobile push | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 2 | OPEN-API | Web-push/FCM; their @Me items famously didn't push — cheap win |
| Customer Portal notifications | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Duplicate of portal row |
| CallRail integration | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 2 | OPEN-API | Self-serve API (2–6 wks); calls→leads |
| Ongoing call logging | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 2 | OPEN-API | Rides CallRail connection |
| Campaign attribution | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 2 | OPEN-API | Tracked-number → source reporting |
| Manual call logs | [automations-comms](02-feature-inventory/automations-comms.md) | 3 | 1 | NONE | Duplicate of contact interaction logs |
| No native dialer | [automations-comms](02-feature-inventory/automations-comms.md) | 1 | 1 | NONE | Their negative finding; we also delegate telephony — nothing to copy |
| Webhooks + Zapier | [automations-comms](02-feature-inventory/automations-comms.md) | 4 | 3 | OPEN-API | Duplicate of CRM canonical row |

### 2.12 Admin & Permissions — [`02-feature-inventory/admin-permissions.md`](02-feature-inventory/admin-permissions.md)

| Feature | Module | Value | Lift | Gate | Score rationale |
|---|---|---|---|---|---|
| Manage Your Team page | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | User admin console |
| User invitation | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | Supabase Auth invites; email = username |
| User profile fields | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 1 | NONE | Names/initials/self-service email |
| User statuses (billing-linked) | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | Active/Inactive/Archived + seat-billing linkage to our billing system |
| Six fixed role types | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | We ship roles as data, not enum (doc 04 design note) |
| Base permissions per role | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 3 | NONE | Policy sets + RLS; their toggle matrix is unknown — we design from the doc-04 gate catalog |
| Per-user permission settings | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 3 | NONE | Per-user overlay on role policies |
| Assigned-job scoping for Sales | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | RLS: reps see own jobs |
| Financial-visibility controls | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 3 | NONE | Hide profitability, show balance due — column-level policy work |
| Approval permissions (worksheets) | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | Submit-for-approval vs approve split |
| Milestone-advance permission | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 1 | NONE | Gate on stage transitions |
| Subcontractor invitations | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 2 | OPEN-API | SMS invite link via provider |
| Time-boxed sub permissions | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | Expiring access grants — good security story, easy in RLS |
| Labor-contact sharing settings | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 1 | NONE | Auto vs selective sharing toggle |
| Multi-location under one account | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 4 | NONE | Architectural: bake office scoping into the schema day one (doc 04), ship management UI later |
| Location picker at login | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 1 | NONE | Context switcher + default |
| Location-scoped settings | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 2 | NONE | Per-office config lists |
| Cross-location roll-up | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 3 | NONE | Consolidated reporting over offices |
| Branch-aware lead routing | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 2 | OPEN-API | Rides CallRail mapping |
| Two-factor authentication | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | Supabase Auth MFA built in; enforceable account-wide |
| Single sign-on | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | Google/Microsoft OAuth via Auth |
| Password reset | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | Auth built-in |
| Platform security posture | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 3 | NONE | Mostly platform inheritance (encryption, backups) + ops discipline + a published trust page |
| Per-record audit trails | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | Append-only events; we extend to settings/permission changes (their gap) |
| Checklist attribution | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 1 | NONE | Who/when stamps on items |
| API-key administration | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | Named, revocable keys; we add scopes (their keys appear all-access) |
| Account Settings hub | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 2 | NONE | Central config area grows with modules |
| Notification administration | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 2 | NONE | Per-user channel preferences — their gap per reviews |
| Guided onboarding | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 2 | NONE | L2-praised service bar; our build item = in-product onboarding checklist + import tooling; the rest is CS ops |
| Training formats | [admin-permissions](02-feature-inventory/admin-permissions.md) | 2 | 1 | NONE | Service motion + docs site, not product code |
| Ongoing support | [admin-permissions](02-feature-inventory/admin-permissions.md) | 4 | 1 | NONE | Support 4.7/5 is the bar we must match operationally; not a build item |
| Per-user commercial model | [admin-permissions](02-feature-inventory/admin-permissions.md) | 3 | 2 | NONE | Packaging: our answer is published flat/role pricing (07 §6), plus seat mechanics in billing |

---

## 3. MVP cutline

**Rule applied:** value ≥ 4, lift ≤ 3, gate ≠ PARTNER-REQUIRED. Named exceptions are called out
where the rule bends. Ordered as a build sequence (each item assumes the ones before it).

### MVP v1 — the sellable core

1. **Tenancy + identity + governance** — tenant/office schema (multi-location baked into the
   schema now, UI later), Auth invites, roles-as-data + permission policies, RLS job scoping,
   financial-visibility controls, 2FA/SSO/password reset, per-record audit trail, API keys.
2. **CRM spine** — contacts (typed phones/emails), job record with milestone state machine,
   lead intake (web form + mobile form + public POST endpoint), lead sources, priority,
   unassigned queue, quick assign + notifications, dead-lead handling, follow-up surfacing,
   list filtering with **fuzzy search** from day one.
3. **Job file activity hub** — threaded messages (@mentions, tags, pins), notes, tasks
   (with cascading task-on-completion), @Me feed, appointments/calendar with in-calendar search.
4. **Media pipeline** — mobile-web capture with queued/background/resumable uploads, annotation,
   albums/tags, auto-updating share links with expiry. (This is the P1/P6 battleground; it gets
   real engineering attention, not a checkbox.)
5. **Measurements hub** — manual entry + universal XML import + **Hover** connection (open);
   measurement→estimate auto-population with our own formula binding and waste engine.
6. **Estimating** — custom price book (materials library), estimate builder + templates,
   full line-item model, margin/overhead/tax/discounts, multiple estimates + primary,
   **good/better/best tiers natively** (request #2).
7. **Documents + native e-sign** — merge-field templates, packets, secure send links, signature
   audit record, reminders/expiration. Bundled — this is the anti-"nickel and dime" position.
8. **Money spine** — worksheet + typed amendments → invoices (all four creation modes) → payment
   ledger; PSP collection via hosted onboarding + pay links + portal payments (*exception:*
   payments scored lift 4 as a whole; v1 scopes to PSP-hosted flows ≈ lift 3); A/R aging +
   tracker.
9. **Live client dashboard (bundled)** — homeowner login from first appointment through
   warranty: status, appointments/deliveries, shared docs/photos, billing, payments, messaging,
   engagement tracking. Our headline differentiator (doc 12 §c).
10. **Comms** — transactional email with delivery/read receipts (P7 → proof point), two-way SMS
    from a tenant-local number (bundled), conversation logging, message search.
11. **Automation engine** — job/milestone/order triggers, relative timing, email/SMS/task
    actions, dynamic tags, starter recipe library.
12. **Internal material orders** — estimate→order conversion, order manager (basic), delivery
    dates on calendar, branded PDF/email submission fallback while supplier BD runs (§4).
13. **QuickBooks Online sync** (*exception:* lift 4 — included because bookkeeper workflow is
    adoption-blocking; v1 scope = customer/invoice/payment push + payment pull, reliability
    instrumented, since their sync-back is publicly distrusted).
14. **Open API + webhooks** — self-serve keys, read/write endpoints across the above, webhook
    subscriptions. Shipping this *in* v1 is the P9 wedge and enables partners to build toward us.
15. **Reporting core** — pipeline snapshot, sales/lead-source-ROI/closing-%/A-R/job-profitability
    reports, CSV export, and one-click full-account export (the P12 trust position).

### v1.1 — fast follow (roughly one quarter behind)

1. **Insurance/restoration pack** — claim record (with ACV/RCV/deductible structure they lack),
   adjuster records + inspection scheduling, supplements (records, four-stage line items,
   notations, tracker, worksheet application), mortgage-check and permit trackers, carrier
   templates. High value but segment-specific — it follows the horizontal core.
2. **Production depth** — labor manager, work orders/tickets, crew-role PWA (accept/reject,
   checklists, GPS check-in/out, progress photos, EN↔ES translation), production calendar with
   drag-drop + conflict alerts + to-be-scheduled drawer, external calendar sync
   (Google/Outlook/Apple).
3. **Workflow configurability** — custom statuses + checklists per trade/type, custom fields,
   appointment outcomes.
4. **Job costing & comp** — expenses vs forecast, trade-level P&L, commissions/pre-commissions.
5. **Integrations wave (all open)** — Zapier app, CompanyCam, CallRail, SalesRabbit, inbound
   webhook lead intake (Roofle-style), HubSpot; mobile push notifications.
6. **Client-dashboard extensions** — adjuster and property-manager role-scoped views (the doc-12
   differentiator with no incumbent), review-request recipes, photos-to-PDF.
7. **Reporting depth** — quick-view trackers buildout, scheduled delivery, leaderboard,
   dashboards; direct SQL/BI access (cheap for us on Postgres — their enterprise add-on).

### Waits (v2+)

- **Everything PARTNER-REQUIRED** (§4): supplier catalogs/account pricing/electronic ordering,
  native EagleView/GAF/Geospan/RoofSnap/RoofScope ordering, embedded financing, Sage Intacct,
  hail data, Angi/Spotio/Hatch. Engineering waits; **BD does not** — applications start day one.
- **Offline-first mobile + native apps** (incl. caller ID) — highest-lift differentiators;
  sequenced after the PWA proves the workflow.
- **Drag-drop report builder + custom dashboards; visual email builder** — heavy editors with
  workable v1 substitutes.
- **AI differentiators from doc 12** (estimate derivation, supplement drafting, photo
  intelligence, semantic search) — built on v1's unified data model; they are why the v1 schema
  carries provenance and event logs, but they are not MVP line items.
- Lead-score AI, video transcoding, disputes console, purchase-history recommendations,
  measurement spend reconciliation, cross-location roll-ups.

**Why this cutline.** v1 is exactly the loop a roofing contractor cannot run their business
without — lead → estimate → signed proposal → build coordination-lite → invoice → collected cash
— which is also the loop review mining shows drives both retention (L1 all-in-one job file, L4
no-re-keying flow) and churn when it fails (P1 mobile, P2 add-on stacking, P5 estimating
rigidity). Every v1 item is buildable on Next.js + Supabase without a negotiated partnership, so
the schedule is entirely in our control; the two lift-4 exceptions (PSP payments, QBO sync) are
included because a contractor literally cannot adopt without collecting money and closing books,
and both ride open self-serve programs. The genuinely gated capability — supplier-integrated
ordering with account pricing, AccuLynx's documented moat — cannot be willed into v1, so v1
neutralizes it instead: a contractor-owned price book, XML measurement import, and PDF/email
order submission preserve the workflow shape while ABC/SRS applications (1–3 months, semi-open)
run in parallel, making live supplier data a v1.x upgrade rather than a launch blocker. The
insurance pack lands in v1.1 rather than v1 not because it's low value (it's the restoration
segment's core) but because it's segment-vertical while v1 must first nail the horizontal spine
every segment shares — and it arrives before the segment's buying season matters. Bundling
(e-sign, SMS, portal, reporting) is treated as architecture, not pricing garnish, because P2 is
the single most documented churn trigger and our differentiation thesis (doc 12) stakes the
brand on "included, not add-on."

---

## 4. Gated roadmap — PARTNER-REQUIRED features and BD lead times

All lead times are doc-09 estimates (INFERENCE: engineering + BD calendar to production parity,
assuming a demoable product). Per protocol §8, every one of these is described publicly only as
**"designed to integrate with" / "planned"** until an agreement exists. Application-track (SEMI)
items can start immediately with engineering against public sandboxes; negotiated (GATED) items
need a BD owner and a real pipeline.

| Partner surface | Doc-09 access model | BD lead time | Matrix rows unblocked | Mitigation until signed | When to start |
|---|---|---|---|---|---|
| **ABC Supply** | SEMI (aggregator track; public docs + sandbox) | 1–3 mo | Supplier catalogs/pricing, live stock, electronic submission, POD auto-feed, invoice data, Prop-65 | Custom price book + PDF/email order submission | **Day one** |
| **SRS Distribution** | SEMI (SIPS API; email-issued credentials) | 1–3 mo | Same as ABC + purchase-history recommendations | Same | **Day one** |
| **QXO (ex-Beacon)** | GATED (partner onboarding; post-acquisition continuity risk) | 3–9 mo | Third national distributor | ABC + SRS cover two of three | After ABC/SRS are live |
| **EagleView** | SEMI→GATED (sandbox self-serve; production via partner track) | 2–4 mo | EagleView ordering + roof/wall variant | Hover (open) + universal XML import | **Day one** (sandbox immediately) |
| **GAF QuickMeasure** | GATED (no public dev program; all integrations are named partners) | 3–9 mo | QuickMeasure ordering | Hover/EagleView | After v1 ships |
| **GeoSpan** | GATED (partner-arranged) | 3–6 mo | Geospan ordering + 3D reports | Hover 3D models | Opportunistic |
| **RoofSnap** | SEMI (API scoped per project) | 1–3 mo | RoofSnap sync | XML upload fallback | v1.1 window |
| **RoofScope** | GATED (no public program) | 3–6 mo | RoofScope sync | XML upload fallback | Opportunistic |
| **Embedded financing** (Acorn/Momnt/Wisetack-class) | GATED (commercial + compliance onboarding) | 2–6 mo | AccuFi-equivalent, financing triggers, portal financing | None real — sell v1 without financing; PSP handles payment plans poorly, don't fake it | Once v1 is stable |
| **GreenSky** | GATED (merchant agreement) | 3–6 mo | Legacy financing row | Skip — superseded by marketplace model | Not planned |
| **Sage Intacct** | GATED, paid (~$2.5k/yr + per-call fees) | 2–4 mo | Intacct two-way sync | QBO covers the vast majority of the segment | On first enterprise demand |
| **HailWatch** | GATED (data-provider agreement) | 2–4 mo | Storm lead intake (hail alerts/maps) | Canvassing imports (SalesRabbit, open) | v2 |
| **CoreLogic / Cotality hail data** | GATED (enterprise data license) | 3–6 mo | Address-level hail verification | Alternative weather-data vendors | v2 |
| **Angi (Leads/Ads)** | SEMI (email onboarding of a partner endpoint) | 2–8 wks | Angi lead auto-import | Generic inbound webhook + Zapier intake | v1.1 |
| **Spotio** | SEMI (INFERENCE; no public docs found) | 1–3 mo | Spotio canvassing sync | SalesRabbit (open) | v1.1 |
| **Hatch** | SEMI (they build against *our* API) | 1–3 mo (mostly our API readiness) | Hatch campaign sync | Our open API + webhooks make this their work, not ours | Passive — enabled by v1 item 14 |

**Sequencing note.** The §3 cutline depends on zero rows from this table. The two BD tracks that
materially change our competitive position are (1) ABC + SRS — which together neutralize the
supplier moat for most buyers — and (2) EagleView — the most-cited measurement brand in reviews.
Both are application-track, both start day one, and both have engineering-ready public docs, so
the realistic window for "live supplier pricing + native EagleView ordering" is v1.x, one to
four months post-launch, without ever having blocked launch.

---

## Caveats & Unknowns

- Value and lift scores are our judgment (INFERENCE), grounded in the cited review-mining themes
  and doc-04 schema reconstruction; they are planning inputs, not commitments.
- Gate classifications inherit doc 09's access-model findings, several of which are themselves
  INFERENCE from the absence of public developer programs; each §4 application may come back
  faster or slower than estimated.
- Feature descriptions are not re-sourced here; provenance for every claim lives in the module
  docs and their per-module source logs.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

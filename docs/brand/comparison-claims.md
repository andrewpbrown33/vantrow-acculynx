# Comparison Claims — Eaverow vs AccuLynx (vetted for /vs-acculynx)

**Date of record:** 2026-07-16 · **Status:** Cleared for copywriting.
**Scope:** the sourced comparison table the copywriter renders on `apps/site` route `/vs-acculynx`.
**Governing docs:** `docs/legal/clean-room-protocol.md`, `docs/legal/comparative-advertising-checklist.md`.

---

## How to read / render this file

- Every row below has cleared **all six per-claim checklist items** and the page-level checklist
  in `docs/legal/comparative-advertising-checklist.md`. The "Checklist status" column records the
  clearance plus the one item that carried the most risk for that row.
- **Original expression only.** Every "AccuLynx approach" cell is our own paraphrase of publicly
  documented behavior or of dated customer reviews — no AccuLynx marketing, help-center, or UI text
  is copied (protocol §3). Verbatim strings appear only as attributed customer-review quotes.
- **Brand-agnostic rendering.** In JSX the copywriter renders `{brand.name}` / `{brand.domain}` from
  `@vantrow/brand`; the literal "Eaverow" in the prose below is placeholder text for that binding.
  The only literal that stays hardcoded on the page is the nominative "AccuLynx" name (plain text,
  no logo, no stylized mark).
- **Pricing discipline.** Per the copy guardrail we **lead with "simpler / everything included / no
  add-on stacking,"** not with "cheaper." No AccuLynx per-user dollar figure is stated anywhere. Cost
  *sentiment* is carried only by dated, attributed customer reviews; cost *structure* is carried only
  by AccuLynx's own published terms.
- **AI discipline.** We never claim AccuLynx "has no AI." Rows that touch AI acknowledge their shipped
  Lead Intelligence feature and differentiate on architecture and workflow.
- **Ship-gate.** Rows describing an Eaverow capability that must be live before the claim runs are
  flagged **[SHIP-GATE]** in the Checklist column — do not publish that row until the feature ships.
- **Roadmap honesty.** Partner-dependent integrations are phrased "designed to integrate with" /
  "on our roadmap," never as live partnerships (protocol §8).

---

## The comparison table

| # | Capability | Eaverow approach | AccuLynx approach (factual, as of 2026-07-16) | Source ref(s) | Checklist status |
|---|---|---|---|---|---|
| 1 | **One field-ready app, full desktop parity** | A single responsive web app (installable PWA) serves desktop and field from one codebase, so the phone does what the desktop does by construction — leads, photos, estimates, e-sign, payments, scheduling. | AccuLynx ships two separate mobile apps (a rep/office "Field App" and a crew app). In-app estimate building arrived in the Fall-2025 release; before that third parties describe the app as a read-only companion. Its App Store rating (3.9/5) sits below its desktop review average (4.6/5), and customers report photo-upload failures, lag, and list-position resets on large photo sets. | `02-feature-inventory/mobile.md` [S-MOBILE-001][S-MOBILE-002][S-MOBILE-010][S-MOBILE-012]; `08-review-mining.md` P1 [S-REVIEWS-007][S-REVIEWS-001][S-REVIEWS-008] | **PASS.** Riskiest item = *no disparagement*: we compare architecture (one codebase vs two apps) and cite the app's own store rating and dated customer quotes; we do not characterize the company. Feature/version facts dated. **[SHIP-GATE]** — our mobile parity must be real before publishing. |
| 2 | **Published pricing vs quote-only** | Our full price list is on the website; a prospect can see the price without contacting sales. | AccuLynx publishes one entry-plan price; its Pro and Elite tiers and all of its add-ons are quote-only behind a sales form. Its published terms describe per-user licensing with a contractual minimum user count. | `07-pricing-packaging.md` §2, §5 [S-PRICING-002][S-PRICING-003][S-PRICING-004][S-PRICING-014] | **PASS.** Riskiest item = *pricing hedged*: claim is about **transparency (published vs quote-only)**, not "cheaper." No per-user dollar figure stated; the sole published entry price is referenced only as evidence of the opacity contrast. Dated "as of 2026-07-16." |
| 3 | **Everything included vs add-on stacking** | Texting, e-signature, the client dashboard, and analytics are bundled in every plan — not metered as separate purchases. | On AccuLynx these are optional add-ons priced separately from the base subscription (its published add-on set includes text messaging, SmartDocs/e-sign, the Customer Portal, ReportsPlus, DataMart analytics, the crew app, and payments). Reviewers repeatedly cite paying extra for "basic features" as their top pricing complaint — e.g. a G2 reviewer who cancelled over paying extra "for very basic features such as docusigns." | `07-pricing-packaging.md` §2, §4 [S-PRICING-004][S-PRICING-013]; `02-feature-inventory/homeowner-portal.md` [S-HOMEOWNER-PORTAL-003][S-HOMEOWNER-PORTAL-008]; `08-review-mining.md` P2 [S-REVIEWS-006] | **PASS.** Riskiest item = *pricing hedged / no disparagement*: what's-an-add-on is sourced to AccuLynx's own published add-on list; cost frustration is carried by a **dated, attributed** customer quote, never asserted by us. No dollar figures. |
| 4 | **Live client dashboards, bundled** | Every job gets a live, role-scoped client dashboard — homeowner, and by design property-manager and adjuster views — included on every plan, live from the first appointment and persisting through the warranty period as a maintenance/referral surface. | AccuLynx offers a "Customer Portal" as a paid add-on. Per its public materials the homeowner is invited after the job reaches the approved stage and access auto-expires at job completion; the documented audience is the single-job homeowner (adjusters receive shared photo links, not a login). | `12-differentiation-thesis.md` §c [S-DIFF-017][S-DIFF-018][S-DIFF-019][S-DIFF-020][S-DIFF-021][S-DIFF-022]; `02-feature-inventory/homeowner-portal.md` [S-HOMEOWNER-PORTAL-002][S-HOMEOWNER-PORTAL-004] | **PASS.** Riskiest item = *factual & verifiable*: AccuLynx side is limited to documented lifecycle/packaging facts; the property-manager/adjuster views are ours. **[SHIP-GATE]** for the PM/adjuster views — phrase unshipped scope as "designed to." Portal is described fairly as the closest comparable. |
| 5 | **AI-native workflows vs a bolted-on score** | Eaverow is built AI-native: the job record is model-readable context so the system can draft the estimate from the measurement, draft the supplement from the claim file, and keep photos auto-tagged and findable — each step routed to human approval. | AccuLynx ships one AI feature we can document — "Lead Intelligence" (a lead-conversion propensity score, powered by a third-party prediction API), included free on all plans and launched in 2023. Its Automation Manager is deterministic trigger→action rules, and the 2025–2026 release notes we reviewed add no new AI items. | `12-differentiation-thesis.md` §a, §b [S-DIFF-001][S-DIFF-003][S-DIFF-007][S-DIFF-008][S-DIFF-029] | **PASS.** Riskiest item = *AI claims honest*: we explicitly credit their shipped Lead Intelligence and differentiate on architecture/workflow, never claiming "no AI." **[SHIP-GATE]** — our estimate/supplement/photo AI must ship before this row runs; until then frame as roadmap. |
| 6 | **Open API — read and write, no add-on gate** | An open REST API with write endpoints and subscription webhooks, self-serve, with no separate integration add-on required. | AccuLynx's public REST v2 surface is largely read-oriented (e.g. estimates are exposed read-only), and third-party buyer guides note no public endpoints for material orders, suppliers, or price lists. It does offer subscription webhooks and ~13 Zapier triggers, but Zapier/HubSpot connectivity runs through its paid AppConnections add-on. Tech-forward reviewers describe the API as a "closed garden" (secondhand). | `02-feature-inventory/sales-estimating.md` [S-SALES-ESTIMATING-005][S-SALES-ESTIMATING-008]; `02-feature-inventory/supplier-ordering.md` [S-SUPPLIER-ORDERING-024]; `02-feature-inventory/automations-comms.md` [S-AUTOMATIONS-COMMS-012][S-AUTOMATIONS-COMMS-014]; `08-review-mining.md` P9 [S-REVIEWS-011] | **PASS.** Riskiest item = *factual & verifiable*: we **concede they have webhooks + Zapier** and differentiate on writes + no add-on gating; the "closed garden" phrase is flagged as an attributed, secondhand review characterization, not our assertion. **[SHIP-GATE]** for our write API. |
| 7 | **Fast fuzzy search** | Fuzzy, typo-tolerant search across jobs, contacts, and communications — partial names and addresses resolve. | Customers report AccuLynx search is effectively exact-match: "you have to type in the exact spelling in order to pull up a customer," and they cite an inability to search the calendar or to find jobs by material. | `08-review-mining.md` P4 [S-REVIEWS-004][S-REVIEWS-003][S-REVIEWS-002] | **PASS.** Riskiest item = *no disparagement / sourced*: the AccuLynx-side limitation is stated only as **dated customer-reported** experience, quoted and cited — not asserted by us as fact about the product's internals. **[SHIP-GATE]** for our search behavior. |
| 8 | **Cascading task automation** | Task automation supports cascades — completing one task can auto-create the next — so multi-step workflows chain without manual re-entry. | AccuLynx's automation creates a task as a trigger action, but reviewers specifically ask for cascading tasks (auto-creating the next task when one completes) as a gap; it is a recurring feature request in the sampled reviews. | `02-feature-inventory/automations-comms.md` [S-AUTOMATIONS-COMMS-001][S-AUTOMATIONS-COMMS-004]; `08-review-mining.md` P10 / request #4 [S-REVIEWS-003][S-REVIEWS-005] | **PASS.** Riskiest item = *factual & verifiable*: the gap is framed as a **dated customer feature request**, not an absolute claim about undocumented internals. **[SHIP-GATE]** for our cascade engine. |
| 9 | **Clean exit / one-click export** | Free one-click data export, no seat-minimum lock-in and no post-cancellation storage fee. | AccuLynx's published terms provide that prepaid annual fees are nonrefundable, cancellation requires 30 days' notice, and departing accounts with a base user count above 15 owe a recurring monthly data-storage fee to retain access to their data. | `07-pricing-packaging.md` §2 [S-PRICING-004] | **PASS.** Riskiest item = *factual & verifiable*: every AccuLynx clause is drawn **verbatim-in-substance from their own published terms** (paraphrased, not copied) and cited — the strongest evidence class on the page. **[SHIP-GATE]** — our export/no-fee terms must be true in our own ToS. |
| 10 | **Faster time-to-value for small teams** | Simpler packaging (nothing to bolt on) and a bundled feature set aimed at getting a 3-seat crew productive quickly. | Reviewers describe AccuLynx as heavy for small teams — "too expensive especially for a small business with only 2-3 users" — and aggregators frame the ramp-up as best-suited to larger, established shops. **Honesty note for copy:** AccuLynx's *desktop* ease-of-use scores well (a 4.4/5 sub-score across its review pool), so we do **not** claim it is "hard to use." | `08-review-mining.md` P13 [S-REVIEWS-013][S-REVIEWS-014]; `12-differentiation-thesis.md` §d [S-DIFF-024][S-DIFF-023] | **PASS.** Riskiest item = *no disparagement / substantiated superlative*: claim is narrowed to "faster time-to-value for small teams / simpler packaging," each anchored to dated reviews; the row **explicitly concedes their desktop ease-of-use praise**, so no "easier to use" superlative runs. |
| 11 | **[CONCEDED — AccuLynx ahead] Live distributor ordering & account pricing** | Day one, Eaverow gives contractors a self-owned price book (custom materials library), universal measurement-XML import, and branded PDF/email purchase orders. Live, direct-to-branch ordering with distributor account pricing is **designed to integrate with major distributors and is on our roadmap**, pending partner agreements — not available at launch. | AccuLynx maintains live, native ordering integrations with the three dominant US roofing distributors (ABC Supply, SRS, and QXO), bringing account-specific branch pricing, live stock visibility, and electronic order submission into the estimate; a third-party buyer's guide calls it the only roofing CRM natively connected to all three. **This is a genuine AccuLynx advantage today.** | `02-feature-inventory/supplier-ordering.md` [S-SUPPLIER-ORDERING-001][S-SUPPLIER-ORDERING-016]; `11-copy-priority-matrix.md` §2.5 (PARTNER-REQUIRED rows) | **PASS.** Riskiest item = *no integration promises*: our side is phrased strictly "designed to integrate with / on our roadmap" (protocol §8), and the row **openly concedes AccuLynx leads here** — the credibility anchor for the whole table. |
| 12 | **[CONCEDED — AccuLynx ahead] Native aerial-measurement provider ordering** | Eaverow supports Hover (self-serve OAuth), universal measurement-XML import, and manual entry at launch; native in-app ordering from additional aerial providers (e.g. EagleView, GAF QuickMeasure) is **on our roadmap**, pending partner agreements. | AccuLynx offers native in-app ordering across several aerial-measurement providers (including EagleView and GAF QuickMeasure), with measurements auto-populating estimates — the most-cited measurement workflow in its reviews. **AccuLynx currently offers broader native provider ordering.** | `02-feature-inventory/measurements.md` [S-MEASUREMENTS-001][S-MEASUREMENTS-002][S-MEASUREMENTS-003]; `02-feature-inventory/sales-estimating.md` [S-SALES-ESTIMATING-001][S-SALES-ESTIMATING-003]; `11-copy-priority-matrix.md` §2.4 (PARTNER-REQUIRED rows) | **PASS.** Riskiest item = *no integration promises*: Eaverow provider ordering beyond Hover is phrased "on our roadmap" only (protocol §8); the row concedes AccuLynx's broader native depth. Second honest concession, per instructions. |

---

## Rows considered and **dropped** (could not clear the checklist)

- **"AccuLynx is more expensive" / any TCO or per-user savings figure** — dropped. AccuLynx's Pro/Elite
  and add-on prices are quote-only and unpublished; circulating per-user figures ($55–$300/user/mo)
  trace to no primary source and are partly contaminated by a lookalike scam domain. Fails *pricing
  hedged* and *factual & verifiable*. (`07-pricing-packaging.md` §5, Unknowns.)
- **"AccuLynx has no AI"** — dropped. False; they ship Lead Intelligence. Fails *AI claims honest*.
  Replaced by row 5's architecture framing.
- **"AccuLynx is hard to use / complicated"** as a blanket claim — dropped. Their desktop ease-of-use
  sub-score (4.4/5) contradicts it. Fails *factual & verifiable*. Narrowed into row 10.
- **"AccuLynx requires annual contracts"** — dropped. Their current public pages describe a monthly,
  no-contract option; the annual-only claim is a stale third-party assertion. Fails *current*.
  (`07-pricing-packaging.md` §5.)

---

## Required rendering elements

**Disclaimer (must appear on the page, verbatim):**

> AccuLynx is a trademark of its owner. Eaverow is not affiliated with or endorsed by AccuLynx.

(In JSX render the brand token: "… `{brand.name}` is not affiliated with or endorsed by AccuLynx.")

**Currency note (must appear near the table, verbatim):**

> Comparison based on publicly available information and customer reviews as of 2026-07-16. AccuLynx
> ships updates frequently; claims are re-verified before republication.

**Page-level checklist confirmations (all cleared):**

- Nominative use only — "AccuLynx" appears as plain text, no logo, no stylized mark, not in any Eaverow
  headline implying affiliation.
- No AccuLynx screenshots or UI reproductions anywhere on the page.
- No integration promise stated as live — all partner-dependent items (rows 11, 12) use "designed to
  integrate with" / "on our roadmap."
- No competitor name in paid-search ad copy or display URLs (separate counsel decision — flag before
  bidding on competitor keywords).
- Before launch, this table (claim → source → date) goes to counsel with
  `docs/runbooks/05-legal-counsel-checklist.md`.

---

Prepared under docs/legal/clean-room-protocol.md; every claim sourced.
</content>
</invoke>

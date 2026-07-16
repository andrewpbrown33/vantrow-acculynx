# Messaging Brief — Eaverow (a Vantrow company)

**Date:** 2026-07-16 · **Audience:** the copywriter who will draft site, `/vs-acculynx`, and launch copy.
**Grounding:** `docs/research/acculynx/12-differentiation-thesis.md`, `08-review-mining.md`, `11-copy-priority-matrix.md`, `01-product-overview.md`, `07-pricing-packaging.md`.
**Read before you write:** `docs/legal/clean-room-protocol.md` and `docs/legal/comparative-advertising-checklist.md`. Every comparative claim below carries its own guardrail; do not strip them.

**Code note for the copywriter:** brand strings render from the `@vantrow/brand` package in the app (`{brand.name}`, `{brand.domain}`, brand colors). This brief spells "Eaverow" in prose for readability, but nothing in JSX hardcodes the name, the domain, or colors. The literal word "AccuLynx" appears in product only on `/vs-acculynx` (nominative comparison) and the existing nav label — nowhere else.

---

## 1. Positioning statement

Eaverow is the AI-native roofing operations platform for contractors — from three-person storm crews to multi-location restoration companies — who run the business from the truck and are tired of paying per user, per add-on, and per year of loyalty for software that only files what they type. Eaverow puts the whole job in one place — leads, measurements, estimates, photos, documents, invoices, and cash — in a single responsive app that works the same on a phone as on a desktop, with texting, e-signature, client dashboards, and reporting included on every plan instead of sold back to you one add-on at a time. And because Eaverow is built AI-native from the data model up, every job gives the homeowner, property manager, and adjuster a personalized live dashboard of their project — bundled, not an upsell. One published price. Your data exportable in one click, free, the day you ask.

---

## 2. Voice & tone

**Adjectives:** Confident · Plain-spoken · Straight (no hype) · Field-credible · Honest.

Write to a roofer, not a CIO. Short sentences. Trade words (job file, supplement, milestone, crew, the truck), not SaaS words (synergy, holistic, revolutionize). We earn trust by being specific and dated, never by dunking on a competitor.

**Do:**
- "Build the estimate on the roof. Sign it in the driveway." (concrete, field-first)
- "Texting, e-sign, client dashboards, and reporting are included — on every plan."
- "Your data exports in one click, free, forever."
- "One app. Same on your phone as on your desktop."
- On comparisons: "As of 2026-07-16, AccuLynx does not publish pricing for its Pro or Elite plans or any add-on." (factual, dated, sourced)

**Don't:**
- Don't say "AccuLynx is hard to use" or "AccuLynx has no AI" — both are false and off-limits (their desktop ease scores 4.4/5; they ship Lead Intelligence). Differentiate on architecture and bundling, not on insults.
- Don't quote an AccuLynx per-user price or a savings percentage — their pricing is a secret and ours isn't the story.
- Don't promise integrations we haven't signed ("live ABC Supply ordering") — say "designed to integrate with" / "on our roadmap."
- Don't hype ("revolutionary AI", "10x", "game-changer"). Say what it does.
- Don't characterize the company or its people — compare capabilities only.

---

## 3. Home page message hierarchy

### Lead promise (headline)
**One app that runs the whole roofing job — and shows your customer every step live.**
Support line: everything from lead to collected cash in one place, on your phone or your desktop, with the client dashboard, texting, and e-sign included — not sold back to you as add-ons.

The headline hook is the **live client dashboard** (Pillar D) — that is the thing no roofing CRM ships the way we do. The three pains below make the "why switch" case; the dashboard makes the "why us" case.

### Supporting pillars (each tied to a sourced AccuLynx pain)

**Pillar A — Field app that matches the desktop.** (Attacks P1, the #1 documented complaint — mobile crashes, failed photo uploads, no in-app estimating for years.)
One codebase, one experience: build and send estimates, capture and upload photos that actually finish uploading, update the job — all from the truck, identical to the office. Roofing is a field trade; the app in your pocket should do everything the office screen does.

**Pillar B — Everything included. No add-on maze.** (Attacks P2, the most-cited churn trigger — "nickel and dime" for texting, e-sign, the portal.)
Texting, e-signature, client dashboards, reporting, and the crew app come with the plan. One published price on the website. No seat-minimum contracts and no fee to get your own data back on the way out.

**Pillar C — One search that finds anything; one job file that holds everything.** (Attacks P4 weak/exact-match search and P3 "areas that can't talk to each other," while matching L1 — the all-in-one job file roofers already love.)
Fuzzy search that finds a job by partial address, material, or a note. Docs, permits, photos, messages, and financials in a single job file — and we don't rip out features you built your workflow on.

**Pillar D — A live dashboard for every customer, adjuster, and property manager. (The headline differentiator.)** (Built on doc-12 §c; attacks the portal-as-add-on model + P7 email that silently never arrives.)
Every homeowner gets a branded, always-current view of their job — status, appointments, documents, billing, payments, messages — live from the first appointment through the warranty, not switched on at approval and off at completion. Bundled on every plan. And it's role-scoped: adjusters and property managers can get their own view, so the dashboard is the always-true source instead of another email that never showed up.

---

## 4. Product modules to feature (from the MVP v1 cutline)

Feature these eight. One-line roofer-benefit each; keep the language field-first.

1. **Job file** — Everything about a job in one place: contacts, photos, docs, messages, and money, from first call to final check.
2. **Field app (mobile = desktop)** — Do the whole job from the truck: estimates, photos, signatures, payments — same app, same power as the office.
3. **Estimating with good/better/best** — Pull the measurement, drop in your materials, and hand the homeowner three options to pick from in one proposal.
4. **Documents + e-sign (included)** — Proposals, contracts, and change orders signed on the spot — e-signature built in, not a bolt-on you pay extra for.
5. **Invoicing + payments** — Invoice straight off the job's numbers and get paid by card or ACH, from the field or the portal.
6. **Live client dashboard (included)** — Give every homeowner a branded, always-current window into their job — status, docs, billing, and messages in one place.
7. **Texting + email that you can trust** — Two-way texting from your own number and email with delivery and read receipts, so "I never got it" stops costing you jobs.
8. **Reporting + one-click export** — See your pipeline, sales, and receivables at a glance — and export all your data in one click, free, any time.

*(Runners-up to reference if a slot opens: fuzzy search across the whole account; automations that fire the next task, text, or email off a milestone; open API + webhooks for the shops that want to build.)*

---

## 5. Honesty ledger — claims we CAN vs CANNOT (yet) make

### CAN make (day one, verifiable)
- **One responsive app** — the same product on phone and desktop; mobile does everything the desktop does. (Our build; single Next.js PWA per matrix §3.)
- **Transparent, all-in pricing** — full price list published on the site; texting, e-sign, client dashboards, reporting, and crew app included on every plan. (Our packaging decision.)
- **No seat-minimum contract; free one-click data export, no exit storage fee.** (Our terms.)
- **Live client dashboards bundled** — homeowner login live from first appointment through warranty, included on every plan. (Doc-12 §c; our build.)
- **Open API + webhooks in v1** — self-serve keys, read *and* write endpoints. (Matrix §3 item 14.)
- **Two-way texting and email with delivery/read receipts.** (Matrix §3 item 10.)
- **Good/better/best tiers natively in one estimate.** (Matrix §3 item 6.)
- **Measurement import via universal XML upload and a Hover connection.** (Matrix §3 item 5 — Hover is the one measurement integration on the open/self-serve track.)
- **QuickBooks Online sync** (customer/invoice/payment push + payment pull). (Matrix §3 item 13.)
- **Comparative facts about AccuLynx** — each factual, dated "as of 2026-07-16," and tied to a teardown source ref: that AccuLynx does not publish Pro/Elite or add-on pricing (`07 §5.1`, `S-PRICING-002/003`); that texting, e-sign, the customer portal, financing, analytics, and the crew app are separately priced add-ons (`S-PRICING-002/004`); that its published terms include per-user minimums, nonrefundable annual prepay, and a data-storage fee for departing accounts over 15 users (`S-PRICING-004`); that its portal invites go out after approval and access auto-expires at completion (`S-DIFF-018/019`). Reference price only via dated customer-review sentiment, quoted and cited — never as a stated AccuLynx price.

### CANNOT make yet (roadmap — say "designed to integrate with" / "planned," never imply a live partnership)
- **Live supplier ordering / account pricing / electronic order submission** (ABC Supply, SRS, QXO) — PARTNER-REQUIRED; day-one substitute is a contractor-owned price book + branded PDF/email order submission. BD applications run in parallel; do not imply a live supplier integration. (Matrix §4.)
- **Native measurement ordering from EagleView, GAF QuickMeasure, GeoSpan, RoofSnap, RoofScope** — partner-gated; only Hover + universal XML are day-one. Say "designed to integrate with EagleView" at most. (Matrix §4.)
- **Embedded consumer financing** (AccuFi-equivalent) — needs a lending partner; not in v1.
- **Sage Intacct sync, storm/hail data feeds** — partner/enterprise-gated; roadmap only.
- **The AI "does-the-work" features** (drafts the estimate, writes the supplement, tags every photo, semantic search) — these are the architectural thesis and the reason the v1 schema carries provenance, but they are **not** v1 line items. Do not headline them as shipping. Positioning may say Eaverow is *built AI-native* (architecture, present tense) but must not claim these specific AI workflows are live until they ship.
- **Offline-first mobile / native app / caller ID** — v2. The v1 app is a mobile-first PWA; don't promise offline.
- **Adjuster and property-manager dashboard logins** — the *homeowner* dashboard is v1 and bundled; role-scoped adjuster/PM views are v1.1. Frame multi-role as "designed to give adjusters and property managers their own view" unless/until it ships.

### `/vs-acculynx` page requirements (non-negotiable)
- Nominative use of the AccuLynx name only — plain text, no logo, no stylized rendering.
- Every comparative row: factual, dated "as of 2026-07-16," tied to a teardown source ref.
- Disclaimer present: **"AccuLynx is a trademark of its owner. Eaverow is not affiliated with or endorsed by AccuLynx."**
- No AccuLynx screenshots or UI reproductions anywhere.

---

## 6. CTA strategy — early access / founding customer

Eaverow is pre-launch. The CTA sells scarcity and partnership, not a free trial we can't yet staff.

- **Primary CTA:** **"Become a founding contractor"** — an early-access program, not a signup wall. Framing: a limited group of roofing companies who get in first, get founding pricing locked, and get a direct line to shape the product.
- **What the founding offer promises (all things we control, all in the CAN ledger):** published founding-customer pricing held for the life of the account; everything bundled (no add-on surprises); free one-click data export from day one (so joining carries no lock-in risk); hands-on onboarding and a direct product-feedback channel.
- **Secondary CTA:** **"See a live dashboard"** — a guided walkthrough / demo of the live client dashboard on a Vantrow client account. This is the headline hook made tangible; lead the demo with the dashboard, not a feature tour.
- **Tertiary CTA (low-commitment):** **"Get launch updates"** — email capture for contractors not ready to commit.
- **Honesty guardrails on CTAs:** don't imply general availability, a free trial, or signed integrations. "Founding" and "early access" language keeps the pre-launch status truthful. Don't put a competitor name in any ad copy or display URL.

---

Prepared under docs/legal/clean-room-protocol.md.

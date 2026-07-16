# 07 — AccuLynx Pricing & Packaging Intelligence

**Date:** 2026-07-16 · **Status:** Complete (public sources only)
**Sources log:** `docs/research/acculynx/sources/pricing.md` (IDs `S-PRICING-###`)

## 1. Posture summary

AccuLynx publishes exactly one price: the entry **Essential plan at $250/month** [S-PRICING-001][S-PRICING-002]. Everything else — Pro and Elite tier pricing, all nine add-ons, payment-processing rates, and any setup fees — is quote-only behind a sales form [S-PRICING-003][S-PRICING-014]. The underlying commercial model is **per-user monthly licensing with a contractual minimum user count**, confirmed by their own public terms and conditions [S-PRICING-004]. Third-party per-user estimates are scattered ($55 to $300/user/mo across sources) and none traces to a primary source, so no specific per-user figure is safe to repeat publicly.

## 2. What AccuLynx itself publishes (HIGH reliability)

| Fact | Detail | Source |
|---|---|---|
| Entry price | Essential plan listed at $250/mo (only published price; promoted as a "new" plan with demo swag incentive through 2026-07-31) | [S-PRICING-001][S-PRICING-002][S-PRICING-003] |
| Tiers | Essential → Pro → Elite. Pro/Elite quote-only. Essential = core CRM/estimating/ordering; Pro adds automation, financial mgmt, deeper reporting; Elite adds multi-location, custom workflows, insurance-restoration tooling | [S-PRICING-002] |
| Billing unit | Monthly **per-user** fees; terms reserve the right to adjust per-user, add-on, and storage fees with advance notice | [S-PRICING-004] |
| Minimum users | A base minimum user count applies; customer owes the base minimum even if users are removed below it; extra users beyond the subscribed count are billed additionally | [S-PRICING-004] |
| Contract options | Both monthly auto-renewing and prepaid annual terms exist; marketing pages emphasize a monthly option with "no contracts"; annual terms auto-convert to standard monthly rates at expiry | [S-PRICING-002][S-PRICING-004] |
| Cancellation | 30-day advance notice before end of the current billing period (monthly or annual); prepaid annual fees are nonrefundable | [S-PRICING-004] |
| Exit friction | Accounts with base user count >15 that cancel are charged a recurring monthly **data-storage fee** to retain account access | [S-PRICING-004] |
| Add-ons (9, all unpriced) | AccuPay (payments), SmartDocs (docs/eSign), Text Messaging, Customer Portal, AccuFi (consumer financing), ReportsPlus, DataMart (analytics), Mobile Crew App, AppConnections; billed as one-time or recurring fees at activation; 30-day notice to cancel an add-on | [S-PRICING-002][S-PRICING-004][S-PRICING-014] |
| Payments (AccuPay) | Per-transaction fee varying by payment type (card vs ACH); rates unpublished, quote-only; merchants may pass the fee to the homeowner as an invoice line item; next-business-day funding; no volume caps | [S-PRICING-005] |
| Compliance enforcement | Retroactive backcharge formula for unlicensed user access: (# of 30-day periods) × (# unauthorized users) × then-current monthly fee | [S-PRICING-004] |
| Included services | Marketing states training, implementation, and live support are included on all plans; no setup fee is mentioned (in either direction) on public pages | [S-PRICING-002] |
| Free trial | None advertised; demo-first sales motion | [S-PRICING-001][S-PRICING-006] |

## 3. Dated third-party & customer-reported price points

| # | Data point | Date of claim | Source (type) | Reliability |
|---|---|---|---|---|
| 1 | ~$299/mo starting cost for small teams; $1,000+/mo for larger companies | 2025-04 (upd. 2025-10) | Hook Agency blog (roofing-marketing vendor) [S-PRICING-008] | MED |
| 2 | $55–$75+/user/mo; onboarding $500–$1,200; example: 10 users @ ~$65 ≈ $650/mo; contractors report ~5–10% annual price increases | 2025-02-25 | Projul blog (**competitor** — bias flag) [S-PRICING-009] | LOW-MED |
| 3 | "Annual contracts required; month-to-month unavailable or at a premium" | 2025-02-25 | Projul blog [S-PRICING-009] | LOW — contradicted by AccuLynx's 2026 "monthly, no contracts" language [S-PRICING-002]; possibly outdated or wrong |
| 4 | $60–$120/user/mo circulating across aggregator sites; article itself flags this range as unverifiable to any primary source | 2026-04-02 | RoofingSoftwareGuide pricing guide [S-PRICING-006] | LOW (as a figure); MED (as a description of the evidence landscape) |
| 5 | Estimated all-in scenarios: 1–3 users $350–$450/mo; 5–10 users (Pro) $900–$1,400/mo; 20+ users (Elite+DataMart) $2,000–$3,000/mo; implementation $500–$1,000 small / $3,000–$5,000 enterprise | 2026-04-02 | RoofingSoftwareGuide [S-PRICING-006] | LOW-MED (explicitly labeled estimates) |
| 6 | $165–$300/user/mo; 20-user shop ≈ $42k/yr | 2026 | BuilderLync review (**competitor** — bias flag; via search snippet) [S-PRICING-018] | LOW |
| 7 | $100–$120/user/mo at 1–10 users, falling to $60–$80/user at 100+ users | 2026 | Oreate AI blog aggregating Reddit chatter (AI content farm; via snippet) [S-PRICING-019] | LOW |
| 8 | Setup/onboarding fees "a few hundred dollars to over a thousand," scaling with data migration and training depth; up to ~$5,000 for large rollouts | 2026 | FieldServiceGuide + ITQlick (both bot-blocked; via search snippets) [S-PRICING-016][S-PRICING-017] | LOW |
| 9 | Comparator anchors: JobNimbus ~$225/mo base (~$25–$75/user by role, texting add-on $49–$249/mo); Roofr $99–$169/mo + $13–$19/measurement report | 2026-04-13 | RoofingSoftwareGuide roundup [S-PRICING-007] | MED |

**Convergence note (INFERENCE):** the spread collapses if newer figures reflect the 2026 packaging: a ~$250–$300/mo floor for small teams, per-user pricing that most credible sources put somewhere in the $55–$120/user/mo band before add-ons, volume discounts at scale, and real-world totals meaningfully above quoted base price once add-ons land. Treat the band as directional only.

## 4. Customer voice on pricing (verbatim, reviews only)

| Quote | Reviewer / context | Date | Source |
|---|---|---|---|
| "The pricing is a bit on the higher side, but for us, it's been worth it" | Andrea A., Controller, 11–50 employees | 2026-05-01 | Capterra [S-PRICING-010] |
| "The price of can be a tough pill to swallow but I must be fair in stating that it is well worth that price and is still cheaper than Service Titan" | Greg H., CEO, construction | 2026-04-16 | Capterra [S-PRICING-010] |
| "[AccuLynx] can get a bit pricey as your company grows and you have to start adding more users" | Rebekah M., Bookkeeper | 2026-03-27 | Capterra [S-PRICING-010] |
| "It can get a little pricey but you really do get what you pay for" | Lyla H., Administrator, 2+ yrs on product | 2025-11-12 | Capterra [S-PRICING-010] |
| "The pricing continues to increase without any new features. All new features are additional cost to implement, and they are all expensive. And they have increased the price on all the add on features as well. It is just too expensive especially for a small business with only 2-3 users" | Reviewer, small business (via search snippet) | undated | Software Advice/Capterra [S-PRICING-012] | 
| Cancelled "because they nickel and dime for very basic features such as docusigns, using their portals for client services, etc." | G2 reviewer (via search snippet) | undated | G2 [S-PRICING-013] |
| "I'm so pissed at AccuLynx Pricing and how they nickel and dime you" | Mitch Willis, roofer (third-party-collected) | ≤2025-10 | via Hook Agency [S-PRICING-008] |
| "To be honest, that's not bad with 31 users" | Stuart Queiroz, roofer (third-party-collected, positive) | ≤2025-10 | via Hook Agency [S-PRICING-008] |

**Pattern:** the dominant complaint is not the base price — it is (a) per-user fees taxing growth, (b) essentials-as-add-ons (eSign, texting, portal), and (c) repeated price increases on existing add-ons. Positive reviewers frame it as "expensive but worth it," often anchored against ServiceTitan.

## 5. What we can honestly claim publicly

Per `docs/legal/comparative-advertising-checklist.md`: factual, current, dated, sourced.

**Supported (with "as of <date>" hedge + citation):**
1. "AccuLynx does not publish pricing for its Pro or Elite plans or any of its add-ons; quotes require contacting sales." (As of July 2026.) [S-PRICING-002][S-PRICING-003][S-PRICING-014]
2. "AccuLynx's published entry plan (Essential) is listed at $250/month." (As of July 2026.) [S-PRICING-001][S-PRICING-002]
3. "AccuLynx licenses per user, with a contractual minimum user count, per its published terms." [S-PRICING-004]
4. "Text messaging, e-signature documents, the customer portal, financing, analytics, and the crew mobile app are optional add-ons on AccuLynx, priced separately." [S-PRICING-002][S-PRICING-004]
5. "AccuLynx's published terms provide that prepaid annual fees are nonrefundable, cancellation requires 30 days' notice, and departing accounts with more than 15 base users owe a monthly data-storage fee to retain data access." [S-PRICING-004]
6. Attributed review sentiment: "reviewers on Capterra/G2/Software Advice report add-on costs and per-user growth costs as their top pricing complaint" — with quotes cited as above. [S-PRICING-010][S-PRICING-012][S-PRICING-013]
7. If our pricing is flat/unlimited-user or fully published: "unlike AccuLynx, our full price list is public" is supportable. [S-PRICING-002][S-PRICING-003]

**NOT supported — do not claim:**
- Any specific AccuLynx per-user dollar figure ("AccuLynx costs $X/user"). Estimates range $55–$300/user/mo with no primary source; the most repeated band ($60–$120) traces partly to a lookalike scam domain (see Unknowns).
- "AccuLynx requires annual contracts" — their current public pages say a monthly no-contract option exists [S-PRICING-002]; the annual-contract claim is a stale competitor assertion [S-PRICING-009].
- "AccuLynx charges $X in setup/onboarding fees" — third-party estimates only; official pages say training/implementation are included and mention no setup fee [S-PRICING-002].
- Any AccuPay processing-rate comparison — rates are unpublished [S-PRICING-005].
- Any total-cost-of-ownership percentage claim ("save 40% vs AccuLynx") — TCO scenarios in circulation are explicitly estimates [S-PRICING-006].
- "AccuLynx keeps raising prices" as a factual assertion — supportable only as attributed customer opinion, quoted and cited.

## 6. Product/GTM implications for us (INFERENCE)

- Publishing a full price list is a direct differentiator; competitor blogs already weaponize AccuLynx's opacity.
- Bundling eSign/texting/portal into base tiers attacks the #1 documented complaint (add-on nickel-and-diming).
- Flat or role-tiered pricing (cf. JobNimbus role pricing [S-PRICING-007]) blunts the per-user growth tax that reviewers resent.
- Clean exit terms (data export free, no post-cancellation storage ransom) counters a documented lock-in mechanism [S-PRICING-004].

## Unknowns

- **Actual Pro/Elite per-user prices, discount curves, and floor/ceiling** — quote-only; no reliable public figure exists. We price our own tiers from our economics, not from guesses about theirs.
- **Add-on price points** (SmartDocs, texting, portal, DataMart, ReportsPlus, Crew App, AppConnections) and whether texting is per-seat, per-message, or flat — unpublished everywhere credible.
- **AccuPay rates** (card % / ACH fee) and any monthly gateway fee — unpublished.
- **Whether a setup/onboarding fee is currently charged** — official pages imply included implementation; third parties report $500–$5,000. Unresolved conflict.
- **Actual annual-vs-monthly price differential** and negotiated-discount behavior — no public data.
- **Reddit ground truth:** direct Reddit thread access was blocked in our environment and searches surfaced only aggregator retellings, so no first-hand forum price reports could be verified. Bot-blocked: TrustRadius pricing page, ITQlick, FieldServiceGuide (403s; snippets only, marked LOW).
- A lookalike domain (`www-acculynx.com`, hyphen not dot) publishes fake "AccuLynx pricing" pages; it was excluded as a source, but its $60–$120/user figures have contaminated aggregator sites — one more reason not to repeat that band publicly.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

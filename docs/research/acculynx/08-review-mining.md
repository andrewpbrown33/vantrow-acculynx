# 08 — Review Mining: What AccuLynx Customers Actually Say

**Date:** 2026-07-16 · **Method:** Public review platforms only (no logins, no paywalls). Source refs `[S-REVIEWS-xxx]` resolve in `sources/reviews.md`.

## Sample and honesty notes

- **Read individually (full or near-full text): ~75 reviews** — Capterra pages 1–3 (~60) [S-REVIEWS-001..004], Apple App Store "AccuLynx Field" (10) [S-REVIEWS-007], SoftwareFinder (3) [S-REVIEWS-018], SoftwareConnect (2) [S-REVIEWS-017].
- **Additional fragments (~25)** recovered via search snippets from bot-blocked platforms: G2 [S-REVIEWS-006], Trustpilot [S-REVIEWS-009], TrustRadius [S-REVIEWS-010], Google Play [S-REVIEWS-008], Reddit r/Roofing (secondhand) [S-REVIEWS-011], roofer Facebook groups (republished) [S-REVIEWS-012].
- **Platform aggregates the sample sits inside:** Capterra/SoftwareAdvice shared pool 846 reviews, 4.6/5 (distribution 530×5★ / 277×4★ / 26×3★ / 8×2★ / 5×1★; sub-scores: ease-of-use 4.4, support 4.7, value 4.2, functionality 4.3) [S-REVIEWS-005]; Apple App Store 3.9/5 across 583 ratings [S-REVIEWS-007]; Google Play ~4.2 [S-REVIEWS-008]; Trustpilot ~4/5 across 91 reviews [S-REVIEWS-009]; G2 ~4.2/5 (count unverifiable — page bot-blocked; seller profile shows 36 seller-level reviews) [S-REVIEWS-006][S-REVIEWS-027].
- Review platforms skew positive (verified-buyer programs, vendor solicitation). The negative tail (Trustpilot 1–2★, App Store 1★, Facebook groups) is where churn language lives — weighted accordingly below.
- Frequencies below = count within the ~75 individually read reviews, plus a platform-level note where snippet evidence extends the theme.

## (a) Pain-point table

| # | Pain point | Frequency | Severity | Representative verbatim (customer reviews only) | Maps to module |
|---|---|---|---|---|---|
| P1 | **Mobile field app is a second-class product** — crashes/freezes, failed photo uploads, can't build or edit estimates in-app, must force-close to switch jobs, session resets lose entered data (legacy app ejected users after ~5 seconds in background [S-REVIEWS-019]), features missing vs desktop | ~23 of ~75; dominant theme in all 10 App Store reviews; App Store 3.9 vs Capterra 4.6 gap [S-REVIEWS-007] | **Critical** — roofing is a field-first trade; named as a switch driver | "Have to force close and relaunch App to switch between jobs" (App Store, 2024-07-18) [S-REVIEWS-007]; "The app is terrible when it comes to photos" (Capterra, Michael C., 2025-11-12) [S-REVIEWS-001]; Play-store reviewer: "retry all" for failed uploads "hasn't worked once in over 4 years" [S-REVIEWS-008] | Mobile app |
| P2 | **Per-user pricing + add-on stacking ("nickel and dime")** — texting, SmartDocs, portal, DataMart, e-sign all extra; price raises without new features; whole company must adopt an add-on | ~11 of ~75, and the #1 complaint on every platform sampled [S-REVIEWS-006][S-REVIEWS-013] | **Critical** — the most-cited churn trigger (see §c) | "How much it cost per month per user for each add on" (Capterra, Sebastian M., 2026) [S-REVIEWS-001]; "cost is too high… repeatedly raised the price" (Capterra, Chris B., 2026-05-14) [S-REVIEWS-003]; G2 reviewer cancelled over paying extra "for very basic features such as docusigns" [S-REVIEWS-006] | Pricing/packaging, billing |
| P3 | **Feature regressions imposed on users** — message board removed Jan 2025 (broke insurance-claim history workflows); calendar redesign harder to read; invoicing update hid payments/deposits | 3–4 of ~75 directly; repeatedly echoed in aggregator round-ups [S-REVIEWS-013][S-REVIEWS-020] | **High** — regression anger converts loyalists into shoppers | "They are ruining this CRM by taking away the message board. There is no way to see a full chronological history of the claim without it." (customer review reproduced in [S-REVIEWS-020]); "The updated calendar… has made navigation more challenging, and the lack of a search function limits efficiency" (Capterra, Cathy C., 2025-12-03) [S-REVIEWS-002] | Comms/notes, scheduling, invoicing |
| P4 | **Weak search** — exact-match only, can't search calendar, can't search jobs by material, partial addresses fail, scroll-to-top to switch jobs | ~7 of ~75 + Trustpilot search-bar complaints [S-REVIEWS-009] | High | "you have to type in the exact spelling in order to pull up a customer" (Capterra) [S-REVIEWS-004]; property lookups "nearly impossible to find" (Capterra, Joshua B., 2025-11-13) [S-REVIEWS-003] | Search/navigation |
| P5 | **Estimating rigidity** — no good/better/best option tiers in one estimate, measurement changes force rebuilding every cloned estimate, inflexible templates, no photos inside estimates | ~6 of ~75 | High — hits the daily core workflow | "cannot do selections in the estimate… huge issue" (Capterra, Grant R.) [S-REVIEWS-001]; "Templates are not as flexible as you would like… you need to reflect that change in each cloned estimate" (Capterra, Laurence L., 2025-12-03) [S-REVIEWS-002] | Estimating |
| P6 | **Photo management friction** — uploads out of order, no crop/zoom, photo-report grouping poor, list position resets when browsing hundreds of photos | ~5 of ~75 | Medium | "The photos do not upload in order and are jumbled" (Capterra) [S-REVIEWS-004]; browsing "starts you over at [photo] 1051" (Capterra, Michael C.) [S-REVIEWS-001] | Photos/media |
| P7 | **Email reliability & visibility** — homeowners report never receiving emails/invoices; no delivered/read notification; occasional subject-only sends | ~4 of ~75 + GetApp summary flags "unreliable email functionality" [S-REVIEWS-015] | High — silent failure erodes homeowner trust | "Sometimes customer's say they never receive our emails" (Capterra) [S-REVIEWS-004] | Comms (email) |
| P8 | **Reporting clunky/slow** — inflexible layouts, inaccurate A/R averages, slow on large datasets (500+ jobs/yr per G2 snippet), deeper P&L wanted | ~3 of ~75 + recurring G2 theme [S-REVIEWS-006] | Medium-High | "Reporting is clunky" (Capterra, Ted S., 2026-05-14) [S-REVIEWS-003] | Reporting/BI |
| P9 | **Closed integration surface** — API described as a "closed garden" (partner-gated; support won't answer API questions); no Outlook/Apple-calendar sync; CompanyCam friction | ~4 of ~75 + recurring Reddit theme (secondhand) [S-REVIEWS-011][S-REVIEWS-029] | Medium-High for tech-forward shops | Reddit r/Roofing (secondhand): "closed garden" API "makes integrations limited and tedious" [S-REVIEWS-011]; "the closed API kills our ability to add functionality" (user quote reproduced in [S-REVIEWS-029]); "It doesn't integrate with Outlook" (Capterra, Adam F., 2026-04-17) [S-REVIEWS-001] | Integrations/API |
| P10 | **Automation gaps** — no cascading tasks (task B can't auto-create when task A completes); job-file areas siloed ("cannot talk to each other") | 2–3 of ~75, echoed in SoftwareAdvice summary [S-REVIEWS-005] | Medium | Digital locations "cannot talk to each other at all" (Capterra, Hollie G., 2026-04-16) [S-REVIEWS-003] | Automations |
| P11 | **Buggy updates / general glitches** — releases ship with defects; "weird glitches"; slow days | ~4 of ~75 + G2 snippet "updates occasionally introduce new bugs" [S-REVIEWS-006] | Medium | "System can be slow or have weird glitches" (Capterra, Betty O., 2025-11-13) [S-REVIEWS-003] | Platform quality |
| P12 | **Account-lifecycle hostility (churn stories)** — refund refusals, same-day-cancel charges, data-export promise not honored, persistent sales calls after "no" | ~5 distinct Trustpilot/BBB-referencing stories (snippet-level; direct page bot-blocked) [S-REVIEWS-009] | High severity, low frequency — but these are the loudest public complaints | "they promise they could retrieve all my files in case we cancel in a quick easy download. That did not happen." (Trustpilot, via snippet) [S-REVIEWS-009] | Billing, data export, sales practices |
| P13 | **Heavy for small teams** — onboarding/learning curve, overwhelming feature set, per-seat cost at 2–3 users | ~4 of ~75 + consistent aggregator framing [S-REVIEWS-013][S-REVIEWS-014] | Medium — defines the down-market gap | "too expensive especially for a small business with only 2-3 users" (SoftwareAdvice reviewer) [S-REVIEWS-013] | Onboarding, packaging |

Minor recurring nits (1–2 mentions each): can't open two tabs at once; can't rename a lead pre-approval; no per-user dashboard layouts; no account-level "flag"; no Spanish training; multi-trade projects handled poorly; commission requests limited to one per customer [S-REVIEWS-001][S-REVIEWS-003][S-REVIEWS-004].

## (b) Praise table — what we must match

| # | What customers love | Frequency | Representative verbatim | Module |
|---|---|---|---|---|
| L1 | **Everything about a job in one place** — docs, permits, photos, comms, financials in a single job file; "all-in-one" is the brand promise reviewers repeat back | Most-cited positive; ~30 of ~75 | "keeps everything organized in one place, from documents and permits to customer communication" (Capterra, Mandy K.) [S-REVIEWS-001] | Job file/CRM |
| L2 | **Support quality** — fast, human, stays on the problem; support sub-score 4.7/5 on Capterra pool [S-REVIEWS-005] | ~15 of ~75 | "customer service is ready to help within a minute or two!" (GetApp, Sarah H.) [S-REVIEWS-016]; "will stay with you until it's solved" (Capterra, Linda H.) [S-REVIEWS-001] | Support ops (not software) |
| L3 | **Ease of use on desktop** — intuitive, easy to train new staff | ~15 of ~75 | "User friendly Self Explanatory" (Capterra, Carly A.) [S-REVIEWS-001] | Web UX |
| L4 | **Measurement → estimate → material order flow** — EagleView/Hover pull-through, no re-keying, supplier ordering (ABC/SRS) in-platform | ~8 of ~75; called the moat in aggregators [S-REVIEWS-014] | "integration of hover app and eagleview…build estimates faster" (Capterra, Kevin G.) [S-REVIEWS-001]; "We don't have to re-enter the data" (SoftwareConnect, 2019) [S-REVIEWS-017] | Estimating, supplier ordering |
| L5 | **Photo documentation** — easy bulk upload by job number, storage, retention; TrustRadius rates photo documentation 9.6/10 [S-REVIEWS-010] | ~7 of ~75 | "Uploading photos [is the] standout feature" (Capterra, Hyrum S.) [S-REVIEWS-001] | Photos/media |
| L6 | **Pipeline visibility & accountability** — lead tracking, stage view, activity trail; Reports Plus praised where adopted | ~8 of ~75 | "reporting functionality…helps hold team accountable" (Capterra, Greg H.) [S-REVIEWS-001]; "Reports Plus [was] transformative" (Capterra, Julia C.) [S-REVIEWS-003] | CRM, reporting |
| L7 | **Time-savers in the job file** — copy estimates/photos/docs between jobs, e-sign tracking, payment collection in-platform | ~6 of ~75 | "ability to copy from one job to another—estimates, photos, documents" (Capterra, Andrea A.) [S-REVIEWS-001] | Job file, e-sign, payments |

**Marketing implication:** L1+L4 are the retention engine — reviewers who wire ordering/supplier workflow into the platform describe themselves as locked in ("We can't do business without it" [S-REVIEWS-017]; loyalty-once-ordering-is-built observation [S-REVIEWS-014]). Parity on L1/L4 plus a genuinely good mobile app (P1) is the wedge.

## (c) Churn triggers — why people leave, and where they go

| Trigger | Evidence | Destination(s) |
|---|---|---|
| Price increases + add-on stacking | "Leaving as we speak. I'm going back to JobProgress/leap. I'm so pissed at AccuLynx Pricing" (Mitch Willis, roofers' Facebook group, republished) [S-REVIEWS-012]; "We are also looking at other options. They are getting out of control." (Guillermo Molina Matus, same) [S-REVIEWS-012] | JobProgress/Leap, JobNimbus, ProLine [S-REVIEWS-012] |
| Field-app quality for mobile-first crews | Aggregators name mobile experience the top switch driver [S-REVIEWS-013][S-REVIEWS-014]; JobNimbus markets its 4.8★ field app against it (competitor-authored — bias flagged) [S-REVIEWS-021]; switch-guide traffic also cites buggy updates, email delivery failures, and no search-by-material as departure reasons (affiliate-authored — bias flagged) [S-REVIEWS-022] | JobNimbus, Roofr |
| Feature regressions (message board, calendar) | Regression quotes at P3; framed by aggregators as "harder to justify" moments [S-REVIEWS-020][S-REVIEWS-013] | Shopping behavior; destination unclear |
| Small/retail-focused teams outgrown by the price, not the product | "best for established large roofing businesses… small teams will find the ramp-up frustrating" (G2-derived summary) [S-REVIEWS-006] | Roofr, JobNimbus (free trial, bundled pricing) [S-REVIEWS-028][S-REVIEWS-021] |
| Billing/cancellation friction, data-export distrust | Trustpilot: same-day cancel still charged; refund withdrawn after BBB complaint; export promise unmet [S-REVIEWS-009] | Any — these reviews warn others off rather than name a destination |
| Guillermo Molina (GM Bros Roofing) switch story on video, 2026-02-05 | YouTube "Why We Switched to JobNimbus: A Roofer's Honest Review" [S-REVIEWS-025] (content not viewable in this environment; title/metadata only) | JobNimbus |

**Counter-flow (important honesty check):** the arriving traffic is bigger than the leaving traffic in the sampled reviews. Capterra "switched from" fields show migration *into* AccuLynx from JobNimbus, Roofr, ROOFLINK, Jobber, Contractors Cloud, Zoho, monday.com, Salesforce, MarketSharp, Act!, ServiceTitan [S-REVIEWS-001][S-REVIEWS-003][S-REVIEWS-004] — and one reviewer who left for Leap came back calling the departure the "biggest mistake ever" [S-REVIEWS-001]. INFERENCE: churn concentrates in (a) price-sensitive small shops and (b) mobile-heavy sales orgs; insurance-restoration back offices stay.

## (d) Recurring feature requests (ranked by recurrence in sample)

1. **Real mobile parity** — estimates, approvals, invoicing worksheets on the app (~10+ mentions) [S-REVIEWS-007][S-REVIEWS-003]
2. **Good/better/best option tiers in one estimate** (~4) [S-REVIEWS-001][S-REVIEWS-003]
3. **Fuzzy/partial search + calendar search + search by material** (~6) [S-REVIEWS-002][S-REVIEWS-003][S-REVIEWS-004]
4. **Cascading task automation** (auto-create next task on completion) (~3) [S-REVIEWS-003][S-REVIEWS-005]
5. **Bundled comms** — texting/e-sign/portal included, not add-ons (~5) [S-REVIEWS-001][S-REVIEWS-006]
6. **Calendar restored/searchable + Outlook & Apple calendar sync** (~4) [S-REVIEWS-001][S-REVIEWS-002][S-REVIEWS-003]
7. **Commission/payroll depth** — cap-out sheets, per-job P&L incl. commissions, multiple commissions per customer (~3) [S-REVIEWS-003]
8. **Email delivery visibility** (delivered/read receipts) (~2) [S-REVIEWS-004]
9. **Photo tools** — ordered uploads, crop/zoom, tag-based report grouping (~4) [S-REVIEWS-003][S-REVIEWS-004]
10. **Per-user dashboard customization** (~2) [S-REVIEWS-003]
11. **Spanish-language training/UI** (~1, strategically notable for crew adoption) [S-REVIEWS-003]
12. **Restore threaded internal message board on the job file** (~3, post-removal) [S-REVIEWS-020]

## MVP implications (INFERENCE, ours)

Mobile-first parity (P1), transparent bundled pricing (P2), fast fuzzy search (P4), tiered estimates (P5), delivery-tracked comms (P7), and an open API (P9) attack the six loudest pains while matching L1/L4 table stakes. "We never remove features you built workflows on" (P3) and "your data exports in one click, always" (P12) are trust positions AccuLynx's own reviewers have pre-written for us.

## Unknowns

- **G2, Trustpilot, TrustRadius, JustUseApp, Google Play full text** — all bot-blocked (HTTP 403) or JS-rendered; only search-snippet fragments were recoverable. Exact G2 review count and complete negative-review texts unverified; no snippet was fabricated, but frequencies on those platforms can't be quantified.
- **Reddit threads unreachable from this environment** (reddit.com blocked); all Reddit sentiment here is secondhand via aggregators [S-REVIEWS-011] and should be treated as directional only.
- **YouTube comments not retrievable** (JS-rendered); two relevant videos are logged by title/date only [S-REVIEWS-025][S-REVIEWS-026].
- **Capterra sentiment percentages** (e.g., "68% negative on pricing") are platform-generated AI aggregates with unknown methodology [S-REVIEWS-002] — treated as weak signals.
- One GetApp review attributing a broken "QB integration" complaint appears mis-scraped (reviewer is a veterinarian referencing Digitail software) [S-REVIEWS-016] — excluded from analysis.
- **No public data exists on**: actual churn/renewal rates, NPS, support SLA internals, or AccuLynx's internal feature-request/roadmap voting (behind auth). We design these areas from first principles rather than guessing their behavior.
- Vendor counterclaims ("99.9% crash-free sessions", ratings up 30% since the 2023 app redesign) are AccuLynx-authored marketing/PR [S-REVIEWS-023][S-REVIEWS-024] and conflict with the sampled app-store record; both sides logged.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

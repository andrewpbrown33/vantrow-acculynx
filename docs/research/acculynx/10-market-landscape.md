# 10 — Market Landscape: Roofing & Exterior Contractor Software

**Prepared:** 2026-07-16 · **Method:** public sources only (marketing sites, published pricing pages, review sites, press releases, third-party analyses). Every claim carries a source ref resolving to `sources/market.md`. Pricing is as observed/reported on the access date and changes frequently — treat all figures as dated snapshots, not clearance for comparative ads (see clean-room protocol §7).

---

## 1. Market context

- AccuLynx (founded 2008, Beloit WI + Chicago) is the entrenched incumbent for insurance-restoration-heavy residential roofers and claims broader residential-roofing adoption than any rival (self-claim, unverified) [S-MARKET-038]. Its pricing is quote-based; third parties report roughly $100–$120/user/mo plus implementation fees, with an "Essential" entry plan reported around $250/mo [S-MARKET-032][S-MARKET-033]. It continues to ship (Spring 2026 release: UI modernization, revamped lead capture, pitch-based labor calculations) [S-MARKET-046].
- **Consolidation wave.** The category is rolling up fast: JobNimbus acquired proposal tool SumoQuote (closed Dec 2023) [S-MARKET-005]; Leap acquired and absorbed JobProgress [S-MARKET-011]; SalesRabbit absorbed RoofLink (late 2024) and acquired e-commerce vendor Roofle (Jan 6, 2026) [S-MARKET-019]; One Click Contractor merged with financing platform 1&Fund (Apr 2025) [S-MARKET-030]. **Note:** the task brief's premise "SumoQuote is in Roofr" is incorrect — SumoQuote belongs to JobNimbus; Roofr's proposal tool is home-grown [S-MARKET-005][S-MARKET-006].
- **Pricing opacity is the norm.** AccuLynx, JobNimbus, GiddyUp, ServiceTitan, Leap SalesPro, and One Click all hide pricing behind quote forms [S-MARKET-001][S-MARKET-015][S-MARKET-025][S-MARKET-010][S-MARKET-031]. Roofr, ProLine, Jobber, Housecall Pro, and RoofLink publish prices — and Roofr and ProLine market that transparency as a differentiator [S-MARKET-006][S-MARKET-028].
- **AI is mostly veneer so far.** Reviewers characterize AccuLynx and JobNimbus automation as rules-based triggers, not AI; AccuLynx markets "AI-powered lead intelligence" with little public documentation behind it [S-MARKET-034][S-MARKET-003]. The exceptions: ProLine sells AI voice agents, call scoring, and an AI insurance-estimate manager on its mid tier [S-MARKET-028]; ServiceTitan invests heavily in "Titan Intelligence" at enterprise pricing [S-MARKET-026]; SalesRabbit ships an AI buyer-score for canvassing [S-MARKET-047]; Roofr's core measurement product is ML-driven [S-MARKET-008].

## 2. Direct competitors

| Vendor | Positioning (one line) | Pricing model (as of Jul 2026) | Target segment |
|---|---|---|---|
| **JobNimbus** | Flexible roofing CRM built around drag-and-drop boards and customizable workflows; #2 mindshare behind AccuLynx | Quote-based; third-party estimates: $225–$550/mo base + $25–$75/user/mo + add-ons (texting $49–$249/mo) [S-MARKET-001][S-MARKET-002] | Small→mid residential roofing/exteriors, retail + storm |
| **Roofr** | Measurement-reports-first platform that grew a proposal/CRM layer around them; transparent flat pricing, unlimited users | Published: Starter free ($19/report); Measure+ $109–$169/mo; Essentials $209–$249/mo; Scale $299–$349/mo (lower = annual billing); $13/report on paid plans; add-ons: Instant Estimator $125–$149/mo, Sites $85–$99/mo. Pricing overhauled Mar 2026 [S-MARKET-006][S-MARKET-007] | Small retail residential roofers |
| **Leap (incl. JobProgress)** | In-home digital sales (SalesPro) plus CRM/job management inherited from JobProgress; hybrid retail/insurance | Published for CRM: Essential $79/mo, Team $298/mo, +$99/user/mo, 1-yr contract; SalesPro quote-based [S-MARKET-010] | Roofing + windows/doors/kitchen-bath remodelers with in-home sales teams |
| **GiddyUp** | All-in-one roofing CRM (canvassing → inspection → estimate → production) with supplier ties (promoted by QXO) | Quote-based; billed **per job** with unlimited users/locations/estimates [S-MARKET-015][S-MARKET-016] | Storm/insurance restoration crews |
| **RoofLink (SalesRabbit)** | Roofing CRM with built-in aerial roof drawing/measurement and auto material orders; now the production leg of the SalesRabbit platform | Published/reported: ~$120/user/mo flat, no per-measurement fees [S-MARKET-017][S-MARKET-018] | Small→mid roofers wanting measurement + CRM in one |
| **ProLine** | Sales-velocity roofing CRM with unlimited calling/texting and the most aggressive shipped-AI story (voice agents, call scoring, AI insurance-estimate manager) | Published: Good $497/mo, Better $797/mo (AI tier), Best $1,697/mo; 3 seats included; free entry plan also offered [S-MARKET-028][S-MARKET-048] | Growth-minded residential roofers with outbound sales culture |
| **One Click Contractor (+1&Fund)** | Sales-enablement platform for the in-home one-sit close: measurements in, estimate, presentation, e-sign, financing | Quote-based [S-MARKET-030][S-MARKET-031] | Retail home-improvement sales orgs (roofing, siding, windows) |
| **SumoQuote (JobNimbus)** | Proposal/estimate document builder for contractors; now JobNimbus's sales-document layer | Sold within JobNimbus ecosystem [S-MARKET-005] | Contractors wanting polished proposals |
| **SalesRabbit (+Roofle)** | Canvassing/field-sales platform expanding into full roofing journey: door-knocking, AI buyer scoring, instant online roof quotes (Roofle), production (RoofLink) | Published entry point ~$19/user/mo for canvassing tiers [S-MARKET-047][S-MARKET-019] | D2D sales teams; storm markets |
| **QuoteIQ / Exterio (fka Roof Chief)** | Newer low-cost all-in-one challengers marketing against per-user pricing and add-on creep | Published low flat rates on their sites [S-MARKET-043][S-MARKET-042] | Price-sensitive small contractors |

### Standout features vs AccuLynx, and weaknesses per reviews

| Vendor | Edge over AccuLynx | Weaknesses reported in reviews |
|---|---|---|
| **JobNimbus** | More customizable pipelines/boards; SumoQuote proposals; large integration marketplace [S-MARKET-003][S-MARKET-005] | Email system unreliable (formatting, delivery, tracking — cited as a reason to churn); mobile app slow/crash-prone to the point users open desktop in a browser; "Insights" reporting called weak; single-type contacts limit reporting; dual contact/job workflows confuse users; quote-based pricing + per-user stacking + surprise add-ons [S-MARKET-003][S-MARKET-004]. No built-in customer portal [S-MARKET-037] |
| **Roofr** | Transparent published pricing, unlimited users; cheap fast ML measurement reports; free tier as wedge [S-MARKET-006] | CRM depth thin for high lead volume (weak segmentation/automation); no native mobile app yet (browser/PWA); satellite coverage gaps block auto-reports on a meaningful share of roofs; QuickBooks Online sync not truly two-way [S-MARKET-008][S-MARKET-009] |
| **Leap** | Strongest in-home sales presentation flow; homeowner portal; live supplier pricing; Leap Pay [S-MARKET-010][S-MARKET-011] | Reviewers report bugs (wrong customer on appointments, jobs disappearing), inaccurate reporting unresolved for years, steep post-acquisition price increases, hard cancellations, and a long price-guide setup [S-MARKET-012][S-MARKET-013] |
| **GiddyUp** | Per-job billing = unlimited seats (inverts AccuLynx's per-user model); strong canvassing-to-production flow for storm work [S-MARKET-015][S-MARKET-014] | Reviewers call it convoluted and hard to change on the fly; limited reporting ("system-driven not report-driven"); no in-app pricing — leans on Xactimate; weak fit for large/complex projects [S-MARKET-015] |
| **RoofLink** | Built-in aerial measurement (no per-report fees) and auto material/work orders; flat published price [S-MARKET-017][S-MARKET-018] | No meaningful marketing tooling; reviewed as entry-level for small shops with simple needs; pricing/packaging not fully transparent in practice [S-MARKET-018] |
| **ProLine** | Shipped AI (voice agents in/out, call summaries/scoring, AI insurance-estimate manager, AI roleplay trainer); unlimited calling/texting; done-for-you setup [S-MARKET-028] | Dense/clunky interface and load-time complaints; smaller integration library; insurance-restoration workflows described as still maturing; top tiers are expensive for small crews [S-MARKET-029] |
| **One Click Contractor** | Purpose-built one-sit-close flow with financing now merged in (1&Fund) [S-MARKET-030] | Sales-only: no production/job management; needs a CRM behind it; pricing opaque [S-MARKET-031] |

## 3. Adjacent platforms (field-service generalists)

| Vendor | Positioning & pricing | Roofing fit per reviews |
|---|---|---|
| **Jobber** | SMB field-service OS; published pricing from ~$29–$39/mo solo (Core) up to team plans ~$169–$599/mo; polished client hub on all plans [S-MARKET-020][S-MARKET-021][S-MARKET-036] | Loved by small retail/repair roofers for ease of use, but no Xactimate, no supplement tracking, no adjuster workflows, no aerial-measurement or supplier integrations — reviewed as wrong tool for storm/insurance work [S-MARKET-022] |
| **Housecall Pro** | SMB home-services platform; published $59–$79 (Basic, 1 user), $149–$189 (Essentials, 5 users), $299–$329 (MAX) + add-on creep [S-MARKET-023] | No aerial-measurement integrations, no insurance/supplement workflow — reviewers rule it out for roofing specifically; limited custom fields and permissions [S-MARKET-024] |
| **ServiceTitan** | Enterprise trades platform pushing into roofing; quote-based, reported ~$245–$500+/tech/mo, $5k–$50k implementation, annual contracts; Titan Intelligence AI; deep supplier/measurement integrations [S-MARKET-025][S-MARKET-026][S-MARKET-027] | Reviewed as deepest ops platform but only sensible at ~15+ techs / $2M+ revenue; cost and implementation weight are the moat-sized weakness downmarket [S-MARKET-026][S-MARKET-027] |

**Segment map (INFERENCE from the above):** Jobber/Housecall Pro own the ≤10-person retail shop; AccuLynx/JobNimbus/GiddyUp own insurance-restoration mid-market; ServiceTitan owns the top; Roofr/ProLine/QuoteIQ attack from below on price transparency; Leap/One Click own the in-home-sales motion. Nobody cleanly owns "modern, cheap, AI-native, homeowner-transparent" for the 3–30-seat roofer.

## 4. Positioning-gap analysis — whitespace for us

Observed gaps, each tied to evidence above:

1. **Transparent, flat, low pricing with real depth.** The two credibility leaders (AccuLynx, JobNimbus) both hide pricing and monetize via per-user fees plus add-ons — the single most repeated review complaint across both [S-MARKET-002][S-MARKET-004][S-MARKET-033]. The transparent players are shallow (Roofr CRM depth [S-MARKET-009]) or expensive (ProLine $497+ [S-MARKET-028]). **Whitespace: published flat pricing + insurance-grade depth.**
2. **Live client dashboards as a default, not an upsell.** AccuLynx has a customer portal but third-party comparison reports it as a paid add-on on its top tier [S-MARKET-035][S-MARKET-036]; JobNimbus has none [S-MARKET-037]; Jobber includes a client hub on every plan and it is repeatedly praised [S-MARKET-036]. No roofing-native vendor makes a homeowner-facing live job dashboard (status, photos, documents, payments, messages) a headline, included-everywhere feature. **Whitespace: Jobber-grade homeowner experience + roofing-native workflow.**
3. **AI-native core, not bolted-on.** Reviewer consensus: AccuLynx/JobNimbus automation is rules-based; AccuLynx's AI marketing lacks documented substance [S-MARKET-034]. ProLine proves demand for AI (voice agents, AI insurance-estimate handling) but gates it at $797/mo behind a dated UI [S-MARKET-028][S-MARKET-029]; ServiceTitan gates AI behind enterprise pricing [S-MARKET-026]. **Whitespace: AI drafting of estimates/supplements/follow-ups and photo-based damage triage at SMB prices.**
4. **Mobile-first reliability.** Mobile is a top complaint for JobNimbus and AccuLynx alike, and Roofr still lacks a native app entirely [S-MARKET-003][S-MARKET-034][S-MARKET-008]. **Whitespace: field-first product quality as a wedge.**
5. **Simplicity without shallowness.** AccuLynx onboarding reportedly takes 4–8 weeks [S-MARKET-034]; GiddyUp is "convoluted" [S-MARKET-015]; Leap setup is long [S-MARKET-012]. Jobber wins reviews on ease but lacks roofing depth [S-MARKET-022]. **Whitespace: opinionated roofing workflow with hours-not-weeks onboarding.**
6. **Consolidation churn = switching windows.** Leap's post-acquisition price hikes and Roofr's March 2026 repricing generated documented customer irritation [S-MARKET-012][S-MARKET-007]; roll-ups (SalesRabbit, JobNimbus) create integration turbulence (INFERENCE). Migration tooling + price-lock guarantees can convert this churn.

**Risks to the thesis (INFERENCE):** AccuLynx's supplier integrations (ABC/SRS/Beacon) and Xactimate-adjacent workflows are partnership-gated moats [S-MARKET-039]; incumbents can re-badge AI quickly; measurement-report economics favor Roofr's scale.

## 5. Name-collision appendix (brand screen input)

All product/company names encountered in this space during research. First-pass screen list only — not legal clearance (protocol §5).

**Direct CRM/job-management:** AccuLynx · JobNimbus · Roofr · Leap · JobProgress · GiddyUp · RoofLink · ProLine · One Click Contractor · SumoQuote · QuoteIQ · Exterio (fka Roof Chief) · Projul · Workhand · iRestore · Followup CRM · Contractor Foreman · Buildertrend · Agiled · OneCrew · Zuper · Repair-CRM · FieldCamp
**Field service (adjacent):** Jobber · Housecall Pro · ServiceTitan
**Measurement/estimating:** EagleView · Hover · RoofSnap · iRoofing · Pitch Gauge · RoofScope · GAF QuickMeasure · Xactimate (Verisk) · Estimating Edge · OneClick Code · Renoworks
**Canvassing/sales:** SalesRabbit · SPOTIO · HailTrace · Roofle (RoofQuote PRO) · Ingage · Enzy (INFERENCE — seen in prior industry reading, not re-verified this pass)
**Photos/field docs:** CompanyCam
**Financing/payments:** 1&Fund · Leap Pay · AccuPay (AccuLynx)
**Suppliers/distribution tech:** ABC Supply · SRS Distribution · Beacon PRO+ · QXO
**Review/affiliate sites seen (avoid confusion, not competitors):** Roofing Software Guide · BuilderLync · Contractor ToolStack · Contractor Software Hub · Hook Agency · Roofing Insights · RoofersCoffeeShop · Toricent Labs · CostBench · Field Service Guide · SchedulingKit · FirmSuggest
Naming implication: avoid "Roof-/Acc-/Job-/-Lynx/-Link/-Nimbus/-Pro(-Line)/Quote-/Leap-" patterns — the space is saturated with them [S-MARKET-039][S-MARKET-040][S-MARKET-041][S-MARKET-043][S-MARKET-044][S-MARKET-045].

## Unknowns

- **True street pricing** for AccuLynx, JobNimbus, GiddyUp, Leap SalesPro, One Click, and ServiceTitan: all quote-based; figures above are third-party/customer-reported and may be stale or negotiated. We must not design our pricing page around guessed competitor numbers.
- **Roofr seat limits:** Roofr's own pricing page markets unlimited users, while a third-party review of the March 2026 repricing describes per-plan seat caps (5/10) [S-MARKET-006 vs S-MARKET-007]. Unresolved conflict; verify before any comparative claim.
- **Actual AI capabilities** behind AccuLynx's "AI-powered lead intelligence" and JobNimbus AssistAI: no public technical documentation found; we design our AI features from customer problems, not from assumptions about theirs.
- **Retention/market-share data:** no public churn, ARR, or seat-count figures for any private vendor; "market leader" claims are all self-reported.
- **Customer-portal adoption:** whether AccuLynx portal usage is widespread among its base is unobservable from outside; our "live client dashboard" wedge sizing relies on review-signal, not usage data.
- **Bot-blocked surfaces:** G2/Capterra full review corpora were sampled via search snippets and secondary roundups rather than exhaustive page-by-page reads; per-vendor star ratings/counts were therefore omitted where sources conflicted.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

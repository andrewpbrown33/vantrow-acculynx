# AccuLynx — Product Overview (Clean-Room Research)

**Doc:** 01-product-overview | **Prepared:** 2026-07-16 | **Method:** public sources only (marketing site, public API docs, press, review sites, search snippets of the public knowledge base). All descriptions are written in our own words; short factual feature/role names are used nominatively. Source refs `[S-OVERVIEW-NNN]` resolve to `docs/research/acculynx/sources/overview.md`.

---

## 1. Positioning & Tagline Themes (paraphrased)

| Theme | Our paraphrase of the message | Source |
|---|---|---|
| Category leadership | Sells itself as the top-ranked roofing software / "#1 Roofing CRM"-style claims | [S-OVERVIEW-001] [S-OVERVIEW-002] |
| Measurable ROI | Homepage leads with outcome numbers: ~9 hours saved per user per week and ~32% average profit growth after the first year (vendor claims, unaudited) | [S-OVERVIEW-001] |
| All-in-one | One system covering sales, production, and finance so contractors stop stitching tools together; single login from lead to final invoice | [S-OVERVIEW-001] [S-OVERVIEW-013] |
| Field–office link | Real-time connection between field staff/crews and the back office | [S-OVERVIEW-001] |
| Roofing-exclusive | Built only for (residential) roofing contractors since 2008 — not a generic construction tool adapted to roofing | [S-OVERVIEW-002] [S-OVERVIEW-014] |
| Proof by scale | Thousands of contractor customers; $50B+ in contracts claimed to have run through the platform | [S-OVERVIEW-002] |
| Service as moat | Free 1:1 onboarding/training and live US support are marketed as core product | [S-OVERVIEW-014] |

## 2. Ideal Customer Profile (as marketed + as reviewed)

| Dimension | Observed | Source |
|---|---|---|
| Primary trade | Residential roofing contractors | [S-OVERVIEW-001] [S-OVERVIEW-014] |
| Secondary trades | Gutters, siding, windows, solar, painting (supported, not the pitch) | [S-OVERVIEW-014] |
| Work mix | Both insurance restoration and retail; the product's data model is visibly insurance-first (adjuster, claim/insurance fields, supplements are first-class API resources) | [S-OVERVIEW-001] [S-OVERVIEW-009] [S-OVERVIEW-027] |
| Company size | Marketed floor of ~3 users up to multi-location operations with hundreds of users | [S-OVERVIEW-014] |
| Reviewer base | Capterra reviewers skew heavily small-business, ~97% construction | [S-OVERVIEW-025] |
| Best-fit per third parties | Established/storm-restoration companies doing volume (e.g., 200+ jobs/yr); ramp-up considered heavy for very small teams | [S-OVERVIEW-027] [S-OVERVIEW-028] |
| Geography | US + Canada | [S-OVERVIEW-002] |
| Price posture | Premium, quote-based (no published pricing). Third-party 2026 reviews report ~$55–85/user/mo, tiered plans (names like "Essential"/"Pro" reported) plus paid add-ons (SmartDocs, AccuPay, Crew App); one review models a 20-person shop at ~$42k/yr. Treat all pricing as dated third-party reports, not vendor-published fact. | [S-OVERVIEW-027] [S-OVERVIEW-028] |

## 3. Module Map (top-level product areas)

Marketing nav groups the product as **Sales/CRM · Production · Finance · Business Management**, plus add-on "solutions," portals, and mobile apps [S-OVERVIEW-001] [S-OVERVIEW-013].

| Area | Module / feature | What it does (our words) | Source |
|---|---|---|---|
| Sales/CRM | Lead & pipeline management | Lead and Prospect records tracked through a pipeline to signed contract | [S-OVERVIEW-013] [S-OVERVIEW-021] |
| Sales/CRM | Lead Intelligence | AI lead scoring (rank bar on Lead/Prospect records) powered by third-party prediction vendor Faraday | [S-OVERVIEW-018] [S-OVERVIEW-019] |
| Sales/CRM | Aerial measurements | In-app ordering from EagleView, Hover, GeoSpan, GAF QuickMeasure | [S-OVERVIEW-013] |
| Sales/CRM | Estimating | Template-based estimates from measurements; tiered good/better/best via "Smart Fields"; pitch-based labor rates; lump-sum display | [S-OVERVIEW-013] [S-OVERVIEW-015] |
| Sales/CRM | SmartDocs + eSign | Generates estimates/proposals/contracts/change orders/lien waivers with e-signature | [S-OVERVIEW-022] |
| Sales/CRM | Lead API / intake | Automated lead import from web forms and external apps; CallRail integration | [S-OVERVIEW-013] [S-OVERVIEW-017] |
| Sales/CRM | Calendars & appointments | Scheduling with appointment-outcome tracking and an Appointments Report; Outlook/iCalendar sync | [S-OVERVIEW-015] [S-OVERVIEW-017] |
| Sales/CRM | Text messaging | SMS communication/automation (paid add-on per reviews) | [S-OVERVIEW-013] [S-OVERVIEW-028] |
| Production | Workflow Manager | Milestones → custom statuses → checklist items per job, with timestamps, notifications, and a cross-job Progress view | [S-OVERVIEW-020] |
| Production | Material ordering | Live supplier catalogs and ordering: ABC Supply, SRS Distribution, QXO | [S-OVERVIEW-013] |
| Production | Labor/crew management | Labor Orders dispatched to crews/subs; Crew App with GPS check-in/out | [S-OVERVIEW-024] |
| Production | Job documentation | Photos/videos with tags and annotation; document folders; permits, supplements, mortgage-check tracking | [S-OVERVIEW-013] [S-OVERVIEW-009] |
| Production | Live activity feed | Company-wide stream of job updates | [S-OVERVIEW-013] |
| Finance | Financial Worksheet | Per-job financial hub auto-populated from estimates; profitability and A/R aging | [S-OVERVIEW-020] |
| Finance | Invoicing & AccuPay | Invoice Worksheet builds invoices from the Financial Worksheet; AccuPay processes payments | [S-OVERVIEW-020] [S-OVERVIEW-013] |
| Finance | Accounting integrations | QuickBooks; Sage Intacct (expanded 2025) | [S-OVERVIEW-013] [S-OVERVIEW-017] |
| Finance | Job costing & commissions | Revenue/expense tracking, P&L forecasting, automated rep commission calculation | [S-OVERVIEW-013] |
| Business Mgmt | Reporting | Pre-built sales/production/finance reports; ReportsPlus custom reporting (add-on) | [S-OVERVIEW-013] |
| Business Mgmt | DataMart | Enterprise analytics/warehouse-style access to company data (launched Oct 2025) | [S-OVERVIEW-017] |
| Business Mgmt | Multi-location | Cross-branch performance views; "portfolio" solutions for company groups | [S-OVERVIEW-013] |
| Business Mgmt | Automation Manager | Rules-based triggers/automations (no ML) | [S-OVERVIEW-030] [S-OVERVIEW-027] |
| Business Mgmt | Custom Fields Manager | User-defined fields on contacts and jobs, exposed via API (Spring 2026) | [S-OVERVIEW-015] |
| Customer-facing | Customer Portal | Homeowner-facing project status, payments, financing, messaging | [S-OVERVIEW-013] |
| Mobile | Field App | Sales/field staff app; mobile estimating and proposal packets (2025 updates) | [S-OVERVIEW-017] [S-OVERVIEW-024] |
| Mobile | Crew App | Crews/subcontractors app: labor order details, docs, photos, messages, checklists, GPS check-in | [S-OVERVIEW-024] |
| Platform | App Connector / REST API v2 + webhooks + Zapier | Public REST API (bearer-token API keys), ~24+ webhook event types, Zapier connector | [S-OVERVIEW-009] [S-OVERVIEW-010] [S-OVERVIEW-011] [S-OVERVIEW-031] |

## 4. Organizational Model (companies, locations, users, roles)

| Concept | What public sources show | Source |
|---|---|---|
| Account ↔ location | An account maps to a company location; multi-location organizations must connect **each location to the API individually** — suggesting locations are separate account instances federated by reporting rather than one tenant. INFERENCE: no public evidence of a true parent-company entity inside the app. | [S-OVERVIEW-010] |
| Admin tiers | "Company Administrator" and "Location Administrator" roles referenced in KB snippets; company admins issue API keys | [S-OVERVIEW-008] [S-OVERVIEW-010] |
| Role types | Permissions set by role type for owners, managers, sales reps, office staff; KB training tracks exist for Administrator, Manager, Office, Sales roles | [S-OVERVIEW-008] |
| Permission granularity | Role-based gating of pricing, margins, and job-level financials (office sees all; field sees less) | [S-OVERVIEW-008] [S-OVERVIEW-027] |
| Subcontractor access | Subs get scoped, time-limited visibility into selected Job File content via labor orders / Crew App | [S-OVERVIEW-023] [S-OVERVIEW-024] |
| Licensing | Per-user pricing reported by third parties; minimum ~3 seats marketed. INFERENCE: seat-based licensing with add-on modules priced separately. | [S-OVERVIEW-014] [S-OVERVIEW-027] [S-OVERVIEW-028] |

## 5. Terminology Glossary (short factual labels)

| AccuLynx term | Meaning (our words) | Source |
|---|---|---|
| Lead / Prospect | Distinct early pipeline record stages before an approved job | [S-OVERVIEW-019] [S-OVERVIEW-021] |
| Job / Job File | The central record per project; "Job File" is the container (overview screen, docs, photos, messages, financials) | [S-OVERVIEW-008] [S-OVERVIEW-009] |
| Milestone | Top-level lifecycle stage of a job; pipeline stages observed in public materials: Lead, Prospect, Approved, Completed, Invoiced (full default list unverified — see Unknowns) | [S-OVERVIEW-021] [S-OVERVIEW-012] |
| Status / Checklist item | Custom sub-steps inside a milestone, with per-status checklists (requires custom workflows enabled) | [S-OVERVIEW-020] [S-OVERVIEW-012] |
| Next Steps panel / Progress view | Job File header showing current milestone/status; cross-job completion tracker | [S-OVERVIEW-021] [S-OVERVIEW-020] |
| Financial / Invoice / Contact Worksheet | Per-job financial hub; invoice builder; legacy predecessor worksheet | [S-OVERVIEW-020] |
| Estimate → Sections → Items | Estimate structure; Amendments and Supplements are separate financial documents (supplements = insurance scope additions) | [S-OVERVIEW-009] |
| Labor Order / Material Order | Work dispatched to crews/subs; supplier purchase orders | [S-OVERVIEW-024] [S-OVERVIEW-013] |
| Job Messages | Threaded per-job communication | [S-OVERVIEW-009] |
| Job Categories / Trade Types / Work Types / Lead Sources / Account Types | Company-configurable classification lists on jobs | [S-OVERVIEW-009] |
| Adjuster / Insurance fields | First-class insurance-claim metadata on jobs (adjuster, insurance company) | [S-OVERVIEW-009] |
| SmartDocs, AccuPay, ReportsPlus, DataMart, App Connector, Automation Manager, Lead Intelligence, Field App, Crew App, Customer Portal, Live Feed | Branded names for: doc automation, payments, custom reporting, analytics warehouse, API/integration hub, rules automation, AI lead scoring, sales mobile app, crew mobile app, homeowner portal, activity stream | [S-OVERVIEW-013] [S-OVERVIEW-022] [S-OVERVIEW-024] |

## 6. Company Facts

| Fact | Detail | Source |
|---|---|---|
| Founded | 2008, by Rich Spanton (Jr.), to run roofing contracting businesses | [S-OVERVIEW-002] |
| Entity | ExactLogix, Inc. d/b/a AccuLynx.com | [S-OVERVIEW-007] |
| HQ / offices | Beloit, WI (705 3rd St) and Chicago, IL (230 W. Monroe St) | [S-OVERVIEW-002] |
| Leadership | Mike Stein CEO (appointed 2016); founder Rich Spanton as Chairman | [S-OVERVIEW-029] |
| Employees | "Hundreds" (vendor claim; no exact public figure) | [S-OVERVIEW-002] |
| Scale claims | Vendor: thousands of contractors, US + Canada; $50B+ contracts managed; "more residential roofing contractors than any other roofing software." Third-party reviews cite 10,000+ companies (unverified). | [S-OVERVIEW-002] [S-OVERVIEW-027] |
| Ownership | Privately held, founder-led. No institutional PE ownership confirmed in public sources (checked; see Unknowns). | [S-OVERVIEW-007] [S-OVERVIEW-003] |
| Verisk deal | Verisk agreed 2025-07-30 to acquire for $2.35B cash; FTC extended review (second request Oct 2025); Verisk terminated 2025-12-29 after the 2025-12-26 drop-dead date passed; redeemed $1.5B of acquisition notes | [S-OVERVIEW-003] [S-OVERVIEW-004] [S-OVERVIEW-005] |
| Deal dispute | AccuLynx calls the termination invalid; Verisk sued seeking validation of its walk-away; litigation status as of mid-2026 unresolved in public sources | [S-OVERVIEW-004] [S-OVERVIEW-006] |
| Ratings | Capterra 4.6/5 (846 reviews; ease-of-use 4.3, support 4.7, value 4.2). G2 seller rating ~4.2/5 (36 reviews) per search-surfaced data. | [S-OVERVIEW-025] [S-OVERVIEW-026] |
| Review verbatims (customers, cited) | "One place to organize all of our company's workflow." / "Too expensive. They hold their data hostage" — Capterra reviewers | [S-OVERVIEW-025] |

## 7. Announced AI Features

| Feature | What it is | Source |
|---|---|---|
| Lead Intelligence | AI lead-conversion scoring using demographic/financial/property data; rank indicator on Lead and Prospect records and list views; built on Faraday's prediction API | [S-OVERVIEW-019] [S-OVERVIEW-018] |
| Homepage AI framing | Marketing references AI-powered lead intelligence and real-time analytics within CRM | [S-OVERVIEW-001] |
| Gaps noted by third parties | 2026 reviewers describe automation as rules-based only — no AI nurturing, chatbots, or ML follow-ups (opportunity area for us) | [S-OVERVIEW-027] |

## Unknowns

- **Knowledge base bot-blocked** (support.acculynx.com returns 403 to non-browser fetchers). Exact per-role permission matrices, full settings tree, and complete default milestone list could not be read directly; role/permission facts above come from search snippets and marketing pages only. We design our own role model rather than guessing theirs.
- **Default milestone set**: whether stages named e.g. "Closed"/"Dead/Lost" exist by default, and the canonical ordering, is unverified.
- **Pricing**: vendor publishes none; tier names, per-seat rates, add-on pricing, and contract terms are known only from dated third-party reviews.
- **True org hierarchy**: whether a parent company entity exists above locations in-product (vs. separate per-location accounts + roll-up reporting/portfolio tooling) is not publicly documented.
- **Exact customer count, revenue/ARR, employee count**: undisclosed; only vendor "thousands" claims and one unverified third-party "10,000+" figure.
- **Verisk litigation outcome** and any renewed sale process as of 2026-07: no definitive public resolution found.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

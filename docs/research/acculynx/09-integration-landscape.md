# AccuLynx — Integration Landscape (Clean-Room Research)

**Doc:** 09-integration-landscape | **Prepared:** 2026-07-16 | **Method:** public sources only
(acculynx.com marketing/integration pages, AccuLynx public API docs, third-party developer
portals and public docs, press releases, partner knowledge bases — some pages read via search
snippets where direct fetch was blocked or JS-only). All descriptions are our own words; partner
product names are used nominatively. Source refs `[S-INTEGRATIONS-NNN]` resolve to
`docs/research/acculynx/sources/integrations.md`. Access-model and lead-time judgments about
*third parties'* programs come from researching each third party's own public developer
program, not from AccuLynx material.

**Key for the "Access model" column** (feeds the copy-priority matrix's gated-dependency axis):

| Code | Meaning |
|---|---|
| **OPEN** | Self-serve public API/dev portal; any developer can get production credentials without a negotiated agreement |
| **SEMI** | Public docs exist but production credentials require an application, email onboarding, or vendor approval |
| **GATED** | Closed partner agreement / certification / data license required; no self-serve path |
| **1P** | First-party AccuLynx feature backed by a vendor partnership (we would pick our own vendor) |

All lead-time estimates are **INFERENCE** (eng + BD calendar time for us to reach production
parity, assuming a working product to demo).

---

## 1. How AccuLynx structures its ecosystem

Three tiers, visible from public pages [S-INTEGRATIONS-001] [S-INTEGRATIONS-030] [S-INTEGRATIONS-037]:

1. **Native integrations** — deep, AccuLynx-built connections (suppliers, accounting,
   measurement ordering, payments/financing, hail data). These are where the gated partnerships
   live.
2. **"App Connections"** — a named add-on tier of pre-configured, no-code connectors
   (CallRail, Hover, CompanyCam, Hatch, Roofle, HubSpot, SalesRabbit, Spotio, Angi, RoofScope,
   RoofSnap, Zapier). AccuLynx states these are built on its own public API
   [S-INTEGRATIONS-037].
3. **Customer/partner-built** — a public REST API (v2, API-key auth, webhooks) restricted to
   active AccuLynx customers; vendors wanting to integrate are routed to a separate
   partnership application rather than the self-serve API [S-INTEGRATIONS-010]. The Zapier app
   (13 webhook triggers, 5 write actions, 6 searches) rides on this layer
   [S-INTEGRATIONS-030].

**Implication:** AccuLynx itself gates inbound partners. A public, genuinely self-serve API +
webhooks on our side is a differentiation opportunity, not just parity
(INFERENCE).

---

## 2. Integration catalog

### 2.1 Roof measurement & aerial imagery

| Integration | Function (our words) | Mechanism (public evidence) | Access model | Est. BD lead time (INFERENCE) |
|---|---|---|---|---|
| EagleView | Order aerial measurement reports from inside the job; results auto-filed and measurement data pre-fills estimates [S-INTEGRATIONS-001] [S-INTEGRATIONS-003] | Report order/delivery API; OAuth2 [S-INTEGRATIONS-011] | **SEMI→GATED**: self-serve dev portal + free sandbox + Postman collections exist [S-INTEGRATIONS-011]; production report ordering runs through their partner-ecosystem track [S-INTEGRATIONS-012] | 2–4 mo (sandbox immediately; production via partner onboarding) |
| GAF QuickMeasure | Order roof measurement reports (residential in ~hours) delivered into the job file [S-INTEGRATIONS-001] [S-INTEGRATIONS-016] | Partner-integrated ordering; QuickMeasure has its own storefront at quickmeasure.gaf.com [S-INTEGRATIONS-015] | **GATED**: no public self-serve developer portal found; every known integration (AccuLynx, ServiceTitan, Leap, Roofle, RoofLink, ProLine, Beacon PRO+) is a named partner [S-INTEGRATIONS-016] (INFERENCE from absence of public program) | 3–9 mo (GAF partnership; many precedents, so achievable) |
| Hover | Trigger/assign measurement requests; sync measurements + 3D renderings to the job; pre-fill estimates [S-INTEGRATIONS-002] | OAuth 2.0 REST API, public docs at developers.hover.to [S-INTEGRATIONS-013] | **OPEN**: self-serve integration creation from a Hover account; marketplace listing needs an approval step [S-INTEGRATIONS-014] | 2–6 wks eng, no BD required |
| GeoSpan | 3D roof models / measurement data with accuracy claims [S-INTEGRATIONS-001] | Not public | **GATED** (INFERENCE): integrations appear partner-arranged (e.g., Roofle co-marketing page) [S-INTEGRATIONS-038] | 3–6 mo |
| RoofSnap | Auto-sync measurements and photos into jobs [S-INTEGRATIONS-001] | RoofSnap-side API | **SEMI**: RoofSnap describes its API as open to CRM integrations but scoped/negotiated per project [S-INTEGRATIONS-032] | 1–3 mo |
| RoofScope | Transfer aerial measurement reports into job files [S-INTEGRATIONS-001] | Not public | **GATED** (INFERENCE): no public developer program found | 3–6 mo |

### 2.2 Material suppliers

| Integration | Function | Mechanism | Access model | Est. BD lead time |
|---|---|---|---|---|
| ABC Supply | Browse catalog with account-specific pricing; submit orders from the job [S-INTEGRATIONS-001] | Public REST APIs (catalog 200k+ items, pricing, branches, orders, notifications); docs + Postman + sandbox at apidocs.abcsupply.com [S-INTEGRATIONS-018] | **SEMI**: "third-party aggregator" track for commercial platforms — client-credential for public data, OAuth2 for customer data; API Terms of Use with prohibited-use screening (no price-comparison tools, no data resale); approval required, no cost published [S-INTEGRATIONS-017] | 1–3 mo (docs/sandbox public; approval timeline unpublished) |
| QXO (formerly Beacon) | Branch-level availability, account pricing, order placement, delivery tracking [S-INTEGRATIONS-001] | Beacon PRO+ platform APIs; a developer.beacon.io site exists but renders as an empty JS shell [S-INTEGRATIONS-021] | **GATED**: partner access tokens are issued during partner onboarding through Beacon support — no self-serve path found [S-INTEGRATIONS-020] [S-INTEGRATIONS-039] | 3–9 mo; note QXO's $11B acquisition of Beacon closed April 2025 — partner program continuity is an open risk [S-INTEGRATIONS-020] |
| SRS Distribution | Catalog with custom pricing; branch-level ordering [S-INTEGRATIONS-001] | "SRS Integration Partner Services" (SIPS) REST API for Roof Hub; public docs at apidocs.roofhub.pro; token auth, 24h expiry [S-INTEGRATIONS-019] | **SEMI**: credentials issued by emailing SRS's API support team — light-weight partner onboarding, public docs [S-INTEGRATIONS-019] | 1–3 mo |

### 2.3 Accounting, payments, financing

| Integration | Function | Mechanism | Access model | Est. BD lead time |
|---|---|---|---|---|
| QuickBooks (Online + Desktop) | Two-way sync of customers, invoices, payments, accounting data [S-INTEGRATIONS-001] [S-INTEGRATIONS-004] | Intuit QBO REST API, OAuth2, webhooks, free sandbox [S-INTEGRATIONS-027] | **OPEN**: free self-serve dev account; production keys self-serve; the *app-store listing* review is the slow part (staged technical/security/marketing review; third parties report 6 wks–6 mo end-to-end) [S-INTEGRATIONS-027] [S-INTEGRATIONS-028]. QB *Desktop* sync needs the separate Desktop SDK/Web Connector (INFERENCE) | 1–2 mo eng; +1–6 mo only if we want the QuickBooks app-store listing |
| Sage Intacct | Two-way accounting sync for more complex finance orgs [S-INTEGRATIONS-001] | Web Services API (sender-ID credential model) [S-INTEGRATIONS-025] | **GATED (paid)**: requires a Web Services developer license and, for a marketplace listing, the partner program — third parties report ~$2,500/yr plus ~$0.015/API call [S-INTEGRATIONS-025] [S-INTEGRATIONS-026] | 2–4 mo + recurring fees |
| AccuPay (payments) | First-party card/ACH/debit acceptance in-person, by email, or via customer portal; next-day-style funding claims; payments auto-recorded on the job and pushed to QuickBooks/Sage [S-INTEGRATIONS-006] | AccuLynx marketing attributes the underlying rails to FIS Global (vendor claim) [S-INTEGRATIONS-006] [S-INTEGRATIONS-007] | **1P**: for us this is a PSP/payfac-partner choice (Stripe, Adyen, Rainforest, etc. — all OPEN self-serve), not a copy of AccuLynx's FIS deal | 1–3 mo eng incl. underwriting/onboarding with chosen PSP |
| AccuFi (financing) | First-party embedded consumer-financing: soft-pull pre-qualification from estimate/invoice, multiple lender offers, no contractor fees claimed [S-INTEGRATIONS-008] | Powered by an Acorn Finance embedded-lending partnership (announced Sept 2021) [S-INTEGRATIONS-009] | **1P/GATED**: embedded-lending marketplaces (Acorn, Momnt, Wisetack, etc.) all require a commercial agreement + compliance onboarding — no self-serve (INFERENCE) | 2–6 mo incl. compliance |
| GreenSky | Present home-improvement loan options in the sales flow [S-INTEGRATIONS-001] | Proprietary merchant API [S-INTEGRATIONS-024] | **GATED**: merchant agreement + partner integration; no public self-serve developer program [S-INTEGRATIONS-024] | 3–6 mo |

### 2.4 Lead generation, sales & communications

| Integration | Function | Mechanism | Access model | Est. BD lead time |
|---|---|---|---|---|
| HubSpot | Two-way lead sync to kill duplicate entry [S-INTEGRATIONS-001] | HubSpot public API (ASSUMPTION: standard self-serve HubSpot dev platform; not separately verified this session) | **OPEN** (ASSUMPTION) | 2–6 wks |
| Hatch | AccuLynx contact/job data feeds automated text/email/voice campaigns; Hatch polls AccuLynx-side data every ~15 min [S-INTEGRATIONS-036] | Built by Hatch against AccuLynx's API [S-INTEGRATIONS-036] [S-INTEGRATIONS-037] | **SEMI**: integration direction is *into us* — requires our public API + a Hatch partnership conversation | 1–3 mo (mostly our API readiness) |
| Angi (Leads/Ads) | Qualified leads flow straight into the CRM [S-INTEGRATIONS-001] | Angi pushes leads as JSON POST to a partner endpoint; enabled by emailing Angi's CRM-integrations team with the endpoint + account number [S-INTEGRATIONS-029] | **SEMI**: email onboarding, no formal certification published | 2–8 wks |
| Roofle (RoofQuote PRO) | Instant-quote website leads auto-created in the CRM [S-INTEGRATIONS-001] | Customer-configurable webhooks from Roofle's developer settings page into an AccuLynx webhook URL [S-INTEGRATIONS-035] | **OPEN** (webhook pattern — we need inbound webhook endpoints; Roofle side is customer-self-serve) | 1–4 wks |
| SalesRabbit | Door-knocking lead records imported; CRM status + financials mapped back [S-INTEGRATIONS-002] | SalesRabbit public REST API, self-serve API keys [S-INTEGRATIONS-031] | **OPEN** | 2–6 wks |
| Spotio | Field-sales lead records synced; CRM status mapped back [S-INTEGRATIONS-002] | Not verified — no public Spotio API docs surfaced this session | **SEMI** (INFERENCE) | 1–3 mo |
| CallRail | Call-tracking leads and call activity synced to the CRM [S-INTEGRATIONS-001] | CallRail public REST API v3; per-user API keys, read/write toggle, webhooks [S-INTEGRATIONS-023] | **OPEN** (a technology-partner listing exists but isn't required to build) | 2–6 wks |

### 2.5 Docs/photos, automation, calendars, mapping, weather

| Integration | Function | Mechanism | Access model | Est. BD lead time |
|---|---|---|---|---|
| CompanyCam | Two-way: jobs/leads auto-create CompanyCam projects; milestone changes propagate; photos/videos/tags/docs flow back into the job file [S-INTEGRATIONS-005] | CompanyCam public REST API + webhooks; OAuth for partner-published integrations [S-INTEGRATIONS-022] | **OPEN**: self-serve API (Pro+ plans), free partner program, OAuth credentials by request form [S-INTEGRATIONS-022] | 2–6 wks |
| Zapier | Generic glue to thousands of apps; AccuLynx exposes 13 webhook triggers (contact/job/milestone/appointment events), 5 create/update actions, 6 searches [S-INTEGRATIONS-030] | Zapier developer platform app | **OPEN**: Zapier's platform is self-serve; public listing has a review step (ASSUMPTION: standard Zapier process) | 2–6 wks |
| Google Calendar | CRM appointments appear on users' Google calendars [S-INTEGRATIONS-001] | Google Calendar API is open/self-serve; OAuth verification needed for sensitive scopes (ASSUMPTION re: AccuLynx's exact mechanism — not public) | **OPEN** | 2–4 wks (+OAuth app verification) |
| Apple Calendar | Appointment sync to Apple devices [S-INTEGRATIONS-001] | No server-side Apple Calendar API exists; likely ICS feed subscription or on-device calendar writes (INFERENCE) | **OPEN** (open standards) | 1–2 wks |
| Microsoft Outlook | Appointment sync with Outlook calendars [S-INTEGRATIONS-001] | Microsoft Graph API is open/self-serve (ASSUMPTION re: AccuLynx's exact mechanism) | **OPEN** | 2–4 wks |
| Google Maps | Job-site location, routing [S-INTEGRATIONS-001] | Google Maps Platform APIs, usage-priced | **OPEN** | days |
| HailWatch | Storm alerts, hail/wind maps, address-level verification shown in-app [S-INTEGRATIONS-001] [S-INTEGRATIONS-033] | Not public | **GATED** (INFERENCE): data-provider agreement; HailWatch does partner with multiple CRMs [S-INTEGRATIONS-033] | 2–4 mo |
| CoreLogic Hail Maps (Cotality) | Address-specific hail verification reports for insurance work [S-INTEGRATIONS-001] [S-INTEGRATIONS-034] | Weather Verification Services product line [S-INTEGRATIONS-034] | **GATED**: enterprise data-licensing agreement (INFERENCE from product structure) | 3–6 mo |

---

## 3. Gated-dependency rollup (input to copy-priority matrix)

| Tier | Integrations | Consequence for us |
|---|---|---|
| **OPEN — build now, zero BD** | Hover, CompanyCam, CallRail, SalesRabbit, QuickBooks Online, Zapier, Google/Outlook/Apple calendars, Google Maps, Roofle-style inbound webhooks, HubSpot (ASSUMPTION) | Day-one parity achievable on measurement (Hover), photos (CompanyCam), call tracking, canvassing, accounting, and automation. This set alone covers most of AccuLynx's "App Connections" tier. |
| **SEMI — public docs, approval required** | ABC Supply (aggregator track), SRS (SIPS), Angi, EagleView (sandbox now, production approval), RoofSnap, Hatch, Spotio | Start applications early; engineering can proceed against sandboxes/docs in parallel. |
| **GATED — negotiated partnership/license** | GAF QuickMeasure, QXO/Beacon, GreenSky, GeoSpan, RoofScope, HailWatch, CoreLogic, Sage Intacct (paid program), embedded-financing vendor | These are AccuLynx's real moat surface. Mitigations: Hover/EagleView cover measurement without GAF; ABC+SRS cover supply without QXO; financing via any embedded-lending marketplace; hail data via alternative weather-data vendors. Per protocol §8, all of these are described publicly as "designed to integrate with"/"planned" until agreements exist. |

**Reading (INFERENCE):** the only capability where *every* strong option is gated is
supplier-integrated ordering with **account-specific pricing** at QXO/Beacon — but ABC Supply and
SRS both offer semi-open tracks, so two of the three national distributors are reachable without
a negotiated moat-piercing deal. Measurement, photos, accounting, payments, canvassing, and
automation are all reachable through fully open programs.

---

## Unknowns

- **AccuLynx↔partner mechanism details**: for most native integrations (EagleView, GAF,
  QXO, Sage) public sources show *what* syncs but not the direction of build (who calls whom),
  auth model, or sync cadence — except Hatch (~15 min polling) and Roofle (webhooks). We design
  our own contracts rather than guessing theirs.
- **Calendar sync mechanism**: whether AccuLynx uses per-user OAuth pushes, ICS subscription
  feeds, or device-level sync for Google/Apple/Outlook is not publicly documented.
- **Commercial terms**: revenue shares, referral fees, or exclusivity in AccuLynx's supplier,
  measurement, GreenSky/Acorn, and FIS relationships are entirely non-public.
- **Beacon/QXO developer program status post-acquisition**: developer.beacon.io would not render
  (JS-only shell); current partner-onboarding process and whether QXO will keep the Beacon PRO+
  API regime are unverified.
- **Spotio API and GAF QuickMeasure program specifics**: no public developer documentation
  found for either; access-model ratings for both are inference.
- **App Connections pricing**: the App Connections tier is an add-on, but its price and
  per-connection packaging are not published.
- **AccuLynx partnership application criteria**: the API docs route vendors to a partnership
  application; acceptance criteria, timeline, and terms are not public.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

# AccuLynx — Assumed / Inferred Backend Architecture

**Purpose.** Reconstruct AccuLynx's likely technical architecture from public signals only, so our
team can make deliberate design choices instead of guessing. Every row is tagged **OBSERVED**
(directly seen in a public artifact) or **INFERENCE** (our reasoning from indirect signals).
Nothing here comes from inside an AccuLynx account. Company legal entity is **ExactLogix, Inc.**,
d/b/a AccuLynx; founded 2008; ~132 employees; HQ Beloit WI + Chicago IL office [S-ARCH-011][S-ARCH-014].

> Confidence legend: **OBSERVED** = seen in a public response/page. **INFERENCE** = deduced, may be wrong.
> Job-post-derived stack claims reflect what AccuLynx *hires for*, which is strong but not proof of production use.

---

## 1. Backend languages & frameworks

| Area | Finding | Basis | Source |
|---|---|---|---|
| API runtime | `Server: Kestrel` on `api.acculynx.com`; 401 body is RFC 9110 `application/problem+json` | **OBSERVED** — ASP.NET Core (Kestrel + ProblemDetails are .NET-native) | [S-ARCH-002] |
| Web app runtime | `x-miniprofiler-ids` header on `my.acculynx.com` | **OBSERVED** — StackExchange MiniProfiler is a .NET library; confirms .NET web tier | [S-ARCH-001] |
| Primary language | C# / .NET across web + services | **INFERENCE** from Kestrel + MiniProfiler + QA role requiring C#/NUnit | [S-ARCH-002][S-ARCH-007] |
| Service style | "Microsoft-based, cloud-hosted microservice architecture" hiring language; test scope names "microservice & API testing" | **OBSERVED** (job posting) → **INFERENCE** for production topology | [S-ARCH-007] |
| Legacy monolith | Original product (2008) likely a classic ASP.NET/IIS monolith later decomposed | **INFERENCE** — long-lived .NET shop, gradual service extraction | [S-ARCH-011] |

## 2. Frontend / web tier

| Area | Finding | Basis | Source |
|---|---|---|---|
| SPA framework (app) | UI Engineer role centers on **Vue** (Vue 3 + 2.7), **Vuex/Pinia** state, **TypeScript**, build via **Webpack/Gulp/Vite** | **OBSERVED** (job posting) | [S-ARCH-008] |
| Sign-in / auth screens | Sign-in page loads **AngularSignin** + Angular fingerprint bundles from `static.alstatic.net` | **OBSERVED** — Angular used at least for the auth surface; mixed-framework estate | [S-ARCH-004] |
| Framework split | Angular (older/auth) + Vue (newer app modules) coexist | **INFERENCE** — migration in progress; explains reviewer "app vs browser feel different" comments | [S-ARCH-004][S-ARCH-008][S-ARCH-014] |
| Static asset CDN | `static.alstatic.net` / `cdn.alstatic.net` → **AWS CloudFront**; hashed bundle names (`SigninCss-d647…`) | **OBSERVED** — fingerprinted asset pipeline on CloudFront | [S-ARCH-003][S-ARCH-004] |
| Web-to-PDF | "web to PDF page layout and printing" called out as a UI skill | **OBSERVED** — proposals/estimates rendered client- or service-side to PDF | [S-ARCH-008] |
| Device fingerprinting | FingerprintJS (`fpjscdn.net`) + custom `Fingerprinting` bundle | **OBSERVED** — anti-fraud / session binding on login | [S-ARCH-001][S-ARCH-004] |

## 3. Cloud, hosting & edge

| Area | Finding | Basis | Source |
|---|---|---|---|
| Marketing site | `acculynx.com` A-records 141.193.213.10/11, `Server: cloudflare` | **OBSERVED** — WordPress-style marketing behind **Cloudflare** | [S-ARCH-003] |
| App + API edge | `my.` and `api.acculynx.com` on 151.101.x.x with `Via: 1.1 varnish` + `x-served-by: cache-…-DFW/IAD` | **OBSERVED** — **Fastly** CDN/edge fronting app + API (DFW + IAD POPs) | [S-ARCH-001][S-ARCH-002][S-ARCH-003] |
| Compute cloud | Origin cloud not directly exposed; CloudFront + S3 (`acculynx-email-assets.s3.amazonaws.com`), CSP allows `*.amazonaws.com` | **INFERENCE** — significant **AWS** footprint; origin likely AWS (Kubernetes) | [S-ARCH-001][S-ARCH-004] |
| Orchestration | Job posts name **Docker + Kubernetes** | **OBSERVED** (hiring) → **INFERENCE** for prod | [S-ARCH-007] |
| Regions | Fastly DFW (Dallas) + IAD (Ashburn) edge; single-country product (US/Canada states in API) | **INFERENCE** — US-centric hosting; no evidence of non-US regions | [S-ARCH-002][S-ARCH-019] |
| Status decomposition | Public Statuspage components: Web Application, Mobile Application, API, Photos/Documents (view + upload/download split), Email send/receive, plus per-integration add-ons | **OBSERVED** — hints at service/subsystem boundaries | [S-ARCH-006] |

## 4. Data stores, search & reporting

| Area | Finding | Basis | Source |
|---|---|---|---|
| OLTP database | "SQL" in stack; .NET shop | **OBSERVED** (hiring) + **INFERENCE** → almost certainly **Microsoft SQL Server** | [S-ARCH-007] |
| Search infrastructure | **Elasticsearch** named in QA stack; product has global contact/job search, filter/sort on large lists | **OBSERVED** (hiring) → **INFERENCE** ES powers search + list filtering | [S-ARCH-007] |
| Object storage | Photos/documents are a separately-scaled subsystem; email assets in S3 | **OBSERVED** (Statuspage split + S3 bucket) → **INFERENCE** S3 for job photos/docs | [S-ARCH-006][S-ARCH-004] |
| Analytics warehouse | **DataMart** (announced Oct 2025): "enterprise-grade analytics," customer data connectable to external BI (Tableau referenced) | **OBSERVED** — separate reporting/warehouse layer distinct from OLTP | [S-ARCH-024] |
| Reporting model | Marketing-spend/ROI, closing %, profitability-by-trade reports; "trades-based reporting" added 2025 | **OBSERVED** — reporting is a first-class subsystem, now warehouse-backed | [S-ARCH-024] |
| Multi-tenancy | API scopes everything to "current location"/company; company/location settings, per-company custom fields & workflows | **OBSERVED** behavior → **INFERENCE**: **shared-schema multi-tenant** keyed by company + location (row-level tenant scoping), not DB-per-tenant | [S-ARCH-019][S-ARCH-025] |

## 5. Mobile stack

| Area | Finding | Basis | Source |
|---|---|---|---|
| iOS app | "AccuLynx Field" (id 1485611392), seller AccuLynx d/b/a ExactLogix, v2.10.10, 170 MB, **iOS 17.6+** | **OBSERVED** | [S-ARCH-014] |
| App portfolio | Multiple apps: Field, Crew (subcontractor check-in/checklists), plus legacy "Field App – Original" (id 419609536) | **OBSERVED** — separate office vs crew apps | [S-ARCH-014][S-ARCH-015] |
| Android app | Play package `com.acculynx.field_sales`; older APKPure package `com.mentormate.acculynx`; **Android 6.0+** | **OBSERVED** | [S-ARCH-016] |
| Dev partner | `com.mentormate.acculynx` namespace → **MentorMate** (mobile agency) built/co-built the app | **OBSERVED** package id → **INFERENCE** MentorMate engagement | [S-ARCH-016] |
| Native vs hybrid | 170 MB binary, iOS 17.6 floor, dedicated Mobile Engineering Manager, reviewer notes app/web feature drift | **INFERENCE** — largely **native** (not a thin webview), separate mobile team & release train | [S-ARCH-012][S-ARCH-014] |
| Offline | Reviews note "needs strong signal"; estimating parity added to Field App 2025 | **INFERENCE** — limited offline; online-first sync model | [S-ARCH-014][S-ARCH-024] |

## 6. Integration architecture

| Area | Finding | Basis | Source |
|---|---|---|---|
| Public API | REST, **v2** (`v2.2614.0`), **API-key** auth, `RateLimit-*` headers, JSON `problem+json` errors | **OBSERVED** | [S-ARCH-002][S-ARCH-017][S-ARCH-019] |
| API surface | ~181-entry endpoint index: contacts, jobs, milestones/statuses, estimates, appointments/calendars, custom fields, company settings; `StartIndex`/`PageSize` pagination; `include`-style expansion | **OBSERVED** | [S-ARCH-019] |
| Rate limits | 30 req/s per IP (concurrent), 10 req/s per API key; 429 with temporary ban | **OBSERVED** | [S-ARCH-018] |
| Webhooks | Event catalog (contact/job/milestone/status/custom-field/appointment/primary-contact changes); listener docs; 31 webhook refs in index | **OBSERVED** — event-driven outbound integration | [S-ARCH-019] |
| Partner tiers | Two lanes: **Zapier** (low-code) and **Advanced API** (partner-approved) | **OBSERVED** | [S-ARCH-017] |
| Payments | **AccuPay** backed by **Worldpay**, merchant onboarding via **Payrix**; card + ACH; QuickBooks sync; CSP allows `*.stripe.com`, `*.payrix.com`, `*.splashpayments.com` | **OBSERVED** | [S-ARCH-020][S-ARCH-001] |
| Financing | **AccuFi** = embedded lending via **Acorn Finance** | **OBSERVED** | [S-ARCH-021] |
| Measurement/supplier | EagleView, RoofScope/Geospan; ABC / SRS / Beacon real-time pricing & ordering; each is a separate Statuspage component | **OBSERVED** — per-partner integration services | [S-ARCH-006][S-ARCH-022][S-ARCH-024] |
| Accounting/other | QuickBooks Online + Desktop, Sage Intacct, CallRail, SmartDocs e-signature, Google/Outlook/iCal calendar sync | **OBSERVED** | [S-ARCH-006][S-ARCH-022][S-ARCH-024] |
| Comms providers | SMS ("unique local number," two-way) + email; SPF authorizes **Mailgun + Amazon SES** (also Google, Zendesk, HubSpot, Salesforce) | **OBSERVED** email; **INFERENCE** telephony via a CPaaS (provider not disclosed) | [S-ARCH-005][S-ARCH-022] |
| Email templating | CSP allows `*.unlayer.com` (Unlayer email builder) + PhotoEditor SDK (`photoeditorsdk.com`) | **OBSERVED** — 3rd-party embeds for email design + photo annotation | [S-ARCH-001] |

## 7. AI / ML features

| Feature | Finding | Basis | Source |
|---|---|---|---|
| Lead Intelligence / "Lead Rank" | Described by AccuLynx as **AI** scoring a lead's conversion likelihood from third-party demographic, financial & property data | **OBSERVED** (marketing) — likely a supervised propensity model on enriched 3rd-party data, not an LLM | [S-ARCH-023] |
| Data enrichment source | Uses external "permission-based" data vendor(s) for demographics/property | **OBSERVED** claim → **INFERENCE**: bought data + internal outcome labels | [S-ARCH-023] |
| Generative AI | No public evidence of LLM/generative features (no AI summarization/assistant) in 2025–26 releases | **OBSERVED absence** — Spring 2026 notes contain none | [S-ARCH-025] |
| Analytics/BI as "AI-adjacent" | DataMart positioned as data-infrastructure play, not ML | **OBSERVED** | [S-ARCH-024] |

## 8. Observability, ops & security signals (OBSERVED, from CSP + headers)

| Signal | Tool | Source |
|---|---|---|
| RUM / browser monitoring | Datadog browser agent + `*.nr-data.net` (New Relic) + TrackJS | [S-ARCH-001] |
| Product analytics / adoption | Pendo, Heap, Appcues, ChurnZero, UserVoice, Headway (changelog) | [S-ARCH-001] |
| Support chat | Zendesk / Zopim | [S-ARCH-001] |
| Auth options | Microsoft SSO button on sign-in; 2FA added 2025 | [S-ARCH-004][S-ARCH-024] |
| CI/CD + VCS | **GitLab** + GitLab CI (from QA role) | [S-ARCH-007] |
| Test tooling | NUnit, Selenium, Playwright (C#) | [S-ARCH-007] |
| Email/DNS | Google Workspace MX; verifications for Stripe, Atlassian, Slack, HubSpot, Salesforce, Apple | [S-ARCH-005] |

## 9. Corporate context affecting the roadmap

| Fact | Source |
|---|---|
| Early funding ~$9M (Bain Capital Ventures, Wisconsin Investment Partners) | [S-ARCH-027] |
| Verisk agreed to acquire for **$2.35B** (announced Jul 2025), aimed at pairing with Verisk Property Estimating (Xactimate/XactAnalysis) | [S-ARCH-026] |
| Deal **terminated Dec 2025** after FTC Second Request; AccuLynx disputes termination | [S-ARCH-026] |
| **Implication (INFERENCE):** near-term roadmap distraction + a signaled strategic gap around insurance-claim/Xactimate interoperability we can target | [S-ARCH-026] |

---

## What we'd do differently (Next.js / Supabase / Postgres)

AccuLynx is a mature but heavy **.NET + SQL Server + Elasticsearch + K8s** estate with a *mixed*
Angular/Vue frontend and a separately-built native mobile app — a topology that carries real
migration debt (two SPA frameworks, an outsourced mobile codebase drifting from web, a bolt-on
analytics warehouse). We would collapse that surface area. **One TypeScript language end to end**:
Next.js (App Router, server components, server actions) for web, a shared component library reused
by the marketing site and the app, and React Native/Expo (or a PWA-first field app) so mobile and
web share domain logic and types instead of forking into a separate agency-built codebase. For data,
**Supabase/Postgres as the single system of record**: Postgres row-level security enforces tenancy
(company + location) *at the database*, replacing hand-rolled application-tier tenant scoping;
Postgres full-text + `pgvector` covers search and lead-enrichment similarity without standing up and
syncing a separate Elasticsearch cluster until scale demands it; logical replication or a thin
read-replica/`pg_analytics` path serves reporting so we don't ship a distinct "DataMart" product to
get customers their own data. Auth, storage (job photos/docs), realtime (communications inbox,
crew check-ins), and edge functions come from one platform rather than five vendors. For AI we'd go
beyond a single propensity score: keep a Postgres/`pgvector` lead-propensity model *and* add genuinely
generative help — claim/supplement drafting, photo-to-scope summarization, and communication
drafting — behind the Anthropic API, an area where AccuLynx shows no public presence [S-ARCH-025].
Payments/financing/measurement we treat as swappable adapters behind our own contract (see Vantrow
Connect) so no single partner (Worldpay, Acorn, EagleView) is load-bearing. Net effect: fewer moving
parts, tenancy correctness by construction, mobile/web parity by default, and a modern AI surface the
incumbent has not yet built.

---

## Unknowns

Public sources could not reveal the following; we will design these deliberately rather than
reverse-engineer them:

- **Exact OLTP engine & schema.** SQL Server is a strong inference, not confirmed; table design,
  sharding, and whether any service uses a non-SQL store are invisible. [S-ARCH-007]
- **True service boundaries & count.** Statuspage components and "microservice" hiring language
  suggest decomposition, but the real service map, sync/async messaging (queue/broker), and any
  event bus are unknown. [S-ARCH-006][S-ARCH-007]
- **Origin cloud & regions.** CloudFront/S3/Fastly are edge; the compute origin (AWS vs Azure vs
  colo) and Kubernetes topology/regions are not directly observable. [S-ARCH-001][S-ARCH-003]
- **Tenancy isolation depth.** Shared-schema is inferred from API behavior; whether they use
  schema-per-tenant, RLS, or app-tier scoping — and their data-residency guarantees — is unknown. [S-ARCH-019]
- **SMS/telephony vendor.** Two-way texting exists; the CPaaS (Twilio/Bandwidth/Telnyx/other) is not
  disclosed in any public artifact. [S-ARCH-022]
- **Lead Intelligence model internals.** Algorithm, features, data vendor, and refresh cadence are
  undisclosed ("AI" is marketing framing). [S-ARCH-023]
- **DataMart internals.** Warehouse engine, refresh frequency, and which BI connectors are officially
  supported are not specified. [S-ARCH-024]
- **Mobile framework specifics.** Native is inferred; exact Swift/Kotlin vs any cross-platform layer,
  and current MentorMate involvement, are unconfirmed. [S-ARCH-014][S-ARCH-016]
- **Scale/performance numbers.** Request volumes, DB size, tenant counts, and SLOs are not public.

---

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

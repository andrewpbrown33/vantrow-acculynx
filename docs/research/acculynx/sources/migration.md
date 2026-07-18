# Sources — 13-data-migration-feasibility

Method note: "fetched" = page retrieved and read directly; "snippet" = content extracted from
public search-result snippets (page not fetched directly, typically because it blocked non-browser
fetches, returned 503/403, or the answer was fully in the snippet). All accesses **2026-07-16** via
the sandbox egress proxy.

**Reliability tier** (see doc 13 header): **P** = AccuLynx's own pages; **S** = integration-partner
help docs documenting the real AccuLynx export UI, or our own API teardown; **T** = third-party
SEO/consultant "how to switch" blogs (corroborative, some appear partly AI-generated); **C** =
competitor marketing.

| ID | URL | Accessed | Tier | What was extracted |
|---|---|---|---|---|
| S-MIGRATION-001 | https://my.acculynx.com/signin/TermsView | 2026-07-16 fetched | P | AccuLynx General Terms. **§9** customer is Controller/Owner of their customer Personal Information; AccuLynx is processor. **§14** cancelled accounts with >15 base users pay a monthly data-storage fee to stay active. **§15** after termination AccuLynx "shall have no obligation to maintain, store or provide" data and "may delete" it unless customer requests in writing before the effective termination date, in a "mutually agreed upon format," and AccuLynx "may charge … a reasonable fee." Core portability constraint. |
| S-MIGRATION-002 | https://acculynx.com/debunking-8-common-myths-about-acculynx-roofing-software/ | 2026-07-16 fetched | P | "You own your data." "if you decide to discontinue use … you will still be able to access or download your data **as long as you continue to pay for your subscription**." Onboarding team assists set-up/data transfer; monthly billing, cancel any time. |
| S-MIGRATION-003 | https://acculynx.com/faq/ | 2026-07-16 fetched | P | "Cloud-based platform so you can easily access your data from anywhere." No explicit export/ownership/cancellation policy on this page (points to support/phone). Negative result logged. |
| S-MIGRATION-004 | https://support.signpost.com/hc/en-us/articles/360046619531-How-To-Export-a-Contact-List-from-Acculynx | 2026-07-16 snippet (503 on direct fetch) | S | Integration-partner help doc describing the live AccuLynx UI: Reports menu → Jobs Report in Report Library → Date Range "All Data", Reference Date "Lead Date" → Actions → Edit Report → Edit for Columns → select Primary Contact Name/Phone/Email → Download/Export → choose **Excel or CSV**. Confirms self-serve contact/job export exists. |
| S-MIGRATION-005 | https://guildquality.my.site.com/s/article/How-to-export-customer-info-from-AccuLynx-to-send-to-GuildQuality | 2026-07-16 snippet (page returned JS loading-error shell on fetch) | S | Integration-partner article on exporting customer/contact info out of AccuLynx to hand to a third party (survey vendor). Corroborates the Reports-export-to-spreadsheet path. |
| S-MIGRATION-006 | https://learn.projectmapit.com/help-center/how-do-i-download-a-spreadsheet-from-acculynx | 2026-07-16 fetched | S | Step-by-step live UI: Reports tab → Sales Report → Date Range "All Data" → Actions → Edit Report → Columns (Job Info, Address, stage "Submitted" checkboxes) → Apply → Actions → Download/Export → send file to vendor. Confirms report-to-spreadsheet export; file format not named on this page. |
| S-MIGRATION-007 | https://acculynx.com/reportsplus/ (and go.acculynx.com/reportsplus, acculynx.com/product-release-reportsplus/) | 2026-07-16 snippet | P | ReportsPlus reporting suite; pre-built reports (job milestones, permits, supplements, A/R, materials, dead leads, estimates); schedule/auto-email reports; Actions → Download/Export to spreadsheet. |
| S-MIGRATION-008 | https://acculynx.com/how-to-get-powerful-business-insights-with-custom-reporting-in-acculynx/ | 2026-07-16 fetched | P | 20+ reports; customize standard fields + date ranges; visual displays; schedule automated reports to roles/team. Export file formats not specified on this page. |
| S-MIGRATION-009 | https://apidocs.acculynx.com/docs/getting-started | 2026-07-16 fetched | P | "The AccuLynx API is for AccuLynx software users"; requires an active AccuLynx account and a created/named API Key; software vendors directed to a **Partnership Application**. Confirms customer-only, no vendor self-serve, key-paste model. |
| S-MIGRATION-010 | https://acculynx.com/appconnections/ (+ AccuLynx API-key help snippet) | 2026-07-16 snippet | P | API keys require enabling the **AppConnections** add-on (Market → Add-Ons → "AppConnections by AccuLynx" → Enable). Key creation: Account Settings → Add-On Features and Integrations → API Keys → Create Key; **Company/Location Administrator** only; name the key per integration. Add-on price not published. |
| S-MIGRATION-011 | https://portable.io/connectors/acculynx/bigquery | 2026-07-16 fetched | S | Third-party ELT: "AccuLynx offers an API for clients to extract data on business entities"; Portable replicates AccuLynx into BigQuery/Snowflake for analytics. Confirms structured API-pull is real (needs customer key); page does not enumerate tables and does not mention files/photos. |
| S-MIGRATION-012 | https://www.jobnimbus.com/comparison/jobnimbus-vs-acculynx | 2026-07-16 fetched | C | "We've helped **thousands of contractors move from AccuLynx to JobNimbus** without disrupting their jobs, their team, or **their data**." "Structured migration support … minimal disruption." "Ongoing AccuLynx projects stay live during migration." "AccuLynx workflows simplified into JobNimbus structure"; live onboarding/training included; roofing-CRM specialist guidance. No API-migration claim. |
| S-MIGRATION-013 | https://www.jobnimbus.com/pricing (corroborated by roofingsoftwareguide switch guide) | 2026-07-16 snippet | C | JobNimbus: structured migration support in onboarding at **no additional fee**, **plus paid Professional Services** for hands-on/enterprise data migration + workflow build + integrations. |
| S-MIGRATION-014 | https://leaptodigital.com/leap-crm/ | 2026-07-16 snippet | C | Leap CRM: "Your dedicated onboarding rep will help you get your existing data into Leap … walk you through what can be migrated and how to prepare your files." Guided onboarding + data-migration support + training. |
| S-MIGRATION-015 | https://roofr.com/faqs | 2026-07-16 snippet | C | Roofr: dedicated Account Manager to onboard; dedicated implementation team (uploading materials, templates, team); assisted onboarding includes migration support. |
| S-MIGRATION-016 | https://roofingsoftwareguide.com/guides/switch-acculynx-to-jobnimbus/ | 2026-07-16 fetched | T | (Pub. Apr 15, 2026.) AccuLynx exports contacts, jobs, estimates, report data, custom-field values (via Custom Fields Manager) as **CSV**. Does NOT export cleanly: embedded photos, documents, DataMart/appointment-outcome analytics (export those as PDFs). JobNimbus onboarding team handles migrations, tells you accepted formats + field mapping; CSV import is primary. |
| S-MIGRATION-017 | https://roofingsoftwareguide.com/guides/how-to-switch-roofing-crm-without-losing-data/ | 2026-07-16 fetched | T | (Pub. Apr 13, 2026.) Generic playbook: export contacts, jobs, estimates/e-sign, insurance claims, photos/docs, financials (QuickBooks-synced), pipeline stages. Export CSV/Excel (PDFs/screenshots cause import failures). Lossy/no-migrate: automations (rebuild), embedded photos, email threads, custom-field mappings. Photos need manual download; CompanyCam photos stay in CompanyCam. Approaches: CSV batch import (contacts→jobs→docs→financials), vendor-assisted onboarding (AccuLynx/JobNimbus/Roofr), test-import 50–100 first. No API migration mentioned. |
| S-MIGRATION-018 | https://www.revolvecore.com/resources/blog/how-to-switch-from-acculynx | 2026-07-16 fetched | T | (Pub. May 2, 2026.) AccuLynx CSV exports: customer master file, job/project master file, contact list, custom-field values, price book (if any). Gotchas: document templates rarely export cleanly (rebuild PDFs); "AccuLynx photo export can be slow — plan a long window, verify counts"; OAuth tokens don't migrate, QuickBooks needs reconfig. AccuLynx provides exports "as contractually required to" but won't help map into new systems / rebuild templates. No API/DataMart/white-glove-by-AccuLynx mention. |
| S-MIGRATION-019 | https://workninjas.com/services/crm-migration/ | 2026-07-16 snippet | T | "CRM Data Extraction & Migration for Roofers" — agency offering AccuLynx/JobNimbus migration as a manual service. Demand signal that migration is a services problem. |
| S-MIGRATION-020 | https://www.upwork.com/services/product/development-it-crm-migration-roadmap-acculynx-jobnimbus-rooflink-leap-zoho-hubspot-1920947639171700398 (and Fiverr AccuLynx migration gigs) | 2026-07-16 snippet | T | Freelance "CRM Migration Roadmap — AccuLynx, JobNimbus, RoofLink, Leap …" gigs; freelancers selling AccuLynx→JobNimbus/RoofLink/Leap data migration + automation. Demand + manual-services signal. |
| S-MIGRATION-021 | https://acculynx.com/5-ways-to-use-acculynx-photos/ (+ acculynx.com/product-update-photo-video-tools/, acculynx.com/best-roofing-crm-software-introduces-new-photo-features/) | 2026-07-16 snippet | P | AccuLynx photo tooling = unlimited capture, albums, bulk **load in**, tagging, "Create a PDF" from selected photos. No bulk **export**/ZIP-out feature surfaced. Supports the "photos are the lossy frontier" finding. |
| S-MIGRATION-022 | https://www.bravosolutions.ai/blog/acculynx-data-into-google-sheets | 2026-07-16 snippet | T | Third-party guide to pulling AccuLynx data into Google Sheets (via API/export). Corroborates that structured AccuLynx data is extractable programmatically. |
| S-MIGRATION-023 | https://ustechautomations.com/resources/blog/automate-jobnimbus-vs-acculynx-for-roofing-companies-2026 | 2026-07-16 snippet | T | 2026 JobNimbus vs AccuLynx comparison; CSV export + import framing; corroborative only. |

**Cross-referenced internal sources:** doc 05 public API teardown [S-API-001 (merged OpenAPI: docs/
photos/measurements are upload-only with no GET; estimates/invoices read-only; message create-only),
S-API-002 (customer-only keys; vendor Partnership Application; unauthorized vendor use can suspend
account), S-API-003 (rate limits 10 req/s per key, 30 req/s per IP), S-API-016 (API sold as
AppConnections add-on), S-API-047/124 (search pageSize cap 25), S-API-073/154 (bearer key, per
location, no OAuth/scopes)]; doc 09 integration landscape; doc 01 overview [S-OVERVIEW-025 "they hold
their data hostage" verbatim; DataMart launched Oct 2025; ReportsPlus add-on]; doc 04 inferred data
model (entity catalog + Lead→…→Closed/Dead stage machine for milestone mapping).

Prepared under docs/legal/clean-room-protocol.md.

## Round 2 — visual export guides (accessed 2026-07-18)

Purpose: find linkable guides with real AccuLynx UI screenshots/video for the onboarding
export playbook. Verdict: STRONG — official KB articles + one live third-party screenshot
guide. Note: the official KB host is support.acculynx.com (Zendesk); it 403s to
datacenter/bot traffic but is a public, Google-indexed KB (verified via Wayback captures).

| ID | URL | Accessed | What it shows |
|---|---|---|---|
| S-MIG-V01 | https://support.acculynx.com/hc/en-us/articles/203164825-Export-Contacts-and-Leads | 2026-07-18 (via Wayback 2025-03-20) | OFFICIAL, 6 UI screenshots: your name → Account Settings → Manage Leads/Contacts → Export Contacts and Leads → Contacts/Leads (+Include Prospects) → Download .CSV. Requires Company/Location Administrator. Updated 2024-01-10 |
| S-MIG-V02 | https://support.acculynx.com/hc/en-us/articles/204954235-Export-History-and-Comments | 2026-07-18 (via Wayback) | OFFICIAL, 4 screenshots: per-job Job Menu → Settings → Export History/Comments (Message Board + Change History; PDF/Xls/Csv/etc). Manual, job-by-job — corrects our "message history doesn't export" to "no BULK export" |
| S-MIG-V03 | https://support.acculynx.com/hc/en-us/articles/32038851975565-Reports-19-12 | 2026-07-18 (Wistia oEmbed verified: 7tez6h6fbs, 19:12, 2024-11-20) | OFFICIAL role-based KB training video covering the Reports area; sibling 16:01 version at .../articles/32080144967949 (Wistia 6kcknttg58) |
| S-MIG-V04 | https://learn.projectmapit.com/help-center/how-do-i-download-a-spreadsheet-from-acculynx | 2026-07-18 (live) | 9 UI screenshots of the Reports export: Reports tab → Sales Report → All Data → Actions → Edit Report → Columns → Apply → Actions → Download/Export |
| S-MIG-V05 | https://support.signpost.com/hc/en-us/articles/360046619531-How-To-Export-a-Contact-List-from-Acculynx | 2026-07-18 (via Wayback; live URL 503) | Text steps corroborating: Jobs Report, Reference Date → Lead Date, column picks via Edit Report |
| S-MIG-V06 | https://roofingsoftwareguide.com/guides/switch-acculynx-to-jobnimbus/ + https://www.revolvecore.com/resources/blog/how-to-switch-from-acculynx | 2026-07-18 (live) | Competitor switch guides — strategy prose only, NO AccuLynx UI screenshots (negative result) |
| S-MIG-V07 | AccuLynx official YouTube (UCvvlbOO0FsE9UplxQpUKLsg) + third-party tutorials (Lnm3ctSbPtA, bXmwFmejkWg, qFKo9oBeL0E) | 2026-07-18 | No official export walkthrough video on YouTube; third-party tutorials unchaptered — no timestampable export segment (negative result) |

Applied to the product 2026-07-18: onboarding Section 1 now leads with the built-in
contacts export (S-MIG-V01), refines the Reports path (Reference Date → Lead Date,
Report Library, exact button labels per S-MIG-V04/V05), links out to S-MIG-V01/V03/V04
("see it done" — links only, no embedded AccuLynx screenshots per trade-dress guardrail),
and softens the message-history claim per S-MIG-V02.

Prepared under docs/legal/clean-room-protocol.md.

## Round 3 — capture-gap methods (2026-07-18)

Purpose: sourcing for doc 14 (capture-gap options memo) — methods to capture the five
non-CSV/non-API gap items (photos, documents/signed PDFs, SMS threads, per-job
message-board history, automations/templates) for a contractor accessing THEIR OWN
authorized account. All URLs accessed 2026-07-18 unless noted. Tiers: P=primary,
S=secondary, T=tertiary/SEO, L=legal primary.

### Method 1 — Scripted browser automation + bulk-image/network extensions

| ID | URL | Tier | What it supports |
|---|---|---|---|
| S-CAP-001 | https://my.acculynx.com/signin/TermsView (AccuLynx General Terms; acculynx.com/terms-of-use redirects here) | P/L | §2 per-user no-share; §3 reverse-eng ban, "probe/scan/test vulnerability," "interfere in any way," "build a competitive product" ban, password-sharing prevention; §13 audit + server-log monitoring; §14 retroactive per-user charges; §15 post-termination deletion unless written export in advance. NO explicit anti-bot/rate-limit clause. |
| S-CAP-002 | https://identity.acculynx.com/ + https://my.acculynx.com/signin/ | P | AccuLynx SSO/identity + 2FA (SMS security code) login surface. |
| S-CAP-003 | https://imgdownloadpro.com/ + https://imgdownloadpro.com/blog/how-to-download-all-images-from-website.html | T | Bulk-image extension: auto-scroll to trigger lazy-loaded/CSS-background images, one-click ZIP. |
| S-CAP-004 | https://techengage.com/best-image-downloader-extensions-for-chrome/ (+ ultimatewebscraper.com) | T | Bulk Media Downloader "works at the network level, intercepting media files as they load… catches images invisible to DOM-based downloaders." Relevant to signed-URL/API-served photos. |
| S-CAP-005 | https://birdeatsbug.com/blog/how-to-download-file-in-selenium-python (+ dev.to/dumay_sacha; slingacademy.com) | T | Standard pattern: use Selenium/Playwright only to get the authenticated session cookie, hand to requests/HTTP client to download — "most reliable method for large files" / expiring signed URLs. |
| S-CAP-006 | https://scrapfly.io/blog/posts/how-to-bypass-cloudflare-anti-scraping (+ zenrows.com) | T | Cloudflare Bot Management signals: TLS fingerprinting, IP reputation, JS challenges, Turnstile. Cuts against high-volume automation; authed first-party traffic is a weaker target than anonymous scraping. |
| S-CAP-007 | https://community.qlik.com/t5/Qlik-Sense-Documents/Qlik-Sense-SaaS-Automating-Apps-Export/ta-p/1853947 + https://axiom.ai/blog/how-to-automate-downloadin-a-file-from-a-website/ | T | Real-world "no bulk export" browser-automation workarounds; no-code scheduled browser bots that replicate user actions in Chrome. |

### Method 2 — AI computer-use / browser agents

| ID | URL | Tier | What it supports |
|---|---|---|---|
| S-CAP-008 | https://michaellivs.com/blog/state-of-browser-use-2026/ | T | Vendor benchmarks 87–98.9% WebVoyager but "collapse" on live sites with real auth/writes/CAPTCHAs; frontier agents complete ~30% of real tasks; ClawBench live-write ~33.3%. Login+2FA: Stagehand fails 6/10 unassisted; Skyvern native TOTP/CAPTCHA; Anchor best login rep; Browserbase remote-assist. Prompt-injection +32% relative Nov'25→Feb'26. |
| S-CAP-009 | https://benchlm.ai/benchmarks/osWorldVerified | T | OSWorld-Verified Jul 2026: Claude Fable 5 85%, Opus 4.8 83.4%, Sonnet 4.5 61.4%; 22%→72.5% in ~16 mo; benchmark near saturation. |
| S-CAP-010 | https://futureagi.com/blog/evaluating-browser-use-agents-2026/ | T | Six production failure modes (DOM drift, screenshot ambiguity, cookie/login expiry mid-task, modals, rate-limit/Cloudflare cliffs, irreversibility). "78% on WebArena… books 22% of carts." |
| S-CAP-011 | https://browser-use.com/posts/ai-browser-agent-benchmark + https://technspire.com/en/blog/browser-based-agents-production-computer-use-compared | T | ~8,958 tokens, $0.0048, ~6.8s PER STEP; task $0.10–0.30; per-step cost makes agents uneconomic above a few thousand tasks/day. |
| S-CAP-012 | https://github.com/Skyvern-AI/skyvern | S | OSS agent; native 2FA/TOTP/CAPTCHA/proxies; "route memorization" compiles a successful run into a deterministic Playwright script for cheap replay. |
| S-CAP-013 | https://docs.browserbase.com/platform/identity/overview + https://aws.amazon.com/blogs/machine-learning/reduce-captchas-for-ai-agents-browsing-the-web-with-web-bot-auth-preview-in-amazon-bedrock-agentcore-browser/ | S | Managed browser infra: credential vaulting, remote-assist for 2FA, Web Bot Auth / Signed Agents (allowlist gated to ~19 named consumer agents). |
| S-CAP-014 | https://securityboulevard.com/2026/07/cloudflare-precursor-extends-bot-detection-beyond-browser-checks/ | T | Cloudflare "Precursor" (July 2026) extends bot detection to continuous session-behavior — built to catch session automation. |

### Method 3 — No-code / integration platforms + AccuLynx surface + CompanyCam

| ID | URL | Tier | What it supports |
|---|---|---|---|
| S-CAP-015 | https://zapier.com/apps/acculynx/integrations | P | AccuLynx Zapier app: triggers are all contact/job/milestone/appointment lifecycle events (re-verified 14; doc 03 survey said 13 — undercount). NONE carry photos/documents/files/SMS/message-board. |
| S-CAP-016 | https://apidocs.acculynx.com/docs/webhooks-end-user-reference | P | 23 webhook topics, all structured-record events — NO "photo added," "document added," "job message," or "SMS/text" topic. Even go-forward gap capture off AccuLynx's own events is impossible. |
| S-CAP-017 | https://help.companycam.com/en/articles/9203693-integrate-companycam-acculynx | S | Sync primarily one-way CompanyCam→AccuLynx; optional "historical backfill" CREATES CompanyCam projects for AccuLynx jobs touched in last 30 days — backfills JOBS, NOT photos. Does not pull AccuLynx's existing photo archive into CompanyCam. |
| S-CAP-018 | https://help.companycam.com/en/articles/6828429-how-to-download-save-photos-from-companycam + https://help.companycam.com/en/articles/7047268-how-to-export-project-and-checklist-data + https://docs.companycam.com/discuss/632d41bfab0d90003f3d6aa3 | S | Per-project "Download All Photos" (zip) + Exports tab (web only) + REST API to list/read photos, but no dedicated download-all-via-API; large projects "can take hours." |
| S-CAP-019 | https://companycam.com/integrations/acculynx | S | One-way CC→AL photo/doc/tag sync via AppConnections; photos "remain stored in CompanyCam" while AccuLynx gets copies. |
| S-CAP-020 | https://www.prweb.com/releases/acculynx-launches-new-analytics-and-mobile-solutions-... + https://acculynx.com/reportsplus/datamart/ | P | DataMart (launched 28 Oct 2025): SQL/BI warehouse feed to Power BI/Tableau/Looker, "no manual exports required" — STRUCTURED data only (sales/PM/labor/orders/payments/CRM/financials); covers zero of the five gap items. Whether schema exposes file URLs/message text = UNVERIFIED. |
| S-CAP-021 | https://www.airslate.com/integrations/456-acculynx-and-google-drive-integrations | T | AccuLynx→Google Drive "not available yet… still in development" — no native AccuLynx→Drive/Dropbox document/photo sync to lean on. |

### Method 4 — Manual / concierge / migration-vendor services

| ID | URL | Tier | What it supports |
|---|---|---|---|
| S-CAP-022 | https://roofingsoftwareguide.com/guides/switch-acculynx-to-jobnimbus/ | T | "Photos embedded within AccuLynx job records typically don't export cleanly via CSV. You'll need to manually download photos… then re-upload"; for old jobs "archive to Google Drive rather than migrating." |
| S-CAP-023 | https://www.revolvecore.com/resources/blog/how-to-switch-from-acculynx (pub. 2026-05-02) | T | "AccuLynx photo export can be slow — plan a long window, verify counts"; document templates "rarely export cleanly (rebuild PDFs)"; AccuLynx provides exports "as contractually required" but won't help map/rebuild. |
| S-CAP-024 | https://ustechautomations.com/resources/blog/automate-jobnimbus-vs-acculynx-for-roofing-companies-2026 | T | AccuLynx→JobNimbus transition typically 4–8 weeks, parallel-run; custom fields need remap (2–4 weeks for 5+ yr DB). |
| S-CAP-025 | https://roofingsoftwareguide.com/guides/how-to-switch-roofing-crm-without-losing-data/ (pub. 2026-04-13) | T | ~1 week project + cutover weekend; keep old CRM read-only 30–90 days; "export everything before you cancel"; "you'll be calling your old vendor's support line for months — assuming they'll still help." |
| S-CAP-026 | https://www.jobnimbus.com/pricing | C | Free structured migration + paid Professional Services "when migrating data"; no public setup fee, priced by quote. |
| S-CAP-027 | https://www.import2.com/solutions/crm | S | Paid CRM-to-CRM from $499; NO roofing CRMs listed; supports only "objects retrievable over the API" → cannot do AccuLynx files (no GET). Evidence of generic market only, NOT that the AccuLynx gap is serviceable. |
| S-CAP-028 | https://syncmatters.com/crm-data-migration + https://syncmatters.com/migrations/overview | S | (ex-Trujay) 25–30+ CRM connectors, custom on request; no AccuLynx/roofing listed; relies on source-API read access. |
| S-CAP-029 | https://companycam.com/integrations | S | CompanyCam syncs photos/videos/docs with both AccuLynx and JobNimbus/Roofr — for contractors already on it, photos never lived only in AccuLynx (go-forward escape hatch). |
| S-CAP-030 | https://workninjas.com/services/crm-migration/ + joshnocode.com + Upwork/Fiverr AccuLynx migration gigs | T | Existing manual migration-as-a-service market; bespoke/unpublished pricing; treats capture as a manual job. |

### Method 5 — Legal / ToS / CFAA framework (governing gate)

| ID | URL | Tier | What it supports |
|---|---|---|---|
| S-CAP-031 | https://www.supremecourt.gov/opinions/20pdf/19-783_k53l.pdf (+ congress.gov/crs-product/LSB10616) | L | Van Buren v. United States, 593 U.S. (2021): "exceeds authorized access" is gates-up-or-down (which areas), not purpose; own-account use for a disfavored purpose is not a federal crime. |
| S-CAP-032 | https://cdn.ca9.uscourts.gov/datastore/opinions/2022/04/18/17-16783.pdf (+ en.wikipedia.org/wiki/HiQ_Labs_v._LinkedIn) | L | hiQ v. LinkedIn (9th Cir. 2022): reaching permitted data isn't "without authorization" — BUT hiQ later LOST on breach of LinkedIn's User Agreement (Nov 2022) + Dec 2022 permanent injunction binding "persons in active concert." Contract, not CFAA, is the weapon; hiQ's CFAA hook involved fake accounts + public non-owned data. |
| S-CAP-033 | https://www.whitecase.com/insight-our-thinking/web-scraping-website-terms-and-cfaa-hiqs-preliminary-injunction-affirmed-again + https://www.fenwick.com/insights/publications/hiq-labs-scrapes-by-again-the-ninth-circuit-reaffirms-that-data-scraping-does-not-violate-the-cfaa-1 | L | Practitioner analysis: scraping doesn't violate CFAA post-hiQ, but tort/contract claims are the live exposure. |
| S-CAP-034 | https://www.callloop.com/blog/text-message-history + https://www.smsexport.com/software.php | T | SMS export is manual/clunky ("view each SMS individually, highlight and copy"); "screenshots aren't a records strategy." |
| S-CAP-035 | https://dev.to/monocloud/oauth-for-saas-what-every-developer-and-technical-leader-needs-to-know-22o | T | Industry standard is delegated short-lived tokens, not credential sharing — the pattern AccuLynx does NOT offer (company bearer key only), so the compliant fallback is customer-initiated export. |

**Cross-referenced internal:** doc 05 [S-API-001 file-blind API §7.13; S-API-002 vendor-on-behalf
suspension; §8 webhook topic list], doc 13 (gap inventory, ToS §9/§14/§15, per-job message export
S-MIG-V02). Prepared under docs/legal/clean-room-protocol.md.

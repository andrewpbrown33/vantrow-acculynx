# 13 — Data Migration Feasibility: AccuLynx → Eaverow

**Doc:** 13-data-migration-feasibility | **Prepared:** 2026-07-16 | **Method:** public sources only
(AccuLynx marketing/FAQ/Terms pages, AccuLynx public API docs, integration-partner help centers that
document the real AccuLynx export UI, competitor migration/onboarding pages, third-party migration
blogs and services). Clean-room scope: this concerns a customer exporting **their own** data, which
they own and can authorize — never scraping AccuLynx's proprietary content. Builds on doc 05 (public
API teardown), doc 09 (integration landscape), doc 01 (product overview), doc 04 (inferred data
model). Source refs `[S-MIGRATION-NNN]` resolve to `sources/migration.md`; cross-refs `[S-API-NNN]`
resolve to `sources/api.md`.

**Evidence tiering used throughout** (because much of the migration web is SEO/consultant content):
- **P (Primary)** — AccuLynx's own pages (ToS, FAQ, API docs). High confidence.
- **S (Secondary)** — integration-partner help docs describing the *actual* AccuLynx export UI their
  own customers use (Signpost, GuildQuality, ProjectMapIt), and our own API teardown. Reliable.
- **T (Tertiary)** — third-party "how to switch off AccuLynx" SEO/consultant blogs (roofingsoftwareguide,
  revolvecore, ustechautomations). Corroborative and directionally useful, but several read as
  partly AI-generated; treat their *specific* claims as leads, not facts.
- **C (Competitor marketing)** — JobNimbus/Roofr/Leap's own switching pages. Evidence of what's
  *advertised*, not audited.

---

## VERDICT

**Programmatic, full-API migration is NOT the right MVP path — the realistic path is a workaround:
a guided CSV importer fed by the customer's own in-app export, backed by a white-glove assist, with
API pull as an optional power-path.** Confidence: **high** on the shape of the answer; **medium** on
some field-level completeness (no live account — see Unknowns and the sanity-check at the end).

Why full-API migration fails as an MVP default:

1. **The AccuLynx API can't move the whole record — and can't move files at all.** Documents, photos,
   videos, and measurements are **write-only** on the public API: there are upload endpoints but **no
   GET/download endpoints** [S-API-001 §7.13; S-MIGRATION-009]. The single richest thing a roofer
   wants to keep — job photos and signed PDFs — is unreachable by API. Estimates, invoices, and
   supplements are read-only (fine for export) but the *structured* money/CRM objects are readable
   while the *content* is not.
2. **The API is gated behind a paid add-on the departing customer is trying to stop paying for.**
   API keys require enabling the **AppConnections** add-on; keys are admin-created inside the app
   (Account Settings → Add-On Features and Integrations → API Keys → Create Key) [S-MIGRATION-010;
   S-API-016]. Asking someone who is leaving AccuLynx to first *buy* an AccuLynx add-on to escape is
   high friction and a poor first impression in our onboarding.
3. **No OAuth / no "Connect your AccuLynx" button is possible.** Auth is a single company-scoped
   bearer key; there is no OAuth for third parties, and vendors who use the API on a customer's
   behalf without going through AccuLynx's **Partnership Application** risk getting the customer's
   account suspended [S-API-002; S-MIGRATION-009]. So any API path requires the contractor to
   generate and paste their own key — we cannot broker it.
4. **The contract clock works against automation.** AccuLynx confirms the customer **owns** their data
   (ToS §9) but only guarantees access **while the subscription is paid**; after termination AccuLynx
   "shall have no obligation to maintain, store or provide" the data and "may delete" it unless the
   customer requests an export **in writing before** termination, in a "mutually agreed upon format,"
   and AccuLynx "may charge … a reasonable fee" (ToS §15). Accounts >15 base users pay a monthly
   **data-storage fee** to keep a cancelled account alive (ToS §14) [S-MIGRATION-001, S-MIGRATION-002].
   The migration must therefore happen **before the customer cancels AccuLynx**, and our flow has to
   say so loudly.

Why the workaround works: AccuLynx *does* let any customer self-export the structured records
(contacts, jobs, custom fields, report data) to **CSV/Excel** from the Reports UI while their
subscription is active [S-MIGRATION-004, S-MIGRATION-005, S-MIGRATION-006], and **every competitor
that advertises AccuLynx switching does it this way** — customer-initiated export + vendor-assisted
import + field mapping + training — not via an AccuLynx API pull [S-MIGRATION-012..018]. That
convergence is the single strongest signal for what is actually achievable.

**Bottom line for the onboarding MVP:** build a guided CSV importer for **contacts + jobs (+ custom
fields)** with field mapping, launched right after signup, wrapped in a "export from AccuLynx before
you cancel" playbook, with a concierge "email us your export and we'll load it" fallback. Treat
photos/documents/message history as the **lossy frontier** — link/handle manually in v1, do not
promise automated photo migration. Offer API pull only as a later power-path for customers who
already have AppConnections.

---

## The portability reality (the constraint that shapes everything)

| Fact | Evidence | Tier |
|---|---|---|
| Customer **owns** their data; AccuLynx is processor/controller-for-customer | ToS §9: "as between AccuLynx and You … You are the Controller or Owner of Your customer Personal Information" [S-MIGRATION-001]; myths page: "you own your data" [S-MIGRATION-002] | P |
| Data access is **subscription-gated** | Myths page: "if you decide to discontinue use … you will still be able to access or download your data **as long as you continue to pay for your subscription**" [S-MIGRATION-002] | P |
| After termination, AccuLynx may **delete** data unless a written export request is made **in advance**, in a "mutually agreed upon format," possibly **for a fee** | ToS §15 [S-MIGRATION-001] | P |
| Cancelled accounts with **>15 base users** pay a monthly **data-storage fee** to stay accessible | ToS §14 [S-MIGRATION-001] | P |
| Customers publicly complain about lock-in | Capterra verbatim (doc 01): "Too expensive. They hold their data hostage" [doc 01, S-OVERVIEW-025] | S |

**Design implication:** the #1 job of our onboarding migration flow is to get the export done **while
the AccuLynx subscription is still active**, and to frame Eaverow as the low-friction exit. "Export
before you cancel" is both true and a wedge.

---

## Q1 — Self-serve export from AccuLynx: what a customer can actually pull

**Yes for structured records via Reports → Download/Export (CSV/Excel).** The consistent, independently
corroborated flow (three integration-partner help docs describing the live UI):

> Reports tab → open a report (Jobs Report / Sales Report / a contact-oriented report) → set Date
> Range to **All Data** → Actions → **Edit Report** → **Columns** (tick the fields you want, e.g.
> Primary Contact: Name / Phone / Email, address, job stage, dates) → Apply → Actions →
> **Download/Export** → choose **Excel or CSV** [S-MIGRATION-004, S-MIGRATION-005, S-MIGRATION-006].

Supporting reporting facts:
- AccuLynx ships **20+ pre-built reports** (jobs/milestones, permits, supplements, A/R, materials,
  dead leads, estimates, contacts) that can be column-edited and exported; reports can be scheduled
  and emailed. **ReportsPlus** is the (add-on) reporting suite [S-MIGRATION-007, S-MIGRATION-008].
- Custom fields on contacts/jobs are user-defined via **Custom Fields Manager** (Spring 2026) and
  show up as report columns / API fields — so they are exportable but must be enumerated per account
  [S-MIGRATION-016; doc 01].

**What exports cleanly (CSV/Excel):** contacts (name, phones, emails, addresses), jobs/pipeline
(stage, dates, site address, category, lead source, values), custom-field values, and any report
data. **What does NOT come out of the Reports export:** photos, documents/PDFs (incl. signed
contracts), message/SMS/email threads, measurement files, and automations/templates. There is **no
evidence of a one-click full-account export** or a **bulk photo/document ZIP** — AccuLynx's photo
tooling is about capturing, tagging, and turning photos into PDFs, not exporting an archive
[S-MIGRATION-021]. Third-party switch guides say photos/docs must be **downloaded manually**, job by
job, and warn AccuLynx photo export "can be slow" [S-MIGRATION-017, S-MIGRATION-018] (T).

---

## Q2 — API access for customers: self-serve within the app, but add-on-gated and file-blind

- **Can a contractor get their own key?** Yes. Enable the **AppConnections** add-on (Market → Add-Ons
  → "AppConnections by AccuLynx" → Enable), then a **Company/Location Administrator** creates a named
  key at Account Settings → Add-On Features and Integrations → API Keys → **Create Key**
  [S-MIGRATION-010; S-API-016]. It is self-serve *inside* the app but **plan/add-on-gated** (costs
  money; price not public — see Unknowns) and **admin-only**.
- **Auth:** single company-scoped **bearer API key**, **per location**. **No OAuth, no customer-facing
  scopes** [S-API-073, S-API-154]. So there is no third-party "Connect your AccuLynx account" flow we
  can build — the contractor must paste their own key.
- **Readable (good for export):** contacts, jobs (+ history), estimates (read-only), invoices
  (read-only), financials/worksheet + amendments, payments, supplements, users, calendars/appointments,
  milestones/history [S-API-001 §6]. That covers the CRM + money spine as structured data.
- **NOT readable (blocks file migration):** documents, photos/videos, measurements are **upload-only —
  no GET** [S-API-001 §7.13]. Job messages are **create-only** [S-API-001 §6]. So the API can pull the
  *records* but not the *attachments or conversations*.
- **Limits:** ~10 req/s per key, 30 req/s per IP; offset pagination; contact/job **search caps
  pageSize at 25** [S-API-003, S-API-047, S-API-124]. Fine for a one-time bulk read of a mid-size
  roofer; not instant.
- **Vendor-on-behalf pull:** not available self-serve — vendors are routed to a **Partnership
  Application**, and unauthorized vendor use can **suspend the customer's account** [S-API-002;
  S-MIGRATION-009]. This is a hard blocker on us doing the API pull *for* them without their key.
- **Reality check that the API-pull path is real:** ELT connectors (Portable, and per doc 05
  Fivetran) already replicate AccuLynx "business entities" into a warehouse via this public API
  [S-MIGRATION-011] — but they, too, require the customer's AppConnections key and cannot fetch files.

**Net:** API pull is technically possible and gives clean structured data, but it is gated, key-paste,
file-blind, and rate-limited — a power-path, not the MVP default.

---

## Q3 — How competitors do AccuLynx → their-platform migration (the strongest signal)

Every roofing CRM that markets AccuLynx switching uses the **customer-export + assisted-import**
pattern. **None advertises an automated AccuLynx API migration.**

| Competitor | What they advertise | Method (inferred) | Evidence | Tier |
|---|---|---|---|---|
| **JobNimbus** | "We've helped **thousands of contractors move from AccuLynx to JobNimbus** without disrupting their jobs, their team, or **their data**." "Structured migration support … with minimal disruption." "Ongoing AccuLynx projects stay live during migration." **Free** structured migration in onboarding **plus paid Professional Services** for hands-on/enterprise migration. | Customer CSV export → JobNimbus-guided import + field mapping + live training; optional paid white-glove | [S-MIGRATION-012, S-MIGRATION-013] | C |
| **Roofr** | "Dedicated Account Manager to help onboard"; "dedicated implementation team"; assisted onboarding "includes migration support." | Assisted onboarding + implementation team loads data | [S-MIGRATION-015] | C |
| **Leap** | "Your dedicated onboarding rep will help you get your existing data into Leap … walk you through what can be migrated and how to prepare your files." | Rep-assisted import from prepared files | [S-MIGRATION-014] | C |
| Third-party switch playbooks (JobNimbus/Roofr/Leap all named) | "AccuLynx supports CSV exports for customers, jobs, and contacts. Export everything before you do anything else." Test-import 50–100 records; migrate in batches by record type; keep old CRM read-only 30–60 days. | Customer CSV export → guided importer; explicitly *not* API | [S-MIGRATION-016, S-MIGRATION-017, S-MIGRATION-018] | T |

**Read:** the entire competitive field has concluded the achievable migration is **CSV export +
white-glove/guided import + field mapping + training**, run while the source account is still live.
If an automated API migration were practical, at least one of these well-funded competitors would
advertise it; none does. That is our clearest evidence of what's actually buildable.

---

## Q4 — Third-party / portability tooling & the contract

- **ELT/warehouse connectors** (Portable, Fivetran per doc 05) replicate AccuLynx business entities to
  BigQuery/Snowflake via the public API [S-MIGRATION-011]. This is a **data-engineering** path
  (needs the customer's AppConnections key), not a turnkey consumer migration tool — but it confirms
  structured objects are API-extractable and could underpin our *optional* API pull.
- **Migration-as-a-service** exists: agencies (e.g., Work Ninjas "CRM Data Extraction & Migration for
  Roofers") and freelancers on Upwork/Fiverr sell AccuLynx→JobNimbus/RoofLink/Leap migrations
  [S-MIGRATION-019, S-MIGRATION-020]. Signal: this is currently a **manual services** problem, not a
  productized API — which is exactly the friction our guided importer + concierge can absorb.
- **No standard CSV template / portability spec** exists; each destination defines its own import
  schema. There is no AccuLynx-published export schema to conform to.
- **Contract/ToS** (covered in "portability reality" above): owns-your-data **but** access is
  pay-to-stay, post-termination deletion is permitted, and a formal export may cost a fee (ToS §14/§15)
  [S-MIGRATION-001]. Our flow must front-run the cancellation.

---

## Q5 — What realistically migrates vs what's lossy (ranked)

| Rank | Data | Best extraction method | Extractability | Notes |
|---|---|---|---|---|
| 1 | **Contacts** (name, phones, emails, addresses) | CSV report **or** API | **HIGH** | The clean, universal win. Dedupe on email/phone/address. |
| 2 | **Jobs / pipeline** (stage, dates, site address, category, lead source, value) | CSV report **or** API | **HIGH** | Stage names won't map 1:1 → needs a milestone-mapping step (doc 04 §3). |
| 3 | **Custom fields** (contact/job) | CSV report **or** API | **MED-HIGH** | Must be enumerated per account; "rarely map 1:1" [S-MIGRATION-016]. Good cleanup moment. |
| 4 | **Estimates** (headers, totals; line items via API) | API read / report | **MEDIUM** | Structured numbers extract; the branded **proposal PDF** does not. |
| 5 | **Financials / invoices / payments** (values, balances, A/R) | API read / A/R report | **MEDIUM** | Numbers yes; QuickBooks/Sage ties need reconfig in the new system [S-MIGRATION-018]. |
| 6 | **Insurance / claims** (carrier, claim #, adjuster, supplements) | Report / API | **MEDIUM** | First-class in AccuLynx (doc 04); exportable as fields, but supplement negotiation logs are thin. |
| 7 | **Estimate line items / price book** | API read (price book **not** API-exposed) | **LOW-MED** | Line items readable per estimate; the price-book catalog itself isn't exposed [S-API-001; doc 04]. |
| 8 | **Documents / PDFs** (contracts, e-signed) | **Manual download only** — no API GET | **LOW** | Per-job manual save; e-sign audit trails likely unrecoverable. |
| 9 | **Photos / videos** | **Manual download only** — no bulk export, no API GET | **LOW** | The biggest gap and what roofers care most about. Plan manual/link handling. |
| 10 | **Messages / SMS / email / activity feed** | Largely non-exportable | **LOW** | API is create-only for messages; no history export surface. |
| 11 | **Automations / templates / workflows / checklists** | Rebuild from scratch | **NONE** | Configuration, not data — every guide says rebuild [S-MIGRATION-017]. |

The extractability cliff sits between **row 7 and row 8**: everything above the line is
structured/tabular and moves via CSV or API; everything below is **files, conversations, or config**
and does not move cleanly by any public means.

---

## Viable migration methods for the onboarding MVP (ranked)

### Method A — Guided CSV importer (contractor self-exports → our field-mapping importer) — **RECOMMENDED CORE**
- **How it works:** In-app wizard instructs the contractor to run the specific AccuLynx Reports export
  (contacts, jobs, custom fields) to CSV/Excel, upload the file(s), then our UI auto-maps columns
  (with manual override + saved mapping), dedupes, previews, and imports in batches.
- **Data captured:** contacts, jobs/pipeline, custom fields, and any report-exportable fields
  (estimates/financials headers if present in the report). Rows 1–6 above.
- **Build effort:** **Medium.** File parser (CSV/XLSX), a column-mapping UI, dedupe + validation +
  preview + error report, idempotent re-import. The mapping UI is the real work.
- **Contractor friction:** **Low-medium.** They run 1–3 exports and upload; no add-on purchase, no
  API key, no waiting on us.
- **Confidence / evidence:** **High** that the export exists and this is the industry-standard method
  [S-MIGRATION-004..006, 012..018]. Medium on exact exportable columns (Unknowns).

### Method C — White-glove "send us your export, we'll load it" — **RECOMMENDED CONCIERGE TIER / FALLBACK**
- **How it works:** Contractor emails/uploads their raw AccuLynx export(s) (and any manually-downloaded
  photo/doc archive); our onboarding team maps and loads it, and handles the messy long tail.
- **Data captured:** same structured set as Method A, **plus** whatever files the contractor manually
  pulls — a human can stitch photos/documents to jobs.
- **Build effort:** **Low to start** (an internal version of the same importer + a service playbook);
  scales with headcount, not code.
- **Contractor friction:** **Lowest** — mirrors exactly what JobNimbus/Roofr/Leap sell and what the
  market already pays freelancers for [S-MIGRATION-012..015, 019, 020].
- **Confidence / evidence:** **High** — it's the proven pattern; the only cost is our time.

### Method B — API pull (contractor supplies their AppConnections key) — **POWER-PATH / v2, NOT MVP DEFAULT**
- **How it works:** Contractor pastes a company API key; we page through the read endpoints and map to
  our schema.
- **Data captured:** cleanest structured contacts/jobs/estimates/invoices/payments/financials — but
  **no documents, photos, or messages** (write-only/create-only on the API) [S-API-001 §7.13].
- **Build effort:** **Medium-high** (paginated client across ~dozens of endpoints, rate-limit
  handling, entity stitching).
- **Contractor friction:** **High** — requires buying/enabling AppConnections and admin key creation
  on the system they're leaving [S-MIGRATION-010]; and files still need Method A/C anyway.
- **Confidence / evidence:** **High** it works (Portable/Fivetran do it [S-MIGRATION-011]); low that
  it's worth it at MVP given the add-on gate and file-blindness.

### Method D — Hybrid — **THE ACTUAL RECOMMENDATION**
Ship **A** as the default self-serve path, offer **C** as the concierge safety net for anyone stuck
or high-value, and add **B** later for the subset of customers who already run AppConnections and want
the cleanest structured pull. This is precisely the JobNimbus model (free guided import + paid
Professional Services) and it de-risks the field-completeness unknowns: if the CSV is thin, the human
in Method C catches it.

---

## Recommended MVP for the onboarding flow

**The smallest thing that delivers real migration value at signup:** a **guided CSV importer for
Contacts + Jobs (+ custom fields)**, launched immediately post-signup, wrapped in an "export from
AccuLynx before you cancel" playbook, with a one-click concierge fallback.

**Onboarding flow (happy path):**
1. **Warn first:** banner — "Still on AccuLynx? Export your data **before you cancel** — access ends
   when your subscription lapses." (ToS §15 basis [S-MIGRATION-001].)
2. **Instruct precisely:** show the exact AccuLynx Reports steps + a screenshot/checklist for the
   contacts export and the jobs export (Reports → report → All Data → Edit Report → Columns →
   Download/Export → CSV) [S-MIGRATION-004..006].
3. **Upload + auto-map:** drop the CSV/XLSX; auto-detect columns; let the user correct mappings; save
   the mapping.
4. **Preview + test batch:** import 25–50 records, show a diff/preview, surface errors, then run the
   full import in batches by record type (contacts → jobs).
5. **Handle files honestly:** tell the contractor photos/documents don't bulk-export; offer (a)
   "attach later / keep in AccuLynx read-only for 30–60 days" and (b) a **concierge** button —
   "email us your export and any downloaded files, we'll finish it."

**What a v1 importer needs:**
- **Formats:** CSV + XLSX ingest.
- **Entities:** `Contact`, `Job` (+ the `JobContact` link and one primary), and `CustomFieldValue`
  (map to our custom-field defs). Optional stretch: estimate/financial header rows if present.
- **Mapping UI:** auto-suggest by header name, manual override, per-entity saved templates; a
  **milestone/stage mapping** step (AccuLynx Lead/Prospect/Approved/Completed/Invoiced/Closed/Dead →
  our stages, per doc 04 §3).
- **Data hygiene:** dedupe on email/phone/normalized address; required-field validation; date/phone
  normalization; a downloadable error/skip report; **idempotent** re-import (so a corrected file
  re-runs safely).
- **Not in MVP scope (state explicitly to the user):** automated photo/document migration, message/
  SMS/email history, automations/templates, e-sign audit trails. Push these to concierge/manual/v2.

**v2 add-ons:** optional **API pull** (Method B) for AppConnections customers; a guided
photo/document downloader; QuickBooks re-link helper.

---

## Unknowns (what public sources cannot confirm — verify with a live AccuLynx account)

- **Exact exportable columns.** Whether the Reports export includes estimate **line items**,
  **financial/invoice/payment** detail, and full **insurance/claim** fields — or only headers — is
  unconfirmed. support.acculynx.com is bot-blocked (403, per doc 01), and we have no account. The
  contacts/jobs export is well-evidenced; deeper objects are **assumptions to verify**.
- **Any account-level "full export" or bulk file download.** ToS §15 implies an on-request export in a
  "mutually agreed upon format" [S-MIGRATION-001], but the **format, completeness, and fee** are not
  public. Whether a bulk photo/document archive is obtainable via support is unknown.
- **AppConnections price.** Gates the whole API path; not published [S-API-016].
- **DataMart (launched Oct 2025).** Marketed as warehouse-style access to company data (doc 01) — it
  *might* offer a self-serve bulk export a departing customer could use, but its extract mechanism,
  gating, and whether it survives a cancellation are unconfirmed. Worth probing with an account.
- **Destination import schemas.** Competitors' exact accepted CSV formats aren't public; we define our
  own.
- **Measurement data & e-sign trails.** No evidence these are exportable at all.

---

## Adversarial sanity-check on the load-bearing claim

**Claim:** "A contractor can get their contacts + jobs out of AccuLynx as CSV/Excel and we can import
them."
- **Support:** three independent integration-partner help docs describe the *live* Reports →
  Download/Export → CSV/Excel flow [S-MIGRATION-004, 005, 006]; the entire competitor field is built
  on this assumption [S-MIGRATION-012..018]; AccuLynx's own ToS/FAQ affirm ownership + download-while-
  paying [S-MIGRATION-001, 002]. **Verdict: high confidence the mechanism exists.**
- **Weakness:** none of these is a *direct* AccuLynx help-center page (that surface is bot-blocked),
  and we lack an account to confirm **which fields** are actually included and whether financials/
  estimate line items make it into the export. **Mark as: verify exact exportable column set and any
  full-account/bulk-file export with a real AccuLynx account before finalizing the importer schema.**
- **Claim "photos/documents can't be bulk-exported":** this is an **inference from absence** (no bulk
  export found + write-only file API [S-API-001 §7.13; S-MIGRATION-021]). Strong but not proven — a
  support-mediated archive may exist (ToS §15). **Verify.**

Prepared under docs/legal/clean-room-protocol.md; all sources logged in sources/migration.md.

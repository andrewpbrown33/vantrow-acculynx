# 14 — Capture-Gap Options: Landscape & Recommendation Memo

**Doc:** 14-capture-gap-options | **Prepared:** 2026-07-18 | **Type:** IDEATION / OPTIONS —
for Andrew to react to BEFORE we build anything. Not a build spec.
**Extends** (does not supersede) doc 13 (data-migration feasibility) and doc 05 (public API
teardown). Sources appended to `sources/migration.md` → "Round 3."

**Clean-room scope:** everything here concerns a **contractor exporting THEIR OWN data**, which
they own (ToS §9) and can authorize, while their subscription is live — never scraping AccuLynx's
proprietary content and never Eaverow logging in as the customer. See the Guardrail section; it
constrains every option below.

**The gap this memo addresses.** Doc 13 established that AccuLynx's CSV/report exports move the
structured spine (contacts, jobs, custom fields) and the API can read most records — but **five
things do not bulk-export by any public means**: (1) PHOTOS, (2) DOCUMENTS & signed PDFs, (3)
SMS/text threads, (4) per-job MESSAGE-BOARD / change history, (5) AUTOMATIONS & templates. The API
is **file-blind** (photos/docs/measurements are upload-only, no GET; messages create-only)
[doc 05 §7.13]. This memo surveys five method-families for closing that gap, pressure-tests each,
and recommends per item.

**Evidence tags:** [E] = evidence (a dated source says it); [I] = inference (our reasoning from
evidence); [U] = unverified (needs a live account to confirm).

---

## TL;DR — best-supported capture approach per gap item

| Gap item | Best-supported approach | Backfill (historical) vs Go-forward | Confidence | One-line why |
|---|---|---|---|---|
| **(4) Per-job MESSAGE-BOARD / change history** | Loop AccuLynx's **own** per-job `Export History/Comments` button (Job Menu → Settings), contractor-run, human-paced | **Backfill** — this is the only gap item with a real, sanctioned historical export | **Medium-high** | Uses AccuLynx's sanctioned export, not scraping; only missing piece is the bulk loop the UI lacks [E: S-MIG-V02] |
| **(1) PHOTOS** | **Manual/concierge**: contractor pulls per-job, OR a contractor-run bulk-image browser extension as best-effort — with tag/job-association loss disclosed. **CompanyCam** if already in use (go-forward only) | Backfill possible but **lossy & manual**; CompanyCam is go-forward-only | **Medium** | Bytes are reachable; the *structure* (tag→job) is what breaks. No sanctioned bulk channel confirmed [E/I] |
| **(2) DOCUMENTS & signed PDFs** | **Manual/concierge**, per-job download; flat PDF only | Backfill, manual; e-sign audit trail unrecoverable | **Medium** | Same as photos minus lazy-load; signed-PDF audit trails are gone regardless [E] |
| **(3) SMS / text threads** | **Not migrated.** Best-effort screenshot only; keep AccuLynx read-only 30–90 days | Neither — no export surface exists anywhere | **High (that it's lossy)** | No export UI, no webhook, no GET. Everyone online says screenshots "aren't a records strategy" [E] |
| **(5) AUTOMATIONS & templates** | **Rebuild in Eaverow**; screenshot config as a rebuild spec | Neither — config, not data | **High** | Every migration guide says rebuild; there is no data to capture [E] |
| **CROSS-CUTTING (all 5)** | **First verify the two sanctioned bulk channels** — ToS §15 written export & DataMart — before building anything | — | — | Could moot part of the build; both are [U] and untested [I] |

**Headline:** The CSV core from doc 13 remains the default. For the gap, only **one** item
(message board) has a clean automated win, and it rides AccuLynx's own export. Photos/documents are
**honest best-effort manual/concierge**. SMS and automations are **not captured by anyone** —
label them so. Before engineering anything, **probe the §15 written export and DataMart** on a live
account; if either yields bulk files, several build ideas collapse.

---

## Backfill vs Go-forward — the distinction that decides everything

This is the single most important framing, and it's easy to blur:

- **BACKFILL (historical)** = the years of photos, documents, message threads, and SMS already
  sitting in the contractor's AccuLynx account. **This is what roofers actually care about and it is
  the hard part.** Only two method-families reach it at all: browser automation / agents (walking
  existing jobs) and human/concierge (clicking through existing jobs). Both are lossy for files.
- **GO-FORWARD (new data)** = capturing data created *after* a pipe is set up. Webhooks/no-code and
  CompanyCam-style side-channels are **go-forward only** — and AccuLynx's own event surface has **no
  webhook topic for photos, documents, messages, or SMS** [E: doc 05 §8], so they can't even do
  go-forward for the gap off AccuLynx's own signals.

**Consequence:** any pitch that leans on webhooks or CompanyCam "solves" nothing historical. For a
departing contractor, the archive is 100% backfill, and backfill only comes from
walking-the-UI (manual, agent, or scripted) — with the sanctioned §15/DataMart channels as the
untested wildcard. **[I], strongly supported.**

---

## The five methods surveyed

Each was independently pressure-tested (adversarial review). "Survives scrutiny" is that reviewer's
verdict, not the proposer's.

### Method 1 — Scripted browser automation (Playwright/Puppeteer/Selenium + bulk-image extensions)

- **How it works:** Contractor logs into my.acculynx.com in a real browser; a script reuses the
  authenticated session to walk every job, auto-scroll lazy galleries, and hand session cookies to
  an HTTP client to download files before signed URLs expire; loops the per-job history export.
- **Can get:** message board (via the sanctioned per-job export loop) — strong; photo/document
  **bytes** — partial and lossy; SMS/automations — essentially not.
- **Build effort:** High. **Contractor friction:** High (Node/Playwright/extensions/2FA/multi-hour
  babysit — developer-grade work no roofer will do → in practice *we'd* run it, which is the trap).
- **ToS/legal:** Medium, dominated by account-suspension not CFAA. Contractor on own account is
  inside CFAA "gates" (Van Buren/hiQ) [E]. But the cookie-handoff reuses **internal** endpoints,
  colliding with ToS bans on "interfere in any way," reverse-engineering, and unauthorized access,
  plus AccuLynx's **server-log-monitoring right** [E]. If **Eaverow** ships/operates it, we're the
  "vendor-on-behalf" pattern doc 05 says can **suspend the customer's account** [E].
- **What people report (dated 2026-07-18):** bulk-image extensions (ImgDownloadPro, Bulk Media
  Downloader) advertise auto-scroll + network-level interception of lazy/CSS/API images [E]; the
  "Selenium-cookie-then-requests" download pattern is the documented norm for expiring URLs [E];
  Cloudflare bot-management (TLS/IP/JS/Turnstile) is the counter-force, but authed first-party
  traffic is a weaker target than anonymous scraping [E].
- **Held up under review:** **PARTIAL.** Reviewer: *drop* the "headless-drives-the-whole-session +
  cookie-handoff" variant as vendor-shipped/operated (ToS-breach + suspension mid-migration +
  credential custody + monthly-UI-break maintenance — AccuLynx ships monthly releases we can't test
  against). **Keep narrowly**: (a) the sanctioned per-job message-export loop at human pace; (b) a
  **contractor-clicks** bulk-image extension for photos/docs, best-effort, association-loss
  disclosed. Modern galleries are often **virtualized** (off-screen nodes unmount), so naive
  "scroll-then-grab" and consumer extensions may capture only the visible window [I]. Photo bytes
  arrive as **sanitized-filename JPEGs with tag/job association stripped** — low value without a
  human re-stitch [E: doc 13/FAQ].

### Method 2 — AI computer-use / browser agents (browser-use, Skyvern, Claude/OpenAI computer-use)

- **How it works:** An LLM agent drives a real Chromium session on the contractor's own account,
  reading screenshots + DOM, clicking download/export controls job-by-job.
- **Can get:** same reach as Method 1 (anything on screen, historically) — its one real edge over
  API/CSV is **historical reach**. But SMS/automations are only screenshots; message-export is just
  looping a button the UI already has; photos are many fragile sub-steps behind virtualized galleries
  and expiring URLs.
- **Build effort:** High. **Contractor friction:** High.
- **ToS/legal:** Same authorized-access posture as Method 1; same **vendor-on-behalf suspension**
  hazard. Added exposure: **prompt injection** — an agent that *reads* untrusted job content (message
  boards/SMS) can be hijacked; Google threat-intel reported a 32% relative rise in malicious
  indirect prompt-injection Nov 2025→Feb 2026 [E].
- **What people report (dated 2026-07-18):** benchmarks look great on short tasks (OSWorld-Verified
  low-80s%, WebVoyager ~89%) **but collapse on long-horizon, real-auth, real-write live tasks** —
  frontier agents finish only ~20–33% of real multi-step tasks; OSWorld 2.0 long-horizon best ~20.6%
  [E]. A ~2,000-action 200-job walk at even 99%/step ≈ near-zero clean-run probability → guaranteed
  mid-run failures, checkpointing, babysitting [E/I]. Cost ~$0.005 and ~6.8s **per step** [E]. Web
  Bot Auth allowlists are gated to ~19 named consumer agents — a bespoke Eaverow bot isn't on the
  list; signing announces "I'm automation," not signing exposes you to Cloudflare **Precursor**
  behavioral detection (shipped July 2026) [E].
- **Held up under review:** **PARTIAL → drop as MVP.** Reviewer: it is **dominated at MVP scale by
  the concierge human** (doc 13 Method C) — identical historical reach, none of the credential-vault,
  bot-detection, or compounding-failure risk. Keep-narrowly only as an **internal, supervised**
  accelerator for high-value accounts, files + message-loop only, never SMS/automations, never
  storing creds unattended, only after legal sign-off.

### Method 3 — No-code / integration platforms + AccuLynx's own surface (Zapier/Make/n8n/Workato, webhooks, DataMart) + CompanyCam side-channel

- **How it works:** No-code platforms sit on the public API + Zapier triggers + webhook topics.
  CompanyCam captures photos into its own cloud first, then syncs into AccuLynx.
- **Can get:** For the gap — **ZERO backfill**, confirmed. The API is file-blind and **no webhook or
  Zapier trigger fires on a photo, document, message, or SMS** [E: re-verified — 14 Zapier triggers,
  all contact/job/milestone/appointment lifecycle; 23 webhook topics, all structured]. Only real
  capture is the **CompanyCam** side-channel: go-forward, photos/docs **only**, **only if already
  adopted**, and **only content shot through CompanyCam** (not AccuLynx-native).
- **Build effort:** Low. **Contractor friction:** High (API path needs the paid AppConnections
  add-on the departing customer is trying to stop paying for).
- **ToS/legal:** Lowest — sanctioned first-party API + the contractor's own separate CompanyCam
  account. No CFAA/credential issue *because it captures nothing risky.*
- **What people report (dated 2026-07-18):** CompanyCam sync is one-way CC→AL; its "30-day backfill"
  backfills **jobs, not photos** [E — important correction]; per-project "Download All Photos" zip
  exists but no bulk-download-via-API [E]. DataMart (launched 28 Oct 2025) is a **structured** SQL/BI
  feed — "no manual exports required" but covers **zero** of the five gap items [E].
- **Held up under review:** **NO — drop for all five.** Reviewer: the CompanyCam "win" is
  **tautological** — it's the contractor re-exporting their own separate app, not a migration off
  AccuLynx; and it's go-forward-only, adopted-only, CompanyCam-shot-only. Keep exactly **one
  onboarding line**: *"If you already use CompanyCam, export your photos from CompanyCam directly."*
  (One open thread: whether DataMart's schema ever exposes file URLs or message text is **[U]** —
  worth a 60-second live probe, but BI warehouses normally carry metadata, not blobs [I].)

### Method 4 — Manual / concierge / semi-manual & migration-vendor services

- **How it works:** A human (contractor's own staff, a VA, a freelancer, or our onboarding team)
  logs into the contractor's live account and downloads photos/docs job-by-job, exports each message
  board, re-keys into Eaverow. Structured data still via CSV. This is what every competitor and every
  existing migration vendor actually does today.
- **Can get:** Photos/docs (manual grind, backfill), message board (one job at a time). **NOT** SMS
  (nobody captures it), **NOT** automations (rebuilt).
- **Build effort:** Low. **Contractor friction:** Medium.
- **ToS/legal:** Lowest-risk *when the account-holder's own person* does it. The landmine is
  **credential sharing** — if an **Eaverow-contracted VA or our team** logs in with the contractor's
  creds, that's the least-defensible actor (we're the named competitor), plus credential-custody
  liability, plus **2FA** (SMS code to the owner's phone) breaks unattended login [E].
- **What people report (dated 2026-07-18):** switch guides say photos "typically don't export
  cleanly via CSV… manually download… then re-upload," and for old jobs "archive to Google Drive
  rather than migrate" [E]; "photo export can be slow — plan a long window, verify counts" [E];
  competitor white-glove is **CSV-mapping + training, not file automation** — "walk you through what
  **can** be migrated" is the tell [E]; a manual migration-as-a-service market already exists (Work
  Ninjas, Upwork/Fiverr gigs) [E]. **Correction:** Import2 ($499+) lists **no** roofing CRMs and only
  supports "objects retrievable over the API" — AccuLynx files have no GET, so Import2 **cannot** do
  AccuLynx; cite it only as evidence of a generic CRM-migration market, not that the gap is
  serviceable [E].
- **Held up under review:** **PARTIAL — keep narrowly.** Reviewer: the concierge tier is correct and
  industry-validated, but **only** for (i) structured CSV import + mapping + training, and (ii)
  **coaching the contractor's OWN staff** through per-job file downloads with an honest "manual &
  incomplete" disclosure. **Drop** any path where **Eaverow** staff/VA logs into the live account;
  **drop** the framing that this "captures" SMS or automations; **scope CompanyCam** precisely
  (go-forward, already-adopted). Prefer the simpler honest path first: migrate structured data now,
  **keep AccuLynx read-only 30–90 days**, migrate files on-demand when an old job resurfaces.

### Method 5 — Legal / ToS / credential-security framework (the gate, not a capture method)

- **How it works:** The compliance gate every method must pass. Ranks each idea on: **who acts**
  (customer=green, vendor-with-creds=red), **credential exposure** (none-to-us=green, password-to-us=
  red), and whether **Eaverow-as-named-competitor** "accesses the Services" (yes=red, §3 competitive-
  product clause).
- **What the actual Terms say (fetched 2026-07-18) [E]:** §2 licenses are per-designated-user, "may
  not be shared"; §3 bans reverse-engineering, "probe/scan/test vulnerability," "interfere in any
  way," and — critically for us — "**access the Services in order to build a competitive product or
  service**"; §3 obliges the customer to prevent password sharing; §13 gives AccuLynx audit +
  **server-log-monitoring** rights; §14 allows **retroactive per-unauthorized-user charges**; §15
  permits **post-termination deletion** unless a **written export** is requested in advance in a
  "mutually agreed upon format," possibly for a fee. No OAuth exists (company bearer key only, no
  download scope).
- **CFAA posture [E]:** For the **contractor** on their **own paid** account, exposure is low —
  Van Buren (2021) made "exceeds authorized access" a gates-up-or-down question, not a purpose test;
  hiQ (9th Cir. 2022) reinforced that reaching data you're permitted to reach isn't "without
  authorization." **The real weapon is contract, not CFAA** — hiQ *won* CFAA yet *lost* on breach of
  LinkedIn's user agreement and signed a permanent injunction (Dec 2022).
- **Held up under review:** **KEEP — mandatory gate, with corrections.** Reviewer additions:
  (a) state the **core tension** loudly — inside the safe zone (AccuLynx's own native export
  features), the gap data is capturable only manually/one-at-a-time (photos, docs, message board) or
  **not at all** (SMS, automations); (b) add **tortious interference** — a named competitor that
  knowingly ships a tool inducing a customer to breach §2/§3 faces interference liability
  *independent* of CFAA/ToS, and the hiQ injunction's "active concert" reach can bind **Eaverow** if
  we orchestrate the access; (c) elevate §13 log-monitoring + §14 retroactive charges as live
  detection/penalty vectors; (d) make **"concierge never means we log in"** a hard written rule;
  (e) route bulk files through the **§15 written-export request** as the primary *blessed* channel
  (legally safe, but operationally unreliable — AccuLynx controls format/fee/completeness and has
  every incentive to slow-walk a competitor-bound customer).

---

## The legal / credential-security guardrail (first-class — constrains all options)

This is the fence inside which every capture idea must live. **Ranked greenest-first:**

**GREEN — do this:**
1. **Customer-initiated native export.** The contractor runs AccuLynx's own buttons (Export
   Contacts/Leads; Reports Download; per-job Export History/Comments); we only ever **receive the
   output file**. This is exactly what every competitor does.
2. **§15 written-export request** for bulk files, made **before cancellation**. The only
   contract-blessed bulk-file channel. Probe format/fee on a live account.
3. **Screen-share concierge** — contractor drives and stays the authenticated actor; we guide and
   receive files.

**YELLOW — proceed only with disclosure, contractor as the actor:**
4. **Customer-run local helper / browser extension** the contractor operates *as themselves* on
   *their own machine* (no creds to us). Still risks §3 "apply any procedure or process," so
   human-paced, best-effort, association-loss disclosed.

**RED — do not do:**
5. Take, store, or transmit the customer's AccuLynx password.
6. Any **Eaverow-branded software or staff that logs into / automates** AccuLynx as the customer —
   this stacks §2 (no-share) + §3 (competitive-product) + vendor-on-behalf suspension + tortious-
   interference + credential-custody, and can **suspend the account mid-migration**, destroying the
   export-before-cancel window (§15).

**Hard rules that follow:**
- We **never** hold AccuLynx credentials. If a human must log in, it is the **account-holder's own
  person**, never Eaverow or an Eaverow-contracted VA.
- Everything happens **before the contractor cancels** (§15 deletion clock).
- We ship tools the **contractor runs and consents to**; we do not operate them on their session.
- Legal review of the §3 competitive-product / tortious-interference exposure **before** any
  customer-facing capture tool ships.

---

## What's genuinely hard / may stay manual (honest section)

- **Historical photos WITH structure.** Bytes are reachable; the **tag→job association** that makes
  them worth migrating is what breaks (AccuLynx organizes by tag, not folder; downloads arrive as
  sanitized JPEGs). Any scalable automation exits the safe zone. **This is the hardest problem.** [E/I]
- **SMS / text threads.** No export surface anywhere — no UI button, no webhook, no GET. Nobody (us,
  competitors, migration vendors) captures these. Screenshots "aren't a records strategy." **Treat as
  not-migrated; keep AccuLynx read-only.** [E]
- **Signed-PDF audit trails.** Even manual download yields the **flat PDF only**; the e-sign audit
  trail is unrecoverable. [E]
- **Automations & templates.** Configuration, not data. **Rebuild in Eaverow.** Screenshot config as
  a rebuild checklist. [E]
- **Scale/reliability with no manifest.** There is no bulk count to verify against, so silently-
  missed jobs/albums are undetectable in a manual or scripted grind. [I]
- **Monthly UI drift.** AccuLynx ships on a fast release train (2.2506→2.2614) with no contract to us
  and no live account to test against — anything selector-dependent is a perpetual break-fix. [E/I]

---

## Recommended shortlist to prototype (2–3, worth a validated per-item playbook next)

**Prototype these, in this order:**

1. **VERIFY the sanctioned bulk channels FIRST — §15 written export + DataMart probe.** *(Not a
   build — a discovery task, but it gates the builds.)* On a live/authorized account, request a §15
   written export and note format/fee/completeness; run a DataMart query and check whether any file
   URLs or message text appear. **If either yields bulk files, it moots the photo/doc build.** Cheap,
   highest-leverage, no legal exposure. [U → resolve]

2. **Sanctioned message-board export loop (contractor-run, human-paced).** Automate *only* AccuLynx's
   own per-job `Export History/Comments` across all jobs. The one gap item with a clean, low-risk,
   backfill win because it rides their sanctioned export. Validate the output format (PDF/Xls/Csv) and
   an ingest mapping. [E: S-MIG-V02]

3. **Contractor-run best-effort photo/document helper (YELLOW-zone, disclosed).** A tool *the
   contractor runs as themselves* to pull per-job photos/documents — evaluate whether a
   virtualized-gallery-aware approach beats a consumer bulk-image extension, and **measure
   association loss** (can we preserve job/tag mapping, or only bytes?). Position as concierge
   best-effort, never the default, never operated by us. Pair with the **concierge tier** (coach the
   contractor's own staff) as the human safety net.

**Explicitly NOT on the shortlist:** vendor-operated headless automation, AI agents as an
unsupervised self-serve path, no-code/webhook pipes for the gap, and any promise to migrate SMS or
automations. Keep the CSV core (doc 13) as the default; these are add-ons to it.

---

## Open questions for Andrew

1. **Live-account access.** Can we get authorized access to a live AccuLynx account (a friendly
   design-partner contractor)? Shortlist item #1 — and doc 13's field-completeness unknowns — are
   blocked without it. This is the single biggest unblock.
2. **Named-competitor risk appetite.** As the §3 "competitive product" party, are we willing to ship
   *any* tool that automates AccuLynx (even contractor-run), given tortious-interference / hiQ
   "active concert" exposure? Or do we cap ourselves at "we only receive files the contractor pulls
   with AccuLynx's own buttons"?
3. **Concierge staffing & pricing.** Are we willing to run a manual/coached white-glove tier (mirrors
   JobNimbus free-import + paid Pro-Services), and at what price / for which accounts?
4. **Lossy-capture positioning.** Is "photo bytes without full tag structure" acceptable to
   position, or does shipping a lossy tool damage trust more than saying "keep AccuLynx read-only and
   pull photos on-demand"?
5. **Honest scoping of SMS/automations.** Confirm we will market these as **not migrated** (rebuild /
   read-only archive), so sales language doesn't create a false-promise / churn-refund liability.

---

## Hardest problem (call-out)

**Backfilling historical photos and documents with their structure intact.** There is no sanctioned
bulk channel confirmed (§15/DataMart untested), the API is file-blind, and the bytes that *are*
reachable arrive stripped of the tag→job association that gives them value. Every method that could
scale the capture (headless automation, agents) **exits the legal safe zone** and risks
account-suspension **during the very export-before-cancel window** the whole migration depends on —
so the technically-capable options are the legally-riskiest, and the legally-safe options
(contractor clicks, human grind) don't scale and lose structure. That tension is unresolved and is
where a live-account probe of §15/DataMart matters most.

---

*Prepared under docs/legal/clean-room-protocol.md. Extends doc 13; supersedes nothing. Round 3
sources logged in sources/migration.md.*

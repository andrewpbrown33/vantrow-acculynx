# Module: Mobile (Field App + Crew App)

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in `../sources/mobile.md`.

## Purpose

AccuLynx ships two companion mobile apps rather than one. The **Field App** (iOS/Android,
free with every account) is the sales-rep/PM surface: it opens the same job records as the
web product for lead creation, photo documentation with annotation and GPS/timestamp
stamping, measurement ordering, on-phone estimating, proposal eSignature, payment
recording, tasks/appointments, and job messaging — everything syncing in near-real-time to
the web account [S-MOBILE-001][S-MOBILE-006]. The **Crew App** (separate download, English
+ Spanish) is the labor-crew/subcontractor surface: labor-order tickets, accept/reject,
per-job checklists, progress photos, two-way translated messaging, and GPS-logged
check-in/check-out that gives the office live jobsite attendance [S-MOBILE-007]
[S-MOBILE-021]. A predecessor standalone Camera App was discontinued and folded into the
Field App [S-MOBILE-013]. The apps are online-first; no offline mode is publicly
documented (see Unknowns).

## Feature table

### Field App (rep/office-facing)

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Packaging & platforms | Free with every account; iPhone/iPad/Android; iOS build ~170 MB, requires iOS 17.6+; login with existing account. Vendor claims >99.9% crash-free sessions (marketing claim). App redesigned 2023; vendor-reported app-store ratings up >30% since. Current ratings: iOS 3.9/5 (583), Android ~4.2/5 | All field users | Download → log in → work | S-MOBILE-001, S-MOBILE-002, S-MOBILE-003, S-MOBILE-018, S-MOBILE-025 |
| Job file access from field | Opens the full job record: milestones and statuses, documents, estimates, material-order details, change logs, job value, balance due, payment history, appointments, work schedules, deliveries | Sales rep, PM | Open job → browse tabs → act | S-MOBILE-006 |
| Mobile lead creation | Create leads, job contacts, appointments, tasks on site; insurance + adjuster fields can be included on the mobile create-lead form (Winter 2023); custom contact/job fields on mobile since v2.10.0 (Mar 2026) | Sales rep | New lead → fill form (incl. insurance fields) → save → syncs to shared queue | S-MOBILE-006, S-MOBILE-022, S-MOBILE-002 |
| Lead triage in field | Sort/filter leads by milestone and "last touched"; mark leads Dead; Lead Rank AI score displayed on Lead/Prospect records in-app | Sales rep, sales mgr | Sort list → work highest-value/stalest → mark dead as needed | S-MOBILE-005 |
| Milestone/status/checklist updates | Advance job milestones, update workflow statuses, and tick checklist items from the field | Sales rep, PM | Open job → update milestone/status → check items | S-MOBILE-006, S-MOBILE-001 |
| Photo capture & upload | In-app camera or camera-roll upload; upload can start before picking a job; background upload with per-file status; selectable image-quality on upload; unlimited photo storage | All field users | Shoot → (assign job) → background upload → synced | S-MOBILE-004, S-MOBILE-013, S-MOBILE-022, S-MOBILE-015 |
| Photo annotation & editing | Annotate with measurements, arrows, text notes; discontinued Camera App's editing set (crop, rotate, text, drawing, stickers) was folded into the Field App per vendor; web editor keeps originals via save-as-copy | Sales rep, PM | Open photo → annotate → save | S-MOBILE-004, S-MOBILE-013, S-MOBILE-014 |
| Location Stamps (Jun 2026, v2.10.6) | Overlays GPS coordinates, physical address, and timestamp onto photos for insurance/compliance-grade documentation | Sales rep, PM | Enable stamps → shoot → stamped photo stored | S-MOBILE-002 |
| Albums, tags, search | Albums group photos by job/phase/location/audience (e.g. adjuster set); multiple admin-defined tags per photo/video (tags replaced folders platform-wide); filter by date/job/uploader; keyword search | All | Create album → add/tag photos → filter/search later | S-MOBILE-004, S-MOBILE-014, S-MOBILE-005 |
| Photo/album sharing | Share single photos or albums by email or text; direct album links (links can be expired later); convert photos to PDF for adjusters; every share is recorded on the job file | Sales rep, office | Select album → share → record logged | S-MOBILE-004, S-MOBILE-015 |
| Video support | Job videos upload alongside photos; platform transcodes for playback up to 720p; public API accepts a broad image/video format list (jpg/png/heic…; mp4/mov/avi…) with async (202) processing | All | Upload video → transcode → view in job file | S-MOBILE-014, S-MOBILE-016 |
| Document scanning | Built-in scanner converts multi-page paper documents to PDF and files them to the job on the spot | Sales rep, PM | Scan pages → PDF → attach to job | S-MOBILE-005 |
| Measurement ordering | Order aerial measurement reports (EagleView, GAF QuickMeasure, Hover, Geospan) from the app, or key in manual measurements; measurements flow into estimates | Sales rep | Open job → order report or enter manually → use in estimate | S-MOBILE-001, S-MOBILE-002, S-MOBILE-005, S-MOBILE-023 |
| Mobile estimating (Oct 2025, v2.9.0) | Build complete estimates on the phone from blank or saved templates: add materials/labor/pricing, organize by trade, edit quantities, calculate taxes, set profit margins; shipped in the same release wave as DataMart analytics and CallRail/Geospan expansions | Sales rep | New estimate → template or blank → line items → margins/taxes → save/send | S-MOBILE-002, S-MOBILE-010, S-MOBILE-012, S-MOBILE-019 |
| Proposals + eSignature | Assemble proposal packets combining reports, estimates, contracts with preview; present financing options; capture customer signature on the spot. Requires the Smart(er) Docs add-on | Sales rep | Build packet → preview → present → collect signature | S-MOBILE-001, S-MOBILE-018 |
| Payment recording | Record payments and view outstanding balances from the field | Sales rep, PM | Open job → record payment → balance updates | S-MOBILE-001, S-MOBILE-002 |
| Job messaging & texting | Find/reply to job message threads; SMS texting plus an inbox in-app; @Me notification queue; company-wide announcements viewable; voice-to-text entry of comments (OS keyboard mic, spoken punctuation) | All | Inbox → thread → reply/@mention | S-MOBILE-006, S-MOBILE-002, S-MOBILE-005 |
| Caller ID | Incoming calls display the AccuLynx contact's name (Winter 2023) | Sales rep | Call arrives → name shown | S-MOBILE-022 |
| Tasks & MyDay | Create/assign tasks with due dates; complete or dismiss open tasks; assignees notified; due tasks surface in web MyDay and the app's task section | All | Create task → assignee notified → complete in app | S-MOBILE-002, S-MOBILE-006, S-MOBILE-005 |
| Calendar & schedules | View appointments, work schedules, deliveries; manage calendar appointments; share schedules to the Customer Portal | Sales rep, PM | Open calendar → review/adjust → share | S-MOBILE-006 |
| Call/meeting logging | Log phone calls and record detailed meeting notes against the job | Sales rep | After visit → log call/notes → stored on job | S-MOBILE-001, S-MOBILE-002 |
| Configurable dashboard | Dashboard shows recently accessed jobs (user-configurable) and an activity feed linking to recently added/changed jobs; the discontinued Camera App also listed jobs near the user's current GPS location (vendor states its features moved into the Field App — INFERENCE that nearby-jobs survived) | All | Open app → dashboard → jump to job | S-MOBILE-022, S-MOBILE-013 |
| Navigation handoff | User picks preferred maps app (Google Maps, Apple Maps, Waze) in settings; job addresses open in it for turn-by-turn | Sales rep | Tap address → chosen nav app opens | S-MOBILE-005 |
| Sync to web | Photos, estimates, contracts, orders sync automatically to the web account; team sees field data in near-real-time | All | Automatic | S-MOBILE-001, S-MOBILE-004 |
| Canvassing adjacency | Door-knocking happens in partner apps (SalesRabbit, Spotio) whose leads funnel into AccuLynx; the Field App itself has no publicly documented canvassing mode | Canvassers | Knock in partner app → lead lands in AccuLynx | S-MOBILE-023 |
| Offline behavior | No offline mode is publicly documented. Users complain functionality needs a strong signal (see sentiment below); third-party reviewers describe the app as internet-dependent and historically a "read-only companion" before Fall 2025 estimating | All | — | S-MOBILE-002, S-MOBILE-012, S-MOBILE-024 |

### Crew App (crew/subcontractor-facing)

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Packaging & platforms | Separate free download, launched Aug 2019; iOS + Android; UI in English and Spanish; iOS rating 3.1/5 (56); requires jobs shared from an AccuLynx account | Crews, subs | Download → receive job invites | S-MOBILE-020, S-MOBILE-009 |
| Labor-order ticket | Crew sees the labor order: start/end dates, jobsite address, points of contact, special instructions, reference photos, attached documents (permits, material orders, reports) | Crew lead | Notification → open ticket → review scope | S-MOBILE-007, S-MOBILE-008, S-MOBILE-009 |
| Accept/reject jobs | Crews accept or decline a job request in-app, replacing phone/email confirmation loops | Crew lead, sub | Job request push → accept/reject → office sees status | S-MOBILE-007 |
| Crew scheduling & self-management | Calendar and list views of all scheduled jobs; subcontractors create/manage crews, designate crew leads, and reassign jobs between their crews | Sub owner, crew lead | Open calendar → view jobs → reassign if needed | S-MOBILE-009, S-MOBILE-007 |
| Labor checklists | Office-defined, per-job customizable checklists; crews tick items as work completes; each tick updates AccuLynx in real time | Crew; PM (define) | Office builds list → crew checks off → office watches progress | S-MOBILE-007, S-MOBILE-021, S-MOBILE-009 |
| GPS check-in/check-out | Crews check in/out of job sites; times plus GPS coordinates are auto-logged and visible in real time; office is alerted when crews arrive/leave (attendance tracking); launch release also cites GPS directions to the site | Crew; PM (monitor) | Arrive → check in → work → check out → log on job | S-MOBILE-021, S-MOBILE-008, S-MOBILE-009, S-MOBILE-020 |
| Progress photos | Crews photograph work and upload to the job file; v2.0.0 (2022) added camera preview, draft saving, and upload-progress visibility | Crew | Shoot → upload → office reviews | S-MOBILE-007, S-MOBILE-009 |
| Two-way messaging | Crew↔office messages with push notifications; every message auto-logged to the job file as a permanent record | Crew, PM | Message thread per job → notify → logged | S-MOBILE-007, S-MOBILE-008 |
| EN↔ES translation | English data shared from AccuLynx is viewable in Spanish and crew replies translate back to English in the office view | Spanish-speaking crews | Automatic on shared content | S-MOBILE-007, S-MOBILE-021 |
| Document scan/upload | Business-document scanning and uploading from the app (since v1.3.1, 2019) | Crew, sub | Scan → upload to job | S-MOBILE-009 |

**Customer sentiment** (verbatim from reviews, per protocol §3): the mobile app is the most
consistent complaint area. Capterra: "The app is terrible when it comes to photos. If you
are reviewing one of 1051 photos and let's say you scroll to picture number 45 … when you
back out … it starts you over at 1051 again" (project manager, Nov 2025); "The mobile app
can be a bit laggy at times" (office manager, May 2026); "It's slower then I'd like it to
be. When uploading photos, one is fine. But when I have to upload a dozen photos, I find
myself sitting here for a minute or two" (warehouse manager, Apr 2026); "at times it can
feel a step behind the desktop version" (office manager, May 2026) [S-MOBILE-011]. App
Store: "Limited Offline Functionality – Would be great if more features worked without a
strong signal" and "sometimes freezes or crashes, especially when uploading multiple
photos" (Mar 2025); "I cannot upload photos without using the web version" (Mar 2025)
[S-MOBILE-002]. Crew App: "takes away the need for check ins if your crews use it
properly" (Dec 2024); "the photos get stuck in loading mode" draining battery (Aug 2023)
[S-MOBILE-009]. A third-party reviewer notes Android users report more issues than iOS
[S-MOBILE-012].

## Key workflows

1. **On-site sales visit, lead to signed deal.** Rep navigates via preferred maps app
   [S-MOBILE-005], creates the lead on-site with insurance/adjuster fields [S-MOBILE-022],
   captures annotated and Location-Stamped photos [S-MOBILE-004, S-MOBILE-002], orders an
   aerial measurement or keys manual dimensions [S-MOBILE-005], builds an estimate from a
   template with trades/quantities/taxes/margin [S-MOBILE-010], assembles a proposal
   packet with financing options, previews it, and captures the customer's eSignature
   (Smart(er) Docs add-on) [S-MOBILE-018, S-MOBILE-001]; a deposit is recorded against the
   job balance [S-MOBILE-002]. Everything syncs to the web job file [S-MOBILE-001].
2. **Photo documentation loop.** Field user shoots in-app (or picks from camera roll,
   before even choosing a job), uploads in background with status visibility, tags and
   albums the set (e.g. "Before"/adjuster album), then shares by email/text/direct link or
   as a PDF to an insurance adjuster; the share event is logged to the job and the office
   sees images in near-real-time [S-MOBILE-013, S-MOBILE-004, S-MOBILE-015].
3. **Crew dispatch to completion.** Office sends a labor order; crew gets a push, reviews
   dates/address/instructions/documents, and accepts [S-MOBILE-007]. On arrival the crew
   checks in (time + GPS coordinates logged, office alerted), works through the job
   checklist item-by-item with each tick visible live in AccuLynx, uploads progress
   photos, exchanges auto-translated messages with the office, and checks out at day's end
   [S-MOBILE-021, S-MOBILE-008]. All artifacts land on the job file.
4. **Field-office coordination.** Rep's day starts on the app dashboard (recent jobs +
   activity feed) [S-MOBILE-022]; due tasks appear in the task section (MyDay on web),
   @Me notifications and company announcements surface what needs attention; milestones,
   statuses, and checklists are updated from the field so office pipeline views stay
   current [S-MOBILE-006, S-MOBILE-005].

## Data touched

Reads/writes (cross-reference `../04-inferred-data-model.md`): **Job** (milestone, status,
checklist items, value, balance) [S-MOBILE-006]; **Contact** and job contacts, incl.
custom fields [S-MOBILE-002]; **Lead** records + insurance/adjuster fields, Lead Rank
(read-only) [S-MOBILE-022, S-MOBILE-005]; **Photo/Video** (+tags, albums, annotations,
quality setting, location-stamp overlay, share records) — API: `POST
/jobs/{jobId}/photos-videos` with description/tags/externalId [S-MOBILE-016,
S-MOBILE-014]; **Document** (+scanned PDFs, folders) [S-MOBILE-005, S-MOBILE-017];
**Measurement order / manual measurements** [S-MOBILE-005, S-MOBILE-017]; **Estimate**
(line items, trades, taxes, margin) [S-MOBILE-010]; **Proposal packet + eSignature**
(Smart(er) Docs) [S-MOBILE-018]; **Payment record / balance** [S-MOBILE-002]; **Task**
(assignee, due date, state) [S-MOBILE-006]; **Appointment/Calendar/Schedule/Delivery**
[S-MOBILE-006]; **Message thread / SMS / announcement / @Me notification** [S-MOBILE-006];
**Call/meeting log** [S-MOBILE-001]; **Labor order** (dates, instructions, attachments),
**labor checklist items**, **check-in/out events (+GPS coordinates)**, **crew/crew-lead
assignments** — Crew App only; notably absent from the public API [S-MOBILE-007,
S-MOBILE-021, S-MOBILE-017].

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than
guess AccuLynx's behavior:

- **Offline architecture.** No official documentation of offline caching, queued writes,
  or sync-conflict handling exists publicly; the only evidence is user complaints that
  little works without signal [S-MOBILE-002]. Whether photos queue offline and auto-send
  later is unverified. We should treat offline-first as an open design space and a
  differentiation opportunity.
- **Blocked help-center detail.** `support.acculynx.com` (incl. the "Using the AccuLynx
  Field App" article) and `www-acculynx.com` pages return HTTP 403 to non-browser
  fetchers, so setup flows, in-app permission/role gating (e.g. who can see job financials
  on mobile), and exact Location Stamps toggle behavior (settings-level vs per-shot;
  burned-in vs removable overlay) are unverified.
- **Google Play listing** would not render on fetch: Android download counts, data-safety
  (declared location/camera permission usage), and current version parity with iOS are
  from search snippets only [S-MOBILE-003].
- **Crew App commercial terms**: the app is a free download tied to an account
  [S-MOBILE-020], but one third-party reviewer calls it a paid "add-on" [S-MOBILE-012];
  whether per-seat or bundled is unknown.
- **Check-in mechanics**: manual tap vs geofenced auto check-in, and whether continuous
  location tracking occurs between check-in and check-out, are not publicly stated.
- **Annotation tool parity**: whether the field annotation toolset equals the web editor
  (stickers, save-as-copy) is an INFERENCE from the Camera App migration statement
  [S-MOBILE-013]; unconfirmed for current builds.
- **Video capture**: whether video can be recorded in-app (vs uploaded from camera roll),
  and app-side length/size limits, are unverified; only API format lists are public
  [S-MOBILE-016].
- **No public API surface** exists for labor orders, checklists, or check-in/out events
  [S-MOBILE-017], so their data shapes are unknowable from outside.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

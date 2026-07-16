# AccuLynx UI Walkthrough (Public-Source Reconstruction)

**Date:** 2026-07-16 · **Method:** public help-center listings (via search snippets — the Zendesk
KB blocks direct non-browser fetches), acculynx.com feature pages and product-update posts,
app-store listings, review sites, and YouTube listings. YouTube *watch* pages were bot-blocked
through our egress proxy, so no video could be played; video sources below are cited by
URL/title only, without timestamps (see Unknowns). Per clean-room protocol §6, this document
describes **function only** — what screens show and do — and deliberately does not describe
visual styling, layout aesthetics, colors, or iconography. Source IDs refer to
`docs/research/acculynx/sources/ui.md`.

---

## A. Navigation map

The web app opens on a Dashboard home; most other surfaces are reached from a main navigation
bar with dropdown groups, or by drilling into a per-record "Job File" hub.

| Nav area | How reached | What lives there | Refs |
|---|---|---|---|
| Dashboard | Post-login home | Live activity feed pane; sales-pipeline snapshot (counts of leads, prospects, approved/completed/invoiced jobs); jump-offs to photo activity and measurement ordering; dropdown access to Automation Manager | [S-UI-001][S-UI-004][S-UI-014][S-UI-015][S-UI-016][S-UI-019][S-UI-024] |
| Jobs List | Main nav (INFERENCE: exact label/placement not shown publicly) | All leads/jobs, organized by the fixed milestone pipeline (Lead → Prospect → Approved → Completed → Invoiced → Closed; Dead); filter by milestone, sort by created/milestone/modified date; search | [S-UI-019][S-UI-029] |
| Contacts | Main nav (INFERENCE) | Contact records with a contact form; custom fields can be placed on it | [S-UI-026] |
| Calendar | Main nav (INFERENCE) | Company calendar: appointments, events; sidebar of calendars, search, filters by trade/work type/category/crew; external calendar sync | [S-UI-013] |
| Production Tools (dropdown) | Main nav | The Scheduler (Elite plan only) and the Order Manager | [S-UI-005] |
| Labor Tools (dropdown) | Main nav | Labor Manager (all plans) | [S-UI-005] |
| Reports | Main nav | ReportsPlus: report library, dashboard library, custom reports; favorited reports/dashboards pinned for one-click access from main nav | [S-UI-010] |
| Settings / Account Settings | Main nav or user menu (INFERENCE) | Custom Fields Manager; appointment-outcome definitions; automation setup reached from a dashboard dropdown | [S-UI-015][S-UI-026] |
| Job File (per record) | Click any job/lead row | Record hub with a job menu of tabs — see §B.4 | [S-UI-012][S-UI-021] |

**Job File internal menu** (assembled from multiple sources; tab order/labels partly inferred):
Overview (with "Next Steps" panel) · Messages · Photos & Videos · Documents · Measurements ·
Estimates · Orders · Worksheet (Financial Worksheet → Invoice Worksheet) · Calendar · Progress
view. [S-UI-012][S-UI-016][S-UI-021][S-UI-024]

Onboarding mirrors this map: the vendor's public "AccuLynx In 5" KB category is a 14-article
series of ~5-minute videos ordered: dashboard navigation → creating a lead & advancing
milestones → job overview (messaging, photos, documents) → measurements (entering, uploading,
ordering) → building estimate & order templates → creating & sharing estimates → ordering
materials & labor → creating a financial worksheet to set the job value → creating invoices &
processing payments. [S-UI-002][S-UI-003]

---

## B. Screen-by-screen walkthrough

### B.1 Dashboard (web home)

Shows: a live activity feed of company/job events (photo uploads, task completions, record
changes) where each entry links to its job; a pipeline view with counts by milestone (leads,
prospects, approved, completed, invoiced); accounts-receivable visibility (outstanding
invoices, orders, commission amounts). Actions: jump to a job from any feed item; open a
Job Photo Activity page listing recent photo uploads across all jobs; launch an EagleView
measurement order; open Automation Manager from a dropdown list menu.
[S-UI-004][S-UI-014][S-UI-015][S-UI-016][S-UI-019][S-UI-024]

### B.2 Jobs List

Shows: every lead/job as a row in the milestone pipeline; new unassigned leads land here
(API creates jobs at "Lead (Unassigned)"). Filters by milestone and assignment; sortable by
created/milestone/modified date; per-job priority flag (Urgent/High/Normal) so urgent work can
be surfaced; text search. Actions: open a job file; assign reps (plain dropdown, "Smart
Assign" ranked by proximity/close-rate/sales volume, or map-based assignment — described on
marketing pages rather than observed). [S-UI-019][S-UI-029]

### B.3 New Lead form

Shows (post-Spring-2026 redesign): sections for contact data and project-location data;
duplicate detection surfacing "possible matches" as you type; inline custom fields; an
appointment scheduler that can display multiple team calendars side-by-side; ability to copy
select data from one record to another. Actions: create the lead record; schedule the initial
appointment without leaving the form. [S-UI-026]

### B.4 Job File — Overview tab

The hub screen for one job. Shows: a "Next Steps" panel at the top displaying the job's
current Milestone or Status; under statuses, checklist items with who/when completion stamps;
job details (contacts, reps, trade/category, financial summary). A separate **Progress view**
(from the job menu) lists every milestone, status, and checklist item with completion state
and timestamps, with quick progress filters. Actions: advance milestone/status
(permission-gated), work checklists, edit details; custom fields appear on this page when
configured. [S-UI-012][S-UI-026]

Other Job File tabs in brief:

| Tab | Shows | Key actions | Refs |
|---|---|---|---|
| Messages | Inbox-style threaded conversations for the job, newest first; admin-defined tags; attachments | @mention teammates (notification), pin, edit/delete (marked), emoji reactions, mute thread, copy link, filter/search by tag/attachment/date/keyword, convert message → task with assignee/priority/due date | [S-UI-018] |
| Photos & Videos | Media grouped into standard albums auto-created per job (homeowner, adjuster, crew) plus custom albums; image detail view w/ tags & descriptions; date filters | Multi-select via checkboxes, reorder via drag handles, move/copy to another job, share album by expiring link (email/text/message), build PDF from selected photos | [S-UI-016] |
| Documents | Uploaded contracts, permits, insurance paperwork, supplements | Upload/manage; e-signed docs and measurement PDFs auto-file here | [S-UI-021][S-UI-024] |
| Measurements | Ordered aerial reports (EagleView, GAF QuickMeasure, Hover, Geospan) and manual measurements; "View 3D Rendering" button for Geospan | Order reports (§B.5); values flow into estimates/orders | [S-UI-013][S-UI-024] |
| Calendar | Job-scoped appointments | Create appointment (e.g., inspection), assign rep | [S-UI-021] |

### B.5 Measurement ordering flow

From the dashboard or the job-file Measurements tab → "Order Measurement" → choose provider
(e.g., EagleView). Order form asks for: report type, number of buildings, optional notes, and
confirmation that a map pin sits on the correct property. Finished reports return into the
same job file automatically, and measurement values can be pulled directly into estimates and
material orders. [S-UI-024]

### B.6 Estimate builder

Shows: line items (materials + labor) with quantities and costs; per-line waste-factor
adjustment; live supplier pricing (ABC Supply, SRS, QXO); profit-margin slider; taxes and
discounts. Start from a saved template (per trade, roof type, insurance vs retail, etc.) or
from scratch; measurement data auto-populates quantities; "Smart(er) Docs" merge fields
auto-fill customer info into proposal documents. Actions: save as template, convert to a
branded proposal, collect legally binding eSignatures (audit log of name/email/date/time/IP),
take payment (card/ACH via AccuPay) or offer financing, and convert the estimate into material
and labor orders. Multi-option ("Good, Better, Best") estimates supported via multi-estimate
smart fields. Full estimate building also exists in the mobile Field App.
[S-UI-006][S-UI-013][S-UI-022][S-UI-026]

### B.7 Job File — Financial Worksheet

Shows: the job's money picture in one sheet — line items synced from the primary estimate,
grouped into collapsible sections with per-section costs; approved job value box expandable
to summary totals by section type (change orders, discounts, etc.); outstanding balance;
Fall-2025 update ties revenue/expenses to specific trades. Actions: sync estimate → save →
approve (a green checkmark then appears on the job page and unlocks invoicing); add
amendments (change orders, discounts, insurance claims, supplements, upgrades, work-not-done)
as new date-stamped sections; edit line items; copy/move items between sections; customize
contact columns via a gear menu. [S-UI-011][S-UI-012][S-UI-013]

### B.8 Job File — Invoice Worksheet

Shows: invoices generated against the approved job value; right-hand summary box with amount
left to invoice, expandable to invoiced-to-date, collected, balance due, and approved value.
Actions: four creation modes — invoice in full, import selected Financial-Worksheet sections,
auto-generate an equal-payment invoice sequence, or add ad-hoc items; each invoice gets name,
date, payment terms; preview customer-facing copy; send by email with "Pay Now" link; take
card/ACH via AccuPay; record to QuickBooks or Sage Intacct; deleting an invoice recalculates
the remaining balance. [S-UI-025]

### B.9 Company Calendar

Shows (post-Fall-2025 redesign): all appointments/events; a color-coded sidebar of calendars;
search; advanced filters by trade, work type, category, crew. Multi-attendee appointments;
email and push alerts on changes; two-way live sync with Outlook and iCalendar, plus linked
Google shared calendars; appointments can be created directly from the lead form. Appointment
outcomes (custom-defined in settings) can be recorded per event and analyzed in an
Appointments Report (creator, type, duration, location, notes). [S-UI-013][S-UI-026]

### B.10 Scheduler (production calendar; Elite plan)

Shows: all labor assignments and material deliveries on one calendar, zoomable from two-week
range to a single day's hourly view; crews color-coded by trade or name; role-relevant
filters. A **"To Be Scheduled" drawer** lists outstanding unscheduled labor/material orders,
filterable and prioritizable. Actions: drag-and-drop events to reschedule; change timeframes;
drill into an order from the calendar and edit without leaving the screen; labor and material
tickets are cross-linked so each links to its counterpart. [S-UI-005][S-UI-023]

### B.11 Order Manager

Shows: every material/labor order as a card, organized in columns/groups by status (scheduled
and unscheduled). Filters include approved-job age, orders without dates, orders where money
is already collected; plus search. Actions: real-time edits, bulk updates (e.g., place many
material orders at once), reassign crews; conflict alerts on scheduling collisions; direct
supplier ordering (ABC Supply, SRS, QXO) without leaving the app. [S-UI-005][S-UI-014][S-UI-023]

### B.12 Labor Manager

Shows: roster of subcontractors and crews with contact details, trade, and a designated color
code; resource availability; filter/search. Actions: maintain crew records, control which job
info crews can see, send electronic documentation requests (e.g., insurance docs), invite
subs to the Crew App by text message; approving a labor order auto-generates a **labor
ticket** for the crew lead containing address, instructions, photos, and a customizable
checklist, with check-in/check-out visibility for the office. [S-UI-005][S-UI-014]

### B.13 ReportsPlus (reporting workspace)

Shows: a library of pre-built reports (sales, production, job costs, marketing leads) and a
dashboard library organized by role (sales pipeline, marketing, profitability, A/R,
production). Actions: customize any report/dashboard (add/remove data, filters, groupings,
logic, display type); share with individuals or company-wide; schedule automatic email
delivery (recipients, format, time, frequency); favorite any report/dashboard for one-click
access from main navigation. New pre-built reports arrive with feature launches (Job Value by
Trade, Job Worksheet, Appointments). [S-UI-010][S-UI-013]

### B.14 Automation Manager

Reached from a dropdown on the dashboard. Shows: list of automations, each with an on/off
toggle and an "Add Automation" button (top right). Create flow: name it → pick a trigger
(Job, Milestone, Order, or Financial/AccuFi event, with timing) → pick one action (send
templated email, assign task with assignee/due date/priority, or send SMS from the company's
local number, all with personalization tags) → toggle on. [S-UI-015]

### B.15 Field App (mobile, sales/PM-focused)

Main functional areas: a home/dashboard for tasks, appointments, leads, schedules, notes; a
communications hub (company announcements, @Me notifications, job message threads with
replies); job visibility (milestone/status updates with checklists, appointments, deliveries,
documents including estimates/material orders/change logs, job values and payment balances);
and photo management (unlimited capture, annotation, albums, search/filter, GPS + timestamp
"Location Stamps" overlays, auto-sync to the web app). Additional actions: create
leads/contacts/appointments/tasks; log calls and notes; scan multi-page documents to PDF;
capture measurements manually or order EagleView/GAF QuickMeasure/Hover/Geospan reports;
build full estimates and proposals (Smart(er) Docs add-on for proposals); collect
eSignatures; record payments. App Store rating 3.9/5 across 583 ratings as of 2026-07;
recent versions added custom fields (2.10.0) and location stamps (2.10.6).
[S-UI-008][S-UI-009][S-UI-013][S-UI-020]

### B.16 Crew App (mobile, subcontractor-focused)

Separate app (launched as beta) for crews invited by SMS from Labor Manager: view labor
tickets (address, instructions, photos, checklist), check in/out of jobs, complete
checklists, capture photos, message labor contacts, receive real-time notifications.
[S-UI-005]

### B.17 Customer Portal (homeowner-facing web)

Shows: project summary and live status, upcoming appointments, shared documents, billing
info. Actions for the homeowner: track job progress, view documents, pay via AccuPay, apply
for financing, message the contractor. Contractor side: brand the portal, choose which info
is shared, auto-send invites; content updates automatically from the job file. [S-UI-007]

---

## C. Overall UX patterns and reviewer friction

**Patterns (observed across sources).** (1) *Hub-and-spoke*: the Job File is the center of
gravity — comms, photos, docs, measurements, estimates, orders, and finances are tabs of one
record, and most cross-app surfaces (feeds, calendars, reports) deep-link back into it
[S-UI-004][S-UI-012]. (2) *Milestone pipeline as backbone*: a fixed milestone sequence with
optional custom statuses/checklists drives the Jobs List, the Overview "Next Steps" panel,
automations, and reporting [S-UI-012][S-UI-015][S-UI-029]. (3) *Card/queue management
screens*: Order Manager cards grouped by status and the Scheduler's "To Be Scheduled" drawer
implement work-queue triage [S-UI-023]. (4) *Toggle-and-template automation* rather than
free-form workflow builders [S-UI-015]. (5) *Wizard-style order forms* for third-party
services (measurement ordering) [S-UI-024]. (6) Ongoing modernization: calendar, lead form,
and field app have each been redesigned since 2024, implying older surfaces coexist with new
ones [S-UI-009][S-UI-013][S-UI-026].

**Friction reviewers report.** Verbatim quotes are from customer reviews (allowed under
protocol §3):

| Theme | Evidence | Refs |
|---|---|---|
| Dated/heavy UI, learning curve | "The app's user interface felt outdated and less modern than expected, which made navigation less intuitive." — Roof Inspector, May 2025. Third-party reviewers describe a 4–8 week ramp for new users and clunky navigation | [S-UI-017][S-UI-030] |
| Calendar redesign backlash | "What I like least about is the updated calendar and scheduling system...the layout has become confusing and much harder to read at a glance." — COO, Dec 2025 | [S-UI-017] |
| Photo browsing at scale | "If you are reviewing one of 1051 photos and let's say you scroll to picture number 45...when you back out...it starts you over at 1051 again." — Project Manager, Nov 2025 | [S-UI-017] |
| In-page navigation/search | "...if you could just click on something at the top and you could search for the next job instead of having to scroll all the way to the top." — Office staff, Nov 2025; "The search feature could also be better." — Office Manager, May 2026 | [S-UI-017] |
| Mobile gaps vs web | App reviewers report photo-upload failures forcing fallback to web, crashes on multi-photo upload, notification delays, limited offline mode, and missing desktop features | [S-UI-020] |
| Feature density | Reviewers describe the platform as sized for large orgs and "almost overwhelming" for small companies (paraphrase of Capterra reviewer sentiment) | [S-UI-017] |

Counterpoint: multiple reviewers simultaneously rate it "extremely user friendly" and easy to
navigate [S-UI-017] — friction concentrates in high-volume browsing (photos, calendar,
search) and mobile parity, not in basic CRUD flows.

**Design takeaways for us (our conclusions, not observations):** invest in fast global
search/jump-to-record, scroll-position-preserving media browsing, true mobile/web parity with
offline support, and progressive disclosure so small crews aren't buried — these are the
loudest unmet needs in public reviews.

---

## Unknowns

- **Exact top-nav labels, order, and item count.** No public screenshot-free source
  enumerates the main nav; our map is assembled from scattered "found under X dropdown"
  statements and is partly INFERENCE.
- **Video content and timestamps.** YouTube watch pages and the Zendesk KB were bot-blocked
  through our proxy; we could not view any demo video, so no screen claim here carries a
  video timestamp, and KB video articles are cited from titles/search snippets only. A
  human re-check watching S-UI-027/S-UI-028 and the "AccuLynx In 5" videos would firm up
  in-screen details.
- **Dashboard composition details** (which widgets exist, whether/how they are customizable
  or pinnable) — third-party summaries conflict and were not relied on.
- **Jobs List column set, saved views, and bulk actions** beyond filter/sort basics.
- **Settings/admin IA** (full settings tree, permission-editing screens).
- **Empty states, error handling, load times, and any in-product onboarding tours** — never
  described publicly; we design these from scratch.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

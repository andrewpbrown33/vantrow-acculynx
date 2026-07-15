# Module: CRM (Lead Intake, Contacts, Pipeline, Activity, Assignment, Follow-up)

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in `../sources/crm.md`.

## Purpose

The CRM module is the front door of AccuLynx: it captures leads from many channels into a
single queue, stores the people/companies behind them as contact records, and moves each
record through a fixed job-lifecycle pipeline (Lead → Prospect → Approved → … → Closed).
Around that pipeline it layers assignment tooling (manual, data-assisted, and map-based),
an AI lead score, per-job communication logs (email/SMS/notes/tasks), and a trigger-based
automation engine so follow-ups happen without manual tracking. A distinctive design
choice: a "lead" is not a separate object — it is the earliest milestone of the same job
record that later carries production and financial data [S-CRM-003][S-CRM-026].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Manual lead creation (web) | Lead form capturing contact, project-location address, job category, work type, trade type(s), lead source, priority, notes; redesigned 2026 with duplicate detection ("possible matches"), inline custom fields, side-by-side calendar for booking the initial appointment, and copying data between records | Office staff, sales rep | Open lead form → enter contact + project details → review possible duplicate matches → save; record starts at Lead milestone | S-CRM-015, S-CRM-026 |
| Mobile lead creation (Field App) | Field app (free with every account) lets reps create leads, job contacts, appointments, and tasks on site and update milestones; insurance/adjuster fields can be included on the mobile create-lead form | Sales rep (field) | In app: new lead → fill form → save → lead syncs to shared queue | S-CRM-033, S-CRM-034 |
| Lead-service imports | Native connections auto-create leads from HomeAdvisor/Angi (Ads + Leads), SalesRabbit, Spotio, Roofle; HubSpot two-way sync and Zapier require the paid AppConnections add-on. Imported leads arrive as *unassigned* leads in the jobs list | Admin (setup); sales mgr (consume) | Connect account once → new third-party lead auto-creates unassigned lead → team assigns | S-CRM-017, S-CRM-018, S-CRM-029 |
| API lead intake | Public REST API: `POST /jobs` creates a record at milestone "Lead (Unassigned)"; only `contact` is required; optional leadSource, address, priority (Urgent/High/Normal), jobCategory, workType, tradeTypes, notes. Legacy v1 endpoint existed specifically for HomeAdvisor lead import. One API key per company location | Developers/integrators | External form/website → POST → unassigned lead appears | S-CRM-026, S-CRM-032, S-CRM-036 |
| Lead source taxonomy | Company-configurable lead-source list, hierarchical (parent → child sources, e.g. a canvassing parent with specific campaigns), with active/inactive state; each job stores one source, editable later via API | Admin (configure); all (tag) | Admin defines sources → picker on lead form → reports roll up by source | S-CRM-005, S-CRM-022, S-CRM-019 |
| Lead Intelligence (Lead Rank) | Built-in AI score on Lead and Prospect records predicting likelihood to buy, computed from third-party demographic, financial, and property data; shown as an indicator on list views; filterable/sortable; included at no extra cost (launched Apr 2023) | Sales mgr, sales rep | Open Jobs/Leads list → sort/filter by Lead Rank → work highest-ranked first | S-CRM-001, S-CRM-002 |
| Priority flag | Per-record priority (Urgent/High/Normal via API; marketing describes high vs normal) used to sequence follow-up and surface urgent work in lists | Sales mgr | Set on creation or later → filter list by priority | S-CRM-011, S-CRM-026 |
| Unassigned-lead queue | New/imported leads sit unassigned until a rep is attached; jobs list filters by `assigned`/`unassigned`; dead leads revert to unassigned | Sales mgr | Filter list to unassigned → assign rep | S-CRM-003, S-CRM-017 |
| Quick Assign | Dropdown of all reps directly on a lead for fast handoff | Sales mgr | Click lead → pick rep → rep auto-notified | S-CRM-010 |
| Smart Assign | Decision-support view comparing reps by distance/nearby jobs, YTD close rate, and trailing 30/90-day sales dollars before assigning | Sales mgr | Open Smart Assign on lead → compare rep stats → pick rep | S-CRM-009, S-CRM-010 |
| Map Assign | Map of the new lead plus nearby records colored by lifecycle stage (lead/prospect/active/closed) to route by territory density | Sales mgr | Open map view → inspect nearby jobs → assign rep | S-CRM-010 |
| Assignment notification | Assigned rep is automatically alerted so response time doesn't depend on word of mouth | Sales rep | Assignment → push/in-app alert → rep follows up | S-CRM-010, S-CRM-011 |
| Job roles | Each job carries distinct people slots via API: sales owner (add/update/delete), company representative, and A/R owner. Reviews complain only one user can own a lead | Sales mgr, admin | Set/replace owner per job; webhook fires on rep assignment | S-CRM-019, S-CRM-027 |
| Contact records | Contact object independent of jobs: first/last name, company name + job title, cross-reference ID, free-text note, multiple typed phone numbers (Home/Mobile/Work, ext, texting-capable flag, primary), multiple typed emails (Personal/Work/Other, primary), mailing + billing addresses | All | Created standalone, via lead form, or by import; one contact links to many jobs | S-CRM-020, S-CRM-006, S-CRM-019 |
| Contact types | Company-scoped contact-type list (e.g. "Customer") with a default flag; a contact can hold multiple type IDs | Admin, office | Assign type(s) at creation | S-CRM-024, S-CRM-020 |
| Multi-contact jobs | A job holds several contacts with one designated primary (drives invoicing recipient, automation greetings); primary-changed events are exposed as webhooks | Office, sales rep | Add contacts to job → mark primary | S-CRM-019, S-CRM-008 |
| Custom fields | Custom Fields Manager (Spring 2026) lets admins define fields for both contacts and jobs; fields surface on the contact form, lead form, job overview, and in reports, and are readable/writable via API, Zapier, HubSpot/Spotio | Admin (define); all (fill) | Account settings → define field → appears on chosen forms → value-change webhooks fire | S-CRM-015, S-CRM-008, S-CRM-019 |
| Milestone pipeline | Fixed lifecycle milestones: Lead, Prospect, Approved, Completed, Invoiced, Closed, plus terminal states Dead, Cancelled, Deleted (API enumerations). Dashboard shows pipeline counts of leads, prospects, approved/completed/invoiced jobs | All; owner for dashboard | Advance record milestone-by-milestone; each transition timestamped and queryable | S-CRM-003, S-CRM-021, S-CRM-009 |
| Custom workflow statuses & checklists | Workflow Manager (2021) adds admin-defined sub-statuses beneath each milestone, variable by trade/category/work type, each with checklists; checklist completion records who/when; milestone advancement can be permission-restricted; Progress view tracks all jobs' status/checklist state | Admin (configure); ops/sales (execute) | Admin builds statuses+checklists → users tick items → permitted user advances milestone → status-change webhook | S-CRM-012, S-CRM-004, S-CRM-030 |
| Dead-lead handling | Leads/prospects can be marked dead with a stored dead reason; dead records drop to unassigned and are excluded from default list filters | Sales mgr | Mark dead + reason → excluded from active pipeline; reason kept for analysis | S-CRM-003, S-CRM-023 |
| Jobs/Leads list filtering | Central list filterable by milestone set, assignment state, date ranges on created/milestone/modified dates, priority, assigned rep, last-touched, Lead Rank; sortable both directions | Sales mgr, rep | Apply filters → work the resulting queue | S-CRM-003, S-CRM-002, S-CRM-011 |
| Lead history / audit trail | Per-lead action log (e.g. creation, changes) with UTC timestamp, acting user, and dead reason; separate job change-history endpoint for later lifecycle | Sales mgr, admin | Open history → review chronological actions | S-CRM-023, S-CRM-019 |
| Job file activity hub | Every lead/job accumulates notes, threaded messages, tasks, documents, photos, emails, and texts in one record with a live activity feed; reviewers confirm an activity feed + notes section | All | Open job file → review feed → add note/message/task | S-CRM-014, S-CRM-028, S-CRM-027 |
| Communications inbox | Cross-job inbox of message threads (newest first) with @mentions that notify teammates, admin-defined message tags, pinning, emoji reactions, per-thread mute, edit/delete with visible markers, share-by-link, and keyword/attachment/date/tag search | All internal | Open Communications page → triage threads → reply/@mention/tag | S-CRM-014 |
| Task creation from messages | Any message converts to a task with assignee, priority, and due date, retaining a link to the originating thread | All internal | Message menu → Create Task → assign | S-CRM-014 |
| Email from job file | Emails composed in-app (template builder + personalization tags) send from AccuLynx and auto-log to the job file for later reference | Sales rep, office | Compose from job → send → stored on job | S-CRM-001, S-CRM-014 |
| Two-way SMS | Texting from a company-unique local number to anyone in the address book (customers, team, vendors); replies notify the user; every message auto-attaches to the job file; contact texting preferences respected | Sales rep, office | Pick contact → text from job → conversation logged | S-CRM-013 |
| Contact interaction logs | API-supported log entries per contact typed PhoneCall / SMS / Email with timestamp + description (≤1000 chars) — a mechanism for recording offline touches; contact notes also supported | Sales rep; integrators | Log call after it happens → appears in contact history | S-CRM-025, S-CRM-019 |
| Appointments & calendars | Initial appointment is a first-class lead attribute (get/update/delete via API); company calendars queryable; appointments sync to Google, Outlook, and Apple calendars; Spring 2026 added configurable appointment outcomes plus an Appointments Report | Sales rep, office | Book initial appointment from lead form → synced to personal calendar → record outcome after visit | S-CRM-019, S-CRM-029, S-CRM-015 |
| Automation Manager | No-extra-cost trigger engine: triggers on job events (created, appointment scheduled), milestone transitions (e.g. Prospect→Approved), order events, and financing events; actions send templated emails, SMS, or create assigned tasks with due dates; per-automation on/off toggle; dynamic tags personalize content | Admin (build); customers/reps (receive) | Automation Manager → Add Automation → pick trigger + action + template → toggle on | S-CRM-007, S-CRM-031 |
| Follow-up surfacing | "Last touched" timestamp on leads plus filters for assigned rep/priority make stale leads visible; new-lead notifications prompt immediate outreach | Sales mgr | Filter by last-touched → chase stale leads | S-CRM-011, S-CRM-009 |
| Lead/sales reporting | Prebuilt reports incl. Marketing Spend (lead volume, cost per lead, ROI by source), Closing Percentage by rep, profitability by rep/trade; 20+ report library covers lead-gen KPIs | Owner, sales mgr | Run report → compare sources/reps → reallocate budget or coach | S-CRM-016 |
| Outbound webhooks / Zapier | Subscription-based webhooks (v2) with topics incl. contact added/changed, job created/updated, milestone + status changed, category/trade/work-type changed, custom-field changes, initial-appointment created/updated, primary-contact changed, company-rep assigned; surfaced as ~14 Zapier triggers plus create-lead/contact actions | Integrators | Subscribe to topics → receive events → drive external follow-up tools | S-CRM-019, S-CRM-008, S-CRM-030 |

Customer sentiment (verbatim from reviews, per protocol §3): "I appreciate how easy it
is to track leads, manage contacts, and stay organized" (COO, Dec 2025); "The ability to
track the progress of the Leads are great as well!" (office manager, Apr 2026); "I wish
you could assign multiple users to one lead since teams usually work together" (office
manager, May 2026) [S-CRM-027]. Third-party reviewers also flag the reworked calendar as
hard to scan and lacking in-calendar search [S-CRM-027, S-CRM-028].

## Key workflows

1. **Lead intake → assignment → first touch.** A lead enters via the lead form (web or
   Field App), a lead-service integration (HomeAdvisor/Angi/SalesRabbit/Spotio/Roofle), or
   `POST /jobs`; it lands at milestone Lead, unassigned [S-CRM-026, S-CRM-017]. The form
   surfaces possible duplicate matches before save [S-CRM-015]. A manager works the
   unassigned filter and assigns via Quick/Smart/Map Assign; the rep is auto-notified
   [S-CRM-003, S-CRM-010]. Optionally an Automation Manager trigger fires a "new lead"
   email/text immediately [S-CRM-007, S-CRM-011]. The rep books the initial appointment
   (side-by-side calendar; syncs to Google/Outlook/Apple) [S-CRM-015, S-CRM-029].
2. **Pipeline progression.** The record advances Lead → Prospect → Approved → Completed →
   Invoiced → Closed; under each milestone, admin-defined statuses and checklists gate the
   work, with per-item completion attribution and permission-controlled milestone moves
   [S-CRM-021, S-CRM-012]. Transitions fire milestone/status webhooks and can trigger
   automations (e.g. Prospect→Approved sends a welcome email and spawns production tasks)
   [S-CRM-030, S-CRM-031]. Losses are marked Dead with a reason and leave the active queue
   [S-CRM-003, S-CRM-023].
3. **Activity capture and follow-up.** All outreach happens from the job file: templated
   email, two-way SMS from a local number, notes, and tasks — each auto-logged to the job
   [S-CRM-013, S-CRM-014]. The communications inbox aggregates threads across jobs with
   @mentions, tags, and message→task conversion [S-CRM-014]. Managers monitor last-touched
   and Lead Rank to re-prioritize; automations handle appointment reminders, overdue
   nudges, and post-completion review requests [S-CRM-002, S-CRM-011, S-CRM-031].
4. **Source/ROI feedback loop.** Every lead is tagged with a hierarchical lead source;
   Marketing Spend and Closing Percentage reports show cost per lead, ROI by source, and
   conversion by rep, feeding budget and assignment decisions [S-CRM-022, S-CRM-016].

## Data touched

Reads/writes (cross-reference `../04-inferred-data-model.md`): **Contact** (+ContactType,
PhoneNumber, EmailAddress, MailingAddress/BillingAddress, ContactNote, ContactLog,
contact custom-field values) [S-CRM-020, S-CRM-024, S-CRM-025]; **Job** — the same record
from lead onward (+milestone, workflow status, checklist items, priority, leadSource,
jobCategory, tradeTypes, workType, locationAddress, notes, job custom fields, insurance/
adjuster, external references) [S-CRM-026, S-CRM-019]; **JobContact** with primary flag
[S-CRM-019]; **LeadSource** (parent/child, active) [S-CRM-022]; **User/Representative**
roles: sales owner, company representative, A/R owner [S-CRM-019]; **Appointment**
(initial appointment, calendars, outcomes) [S-CRM-019, S-CRM-015]; **Task**, **Message
thread**, **TextMessage**, **Email log** [S-CRM-014, S-CRM-013]; **LeadHistory /
JobHistory** audit events incl. dead reason [S-CRM-023]; **Automation rules** (triggers/
actions) [S-CRM-007]; **Webhook subscriptions/topics** [S-CRM-019]; **Reports** over
leads/sources/reps [S-CRM-016]; **Lead Rank score** (read-only, third-party-data derived)
[S-CRM-002].

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than
guess AccuLynx's behavior:

- **Help-center detail is inaccessible**: `support.acculynx.com` and the `www-acculynx.com`
  sales/CRM pages return 403 to non-browser fetchers, so exact in-app lead-form field
  order, required-field validation, and duplicate-match criteria (name vs phone vs email
  vs address) are unverified; no merge-duplicates capability is publicly evidenced.
- **Lead Intelligence internals**: scoring scale/granularity, model inputs, data vendor,
  refresh cadence — only "third-party demographic/financial/property data" is public.
- **Inbound email capture**: search snippets suggest email must be *sent from* AccuLynx to
  be logged (no Gmail/Outlook inbound sync — INFERENCE from absence of any BCC-to-job or
  mailbox-sync feature in public materials); unconfirmed.
- **Automatic assignment**: no public evidence of round-robin or rules-based auto-routing;
  Smart Assign appears to be manual decision support only (INFERENCE). Whether multiple
  reps can share a lead is answered negatively only by a customer review [S-CRM-027].
- **Follow-up SLAs**: no evidence of response-time timers, cadence sequences, or
  escalation beyond last-touched filters and automations.
- **Configurability limits**: whether contact types and dead-reason lists are freely
  admin-editable; how "Cancelled" vs "Deleted" milestones surface in the UI (API-only
  enum values); number/type limits on custom workflow statuses.
- **Relationship between `/leads/{id}` and `/jobs/{id}` identifiers** (same ID space or
  linked records) — the API exposes both prefixes.
- **G2 page content** was only sampled via search snippets (bot-blocked on direct fetch)
  [S-CRM-035]; quote verification limited to Capterra.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

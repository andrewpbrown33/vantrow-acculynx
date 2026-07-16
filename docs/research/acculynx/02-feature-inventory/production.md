# Module: Production

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/production.md` (IDs `S-PRODUCTION-###`).

## Purpose

This module takes an approved (sold) job and gets it built: it holds the job record and its
lifecycle pipeline, schedules crews and material deliveries on a shared production calendar,
issues work orders (labor tickets) with instructions and checklists to subcontractors via a
crew-facing mobile app, tracks permits/supplements/mortgage checks that gate insurance work,
and records expenses against the job's financial worksheet so profitability is visible while
the job is still in progress [S-PRODUCTION-001][S-PRODUCTION-002][S-PRODUCTION-003][S-PRODUCTION-027].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Digital job file | One record per job holding estimates, contracts, documents, photos, measurements, orders, messages, and (for insurance jobs) claim numbers/adjuster info; every action and communication on the job is visible there. | All roles | Open job → see all artifacts/history in one place | S-PRODUCTION-001, S-PRODUCTION-002, S-PRODUCTION-027 |
| Job classification & metadata | Job carries number + name, category, work type, multiple trade types, lead source, priority (Normal / High / Urgent), address + geocoordinates; company-defined custom fields on jobs added Spring 2026. | Office, admin | Create job → classify → edit via job file or API | S-PRODUCTION-010, S-PRODUCTION-023 |
| Milestone pipeline | Eight system milestones (Lead, Prospect, Approved, Completed, Invoiced, Closed, Dead, Deleted); job stores current milestone + date entered; dead jobs carry a reason. Milestone history queryable. | All roles | Job advances milestone → date stamped → history kept | S-PRODUCTION-011, S-PRODUCTION-010, S-PRODUCTION-014 |
| Custom workflow statuses (Workflow Manager) | Company-defined step-by-step statuses nested under milestones; can differ by trade, category, and work type; advancing a job to the next milestone is permission-gated. Requires custom workflows enabled (Elite tier). | Admin (config), PM/office (use) | Configure statuses per milestone → users move jobs status-by-status | S-PRODUCTION-019, S-PRODUCTION-011, S-PRODUCTION-021 |
| Job checklists & Progress view | Custom checklist items attached to the workflow define per-job to-dos; a Progress view shows completion of each milestone, status, and checklist item with timestamp and who completed it; a Next Steps panel on the job overview surfaces current state. | PM, office, manager | Add checklist items → team completes → progress visible per job | S-PRODUCTION-019 |
| Tasks | Tasks created from the job file, from a message, from mobile, or by automation; carry assignee, priority, due date; assignee is notified. | All roles | Create task → assign → notify → complete | S-PRODUCTION-020, S-PRODUCTION-029, S-PRODUCTION-018 |
| Job messages & activity feed | Threaded per-job message board with @mentions, admin-defined tags, pinning, muting, edit/delete (with record kept), and search/filter; company-wide live activity feed; crew-app messages log into the job file. | All roles | Post/reply → @mention teammates → thread archived on job | S-PRODUCTION-020, S-PRODUCTION-002, S-PRODUCTION-005 |
| Production Calendar / Scheduler (Elite) | One calendar showing all labor assignments, material deliveries, and appointments; crews color-coded by trade or name; filters by trade, work type, crew; zoom from two-week down to hourly views; drag-and-drop reschedule individually or in bulk; team-availability view; multiple calendars viewable side-by-side (Spring 2026); real-time two-way sync with Outlook/iCalendar and multi-attendee events (Fall 2025). | Production manager, office | Open scheduler → filter → drag events to (re)schedule → changes propagate + notify | S-PRODUCTION-003, S-PRODUCTION-004, S-PRODUCTION-022, S-PRODUCTION-023, S-PRODUCTION-002, S-PRODUCTION-021 |
| "To Be Scheduled" drawer | Queue of outstanding (unscheduled) labor and material orders next to the calendar; filter/prioritize and drill into an order without leaving the scheduler. | Production manager | Review queue → pick order → place on calendar | S-PRODUCTION-004 |
| Order Manager | List of all labor/material orders, scheduled and unscheduled, with statuses; search, filters, bulk updates, crew reassignment; alerts on scheduling conflicts to prevent double-booking a crew. | Production manager | Search/filter orders → bulk update or reassign crew → conflict alerts | S-PRODUCTION-003, S-PRODUCTION-004, S-PRODUCTION-002 |
| Labor Manager | Registry of labor resources: a subcontractor modeled either as a single crew or as a sub managing multiple crews; sortable alphabetically, by active/inactive status, or by trade; each crew has a trade and a color code used on the calendar; stores compliance documents (proof of insurance, contract agreements, licenses) and supports documentation requests; controls labor availability and which crews get Crew App access. | Admin, production manager | Add sub/crews → set trade + color → attach docs → manage availability/access | S-PRODUCTION-003, S-PRODUCTION-007, S-PRODUCTION-004 |
| Labor orders → labor tickets (work orders) | Approving a labor order auto-creates a labor ticket for the subcontractor/crew lead; the ticket carries customizable job details — address, dates, instructions, contact info, documents, photos, and a checklist — and is cross-linked to the related material order. | Production manager (issue), crew lead (receive) | Create labor order → approve → ticket auto-issued → crew notified | S-PRODUCTION-003, S-PRODUCTION-004, S-PRODUCTION-025 |
| Labor checklists | Checklists attached to labor tickets, from reusable standard templates or built per job, defining required actions before the job counts as complete; office monitors completion in real time as the crew checks items off in the field. | Production manager (author), crew (complete) | Attach checklist → crew completes on site → office watches progress live | S-PRODUCTION-003, S-PRODUCTION-004 |
| Crew App (paid add-on) | Mobile app for subs/crews: onboarding via automated text invitation; push notification on assignment; accept or reject a job; sub can reassign work among its own crews and set availability; view the labor ticket (dates, address, contacts, instructions, docs, photos); one-tap GPS directions; GPS-stamped check-in/check-out; upload progress photos; two-way messaging saved to the job file; complete checklists; English/Spanish with automatic translation. Admin settings control what job info crews see and for how long. | Subcontractor, crew lead, crew | Text invite → accept job → drive → check in → photos + checklist → check out | S-PRODUCTION-005, S-PRODUCTION-003, S-PRODUCTION-007, S-PRODUCTION-021 |
| Field App (staff mobile, free) | Staff-facing app (sales/production/management): syncs job files (photos, estimates, contracts, orders); review tasks, appointments, schedules, notes; capture/annotate/organize unlimited photos; log calls; create tasks and notify others. The full production calendar is web-only. | PM, sales, manager | Open job on phone → review/update → syncs to web | S-PRODUCTION-029, S-PRODUCTION-030 |
| Material delivery coordination | Supplier orders (ABC Supply, SRS Distribution, QXO) carry delivery dates that sync automatically onto the calendar; MaterialDelivery is a first-class calendar event type; deliveries/pickups trackable by trade and status. | Production manager, office | Order materials → delivery date lands on calendar → reschedule by drag | S-PRODUCTION-006, S-PRODUCTION-012, S-PRODUCTION-008 |
| Automation Manager | Rule engine (included free): triggers on job events (creation, appointments), milestone changes, order events (created/status/fulfilled), and financing events; actions are prewritten email, text (sent from the job's unique local number), or task assignment with due date; personalization tags fill names/dates; rules toggle on/off. Production patterns: on Approved, auto-create tasks to pull a permit, build an order, or file a supplement; task a production manager when an order is fulfilled; auto-notify homeowner/crew of schedule changes. | Admin (config), all (benefit) | Pick trigger → pick action + recipient → enable | S-PRODUCTION-018, S-PRODUCTION-031, S-PRODUCTION-006 |
| Dashboard quick-view trackers | Company dashboards list: job progress (approved/completed/invoiced with balance due and assigned rep); work schedule (labor orders and deliveries/pickups filtered by trade and scheduled/in-progress/completed status); submitted orders awaiting approval; plus financing, payments, commissions, permits, supplements, mortgage checks, and measurement-order status. | Owner, manager, office | Open dashboard tab → filter → drill into job | S-PRODUCTION-008 |
| Permit tracking (Elite) | Per-permit status pipeline — drafted, applied for, pulled, posted, scheduled for inspection, completed — on a centralized tracking page and inside the job file. | Office, PM | Log permit → advance status → dashboard snapshot | S-PRODUCTION-008, S-PRODUCTION-027, S-PRODUCTION-021 |
| Supplement tracking (Elite) | Insurance supplements tracked through statuses (requested, under review, pending re-inspection, need more information from rep, approved, completed) with notes in the job record; overview page filters by job, company, date. | Office, supplementer | Create supplement → update status/notes → filter overview | S-PRODUCTION-027, S-PRODUCTION-008, S-PRODUCTION-021 |
| Mortgage check tracking (Elite) | Tracks insurance checks awaiting mortgage-holder co-signature before funds release, with amounts and tracking numbers, visible to reps without asking the office. | Office, PM, sales | Log check → track co-signature status → funds released | S-PRODUCTION-008, S-PRODUCTION-027, S-PRODUCTION-021 |
| Job costing during production | The per-job financial worksheet is the costing container (estimates, invoices, payments, expenses in one place). Outbound money is recorded per job (API: amount, payee, method, date, account type, reference number, paid flag; plus an "additional expense" record type). Job Expenses report shows paid vs unpaid expenses per job, crew payments, spend by trade type, supplier comparison, and forecast-vs-actual; Fall 2025 added revenue/expense attribution to individual trades with profitability-by-trade and per-project reports. Job-cost and profit-forecast tracking start at Essential; deeper costing/reporting is Pro/Elite. An independent review notes actual costs are manually entered and costing reports are not real-time. | Office, bookkeeper, owner | Worksheet seeded from estimate → record expenses as incurred → run expense/profitability reports | S-PRODUCTION-032, S-PRODUCTION-017, S-PRODUCTION-014, S-PRODUCTION-009, S-PRODUCTION-022, S-PRODUCTION-021, S-PRODUCTION-024, S-PRODUCTION-025, S-PRODUCTION-033 |
| Photo & video documentation | Unlimited photo/video uploads per job; annotation (mark damage areas, write pitch/slope on image); albums for phases (before/progress/adjuster); searchable tags; share photos or albums by email/text via links that can be expired later. | Crew, PM, sales | Capture in field → annotate/tag → auto-sync to job → share | S-PRODUCTION-030, S-PRODUCTION-029, S-PRODUCTION-005 |
| Public API & webhooks | REST v2: job create/search/update (priority, category, work type, trade types, address), milestone + status reads, calendars and appointments reads (event types Personal / InitialAppointment / MaterialDelivery / CrewLabor; 90-day query window; `sharedWithCustomerPortal` flag), representative assignment (company rep, sales owner, A/R owner), payments/expenses writes, photo upload, job messages. 23 webhook topics incl. `job.milestone.current_changed`, `job.milestone.status.current_changed`, `job.appointments.initial_created/updated`, `job.financials.approvedValue_changed`, `job.representatives.company_*`, `job.trade-type_changed`, `job.work-type_changed`. | Integrators | Subscribe topic → receive event → fetch via API | S-PRODUCTION-014, S-PRODUCTION-010, S-PRODUCTION-012, S-PRODUCTION-016, S-PRODUCTION-015, S-PRODUCTION-017 |
| Plan gating | Essential ($250/mo): basic scheduling & job tracking, labor management + work orders, mobile field app, job costs/A-R, profit forecasting. Pro (quote): workflow management, automations, reporting. Elite (quote): production calendar, production status & trade reports, custom workflow manager, permits/supplements/mortgage-check/commissions tracking, multi-location. Crew App, texting, customer portal, ReportsPlus are add-ons on any plan. | Buyer/admin | Pick tier → add-ons as needed | S-PRODUCTION-021, S-PRODUCTION-003, S-PRODUCTION-026 |

## Key workflows

1. **Approved job → crew on the roof.** When a job reaches the Approved milestone, automations
   can create tasks to pull the permit, build the material order, and coordinate labor
   [S-PRODUCTION-018][S-PRODUCTION-031]. The production team creates a labor order; on approval a
   labor ticket is auto-generated for the subcontractor/crew lead with address, dates,
   instructions, documents, photos, and a checklist, cross-linked to the material order
   [S-PRODUCTION-003][S-PRODUCTION-004]. The crew lead gets a push notification in the Crew App,
   accepts (or rejects, or the sub reassigns to another of its crews), navigates via GPS, checks
   in on arrival, works the checklist, uploads progress photos, messages the office (all logged
   to the job file), and checks out — with the office watching checklist progress live
   [S-PRODUCTION-005][S-PRODUCTION-003][S-PRODUCTION-007].
2. **A production day in the Scheduler.** The production manager opens the Elite Scheduler,
   works the "To Be Scheduled" drawer of unscheduled labor and material orders, and drags them
   onto dates; crews are color-coded by trade/name and conflict alerts flag double-booked crews
   [S-PRODUCTION-004][S-PRODUCTION-003]. When weather hits, whole days of labor and deliveries are
   drag-and-drop rescheduled in bulk; changes propagate through the system with instant
   notifications to subs/crew leads via the Crew App and automated homeowner texts/emails via
   the Automation Manager [S-PRODUCTION-004][S-PRODUCTION-006]. Customer sentiment cuts both ways:
   a production manager writes "Everything is centralized—sales, production, photos, and
   communication—making it easy to […]" — Xochitl C., Production Manager, Capterra review, Apr
   2026 (excerpt; page truncates) [S-PRODUCTION-028], while a 2026 independent review relays
   multiple Software Advice reviewers calling the redesigned calendar "confusing and much harder
   to read at a glance" and faulting the lack of in-calendar search [S-PRODUCTION-024].
3. **Progress & compliance tracking.** Office staff track each job's Progress view (milestone,
   status, checklist completion with who/when) and the Next Steps panel [S-PRODUCTION-019];
   company dashboards give filterable quick-views of job progress, the work schedule (labor
   orders + deliveries by trade/status), and orders awaiting approval [S-PRODUCTION-008]. For
   insurance work, permits move through a six-stage status pipeline, supplements through a
   six-status review flow, and mortgage checks are tracked to co-signature — all visible from
   trackers and the job file (Elite) [S-PRODUCTION-008][S-PRODUCTION-027][S-PRODUCTION-021].
4. **Costing while the job runs.** The financial worksheet holds the job's money picture;
   as production spends, staff record outbound payments/expenses against the job (payee,
   amount, method, account type) [S-PRODUCTION-017][S-PRODUCTION-032]. The Job Expenses report
   compares forecast vs actual, shows crew payments per job and spend by trade/supplier
   [S-PRODUCTION-009]; since Fall 2025 revenue and expenses attribute to individual trades with
   profitability-by-trade reporting [S-PRODUCTION-022]. INFERENCE: because a reviewer reports
   actuals are manually keyed [S-PRODUCTION-024], real-time costing likely depends on office
   discipline rather than automatic feeds.

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **Job** — jobNumber, jobName, currentMilestone (enum), milestoneDate, priority (Normal/High/
  Urgent), jobCategory, workType, tradeTypes[], leadSource, leadDeadReason, contacts[],
  locationAddress, geoLocation, custom fields [S-PRODUCTION-010][S-PRODUCTION-023]
- **Milestone / WorkflowStatus / ChecklistItem** — 8 system milestones; statuses only with
  custom workflows enabled; checklist completion with timestamp + user [S-PRODUCTION-011][S-PRODUCTION-019]
- **Calendar / Appointment** — calendar id+name per location; event: title, eventType (Personal |
  InitialAppointment | MaterialDelivery | CrewLabor), start/end, allDay, location, attendees[],
  job link, sharedWithCustomerPortal [S-PRODUCTION-013][S-PRODUCTION-012]
- **Labor resource (sub / crew)** — trade, color code, active status, availability, compliance
  docs, app access [S-PRODUCTION-003][S-PRODUCTION-007]; **Labor order / Labor ticket** — job details,
  instructions, docs, photos, checklist, linked material order [S-PRODUCTION-003][S-PRODUCTION-004]
- **Material order** — supplier, delivery date, material list, status [S-PRODUCTION-004][S-PRODUCTION-006]
- **Task** (assignee, priority, due date) [S-PRODUCTION-020]; **Message / thread / tag**
  [S-PRODUCTION-020]; **Photo/Video + tags/albums** [S-PRODUCTION-030]
- **Permit, Supplement, Mortgage check** — each with its own status pipeline [S-PRODUCTION-008][S-PRODUCTION-027]
- **Payment (paid / received / additional expense)** — amount, to/payee, method, date, notes,
  accountTypeId, refNumber, isPaid [S-PRODUCTION-017][S-PRODUCTION-014]; **Financial worksheet**
  [S-PRODUCTION-032]; **Representatives** — company rep, sales owner, A/R owner [S-PRODUCTION-014]
- **Webhook subscription / topics** (23 job/contact topics) [S-PRODUCTION-016]

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **"Production board" construct.** One independent review describes a board of active jobs
  with production fields (material delivery date, inspection status, crew assignment, weather
  hold, permit status) filterable by status/crew/date [S-PRODUCTION-026]; AccuLynx's own public
  materials evidence dashboards + calendar + Order Manager instead. Whether a distinct
  kanban-style production board exists, and its exact columns/fields, is unverified.
- **Labor order lifecycle.** Order statuses, who can approve, rejection/expiry flows, and
  whether labor tickets carry pay rates or amounts are not publicly documented.
- **No public API for production execution.** The public API exposes no endpoints for labor
  orders, labor tickets, crews, checklists, tasks, or material orders [S-PRODUCTION-014] — so
  none of those objects' schemas can be confirmed, and an integration surface for them is
  absent (opportunity for us).
- **Time → cost linkage.** GPS check-in/out timestamps exist [S-PRODUCTION-005], but nothing
  public shows them feeding labor-hour or labor-cost calculations.
- **Crew payables.** How subcontractor invoices, back-charges, or per-ticket crew pay are
  captured beyond generic per-job "paid" payment records [S-PRODUCTION-017].
- **Checklist template depth.** Whether items can require photo proof, enforce ordering, or
  block job completion; per-trade template libraries — beyond "standard templates or
  job-specific" [S-PRODUCTION-003].
- **Capacity planning.** Crew availability is managed [S-PRODUCTION-003], but utilization
  metrics, capacity limits, and the double-booking alert logic are undocumented.
- **Job-costing mechanics.** The claim that actuals are manually entered and reports lag
  real-time comes from one independent review [S-PRODUCTION-024]; PO/commitment accrual and
  supplier-invoice reconciliation behavior are unknown.
- **Plan-boundary detail.** What exactly separates Essential "basic scheduling" from the Elite
  production calendar is not itemized publicly [S-PRODUCTION-021].
- **Access limitations this pass:** the in-app Knowledge Base sits behind product login (not
  accessed, per protocol); YouTube demo pages again returned a Google bot-check interstitial,
  so no URL+timestamp UI references are logged; Capterra renders review text truncated, so the
  customer quote above is a cited partial excerpt.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

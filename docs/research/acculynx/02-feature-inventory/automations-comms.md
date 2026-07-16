# Module: Automations & Communications (rules engine, email, SMS, notifications, call tracking)

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in `../sources/automations-comms.md`.

## Purpose

This module is AccuLynx's answer to "nobody follows up and nobody knows what was said."
It combines (a) a no-code trigger→action rules engine (the Automation Manager) that fires
templated emails, SMS, and assigned tasks off lifecycle events; (b) manual outbound
communications from the job file — templated email and two-way texting from a
company-local phone number — with every message auto-logged to the job record; (c) an
internal messaging layer (threaded job messages, @mentions, a personal @Me notification
feed, push/email alerts); and (d) call-tracking via a CallRail integration that turns
inbound calls into leads and logs call activity, since the platform has no evidenced
native dialer [S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-002, S-AUTOMATIONS-COMMS-009,
S-AUTOMATIONS-COMMS-011]. The design center is the job file as the single system of
record for every touch — sent, received, or automated.

## Feature table

### Automation rules engine

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Automation Manager | Central page (reached from a dashboard dropdown; `my.acculynx.com/automation`) listing all rules, each with an on/off toggle; "Add Automation" starts a guided setup (name → trigger → action). Vendor blogs (2020–22 era) describe it as included at no extra cost; a 2026 third-party guide places "workflow automation" in Pro/Elite plans only, not Essential — conflict noted in Unknowns | Admin/office mgr (build); whole company (receive) | Open Automation Manager → Add Automation → name it → pick trigger + timing → pick action + content + recipient → toggle on | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004, S-AUTOMATIONS-COMMS-019 |
| Job-event triggers | Fire on job actions such as job creation or an appointment being set (e.g., confirm the initial appointment by email) | Admin (configure) | Select "job" trigger type → pick event | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004 |
| Milestone triggers | Fire when a job changes lifecycle milestone (e.g., Prospect→Approved kicks off a welcome email or a pull-permit task) | Admin (configure) | Select milestone transition as trigger | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004 |
| Order triggers | Fire on material-order events: order created, status changed, completed — e.g., text the PM when a delivery date changes | Admin; PMs (receive) | Select order event as trigger | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004 |
| Financing triggers | Fire on financing (AccuFi) status changes: offers made, no offers, funded | Admin; sales (receive) | Select financing status as trigger | S-AUTOMATIONS-COMMS-001 |
| Relative timing | Rules run at an offset from the trigger, not only instantly: e.g., appointment reminder day-of or a week prior; payment reminder N days after an invoice due date passes unpaid | Admin (configure) | Set timing when defining trigger | S-AUTOMATIONS-COMMS-003, S-AUTOMATIONS-COMMS-004 |
| Action: automated email | Sends a prewritten email from the platform to a chosen contact (customer, adjuster, inspector, crew, teammate), personalized with dynamic tags | Admin (build); contacts (receive) | Pick email action → choose/compose template → pick recipient | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004 |
| Action: automated SMS | Sends a text from the company's local number; delivered messages are recorded on the job file, annotated with the trigger condition that produced them | Admin (build) | Pick text action → compose with tags → pick recipient | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-005 |
| Action: create task | Creates a task assigned to a user, with due date and priority (normal/high); assignee is notified | Admin (build); assignee | Pick task action → assignee, due date, priority, notes | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-004 |
| Dynamic tags | Merge fields across all action types pull job-file data (names, employee, company, dates, times, trade, job number) into content at send time | Admin (author) | Insert tag placeholders in template body | S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-003, S-AUTOMATIONS-COMMS-016 |
| Starter content | Vendor publishes canonical recipes: appointment-confirmation text, post-approval welcome email, approval task, overdue-payment reminder email with payment link (AccuPay), post-completion thank-you/review-request email; prebuilt sample automations and setup tutorials exist in-product | Admin | Copy a recipe → adapt template | S-AUTOMATIONS-COMMS-003, S-AUTOMATIONS-COMMS-004 |

### Email

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Email Template Builder | Drag-and-drop email composer: text blocks of pre-written content, font/color/styling controls, spacing, divider lines, social-media icons, attachments; templates saved for reuse | Office, sales | Build template once → reuse per job | S-AUTOMATIONS-COMMS-006 |
| Template library | Dashboard "Email Templates" page lists all templates grouped by folder (ungrouped ones land in a Default folder); editing/copying/activating/deleting templates requires manager or administrator role; vendor announced pre-built starter templates | Manager/admin (manage); all (use) | Dashboard dropdown → Email Templates → organize into folders | S-AUTOMATIONS-COMMS-007 |
| Send from job file | Compose via Job Actions → Send email (or by clicking the contact's address); dynamic tags fill job-file data; sent emails are stored on the job file for later reference. Sending happens inside AccuLynx — no public evidence of inbound email capture (BCC/forward-to-job) | Sales, office | Open job → Job Actions → Send email → pick template → tags auto-fill → send → logged | S-AUTOMATIONS-COMMS-006, S-AUTOMATIONS-COMMS-007 |

### Text messaging

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Two-way texting | Live SMS conversations with customers, teammates, adjusters, vendors from inside the platform (not personal cell phones); recipients picked from the address book; inbound replies raise a notification | Sales, office, PM | Job/lead → Messages tab → Text Message → pick contact → send/reply | S-AUTOMATIONS-COMMS-002, S-AUTOMATIONS-COMMS-005 |
| Company-local number | Outbound texts originate from a distinctive local number so homeowners recognize the sender (allocation model — per company vs per location/user — not public) | All texting users | None (platform-assigned) | S-AUTOMATIONS-COMMS-002, S-AUTOMATIONS-COMMS-005 |
| Conversation logging | Every sent/received text auto-attaches to its job or lead file, giving a permanent thread history; automated texts are marked with their trigger | All | Open job file → review full SMS history | S-AUTOMATIONS-COMMS-002, S-AUTOMATIONS-COMMS-005 |
| Messaging preferences | Contact records expose per-contact messaging preferences (texting-capable/consent flag visible when choosing recipients) | All | Check preference before sending | S-AUTOMATIONS-COMMS-002 |
| Add-on pricing | 2026 third-party guides report texting is billed separately from the base subscription | Owner (buys) | Purchase add-on → numbers enabled | S-AUTOMATIONS-COMMS-018, S-AUTOMATIONS-COMMS-019 |
| Vendor-claimed impact | Vendor study: customers using integrated texting had 27% shorter project duration and 26% shorter sales cycle (vendor-published, unaudited) | — | — | S-AUTOMATIONS-COMMS-002 |

### Internal messaging & notifications

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Job message threads | Inbox-style threaded conversations tied to jobs: @mentions notify specific users; admin-created tags categorize threads (e.g., payments); emoji reactions; edit/delete with visible change markers (records retained for admin reference even after deletion); pin important messages; per-thread mute (muted state visible to others); share a message by copied link | All internal | Open thread → reply/@mention → tag/pin as needed | S-AUTOMATIONS-COMMS-009 |
| Task from message | Convert any message into a task with assignee, priority, and due date | All internal | Message menu → create task → assign | S-AUTOMATIONS-COMMS-009 |
| Message search | Filter threads by keyword, attachment presence, date range, or tag; matches highlighted | All internal | Search bar → apply filters | S-AUTOMATIONS-COMMS-009 |
| @Me feed | Personal notification feed (web + mobile) aggregating items sent to your attention: lead assignments/reassignments, lead distributions to managers, milestone changes on your jobs, SmartDoc packet completions/rejections, measurement-order status, task assignments; live unread counter; dismiss singly or all | All internal | Click @Me icon (top of dashboard) → review → dismiss | S-AUTOMATIONS-COMMS-008 |
| Workflow-status alerts | Workflow Manager emits real-time notifications when a job's status changes or a user's attention is required; Next Steps panel on the job file shows current status | Ops, PM | Status change → notification → open job | S-AUTOMATIONS-COMMS-023 |
| Appointment alerts | Email and push alerts sent for all appointment updates; appointments support multiple attendees with automated notifications to each (Fall 2025) | Schedulers, reps | Edit appointment → attendees auto-notified | S-AUTOMATIONS-COMMS-010 |
| Mobile push | Field App markets push alerts (e.g., new lead assigned); as of the vendor's Field App tips post, @Me items did NOT push — they surface only on app open, with push "actively" in development; an App Store review complains of notification delays | Field users | Enable notifications → receive pushes | S-AUTOMATIONS-COMMS-021, S-AUTOMATIONS-COMMS-022 |
| Customer Portal notifications | Automated notifications tell homeowners when new content or messages are posted to their portal; configurable for who gets notified and when; portal itself carries a homeowner↔contractor message channel | Office (config); homeowner (receive) | Post to portal → customer auto-notified → replies land back in AccuLynx | S-AUTOMATIONS-COMMS-015, S-AUTOMATIONS-COMMS-017 |

### Call tracking & phone

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| CallRail integration | Via paid AppConnections add-on: inbound calls and CallRail form submissions auto-create unassigned leads carrying name, phone, city/state, plus CallRail lead source/form name/tracking number/campaign mapped into notes; sync filters restrict which calls/forms/campaigns/numbers create leads | Admin (setup); sales mgr | Enable in AccuLynx Market → paste CallRail API key → map locations to campaigns/numbers | S-AUTOMATIONS-COMMS-011 |
| Ongoing call logging | After lead creation, all future inbound/outbound calls for that contact log automatically to the Contact Activity timeline with direction, type, source, tracking number, duration, notes, tags, qualification status — and call recordings | Sales, office | None (automatic) | S-AUTOMATIONS-COMMS-011 |
| Campaign attribution | Multiple tracked numbers reveal which campaigns/services/locations generate leads | Owner, marketing | Review synced source data | S-AUTOMATIONS-COMMS-011 |
| Manual call logs | Public API supports typed contact-log entries (PhoneCall/SMS/Email) with timestamp and description — the mechanism for recording calls made outside the platform; Field App supports logging calls and meeting notes | Reps; integrators | Log call → appears in contact history | S-AUTOMATIONS-COMMS-013, S-AUTOMATIONS-COMMS-021 |
| No native dialer | No public evidence of built-in calling, VoIP, or SMS/email **send** endpoints in the public API; outbound comms are UI/automation features, telephony is delegated to partners. INFERENCE from absence in API index and marketing | — | — | S-AUTOMATIONS-COMMS-012, S-AUTOMATIONS-COMMS-013 |

### External automation surface

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Webhooks + Zapier | Subscription webhooks (documented endpoints, topics, listener guide) power ~13 Zapier triggers (contact added/changed, job created, milestone changed, appointment created/updated, rep/contact assignment changes, category/trade/work-type changes); 5 actions (create lead/contact/job, update custom fields, set initial appointment); 6 searches. Lets customers wire AccuLynx events to external email/SMS tools; requires AppConnections for Zapier | Integrators, admins | Create API key (with lead source) → subscribe/zap → events flow | S-AUTOMATIONS-COMMS-012, S-AUTOMATIONS-COMMS-013, S-AUTOMATIONS-COMMS-014 |

Customer sentiment (verbatim only from customers, per protocol §3): "The great thing
about texting in AccuLynx is that it records every message to that job file. You always
have a record of your conversations" (Josh Lyon, Stay Dry Roofing); "Our texts in
AccuLynx are being opened over 90% of the time" (Carla Kite, Rocky Mountain RetroFoam)
[S-AUTOMATIONS-COMMS-002]. Capterra reviewers praise automation at milestone changes but
report "you have to go through multiple steps to do simple automations" and find the
volume of automated emails/notifications excessive; third-party review roundups also
report customers occasionally not receiving emails (deliverability complaints)
[S-AUTOMATIONS-COMMS-020, S-AUTOMATIONS-COMMS-019].

## Key workflows

1. **Build an automation rule.** Admin opens Automation Manager from the dashboard
   dropdown → Add Automation → names the rule → selects a trigger category (job event /
   milestone transition / order event / financing status) and its timing (immediate or
   offset, e.g., 1 day before appointment) → selects an action (email, SMS, or task) →
   authors content with dynamic tags and picks the recipient (job contact or internal
   user) or task assignee/due date/priority → enables the toggle. Rule then fires
   automatically on every matching event; sent messages log to each job file
   [S-AUTOMATIONS-COMMS-001, S-AUTOMATIONS-COMMS-003, S-AUTOMATIONS-COMMS-004].
2. **Templated email from a job file.** Manager/admin pre-builds a template in the
   drag-and-drop builder and files it in a folder → rep opens a job → Job Actions → Send
   email → picks the template → dynamic tags resolve from the job (names, dates, company
   info) → rep tweaks text → sends → the email is stored on the job file
   [S-AUTOMATIONS-COMMS-006, S-AUTOMATIONS-COMMS-007].
3. **Two-way text conversation.** Rep opens the lead/job → Messages tab → Text Message →
   selects a contact from the address book (respecting messaging preferences) → sends
   from the company local number → homeowner replies → rep gets an in-app notification →
   whole thread persists on the job file; automated texts from rules interleave into the
   same history, labeled with their trigger [S-AUTOMATIONS-COMMS-002,
   S-AUTOMATIONS-COMMS-005].
4. **Inbound call → lead → logged call history (CallRail).** Homeowner calls a tracked
   number → CallRail captures it → integration creates an unassigned AccuLynx lead with
   contact + campaign data → sales manager assigns a rep (assignment notification fires)
   → every later call with that contact, including recordings, logs to the Contact
   Activity timeline automatically [S-AUTOMATIONS-COMMS-011].

## Data touched

Reads/writes (cross-reference `../04-inferred-data-model.md`): **jobs/leads** (milestone
+ workflow status transitions as triggers; message/email/SMS history attached),
**appointments** (trigger source; reminder/update notifications), **material orders** and
**financing applications** (trigger sources), **invoices/payments** (overdue trigger,
payment links in reminder emails), **contacts** (recipient resolution, typed
phones/emails, texting preference flags), **contact activity logs** (typed
PhoneCall/SMS/Email entries; CallRail-written call records + recordings), **email
templates** (folders, role-gated management), **automation rules** (trigger, timing,
action, template, state), **message threads** (tags, pins, reactions, mentions),
**tasks** (created by rules and from messages), **notification items** (@Me feed
entries), **users/roles** (recipients, assignees, manager/admin gates), **webhook
subscriptions/API keys** (external automation) [S-AUTOMATIONS-COMMS-001 …
S-AUTOMATIONS-COMMS-014].

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than
guess AccuLynx's behavior:

- **Full trigger/condition catalog.** Only the four trigger categories and examples are
  public. No evidence of conditional filters (by trade, work type, location, lead
  source), AND/OR logic, or audience segmentation inside a rule.
- **Sequences.** No public evidence of multi-step drip sequences, chained actions, or
  stop-on-reply behavior; rules appear to be single trigger → single action (INFERENCE).
- **SMS compliance machinery.** A2P 10DLC registration flow, opt-in capture, STOP/HELP
  handling, quiet hours, and per-message billing are not publicly documented.
- **Number provisioning.** Whether the "unique local number" is one per company, per
  location, or per user is unstated.
- **Email infrastructure.** From-address/reply-to model, custom sending domains
  (SPF/DKIM), bounce handling, and open/click tracking are undocumented — notable given
  reviewer complaints about customers not receiving emails.
- **Inbound email capture.** No public evidence of a BCC/forward-to-job address or
  mailbox sync; only outbound-from-platform emails are evidenced as logged.
- **Plan gating (conflict).** Vendor blogs (2020–22) call the Automation Manager a
  no-cost feature; 2026 third-party guides place workflow automation in Pro/Elite only
  and texting as a paid add-on. Current packaging is quote-based and unpublished.
- **Limits.** Max automations per account, send rate limits, and failure/retry behavior
  unknown.
- **Notification preferences.** Per-user granularity of email vs push vs in-app controls
  is not publicly documented.
- **Access limits on research.** G2 blocks non-browser fetches (HTTP 403); G2/Capterra
  evidence here comes from search excerpts only. The AccuLynx knowledge base article on
  recommended automations sits behind sign-in and was not accessed.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

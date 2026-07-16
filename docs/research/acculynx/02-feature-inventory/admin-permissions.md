# Module: Admin & Permissions (Users, Roles, Multi-Location, Security, Audit, Onboarding)

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in `../sources/admin-permissions.md`.

## Purpose

This module is AccuLynx's governance layer: an owner or administrator invites staff, assigns
each person one of six fixed role types, then tunes what that person can see and do via
permission settings layered on the role's base permissions [S-ADMIN-PERMISSIONS-001,
S-ADMIN-PERMISSIONS-004, S-ADMIN-PERMISSIONS-007]. It also covers billing-linked user
statuses [S-ADMIN-PERMISSIONS-003], running several branch offices as "locations" under one
account [S-ADMIN-PERMISSIONS-032, S-ADMIN-PERMISSIONS-008], login security (2FA, SSO)
[S-ADMIN-PERMISSIONS-005, S-ADMIN-PERMISSIONS-006], per-record audit trails
[S-ADMIN-PERMISSIONS-011, S-ADMIN-PERMISSIONS-012], API-key administration
[S-ADMIN-PERMISSIONS-010], and the vendor-led onboarding/training model that gets a new
company live [S-ADMIN-PERMISSIONS-019, S-ADMIN-PERMISSIONS-020]. Notably, user
administration is UI-only: the public API can read users but not create them or change
roles [S-ADMIN-PERMISSIONS-027].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Manage Your Team page | Central user-administration screen reached from the signed-in user's name menu (top-right); lists team members and their statuses/roles; editing statuses and roles requires the Location Administrator or Company Administrator role | Company/Location Administrator | Name menu → Manage Your Team → select user → edit | S-ADMIN-PERMISSIONS-003 |
| User invitation | Admin invites a user; the invitee's email address becomes their permanent username; they set a password and sign in at the web portal; the Field App uses the same credentials | Admin (invite); all (accept) | Add user → invite email → user sets password → signs in web or mobile | S-ADMIN-PERMISSIONS-003, S-ADMIN-PERMISSIONS-008 |
| User profile fields | Edit Team Member page requires full name, display name, and initials; users can self-update their own email from their profile menu | Admin; self-service | Open team member → edit fields → save | S-ADMIN-PERMISSIONS-003 |
| User statuses (billing-linked) | Four statuses in the API: Active, Inactive, Archived, Deleted. Active users can log in and are billable seats; Inactive and Archived users cannot log in and stop being billed after the billing cycle in which they were last Active. API user-list filter defaults to Active only | Admin | Change status on Manage Your Team → billing follows next cycle | S-ADMIN-PERMISSIONS-001, S-ADMIN-PERMISSIONS-003 |
| Six fixed role types | API role enum: Company Administrator, Location Administrator, Manager, Office, Sales, Crew — a two-tier admin split (whole company vs one location) above three staff archetypes and a field-labor role | Admin (assign) | Pick role at user setup; change later | S-ADMIN-PERMISSIONS-001, S-ADMIN-PERMISSIONS-002 |
| Base permissions per role | Each role type carries a documented set of base permissions (help-center article "User Roles – Base Permissions"); marketing frames roles as owner/manager/sales rep/office staff with "unique permissions by role type" | Admin | Assign role → base permissions apply automatically | S-ADMIN-PERMISSIONS-004, S-ADMIN-PERMISSIONS-007 |
| Per-user permission settings | Admins assign permissions at user setup and can change a user's role type or individual permissions at any time — a per-user overlay on the role's base permissions (dedicated "Permission Settings" help article exists) | Company/Location Administrator | Manage Your Team → user → adjust permissions | S-ADMIN-PERMISSIONS-007, S-ADMIN-PERMISSIONS-004 |
| Assigned-job scoping for Sales | Sales reps see progress only on jobs assigned to them; admins can restrict further via permission settings | Admin (configure); Sales (subject) | Assign rep to job → rep's visibility limited to own jobs | S-ADMIN-PERMISSIONS-014 |
| Financial-visibility controls | Granular toggles separate money concepts: e.g. hide job profitability from reps while still showing the job's balance due; third-party guidance confirms margins/job-level financials can be limited to managers while crews see only task-relevant data | Admin (configure) | Permission settings → per-role/user financial visibility | S-ADMIN-PERMISSIONS-014, S-ADMIN-PERMISSIONS-009 |
| Approval permissions (worksheets) | Financial worksheets distinguish users who can approve from those who can only "submit for approval" — an approval-workflow permission distinct from view/edit | Manager/admin (approve); others (submit) | Non-approver completes worksheet → submits → permitted user approves | S-ADMIN-PERMISSIONS-015 |
| Milestone-advance permission | Only users holding the right permission can advance a job to its next milestone — pipeline transitions are permission-gated | Admin (grant); ops (exercise) | Configure → non-permitted users blocked from advancing | S-ADMIN-PERMISSIONS-013 |
| Subcontractor invitations | Subs/crews are invited from the Labor Manager via automated SMS link (phone number captured at setup); pending invitations are tracked until accepted | Production mgr/admin | Labor Manager → invite sub → SMS link → sub joins Crew App | S-ADMIN-PERMISSIONS-016, S-ADMIN-PERMISSIONS-017 |
| Time-boxed sub permissions | Per-subcontractor permission settings control which job-file information the sub can see **and for how long** — access expires rather than persisting | Production mgr/admin | Set info scope + duration per sub → sub sees only that slice via Crew App | S-ADMIN-PERMISSIONS-016, S-ADMIN-PERMISSIONS-017 |
| Labor-contact sharing settings | Labor Contact Account Settings decide whether labor details are shared automatically with all users or only with specific ones | Admin | Account settings → labor contact sharing → auto vs selective | S-ADMIN-PERMISSIONS-016 |
| Multi-location under one account | Multiple business locations run under a single AccuLynx account with per-location performance tracking; Elite plan tier includes multi-location setup; positioned for multi-location operations "with hundreds of users" | Owner, Company Administrator | Provision locations → manage all from one account | S-ADMIN-PERMISSIONS-032, S-ADMIN-PERMISSIONS-029, S-ADMIN-PERMISSIONS-018 |
| Location picker at login | Users with access to more than one location get an extra sign-in step listing their locations; a default location is settable in the user profile | Multi-location users | Sign in → pick location (or default) → work in that location's context | S-ADMIN-PERMISSIONS-008 |
| Location-scoped settings | The company-settings API is scoped to "the current location" (name, time zone, insurance-mode flag); supported countries/states are configured per company; config lists such as lead sources live under per-location company settings | Admin | Configure each location's settings independently | S-ADMIN-PERMISSIONS-026, S-ADMIN-PERMISSIONS-027 |
| Cross-location roll-up | DataMart add-on gives consolidated company-wide data and cross-branch KPI tracking through BI tools (Tableau/Power BI/Klipfolio) — pitched at multi-location and PE-backed roofers; Sage Intacct sync offers per-location entities or a consolidated model where all locations roll up under a main company for payments/receivables/reporting | Owner, finance | Enable DataMart / choose Intacct model → consolidated reporting | S-ADMIN-PERMISSIONS-006 |
| Branch-aware lead routing | CallRail connection maps each CallRail sub-account/campaign to a single AccuLynx branch location so inbound leads route to the right office | Admin (map once) | AppConnections → map CallRail company→location → leads auto-route | S-ADMIN-PERMISSIONS-028 |
| Two-factor authentication | 2FA offered as an extra identity check; admins can enable it account-wide or per individual user (Fall 2025) | Admin (enforce); all (use) | Enable at account or user level → users verify second factor at login | S-ADMIN-PERMISSIONS-005, S-ADMIN-PERMISSIONS-006 |
| Single sign-on | SSO through Google or Microsoft for centralized login management | All | Sign in with Google/Microsoft identity | S-ADMIN-PERMISSIONS-005 |
| Password reset | Self-service forgot-password link on the sign-in portal; username is always the registration email | All | Sign-in page → reset link → new password | S-ADMIN-PERMISSIONS-008 |
| Platform security posture | Vendor states encryption in transit and at rest, continuous backups/recovery, 99.98% uptime, real-time monitoring with audit logging and remediation workflows, change-management traceability, US-based development/support, no sale of customer data, and customer data ownership with export rights while subscribed | Buyer-facing | n/a (assurances, not user features) | S-ADMIN-PERMISSIONS-005, S-ADMIN-PERMISSIONS-018, S-ADMIN-PERMISSIONS-007 |
| Per-record audit trails | Per-lead and per-job change-history logs: human-readable action text, action type (Job, Customer, Lead, Estimate, …), UTC timestamp, acting user (createdBy), dead reason on leads; job history filterable by date range | Admin, managers | Open record history (or query API) → review who did what, when | S-ADMIN-PERMISSIONS-011, S-ADMIN-PERMISSIONS-012 |
| Checklist attribution | Progress view records when each workflow checklist item was completed and by whom — task-level accountability | Managers | Open Progress view → see per-item who/when stamps | S-ADMIN-PERMISSIONS-013 |
| API-key administration | API keys are created and named by Location or Company Administrators inside Account Settings (App Connections area); guidance is one dedicated key per integration per location; keys can be deactivated (API returns "invalid or deactivated"); vendor warns to treat keys like passwords | Company/Location Administrator | Account Settings → App Connections → create + name key → supply to integration; deactivate to revoke | S-ADMIN-PERMISSIONS-010, S-ADMIN-PERMISSIONS-031, S-ADMIN-PERMISSIONS-002 |
| Account Settings hub | Central admin area whose sections include Company Location Settings, Manage Contacts, Manage Leads, Job File Settings, Estimate Settings, plus newer managers (Custom Fields Manager for contact/job fields; configurable appointment-outcome categories) | Admin | Account Settings → section → configure | S-ADMIN-PERMISSIONS-004, S-ADMIN-PERMISSIONS-030 |
| Notification administration | Customer Portal notifications are configurable (who gets notified and when); portal access can auto-expire when a job completes; each user has an @Me personal feed (top-right) aggregating lead assignments/distributions, milestone updates, task assignments, document-packet and measurement-order events, dismissible individually or all at once | Admin (portal rules); all (@Me) | Configure portal notification rules; users triage @Me feed | S-ADMIN-PERMISSIONS-033, S-ADMIN-PERMISSIONS-034 |
| Guided onboarding | Every new customer gets vendor-led implementation: a dedicated customer success manager from day one, goal-setting, company-info setup, and whole-team training; vendor cites go-live in as little as 2–3 weeks (setup itself "as little as a day"); training is included free | Owner/admin + vendor | Purchase → CSM assigned → setup + team training → go live | S-ADMIN-PERMISSIONS-019, S-ADMIN-PERMISSIONS-020, S-ADMIN-PERMISSIONS-007, S-ADMIN-PERMISSIONS-021 |
| Training formats | 1:1 sessions (virtual or in-person at either party's site); trainer-led Quick Start webinars three days/week (Tue–Thu 9:30–10:30 CDT); recurring weekly live webinars with Q&A; "AccuLynx University" customized onsite program for larger groups; 24/7 knowledge base with how-to guides and recorded videos; free refresher/new-hire training even years later; no traditional manual — vendor leans on KB + live help | All roles | Enroll in webinar / book 1:1 / self-serve KB | S-ADMIN-PERMISSIONS-020, S-ADMIN-PERMISSIONS-022, S-ADMIN-PERMISSIONS-023, S-ADMIN-PERMISSIONS-019, S-ADMIN-PERMISSIONS-021 |
| Ongoing support | Phone/email/chat support included with every license at no extra cost, no ticket queue, M–F 7am–5pm Central | All | Call/email/chat → live help | S-ADMIN-PERMISSIONS-018, S-ADMIN-PERMISSIONS-020, S-ADMIN-PERMISSIONS-019 |
| Per-user commercial model | Monthly per-license billing, cancel anytime, no long-term contract; pricing is quote-based (Essential tier publicly cited at $250/mo as of Apr 2026; third-party reports of $60–120/user for higher tiers are unverified); reported volume discounts at 10+ users | Owner (buys) | Quote → per-user monthly subscription → add/remove seats via user statuses | S-ADMIN-PERMISSIONS-007, S-ADMIN-PERMISSIONS-025 |

Customer sentiment (verbatim from reviews, per protocol §3): "How much it cost per month per
user for each add on. We had to make an office account that three of us shared at one point"
(project manager, Apr 2026); "can get a bit pricey as your company grows and you have to
start adding more users" (bookkeeper, Mar 2026); "I really love the support they give you
when trying to set up the program with all of the employees" (office management, Apr 2026);
"The on boarding specialist (Casey) has done a wonderful job training the team and
addressing any concerns/questions we have" (administrator, Nov 2025); "If you have a
problem, they will stay with you until it's solved" (office staff, Nov 2025)
[S-ADMIN-PERMISSIONS-024]. Takeaway: onboarding/support is a loved differentiator, while
per-seat cost drives seat-sharing behavior — a pricing-model attack surface for us
(INFERENCE).

## Key workflows

1. **User lifecycle.** A Company or Location Administrator opens Manage Your Team from the
   name menu, adds a user (full name, display name, initials), and invites them; the
   invitee's email becomes their username and they set a password [S-ADMIN-PERMISSIONS-003,
   S-ADMIN-PERMISSIONS-008]. The admin assigns one of six role types, whose base
   permissions apply, then adjusts individual permission settings — repeatable at any time
   [S-ADMIN-PERMISSIONS-001, S-ADMIN-PERMISSIONS-007]. When someone leaves, the admin flips
   them to Inactive or Archived: login is blocked immediately and billing stops after the
   cycle in which they were last Active [S-ADMIN-PERMISSIONS-003].
2. **Locking down financial visibility.** The admin uses permission settings so sales reps
   see only their assigned jobs, with profitability hidden but balance due visible
   [S-ADMIN-PERMISSIONS-014]; crews get only task-relevant data [S-ADMIN-PERMISSIONS-009].
   Worksheet approval rights separate preparers (submit for approval) from approvers
   [S-ADMIN-PERMISSIONS-015], and milestone advancement is restricted to permitted users,
   with checklist who/when stamps and job/lead history providing the audit backstop
   [S-ADMIN-PERMISSIONS-013, S-ADMIN-PERMISSIONS-011, S-ADMIN-PERMISSIONS-012].
3. **Running multiple offices.** Locations live under one account [S-ADMIN-PERMISSIONS-032];
   each keeps location-scoped settings (time zone, insurance mode, lead sources) and its own
   integration API keys [S-ADMIN-PERMISSIONS-026, S-ADMIN-PERMISSIONS-010]. Multi-location
   users choose a location at sign-in (or set a default) [S-ADMIN-PERMISSIONS-008]; a
   Location Administrator governs one branch while a Company Administrator spans all
   (INFERENCE from role names + KB snippet) [S-ADMIN-PERMISSIONS-001,
   S-ADMIN-PERMISSIONS-003]. Inbound sources like CallRail map to specific branches
   [S-ADMIN-PERMISSIONS-028], and roll-up happens via DataMart KPIs and the consolidated
   Sage Intacct model [S-ADMIN-PERMISSIONS-006].
4. **Time-boxed subcontractor access.** From Labor Manager the production admin invites a
   sub by SMS, tracks the pending invitation, and sets which job-file information the sub
   sees and for how long; the sub then works through the Crew App (assignment calendar,
   labor tickets, checklists, photos, messaging, check-in/out) with access that expires
   [S-ADMIN-PERMISSIONS-016, S-ADMIN-PERMISSIONS-017].
5. **Company onboarding.** After purchase, a dedicated success manager runs goal-setting,
   data/company setup, and role-appropriate team training (1:1, Quick Start webinars,
   onsite AccuLynx University for large groups), targeting go-live in ~2–3 weeks; training
   stays free for later hires, backed by no-ticket phone/email/chat support (M–F 7–5
   Central) and a 24/7 knowledge base [S-ADMIN-PERMISSIONS-019, S-ADMIN-PERMISSIONS-020,
   S-ADMIN-PERMISSIONS-022, S-ADMIN-PERMISSIONS-018].

## Data touched

Reads/writes (cross-reference `../04-inferred-data-model.md`): **User/CompanyUser** (id,
names, initials, role {id, name}, status, phone/mobile, email) [S-ADMIN-PERMISSIONS-001,
S-ADMIN-PERMISSIONS-002]; **Role** (fixed six-value set) and **Permission settings**
(role base + per-user overlay — shape not public) [S-ADMIN-PERMISSIONS-001,
S-ADMIN-PERMISSIONS-004]; **Location / CompanySettings** (name, timeZoneInfo, hasInsurance,
countries/states, per-location config lists) [S-ADMIN-PERMISSIONS-026,
S-ADMIN-PERMISSIONS-027]; **API key** (named, per-integration-per-location, deactivatable)
[S-ADMIN-PERMISSIONS-010]; **Subcontractor/LaborContact** access grants (info scope +
duration, invitation state) [S-ADMIN-PERMISSIONS-016]; **Audit events** (JobAction /
LeadAction: action, type, UTC date, createdBy, leadDeadReason) [S-ADMIN-PERMISSIONS-011,
S-ADMIN-PERMISSIONS-012]; **Checklist completion stamps** (who/when)
[S-ADMIN-PERMISSIONS-013]; **Notification rules** (portal recipients/timing, @Me feed
items) [S-ADMIN-PERMISSIONS-033, S-ADMIN-PERMISSIONS-034]; **Billing seat state** derived
from user status [S-ADMIN-PERMISSIONS-003].

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess
AccuLynx's behavior:

- **The actual permission matrix.** `support.acculynx.com` (including "User Roles – Base
  Permissions" and "Permission Settings") returns HTTP 403 to non-browser fetchers, so the
  concrete list of permission toggles, each role's base grants, and which permissions are
  overridable per user are unverified. Whether custom/additional roles can be created is
  unknown (the API's fixed six-value enum suggests not — INFERENCE).
- **Multi-location membership mechanics.** How a user is granted access to multiple
  locations, whether role can differ per location, whether records/users can move between
  locations, and whether a location picker maps to hard data partitioning are all
  unobserved. Per-location vs company-wide pricing is quote-based and unpublished.
- **Security specifics.** 2FA factor types (SMS/TOTP/app), password complexity/rotation
  rules, session timeout, IP allowlisting, SAML/Okta support beyond Google/Microsoft SSO,
  and named compliance certifications (the trust page gestures at "SaaS certification
  programs" without naming SOC 2 or ISO) are not publicly documented.
- **Audit coverage beyond job/lead records.** No public evidence of an admin-facing audit
  log for settings changes, permission changes, user logins, or exports (the trust page's
  "audit logging" is described as an internal security control, not a customer feature —
  INFERENCE).
- **User admin API gap.** Only read endpoints for users are public; no create/invite,
  role-change, deactivate, or SCIM-style provisioning API is documented — user lifecycle
  appears UI-only (INFERENCE from absence).
- **Inactive vs Archived.** Both block login and stop billing; the functional difference
  (e.g., list visibility, reversibility, data retention) is not publicly stated; "Deleted"
  status appears only in the API.
- **Onboarding commercials.** Vendor materials describe training as free/included, while a
  third-party pricing guide estimates $500–$5,000 implementation fees [S-ADMIN-PERMISSIONS-025];
  the discrepancy could not be resolved from public sources.
- **G2 content** was reachable only via search snippets (bot-blocked on direct fetch);
  review verification was done against Capterra.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

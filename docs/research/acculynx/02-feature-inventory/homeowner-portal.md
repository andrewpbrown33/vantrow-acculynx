# Module: Homeowner Portal & Customer-Facing Communication

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in `../sources/homeowner-portal.md`.

## Purpose

This module is AccuLynx's customer-facing surface: a branded, login-protected "Customer
Portal" web app where a homeowner follows their own job (status, appointments, documents,
photos, billing), pays invoices, applies for financing, and exchanges messages with the
contractor's team — all fed automatically from the same job file staff already work in
[S-HOMEOWNER-PORTAL-001][S-HOMEOWNER-PORTAL-002]. Around the portal sit adjacent
homeowner-touching channels that work even without the portal add-on: shareable photo-album
links, e-signature web links for proposals, two-way SMS from local numbers, and
trigger-based automated emails/texts (appointment reminders, payment nudges,
post-completion review requests) [S-HOMEOWNER-PORTAL-006][S-HOMEOWNER-PORTAL-013][S-HOMEOWNER-PORTAL-009][S-HOMEOWNER-PORTAL-012].
The portal launched June 2022 and is sold as an optional add-on, not a core-plan feature
[S-HOMEOWNER-PORTAL-003][S-HOMEOWNER-PORTAL-008]. The complete customer communication
history — portal messages, texts, emails — accumulates on the job file
[S-HOMEOWNER-PORTAL-021]. Currency check: the Spring 2026 release notes announce no new
portal or homeowner-communication features, so this inventory is current through that
release [S-HOMEOWNER-PORTAL-026].

## Feature table

### Customer Portal (add-on)

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Portal invitation | Once a job reaches the approved stage, staff invite the homeowner; the homeowner gets a secure web link plus a unique login tied to their mobile phone number | Office/sales (send); homeowner (accept) | Approve job → send invite → homeowner opens link → authenticates via phone-tied login | S-HOMEOWNER-PORTAL-002 |
| Branded portal page | Portal carries the contractor's company branding; landing view shows images of the customer's home, project details, and contact info for assigned team members | Admin (brand setup); homeowner (view) | Configure branding once → every customer sees company-branded portal | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-002, S-HOMEOWNER-PORTAL-003 |
| Job status tracking | Homeowner follows the job start-to-finish; portal content updates automatically as staff do normal work in AccuLynx (no separate publishing step for synced data) | Homeowner (view) | Staff update job → portal reflects change in real time → homeowner checks 24/7 | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-002 |
| Appointment & delivery visibility | Upcoming appointments and material delivery dates are visible to the homeowner | Homeowner (view) | Staff schedule appointment/delivery → appears in portal | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-003 |
| Selective content sharing | Staff control which job-file items the customer can see; sharing is initiated ("posted") from within the normal AccuLynx interface; shareable content includes documents, photos, job packets, and company documents | Office/sales (share); homeowner (view) | Open job file → post item to portal → homeowner sees only shared items | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-004 |
| Document access & signing | Homeowner views shared documents; a communication-focused AccuLynx page describes customers viewing, signing, and updating documents electronically through the portal (signing itself runs on the e-sign tooling, see Smart(er) Docs row) | Homeowner | Staff share doc → homeowner opens in portal → signs/acknowledges where applicable | S-HOMEOWNER-PORTAL-020, S-HOMEOWNER-PORTAL-004 |
| Billing transparency | Homeowner sees project cost, payment history, and current invoice balance | Homeowner (view); A/R (source data) | Invoice created in AccuLynx → shared → homeowner reviews balance/history | S-HOMEOWNER-PORTAL-002, S-HOMEOWNER-PORTAL-003 |
| In-portal payments (AccuPay) | Homeowner pays electronically (credit/debit/ACH via the AccuPay add-on); since Spring 2025 they can also make on-demand partial payments of any amount toward the final bill without waiting for a payment request; AccuPay added next-day funding and PCI/fraud hardening the same release | Homeowner (pay); A/R (receive) | Homeowner opens billing → chooses amount → pays → payment lands in job financials | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-005 |
| Financing application (AccuFi) | Homeowner applies for project financing from the portal; AccuLynx's embedded financing (AccuFi) is powered by Acorn Finance — soft-pull pre-qualification returning multiple loan offers | Homeowner (apply); sales (offer) | Homeowner opens financing → pre-qual form (no credit impact) → compares offers → applies | S-HOMEOWNER-PORTAL-001, S-HOMEOWNER-PORTAL-022, S-HOMEOWNER-PORTAL-023 |
| Two-way portal messaging | Homeowner sends messages from the portal; messages are routed to the appropriate team members, who reply from AccuLynx | Homeowner; all staff | Homeowner writes message → routed to team → reply appears in portal | S-HOMEOWNER-PORTAL-002, S-HOMEOWNER-PORTAL-003 |
| New-content notifications | Automated notification to the customer when new content is posted to their portal; staff configure who gets notified and when | Admin (configure); homeowner (receive) | Post content → notification fires per settings | S-HOMEOWNER-PORTAL-004 |
| Auto-expiring access | Portal access automatically expires when the job is completed, so customers don't retain indefinite access | System; admin | Job hits completion → access ends without manual revocation | S-HOMEOWNER-PORTAL-004, S-HOMEOWNER-PORTAL-015 |
| Portal preview | Staff can preview exactly what the customer-facing portal shows before/while sharing | Office/sales | Open preview → verify shared content → adjust | S-HOMEOWNER-PORTAL-004 |
| Engagement tracking | Staff see when the customer last visited/logged in, giving a read on engagement | Sales/office | Check last-visit stamp → follow up if customer never looked | S-HOMEOWNER-PORTAL-004, S-HOMEOWNER-PORTAL-015 |
| Packaging | Portal is one of eight optional add-ons (alongside Smart(er)Docs, Text Messaging, AccuPay, Crew App, ReportsPlus, DataMart, AppConnections); pricing unpublished | Buyer/admin | Purchase add-on → enable for company | S-HOMEOWNER-PORTAL-003, S-HOMEOWNER-PORTAL-008, S-HOMEOWNER-PORTAL-017 |

### Adjacent homeowner-facing channels (work with or without the portal)

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Photo album share links ("Photo Links") | Job photos live in albums — standard albums (pre-created per job, incl. homeowner/adjuster/crew albums, non-deletable) and custom albums; an album's share link goes out via email, text, or job message; shared albums auto-update as new photos are added (no re-share); staff can set a link expiration date or manually kill a link via a manage-sharing control | Field/office (share); homeowner (view) | Add photos to album → Share → pick channel → homeowner watches album grow → link expires or is revoked | S-HOMEOWNER-PORTAL-006, S-HOMEOWNER-PORTAL-007 |
| Photos-to-PDF | Selected job photos convert to a PDF for printing or sending electronically to the customer | Office/sales | Select photos → generate PDF → email/print | S-HOMEOWNER-PORTAL-006 |
| E-sign delivery links (Smart(er) Docs) | Proposals/contracts reach the homeowner as a secure web link via email or text; homeowner can preview before signing; signature capture records name, email, date/time, and IP; contractor gets a real-time signed notification and the signed doc auto-files to the job; e-sign runs on a OneSpan/eSign Live partnership | Sales (send); homeowner (sign) | Build doc → send link → homeowner previews → signs → auto-saved + notification | S-HOMEOWNER-PORTAL-013 |
| Signature reminders & expiration | Unsigned documents trigger automatic reminder messages to the homeowner; docs can carry expiration dates to create urgency; staff track color-coded document status | Sales; homeowner | Doc sits unsigned → auto-reminder → expires if ignored | S-HOMEOWNER-PORTAL-013, S-HOMEOWNER-PORTAL-014 |
| Two-way SMS (Text Messaging add-on) | Staff text homeowners from a unique local number directly from the lead/job record; replies notify the user in-app; every inbound/outbound text auto-logs to the job file; contact texting preferences are surfaced | Sales/office; homeowner | Job → Messages tab → Text Message → pick contact → send → reply notification → thread logged | S-HOMEOWNER-PORTAL-009, S-HOMEOWNER-PORTAL-010 |
| Automated homeowner emails/texts (Automation Manager) | No-extra-cost trigger engine sends templated emails/texts on job events (e.g., appointment scheduled), milestone transitions (e.g., Prospect→Approved), and order events; published sample recipes: appointment-confirmation text, welcome email at approval (crew lead + contacts), overdue-invoice email with payment link, post-completion thank-you email | Admin (build); homeowner (receive) | Define trigger + template → event fires → homeowner messaged automatically | S-HOMEOWNER-PORTAL-011, S-HOMEOWNER-PORTAL-012, S-HOMEOWNER-PORTAL-021 |
| Review requests (via automation) | No dedicated reputation/review module is evidenced; AccuLynx's own published recipe is an Automation Manager email at job completion that thanks the homeowner and includes a review link to drive testimonials/referrals; third parties (Review Dingo natively; Verified Reviews via Zapier) sell structured review-request flows on top of AccuLynx job-completion events | Admin (build); marketing | Job completes → automated email with review link → homeowner posts review | S-HOMEOWNER-PORTAL-012, S-HOMEOWNER-PORTAL-018, S-HOMEOWNER-PORTAL-024 |
| Threaded communications view | Spring 2025 "story view" for Job Communications shows customer/team messages as threads with timestamps, filtering by communication type, collapsible threads — the internal console where portal/SMS/email traffic is worked | Staff (internal) | Open Job Communications → filter by type → work threads | S-HOMEOWNER-PORTAL-005 |

Customer sentiment (verbatim from reviews, per protocol §3): "We collect most of our
payments through AccuLynx too which is super convenient for us and our clients" (Dan H.,
Apr 2026); "The communications that I am able to do with any team member is my favorite"
(Dylan V., May 2026) [S-HOMEOWNER-PORTAL-016]. A third-party 2026 review summarizes the
portal as a branded homeowner login for viewing project status, accessing documents,
approving proposals, and communicating with the team, and files it under the add-on
cost complaints common across review platforms [S-HOMEOWNER-PORTAL-017].

## Key workflows

1. **Portal lifecycle** — Job is approved → staff send the portal invitation →
   homeowner authenticates via a secure link and a login tied to their mobile phone →
   they see a branded page with home photos, project details, and team contacts →
   as staff work the job normally, status/appointments/delivery dates update in the
   portal automatically → each newly posted item triggers a customer notification
   (configurable recipients/timing) → staff monitor last-visit activity → at job
   completion, portal access auto-expires [S-HOMEOWNER-PORTAL-002][S-HOMEOWNER-PORTAL-004].
2. **Getting paid through the portal** — Invoice exists on the job → homeowner sees cost,
   payment history, and balance in the portal → (optionally) an overdue-invoice automation
   emails them a payment link → homeowner pays by card/ACH via AccuPay, or makes an
   on-demand partial payment of any amount toward the final bill → funds settle next
   business day; homeowners can alternatively pre-qualify for AccuFi financing (Acorn
   Finance marketplace, soft credit pull, multiple offers) from the same surface
   [S-HOMEOWNER-PORTAL-005][S-HOMEOWNER-PORTAL-012][S-HOMEOWNER-PORTAL-022][S-HOMEOWNER-PORTAL-023].
3. **Photo sharing without the portal** — Field crew photos land in job albums (a
   standard homeowner album exists on every job) → staff share the album link by email,
   text, or job message → the homeowner watches new photos appear in the already-shared
   album with no re-send → staff expire or revoke the link when done
   [S-HOMEOWNER-PORTAL-006][S-HOMEOWNER-PORTAL-007].
4. **Proposal to signature** — Sales sends the proposal as a secure web link by email or
   text → homeowner previews, then e-signs (name/email/timestamp/IP captured) →
   contractor gets a real-time notification and the signed document auto-files to the
   job; unsigned docs get automatic reminders and can expire
   [S-HOMEOWNER-PORTAL-013][S-HOMEOWNER-PORTAL-014].
5. **Post-job review request** — Job hits the completed milestone → Automation Manager
   sends a thank-you email containing a review link → homeowner leaves a public review;
   shops wanting multi-platform review orchestration bolt on third-party tools keyed to
   the same completion event [S-HOMEOWNER-PORTAL-012][S-HOMEOWNER-PORTAL-018].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **Job** — milestone/status (drives portal state, expiration, automations); the public
  API exposes jobs, milestone history, and current milestone [S-HOMEOWNER-PORTAL-019].
- **Contact (homeowner)** — mobile phone doubles as the portal identity anchor
  [S-HOMEOWNER-PORTAL-002]; texting preferences [S-HOMEOWNER-PORTAL-009].
- **Appointments / delivery dates** — read-only display to homeowner; API: appointment
  and initial-appointment endpoints [S-HOMEOWNER-PORTAL-019].
- **Documents** — job documents, job packets, company documents; signed-document
  artifacts with signature metadata [S-HOMEOWNER-PORTAL-004][S-HOMEOWNER-PORTAL-013];
  API: add job document, document folders [S-HOMEOWNER-PORTAL-019].
- **Photos/videos & albums** — album membership, share links, link expiration state
  [S-HOMEOWNER-PORTAL-006]; API: photo/video upload + tags [S-HOMEOWNER-PORTAL-019].
- **Invoices & payments** — balance, payment history, received payments (incl. partial
  on-demand amounts) [S-HOMEOWNER-PORTAL-005]; API: invoices, payments, payments
  overview [S-HOMEOWNER-PORTAL-019].
- **Financing applications** — AccuFi pre-qualification/application state
  [S-HOMEOWNER-PORTAL-022][S-HOMEOWNER-PORTAL-023].
- **Messages** — portal messages, SMS threads, emails, all logged to the job file
  [S-HOMEOWNER-PORTAL-002][S-HOMEOWNER-PORTAL-009]; API: create job message + reply
  (comment-type only) [S-HOMEOWNER-PORTAL-019].
- **Portal access records** — invitation, share/post events, notification settings,
  last-visit timestamp, expiration [S-HOMEOWNER-PORTAL-004]. INFERENCE: stored as a
  distinct portal-session/share entity; the public API exposes no portal-specific
  endpoints, so portal state appears internal-only [S-HOMEOWNER-PORTAL-019].
- **Company branding settings** — logo/branding applied to portal and documents
  [S-HOMEOWNER-PORTAL-001].

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than
guess AccuLynx's approach:

- **Login mechanics.** "Unique login tied to their mobile phone" is the only public
  description — whether that means SMS one-time codes, a password bound to the phone
  number, or magic links is unstated. Also unknown: multi-contact access (spouse/second
  email), one login across multiple jobs, and session lifetime.
- **Sharing granularity.** Whether staff share item-by-item, by category toggles, or via
  per-job defaults; whether estimates/insurance paperwork can be selectively hidden; and
  whether sharing is permission-gated by user role.
- **Homeowner write abilities.** No evidence whether homeowners can upload files/photos,
  approve change orders natively in-portal (one third-party review says "approve
  proposals" [S-HOMEOWNER-PORTAL-017] — mechanism unclear), or edit their contact info.
- **Notification channels.** Whether portal new-content notifications reach the homeowner
  by email, SMS, or both, and what the homeowner can configure.
- **Portal payments scope.** Whether homeowners can pay any open invoice vs. only
  requested amounts pre-2025; deposit/progress-payment behavior; card surcharge handling.
- **Pricing.** Add-on price for the portal (and Text Messaging/AccuPay rates) is
  quote-based and unpublished.
- **Help-center detail.** The public knowledge base (support.acculynx.com) returned
  HTTP 403 to non-browser clients, so article-level portal setup/permission mechanics
  could not be verified [S-HOMEOWNER-PORTAL-027]. Not circumvented per protocol §1.
- **Video walkthroughs.** YouTube watch pages would not render in this environment, so
  no timestamped UI-flow descriptions were possible; a contractor-published portal
  walkthrough exists but was only identifiable by title/date [S-HOMEOWNER-PORTAL-025].
- **Mobile behavior & localization.** Whether the portal is responsive-web only or has
  app distribution; Spanish-language support (the Crew App has it; portal unknown).

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

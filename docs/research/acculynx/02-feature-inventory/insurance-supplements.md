# Module: Insurance & Supplements

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/insurance-supplements.md` (IDs `S-INSURANCE-SUPPLEMENTS-###`).

## Purpose

This module runs the restoration side of a roofing business: a storm-damaged property
becomes a job that carries a structured insurance record (carrier, claim number, date of
loss, adjuster), moves through an adjuster inspection to claim approval, and then accrues
supplements — itemized requests for money beyond the carrier's original scope — that are
negotiated, documented, and finally applied to the job's financial worksheet. Around that
core sit trackers for the slow-moving artifacts of insurance work (supplements, mortgage
checks, permits), carrier-facing communication templates, and photo/document evidence
capture, so office staff and field reps can see every claim's state without phone tag
[S-INSURANCE-SUPPLEMENTS-001][S-INSURANCE-SUPPLEMENTS-002][S-INSURANCE-SUPPLEMENTS-004].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Insurance vs retail job classification | Jobs carry a company-configurable Work Type (public API example value: "Insurance", with a `systemDefault` flag), plus Job Category and Trade Types, all managed in company settings and editable per job via API. Third-party reviews describe distinct handling for insurance-restoration vs retail sales motions on top of this typing. | Admin (configure), sales rep (set per job) | Configure work types → tag job at intake → filter/report by work type | S-INSURANCE-SUPPLEMENTS-005, S-INSURANCE-SUPPLEMENTS-012, S-INSURANCE-SUPPLEMENTS-011, S-INSURANCE-SUPPLEMENTS-022 |
| Job insurance record | Each job holds one structured insurance block: carrier (picked from a managed list or typed as a free-text custom name — mutually exclusive), claim number, date of loss, damage location, claim-filed flag + filed date (flag must be true if date set), and a "paperwork collected" flag. Readable and writable via public API. | Office, sales rep | Open job → enter claim details → team-wide visibility | S-INSURANCE-SUPPLEMENTS-007, S-INSURANCE-SUPPLEMENTS-025, S-INSURANCE-SUPPLEMENTS-001 |
| Insurance company directory | Company-level list of carriers kept in Account Settings; entries have active/inactive state; jobs reference an entry or bypass the list with a custom name. | Admin | Maintain carrier list → reps pick from it on jobs | S-INSURANCE-SUPPLEMENTS-026, S-INSURANCE-SUPPLEMENTS-007 |
| Adjuster record per job | A per-job adjuster contact: name, phone (typed Home/Mobile/Work + extension), fax, email; plus two paired outcome fields — met-with-adjuster flag + meeting date, and claim-approved flag + approval date. | Sales rep, office | Record adjuster after claim assignment → log meeting held → log approval | S-INSURANCE-SUPPLEMENTS-008, S-INSURANCE-SUPPLEMENTS-001 |
| Adjuster/inspection scheduling | Appointments are created from the job's calendar (e.g. an inspection with an assigned rep and homeowner notification, per a contractor's public training material); each job also has a distinguished "initial appointment" (start/end/notes) in the API. Fall-2025: multiple attendees per appointment, automatic email/push alerts on changes, an all-appointments report, Outlook/iCalendar sync. Public API event types are Personal, InitialAppointment, MaterialDelivery, CrewLabor — no dedicated adjuster-meeting type; the meeting outcome lives on the adjuster record instead. | Sales rep, office scheduler | Job file → calendar → new appointment → assign attendee(s) → notify → record met-with-adjuster date | S-INSURANCE-SUPPLEMENTS-021, S-INSURANCE-SUPPLEMENTS-014, S-INSURANCE-SUPPLEMENTS-031, S-INSURANCE-SUPPLEMENTS-024, S-INSURANCE-SUPPLEMENTS-008 |
| Supplement records | Supplements are first-class objects on a job: name/description, lifecycle state (API enum: Unknown, Created, InProgress, Closed, Applied, Deleted), a separate configurable status reference, full audit trail (created/edited/closed/applied, each with user + date). | Office, supplementer | Create from job file → work it → close/apply | S-INSURANCE-SUPPLEMENTS-006, S-INSURANCE-SUPPLEMENTS-004 |
| Supplement statuses | Default tracker statuses are Requested and Completed; companies add custom intermediate statuses — marketing examples: under review, pending re-inspection, need more information from rep, approved. | Admin (configure), office (set) | Configure statuses → move supplement through them | S-INSURANCE-SUPPLEMENTS-004, S-INSURANCE-SUPPLEMENTS-001 |
| Supplement line items | Each supplement holds itemized lines with four money fields per item: original claim amount, requested amount, approved amount, and the amount actually applied to the worksheet; the supplement carries matching totals. | Supplementer | Add items → record carrier's approvals per line → apply | S-INSURANCE-SUPPLEMENTS-009, S-INSURANCE-SUPPLEMENTS-006, S-INSURANCE-SUPPLEMENTS-002 |
| Supplementer assignment | A designated owner ("supplementer") is assigned per supplement, with assignment date and assigner recorded; follow-up tasks can be created and assigned to team members. | Office manager | Assign supplementer → create follow-up tasks → chase carrier | S-INSURANCE-SUPPLEMENTS-006, S-INSURANCE-SUPPLEMENTS-002 |
| Supplement notations (contact log) | Every carrier touch is logged as a notation on the supplement: who was spoken with, their phone/extension/fax/email, free-text notes, a status set at that touch, creator + timestamp, and the email recipients the notation was sent to. | Supplementer, office | After each call/email → add notation → status updates ride along | S-INSURANCE-SUPPLEMENTS-010, S-INSURANCE-SUPPLEMENTS-004 |
| Carrier/adjuster communication templates | Pre-built, customizable email templates for writing to adjusters, carriers, and homeowners; supplements can be sent directly to those parties from the system; emails to insurance companies are stored on the job file. | Supplementer, office | Pick template → attach evidence → send → thread saved to job | S-INSURANCE-SUPPLEMENTS-002, S-INSURANCE-SUPPLEMENTS-030 |
| Supplement → financial worksheet | Approved supplement money applies onto the job's single financial worksheet ("applied" amounts per item); claim totals recompute automatically when requested or original amounts change. Worksheet amendments are typed, and the type list includes Insurance claim, Supplement, Upgrade, Work not doing, alongside Change order, Discount, and New section. | Office, manager | Carrier approves → apply supplement → worksheet amends → invoice from updated value | S-INSURANCE-SUPPLEMENTS-002, S-INSURANCE-SUPPLEMENTS-009, S-INSURANCE-SUPPLEMENTS-016 |
| Company-wide supplements tracker | A Track → Supplements page lists every supplement across the company in a two-column requested vs in-progress layout; clicking a job updates its status; filterable (marketing cites job number, company name, date). | Office manager, owner | Open tracker → filter → click through to update | S-INSURANCE-SUPPLEMENTS-004, S-INSURANCE-SUPPLEMENTS-019, S-INSURANCE-SUPPLEMENTS-001 |
| Mortgage check tracker | Insurance checks that need a mortgage-holder endorsement are tracked to release funds: company name, amount, sent date, optional tracking number; a Track → Mortgage Checks page shows all checks at once so field reps see status without calling the office. | Office, sales/PM (view) | Log check → record send + tracking number → monitor until endorsed/returned | S-INSURANCE-SUPPLEMENTS-004, S-INSURANCE-SUPPLEMENTS-019, S-INSURANCE-SUPPLEMENTS-001 |
| Permit tracker (adjacent) | Permits created from the job file with permit type and payment amount; fixed status pipeline (marketing lists drafted, applied for, pulled, posted, scheduled for inspection, completed); Track → Permits page supports dragging permits between status columns; entries drop off when the job closes. | Office | Create permit on job → advance status → auto-clear at close | S-INSURANCE-SUPPLEMENTS-004, S-INSURANCE-SUPPLEMENTS-019 |
| Claim evidence capture | Photo/video capture with annotation and tagging from the mobile app; photos auto-file to the job and can be organized into folders shared with homeowners and adjusters; documents (e.g. carrier scope, denial letters) scanned/uploaded from the field; notes added in real time after inspections. | Sales rep, field | Inspect → shoot + annotate → auto-file → share folder with adjuster | S-INSURANCE-SUPPLEMENTS-001, S-INSURANCE-SUPPLEMENTS-018, S-INSURANCE-SUPPLEMENTS-020, S-INSURANCE-SUPPLEMENTS-021 |
| Insurance-flavored documents | An insurance-specific estimate template is offered; SmartDocs templates can be built per insurance provider and auto-fill job-record fields; claim checklists and carrier-specific standardized processes are supported via workflow checklists. | Admin, sales rep | Build carrier templates/checklists → generate per job → e-sign | S-INSURANCE-SUPPLEMENTS-003, S-INSURANCE-SUPPLEMENTS-030, S-INSURANCE-SUPPLEMENTS-015 |
| Homeowner claim visibility | The add-on customer portal auto-updates the homeowner on claim progress and shares contracts, photos, messages, and invoices; financing (AccuFi) is positioned for covering deductibles or upgrades insurance won't pay. | Homeowner, sales rep | Portal invite → homeowner watches claim progress → finance deductible | S-INSURANCE-SUPPLEMENTS-001, S-INSURANCE-SUPPLEMENTS-015 |
| Storm lead intake | Hail/wind storm data integrations (HailWatch, CoreLogic Hail Maps) feed targeting; leads categorized by storm/weather event, neighborhood, source, and salesperson; canvassing-app integrations (SalesRabbit, Spotio) import door-knock leads. | Sales manager, canvasser | Storm alert → target area → import leads → tag by storm | S-INSURANCE-SUPPLEMENTS-032, S-INSURANCE-SUPPLEMENTS-017 |
| Shared milestone pipeline | Insurance and retail jobs traverse the same fixed milestone spine (API enum: Lead, Prospect, Approved, Completed, Invoiced, Closed, Dead, Deleted) with optional company-defined statuses inside each milestone (custom workflows); a contractor's public training shows insurance-specific stage names layered on top. | All | Job advances milestones → custom sub-statuses model claim states | S-INSURANCE-SUPPLEMENTS-013, S-INSURANCE-SUPPLEMENTS-021 |
| Xactimate relationship | No direct Xactimate/ESX integration exists per two independent reviews; the practical pattern is manual — carrier scope PDFs are uploaded to the job and Xactimate line items are re-keyed as supplement items to track per-line money. INFERENCE: the supplement item money model (original/requested/approved) is designed to mirror a carrier estimate line without importing it. | Supplementer | Upload carrier scope → key disputed lines as supplement items | S-INSURANCE-SUPPLEMENTS-023, S-INSURANCE-SUPPLEMENTS-022, S-INSURANCE-SUPPLEMENTS-021 |
| Public API for insurance data | Read/write job insurance and adjuster; read-only supplements (company-wide list with `includes=items,notations` and a jobId filter; per-supplement items and notations); insurance company list; job categories/work types/milestones. No public endpoints for mortgage checks or permits. | Integrators | API key → sync claim + supplement state outward | S-INSURANCE-SUPPLEMENTS-005, S-INSURANCE-SUPPLEMENTS-027, S-INSURANCE-SUPPLEMENTS-025 |

## Key workflows

1. **Claim intake to approval.** A storm lead (hail-map targeted or canvassed) becomes a job
   tagged with an insurance work type [S-INSURANCE-SUPPLEMENTS-017][S-INSURANCE-SUPPLEMENTS-012].
   Office/rep fills the job insurance record — carrier, claim number, date of loss, damage
   location, claim-filed date [S-INSURANCE-SUPPLEMENTS-007]. When the carrier assigns an
   adjuster, their contact details go on the job's adjuster record; the inspection is scheduled
   from the job calendar with attendee notifications; afterward the met-with-adjuster date and
   later the claim-approved date are logged [S-INSURANCE-SUPPLEMENTS-008]
   [S-INSURANCE-SUPPLEMENTS-031][S-INSURANCE-SUPPLEMENTS-021]. Evidence (annotated photos,
   scanned scope docs) accumulates on the job throughout [S-INSURANCE-SUPPLEMENTS-001]
   [S-INSURANCE-SUPPLEMENTS-018].
2. **Supplement lifecycle.** When the contractor's scope exceeds the carrier's, a supplement is
   created from the job file and a supplementer is assigned [S-INSURANCE-SUPPLEMENTS-004]
   [S-INSURANCE-SUPPLEMENTS-006]. Disputed lines are entered as items with original-claim and
   requested amounts; photos/notes document each added scope item [S-INSURANCE-SUPPLEMENTS-009]
   [S-INSURANCE-SUPPLEMENTS-029]. The package goes to the adjuster/carrier via templated email;
   every follow-up call is a notation (spoke-with, contact info, notes, status)
   [S-INSURANCE-SUPPLEMENTS-002][S-INSURANCE-SUPPLEMENTS-010]. As the carrier responds,
   per-item approved amounts are recorded; on approval the supplement is applied, pushing
   applied amounts into the financial worksheet, which recalculates claim totals automatically
   [S-INSURANCE-SUPPLEMENTS-009][S-INSURANCE-SUPPLEMENTS-002][S-INSURANCE-SUPPLEMENTS-016].
   Management watches all of this on the company-wide tracker [S-INSURANCE-SUPPLEMENTS-004].
   Customer sentiment cuts both ways: "As well as all the new features of the supplements tabs,
   makes everything so much easier." vs "It works well overall but I would like to see better
   tracking of little things that are significant in tracking when supplements submitted."
   (Capterra reviewers; attribution details not retrievable this pass)
   [S-INSURANCE-SUPPLEMENTS-028].
3. **Money release (mortgage checks).** Carrier checks co-payable to the mortgage holder are
   logged with amount, send date, and tracking number; office and field both watch the Track →
   Mortgage Checks page so the build can start the moment funds release, without status calls
   to the office [S-INSURANCE-SUPPLEMENTS-004][S-INSURANCE-SUPPLEMENTS-001]
   [S-INSURANCE-SUPPLEMENTS-019]. A contractor's public training layers the payment sequence on
   top: ACV check first, recoverable depreciation after completion evidence, PWI items when
   incurred — tracked through worksheet/invoice records rather than dedicated fields
   [S-INSURANCE-SUPPLEMENTS-021] (see Unknowns).
4. **Retail vs insurance divergence.** Both job kinds share the milestone spine (Lead →
   Prospect → Approved → Completed → Invoiced → Closed) [S-INSURANCE-SUPPLEMENTS-013]; the
   insurance flavor is carried by the work type, the insurance/adjuster records, custom
   workflow statuses, carrier-specific document templates and checklists, and the three
   trackers — an independent review calls this claim-specific pipeline depth the platform's
   differentiator and associates it with the top ("Elite") plan tier
   [S-INSURANCE-SUPPLEMENTS-022][S-INSURANCE-SUPPLEMENTS-030].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **JobInsurance** — insuranceCompany ref | customInsuranceCompanyName (exclusive),
  damageLocation, dateOfLoss, claimFiled + claimFiledDate, claimNumber, hasPaperwork
  [S-INSURANCE-SUPPLEMENTS-007][S-INSURANCE-SUPPLEMENTS-025]
- **InsuranceCompany** (company settings) — name, isActive [S-INSURANCE-SUPPLEMENTS-026]
- **JobAdjuster** — name, phone (number/ext/type), fax, email, metWithAdjuster(+date),
  claimApproved(+date) [S-INSURANCE-SUPPLEMENTS-008]
- **Supplement** — name, state (Created/InProgress/Closed/Applied/Deleted), status ref,
  job ref, assignedSupplementer(+date, by), totals (originalClaim/requested/approved/applied),
  created/edited/closed/applied audit [S-INSURANCE-SUPPLEMENTS-006]
- **SupplementItem** — name, description, originalClaimAmount, requestedAmount,
  approvedAmount, appliedAmount [S-INSURANCE-SUPPLEMENTS-009]
- **SupplementNotation** — status ref, spokeWith, phone/extension/fax/email, notes,
  emailRecipients, createdBy/date [S-INSURANCE-SUPPLEMENTS-010]
- **Job classification** — workType (e.g. "Insurance", systemDefault flag), jobCategory,
  tradeTypes; **WorkflowMilestone** + custom statuses [S-INSURANCE-SUPPLEMENTS-012]
  [S-INSURANCE-SUPPLEMENTS-011][S-INSURANCE-SUPPLEMENTS-013]
- **Appointment** — eventType, attendees, job ref, start/end, location,
  sharedWithCustomerPortal; **InitialAppointment** (start/end/notes)
  [S-INSURANCE-SUPPLEMENTS-024][S-INSURANCE-SUPPLEMENTS-014]
- **MortgageCheck** (no public API) — company, amount, sentDate, trackingNumber
  [S-INSURANCE-SUPPLEMENTS-004]; **Permit** (no public API) — type, paymentAmount, status
  [S-INSURANCE-SUPPLEMENTS-004][S-INSURANCE-SUPPLEMENTS-019]
- **FinancialWorksheet + Amendment** (typed: Insurance claim, Supplement, Upgrade, Work not
  doing, Change order, Discount, New section) [S-INSURANCE-SUPPLEMENTS-016]; **Photos/
  Documents/Notes/Tasks** on the job [S-INSURANCE-SUPPLEMENTS-001][S-INSURANCE-SUPPLEMENTS-002]

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **ACV / RCV / depreciation / deductible modeling.** No public AccuLynx doc or API field
  shows structured tracking of ACV vs RCV, recoverable depreciation, or deductible amounts;
  the only evidence is a third-party contractor's own process layered on invoices/worksheets
  [S-INSURANCE-SUPPLEMENTS-021]. Whether AccuLynx has dedicated fields (e.g. on the insurance
  amendment type) is unknown — a clear design opportunity.
- **Insurance amendment mechanics.** What the "Insurance claim" worksheet amendment captures
  and computes (vs the Supplement amendment) is not publicly documented
  [S-INSURANCE-SUPPLEMENTS-016].
- **Multi-adjuster / re-inspection handling.** The API exposes one adjuster record per job
  [S-INSURANCE-SUPPLEMENTS-008]; how second adjusters, re-inspections, or claim reassignment
  are handled is unknown ("pending re-inspection" exists only as a status label
  [S-INSURANCE-SUPPLEMENTS-004]).
- **Supplement status configuration limits** (how many custom statuses, ordering, permissions
  to edit) and tracker filter set beyond the marketing examples.
- **Mortgage check / permit internals.** Neither has a public API; statuses beyond the
  marketed field list, reminders, and completion semantics are unknown.
- **Adjuster-meeting scheduling linkage.** No dedicated adjuster-meeting event type exists in
  the public API [S-INSURANCE-SUPPLEMENTS-024]; whether the UI links a calendar event to the
  metWithAdjuster fields, and what Spring-2026 "appointment outcome" tracking covers for
  adjuster meetings, is unknown.
- **Plan gating.** One independent review ties the insurance workflow depth to the Elite tier
  [S-INSURANCE-SUPPLEMENTS-022] while the same publisher's pricing guide emphasizes the
  missing Xactimate integration and does not confirm tier gating
  [S-INSURANCE-SUPPLEMENTS-023]; actual packaging is unverified (AccuLynx pricing is
  quote-based).
- **Access limitations this pass:** the in-app Knowledge Base is behind login (not accessed,
  per protocol); G2 review pages returned HTTP 403 (bot-blocked); Capterra review pagination
  prevented attributing the two supplement quotes to named reviewers; no YouTube walkthrough
  was usable, so no URL+timestamp UI references are logged for the trackers.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

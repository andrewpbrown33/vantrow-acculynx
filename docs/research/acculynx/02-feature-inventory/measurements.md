# Module: Measurements

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/measurements.md` (IDs `S-MEASUREMENTS-###`).

## Purpose

This module gets a trustworthy set of roof (and wall/siding) dimensions attached to a job
so the rest of the platform can price, propose, and order materials without re-keying
numbers. A contractor either orders an aerial measurement report from an integrated
provider (EagleView, GAF QuickMeasure, Geospan natively; Hover, RoofSnap, RoofScope via an
integration-marketplace add-on), uploads a provider XML file, or enters measurements by
hand. Completed reports auto-file into the job record, raise ready-notifications, and their
quantities — combined with configurable waste factors — auto-populate template-based
estimates and downstream supplier material orders
[S-MEASUREMENTS-001][S-MEASUREMENTS-003][S-MEASUREMENTS-020][S-MEASUREMENTS-030].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Measurements tab (per-job hub) | Every job file has a Measurements area that is the single intake point: order from a provider, upload an XML file, or enter values manually (a "+" affordance offers order vs manual entry in the mobile app). Completed reports and 3D-model links live here. | Sales rep, estimator | Open job → Measurements → order / upload XML / manual entry | S-MEASUREMENTS-002, S-MEASUREMENTS-012, S-MEASUREMENTS-024, S-MEASUREMENTS-011 |
| EagleView ordering (native) | In-app ordering of EagleView aerial reports from the main dashboard or the job's Measurements tab: pick report type and number of buildings, add order notes, confirm a map pin sits on the right address, submit. Progress is trackable in-app; the finished report auto-files to the job and its measurements can transfer straight into an estimate. Integration dates to ~2010. Contractor's EagleView credentials are validated in Account Settings. Marketing cites 96% accuracy with a guarantee; "Premium" report from ~$31. | Sales rep, estimator | Enable in settings → order (dashboard or job) → confirm pin → submit → ready notification → data to estimate | S-MEASUREMENTS-001, S-MEASUREMENTS-002, S-MEASUREMENTS-003, S-MEASUREMENTS-025 |
| EagleView Roof + Wall report | A combined roof-and-wall report variant orderable through the platform adds exterior-wall/siding/gutter dimensions to support upselling other trades; demonstrated publicly in an Aug-2023 partner webinar where measurement data flowed into an estimate in minutes, with margin and line add/removals adjusted live. | Sales rep | Order roof+wall report → estimate roof and exterior trades from one dataset | S-MEASUREMENTS-026 |
| GAF QuickMeasure ordering (native) | Same two entry points (dashboard or Measurements tab). No GAF account needed — orders are tracked and billed inside AccuLynx (launched May 2022). Delivery commitments: under 1 hour for single-family, under 24 hours for multi-family/commercial. Each order returns a full PDF plus an interactive report with a 3D design view showing GAF products in context. From ~$18; 95% accuracy claim. | Sales rep, estimator | Order → status updates → PDF + interactive 3D report to job → data to estimate | S-MEASUREMENTS-001, S-MEASUREMENTS-004, S-MEASUREMENTS-005, S-MEASUREMENTS-028 |
| Geospan ordering (native) | Two report products: gPro (detailed 3D model + photorealistic rendering, ~99% accuracy, under 6 h, $38 at launch; pitched for insurance/HOA/complex jobs) and gProXPress (reduced dataset, ~95%, under 3 h, $23; pitched for quick bids/retail). No Geospan account required; admin enables it under Account Settings → Add-On Features and Integrations and grants it per role (Managers, Office, Sales). Charges roll into the AccuLynx bill (Billing History). Requires Pro/Elite subscription tiers. Launched Apr 2025. | Admin (enable), sales rep, estimator | Enable + assign roles → order from dashboard link or Measurements tab → pick gPro/gProXPress + instructions → submit → ready notification | S-MEASUREMENTS-006, S-MEASUREMENTS-007, S-MEASUREMENTS-008 |
| Interactive 3D roof model viewer | Geospan reports opened from the job's Measurements area expose a "View 3D Rendering" action: an interactive model the user can rotate/zoom and click for element-level details (Fall-2025 addition). Hover 3D model links are also stored on the job and shareable externally via public link. | Sales rep, homeowner (shared link) | Open report → view/rotate 3D model → share link | S-MEASUREMENTS-009, S-MEASUREMENTS-010, S-MEASUREMENTS-011 |
| Hover connection (AppConnections add-on) | Job-status/milestone triggers automatically create a Hover capture request, pushing job number, contact, address, and assigned rep to Hover; the rep is prompted (Hover app/SMS/email) to photograph the property. When the Hover project completes, measurement XML, measurement PDF, inspection PDFs (one per inspection, incl. question/answer data), photos (with notes/tags), and a 3D-model link import automatically. Routing: report + 3D link → Measurements; XML/PDF → Documents ("Roof Reports" folder); photos → Photos & Videos. Multi-structure projects supported. Inspection data syncs only for Hover projects created via the integration. Manual fallback: export XML from Hover, use the Upload XML action on the job. | Admin (setup), sales rep | Set trigger status → job hits status → capture request → completion → auto-import to job sections | S-MEASUREMENTS-010, S-MEASUREMENTS-011, S-MEASUREMENTS-012 |
| RoofSnap connection (AppConnections add-on) | Reaching a chosen milestone auto-creates a RoofSnap project carrying customer contact, assigned rep, and insurance info. Sketch-derived measurements flow back into the job's Measurements section, photos into Photos, PDF reports into Documents; later edits in RoofSnap re-sync. Setup selects the source RoofSnap "Office" and the trigger milestone. Requires active RoofSnap account. | Admin (setup), field sales | Connect + pick office/milestone → job hits milestone → sketch in RoofSnap → auto-sync back | S-MEASUREMENTS-013, S-MEASUREMENTS-030 |
| RoofScope connection (AppConnections add-on) | Newest measurement connection (reported live Feb 2026). A milestone drops an order request into the contractor's RoofScope shopping cart; the user finalizes/pays in RoofScope; completed measurements and documents then stream back into an "AppConnections" folder on the job as each item finishes. Requires a RoofScope Growth/Advantage plan or prepaid deposit; Elite AccuLynx accounts can refine triggers with custom statuses. Third-party review reports ≤12 h delivery. | Admin (setup), estimator | Milestone → cart entry in RoofScope → submit there → results stream into job | S-MEASUREMENTS-014, S-MEASUREMENTS-015 |
| Universal XML import | Measurements from any non-integrated provider can be brought in by uploading the provider's XML file to the job's Measurements section, after which they are selectable when building an estimate. | Estimator | Download XML from provider → Upload XML on job → use in estimate | S-MEASUREMENTS-001, S-MEASUREMENTS-012 |
| Manual measurement entry | Values measured on-site can be keyed directly into the job (web and Field App); the knowledge base groups intake as "entering, uploading & ordering". Marketing content also teaches the by-hand method (per-plane area, exclusions, pitch, squares = sq ft / 100). | Field rep, estimator | Measure on roof → job → Measurements → manual entry | S-MEASUREMENTS-024, S-MEASUREMENTS-028, S-MEASUREMENTS-001 |
| Order status tracking + notifications | In-app real-time status for outstanding orders; a Measurement Providers tracking page shows each order as Requested, Ordered, or Completed; ready-notifications fire when a report lands. | Office, sales rep | Order → watch status page → notification → open report | S-MEASUREMENTS-003, S-MEASUREMENTS-004, S-MEASUREMENTS-006 |
| Measurement spend reconciliation | A report links each measurement order (by ID) to the job it was ordered for, so per-job measurement costs can be tracked against budgets; provider charges appear in Billing History for monthly reconciliation. | Office/admin | Run report → match order IDs to jobs → reconcile against bill | S-MEASUREMENTS-007, S-MEASUREMENTS-006 |
| Report data payload | Aerial reports delivered into the platform include high-resolution imagery, 3D diagrams, length/area/pitch values, and color-coded length diagrams covering ridges, hips, valleys, rakes, eaves, drip edge, flashing, step flashing, and parapet walls, plus provider waste calculations. | Estimator | Open report from job → read diagrams/tables | S-MEASUREMENTS-001 |
| Measurements → estimate auto-population | Choosing an estimate template pulls the job's measurements (and customer data) in automatically; integrated supplier catalogs compute material quantities from those dimensions. Estimate line items carry a distinct `measurementQuantity` alongside estimated and ordered quantities, plus a per-line `waste` value. Templates can auto-set labor rates from roof pitch (Spring-2026). | Estimator | New estimate → pick template → quantities prefill from measurements → tune waste/labor | S-MEASUREMENTS-021, S-MEASUREMENTS-022, S-MEASUREMENTS-029, S-MEASUREMENTS-031 |
| Waste factor engine | Waste percentages are pre-settable and adjustable per material type / per line item; the engine grosses up measured quantities by the chosen waste so estimates and orders always include overage. Provider reports additionally ship their own waste calculations. | Estimator | Set default waste → per-line override → quantities recompute | S-MEASUREMENTS-015, S-MEASUREMENTS-020, S-MEASUREMENTS-022, S-MEASUREMENTS-001 |
| Measurements → material orders | The same measurements + waste factor auto-populate supplier orders (ABC Supply, SRS, QXO), so ordered quantities trace back to the report rather than re-typed numbers. | Office, production | Estimate/order → quantities carried from measurements+waste → submit to branch | S-MEASUREMENTS-020, S-MEASUREMENTS-023 |
| Mobile (Field App) measurement ops | From the job's activity view on mobile, reps order EagleView or GAF QuickMeasure reports or enter measurements manually; finished reports auto-attach to the job. Ordering also cited for the Field App generally. | Field sales | Job on phone → Measurements "+" → order or enter | S-MEASUREMENTS-024, S-MEASUREMENTS-001 |
| Public API: manual measurement ingest | `POST /api/v2/jobs/{jobId}/measurements` accepts a JSON file of measurement sets covering roofing fields (steep/low-slope areas, perimeter, ridges, hips, valleys, rakes, eaves, drip edge, flashing, step flashing, parapets, penetrations/obstructions area+perimeter, primary pitch, additionalPitches, pitchBreakdown array of pitch→value) and siding/wall fields (wallArea, window/door area+perimeter, top/bottom of walls/siding/masonry, inside/outside and obtuse corner counts, masonry corners). Returns 202 with a `measurementOrderId`. Four vendor recipes cover steep-slope, low-slope, siding, and combined payloads; exact field-name casing and an array wrapper are required. | Integrators | Build JSON per recipe → POST → 202 + order id | S-MEASUREMENTS-016, S-MEASUREMENTS-018, S-MEASUREMENTS-019 |
| Public API: external-provider order ingest | `POST /api/v2/jobs/{jobId}/measurements/files` registers a completed third-party measurement order against a job: provider enum (`Unknown`, `Hover`, `RoofSnap`, `External`), provider order id (≤40 chars), description (≤500), required latitude/longitude, optional measurements file (XML or JSON), optional report PDF + up to 10 misc PDFs, optional 3D-model URL, ordered/completed UTC timestamps. Filenames are sanitized (spaces/special chars stripped). Returns 202 with `measurementOrderId`. | Integrators | Assemble multipart payload → POST → order appears on job | S-MEASUREMENTS-017, S-MEASUREMENTS-019 |

## Key workflows

1. **Order-to-estimate (native provider).** Rep opens the job (or dashboard shortcut) and
   orders an EagleView / QuickMeasure / Geospan report: choose report type (buildings/roof
   options or gPro vs gProXPress), add instructions, verify the map pin on the address,
   submit [S-MEASUREMENTS-002][S-MEASUREMENTS-006]. The order shows on the Measurement
   Providers tracking page (Requested → Ordered → Completed) and a notification fires when
   the report lands in the job file [S-MEASUREMENTS-003][S-MEASUREMENTS-006]. Rep starts an
   estimate from a template; roof quantities prefill from the report, waste factors gross
   them up, and pitch can drive labor rates — no manual transcription
   [S-MEASUREMENTS-021][S-MEASUREMENTS-022][S-MEASUREMENTS-031]. A customer confirms the
   value: "I like the integration of the hover app and eagleview features in order to build
   estimates faster and more accurately." — Kevin G., Project Consultant, Capterra review,
   Nov 2025 [S-MEASUREMENTS-027].
2. **Status-triggered field capture (Hover).** Admin maps an AccuLynx job status/milestone
   to Hover. When a job reaches it, a capture request auto-issues to the assigned rep with
   job identifiers and address; the rep photographs the property via Hover. On completion,
   XML, PDFs, inspection Q&A, tagged photos, and a 3D-model link auto-import and fan out to
   the job's Measurements, Documents (Roof Reports), and Photos areas; the 3D link is
   shareable with the homeowner [S-MEASUREMENTS-010][S-MEASUREMENTS-011]. If the connection
   isn't enabled, the fallback is exporting Hover XML and using Upload XML on the job
   [S-MEASUREMENTS-012].
3. **Measurements to materials.** The measurement set (from report, XML, or manual entry),
   grossed up by per-material waste, auto-populates both the estimate and the supplier
   order, so the ABC/SRS/QXO branch receives quantities derived from the report; line items
   retain measured vs estimated vs ordered quantities separately
   [S-MEASUREMENTS-020][S-MEASUREMENTS-023][S-MEASUREMENTS-029].
4. **Spend control.** Office staff reconcile measurement purchasing monthly: provider
   charges appear on the AccuLynx bill (QuickMeasure/Geospan orders are billed through the
   platform without separate provider accounts), and a reconciliation report ties each
   measurement order ID back to its job for budget tracking
   [S-MEASUREMENTS-005][S-MEASUREMENTS-006][S-MEASUREMENTS-007].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **MeasurementOrder** — id (returned by both public POST endpoints), provider
  (EagleView / QuickMeasure / Geospan native; enum `Unknown|Hover|RoofSnap|External` in the
  public API), provider order id, description, latitude/longitude, orderedDate,
  completedDate, status (Requested / Ordered / Completed), 3D-model URL
  [S-MEASUREMENTS-006][S-MEASUREMENTS-016][S-MEASUREMENTS-017]
- **Measurement set** — roofing fields (areas, linear features, penetrations, pitch,
  pitchBreakdown) and siding/wall fields (areas, corners, tops/bottoms, masonry)
  [S-MEASUREMENTS-016][S-MEASUREMENTS-018]
- **Job** (parent record; all reports file to it) [S-MEASUREMENTS-002][S-MEASUREMENTS-003];
  **Document** (report PDFs, XML — incl. a Roof Reports folder) and **Photo/Video**
  (provider photos with notes/tags) [S-MEASUREMENTS-011][S-MEASUREMENTS-013]
- **Estimate / EstimateSectionItem** — measurementQuantity, quantity, orderQuantity, waste
  per line [S-MEASUREMENTS-029]; **Material order** quantities derived from measurements +
  waste [S-MEASUREMENTS-020]
- **Notification / status events** (report-ready alerts) [S-MEASUREMENTS-003][S-MEASUREMENTS-004];
  **Billing entries** (per-order charges in Billing History) [S-MEASUREMENTS-006];
  **Role permissions** (per-role enablement of ordering, observed for Geospan)
  [S-MEASUREMENTS-006]

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **No public read API.** The public API exposes only the two measurement POST endpoints —
  no GET for measurement sets or orders [S-MEASUREMENTS-019] — so the stored/serving schema,
  units, and rounding behavior are unobservable.
- **Template↔measurement mapping mechanics.** How estimate templates bind measurement
  fields to line-item quantities (formula language? fixed field→SKU mapping? unit
  conversions from squares to bundles/rolls?) is not publicly documented; only the outcome
  (auto-population) is.
- **Waste precedence.** Provider reports ship their own waste calculations
  [S-MEASUREMENTS-001] and AccuLynx applies user-set waste percentages
  [S-MEASUREMENTS-020]; which wins, and whether suggested-waste tables from reports are
  selectable, is unknown.
- **EagleView specifics in-app.** The exact EagleView catalog exposed (which report
  products/delivery speeds), whether EagleView billing runs through AccuLynx or the
  contractor's own EagleView account (credential validation is required
  [S-MEASUREMENTS-001], unlike QuickMeasure/Geospan), and price pass-through/markup.
- **Failure paths.** Statuses beyond Requested/Ordered/Completed (rejected address,
  provider failure, cancellation, refund handling) are undocumented.
- **Multiple measurement sets per job.** How several reports/versions coexist, which set an
  estimate consumes, and whether imported values can be edited after ingest.
- **Manual-entry form scope.** Whether the UI manual-entry fields mirror the API taxonomy
  [S-MEASUREMENTS-016] (INFERENCE: likely, given the shared "measurement set" model, but
  unverified).
- **Access limitations this pass:** the public Zendesk knowledge base
  (support.acculynx.com) returned HTTP 403 to our fetcher — only search-snippet content
  (e.g., the "Measurements: Entering, Uploading & Ordering" training video title and the
  QuickMeasure article summary) could be used [S-MEASUREMENTS-028]; YouTube watch pages
  remain bot-checked, so no URL+timestamp UI walkthrough references are logged for this
  module yet.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

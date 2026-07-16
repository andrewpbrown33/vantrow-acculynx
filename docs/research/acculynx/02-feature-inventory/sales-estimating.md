# Module: Sales & Estimating

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/sales-estimating.md` (IDs `S-SALES-ESTIMATING-###`).

## Purpose

This module takes a measured roof (or other exterior trade) and turns it into a priced,
customer-facing, signable offer. A contractor picks a reusable estimate template, pulls in
aerial measurements and live supplier pricing, tunes waste/margin/overhead/tax, and then
packages one or more estimates into a branded proposal that the homeowner e-signs — with
payment collection and consumer financing offered inside the same flow. The signed estimate
then becomes the seed for downstream material orders and job-costing worksheets
[S-SALES-ESTIMATING-001][S-SALES-ESTIMATING-003][S-SALES-ESTIMATING-015][S-SALES-ESTIMATING-004].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Estimate builder | Estimates built on desktop, tablet, or phone; start from a saved company template or blank. Line items grouped into sections; supports labor and additional trades per line. | Sales rep, estimator | Open job → new estimate → template or blank → edit lines → save | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-003, S-SALES-ESTIMATING-018 |
| Estimate templates | Frequently used estimates saved as reusable templates, chosen by job type; a template library exists per company. Templates can auto-calculate labor rates from roof pitch (Spring-2026 addition). | Admin (create), sales rep (consume) | Build estimate → save as template → reuse; configure pitch-based labor rates on template | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-003, S-SALES-ESTIMATING-009, S-SALES-ESTIMATING-012 |
| Aerial measurement import | Connectors for EagleView, Hover, GeoSpan, GAF QuickMeasure, RoofSnap (RoofScope also reported) order reports and auto-populate measurement quantities into the job file and estimate lines. | Sales rep | Order report from job → report lands in job → quantities flow into estimate | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-003, S-SALES-ESTIMATING-016 |
| Supplier catalogs & account pricing | Live product catalogs from ABC Supply, SRS Distribution, and QXO with the contractor's own negotiated branch pricing, refreshed daily; real-time availability shown so substitutes can be proposed. | Estimator, office | Connect supplier account → catalog items appear in estimating with account prices | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-015 |
| Line-item model | Items typed as SKU, Product, CustomSKU, Labor, or SKUAndLabor; each carries material cost, labor cost, waste, an estimate unit and an order unit with a conversion factor, override name, and a fixed-price flag (fixed vs calculated pricing). Quantity is tracked separately as measured, estimated, and ordered. | Estimator | Add item → set quantity/waste/unit → price computes or is fixed | S-SALES-ESTIMATING-007 |
| Waste factors | Waste percentage adjustable per individual line item / material type. | Estimator | Edit line → set waste % | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-016 |
| Margin, overhead, tax, discount controls | Desired profit margin set with a slider; estimate financials carry tax rate/total, overhead rate/total, profit rate/total, total cost, and total price. Discounts can be applied. Lump-sum presentation can hide/remove the tax line (Spring-2026). | Estimator, manager | Set margin/overhead/tax → totals recompute → optional lump-sum display | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-006, S-SALES-ESTIMATING-009, S-SALES-ESTIMATING-018 |
| Multiple estimates per job; primary flag | A job holds many estimates; one is flagged primary (`isPrimary` in the public API) and drives downstream financials. | Sales rep | Create alternates → mark one primary | S-SALES-ESTIMATING-005, S-SALES-ESTIMATING-006 |
| Good/Better/Best proposals | SmartDocs smart fields can pull values from multiple estimates (not just the primary), so one branded proposal presents tiered options. A third-party review states the tier the homeowner signs determines the material list feeding the purchase order. | Sales rep | Build 3 estimates → one proposal with per-tier fields → homeowner signs chosen tier | S-SALES-ESTIMATING-009, S-SALES-ESTIMATING-012, S-SALES-ESTIMATING-021 |
| SmartDocs templates (paid add-on) | Document-automation add-on: existing paper/OEM documents converted into digital templates via a drag-and-drop editor; smart fields auto-fill customer name/address, estimate and contract totals, and other job-record data. Third-party reviews confirm it is priced separately from the base subscription. | Admin (template setup), sales rep | Upload/convert doc → place smart fields → generate per-job in seconds | S-SALES-ESTIMATING-002, S-SALES-ESTIMATING-016, S-SALES-ESTIMATING-018, S-SALES-ESTIMATING-019 |
| Document types | Proposals, contracts, change orders, lien waivers, warranties, estimates, customer surveys are all cited as SmartDocs-generated document types. | Sales rep, office | Pick template type → generate | S-SALES-ESTIMATING-002, S-SALES-ESTIMATING-019 |
| Document packets | Multiple pieces (cover page, company info, photos, aerial measurement report, estimates, contract) combined into one packet; pages can be grouped/reordered; previewable and shareable via secure web link by email or text before requesting signature. Packet building also works in the mobile app. | Sales rep | Assemble packet → preview link → send for signature | S-SALES-ESTIMATING-002 |
| E-signature | Remote signing from an emailed link on any device, or in-person on the rep's phone/tablet; both described as legally binding. Signature log captures name, email, date, time, IP. Automated signature reminders and expiration dates can be set per document. Signed copies auto-return to both parties and auto-file into the job. Vendor cites an "ESign Live" partnership for encryption. | Sales rep, homeowner | Send → homeowner reviews/signs → notification → auto-filed copy each side | S-SALES-ESTIMATING-002, S-SALES-ESTIMATING-011, S-SALES-ESTIMATING-012, S-SALES-ESTIMATING-019 |
| Mobile estimating (Field App) | Full estimate authoring on mobile (Fall-2025): start blank or from template, organize by trade, add materials/labor/pricing, calculate taxes, set profit margin, send from the job site; signatures collectable in the field. | Sales rep, foreman | On-site: build → price → send/sign without returning to office | S-SALES-ESTIMATING-003, S-SALES-ESTIMATING-010 |
| Estimate → material order | A (signed) estimate converts to a supplier material order in a few clicks, with products/quantities carried over, and submits directly to the ABC/SRS/QXO branch — no re-keying. | Office, production | Convert estimate → review order → submit to branch | S-SALES-ESTIMATING-015 |
| Estimate → financial worksheet | The primary estimate syncs its line items into the job's financial worksheet (one worksheet per job), establishing approved job value; later changes are made as annotated amendments (change orders, discounts, supplements) or direct edits; worksheets can require approval and generate invoices, syncing to QuickBooks/Sage Intacct. | Office, manager | Sync primary estimate → approve (or submit for approval) → amend over job life | S-SALES-ESTIMATING-004 |
| In-estimate financing (AccuFi) | Financing offers presented from the estimate or invoice via the Acorn Finance lending marketplace (12+ lenders): homeowner completes a pre-qualification form with no credit-score impact, sees pre-qualified loan options immediately, and can be approved/funded as soon as same business day; application status tracked in-platform; no contractor fees claimed. | Sales rep, homeowner | Present offer during estimate review → pre-qual → select loan → funded | S-SALES-ESTIMATING-001, S-SALES-ESTIMATING-013 |
| Payments in the sales flow (AccuPay) | Card, eCheck, and ACH payment requests launched from the job file, main dashboard, or contract worksheet; homeowner pays via emailed self-service link or the contractor keys the payment; payments auto-apply to the job. Permission-gated. | Office, sales rep | Request payment → homeowner pays online → auto-applied to job | S-SALES-ESTIMATING-014, S-SALES-ESTIMATING-001 |
| Customer portal (add-on) | Homeowners self-serve: view project details, make payments, explore financing, exchange messages. | Homeowner | Portal invite → view/pay/finance | S-SALES-ESTIMATING-018 |
| Role-based permissions | Permission sets differ by role (owner, manager, sales rep, office staff); admins can reassign roles/permissions at any time; document settings are configurable; worksheet approval is permission-gated. | Admin | Assign role → adjust permissions | S-SALES-ESTIMATING-004, S-SALES-ESTIMATING-020 |
| Public REST API for estimates | Read-only estimate access via `GET /api/v2/estimates`, per-job estimates, and estimate → sections → items traversal, with paging and `includes` expansion (job, createdBy, modifiedBy, sections). | Integrators | API key → list/fetch estimates | S-SALES-ESTIMATING-005, S-SALES-ESTIMATING-006, S-SALES-ESTIMATING-008 |

## Key workflows

1. **Measurement to signed proposal.** Rep orders an aerial measurement report from the job
   file; the report and customer data auto-populate a template-based estimate; material lines
   price from the supplier catalog at account rates with quantities computed from
   measurements; rep adjusts waste per line, labor, overhead, and margin (slider), applies
   tax/discounts, and saves [S-SALES-ESTIMATING-001][S-SALES-ESTIMATING-003]. The estimate is wrapped in a branded SmartDocs
   proposal or packet (cover page, photos, measurement report, estimate), previewed via web
   link, and sent by email/text for e-signature; signing triggers notifications and auto-files
   the executed copy to the job [S-SALES-ESTIMATING-002][S-SALES-ESTIMATING-011].
2. **Good/Better/Best sale.** Rep builds three estimates on one job with different material
   specs; a single proposal template uses multi-estimate smart fields to show all three tiers;
   the homeowner e-signs the chosen tier, and (per third-party reporting) that tier's material
   list feeds the purchase order [S-SALES-ESTIMATING-009][S-SALES-ESTIMATING-021]. Before this Spring-2026 capability, at least
   one customer publicly asked for in-estimate selectable options: "You cannot do selections in
   the estimate. It should be able to have options that tally up a total." — Grant R., VP
   Sales, Capterra review, Apr 2026 [S-SALES-ESTIMATING-017].
3. **Template administration.** Admin converts the company's existing paper/PDF documents into
   SmartDocs templates in a drag-and-drop editor, placing smart fields that pull name, address,
   estimate/contract totals from the job record; estimate templates are likewise saved from
   frequently used estimates and can embed pitch-based labor rate rules, so future estimates
   start pre-priced [S-SALES-ESTIMATING-002][S-SALES-ESTIMATING-009][S-SALES-ESTIMATING-012][S-SALES-ESTIMATING-019].
4. **Estimate to money.** The signed/primary estimate (a) converts to a supplier material
   order submitted directly to an ABC/SRS/QXO branch [S-SALES-ESTIMATING-015], and (b) syncs line items into
   the job's financial worksheet where value is approved (or routed for approval), later
   changes ride as amendments, and invoices/payment requests (AccuPay) and financing (AccuFi)
   complete collection [S-SALES-ESTIMATING-004][S-SALES-ESTIMATING-013][S-SALES-ESTIMATING-014]. A customer confirms the linkage: "Estimates and
   worksheets can link making it easier for invoicing." — Angel C., Office Manager, Capterra
   review, Nov 2025 [S-SALES-ESTIMATING-017].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **Estimate** — title, description, estimateNumber, isPrimary, notes, created/modified audit,
  profitMarginRate/Total, financials (taxRate/Total, overheadRate/Total, profitRate/Total,
  totalCost, totalPrice) [S-SALES-ESTIMATING-006]
- **EstimateSection → EstimateSectionItem** — name/overrideName, type (SKU | Product |
  CustomSKU | Labor | SKUAndLabor), materialCost, laborCost, waste, estimateUnit/orderUnit/
  unitConversion/selectedUnit, fixedPrice, price, quantity, measurementQuantity,
  orderQuantity [S-SALES-ESTIMATING-005][S-SALES-ESTIMATING-007]
- **Job** (parent of estimates; approved value) [S-SALES-ESTIMATING-004][S-SALES-ESTIMATING-006]; **Measurement report**
  (imported quantities) [S-SALES-ESTIMATING-001][S-SALES-ESTIMATING-003]
- **Supplier catalog item / account price** (daily-refreshed) [S-SALES-ESTIMATING-015]; **Material order**
  (converted from estimate) [S-SALES-ESTIMATING-015]
- **Document template / document / packet**; **Signature record** (name, email, date, time,
  IP; reminder + expiration settings) [S-SALES-ESTIMATING-002][S-SALES-ESTIMATING-011]
- **Financial worksheet + amendments**; **Invoice**; **Payment** (received/paid); **Financing
  application status** [S-SALES-ESTIMATING-004][S-SALES-ESTIMATING-005][S-SALES-ESTIMATING-013][S-SALES-ESTIMATING-014]
- **CompanyUser / role & permissions** [S-SALES-ESTIMATING-020]

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **Template internals.** How estimate templates encode quantity formulas from measurement
  fields, how pitch-based labor tables are structured, and whether templates support
  conditional/optional line groups.
- **Margin/permission granularity.** Whether margin can be overridden per line item vs whole
  estimate; which roles can see cost vs price vs margin (role permissions exist [S-SALES-ESTIMATING-020], but
  the specific cost-visibility toggles are not publicly documented).
- **Estimate lifecycle.** Status values (draft/sent/viewed/approved/expired) are not exposed in
  the public API schema [S-SALES-ESTIMATING-006][S-SALES-ESTIMATING-008]; approval-state mechanics are unknown.
- **SmartDocs editor specifics.** Field types, conditional logic, pricing-table elements,
  multi-signer routing/counter-signature ordering, and the add-on's price [S-SALES-ESTIMATING-016 confirms
  "paid add-on" only].
- **GBB automation depth.** The signed-tier → purchase-order claim comes from one third-party
  review [S-SALES-ESTIMATING-021]; whether it is fully automatic or user-confirmed is unverified.
- **Discount modeling** (line-level vs total-level) and how sales-tax jurisdictions are
  managed (a reviewer complains tax handling is weak [S-SALES-ESTIMATING-017 context]).
- **Access limitations this pass:** the in-app Knowledge Base sits behind product access and
  was not crawled (protocol: no auth surfaces); YouTube demo pages returned a bot-check
  interstitial, so no timestamped UI walkthroughs are cited yet — a future pass with working
  video access should add URL+timestamp references for the estimate editor and SmartDocs
  editor.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

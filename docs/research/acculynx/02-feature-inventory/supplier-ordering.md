# Module: Supplier Ordering

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/supplier-ordering.md` (IDs `S-SUPPLIER-ORDERING-###`).

## Purpose

This module closes the gap between selling a roof and getting shingles on a truck: it pulls a
distributor's product catalog, branch stock, and the contractor's own account pricing into the
estimating tool, converts an approved estimate's line items into a digital purchase order,
submits that order electronically to a chosen distributor branch, and then tracks the order —
status changes, delivery date, proof-of-delivery photos, and eventually the supplier invoice —
inside the job file [S-SUPPLIER-ORDERING-001][S-SUPPLIER-ORDERING-004][S-SUPPLIER-ORDERING-016].
AccuLynx maintains direct integrations with the three dominant US roofing distributors — ABC
Supply, SRS Distribution, and QXO (formerly Beacon Building Products) — and a third-party
buyer's guide calls it the only roofing CRM natively connected to all three
[S-SUPPLIER-ORDERING-016]. Scale signals: by mid-2019 average ABC order size through the
integration was ~3x historical [S-SUPPLIER-ORDERING-009]; by 2021 AccuLynx reported millions of
dollars of SRS product processed weekly through the platform [S-SUPPLIER-ORDERING-010]. Third
parties describe this ordering loop as AccuLynx's main switching-cost moat
[S-SUPPLIER-ORDERING-017].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Three distributor integrations | Direct connections to ABC Supply (via its myABCsupply platform), SRS Distribution (via its Roof Hub ordering system), and QXO/ex-Beacon (via the Beacon PRO+ / QXO account system). Each brings catalog, contractor-specific pricing, ordering, and status callbacks in-app. ABC is the oldest (pre-2019); SRS launched Mar 2021; Beacon launched May 2022 and was rebranded QXO. | Estimator, production, office | Enable per supplier → use inside estimates/orders | S-SUPPLIER-ORDERING-001, 002, 003, 006, 007, 009, 016 |
| Integration activation & branch setup | An administrator-role user enables a supplier from an "Add-On Features and Integrations" page, authenticates with the contractor's supplier account credentials (a Beacon PRO+/QXO account is required for QXO), then selects a default branch and confirms any additional branches to order from. Third party notes setup requires configuration, not automatic. | Admin | Add-ons page → enable → enter supplier credentials → pick default branch → confirm other branches | S-SUPPLIER-ORDERING-006, 007, 008, 017 |
| Account price-list sync | The contractor's own negotiated account pricing at a specific branch flows into AccuLynx; marketing describes real-time transmission, one AccuLynx page says pricing is refreshed daily to pick up changes and catalog additions. The ABC help article describes the branch sending real-time pricing for "estimates and order forecasting". Third-party caveat: specially negotiated per-SKU deals may not auto-populate and need rep coordination. | Estimator, office | Link account → branch pricing appears on catalog items in estimates/orders | S-SUPPLIER-ORDERING-001, 004, 016, 018, 020 |
| Live catalog & stock availability | Browse the supplier's product catalog inside AccuLynx and see what is in stock at the preferred branch while estimating, so the estimate only contains obtainable products at correct prices. Customer testimonial: "being able to see exactly what products are in stock at a particular branch, along with our QXO account pricing, has made it so much easier to create an accurate estimate quickly." | Estimator, sales | Open estimate → search catalog → see branch stock + price | S-SUPPLIER-ORDERING-001, 003, 019, 020 |
| Purchase-history recommendations (SRS) | The SRS integration suggests products and colors based on the contractor's past purchases to speed up order building. | Estimator, production | Build order → accept suggested products/colors | S-SUPPLIER-ORDERING-002 |
| Estimate templates + custom materials library | Reusable estimating templates hold frequently ordered items and auto-calculate quantities and per-line waste factors; templates re-price from current supplier account pricing. AccuLynx trainers recommend 2–3 templates per trade. A "custom materials library" (contractor-defined items) is included at every plan tier. | Estimator, admin (author) | Build template once → reuse per job → prices refresh automatically | S-SUPPLIER-ORDERING-004, 008, 011, 020, 023, 027 |
| Estimate → material order conversion | One-click conversion of an approved/signed estimate into a digital material order carrying the same supplier products and quantities — no re-keying between systems ("the same line items on the estimate become the order"). | Estimator, production | Estimate approved → convert → review → submit | S-SUPPLIER-ORDERING-001, 003, 016 |
| Order from order template | Orders can alternatively be built from a saved order template rather than from an estimate (e.g., standard load-outs). | Production, office | Pick template → adjust quantities → submit | S-SUPPLIER-ORDERING-008 |
| Electronic order submission w/ attachments | Submit the order to the selected supplier branch directly from AccuLynx (replacing phone/fax/email ordering), optionally attaching related documents. On submission the supplier's branch, sales rep, branch manager, and distribution center are automatically notified. | Production, office | Review order → attach docs → submit to branch → supplier-side notifications fire | S-SUPPLIER-ORDERING-001, 004, 006, 008, 019 |
| Order status tracking in the job file | Real-time order status updates from the supplier land in the AccuLynx job file; blog copy names states such as pending / in progress / completed, and the Order Manager distinguishes scheduled vs unscheduled orders. Trackable from office or field. | Production, office, sales | Submit → watch status change → react to delays | S-SUPPLIER-ORDERING-002, 003, 006, 015, 023 |
| Delivery dates & milestone notifications | Orders carry a delivery date that syncs onto the production calendar; users are notified when it changes. Spring 2025 added automated notifications at delivery milestones for ABC orders. | Production | Set/receive delivery date → calendar event → change alerts | S-SUPPLIER-ORDERING-004, 005, 013, 015 |
| Proof-of-delivery photos | When the supplier delivers, photos documenting the delivery are automatically filed into the job's Documents page — a persistent evidence trail against short/wrong deliveries. | Production, office, crew | Delivery occurs → POD photos auto-attach to job | S-SUPPLIER-ORDERING-001, 002, 003, 013, 019 |
| Order Manager | Operations console listing every order as a card grouped under its status; sort/filter/search (e.g., by approved-job age, orders missing a date assignment, orders where money is already collected); quick edits; bulk actions including placing multiple material orders at once; alerts on scheduling conflicts. | Production manager | Open Order Manager → filter → edit/bulk-place/reschedule | S-SUPPLIER-ORDERING-004, 005, 015 |
| Material ↔ labor order linking | A material order ticket shows contact info, supplier, delivery date, instructions, the material list, documents/photos, and checklists; it cross-links to the related labor order (and vice versa) so crew scheduling and material arrival stay coordinated. | Production manager | Open either ticket → jump to linked counterpart | S-SUPPLIER-ORDERING-005 |
| Order automations | Automation Manager "order triggers" fire on order created, order status change, and order filled; actions are templated email, assigned task (with due date), or SMS with personalization tags — e.g., auto-task the production manager to schedule labor once materials are confirmed. | Admin (config), production (benefit) | Pick order trigger → pick action/recipient → enable | S-SUPPLIER-ORDERING-014 |
| Mobile surfaces | Fall 2025 Field App builds complete estimates (materials, labor, pricing) on mobile, feeding the ordering pipeline; the Crew App shares material orders with field crews so they can verify a delivery against the list before starting work; a "Quick Order" capability is marketed for creating simple ABC Supply orders from any device direct to the local branch. | Sales (field), crew, production | Estimate/verify/order from phone | S-SUPPLIER-ORDERING-022, 025, 026 |
| Materials Report (ReportsPlus) | Pre-built, customizable report on material purchasing: total material cost, spend by material type, quantity, color, and supplier; filterable by location, supplier, and product/brand. Used to forecast needs, pre-buy, and negotiate distributor pricing with hard spend data. | Owner, office, purchasing | Run report → filter → negotiate/forecast | S-SUPPLIER-ORDERING-004, 011, 012 |
| Supplier invoice visibility & accounting sync | Spring 2025 added ABC invoice data into Materials Reports for financial tracking; third-party reviews describe reconciling supplier invoices in-system and syncing job costs/material expenses to QuickBooks Online. | Office, bookkeeper | Invoice arrives on order → visible in reports → syncs to accounting | S-SUPPLIER-ORDERING-013, 016, 017 |
| Compliance warnings | California Proposition 65 warnings surface directly in AccuLynx for ABC Supply orders (Spring 2025). | Office, production | Order affected product → warning displayed | S-SUPPLIER-ORDERING-013 |
| Measurement-to-order pipeline | Aerial measurement reports (EagleView, GAF QuickMeasure) auto-populate estimates and material orders, so roof geometry drives material quantities without manual entry. | Estimator | Order measurement → quantities populate estimate → order inherits them | S-SUPPLIER-ORDERING-022 |
| Plan gating | "Supplier direct ordering" and the custom materials library are listed on all three plan tiers, including Essential ($250/mo); a third-party guide confirms no separate add-on fee for supplier connections. (The broader Production Tools suite launched Elite-only in 2019 — see Unknowns for the current entitlement boundary.) | Buyer, admin | Any tier → ordering included | S-SUPPLIER-ORDERING-015, 016, 027 |

## Key workflows

1. **Enable a supplier (one-time, per company).** An admin opens the add-on/integrations page,
   enables the distributor, and authenticates the company's supplier account (QXO requires a
   Beacon PRO+/QXO account; ABC uses the myABCsupply relationship). The admin sets a default
   branch and confirms any other branches the company buys from; from then on that branch's
   catalog, stock, and the company's account pricing are available in estimating and ordering
   [S-SUPPLIER-ORDERING-006][S-SUPPLIER-ORDERING-007][S-SUPPLIER-ORDERING-008][S-SUPPLIER-ORDERING-016].
2. **Measurement → estimate → order → delivery (the core loop).** An aerial measurement report
   populates quantities into an estimate [S-SUPPLIER-ORDERING-022]; the estimator builds from a
   template whose supplier items carry live branch pricing, stock visibility, and per-line waste
   factors [S-SUPPLIER-ORDERING-004][S-SUPPLIER-ORDERING-020]. After the homeowner signs, the
   estimate converts to a material order with the same line items, gets supporting documents
   attached, and is submitted electronically to the preferred branch
   [S-SUPPLIER-ORDERING-001][S-SUPPLIER-ORDERING-008][S-SUPPLIER-ORDERING-016]. The supplier's
   branch/rep/manager/distribution center are notified automatically [S-SUPPLIER-ORDERING-004];
   status updates stream back into the job file; the delivery date lands on the production
   calendar; proof-of-delivery photos auto-file into job Documents on delivery; and (for ABC)
   invoice data flows into reporting, with expenses syncable to QuickBooks
   [S-SUPPLIER-ORDERING-005][S-SUPPLIER-ORDERING-013][S-SUPPLIER-ORDERING-016].
3. **Working in-flight orders.** The production manager lives in the Order Manager: cards grouped
   by status, filtered (e.g., orders with no date assigned, or jobs where money is collected but
   materials aren't ordered), bulk-placing or bulk-rescheduling orders, and following links
   between a material order and its labor order to keep crew and materials aligned
   [S-SUPPLIER-ORDERING-004][S-SUPPLIER-ORDERING-005][S-SUPPLIER-ORDERING-015]. Automations
   remove polling: when an order is created, changes status, or is filled, rules email/text the
   right people or task the production manager to schedule labor [S-SUPPLIER-ORDERING-014].
   Crews receive the material list in the field and verify the delivery against it before work
   begins [S-SUPPLIER-ORDERING-022].
4. **Spend analysis → negotiation.** Office/ownership runs the Materials Report, slicing spend by
   material type, quantity, color, supplier, location, and product/brand; the output is used to
   forecast upcoming material needs, pre-order ahead of price moves, and negotiate account
   pricing with distributors from documented volume
   [S-SUPPLIER-ORDERING-011][S-SUPPLIER-ORDERING-012][S-SUPPLIER-ORDERING-004].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **SupplierIntegration config** — supplier identity, account credentials/auth token, default
  branch, additional confirmed branches, enabled flag (admin-scoped)
  [S-SUPPLIER-ORDERING-006][S-SUPPLIER-ORDERING-008].
- **Supplier catalog items** — product/SKU, description, color, unit, branch-level stock
  availability [S-SUPPLIER-ORDERING-001][S-SUPPLIER-ORDERING-020].
- **Account price list** — contractor-and-branch-specific prices, refreshed daily/real-time
  [S-SUPPLIER-ORDERING-004][S-SUPPLIER-ORDERING-016].
- **Estimates & line items; estimate/order templates; custom materials library entries**
  [S-SUPPLIER-ORDERING-020][S-SUPPLIER-ORDERING-027].
- **Material order** — job link, supplier + branch, contact info, delivery date, instructions,
  material line items (product, quantity, price), attachments, checklist; link to labor order
  [S-SUPPLIER-ORDERING-005][S-SUPPLIER-ORDERING-008].
- **Order status events** — supplier callbacks (status, delivery milestones)
  [S-SUPPLIER-ORDERING-003][S-SUPPLIER-ORDERING-013].
- **Delivery artifacts** — proof-of-delivery photos filed as job documents
  [S-SUPPLIER-ORDERING-002].
- **Supplier invoices** — ABC invoice data surfaced in Materials Reports; expense records synced
  to QuickBooks [S-SUPPLIER-ORDERING-013][S-SUPPLIER-ORDERING-016].
- **Automation rules** — order-event triggers and actions [S-SUPPLIER-ORDERING-014].
- **Calendar events** — material delivery entries on the production calendar
  [S-SUPPLIER-ORDERING-005][S-SUPPLIER-ORDERING-015].
- **Report aggregates** — Materials Report dimensions (type, quantity, color, supplier, location,
  brand) [S-SUPPLIER-ORDERING-011].
- **Not in the public API**: the REST v2 docs expose no endpoints for material orders, suppliers,
  products, or price lists — this module has no public programmatic surface
  [S-SUPPLIER-ORDERING-024].

## Unknowns

- **Help-center detail is bot-blocked.** `support.acculynx.com` returns 403 to fetchers; only
  search snippets were usable [S-SUPPLIER-ORDERING-018]. Exact setup screens, field-level order
  forms, validation, and error handling are unknown — design our own.
- **Exact order status lifecycle.** Public copy names pending / in progress / completed and
  scheduled/unscheduled, but the full status enum per supplier, and whether statuses differ by
  distributor, is unverified. Define our own canonical order state machine.
- **Price-sync mechanics.** Marketing claims both "real-time" and "updated daily"; push vs pull,
  caching, and how price changes affect already-built estimates/orders are unknown. Known gap to
  exploit: specially negotiated per-SKU pricing may not auto-populate [S-SUPPLIER-ORDERING-016].
- **Order amendment lifecycle.** No public evidence on editing/canceling a submitted order,
  partial deliveries, backorders, returns/restocking, or reorder-from-history flows.
- **Commercial/technical basis of the distributor connections.** These are partner-agreement
  integrations (per protocol §8 ours must be described as "designed to integrate with" until
  agreements exist); the API contracts, revenue arrangements, and exclusivity terms are private.
- **PO numbering & job-costing linkage.** How supplier order/PO numbers map to invoices,
  commitments vs actuals, taxes, and delivery fees is not publicly documented.
- **Non-integrated supplier ordering.** Order tickets carry a generic supplier field
  [S-SUPPLIER-ORDERING-005]; INFERENCE: orders for non-integrated suppliers are likely printed or
  emailed manually (launch copy contrasts integration with "printing or faxing")
  [S-SUPPLIER-ORDERING-006] — the actual send mechanism is unconfirmed.
- **Current tier boundary.** "Supplier direct ordering" is listed on all tiers today
  [S-SUPPLIER-ORDERING-027], but Production Tools (incl. Order Manager) launched Elite-only in
  2019 [S-SUPPLIER-ORDERING-015]; which order-management surfaces are gated per tier now is
  unclear.
- **Quick Order specifics.** The ABC "Quick Order" video page is bot-blocked
  [S-SUPPLIER-ORDERING-025]; whether it is a standalone lightweight flow or part of the Field App
  is unknown.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

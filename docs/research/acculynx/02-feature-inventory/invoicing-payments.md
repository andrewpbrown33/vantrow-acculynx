# Module: Invoicing & Payments

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/invoicing-payments.md` (IDs `S-INVOICING-PAYMENTS-###`).

## Purpose

This module turns an approved job value into collected cash: the job's single financial
worksheet (contract + amendments) is the source of truth, invoices are cut from it in
whole, in parts, or as an installment sequence, and each invoice starts an accounts-
receivable clock the moment it is sent [S-INVOICING-PAYMENTS-001][S-INVOICING-PAYMENTS-002]
[S-INVOICING-PAYMENTS-021]. An embedded processor add-on ("AccuPay", riding FIS/Worldpay
rails) collects card/debit/ACH payments through emailed links, phone entry, in-person
entry, or the customer portal, and auto-posts them to the job [S-INVOICING-PAYMENTS-003]
[S-INVOICING-PAYMENTS-004][S-INVOICING-PAYMENTS-005]. A financing add-on ("AccuFi",
brokered through the Acorn Finance multi-lender marketplace) lets homeowners pre-qualify
from an estimate or invoice with no credit-score impact [S-INVOICING-PAYMENTS-007]
[S-INVOICING-PAYMENTS-009]. Two-way QuickBooks (Online + Desktop) and Sage Intacct
integrations push customers/invoices out and pull payments back so accounting never
re-keys job data [S-INVOICING-PAYMENTS-010][S-INVOICING-PAYMENTS-012].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Financial worksheet as invoicing basis | One worksheet per job holds contract value plus typed amendments; a draft-approval step gates invoicing; the financials object exposes approved job value, per-section totals (worksheet, change order, insurance claim, upgrade, discount, supplement, work-not-doing), and balance due. | Office, manager (approve) | Build worksheet → approve → invoice from it | S-INVOICING-PAYMENTS-021, S-INVOICING-PAYMENTS-018 |
| Four invoice-creation modes | (a) Invoice in full — pull the whole worksheet, items still editable; (b) partial import — pick worksheet sections via multi-select to bill smaller slices (e.g. materials only); (c) sequence — split approved job value into N equal installment invoices; (d) manual — type line descriptions with dollar values. | Office, PM | Open Invoice Worksheet → pick mode → edit → save | S-INVOICING-PAYMENTS-001, S-INVOICING-PAYMENTS-027 |
| Invoice metadata & terms | Each invoice carries a user-entered name, invoice date (billing start), payment terms producing a due date, plus system fields: invoice number, creation-order sequence, created date. | Office | Name → date → terms → due date derived | S-INVOICING-PAYMENTS-001, S-INVOICING-PAYMENTS-014 |
| Typed invoice sections & hierarchical line items | Invoice bodies are sectioned by origin type (public API enum: Invoice, Work Not Doing, Supplements, Discounts, Upgrades, Change Order, Financial Worksheet, Insurance Claim); items nest via parent references and sort order, reference catalog objects (enum: SKU, Product, CustomSKU, Labor, SKUAndLabor), and can carry a trade tag. | Office; integrators (read) | Sections mirror worksheet amendments → items priced per line | S-INVOICING-PAYMENTS-014 |
| Customer-facing preview & customization | Before sending, the sender sees the invoice as the customer will receive it and can rewrite item descriptions or adjust item values from the preview. | Office | Preview → edit descriptions/values → send | S-INVOICING-PAYMENTS-001 |
| Invoice delivery with embedded pay link | Invoices email to the customer with an online payment option; the pay link is bound to listed recipients and goes dead on a forwarded email, so the payer must be a direct recipient. | Office; homeowner | Add recipients → email → customer pays from link | S-INVOICING-PAYMENTS-001, S-INVOICING-PAYMENTS-003 |
| Invoice lifecycle & A/R aging | Invoice states (API enum): Draft, Unpaid, Paid, Void; each invoice tracks total price and its own balance due; A/R aging starts automatically when the invoice is sent; voiding emits an audit-oriented webhook (void date + user). | Office, owner | Draft → send (aging starts) → paid or void | S-INVOICING-PAYMENTS-014, S-INVOICING-PAYMENTS-002, S-INVOICING-PAYMENTS-020 |
| 2024 invoicing refresh | April 2024 release: reorganized financial/invoice page layouts, better drag-and-drop, a displayed amount-left-to-invoice per job, support for negative job values and edits to approved amendments; a summary box shows remaining-to-invoice, invoiced-to-date, collected, balance due, approved job value. | Office | Ongoing billing against a visible remaining balance | S-INVOICING-PAYMENTS-024, S-INVOICING-PAYMENTS-001 |
| AccuPay payment processing (add-on) | Embedded merchant processing for credit, debit, and ACH/e-check; positioned on FIS Global / Worldpay infrastructure; paid add-on with per-transaction fees deducted from the transaction, no monthly fee in months without transactions, and no volume/card/dollar caps. | Office, sales rep | Enable add-on → underwrite → collect in-app | S-INVOICING-PAYMENTS-003, S-INVOICING-PAYMENTS-004, S-INVOICING-PAYMENTS-005, S-INVOICING-PAYMENTS-026 |
| Payment request channels | Requests initiate from the job file, main dashboard, or contract worksheet; delivery paths: email link to a company-branded hosted payment page, staff keying card details taken by phone, in-person entry, or self-service through the customer portal; partial or full amounts requestable. | Office, sales rep; homeowner | Pick job → request amount → channel → homeowner pays | S-INVOICING-PAYMENTS-006, S-INVOICING-PAYMENTS-004, S-INVOICING-PAYMENTS-003 |
| Auto-posting & payment notifications | A completed AccuPay payment writes itself onto the job record (no re-keying) and fires a real-time in-app notification; payment status is visible in the job's financial worksheet area. | Office, sales rep | Payment clears → job updates → team notified | S-INVOICING-PAYMENTS-003, S-INVOICING-PAYMENTS-004 |
| Settlement timing | Marketing claims funds by next business day; the platform page states credit/debit averages 24–48 business hours and ACH/e-check 1–3 business days. | Owner, bookkeeper | Payment → batch → bank deposit | S-INVOICING-PAYMENTS-003, S-INVOICING-PAYMENTS-004 |
| Fee pass-through (surcharge / convenience fee) | Payment records carry structured surcharge-fee (amount, percentage, description) and convenience-fee (amount, description, source) objects plus a convenience-fee-refund object; marketing says line items can be added to invoices to pass fees to customers; Sage integration page advertises surcharge/convenience-fee options. | Admin (configure), office | Configure fee policy → fee rides on payment/invoice | S-INVOICING-PAYMENTS-015, S-INVOICING-PAYMENTS-003, S-INVOICING-PAYMENTS-012 |
| Three-category job payment ledger | Per job, payments split into Received Payments (money in: check number, payer, method, date, notes), Paid Payments (money out: reference number, payee, paid flag, account-type link), and Additional Expenses (transaction date, payee, paid flag); parent/sub-payment nesting; signed amounts allow negative adjustment entries; a `system` field marks records originated by AccuPay, QuickBooks Online/Desktop, or Sage Intacct. | Office, bookkeeper | Record money in/out/expenses → job-level P&L view | S-INVOICING-PAYMENTS-015, S-INVOICING-PAYMENTS-017 |
| Job payments overview | A per-job rollup exposes contracted sales amount, balance due, A/R age in days, and percent collected. | Owner, office | Glance at collection health per job | S-INVOICING-PAYMENTS-016 |
| Company-wide payment tracker & disputes | A tracking page lists all AccuPay activity — requested payments, amounts, processed status; disputes (chargebacks) are viewable and answerable in-app with documentation attachments; refunds, cancellations, and voids go through a merchant specialist. | Office manager, owner | Monitor requests → respond to disputes → escalate refunds | S-INVOICING-PAYMENTS-022, S-INVOICING-PAYMENTS-003 |
| A/R tracker | A receivables page breaks down invoiced-but-uncollected jobs, sortable by time since completion, and surfaces last customer contact and job notes for collections calls; dashboard tiles show invoiced vs collected revenue. | Owner, office manager | Sort aged A/R → call with context → collect | S-INVOICING-PAYMENTS-023, S-INVOICING-PAYMENTS-002 |
| AccuFi homeowner financing (add-on) | Financing brokered through Acorn Finance's marketplace of 12+ lenders; offered from the dashboard, job file, estimate, or invoice; homeowner submits a soft-pull pre-qualification (under a minute, no credit impact), gets a compared list of offers, then a short application; approval/funding as soon as same business day, funds landing in the homeowner's account 1–2 days after acceptance; no contractor fees or paperwork. | Sales rep; homeowner | Offer → pre-qualify → compare → apply → funded | S-INVOICING-PAYMENTS-007, S-INVOICING-PAYMENTS-008, S-INVOICING-PAYMENTS-009 |
| Financing status tracking & rep alerts | Loan application progress is tracked inside AccuLynx through funding; sales reps get email alerts at the pre-approval decision (offers presented or none) and when funds hit the customer's account. | Sales rep, office | Watch loan state → time the build/collection | S-INVOICING-PAYMENTS-007, S-INVOICING-PAYMENTS-008 |
| Earlier GreenSky financing integration | A prior integration placed an offer-financing control on the dashboard, job overview, and contract worksheet; homeowners got immediate credit decisions and chose among plans the contractor had opted to offer. INFERENCE: superseded by (or parallel to) AccuFi — current availability unverified. | Sales rep | Offer → instant decision → pick contractor-approved plan | S-INVOICING-PAYMENTS-006 |
| QuickBooks two-way sync | Supports QuickBooks Online and Desktop; completing a sale pushes customer/contact, job, contract, and invoice data into QuickBooks; payments recorded in QuickBooks flow back onto the AccuLynx job file; QBO syncs continuously in real time, Desktop uses the web-connector app (≈10-minute minimum cycles); Mac Desktop editions unsupported. | Bookkeeper (works in QB), office | Enable → sale pushes → accounting works in QB → payments pull back | S-INVOICING-PAYMENTS-010, S-INVOICING-PAYMENTS-011, S-INVOICING-PAYMENTS-023 |
| Accounting mapping & multi-location | Contract amounts can be itemized to accounting categories at configurable granularity (coarse trade buckets to specific product lines); QuickBooks Classes can split invoices by location/region/business type; AccuLynx surfaces only job-level financials (not company books), with permission controls limiting what reps see (e.g. profitability vs balance due). | Admin, bookkeeper | Map items/classes once → syncs categorize themselves | S-INVOICING-PAYMENTS-011 |
| Sage Intacct two-way sync | Optional integration passing project, payment, and expense data both ways; invoices generate from AccuLynx with job details pre-filled; payments recorded in either system reflect in the other; surcharge/convenience-fee options; flexible per-location sync configuration with assisted setup. | Bookkeeper, admin | Enable → configure per location → invoice from CRM | S-INVOICING-PAYMENTS-012 |
| Per-job sync status & recording | Jobs expose an accounting-sync status (API enum: RequestedSync, Synced, NotSynced, Disconnected, None) with last-sync date and target location; invoices carry a recording status, a user-selected recording classification, and per-line account assignment; a record action books an invoice into the connected accounting system. | Office, bookkeeper | Record invoice → watch sync state → reconcile exceptions | S-INVOICING-PAYMENTS-019, S-INVOICING-PAYMENTS-014, S-INVOICING-PAYMENTS-001 |
| Commissions & pre-commissions (adjacent) | Rep compensation computed before or after job completion; tracker pages list commissions and pre-commission requests by status (Ready to Request, Requested, Approved, Paid). | Owner, sales manager | Request → approve → pay → tracked | S-INVOICING-PAYMENTS-002, S-INVOICING-PAYMENTS-022 |
| Public API & webhooks | Read: job invoices (+detail), job payments (+overview), job financials/worksheets/amendments, accounting sync status. Write: received payments, paid payments, additional expenses (create-only observed). Webhooks: `job.invoice_updated` (totals incl. amount collected, actor, links), `job.invoice_voided`, approved-job-value changed, accounting-integration status changed. No public endpoint observed to create or send an invoice. | Integrators | API key → mirror financial state to external systems | S-INVOICING-PAYMENTS-013, S-INVOICING-PAYMENTS-014, S-INVOICING-PAYMENTS-015, S-INVOICING-PAYMENTS-017, S-INVOICING-PAYMENTS-020 |
| Automation & packaging | Invoice/payment requests can be automated via the automation tooling; AccuPay onboarding requires underwriting documents (articles of incorporation, 3 months of bank statements, financial statements) and includes a dedicated payment specialist; AccuPay and AccuFi are paid add-ons on top of quote-based plans (Essential reported at $250/mo). | Admin, owner | Apply for AccuPay → underwrite → automate requests | S-INVOICING-PAYMENTS-004, S-INVOICING-PAYMENTS-003, S-INVOICING-PAYMENTS-026 |

## Key workflows

1. **Worksheet → invoice → collected.** The approved financial worksheet fixes the job value
   [S-INVOICING-PAYMENTS-021]. Office staff open the Invoice Worksheet and choose full,
   partial-section, installment-sequence, or manual invoicing; name the invoice, set the
   billing date and terms; preview it as the customer will see it, tuning descriptions or
   values [S-INVOICING-PAYMENTS-001]. The invoice emails with an embedded payment option
   (link valid only for direct recipients); on send, A/R aging starts automatically
   [S-INVOICING-PAYMENTS-001][S-INVOICING-PAYMENTS-002]. Payments received drive the invoice
   from Unpaid to Paid; mistakes are voided with an audited webhook trail; the job summary
   continuously shows remaining-to-invoice, collected, and balance due
   [S-INVOICING-PAYMENTS-014][S-INVOICING-PAYMENTS-020][S-INVOICING-PAYMENTS-024].
2. **AccuPay collection loop.** From the job file, dashboard, or contract worksheet, staff
   request a partial or full payment [S-INVOICING-PAYMENTS-006][S-INVOICING-PAYMENTS-003].
   The homeowner pays by card, debit, or ACH/e-check on a company-branded hosted page, via
   the customer portal, over the phone, or in person [S-INVOICING-PAYMENTS-004]. The payment
   auto-applies to the job, triggers a notification, and syncs to QuickBooks/Sage; fees are
   netted from the transaction, with surcharge/convenience-fee structures available to pass
   costs through [S-INVOICING-PAYMENTS-003][S-INVOICING-PAYMENTS-015]. Cards settle in
   roughly 1–2 business days, ACH in 1–3; disputes are worked from a tracker with document
   attachments, while refunds/voids route through a merchant specialist
   [S-INVOICING-PAYMENTS-004][S-INVOICING-PAYMENTS-022][S-INVOICING-PAYMENTS-003]. One
   customer review: "We collect most of our payments through Acculynx too which is super
   convenient for us and our clients." (Dan H., construction firm 2–10 employees, Software
   Advice, April 2026) [S-INVOICING-PAYMENTS-025].
3. **Financing a job with AccuFi.** During the sale (or at invoicing), the rep launches a
   financing offer from the dashboard, job file, estimate, or invoice
   [S-INVOICING-PAYMENTS-007]. The homeowner pre-qualifies in under a minute with no
   credit-score impact and sees compared offers from a 12+-lender marketplace (Acorn
   Finance); a short application follows, with approval and funding possible the same
   business day and money in the homeowner's account 1–2 days after acceptance
   [S-INVOICING-PAYMENTS-007][S-INVOICING-PAYMENTS-008][S-INVOICING-PAYMENTS-009]. The rep
   is emailed at the pre-approval decision and again when funds are deposited, and loan
   status is visible in AccuLynx throughout; the contractor then collects through the normal
   invoice/payment flow — the lender relationship is homeowner-side, at no contractor cost
   [S-INVOICING-PAYMENTS-008][S-INVOICING-PAYMENTS-007].
4. **Books stay reconciled.** With QuickBooks enabled, completing a sale pushes the
   customer, job, contract, and invoice records into QuickBooks so accounting can bill and
   reconcile without touching the CRM; payments they record flow back onto the job file
   [S-INVOICING-PAYMENTS-010][S-INVOICING-PAYMENTS-011]. Item-to-account mappings and
   QuickBooks Classes categorize revenue by product line and location; each job shows a
   sync status (Synced/NotSynced/Disconnected...) and each invoice a recording status
   [S-INVOICING-PAYMENTS-011][S-INVOICING-PAYMENTS-019][S-INVOICING-PAYMENTS-014]. Caveat:
   an April 2026 independent review calls the Desktop path dependable but the sync
   "primarily one-directional" in practice and advises confirming QuickBooks Online
   compatibility before purchase — conflicting with vendor two-way/real-time claims
   [S-INVOICING-PAYMENTS-026][S-INVOICING-PAYMENTS-011].

## Data touched

Cross-reference `../04-inferred-data-model.md`.

- **Invoice** — jobId, invoiceNumber, invoiceSequence, invoiceName, invoiceDate, dueDate,
  createdDate, totalPrice, balanceDue, currentInvoiceState (Draft/Unpaid/Paid/Void),
  recordingStatus, recordingClassification, lineItemAssignment [S-INVOICING-PAYMENTS-014]
- **InvoiceSection** — type (Invoice, Work Not Doing, Supplements, Discounts, Upgrades,
  Change Order, Financial Worksheet, Insurance Claim), totalPrice, items
  [S-INVOICING-PAYMENTS-014]
- **InvoiceItem** — itemName, price/totalPrice, parentItemId + hierarchySortOrder,
  referenceId + referenceType (SKU/Product/CustomSKU/Labor/SKUAndLabor), tradeId
  [S-INVOICING-PAYMENTS-014]
- **JobFinancials** — approvedJobValue, balanceDue, worksheetSectionTotals (worksheet,
  changeOrder, insuranceClaim, upgrade, discount, supplement, workNotDoing), worksheet +
  amendment refs [S-INVOICING-PAYMENTS-018]; **FinancialWorksheet** (single per job,
  approval-gated) [S-INVOICING-PAYMENTS-021]
- **Payment** (three types) — ReceivedPayment: checkNumber, from, amount (signed),
  paymentDate, paymentMethod (≤50 chars; e.g. Check/Credit Card/ACH/Wire), notes,
  surchargeFee{amount,percentage,description}, convenienceFee{amount,description,source},
  convenienceFeeRefund, system (AccuPay/QBO/QB Desktop/Sage), isParent/parentId;
  PaidPayment: refNumber, to, isPaid, accountTypeId; AdditionalExpense: transactionDate,
  to, isPaid [S-INVOICING-PAYMENTS-015][S-INVOICING-PAYMENTS-017]
- **PaymentOverview** — salesAmount, balanceDue, arAge, percentageCollected
  [S-INVOICING-PAYMENTS-016]
- **AccountingIntegrationStatus** — jobSyncStatus (RequestedSync/Synced/NotSynced/
  Disconnected/None), syncDate, syncLocation [S-INVOICING-PAYMENTS-019]
- **FinancingApplication** (no public API observed) — pre-approval decision, offer list,
  funding state, rep notifications [S-INVOICING-PAYMENTS-007][S-INVOICING-PAYMENTS-008]
- **Commission / PreCommission** (no public API observed) — status (Ready to Request/
  Requested/Approved/Paid) [S-INVOICING-PAYMENTS-022]
- **Webhook events** — job.invoice_updated (cost/price totals, amount collected, actor),
  job.invoice_voided, approved-job-value changed, accounting-status changed
  [S-INVOICING-PAYMENTS-020][S-INVOICING-PAYMENTS-013]

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **Fee schedule.** AccuPay's actual rates (card/ACH pricing, dispute fees) are quote-only;
  only "deducted from the transaction, no monthly fee without transactions, no caps" is
  public [S-INVOICING-PAYMENTS-004]. How surcharging is kept compliant per state (caps,
  card-brand rules, debit exclusions) is undocumented despite the fee objects existing
  [S-INVOICING-PAYMENTS-015].
- **Payment→invoice allocation.** Public API payments attach at the job level while each
  invoice tracks its own balance due; how a payment is allocated across multiple open
  invoices (manual pick? oldest-first?) is not shown anywhere public
  [S-INVOICING-PAYMENTS-015][S-INVOICING-PAYMENTS-014].
- **No card-present hardware evidence.** No public mention of terminals, readers, or
  tap-to-pay; "in person" appears to mean keyed entry [S-INVOICING-PAYMENTS-004]. Whether
  text-to-pay/SMS payment requests exist is also unevidenced.
- **Invoice creation via API.** The public API reads invoices and posts payments but shows
  no endpoint to create/send an invoice or to update invoice state — integration writers
  apparently cannot bill [S-INVOICING-PAYMENTS-013].
- **Dunning & reminders.** Automation can send invoice/payment requests
  [S-INVOICING-PAYMENTS-004], but reminder cadences, late fees, statements, credit memos,
  deposits/retainage, and sales-tax handling on invoices are all publicly undocumented.
- **Refund self-service.** Refunds/voids are described as routed through a merchant
  specialist [S-INVOICING-PAYMENTS-003]; whether any in-product self-service refund exists
  is unknown.
- **Financing specifics today.** Current lender terms/APRs (a 2021-era post cited example
  structures), whether the GreenSky path still operates alongside AccuFi, contractor
  dealer-fee absence at all credit tiers, and how declined/expired offers surface in-app are
  unverified [S-INVOICING-PAYMENTS-006][S-INVOICING-PAYMENTS-008].
- **QBO truth.** Vendor claims real-time two-way QuickBooks Online sync
  [S-INVOICING-PAYMENTS-011]; an independent 2026 review reports sync-back unreliability
  and says to confirm QBO support before buying [S-INVOICING-PAYMENTS-026]. Actual current
  behavior (and conflict-resolution rules for double-edited records) is unknown.
- **Invoice document branding** (logo/template/PDF customization depth) is not publicly
  described beyond editing item text/values in preview [S-INVOICING-PAYMENTS-001].
- **Access limitations this pass:** the public knowledge base surfaced no AccuPay/invoice
  articles via search; G2 and Capterra pages were bot-blocked (quotes came via Software
  Advice); YouTube was bot-blocked, so the located walkthrough video ("Acculynx-Building an
  Invoice", youtube.com/watch?v=GdxR9TBgrzo) could not be viewed and no URL+timestamp UI
  references are logged.

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

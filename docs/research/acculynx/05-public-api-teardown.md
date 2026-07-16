# 05 — AccuLynx Public REST API Teardown

**Scope.** Everything below comes from AccuLynx's public developer documentation portal (`apidocs.acculynx.com`, which `api.acculynx.com` redirects to [S-API-018]) and related public pages. The portal publishes each endpoint's page with an embedded OpenAPI 3.0 fragment; we merged the fragments from all 154 public reference pages (108 REST paths, 23 webhook topics, 282 component schemas) to reconstruct the catalog [S-API-001, S-API-019..S-API-172]. No AccuLynx account was used; nothing behind auth was accessed. This is their highest-fidelity public window into the data model. Doc 04 will cross-reference against UI research.

## 1. API shape at a glance

| Property | Value | Ref |
|---|---|---|
| Base URL | `https://api.acculynx.com/api/v2` | [S-API-073] |
| Spec format | OpenAPI 3.0, title "AccuLynx API V2"; fragments embedded per doc page; historical full spec also on SwaggerHub (`AccuLynx/PublicAPI`), with a mock "virtual server" for testing | [S-API-073, S-API-017] |
| Spec version seen | `2.2607.0` / `2.2614.0` (varies per page — INFERENCE: version tracks the main product release train, cf. changelog titles "AccuLynx version 2.2506.0/2.2522.0") | [S-API-073, S-API-013, S-API-014] |
| Style | Resource-oriented REST, JSON; GUID ids for most entities; hypermedia `_link` URI on nearly every object | [S-API-073] |
| Audience policy | API keys are customer-only; software vendors must apply through a partner form; unauthorized vendor use can get the customer account suspended | [S-API-073, S-API-002] |
| Commercial packaging | Sold/marketed as the "AppConnections" add-on; Zapier app is the low-code path | [S-API-016, S-API-002] |
| Docs support policy | Explicitly no API coaching/consulting; troubleshooting only via a contact form | [S-API-002] |

## 2. Auth model

- Single mechanism: a company-scoped **API key sent as an HTTP Bearer token** (`securitySchemes: bearerAuth, type http, scheme bearer`). No OAuth, no scopes surfaced to customers (one webhook page shows internal-looking scope strings `read:users`, `public`, but nothing user-configurable) [S-API-073, S-API-154].
- Keys are created by a **company administrator** in the AccuLynx web app (an authenticated key-management page is referenced) — key issuance is not itself an API operation [S-API-002, S-API-073].
- Keys appear to be **per location**: multi-location accounts must connect each location separately (SwaggerHub description, via search snippet) [S-API-017]. Many config endpoints are phrased "for the current location," implying the key pins tenant + location context [S-API-034, S-API-038].
- No documented granular permissions per key. ASSUMPTION: a key inherits broad read/write over the company's data within the documented surface.

## 3. Versioning

- Current public surface is **v2** (`/api/v2`). **v1 existed** (lead creation only), its docs were removed, but v1 endpoints still function; customers are urged to migrate to v2 `Create Job` [S-API-012].
- Webhook management is documented under a separate base: **`/webhooks/v2/`** (subscriptions, topics, test-event) [S-API-005].
- No per-request version headers documented; version rides in the URL path. Spec `info.version` increments with product releases (e.g., 2.2506.0 → 2.2614.0) without breaking-path changes [S-API-014, S-API-073].

## 4. Rate limits

| Limit | Value | Behavior | Ref |
|---|---|---|---|
| Per-IP concurrency | 30 req/s per IP | 429 + temporary ban ("30 seconds to a few minutes") | [S-API-003] |
| Per-key | 10 req/s | applied after IP check, valid keys only | [S-API-003] |
| Write endpoints (POST/PUT/DELETE) | 6,000 req/hour | 429 when exceeded; headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; docs also reference `RateLimit-*` response headers on each write endpoint; exponential backoff recommended | [S-API-009, S-API-045] |
| Increases | negotiated via partner program form | — | [S-API-003] |

## 5. Conventions

- **Pagination**: offset-based. Collections inherit `{count, pageSize, pageStartIndex, items[]}`; query params `pageSize` + `pageStartIndex`/`recordStartIndex` (naming inconsistent across endpoints). Defaults vary by resource (25, 50, or 100); jobs list caps `pageStartIndex` at 100,000; contact/job search caps `pageSize` at 25 [S-API-070, S-API-047, S-API-124, S-API-060].
- **Includes**: `?includes=` expands nested objects per endpoint (e.g., jobs: `contact`, `initialAppointment`; estimates: `job`, `createdBy`, `sections`; financials: `worksheet`, `amendments`; milestones: `status`) — otherwise nested entities return as `{id, _link}` stubs [S-API-001].
- **Errors**: problem-details-style object `{type (URI), title, status, detail, traceId}`; documented status codes include 400/401/404/416 (range errors on pagination) /429/500 [S-API-143, S-API-060].
- **Dates**: ISO 8601 UTC with `Z` suffix required on writes; several money-date fields (payment/transaction dates) discard the time component (stored as midnight UTC) [S-API-084, S-API-093].
- **IDs**: GUIDs almost everywhere; exceptions are small config enums keyed by integer (country, state, work type, job category, milestone id in one webhook example) [S-API-019, S-API-037, S-API-035, S-API-007].
- **Uploads**: multipart uploads for documents/photos/videos/measurements; executable file types blacklisted; filenames sanitized (special chars/spaces stripped); photo upload alternatively accepts a `fileUri` to pull from [S-API-077, S-API-107].

## 6. Resource catalog — endpoint inventory

108 paths reconstructed. R = read (GET), C = create (POST), U = update (PUT/POST), D = DELETE. All write ops are rate-limited [S-API-009].

| Area | Endpoints (relative to `/api/v2`) | Ops | Ref |
|---|---|---|---|
| Platform lookups | `/acculynx/countries[/{id}]`, `/acculynx/countries/{id}/states[/{id}]`, `/acculynx/units-of-measure`, `/diagnostics/ping` | R | [S-API-019..023, 063] |
| Company settings | `/company-settings`, `.../custom-fields`, `.../job-file-settings/{document-folders, insurance-companies, job-categories, photo-video-tags, trade-types, work-types, workflow-milestones[/{milestone}/statuses]}`, `.../leads/lead-sources[/{id}][/children/{id}]`, `.../location-settings/{account-types[/{id}], countries[/{id}/states]}` | R | [S-API-027..043] |
| Contacts | `/contacts` (R,C), `/contacts/search` (C=search), `/contacts/contact-types` (R), `/contacts/{id}` (R,U), `.../email-addresses[/{id}]` (R,C), `.../phone-numbers[/{id}]` (R,C), `.../jobs` (R), `.../logs` (C), `.../notes` (C), `.../custom-fields[/{id}]` (R,U) | R,C,U | [S-API-044..062] |
| Jobs — core | `/jobs` (R,C), `/jobs/search` (C=search), `/jobs/{id}` (R), `/jobs/external-references` (R,C), `/leads/{leadId}/history` (R), `/jobs/{id}/history` (R) | R,C | [S-API-070..073, 082, 123..125] |
| Jobs — sub-resources | `contacts[/{id}]` (R), `address` (U), `priority` (U), `job-categories` (U), `lead-source` (U), `work-type` (U), `trade-types` (U), `initial-appointment` (R,U,D), `insurance` (R,U), `insurance/insurance-company` (U), `adjuster` (R,U), `custom-fields[/{id}]` (R,U), `messages` + `messages/{id}/replies` (C), `documents` (C), `photos-videos` (C), `measurements` (C), `measurements/files` (C) | mixed | [S-API-074..122] |
| Jobs — people | `representatives` (R), `representatives/company` (R,U), `representatives/sales-owner` (R,U,D), `representatives/ar-owner` (R,U,D) | R,U,D | [S-API-098..106] |
| Jobs — workflow | `milestone-history`, `milestones/current`, `milestones/{id}`, `milestones/{id}/status/{statusId}` | R | [S-API-089..092] |
| Estimates | `/estimates`, `/estimates/{id}`, `.../sections[/{id}]`, `.../sections/{id}/items[/{id}]`, `/jobs/{id}/estimates` | R only | [S-API-064..069, 078] |
| Financials | `/jobs/{id}/financials`, `/financials/{id}`, `.../worksheet`, `.../worksheet/items` (C), `.../amendments[/{id}]` | R + one C | [S-API-080, 134..138] |
| Invoices | `/invoices/{id}`, `/jobs/{id}/invoices` | R only | [S-API-133, 079] |
| Payments | `/jobs/{id}/payments` (R), `.../payments/overview` (R), `.../payments/received` (C), `.../payments/paid` (C), `.../payments/expense` (C) | R,C | [S-API-093..097] |
| Supplements | `/supplements[/{id}]`, `.../items`, `.../notations` | R only | [S-API-139..142] |
| Accounting sync | `/jobs/{id}/accounting/integration-status` | R | [S-API-081] |
| Users | `/users[/{id}]` (status filter: active/inactive/archived/deleted) | R only | [S-API-126, 127] |
| Calendars | `/calendars`, `/calendars/{id}/appointments[/{id}]` (90-day max window) | R only | [S-API-024..026] |
| Scheduled reports | `/reports/scheduled-reports/{id}/runs[/latest][/{runId}][/{runId}/recipients[/{id}]]` | R only | [S-API-128..132] |
| Webhook mgmt | `/subscriptions` (R,C), `/subscriptions/{id}` (R,U,D), `.../test-event` (C), `/topics` (R) — documented base `/webhooks/v2/` | R,C,U,D | [S-API-143..149, S-API-005] |

Notable write gaps (public API): estimates, invoices, supplements, users, calendars, milestones are **read-only**; you cannot delete jobs/contacts; job creation lands only in the unassigned "Lead" milestone; messages can only be created as comments.

## 7. Field-level catalog (core schemas)

Types condensed: `uuid`, `str`, `bool`, `num`, `int`, `dt` (ISO-8601 UTC), `obj`, `[]` array, `→X` reference stub (`{id,_link}`).

### 7.1 Job [S-API-073, S-API-070]

| Field | Type | Notes |
|---|---|---|
| id, _link | uuid, uri | |
| jobNumber | str | company-configurable alphanumeric scheme |
| jobName | str | full display name |
| currentMilestone | str enum | `Lead, Prospect, Approved, Completed, Invoiced, Closed, Cancelled` (read-only via API) |
| milestoneDate | dt | entered current milestone |
| createdDate / modifiedDate | dt | modified = last "touched" |
| priority | str enum | `Normal, High, Urgent` |
| contacts | [] jobContact | join objects: `{id, _link, isPrimary: bool, relationToPrimary: str, contact: →contact}` |
| locationAddress | address | `street1, street2, city, zipCode, state→, country→` |
| geoLocation | obj | `latitude, longitude` (num) |
| tradeTypes | [] tradeType | `{id: uuid, name}` — multiple trades per job |
| jobCategory | obj | `{id: int, name}` |
| workType | obj | `{id: int, name, systemDefault: bool}` |
| leadSource | obj | `{id: uuid, name, children[]: {id, name, parentId}}` — two-level hierarchy |
| initialAppointment | →link | expandable: `{startDate, endDate, notes}` |
| leadDeadReason | str | free-text reason when lead marked dead |

Create Job (POST /jobs) accepts: required `contact.id`; optional `leadSource.id`, `locationAddress` (street1/city/state/country/zipCode required if present), `priority`, `jobCategory.id`, `workType.id`, `tradeTypes[].id`, `notes`. New jobs start as unassigned Leads [S-API-123]. List filters: date-range on `CreatedDate|MilestoneDate|ModifiedDate`, milestone filter, `assignment=assigned|unassigned`, sort by same date fields [S-API-070]. Search: `searchTerm` and/or `geoLocation{latitude, longitude, mapRadius}` — radius search in km [S-API-124].

### 7.2 Contact [S-API-048, S-API-045, S-API-058]

| Field | Type | Notes |
|---|---|---|
| id, _link | uuid, uri | |
| firstName, lastName, salutation | str | |
| companyName, companyJobTitle | str | commercial contacts |
| crossReference | str | free-text external cross-reference field |
| phoneNumbers | [] phoneNumber | `{id, _link, number (10-digit), ext, type enum[Home,Mobile,Work], primary: bool, smsOptOut: bool?}`; create adds `hasTextingAvailable: bool` |
| emailAddresses | [] emailAddress | `{id, _link, address, primary: bool, type enum[Personal,Work,Other]}` |
| mailingAddress / billingAddress | address | create supports `billingAddressSameAsMailingAddress: bool` |
| contactTypeIds (write) | [] uuid | company-defined contact types: `{id, name, isDefault}` [S-API-046] |
| note (create only) | str | seed note |

Sub-entities: **contact log** `{logDate*, type* enum[PhoneCall, SMS, Email], description (≤1000), createdDate, createdBy→user}` — a communications log [S-API-053]; **contact note** `{note* (≤1000), createdDate/By, updatedDate/By}` [S-API-062]. Contact search requires `startDate`/`endDate` (on creation date) + sort; sortable columns `CreatedDate, CompanyName, ContactType, firstName, lastName, LifeTimeValue` — the `LifeTimeValue` column implies a computed contact LTV in their model [S-API-047].

### 7.3 Custom fields [S-API-043, S-API-110..113]

| Field | Type | Notes |
|---|---|---|
| definition: id, _link, label | uuid/uri/str | |
| definition: entityType | enum | `contact, job` — only these two entities support custom fields |
| definition: fieldType | enum | `Text, Number, Date, Boolean` (changelog also mentions "selection"; dropdowns modeled via options) |
| definition: isActive, options[] | bool, [] | option: `{id, value, isActive, sortOrder}` |
| definition: createdDate, modifiedDate, modifiedBy→user | | |
| value object: id, _link, customFieldDefinition→, label, fieldType, values[] | | value item: `{id, value: str}`; multi-value capable |
| value object: modifiedBy→user, modifiedDate | | |

Constraints: Text values truncate at 500 chars; bulk update ≤120 fields per call [S-API-055, S-API-111].

### 7.4 Workflow: milestones & statuses [S-API-041, S-API-089..092]

| Field | Type | Notes |
|---|---|---|
| workflowMilestoneItem.id | int | company workflow config |
| workflowMilestoneItem.name | enum | `Lead, Prospect, Approved, Completed, Invoiced, Closed, Dead, Deleted` (config list; note job.currentMilestone uses `Cancelled` instead of `Dead/Deleted` — naming inconsistency in their own spec) |
| workflowMilestoneItem.statuses[] | [] | `{id: uuid, name}` — sub-statuses exist only if company enabled "custom workflows" |
| jobMilestone (per job) | | `{id, _link, name enum, isCurrent, duration{startDate, endDate}, statuses[]}` |
| jobMilestoneStatus | | `{id, _link, name, isCurrent, duration{start,end}, workflowStatus→{id: uuid, name}}` |
| milestone-history item | | `{name, date}` per transition [S-API-089] |

No public write: milestone transitions cannot be driven via the API (only observed via webhooks).

### 7.5 Estimates (read-only) [S-API-064..069]

| Field | Type | Notes |
|---|---|---|
| estimate: id, _link, job→ | | |
| title, description, notes | str | |
| estimateNumber | str | auto-increments; overridable to match internal docs |
| isPrimary | bool | one primary estimate per job |
| createdBy/Date, modifiedBy/Date | →user, dt | |
| profitMarginRate / profitMarginTotal | num | |
| financials | obj | `{taxRate, taxTotal, overheadRate, overheadTotal, profitRate, profitTotal, totalCost, totalPrice}` — same rollup shape reused per section |
| sections[] | [] section | section: `{id, _link, title, description, createdBy/Date, modifiedBy/Date, profitMarginRate/Total, sectionFinancials, items[]→}` |
| item | | `{id, name, overrideName, description, materialCost, laborCost, waste, estimateUnit, orderUnit, unitConversion, selectedUnit (1=Order, 2=Estimate), type enum[SKU, Product, CustomSKU, Labor, SKUAndLabor], totalPrice, fixedPrice: bool, price, quantity, measurementQuantity, orderQuantity}` |

Item model reveals the catalog concept (SKU/Product/Labor), waste factors, estimate-vs-order unit conversion — i.e., estimating is wired to material ordering.

### 7.6 Financials / worksheet / amendments [S-API-080, S-API-134..138]

| Field | Type | Notes |
|---|---|---|
| financials: id, _link, jobId | | one financials record per job |
| approvedJobValue | num | the contract value |
| balanceDue | num | outstanding |
| worksheetSectionTotals | obj | totals across worksheet + amendments |
| worksheet | obj | `{id, _link, jobId, currentState: str, totalPrice, title, sections[]}` |
| worksheetSection | obj | `{id, sectionType enum[Invoice, Work Not Doing, Supplements, Discounts, Upgrades, Change Order, Worksheet, Insurance Claim], totalPrice, items[]}` |
| worksheetItem | obj | `{id, itemName, price, totalPrice, parentItemId (nesting), hierarchySortOrder, tradeId: uuid}` |
| amendment | obj | worksheet-shaped: `{id, _link, jobId, currentState, totalPrice, title, createdDate, modifiedDate, sections[]}` — change orders as amendments |
| worksheet item create (POST) | | `{sectionId? (empty = create worksheet), parentItemId?, itemName, description, quantity, unitOfMeasure: uuid, costPerUnit, cost, price*}` [S-API-136] |

The "contract worksheet" is the financial source of truth; sections mirror the insurance-restoration flow (claim, supplements, upgrades, discounts, change orders).

### 7.7 Invoices (read-only) [S-API-133, S-API-079]

| Field | Type | Notes |
|---|---|---|
| id, _link, jobId | | |
| invoiceNumber, invoiceName | str | number + user-entered name |
| invoiceSequence, sortIndex | num | ordering |
| invoiceDate, dueDate, createdDate | dt | |
| currentInvoiceState | enum | `Paid, Unpaid, Void, Draft` |
| totalPrice, balanceDue | num | |
| recordingStatus / recordingClassification | str | accounting-integration recording state + user-chosen classification |
| sections[] | [] | `{id, invoiceWorksheetSectionType enum[Invoice, Work Not Doing, Supplements, Discounts, Upgrades, Change Order, Financial Worksheet, Insurance Claim], totalPrice, items[]}` |
| invoiceItem | | `{id, itemName, price, totalPrice, parentItemId, hierarchySortOrder, lineItemAssignment (user account classification), referenceId: uuid (catalog ref), referenceType enum[SKU, Product, CustomeSKU (sic), Labor, SKUAndLabor], tradeId}` |

### 7.8 Payments [S-API-093..097]

Grouped response: `{receivedPayments{total, []}, paidPayments{total, []}, additionalExpenses{total, []}}`. All share base `{id, paymentType enum[Received Payment, Paid Payment, Additional Expense], isParent: bool, parentId: uuid? (sub-payment→parent), lastEditedDate, paymentMethod (e.g. Check, Credit Card, ACH, Wire)}`.

| Variant | Extra fields | Notes |
|---|---|---|
| receivedPayment | `checkNumber (≤50), from (≤250), amount (signed), notes, paymentDate (midnight UTC), surchargeFee{amount, percentage, description}, convenienceFee{amount, description, source}, convenienceFeeRefund{amount, description, date}, system` | `system` read-only enum of payment/accounting rails: `AccuPay, Sage Intacct, QuickBooks Online, QuickBooks Desktop` |
| paidPayment | `refNumber, isPaid, accountTypeId: uuid, to (≤250), amount, notes, paymentDate` + same fee objects + `system` | vendor/sub payouts |
| additionalExpense | `refNumber, isPaid, to, amount, notes, accountTypeId, transactionDate` | job costs outside payables |
| paymentOverview | `salesAmount, balanceDue, arAge: int, percentageCollected: int` | AR aging per job [S-API-094] |
| create bodies | received: `{from, amount*, paymentDate, paymentMethod, checkNumber, notes}`; paid: `{to, paymentMethod, amount*, paymentDate, notes, accountTypeId, refNumber, isPaid}`; expense adds `paymentMethod` | negative amounts allowed (adjustments) [S-API-095..097] |

### 7.9 Supplements (insurance) — read-only [S-API-139..142]

| Field | Type | Notes |
|---|---|---|
| id, _link, name, job→ | | name = description |
| status | →link | supplement status entity (own uuid) |
| state | enum | `Unknown, Created, InProgress, Closed, Applied, Deleted` |
| assignedSupplementer | obj | `{supplementerAssigned→user, assignedDate, assignedBy→user}` — dedicated supplementer role |
| itemsToSupplement | obj | `{totalOriginalClaimAmount, totalRequestedAmount, totalApprovedAmount, totalAppliedAmount, items[]}` |
| supplementItem | | `{id, name, description, originalClaimAmount, requestedAmount, approvedAmount, appliedAmount}` — four-stage money lifecycle per line |
| notations[] | [] | `{id, status→, spokeWith, notes, phone, extension, fax, email, createdBy→, createdDate, emailRecipients[]: {id: int, companyUser→}}` — call-log style negotiation notes |
| audit | | createdBy/Date, editedBy/Date, closedBy/Date, appliedBy/Date |

### 7.10 Insurance & adjuster (per job) [S-API-085, S-API-074, S-API-115, S-API-117]

| Field | Type | Notes |
|---|---|---|
| insurance: claimFiled, claimFiledDate | bool, dt | |
| claimNumber | str | |
| insuranceCompany | obj | `{id: uuid, name, isActive}`; set by id (managed list) or free-text name (falls to "Other") |
| customInsuranceCompanyName | str | |
| dateOfLoss | dt | |
| damageLocation | str | |
| hasPaperwork | bool | |
| adjuster: name, email, fax | str | |
| adjuster.phone | obj | `{number, ext, type}` |
| claimApproved, claimApprovedDate | bool, dt | |
| metWithAdjuster, metWithAdjusterDate | bool, dt | adjuster-meeting tracking |

### 7.11 Users & job representatives [S-API-126, S-API-098]

| Field | Type | Notes |
|---|---|---|
| user: id, _link, displayName, firstName, lastName, initials | | |
| role | obj | `{id: int, name enum[Company Administrator, Location Administrator, Manager, Office, Sales, Crew]}` — the fixed role taxonomy |
| status | enum | `Active, Inactive, Archived, Deleted` |
| phone, mobilePhone, email | str | |
| jobRepresentative | obj | `{id, _link, type enum[CompanyRepresentative, SalesOwner, AROwner, Additional], user→}` — three named per-job roles + extras; each has GET/POST(/DELETE) endpoints |

### 7.12 Calendars & appointments (read-only) [S-API-024..026]

| Field | Type | Notes |
|---|---|---|
| calendar | | `{id: uuid, name}` — per-location calendar list |
| event: id, title, start, end, allDay | | |
| eventType | enum | `Personal, Initial Appointment, Material Order, Labor Order` (detail) / `All, Personal, InitialAppointment, MaterialDelivery, CrewLabor` (list) — calendar unifies sales appts, material deliveries, crew labor |
| attendees[] | []→user | |
| job→, jobName, location, notes | | |
| sharedWithCustomerPortal | bool | events can be exposed to the homeowner portal |

### 7.13 Files, photos, measurements (write-only via API) [S-API-077, S-API-107..109]

| Operation | Body fields | Notes |
|---|---|---|
| Add job document | `file*, description, documentFolderId*: uuid, externalId, externalSource` | folder taxonomy from company settings; exe/script types blocked |
| Upload photo/video | `file` or `fileUri`, `description, tags (comma-sep GUIDs), externalId, externalSource` | tags from company photo/video tag list [S-API-029] |
| Manual measurements | `measurementsFile* (.json)` | contents not validated |
| Measurements order | `measurementsFile (XML/JSON), reportPdf, miscPdfs (≤10), latitude*, longitude*, providerMeasurementOrderId*, providerId* enum[Unknown, Hover, RoofSnap, External], measurementOrderDescription*, model3DUrl, orderedDate*, completedDate` | returns `{measurementOrderId}`; recipes cover steep-slope, low-slope, siding payloads [S-API-001] |

No GET endpoints for documents/photos/measurements — upload-only surface.

### 7.14 History / audit [S-API-082, S-API-125]

Job history item: `{action: str, type: enum, date, createdBy→user}`. The `type` enum is a near-complete census of their internal event domains: `Customer, Job, Lead, Measurement, Estimate, Order, Permit, Payments, Commission, Precommission, ContractWorksheet, Supplement, File, Unspecified, CommunicationHistory, ContactNote, JobContact, Contact, JobMessage, ContractWorksheetStatus, MortgageCheck, Measurements, Appointment, JobEmail, JobPacket, Account, Company, User, FeatureManager, PermissionSettings, LaborContact, LaborOrder, Financing, JobSignatureEmail, JobPaymentRequest, TextMessage`. Lead history adds `leadDeadReason`. This enum exposes modules with no other API surface (permits, commissions, mortgage checks, financing, labor orders, job packets, e-signature emails, payment requests, SMS).

### 7.15 Misc

- **Company settings**: `{id, name, timeZoneInfo{name, daylightName, baseUtcOffset, adjustedUtcOffset, supportsDaylightSavingTime}, hasInsurance: bool}` — insurance features are a company-level toggle [S-API-027].
- **Account types** (payment ledger buckets): `{id: uuid, name, IsActive}` [S-API-030]. **Document folders**: `{documentFolderId, name, companyId, description}` [S-API-028]. **Units of measure**: `{id: uuid, name, friendlyName}` [S-API-023].
- **External references**: `{jobId, companyId, source, projectId}` — generic key-mapping table for third-party systems; also settable on file/photo uploads [S-API-071, S-API-072].
- **Job messages**: create-only comments `{message*}` + threaded replies; response returns `{messageId}` [S-API-087, S-API-088].
- **Scheduled reports**: instances of pre-configured reports: run `{reportId, date, runInstanceId, recipientsCount}`; recipient `{recipientId, reportId, runInstanceId, date, files[]: {fileId, fileUrl}}` — API fetches generated report files, cannot define reports [S-API-128..132].
- **Accounting integration status**: `{jobSyncStatus enum[RequestedSync, Synced, NotSynced, Disconnected, None], syncDate, syncLocation}` [S-API-081].

## 8. Webhooks

**Management**: subscriptions CRUD + test events + topic discovery (§6). Subscription: `{id, _link, consumerUrl (HTTPS, immutable after create — delete/recreate to change), createdDate, modifiedDate, status enum[enabled, disabled], tech_contact: email, topicNames[], integrationType enum[Api, Zapier]}` [S-API-143..146].

**Delivery contract**: POST JSON to consumer URL; envelope `{topicName, eventDateTime, eventId: uuid, subscriptionId: uuid, event: {...}}`; 10-second response timeout; any 2xx acks; duplicates possible (consumers must dedupe, presumably on `eventId`); repeated failures auto-disable the subscription [S-API-006, S-API-007, S-API-008]. The listener guide mentions a "secret for validation" returned at registration, but no signature header/HMAC scheme is documented [S-API-007].

**Topics (23 documented)** [S-API-150..172]:

| Topic | Fires on | Payload highlights |
|---|---|---|
| `contact_added` / `contact_changed` | contact create/update | contact id + `_link` + timestamp (thin payload — fetch details via API) |
| `contact.custom-field.value_changed` / `.status_changed` | contact CF value/status | field id, values[] + formattedValues[], modifiedBy, timestamp / label, new status, updatedBy |
| `job_created` | new job | fat payload: job snapshot incl. contacts w/ primary contact detail, address, leadSource, category, workType |
| `job_updated` | job/primary-contact/details modified | full current job state snapshot (system-of-record sync) |
| `job.milestone.current_changed` | milestone transition | milestone id/name enum, changedBy, date, isCurrent |
| `job.milestone.status.current_changed` | sub-status transition | status + workflowStatus, changedBy, date |
| `job.category_changed`, `job.work-type_changed`, `job.trade-type_changed` | classification changes | new value(s); flags systemDefault vs custom |
| `job.contacts.primary_changed`, `job.primary.contact_changed` | primary-contact association | job + contact links, isPrimary |
| `job.representatives.company_assigned` / `.company_changed` | company rep set/changed | rep + user link; changed variant carries before/after users |
| `job.appointments.initial_created` / `.initial_updated` | initial appointment | start date, company rep, job link |
| `job.financials.approvedValue_changed` | approved job value | new value, approvedBy, links |
| `job.invoice_updated` / `job.invoice_voided` | invoice change/void | totals (priceTotal, costTotal, amountCollected), updatedBy/voidedBy, dates |
| `job.accounting.integration-status.current_changed` | accounting sync state | current enum `queued, sent` + link |
| `job.custom-field.value_changed` / `.status_changed` | job CF changes | as contact CF variants |

Legacy note: the listener walkthrough shows an older milestone event (`topicName: job-milestone-changed`) with flat fields `{jobId, companyId, milestoneId: int, milestoneName, companyUserId, adminId, message, actionLocation, milestoneDate}` — INFERENCE: an earlier webhook generation that predates the current topic naming [S-API-007].

## 9. Data-model observations (for our design, not to copy)

- Jobs and leads are one entity; "lead" is just the earliest milestone plus an assigned/unassigned flag. Contact is a separate entity many-to-many with jobs via join objects carrying `isPrimary`/`relationToPrimary`.
- Money lives in three parallel structures (estimate → contract worksheet + amendments → invoices) that share a section/item shape with `parentItemId` nesting and catalog references; payments are a separate triple ledger (received/paid/expense) with AccuPay/QuickBooks/Intacct as first-class `system` values.
- The insurance-restoration domain is deeply modeled: claim data, adjuster meetings, supplements with per-line claim→requested→approved→applied amounts, and worksheet sections named for claim mechanics.
- INFERENCE: the public API is a partial projection of a much larger internal model — the job-history `type` enum and read-only surfaces (orders, commissions, permits, financing, texting) reveal modules deliberately not exposed for write.

## Unknowns

- **No public write/read surface documented for**: material/labor orders, commissions, permits, financing, SMS/email sending, e-signatures, templates, homeowner-portal management, document/photo download, estimate/invoice creation, user management, milestone transitions. Whether private/partner APIs exist for these is unknowable publicly — we design ours from scratch.
- **Webhook authenticity**: a validation "secret" is mentioned once but no signing algorithm, header name, or verification procedure is documented publicly.
- **API key mechanics**: key rotation, expiry, number of keys per company, and any per-key permission scoping are behind the authenticated key-management page (not accessed).
- **Exact object shapes of fat webhook payloads** (`job_updated` full snapshot) are only partially specified — several event schemas in the published fragments are typed as untyped objects with examples.
- **v1 surface**: still functional per changelog but its documentation was removed; its shape (beyond "lead creation") is publicly unknowable.
- **SLAs/uptime, sandbox tenants, pricing of the AppConnections add-on**: not published; SwaggerHub mock server is the only test environment offered without an account.
- The Fivetran AccuLynx connector docs page did not render its table list (bot-blocked/JS navigation shell), so an independent cross-check of synced resources was not possible.

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

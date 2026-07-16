# Module: Reporting

> Prepared under `docs/legal/clean-room-protocol.md`; all sources logged in
> `../sources/reporting.md` (IDs `S-REPORTING-###`).

## Purpose

This module turns the operational data already captured in AccuLynx (leads, jobs, estimates,
orders, invoices, payments, expenses, supplements, commissions) into decision material: a
catalog of 20+ pre-built reports that populate automatically from account data
[S-REPORTING-003], role-oriented KPI dashboards, a sales leaderboard, scheduled email delivery
of reports, and spreadsheet exports. Base reporting ships with the platform; deeper
customization lives in a paid add-on ("ReportsPlus," 25+ customizable reports and dashboards
plus a mobile app) [S-REPORTING-001], and a second add-on ("Data Mart"/DataMart) exposes raw
account data to external BI tools for enterprises [S-REPORTING-015][S-REPORTING-017].

## Feature table

| Feature | Description (our words) | Who uses it (roles) | Workflow steps | Source refs |
|---|---|---|---|---|
| Standard report catalog (Reports tab) | 20+ pre-built reports that fill themselves from live account data — no manual spreadsheet assembly. Evidenced report names: Sales Report; Lead Status; Lead Source; Dead Leads Summary; Closing Percentage; Time in Process; Job Milestones; Job Profitability; Materials; Supplements Overview; A/R Age by Salesperson; Payments Received (2023); Job Expenses (2023); Appointments (2025). | Owner, sales manager, office, bookkeeper | Open Reports tab → pick report → set date range → view | S-REPORTING-003, S-REPORTING-004, S-REPORTING-005, S-REPORTING-007, S-REPORTING-008, S-REPORTING-017, S-REPORTING-020 |
| Base report editing | On any standard report: pick date range (preset "All Data" or custom span), then an Actions menu offers Edit Report → Columns, where fields are toggled by checkbox (job info, address, pipeline-stage flags) and applied. Group calculations summarize content; reports searchable by keyword; chart display types (bar, pie, etc.) selectable. | Any report viewer | Actions → Edit Report → toggle columns → Apply | S-REPORTING-020, S-REPORTING-003 |
| Report export | Actions menu on a report offers Download/Export to produce a spreadsheet file. Third-party how-to guides describe choosing Excel or CSV as the file type (official format list not publicly confirmed). | Any report viewer | Actions → Download/Export → choose file type → open file | S-REPORTING-020, S-REPORTING-023 |
| Sales Leader Board | Dashboard component ranking sales reps by number of sales closed in the current month, alongside company revenue generated; positioned as gamification/motivation and manager visibility into per-rep progress toward goals. | Sales reps, sales manager, owner | Open dashboard → view monthly ranking | S-REPORTING-009 |
| Sales pipeline snapshot | Real-time revenue-by-milestone view: potential lead revenue, prospect value, invoiced jobs, and collected revenue across all milestones — used to forecast upcoming revenue and gauge financial health. | Owner, sales manager | Open dashboard → read revenue at each milestone → forecast | S-REPORTING-009 |
| Operational quick-view trackers | 14 tracking pages that act as live operational dashboards: submitted leads/jobs (with bulk pipeline moves), job progress (status, job ID, balance due, age, assigned rep), document signature status, work schedule (labor orders + deliveries/pickups by scheduled/in-progress/completed), submitted orders (bulk approval), financing application status, payment processing, payment disputes, pre-commissions and commissions (Ready/Requested/Approved/Paid), permits (six-stage pipeline), supplements (filter by job/company/date), mortgage checks (amount, sent date, tracking number), and measurement-order status. | Owner, office, production manager, sales manager | Open tracker → filter → drill into job | S-REPORTING-021 |
| ReportsPlus add-on (custom reporting) | Paid add-on with 25+ customizable reports and dashboards. Drag-and-drop editing: add/remove columns, apply filters, logic, and groupings, pick chart types, preview the report as a different user, and save the modified report for reuse. | Admin (enable), managers/analysts (build) | Open library → copy/edit report → drag-drop changes → save | S-REPORTING-001, S-REPORTING-002, S-REPORTING-010, S-REPORTING-011 |
| ReportsPlus report library | Pre-built report set spanning sales and production, job costs, and marketing leads; specific coverage called out for job milestones, permits, supplements, accounts receivable, materials, dead leads, estimates, pipeline status, and estimate-to-sale timeline. | Managers by function | Browse library → open report → filter/date-range | S-REPORTING-001, S-REPORTING-002, S-REPORTING-010 |
| Dashboard library (role-based) | Pre-built KPI dashboards designed per role — management, sales, production, accounting, office staff — giving views into sales pipelines, marketing leads, job profitability, A/R, and production. | Each named role | Pick role dashboard → monitor KPIs | S-REPORTING-001, S-REPORTING-002, S-REPORTING-010 |
| Custom dashboards | Build a dashboard from scratch: select which reports appear, edit each component's filters and date ranges, choose visualization types, and arrange components; dashboards read live ("real-time") data for trend-spotting. | Managers, owner | New dashboard → add reports → set filters/visuals → arrange → save | S-REPORTING-001, S-REPORTING-005, S-REPORTING-010 |
| Scheduled report delivery | Any report can be emailed automatically: choose recipients, file format, frequency, and specific day/time; supports one-time sends or recurring schedules (weekly/monthly cadences cited). | Managers (configure), whole team (receive) | Pick report → schedule → recipients + format + cadence → auto-send | S-REPORTING-001, S-REPORTING-004, S-REPORTING-005 |
| Sharing, bookmarking, cross-location copy | Reports/dashboards shareable with specific users or published to company-wide libraries; bookmark favorites for quick access; a report built once can be copied to other business locations to avoid duplicate setup. | All report users | Share → pick audience; bookmark; copy to location | S-REPORTING-001, S-REPORTING-002, S-REPORTING-003, S-REPORTING-010 |
| ReportsPlus mobile app | iOS/Android app (launched March 2019, marketed as the first roofing reporting app) mirroring the add-on: pre-built reports on job milestones, permits, supplements, materials, billing, estimates; filter/edit any report, bookmark, create/edit/share dashboards that sync with desktop, schedule delivery, view live company data. | Owner, managers in the field | Open app → pick report/dashboard → filter → act | S-REPORTING-006, S-REPORTING-001 |
| Trade-level reporting (Fall 2025) | Financial worksheet ties revenue and expenses to individual trades (roofing, gutters, siding…); two new ReportsPlus reports: Job Value by Trade (totals organized by trade, for spotting which service lines drive profit) and Job Worksheet (same data organized per job). | Owner, accounting | Run trade report → compare trade profitability | S-REPORTING-017 |
| Appointments Report (Fall 2025) | Standard report listing every appointment company-wide with creator, type, time, duration, location, and notes. | Office, sales manager | Open report → filter → review appointment load | S-REPORTING-017 |
| Data Mart / DataMart add-on | Enterprise add-on granting access to raw/granular AccuLynx data so companies can build their own visualizations in external BI tools (Klipfolio, Tableau, Power BI named by a third-party review); positioned for multi-location, portfolio-wide tracking and forecasting without manual CSV exports. | Enterprise analysts, multi-location execs | Enable add-on → connect BI tool → build external dashboards | S-REPORTING-001, S-REPORTING-011, S-REPORTING-015, S-REPORTING-017 |
| Multi-location reporting | One account manages multiple locations and tracks each location's performance; reports copy across locations; Fall 2025 Sage Intacct integration update consolidates multi-location financials under a single master company for unified reporting. | Multi-location owner/exec | Switch location context → run/compare reports | S-REPORTING-012, S-REPORTING-003, S-REPORTING-017 |
| Scheduled-reports API (read-only) | Public REST v2 exposes scheduled reports: list run instances for a scheduled report, get an instance by run ID, get the latest instance, and list/get recipients per instance. Instance object carries `reportId`, generation `date` (ISO 8601), `runInstanceId`, `recipientsCount`; empty response if the schedule has never run. Negative finding: no public endpoints for report definitions, dashboards, leaderboards, or ad-hoc export. | Integrators | Poll runs → fetch latest instance → enumerate recipients | S-REPORTING-013, S-REPORTING-014 |
| Plan gating | All tiers include "custom reporting" and personal/role-based dashboards; Pro adds specialized reporting & analytics; Elite adds production status and trade reports, sales pipeline and closing percentage reports, and prospecting reports. ReportsPlus and Data Mart are optional paid add-ons on top of any plan, enabled by an Administrator in account settings. | Buyer, admin | Choose tier → admin enables add-ons | S-REPORTING-022, S-REPORTING-011, S-REPORTING-015 |

## Key workflows

1. **Pull, shape, and export a standard report.** User opens the Reports tab and selects a
   report (e.g., Sales Report), sets the date range ("All Data" or a custom span), opens the
   Actions menu → Edit Report → Columns, toggles the fields wanted (job info, address,
   stage-completion flags), applies, then Actions → Download/Export to get a spreadsheet
   (Excel/CSV per third-party guides) [S-REPORTING-020][S-REPORTING-023][S-REPORTING-003].
2. **Build and share a custom report/dashboard (ReportsPlus).** User starts from a library
   report or blank, drag-and-drops columns, filters, groupings, and logic, picks a chart type,
   optionally previews the result as another user, saves it, then composes dashboards from
   saved reports (per-component filters, date ranges, visualization choice, layout). The result
   is bookmarked, shared to chosen users, published to a company library, or copied to another
   location [S-REPORTING-001][S-REPORTING-003][S-REPORTING-010].
3. **Automate recurring KPI distribution.** For any report, the user configures a schedule —
   recipients, file format, frequency, day, and time — for one-time or recurring email
   delivery (e.g., weekly Payments Received for collections, monthly Job Profitability). An
   integration can then verify delivery via the API: list a scheduled report's run instances,
   fetch the latest instance (`reportId`, ISO-8601 `date`, `recipientsCount`), and enumerate
   its recipients [S-REPORTING-001][S-REPORTING-005][S-REPORTING-007][S-REPORTING-013][S-REPORTING-014].
4. **Daily performance check.** Owner/manager opens the dashboard: Sales Leader Board shows
   each rep's monthly closed-sales count and company revenue; the pipeline snapshot shows
   revenue sitting at each milestone (potential → prospect → invoiced → collected) for
   forecasting; quick-view trackers surface exceptions (aging A/R, unapproved orders, permit
   and supplement stages, commissions ready to pay). Same data reachable in the field via the
   ReportsPlus mobile app with filtering and bookmarks [S-REPORTING-009][S-REPORTING-021][S-REPORTING-006].

## Data touched

Read-heavy module over entities owned elsewhere (cross-reference `../04-inferred-data-model.md`):
leads (status, source, dead reason), jobs + milestones/status history (time-in-process,
progress, age), appointments (creator, type, duration, location, notes), estimates
and contracts (closing percentage, estimate-to-sale timeline), invoices/payments/A-R (aging by
salesperson, payments received by date/method/purpose), expenses & job costs (paid vs owed,
by trade/supplier, forecast vs actual), supplements, permits, mortgage checks, commissions
(status stages), material orders, users/reps (leaderboard, groupings, report
preview-as-user), locations (multi-location comparison), plus reporting-owned records:
saved report definitions, dashboards, bookmarks, shares, schedules, run instances, and
per-instance recipient lists [S-REPORTING-013][S-REPORTING-014][S-REPORTING-021][S-REPORTING-017].

## Voice of customer (signal for our design)

- "I really enjoy getting the insights into my business that provides" — Greg H., CEO,
  construction, Capterra review dated 2026-04-16 [S-REPORTING-016].
- Third-party reviewers report that base reporting covers job counts, revenue, close rates,
  and lead-source tracking, but that reports get slow past roughly 500 jobs/year, that deeper
  profitability/BI analysis often forces data export, and that the reporting interface trails
  modern analytics UX with no predictive analytics [S-REPORTING-015][S-REPORTING-019]. INFERENCE:
  performance at scale, modern report UX, and forecasting are open flanks for us.

## Unknowns

Public sources could not reveal the following; we design these ourselves rather than guess:

- **Canonical report list.** The full names of all "20+" standard and "25+" ReportsPlus
  reports/dashboards: the knowledge base (support.acculynx.com) returns HTTP 403 to
  non-browser access, so only marketing-cited report names are inventoried [S-REPORTING-018].
- **Export formats, officially.** Excel/CSV comes from third-party guides
  [S-REPORTING-020][S-REPORTING-023]; AccuLynx's own list of export and scheduled-delivery file
  formats (PDF? images?) is unpublished.
- **Permissions model.** Which roles can view/create/share/schedule reports; how "preview as
  another user" maps to a permission matrix; whether report data is row-level filtered by role.
- **Custom-report field catalog.** Which entities/fields the builder exposes; whether
  calculated fields, cross-entity joins, or custom-field reporting are supported.
- **Leaderboard configurability.** Whether metric (count vs revenue), timeframe, or team
  scoping on the Sales Leader Board can be changed; only "sales per rep this month" is evidenced.
- **Data Mart mechanics.** Delivery form (direct warehouse connection? extract? API), schema,
  refresh cadence.
- **Refresh/latency architecture.** "Real-time" is claimed [S-REPORTING-005]; reviewers report
  slow large-dataset pulls [S-REPORTING-015]; no public information on caching or refresh.
- **Add-on pricing.** ReportsPlus and Data Mart prices are quote-based and unpublished.
- **Dashboard UI walkthroughs.** KB training videos exist (e.g., an ~9-minute dashboard video
  gated for Administrator/Manager roles) but sit behind the bot-blocked help center, so no
  timestamped UI observations were possible [S-REPORTING-018].

## Completeness checklist

- [x] Every feature claim has a source ref
- [x] Unknowns section filled (or explicitly "none")
- [x] Workflows describe function, not visual design
- [x] ≤ 4 pages

Prepared under docs/legal/clean-room-protocol.md; all sources logged.

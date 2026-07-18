# Runbook 09 — Design-partner discovery probe (AccuLynx capture gaps)

**Who runs it:** the **design-partner contractor** (a current AccuLynx account owner), with
Andrew coaching. **Never** run by Eaverow logging in — the contractor is always the one at the
keyboard on their own account (see the guardrail below). **Time:** ~60–90 min.
**Why:** doc 14 flagged several capture questions that only a live AccuLynx account can answer.
Several outcomes could **shrink or eliminate** parts of the capture build — so this cheap probe
comes *before* we write capture code.

> **Hard guardrail (non-negotiable):** the contractor stays the authenticated actor on their own
> account; we never take their password and never log in as them. Do this while their
> subscription is **active** (AccuLynx can delete data after cancellation — ToS §15). Nothing here
> automates AccuLynx; it's the contractor clicking their own buttons and telling us what they see.

## What we're trying to learn (the open questions from doc 14)

Each probe resolves a specific unknown. Record the answer + a screenshot in a shared doc.

### A. Sanctioned bulk channels (highest leverage — could moot the photo/doc build)

1. **ToS §15 written export.** Have the contractor open an AccuLynx support ticket: *"Please provide
   a full export of my account data before I cancel — what formats are available, does it include
   photos and documents, is there a fee, and how long does it take?"*
   - **Capture:** the exact answer — formats offered, whether **photos/documents/messages** are
     included, fee, turnaround. → If they'll hand over bulk files, most of the hard build disappears.
2. **DataMart (only if they're on Elite + have the add-on).** If available, run a schema
   exploration in Snowflake / their BI tool.
   - **Capture:** the **table/column catalog** — do any tables hold file URLs, message/comment text,
     or estimate **line items** (vs. just job-level KPIs)? Refresh cadence? Does access survive
     cancellation?

### B. What the sanctioned per-job/report exports actually contain

3. **Job History / Export History-Comments — does it include message body text?** Have them run
   Job Menu → Settings → **Export History/Comments** (and the newer Job History → Export) on a real
   job, as **CSV**.
   - **Capture:** open the CSV — is the **actual text** of message-board comments / emails / SMS in
     it, or only event rows (timestamps/types)? Which columns exist?
4. **"Message history upon request."** Have them ask support to export a job's full message history
   (the Fall-2024 documented path).
   - **Capture:** format, scope, whether it's per-job or bulk, any fee.
5. **Reports export — line items?** In Reports, open the **Estimates** report → Edit Report →
   Columns.
   - **Capture:** can columns include **per-line-item** detail (SKU, qty, unit price, material/labor),
     or only estimate **headers/totals**? Same check on the **Materials** report for supplier invoice
     lines.

### C. Photos — is there any bulk or semi-bulk path?

6. **Photo share link download.** Have them create an album **Share** link and open it as the
   recipient (incognito / phone).
   - **Capture:** does the recipient view have a **Download** button? Does it include **videos**? Is
     it whole-album or one-at-a-time? (If it downloads the album, share links are a poor-man's bulk
     photo exporter.)
7. **Create-a-PDF / Print.** Select photos on a job → **Print / Create a PDF**.
   - **Capture:** resolution/quality of the output vs. originals; does it preserve which job/tag the
     photos belong to?
8. **Naming/structure of a manual download.** Download 5–10 photos from one job the normal way.
   - **Capture:** do filenames/metadata preserve the **tag → job** association, or arrive as
     sanitized JPEGs with the structure stripped? (This decides whether a bulk pull is even worth it.)

### D. Documents & e-sign

9. **Company Documents bulk download.** Tools → Company Documents → check multiple → Actions →
   **Download**.
   - **Capture:** confirm multi-select download works and whether it returns **original file formats**
     (vs. flattened/proprietary) for Smart(er) Doc templates.
10. **E-sign audit trail.** Open a completed e-sign packet → Actions.
    - **Capture:** is there any **download of the signature audit log/certificate** (name/email/IP/
      timestamp), or only the flat signed PDF?

### E. Field-completeness for the CSV core (from doc 13's open items)

11. **Contacts/Jobs export column coverage.** Run the built-in **Export Contacts and Leads** and a
    **Jobs Report** export.
    - **Capture:** the full **column list** actually available — do custom fields, insurance fields,
      job financial summary, and lead source all come through? (Feeds our importer field-mapping.)

## How to record it

Create one shared doc (Google Doc / Drive folder). For each numbered probe: the **answer**, a
**screenshot**, and any **sample file** the contractor is willing to share (a de-identified CSV/PDF
is ideal). Send it back to me and I'll update docs 13/14 and turn the confirmed paths into the
capture build.

## What each outcome unlocks

| If we learn… | Then… |
|---|---|
| §15 export includes photos/docs in bulk | The photo/doc capture build largely disappears — we just guide the §15 request |
| Job History CSV includes message body text | Message capture becomes a clean CSV import, not a scrape |
| Photo share links have a whole-album download | We ship a "share-then-download" photo path (green zone) |
| Reports export includes line items | Estimate/financial detail migrates without the API |
| None of the above | We fall back to concierge for AccuLynx-native files + the read-only-30-90-days plan |

## After the probe

I'll fold the answers into docs 13/14, mark the resolved `[U]` items, and we scope the actual
capture build against what's *confirmed* — not assumed. That's the whole point of doing this first.

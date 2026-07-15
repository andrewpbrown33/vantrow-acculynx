# Clean-Room Research & Build Protocol

**Status:** Binding for all research and development in this repository.
**Adopted:** 2026-07-15 — before any competitive research document was created.

## Purpose

This repository contains competitive research on AccuLynx (and the roofing-software market
generally) and, eventually, the implementation of a competing product. Competitive analysis
and building competing products with similar features are lawful, standard business
practice. What is *not* lawful is copying protected expression. This protocol keeps the
line bright.

## Rules

### 1. Public sources only
- Research uses only publicly accessible material: marketing websites, public help
  centers, public API documentation, published videos (YouTube demos, webinars), review
  sites (G2, Capterra, Software Advice, Reddit), job postings, press coverage, and
  public filings.
- **No** research is conducted from inside an AccuLynx account (trial or paid), and no
  authenticated or paywalled surface is scraped.
- No circumvention of technical access controls of any kind.

### 2. Provenance for every claim
- Every factual claim in a research doc must be traceable to an entry in
  `docs/research/acculynx/00-sources-log.md` (URL + access date + what was extracted).
- Claims that cannot be sourced are labeled **ASSUMPTION** or **INFERENCE** inline.
- Unknowables are recorded in each doc's "Unknowns" section rather than guessed silently.

### 3. Describe, never copy
- Research docs *describe* features, workflows, and structures in our own words.
- Never copy AccuLynx's marketing copy, help-center text, UI text (beyond short factual
  labels needed to identify a feature), images, icons, code, or documentation into any
  deliverable.
- Verbatim quotes are allowed only from *customer reviews* (with citation), never from
  AccuLynx-authored material beyond short nominative references.

### 4. Screenshots
- Screenshots of AccuLynx UI (from public videos/help docs) are copyrighted material.
  They may be referenced by URL + timestamp with a prose description in internal research
  docs. Embedding image files is a last resort where prose genuinely fails.
- Screenshots or reproductions of AccuLynx UI must **never** appear on any public surface
  (website, LinkedIn, PR, public repo).
- **This repository stays private** while it contains competitor UI references.

### 5. Trademarks
- The product name, domain, and branding must not be confusingly similar to "AccuLynx"
  or any mark in the roofing/construction-software space.
- AccuLynx's name may be used nominatively (truthful comparison, e.g. a "vs AccuLynx"
  page) but never in our logos, product names, domains, or ad keywords implying
  affiliation.
- Automated screens in this repo are a first-pass filter only — **they are not legal
  clearance**. Final name requires a professional trademark clearance search
  (see `docs/runbooks/05-legal-counsel-checklist.md`).

### 6. Trade dress and UI
- Our product UI takes *functional* inspiration (what a screen accomplishes, what data
  it shows) — never visual copies of layout, color schemes, icons, or distinctive design
  elements.
- The implementation team works from the research docs' functional descriptions, not
  from side-by-side pixel comparison.

### 7. Comparative advertising
- Every public comparative claim must be factual, current, dated, and sourced.
- Pricing claims about AccuLynx are hedged appropriately (their pricing is quote-based
  and unpublished; rely on dated customer reports, clearly attributed).
- No disparagement; compare capabilities, don't characterize the competitor.
- Checklist: `docs/legal/comparative-advertising-checklist.md`.

### 8. Integrations honesty
- Third-party integrations that require partner agreements (e.g., EagleView, Hover,
  ABC Supply, Beacon, SRS) are described as "designed to integrate with" or "planned"
  until an agreement exists. No implied partnerships.

## Enforcement

- Every research doc ends with a self-certification line:
  *"Prepared under docs/legal/clean-room-protocol.md; all sources logged."*
- PR review includes a spot-check of claims against the sources log.

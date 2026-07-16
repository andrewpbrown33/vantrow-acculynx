# Runbook 06 — LinkedIn Company Page + Insights (DEFERRED — Phase 4)

**Status: deferred by decision (2026-07-15).** LinkedIn setup and the AEO/marketing-page
connection from vantrow-web are parked until Andrew sharpens the reusable AEO page
elsewhere and brings it back. This stub records what Phase 4 will contain so nothing is
lost.

## Why deferred

The intent was to plug the reusable AEO/marketing page from `vantrow-web` into the new
brand's web presence and stand up LinkedIn alongside it. That repo isn't attached to this
workspace yet, and Andrew chose to refine the AEO page first and return.

## What Phase 4 will deliver (when unblocked)

1. **LinkedIn company page** (requires Andrew's personal LinkedIn account — cannot be
   done by an agent):
   - Page name = brand name; handle `linkedin.com/company/<brand>`; "a Vantrow company"
     in the tagline; logo + banner from `docs/brand/` assets.
   - About section copy (agent-drafted from the positioning statement in
     `docs/research/acculynx/12-differentiation-thesis.md`).
   - Website field → the live domain; industry: Software Development; specialties:
     roofing software, contractor CRM, job management.
2. **Insights/content plan** (agent-drafted, Andrew publishes):
   - Launch post + 8-week content calendar seeded from review-mining pain points
     (`08-review-mining.md`) — each post: one contractor pain, one opinionated take.
   - Comparison-content cadence, run through
     `docs/legal/comparative-advertising-checklist.md` every time.
3. **AEO page port from vantrow-web:**
   - Attach `vantrow-web` to a session (`add_repo`), assess the reusable AEO/marketing
     page format, port it into `apps/site` (stack matches: Vercel/Next-compatible), wire
     the brand tokens, add structured data (Organization, Product, FAQ schema) and an
     `llms.txt`.

## Prerequisites to unblock

- [ ] Gate 2 complete (site live on the real domain).
- [ ] Andrew: AEO page in shareable shape, `vantrow-web` added to the session.
- [ ] Brand assets (logo/banner) finalized in `docs/brand/`.

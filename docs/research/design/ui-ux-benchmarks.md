# UI/UX Benchmarks & Design Principles — Site + Product

**Status:** v1, 2026-07-19. Companion to the AccuLynx teardown (`docs/research/acculynx/`) and
the brand guidelines (`docs/brand/brand-guidelines.md`). Written to sharpen the marketing-site
design now and to seed product-design principles for the Phase-5 platform build.

## 0. Method & clean-room note

This document synthesizes (a) our own functional research — review mining, UI walkthrough,
copy-priority matrix, differentiation thesis — and (b) **external, general-purpose UI/UX
resources**, each verified live on the access date shown.

Per `docs/legal/clean-room-protocol.md` §6, it contains **no competitor visual-design
intelligence**: no layouts, color schemes, icons, or trade dress from AccuLynx or any roofing
competitor. Functional pain points (what users struggle to do) inform what we design; how any
competitor's screens look does not. All aesthetic direction here is derived from the Vantrow
family brand and independent design references.

## 1. What our own research already tells us

| Finding | Source | Design consequence |
|---|---|---|
| Mobile is the #1 switch driver — field apps that trail desktop are punished hard | `acculynx/08-review-mining.md` P1 | Mobile-first everything; 390px is an acceptance gate for every site page; the product promise "same app, same power" must stay visibly true on the site itself |
| Weak search (exact-match, no jump-to-record) is a top-4 pain | `08` P4 | Product: fuzzy search from day one (already in doc 11 MVP). Site: keep the "one job file, one search" pillar concrete, not generic |
| Estimating rigidity (no good/better/best in one proposal) | `08` P5 | Named feature on product page; the dashboard preview shows an approved "Better" option |
| Photo browsing loses scroll position at volume | `08` P6 | Product principle: never lose the user's place; media browsing preserves position |
| Users simultaneously praise desktop ease — friction concentrates in high-volume browsing + mobile parity | `03-ui-walkthrough.md` §C | "Simple" alone is not a credible claim; specificity is. We market the specific fixes, not "easier than X" |
| All-in-one job file is the most-cited *positive* of the category | `08` L1 | Table stakes — the site's module story leads with the job file, not with novelty |
| The bundled live client dashboard (homeowner + PM + adjuster) is uncontested whitespace | `12-differentiation-thesis.md` §c | The dashboard is the homepage's centerpiece and gets a working visual, not a paragraph |
| Feature regressions convert loyalists into shoppers | `08` P3 | Trust positioning: "free one-click export" and honest roadmap flags are permanent site furniture |
| Migration lock-in (5 data types don't export) is both fear and wedge | `13`, `14` | "Switching" is a product surface: say plainly what carries over and what doesn't |

## 2. External benchmarks (verified this pass)

| Resource | Accessed | What we take from it |
|---|---|---|
| Nielsen Norman Group, *10 Usability Heuristics for UI Design* — nngroup.com/articles/ten-usability-heuristics/ | 2026-07-19 | Visibility of system status (the live dashboard *is* this heuristic productized); recognition over recall (fuzzy search, visible next steps); aesthetic & minimalist design (progressive disclosure for 3–30-seat crews) |
| *Laws of UX* (Jon Yablonski) — lawsofux.com | 2026-07-19 | Jakob's Law (the platform should feel like software roofers already know — pipeline, job file); Hick's Law (small-crew onboarding shows fewer choices first); Aesthetic-Usability Effect (the warm-professional brand isn't cosmetic; it buys perceived ease); Peak-End Rule (the paid-invoice + finished-job moments deserve design attention) |
| W3C, *How to Meet WCAG 2.2 (Quick Reference)* — w3.org/WAI/WCAG22/quickref/ | 2026-07-19 | AA contrast targets used in the brand palette (table in `docs/brand/brand-guidelines.md`); SC 1.4.3 exemption confirmed verbatim: "Text that is part of a logo or brand name has no contrast requirement" — this is why camel may color the wordmark's "row" on light backgrounds while UI accent text uses the darker accent-ink token |
| Evil Martians, *How to Favicon* (updated 2026-01-21) — evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs | 2026-07-19 | Minimal icon set: SVG favicon + 180×180 apple-touch icon now (shipped); ICO fallback + manifest PNGs when the PWA lands |
| Wisepops, *Best SaaS websites 2026* — wisepops.com/blog/best-saas-websites | 2026-07-19 (via search) | Hero pattern that converts: outcome-focused headline, one supporting sentence, primary CTA, trust signal immediately below — communicate what/who/next within 5 seconds |
| Stan Vision, *SaaS website design in 2026* — stan.vision/journal/saas-website-design | 2026-07-19 (via search) | 2026's split into two committed aesthetics (techno-futurist vs editorial-warm) — picking one is non-negotiable; the winning sites show the product working in the hero region rather than static screenshots |
| Veza Digital, *Best B2B SaaS Website Examples 2026* — vezadigital.com/post/best-b2b-saas-websites-2026 | 2026-07-19 (via search) | Trust signals above the fold outperform identical elements placed lower; animation should direct attention, never decorate |
| *Refactoring UI* (Wathan & Schoger, book) | — | One accent color, deployed deliberately and sparingly, beats many; hierarchy from weight/spacing before color; labels are a last resort |

## 3. Design principles for the Eaverow site (applied this pass)

1. **One committed aesthetic: editorial warm-professional.** Warm paper background, deep pine
   structure, camel accents, Manrope type. No dark-neon, no gradients-as-decoration. This is
   the family look (Vantrow: navy + camel on paper) worn Eaverow's own way.
2. **Outcome-led, text-first hero.** Headline stays an outcome ("runs the whole job… shows your
   customer every step live"), renders as text (fast LCP — no hero image), with the tagline as
   eyebrow and a factual trust strip beneath the CTAs ("a Vantrow company · founding pricing
   locked for life · free one-click data export"). Nothing in the strip is aspirational.
3. **Show the product working, without screenshots.** The live-dashboard band pairs its argument
   with a stylized in-code dashboard preview (milestone spine, status feed, paid-invoice chip),
   labeled "Illustrative." No fake screenshots, no fabricated customer data presented as real,
   and — per clean-room §6 — no resemblance to anyone else's UI.
4. **One accent, deployed deliberately.** Camel appears where the eye should go: the wordmark's
   "row," eyebrows, milestone/progress marks, bullet dots, the paid state, the warm CTA close.
   Body links and buttons stay pine. Camel text on light surfaces always uses the accent-ink
   shade (AA); pure camel text is reserved for the logotype and the dark band.
5. **Honesty is a design element.** Roadmap flags, "as of" dates, the conceded rows on
   /vs-acculynx, and the "Illustrative" caption stay visually intact in any restyle. The
   comparative-advertising checklist governs every claim near a competitor's name.
6. **Mobile is an acceptance gate.** Every page is checked at 390px before ship; the hero, nav,
   table (horizontal scroll), and dashboard preview must hold up one-handed.

## 4. Product-design principles (for `apps/platform` and the Phase-5 build)

Seeded from §1–§2; to be expanded when the platform gets its design pass:

- **Status always visible** (NN/g #1): every job answers "where are we and what's next" without
  a click — the pipeline, job file, and client dashboard share one milestone spine.
- **Recognition over recall:** fuzzy search everywhere a list exists; recent items resurface;
  no screen requires remembering an exact spelling or code.
- **Never lose the user's place:** scroll position, filters, and half-done forms survive
  navigation — the direct answer to the photo-browsing pain (P6).
- **Progressive disclosure:** a 3-seat crew sees a simple pipeline; depth (supplements,
  commissions, multi-location) reveals as it's configured, not before.
- **Peak-end moments get design attention:** approval, payment, and job-complete states are
  celebrated in both the contractor UI and the homeowner dashboard.
- **Platform stage hues stay semantic** (`apps/platform/src/lib/stages.ts`) — workflow color
  coding is information, not brand; it is deliberately not repainted in brand colors.

## 5. Product-offering expansion — recommendations

| Recommendation | Grounding | Surface now? |
|---|---|---|
| **Role-scoped dashboard views for adjusters & property managers** — no incumbent offers these; it extends the wedge from homeowner-transparency to claim-and-portfolio transparency | `12` §c, `11` v1.1 | Already on the product page (Live client dashboard roadmap); homepage dashboard band mentions it. Keep. |
| **Migration as a product ("Switching")** — CSV import with smart mapping + integration harvesting are already built in the platform; saying so converts the category's biggest fear into our differentiator | `13`, `14`, platform `contact-importer.tsx` + `integration-harvester.tsx` | **Added this pass**: "Switching without losing your history" module on /product, generic wording (competitor named only on /vs-acculynx). |
| **AI pack as honest roadmap, not vapor** — estimate derivation, supplement drafting, photo intelligence, semantic search; the schema (provenance + event logs) is built for it | `11` v2, `12` §a-b | Already flagged as roadmap lines on /product (sales-estimating, automations). Keep the "ships when ready, not at launch" framing. |
| **Insurance/restoration pack (claims, ACV/RCV, supplement trackers)** as the v1.1 headline for the insurance-first ICP | `11` v1.1, `01` ICP | Product page already carries it as "Fast follow." No further site surface until it exists. |
| **Migration concierge tier** (assisted export/import service at onboarding) | `14` options memo — open questions for Andrew pending | Doc-only. Depends on doc-14 decisions (staffing, pricing, scope); roadmap line on /product stays honestly "best-effort." |
| **Crew app (EN/ES) + production calendar** | `11` v1.1 | Doc-only beyond the existing Production "Fast follow" flags. |

## 6. What this pass changed on the site (traceability)

Brand: two-tone lowercase wordmark (camel "row"), pine/camel/paper palette, Manrope, favicon +
apple-touch + OG image, linked parent endorsement. Design: hero trust strip, dashboard preview
in the dark band, accent-hairline pillar cards, module-grid camel bullets, warm CTA close,
shared Button/Card/Eyebrow/Container primitives, /product "Switching" module. Unchanged by
policy: /vs-acculynx claims/disclaimer (one dead-class fix only), platform stage hues, all
legal copy.

## 7. Unknowns / next steps

- Platform app has had no design pass; §4 principles are not yet applied there.
- PWA manifest + maskable icons (Evil Martians full set) wait for the installable-app milestone.
- Logo mark selection pending (concepts in `docs/brand/assets/`); favicon ships as the neutral
  dot-tile until then.
- No user testing yet — once design partners exist, validate the dashboard preview against the
  real portal so "Illustrative" converges to "actual."

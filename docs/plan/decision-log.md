# Decision Log

Dated record of program decisions. Newest first.

| Date | Decision | Detail | Decided by |
|---|---|---|---|
| 2026-07-15 | Positioning | Modern AI-native **and** simpler/cheaper vs AccuLynx; live Vantrow client dashboards as headline hook | Andrew |
| 2026-07-15 | Stack | Next.js + Tailwind on Vercel; Supabase; GitHub; Network Solutions as registrar (matches Vantrow) | Andrew |
| 2026-07-15 | Repo scope | Single monorepo: research + brand + site + future product | Andrew |
| 2026-07-15 | Architecture sequencing | Roofing clone first; white-label multi-vertical core extracted later | Andrew |
| 2026-07-15 | Research method | Public sources only (clean-room); no AccuLynx account access | Andrew |
| 2026-07-15 | Naming process | 12–15 candidates across 3 buckets w/ domain + trademark screens; Andrew picks | Andrew |
| 2026-07-15 | Initial site depth | Marketing site + single early-access form (waitlist + demo request merged) | Andrew |
| 2026-07-15 | Dashboard integration | Contract-first: "Vantrow Connect" spec (REST + webhooks + fixtures) defined before either implementation exists | Andrew + plan |
| 2026-07-15 | Deferred items | vantrow-web AEO page port; LinkedIn page + insights; transactional email; product build | Andrew |
| 2026-07-16 | **Brand architecture (confirmed)** | Endorsed brand: standalone name + logo + domain with "a Vantrow company" endorsement line | Andrew |
| 2026-07-16 | Naming round 2 | Round 1 field too crowded (only Kestrow had a clean available .com). Ran a domain-first round focused on roofing/exteriors-native names; only names with an available .com surfaced | Andrew |
| 2026-07-16 | **Gate 1: brand name — Eaverow** | Chose Eaverow (round-2 #1 pick): "eave" + "-row" Vantrow echo, low risk, eaverow.com + eaverow.io available, no AccuLynx similarity, roofing-native with exteriors headroom | Andrew |
| 2026-07-19 | **Gate 2: visual identity** | Camel `#b8956a` copied verbatim from the Vantrow palette (the mark's dot) as Eaverow's accent, worn on the wordmark's "row"; new deep-green direction (pine `#1d4b38` / spruce `#0f2e23` on warm paper `#f7f6f2`) supersedes Gate-1 slate/copper; `accentInk #856540` derived for AA text; Manrope typeface; parent linkage (`parentName`/`parentUrl`) added; logo mark selection pending (concepts A–D in `docs/brand/assets/`) | Andrew (color + direction via review questions; mark pick pending) |

## Gate 1 record

- **Chosen name: Eaverow** (endorsed as "Eaverow, a Vantrow company")
- **Brand architecture confirmed:** endorsed brand
- **Applied to** `packages/brand/src/brand.config.ts` — name, legalName "Eaverow, Inc.",
  domain eaverow.com, supportEmail hello@eaverow.com, palette (slate-blue #1b4965 +
  copper accent #c96a24). Site verified rendering Eaverow across all pages.
- **Domain registered (date):** _pending — Andrew to register eaverow.com + eaverow.io
  SAME DAY per `docs/runbooks/01-domain-network-solutions.md` (re-verify availability first)_
- **Trademark clearance:** _pending — counsel per `docs/runbooks/05-legal-counsel-checklist.md`;
  clear "eave"/"Eavor" phonetic neighbors + AccuLynx similarity in classes 9/42_

## Gate 2 record (visual identity, 2026-07-19)

- **The copied color:** camel `#b8956a` — Vantrow's `--camel`, the dot in the Vantrow mark
  (getvantrow.com, accessed 2026-07-19). The single value shared with the parent, rendered on
  the wordmark's "row" suffix and used as Eaverow's accent. Decided by Andrew (review Q1).
- **Complementary direction:** new deep-green palette — pine `#1d4b38`, spruce `#0f2e23`,
  warm paper `#f7f6f2`, ink `#0c1d15`, muted `#566a5e`, plus derived `accentInk #856540` for
  AA accent text. Supersedes the Gate-1 slate-blue/copper placeholder. Decided by Andrew
  (review Q2: "new direction — deep green").
- **Wordmark:** lowercase two-tone "eave|row" via `brand.wordmark.suffix` + `splitWordmark()`
  and the shared `<Wordmark />` component; prose keeps "Eaverow".
- **Typeface:** Manrope (next/font, both apps).
- **Parent linkage:** `parentName`/`parentUrl` added to the brand config; "a Vantrow company"
  now links to getvantrow.com in the site footer/about and hero trust strip.
- **Logo mark:** _pending — Andrew to pick from concepts A–D
  (`docs/brand/assets/brand-board.html`); site ships wordmark-only with a neutral dot-tile
  favicon until then (review Q4)._
- **Applied to:** `packages/brand/src/brand.config.ts` + both apps; guidelines at
  `docs/brand/brand-guidelines.md`; research grounding at
  `docs/research/design/ui-ux-benchmarks.md`.

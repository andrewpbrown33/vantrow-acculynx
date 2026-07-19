# Eaverow Brand Guidelines

**Status:** v1.1, 2026-07-19 (Gate 2 — visual identity, complete). Mark selected: **Concept A
"Sheltered Dot."** Applied in `packages/brand/` and live across site + platform.
Visual companion: `docs/brand/assets/brand-board.html`.

## 1. Brand architecture & the family tie

Eaverow is an **endorsed brand**: its own name, identity, and domain, carried by the line
"a Vantrow company" (decision log, 2026-07-16). The visual identity encodes that architecture
in one deliberate move:

> **Exactly one color is copied from the parent palette — camel `#b8956a`** (Vantrow's
> `--camel`, the dot in the Vantrow mark; getvantrow.com, accessed 2026-07-19). It colors the
> **"row"** of the wordmark — the same syllable that phonetically echoes Van**trow** — and
> serves as Eaverow's accent. Every other value is Eaverow's own. Sibling, not clone.

This is the reusable pattern for subsidiary #2/#3: pick your own primary + neutrals, copy the
parent camel, wear it on your own name.

## 2. Palette

Defined in `packages/brand/src/brand.config.ts` (`colors`), injected as `--brand-*` CSS
variables, mapped to Tailwind utilities in each app's `globals.css` `@theme inline`.

| Token | Hex | Role |
|---|---|---|
| `primary` | `#1d4b38` | Deep pine — headings, buttons, links, structure |
| `primaryDark` | `#0f2e23` | Dark spruce — dark bands, hover states, wordmark prefix |
| `accent` | `#b8956a` | **Camel, copied from Vantrow** — wordmark "row", milestone/paid marks, bullets, dark-band labels |
| `accentInk` | `#856540` | Darkened camel (ours) — accent-colored *text* on light surfaces |
| `background` | `#f7f6f2` | Warm paper |
| `foreground` | `#0c1d15` | Green-black ink |
| `muted` | `#566a5e` | Green-gray secondary text |

Retired: Gate-1 slate-blue `#1b4965` / `#0f2e42` and copper `#c96a24` (the copper was unused —
its only call site referenced a Tailwind class that was never defined).

### Contrast (WCAG 2.2, computed 2026-07-19)

| Pair | Ratio | Verdict / rule |
|---|---|---|
| primary on background | 9.18 | AAA |
| white on primary | 9.93 | AAA — buttons |
| white on primaryDark | 14.63 | AAA — dark band |
| accent (camel) on primaryDark | 5.26 | AA — camel text allowed on dark band |
| accentInk on background / white | 4.94 / 5.34 | AA — the only way camel-toned text appears on light |
| foreground on accent | 6.28 | AA — camel chips carry dark ink, never white |
| muted on background / white | 5.37 / 5.80 | AA |
| accent (camel) on background | 2.57 | **Logotype & decoration only** — WCAG 2.2 SC 1.4.3: "Text that is part of a logo or brand name has no contrast requirement" |

**Rule of thumb:** camel as *ink* on light surfaces → use `accentInk` (`text-brand-accent-ink`).
Camel as *paint* (dots, hairlines, chips, the wordmark suffix, dark-band labels) → `accent`.

## 3. Wordmark

- Rendered by the shared `<Wordmark />` component (`packages/brand/src/components.tsx`):
  **always lowercase**, bold, letter-spacing −0.02em, suffix in `--brand-accent`.
- The split is data-driven: `brand.wordmark = { suffix: "row" }` +
  `splitWordmark()` — derived from `name`, so the two can't drift; a brand with no
  `wordmark` field renders one-tone automatically (white-label safe).
- Prefix color comes from the call site (`text-brand-dark` on light, white on dark); camel
  suffix holds on both.
- **Prose always uses "Eaverow"** (capital E). Lowercase belongs to the wordmark only.

## 4. Logo mark — "Sheltered Dot" (selected 2026-07-19)

The Eaverow mark is **Concept A, "Sheltered Dot"**: a gable stroke with the camel dot
sheltered beneath the eave — the mirror-gesture of Vantrow's dot floating above its V.
Family grammar: 100 viewBox, stroke 13, round caps/joins, camel dot r 10.5 at (50, 62);
gable path `M24 66 L50 30 L76 66`. Shipped as the shared `LogoMark` component
(`packages/brand/src/components.tsx`); canonical SVGs in `docs/brand/assets/`
(`concept-a-sheltered-dot.svg` + `-dark.svg`).

**Variants — light is the default.**
- **Light variant** (pine stroke `#1d4b38` + camel dot): the default everywhere — light and
  mid surfaces, favicons, OG, print.
- **Dark variant** (paper stroke `#f7f6f2` + camel dot): situational only, for dark surfaces
  (e.g. the `bg-brand-dark` band). Never the default rendering of the brand.
- In code the variant is automatic: `LogoMark` strokes with `currentColor`, so the call
  site's text color picks it (`text-brand` on light chrome; white/paper text on dark).

**Usage rules:** clear space ≥ the dot diameter on all sides; minimum size 16px; never
recolor the dot; never place the mark on mid-tone backgrounds that sink the camel.
Lockup: mark + two-tone wordmark, mark at ~1.3× the wordmark cap height, gap ≈ half the
dot diameter (as shipped in the site/platform headers).

**Unselected concepts** — B "Three Courses" and C "Eave Return" remain in
`docs/brand/assets/` as archived alternates for the record; they are not brand assets and
must not be used.

## 5. Typography

**Manrope** (variable, OFL) via `next/font/google` in both apps (`--font-manrope`), with the
system sans stack as fallback. Weights in use: 400 body · 600 semibold UI · 700 headings ·
800 wordmark. Headings track −0.01 to −0.02em. If a build environment can't reach Google
Fonts, vendor the woff2 and switch to `next/font/local` with the same variable name.

## 6. Where hexes may exist outside the brand package

The palette lives in `brand.config.ts` and flows everywhere as CSS variables. Exceptions,
each unavoidable and to be kept in sync by hand:

- `apps/site/src/app/icon.svg`, `apps/platform/src/app/icon.svg` (no CSS vars in favicons)
- `docs/brand/assets/*.svg` + `brand-board.html` (standalone documents)

## 7. Do / don't

- **Do** keep "a Vantrow company" visible and linked to `brand.parentUrl`.
- **Do** deploy camel sparingly and meaningfully: milestones, paid states, bullets, eyebrows.
- **Don't** copy any further Vantrow values (navy, paper, soft-camel tints) — one color is the
  whole point.
- **Don't** fill buttons with camel, or set camel body text on light surfaces.
- **Don't** restyle `/vs-acculynx` content: claims, "as of" dates, plain-text competitor name,
  and the disclaimer are governed by `docs/legal/comparative-advertising-checklist.md`.
- **Don't** imitate competitor layouts/colors/icons (`docs/legal/clean-room-protocol.md` §6);
  the palette and marks here were derived only from the parent brand + independent design.
- **Don't** repaint the platform's pipeline-stage hues (`apps/platform/src/lib/stages.ts`) —
  they're semantic workflow colors, intentionally outside the brand system.

## 8. Follow-ups

- Full favicon set (ICO fallback + manifest PNGs per the Evil Martians minimal set) when the
  installable PWA milestone lands; SVG favicon + apple-touch icon ship today.
- Platform auth/portal pages still render plain `{brand.name}` text — swap to `<Wordmark />`
  (and the `LogoMark` lockup where fitting) in the platform design pass.
- Promote type/spacing scale into brand tokens when subsidiary #2 spins up.

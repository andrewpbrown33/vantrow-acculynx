# Connecting Eaverow to Vantrow + Branding Cohesion — Design & Sequencing

**Type:** design/roadmap for the *next* phase (not built this pass). Companion to
`2026-07-platform-functional-review.md`. **Context:** exploration found the monorepo's three pieces
— marketing site, platform, and the Vantrow Connect spec — are **loosely coupled through the shared
`@vantrow/brand` package and nothing else**. The parent's headline wedge (a live client dashboard)
is 0% built. This doc designs how to close the three gaps and tighten branding.

---

## The three disconnections (today's reality)

1. **Marketing → platform: no link exists.** Every `apps/site` CTA goes to `/early-access` (a
   waitlist row via `apps/site/src/app/api/waitlist/route.ts`); the real org-creating
   `apps/platform/src/app/signup/page.tsx` is orphaned. There is no automated waitlist→account path.
2. **Platform → Vantrow Connect: fully specced, zero implemented.** `docs/specs/vantrow-connect/`
   defines a complete v0 contract (5 core entities, read-only `/v1`, 6 webhook events, HMAC signing,
   golden fixtures) — but the platform emits nothing, exposes no `/v1`, handles no keys, and its
   stage enum (`stages.ts`) is unmapped to the frozen Connect `status` enum. `vantrow-web` (the
   consumer) is deferred.
3. **Promise → product: the live client dashboard doesn't exist.** It's the site's #1 differentiator
   and the entire reason this is a "Vantrow company" (differentiation-thesis §c), yet the platform's
   only client-facing surface is the one-shot, expiring `/sign/[token]` e-sign page.

---

## Gap 1 — Marketing → platform funnel

**Decision to make:** how does a marketing visitor become a platform account?

**Recommended (phased):**
- **Now (cheap):** add a **"Log in"** + **"Start free"** link in the site header/hero pointing at
  the platform origin's `/signup` and `/login` (e.g. `https://app.eaverow.com`). Keep `/early-access`
  as a *secondary* "talk to us / not ready" path. This alone connects the two universes.
- **Next:** **auto-provision from the waitlist** — when a waitlist signup is approved (or
  immediately, if open self-serve), send a magic-link/invite that lands on `/signup` prefilled with
  their email + company. This converts the lead into a real org without re-typing.
- **Config:** add the platform base URL to `packages/brand/src/brand.config.ts` (e.g. `appUrl`) so
  the site links to it without hardcoding — keeps the white-label swap clean.

**Files:** `apps/site/src/lib/nav.ts` (add app links), `apps/site/src/components/header.tsx`,
`apps/site/src/app/api/waitlist/route.ts` (invite hook), `packages/brand/src/brand.config.ts`
(`appUrl`), `apps/platform/src/app/signup/page.tsx` (accept prefill query params).

---

## Gap 2 — Platform → Vantrow Connect (make the platform a producer)

The spec is done; this is an implementation phase. **Recommended build order:**

1. **Stage → status mapping (the load-bearing decision).** Map the platform's job stages
   (`lead, estimating, proposal_sent, won, invoiced, paid, dead` — `stages.ts`) onto the **frozen**
   Connect `project.status` enum (`lead→quoted→approved→in_progress→completed→closed/canceled`),
   carrying the native stage in `status_detail`. Proposed mapping:
   `lead→lead`, `estimating→quoted`, `proposal_sent→quoted`, `won→approved`,
   `invoiced→in_progress` (or `completed`), `paid→completed`, `dead→canceled`. Write this as a pure
   function with fixture tests. (This also motivates fixing the unreachable `dead` stage — see
   review #16 — since `canceled` needs a real source.)
2. **Entity mapping.** Platform `Contact`→Connect `contact`; `Job`→`project`; `Invoice`→`invoice`;
   plus `tenant` (org) and `metric` (derive pipeline KPIs). Roofing specifics ride in
   `extensions["roofing.job"]` / `extensions["roofing.claim"]` per the spec.
3. **Event emission.** Emit the 6 events (`contact.created`, `project.created`,
   `project.status_changed`, `invoice.created`, `invoice.paid`, `roofing.claim.status_changed`) from
   the existing server actions where the state transitions already happen (`actions.ts`,
   `migration-actions.ts`) — a small `emit(event)` seam alongside the current `createActivity` calls.
   Sign with HMAC-SHA256 per `events.md`; at-least-once with the documented retry schedule.
4. **Read `/v1` surface.** Implement `GET /v1/{health,metrics,projects,contacts,invoices}` as route
   handlers, per-tenant `vc_live_`/`vc_test_` bearer keys with the 4 read scopes (`auth.md`).
5. **CI fixture validation.** Validate emitted payloads against the golden fixtures/schemas in
   `docs/specs/vantrow-connect/` — the spec calls the fixtures its test suite; wire them into CI so
   producer and (future) consumer stay honest.

**Sequencing note:** events + the stage-mapping function are the minimum that lets `vantrow-web`
start consuming. Build those first; the read `/v1` API can follow.

**Files:** `apps/platform/src/lib/stages.ts` (+ a new `connect-mapping.ts`), `actions.ts` /
`migration-actions.ts` (emit seam), new `apps/platform/src/app/v1/**` route handlers, a webhook
signer/dispatcher lib, `.github/workflows/ci.yml` (fixture validation),
`docs/specs/vantrow-connect/{overview,events,auth}.md` (resolve the 7 open `RECONCILE` items now
that the data model is real).

---

## Gap 3 — The live client dashboard (the actual wedge)

This is the biggest build and the whole point of the Vantrow relationship. The thesis promises a
**live, role-scoped, always-on** dashboard (homeowner / property-manager / adjuster), bundled on
every plan, live from first appointment through warranty, with AI-composed status narration — vs.
the platform's current one-shot expiring e-sign page.

**Two architectural paths:**
- **A) Native in-platform dashboard** — a persistent `/portal/[token]` (or authed homeowner login)
  in `apps/platform` reading the job's real state (stage, appointments, docs, invoices, payments).
  Fastest to something real; keeps it in one app; but it's *not* the cross-subsidiary Vantrow asset.
- **B) `vantrow-web` consumer fed by Connect** — the platform emits events (Gap 2), `vantrow-web`
  renders the dashboard for every subsidiary. This is the strategically correct, reusable version
  (it's *the* Vantrow product), but it requires standing up `vantrow-web` and Gap 2 first.

**Recommended:** ship a **thin native homeowner view first (A)** — persistent (not expiring),
showing live job status + approved estimate + invoice/pay link — to make the marketing promise
minimally true and give the design partner something to show homeowners. Then migrate/duplicate it
into **`vantrow-web` via Connect (B)** as the durable cross-subsidiary build, and layer on the
property-manager/adjuster role-scoping and AI narration. Sequence: A (native, weeks) → Gap 2 events
→ B (`vantrow-web`) → role views → AI summaries.

**Honesty guardrail:** until a persistent dashboard exists, the marketing copy's "live dashboard,
every step" is aspirational — either build A soon or soften the copy (ties to review #13's pattern
of promising ahead of the product).

---

## Branding cohesion

Theming is already excellent and consistent by construction (both apps consume `@vantrow/brand`
tokens + an identical `@theme inline` block; a rebrand is a one-file change). Gaps:

1. **The copper accent (`--brand-accent`, `#c96a24`) is effectively dead** — used in exactly one
   place across both apps (`vs-acculynx/page.tsx:230`); the platform never uses it, and the two
   checkbox `accent-*` usages map to *primary*, not the accent token. **Recommend** deliberately
   deploying the accent (primary CTAs, active/selected states, the pipeline "won/paid" positive
   states, key numbers) so the brand has a second color with real presence — or drop it from the
   palette. As-is it's a defined-but-unused token.
2. **No parent linkage beyond a string.** The brand package carries `endorsement: "a Vantrow
   company"` but **no `parentName` / `parentUrl` / parent logo** — Vantrow has no clickable presence
   anywhere in the product. **Recommend** adding `parentName` + `parentUrl` fields and linking the
   footer/about "a Vantrow company" to the parent site; this also sets up the cross-subsidiary story
   (each subsidiary endorses the same parent).
3. **Color-only theming.** No typography scale, spacing tokens, dark mode, or brand font — fine for
   now, but if branding investment increases, promote type/space to tokens so subsidiaries #2/#3
   inherit a fuller system, not just six colors.

**Files:** `packages/brand/src/brand.config.ts` (`accent` deployment, `parentName`/`parentUrl`),
`apps/site/src/components/footer.tsx` + `about/page.tsx` (link the endorsement), platform
components (use `text-accent`/`bg-accent` on positive/selected states).

---

## Suggested sequencing (once the review fixes are greenlit)

1. **Review fixes first** — especially the RLS Critical (#1) and pipeline perf (#2); the funnel
   repairs (#6–#8) double as Gap-1 groundwork.
2. **Gap 1** (marketing→platform link + waitlist invite) — small, high leverage.
3. **Gap 2 events + stage mapping** — unlocks the dashboard and any Vantrow reporting.
4. **Gap 3A** native homeowner view — makes the headline promise real.
5. **Branding**: activate accent + parent linkage (cheap, do alongside).
6. **Gap 3B** `vantrow-web` consumer + role views + AI narration — the durable cross-subsidiary asset.

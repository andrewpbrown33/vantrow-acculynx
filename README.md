# Vantrow Subsidiary #1 — Roofing Platform (working title)

Monorepo for Vantrow's first white-label vertical-SaaS subsidiary: a modern, AI-native
competitor to AccuLynx for roofing contractors, connected to personalized client
dashboards built through Vantrow.

> **This repository is private and must stay private.** It contains internal competitive
> research prepared under `docs/legal/clean-room-protocol.md`.

## Map

| Path | Contents |
|---|---|
| `docs/plan/` | Program plan and dated decision log |
| `docs/legal/` | Clean-room protocol, comparative-advertising checklist, trademark screens |
| `docs/brand/` | Naming decision memo, brand guidelines |
| `docs/research/acculynx/` | Clean-room competitive teardown (docs 00–12) |
| `docs/specs/vantrow-connect/` | Vantrow Connect — the dashboard integration contract (OpenAPI + webhooks + fixtures) |
| `docs/runbooks/` | Step-by-step runbooks for founder-only actions (domain, Vercel, Supabase, launch, legal, LinkedIn) |
| `apps/site/` | Marketing website (Next.js + Tailwind). `apps/platform/` is reserved for the product build |
| `packages/brand/` | `@vantrow/brand` — brand tokens (name, tagline, colors). The one-file white-label swap |
| `supabase/` | SQL migrations (waitlist) |

## Quick start

```bash
pnpm install
pnpm dev        # site on http://localhost:3000
pnpm build      # production build
pnpm lint
pnpm typecheck
```

The early-access form works locally with no configuration (writes to `.data/waitlist.jsonl`).
In production it requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — see
`docs/runbooks/03-supabase-setup.md`.

## Status

- [x] Phase 0 — Foundations
- [ ] Phase 1A — AccuLynx teardown (docs 00–12)
- [ ] Phase 1B — Naming sprint
- [ ] Phase 1C — Site scaffold (brand-agnostic)
- [ ] Phase 1D — Vantrow Connect contract v0
- [ ] Gate 1 — Name selected, domain registered
- [ ] Phase 2 — Brand applied + marketing copy
- [ ] Phase 3 — Runbooks, CI, launch prep
- [ ] Gate 2 — Launch (domain, Vercel, Supabase live)
- [ ] Phase 4 (deferred) — vantrow-web AEO page port, LinkedIn
- [ ] Phase 5 (deferred) — Product platform build (`apps/platform/`)

# Runbook 04 — Launch Checklist (Gate 2)

**Who:** Andrew. **Prereqs:** Runbooks 01–03 complete, PR merged. Work top to bottom —
the order matters.

## Pre-flight

- [ ] Gate 1 recorded in `docs/plan/decision-log.md` (name, domain, date).
- [ ] Brand applied: `packages/brand/src/brand.config.ts` has the real name, domain,
      support email, colors — no `__BRAND__` or `example.com` anywhere
      (`grep -r "__BRAND__\|example.com" apps packages` returns nothing).
- [ ] CI green on the default branch.

## Infrastructure

- [ ] Domain registered; auto-renew + privacy + transfer lock ON (Runbook 01).
- [ ] Vercel project live; custom domain shows "Valid Configuration"; TLS issued (Runbook 02).
- [ ] Supabase project created; migration applied; RLS on with no policies (Runbook 03).
- [ ] `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set in Vercel; site redeployed since.

## Legal / content (blocking — do not launch without these)

- [ ] `/privacy` reviewed and de-drafted (the form collects PII; the page must be real
      before the form is public). See Runbook 05.
- [ ] `/terms` reviewed and de-drafted.
- [ ] `/vs-acculynx` claims table: every claim has a footnoted, dated source; page passes
      `docs/legal/comparative-advertising-checklist.md`; disclaimer present.
- [ ] No integration promises without agreements ("designed to integrate with" phrasing).
- [ ] Trademark clearance on the chosen name at least underway with counsel (Runbook 05).

## End-to-end verification

- [ ] Every page loads on the production domain (/, /product, /vs-acculynx, /pricing,
      /about, /early-access, /privacy, /terms).
- [ ] Submit a test entry on `/early-access` → row appears in Supabase → delete the row.
- [ ] Form's failure path works: (optional) temporarily unset env vars in a preview
      deploy → form shows the mailto fallback, not a dead button.
- [ ] Lighthouse spot-check on `/` (Chrome DevTools → Lighthouse): no red flags on
      performance/accessibility/SEO.
- [ ] Mobile pass: site renders sanely on a phone.

## Announce

- [ ] Only after everything above: soft-announce (personal network, communities).
      LinkedIn page setup is Phase 4 (`06-linkedin.md`).

## Post-launch follow-ups (tracked, not blocking)

- [ ] Transactional email (waitlist confirmations) — needs SPF/DKIM DNS records; deferred.
- [ ] Analytics (privacy-friendly, e.g. Vercel Analytics or Plausible) — decide and add.
- [ ] `/vs-acculynx` claim re-verification reminder: every 90 days.

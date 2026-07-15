# Runbook 01 — Register the Domain (Network Solutions)

**Who:** Andrew. **When:** the same day you pick the name at Gate 1 — domain availability
decays, and the availability evidence in the naming memo goes stale fast.
**Time:** ~15 minutes.

## Steps

1. **Re-verify availability first.** The naming memo's lookups are dated. Go to
   https://www.networksolutions.com and search the exact domain (e.g. `yourname.com`).
   If it's gone, fall back to the memo's alternates (`get<name>.com`, `.io`) or the #2 pick.
2. **Buy the bare registration only.** Skip every upsell in the flow: no website builder,
   no email package, no SEO add-ons, no "premium DNS" (Vercel handles DNS needs), no
   SSL certificate (Vercel provisions TLS automatically).
3. **Enable in account settings:**
   - **Auto-renew: ON** (an expired domain is a brand catastrophe).
   - **Domain privacy / WHOIS privacy: ON** (usually free or cheap; hides your personal
     address from the public WHOIS record).
   - **Transfer lock: ON.**
4. **Also grab defensive variants if cheap and available** (optional, ~5 min):
   the `.io`, and common misspellings you'd be embarrassed to lose. Point them at the
   main domain later; don't configure them now.
5. **DNS records — do NOT configure yet.** Vercel gives you the exact records during
   Runbook 02. For reference, Vercel's standard records are currently:
   - Apex (`yourname.com`): `A` record → `76.76.21.21`
   - `www`: `CNAME` → `cname.vercel-dns.com`
   Verify against Vercel's live instructions when you get there — they occasionally change.
6. Record the registration date in `docs/plan/decision-log.md` (Gate 1 record block).

## You're done when

- The domain shows in your Network Solutions account with auto-renew + privacy + lock ON,
  and the Gate 1 record in the decision log has the domain and date filled in.

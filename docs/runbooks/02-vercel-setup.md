# Runbook 02 — Vercel Project + Custom Domain

**Who:** Andrew. **Prereqs:** Runbook 01 done (domain registered); this repo pushed to
GitHub with the site merged to the default branch. **Time:** ~20 minutes + DNS propagation.

## Steps

1. **Import the repo.** https://vercel.com/new → Import Git Repository →
   `andrewpbrown33/vantrow-acculynx`. (Grant the Vercel GitHub app access to the repo if
   prompted.)
2. **Configure the project:**
   - Framework preset: **Next.js** (auto-detected).
   - **Root Directory: `apps/site`** ← the one setting people miss in a monorepo.
   - Build command / output: leave defaults (Vercel understands Next.js + pnpm workspaces).
3. **Environment variables** (Settings → Environment Variables, apply to Production +
   Preview). Values come from Runbook 03 — it's fine to deploy before Supabase exists;
   the form returns a graceful 503 + mailto fallback until these are set:

   | Name | Value | Source |
   |---|---|---|
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret key | same page — **never** the `anon` key; treat like a password |

4. **Deploy.** First deploy runs automatically after import. Confirm the
   `*.vercel.app` URL renders.
5. **Attach the domain.** Project → Settings → Domains → add `yourname.com` and
   `www.yourname.com`. Vercel shows the exact DNS records it wants.
6. **Enter those records at Network Solutions** (Account → My Domain Names → Manage →
   Advanced DNS / Edit DNS records):
   - Apex `A` record → the IP Vercel shows (currently `76.76.21.21`).
   - `www` `CNAME` → `cname.vercel-dns.com`.
   Delete any conflicting default records (parking A records, wildcard CNAMEs).
7. **Wait for propagation** (minutes to a few hours). Vercel's Domains panel flips to
   "Valid Configuration" and issues TLS automatically.

## You're done when

- `https://yourname.com` serves the site with a valid certificate, and
  `https://www.yourname.com` redirects to it (or vice versa, per your Vercel setting).

# Runbook 07 — Turn on the real multi-tenant backend (Supabase)

**Who does this:** you (Andrew). **Time:** ~20–30 minutes. **You need:** the repo on your
machine and a free Supabase account.

## What this does

Right now the platform (`apps/platform`) runs on a local demo file store — one fake company,
no login. This runbook connects it to a real **Supabase** database with **email + password
login** and **self-serve signup**: anyone who signs up gets their own company workspace, and
**each company can only ever see its own data** (enforced at the database level by Row Level
Security — not just by app code). That's what "multi-tenant" means.

You do NOT have to touch any code. Everything is already built; you're just creating the
database and pasting in some keys.

> **Good to know:** if you skip all of this, the platform still runs locally in demo mode
> (`pnpm dev:platform`) with no login. Supabase only "turns on" when the three environment
> variables below are present.

---

## Step 1 — Create a Supabase project

1. Go to **https://supabase.com** and sign in (or sign up — it's free).
2. Click **New project**.
3. Fill in:
   - **Name:** `eaverow` (anything is fine)
   - **Database Password:** click **Generate** and **save it in your password manager** (you rarely need it, but don't lose it).
   - **Region:** pick the one closest to your customers (e.g. East US).
4. Click **Create new project** and wait ~2 minutes for it to finish provisioning.

## Step 2 — Copy your three keys

1. In the project, open **Settings** (gear icon) → **API**.
2. Copy these three values somewhere temporary — you'll paste them in Step 4:

   | Supabase label | You'll use it as |
   |---|---|
   | **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
   | **Project API keys → `anon` `public`** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | **Project API keys → `service_role` `secret`** | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ The **`service_role`** key is a secret — it bypasses all security rules. Never put it in
> front-end code, screenshots, or git. It only ever goes in server-side environment variables
> (the two places in Step 4). The `anon` key is safe to expose.

## Step 3 — Create the database tables

1. In Supabase, open **SQL Editor** (left sidebar) → **New query**.
2. Open the repo file **`supabase/migrations/0002_platform.sql`**, copy its entire contents,
   paste into the editor, and click **Run**. (This creates the tables: orgs, contacts, jobs,
   estimates, invoices, etc.)
3. Open a **New query** again. Open **`supabase/migrations/0003_platform_auth_rls.sql`**, copy
   all of it, paste, and click **Run**. (This adds the `memberships` table that links each login
   to a company, and turns on the per-company security rules.)

   Run them **in order (0002 first, then 0003)**. Each should say "Success. No rows returned."

## Step 4 — Add the keys in two places

**A) On your computer (for local testing):**

1. In the repo, create a file at **`apps/platform/.env.local`** (there's an
   `.env.local.example` next to it showing the format).
2. Paste your three keys from Step 2:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   (`.env.local` is git-ignored, so these never get committed.)

**B) On Vercel (only when you're ready to deploy the platform online):**

1. The platform is a **separate app** from the marketing site, so it gets its **own Vercel
   project**. In Vercel: **Add New → Project** → import this repo → set **Root Directory** to
   **`apps/platform`** → framework preset **Next.js**.
2. In that project's **Settings → Environment Variables**, add the same three variables.
3. Deploy.

## Step 5 — (Recommended for first test) make signups instant

By default Supabase emails a confirmation link before a new account can log in. To make your
first tests frictionless:

1. Supabase → **Authentication** → **Providers** (or **Sign In / Providers**) → **Email**.
2. Turn **OFF** "Confirm email", and **Save**.

You can turn this back on for production later (the app handles both — if confirmation is on,
new users get a "check your email" message, and their company workspace is created the first
time they log in).

## Step 6 — Test it locally

1. In the repo root, run:
   ```
   pnpm install
   pnpm dev:platform
   ```
2. Open **http://localhost:3000**. Because the keys are now present, it should send you to a
   **login page** (not the demo pipeline).
3. Click **Sign up**. Enter your name, a **company name** (e.g. "Test Roofing Co"), a work
   email, and a password. Submit.
4. You should land on an **empty pipeline** for your brand-new company. Click **New lead**,
   create one, build an estimate — walk the loop.
5. **Confirm it's really in the database:** back in Supabase → **Table Editor** → **jobs**.
   Your new lead is there, with an `org_id` matching your company's row in the **orgs** table. 🎉

## Step 7 — Prove the tenant isolation (the important one)

1. Open an **incognito/private window** → go to the app → **Sign up** again with a **different**
   email and a different company name (e.g. "Rival Roofing").
2. Its pipeline is **empty** — it cannot see "Test Roofing Co"'s jobs, even though both live in
   the same database. That's Row Level Security doing its job: each company is walled off.

If both of those work, your platform is a real multi-tenant SaaS backend. ✅

---

## Troubleshooting

- **It still shows the demo pipeline / no login.** The env vars aren't being read. Confirm the
  file is exactly `apps/platform/.env.local`, the names match Step 4 exactly, and you restarted
  `pnpm dev:platform` after creating it.
- **"Invalid API key" or requests fail.** Re-copy the keys (easy to grab the wrong one). The
  URL must start with `https://` and end in `.supabase.co`.
- **Signup says it worked but login fails.** Email confirmation is probably still on (Step 5) —
  either confirm via the email you received, or turn confirmation off for testing.
- **New signup lands on an error instead of an empty pipeline.** Make sure **both** SQL files
  ran, in order, with no errors — especially `0003` (it creates the `memberships` table the
  login flow needs).
- **A company can see another company's data.** The `0003` policies didn't apply — re-run
  `0003_platform_auth_rls.sql` and check for errors in the SQL Editor.

## What's still deferred (not part of this runbook)

- **Inviting teammates** into a company (today one signup = one owner; invites are a follow-up).
- **Live payment collection** (Stripe) — payments are still recorded, not charged.
- **Password reset / email templates polish** and production email sending (SMTP) if you use
  magic links later.

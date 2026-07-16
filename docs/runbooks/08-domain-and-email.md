# Runbook 08 — Buy the domain + set up branded email

**Who does this:** you (Andrew). **Time:** ~30–45 min (plus DNS propagation waits).
**Goal:** own `eaverow.com`, point your live site + platform at it, and get
`andrew@eaverow.com` and `info@eaverow.com` flowing into (and sending from) your existing
`andrew@getvantrow.com` inbox.

> **Mental model (the part that trips people up):** a *domain* (eaverow.com) is one thing you
> buy once. *Where a web address points* (your site, your app) and *where email goes* are
> controlled by **DNS records** on that domain — small text entries you add in a dashboard.
> Buying the domain, pointing the website, and setting up email are three separate steps that
> all edit the same domain's DNS. You do them once and forget them.

---

## Part A — Buy the domain

You have two easy options. **Re-verify it's still available first** (search `eaverow.com` in
either tool) — our screens are from a while ago.

**Option 1 — Buy through Vercel (recommended, simplest).** Because your site and platform are
already on Vercel, buying here means Vercel wires up the website DNS for you automatically.
1. Vercel → your **site** project (the marketing site, `apps/site`) → **Settings → Domains**.
2. Type `eaverow.com` → if available, click **Buy** → complete checkout.
3. Vercel auto-adds it to that project and configures DNS. Done — your marketing site is now at
   `eaverow.com`.

**Option 2 — Buy through a registrar (Network Solutions, Namecheap, etc.).** Fine too; you'll
just paste a couple of DNS records yourself (Vercel shows you exactly what — see Part B).

Also grab **`eaverow.io`** defensively while you're at it (optional, cheap, keeps a squatter off
it — from the naming memo's recommendation).

## Part B — Point your two apps at the domain

You have two live apps; give each a clean address:

| Address | Points to | Vercel project |
|---|---|---|
| `eaverow.com` + `www.eaverow.com` | Marketing site | `apps/site` project |
| `app.eaverow.com` | The platform (login/app) | `apps/platform` project |

1. **Marketing site** — in the **site** Vercel project → **Settings → Domains** → add
   `eaverow.com` and `www.eaverow.com`. (If you bought via Vercel in Part A, `eaverow.com` is
   already there — just add `www`.)
2. **Platform** — in the **platform** Vercel project → **Settings → Domains** → add
   `app.eaverow.com`.
3. If you bought the domain **outside** Vercel, Vercel will show you the exact records to paste
   into your registrar's DNS (an `A` record for the apex and `CNAME`s for `www`/`app`). Copy them
   over exactly; it goes live within minutes to an hour.

> After this, your Supabase-connected platform lives at a real address (`app.eaverow.com`)
> instead of the `…vercel.app` URL. Update your Supabase project's **Authentication → URL
> Configuration → Site URL / Redirect URLs** to `https://app.eaverow.com` so confirmation and
> password links point to the right place.

## Part C — Branded email (`andrew@` and `info@eaverow.com`)

**What you want:** email sent to `andrew@eaverow.com` and `info@eaverow.com` lands in your
existing `andrew@getvantrow.com` inbox, and you can *send* as those addresses. There are two
ways; pick based on whether you want real separate mailboxes.

### The simple path — forwarding + "send as" (free, works no matter what)

This forwards the new addresses into your current inbox and lets you reply as them. No new
mailbox, no monthly cost.

1. **Set up forwarding** with a free forwarder — **ImprovMX** (improvmx.com) or **Cloudflare
   Email Routing** are both good. Using ImprovMX:
   - Create a free account, add the domain `eaverow.com`.
   - It shows you **2 `MX` records + 1 `TXT` (SPF)** record to add. Paste those into your
     domain's DNS (in Vercel's domain settings if bought there, or your registrar).
   - Add forwarding rules: `andrew@eaverow.com → andrew@getvantrow.com`, and
     `info@eaverow.com → andrew@getvantrow.com`. (Add `contact@`, `hello@`, `support@` too if you
     want — aliases are free.)
2. **Send *as* the new address** from Gmail (your getvantrow account):
   - Gmail → **Settings (gear) → See all settings → Accounts and Import → "Send mail as" → Add
     another email address.**
   - Enter `andrew@eaverow.com`. For SMTP, the easiest is to let ImprovMX handle sending (their
     dashboard gives you SMTP details), or use Gmail's flow. Verify via the confirmation email
     (which now forwards to you). Repeat for `info@` if you want to send from it.
   - Now you can pick `andrew@eaverow.com` in the "From" dropdown when composing/replying.

That's the whole thing: **info@ and andrew@eaverow.com arrive in your normal inbox, and your
replies go out as eaverow.com.**

### The fuller path — real mailboxes via Google Workspace (optional, paid)

If you'd rather have true, separate `@eaverow.com` mailboxes (own login, own storage):
- **If `getvantrow.com` is already on Google Workspace:** add `eaverow.com` as a **secondary
  domain** in the Workspace Admin console, then create `andrew@eaverow.com` / `info@eaverow.com`
  as users or aliases. Aliases are free; separate user mailboxes are ~$6–7/user/mo. Workspace
  gives you the MX records to add.
- **If it's a regular Gmail (not Workspace):** start a Google Workspace trial on `eaverow.com`,
  or just use the free forwarding path above — most founders start with forwarding and upgrade
  later.

> **Tell me which you want** (forwarding vs Workspace) and whether `getvantrow.com` is on Google
> Workspace, and I'll give you the exact click-path for your case.

## Order of operations (do it in this order)

1. Buy `eaverow.com` (Part A).
2. Point the site + platform at it (Part B) — website works.
3. Set up email forwarding + send-as (Part C) — email works.
4. Update Supabase Auth URLs to `https://app.eaverow.com` (note in Part B).

## Troubleshooting

- **"Domain added but site shows an error / not secure."** DNS is still propagating or a record
  is missing — wait ~30 min; Vercel's Domains tab shows a green check when it's ready.
- **Forwarded email not arriving.** The MX/TXT records aren't in yet or point to the wrong host.
  Re-check them against what ImprovMX/Cloudflare shows; MX changes can take up to a few hours.
- **Can't "send as" — verification email never comes.** Make sure the forwarding rule for that
  address is active first, then re-send the Gmail verification.
- **Platform login links point to the vercel.app URL.** Update Supabase → Authentication → URL
  Configuration to `https://app.eaverow.com`.

## What this does NOT cover (separate, later)

- **The platform's transactional emails** (Supabase signup/confirmation emails) sending *from*
  `eaverow.com` — that's a custom-SMTP setup in Supabase, a later polish item.
- **The marketing site's contact form** wiring to `info@eaverow.com` — easy follow-up once the
  address exists.

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimitAllow } from "./rate-limit";
import { getSession } from "./session";
import { getServiceStore, getStore } from "./store";
import { getStripe, isStripeConfigured } from "./stripe";

/** Absolute origin of the current request (handles Vercel preview/prod hosts). */
async function requestOrigin(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "";
}

/**
 * Start (or resume) Stripe Connect onboarding for the caller's org. Creates an
 * Express connected account on first run (stored on the org), then redirects to
 * Stripe's hosted onboarding. The roofer returns to /settings/payments, which
 * shows their live status. Used as a form action.
 */
export async function startStripeOnboarding(): Promise<void> {
  if (!isStripeConfigured()) {
    throw new Error("Payments aren't configured on this deployment yet.");
  }
  const { org } = await getSession();
  const store = await getStore();
  const stripe = getStripe();

  let accountId = org.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      metadata: { orgId: org.id },
    });
    accountId = account.id;
    await store.updateOrg(org.id, { stripeAccountId: accountId });
  }

  const origin = await requestOrigin();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/settings/payments?refresh=1`,
    return_url: `${origin}/settings/payments?return=1`,
    type: "account_onboarding",
  });

  redirect(link.url);
}

/**
 * PUBLIC (portal-token). Starts a real Stripe Checkout for the homeowner's open
 * invoice via a DIRECT charge on the contractor's connected account (the roofer
 * is the merchant of record — they own the funds and any disputes). Redirects to
 * Stripe's hosted checkout page; fulfillment happens in the webhook. Rate limited.
 */
export async function createPortalCheckout(portalToken: string): Promise<void> {
  if (!isStripeConfigured()) {
    throw new Error("Online payments aren't configured yet.");
  }
  const store = getServiceStore();
  const stripe = getStripe();

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (
    !rateLimitAllow(`portal:${portalToken}`) ||
    !rateLimitAllow(`portal-ip:${ip}`)
  ) {
    throw new Error("Too many attempts. Please wait a minute and try again.");
  }

  const job = await store.getJobByPortalToken(portalToken);
  if (!job) throw new Error("This link is invalid.");
  const org = await store.getOrg(job.orgId);
  if (!org?.stripeAccountId) {
    throw new Error("This contractor isn't set up for online payments yet.");
  }

  const invoices = await store.listInvoices(job.id);
  const invoice = invoices
    .filter((i) => i.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (!invoice) throw new Error("There's no open invoice to pay right now.");
  const balance = invoice.totalCents - invoice.amountPaidCents;
  if (balance <= 0) throw new Error("This invoice is already paid in full.");

  const origin = await requestOrigin();
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Invoice ${invoice.number} — ${org.name}` },
            unit_amount: balance,
          },
          quantity: 1,
        },
      ],
      metadata: { invoiceId: invoice.id, portalToken },
      payment_intent_data: {
        metadata: { invoiceId: invoice.id, portalToken },
      },
      success_url: `${origin}/portal/${portalToken}?paid=1`,
      cancel_url: `${origin}/portal/${portalToken}`,
    },
    // Direct charge: the session is created ON the connected account.
    { stripeAccount: org.stripeAccountId },
  );

  if (session.url) redirect(session.url);
  throw new Error("Could not start checkout. Please try again.");
}

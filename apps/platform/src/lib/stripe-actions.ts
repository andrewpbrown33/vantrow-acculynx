"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { getStore } from "./store";
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

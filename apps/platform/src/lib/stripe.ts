import Stripe from "stripe";

/**
 * Stripe integration, env-gated exactly like the Supabase client: when no
 * `STRIPE_SECRET_KEY` is set the app falls back to the demo payment stub, so
 * nothing breaks before Stripe is configured. Use TEST keys (`sk_test_…`)
 * until you're ready to go live.
 *
 * Hosted Checkout is redirect-based, so only the secret key is needed
 * server-side — there's no client-side Stripe.js and no publishable key.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let client: Stripe | null = null;

/** Lazily-constructed Stripe client. Throws if the secret key is missing. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — Stripe payments are not configured.",
    );
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}

import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { formatUsd } from "@/lib/money";
import { getServiceStore, type PlatformStore } from "@/lib/store";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the source of truth for payment fulfillment. Verifies the
 * signature, then on `checkout.session.completed` marks the invoice paid, and on
 * `account.updated` syncs the connected account's charges_enabled flag.
 *
 * Idempotent: a session for an already-paid invoice is a no-op, so Stripe's
 * at-least-once delivery (and the success-redirect) can't double-charge state.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "no_webhook_secret" }, { status: 503 });
  }

  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const store = getServiceStore();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const invoiceId = session.metadata?.invoiceId;
      if (invoiceId) await fulfillInvoice(store, invoiceId, session);
    }
  } else if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    const orgId = account.metadata?.orgId;
    if (orgId) {
      await store.updateOrg(orgId, {
        stripeChargesEnabled: Boolean(account.charges_enabled),
      });
    }
  }

  return NextResponse.json({ received: true });
}

/** Mark an invoice paid from a completed Checkout Session. Idempotent. */
async function fulfillInvoice(
  store: PlatformStore,
  invoiceId: string,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const invoice = await store.getInvoice(invoiceId);
  // Only fulfill an OPEN invoice — re-delivery or the success redirect is a no-op.
  if (!invoice || invoice.status !== "open") return;

  const paidCents = session.amount_total ?? invoice.totalCents;
  const amountPaidCents = invoice.amountPaidCents + paidCents;
  const paid = amountPaidCents >= invoice.totalCents;
  const providerRef =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : `cs_${session.id}`;

  await store.createPayment({
    orgId: invoice.orgId,
    invoiceId,
    amountCents: paidCents,
    method: "card",
    status: "succeeded",
    providerRef,
  });
  await store.updateInvoice(invoiceId, {
    amountPaidCents,
    status: paid ? "paid" : invoice.status,
  });
  await store.createActivity({
    orgId: invoice.orgId,
    jobId: invoice.jobId,
    type: "payment_recorded",
    message: `${formatUsd(paidCents)} payment received via the client portal${
      paid ? " — invoice paid in full" : ""
    }.`,
  });
  if (paid) await store.updateJob(invoice.jobId, { stage: "paid" });
}

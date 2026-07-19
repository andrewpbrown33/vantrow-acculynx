import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { startStripeOnboarding } from "@/lib/stripe-actions";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsSettingsPage() {
  const { org } = await getSession();

  // Live status straight from Stripe when an account exists (read-only) — the
  // cached org flag is kept in sync separately by the account.updated webhook.
  let status: "unconfigured" | "none" | "pending" | "active" = "none";
  if (!isStripeConfigured()) {
    status = "unconfigured";
  } else if (org.stripeAccountId) {
    const account = await getStripe().accounts.retrieve(org.stripeAccountId);
    status = account.charges_enabled ? "active" : "pending";
  }

  return (
    <div className="mx-auto max-w-2xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/pipeline" className="hover:text-foreground">
          Pipeline
        </Link>{" "}
        <span aria-hidden="true">/</span> Payments
      </nav>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-dark">
        Payments
      </h1>
      <p className="mt-1 text-sm text-muted">
        Connect your payout account so homeowners can pay their invoices online.
        Money is deposited straight into your account &mdash; {org.name} is paid
        directly.
      </p>

      <div className="mt-8 rounded-xl border border-foreground/10 bg-white p-6">
        {status === "unconfigured" ? (
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Payments aren&rsquo;t enabled on this deployment yet
            </h2>
            <p className="mt-2 text-sm text-muted">
              Online payments will turn on once Stripe is configured for this
              environment. Until then, invoices are tracked in {org.name} and
              collected however you do today.
            </p>
          </div>
        ) : status === "active" ? (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              <span
                className="h-2 w-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Payments active
            </span>
            <p className="mt-3 text-sm text-muted">
              You&rsquo;re all set &mdash; the &ldquo;Pay&rdquo; button on your
              homeowners&rsquo; portals is live, and payments land in your
              connected account.
            </p>
            <form action={startStripeOnboarding} className="mt-4">
              <button
                type="submit"
                className="text-sm font-medium text-brand hover:text-brand-dark"
              >
                Manage payout details &rarr;
              </button>
            </form>
          </div>
        ) : status === "pending" ? (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
              <span
                className="h-2 w-2 rounded-full bg-amber-500"
                aria-hidden="true"
              />
              Setup in progress
            </span>
            <p className="mt-3 text-sm text-muted">
              Stripe still needs a few details before you can accept payments.
              Pick up where you left off &mdash; it only takes a few minutes.
            </p>
            <form action={startStripeOnboarding} className="mt-4">
              <button
                type="submit"
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Finish setup
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Set up online payments
            </h2>
            <p className="mt-2 text-sm text-muted">
              We&rsquo;ll hand you off to Stripe to verify your business and add
              a bank account for payouts (a few minutes). Card details are
              handled entirely by Stripe &mdash; they never touch {org.name} or
              our servers.
            </p>
            <form action={startStripeOnboarding} className="mt-4">
              <button
                type="submit"
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Set up payments
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

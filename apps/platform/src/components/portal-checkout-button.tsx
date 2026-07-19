"use client";

import { useState, useTransition } from "react";
import { createPortalCheckout } from "@/lib/stripe-actions";
import { formatUsd } from "@/lib/money";

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

/**
 * Real "Pay" button on the homeowner portal — starts a Stripe Checkout Session
 * and redirects to Stripe's hosted page (card entered there, never here).
 * Shown only when the contractor's Stripe account can accept charges.
 */
export function PortalCheckoutButton({
  token,
  balanceCents,
}: {
  token: string;
  balanceCents: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function pay() {
    setError(null);
    startTransition(async () => {
      try {
        await createPortalCheckout(token);
      } catch (err) {
        if (isNextRedirect(err)) throw err; // redirect to Stripe — expected
        setError("Couldn't start checkout. Please try again.");
      }
    });
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={pay}
        disabled={pending}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Redirecting…" : `Pay ${formatUsd(balanceCents)}`}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        Secured by Stripe. You&rsquo;ll enter your card on Stripe&rsquo;s page.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

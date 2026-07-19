"use client";

import { useState, useTransition } from "react";
import { payInvoiceFromPortal } from "@/lib/actions";
import { formatUsd } from "@/lib/money";

/**
 * Homeowner "pay now" control on the portal. Pays the full outstanding balance
 * through the stubbed PSP (demo — no real charge). On success the server action
 * revalidates the portal, so the refreshed invoice section reflects the new
 * balance / paid-in-full state — no local success view needed.
 */
export function PortalPayForm({
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
      const result = await payInvoiceFromPortal(token, {
        amountCents: balanceCents,
      });
      if (!result.ok) setError(result.error);
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
        {pending ? "Processing…" : `Pay ${formatUsd(balanceCents)} now`}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        Demo payment &mdash; no real charge is made.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import { signEstimate } from "@/lib/actions";
import { estimateTotals, formatUsd } from "@/lib/money";
import type { Estimate, EstimateTier } from "@/lib/types";
import { SignaturePad } from "@/components/signature-pad";

const TIER_LABEL: Record<EstimateTier, string> = {
  good: "Good",
  better: "Better",
  best: "Best",
};

/**
 * The public homeowner signing experience: pick a tier, draw a signature, sign.
 * All interactive state is client-side; submission calls the signEstimate
 * server action against the public token.
 */
export function SignForm({
  token,
  estimate,
  orgName,
  jobTitle,
  contactName,
}: {
  token: string;
  estimate: Estimate;
  orgName: string;
  jobTitle: string;
  contactName: string;
}) {
  const defaultTier =
    estimate.selectedTier ??
    (estimate.options.find((o) => o.tier === "better")?.tier ??
      estimate.options[0]?.tier);

  const [tier, setTier] = useState<EstimateTier | undefined>(defaultTier);
  const [signerName, setSignerName] = useState(contactName);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const selectedTotals = useMemo(
    () =>
      tier ? estimateTotals({ ...estimate, selectedTier: tier }) : null,
    [estimate, tier],
  );

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!tier) {
      setError("Please choose an option.");
      return;
    }
    if (!signerName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!signature) {
      setError("Please draw your signature before submitting.");
      return;
    }
    startTransition(async () => {
      const result = await signEstimate(token, {
        signerName: signerName.trim(),
        signedTier: tier,
        imageDataUrl: signature,
      });
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-300 bg-emerald-50 p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-emerald-900">
          Thank you, {signerName.trim()}!
        </h2>
        <p className="mt-2 text-emerald-800">
          Your signature has been recorded and {orgName} has been notified. A
          copy of your approved{" "}
          {tier ? TIER_LABEL[tier].toLowerCase() : ""} option will be on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">
          Choose your option
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {estimate.options.map((option) => {
            const totals = estimateTotals({
              ...estimate,
              selectedTier: option.tier,
            });
            const active = tier === option.tier;
            return (
              <label
                key={option.tier}
                className={
                  active
                    ? "cursor-pointer rounded-lg border-2 border-brand bg-brand/5 p-4"
                    : "cursor-pointer rounded-lg border border-foreground/15 bg-white p-4 hover:border-brand/50"
                }
              >
                <input
                  type="radio"
                  name="tier"
                  value={option.tier}
                  checked={active}
                  onChange={() => setTier(option.tier)}
                  className="sr-only"
                />
                <span className="block text-xs font-semibold uppercase tracking-wide text-brand">
                  {TIER_LABEL[option.tier]}
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {option.name}
                </span>
                <span className="mt-2 block text-lg font-bold text-brand-dark">
                  {formatUsd(totals.totalCents)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {selectedTotals && (
        <dl className="space-y-1 rounded-lg border border-foreground/10 bg-white p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatUsd(selectedTotals.subtotalCents)}</dd>
          </div>
          {selectedTotals.discountCents > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Discount</dt>
              <dd>-{formatUsd(selectedTotals.discountCents)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Tax ({estimate.taxRatePct}%)</dt>
            <dd>{formatUsd(selectedTotals.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-foreground/10 pt-2 text-base font-bold text-brand-dark">
            <dt>Total</dt>
            <dd>{formatUsd(selectedTotals.totalCents)}</dd>
          </div>
        </dl>
      )}

      <div>
        <label
          htmlFor="signerName"
          className="block text-sm font-medium text-foreground"
        >
          Your full name
        </label>
        <input
          id="signerName"
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-foreground">
          Signature
        </span>
        <div className="mt-1">
          <SignaturePad onChange={setSignature} disabled={pending} />
        </div>
      </div>

      <p className="text-xs text-muted">
        By signing, you approve the selected option and authorize {orgName} to
        begin work on {jobTitle}. This is a legally binding electronic signature.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Sign & approve"}
      </button>
    </form>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createEstimate,
  type EstimateInput,
  type EstimateOptionInput,
} from "@/lib/actions";
import { formatUsd } from "@/lib/money";
import type { EstimateTier } from "@/lib/types";

const TIERS: EstimateTier[] = ["good", "better", "best"];
const TIER_LABEL: Record<EstimateTier, string> = {
  good: "Good",
  better: "Better",
  best: "Best",
};

interface LineRow {
  key: string;
  description: string;
  quantity: string;
  unitPrice: string; // dollars, as typed
}

interface OptionState {
  tier: EstimateTier;
  name: string;
  notes: string;
  lines: LineRow[];
}

function rowKey(): string {
  return crypto.randomUUID().slice(0, 8);
}

function blankRow(): LineRow {
  return { key: rowKey(), description: "", quantity: "1", unitPrice: "" };
}

function starterLines(tier: EstimateTier): LineRow[] {
  if (tier === "good") {
    return [
      { key: rowKey(), description: "Tear-off & disposal (per square)", quantity: "22", unitPrice: "60" },
      { key: rowKey(), description: "3-tab shingles installed (per square)", quantity: "22", unitPrice: "125" },
      { key: rowKey(), description: "Roofing permit & inspection", quantity: "1", unitPrice: "250" },
    ];
  }
  if (tier === "best") {
    return [
      { key: rowKey(), description: "Tear-off & disposal (per square)", quantity: "22", unitPrice: "70" },
      { key: rowKey(), description: "Designer shingles installed (per square)", quantity: "22", unitPrice: "220" },
      { key: rowKey(), description: "Full ice & water underlayment (per square)", quantity: "22", unitPrice: "42" },
      { key: rowKey(), description: "50-year system warranty registration", quantity: "1", unitPrice: "450" },
    ];
  }
  return [
    { key: rowKey(), description: "Tear-off & disposal (per square)", quantity: "22", unitPrice: "65" },
    { key: rowKey(), description: "Synthetic underlayment (per square)", quantity: "22", unitPrice: "18" },
    { key: rowKey(), description: "Architectural shingles installed (per square)", quantity: "22", unitPrice: "155" },
    { key: rowKey(), description: "Ridge vent + cap system (per linear ft)", quantity: "46", unitPrice: "14" },
    { key: rowKey(), description: "Roofing permit & inspection", quantity: "1", unitPrice: "250" },
  ];
}

function defaultName(tier: EstimateTier): string {
  return {
    good: "Good — Essential",
    better: "Better — Architectural",
    best: "Best — Premium",
  }[tier];
}

function makeOption(tier: EstimateTier): OptionState {
  return { tier, name: defaultName(tier), notes: "", lines: starterLines(tier) };
}

function lineTotalCents(line: LineRow): number {
  const qty = Number(line.quantity);
  const price = Number(line.unitPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(price)) return 0;
  return Math.round(qty * Math.round(price * 100));
}

function optionTotalCents(option: OptionState): number {
  return option.lines.reduce((sum, l) => sum + lineTotalCents(l), 0);
}

const inputClass =
  "w-full rounded-md border border-foreground/20 bg-white px-2.5 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function EstimateBuilder({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [options, setOptions] = useState<OptionState[]>([makeOption("better")]);
  const [taxRatePct, setTaxRatePct] = useState("4.5");
  const [discount, setDiscount] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const presentTiers = options.map((o) => o.tier);
  const missingTiers = TIERS.filter((t) => !presentTiers.includes(t));

  function updateOption(tier: EstimateTier, patch: Partial<OptionState>) {
    setOptions((prev) =>
      prev.map((o) => (o.tier === tier ? { ...o, ...patch } : o)),
    );
  }

  function updateLine(tier: EstimateTier, key: string, patch: Partial<LineRow>) {
    setOptions((prev) =>
      prev.map((o) =>
        o.tier === tier
          ? { ...o, lines: o.lines.map((l) => (l.key === key ? { ...l, ...patch } : l)) }
          : o,
      ),
    );
  }

  function addLine(tier: EstimateTier) {
    setOptions((prev) =>
      prev.map((o) => (o.tier === tier ? { ...o, lines: [...o.lines, blankRow()] } : o)),
    );
  }

  function removeLine(tier: EstimateTier, key: string) {
    setOptions((prev) =>
      prev.map((o) =>
        o.tier === tier ? { ...o, lines: o.lines.filter((l) => l.key !== key) } : o,
      ),
    );
  }

  function addOption(tier: EstimateTier) {
    setOptions((prev) =>
      [...prev, makeOption(tier)].sort(
        (a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier),
      ),
    );
  }

  function removeOption(tier: EstimateTier) {
    setOptions((prev) => prev.filter((o) => o.tier !== tier));
  }

  const grandPreview = useMemo(() => {
    const taxPct = Number(taxRatePct) || 0;
    const disc = Math.round((Number(discount) || 0) * 100);
    return options.map((o) => {
      const subtotal = optionTotalCents(o);
      const clampedDisc = Math.min(Math.max(disc, 0), subtotal);
      const taxable = subtotal - clampedDisc;
      const tax = Math.round((taxable * taxPct) / 100);
      return { tier: o.tier, subtotal, discount: clampedDisc, tax, total: taxable + tax };
    });
  }, [options, taxRatePct, discount]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const payloadOptions: EstimateOptionInput[] = options
      .map((o) => ({
        tier: o.tier,
        name: o.name.trim() || defaultName(o.tier),
        notes: o.notes.trim() || undefined,
        lineItems: o.lines
          .map((l) => ({
            description: l.description.trim(),
            quantity: Number(l.quantity),
            unitPriceCents: Math.round(Number(l.unitPrice) * 100),
          }))
          .filter(
            (l) =>
              l.description.length > 0 &&
              Number.isFinite(l.quantity) &&
              l.quantity > 0 &&
              Number.isFinite(l.unitPriceCents) &&
              l.unitPriceCents >= 0,
          ),
      }))
      .filter((o) => o.lineItems.length > 0);

    if (payloadOptions.length === 0) {
      setError("Add at least one option with a described, priced line item.");
      return;
    }

    const data: EstimateInput = {
      options: payloadOptions,
      taxRatePct: Number(taxRatePct) || 0,
      discountCents: Math.round((Number(discount) || 0) * 100),
    };

    startTransition(async () => {
      try {
        await createEstimate(jobId, data);
      } catch (err) {
        // A redirect throws NEXT_REDIRECT and is handled by the router; only
        // surface genuine failures to the user.
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw err;
        }
        setError("Something went wrong saving this estimate. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <p className="text-sm text-muted">
        Build up to three options for{" "}
        <span className="font-medium text-foreground">{jobTitle}</span>. Prices
        are entered in dollars; totals update live.
      </p>

      {options.map((option) => {
        const preview = grandPreview.find((p) => p.tier === option.tier);
        return (
          <section
            key={option.tier}
            className="rounded-xl border border-foreground/10 bg-white p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                  {TIER_LABEL[option.tier]}
                </span>
                <span className="text-sm font-semibold text-brand-dark">
                  {formatUsd(preview?.total ?? 0)}
                </span>
              </div>
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(option.tier)}
                  className="text-xs font-medium text-red-700 hover:underline"
                >
                  Remove option
                </button>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor={`name-${option.tier}`}
                className="block text-xs font-medium text-muted"
              >
                Option name
              </label>
              <input
                id={`name-${option.tier}`}
                type="text"
                value={option.name}
                onChange={(e) => updateOption(option.tier, { name: e.target.value })}
                className={`mt-1 ${inputClass}`}
              />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2 pr-2 font-medium">Description</th>
                    <th className="pb-2 px-2 font-medium">Qty</th>
                    <th className="pb-2 px-2 font-medium">Unit price ($)</th>
                    <th className="pb-2 pl-2 text-right font-medium">Line total</th>
                    <th className="pb-2 pl-2" aria-label="Remove" />
                  </tr>
                </thead>
                <tbody>
                  {option.lines.map((line) => (
                    <tr key={line.key} className="align-top">
                      <td className="py-1 pr-2">
                        <input
                          type="text"
                          value={line.description}
                          placeholder="e.g. Architectural shingles (per square)"
                          onChange={(e) =>
                            updateLine(option.tier, line.key, { description: e.target.value })
                          }
                          className={inputClass}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(option.tier, line.key, { quantity: e.target.value })
                          }
                          className={`${inputClass} w-20`}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          placeholder="0.00"
                          onChange={(e) =>
                            updateLine(option.tier, line.key, { unitPrice: e.target.value })
                          }
                          className={`${inputClass} w-28`}
                        />
                      </td>
                      <td className="py-1 pl-2 text-right font-medium tabular-nums">
                        {formatUsd(lineTotalCents(line))}
                      </td>
                      <td className="py-1 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeLine(option.tier, line.key)}
                          aria-label="Remove line item"
                          className="text-muted hover:text-red-700"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => addLine(option.tier)}
              className="mt-3 text-sm font-medium text-brand hover:text-brand-dark"
            >
              + Add line item
            </button>
          </section>
        );
      })}

      {missingTiers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {missingTiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => addOption(tier)}
              className="rounded-md border border-brand/40 px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5"
            >
              + Add {TIER_LABEL[tier]} option
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-foreground/10 bg-white p-4 sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor="taxRate" className="block text-xs font-medium text-muted">
            Tax rate (%)
          </label>
          <input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRatePct}
            onChange={(e) => setTaxRatePct(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-xs font-medium text-muted">
            Discount ($)
          </label>
          <input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save estimate"}
        </button>
        <span className="text-xs text-muted">
          Saves as a draft you can review and send for signature.
        </span>
      </div>
    </form>
  );
}

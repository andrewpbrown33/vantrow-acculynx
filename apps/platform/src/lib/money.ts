import type { Estimate, EstimateOption, EstimateTier } from "./types";

/** When no tier has been selected yet, quote the middle ("better") option. */
export const DEFAULT_TIER: EstimateTier = "better";

/** Sum of quantity × unit price for every line item in an option (cents). */
export function optionSubtotalCents(option: EstimateOption): number {
  return option.lineItems.reduce(
    (sum, li) => sum + Math.round(li.quantity * li.unitPriceCents),
    0,
  );
}

/**
 * Resolves which option an estimate's totals apply to: the selected tier if
 * set, otherwise the default ("better"), otherwise the first available option.
 */
export function selectedOption(estimate: Estimate): EstimateOption | undefined {
  const { options } = estimate;
  if (options.length === 0) return undefined;
  const target = estimate.selectedTier ?? DEFAULT_TIER;
  return (
    options.find((o) => o.tier === target) ??
    options.find((o) => o.tier === DEFAULT_TIER) ??
    options[0]
  );
}

export interface EstimateTotals {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
}

/**
 * Totals for the estimate's currently-selected (or default) option. Discount
 * is applied before tax and clamped so it never exceeds the subtotal.
 */
export function estimateTotals(estimate: Estimate): EstimateTotals {
  const option = selectedOption(estimate);
  const subtotalCents = option ? optionSubtotalCents(option) : 0;
  const discountCents = Math.min(
    Math.max(Math.round(estimate.discountCents), 0),
    subtotalCents,
  );
  const taxable = subtotalCents - discountCents;
  const taxCents = Math.round((taxable * estimate.taxRatePct) / 100);
  const totalCents = taxable + taxCents;
  return { subtotalCents, discountCents, taxCents, totalCents };
}

/** Totals for a specific tier, regardless of what is currently selected. */
export function tierTotals(
  estimate: Estimate,
  tier: EstimateTier,
): EstimateTotals {
  return estimateTotals({ ...estimate, selectedTier: tier });
}

/** Formats integer cents as US currency, e.g. 1234567 → "$12,345.67". */
export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

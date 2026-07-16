import { estimateTotals } from "./money";
import type { JobBundle } from "./store";
import type { Estimate } from "./types";

/**
 * The headline dollar value shown for a job in the pipeline: the invoiced
 * total if invoices exist, else the signed estimate's total, else the most
 * recent draft/sent estimate's (default-tier) total, else null.
 */
export function jobDisplayValueCents(bundle: JobBundle): number | null {
  if (bundle.invoices.length > 0) {
    return bundle.invoices.reduce((sum, inv) => sum + inv.totalCents, 0);
  }
  const signed = bundle.estimates.find((e) => e.status === "signed");
  if (signed) return estimateTotals(signed).totalCents;
  const latest = latestEstimate(bundle.estimates);
  return latest ? estimateTotals(latest).totalCents : null;
}

/** The most recently created estimate, if any. */
export function latestEstimate(estimates: Estimate[]): Estimate | undefined {
  if (estimates.length === 0) return undefined;
  return [...estimates].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

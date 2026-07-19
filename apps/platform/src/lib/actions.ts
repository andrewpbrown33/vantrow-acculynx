"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { genId, genToken } from "./ids";
import { estimateTotals, formatUsd, tierTotals } from "./money";
import { rateLimitAllow } from "./rate-limit";
import { getSession } from "./session";
import { isSignLinkExpired, validateSignatureDataUrl } from "./sign";
import { getServiceStore, getStore } from "./store";
import type {
  Estimate,
  EstimateOption,
  EstimateTier,
  LineItem,
  PaymentMethod,
} from "./types";

const TIERS: EstimateTier[] = ["good", "better", "best"];
const PAYMENT_METHODS: PaymentMethod[] = ["card", "ach", "check", "cash"];

// Money guards (review finding #3). Keep individual line values sane and the
// resulting total under the Postgres `int4` ceiling ($21,474,836.47) that the
// invoice money columns use — otherwise a legitimately large estimate throws an
// unhandled `22003 numeric_value_out_of_range` at invoice creation in Supabase
// mode (and silently stores bad data in file mode). `quantity * unitPriceCents`
// also loses integer precision past 2^53, so we bound the factors too.
const MAX_UNIT_PRICE_CENTS = 100_000_00; // $100,000 per unit
const MAX_QUANTITY = 100_000;
const MAX_INVOICE_TOTAL_CENTS = 2_000_000_000; // $20,000,000, safely under int4

// ---- input helpers ---------------------------------------------------------

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function optStr(value: FormDataEntryValue | null): string | undefined {
  const s = str(value);
  return s ? s : undefined;
}

function clampPct(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), 100);
}

function addDaysIso(base: Date, days: number): string {
  return new Date(base.getTime() + days * 86_400_000).toISOString();
}

// ---- estimate builder payload ---------------------------------------------

export interface EstimateLineInput {
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface EstimateOptionInput {
  tier: EstimateTier;
  name: string;
  notes?: string;
  lineItems: EstimateLineInput[];
}

export interface EstimateInput {
  options: EstimateOptionInput[];
  taxRatePct: number;
  discountCents: number;
}

/**
 * Sanitizes builder options: keeps at most one option per tier (good→best
 * order), drops empty/invalid line items, and rejects options with no items.
 */
function normalizeOptions(raw: EstimateOptionInput[]): EstimateOption[] {
  const byTier = new Map<EstimateTier, EstimateOption>();
  for (const option of raw ?? []) {
    if (!TIERS.includes(option.tier) || byTier.has(option.tier)) continue;
    const lineItems: LineItem[] = (option.lineItems ?? [])
      .map((li) => ({
        description: String(li.description ?? "").trim(),
        quantity: Number(li.quantity),
        unitPriceCents: Math.round(Number(li.unitPriceCents)),
      }))
      .filter(
        (li) =>
          li.description.length > 0 &&
          Number.isFinite(li.quantity) &&
          li.quantity > 0 &&
          Number.isFinite(li.unitPriceCents) &&
          li.unitPriceCents >= 0,
      )
      .map((li) => ({ id: genId("li"), ...li }));
    if (lineItems.length === 0) continue;
    byTier.set(option.tier, {
      tier: option.tier,
      name: String(option.name ?? "").trim() || defaultTierName(option.tier),
      notes: option.notes?.trim() ? option.notes.trim() : undefined,
      lineItems,
    });
  }
  return TIERS.filter((t) => byTier.has(t)).map((t) => byTier.get(t)!);
}

function defaultTierName(tier: EstimateTier): string {
  return { good: "Good", better: "Better", best: "Best" }[tier];
}

// ---- actions ---------------------------------------------------------------

/** Create a Contact + Job(lead), log activity, and open the new job. */
export async function createLead(formData: FormData): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const name = str(formData.get("contactName"));
  if (!name) throw new Error("A contact name is required to create a lead.");

  const contact = await store.createContact({
    orgId: org.id,
    name,
    email: optStr(formData.get("contactEmail")),
    phone: optStr(formData.get("contactPhone")),
    address: optStr(formData.get("contactAddress")),
  });

  const title = str(formData.get("title")) || `${name} — new roof`;
  const job = await store.createJob({
    orgId: org.id,
    contactId: contact.id,
    title,
    stage: "lead",
    leadSource: optStr(formData.get("leadSource")),
    priority: "normal",
  });

  await store.createActivity({
    orgId: org.id,
    jobId: job.id,
    type: "lead_created",
    message: `Lead created for ${contact.name}.`,
  });

  revalidatePath("/pipeline");
  redirect(`/jobs/${job.id}`);
}

/** Create a draft Estimate with 1–3 tier options; move the job to estimating. */
export async function createEstimate(
  jobId: string,
  data: EstimateInput,
): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const job = await store.getJob(jobId);
  if (!job || job.orgId !== org.id) throw new Error("Job not found.");

  // #10: don't reopen estimating on a job that's already been invoiced/paid —
  // its invoice froze the old totals. Additional work belongs to a new job.
  if (job.stage === "invoiced" || job.stage === "paid") {
    throw new Error(
      "This job is already invoiced. Start a new job for additional work.",
    );
  }

  const options = normalizeOptions(data.options);
  if (options.length === 0) {
    throw new Error("Add at least one option with a priced line item.");
  }

  const taxRatePct = clampPct(data.taxRatePct);
  const discountCents = Math.max(0, Math.round(Number(data.discountCents) || 0));

  // #3: bound each line, then reject if any tier's total would overflow int4.
  // We check every present tier because any of them can be the one signed.
  for (const option of options) {
    for (const li of option.lineItems) {
      if (li.unitPriceCents > MAX_UNIT_PRICE_CENTS || li.quantity > MAX_QUANTITY) {
        throw new Error(
          `A line item is too large. Keep unit price under ${formatUsd(
            MAX_UNIT_PRICE_CENTS,
          )} and quantity under ${MAX_QUANTITY.toLocaleString()}.`,
        );
      }
    }
  }
  // Only options/taxRatePct/discountCents/selectedTier are read by tierTotals.
  const totalsInput = { options, taxRatePct, discountCents } as unknown as Estimate;
  for (const option of options) {
    if (tierTotals(totalsInput, option.tier).totalCents > MAX_INVOICE_TOTAL_CENTS) {
      throw new Error(
        `This estimate's total exceeds the ${formatUsd(
          MAX_INVOICE_TOTAL_CENTS,
        )} maximum. Split it into multiple estimates.`,
      );
    }
  }

  const estimate = await store.createEstimate({
    orgId: org.id,
    jobId,
    status: "draft",
    options,
    taxRatePct,
    discountCents,
  });

  await store.updateJob(jobId, { stage: "estimating" });
  await store.createActivity({
    orgId: org.id,
    jobId,
    type: "estimate_created",
    message: `Estimate drafted with ${options.length} option${
      options.length === 1 ? "" : "s"
    }.`,
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/estimates/${estimate.id}`);
}

/**
 * Mark an estimate sent, mint a public sign token, and advance the job to
 * proposal_sent. Returns the tokenized public signing path.
 */
export async function sendEstimate(
  estimateId: string,
): Promise<{ token: string; path: string }> {
  const { org } = await getSession();
  const store = await getStore();

  const estimate = await store.getEstimate(estimateId);
  if (!estimate || estimate.orgId !== org.id) {
    throw new Error("Estimate not found.");
  }
  if (estimate.status === "signed") {
    throw new Error("This estimate has already been signed.");
  }

  // #10: an already-invoiced/paid job shouldn't be sending estimates for signing.
  const job = await store.getJob(estimate.jobId);
  if (job && (job.stage === "invoiced" || job.stage === "paid")) {
    throw new Error("This job is already invoiced and can't send new estimates.");
  }

  const token = estimate.sendToken ?? genToken();
  await store.updateEstimate(estimateId, {
    status: "sent",
    sendToken: token,
    sentAt: estimate.sentAt ?? new Date().toISOString(),
  });
  await store.updateJob(estimate.jobId, { stage: "proposal_sent" });
  await store.createActivity({
    orgId: org.id,
    jobId: estimate.jobId,
    type: "estimate_sent",
    message: "Estimate sent to the homeowner for signature.",
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${estimate.jobId}`);
  revalidatePath(`/estimates/${estimateId}`);
  return { token, path: `/sign/${token}` };
}

export interface SignInput {
  signerName: string;
  signedTier: EstimateTier;
  imageDataUrl: string;
  ip?: string;
}

export type SignResult =
  | { ok: true; jobId: string }
  | { ok: false; error: string };

/**
 * PUBLIC (tokenized, no auth). Records a homeowner's signature, marks the
 * estimate signed with the chosen tier, and advances the job to won.
 */
export async function signEstimate(
  token: string,
  input: SignInput,
): Promise<SignResult> {
  // PUBLIC path: no authenticated user, so use the service-role store and look
  // the estimate up strictly by its unguessable token (RLS is bypassed here).
  const store = getServiceStore();

  // #5: this endpoint runs as the service role — rate-limit it (per token and
  // per client IP) so it can't be hammered with sign attempts / large payloads.
  const hdrs = await headers();
  const ip =
    input.ip ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!rateLimitAllow(`sign:${token}`) || !rateLimitAllow(`sign-ip:${ip}`)) {
    return {
      ok: false,
      error: "Too many attempts. Please wait a minute and try again.",
    };
  }

  const estimate = await store.getEstimateByToken(token);
  if (!estimate) {
    return { ok: false, error: "This signing link is invalid or has expired." };
  }
  if (estimate.status === "signed") {
    return { ok: false, error: "This estimate has already been signed." };
  }
  if (estimate.status === "declined") {
    return { ok: false, error: "This estimate is no longer available." };
  }
  // #5: the token doesn't live forever, despite the old "invalid or expired"
  // copy that was never actually enforced.
  if (isSignLinkExpired(estimate.sentAt)) {
    return {
      ok: false,
      error:
        "This signing link has expired. Please ask your contractor for a new one.",
    };
  }
  // #10: if the job was already invoiced/paid (e.g. off a different signed
  // estimate), don't let a stale link sign and regress it back to `won`.
  const signJob = await store.getJob(estimate.jobId);
  if (signJob && (signJob.stage === "invoiced" || signJob.stage === "paid")) {
    return { ok: false, error: "This estimate is no longer available." };
  }

  const signerName = str(input.signerName as FormDataEntryValue);
  if (!signerName) {
    return { ok: false, error: "Please enter your full name to sign." };
  }
  if (!TIERS.includes(input.signedTier) || !estimate.options.some((o) => o.tier === input.signedTier)) {
    return { ok: false, error: "Please choose one of the available options." };
  }
  // #5: validate the signature is a real, size-bounded PNG/JPEG data URL — the
  // old check only tested the `data:image` prefix, with no size cap.
  const signatureError = validateSignatureDataUrl(input.imageDataUrl ?? "");
  if (signatureError) {
    return { ok: false, error: signatureError };
  }

  const signature = await store.createSignature({
    orgId: estimate.orgId,
    estimateId: estimate.id,
    signerName,
    signedTier: input.signedTier,
    imageDataUrl: input.imageDataUrl,
    ip: input.ip,
  });

  await store.updateEstimate(estimate.id, {
    status: "signed",
    selectedTier: input.signedTier,
    signedAt: new Date().toISOString(),
    signatureId: signature.id,
  });
  await store.updateJob(estimate.jobId, { stage: "won" });
  await store.createActivity({
    orgId: estimate.orgId,
    jobId: estimate.jobId,
    type: "estimate_signed",
    message: `${signerName} signed the ${input.signedTier} option.`,
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${estimate.jobId}`);
  revalidatePath(`/sign/${token}`);
  return { ok: true, jobId: estimate.jobId };
}

/** Create an open Invoice from the job's signed estimate; advance to invoiced. */
export async function createInvoice(jobId: string): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const job = await store.getJob(jobId);
  if (!job || job.orgId !== org.id) throw new Error("Job not found.");

  // #10: a job can carry more than one signed estimate (e.g. a re-send that was
  // signed again). Invoice the LATEST one deterministically, not whichever the
  // store happens to return first.
  const estimates = await store.listEstimates(jobId);
  const signed = estimates
    .filter((e) => e.status === "signed")
    .sort((a, b) =>
      (b.signedAt ?? b.createdAt).localeCompare(a.signedAt ?? a.createdAt),
    )[0];
  if (!signed) {
    throw new Error("This job has no signed estimate to invoice yet.");
  }

  const existing = await store.listInvoices(jobId);
  const already = existing.find((i) => i.estimateId === signed.id);
  if (already) redirect(`/invoices/${already.id}`);

  const totals = estimateTotals(signed);
  const number = `INV-${1001 + (await store.countInvoices(org.id))}`;
  const invoice = await store.createInvoice({
    orgId: org.id,
    jobId,
    estimateId: signed.id,
    number,
    status: "open",
    subtotalCents: totals.subtotalCents,
    taxCents: totals.taxCents,
    totalCents: totals.totalCents,
    amountPaidCents: 0,
    dueDate: addDaysIso(new Date(), 14),
  });

  await store.updateJob(jobId, { stage: "invoiced" });
  await store.createActivity({
    orgId: org.id,
    jobId,
    type: "invoice_created",
    message: `Invoice ${number} created for ${formatUsd(totals.totalCents)}.`,
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/invoices/${invoice.id}`);
}

export interface PaymentInput {
  amountCents: number;
  method: PaymentMethod;
}

/**
 * Record a payment against an invoice (PSP is stubbed — see the UI note). When
 * the balance reaches zero the invoice is marked paid and the job advances.
 */
export async function recordPayment(
  invoiceId: string,
  input: PaymentInput,
): Promise<{ ok: true; paid: boolean }> {
  const { org } = await getSession();
  const store = await getStore();

  const invoice = await store.getInvoice(invoiceId);
  if (!invoice || invoice.orgId !== org.id) throw new Error("Invoice not found.");

  // #11: a voided invoice can carry a positive balance — don't let it collect.
  if (invoice.status === "void") {
    throw new Error("This invoice was voided and can no longer accept payments.");
  }

  const balance = invoice.totalCents - invoice.amountPaidCents;
  if (balance <= 0) throw new Error("This invoice is already paid in full.");

  const amountCents = Math.round(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("Enter a payment amount greater than zero.");
  }
  const method: PaymentMethod = PAYMENT_METHODS.includes(input.method)
    ? input.method
    : "card";
  const applied = Math.min(amountCents, balance);

  await store.createPayment({
    orgId: org.id,
    invoiceId,
    amountCents: applied,
    method,
    status: "succeeded",
    providerRef: `demo_${genToken()}`,
  });

  const amountPaidCents = invoice.amountPaidCents + applied;
  const paid = amountPaidCents >= invoice.totalCents;
  await store.updateInvoice(invoiceId, {
    amountPaidCents,
    status: paid ? "paid" : invoice.status,
  });
  await store.createActivity({
    orgId: org.id,
    jobId: invoice.jobId,
    type: "payment_recorded",
    message: `${formatUsd(applied)} payment recorded (${method})${
      paid ? " — invoice paid in full" : ""
    }.`,
  });
  if (paid) await store.updateJob(invoice.jobId, { stage: "paid" });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${invoice.jobId}`);
  revalidatePath(`/invoices/${invoiceId}`);
  return { ok: true, paid };
}

/**
 * PUBLIC (tokenized). Lets the homeowner decline an estimate instead of signing
 * — makes the `declined` status reachable (review #16). Same guards as
 * signEstimate (rate limit, expiry, already-signed). Idempotent if re-declined.
 */
export async function declineEstimate(token: string): Promise<SignResult> {
  const store = getServiceStore();

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitAllow(`sign:${token}`) || !rateLimitAllow(`sign-ip:${ip}`)) {
    return {
      ok: false,
      error: "Too many attempts. Please wait a minute and try again.",
    };
  }

  const estimate = await store.getEstimateByToken(token);
  if (!estimate) {
    return { ok: false, error: "This signing link is invalid or has expired." };
  }
  if (estimate.status === "signed") {
    return { ok: false, error: "This estimate has already been signed." };
  }
  if (estimate.status === "declined") {
    return { ok: true, jobId: estimate.jobId }; // already declined — no-op
  }
  if (isSignLinkExpired(estimate.sentAt)) {
    return {
      ok: false,
      error:
        "This signing link has expired. Please ask your contractor for a new one.",
    };
  }

  await store.updateEstimate(estimate.id, { status: "declined" });
  await store.createActivity({
    orgId: estimate.orgId,
    jobId: estimate.jobId,
    type: "job_updated",
    message: "Homeowner declined the estimate.",
  });

  revalidatePath(`/sign/${token}`);
  revalidatePath(`/jobs/${estimate.jobId}`);
  return { ok: true, jobId: estimate.jobId };
}

/**
 * Manually kill a stuck job — moves it to the `dead` stage with an optional
 * reason (review #16: `dead` was previously unreachable, so a stalled job
 * couldn't be cleared off the board).
 */
export async function markJobDead(
  jobId: string,
  formData: FormData,
): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const job = await store.getJob(jobId);
  if (!job || job.orgId !== org.id) throw new Error("Job not found.");

  const reason = str(formData.get("reason"));
  await store.updateJob(jobId, {
    stage: "dead",
    deadReason: reason || undefined,
  });
  await store.createActivity({
    orgId: org.id,
    jobId,
    type: "job_updated",
    message: reason ? `Job marked dead: ${reason}` : "Job marked dead.",
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}

/**
 * Ensure the job has a homeowner-portal token and return the portal path.
 * Called by the contractor's "Share with homeowner" control — generates and
 * persists the token on first share (backfills jobs created before the portal).
 */
export async function ensurePortalLink(
  jobId: string,
): Promise<{ path: string }> {
  const { org } = await getSession();
  const store = await getStore();

  const job = await store.getJob(jobId);
  if (!job || job.orgId !== org.id) throw new Error("Job not found.");

  let token = job.portalToken;
  if (!token) {
    token = genToken();
    await store.updateJob(jobId, { portalToken: token });
  }
  return { path: `/portal/${token}` };
}

/** Bring a dead job back to the board at the `lead` stage (review #16). */
export async function reopenJob(jobId: string): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const job = await store.getJob(jobId);
  if (!job || job.orgId !== org.id) throw new Error("Job not found.");
  if (job.stage !== "dead") redirect(`/jobs/${jobId}`); // nothing to reopen

  await store.updateJob(jobId, { stage: "lead" });
  await store.createActivity({
    orgId: org.id,
    jobId,
    type: "job_updated",
    message: "Job reopened.",
  });

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}

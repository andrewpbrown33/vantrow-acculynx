"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { genId, genToken } from "./ids";
import { estimateTotals, formatUsd } from "./money";
import { getSession } from "./session";
import { getServiceStore, getStore } from "./store";
import type {
  EstimateOption,
  EstimateTier,
  LineItem,
  PaymentMethod,
} from "./types";

const TIERS: EstimateTier[] = ["good", "better", "best"];
const PAYMENT_METHODS: PaymentMethod[] = ["card", "ach", "check", "cash"];

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

  const options = normalizeOptions(data.options);
  if (options.length === 0) {
    throw new Error("Add at least one option with a priced line item.");
  }

  const estimate = await store.createEstimate({
    orgId: org.id,
    jobId,
    status: "draft",
    options,
    taxRatePct: clampPct(data.taxRatePct),
    discountCents: Math.max(0, Math.round(Number(data.discountCents) || 0)),
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

  const signerName = str(input.signerName as FormDataEntryValue);
  if (!signerName) {
    return { ok: false, error: "Please enter your full name to sign." };
  }
  if (!TIERS.includes(input.signedTier) || !estimate.options.some((o) => o.tier === input.signedTier)) {
    return { ok: false, error: "Please choose one of the available options." };
  }
  if (!input.imageDataUrl || !input.imageDataUrl.startsWith("data:image")) {
    return { ok: false, error: "Please draw your signature before submitting." };
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

  const estimates = await store.listEstimates(jobId);
  const signed = estimates.find((e) => e.status === "signed");
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

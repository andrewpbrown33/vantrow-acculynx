import { genId, genToken } from "./ids";
import { estimateTotals } from "./money";
import type {
  Activity,
  Contact,
  Dataset,
  Estimate,
  EstimateOption,
  Invoice,
  Job,
  LineItem,
  Org,
  Payment,
  Signature,
  User,
} from "./types";

/** ISO timestamp `days` days before (or, negative, after) `base`. */
function daysAgo(base: Date, days: number): string {
  return new Date(base.getTime() - days * 86_400_000).toISOString();
}

function li(description: string, quantity: number, unitPriceCents: number): LineItem {
  return { id: genId("li"), description, quantity, unitPriceCents };
}

/**
 * A realistic asphalt-shingle reroof, priced as good / better / best. Squares
 * (1 square = 100 sqft) drive most quantities. Prices are illustrative.
 */
function roofingOptions(squares: number, ridgeLf: number, valleyLf: number): EstimateOption[] {
  const good: EstimateOption = {
    tier: "good",
    name: "Good — 3-Tab Essential",
    notes: "25-year 3-tab shingles. Sound, budget-friendly protection.",
    lineItems: [
      li("Tear-off & disposal of existing shingles (per square)", squares, 6000),
      li("Synthetic underlayment (per square)", squares, 1600),
      li("3-tab architectural shingles installed (per square)", squares, 12500),
      li("Aluminum drip edge (per linear ft)", ridgeLf + valleyLf + 60, 320),
      li("Standard ridge cap (per linear ft)", ridgeLf, 900),
      li("Roofing permit & inspection", 1, 25000),
    ],
  };
  const better: EstimateOption = {
    tier: "better",
    name: "Better — Architectural",
    notes: "30-year architectural shingles with ice & water shield in valleys.",
    lineItems: [
      li("Tear-off & disposal of existing shingles (per square)", squares, 6500),
      li("Synthetic underlayment (per square)", squares, 1800),
      li("Ice & water shield at valleys/eaves (per linear ft)", valleyLf, 750),
      li("Architectural shingles installed (per square)", squares, 15500),
      li("Aluminum drip edge (per linear ft)", ridgeLf + valleyLf + 60, 350),
      li("Ridge vent + cap system (per linear ft)", ridgeLf, 1400),
      li("New pipe boots & step flashing", 6, 4500),
      li("Roofing permit & inspection", 1, 25000),
    ],
  };
  const best: EstimateOption = {
    tier: "best",
    name: "Best — Designer + Warranty",
    notes: "Designer shingles, full ice & water underlayment, 50-yr warranty.",
    lineItems: [
      li("Tear-off & disposal of existing shingles (per square)", squares, 7000),
      li("Full ice & water shield underlayment (per square)", squares, 4200),
      li("Designer / dimensional shingles installed (per square)", squares, 22000),
      li("Copper valley flashing (per linear ft)", valleyLf, 2600),
      li("Ridge vent + premium cap system (per linear ft)", ridgeLf, 1800),
      li("New pipe boots, step & counter flashing", 8, 5500),
      li("Upgraded intake ventilation package", 1, 68000),
      li("50-year manufacturer system warranty registration", 1, 45000),
      li("Roofing permit & inspection", 1, 25000),
    ],
  };
  return [good, better, best];
}

/** Flat commercial TPO options for the paid demo job. */
function tpoOptions(squares: number): EstimateOption[] {
  return [
    {
      tier: "better",
      name: "Better — 60-mil TPO Overlay",
      notes: "Mechanically-fastened 60-mil TPO over recovery board.",
      lineItems: [
        li("Recovery board over existing membrane (per square)", squares, 9500),
        li("60-mil TPO membrane, mechanically fastened (per square)", squares, 18500),
        li("TPO-clad edge metal & termination bar (per linear ft)", 220, 1250),
        li("Curb & penetration flashing kits", 6, 8500),
        li("Roofing permit & inspection", 1, 30000),
      ],
    },
  ];
}

/**
 * Builds the full demo dataset for "Summit Ridge Exteriors" with jobs spread
 * across every pipeline stage so the whole loop is demoable on first run.
 */
export function buildSeedDataset(): Dataset {
  const now = new Date();

  const org: Org = {
    id: genId("org"),
    name: "Summit Ridge Exteriors",
    createdAt: daysAgo(now, 400),
  };

  const owner: User = {
    id: genId("usr"),
    orgId: org.id,
    email: "dana@summitridgeexteriors.com",
    name: "Dana Whitfield",
    role: "owner",
  };

  const contacts: Contact[] = [];
  const jobs: Job[] = [];
  const estimates: Estimate[] = [];
  const signatures: Signature[] = [];
  const invoices: Invoice[] = [];
  const payments: Payment[] = [];
  const activities: Activity[] = [];

  const contact = (
    name: string,
    email: string,
    phone: string,
    address: string,
    createdDaysAgo: number,
  ): Contact => {
    const c: Contact = {
      id: genId("con"),
      orgId: org.id,
      name,
      email,
      phone,
      address,
      createdAt: daysAgo(now, createdDaysAgo),
    };
    contacts.push(c);
    return c;
  };

  const activity = (
    jobId: string,
    type: Activity["type"],
    message: string,
    createdDaysAgo: number,
  ): void => {
    activities.push({
      id: genId("act"),
      orgId: org.id,
      jobId,
      type,
      message,
      createdAt: daysAgo(now, createdDaysAgo),
    });
  };

  // 1) LEAD ------------------------------------------------------------------
  const c1 = contact(
    "The Henderson Family",
    "hendersons@example.com",
    "(303) 555-0142",
    "418 Aspen Grove Ln, Golden, CO",
    2,
  );
  const j1: Job = {
    id: genId("job"),
    orgId: org.id,
    contactId: c1.id,
    title: "Asphalt reroof — 2,200 sqft ranch",
    stage: "lead",
    leadSource: "Website form",
    priority: "normal",
    createdAt: daysAgo(now, 2),
    updatedAt: daysAgo(now, 2),
  };
  jobs.push(j1);
  activity(j1.id, "lead_created", "Lead captured from the website contact form.", 2);

  // 2) ESTIMATING (draft 3-tier estimate) ------------------------------------
  const c2 = contact(
    "Maria Delgado",
    "maria.delgado@example.com",
    "(303) 555-0188",
    "77 Cedar Ridge Rd, Arvada, CO",
    9,
  );
  const j2: Job = {
    id: genId("job"),
    orgId: org.id,
    contactId: c2.id,
    title: "Storm damage — full roof replacement",
    stage: "estimating",
    leadSource: "Referral",
    priority: "high",
    createdAt: daysAgo(now, 9),
    updatedAt: daysAgo(now, 4),
  };
  jobs.push(j2);
  const e2: Estimate = {
    id: genId("est"),
    orgId: org.id,
    jobId: j2.id,
    status: "draft",
    options: roofingOptions(24, 46, 38),
    taxRatePct: 4.5,
    discountCents: 25000,
    createdAt: daysAgo(now, 4),
  };
  estimates.push(e2);
  activity(j2.id, "lead_created", "Lead captured from a past-customer referral.", 9);
  activity(j2.id, "estimate_created", "Drafted a good/better/best estimate.", 4);

  // 3) PROPOSAL SENT (estimate sent, has sendToken) --------------------------
  const c3 = contact(
    "Kevin O'Brien",
    "kevin.obrien@example.com",
    "(720) 555-0119",
    "1290 Highline Dr, Boulder, CO",
    14,
  );
  const j3: Job = {
    id: genId("job"),
    orgId: org.id,
    contactId: c3.id,
    title: "Cedar shake to architectural shingle",
    stage: "proposal_sent",
    leadSource: "Google Ads",
    priority: "normal",
    createdAt: daysAgo(now, 14),
    updatedAt: daysAgo(now, 3),
  };
  jobs.push(j3);
  const e3: Estimate = {
    id: genId("est"),
    orgId: org.id,
    jobId: j3.id,
    status: "sent",
    options: roofingOptions(31, 58, 44),
    taxRatePct: 4.5,
    discountCents: 0,
    sendToken: genToken(),
    createdAt: daysAgo(now, 5),
    sentAt: daysAgo(now, 3),
  };
  estimates.push(e3);
  activity(j3.id, "estimate_created", "Drafted a good/better/best estimate.", 5);
  activity(j3.id, "estimate_sent", "Estimate sent to the homeowner for signature.", 3);

  // 4) WON (signed estimate, no invoice yet) ---------------------------------
  const c4 = contact(
    "Grace Liu",
    "grace.liu@example.com",
    "(303) 555-0161",
    "52 Maple Court, Lakewood, CO",
    21,
  );
  const j4: Job = {
    id: genId("job"),
    orgId: org.id,
    contactId: c4.id,
    title: "Garage + porch reroof",
    stage: "won",
    leadSource: "Referral",
    priority: "normal",
    createdAt: daysAgo(now, 21),
    updatedAt: daysAgo(now, 6),
  };
  jobs.push(j4);
  const e4: Estimate = {
    id: genId("est"),
    orgId: org.id,
    jobId: j4.id,
    status: "signed",
    options: roofingOptions(12, 22, 16),
    selectedTier: "best",
    taxRatePct: 4.5,
    discountCents: 0,
    sendToken: genToken(),
    createdAt: daysAgo(now, 12),
    sentAt: daysAgo(now, 9),
    signedAt: daysAgo(now, 6),
  };
  const s4: Signature = {
    id: genId("sig"),
    orgId: org.id,
    estimateId: e4.id,
    signerName: "Grace Liu",
    signedTier: "best",
    imageDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    signedAt: daysAgo(now, 6),
  };
  e4.signatureId = s4.id;
  estimates.push(e4);
  signatures.push(s4);
  activity(j4.id, "estimate_created", "Drafted a good/better/best estimate.", 12);
  activity(j4.id, "estimate_sent", "Estimate sent to the homeowner for signature.", 9);
  activity(j4.id, "estimate_signed", "Grace Liu signed the best option.", 6);

  // 5) PAID (invoice + full payment) -----------------------------------------
  const c5 = contact(
    "Downtown Deli LLC",
    "ap@downtowndeli.example.com",
    "(720) 555-0107",
    "300 Pearl St, Denver, CO",
    40,
  );
  const j5: Job = {
    id: genId("job"),
    orgId: org.id,
    contactId: c5.id,
    title: "Flat roof — 60-mil TPO overlay",
    stage: "paid",
    leadSource: "Repeat customer",
    priority: "normal",
    createdAt: daysAgo(now, 40),
    updatedAt: daysAgo(now, 8),
  };
  jobs.push(j5);
  const e5: Estimate = {
    id: genId("est"),
    orgId: org.id,
    jobId: j5.id,
    status: "signed",
    options: tpoOptions(28),
    selectedTier: "better",
    taxRatePct: 4.5,
    discountCents: 0,
    sendToken: genToken(),
    createdAt: daysAgo(now, 30),
    sentAt: daysAgo(now, 26),
    signedAt: daysAgo(now, 22),
  };
  const s5: Signature = {
    id: genId("sig"),
    orgId: org.id,
    estimateId: e5.id,
    signerName: "Priya Nair",
    signedTier: "better",
    imageDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    signedAt: daysAgo(now, 22),
  };
  e5.signatureId = s5.id;
  estimates.push(e5);
  signatures.push(s5);

  const totals5 = estimateTotals(e5);
  const inv5: Invoice = {
    id: genId("inv"),
    orgId: org.id,
    jobId: j5.id,
    estimateId: e5.id,
    number: "INV-1001",
    status: "paid",
    subtotalCents: totals5.subtotalCents,
    taxCents: totals5.taxCents,
    totalCents: totals5.totalCents,
    amountPaidCents: totals5.totalCents,
    createdAt: daysAgo(now, 20),
    dueDate: daysAgo(now, 6),
  };
  invoices.push(inv5);
  const pay5: Payment = {
    id: genId("pay"),
    orgId: org.id,
    invoiceId: inv5.id,
    amountCents: totals5.totalCents,
    method: "ach",
    status: "succeeded",
    providerRef: `demo_${genToken()}`,
    createdAt: daysAgo(now, 8),
  };
  payments.push(pay5);
  activity(j5.id, "estimate_signed", "Priya Nair signed the better option.", 22);
  activity(j5.id, "invoice_created", "Invoice INV-1001 created from the signed estimate.", 20);
  activity(j5.id, "payment_recorded", "ACH payment recorded — invoice paid in full.", 8);

  return {
    orgs: [org],
    users: [owner],
    contacts,
    jobs,
    estimates,
    signatures,
    invoices,
    payments,
    activities,
  };
}

// Dev-only adversarial mock-data generator for the Eaverow platform (demo/file
// store). Writes <repoRoot>/.data/platform.json in the exact `Dataset` shape
// (apps/platform/src/lib/types.ts). Deliberately messy: large volume + edge
// cases that trip the known findings (see docs/review). NOT used in production
// (Supabase mode has no file-store seed). Run: node apps/platform/scripts/mock-seed.mjs
//
// Deterministic (seeded PRNG) so the dataset is reproducible even though the
// output file itself is gitignored.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", ".."); // scripts -> platform -> apps -> root
const outDir = join(repoRoot, ".data");
const outFile = join(outDir, "platform.json");

// ---- deterministic RNG -----------------------------------------------------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1337);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const chance = (p) => rand() < p;

let seq = 0;
const id = (p) => `${p}_${(seq++).toString(36).padStart(10, "0")}`;

const NOW = Date.parse("2026-07-18T12:00:00.000Z");
const daysAgo = (d) => new Date(NOW - d * 86_400_000).toISOString();

// ---- vocab -----------------------------------------------------------------
const FIRST = ["Aaron", "Bethany", "Carlos", "Dana", "Eli", "Fatima", "Greg", "Hana", "Ivan", "Jade", "Kurt", "Lena", "Marco", "Nadia", "Owen", "Priya", "Quinn", "Rosa", "Sam", "Tara", "Uma", "Vince", "Wendy", "Xavier", "Yusuf", "Zoe"];
const LAST = ["Alvarez", "Brooks", "Chen", "Dupont", "Ellis", "Ferreira", "Gomez", "Hughes", "Ito", "Johnson", "Kowalski", "Lopez", "Meyer", "Nguyen", "Ortega", "Patel", "Quintero", "Reed", "Silva", "Tanaka", "Underwood", "Vargas", "Walsh", "Xu", "Young", "Zimmer"];
const STREETS = ["Maple Ave", "Oak St", "Ridgeline Dr", "Cedar Ct", "Birch Ln", "Summit Way", "Gable Rd", "Eaves Blvd", "Shingle Pass", "Rafter Row"];
const CITIES = ["Aurora", "Belmont", "Cedar Falls", "Denton", "Easton", "Fairview", "Granite City", "Harper"];
const SOURCES = ["Referral", "Website", "Door knock", "Storm canvass", "Google Ads", "AccuLynx import", "Facebook", "Yard sign"];
const PRIORITIES = ["low", "normal", "high"];
const ITEMS = [
  ["Tear-off (per square)", 2500, 60000],
  ["Synthetic underlayment (per square)", 1200, 4500],
  ["Architectural shingles (per square)", 9000, 22000],
  ["Ridge vent (LF)", 300, 1200],
  ["Drip edge (LF)", 150, 600],
  ["Pipe boot flashing (each)", 1800, 4500],
  ["Step flashing (LF)", 400, 1500],
  ["Labor — install crew (day)", 60000, 180000],
  ["Dumpster / disposal", 35000, 75000],
  ["Permit & inspection", 15000, 45000],
];

// ---- accumulators ----------------------------------------------------------
const orgs = [];
const users = [];
const contacts = [];
const jobs = [];
const estimates = [];
const signatures = [];
const invoices = [];
const payments = [];
const activities = [];

const org = { id: id("org"), name: "Summit Ridge Exteriors", createdAt: daysAgo(400) };
orgs.push(org);
const owner = { id: id("usr"), orgId: org.id, email: "owner@summitridge.example", name: "Sam Ridgely", role: "owner" };
users.push(owner);
users.push({ id: id("usr"), orgId: org.id, email: "sales@summitridge.example", name: "Tara Vargas", role: "sales" });

let invoiceNo = 1000;

function newContact(overrides = {}) {
  const fn = pick(FIRST);
  const ln = pick(LAST);
  const c = {
    id: id("con"),
    orgId: org.id,
    name: `${fn} ${ln}`,
    email: `${fn}.${ln}@example.com`.toLowerCase(),
    phone: `(${int(200, 989)}) ${int(200, 989)}-${int(1000, 9999)}`,
    address: `${int(100, 9999)} ${pick(STREETS)}, ${pick(CITIES)}`,
    createdAt: daysAgo(int(1, 380)),
    ...overrides,
  };
  contacts.push(c);
  return c;
}

function buildOptions() {
  const tiers = ["good", "better", "best"];
  const n = int(3, 5);
  const chosen = [];
  for (let i = 0; i < n; i++) chosen.push(ITEMS[(i * 3 + int(0, 2)) % ITEMS.length]);
  return tiers.map((tier, ti) => ({
    tier,
    name: { good: "Essential", better: "Recommended", best: "Premium" }[tier],
    lineItems: chosen.map(([desc, lo, hi]) => ({
      id: id("li"),
      description: desc,
      quantity: int(1, 30),
      // better/best tiers priced a bit higher
      unitPriceCents: int(lo, hi) + ti * int(0, 2000),
    })),
  }));
}

function optionSubtotal(opt) {
  return opt.lineItems.reduce((s, li) => s + Math.round(li.quantity * li.unitPriceCents), 0);
}
function totals(est) {
  const opt = est.options.find((o) => o.tier === (est.selectedTier || "better")) || est.options[0];
  const sub = optionSubtotal(opt);
  const disc = Math.min(Math.max(est.discountCents, 0), sub);
  const taxable = sub - disc;
  const tax = Math.round((taxable * est.taxRatePct) / 100);
  return { subtotalCents: sub, taxCents: tax, totalCents: taxable + tax };
}

function act(jobId, type, message, when) {
  activities.push({ id: id("act"), orgId: org.id, jobId, type, message, createdAt: when });
}

// Build a job at a target stage with all the downstream rows it implies.
function buildJob(stage, contact, opts = {}) {
  const created = daysAgo(int(2, 360));
  const job = {
    id: id("job"),
    orgId: org.id,
    contactId: contact.id,
    title: `${contact.name} — ${pick(["roof replacement", "storm repair", "re-roof", "new construction", "insurance claim"])}`,
    stage,
    leadSource: pick(SOURCES),
    priority: pick(PRIORITIES),
    createdAt: created,
    updatedAt: created,
  };
  jobs.push(job);
  act(job.id, "lead_created", `Lead created for ${contact.name}.`, created);

  const advanced = ["estimating", "proposal_sent", "won", "invoiced", "paid"].includes(stage);
  if (!advanced) return job;

  // primary estimate
  const est = {
    id: id("est"),
    orgId: org.id,
    jobId: job.id,
    status: "draft",
    options: opts.options || buildOptions(),
    taxRatePct: pick([0, 4.5, 6, 7.25, 8.375]),
    discountCents: chance(0.3) ? int(0, 50000) : 0,
    createdAt: created,
  };
  estimates.push(est);
  act(job.id, "estimate_created", "Estimate drafted with 3 options.", created);

  if (stage === "estimating") return job;

  // sent
  est.status = "sent";
  est.sendToken = id("tok").replace("tok_", "");
  est.sentAt = daysAgo(int(1, 30));
  act(job.id, "estimate_sent", "Estimate sent to the homeowner for signature.", est.sentAt);
  if (stage === "proposal_sent") return job;

  // signed
  est.status = "signed";
  est.selectedTier = pick(["good", "better", "best"]);
  est.signedAt = daysAgo(int(1, 20));
  const sig = {
    id: id("sig"),
    orgId: org.id,
    estimateId: est.id,
    signerName: contact.name,
    signedTier: est.selectedTier,
    imageDataUrl: opts.bigSignature
      ? "data:image/png;base64," + "A".repeat(260_000) // adversarial: oversized signature
      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    signedAt: est.signedAt,
  };
  signatures.push(sig);
  est.signatureId = sig.id;
  act(job.id, "estimate_signed", `${contact.name} signed the ${est.selectedTier} option.`, est.signedAt);
  if (stage === "won") return job;

  // invoiced
  const t = totals(est);
  const inv = {
    id: id("inv"),
    orgId: org.id,
    jobId: job.id,
    estimateId: est.id,
    number: `INV-${++invoiceNo}`,
    status: "open",
    subtotalCents: t.subtotalCents,
    taxCents: t.taxCents,
    totalCents: t.totalCents,
    amountPaidCents: 0,
    createdAt: daysAgo(int(1, 15)),
    dueDate: daysAgo(int(-30, 0)),
  };
  invoices.push(inv);
  act(job.id, "invoice_created", `Invoice ${inv.number} created.`, inv.createdAt);
  if (stage === "invoiced") return job;

  // paid
  inv.status = "paid";
  inv.amountPaidCents = inv.totalCents;
  payments.push({
    id: id("pay"),
    orgId: org.id,
    invoiceId: inv.id,
    amountCents: inv.totalCents,
    method: pick(["card", "ach", "check", "cash"]),
    status: "succeeded",
    providerRef: `demo_${id("ref")}`,
    createdAt: daysAgo(int(0, 10)),
  });
  act(job.id, "payment_recorded", "Payment recorded — invoice paid in full.", daysAgo(int(0, 10)));
  return job;
}

// ---- bulk contacts (incl. dedupe edge cases) -------------------------------
const CONTACTS_N = 1200;
for (let i = 0; i < CONTACTS_N - 200; i++) newContact();
// 80 exact-duplicate emails of existing contacts
for (let i = 0; i < 80; i++) {
  const src = pick(contacts);
  newContact({ email: src.email, name: src.name });
}
// 70 near-dupes: same phone, different email
for (let i = 0; i < 70; i++) {
  const src = pick(contacts);
  newContact({ phone: src.phone });
}
// 50 name-only rows (no email/phone) — never dedupe, multiply on re-import
for (let i = 0; i < 50; i++) newContact({ email: undefined, phone: undefined, address: undefined });

// ---- bulk jobs across every stage ------------------------------------------
// weighted so the funnel narrows realistically
const STAGE_WEIGHTS = [
  ["lead", 0.34],
  ["estimating", 0.2],
  ["proposal_sent", 0.13],
  ["won", 0.1],
  ["invoiced", 0.09],
  ["paid", 0.14],
];
function weightedStage() {
  let r = rand();
  for (const [s, w] of STAGE_WEIGHTS) {
    if (r < w) return s;
    r -= w;
  }
  return "lead";
}
const JOBS_N = 1500;
const realContacts = contacts.filter((c) => c.email || c.phone);
for (let i = 0; i < JOBS_N; i++) buildJob(weightedStage(), pick(realContacts));

// ---- adversarial special cases ---------------------------------------------
// 1. int4-overflow estimate → invoice totals exceed Postgres integer (dev/prod divergence)
{
  const c = newContact({ name: "Overflow Testcase LLC" });
  const bigOptions = [
    { tier: "good", name: "Essential", lineItems: [{ id: id("li"), description: "Massive commercial re-roof", quantity: 500, unitPriceCents: 9_000_000 }] },
    { tier: "better", name: "Recommended", lineItems: [{ id: id("li"), description: "Massive commercial re-roof", quantity: 600, unitPriceCents: 9_500_000 }] },
    { tier: "best", name: "Premium", lineItems: [{ id: id("li"), description: "Massive commercial re-roof", quantity: 700, unitPriceCents: 10_000_000 }] },
  ];
  buildJob("invoiced", c, { options: bigOptions }); // totalCents ~ 5.7e9 > int4 max 2.147e9
}
// 2. multiple SIGNED estimates on one job (ambiguous createInvoice / first-not-latest)
{
  const c = newContact({ name: "Multi-Signed Household" });
  const job = buildJob("won", c);
  const extra = {
    id: id("est"), orgId: org.id, jobId: job.id, status: "signed",
    options: buildOptions(), selectedTier: "best", taxRatePct: 6, discountCents: 0,
    createdAt: daysAgo(3), sentAt: daysAgo(2), signedAt: daysAgo(1),
  };
  const sig = { id: id("sig"), orgId: org.id, estimateId: extra.id, signerName: c.name, signedTier: "best", imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", signedAt: daysAgo(1) };
  extra.signatureId = sig.id;
  estimates.push(extra); signatures.push(sig);
  act(job.id, "estimate_signed", `${c.name} signed a second estimate.`, daysAgo(1));
}
// 3. PAID job that also has a fresh DRAFT estimate (backward-transition hazard)
{
  const c = newContact({ name: "Repeat Customer — Backward Transition" });
  const job = buildJob("paid", c);
  estimates.push({ id: id("est"), orgId: org.id, jobId: job.id, status: "draft", options: buildOptions(), taxRatePct: 7.25, discountCents: 0, createdAt: daysAgo(0) });
  act(job.id, "estimate_created", "New estimate drafted on an already-paid job.", daysAgo(0));
}
// 4. oversized signature payload (unbounded imageDataUrl)
{
  const c = newContact({ name: "Oversized Signature Blob" });
  buildJob("won", c, { bigSignature: true });
}

// ---- write -----------------------------------------------------------------
const dataset = { orgs, users, contacts, jobs, estimates, signatures, invoices, payments, activities };
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(dataset, null, 2));

const counts = Object.fromEntries(Object.entries(dataset).map(([k, v]) => [k, v.length]));
const bytes = JSON.stringify(dataset).length;
console.log("wrote", outFile);
console.log("counts:", JSON.stringify(counts));
console.log("size:", (bytes / 1_048_576).toFixed(1), "MB");

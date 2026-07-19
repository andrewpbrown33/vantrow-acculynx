import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { genId, genToken } from "./ids";
import { buildSeedDataset } from "./seed";
import { createServerSupabase, isSupabaseConfigured } from "./supabase/server";
import { createServiceSupabase } from "./supabase/service";
import type {
  Activity,
  Contact,
  Dataset,
  Estimate,
  EstimateOption,
  EstimateStatus,
  EstimateTier,
  Invoice,
  InvoiceStatus,
  Job,
  JobPriority,
  JobStage,
  Org,
  Payment,
  PaymentMethod,
  Signature,
  User,
  UserRole,
} from "./types";

/** All job stages shown as pipeline columns, in workflow order (excludes dead). */
export const PIPELINE_STAGES: JobStage[] = [
  "lead",
  "estimating",
  "proposal_sent",
  "won",
  "invoiced",
  "paid",
];

// ---- Create/patch input shapes (the store owns id + timestamp generation) ----

export type NewOrg = Omit<Org, "id" | "createdAt">;
export type OrgPatch = Partial<Omit<Org, "id" | "createdAt">>;
export type NewUser = Omit<User, "id">;
export type NewContact = Omit<Contact, "id" | "createdAt">;
export type NewJob = Omit<Job, "id" | "createdAt" | "updatedAt">;
export type JobPatch = Partial<Omit<Job, "id" | "orgId" | "createdAt" | "updatedAt">>;
export type NewEstimate = Omit<Estimate, "id" | "createdAt">;
export type EstimatePatch = Partial<
  Omit<Estimate, "id" | "orgId" | "jobId" | "createdAt">
>;
export type NewSignature = Omit<Signature, "id" | "signedAt">;
export type NewInvoice = Omit<Invoice, "id" | "createdAt">;
export type InvoicePatch = Partial<
  Omit<Invoice, "id" | "orgId" | "jobId" | "estimateId" | "createdAt">
>;
export type NewPayment = Omit<Payment, "id" | "createdAt">;
export type NewActivity = Omit<Activity, "id" | "createdAt">;

export interface JobBundle {
  job: Job;
  contact: Contact | undefined;
  estimates: Estimate[];
  invoices: Invoice[];
  activities: Activity[];
}

/**
 * A job plus just the relations the pipeline board needs (contact + the
 * estimates/invoices used to compute display value). `listPipeline` returns
 * these for a whole org in ONE pass, so the board avoids a per-job bundle
 * fetch (which was O(jobs) full-file reads / N+1 queries — see
 * docs/review/2026-07-platform-functional-review.md finding #2).
 */
export interface PipelineEntry {
  job: Job;
  contact: Contact | undefined;
  estimates: Estimate[];
  invoices: Invoice[];
}

/**
 * Data-access contract for the platform. A single implementation (FileStore)
 * backs dev + verification today; a SupabaseStore is a follow-up (see getStore).
 */
export interface PlatformStore {
  // Org
  listOrgs(): Promise<Org[]>;
  getOrg(id: string): Promise<Org | undefined>;
  createOrg(input: NewOrg): Promise<Org>;
  updateOrg(id: string, patch: OrgPatch): Promise<Org>;
  // User
  listUsers(orgId: string): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  createUser(input: NewUser): Promise<User>;
  // Contact
  listContacts(orgId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(input: NewContact): Promise<Contact>;
  updateContact(id: string, patch: Partial<NewContact>): Promise<Contact>;
  // Job
  listJobs(orgId: string): Promise<Job[]>;
  jobsByStage(orgId: string): Promise<Record<JobStage, Job[]>>;
  getJob(id: string): Promise<Job | undefined>;
  /** Public homeowner-portal lookup by unguessable token (service-role path). */
  getJobByPortalToken(token: string): Promise<Job | undefined>;
  createJob(input: NewJob): Promise<Job>;
  updateJob(id: string, patch: JobPatch): Promise<Job>;
  // Estimate
  listEstimates(jobId: string): Promise<Estimate[]>;
  getEstimate(id: string): Promise<Estimate | undefined>;
  getEstimateByToken(token: string): Promise<Estimate | undefined>;
  createEstimate(input: NewEstimate): Promise<Estimate>;
  updateEstimate(id: string, patch: EstimatePatch): Promise<Estimate>;
  // Signature
  getSignature(id: string): Promise<Signature | undefined>;
  createSignature(input: NewSignature): Promise<Signature>;
  // Invoice
  listInvoices(jobId: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  countInvoices(orgId: string): Promise<number>;
  createInvoice(input: NewInvoice): Promise<Invoice>;
  updateInvoice(id: string, patch: InvoicePatch): Promise<Invoice>;
  // Payment
  listPayments(invoiceId: string): Promise<Payment[]>;
  createPayment(input: NewPayment): Promise<Payment>;
  // Activity
  listActivities(jobId: string): Promise<Activity[]>;
  createActivity(input: NewActivity): Promise<Activity>;
  // Composite
  getJobBundle(jobId: string): Promise<JobBundle | undefined>;
  /** All of an org's jobs + the relations the pipeline needs, in one pass. */
  listPipeline(orgId: string): Promise<PipelineEntry[]>;
}

/** Walks up from cwd to the pnpm workspace root; falls back to cwd. */
function findRepoRoot(): string {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Structured-clone so callers can never mutate persisted state by reference. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Group items carrying a `jobId` into a Map keyed by that jobId. */
function groupByJob<T extends { jobId: string }>(items: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const bucket = m.get(it.jobId);
    if (bucket) bucket.push(it);
    else m.set(it.jobId, [it]);
  }
  return m;
}

/**
 * File-backed store: the entire dataset lives as pretty-printed JSON at
 * `<repoRoot>/.data/platform.json` (git-ignored). Every operation is funneled
 * through a promise queue so concurrent server-action calls can't interleave a
 * read-modify-write. On first access, if the file is absent, the demo dataset
 * is seeded and written. Cross-process safe because each op re-reads the file.
 */
class FileStore implements PlatformStore {
  private readonly file = path.join(findRepoRoot(), ".data", "platform.json");
  private queue: Promise<unknown> = Promise.resolve();

  private async readOrSeed(): Promise<Dataset> {
    if (existsSync(this.file)) {
      return JSON.parse(await readFile(this.file, "utf8")) as Dataset;
    }
    const seeded = buildSeedDataset();
    await this.flush(seeded);
    return seeded;
  }

  private async flush(data: Dataset): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
    await writeFile(this.file, JSON.stringify(data, null, 2), "utf8");
  }

  /** Serialized read. */
  private read<T>(fn: (d: Dataset) => T): Promise<T> {
    const next = this.queue.then(async () => fn(await this.readOrSeed()));
    this.queue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  /** Serialized read-modify-write; persists the whole dataset afterward. */
  private write<T>(fn: (d: Dataset) => T): Promise<T> {
    const next = this.queue.then(async () => {
      const data = await this.readOrSeed();
      const result = fn(data);
      await this.flush(data);
      return result;
    });
    this.queue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  // Org
  listOrgs(): Promise<Org[]> {
    return this.read((d) => clone(d.orgs));
  }
  getOrg(id: string): Promise<Org | undefined> {
    return this.read((d) => clone(d.orgs.find((o) => o.id === id)));
  }
  createOrg(input: NewOrg): Promise<Org> {
    return this.write((d) => {
      const org: Org = { ...input, id: genId("org"), createdAt: nowIso() };
      d.orgs.push(org);
      return clone(org);
    });
  }
  updateOrg(id: string, patch: OrgPatch): Promise<Org> {
    return this.write((d) => {
      const org = d.orgs.find((o) => o.id === id);
      if (!org) throw new Error(`Org ${id} not found`);
      Object.assign(org, patch);
      return clone(org);
    });
  }

  // User
  listUsers(orgId: string): Promise<User[]> {
    return this.read((d) => clone(d.users.filter((u) => u.orgId === orgId)));
  }
  getUser(id: string): Promise<User | undefined> {
    return this.read((d) => clone(d.users.find((u) => u.id === id)));
  }
  createUser(input: NewUser): Promise<User> {
    return this.write((d) => {
      const user: User = { ...input, id: genId("usr") };
      d.users.push(user);
      return clone(user);
    });
  }

  // Contact
  listContacts(orgId: string): Promise<Contact[]> {
    return this.read((d) => clone(d.contacts.filter((c) => c.orgId === orgId)));
  }
  getContact(id: string): Promise<Contact | undefined> {
    return this.read((d) => clone(d.contacts.find((c) => c.id === id)));
  }
  createContact(input: NewContact): Promise<Contact> {
    return this.write((d) => {
      const contact: Contact = { ...input, id: genId("con"), createdAt: nowIso() };
      d.contacts.push(contact);
      return clone(contact);
    });
  }
  updateContact(id: string, patch: Partial<NewContact>): Promise<Contact> {
    return this.write((d) => {
      const contact = d.contacts.find((c) => c.id === id);
      if (!contact) throw new Error(`Contact ${id} not found`);
      Object.assign(contact, patch);
      return clone(contact);
    });
  }

  // Job
  listJobs(orgId: string): Promise<Job[]> {
    return this.read((d) => clone(d.jobs.filter((j) => j.orgId === orgId)));
  }
  jobsByStage(orgId: string): Promise<Record<JobStage, Job[]>> {
    return this.read((d) => {
      const empty: Record<JobStage, Job[]> = {
        lead: [],
        estimating: [],
        proposal_sent: [],
        won: [],
        invoiced: [],
        paid: [],
        dead: [],
      };
      for (const job of d.jobs.filter((j) => j.orgId === orgId)) {
        empty[job.stage].push(clone(job));
      }
      for (const stage of Object.keys(empty) as JobStage[]) {
        empty[stage].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      }
      return empty;
    });
  }
  getJob(id: string): Promise<Job | undefined> {
    return this.read((d) => clone(d.jobs.find((j) => j.id === id)));
  }
  createJob(input: NewJob): Promise<Job> {
    return this.write((d) => {
      const ts = nowIso();
      const job: Job = {
        ...input,
        portalToken: input.portalToken ?? genToken(),
        id: genId("job"),
        createdAt: ts,
        updatedAt: ts,
      };
      d.jobs.push(job);
      return clone(job);
    });
  }
  updateJob(id: string, patch: JobPatch): Promise<Job> {
    return this.write((d) => {
      const job = d.jobs.find((j) => j.id === id);
      if (!job) throw new Error(`Job ${id} not found`);
      Object.assign(job, patch, { updatedAt: nowIso() });
      return clone(job);
    });
  }

  // Estimate
  listEstimates(jobId: string): Promise<Estimate[]> {
    return this.read((d) => clone(d.estimates.filter((e) => e.jobId === jobId)));
  }
  getEstimate(id: string): Promise<Estimate | undefined> {
    return this.read((d) => clone(d.estimates.find((e) => e.id === id)));
  }
  getEstimateByToken(token: string): Promise<Estimate | undefined> {
    return this.read((d) =>
      clone(d.estimates.find((e) => e.sendToken === token)),
    );
  }
  getJobByPortalToken(token: string): Promise<Job | undefined> {
    return this.read((d) => clone(d.jobs.find((j) => j.portalToken === token)));
  }
  createEstimate(input: NewEstimate): Promise<Estimate> {
    return this.write((d) => {
      const estimate: Estimate = { ...input, id: genId("est"), createdAt: nowIso() };
      d.estimates.push(estimate);
      return clone(estimate);
    });
  }
  updateEstimate(id: string, patch: EstimatePatch): Promise<Estimate> {
    return this.write((d) => {
      const estimate = d.estimates.find((e) => e.id === id);
      if (!estimate) throw new Error(`Estimate ${id} not found`);
      Object.assign(estimate, patch);
      return clone(estimate);
    });
  }

  // Signature
  getSignature(id: string): Promise<Signature | undefined> {
    return this.read((d) => clone(d.signatures.find((s) => s.id === id)));
  }
  createSignature(input: NewSignature): Promise<Signature> {
    return this.write((d) => {
      const signature: Signature = {
        ...input,
        id: genId("sig"),
        signedAt: nowIso(),
      };
      d.signatures.push(signature);
      return clone(signature);
    });
  }

  // Invoice
  listInvoices(jobId: string): Promise<Invoice[]> {
    return this.read((d) => clone(d.invoices.filter((i) => i.jobId === jobId)));
  }
  getInvoice(id: string): Promise<Invoice | undefined> {
    return this.read((d) => clone(d.invoices.find((i) => i.id === id)));
  }
  countInvoices(orgId: string): Promise<number> {
    return this.read((d) => d.invoices.filter((i) => i.orgId === orgId).length);
  }
  createInvoice(input: NewInvoice): Promise<Invoice> {
    return this.write((d) => {
      const invoice: Invoice = { ...input, id: genId("inv"), createdAt: nowIso() };
      d.invoices.push(invoice);
      return clone(invoice);
    });
  }
  updateInvoice(id: string, patch: InvoicePatch): Promise<Invoice> {
    return this.write((d) => {
      const invoice = d.invoices.find((i) => i.id === id);
      if (!invoice) throw new Error(`Invoice ${id} not found`);
      Object.assign(invoice, patch);
      return clone(invoice);
    });
  }

  // Payment
  listPayments(invoiceId: string): Promise<Payment[]> {
    return this.read((d) =>
      clone(d.payments.filter((p) => p.invoiceId === invoiceId)),
    );
  }
  createPayment(input: NewPayment): Promise<Payment> {
    return this.write((d) => {
      const payment: Payment = { ...input, id: genId("pay"), createdAt: nowIso() };
      d.payments.push(payment);
      return clone(payment);
    });
  }

  // Activity
  listActivities(jobId: string): Promise<Activity[]> {
    return this.read((d) =>
      clone(
        d.activities
          .filter((a) => a.jobId === jobId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      ),
    );
  }
  createActivity(input: NewActivity): Promise<Activity> {
    return this.write((d) => {
      const activity: Activity = { ...input, id: genId("act"), createdAt: nowIso() };
      d.activities.push(activity);
      return clone(activity);
    });
  }

  // Composite
  getJobBundle(jobId: string): Promise<JobBundle | undefined> {
    return this.read((d) => {
      const job = d.jobs.find((j) => j.id === jobId);
      if (!job) return undefined;
      return clone({
        job,
        contact: d.contacts.find((c) => c.id === job.contactId),
        estimates: d.estimates.filter((e) => e.jobId === jobId),
        invoices: d.invoices.filter((i) => i.jobId === jobId),
        activities: d.activities
          .filter((a) => a.jobId === jobId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      });
    });
  }
  listPipeline(orgId: string): Promise<PipelineEntry[]> {
    // Single read of the dataset; join contacts/estimates/invoices in memory.
    return this.read((d) => {
      const contactById = new Map(
        d.contacts.filter((c) => c.orgId === orgId).map((c) => [c.id, c]),
      );
      const estByJob = groupByJob(d.estimates.filter((e) => e.orgId === orgId));
      const invByJob = groupByJob(d.invoices.filter((i) => i.orgId === orgId));
      return clone(
        d.jobs
          .filter((j) => j.orgId === orgId)
          .map((job) => ({
            job,
            contact: contactById.get(job.contactId),
            estimates: estByJob.get(job.id) ?? [],
            invoices: invByJob.get(job.id) ?? [],
          })),
      );
    });
  }
}

// ---------------------------------------------------------------------------
// Supabase store
//
// Maps the PlatformStore contract onto the production schema in
// supabase/migrations/0002_platform.sql. The DB is snake_case; the app types
// are camelCase — the row*/toRow mappers below are the single conversion point.
// Ids and created_at/updated_at are generated by Postgres (defaults), so
// inserts OMIT them and read the real row back via `.select().single()`.
// ---------------------------------------------------------------------------

/** Row shapes exactly as stored by 0002_platform.sql (snake_case). */
interface OrgRow {
  id: string;
  name: string;
  created_at: string;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean | null;
}
interface ContactRow {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}
interface JobRow {
  id: string;
  org_id: string;
  contact_id: string;
  title: string;
  stage: JobStage;
  lead_source: string | null;
  priority: JobPriority | null;
  dead_reason: string | null;
  portal_token: string | null;
  created_at: string;
  updated_at: string;
}
interface EstimateRow {
  id: string;
  org_id: string;
  job_id: string;
  status: EstimateStatus;
  options: EstimateOption[];
  selected_tier: EstimateTier | null;
  tax_rate_pct: number | string;
  discount_cents: number;
  send_token: string | null;
  created_at: string;
  sent_at: string | null;
  signed_at: string | null;
  signature_id: string | null;
}
interface SignatureRow {
  id: string;
  org_id: string;
  estimate_id: string;
  signer_name: string;
  signed_tier: EstimateTier;
  image_data_url: string;
  ip: string | null;
  signed_at: string;
}
interface InvoiceRow {
  id: string;
  org_id: string;
  job_id: string;
  estimate_id: string;
  number: string;
  status: InvoiceStatus;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  amount_paid_cents: number;
  created_at: string;
  due_date: string;
}
interface PaymentRow {
  id: string;
  org_id: string;
  invoice_id: string;
  amount_cents: number;
  method: PaymentMethod;
  status: "succeeded";
  provider_ref: string;
  created_at: string;
}
interface ActivityRow {
  id: string;
  org_id: string;
  job_id: string;
  type: string;
  message: string;
  created_at: string;
}

/** Drops keys whose value is `undefined` so inserts/updates omit them. */
function compact<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export function rowToOrg(r: OrgRow): Org {
  return {
    id: r.id,
    name: r.name,
    createdAt: r.created_at,
    stripeAccountId: r.stripe_account_id ?? undefined,
    stripeChargesEnabled: r.stripe_charges_enabled ?? undefined,
  };
}
function rowToContact(r: ContactRow): Contact {
  return {
    id: r.id,
    orgId: r.org_id,
    name: r.name,
    email: r.email ?? undefined,
    phone: r.phone ?? undefined,
    address: r.address ?? undefined,
    createdAt: r.created_at,
  };
}
function rowToJob(r: JobRow): Job {
  return {
    id: r.id,
    orgId: r.org_id,
    contactId: r.contact_id,
    title: r.title,
    stage: r.stage,
    leadSource: r.lead_source ?? undefined,
    priority: r.priority ?? undefined,
    deadReason: r.dead_reason ?? undefined,
    portalToken: r.portal_token ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
function rowToEstimate(r: EstimateRow): Estimate {
  return {
    id: r.id,
    orgId: r.org_id,
    jobId: r.job_id,
    status: r.status,
    options: r.options ?? [],
    selectedTier: r.selected_tier ?? undefined,
    taxRatePct: Number(r.tax_rate_pct),
    discountCents: r.discount_cents,
    sendToken: r.send_token ?? undefined,
    createdAt: r.created_at,
    sentAt: r.sent_at ?? undefined,
    signedAt: r.signed_at ?? undefined,
    signatureId: r.signature_id ?? undefined,
  };
}
function rowToSignature(r: SignatureRow): Signature {
  return {
    id: r.id,
    orgId: r.org_id,
    estimateId: r.estimate_id,
    signerName: r.signer_name,
    signedTier: r.signed_tier,
    imageDataUrl: r.image_data_url,
    ip: r.ip ?? undefined,
    signedAt: r.signed_at,
  };
}
function rowToInvoice(r: InvoiceRow): Invoice {
  return {
    id: r.id,
    orgId: r.org_id,
    jobId: r.job_id,
    estimateId: r.estimate_id,
    number: r.number,
    status: r.status,
    subtotalCents: r.subtotal_cents,
    taxCents: r.tax_cents,
    totalCents: r.total_cents,
    amountPaidCents: r.amount_paid_cents,
    createdAt: r.created_at,
    dueDate: r.due_date,
  };
}
function rowToPayment(r: PaymentRow): Payment {
  return {
    id: r.id,
    orgId: r.org_id,
    invoiceId: r.invoice_id,
    amountCents: r.amount_cents,
    method: r.method,
    status: r.status,
    providerRef: r.provider_ref,
    createdAt: r.created_at,
  };
}
function rowToActivity(r: ActivityRow): Activity {
  return {
    id: r.id,
    orgId: r.org_id,
    jobId: r.job_id,
    type: r.type as Activity["type"],
    message: r.message,
    createdAt: r.created_at,
  };
}

/**
 * Postgres-backed store. Accepts either the user-context client (RLS applies,
 * org-scoped — used for all authenticated actions) or the service-role client
 * (RLS bypassed — used only for the public e-sign path). All access control is
 * enforced by the client passed in + the 0003 RLS policies, not here.
 */
class SupabaseStore implements PlatformStore {
  constructor(private readonly db: SupabaseClient) {}

  private fail(context: string, message: string): never {
    throw new Error(`Supabase ${context} failed: ${message}`);
  }

  // Org
  async listOrgs(): Promise<Org[]> {
    const { data, error } = await this.db.from("orgs").select("*");
    if (error) this.fail("listOrgs", error.message);
    return (data as OrgRow[]).map(rowToOrg);
  }
  async getOrg(id: string): Promise<Org | undefined> {
    const { data, error } = await this.db
      .from("orgs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getOrg", error.message);
    return data ? rowToOrg(data as OrgRow) : undefined;
  }
  async createOrg(input: NewOrg): Promise<Org> {
    const { data, error } = await this.db
      .from("orgs")
      .insert({ name: input.name })
      .select()
      .single();
    if (error) this.fail("createOrg", error.message);
    return rowToOrg(data as OrgRow);
  }
  async updateOrg(id: string, patch: OrgPatch): Promise<Org> {
    const { data, error } = await this.db
      .from("orgs")
      .update(
        compact({
          name: patch.name,
          stripe_account_id: patch.stripeAccountId,
          stripe_charges_enabled: patch.stripeChargesEnabled,
        }),
      )
      .eq("id", id)
      .select()
      .single();
    if (error) this.fail("updateOrg", error.message);
    return rowToOrg(data as OrgRow);
  }

  // User — in Supabase mode, identity lives in auth.users + memberships (see
  // session.ts). These methods back the memberships table so the contract is
  // satisfied; the demo file store is the only path that exercises them.
  async listUsers(orgId: string): Promise<User[]> {
    const { data, error } = await this.db
      .from("memberships")
      .select("*")
      .eq("org_id", orgId);
    if (error) this.fail("listUsers", error.message);
    return (data as { user_id: string; org_id: string; name: string; role: UserRole }[]).map(
      (m) => ({ id: m.user_id, orgId: m.org_id, email: "", name: m.name, role: m.role }),
    );
  }
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.db
      .from("memberships")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();
    if (error) this.fail("getUser", error.message);
    if (!data) return undefined;
    const m = data as { user_id: string; org_id: string; name: string; role: UserRole };
    return { id: m.user_id, orgId: m.org_id, email: "", name: m.name, role: m.role };
  }
  createUser(_input: NewUser): Promise<User> {
    // Users are provisioned through Supabase Auth (signup), not this store.
    void _input;
    return Promise.reject(
      new Error("createUser is not supported in Supabase mode; use signUp."),
    );
  }

  // Contact
  async listContacts(orgId: string): Promise<Contact[]> {
    const { data, error } = await this.db
      .from("contacts")
      .select("*")
      .eq("org_id", orgId);
    if (error) this.fail("listContacts", error.message);
    return (data as ContactRow[]).map(rowToContact);
  }
  async getContact(id: string): Promise<Contact | undefined> {
    const { data, error } = await this.db
      .from("contacts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getContact", error.message);
    return data ? rowToContact(data as ContactRow) : undefined;
  }
  async createContact(input: NewContact): Promise<Contact> {
    const { data, error } = await this.db
      .from("contacts")
      .insert(
        compact({
          org_id: input.orgId,
          name: input.name,
          email: input.email ?? null,
          phone: input.phone ?? null,
          address: input.address ?? null,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createContact", error.message);
    return rowToContact(data as ContactRow);
  }
  async updateContact(id: string, patch: Partial<NewContact>): Promise<Contact> {
    const { data, error } = await this.db
      .from("contacts")
      .update(
        compact({
          name: patch.name,
          email: patch.email,
          phone: patch.phone,
          address: patch.address,
        }),
      )
      .eq("id", id)
      .select()
      .single();
    if (error) this.fail("updateContact", error.message);
    return rowToContact(data as ContactRow);
  }

  // Job
  async listJobs(orgId: string): Promise<Job[]> {
    const { data, error } = await this.db
      .from("jobs")
      .select("*")
      .eq("org_id", orgId);
    if (error) this.fail("listJobs", error.message);
    return (data as JobRow[]).map(rowToJob);
  }
  async jobsByStage(orgId: string): Promise<Record<JobStage, Job[]>> {
    const jobs = await this.listJobs(orgId);
    const empty: Record<JobStage, Job[]> = {
      lead: [],
      estimating: [],
      proposal_sent: [],
      won: [],
      invoiced: [],
      paid: [],
      dead: [],
    };
    for (const job of jobs) empty[job.stage].push(job);
    for (const stage of Object.keys(empty) as JobStage[]) {
      empty[stage].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return empty;
  }
  async getJob(id: string): Promise<Job | undefined> {
    const { data, error } = await this.db
      .from("jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getJob", error.message);
    return data ? rowToJob(data as JobRow) : undefined;
  }
  async createJob(input: NewJob): Promise<Job> {
    const { data, error } = await this.db
      .from("jobs")
      .insert(
        compact({
          org_id: input.orgId,
          contact_id: input.contactId,
          title: input.title,
          stage: input.stage,
          lead_source: input.leadSource ?? null,
          priority: input.priority ?? undefined,
          dead_reason: input.deadReason ?? null,
          portal_token: input.portalToken ?? genToken(),
        }),
      )
      .select()
      .single();
    if (error) this.fail("createJob", error.message);
    return rowToJob(data as JobRow);
  }
  async getJobByPortalToken(token: string): Promise<Job | undefined> {
    const { data, error } = await this.db
      .from("jobs")
      .select("*")
      .eq("portal_token", token)
      .maybeSingle();
    if (error) this.fail("getJobByPortalToken", error.message);
    return data ? rowToJob(data as JobRow) : undefined;
  }
  async updateJob(id: string, patch: JobPatch): Promise<Job> {
    const { data, error } = await this.db
      .from("jobs")
      .update(
        compact({
          contact_id: patch.contactId,
          title: patch.title,
          stage: patch.stage,
          lead_source: patch.leadSource,
          priority: patch.priority,
          dead_reason: patch.deadReason,
          portal_token: patch.portalToken,
          updated_at: new Date().toISOString(),
        }),
      )
      .eq("id", id)
      .select()
      .single();
    if (error) this.fail("updateJob", error.message);
    return rowToJob(data as JobRow);
  }

  // Estimate
  async listEstimates(jobId: string): Promise<Estimate[]> {
    const { data, error } = await this.db
      .from("estimates")
      .select("*")
      .eq("job_id", jobId);
    if (error) this.fail("listEstimates", error.message);
    return (data as EstimateRow[]).map(rowToEstimate);
  }
  async getEstimate(id: string): Promise<Estimate | undefined> {
    const { data, error } = await this.db
      .from("estimates")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getEstimate", error.message);
    return data ? rowToEstimate(data as EstimateRow) : undefined;
  }
  async getEstimateByToken(token: string): Promise<Estimate | undefined> {
    const { data, error } = await this.db
      .from("estimates")
      .select("*")
      .eq("send_token", token)
      .maybeSingle();
    if (error) this.fail("getEstimateByToken", error.message);
    return data ? rowToEstimate(data as EstimateRow) : undefined;
  }
  async createEstimate(input: NewEstimate): Promise<Estimate> {
    const { data, error } = await this.db
      .from("estimates")
      .insert(
        compact({
          org_id: input.orgId,
          job_id: input.jobId,
          status: input.status,
          options: input.options,
          selected_tier: input.selectedTier ?? null,
          tax_rate_pct: input.taxRatePct,
          discount_cents: input.discountCents,
          send_token: input.sendToken ?? null,
          sent_at: input.sentAt ?? null,
          signed_at: input.signedAt ?? null,
          signature_id: input.signatureId ?? null,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createEstimate", error.message);
    return rowToEstimate(data as EstimateRow);
  }
  async updateEstimate(id: string, patch: EstimatePatch): Promise<Estimate> {
    const { data, error } = await this.db
      .from("estimates")
      .update(
        compact({
          status: patch.status,
          options: patch.options,
          selected_tier: patch.selectedTier,
          tax_rate_pct: patch.taxRatePct,
          discount_cents: patch.discountCents,
          send_token: patch.sendToken,
          sent_at: patch.sentAt,
          signed_at: patch.signedAt,
          signature_id: patch.signatureId,
        }),
      )
      .eq("id", id)
      .select()
      .single();
    if (error) this.fail("updateEstimate", error.message);
    return rowToEstimate(data as EstimateRow);
  }

  // Signature
  async getSignature(id: string): Promise<Signature | undefined> {
    const { data, error } = await this.db
      .from("signatures")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getSignature", error.message);
    return data ? rowToSignature(data as SignatureRow) : undefined;
  }
  async createSignature(input: NewSignature): Promise<Signature> {
    const { data, error } = await this.db
      .from("signatures")
      .insert(
        compact({
          org_id: input.orgId,
          estimate_id: input.estimateId,
          signer_name: input.signerName,
          signed_tier: input.signedTier,
          image_data_url: input.imageDataUrl,
          ip: input.ip ?? null,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createSignature", error.message);
    return rowToSignature(data as SignatureRow);
  }

  // Invoice
  async listInvoices(jobId: string): Promise<Invoice[]> {
    const { data, error } = await this.db
      .from("invoices")
      .select("*")
      .eq("job_id", jobId);
    if (error) this.fail("listInvoices", error.message);
    return (data as InvoiceRow[]).map(rowToInvoice);
  }
  async getInvoice(id: string): Promise<Invoice | undefined> {
    const { data, error } = await this.db
      .from("invoices")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) this.fail("getInvoice", error.message);
    return data ? rowToInvoice(data as InvoiceRow) : undefined;
  }
  async countInvoices(orgId: string): Promise<number> {
    const { count, error } = await this.db
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId);
    if (error) this.fail("countInvoices", error.message);
    return count ?? 0;
  }
  async createInvoice(input: NewInvoice): Promise<Invoice> {
    const { data, error } = await this.db
      .from("invoices")
      .insert(
        compact({
          org_id: input.orgId,
          job_id: input.jobId,
          estimate_id: input.estimateId,
          number: input.number,
          status: input.status,
          subtotal_cents: input.subtotalCents,
          tax_cents: input.taxCents,
          total_cents: input.totalCents,
          amount_paid_cents: input.amountPaidCents,
          due_date: input.dueDate,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createInvoice", error.message);
    return rowToInvoice(data as InvoiceRow);
  }
  async updateInvoice(id: string, patch: InvoicePatch): Promise<Invoice> {
    const { data, error } = await this.db
      .from("invoices")
      .update(
        compact({
          number: patch.number,
          status: patch.status,
          subtotal_cents: patch.subtotalCents,
          tax_cents: patch.taxCents,
          total_cents: patch.totalCents,
          amount_paid_cents: patch.amountPaidCents,
          due_date: patch.dueDate,
        }),
      )
      .eq("id", id)
      .select()
      .single();
    if (error) this.fail("updateInvoice", error.message);
    return rowToInvoice(data as InvoiceRow);
  }

  // Payment
  async listPayments(invoiceId: string): Promise<Payment[]> {
    const { data, error } = await this.db
      .from("payments")
      .select("*")
      .eq("invoice_id", invoiceId);
    if (error) this.fail("listPayments", error.message);
    return (data as PaymentRow[]).map(rowToPayment);
  }
  async createPayment(input: NewPayment): Promise<Payment> {
    const { data, error } = await this.db
      .from("payments")
      .insert(
        compact({
          org_id: input.orgId,
          invoice_id: input.invoiceId,
          amount_cents: input.amountCents,
          method: input.method,
          status: input.status,
          provider_ref: input.providerRef,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createPayment", error.message);
    return rowToPayment(data as PaymentRow);
  }

  // Activity
  async listActivities(jobId: string): Promise<Activity[]> {
    const { data, error } = await this.db
      .from("activities")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });
    if (error) this.fail("listActivities", error.message);
    return (data as ActivityRow[]).map(rowToActivity);
  }
  async createActivity(input: NewActivity): Promise<Activity> {
    const { data, error } = await this.db
      .from("activities")
      .insert(
        compact({
          org_id: input.orgId,
          job_id: input.jobId,
          type: input.type,
          message: input.message,
        }),
      )
      .select()
      .single();
    if (error) this.fail("createActivity", error.message);
    return rowToActivity(data as ActivityRow);
  }

  // Composite
  async getJobBundle(jobId: string): Promise<JobBundle | undefined> {
    const job = await this.getJob(jobId);
    if (!job) return undefined;
    const [contact, estimates, invoices, activities] = await Promise.all([
      this.getContact(job.contactId),
      this.listEstimates(jobId),
      this.listInvoices(jobId),
      this.listActivities(jobId),
    ]);
    return { job, contact, estimates, invoices, activities };
  }
  async listPipeline(orgId: string): Promise<PipelineEntry[]> {
    // Four org-scoped queries total (not 1 + 5N). RLS scopes each to the org.
    const [jobs, contacts, estRes, invRes] = await Promise.all([
      this.listJobs(orgId),
      this.listContacts(orgId),
      this.db.from("estimates").select("*").eq("org_id", orgId),
      this.db.from("invoices").select("*").eq("org_id", orgId),
    ]);
    if (estRes.error) this.fail("listPipeline estimates", estRes.error.message);
    if (invRes.error) this.fail("listPipeline invoices", invRes.error.message);
    const estByJob = groupByJob((estRes.data as EstimateRow[]).map(rowToEstimate));
    const invByJob = groupByJob((invRes.data as InvoiceRow[]).map(rowToInvoice));
    const contactById = new Map(contacts.map((c) => [c.id, c]));
    return jobs.map((job) => ({
      job,
      contact: contactById.get(job.contactId),
      estimates: estByJob.get(job.id) ?? [],
      invoices: invByJob.get(job.id) ?? [],
    }));
  }
}

let fileStore: FileStore | null = null;

/**
 * Returns the active data store for the current request.
 *
 * - Supabase configured  → a SupabaseStore over the USER-CONTEXT client, so
 *   every query is org-scoped by RLS to the signed-in caller. Async because the
 *   server client reads request cookies.
 * - otherwise (dev)       → the shared FileStore (demo org + first-run seed).
 *
 * Mirrors the marketing site's env-gated adapter pattern (see waitlist.ts).
 */
export async function getStore(): Promise<PlatformStore> {
  if (isSupabaseConfigured()) {
    return new SupabaseStore(await createServerSupabase());
  }
  if (!fileStore) fileStore = new FileStore();
  return fileStore;
}

/**
 * The store for the PUBLIC, unauthenticated e-sign path.
 *
 * - Supabase configured → a SupabaseStore over the SERVICE-ROLE client, which
 *   bypasses RLS. Callers MUST look rows up strictly by an unguessable token
 *   (send_token) — never by org — since there is no authenticated user.
 * - otherwise (dev)      → the same FileStore as getStore().
 */
export function getServiceStore(): PlatformStore {
  if (isSupabaseConfigured()) {
    return new SupabaseStore(createServiceSupabase());
  }
  if (!fileStore) fileStore = new FileStore();
  return fileStore;
}

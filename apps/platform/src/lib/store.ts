import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { genId } from "./ids";
import { buildSeedDataset } from "./seed";
import type {
  Activity,
  Contact,
  Dataset,
  Estimate,
  Invoice,
  Job,
  JobStage,
  Org,
  Payment,
  Signature,
  User,
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
 * Data-access contract for the platform. A single implementation (FileStore)
 * backs dev + verification today; a SupabaseStore is a follow-up (see getStore).
 */
export interface PlatformStore {
  // Org
  listOrgs(): Promise<Org[]>;
  getOrg(id: string): Promise<Org | undefined>;
  createOrg(input: NewOrg): Promise<Org>;
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
      const job: Job = { ...input, id: genId("job"), createdAt: ts, updatedAt: ts };
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
}

let store: PlatformStore | null = null;

/**
 * Returns the active data store.
 *
 * TODO(supabase): once a Supabase project exists, add a SupabaseStore that
 * implements PlatformStore over PostgREST/pg (mirroring waitlist.ts's adapter
 * pattern) and select it here when SUPABASE_URL + service-role key are present.
 * Until then the FileStore is the single source of truth for the app.
 */
export function getStore(): PlatformStore {
  if (!store) store = new FileStore();
  return store;
}

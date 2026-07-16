/**
 * Domain types for the roofing platform.
 *
 * Money is ALWAYS integer cents. Dates are ALWAYS ISO 8601 strings. These two
 * rules keep arithmetic exact and the file/JSON store trivially serializable.
 */

export type UserRole = "owner" | "admin" | "sales" | "production";

export type JobStage =
  | "lead"
  | "estimating"
  | "proposal_sent"
  | "won"
  | "invoiced"
  | "paid"
  | "dead";

export type JobPriority = "low" | "normal" | "high";

export type EstimateTier = "good" | "better" | "best";

export type EstimateStatus = "draft" | "sent" | "signed" | "declined";

export type InvoiceStatus = "open" | "paid" | "void";

export type PaymentMethod = "card" | "ach" | "check" | "cash";

export type ActivityType =
  | "lead_created"
  | "estimate_created"
  | "estimate_sent"
  | "estimate_signed"
  | "invoice_created"
  | "payment_recorded"
  | "job_updated";

export interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Contact {
  id: string;
  orgId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  orgId: string;
  contactId: string;
  title: string;
  stage: JobStage;
  leadSource?: string;
  priority?: JobPriority;
  deadReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface EstimateOption {
  tier: EstimateTier;
  name: string;
  lineItems: LineItem[];
  notes?: string;
}

export interface Estimate {
  id: string;
  orgId: string;
  jobId: string;
  status: EstimateStatus;
  options: EstimateOption[];
  selectedTier?: EstimateTier;
  taxRatePct: number;
  discountCents: number;
  sendToken?: string;
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  signatureId?: string;
}

export interface Signature {
  id: string;
  orgId: string;
  estimateId: string;
  signerName: string;
  signedTier: EstimateTier;
  imageDataUrl: string;
  ip?: string;
  signedAt: string;
}

export interface Invoice {
  id: string;
  orgId: string;
  jobId: string;
  estimateId: string;
  number: string;
  status: InvoiceStatus;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  amountPaidCents: number;
  createdAt: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  orgId: string;
  invoiceId: string;
  amountCents: number;
  method: PaymentMethod;
  status: "succeeded";
  providerRef: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  orgId: string;
  jobId: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}

/**
 * The full persisted dataset. The file store serializes exactly this shape to
 * `<repoRoot>/.data/platform.json`. A production Supabase adapter would map
 * each array to a table (see supabase/migrations/0002_platform.sql).
 */
export interface Dataset {
  orgs: Org[];
  users: User[];
  contacts: Contact[];
  jobs: Job[];
  estimates: Estimate[];
  signatures: Signature[];
  invoices: Invoice[];
  payments: Payment[];
  activities: Activity[];
}

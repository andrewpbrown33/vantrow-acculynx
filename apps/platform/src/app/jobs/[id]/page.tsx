import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createInvoice } from "@/lib/actions";
import { StageBadge } from "@/components/stage-badge";
import { latestEstimate } from "@/lib/job";
import { estimateTotals, formatUsd } from "@/lib/money";
import { getStore } from "@/lib/store";
import type { EstimateStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ESTIMATE_STATUS_LABEL: Record<EstimateStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  signed: "Signed",
  declined: "Declined",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const store = await getStore();
  const job = await store.getJob(id);
  return { title: job ? job.title : "Job" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStore();
  const bundle = await store.getJobBundle(id);
  if (!bundle) notFound();

  const { job, contact, estimates, invoices, activities } = bundle;
  const invoice = invoices[0];
  const signed = estimates.find((e) => e.status === "signed");
  const sent = estimates.find((e) => e.status === "sent");
  const draft = estimates.find((e) => e.status === "draft");
  const latest = latestEstimate(estimates);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/pipeline" className="hover:text-foreground">
          Pipeline
        </Link>{" "}
        <span aria-hidden="true">/</span> {job.title}
      </nav>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            {job.title}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <StageBadge stage={job.stage} />
            {job.leadSource && (
              <span className="text-xs text-muted">Source: {job.leadSource}</span>
            )}
          </div>
        </div>
        <PrimaryAction
          jobId={job.id}
          invoiceId={invoice?.id}
          invoiceNumber={invoice?.number}
          hasSigned={Boolean(signed)}
          sentId={sent?.id}
          draftId={draft?.id}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Estimates */}
          <section>
            <h2 className="text-sm font-semibold text-foreground">Estimates</h2>
            {estimates.length === 0 ? (
              <p className="mt-2 rounded-lg border border-dashed border-foreground/15 p-4 text-sm text-muted">
                No estimates yet.{" "}
                <Link
                  href={`/jobs/${job.id}/estimate/new`}
                  className="font-medium text-brand hover:text-brand-dark"
                >
                  Build the first estimate
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-foreground/10 rounded-lg border border-foreground/10 bg-white">
                {estimates.map((estimate) => {
                  const totals = estimateTotals(estimate);
                  return (
                    <li key={estimate.id}>
                      <Link
                        href={`/estimates/${estimate.id}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-foreground/[0.02]"
                      >
                        <span>
                          <span className="text-sm font-medium text-foreground">
                            {estimate.options.length} option
                            {estimate.options.length === 1 ? "" : "s"}
                          </span>
                          <span className="ml-2 text-xs text-muted">
                            {ESTIMATE_STATUS_LABEL[estimate.status]}
                            {estimate.selectedTier
                              ? ` · ${estimate.selectedTier}`
                              : ""}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-brand-dark">
                          {formatUsd(totals.totalCents)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Invoices */}
          <section>
            <h2 className="text-sm font-semibold text-foreground">Invoices</h2>
            {invoices.length === 0 ? (
              <p className="mt-2 rounded-lg border border-dashed border-foreground/15 p-4 text-sm text-muted">
                {signed
                  ? "This job is won. Create an invoice from the signed estimate."
                  : "No invoices yet."}
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-foreground/10 rounded-lg border border-foreground/10 bg-white">
                {invoices.map((inv) => (
                  <li key={inv.id}>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-foreground/[0.02]"
                    >
                      <span>
                        <span className="text-sm font-medium text-foreground">
                          {inv.number}
                        </span>
                        <span className="ml-2 text-xs uppercase text-muted">
                          {inv.status}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-brand-dark">
                        {formatUsd(inv.totalCents)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Activity */}
          <section>
            <h2 className="text-sm font-semibold text-foreground">Activity</h2>
            {activities.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No activity yet.</p>
            ) : (
              <ol className="mt-3 space-y-3 border-l border-foreground/10 pl-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="relative">
                    <span
                      className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted">
                      {formatDate(activity.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Contact sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-foreground/10 bg-white p-4">
            <h2 className="text-sm font-semibold text-foreground">Contact</h2>
            {contact ? (
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="sr-only">Name</dt>
                  <dd className="font-medium text-foreground">{contact.name}</dd>
                </div>
                {contact.email && (
                  <div>
                    <dt className="text-xs text-muted">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <dt className="text-xs text-muted">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.address && (
                  <div>
                    <dt className="text-xs text-muted">Property</dt>
                    <dd className="text-foreground">{contact.address}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted">No contact on file.</p>
            )}
            <p className="mt-4 border-t border-foreground/10 pt-3 text-xs text-muted">
              Opened {formatDate(job.createdAt)}
              {latest ? ` · latest estimate ${formatDate(latest.createdAt)}` : ""}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PrimaryAction({
  jobId,
  invoiceId,
  invoiceNumber,
  hasSigned,
  sentId,
  draftId,
}: {
  jobId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  hasSigned: boolean;
  sentId?: string;
  draftId?: string;
}) {
  const btn =
    "inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark";

  if (invoiceId) {
    return (
      <Link href={`/invoices/${invoiceId}`} className={btn}>
        View invoice {invoiceNumber}
      </Link>
    );
  }
  if (hasSigned) {
    return (
      <form action={createInvoice.bind(null, jobId)}>
        <button type="submit" className={btn}>
          Create invoice
        </button>
      </form>
    );
  }
  if (sentId) {
    return (
      <Link href={`/estimates/${sentId}`} className={btn}>
        View sent estimate
      </Link>
    );
  }
  if (draftId) {
    return (
      <Link href={`/estimates/${draftId}`} className={btn}>
        Review &amp; send estimate
      </Link>
    );
  }
  return (
    <Link href={`/jobs/${jobId}/estimate/new`} className={btn}>
      Build estimate
    </Link>
  );
}

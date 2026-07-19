import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { PortalPayForm } from "@/components/portal-pay-form";
import { PortalStatus } from "@/components/portal-status";
import { estimateTotals, formatUsd } from "@/lib/money";
import { getServiceStore } from "@/lib/store";
import type { ActivityType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your project",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Activity types worth showing a homeowner (internal churn is hidden). */
const HOMEOWNER_ACTIVITY: ReadonlySet<ActivityType> = new Set<ActivityType>([
  "estimate_sent",
  "estimate_signed",
  "invoice_created",
  "payment_recorded",
]);

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-foreground/10 bg-white p-8 text-center">
      <h1 className="text-xl font-bold text-brand-dark">{title}</h1>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // PUBLIC, unauthenticated: the token is the capability. Service store bypasses
  // RLS (an anonymous visitor has no org membership).
  const store = getServiceStore();
  const job = await store.getJobByPortalToken(token);
  if (!job) {
    return (
      <Notice
        title="Project not found"
        body="This link is invalid. Please contact your contractor for a new one."
      />
    );
  }

  const [org, contact, estimates, invoices, activities] = await Promise.all([
    store.getOrg(job.orgId),
    store.getContact(job.contactId),
    store.listEstimates(job.id),
    store.listInvoices(job.id),
    store.listActivities(job.id),
  ]);
  const orgName = org?.name ?? brand.name;

  const signed = estimates
    .filter((e) => e.status === "signed")
    .sort((a, b) =>
      (b.signedAt ?? b.createdAt).localeCompare(a.signedAt ?? a.createdAt),
    )[0];
  const pending = estimates.find((e) => e.status === "sent");
  const invoice = invoices
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  const timeline = activities
    .filter((a) => HOMEOWNER_ACTIVITY.has(a.type))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="text-center">
        <p className="text-sm font-semibold text-brand">{orgName}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-dark">
          Your roofing project
        </h1>
        <p className="mt-1 text-sm text-muted">
          {job.title}
          {contact ? ` · Prepared for ${contact.name}` : ""}
        </p>
      </header>

      {job.stage === "dead" ? (
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-center">
          <p className="text-sm font-semibold text-amber-900">
            This project is on hold.
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Reach out to {orgName} if you&rsquo;d like to pick things back up.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-foreground/10 bg-white p-5">
          <PortalStatus stage={job.stage} />
        </div>
      )}

      {/* Estimate */}
      <section className="mt-6 rounded-xl border border-foreground/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-foreground">Your estimate</h2>
        {signed ? (
          <div className="mt-2">
            <p className="text-sm text-muted">
              Approved
              {signed.selectedTier ? ` · ${signed.selectedTier} option` : ""}
              {signed.signedAt ? ` on ${formatDate(signed.signedAt)}` : ""}
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-dark">
              {formatUsd(estimateTotals(signed).totalCents)}
            </p>
          </div>
        ) : pending ? (
          <div className="mt-2">
            <p className="text-sm text-muted">
              Your estimate is ready for review
              {pending.sentAt ? ` (sent ${formatDate(pending.sentAt)})` : ""}.
            </p>
            {pending.sendToken && (
              <Link
                href={`/sign/${pending.sendToken}`}
                className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Review &amp; approve
              </Link>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {orgName} is preparing your estimate &mdash; you&rsquo;ll see it here
            when it&rsquo;s ready.
          </p>
        )}
      </section>

      {/* Invoice */}
      {invoice && (
        <section className="mt-6 rounded-xl border border-foreground/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Invoice {invoice.number}
            </h2>
            <span className="text-xs text-muted">
              Due {formatDate(invoice.dueDate)}
            </span>
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd className="font-medium text-foreground">
                {formatUsd(invoice.totalCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Paid</dt>
              <dd className="text-foreground">
                {formatUsd(invoice.amountPaidCents)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-1">
              <dt className="font-semibold text-foreground">Balance</dt>
              <dd className="font-semibold text-brand-dark">
                {formatUsd(invoice.totalCents - invoice.amountPaidCents)}
              </dd>
            </div>
          </dl>
          {invoice.status === "paid" ? (
            <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Paid in full &mdash; thank you!
            </p>
          ) : invoice.status === "void" ? (
            <p className="mt-3 text-sm text-muted">This invoice was voided.</p>
          ) : (
            <PortalPayForm
              token={token}
              balanceCents={invoice.totalCents - invoice.amountPaidCents}
            />
          )}
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="mt-6 rounded-xl border border-foreground/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-foreground">Recent updates</h2>
          <ol className="mt-3 space-y-3 border-l border-foreground/10 pl-4">
            {timeline.map((a) => (
              <li key={a.id} className="relative">
                <span
                  className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand"
                  aria-hidden="true"
                />
                <p className="text-sm text-foreground">{a.message}</p>
                <p className="text-xs text-muted">{formatDate(a.createdAt)}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="mt-8 text-center text-xs text-muted">
        Powered by {brand.name} &mdash; {brand.endorsement}.
      </p>
    </div>
  );
}

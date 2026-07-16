import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyField } from "@/components/copy-field";
import { SendEstimate } from "@/components/send-estimate";
import { StageBadge } from "@/components/stage-badge";
import { optionSubtotalCents, tierTotals, formatUsd } from "@/lib/money";
import { getStore } from "@/lib/store";
import type { EstimateTier } from "@/lib/types";

export const dynamic = "force-dynamic";

const TIER_LABEL: Record<EstimateTier, string> = {
  good: "Good",
  better: "Better",
  best: "Best",
};

export const metadata: Metadata = {
  title: "Estimate",
};

export default async function EstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStore();
  const estimate = await store.getEstimate(id);
  if (!estimate) notFound();

  const job = await store.getJob(estimate.jobId);
  const contact = job ? await store.getContact(job.contactId) : undefined;
  const signature = estimate.signatureId
    ? await store.getSignature(estimate.signatureId)
    : undefined;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/pipeline" className="hover:text-foreground">
          Pipeline
        </Link>{" "}
        <span aria-hidden="true">/</span>{" "}
        {job && (
          <>
            <Link href={`/jobs/${job.id}`} className="hover:text-foreground">
              {job.title}
            </Link>{" "}
            <span aria-hidden="true">/</span>{" "}
          </>
        )}
        Estimate
      </nav>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
          Estimate for {contact?.name ?? "customer"}
        </h1>
        {job && <StageBadge stage={job.stage} />}
      </div>

      {/* Status-appropriate action panel */}
      <div className="mt-6 rounded-xl border border-foreground/10 bg-white p-5">
        {estimate.status === "draft" && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ready to send
              </p>
              <p className="text-sm text-muted">
                Sending generates a secure public link the homeowner can open to
                choose an option and sign — no login required.
              </p>
            </div>
            <SendEstimate estimateId={estimate.id} />
          </div>
        )}

        {estimate.status === "sent" && estimate.sendToken && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Sent for signature
            </p>
            <p className="text-sm text-muted">
              Share this link with the homeowner. It stays live until the
              estimate is signed.
            </p>
            <CopyField path={`/sign/${estimate.sendToken}`} label="Public signing link" />
            <p className="text-xs text-muted">
              <Link
                href={`/sign/${estimate.sendToken}`}
                className="font-medium text-brand hover:text-brand-dark"
              >
                Preview the homeowner view
              </Link>
            </p>
          </div>
        )}

        {estimate.status === "signed" && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Signed
                {estimate.selectedTier
                  ? ` — ${TIER_LABEL[estimate.selectedTier]} option`
                  : ""}
              </p>
              <p className="text-sm text-muted">
                {signature
                  ? `${signature.signerName} signed on ${new Date(
                      signature.signedAt,
                    ).toLocaleDateString("en-US")}.`
                  : "This estimate has been signed."}
              </p>
            </div>
            {job && (
              <Link
                href={`/jobs/${job.id}`}
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Go to job to invoice
              </Link>
            )}
          </div>
        )}

        {estimate.status === "declined" && (
          <p className="text-sm font-semibold text-rose-700">
            This estimate was declined.
          </p>
        )}
      </div>

      {/* Options */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {estimate.options.map((option) => {
          const totals = tierTotals(estimate, option.tier);
          const isSelected = estimate.selectedTier === option.tier;
          return (
            <section
              key={option.tier}
              className={
                isSelected
                  ? "rounded-xl border-2 border-brand bg-brand/[0.03] p-5"
                  : "rounded-xl border border-foreground/10 bg-white p-5"
              }
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                  {TIER_LABEL[option.tier]}
                </span>
                {isSelected && (
                  <span className="text-xs font-semibold text-brand">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                {option.name}
              </h3>
              {option.notes && (
                <p className="mt-1 text-xs text-muted">{option.notes}</p>
              )}

              <table className="mt-4 w-full text-xs">
                <tbody className="divide-y divide-foreground/10">
                  {option.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="py-1.5 pr-2 text-foreground">
                        {li.description}
                        <span className="block text-muted">
                          {li.quantity} × {formatUsd(li.unitPriceCents)}
                        </span>
                      </td>
                      <td className="py-1.5 text-right align-top font-medium tabular-nums">
                        {formatUsd(Math.round(li.quantity * li.unitPriceCents))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <dl className="mt-4 space-y-1 border-t border-foreground/10 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatUsd(optionSubtotalCents(option))}</dd>
                </div>
                {totals.discountCents > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Discount</dt>
                    <dd>-{formatUsd(totals.discountCents)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Tax ({estimate.taxRatePct}%)</dt>
                  <dd>{formatUsd(totals.taxCents)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-brand-dark">
                  <dt>Total</dt>
                  <dd>{formatUsd(totals.totalCents)}</dd>
                </div>
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}

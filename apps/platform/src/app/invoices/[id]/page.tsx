import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recordPayment } from "@/lib/actions";
import { estimateTotals, formatUsd, selectedOption } from "@/lib/money";
import { getStore } from "@/lib/store";
import type { PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "ach", label: "ACH bank transfer" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getStore().getInvoice(id);
  return { title: invoice ? invoice.number : "Invoice" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = getStore();
  const invoice = await store.getInvoice(id);
  if (!invoice) notFound();

  const [job, estimate, payments] = await Promise.all([
    store.getJob(invoice.jobId),
    store.getEstimate(invoice.estimateId),
    store.listPayments(invoice.id),
  ]);
  const contact = job ? await store.getContact(job.contactId) : undefined;
  const option = estimate ? selectedOption(estimate) : undefined;
  const totals = estimate ? estimateTotals(estimate) : null;

  const balance = invoice.totalCents - invoice.amountPaidCents;
  const isPaid = invoice.status === "paid" || balance <= 0;

  // Inline server action: parse the form and delegate to recordPayment.
  async function pay(formData: FormData): Promise<void> {
    "use server";
    const dollars = Number(formData.get("amount"));
    const method = String(formData.get("method")) as PaymentMethod;
    await recordPayment(invoice!.id, {
      amountCents: Math.round(dollars * 100),
      method,
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
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
        {invoice.number}
      </nav>

      <div className="mt-4 rounded-xl border border-foreground/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
              {invoice.number}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Issued {formatDate(invoice.createdAt)} · Due{" "}
              {formatDate(invoice.dueDate)}
            </p>
          </div>
          {isPaid ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
              Paid
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
              Balance due {formatUsd(balance)}
            </span>
          )}
        </div>

        {contact && (
          <div className="mt-4 text-sm">
            <p className="text-xs text-muted">Bill to</p>
            <p className="font-medium text-foreground">{contact.name}</p>
            {contact.address && (
              <p className="text-muted">{contact.address}</p>
            )}
          </div>
        )}

        {/* Line items from the signed estimate's selected option */}
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-left text-xs text-muted">
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Unit</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {option ? (
              option.lineItems.map((li) => (
                <tr key={li.id}>
                  <td className="py-2 pr-2 text-foreground">{li.description}</td>
                  <td className="py-2 text-right tabular-nums">{li.quantity}</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatUsd(li.unitPriceCents)}
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {formatUsd(Math.round(li.quantity * li.unitPriceCents))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 text-muted" colSpan={4}>
                  Line items unavailable.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <dl className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatUsd(invoice.subtotalCents)}</dd>
          </div>
          {totals && totals.discountCents > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Discount</dt>
              <dd>-{formatUsd(totals.discountCents)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Tax</dt>
            <dd>{formatUsd(invoice.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-foreground/10 pt-1 text-base font-bold text-brand-dark">
            <dt>Total</dt>
            <dd>{formatUsd(invoice.totalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Amount paid</dt>
            <dd>{formatUsd(invoice.amountPaidCents)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Balance</dt>
            <dd>{formatUsd(Math.max(balance, 0))}</dd>
          </div>
        </dl>
      </div>

      {/* Record payment */}
      {!isPaid && (
        <div className="mt-6 rounded-xl border border-foreground/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Record a payment
          </h2>
          <form action={pay} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor="amount" className="block text-xs font-medium text-muted">
                Amount ($)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                defaultValue={(Math.max(balance, 0) / 100).toFixed(2)}
                className="mt-1 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label htmlFor="method" className="block text-xs font-medium text-muted">
                Method
              </label>
              <select
                id="method"
                name="method"
                defaultValue="card"
                className="mt-1 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Record payment
            </button>
          </form>
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
            Demo mode: payments are recorded directly without a payment
            processor. Live card &amp; ACH collection via a PSP (e.g. Stripe) is
            a planned follow-up.
          </p>
        </div>
      )}

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="mt-6 rounded-xl border border-foreground/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-foreground">Payments</h2>
          <ul className="mt-3 divide-y divide-foreground/10 text-sm">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span>
                  <span className="font-medium text-foreground">
                    {formatUsd(payment.amountCents)}
                  </span>
                  <span className="ml-2 text-xs uppercase text-muted">
                    {payment.method}
                  </span>
                </span>
                <span className="text-right text-xs text-muted">
                  {formatDate(payment.createdAt)}
                  <span className="block font-mono">{payment.providerRef}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  startJobFromContact,
  startJobsFromContacts,
} from "@/lib/migration-actions";

/** A contacts row, pre-shaped on the server (dates preformatted for stable SSR). */
export interface ContactRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  addedLabel: string;
  /** Set when the contact already has a job — it links to that job instead. */
  jobId?: string;
}

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export function ContactsTable({ rows }: { rows: ContactRow[] }) {
  // Only contacts without a job yet can be added to the pipeline.
  const selectableIds = useMemo(
    () => rows.filter((r) => !r.jobId).map((r) => r.id),
    [rows],
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selectableCount = selectableIds.length;
  const allSelected = selectableCount > 0 && selected.size === selectableCount;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === selectableCount ? new Set() : new Set(selectableIds),
    );
  }

  function addSelected() {
    if (selected.size === 0) return;
    const ids = [...selected];
    setError(null);
    startTransition(async () => {
      try {
        await startJobsFromContacts(ids);
      } catch (err) {
        if (isNextRedirect(err)) throw err;
        setError("Something went wrong adding those to your pipeline. Please try again.");
      }
    });
  }

  return (
    <div>
      {/* Bulk action bar — appears once at least one contact is selected. */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3">
          <p className="text-sm font-medium text-brand-dark">
            {selected.size} contact{selected.size === 1 ? "" : "s"} selected
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={addSelected}
              disabled={pending}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Adding…"
                : `Add ${selected.size} to pipeline`}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-foreground/10 bg-white">
        <table className="w-full min-w-[52rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-left text-xs text-muted">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all contacts not yet in the pipeline"
                  checked={allSelected}
                  disabled={selectableCount === 0}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-foreground/30 accent-brand disabled:opacity-40"
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {rows.map((row) => {
              const inPipeline = Boolean(row.jobId);
              return (
                <tr key={row.id} className="align-middle">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.name}`}
                      checked={selected.has(row.id)}
                      disabled={inPipeline}
                      onChange={() => toggle(row.id)}
                      className="h-4 w-4 rounded border-foreground/30 accent-brand disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {row.phone ? (
                      <a
                        href={`tel:${row.phone}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {row.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{row.address ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{row.addedLabel}</td>
                  <td className="px-4 py-3 text-right">
                    {inPipeline ? (
                      <Link
                        href={`/jobs/${row.jobId}`}
                        className="text-xs font-semibold text-muted hover:text-foreground"
                      >
                        In pipeline &rarr;
                      </Link>
                    ) : (
                      <form action={startJobFromContact.bind(null, row.id)}>
                        <button
                          type="submit"
                          className="rounded-md border border-brand/40 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/5"
                        >
                          Start a job
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

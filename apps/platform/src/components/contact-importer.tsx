"use client";

import Papa from "papaparse";
import { useMemo, useRef, useState, useTransition } from "react";
import {
  MAX_IMPORT_ROWS,
  type ImportContactRow,
  type ImportSummary,
} from "@/lib/migration";
import { importContacts } from "@/lib/migration-actions";

/** The four fields we import into. `name` is required; the rest are optional. */
type FieldKey = "name" | "email" | "phone" | "address";

interface FieldDef {
  key: FieldKey;
  label: string;
  required: boolean;
  /** Substrings matched (case-insensitively) against CSV headers to auto-map. */
  hints: string[];
}

const FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Name",
    required: true,
    hints: ["full name", "customer name", "contact name", "client name", "name", "customer", "contact", "client"],
  },
  { key: "email", label: "Email", required: false, hints: ["e-mail", "email"] },
  { key: "phone", label: "Phone", required: false, hints: ["mobile", "cell", "phone", "tel"] },
  {
    key: "address",
    label: "Address",
    required: false,
    hints: ["property address", "street address", "address", "street", "property"],
  },
];

/** A parsed CSV: its header list and rows keyed by header. */
interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
}

const NONE = ""; // "map to nothing" sentinel for a select value

/** Best-guess header for a field: first header whose lowercased text hits a hint. */
function autoDetect(field: FieldDef, headers: string[], taken: Set<string>): string {
  const lowered = headers.map((h) => ({ raw: h, low: h.toLowerCase().trim() }));
  for (const hint of field.hints) {
    const match = lowered.find(
      (h) => !taken.has(h.raw) && h.low.includes(hint),
    );
    if (match) return match.raw;
  }
  return NONE;
}

function autoMap(headers: string[]): Record<FieldKey, string> {
  const taken = new Set<string>();
  const mapping = {} as Record<FieldKey, string>;
  for (const field of FIELDS) {
    const guess = autoDetect(field, headers, taken);
    mapping[field.key] = guess;
    if (guess) taken.add(guess);
  }
  return mapping;
}

const selectClass =
  "mt-1 w-full rounded-md border border-foreground/20 bg-white px-2.5 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export function ContactImporter() {
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mapping, setMapping] = useState<Record<FieldKey, string>>({
    name: NONE,
    email: NONE,
    phone: NONE,
    address: NONE,
  });
  const [parseError, setParseError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const overCap = parsed !== null && parsed.rows.length > MAX_IMPORT_ROWS;

  function reset() {
    setParsed(null);
    setFileName("");
    setMapping({ name: NONE, email: NONE, phone: NONE, address: NONE });
    setParseError(null);
    setSummary(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setParseError(null);
    setSummary(null);
    if (!file) return;
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
      complete: (result) => {
        const headers = (result.meta.fields ?? []).filter((h) => h.length > 0);
        if (headers.length === 0) {
          setParsed(null);
          setParseError(
            "Could not read any columns from that file. Make sure it is a CSV with a header row.",
          );
          return;
        }
        const rows = (result.data ?? []).filter((row) =>
          Object.values(row).some((v) => (v ?? "").toString().trim().length > 0),
        );
        setParsed({ headers, rows });
        setMapping(autoMap(headers));
      },
      error: () => {
        setParsed(null);
        setParseError("Something went wrong reading that file. Please try again.");
      },
    });
  }

  /** Build the clean, mapped rows the server action expects. */
  const mappedRows = useMemo<ImportContactRow[]>(() => {
    if (!parsed) return [];
    const pick = (row: Record<string, string>, header: string): string | undefined => {
      if (!header) return undefined;
      const value = (row[header] ?? "").toString().trim();
      return value.length > 0 ? value : undefined;
    };
    return parsed.rows.map((row) => ({
      name: pick(row, mapping.name) ?? "",
      email: pick(row, mapping.email),
      phone: pick(row, mapping.phone),
      address: pick(row, mapping.address),
    }));
  }, [parsed, mapping]);

  const previewRows = mappedRows.slice(0, 5);
  const importableCount = Math.min(
    mappedRows.filter((r) => r.name.trim().length > 0).length,
    MAX_IMPORT_ROWS,
  );
  const nameMapped = mapping.name !== NONE;

  function runImport() {
    if (!nameMapped) return;
    const payload = mappedRows.slice(0, MAX_IMPORT_ROWS);
    startTransition(async () => {
      try {
        const result = await importContacts(payload);
        setSummary(result);
      } catch (err) {
        if (isNextRedirect(err)) throw err;
        setParseError(
          "Something went wrong importing your contacts. Please try again.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="csv-file"
          className="block text-sm font-medium text-foreground"
        >
          AccuLynx contacts export (.csv)
        </label>
        <input
          id="csv-file"
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onFile}
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark"
        />
        {fileName && (
          <p className="mt-2 text-xs text-muted">
            Loaded <span className="font-medium text-foreground">{fileName}</span>
            {parsed ? ` · ${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"}` : ""}
          </p>
        )}
      </div>

      {parseError && (
        <p
          role="alert"
          className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200"
        >
          {parseError}
        </p>
      )}

      {parsed && !summary && (
        <>
          {/* Column mapping */}
          <section>
            <h3 className="text-sm font-semibold text-foreground">
              Map your columns
            </h3>
            <p className="mt-1 text-xs text-muted">
              We matched your headers automatically &mdash; adjust any that look
              wrong. Name is required.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`map-${field.key}`}
                    className="block text-xs font-medium text-muted"
                  >
                    {field.label}
                    {field.required && (
                      <span aria-hidden="true" className="text-rose-600">
                        {" "}
                        *
                      </span>
                    )}
                  </label>
                  <select
                    id={`map-${field.key}`}
                    value={mapping[field.key]}
                    onChange={(e) =>
                      setMapping((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className={selectClass}
                  >
                    <option value={NONE}>
                      {field.required ? "— Select a column —" : "— Skip —"}
                    </option>
                    {parsed.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {!nameMapped && (
              <p className="mt-2 text-xs text-rose-700">
                Choose which column holds the contact&rsquo;s name to continue.
              </p>
            )}
          </section>

          {/* Preview */}
          {nameMapped && previewRows.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-foreground">
                Preview (first {previewRows.length} of {parsed.rows.length})
              </h3>
              <div className="mt-2 overflow-x-auto rounded-lg border border-foreground/10">
                <table className="w-full min-w-[40rem] border-collapse text-sm">
                  <thead>
                    <tr className="bg-foreground/[0.03] text-left text-xs text-muted">
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                      <th className="px-3 py-2 font-medium">Phone</th>
                      <th className="px-3 py-2 font-medium">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10">
                    {previewRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-medium text-foreground">
                          {row.name || <span className="text-rose-600">(missing)</span>}
                        </td>
                        <td className="px-3 py-2 text-muted">{row.email ?? "—"}</td>
                        <td className="px-3 py-2 text-muted">{row.phone ?? "—"}</td>
                        <td className="px-3 py-2 text-muted">{row.address ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {overCap && (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
              This file has {parsed.rows.length.toLocaleString()} rows. We&rsquo;ll
              import the first {MAX_IMPORT_ROWS.toLocaleString()} now &mdash; for a
              larger list, use the concierge option below.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runImport}
              disabled={pending || !nameMapped || importableCount === 0}
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Importing…"
                : `Import ${importableCount.toLocaleString()} contact${importableCount === 1 ? "" : "s"}`}
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Choose a different file
            </button>
          </div>
        </>
      )}

      {summary && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Imported {summary.imported.toLocaleString()} contact
            {summary.imported === 1 ? "" : "s"}
            {summary.skipped > 0
              ? `, skipped ${summary.skipped.toLocaleString()} duplicate${summary.skipped === 1 ? "" : "s"}`
              : ""}
            .
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            {summary.total.toLocaleString()} row{summary.total === 1 ? "" : "s"}{" "}
            processed. Your contacts are ready on the Contacts page &mdash; open one
            to start a job.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="/contacts"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              View contacts
            </a>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Import another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

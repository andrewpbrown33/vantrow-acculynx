/**
 * Shared constants + types for the AccuLynx contacts migration.
 *
 * These live in a plain (non-"use server") module so both the client importer
 * and the server action can import them — a "use server" file may only export
 * async functions, so runtime values like MAX_IMPORT_ROWS can't live there.
 */

/** Hard ceiling on rows accepted in a single import (client cap + server cap). */
export const MAX_IMPORT_ROWS = 2000;

/**
 * One mapped contact row from the client-side CSV importer. Only `name` is
 * required; the rest are optional and may be blank (normalized server-side).
 */
export interface ImportContactRow {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

/** Result of an import run, surfaced back to the importer UI. */
export interface ImportSummary {
  imported: number;
  skipped: number;
  total: number;
}

// ---- dedupe planning (review finding #12) ---------------------------------
//
// The old importer deduped on email OR phone, which produced false-positives:
// a genuinely new person sharing a phone (family, shared office line) was
// dropped, and name-only rows never deduped so re-imports multiplied them.
// `planContactImport` is a PURE function (so it's unit-testable) that decides,
// for a batch, which normalized rows to create — using email as the strong key
// and treating phone/address/name as weaker signals that only match when the
// name matches too.

/** The subset of an existing contact the planner needs. */
export interface ExistingContactRef {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

/** A normalized row cleared for creation. */
export interface CleanContactRow {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

function normEmail(v: string | undefined): string | undefined {
  const s = (v ?? "").toLowerCase().trim();
  return s.length > 0 ? s : undefined;
}
function normPhone(v: string | undefined): string | undefined {
  const digits = (v ?? "").replace(/\D/g, "");
  return digits.length > 0 ? digits : undefined;
}
function normName(v: string | undefined): string {
  return (v ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}
function normAddr(v: string | undefined): string | undefined {
  const s = (v ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return s.length > 0 ? s : undefined;
}
function trimmedField(v: string | undefined): string | undefined {
  const s = (v ?? "").trim();
  return s.length > 0 ? s : undefined;
}

/**
 * Plan a contacts import: given the org's existing contacts and the incoming
 * rows, return the normalized rows to create and how many were skipped. Skips a
 * row when it has no name, or when it duplicates an existing contact (or an
 * earlier accepted row in the same batch) by:
 *   - email (case-insensitive) — the strong key; a new/different email always
 *     imports, even if the phone is shared;
 *   - else name + phone (phone alone is too weak to merge different people);
 *   - else name + address;
 *   - else name (so re-running a name-only list doesn't multiply rows).
 */
export function planContactImport(
  existing: ExistingContactRef[],
  rows: ImportContactRow[],
): { imports: CleanContactRow[]; skipped: number } {
  const emails = new Set<string>();
  const namePhones = new Set<string>();
  const nameAddrs = new Set<string>();
  const names = new Set<string>();

  const record = (ref: ExistingContactRef) => {
    const e = normEmail(ref.email);
    if (e) emails.add(e);
    const n = normName(ref.name);
    const p = normPhone(ref.phone);
    if (p) namePhones.add(`${n}|${p}`);
    const a = normAddr(ref.address);
    if (a) nameAddrs.add(`${n}|${a}`);
    names.add(n);
  };
  for (const c of existing) record(c);

  const imports: CleanContactRow[] = [];
  let skipped = 0;
  for (const raw of rows) {
    const name = (raw?.name ?? "").trim();
    if (!name) {
      skipped++;
      continue;
    }
    const nName = normName(name);
    const nEmail = normEmail(raw.email);
    const nPhone = normPhone(raw.phone);
    const nAddr = normAddr(raw.address);

    let duplicate: boolean;
    if (nEmail) {
      duplicate = emails.has(nEmail);
    } else if (nPhone) {
      duplicate = namePhones.has(`${nName}|${nPhone}`);
    } else if (nAddr) {
      duplicate = nameAddrs.has(`${nName}|${nAddr}`);
    } else {
      duplicate = names.has(nName);
    }
    if (duplicate) {
      skipped++;
      continue;
    }

    imports.push({
      name,
      email: trimmedField(raw.email),
      phone: trimmedField(raw.phone),
      address: trimmedField(raw.address),
    });
    // Fold the accepted row into the seen-sets so the rest of the batch dedupes
    // against it too.
    record({ name, email: raw.email, phone: raw.phone, address: raw.address });
  }
  return { imports, skipped };
}

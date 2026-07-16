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

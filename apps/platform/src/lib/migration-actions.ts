"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  MAX_IMPORT_ROWS,
  type ImportContactRow,
  type ImportSummary,
} from "./migration";
import { getSession } from "./session";
import { getStore } from "./store";

/** Digits-only phone key so `(555) 123-4567` and `555-123-4567` dedupe alike. */
function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? digits : undefined;
}

function trimmed(value: string | undefined): string | undefined {
  const s = (value ?? "").trim();
  return s.length > 0 ? s : undefined;
}

/**
 * Self-serve Contacts import (Migration Method A — the guided CSV importer).
 *
 * Creates a Contact per row for the caller's org. A row is SKIPPED when it has
 * no name, or when an existing org contact already shares the same email
 * (case-insensitive) OR the same normalized phone — so a corrected file can be
 * re-run without creating duplicates. Jobs are intentionally NOT created here
 * (that would flood the pipeline); imported contacts surface on /contacts where
 * the user turns the right ones into jobs.
 */
export async function importContacts(
  rows: ImportContactRow[],
): Promise<ImportSummary> {
  const { org } = await getSession();
  const store = await getStore();

  const existing = await store.listContacts(org.id);
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  for (const c of existing) {
    const email = c.email?.toLowerCase().trim();
    if (email) seenEmails.add(email);
    const phone = normalizePhone(c.phone);
    if (phone) seenPhones.add(phone);
  }

  const capped = Array.isArray(rows) ? rows.slice(0, MAX_IMPORT_ROWS) : [];
  let imported = 0;
  let skipped = 0;

  for (const raw of capped) {
    const name = (raw?.name ?? "").trim();
    if (!name) {
      skipped++;
      continue;
    }
    const email = trimmed(raw.email);
    const phone = trimmed(raw.phone);
    const address = trimmed(raw.address);

    const emailKey = email?.toLowerCase();
    const phoneKey = normalizePhone(phone);
    const isDuplicate =
      (emailKey !== undefined && seenEmails.has(emailKey)) ||
      (phoneKey !== undefined && seenPhones.has(phoneKey));
    if (isDuplicate) {
      skipped++;
      continue;
    }

    await store.createContact({ orgId: org.id, name, email, phone, address });
    if (emailKey) seenEmails.add(emailKey);
    if (phoneKey) seenPhones.add(phoneKey);
    imported++;
  }

  revalidatePath("/contacts");
  return { imported, skipped, total: capped.length };
}

/**
 * Turn an imported (or any) contact into a pipeline lead: creates a Job in the
 * `lead` stage titled "<Contact name> — new roof", tags the lead source as the
 * AccuLynx import, logs an activity, and opens the new job.
 */
export async function startJobFromContact(contactId: string): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const contact = await store.getContact(contactId);
  if (!contact || contact.orgId !== org.id) {
    throw new Error("Contact not found.");
  }

  const job = await store.createJob({
    orgId: org.id,
    contactId: contact.id,
    title: `${contact.name} — new roof`,
    stage: "lead",
    leadSource: "AccuLynx import",
    priority: "normal",
  });

  await store.createActivity({
    orgId: org.id,
    jobId: job.id,
    type: "lead_created",
    message: `Lead created for ${contact.name} from an imported contact.`,
  });

  revalidatePath("/pipeline");
  revalidatePath("/contacts");
  redirect(`/jobs/${job.id}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  MAX_IMPORT_ROWS,
  planContactImport,
  type ImportContactRow,
  type ImportSummary,
} from "./migration";
import { getSession } from "./session";
import { getStore } from "./store";

/**
 * Self-serve Contacts import (Migration Method A — the guided CSV importer).
 *
 * Creates a Contact per row for the caller's org, skipping duplicates. Dedupe
 * logic lives in the pure `planContactImport` (see migration.ts, finding #12):
 * email is the strong key, phone/address/name are weaker signals that only
 * match when the name matches too — so a genuinely new contact sharing a phone
 * isn't dropped, and re-running a name-only list doesn't multiply rows. Jobs are
 * intentionally NOT created here (that would flood the pipeline); imported
 * contacts surface on /contacts where the user turns the right ones into jobs.
 */
export async function importContacts(
  rows: ImportContactRow[],
): Promise<ImportSummary> {
  const { org } = await getSession();
  const store = await getStore();

  const existing = await store.listContacts(org.id);
  const capped = Array.isArray(rows) ? rows.slice(0, MAX_IMPORT_ROWS) : [];
  const { imports, skipped } = planContactImport(existing, capped);

  for (const row of imports) {
    await store.createContact({
      orgId: org.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
    });
  }

  revalidatePath("/contacts");
  return { imported: imports.length, skipped, total: capped.length };
}

/**
 * Bulk version of {@link startJobFromContact}: turn many selected contacts into
 * `lead`-stage jobs in one action, then land the user on the now-populated
 * pipeline. This is the MIGRATE → POPULATE PIPELINE bridge — the only path from
 * imported contacts to the board used to be clicking "Start a job" one row at a
 * time.
 *
 * Dedupe: a contact that already has any job is skipped, so re-running the bulk
 * add (or including a contact that was already started) never creates duplicate
 * leads. IDs are de-duplicated within the batch too. The batch is capped at
 * MAX_IMPORT_ROWS to match the importer's ceiling.
 */
export async function startJobsFromContacts(
  contactIds: string[],
): Promise<void> {
  const { org } = await getSession();
  const store = await getStore();

  const uniqueIds = Array.from(new Set(contactIds ?? [])).slice(
    0,
    MAX_IMPORT_ROWS,
  );
  if (uniqueIds.length === 0) {
    redirect("/pipeline");
  }

  const [contacts, jobs] = await Promise.all([
    store.listContacts(org.id),
    store.listJobs(org.id),
  ]);
  const contactById = new Map(contacts.map((c) => [c.id, c]));
  const contactsWithJob = new Set(jobs.map((j) => j.contactId));

  let created = 0;
  for (const id of uniqueIds) {
    const contact = contactById.get(id);
    // Skip anything not in this org, or that already has a job (dedupe).
    if (!contact || contactsWithJob.has(id)) continue;

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
    contactsWithJob.add(id);
    created++;
  }

  revalidatePath("/pipeline");
  revalidatePath("/contacts");
  redirect(created > 0 ? "/pipeline" : "/contacts");
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

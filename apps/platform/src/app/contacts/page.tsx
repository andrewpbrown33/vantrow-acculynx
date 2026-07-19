import type { Metadata } from "next";
import Link from "next/link";
import { ContactsTable, type ContactRow } from "@/components/contacts-table";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacts",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ContactsPage() {
  const { org } = await getSession();
  const store = await getStore();
  const [contactsRaw, jobs] = await Promise.all([
    store.listContacts(org.id),
    store.listJobs(org.id),
  ]);
  const contacts = contactsRaw.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  // First job per contact, so a contact already in the pipeline links to it and
  // can't be re-added in bulk.
  const jobByContact = new Map<string, string>();
  for (const job of jobs) {
    if (!jobByContact.has(job.contactId)) jobByContact.set(job.contactId, job.id);
  }

  const rows: ContactRow[] = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    addedLabel: formatDate(c.createdAt),
    jobId: jobByContact.get(c.id),
  }));
  const addableCount = rows.filter((r) => !r.jobId).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-muted">
            {org.name} &middot; {contacts.length} contact
            {contacts.length === 1 ? "" : "s"}
            {addableCount > 0 ? (
              <>
                {" "}
                &middot; {addableCount} not yet in the pipeline
              </>
            ) : null}
          </p>
        </div>
        <Link
          href="/onboarding"
          className="rounded-md border border-brand/40 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
        >
          Import from AccuLynx
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-foreground/15 p-10 text-center">
          <p className="text-sm font-medium text-foreground">No contacts yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Import your contacts from AccuLynx to get started, or add them as you
            create leads.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Import from AccuLynx
            </Link>
            <Link
              href="/leads/new"
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Add a lead manually
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <ContactsTable rows={rows} />
        </div>
      )}
    </div>
  );
}

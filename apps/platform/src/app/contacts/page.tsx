import type { Metadata } from "next";
import Link from "next/link";
import { startJobFromContact } from "@/lib/migration-actions";
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
  const contacts = (await store.listContacts(org.id)).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

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
        <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10 bg-white">
          <table className="w-full min-w-[48rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-left text-xs text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {contacts.map((contact) => (
                <tr key={contact.id} className="align-middle">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {contact.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {contact.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-brand hover:text-brand-dark"
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{contact.address ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={startJobFromContact.bind(null, contact.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-brand/40 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/5"
                      >
                        Start a job
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

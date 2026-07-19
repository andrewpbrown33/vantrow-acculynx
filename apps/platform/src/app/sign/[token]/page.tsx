import type { Metadata } from "next";
import { brand } from "@vantrow/brand";
import { SignForm } from "@/components/sign-form";
import { isSignLinkExpired } from "@/lib/sign";
import { getServiceStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review & sign your estimate",
};

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-foreground/10 bg-white p-8 text-center">
      <h1 className="text-xl font-bold text-brand-dark">{title}</h1>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export default async function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // PUBLIC, unauthenticated read: use the service-role store and match strictly
  // by token (the RLS user client would see nothing for an anonymous visitor).
  const store = getServiceStore();
  const estimate = await store.getEstimateByToken(token);

  if (!estimate) {
    return (
      <Notice
        title="Link not found"
        body="This signing link is invalid or has expired. Please contact your contractor for a new one."
      />
    );
  }

  const [org, job] = await Promise.all([
    store.getOrg(estimate.orgId),
    store.getJob(estimate.jobId),
  ]);
  const contact = job ? await store.getContact(job.contactId) : undefined;
  const orgName = org?.name ?? brand.name;

  if (estimate.status === "signed") {
    return (
      <Notice
        title="Already signed"
        body={`This estimate has already been approved${
          estimate.selectedTier ? ` (${estimate.selectedTier} option)` : ""
        }. Thank you!`}
      />
    );
  }
  if (estimate.status === "declined" || estimate.status === "draft") {
    return (
      <Notice
        title="Not available yet"
        body="This estimate isn't ready for signature. Please contact your contractor."
      />
    );
  }
  if (isSignLinkExpired(estimate.sentAt)) {
    return (
      <Notice
        title="This link has expired"
        body="For your security, signing links expire after 30 days. Please contact your contractor for a fresh link."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="text-center">
        <p className="text-sm font-semibold text-brand">{orgName}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-dark">
          Review &amp; approve your estimate
        </h1>
        {job && (
          <p className="mt-1 text-sm text-muted">
            {job.title}
            {contact ? ` · Prepared for ${contact.name}` : ""}
          </p>
        )}
      </header>

      <div className="mt-8">
        <SignForm
          token={token}
          estimate={estimate}
          orgName={orgName}
          jobTitle={job?.title ?? "your project"}
          contactName={contact?.name ?? ""}
        />
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Powered by {brand.name} — {brand.endorsement}.
      </p>
    </div>
  );
}

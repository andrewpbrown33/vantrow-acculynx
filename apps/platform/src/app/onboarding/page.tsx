import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { ContactImporter } from "@/components/contact-importer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get started",
};

const conciergeSubject = encodeURIComponent("AccuLynx migration — please load my export");
const conciergeBody = encodeURIComponent(
  "Hi team,\n\nI'd like help migrating from AccuLynx. My export files are attached.\n\nThanks!",
);
const conciergeMailto = `mailto:${brand.supportEmail}?subject=${conciergeSubject}&body=${conciergeBody}`;

function SectionHeading({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {n}
      </span>
      <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Welcome to {brand.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-dark">
          Bring your data over from AccuLynx
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
          You own your AccuLynx data &mdash; let&rsquo;s get it into {brand.name}.
          Contacts and jobs export cleanly as a spreadsheet; import your contacts
          yourself below in a couple of minutes, and we&rsquo;ll handle the rest for
          you.
        </p>
      </header>

      {/* Warning banner — export before you cancel (ToS §15). */}
      <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Export from AccuLynx <span className="underline">before you cancel</span>.
        </p>
        <p className="mt-1 text-sm text-amber-800">
          AccuLynx only lets you download your data while your subscription is
          active. After you cancel, they&rsquo;re no longer obligated to keep it and
          may delete it. Pull your export first &mdash; then switch.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Section 1 — Export playbook */}
        <section className="rounded-xl border border-foreground/10 bg-white p-6">
          <SectionHeading n={1} title="Export your data from AccuLynx" />
          <div className="mt-4 space-y-4 text-sm text-foreground">
            <p className="text-muted">
              AccuLynx lets any customer export their structured records to a
              spreadsheet from the Reports area. Here&rsquo;s the path:
            </p>
            <ol className="ml-1 space-y-2">
              {[
                "Open the Reports tab and pick a contact- or jobs-oriented report (e.g. Jobs Report or a contacts report).",
                "Set the date range to All Data so nothing is left behind.",
                "Choose Actions → Edit Report → Columns, and tick the fields you want: contact name, phone, email, property address, job stage, dates, lead source, and any custom fields.",
                "Apply, then Actions → Download / Export and choose CSV.",
                "Repeat for both your Contacts and your Jobs so you have each as its own CSV.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
              <p className="text-sm font-semibold text-foreground">
                What doesn&rsquo;t come out in the export
              </p>
              <p className="mt-1 text-sm text-muted">
                The spreadsheet export covers contacts, jobs, and custom fields.
                It does <span className="font-semibold text-foreground">not</span>{" "}
                include your <span className="font-medium">photos, documents and
                signed PDFs, message and text history, or automations and
                templates</span>. Those don&rsquo;t bulk-export from AccuLynx &mdash;
                our team migrates the files by hand (Section 3) and automations get
                rebuilt fresh in {brand.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — Self-serve contacts import */}
        <section className="rounded-xl border border-foreground/10 bg-white p-6">
          <SectionHeading n={2} title="Import your contacts" />
          <p className="mt-3 text-sm text-muted">
            Upload the Contacts CSV you just exported. We&rsquo;ll auto-match the
            columns, let you preview the result, and skip any duplicates you already
            have. This one&rsquo;s fully self-serve &mdash; no waiting on us.
          </p>
          <div className="mt-5">
            <ContactImporter />
          </div>
        </section>

        {/* Section 3 — Concierge */}
        <section className="rounded-xl border border-foreground/10 bg-white p-6">
          <SectionHeading n={3} title="Jobs, photos & everything else" />
          <p className="mt-3 text-sm text-muted">
            Prefer we handle the full migration &mdash; jobs, photos, documents, and
            the messy long tail? Email your complete AccuLynx export (and any files
            you&rsquo;ve downloaded) to our team and we&rsquo;ll load it for you,
            usually within one business day.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href={conciergeMailto}
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Email your export to us
            </a>
            <a
              href={`mailto:${brand.supportEmail}`}
              className="text-sm font-medium text-brand hover:text-brand-dark"
            >
              {brand.supportEmail}
            </a>
          </div>
        </section>
      </div>

      <div className="mt-8 border-t border-foreground/10 pt-6 text-center">
        <Link
          href="/pipeline"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Skip for now &rarr; Go to dashboard
        </Link>
      </div>
    </div>
  );
}

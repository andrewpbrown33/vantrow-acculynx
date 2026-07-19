import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { ContactImporter } from "@/components/contact-importer";
import { IntegrationHarvester } from "@/components/integration-harvester";

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
              There are two ways to get your records out of AccuLynx. The quick
              built-in export covers contacts and leads; the Reports export adds
              jobs and any custom fields.
            </p>

            <div className="rounded-lg border border-foreground/10 p-4">
              <p className="font-semibold text-foreground">
                Fastest: the built-in contacts export{" "}
                <span className="font-normal text-muted">
                  (needs a Company or Location Administrator login)
                </span>
              </p>
              <ol className="ml-1 mt-3 space-y-2">
                {[
                  "In AccuLynx, click your name (top right) → Account Settings.",
                  "Expand Manage Leads/Contacts and choose Export Contacts and Leads.",
                  "Pick Contacts (and Leads — tick Include Prospects if you want them), then Download as .CSV.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-foreground/10 p-4">
              <p className="font-semibold text-foreground">
                For jobs + custom fields: the Reports export
              </p>
              <ol className="ml-1 mt-3 space-y-2">
                {[
                  "Open the Reports tab and pick a jobs-oriented report from the Report Library (e.g. the Jobs Report or Sales Report).",
                  "Set the date range to All Data, and set Reference Date to Lead Date so your oldest leads aren't filtered out.",
                  "Choose Actions → Edit Report, click Edit next to Columns, and tick the fields you want: contact name, phone, email, property address, job stage, dates, lead source, and any custom fields. Apply.",
                  "Choose Actions → Download / Export and pick CSV (or Excel).",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
              <p className="text-sm font-semibold text-brand-dark">
                See it done (guides with real AccuLynx screenshots)
              </p>
              <ul className="mt-2 space-y-1.5">
                {[
                  {
                    href: "https://support.acculynx.com/hc/en-us/articles/203164825-Export-Contacts-and-Leads",
                    label:
                      "AccuLynx's official guide: Export Contacts and Leads (step-by-step screenshots)",
                  },
                  {
                    href: "https://learn.projectmapit.com/help-center/how-do-i-download-a-spreadsheet-from-acculynx",
                    label:
                      "Screenshot walkthrough of the Reports export (Reports → Edit Report → Columns → Download)",
                  },
                  {
                    href: "https://support.acculynx.com/hc/en-us/articles/32038851975565-Reports-19-12",
                    label:
                      "AccuLynx's official video tour of the Reports area (19 min)",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
                    >
                      {link.label} &#8599;
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
              <p className="text-sm font-semibold text-foreground">
                What doesn&rsquo;t come out in the export
              </p>
              <p className="mt-1 text-sm text-muted">
                The spreadsheet exports cover contacts, leads, jobs, and custom
                fields. They do{" "}
                <span className="font-semibold text-foreground">not</span> include
                your <span className="font-medium">photos, documents and signed
                PDFs, text/SMS threads, or automations and templates</span> &mdash;
                those don&rsquo;t bulk-export from AccuLynx. (Message-board history
                can be exported, but only one job at a time via Job Menu &rarr;
                Settings &rarr; Export History/Comments.) Our team migrates the
                files by hand (Section 3) and automations get rebuilt fresh in{" "}
                {brand.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — Integration-partner harvesting */}
        <section className="rounded-xl border border-foreground/10 bg-white p-6">
          <SectionHeading n={2} title="Recover data from your connected tools" />
          <p className="mt-3 text-sm text-muted">
            A lot of what AccuLynx won&rsquo;t hand over &mdash; job photos, texts,
            invoices, measurements &mdash; may already live in the other tools you
            connected to it. You own those accounts, so you can export that data
            directly from them, no AccuLynx export required. Check the ones you
            used:
          </p>
          <div className="mt-5">
            <IntegrationHarvester />
          </div>
        </section>

        {/* Section 3 — Self-serve contacts import */}
        <section
          id="import"
          className="scroll-mt-24 rounded-xl border border-foreground/10 bg-white p-6"
        >
          <SectionHeading n={3} title="Import your contacts" />
          <p className="mt-3 text-sm text-muted">
            Upload the Contacts CSV you just exported. We&rsquo;ll auto-match the
            columns, let you preview the result, and skip any duplicates you already
            have. This one&rsquo;s fully self-serve &mdash; no waiting on us.
          </p>
          <div className="mt-5">
            <ContactImporter />
          </div>
        </section>

        {/* Section 4 — Concierge */}
        <section className="rounded-xl border border-foreground/10 bg-white p-6">
          <SectionHeading n={4} title="Jobs, photos & everything else" />
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

      {/* Continue into the app — a real next step for every path, including
          concierge users who won't see the importer's success CTA. */}
      <div className="mt-10 rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
        <p className="text-sm font-semibold text-brand-dark">
          Ready to get to work?
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          Head into {brand.name} now &mdash; your imported contacts are waiting,
          and anything we migrate for you will land straight in your pipeline.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pipeline"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Go to your pipeline
          </Link>
          <Link
            href="/contacts"
            className="rounded-md border border-brand/40 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            View imported contacts
          </Link>
        </div>
      </div>
    </div>
  );
}

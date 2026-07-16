import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

const pillars = [
  {
    title: "A field app that matches the desktop",
    body: "Roofing is a field trade, so the app in your pocket does everything the office screen does — build and send estimates, capture photos that finish uploading, sign, and get paid, all from the truck. One app, same on your phone as on your desktop.",
  },
  {
    title: "Everything included. No add-on maze.",
    body: "Texting, e-signature, the client dashboard, and reporting come with the plan — not sold back to you one add-on at a time. One published price, no seat minimums, and no fee to get your own data back on the way out.",
  },
  {
    title: "One job file, one search",
    body: "Docs, permits, photos, messages, and money live in a single job file. Fuzzy search finds a job by a partial address, a material, or a note — you don't have to remember the exact spelling to pull up a customer.",
  },
  {
    title: "A live dashboard for every customer",
    body: "Every homeowner gets a branded, always-current view of their job — status, appointments, documents, billing, and messages — live from the first appointment through the warranty. Fewer status calls, more referrals.",
  },
];

const modules = [
  {
    title: "Job file",
    body: "Everything about a job in one place: contacts, photos, docs, messages, and money, from first call to final check.",
  },
  {
    title: "Field app",
    body: "Do the whole job from the truck: estimates, photos, signatures, payments — same app, same power as the office.",
  },
  {
    title: "Estimating",
    body: "Pull the measurement, drop in your materials, and hand the homeowner good/better/best options in one proposal.",
  },
  {
    title: "Documents + e-sign",
    body: "Proposals, contracts, and change orders signed on the spot — e-signature built in, not a bolt-on you pay extra for.",
  },
  {
    title: "Invoicing + payments",
    body: "Invoice straight off the job's numbers and get paid by card or ACH, from the field or the client dashboard.",
  },
  {
    title: "Live client dashboard",
    body: "Give every homeowner a branded, always-current window into their job — status, docs, billing, and messages in one place.",
  },
  {
    title: "Texting + email you can trust",
    body: "Two-way texting from your own number and email with delivery receipts, so “I never got it” stops costing you jobs.",
  },
  {
    title: "Reporting + one-click export",
    body: "See your pipeline, sales, and receivables at a glance — and export all your data in one click, free, any time.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              {brand.tagline}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
              One app that runs the whole roofing job &mdash; and shows your
              customer every step live
            </h1>
            <p className="mt-6 text-lg text-muted">
              {brand.name} keeps everything from lead to collected cash in one
              place, on your phone or your desktop &mdash; with the client
              dashboard, texting, and e-sign included, not sold back to you as
              add-ons. Built AI-native from the data model up.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={routes.earlyAccess}
                className="rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Become a founding contractor
              </Link>
              <Link
                href="#live-dashboard"
                className="rounded-md border border-brand px-6 py-3 text-base font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                See a live dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section aria-labelledby="value-props-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2
            id="value-props-heading"
            className="text-3xl font-bold tracking-tight text-brand-dark"
          >
            Why roofing teams switch
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            The complaints that drive roofers off their current software are the
            problems we set out to fix first.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {pillars.map((prop) => (
              <article
                key={prop.title}
                className="rounded-lg border border-foreground/10 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-brand-dark">
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{prop.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live dashboard hook */}
      <section
        id="live-dashboard"
        aria-labelledby="live-dashboard-heading"
        className="scroll-mt-20 bg-brand-dark text-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
            The part no roofing CRM ships the way we do
          </p>
          <h2
            id="live-dashboard-heading"
            className="mt-3 max-w-3xl text-3xl font-bold tracking-tight"
          >
            A live dashboard for every job, on every plan
          </h2>
          <p className="mt-4 max-w-2xl text-white/80">
            Give every homeowner a branded link that stays true: job status,
            appointments, documents, billing, payments, and messages, always
            current &mdash; from the first appointment through the warranty, not
            switched on at approval and off at completion. It&rsquo;s bundled on
            every plan, and it&rsquo;s built to give adjusters and property
            managers their own role-scoped view too.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            <li className="rounded-lg bg-white/10 p-4 text-sm leading-6">
              Fewer &ldquo;where are we at?&rdquo; phone calls &mdash; the answer
              is already on their screen.
            </li>
            <li className="rounded-lg bg-white/10 p-4 text-sm leading-6">
              One source of truth that replaces the status email that never
              seems to arrive.
            </li>
            <li className="rounded-lg bg-white/10 p-4 text-sm leading-6">
              A branded, always-on surface that keeps earning referrals long
              after the job is done.
            </li>
          </ul>
          <p className="mt-8">
            <Link
              href={routes.earlyAccess}
              className="inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-white/90"
            >
              See a live dashboard
            </Link>
          </p>
        </div>
      </section>

      {/* Module teaser grid */}
      <section aria-labelledby="modules-heading" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2
            id="modules-heading"
            className="text-3xl font-bold tracking-tight text-brand-dark"
          >
            Everything the job runs on, in one place
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Lead to collected cash, without stitching together a stack of tools
            that can&rsquo;t talk to each other.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => (
              <article
                key={mod.title}
                className="rounded-lg border border-foreground/10 bg-background p-6"
              >
                <h3 className="text-base font-semibold text-brand-dark">
                  {mod.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{mod.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8">
            <Link
              href={routes.product}
              className="text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
            >
              Explore every module &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* Comparison teaser */}
      <section aria-labelledby="comparison-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border border-foreground/10 bg-white p-8 shadow-sm sm:p-10">
            <h2
              id="comparison-heading"
              className="text-2xl font-bold text-brand-dark"
            >
              Sizing us up against what you run today?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              We put together a capability-by-capability comparison &mdash;
              factual, dated, and sourced, including where the incumbent is
              genuinely ahead of us today. Read it and decide for yourself.
            </p>
            <p className="mt-6">
              <Link
                href={routes.compare}
                className="inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                See the comparison
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Early access CTA */}
      <section aria-labelledby="cta-heading" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2
            id="cta-heading"
            className="text-3xl font-bold tracking-tight text-brand-dark"
          >
            Become a founding contractor
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {brand.name} is onboarding a limited group of roofing companies who
            get in first: founding pricing locked for the life of the account,
            everything bundled, free one-click data export from day one, and a
            direct line to shape the product.
          </p>
          <p className="mt-8">
            <Link
              href={routes.earlyAccess}
              className="inline-block rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Become a founding contractor
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

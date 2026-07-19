import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";
import { Button, Card, Container, Eyebrow } from "@/components/ui";
import { DashboardPreview } from "@/components/dashboard-preview";

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

/** Factual, pre-launch-true trust signals shown under the hero CTAs. */
const trustSignals = [
  { text: brand.endorsement, href: brand.parentUrl },
  { text: "Founding pricing locked for life" },
  { text: "Free one-click data export" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-background">
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>{brand.tagline}</Eyebrow>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-brand-dark sm:text-6xl">
              One app that runs the whole roofing job &mdash; and shows your
              customer every step live
            </h1>
            <p className="mt-6 text-lg text-muted">
              {brand.name}{" "}
              keeps everything from lead to collected cash in one
              place, on your phone or your desktop &mdash; with the client
              dashboard, texting, and e-sign included, not sold back to you as
              add-ons. Built AI-native from the data model up.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={routes.earlyAccess}>
                Become a founding contractor
              </Button>
              <Button href="#live-dashboard" variant="outline">
                See a live dashboard
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              {trustSignals.map((signal, i) => (
                <li key={signal.text} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-brand-accent"
                    />
                  )}
                  {signal.href ? (
                    <a
                      href={signal.href}
                      rel="noopener"
                      className="underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      {signal.text}
                    </a>
                  ) : (
                    signal.text
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section aria-labelledby="value-props-heading">
        <Container className="py-16">
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
              <Card key={prop.title} accent>
                <h3 className="text-lg font-semibold text-brand-dark">
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{prop.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Live dashboard hook */}
      <section
        id="live-dashboard"
        aria-labelledby="live-dashboard-heading"
        className="scroll-mt-20 bg-brand-dark text-white"
      >
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow onDark>
                The part no roofing CRM ships the way we do
              </Eyebrow>
              <h2
                id="live-dashboard-heading"
                className="mt-3 text-3xl font-bold tracking-tight"
              >
                A live dashboard for every job, on every plan
              </h2>
              <p className="mt-4 text-white/80">
                Give every homeowner a branded link that stays true: job status,
                appointments, documents, billing, payments, and messages, always
                current &mdash; from the first appointment through the warranty,
                not switched on at approval and off at completion. It&rsquo;s
                bundled on every plan, and it&rsquo;s built to give adjusters
                and property managers their own role-scoped view too.
              </p>
              <p className="mt-4 text-white/80">
                Fewer &ldquo;where are we at?&rdquo; phone calls, one source of
                truth instead of the status email that never seems to arrive,
                and a branded surface that keeps earning referrals after the
                crew leaves.
              </p>
              <p className="mt-8">
                <Button href={routes.earlyAccess} variant="onDark" size="md">
                  See a live dashboard
                </Button>
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <DashboardPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* Module teaser grid */}
      <section aria-labelledby="modules-heading" className="bg-white">
        <Container className="py-16">
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
                <h3 className="flex items-center gap-2 text-base font-semibold text-brand-dark">
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-brand-accent"
                  />
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
        </Container>
      </section>

      {/* Comparison teaser */}
      <section aria-labelledby="comparison-heading">
        <Container className="py-16">
          <Card className="p-8 sm:p-10">
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
              <Button href={routes.compare} size="md">
                See the comparison
              </Button>
            </p>
          </Card>
        </Container>
      </section>

      {/* Early access CTA */}
      <section aria-labelledby="cta-heading" className="bg-brand-accent/10">
        <Container className="py-16 text-center">
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
            <Button href={routes.earlyAccess}>
              Become a founding contractor
            </Button>
          </p>
        </Container>
      </section>
    </>
  );
}

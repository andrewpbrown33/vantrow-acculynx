import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

const valueProps = [
  {
    title: "Simple",
    body: "Set up in an afternoon, not a quarter. One clean system your whole crew actually uses — no modules bolted on, no training binder required.",
  },
  {
    title: "AI-native",
    body: "Built around AI from day one. Estimates draft themselves, follow-ups send themselves, and paperwork files itself — you stay on the roof and in front of customers.",
  },
  {
    title: "Live client dashboards",
    body: "Every homeowner gets a personal, always-current dashboard: schedule, photos, documents, and payments in one link. Fewer status calls, more referrals.",
  },
];

const modules = [
  { title: "CRM", body: "Every lead, contact, and job in one pipeline." },
  { title: "Estimating", body: "Fast, accurate quotes with AI-drafted line items." },
  { title: "Production", body: "Scheduling, crews, and job progress at a glance." },
  { title: "Invoicing", body: "Invoices and payments without the paper chase." },
  { title: "Reporting", body: "Know your margins, pipeline, and crew utilization." },
  { title: "Mobile", body: "The whole platform in your pocket, on every roof." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            {/* TODO(copy): Phase 2 — replace hero headline/subhead with research-driven positioning */}
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              {brand.tagline}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
              The AI-native platform for roofing companies — with live
              dashboards your clients will love
            </h1>
            <p className="mt-6 text-lg text-muted">
              {brand.name} runs your back office — leads, estimates,
              production, invoicing — and gives every homeowner a live view of
              their job. Less chasing, more roofing.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={routes.earlyAccess}
                className="rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Get early access
              </Link>
              <Link
                href={routes.product}
                className="rounded-md border border-brand px-6 py-3 text-base font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                See the product
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
          {/* TODO(copy): Phase 2 — sharpen value props with customer-interview language */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {valueProps.map((prop) => (
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

      {/* Module teaser grid */}
      <section aria-labelledby="modules-heading" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2
            id="modules-heading"
            className="text-3xl font-bold tracking-tight text-brand-dark"
          >
            Everything your roofing business runs on
          </h2>
          {/* TODO(copy): Phase 2 — module blurbs from product research */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-lg border border-foreground/10 bg-brand-dark p-8 text-white sm:p-10">
            <h2 id="comparison-heading" className="text-2xl font-bold">
              Comparing platforms?
            </h2>
            {/* TODO(copy): Phase 2 — comparison teaser copy after sourced comparison lands */}
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
              We&rsquo;re putting together a detailed, sourced comparison of{" "}
              {brand.name} and the incumbent roofing platforms — capability by
              capability, with receipts.
            </p>
            <p className="mt-6">
              <Link
                href={routes.compare}
                className="inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-white/90"
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
            Be a founding customer
          </h2>
          {/* TODO(copy): Phase 2 — early-access pitch copy */}
          <p className="mx-auto mt-4 max-w-xl text-muted">
            We&rsquo;re onboarding a small group of roofing companies to shape{" "}
            {brand.name} before launch. Early access is free while we build
            together.
          </p>
          <p className="mt-8">
            <Link
              href={routes.earlyAccess}
              className="inline-block rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Get early access
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

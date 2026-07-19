import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Founding-customer pricing for ${brand.name}: everything included, no per-feature add-on fees, and free one-click data export.`,
};

const included = [
  "Two-way texting from your own number",
  "E-signature on proposals, contracts, and change orders",
  "The live client dashboard on every job",
  "Reporting and one-click full-account export",
  "The mobile field app for your whole crew",
];

const foundingTerms = [
  "Founding-customer pricing held for the life of your account",
  "Everything bundled — no per-feature add-on fees, no surprise line items",
  "Free one-click data export from day one, so joining carries no lock-in",
  "Hands-on onboarding and a direct line to the team building it",
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        Simple pricing, everything included
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {brand.name}{" "}
        is pre-launch, so we haven&rsquo;t posted the public price
        list yet &mdash; but here&rsquo;s the part that won&rsquo;t change: one
        published price with everything bundled, and no nickel-and-diming for
        the features you use every day.
      </p>

      <div className="mt-10 rounded-lg border border-brand/20 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-brand-dark">
          No per-feature add-on fees
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          The tools roofers reach for most are the ones that so often get sold
          back to you one add-on at a time. With {brand.name}, they come with
          the plan:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {included.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span aria-hidden="true" className="mt-0.5 text-brand">
                &#10003;
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 max-w-xl rounded-lg border border-brand/30 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-brand-dark">Founding customer</h2>
        <p className="mt-2 text-sm text-muted">
          For roofing companies joining during early access.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-foreground">
          {foundingTerms.map((term) => (
            <li key={term} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-0.5 text-brand">
                &#10003;
              </span>
              {term}
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href={routes.earlyAccess}
            className="inline-block w-full rounded-md bg-brand px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Become a founding contractor
          </Link>
        </p>
      </div>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        No seat-minimum contracts, and no fee to get your own data back on the
        way out. Questions about founding-customer pricing?{" "}
        <a
          href={`mailto:${brand.supportEmail}`}
          className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
        >
          {brand.supportEmail}
        </a>
      </p>
    </section>
  );
}

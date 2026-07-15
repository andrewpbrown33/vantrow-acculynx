import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Early access pricing for founding customers of ${brand.name}.`,
};

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        Early access pricing for founding customers
      </h1>
      {/* TODO(copy): Phase 2 — pricing model and tiers once defined; do not invent tiers before then */}
      <p className="mt-4 max-w-2xl text-lg text-muted">
        We haven&rsquo;t published standard pricing yet. While we build{" "}
        {brand.name} with our first roofing companies, founding customers get
        terms we&rsquo;ll never offer again.
      </p>

      <div className="mt-10 max-w-xl rounded-lg border border-brand/30 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-brand-dark">
          Founding customer
        </h2>
        <p className="mt-2 text-sm text-muted">
          For roofing companies joining during early access.
        </p>
        {/* TODO(copy): Phase 2 — confirmed founding-customer benefits */}
        <ul className="mt-6 space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-0.5 text-brand">
              &#10003;
            </span>
            Early access to the full platform as it ships
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-0.5 text-brand">
              &#10003;
            </span>
            Direct line to the team building it — your workflow shapes the
            roadmap
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-0.5 text-brand">
              &#10003;
            </span>
            Founding-customer terms locked in before public pricing
          </li>
        </ul>
        <p className="mt-8">
          <Link
            href={routes.earlyAccess}
            className="inline-block w-full rounded-md bg-brand px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Request early access
          </Link>
        </p>
      </div>

      <p className="mt-8 text-sm text-muted">
        Questions about early access?{" "}
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

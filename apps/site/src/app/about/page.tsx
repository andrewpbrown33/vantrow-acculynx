import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${brand.name}, ${brand.endorsement}.`,
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        About {brand.name}
      </h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-brand">
        {brand.name} is {brand.endorsement}
      </p>

      <div className="mt-8 space-y-6 leading-7 text-foreground">
        <p>
          Our parent company, Vantrow, builds personalized, live client
          dashboards &mdash; a single link where a customer can see exactly
          where their project stands, what&rsquo;s been done, and what happens
          next. We&rsquo;ve watched that one idea change how service businesses
          talk to the people they work for: fewer status calls, less
          &ldquo;did you get my email,&rdquo; more trust.
        </p>
        <p>
          {brand.name} brings that idea to roofing. Roofing companies run the
          business from the truck &mdash; juggling leads, adjusters, crews,
          suppliers, and anxious homeowners across a dozen tools and a hundred
          phone calls, often on software that only files what they type and
          charges extra for every feature that matters. We think the software
          should carry the load instead: one AI-native platform that runs the
          whole job and gives every homeowner a live dashboard of their project,
          included on every plan.
        </p>
        <p>
          We&rsquo;re building {brand.name} in the open with a small group of
          founding roofing companies who get founding pricing locked, everything
          bundled, and a direct line to shape the product. If that sounds like
          you, we&rsquo;d love to talk.
        </p>
      </div>

      <p className="mt-10">
        <Link
          href={routes.earlyAccess}
          className="inline-block rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Become a founding contractor
        </Link>
      </p>
    </section>
  );
}

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

      {/* TODO(copy): Phase 2 — founder story, team, and origin details */}
      <div className="mt-8 space-y-6 leading-7 text-foreground">
        <p>
          Our parent company builds personalized, live client dashboards — a
          single link where a customer can see exactly where their project
          stands, what&rsquo;s been done, and what happens next. We&rsquo;ve
          watched that one idea transform how service businesses communicate
          with the people they work for.
        </p>
        <p>
          {brand.name} brings that idea to roofing. Roofing companies juggle
          leads, adjusters, crews, suppliers, and anxious homeowners across a
          dozen tools and a hundred phone calls. We think the software should
          carry that load: an AI-native platform that runs the back office and
          keeps every client informed automatically.
        </p>
        <p>
          We&rsquo;re building {brand.name} in the open with a small group of
          founding roofing companies. If that sounds like you, we&rsquo;d love
          to talk.
        </p>
      </div>

      <p className="mt-10">
        <Link
          href={routes.earlyAccess}
          className="inline-block rounded-md bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Get early access
        </Link>
      </p>
    </section>
  );
}

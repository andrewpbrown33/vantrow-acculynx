import type { Metadata } from "next";
import { brand } from "@vantrow/brand";
import { EarlyAccessForm } from "@/components/early-access-form";

export const metadata: Metadata = {
  title: "Early Access",
  description: `Join the ${brand.name} early-access program for founding roofing companies.`,
};

export default function EarlyAccessPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        Become a founding contractor
      </h1>
      <p className="mt-4 text-lg text-muted">
        We&rsquo;re onboarding a limited group of roofing companies to build{" "}
        {brand.name} around real jobs and real crews &mdash; with founding
        pricing locked, everything bundled, and free one-click data export from
        day one. Tell us a little about your business and we&rsquo;ll reach out.
      </p>

      <div className="mt-10">
        <EarlyAccessForm />
      </div>
    </section>
  );
}

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
        Get early access
      </h1>
      {/* TODO(copy): Phase 2 — early-access pitch refined with positioning research */}
      <p className="mt-4 text-lg text-muted">
        We&rsquo;re onboarding a small group of founding roofing companies to
        build {brand.name} around real jobs and real crews. Tell us a little
        about your business and we&rsquo;ll reach out.
      </p>

      <div className="mt-10">
        <EarlyAccessForm />
      </div>
    </section>
  );
}

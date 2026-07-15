import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Product",
  description: `Every module of ${brand.name}: CRM, estimating, production, invoicing, reporting, and more.`,
};

interface ModuleSection {
  id: string;
  title: string;
  body: string;
  features: string[];
}

/* TODO(copy): Phase 2 — replace all module blurbs and feature lists with research-driven copy */
const moduleSections: ModuleSection[] = [
  {
    id: "crm",
    title: "CRM",
    body: `Every lead, homeowner, adjuster, and job lives in one pipeline. ${brand.name} keeps notes, calls, and next steps in front of the right person so nothing slips between the truck and the office.`,
    features: [
      "Pipeline view from lead to closed job",
      "Contact timeline with every touchpoint",
      "Automatic follow-up reminders",
    ],
  },
  {
    id: "sales-estimating",
    title: "Sales & Estimating",
    body: "Turn an inspection into a polished, signable estimate before you leave the driveway. AI drafts line items from your price book and photos; you review, adjust, and send.",
    features: [
      "AI-drafted estimates from your price book",
      "E-sign proposals on any device",
      "Good/better/best options in one document",
    ],
  },
  {
    id: "production",
    title: "Production",
    body: "Schedule crews, order what the job needs, and watch progress in real time. Everyone — office, crew lead, and homeowner — sees the same live schedule.",
    features: [
      "Drag-and-drop crew scheduling",
      "Job checklists and photo documentation",
      "Weather-aware calendar",
    ],
  },
  {
    id: "measurements",
    title: "Measurements",
    body: "Bring roof measurements straight into your estimates. Order reports or import what you already use, and let square counts flow into line items automatically.",
    features: [
      "Measurement report imports",
      "Automatic waste and pitch calculations",
      "Measurements linked to every estimate",
    ],
  },
  {
    id: "supplier-ordering",
    title: "Supplier Ordering",
    body: "Build material orders from the estimate in a couple of clicks. Track what was ordered, what landed on site, and what it actually cost against the bid.",
    features: [
      "Material lists generated from estimates",
      "Order status tracking",
      "Actual vs. estimated cost visibility",
    ],
  },
  {
    id: "insurance-supplements",
    title: "Insurance & Supplements",
    body: "Keep every claim, scope, and supplement organized alongside the job. Document what the adjuster missed and get paid for the work you actually do.",
    features: [
      "Claim and adjuster tracking per job",
      "Supplement documentation with photos",
      "Scope-of-loss organization",
    ],
  },
  {
    id: "invoicing-payments",
    title: "Invoicing & Payments",
    body: "Invoice from the job record, collect deposits and progress payments online, and see exactly who owes what. No more spreadsheet-and-stamps accounting.",
    features: [
      "One-click invoices from job data",
      "Online card and ACH payments",
      "Deposit and progress-payment schedules",
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    body: "Margins by job, close rates by rep, cycle time by crew — the numbers that run a roofing business, without exporting a single CSV.",
    features: [
      "Job profitability dashboards",
      "Sales and pipeline reports",
      "Crew and cycle-time analytics",
    ],
  },
  {
    id: "homeowner-portal",
    title: "Homeowner Portal",
    body: `The live client dashboard that sets ${brand.name} apart. Every homeowner gets a personal link with their schedule, photos, documents, and payments — always current, no phone tag.`,
    features: [
      "Live job status and schedule",
      "Photo and document sharing",
      "Online approvals and payments",
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    body: "The whole platform works from the driveway: capture photos, update job status, and pull up the estimate on your phone while you're still on the ladder.",
    features: [
      "Full job records on any phone",
      "Photo capture straight to the job",
      "Works in the field, syncs to the office",
    ],
  },
  {
    id: "automations",
    title: "Automations",
    body: "Let the software do the chasing. Follow-ups, status updates, review requests, and hand-offs fire automatically as jobs move through your pipeline.",
    features: [
      "Trigger-based emails and texts",
      "Automatic stage transitions",
      "Review requests on job completion",
    ],
  },
  {
    id: "admin",
    title: "Admin",
    body: "Set up your team, price book, and permissions once and get back to work. Roles keep the right data in front of the right people — and nothing else.",
    features: [
      "Role-based permissions",
      "Price book and template management",
      "Team onboarding in minutes",
    ],
  },
];

export default function ProductPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          {/* TODO(copy): Phase 2 — product overview positioning */}
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
            One platform for the whole job
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            From the first knock to the final payment, {brand.name} keeps
            sales, production, and the homeowner on the same page — literally.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {moduleSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="border-b border-foreground/10 py-10 last:border-b-0"
          >
            <h2
              id={`${section.id}-heading`}
              className="text-2xl font-bold tracking-tight text-brand-dark"
            >
              {section.title}
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              {section.body}
            </p>
            {/* TODO(copy): Phase 2 — verified feature list for this module */}
            <ul className="mt-4 grid max-w-3xl gap-2 sm:grid-cols-2">
              {section.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span aria-hidden="true" className="mt-0.5 text-brand">
                    &#10003;
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-brand-dark">
            Want to see it on your own jobs?
          </h2>
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

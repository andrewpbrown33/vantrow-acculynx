import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@vantrow/brand";
import { routes } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Product",
  description: `Every module of ${brand.name}: the job file, field app, estimating, live client dashboard, invoicing, and more — with an honest line between what ships day one and what's on the roadmap.`,
};

interface ModuleSection {
  id: string;
  title: string;
  /** Optional badge for modules that arrive as a fast follow rather than day one. */
  badge?: string;
  body: string;
  /** Capabilities available at launch. */
  features: string[];
  /** Honestly-flagged roadmap items (partner-gated or later phase). */
  roadmap?: string[];
}

const moduleSections: ModuleSection[] = [
  {
    id: "crm",
    title: "CRM & job file",
    body: `Every lead, homeowner, adjuster, and job lives in one pipeline and one job file. ${brand.name} keeps contacts, messages, tasks, and next steps in front of the right person, so nothing slips between the truck and the office.`,
    features: [
      "Pipeline from lead to closed job with a fixed milestone spine",
      "One job file for contacts, photos, docs, messages, and money",
      "Fuzzy search that finds a job by partial address, material, or note",
      "Unassigned-lead queue, quick assign, and follow-up surfacing",
      "Threaded messages with mentions, tags, and tasks off any message",
      "Tasks that can auto-create the next task when one is done",
    ],
  },
  {
    id: "sales-estimating",
    title: "Sales & estimating",
    body: "Turn an inspection into a polished, signable proposal before you leave the driveway. Build on your own price book, hand the homeowner options, and send it from the field.",
    features: [
      "Estimate builder and reusable templates over your price book",
      "Full line-item model with per-line waste, margin, overhead, and tax",
      "Good/better/best options the homeowner picks from in one proposal",
      "Mobile estimating — build and send from the truck, not just the office",
      "Multiple estimates per job with a primary that feeds the money spine",
    ],
    roadmap: [
      `${brand.name} is built AI-native so the job record is model-readable — drafting the estimate from the measurement, with a human approving every line, is on our roadmap, not a day-one claim.`,
    ],
  },
  {
    id: "production",
    title: "Production",
    badge: "Fast follow",
    body: "Coordinate the build without leaving the job file. At launch this is checklists, tasks, and progress photos on the record everyone already shares; the full crew-scheduling suite lands as a fast follow.",
    features: [
      "Job checklists and tasks with who-did-what, when",
      "Progress photos and documentation on the shared job file",
    ],
    roadmap: [
      "Drag-and-drop production calendar with conflict alerts",
      "Labor manager, work orders, and a bundled crew app (EN/ES)",
      "External calendar sync (Google, Outlook, Apple)",
    ],
  },
  {
    id: "measurements",
    title: "Measurements",
    body: "Bring roof measurements straight into your estimates and let square counts flow into line items automatically, with the waste factored in.",
    features: [
      "Hover connection (self-serve), universal measurement-XML import, and manual entry",
      "Measurements auto-populate estimate quantities",
      "Waste-factor engine grosses up measured quantities",
    ],
    roadmap: [
      "Native in-app ordering from additional aerial providers — designed to integrate with EagleView, GAF QuickMeasure, and others, pending partner agreements",
    ],
  },
  {
    id: "supplier-ordering",
    title: "Supplier ordering",
    body: "Build material orders from the estimate without re-keying, and track what was ordered against the bid — starting with a price book you own outright.",
    features: [
      "Contractor-owned materials library and price book",
      "One-click estimate-to-material-order conversion",
      "Order status tracking in the job file and branded PDF/email purchase orders",
    ],
    roadmap: [
      "Live, direct-to-branch ordering with account pricing and stock visibility — designed to integrate with major distributors, on our roadmap pending partner agreements (not available at launch)",
    ],
  },
  {
    id: "insurance-supplements",
    title: "Insurance & supplements",
    badge: "Fast follow",
    body: "Keep every claim, scope, and supplement organized alongside the job. At launch you can document the claim on the job file; the dedicated restoration tooling is a fast follow.",
    features: [
      "Claim documents, adjuster notes, and evidence photos on the job file",
    ],
    roadmap: [
      "Claim records with ACV/RCV/deductible structure and adjuster tracking",
      "Supplement records with four-stage line items and negotiation notations",
      "Company-wide supplement, permit, and mortgage-check trackers",
    ],
  },
  {
    id: "invoicing-payments",
    title: "Invoicing & payments",
    body: "Invoice from the job's own numbers, collect deposits and progress payments online, and see exactly who owes what. No more spreadsheet-and-stamps accounting.",
    features: [
      "Invoices generated from the job's financial worksheet",
      "Full, partial-section, installment, and manual invoice modes",
      "Online card and ACH payments from the field or the client dashboard",
      "A/R aging and a receivables tracker for collections",
      "QuickBooks Online sync (customer, invoice, and payment)",
    ],
    roadmap: [
      "Embedded homeowner financing — requires a lending partner; not in the launch build",
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    body: "Margins by job, close rates by rep, pipeline by milestone — the numbers that run a roofing business, plus your whole account exportable in one click.",
    features: [
      "Pipeline snapshot and sales, lead-source-ROI, and closing-rate reports",
      "Job-profitability and A/R reports",
      "CSV export, plus one-click full-account export — free, any time",
    ],
    roadmap: [
      "Drag-and-drop custom report builder and composable dashboards",
    ],
  },
  {
    id: "homeowner-portal",
    title: "Live client dashboard",
    body: `The headline of ${brand.name}, and it’s bundled on every plan. Every homeowner gets a branded, always-current window into their job — live from the first appointment through the warranty, not switched on at approval and off at completion.`,
    features: [
      "Live job status, appointments, and delivery visibility",
      "Shared documents and photos, with online approvals and e-sign",
      "Billing transparency and in-dashboard card/ACH payments",
      "Two-way messaging that routes into the same job threads",
    ],
    roadmap: [
      "Role-scoped views for adjusters and property managers — designed to give each their own login, on our roadmap",
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    body: "The whole platform works from the driveway. Because it's one responsive app (an installable PWA), the phone does what the desktop does by construction — not a stripped-down companion.",
    features: [
      "Full job records on any phone — same app, same power as the office",
      "Photo capture with queued, background, resumable uploads",
      "Mobile estimating, in-person e-sign, and payment recording",
      "Texting and job messaging from the field",
    ],
    roadmap: [
      "Offline-first sync and native apps (including caller ID) — a later phase, so we don't promise offline at launch",
      "Bundled crew app for scheduling, check-in/out, and progress photos — a fast follow",
    ],
  },
  {
    id: "automations",
    title: "Automations",
    body: "Let the software do the chasing. Follow-ups, status updates, and hand-offs fire automatically as jobs move through your pipeline.",
    features: [
      "Triggers on job, milestone, and order events with relative timing",
      "Automated email and SMS with delivery receipts, plus task creation",
      "Dynamic merge tags and a starter recipe library",
    ],
    roadmap: [
      `Because ${brand.name} is built AI-native, the “does-the-work” features — drafting supplements, auto-tagging photos, semantic search — are what the data model is built for, but they ship as they’re ready, not at launch`,
    ],
  },
  {
    id: "admin",
    title: "Admin & permissions",
    body: "Set up your team, roles, and price book once and get back to work. Permissions keep the right data in front of the right people — and nothing else.",
    features: [
      "Roles plus per-user permissions and job-level scoping",
      "Financial-visibility controls (hide profitability, show balance due)",
      "Two-factor auth, single sign-on, and a per-record audit trail",
      "Self-serve API keys and webhooks with read and write endpoints",
    ],
    roadmap: [
      "Multi-location management UI — office scoping is baked into the schema now, with the admin surface following",
    ],
  },
  {
    id: "switching",
    title: "Switching without losing your history",
    body: "Leaving software you've used for years is the scariest part of any change, so we treat the move itself as a product. Bring what your current system lets you export, recover the rest from the tools you ran alongside it, and know before you commit exactly what does and doesn't carry over.",
    features: [
      "Contact and customer import from any CSV export, with smart column mapping",
      "Onboarding that asks which tools you already use — measurements, photos, accounting, phone — and walks you through each partner's own clean export",
      "A straight answer up front about what your old platform lets you take with you, and what it doesn't",
    ],
    roadmap: [
      "Guided migration playbooks for the most common roofing platforms, including job history and pipeline import",
      "Concierge migration help for documents and photos — honestly scoped as best-effort, because some systems don't let that data out",
    ],
  },
];

export default function ProductPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
            One platform for the whole job
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            From the first knock to the final payment, {brand.name}{" "}
            keeps sales,
            production, and the homeowner on the same page &mdash; literally.
            We&rsquo;re pre-launch, so below we&rsquo;re straight about what
            ships day one and what&rsquo;s on the roadmap.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {moduleSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-20 border-b border-foreground/10 py-10 last:border-b-0"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id={`${section.id}-heading`}
                className="text-2xl font-bold tracking-tight text-brand-dark"
              >
                {section.title}
              </h2>
              {section.badge ? (
                <span className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                  {section.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              {section.body}
            </p>
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
            {section.roadmap ? (
              <div className="mt-5 max-w-3xl rounded-md border border-foreground/10 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  On the roadmap
                </p>
                <ul className="mt-2 grid gap-2">
                  {section.roadmap.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span aria-hidden="true" className="mt-0.5">
                        &rarr;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
              Become a founding contractor
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

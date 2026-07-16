import type { Metadata } from "next";
import Link from "next/link";
import { createLead } from "@/lib/actions";

export const metadata: Metadata = {
  title: "New lead",
};

const LEAD_SOURCES = [
  "Website form",
  "Referral",
  "Google Ads",
  "Door knock",
  "Repeat customer",
  "Storm canvassing",
  "Other",
];

const fieldClass =
  "mt-1 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/pipeline" className="hover:text-foreground">
          Pipeline
        </Link>{" "}
        <span aria-hidden="true">/</span> New lead
      </nav>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-dark">
        New lead
      </h1>
      <p className="mt-1 text-sm text-muted">
        Capture a homeowner and open a job. The job starts in the Lead stage.
      </p>

      <form action={createLead} className="mt-8 space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">
            Contact
          </legend>
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium">
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              autoComplete="name"
              className={fieldClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                autoComplete="email"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium">
                Phone
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contactAddress" className="block text-sm font-medium">
              Property address
            </label>
            <input
              id="contactAddress"
              name="contactAddress"
              type="text"
              autoComplete="street-address"
              className={fieldClass}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Job</legend>
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Job title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Asphalt reroof — 2,000 sqft"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="leadSource" className="block text-sm font-medium">
              Lead source
            </label>
            <select
              id="leadSource"
              name="leadSource"
              defaultValue=""
              className={fieldClass}
            >
              <option value="">Select…</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Create lead
          </button>
          <Link href="/pipeline" className="text-sm font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

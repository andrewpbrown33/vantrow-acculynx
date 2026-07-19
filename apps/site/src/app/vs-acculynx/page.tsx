import type { Metadata } from "next";
import { brand } from "@vantrow/brand";

export const metadata: Metadata = {
  title: "vs. AccuLynx",
  description: `How ${brand.name} compares to AccuLynx, capability by capability — factual, dated, and sourced, including where AccuLynx leads.`,
};

interface Row {
  capability: string;
  eaverow: string;
  acculynx: string;
  /** Footnote number keyed to the sources list below. */
  note: number;
  /** True where the row concedes AccuLynx is ahead today. */
  conceded?: boolean;
}

const rows: Row[] = [
  {
    capability: "One field-ready app, full desktop parity",
    eaverow:
      "A single responsive web app (installable PWA) serves desktop and field from one codebase, so the phone does what the desktop does — leads, photos, estimates, e-sign, payments, scheduling.",
    acculynx:
      "Ships two separate mobile apps (a rep/office app and a crew app). In-app estimate building arrived in a Fall-2025 release. Its App Store rating (3.9/5) sits below its desktop review average (4.6/5), and customers report photo-upload failures, lag, and list-position resets on large photo sets.",
    note: 1,
  },
  {
    capability: "Published pricing vs quote-only",
    eaverow:
      "Our full price list is on the website; you can see the price without contacting sales.",
    acculynx:
      "Publishes one entry-plan price; its Pro and Elite tiers and all add-ons are quote-only behind a sales form. Its published terms describe per-user licensing with a contractual minimum user count.",
    note: 2,
  },
  {
    capability: "Everything included vs add-on stacking",
    eaverow:
      "Texting, e-signature, the client dashboard, and analytics are bundled in every plan — not metered as separate purchases.",
    acculynx:
      "These are optional add-ons priced separately from the base subscription (its published add-on set includes text messaging, e-sign, the Customer Portal, analytics, the crew app, and payments). A G2 reviewer cancelled over paying extra “for very basic features such as docusigns.”",
    note: 3,
  },
  {
    capability: "Live client dashboards, bundled",
    eaverow:
      "Every job gets a live, role-scoped client dashboard — homeowner today, with property-manager and adjuster views by design — included on every plan, live from the first appointment and persisting through the warranty.",
    acculynx:
      "Offers a “Customer Portal” as a paid add-on. Per its public materials, the homeowner is invited after the job reaches the approved stage and access auto-expires at completion; adjusters receive shared photo links rather than a login.",
    note: 4,
  },
  {
    capability: "AI-native workflows vs a bolted-on score",
    eaverow:
      "Built AI-native: the job record is model-readable context, so the system is designed to draft the estimate from the measurement and the supplement from the claim file, each routed to human approval. These workflows are on our roadmap, not day-one claims.",
    acculynx:
      "Ships one documented AI feature — “Lead Intelligence,” a lead-conversion propensity score powered by a third-party prediction API, included on all plans since 2023. Its Automation Manager is deterministic trigger→action rules.",
    note: 5,
  },
  {
    capability: "Open API — read and write, no add-on gate",
    eaverow:
      "An open REST API with write endpoints and subscription webhooks, self-serve, with no separate integration add-on required.",
    acculynx:
      "Its public REST v2 surface is largely read-oriented (e.g. estimates are exposed read-only). It does offer subscription webhooks and ~13 Zapier triggers, but Zapier/HubSpot connectivity runs through its paid AppConnections add-on.",
    note: 6,
  },
  {
    capability: "Fast fuzzy search",
    eaverow:
      "Fuzzy, typo-tolerant search across jobs, contacts, and communications — partial names and addresses resolve.",
    acculynx:
      "Customers report search is effectively exact-match: “you have to type in the exact spelling in order to pull up a customer,” and they cite an inability to search the calendar or to find jobs by material.",
    note: 7,
  },
  {
    capability: "Cascading task automation",
    eaverow:
      "Task automation supports cascades — completing one task can auto-create the next — so multi-step workflows chain without manual re-entry.",
    acculynx:
      "Its automation can create a task as a trigger action, but cascading tasks (auto-creating the next when one completes) is a recurring feature request in the sampled reviews.",
    note: 8,
  },
  {
    capability: "Clean exit / one-click export",
    eaverow:
      "Free one-click data export, no seat-minimum lock-in, and no post-cancellation storage fee.",
    acculynx:
      "Its published terms provide that prepaid annual fees are nonrefundable, cancellation requires 30 days’ notice, and departing accounts with a base user count above 15 owe a recurring monthly data-storage fee to retain access to their data.",
    note: 9,
  },
  {
    capability: "Faster time-to-value for small teams",
    eaverow:
      "Simpler packaging (nothing to bolt on) and a bundled feature set aimed at getting a 3-seat crew productive quickly.",
    acculynx:
      "Reviewers describe it as heavy for small teams — “too expensive especially for a small business with only 2-3 users” — and aggregators frame the ramp-up as best suited to larger shops. Note: its desktop ease-of-use scores well (a 4.4/5 sub-score), so this is about packaging fit, not usability.",
    note: 10,
  },
  {
    capability: "Live distributor ordering & account pricing",
    eaverow:
      "Day one: a self-owned price book, universal measurement-XML import, and branded PDF/email purchase orders. Live, direct-to-branch ordering with distributor account pricing is designed to integrate with major distributors and is on our roadmap, pending partner agreements — not available at launch.",
    acculynx:
      "Maintains live, native ordering integrations with the three dominant US roofing distributors, bringing account-specific branch pricing, live stock visibility, and electronic order submission into the estimate. This is a genuine AccuLynx advantage today.",
    note: 11,
    conceded: true,
  },
  {
    capability: "Native aerial-measurement provider ordering",
    eaverow:
      "Supports Hover (self-serve), universal measurement-XML import, and manual entry at launch. Native in-app ordering from additional aerial providers (e.g. EagleView, GAF QuickMeasure) is on our roadmap, pending partner agreements.",
    acculynx:
      "Offers native in-app ordering across several aerial-measurement providers, with measurements auto-populating estimates. AccuLynx currently offers broader native provider ordering.",
    note: 12,
    conceded: true,
  },
];

const sources: { note: number; text: string }[] = [
  {
    note: 1,
    text: "Feature inventory — mobile [S-MOBILE-001/002/010/012]; review mining P1 [S-REVIEWS-007/001/008].",
  },
  {
    note: 2,
    text: "Pricing & packaging §2, §5 [S-PRICING-002/003/004/014].",
  },
  {
    note: 3,
    text: "Pricing & packaging §2, §4 [S-PRICING-004/013]; homeowner-portal [S-HOMEOWNER-PORTAL-003/008]; review mining P2 [S-REVIEWS-006].",
  },
  {
    note: 4,
    text: "Differentiation thesis §c [S-DIFF-017–022]; homeowner-portal [S-HOMEOWNER-PORTAL-002/004].",
  },
  {
    note: 5,
    text: "Differentiation thesis §a, §b [S-DIFF-001/003/007/008/029].",
  },
  {
    note: 6,
    text: "Sales-estimating [S-SALES-ESTIMATING-005/008]; supplier-ordering [S-SUPPLIER-ORDERING-024]; automations [S-AUTOMATIONS-COMMS-012/014]; review mining P9 [S-REVIEWS-011].",
  },
  {
    note: 7,
    text: "Review mining P4 [S-REVIEWS-004/003/002].",
  },
  {
    note: 8,
    text: "Automations [S-AUTOMATIONS-COMMS-001/004]; review mining P10 / request #4 [S-REVIEWS-003/005].",
  },
  {
    note: 9,
    text: "Pricing & packaging §2 [S-PRICING-004].",
  },
  {
    note: 10,
    text: "Review mining P13 [S-REVIEWS-013/014]; differentiation thesis §d [S-DIFF-024/023].",
  },
  {
    note: 11,
    text: "Supplier-ordering [S-SUPPLIER-ORDERING-001/016]; copy-priority matrix §2.5.",
  },
  {
    note: 12,
    text: "Measurements [S-MEASUREMENTS-001/002/003]; sales-estimating [S-SALES-ESTIMATING-001/003]; copy-priority matrix §2.4.",
  },
];

export default function VsAccuLynxPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        {brand.name} vs. AccuLynx
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-muted">
        A capability-by-capability look at how {brand.name}{" "}
        and AccuLynx approach
        running a roofing business &mdash; factual, dated, and sourced. Where
        AccuLynx is genuinely ahead of us today, we say so.
      </p>

      <p
        role="note"
        className="mt-8 max-w-3xl rounded-md border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand-dark"
      >
        Comparison based on publicly available information and customer reviews
        as of 2026-07-16. AccuLynx ships updates frequently; claims are
        re-verified before republication.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Capability comparison between {brand.name} and AccuLynx, as of
            2026-07-16
          </caption>
          <thead>
            <tr className="border-b border-foreground/20 align-bottom">
              <th scope="col" className="w-1/5 py-3 pr-4 font-semibold">
                Capability
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold text-brand">
                {brand.name}
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                AccuLynx{" "}
                <span className="font-normal text-muted">
                  (as of 2026-07-16)
                </span>
              </th>
              <th scope="col" className="py-3 font-semibold">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.capability}
                className="border-b border-foreground/10 align-top"
              >
                <th
                  scope="row"
                  className="py-4 pr-4 text-left align-top font-semibold text-brand-dark"
                >
                  {row.capability}
                  {row.conceded ? (
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-brand-accent-ink">
                      AccuLynx leads today
                    </span>
                  ) : null}
                </th>
                <td className="py-4 pr-4 leading-6 text-foreground">
                  {row.eaverow}
                </td>
                <td className="py-4 pr-4 leading-6 text-muted">
                  {row.acculynx}
                </td>
                <td className="py-4 align-top">
                  <a
                    href={`#source-${row.note}`}
                    className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
                  >
                    [{row.note}]
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 border-t border-foreground/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-dark">
          Sources
        </h2>
        <p className="mt-2 text-xs text-muted">
          References point to {brand.name}&rsquo;s internal clean-room teardown
          of AccuLynx; each carries a public URL and access date in the sources
          log, re-verified before publication. Customer-review quotes are
          reproduced verbatim and attributed to their review platform.
        </p>
        <ol className="mt-4 space-y-2">
          {sources.map((s) => (
            <li
              key={s.note}
              id={`source-${s.note}`}
              className="scroll-mt-20 text-xs leading-5 text-muted"
            >
              <span className="font-semibold text-brand-dark">[{s.note}]</span>{" "}
              {s.text}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-10 border-t border-foreground/10 pt-6 text-xs text-muted">
        AccuLynx is a trademark of its owner. {brand.name} is not affiliated with
        or endorsed by AccuLynx.
      </p>
    </section>
  );
}

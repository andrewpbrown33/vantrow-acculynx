import type { Metadata } from "next";
import { brand } from "@vantrow/brand";

export const metadata: Metadata = {
  title: "vs. AccuLynx",
  description: `How ${brand.name} compares to AccuLynx, capability by capability.`,
};

export default function VsAccuLynxPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-brand-dark">
        {brand.name} vs. AccuLynx
      </h1>

      {/* TODO(copy): Phase 2 — sourced intro paragraph; no comparative claims until researched and cited */}
      <p className="mt-4 max-w-2xl text-lg text-muted">
        A capability-by-capability look at how {brand.name} and AccuLynx
        approach running a roofing business.
      </p>

      <p
        role="note"
        className="mt-8 rounded-md border border-brand/30 bg-brand/5 px-4 py-3 text-sm font-medium text-brand-dark"
      >
        Detailed, sourced comparison coming soon
      </p>

      {/* Comparison table shell — rows land in Phase 2 with citations. Do not add unsourced claims. */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Capability comparison between {brand.name} and AccuLynx
          </caption>
          <thead>
            <tr className="border-b border-foreground/20">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Capability
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                {brand.name}
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                AccuLynx
              </th>
              <th scope="col" className="py-3 font-semibold">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {/* TODO(copy): Phase 2 — researched, cited comparison rows */}
            <tr>
              <td colSpan={4} className="py-8 text-center text-muted">
                Comparison rows are being researched and will be published with
                sources.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-12 border-t border-foreground/10 pt-6 text-xs text-muted">
        AccuLynx is a trademark of its owner. {brand.name} is not affiliated
        with or endorsed by AccuLynx.
      </p>
    </section>
  );
}

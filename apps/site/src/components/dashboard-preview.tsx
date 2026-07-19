/**
 * A stylized, in-code preview of the live client dashboard — the site shows
 * the product working instead of a static screenshot. Everything here is
 * illustrative UI built from brand tokens; it is not a capture of any real
 * product (ours or anyone else's).
 */

const milestones = [
  { label: "Lead", done: true },
  { label: "Estimate", done: true },
  { label: "Approved", done: true },
  { label: "In progress", done: false, current: true },
  { label: "Complete", done: false },
];

const feed = [
  {
    text: "Crew scheduled for Thursday — materials confirmed",
    when: "Today",
  },
  {
    text: "You approved the “Better” option · contract signed",
    when: "Mon",
  },
];

export function DashboardPreview() {
  return (
    <figure className="w-full max-w-md">
      <div className="rounded-xl border border-white/10 bg-white p-5 text-left shadow-2xl sm:p-6">
        {/* Job header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand-dark">
              142 Cedar Ridge Rd
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Roof replacement · updated live
            </p>
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
            In progress
          </span>
        </div>

        {/* Milestone spine */}
        <div className="mt-5 flex items-center gap-1" aria-hidden="true">
          {milestones.map((m, i) => (
            <div key={m.label} className="flex flex-1 items-center gap-1">
              <span
                className={[
                  "size-2.5 shrink-0 rounded-full",
                  m.done
                    ? "bg-brand-accent"
                    : m.current
                      ? "bg-white ring-2 ring-brand-accent"
                      : "bg-foreground/15",
                ].join(" ")}
              />
              {i < milestones.length - 1 && (
                <span
                  className={[
                    "h-0.5 w-full rounded",
                    m.done ? "bg-brand-accent" : "bg-foreground/10",
                  ].join(" ")}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-medium uppercase tracking-wide text-muted">
          <span>Lead</span>
          <span className="text-brand-accent-ink">In progress</span>
          <span>Complete</span>
        </div>

        {/* Status feed */}
        <ul className="mt-5 space-y-3">
          {feed.map((item) => (
            <li key={item.text} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent"
              />
              <p className="flex-1 text-xs leading-5 text-foreground">
                {item.text}
              </p>
              <span className="shrink-0 text-[10px] text-muted">
                {item.when}
              </span>
            </li>
          ))}
        </ul>

        {/* Money row */}
        <div className="mt-4 flex items-center justify-between rounded-md border border-foreground/10 bg-background px-3 py-2.5">
          <p className="text-xs font-medium text-foreground">Deposit invoice</p>
          <span className="rounded-full bg-brand-accent px-2.5 py-0.5 text-xs font-semibold text-foreground">
            Paid online
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-white/60">
        Illustrative preview — the live dashboard is bundled on every plan.
      </figcaption>
    </figure>
  );
}

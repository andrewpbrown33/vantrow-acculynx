import type { JobStage } from "@/lib/types";

/** Homeowner-facing milestones (a simplified view of the internal stages). */
const STEPS = ["Estimate", "Approved", "Invoiced", "Paid"] as const;

/** The last-reached milestone index for a given internal stage. */
function stageStep(stage: JobStage): number {
  switch (stage) {
    case "lead":
    case "estimating":
    case "proposal_sent":
      return 0;
    case "won":
      return 1;
    case "invoiced":
      return 2;
    case "paid":
      return 3;
    default:
      return 0;
  }
}

/**
 * A horizontal progress stepper the homeowner sees at the top of their portal.
 * `dead` jobs are handled by the caller (an "on hold" banner), not here.
 */
export function PortalStatus({ stage }: { stage: JobStage }) {
  const reached = stageStep(stage);
  return (
    <ol className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < reached;
        const current = i === reached;
        const active = done || current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={current ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  active
                    ? "bg-brand text-white"
                    : "bg-foreground/10 text-muted"
                } ${current ? "ring-4 ring-brand/20" : ""}`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  active ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={`mx-1 h-0.5 flex-1 ${
                  i < reached ? "bg-brand" : "bg-foreground/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

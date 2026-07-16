import type { JobStage } from "./types";

export interface StageMeta {
  label: string;
  /** Tailwind classes for the stage badge/column header (UI semantics only). */
  badgeClass: string;
  dotClass: string;
}

/** Board columns, in workflow order (dead is tracked separately). */
export const STAGE_ORDER: JobStage[] = [
  "lead",
  "estimating",
  "proposal_sent",
  "won",
  "invoiced",
  "paid",
];

export const STAGE_META: Record<JobStage, StageMeta> = {
  lead: {
    label: "Lead",
    badgeClass: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    dotClass: "bg-slate-400",
  },
  estimating: {
    label: "Estimating",
    badgeClass: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    dotClass: "bg-amber-500",
  },
  proposal_sent: {
    label: "Proposal sent",
    badgeClass: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
    dotClass: "bg-sky-500",
  },
  won: {
    label: "Won",
    badgeClass: "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
    dotClass: "bg-violet-500",
  },
  invoiced: {
    label: "Invoiced",
    badgeClass: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
    dotClass: "bg-indigo-500",
  },
  paid: {
    label: "Paid",
    badgeClass: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    dotClass: "bg-emerald-500",
  },
  dead: {
    label: "Dead",
    badgeClass: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
    dotClass: "bg-rose-500",
  },
};

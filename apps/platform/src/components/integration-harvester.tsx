"use client";

import { useMemo, useState } from "react";
import {
  GAP_LABELS,
  INTEGRATIONS,
  type GapKind,
} from "@/lib/integrations";

/**
 * "Which tools did you use alongside AccuLynx?" — the integration-harvesting
 * step. The contractor checks the tools they used; each reveals the export
 * steps for that partner's OWN account (green zone — we never touch it). A live
 * summary shows which gap items they'll recover.
 *
 * Purely client-side guidance; no data leaves the browser.
 */
export function IntegrationHarvester() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  const recovered = useMemo(() => {
    const kinds = new Set<GapKind>();
    for (const it of INTEGRATIONS) {
      if (selected[it.id]) it.recovers.forEach((k) => kinds.add(k));
    }
    return [...kinds];
  }, [selected]);

  const anySelected = recovered.length > 0;

  return (
    <div>
      <ul className="space-y-3">
        {INTEGRATIONS.map((it) => {
          const on = !!selected[it.id];
          return (
            <li
              key={it.id}
              className={
                on
                  ? "rounded-lg border border-brand/40 bg-brand/5 p-4"
                  : "rounded-lg border border-foreground/10 p-4"
              }
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(it.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {it.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {it.usedFor} &middot; recovers{" "}
                    {it.recovers.map((k) => GAP_LABELS[k]).join(", ").toLowerCase()}
                  </span>
                </span>
              </label>

              {on && (
                <div className="mt-3 border-t border-brand/20 pt-3 pl-7">
                  <ol className="space-y-1.5">
                    {it.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <span className="text-muted">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {it.caveat && (
                    <p className="mt-2 text-xs text-muted">
                      <span className="font-medium">Note:</span> {it.caveat}
                    </p>
                  )}
                  <a
                    href={it.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
                  >
                    {it.link.label} &#8599;
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div
        role="status"
        aria-live="polite"
        className="mt-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4 text-sm"
      >
        {anySelected ? (
          <p className="text-foreground">
            <span className="font-semibold">Nice &mdash; you can recover:</span>{" "}
            {recovered.map((k) => GAP_LABELS[k]).join(", ")}. Export each from the
            tool&rsquo;s own account using the steps above, then bring the files
            into {""}
            {/* brand name intentionally omitted here; page supplies context */}
            your new workspace.
          </p>
        ) : (
          <p className="text-muted">
            Check any tools you used with AccuLynx to see how to pull that data
            from your own account &mdash; no need to fight AccuLynx&rsquo;s export
            for these.
          </p>
        )}
      </div>
    </div>
  );
}

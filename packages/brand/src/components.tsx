/**
 * Shared brand components, usable from both apps' server and client trees.
 *
 * Deliberately free of Tailwind classes: each app's Tailwind v4 content
 * detection only scans its own source, so utilities used solely inside this
 * package would never be generated. All sizing/weight/base-color styling comes
 * in via `className` from the call site; only brand-token colors are applied
 * here, through the injected --brand-* CSS variables.
 */

import { brand, splitWordmark } from "./brand.config";

/**
 * The two-tone brand wordmark: name rendered lowercase with the configured
 * suffix (Eaverow's "row", echoing the parent's "-trow") in the accent color.
 * Falls back to a one-tone wordmark when no suffix is configured.
 */
export function Wordmark({ className }: { className?: string }) {
  const { prefix, suffix } = splitWordmark(brand);
  return (
    <span
      className={className}
      style={{ textTransform: "lowercase", letterSpacing: "-0.02em" }}
    >
      {prefix}
      {suffix !== null && (
        <span style={{ color: "var(--brand-accent)" }}>{suffix}</span>
      )}
    </span>
  );
}

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
 * The Eaverow mark: "Sheltered Dot" (concept A, selected 2026-07-19) — a
 * gable stroke with the camel dot sheltered beneath the eave. Geometry kept
 * as constants so the mark stays a one-line tweak.
 */
const MARK_GABLE = "M24 66 L50 30 L76 66";
const MARK_DOT = { cx: 50, cy: 62, r: 10.5 };

/**
 * The brand logo mark. The gable stroke renders in `currentColor`, so the
 * caller's text color picks the variant: brand pine on light surfaces (the
 * default), paper/white on dark surfaces (situational, never the default).
 * The dot is always the accent (camel). Decorative unless `title` is given.
 */
export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={MARK_GABLE}
        fill="none"
        stroke="currentColor"
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={MARK_DOT.cx}
        cy={MARK_DOT.cy}
        r={MARK_DOT.r}
        fill="var(--brand-accent)"
      />
    </svg>
  );
}

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

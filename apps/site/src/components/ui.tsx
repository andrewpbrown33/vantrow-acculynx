import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Minimal shared primitives for the marketing site, consolidating the utility
 * strings that were previously repeated verbatim across pages. Server-safe.
 */

const buttonVariants = {
  /** Solid brand button on light surfaces. */
  primary: "bg-brand text-white hover:bg-brand-dark",
  /** Bordered brand button on light surfaces. */
  outline: "border border-brand text-brand hover:bg-brand hover:text-white",
  /** Solid white button for dark (bg-brand-dark) bands. */
  onDark: "bg-white text-brand-dark hover:bg-white/90",
} as const;

const buttonSizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export function Button({
  href,
  variant = "primary",
  size = "lg",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  children: ReactNode;
}) {
  const classes = [
    "inline-block rounded-md font-semibold transition-colors",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Card({
  accent = false,
  className,
  children,
}: {
  /** Adds the camel top hairline that marks brand-emphasis cards. */
  accent?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [
    "rounded-lg border border-foreground/10 bg-white p-6 shadow-sm",
    accent && "border-t-2 border-t-brand-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <article className={classes}>{children}</article>;
}

export function Eyebrow({
  onDark = false,
  className,
  children,
}: {
  /** Camel reads AA on the dark band; on light surfaces use the ink shade. */
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [
    "text-sm font-semibold uppercase tracking-wider",
    onDark ? "text-brand-accent" : "text-brand-accent-ink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <p className={classes}>{children}</p>;
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const classes = ["mx-auto max-w-6xl px-4 sm:px-6", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}

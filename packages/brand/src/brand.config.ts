/**
 * Single source of truth for all brand identity used by the marketing site.
 *
 * The site itself is 100% brand-agnostic: every brand string, color, and
 * domain it renders comes from this package. To rebrand, edit this file only.
 */

export interface BrandConfig {
  /** Public product/brand name shown in the wordmark, copy, and titles. */
  name: string;
  /** Legal entity name used in the copyright line and legal pages. */
  legalName: string;
  /** Short positioning line shown in the hero and default page title. */
  tagline: string;
  /** One-sentence description used for metadata and intro copy. */
  description: string;
  /** Primary domain (no protocol), used for canonical metadata. */
  domain: string;
  /**
   * Base URL of the product app (the platform origin) that the marketing site
   * links to for "Log in" / "Start free". A deploy can override this at runtime
   * with NEXT_PUBLIC_APP_URL without touching the brand config.
   */
  appUrl: string;
  /** Support/contact email surfaced in the footer and fallbacks. */
  supportEmail: string;
  /** Parent-company endorsement line, e.g. "a Vantrow company". */
  endorsement: string;
  /** Parent company name behind the endorsement. */
  parentName: string;
  /** Parent company site the endorsement links to. */
  parentUrl: string;
  /**
   * Optional two-tone wordmark: the trailing part of `name` rendered in the
   * accent color (e.g. the "row" of "eaverow", echoing the parent's "-trow").
   * Omit for a brand without a split — the wordmark renders one-tone.
   */
  wordmark?: { suffix: string };
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    accentInk: string;
    background: string;
    foreground: string;
    muted: string;
  };
}

export const brand: BrandConfig = {
  name: "Eaverow",
  legalName: "Eaverow, Inc.",
  tagline: "Roofing software that runs itself",
  description:
    "Eaverow is the AI-native platform that runs the back office of your roofing business and keeps every homeowner informed with a live client dashboard.",
  domain: "eaverow.com",
  appUrl: "https://app.eaverow.com",
  supportEmail: "hello@eaverow.com",
  endorsement: "a Vantrow company",
  parentName: "Vantrow",
  parentUrl: "https://getvantrow.com",
  wordmark: { suffix: "row" },
  colors: {
    // Eaverow palette: deep pine green (evergreen shelter, craft) with the
    // camel accent copied verbatim from the parent Vantrow palette (--camel,
    // the dot in Vantrow's mark) — the one shared family color, worn on the
    // wordmark's "row" suffix. accentInk is our own darkened camel for
    // AA-contrast accent text on light surfaces (camel itself is reserved for
    // the logotype, decorative marks, and dark surfaces). Contrast table lives
    // in docs/brand/brand-guidelines.md.
    primary: "#1d4b38",
    primaryDark: "#0f2e23",
    accent: "#b8956a",
    accentInk: "#856540",
    background: "#f7f6f2",
    foreground: "#0c1d15",
    muted: "#566a5e",
  },
};

/**
 * Splits the brand name into a wordmark prefix + accent-colored suffix.
 * Derived from `name` + `wordmark.suffix` so the two can never drift apart;
 * returns a null suffix (one-tone wordmark) when no split is configured or
 * the configured suffix isn't actually the tail of the name.
 */
export function splitWordmark(b: BrandConfig): {
  prefix: string;
  suffix: string | null;
} {
  const s = b.wordmark?.suffix;
  if (!s || !b.name.toLowerCase().endsWith(s.toLowerCase())) {
    return { prefix: b.name, suffix: null };
  }
  return {
    prefix: b.name.slice(0, b.name.length - s.length),
    suffix: b.name.slice(b.name.length - s.length),
  };
}

/**
 * Serializes a BrandConfig's colors as a `:root { ... }` CSS custom-property
 * block, ready to be injected via a <style> tag in the site's root layout.
 */
export function brandCssVars(b: BrandConfig): string {
  const c = b.colors;
  return [
    ":root{",
    `--brand-primary:${c.primary};`,
    `--brand-primary-dark:${c.primaryDark};`,
    `--brand-accent:${c.accent};`,
    `--brand-accent-ink:${c.accentInk};`,
    `--brand-background:${c.background};`,
    `--brand-foreground:${c.foreground};`,
    `--brand-muted:${c.muted};`,
    "}",
  ].join("");
}

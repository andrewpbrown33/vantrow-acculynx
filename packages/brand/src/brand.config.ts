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
  /** Support/contact email surfaced in the footer and fallbacks. */
  supportEmail: string;
  /** Parent-company endorsement line, e.g. "a Vantrow company". */
  endorsement: string;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
}

export const brand: BrandConfig = {
  name: "__BRAND__",
  legalName: "__BRAND__, Inc.",
  tagline: "Roofing business software that runs itself",
  description:
    "An AI-native platform that runs the back office of your roofing business and keeps every homeowner informed with a live client dashboard.",
  domain: "example.com",
  supportEmail: "hello@example.com",
  endorsement: "a Vantrow company",
  colors: {
    // Neutral, professional slate/steel palette — intentional pre-branding.
    primary: "#3e5c76",
    primaryDark: "#1d2d44",
    accent: "#748cab",
    background: "#f7f9fb",
    foreground: "#16232f",
    muted: "#5b6b7b",
  },
};

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
    `--brand-background:${c.background};`,
    `--brand-foreground:${c.foreground};`,
    `--brand-muted:${c.muted};`,
    "}",
  ].join("");
}

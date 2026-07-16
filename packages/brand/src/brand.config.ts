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
  name: "Eaverow",
  legalName: "Eaverow, Inc.",
  tagline: "Roofing software that runs itself",
  description:
    "Eaverow is the AI-native platform that runs the back office of your roofing business and keeps every homeowner informed with a live client dashboard.",
  domain: "eaverow.com",
  supportEmail: "hello@eaverow.com",
  endorsement: "a Vantrow company",
  colors: {
    // Eaverow palette: deep slate-blue (shelter/trust) with a warm copper
    // accent (roofing metal, craft). Tuned for AA contrast on the light bg.
    primary: "#1b4965",
    primaryDark: "#0f2e42",
    accent: "#c96a24",
    background: "#f7f9fb",
    foreground: "#0d1b26",
    muted: "#566976",
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

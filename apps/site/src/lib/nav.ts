/**
 * Centralized route paths and nav labels.
 *
 * Note on brand policy: the competitor name "AccuLynx" appears here only as
 * the nominative label/path for the comparison page, and nowhere else in the
 * site outside that page.
 */

export const routes = {
  home: "/",
  product: "/product",
  compare: "/vs-acculynx",
  pricing: "/pricing",
  about: "/about",
  earlyAccess: "/early-access",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

/** Primary navigation shown in the header. */
export const primaryNav: NavLink[] = [
  { href: routes.product, label: "Product" },
  { href: routes.compare, label: "vs. AccuLynx" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.about, label: "About" },
];

/** Full navigation shown in the footer. */
export const footerNav: NavLink[] = [
  ...primaryNav,
  { href: routes.earlyAccess, label: "Early access" },
  { href: routes.privacy, label: "Privacy" },
  { href: routes.terms, label: "Terms" },
];

/**
 * Integration-partner harvesting catalog.
 *
 * A large share of the data that does NOT bulk-export from AccuLynx (photos,
 * text threads, financials, measurements) already lives in the contractor's OWN
 * connected third-party accounts. They own those accounts and can export from
 * them with full rights and zero AccuLynx-ToS exposure — the "green zone."
 *
 * This catalog powers the onboarding step that asks "which tools did you use
 * alongside AccuLynx?" and hands back the export path for each. It is pure,
 * accurate guidance content (from docs/research/acculynx/14 Round 4) — we never
 * touch the partner accounts ourselves.
 */

export type GapKind =
  | "photos"
  | "texts"
  | "financials"
  | "measurements"
  | "contacts"
  | "calls"
  | "calendar";

export interface Integration {
  id: string;
  /** Product name as the contractor knows it. */
  name: string;
  /** One-line "did you use this?" prompt hint. */
  usedFor: string;
  /** The gap items recovered from this partner's side. */
  recovers: GapKind[];
  /** Short, accurate export steps the contractor runs in the partner's app. */
  steps: string[];
  /** Official help link for the export. */
  link: { href: string; label: string };
  /** Honest caveat, if any. */
  caveat?: string;
}

/** Friendly labels for gap kinds (used for the "what you'll recover" summary). */
export const GAP_LABELS: Record<GapKind, string> = {
  photos: "Photos & videos",
  texts: "Text messages",
  financials: "Invoices & payments",
  measurements: "Aerial measurements",
  contacts: "Contacts & leads",
  calls: "Call logs & recordings",
  calendar: "Appointments",
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "companycam",
    name: "CompanyCam",
    usedFor: "job-site photos & videos",
    recovers: ["photos"],
    steps: [
      "Log into CompanyCam (your own account — separate from AccuLynx).",
      "Open a project and choose Download All Photos to get a ZIP by email, or Company Settings → Exports for a CSV of project/photo data.",
      "If you set up CompanyCam's Dropbox or Google Drive sync, your photos are already mirrored there.",
    ],
    link: {
      href: "https://help.companycam.com/en/articles/6828429-how-to-download-save-photos-from-companycam",
      label: "CompanyCam: download/export your photos",
    },
    caveat:
      "Recovers photos that were captured through CompanyCam. Photos shot inside the AccuLynx app itself are handled separately (concierge / keep-read-only).",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    usedFor: "invoicing & accounting",
    recovers: ["financials", "contacts"],
    steps: [
      "Your QuickBooks company file already holds the customers, jobs, invoices (with line detail), and payments that AccuLynx synced over — permanently, in your own account.",
      "Nothing to migrate out of AccuLynx for these; keep using QuickBooks and connect it to Eaverow when that's ready.",
      "For a standalone copy, in QuickBooks run Reports → Invoices/Sales → Export to Excel.",
    ],
    link: {
      href: "https://acculynx.com/integrations/quickbooks/",
      label: "What AccuLynx synced to QuickBooks",
    },
    caveat:
      "Manual (non-AccuPay) payments may not have synced to QuickBooks — check those against AccuLynx before you cancel.",
  },
  {
    id: "callrail",
    name: "CallRail",
    usedFor: "call tracking & texting",
    recovers: ["calls", "texts"],
    steps: [
      "Log into CallRail (your own account).",
      "Go to the account-level data export and download the ZIP — it bundles Calls, Text messages (SMS), Form submissions, Leads, and call recordings.",
    ],
    link: {
      href: "https://support.callrail.com/hc/en-us/articles/5711458151053-Exporting-account-level-data",
      label: "CallRail: export account-level data",
    },
    caveat:
      "Only covers texts/calls that ran through CallRail. Texts sent from AccuLynx's own number can't be exported by anyone.",
  },
  {
    id: "eagleview",
    name: "EagleView",
    usedFor: "aerial roof measurements",
    recovers: ["measurements"],
    steps: [
      "Log into MyEagleView (your own EagleView account).",
      "Open Order History and re-download the measurement reports (PDF) for any jobs you want to keep.",
    ],
    link: {
      href: "https://www.eagleview.com/help-center/",
      label: "EagleView Help Center",
    },
  },
  {
    id: "hover",
    name: "Hover",
    usedFor: "3D measurements & models",
    recovers: ["measurements"],
    steps: [
      "Log into your Hover account.",
      "Open a project and use Export files to download the measurement PDF, the .xls export, and the 3D model.",
    ],
    link: {
      href: "https://help.hover.to/en/articles/4931253-how-to-export-files-from-hover",
      label: "Hover: how to export your files",
    },
  },
  {
    id: "gaf-quickmeasure",
    name: "GAF QuickMeasure",
    usedFor: "roof measurement reports",
    recovers: ["measurements"],
    steps: [
      "Log into quickmeasure.gaf.com (your own account).",
      "Open your order history and re-download the reports (PDF/XML).",
    ],
    link: {
      href: "https://www.gaf.com/en-us/roofing-products/quickmeasure",
      label: "GAF QuickMeasure",
    },
  },
  {
    id: "hubspot",
    name: "HubSpot",
    usedFor: "sales CRM / marketing",
    recovers: ["contacts"],
    steps: [
      "Log into HubSpot (your own account).",
      "Go to Contacts (and Companies) → Export, and download the CSV — AccuLynx mirrored your contacts/leads and milestone data into HubSpot.",
    ],
    link: {
      href: "https://knowledge.hubspot.com/records/export-records",
      label: "HubSpot: export your records",
    },
  },
  {
    id: "supplier-portals",
    name: "Supplier portal (ABC Supply, SRS, Beacon, QXO)",
    usedFor: "material ordering",
    recovers: ["financials"],
    steps: [
      "Log into your supplier portal — e.g. myABCsupply, SRS, or Beacon Pro+ (your own contractor account).",
      "Open Order History / Statements / Invoices and download what you need; myABCsupply can also push payment data into your accounting software.",
    ],
    link: {
      href: "https://www.abcsupply.com/contractor-center/myabcsupply/",
      label: "myABCsupply (example supplier portal)",
    },
  },
  {
    id: "calendar-sync",
    name: "Google / Outlook Calendar sync",
    usedFor: "appointment scheduling",
    recovers: ["calendar"],
    steps: [
      "If you had AccuLynx's calendar sync turned on (and set to push appointments out), those appointments are already sitting in your Google or Outlook calendar.",
      "Nothing to export — they persist in your own calendar after you leave AccuLynx.",
    ],
    link: {
      href: "https://acculynx.com/integrations/",
      label: "AccuLynx integrations overview",
    },
    caveat:
      "Appointments created before you turned sync on may not have back-filled to your calendar.",
  },
];

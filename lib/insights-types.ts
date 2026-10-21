/** Aggregate admin reports. No customer, session or browser identifiers. */
export type AttributionEvidence = "utm" | "referrer" | "unknown" | "legacy";
export type AcquisitionChannel =
  "search" | "social" | "paid" | "email" | "referral" | "direct_unknown" | "other";

export type AcquisitionFilters = {
  days: number;
  source?: string;
  channel?: string;
  campaign?: string;
};

export type AcquisitionStats = {
  available: boolean;
  days: number;
  filters: { source: string; channel: string; campaign: string };
  range: { from: string; to: string; previousFrom: string; previousTo: string; timezone: "UTC" };
  allVisits: number;
  totals: { visits: number; attributed: number; unknown: number; tagged: number; legacy: number };
  previousVisits: number;
  daily: { day: string; visits: number }[];
  channels: { channel: string; visits: number }[];
  sources: {
    source: string;
    channel: string;
    medium: string | null;
    visits: number;
    tagged: number;
    referred: number;
    legacy: number;
  }[];
  otherSourceVisits: number;
  campaigns: {
    source: string;
    medium: string | null;
    campaign: string;
    content: string | null;
    visits: number;
  }[];
  landingPages: { path: string; visits: number }[];
  options: { sources: string[]; channels: string[]; campaigns: string[] };
};

export type SearchMetric = { clicks: number; impressions: number; position: number | null };
export type SearchConsoleReport = {
  schemaVersion: 1;
  property: "sc-domain:kestro.dk";
  dateFrom: string;
  dateTo: string;
  timezone: "America/Los_Angeles";
  searchType: "web" | "image" | "video" | "news" | "discover" | "provider_default";
  generatedAt: string;
  source: "google_search_console" | "windsor_searchconsole" | "csv_import";
  partial: boolean;
  totals: SearchMetric | null;
  daily: (SearchMetric & { date: string })[];
  queries: (SearchMetric & { query: string })[];
  pages: (SearchMetric & { page: string })[];
};
export type StoredSearchConsoleReport = {
  available: boolean;
  report: SearchConsoleReport | null;
  importedAt: string | null;
};

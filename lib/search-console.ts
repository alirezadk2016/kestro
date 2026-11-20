import type { SearchConsoleReport, SearchMetric } from "@/lib/insights-types";

/** Shared by the local preview and the independently validated POST handler. */
export const SEARCH_CONSOLE_PROPERTY = "sc-domain:kestro.dk" as const;
export const SEARCH_CONSOLE_MAX_BYTES = 2 * 1024 * 1024;
export const SEARCH_CONSOLE_MAX_ROWS = 5000;
export const SEARCH_CONSOLE_URL =
  "https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Akestro.dk";

export type SearchImportOptions = {
  dateFrom: string;
  dateTo: string;
  searchType: SearchConsoleReport["searchType"];
};

const fail = (message: string): never => {
  throw new Error(message);
};
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return fail("Rapporten skal være et JSON-objekt.");
  return value as Record<string, unknown>;
};
function keys(value: Record<string, unknown>, allowed: string[]): void {
  if (Object.keys(value).some((key) => !allowed.includes(key)))
    fail("Rapporten indeholder et ukendt felt eller en ekstra dimension.");
}

export function searchDateValid(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function pacificToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((name) => parts.find((part) => part.type === name)?.value)
    .join("-");
}

export function searchDateRange(from: unknown, to: unknown): { from: string; to: string } {
  if (!searchDateValid(from) || !searchDateValid(to))
    return fail("Vælg gyldige datoer i formatet ÅÅÅÅ-MM-DD.");
  const length = (Date.parse(to) - Date.parse(from)) / 86_400_000 + 1;
  if (from < "2015-01-01" || to > pacificToday() || length < 1 || length > 366)
    return fail("Perioden skal være afsluttet eller igangværende, fra 2015 og højst 366 dage.");
  return { from, to };
}

function metric(value: unknown, identity?: string): SearchMetric {
  const row = object(value);
  keys(row, [...(identity ? [identity] : []), "clicks", "impressions", "position"]);
  for (const name of ["clicks", "impressions"])
    if (
      !Number.isSafeInteger(row[name]) ||
      (row[name] as number) < 0 ||
      (row[name] as number) > 1_000_000_000
    )
      fail("Klik og visninger skal være hele, ikke-negative tal.");
  const position = row.position === 0 ? null : row.position;
  if (
    position !== null &&
    (typeof position !== "number" || !Number.isFinite(position) || position < 1 || position > 10000)
  )
    fail("Gennemsnitlig position skal være et positivt tal eller null.");
  return {
    clicks: row.clicks as number,
    impressions: row.impressions as number,
    position: position as number | null,
  };
}

function text(value: unknown, max: number, label: string): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  )
    return fail(`${label} er tomt, for langt eller ugyldigt.`);
  return value.trim();
}

export function ownSearchPage(value: unknown): string {
  const page = text(value, 1500, "Sideadressen");
  let url: URL;
  try {
    url = new URL(page);
  } catch {
    return fail("En sideadresse skal være en fuld HTTPS-adresse på kestro.dk.");
  }
  if (
    url.protocol !== "https:" ||
    !["kestro.dk", "www.kestro.dk"].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password ||
    url.hash ||
    /^\/(admin|api)(\/|$)/.test(url.pathname)
  )
    return fail("Kun offentlige HTTPS-sider på kestro.dk kan importeres.");
  return url.href;
}

/** Reject extra dimensions and duplicates rather than silently double-counting. */
export function validateSearchConsoleReport(value: unknown): SearchConsoleReport {
  const report = object(value);
  keys(report, [
    "schemaVersion",
    "property",
    "dateFrom",
    "dateTo",
    "timezone",
    "searchType",
    "generatedAt",
    "source",
    "partial",
    "totals",
    "daily",
    "queries",
    "pages",
  ]);
  if (
    report.schemaVersion !== 1 ||
    report.property !== SEARCH_CONSOLE_PROPERTY ||
    report.timezone !== "America/Los_Angeles"
  )
    return fail(
      "Rapporten skal bruge schemaVersion 1, sc-domain:kestro.dk og America/Los_Angeles.",
    );
  searchDateRange(report.dateFrom, report.dateTo);
  if (
    !["web", "image", "video", "news", "discover", "provider_default"].includes(
      String(report.searchType),
    )
  )
    return fail("Søgetypen er ikke understøttet.");
  if (
    !["google_search_console", "windsor_searchconsole", "csv_import"].includes(
      String(report.source),
    ) ||
    typeof report.partial !== "boolean"
  )
    return fail("Rapportens kilde eller dækningsstatus er ugyldig.");
  const generatedAt = text(report.generatedAt, 40, "Eksporttidspunktet");
  if (
    !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(generatedAt) ||
    !searchDateValid(generatedAt.slice(0, 10)) ||
    !Number.isFinite(Date.parse(generatedAt)) ||
    Date.parse(generatedAt) > Date.now() + 300_000
  )
    return fail("Eksporttidspunktet skal være en gyldig ISO-dato med tidszone.");
  for (const name of ["daily", "queries", "pages"])
    if (!Array.isArray(report[name])) fail("Rapporten skal have listerne daily, queries og pages.");
  const dailyRows = report.daily as unknown[];
  const queryRows = report.queries as unknown[];
  const pageRows = report.pages as unknown[];
  const count = dailyRows.length + queryRows.length + pageRows.length;
  if (count > SEARCH_CONSOLE_MAX_ROWS)
    return fail("Rapporten må højst indeholde 5.000 rækker i alt.");
  if (count === 0 && report.totals === null)
    return fail("Rapporten skal indeholde målinger eller et samlet total.");
  const seen = new Set<string>();
  const unique = (identity: string, value: string) => {
    const key = `${identity}:${value}`;
    if (seen.has(key)) fail("Rapporten har gentagne rækker. Importér én gruppering pr. liste.");
    seen.add(key);
  };
  const daily = dailyRows
    .map((value) => {
      const row = object(value);
      if (
        !searchDateValid(row.date) ||
        row.date < String(report.dateFrom) ||
        row.date > String(report.dateTo)
      )
        return fail("En dagsmåling ligger uden for den valgte periode.");
      unique("date", row.date);
      return { date: row.date, ...metric(row, "date") };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const queries = queryRows.map((value) => {
    const row = object(value);
    const query = text(row.query, 500, "Søgefrasen");
    unique("query", query);
    return { query, ...metric(row, "query") };
  });
  const pages = pageRows.map((value) => {
    const row = object(value);
    const page = ownSearchPage(row.page);
    unique("page", page);
    return { page, ...metric(row, "page") };
  });
  return {
    schemaVersion: 1,
    property: SEARCH_CONSOLE_PROPERTY,
    dateFrom: report.dateFrom as string,
    dateTo: report.dateTo as string,
    timezone: "America/Los_Angeles",
    searchType: report.searchType as SearchConsoleReport["searchType"],
    generatedAt: new Date(generatedAt).toISOString(),
    source: report.source as SearchConsoleReport["source"],
    partial: report.partial,
    totals: report.totals === null ? null : metric(report.totals),
    daily,
    queries,
    pages,
  };
}

/** A bounded RFC 4180 reader: values remain text; no expression is executed. */
function csvRows(input: string): string[][] {
  const firstLine = input.split(/\r?\n/, 1)[0];
  const delimiter = [",", ";", "\t"].sort(
    (a, b) => firstLine.split(b).length - firstLine.split(a).length,
  )[0];
  const rows: string[][] = [];
  let row: string[] = [],
    field = "",
    quoted = false,
    afterQuote = false;
  const pushField = () => {
    row.push(field.trim());
    field = "";
    afterQuote = false;
  };
  const pushRow = () => {
    pushField();
    if (row.some(Boolean)) rows.push(row);
    row = [];
    if (rows.length > SEARCH_CONSOLE_MAX_ROWS + 1) fail("CSV-filen har mere end 5.000 datarækker.");
  };
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
        afterQuote = true;
      } else field += char;
    } else if (char === '"' && field === "" && !afterQuote) quoted = true;
    else if (char === delimiter) pushField();
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index++;
      pushRow();
    } else if (afterQuote && !/\s/.test(char)) fail("CSV-filen har ugyldige citationstegn.");
    else if (!afterQuote) field += char;
    if (field.length > 2000 || row.length > 8)
      fail("CSV-filen indeholder for lange felter eller for mange kolonner.");
  }
  if (quoted) fail("CSV-filen har et uafsluttet citeret felt.");
  if (field || row.length) pushRow();
  return rows;
}

const headerKey = (value: string) => value.toLowerCase().replace(/[\s_\-]/g, "");
const HEADERS: Record<string, string> = {
  topqueries: "query",
  query: "query",
  queries: "query",
  forespørgsler: "query",
  topforespørgsler: "query",
  søgeforespørgsler: "query",
  toppages: "page",
  page: "page",
  pages: "page",
  sider: "page",
  topsider: "page",
  date: "date",
  dato: "date",
  clicks: "clicks",
  klik: "clicks",
  impressions: "impressions",
  eksponeringer: "impressions",
  visninger: "impressions",
  ctr: "ctr",
  klikrate: "ctr",
  position: "position",
  averageposition: "position",
  gennemsnitligposition: "position",
};

export function parseSearchConsoleImport(
  raw: string,
  options: SearchImportOptions,
): SearchConsoleReport {
  if (new TextEncoder().encode(raw).byteLength > SEARCH_CONSOLE_MAX_BYTES)
    fail("Filen må højst være 2 MB.");
  const input = raw.replace(/^\uFEFF/, "").trim();
  if (!input) return fail("Vælg en fil med målinger.");
  if (input.startsWith("{") || input.startsWith("[")) {
    let json: unknown;
    try {
      json = JSON.parse(input);
    } catch {
      return fail("JSON-filen kan ikke læses. Kontrollér formatet.");
    }
    return validateSearchConsoleReport(json);
  }
  searchDateRange(options.dateFrom, options.dateTo);
  const rows = csvRows(input);
  if (rows.length < 2)
    return fail("CSV-filen skal have en overskriftsrække og mindst én datarække.");
  const headers = rows[0].map((value) => HEADERS[headerKey(value)]);
  if (headers.some((value) => !value) || new Set(headers).size !== headers.length)
    return fail(
      "Brug én officiel Search Console CSV-tabel: forespørgsler, sider eller datoer. Ekstra dimensioner understøttes ikke.",
    );
  const identities = headers.filter((value) => ["query", "page", "date"].includes(value));
  if (
    identities.length !== 1 ||
    !["clicks", "impressions", "position"].every((name) => headers.includes(name))
  )
    return fail("CSV-filen skal indeholde én gruppering samt Klik, Visninger og Position.");
  const identity = identities[0];
  const parsed = rows.slice(1).map((row) => {
    if (row.length !== headers.length)
      return fail("En CSV-række har et andet antal kolonner end overskriften.");
    const values = Object.fromEntries(headers.map((name, index) => [name, row[index]]));
    const count = (name: string) => {
      if (!/^\d+$/.test(values[name]))
        return fail("CSV-tal for klik og visninger skal være hele tal uden tusindtalsseparator.");
      return Number(values[name]);
    };
    const position = /^(?:|[-—~]|0(?:[.,]0+)?)$/.test(values.position)
      ? null
      : Number(values.position.replace(",", "."));
    return {
      [identity]: values[identity],
      clicks: count("clicks"),
      impressions: count("impressions"),
      position,
    };
  });
  return validateSearchConsoleReport({
    schemaVersion: 1,
    property: SEARCH_CONSOLE_PROPERTY,
    dateFrom: options.dateFrom,
    dateTo: options.dateTo,
    timezone: "America/Los_Angeles",
    searchType: options.searchType,
    generatedAt: new Date().toISOString(),
    source: "csv_import",
    partial: true,
    // A table export is not evidence for the whole property's total.
    totals: null,
    daily: identity === "date" ? parsed : [],
    queries: identity === "query" ? parsed : [],
    pages: identity === "page" ? parsed : [],
  });
}

export const searchCtr = (row: SearchMetric): number | null =>
  row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null;
export function searchTypeLabel(type: SearchConsoleReport["searchType"]): string {
  return {
    web: "Web",
    image: "Billeder",
    video: "Video",
    news: "Nyheder",
    discover: "Discover",
    provider_default: "Udbyderens standardtype",
  }[type];
}
export function searchSourceLabel(source: SearchConsoleReport["source"]): string {
  return {
    google_search_console: "Search Console-rapport",
    windsor_searchconsole: "Search Console via Windsor",
    csv_import: "Manuelt importeret Search Console CSV",
  }[source];
}
export function searchReviewSuggestions(
  report: SearchConsoleReport,
): { title: string; detail: string; query?: string; page?: string }[] {
  const suggestions: { title: string; detail: string; query?: string; page?: string }[] = [];
  if (report.totals && report.totals.clicks < 30)
    suggestions.push({
      title: "Datagrundlaget er stadig lille",
      detail:
        "Færre end 30 samlede klik i perioden. Se mønstre over flere afsluttede perioder, før en title eller indholdsretning ændres.",
    });
  const queries = report.queries
    .filter((row) => row.impressions >= 200 && row.clicks / row.impressions < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 2);
  for (const row of queries)
    suggestions.push({
      title: "Gennemgå søgeintention og uddrag",
      detail:
        "Mindst 200 visninger og under 2 % CTR i de synlige rækker. Kontrollér relevans, placering og det viste uddrag; lav CTR beviser ikke en dårlig title.",
      query: row.query,
    });
  const page = report.pages
    .filter(
      (row) =>
        row.impressions >= 50 && row.position !== null && row.position >= 4 && row.position <= 20,
    )
    .sort((a, b) => b.impressions - a.impressions)[0];
  if (page)
    suggestions.push({
      title: "Undersøg svaret på en synlig side",
      detail:
        "Mindst 50 visninger og gennemsnitlig position 4–20. Gennemgå sidens konkrete svar og relevante interne links i kildekoden.",
      page: page.page,
    });
  if (!suggestions.length)
    suggestions.push({
      title: "Saml mere sammenlignelig evidens",
      detail:
        "Ingen rækker rammer de redaktionelle review-regler. Det er ikke en SEO-karakter. Kontrollér relevans og sammenlign lige lange, afsluttede perioder.",
    });
  return suggestions;
}

import "server-only";
import type { SearchConsoleReport } from "@/lib/insights-types";
import {
  SEARCH_CONSOLE_MAX_BYTES,
  SEARCH_CONSOLE_PROPERTY,
  searchDateRange,
  validateSearchConsoleReport,
} from "@/lib/search-console";

/** Configuration is server-only; possessing a chat connector is not this connection. */
export const searchConsoleSyncConfigured = () => Boolean(process.env.WINDSOR_API_KEY?.trim());

async function fetchRows(
  identity: "date" | "query" | "page",
  from: string,
  to: string,
): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.WINDSOR_API_KEY?.trim();
  if (!apiKey)
    throw new Error("Serverforbindelsen er ikke konfigureret. Importér en rapport i stedet.");
  // Endpoint, account, connector and fields cannot be supplied by a browser.
  // Official reference: https://windsor.ai/api-documentation/
  const url = new URL("https://connectors.windsor.ai/searchconsole");
  url.search = new URLSearchParams({
    api_key: apiKey,
    select_accounts: SEARCH_CONSOLE_PROPERTY,
    date_from: from,
    date_to: to,
    fields: `account_id,${identity},clicks,impressions,position`,
    include_fresh_data: "false",
    _renderer: "json",
    _max_rows: "5001",
  }).toString();
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(25_000),
      headers: { accept: "application/json", "user-agent": "Windsor/1.0" },
    });
    if (!response.ok || !response.body) throw new Error("provider");
    if (Number(response.headers.get("content-length")) > SEARCH_CONSOLE_MAX_BYTES)
      throw new Error("provider");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > SEARCH_CONSOLE_MAX_BYTES) {
        await reader.cancel();
        throw new Error("provider");
      }
      chunks.push(chunk.value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const result: unknown = JSON.parse(new TextDecoder().decode(buffer));
    if (
      !result ||
      typeof result !== "object" ||
      !Array.isArray((result as { data?: unknown }).data)
    )
      throw new Error("provider");
    const rows = (result as { data: unknown[] }).data;
    if (rows.length > 5000) throw new Error("provider");
    return rows.map((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("provider");
      const row = value as Record<string, unknown>;
      if (row.account_id !== SEARCH_CONSOLE_PROPERTY) throw new Error("provider");
      return {
        [identity]: row[identity],
        clicks: row.clicks,
        impressions: row.impressions,
        position: row.position,
      };
    });
  } catch {
    // Never return provider URLs, responses or errors: they may contain the key.
    throw new Error(
      "Windsor-rapporten kunne ikke hentes eller valideres. Den gemte rapport er bevaret. Kontrollér serverforbindelsen, og prøv igen.",
    );
  }
}

export async function fetchSearchConsoleReport(
  from: string,
  to: string,
): Promise<SearchConsoleReport> {
  searchDateRange(from, to);
  const [daily, queries, pages] = await Promise.all([
    fetchRows("date", from, to),
    fetchRows("query", from, to),
    fetchRows("page", from, to),
  ]);
  const validated = validateSearchConsoleReport({
    schemaVersion: 1,
    property: SEARCH_CONSOLE_PROPERTY,
    dateFrom: from,
    dateTo: to,
    timezone: "America/Los_Angeles",
    searchType: "provider_default",
    generatedAt: new Date().toISOString(),
    source: "windsor_searchconsole",
    partial: true,
    totals: null,
    daily,
    queries,
    pages,
  });
  // Property totals come only from date-level property rows, never queries/pages.
  // An entirely empty response is not treated as proof of zero visibility.
  if (validated.daily.length) {
    const impressions = validated.daily.reduce((sum, row) => sum + row.impressions, 0);
    const positioned = validated.daily.filter((row) => row.position !== null);
    const positionWeight = positioned.reduce((sum, row) => sum + row.impressions, 0);
    validated.totals = {
      clicks: validated.daily.reduce((sum, row) => sum + row.clicks, 0),
      impressions,
      position: positionWeight
        ? positioned.reduce((sum, row) => sum + row.position! * row.impressions, 0) / positionWeight
        : null,
    };
  }
  return validateSearchConsoleReport(validated);
}

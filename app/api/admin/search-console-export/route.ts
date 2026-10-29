import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { getSearchConsoleReport } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!sessionValid((await cookies()).get(SESSION_COOKIE)?.value))
    return new Response("forbidden", { status: 403 });
  const stored = await getSearchConsoleReport();
  if (!stored.available) return new Response("Rapporten kunne ikke hentes.", { status: 503 });
  if (!stored.report) return new Response("Ingen gemt rapport.", { status: 404 });
  return new Response(JSON.stringify(stored.report, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="kestro-google-${stored.report.dateFrom}-${stored.report.dateTo}.json"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { getAcquisitionStats } from "@/lib/db";
import { csvRows } from "@/lib/admin-csv";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!sessionValid((await cookies()).get(SESSION_COOKIE)?.value))
    return new Response("forbidden", { status: 403 });

  const query = new URL(request.url).searchParams;
  const stats = await getAcquisitionStats({
    days: Number(query.get("days")) || 30,
    source: query.get("source")?.slice(0, 253),
    channel: query.get("channel")?.slice(0, 40),
    campaign: query.get("campaign")?.slice(0, 80),
  });
  if (!stats.available) return new Response("Målingerne kunne ikke hentes.", { status: 503 });

  const rows: (string | number | null)[][] = [
    ["Kestro · kilder", "Fra", stats.range.from, "Til", stats.range.to, "Tidszone", "UTC"],
    [
      "Valgt kilde",
      stats.filters.source,
      "Kanal",
      stats.filters.channel,
      "Kampagne",
      stats.filters.campaign,
    ],
    ["Besøg i det valgte udsnit", stats.totals.visits, "Besøg i hele perioden", stats.allVisits],
    ["Kilde", "Kanal", "Medium", "Besøg", "UTM", "Henvisning", "Historisk"],
    ...stats.sources.map((row) => [
      row.source,
      row.channel,
      row.medium,
      row.visits,
      row.tagged,
      row.referred,
      row.legacy,
    ]),
    ["Øvrige kildebesøg ud over rapportens 100 rækker", stats.otherSourceVisits],
    [],
    ["Kampagne", "Kilde", "Medium", "Linkplacering (tag)", "Besøg"],
    ...stats.campaigns.map((row) => [
      row.campaign,
      row.source,
      row.medium,
      row.content,
      row.visits,
    ]),
    [],
    ["Landingsside", "Besøg"],
    ...stats.landingPages.map((row) => [row.path, row.visits]),
    [],
    [
      "Kampagne- og landingssidetabeller viser højst 100 rækker hver. Besøg er ikke unikke personer. UTM er linkmærkning, ikke dokumenteret eksponering.",
    ],
  ];
  return new Response(csvRows(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="kestro-kilder-${stats.range.from}-${stats.range.to}.csv"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

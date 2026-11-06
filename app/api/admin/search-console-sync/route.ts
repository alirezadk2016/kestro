import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { saveSearchConsoleReport } from "@/lib/db";
import { searchDateRange } from "@/lib/search-console";
import {
  fetchSearchConsoleReport,
  searchConsoleSyncConfigured,
} from "@/lib/search-console-provider";
import { crossSitePost } from "@/lib/same-site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  if (!searchConsoleSyncConfigured())
    return NextResponse.json(
      { error: "Serverforbindelsen er ikke konfigureret. Importér en rapport i stedet." },
      { status: 503 },
    );
  if (
    !/^application\/json(?:;|$)/i.test(request.headers.get("content-type") ?? "") ||
    Number(request.headers.get("content-length")) > 1024
  )
    return NextResponse.json({ error: "Ugyldig periode." }, { status: 400 });
  try {
    if (!request.body) throw new Error("period");
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let raw = "",
      bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        return NextResponse.json({ error: "Ugyldig periode." }, { status: 413 });
      }
      raw += decoder.decode(chunk.value, { stream: true });
    }
    raw += decoder.decode();
    const body: unknown = JSON.parse(raw);
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).some((key) => !["dateFrom", "dateTo"].includes(key))
    )
      throw new Error("period");
    const range = body as { dateFrom?: unknown; dateTo?: unknown };
    searchDateRange(range.dateFrom, range.dateTo);
    const report = await fetchSearchConsoleReport(range.dateFrom as string, range.dateTo as string);
    if (!(await saveSearchConsoleReport(report)))
      return NextResponse.json(
        { error: "Rapporten kunne ikke gemmes. Den tidligere rapport er bevaret." },
        { status: 503 },
      );
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      {
        error:
          "Synkroniseringen kunne ikke gennemføres. Kontrollér perioden og serverforbindelsen. Den gemte rapport er bevaret.",
      },
      { status: 422 },
    );
  }
}

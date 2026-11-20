import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/admin-auth";
import { saveSearchConsoleReport } from "@/lib/db";
import type { SearchConsoleReport } from "@/lib/insights-types";
import { SEARCH_CONSOLE_MAX_BYTES, validateSearchConsoleReport } from "@/lib/search-console";
import { crossSitePost } from "@/lib/same-site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await adminAuthed())) return new NextResponse("forbidden", { status: 403 });
  if (crossSitePost(request)) return new NextResponse("forbidden", { status: 403 });
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("content-type") ?? ""))
    return NextResponse.json({ error: "Importen skal være valideret JSON." }, { status: 415 });
  if (Number(request.headers.get("content-length")) > SEARCH_CONSOLE_MAX_BYTES)
    return NextResponse.json({ error: "Filen må højst være 2 MB." }, { status: 413 });
  let report: SearchConsoleReport;
  try {
    if (!request.body) return NextResponse.json({ error: "Rapporten er tom." }, { status: 400 });
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > SEARCH_CONSOLE_MAX_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: "Filen må højst være 2 MB." }, { status: 413 });
      }
      chunks.push(next.value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    report = validateSearchConsoleReport(JSON.parse(new TextDecoder().decode(body)));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof SyntaxError
            ? "JSON-filen kan ikke læses."
            : error instanceof Error
              ? error.message
              : "Rapporten er ugyldig.",
      },
      { status: 422 },
    );
  }
  try {
    if (!(await saveSearchConsoleReport(report))) throw new Error("storage");
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Rapporten kunne ikke gemmes. Den tidligere rapport er bevaret." },
      { status: 503 },
    );
  }
}

/* Local test-process preload. Never imported by application code or deployed
 * as a route. It exercises UI and API behaviour, not PostgreSQL correctness.
 * Unknown outbound requests fail closed, including all real mail providers.
 */
if (process.env.VERIFY_ADMIN_FIXTURE !== "local-only") {
  throw new Error("The admin fixture preload is local-verification only");
}
const database = new URL(process.env.DATABASE_URL || "");
if (database.hostname !== "ep-test.kestro-fixture.invalid" || database.username !== "fixture") {
  throw new Error("The admin fixture refuses a real database connection");
}

const enquiries = Array.from({ length: 80 }, (_, offset) => {
  const index = offset + 1;
  const status = ["new", "read", "replied", "archived"][offset % 4];
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    created_at: new Date(Date.UTC(2026, 9, 18, 12) - offset * 3_600_000).toISOString(),
    name: `Testkunde ${String(index).padStart(2, "0")}`,
    company: "Kestro lokal testfixture",
    email: `fixture${index}@example.invalid`,
    phone: null,
    subject: index === 1 ? "Bærbar 50%_test" : `Fixture henvendelse ${index}`,
    message: `Dette er en syntetisk testhenvendelse ${index}. Ingen rigtige kundeoplysninger.\nAnden linje bevares i beskeden.`,
    page: "/tilbud",
    source: ["contact", "quote", "instagram"][offset % 3],
    status,
    replied_at: status === "replied" ? "2026-10-18T12:00:00.000Z" : null,
    reply_body: status === "replied" ? "Et syntetisk tidligere svar." : null,
    mail_error: null,
    internal_note: null,
  };
});
let mailCalls = 0;

function result(rows) {
  const names = rows.length ? Object.keys(rows[0]) : [];
  const fields = names.map((name) => ({
    name,
    dataTypeID: typeof rows[0][name] === "number" ? 23 : 25,
  }));
  return {
    fields,
    rows: rows.map((row) => names.map((name) => (row[name] === null ? null : String(row[name])))),
    rowCount: rows.length,
    command: "SELECT",
  };
}

function search(params) {
  const status = params[0];
  const source = params[3];
  const term = String(params[5] || "");
  // ILIKE's wildcard/escape behaviour matters: treating the user's raw term
  // as a literal here would hide a real missing-escape bug in the SQL layer.
  const pattern = String(params[6]);
  let expression = "^";
  for (let index = 0; index < pattern.length; index++) {
    let character = pattern[index];
    if (character === "\\") {
      character = pattern[++index] || "\\";
      expression += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    } else if (character === "%") expression += "[\\s\\S]*";
    else if (character === "_") expression += "[\\s\\S]";
    else expression += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  const matches = new RegExp(expression + "$", "iu");
  return enquiries.filter(
    (row) =>
      (status === "all" ||
        (status === "active" && row.status !== "archived") ||
        row.status === status) &&
      (!source || row.source === source) &&
      (!term ||
        [row.name, row.company, row.email, row.subject, row.message].join(" ").match(matches)),
  );
}

function sql({ query, params = [] }) {
  const text = query.replace(/\s+/g, " ").trim();
  if (/^(CREATE|ALTER) /.test(text)) return result([]);
  if (/^UPDATE enquiries SET/.test(text)) {
    const row = enquiries.find((item) => item.id === params.at(-1));
    if (!row) return result([]);
    if (text.includes("internal_note =")) row.internal_note = params[0];
    else if (text.includes("reply_body =")) {
      row.status = "replied";
      row.replied_at = "2026-10-18T12:00:00.000Z";
      row.reply_body = params[0];
    } else if (text.includes("status =")) row.status = params[0];
    else throw new Error("Unexpected fixture enquiry update");
    if (process.env.VERIFY_ADMIN_FIXTURE_DEBUG === "1")
      console.error("fixture update", row.id, row.status);
    return result([{ id: row.id }]);
  }
  if (text === "SELECT id FROM enquiries LIMIT 1") return result([{ id: enquiries[0].id }]);
  if (text.includes("FROM enquiries GROUP BY status")) {
    return result(
      ["new", "read", "replied", "archived"].map((status) => ({
        status,
        n: enquiries.filter((row) => row.status === status).length,
      })),
    );
  }
  if (text.includes("FROM enquiries") && text.includes("concat_ws")) {
    const matches = search(params);
    if (text.startsWith("SELECT count")) return result([{ n: matches.length }]);
    const ascending = params[7] === true || params[7] === "true";
    const ordered = [...matches].sort((left, right) =>
      ascending
        ? left.created_at.localeCompare(right.created_at)
        : right.created_at.localeCompare(left.created_at),
    );
    const limit = Number(params[9]);
    const offset = Number(params[10]);
    return result(ordered.slice(offset, offset + limit));
  }
  if (
    text.startsWith("SELECT * FROM enquiries WHERE id =") &&
    params[0] === "00000000-0000-4000-8000-000000000080"
  ) {
    throw new Error("Local fixture: enquiry read unavailable");
  }
  if (text.startsWith("SELECT * FROM enquiries WHERE id ="))
    return result(enquiries.filter((row) => row.id === params[0]));
  if (text.startsWith("SELECT * FROM enquiries")) {
    const rows = params.length
      ? enquiries.filter((row) => row.status === params[0])
      : enquiries.filter((row) => row.status !== "archived");
    return result(rows.slice(0, 200));
  }
  if (text.startsWith("SELECT count(*)::int AS n FROM enquiries")) {
    const count = enquiries.filter((row) => row.status === "new").length;
    if (process.env.VERIFY_ADMIN_FIXTURE_DEBUG === "1") console.error("fixture countNew", count);
    return result([{ n: count }]);
  }
  if (text.includes("FROM visits")) {
    if (text.startsWith("SELECT count")) return result([{ n: 0 }]);
    if (text.includes("AS avg_seconds"))
      return result([{ today: 0, last30: 0, measured: 0, avg_seconds: 0, single: 0 }]);
    return result([]);
  }
  if (text.includes("FROM page_views")) {
    if (text.includes("AS total")) return result([{ total: 0, today: 0, last30: 0 }]);
    return result([]);
  }
  throw new Error(`Unsupported admin fixture query: ${text}`);
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (
    url.hostname === "ep-test.kestro-fixture.invalid" ||
    url.hostname === "api.kestro-fixture.invalid"
  ) {
    const request = new Request(input, init);
    const body = JSON.parse(await request.text());
    return Response.json(body.queries ? { results: body.queries.map(sql) } : sql(body));
  }
  if (url.hostname === "mail.kestro-fixture.invalid") {
    const request = new Request(input, init);
    const body = JSON.parse(await request.text());
    if (!Array.isArray(body.to) || body.to.some((address) => !address.endsWith("@example.invalid")))
      throw new Error("Fixture mail must target synthetic addresses");
    mailCalls++;
    if (mailCalls === 3) throw new Error("Local fixture: uncertain provider delivery");
    return mailCalls === 1
      ? Response.json({ message: "Lokal test: mailudbyderen svarede ikke." }, { status: 503 })
      : Response.json({ id: "synthetic-mail-no-delivery" });
  }
  if (["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return originalFetch(input, init);
  throw new Error(`Admin fixture blocked outbound network to ${url.hostname}`);
};

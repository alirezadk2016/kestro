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

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Copenhagen",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const relativeDay = (offset) =>
  new Date(new Date(`${today}T12:00:00.000Z`).getTime() + offset * 86_400_000)
    .toISOString()
    .slice(0, 10);
const enquiries = Array.from({ length: 80 }, (_, offset) => {
  const index = offset + 1;
  const status = ["new", "read", "replied", "archived"][offset % 4];
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    created_at: new Date(Date.UTC(2026, 9, 18, 12) - offset * 3_600_000).toISOString(),
    name: `Testkunde ${String(index).padStart(2, "0")}`,
    company: "Kestro lokal testfixture",
    email: [1, 5, 9].includes(index)
      ? index === 5
        ? " Fixture1@EXAMPLE.invalid "
        : "fixture1@example.invalid"
      : index >= 41 && index <= 70
        ? index % 2
          ? "repeat@example.invalid"
          : " Repeat@EXAMPLE.invalid "
        : `fixture${index}@example.invalid`,
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
    priority: index % 7 === 0 ? "high" : "normal",
    follow_up_on:
      offset % 5 === 0
        ? today
        : offset % 5 === 1
          ? relativeDay(-2)
          : offset % 5 === 2
            ? relativeDay(3)
            : null,
  };
});
let mailCalls = 0;
const events = [];

function event(row, kind, detail, id) {
  events.unshift({
    id: id || require("node:crypto").randomUUID(),
    enquiry_id: row.id,
    kind,
    detail,
    created_at: new Date().toISOString(),
  });
}

function like(pattern) {
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
  return new RegExp(expression + "$", "iu");
}

function contactGroups(term = "", pattern = "%%") {
  const matches = like(pattern);
  const groups = new Map();
  for (const row of enquiries) {
    const key = row.email.trim().toLowerCase();
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()]
    .filter(
      (rows) =>
        !term ||
        rows.some((row) => [row.name, row.company, row.email, row.phone].join(" ").match(matches)),
    )
    .map((rows) => {
      const latest = [...rows].sort(
        (left, right) =>
          right.created_at.localeCompare(left.created_at) || right.id.localeCompare(left.id),
      );
      const supplied = (field) =>
        latest.find((row) => typeof row[field] === "string" && row[field].trim())?.[field] || null;
      return {
        id: latest.at(-1).id,
        name: supplied("name") || supplied("email"),
        email: latest[0].email.trim().toLowerCase(),
        company: supplied("company"),
        phone: supplied("phone"),
        enquiryCount: rows.length,
        pendingCount: rows.filter((row) => ["new", "read"].includes(row.status)).length,
        lastSeen: latest[0].created_at,
      };
    })
    .sort(
      (left, right) =>
        right.lastSeen.localeCompare(left.lastSeen) || left.email.localeCompare(right.email),
    );
}

function followUps(params) {
  const priority = params[0],
    scope = params[1],
    current = params[3],
    term = String(params[9] || "").toLowerCase();
  const matches = like(String(params[10]));
  return enquiries
    .filter(
      (row) =>
        row.status !== "archived" &&
        (priority !== "high" || row.priority === "high") &&
        (scope === "all" ||
          (scope === "due" && row.follow_up_on && row.follow_up_on <= current) ||
          (scope === "overdue" && row.follow_up_on && row.follow_up_on < current) ||
          (scope === "upcoming" && row.follow_up_on && row.follow_up_on > current) ||
          (scope === "unscheduled" && !row.follow_up_on)) &&
        (!term ||
          [row.name, row.company, row.email, row.subject, row.message].join(" ").match(matches)),
    )
    .sort(
      (left, right) =>
        (left.follow_up_on || "9999").localeCompare(right.follow_up_on || "9999") ||
        Number(right.priority === "high") - Number(left.priority === "high") ||
        right.created_at.localeCompare(left.created_at),
    );
}

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
  const matches = like(String(params[6]));
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
  if (text.startsWith("WITH") && text.includes("INSERT INTO enquiry_events")) {
    if (text.startsWith("WITH requested")) {
      const ids = String(params[0]).match(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi) || [];
      const eventIds =
        String(params[1]).match(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi) || [];
      let changed = 0;
      for (const [index, id] of ids.entries()) {
        const row = enquiries.find((item) => item.id === id);
        if (row && row.status !== params[2]) {
          row.status = params[2];
          changed++;
          event(row, "status", params.at(-1), eventIds[index]);
        }
      }
      return result([{ changed, events: changed }]);
    }
    const row = enquiries.find((item) => params.includes(item.id));
    if (!row) return result([{ matched: 0, events: 0 }]);
    let changed = false,
      kind;
    if (text.includes("SET priority =")) {
      kind = "follow_up";
      changed = row.priority !== params[1] || row.follow_up_on !== params[2];
      row.priority = params[1];
      row.follow_up_on = params[2];
    } else if (text.includes("SET internal_note =")) {
      kind = "note";
      changed = row.internal_note !== params[1];
      row.internal_note = params[1];
    } else if (text.includes("SET status = 'replied'")) {
      kind = "reply";
      changed = true;
      row.status = "replied";
      row.reply_body = params[0];
      row.replied_at = new Date().toISOString();
    } else {
      kind = "status";
      changed = row.status !== params[1];
      row.status = params[1];
    }
    if (changed)
      event(
        row,
        kind,
        kind === "reply" ? "Et svar er sendt som e-mail." : params.at(-1),
        params.find(
          (value) =>
            typeof value === "string" &&
            /^[0-9a-f-]{36}$/i.test(value) &&
            !enquiries.some((item) => item.id === value),
        ),
      );
    return result([{ matched: 1, events: changed ? 1 : 0 }]);
  }
  if (text.includes("FROM enquiry_events"))
    return result(events.filter((entry) => entry.enquiry_id === params[0]).slice(0, 20));
  if (text.includes('AS "all"') && text.includes("AS unscheduled")) {
    const active = enquiries.filter((row) => row.status !== "archived"),
      current = params[0];
    return result([
      {
        all: active.length,
        high: active.filter((row) => row.priority === "high").length,
        due: active.filter((row) => row.follow_up_on && row.follow_up_on <= current).length,
        overdue: active.filter((row) => row.follow_up_on && row.follow_up_on < current).length,
        upcoming: active.filter((row) => row.follow_up_on && row.follow_up_on > current).length,
        unscheduled: active.filter((row) => !row.follow_up_on).length,
      },
    ]);
  }
  if (text.includes("follow_up_on <=") && text.includes("concat_ws")) {
    const rows = followUps(params);
    return text.startsWith("SELECT count")
      ? result([{ n: rows.length }])
      : result(rows.slice(Number(params[12]), Number(params[12]) + Number(params[11])));
  }
  if (text.includes("bool_or") && text.startsWith("SELECT count"))
    return result([{ n: contactGroups(String(params[0] || ""), String(params[1])).length }]);
  if (text.includes("array_agg") && text.includes('AS "enquiryCount"')) {
    if (text.includes("HAVING"))
      return result(
        contactGroups(String(params[0] || ""), String(params[1])).slice(
          Number(params[3]),
          Number(params[3]) + Number(params[2]),
        ),
      );
    return result(
      contactGroups().filter((contact) => contact.email.trim().toLowerCase() === params[0]),
    );
  }
  if (text.startsWith("SELECT email FROM enquiries WHERE id ="))
    return result(
      enquiries.filter((row) => row.id === params[0]).map((row) => ({ email: row.email })),
    );
  if (text.includes("FROM enquiries WHERE lower(btrim(email)) ="))
    return result(
      enquiries
        .filter((row) => row.email.trim().toLowerCase() === params[0])
        .sort((left, right) => right.created_at.localeCompare(left.created_at))
        .slice(Number(params[2]), Number(params[2]) + Number(params[1])),
    );
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
    text.startsWith("SELECT") &&
    text.includes("FROM enquiries WHERE id =") &&
    params[0] === "00000000-0000-4000-8000-000000000080"
  ) {
    throw new Error("Local fixture: enquiry read unavailable");
  }
  if (text.startsWith("SELECT") && text.includes("FROM enquiries WHERE id ="))
    return result(enquiries.filter((row) => row.id === params[0]));
  if (text.startsWith("SELECT *") && text.includes("FROM enquiries")) {
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

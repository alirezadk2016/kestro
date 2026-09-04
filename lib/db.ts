import { neon } from "@neondatabase/serverless";

/**
 * The one place the site keeps anything.
 *
 * Until now nothing was stored: an enquiry became an email and was gone from
 * our side the moment it was sent, and a visit was counted by somebody else's
 * dashboard or not at all. Both are fine right up to the point where you want
 * to answer a message without leaving the site, or see your own numbers — and
 * neither is possible without somewhere to put them.
 *
 * Neon over HTTP rather than a pooled TCP client. A serverless function is
 * created and destroyed per request, so a connection pool is the wrong shape:
 * it either leaks connections until the database refuses new ones, or it pays
 * a handshake on every call. The HTTP driver has neither problem.
 *
 * Everything here fails soft. If the database is not configured — no
 * connection string, which is exactly the state of a fresh clone — `sql`
 * returns null and every function below returns an empty result instead of
 * throwing. The contact form must keep working whether or not the archive
 * does: an enquiry that reaches the inbox but not the panel is a missing
 * feature, an enquiry that reaches neither because a table was missing is a
 * lost customer.
 */

/*
 * The connection string, whatever the integration decided to call it.
 *
 * Vercel's Neon integration names the variables itself, and the name depends
 * on a "custom prefix" field in the connect dialog: leave it alone and you get
 * DATABASE_URL, type STORAGE into it and you get STORAGE_URL instead. A local
 * .env would normally carry DATABASE_URL, and a Postgres integration of a
 * different vintage POSTGRES_URL.
 *
 * Rather than depend on somebody having left one field untouched, any variable
 * whose name ends in _URL and whose value is a Postgres connection string will
 * do. The named ones are tried first so an explicit choice always wins; the
 * scan is the safety net, and it matches on the protocol rather than the name
 * so a Redis or Blob URL sitting in the same environment cannot be picked up
 * by mistake.
 */
const isPostgres = (value: string | undefined): value is string =>
  typeof value === "string" && /^postgres(ql)?:\/\//.test(value);

function connectionString(): string {
  const named = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.STORAGE_URL,
  ].find(isPostgres);
  if (named) return named;

  /* Pooled connections first where both are offered: a serverless function is
     short-lived and the unpooled endpoint runs out of connections first. */
  const found = Object.entries(process.env)
    .filter(([key, value]) => key.endsWith("_URL") && isPostgres(value))
    .sort(([a], [b]) => Number(a.includes("UNPOOLED")) - Number(b.includes("UNPOOLED")));

  return found[0]?.[1] ?? "";
}

const CONNECTION = connectionString();

export const dbConfigured = CONNECTION.length > 0;

const sql = dbConfigured ? neon(CONNECTION) : null;

/** How an enquiry reached us. */
export type EnquirySource = "contact" | "quote" | "instagram";

/** Where an enquiry is in its life. */
export type EnquiryStatus = "new" | "read" | "replied" | "archived";

export type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  page: string | null;
  source: EnquirySource;
  status: EnquiryStatus;
  replied_at: string | null;
  reply_body: string | null;
};

/*
 * The schema, created on demand.
 *
 * A migration tool would be the right answer for a schema that changes often.
 * This one is two tables that have to exist before the first write, and the
 * cost of getting there should not be a step somebody has to remember on a
 * Friday. IF NOT EXISTS makes it idempotent, and the flag below means the
 * statements are attempted once per warm instance rather than per request.
 */
let ready: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (ready) return ready;

  ready = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id          TEXT PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        name        TEXT NOT NULL,
        company     TEXT,
        email       TEXT NOT NULL,
        phone       TEXT,
        subject     TEXT,
        message     TEXT NOT NULL,
        page        TEXT,
        source      TEXT NOT NULL DEFAULT 'contact',
        status      TEXT NOT NULL DEFAULT 'new',
        replied_at  TIMESTAMPTZ,
        reply_body  TEXT
      )`;
    /* The inbox is always read newest first, and the unread count is read on
       every page of the panel. */
    await sql`CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status)`;

    /*
     * Views, aggregated by day and path rather than stored one row per hit.
     *
     * A row per view would be a table that grows without limit and answers
     * every question with a scan. Counting into a day/path cell keeps the
     * table proportional to how many pages the site has, which is 112, and
     * makes every chart a single grouped read.
     *
     * Views, not visitors. Telling two visits apart needs something that
     * survives between requests — a cookie, or a fingerprint derived from the
     * address and the browser — and the privacy policy says this site stores
     * neither. Vercel's own panel gives unique visitors; this gives the shape
     * of the traffic without identifying anyone.
     */
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        day    DATE NOT NULL,
        path   TEXT NOT NULL,
        views  INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (day, path)
      )`;
  })().catch((error) => {
    /* Let the next call try again rather than caching a failure for the life
       of the instance. */
    ready = null;
    throw error;
  });

  return ready;
}

/** Store an enquiry. Returns false when there is nowhere to store it. */
export async function saveEnquiry(
  enquiry: Omit<Enquiry, "created_at" | "status" | "replied_at" | "reply_body">,
): Promise<boolean> {
  if (!sql) return false;
  try {
    await ensureSchema();
    await sql`
      INSERT INTO enquiries (id, name, company, email, phone, subject, message, page, source)
      VALUES (${enquiry.id}, ${enquiry.name}, ${enquiry.company}, ${enquiry.email},
              ${enquiry.phone}, ${enquiry.subject}, ${enquiry.message}, ${enquiry.page},
              ${enquiry.source})
      ON CONFLICT (id) DO NOTHING`;
    return true;
  } catch (error) {
    console.error("saveEnquiry failed", error);
    return false;
  }
}

export async function listEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  if (!sql) return [];
  try {
    await ensureSchema();
    const rows = status
      ? await sql`SELECT * FROM enquiries WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM enquiries WHERE status <> 'archived' ORDER BY created_at DESC LIMIT 200`;
    return rows as Enquiry[];
  } catch (error) {
    console.error("listEnquiries failed", error);
    return [];
  }
}

export async function getEnquiry(id: string): Promise<Enquiry | null> {
  if (!sql) return null;
  try {
    await ensureSchema();
    const rows = (await sql`SELECT * FROM enquiries WHERE id = ${id}`) as Enquiry[];
    return rows[0] ?? null;
  } catch (error) {
    console.error("getEnquiry failed", error);
    return null;
  }
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  if (!sql) return;
  try {
    await ensureSchema();
    await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
  } catch (error) {
    console.error("setEnquiryStatus failed", error);
  }
}

export async function recordReply(id: string, body: string): Promise<void> {
  if (!sql) return;
  try {
    await ensureSchema();
    await sql`
      UPDATE enquiries
      SET status = 'replied', replied_at = now(), reply_body = ${body}
      WHERE id = ${id}`;
  } catch (error) {
    console.error("recordReply failed", error);
  }
}

export async function countNew(): Promise<number> {
  if (!sql) return 0;
  try {
    await ensureSchema();
    const rows = (await sql`SELECT count(*)::int AS n FROM enquiries WHERE status = 'new'`) as {
      n: number;
    }[];
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

/** Add one to today's count for a path. */
export async function recordView(path: string): Promise<void> {
  if (!sql) return;
  try {
    await ensureSchema();
    await sql`
      INSERT INTO page_views (day, path, views)
      VALUES (CURRENT_DATE, ${path}, 1)
      ON CONFLICT (day, path) DO UPDATE SET views = page_views.views + 1`;
  } catch (error) {
    console.error("recordView failed", error);
  }
}

export type ViewStats = {
  total: number;
  today: number;
  last30: number;
  daily: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
};

export async function viewStats(): Promise<ViewStats> {
  const empty: ViewStats = { total: 0, today: 0, last30: 0, daily: [], topPages: [] };
  if (!sql) return empty;
  try {
    await ensureSchema();
    const [totals, daily, top] = await Promise.all([
      sql`
        SELECT
          coalesce(sum(views), 0)::int AS total,
          coalesce(sum(views) FILTER (WHERE day = CURRENT_DATE), 0)::int AS today,
          coalesce(sum(views) FILTER (WHERE day > CURRENT_DATE - 30), 0)::int AS last30
        FROM page_views`,
      sql`
        SELECT to_char(day, 'YYYY-MM-DD') AS day, sum(views)::int AS views
        FROM page_views
        WHERE day > CURRENT_DATE - 30
        GROUP BY day ORDER BY day`,
      sql`
        SELECT path, sum(views)::int AS views
        FROM page_views
        GROUP BY path ORDER BY views DESC LIMIT 12`,
    ]);
    const t = (totals as { total: number; today: number; last30: number }[])[0];
    return {
      total: t?.total ?? 0,
      today: t?.today ?? 0,
      last30: t?.last30 ?? 0,
      daily: daily as { day: string; views: number }[],
      topPages: top as { path: string; views: number }[],
    };
  } catch (error) {
    console.error("viewStats failed", error);
    return empty;
  }
}

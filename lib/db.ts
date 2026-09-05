import { randomBytes, randomUUID } from "node:crypto";

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

/**
 * The names of the connection-string-shaped variables this deployment can see.
 *
 * Names only, never values — a connection string carries the password, and the
 * panel is behind a password rather than behind a firewall. What this answers
 * is the one question that is otherwise unanswerable from outside: when the
 * panel says there is no database, is the variable there under a name nothing
 * looks for, or is it not there at all? Those two have completely different
 * fixes, and guessing between them costs a deploy each time.
 */
export function databaseEnvNames(): string[] {
  return Object.entries(process.env)
    .filter(([, value]) => isPostgres(value))
    .map(([key]) => key)
    .sort();
}

/** Every variable name the deployment has, for the same diagnosis one step out:
 *  an integration that was never connected leaves no trace at all, and seeing
 *  that the list has no PG-anything in it says so immediately. */
export function envNameSample(): string[] {
  return Object.keys(process.env)
    .filter((key) => /(^PG|POSTGRES|DATABASE|NEON|STORAGE|_URL$)/i.test(key))
    .sort();
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

    /*
     * A visit: one browser reading the site over one sitting.
     *
     * This is the table that makes a refresh stop counting as a new reader.
     * page_views above answers "how many pages were read"; this answers "by
     * how many people, from where, on what, and for how long" — and the two
     * are different questions that were previously both answered by the same
     * incrementing counter.
     *
     * A sitting ends after thirty minutes of silence, which is the same window
     * every analytics tool uses. Coming back after an hour is a second visit,
     * which is what it feels like to the person too.
     *
     * `visitor` is the daily hash from lib/visits.ts, not an address and not
     * anything that survives the day. No IP, no name, no id in the browser.
     */
    await sql`
      CREATE TABLE IF NOT EXISTS visits (
        id          TEXT PRIMARY KEY,
        visitor     TEXT NOT NULL,
        started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_seen   TIMESTAMPTZ NOT NULL DEFAULT now(),
        hits        INTEGER NOT NULL DEFAULT 1,
        source      TEXT NOT NULL DEFAULT 'Direkte',
        entry_path  TEXT,
        last_path   TEXT,
        country     TEXT,
        device      TEXT
      )`;
    /* Who is here now, and the open-visit lookup that runs on every hit. */
    await sql`CREATE INDEX IF NOT EXISTS visits_last_seen_idx ON visits (last_seen DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS visits_open_idx ON visits (visitor, last_seen DESC)`;

    /*
     * The day's salt.
     *
     * In the database rather than in memory because every request may land on
     * a different serverless instance, and two instances with two salts would
     * hash the same browser to two visitors. Yesterday's row is deleted, which
     * is what makes yesterday's hashes permanently unlinkable.
     */
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_salt (
        day  DATE PRIMARY KEY,
        salt TEXT NOT NULL
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

/*
 * The day's salt, shared by every instance.
 *
 * INSERT … ON CONFLICT DO UPDATE SET salt = analytics_salt.salt is a no-op
 * update, and it is written that way on purpose: DO NOTHING returns no row
 * when the day already exists, which would mean a second round trip to read
 * the salt that is already there. This returns the stored value whether it was
 * just created or was already there, in one statement and with no race — two
 * instances starting at the same moment cannot end up with different salts.
 */
let saltCache: { day: string; value: string } | null = null;

async function dailySalt(): Promise<string | null> {
  if (!sql) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (saltCache?.day === today) return saltCache.value;

  const rows = (await sql`
    INSERT INTO analytics_salt (day, salt) VALUES (CURRENT_DATE, ${randomBytes(32).toString("hex")})
    ON CONFLICT (day) DO UPDATE SET salt = analytics_salt.salt
    RETURNING salt`) as { salt: string }[];

  const salt = rows[0]?.salt ?? null;
  if (salt) saltCache = { day: today, value: salt };

  /* Once a day, per instance: drop the salts that would let an old hash be
     recomputed from an address. */
  await sql`DELETE FROM analytics_salt WHERE day < CURRENT_DATE - 1`;
  return salt;
}

/** The salt for today, or null when there is no database to keep one in. */
export async function currentSalt(): Promise<string | null> {
  if (!sql) return null;
  try {
    await ensureSchema();
    return await dailySalt();
  } catch (error) {
    console.error("dailySalt failed", error);
    return null;
  }
}

export type VisitHit = {
  visitor: string;
  path: string;
  source: string;
  country: string | null;
  device: string;
};

/** Add one to today's count for a path. */
async function bumpView(path: string): Promise<void> {
  if (!sql) return;
  await sql`
    INSERT INTO page_views (day, path, views)
    VALUES (CURRENT_DATE, ${path}, 1)
    ON CONFLICT (day, path) DO UPDATE SET views = page_views.views + 1`;
}

/**
 * Record a page being read, against the visit it belongs to.
 *
 * The refresh rule lives here. A hit on the page the visit is already on
 * extends the visit and counts nothing: pressing reload, or coming back to
 * the tab, is not a second reading of the page. A hit on a different path is
 * a real navigation and counts — including a return to a page seen earlier in
 * the same visit, which genuinely is being read again.
 *
 * No open visit means a new one, and only then are source, country and device
 * recorded: they describe how somebody arrived, so re-deriving them on every
 * page they go on to read would overwrite the answer with "Direkte".
 */
export async function recordHit(hit: VisitHit): Promise<void> {
  if (!sql) return;
  try {
    await ensureSchema();

    const open = (await sql`
      SELECT id, last_path FROM visits
      WHERE visitor = ${hit.visitor} AND last_seen > now() - interval '30 minutes'
      ORDER BY last_seen DESC LIMIT 1`) as { id: string; last_path: string | null }[];

    if (open.length === 0) {
      await sql`
        INSERT INTO visits (id, visitor, source, entry_path, last_path, country, device)
        VALUES (${randomUUID()}, ${hit.visitor}, ${hit.source}, ${hit.path}, ${hit.path},
                ${hit.country}, ${hit.device})`;
      await bumpView(hit.path);
      return;
    }

    const repeat = open[0].last_path === hit.path;
    await sql`
      UPDATE visits
      SET last_seen = now(), last_path = ${hit.path}, hits = hits + ${repeat ? 0 : 1}
      WHERE id = ${open[0].id}`;
    if (!repeat) await bumpView(hit.path);
  } catch (error) {
    console.error("recordHit failed", error);
  }
}

/**
 * Still here.
 *
 * Sent by the open tab every minute. Without it a visit's length is the gap
 * between its first and last navigation, so anyone who lands on one page and
 * reads it for five minutes is recorded as having stayed zero seconds — and
 * the average time on site measures how fast people click rather than how
 * long they stay. It never counts a view and never opens a visit: a heartbeat
 * from a sitting that has already timed out is simply dropped.
 */
export async function touchVisit(visitor: string): Promise<void> {
  if (!sql) return;
  try {
    await ensureSchema();
    await sql`
      UPDATE visits SET last_seen = now()
      WHERE visitor = ${visitor} AND last_seen > now() - interval '30 minutes'`;
  } catch (error) {
    console.error("touchVisit failed", error);
  }
}

export type Breakdown = { name: string; visits: number };

export type ViewStats = {
  total: number;
  today: number;
  last30: number;
  daily: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
};

export type LiveStats = {
  /** Visits with a signal in the last five minutes. */
  online: number;
  /** What each of them is reading, newest first. */
  reading: {
    path: string | null;
    country: string | null;
    device: string | null;
    source: string;
    seconds: number;
  }[];
  visitsToday: number;
  visits30: number;
  /**
   * Mean length of the visits that lasted long enough to have a length.
   *
   * Five seconds is the floor. Two signals a few milliseconds apart — a load
   * followed straight away by a click through to the next page — say nothing
   * about how long anybody stayed, and averaging those zeroes in drags the
   * figure toward nothing no matter how long the real readers stayed.
   */
  avgSeconds: number;
  /** How many visits that mean is taken over — the rest were single hits. */
  avgBasis: number;
  /** Share of visits that read exactly one page. */
  bouncePct: number | null;
  sources: Breakdown[];
  countries: Breakdown[];
  devices: Breakdown[];
};

const EMPTY_LIVE: LiveStats = {
  online: 0,
  reading: [],
  visitsToday: 0,
  visits30: 0,
  avgSeconds: 0,
  avgBasis: 0,
  bouncePct: null,
  sources: [],
  countries: [],
  devices: [],
};

/**
 * Everything the live panel shows, in one round trip.
 *
 * Six queries in parallel rather than six awaits in sequence: they are
 * independent, they all hit the same small table, and a serverless function
 * billed by the millisecond should not spend five of the six waiting.
 *
 * Every breakdown is over the same thirty-day window as the chart, so the
 * numbers on the page can be compared with each other.
 */
export async function liveStats(): Promise<LiveStats> {
  if (!sql) return EMPTY_LIVE;
  try {
    await ensureSchema();
    const [online, reading, totals, sources, countries, devices] = await Promise.all([
      sql`SELECT count(*)::int AS n FROM visits WHERE last_seen > now() - interval '5 minutes'`,
      sql`
        SELECT last_path AS path, country, device, source,
               extract(epoch FROM (last_seen - started_at))::int AS seconds
        FROM visits
        WHERE last_seen > now() - interval '5 minutes'
        ORDER BY last_seen DESC LIMIT 25`,
      sql`
        SELECT
          coalesce(count(*) FILTER (WHERE started_at >= date_trunc('day', now())), 0)::int AS today,
          coalesce(count(*) FILTER (WHERE started_at > now() - interval '30 days'), 0)::int AS last30,
          coalesce(count(*) FILTER (WHERE started_at > now() - interval '30 days'
                                      AND last_seen - started_at >= interval '5 seconds'), 0)::int AS measured,
          coalesce(avg(extract(epoch FROM (last_seen - started_at)))
                     FILTER (WHERE started_at > now() - interval '30 days'
                               AND last_seen - started_at >= interval '5 seconds'), 0)::int AS avg_seconds,
          coalesce(count(*) FILTER (WHERE started_at > now() - interval '30 days'
                                      AND hits <= 1), 0)::int AS single
        FROM visits`,
      sql`
        SELECT source AS name, count(*)::int AS visits FROM visits
        WHERE started_at > now() - interval '30 days'
        GROUP BY source ORDER BY visits DESC, name LIMIT 12`,
      sql`
        SELECT coalesce(country, '??') AS name, count(*)::int AS visits FROM visits
        WHERE started_at > now() - interval '30 days'
        GROUP BY country ORDER BY visits DESC, name LIMIT 12`,
      sql`
        SELECT coalesce(device, 'Ukendt') AS name, count(*)::int AS visits FROM visits
        WHERE started_at > now() - interval '30 days'
        GROUP BY device ORDER BY visits DESC, name`,
    ]);

    const t = (
      totals as {
        today: number;
        last30: number;
        measured: number;
        avg_seconds: number;
        single: number;
      }[]
    )[0];

    return {
      online: (online as { n: number }[])[0]?.n ?? 0,
      reading: reading as LiveStats["reading"],
      visitsToday: t?.today ?? 0,
      visits30: t?.last30 ?? 0,
      avgSeconds: t?.avg_seconds ?? 0,
      avgBasis: t?.measured ?? 0,
      /* Undefined rather than 0% when there is nothing to divide by: a bounce
         rate of zero and no visits at all are not the same statement. */
      bouncePct: t && t.last30 > 0 ? Math.round((t.single / t.last30) * 100) : null,
      sources: sources as Breakdown[],
      countries: countries as Breakdown[],
      devices: devices as Breakdown[],
    };
  } catch (error) {
    console.error("liveStats failed", error);
    return EMPTY_LIVE;
  }
}

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

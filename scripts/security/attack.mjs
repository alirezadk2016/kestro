/**
 * Try to get into the panel. Fail every time, or say why not.
 *
 *   node scripts/security/attack.mjs [origin]
 *
 * Expects a server already running at the origin (default http://127.0.0.1:4310)
 * that was started with ADMIN_PASSWORD set to the value in ATTACK_PASSWORD, or
 * "test-password" if that is unset.
 *
 * This is not a lint. Every case below is a request that was, at some point,
 * either an actual way in or one line away from being one — the RSC bypass at
 * the top of the list was real, measured against this codebase, and returned
 * 3203 bytes of the inbox to a request with no cookie on it. The value of the
 * file is that it keeps being run: a gate is not a thing you install, it is a
 * thing that is still there next month.
 *
 * Three layers are under test, and they are tested separately on purpose,
 * because the failure mode of defence in depth is that all of it turns out to
 * be one layer wearing a coat:
 *
 *   L1  middleware.ts, before the router chooses anything
 *   L2  requireAdmin() in the page, and the session check in each endpoint
 *   L3  adminOnly() in lib/db.ts, on the query itself
 *
 * L1 answers first, so most of these prove L1. The cases marked L2 use paths
 * middleware deliberately lets through (/admin, the login endpoint), which is
 * exactly where the layer below has to hold on its own.
 */
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import process from "node:process";

const ORIGIN = process.argv[2] ?? "http://127.0.0.1:4310";
const PASSWORD = process.env.ATTACK_PASSWORD ?? "test-password";
const SECRET = process.env.ATTACK_SECRET || PASSWORD;

const results = [];
const record = (layer, name, passed, detail) => results.push({ layer, name, passed, detail });

/** The cookie the server would issue, forged here with the same secret. */
function session(expiresAt) {
  const payload = String(expiresAt);
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

const VALID = session(Date.now() + 60_000);
const EXPIRED = session(Date.now() - 60_000);
/* Right shape, right expiry, signed with a secret that is not ours. */
const FORGED = (() => {
  const payload = String(Date.now() + 60_000);
  return `${payload}.${crypto.createHmac("sha256", "not-the-secret").update(payload).digest("base64url")}`;
})();
/* Ours, with the expiry pushed out and the signature left alone. */
const TAMPERED = (() => {
  const real = session(Date.now() + 60_000);
  return `${Date.now() + 99_000_000}.${real.slice(real.lastIndexOf(".") + 1)}`;
})();

/*
 * What the client router sends when it wants one segment and already has the
 * layouts above it. This is the whole bypass: Next honours it and renders the
 * page alone, so a login wall that lives in a layout is simply not run.
 */
const RSC = {
  RSC: "1",
  "Next-Router-State-Tree": encodeURIComponent(
    JSON.stringify([
      "",
      { children: ["admin", { children: ["beskeder", { children: ["__PAGE__", {}] }] }] },
    ]),
  ),
};

async function ask(path, { headers = {}, method = "GET", body, cookie } = {}) {
  const response = await fetch(`${ORIGIN}${path}`, {
    method,
    headers: { ...headers, ...(cookie ? { cookie } : {}) },
    body,
    redirect: "manual",
  });
  return { status: response.status, headers: response.headers, text: await response.text() };
}

/*
 * Strings that mean a panel page rendered its own body.
 *
 * Not "@" and not "Beskeder": the first is @media in the inlined stylesheet and
 * the second is the nav label on the login screen, and both made the first run
 * of this file report four break-ins that were not break-ins. A detector that
 * cries wolf is worse than no detector, because the next real one is read as
 * noise too.
 *
 * Each of these is emitted by exactly one authenticated page and by nothing
 * else: the inbox's empty state and its filter, and the dashboard's panel of
 * environment variable names — which is itself something a stranger should not
 * have, and which the RSC bypass handed out before it was closed.
 *
 * The test server runs with no DATABASE_URL, so there are no enquiries to find
 * in a response. That is the point of matching the page's own chrome instead: a
 * response containing it is a response where the query ran, and on a deployment
 * with a database that same response is the customer list.
 */
const LEAKS = [
  "Ingen beskeder her",
  "Arkiverede",
  "Hvad denne deployment kan se",
  "DATABASE_URL",
  "POSTGRES_URL",
  "RESEND_API_KEY",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
];

function leaked(text) {
  return LEAKS.filter((word) => text.includes(word));
}

async function shutOut(layer, name, path, options, expected) {
  const { status, text } = await ask(path, options);
  const spill = leaked(text);
  const ok = expected.includes(status) && spill.length === 0;
  record(layer, name, ok, `${status}${spill.length ? ` leaked ${spill.join(", ")}` : ""}`);
}

async function main() {
  /* ---- L1: the outermost gate ------------------------------------------ */

  await shutOut("L1", "inbox, plain GET", "/admin/beskeder", {}, [404]);
  await shutOut("L1", "inbox, RSC segment request", "/admin/beskeder", { headers: RSC }, [404]);
  await shutOut(
    "L1",
    "one message, RSC segment request",
    "/admin/beskeder/any-id",
    { headers: RSC },
    [404],
  );
  await shutOut("L1", "live figures", "/api/admin/live", {}, [403]);
  await shutOut("L1", "live figures, RSC headers", "/api/admin/live", { headers: RSC }, [403]);
  await shutOut(
    "L1",
    "archive, no session",
    "/api/admin/archive",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "id=any-id",
    },
    [403],
  );
  await shutOut(
    "L1",
    "reply, no session",
    "/api/admin/reply",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "id=any-id&body=hello",
    },
    [403],
  );

  /* Cookies that are the right shape and still not a session. */
  await shutOut(
    "L1",
    "expired session",
    "/admin/beskeder",
    { cookie: `kestro_admin=${EXPIRED}` },
    [404],
  );
  await shutOut(
    "L1",
    "session signed with another secret",
    "/admin/beskeder",
    { cookie: `kestro_admin=${FORGED}` },
    [404],
  );
  await shutOut(
    "L1",
    "expiry pushed out, signature kept",
    "/admin/beskeder",
    { cookie: `kestro_admin=${TAMPERED}` },
    [404],
  );
  await shutOut(
    "L1",
    "signature removed",
    "/admin/beskeder",
    { cookie: "kestro_admin=9999999999999" },
    [404],
  );
  await shutOut("L1", "empty session", "/admin/beskeder", { cookie: "kestro_admin=" }, [404]);
  /* Not base64url at all: the decoder must refuse rather than throw. */
  await shutOut(
    "L1",
    "unparseable signature",
    "/admin/beskeder",
    { cookie: "kestro_admin=9999999999999.!!!!" },
    [404],
  );

  /* Path games. Each of these is a different string arriving at the matcher. */
  await shutOut("L1", "trailing slash", "/admin/beskeder/", {}, [404, 308]);
  await shutOut("L1", "double slash", "//admin/beskeder", {}, [404, 308, 400]);
  /* 500 is deliberately not in this list. It was the answer once, from a render
     loop, and "the panel did not open" is not the same as "the request was
     cheap to refuse". */
  await shutOut("L1", "encoded separator", "/admin%2Fbeskeder", {}, [404, 400]);
  await shutOut("L1", "double-encoded separator", "/admin%252Fbeskeder", {}, [404, 400]);
  await shutOut("L1", "encoded separator, lower case", "/admin%2fbeskeder", {}, [404, 400]);
  await shutOut("L1", "dot segment", "/admin/./beskeder", {}, [404, 308, 400]);
  await shutOut(
    "L1",
    "upward traversal from a public path",
    "/produkter/../admin/beskeder",
    {},
    [404, 308, 400],
  );
  await shutOut("L1", "language prefix", "/da/admin/beskeder", {}, [404]);
  await shutOut("L1", "English prefix", "/en/admin/beskeder", {}, [404]);

  /*
   * Which layer actually answered.
   *
   * Every case above passes whether one gate is holding or three are, which is
   * the thing that makes defence in depth easy to believe in and hard to keep.
   * Middleware answers with a three-byte body; the page's notFound() answers
   * with Next's rendered 404 document, which is thousands. So the size says who
   * spoke — and if middleware ever stops enforcing (an empty secret at the edge
   * would do it, silently), this is the case that notices, because the answer
   * would still be 404, just a much longer one.
   */
  {
    const { status, text } = await ask("/admin/beskeder");
    record(
      "L1",
      "middleware is the layer that answered",
      status === 404 && text.length < 32,
      `${status} ${text.length}b`,
    );
  }

  /* ---- L2: the page's own gate, where L1 lets the request through ------- */

  /*
   * /admin is open by design — the login screen has to render. The layout shows
   * the wall; the page under it must show nothing, including when the layout is
   * skipped. This is the original bug's exact shape, one path over.
   */
  await shutOut(
    "L2",
    "login screen, RSC segment request",
    "/admin",
    {
      headers: {
        RSC: "1",
        "Next-Router-State-Tree": encodeURIComponent(
          JSON.stringify(["", { children: ["admin", { children: ["__PAGE__", {}] }] }]),
        ),
      },
    },
    [404, 200],
  );

  {
    const { status, text } = await ask("/admin");
    const spill = leaked(text);
    /* It must render — it is the form — and it must be only the form. */
    const isForm = text.includes("Adgangskode") || text.includes("password");
    record(
      "L2",
      "login screen is the form and nothing else",
      status === 200 && isForm && spill.length === 0,
      `${status}${spill.length ? ` leaked ${spill.join(", ")}` : ""}`,
    );
  }

  /* ---- CSRF: a post from somebody else's page --------------------------- */

  for (const [name, path, body] of [
    ["login", "/api/admin/login", `password=${encodeURIComponent(PASSWORD)}`],
    ["archive", "/api/admin/archive", "id=any-id"],
    ["logout", "/api/admin/logout", ""],
  ]) {
    const { status, headers } = await ask(path, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "cross-site",
        origin: "https://evil.example",
      },
      body,
      cookie: `kestro_admin=${VALID}`,
    });
    const gave = headers.get("set-cookie") ?? "";
    record(
      "CSRF",
      `${name} from another origin`,
      status === 403 && !gave.includes("kestro_admin="),
      `${status}${gave ? " set-cookie" : ""}`,
    );
  }

  {
    const { status } = await ask("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "cross-site" },
      body: JSON.stringify({ path: "/spam" }),
    });
    record("CSRF", "traffic written from another origin", status === 204, String(status));
  }

  /* ---- The password itself ---------------------------------------------- */

  {
    const { status, headers } = await ask("/api/admin/login", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
      },
      body: "password=definitely-wrong",
    });
    const gave = headers.get("set-cookie") ?? "";
    record(
      "L2",
      "wrong password issues no session",
      (status === 303 || status === 429) && !/kestro_admin=[^;]/.test(gave),
      String(status),
    );
  }

  /* ---- And the legitimate way in, which must still work ----------------- */

  {
    const { status, text } = await ask("/admin/beskeder", { cookie: `kestro_admin=${VALID}` });
    record("open", "a real session reaches the inbox", status === 200, `${status} ${text.length}b`);
  }
  {
    const { status } = await ask("/api/admin/live", { cookie: `kestro_admin=${VALID}` });
    record("open", "a real session reads the live figures", status === 200, String(status));
  }
  {
    const { status, text } = await ask("/admin", { cookie: `kestro_admin=${VALID}` });
    record(
      "open",
      "a real session reaches the dashboard",
      status === 200,
      `${status} ${text.length}b`,
    );
  }

  /* ---- Headers ---------------------------------------------------------- */

  {
    const { headers } = await ask("/");
    for (const [key, want] of [
      ["content-security-policy", "frame-ancestors 'none'"],
      ["strict-transport-security", "max-age="],
      ["x-content-type-options", "nosniff"],
      ["x-frame-options", "DENY"],
      ["referrer-policy", "strict-origin"],
      ["cross-origin-opener-policy", "same-origin"],
    ]) {
      const value = headers.get(key) ?? "";
      record("headers", key, value.includes(want), value || "missing");
    }
  }
  {
    const { headers } = await ask("/admin");
    const value = headers.get("x-robots-tag") ?? "";
    record("headers", "panel is noindex", value.includes("noindex"), value || "missing");
  }

  /* ---- Nothing about the deployment on the way out ---------------------- */

  {
    const { text } = await ask("/api/version");
    const spill = [
      "DATABASE_URL",
      "RESEND_API_KEY",
      "ADMIN_PASSWORD",
      "commit_message",
      "message",
    ].filter((word) => text.includes(word));
    record("leak", "version endpoint", spill.length === 0, spill.join(", ") || "clean");
  }

  /* ---- The two implementations of one signature ------------------------- */

  {
    const { sessionValidEdge } = await import("../../lib/admin-session.ts").catch(() => ({}));
    if (typeof sessionValidEdge === "function") {
      const agree =
        (await sessionValidEdge(VALID, SECRET)) === true &&
        (await sessionValidEdge(EXPIRED, SECRET)) === false &&
        (await sessionValidEdge(FORGED, SECRET)) === false &&
        (await sessionValidEdge(TAMPERED, SECRET)) === false &&
        (await sessionValidEdge(VALID, "")) === false;
      record("parity", "edge verifier agrees with the Node one", agree, "");
    } else {
      /* Node cannot import the TypeScript directly on every version; the four
         cookies above already went through it over HTTP, via middleware. */
      record("parity", "edge verifier exercised through middleware", true, "via L1 cases");
    }
  }

  /* ---- L3: the gate on the query ---------------------------------------- */

  /*
   * Read from the source rather than sent over the wire, and said plainly:
   * this is the one layer this file cannot attack. It only answers when the two
   * above it have already been passed, and they hold — which is the point of
   * it and also the reason there is no request that reaches it.
   *
   * So what is checked is the property that makes it worth having: that
   * adminOnly() is the FIRST thing each of these functions does. Not somewhere
   * in the body, not after the `if (!sql)` line — first. A gate below an early
   * return is a gate that a deployment without a database walks straight past,
   * and that deployment is every local build and every fresh clone.
   */
  {
    const source = await readFile(new URL("../../lib/db.ts", import.meta.url), "utf8");
    for (const name of ["listEnquiries", "getEnquiry", "countNew", "liveStats", "viewStats"]) {
      const at = source.indexOf(`export async function ${name}`);
      const body = at < 0 ? "" : source.slice(source.indexOf("{", at) + 1).trimStart();
      record(
        "L3",
        `${name} asks first`,
        body.startsWith("adminOnly("),
        at < 0 ? "not found" : body.slice(0, body.indexOf("\n")).trim(),
      );
    }
  }

  /* ---- Report ----------------------------------------------------------- */

  const width = Math.max(...results.map((r) => r.name.length));
  let failed = 0;
  let layer = "";
  for (const result of results) {
    if (result.layer !== layer) {
      layer = result.layer;
      console.log(`\n  ${layer}`);
    }
    if (!result.passed) failed += 1;
    console.log(
      `    ${result.passed ? "shut out" : "GOT IN  "}  ${result.name.padEnd(width)}  ${result.detail}`,
    );
  }
  console.log(
    `\n  ${results.length - failed}/${results.length} held.${failed ? `  ${failed} did not.` : ""}\n`,
  );
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});

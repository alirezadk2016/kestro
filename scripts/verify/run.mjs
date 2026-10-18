/*
 * Builds, serves and checks — one command, no server left running.
 *
 * The checks need a production build: the reveal behaviour, the deferred WebGL
 * chunk and the real bundle sizes are all different under `next dev`, so
 * checking a dev server would be checking something the visitor never gets.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const PORT = process.env.VERIFY_PORT ?? "4173";
// Next normalizes loopback IPs to "localhost" inside NextURL. Keep the bind
// hostname and internal rewrite origin identical on the local test server.
const BASE = `http://localhost:${PORT}`;
const NEXT_CLI = "node_modules/next/dist/bin/next";

const bin = (command) =>
  process.platform === "win32" && (command === "npm" || command === "npx")
    ? `${command}.cmd`
    : command;

const run = (command, args, options = {}) =>
  spawn(bin(command), args, { stdio: "inherit", shell: false, ...options });

/*
 * Refuse to run against somebody else's server.
 *
 * Without this the runner starts, finds the port already answering, and checks
 * whatever is on it — a dev server, or a previous build left behind. That is
 * worse than not running at all: it reports on a build nobody asked about, and
 * the failures make no sense against the code in front of you. Found the hard
 * way, checking a stale server whose chunk hashes no longer existed.
 */
try {
  const response = await fetch(BASE + "/", { signal: AbortSignal.timeout(1500) });
  if (response) {
    console.error(
      `verify: something is already serving ${BASE}. Stop it first, or set VERIFY_PORT.`,
    );
    process.exit(1);
  }
} catch {
  /* Nothing there, which is what we want. */
}

/* Content gates first: they are static, take a second, and there is no point
   building 108 pages to find out an article claims another article's keyword. */
console.log("verify: content");
const content = run("node", ["scripts/verify/content.mjs"]);
const [contentCode] = await once(content, "exit");
if (contentCode !== 0) process.exit(contentCode);

console.log("verify: building");
const build = run(process.execPath, [NEXT_CLI, "build"]);
const [code] = await once(build, "exit");
if (code !== 0) process.exit(code);

console.log(`verify: serving on ${BASE}`);
/*
 * With a password, so the panel's gates can be attacked rather than assumed.
 *
 * Without ADMIN_PASSWORD set, lib/admin-auth.ts fails closed on everything and
 * scripts/security/attack.mjs would report a wall of refusals that prove
 * nothing — a panel with no password configured refuses a valid session too.
 * The value is local to this process and never leaves it.
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "verify-only-password";
const server = spawn(process.execPath, [NEXT_CLI, "start", "-p", PORT, "-H", "localhost"], {
  stdio: ["ignore", "ignore", "pipe"],
  env: { ...process.env, ADMIN_PASSWORD, ADMIN_SESSION_SECRET: "" },
});
let serverLog = "";
server.stderr.on("data", (chunk) => {
  serverLog = (serverLog + chunk).slice(-10000);
});

const stop = () => {
  if (!server.killed) server.kill("SIGTERM");
};
process.on("exit", stop);
process.on("SIGINT", () => {
  stop();
  process.exit(130);
});

/* Wait for it to answer rather than sleeping a guessed number of seconds. */
const deadline = Date.now() + 60000;
for (;;) {
  try {
    const response = await fetch(BASE + "/", { signal: AbortSignal.timeout(2000) });
    if (response.ok) break;
  } catch {
    /* not up yet */
  }
  if (Date.now() > deadline) {
    stop();
    console.error("verify: server did not start");
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

const checks = run("node", ["scripts/verify/checks.mjs"], {
  env: { ...process.env, VERIFY_BASE: BASE, VERIFY_ADMIN_SECRET: ADMIN_PASSWORD },
});
const [checksCode] = await once(checks, "exit");
if (checksCode && serverLog) console.error(`verify: server diagnostics\n${serverLog}`);

/*
 * And then try to get in.
 *
 * Last because it needs the same running build the checks need, and because a
 * page that renders wrong is a page nobody can read — but a panel that opens
 * without a password is every customer's name, company, address and message,
 * and that is not a thing to find out about from a report. It runs even when
 * the checks failed, so one command answers both questions.
 */
console.log("verify: security");
const attack = run("node", ["scripts/security/attack.mjs", BASE], {
  env: { ...process.env, ATTACK_PASSWORD: ADMIN_PASSWORD, ATTACK_SECRET: ADMIN_PASSWORD },
});
const [attackCode] = await once(attack, "exit");

stop();
if (server.exitCode === null && server.signalCode === null) await once(server, "exit");

// A second child serves the same build with synthetic enquiries. The fetch
// adapter exists only in this verification process, uses .invalid endpoints,
// and refuses all external networking. No fixture switch or route ships in
// the application. The real security suite above always runs first.
console.log("verify: admin workflows with local synthetic enquiries");
const fixturePort = process.env.VERIFY_FIXTURE_PORT ?? String(Number(PORT) + 1);
const fixtureBase = `http://localhost:${fixturePort}`;
try {
  const response = await fetch(fixtureBase + "/", { signal: AbortSignal.timeout(1500) });
  if (response) throw new Error(`something is already serving ${fixtureBase}`);
} catch (error) {
  if (error.message?.startsWith("something is already serving")) {
    console.error(`verify: ${error.message}; stop it or set VERIFY_FIXTURE_PORT`);
    process.exit(checksCode || attackCode || 1);
  }
}
const preload = fileURLToPath(new URL("./admin-fixture.cjs", import.meta.url)).replaceAll(
  "\\",
  "/",
);
const fixture = spawn(process.execPath, [NEXT_CLI, "start", "-p", fixturePort, "-H", "localhost"], {
  stdio: ["ignore", "ignore", "pipe"],
  env: {
    ...process.env,
    ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: "",
    DATABASE_URL:
      "postgresql://fixture:fixture@ep-test.kestro-fixture.invalid/fixture?sslmode=require",
    RESEND_API_KEY: "fixture-only-not-a-real-key",
    RESEND_ENDPOINT: "https://mail.kestro-fixture.invalid/send",
    CONTACT_FROM: "Kestro fixture <sender@example.invalid>",
    CONTACT_TO: "inbox@example.invalid",
    VERIFY_ADMIN_FIXTURE: "local-only",
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --require "${preload}"`.trim(),
  },
});
const stopFixture = () => {
  if (!fixture.killed) fixture.kill("SIGTERM");
};
process.on("exit", stopFixture);
let fixtureLog = "";
fixture.stderr.on("data", (chunk) => {
  fixtureLog = (fixtureLog + chunk).slice(-10000);
});
let fixtureCode = 1;
try {
  const until = Date.now() + 60000;
  for (;;) {
    try {
      const response = await fetch(fixtureBase + "/admin", { signal: AbortSignal.timeout(2000) });
      if (response.ok) break;
    } catch {}
    if (Date.now() > until || fixture.exitCode !== null)
      throw new Error("admin fixture server did not start");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const fixtureChecks = run("node", ["scripts/verify/admin-fixture-checks.mjs"], {
    env: {
      ...process.env,
      VERIFY_BASE: fixtureBase,
      VERIFY_ADMIN_SECRET: ADMIN_PASSWORD,
      VERIFY_ADMIN_FIXTURE: "local-only",
    },
  });
  [fixtureCode] = await once(fixtureChecks, "exit");
} catch (error) {
  console.error(`verify: ${error.message}`);
} finally {
  stopFixture();
  if (fixtureCode && fixtureLog) console.error(fixtureLog);
}
process.exit(checksCode || attackCode || fixtureCode || 0);

/*
 * Builds, serves and checks — one command, no server left running.
 *
 * The checks need a production build: the reveal behaviour, the deferred WebGL
 * chunk and the real bundle sizes are all different under `next dev`, so
 * checking a dev server would be checking something the visitor never gets.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";

const PORT = process.env.VERIFY_PORT ?? "4173";
const BASE = `http://127.0.0.1:${PORT}`;

const run = (command, args, options = {}) =>
  spawn(command, args, { stdio: "inherit", shell: false, ...options });

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
const build = run("npx", ["next", "build"]);
const [code] = await once(build, "exit");
if (code !== 0) process.exit(code);

console.log(`verify: serving on ${BASE}`);
const server = spawn("npx", ["next", "start", "-p", PORT], { stdio: "ignore" });

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
  env: { ...process.env, VERIFY_BASE: BASE },
});
const [checksCode] = await once(checks, "exit");

stop();
process.exit(checksCode ?? 1);

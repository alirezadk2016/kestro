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

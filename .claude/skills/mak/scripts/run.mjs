#!/usr/bin/env node
/*
 * mak run — every Mak check, one ranked list.
 *
 *   node .claude/skills/mak/scripts/run.mjs [--out <dir>] [--port 4411]
 *
 * Serves the current build on the port (building first if there is none),
 * unless something already answers there. Then runs, in order:
 *   audit.mjs   titles, descriptions, H1s, canonical, URLs     (rules 5, 8)
 *   links.mjs   internal links → docs/seo-internal-links.csv    (rule 9)
 *   graph.mjs   knowledge-graph coverage                        (rule 12)
 *   check-map.py  the keyword map against the live pages        (rules 1, 3, 4)
 *   pillar.py   rebuilds docs/seo-pillar-cluster.csv            (rule 5)
 * and prints the to-do list in Mak's order: what loses clicks or splits
 * intent first, then what misses a rule, then polish. Stops the server if it
 * started it. Exit code 1 if any check FAILs.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const port = Number(flag("--port", "4411"));
const base = `http://127.0.0.1:${port}`;
const outDir = flag("--out", "mak-run");
mkdirSync(outDir, { recursive: true });
const here = new URL(".", import.meta.url).pathname;

const up = async () => {
  try { return (await fetch(base + "/sitemap.xml")).ok; } catch { return false; }
};
let server = null;
if (!(await up())) {
  if (!existsSync(".next/BUILD_ID")) {
    console.log("mak run: no build, running npm run build …");
    const b = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
    if (b.status !== 0) process.exit(b.status ?? 1);
  }
  server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", detached: true });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 1000));
  if (!(await up())) { console.error(`mak run: nothing answers on ${base}`); process.exit(1); }
}

const run = (cmd, argv) => {
  const r = spawnSync(cmd, argv, { encoding: "utf8" });
  process.stdout.write(r.stdout ?? "");
  if (r.stderr?.trim()) process.stderr.write(r.stderr);
  return r.status ?? 1;
};
const files = {
  audit: join(outDir, "mak-audit.json"),
  links: join(outDir, "mak-links.json"),
  graph: join(outDir, "mak-graph.json"),
};
let failed = false;
try {
  failed ||= run("node", [join(here, "audit.mjs"), base, "--out", files.audit]) !== 0;
  run("node", [join(here, "links.mjs"), base, "--out", files.links, "--csv", "docs/seo-internal-links.csv"]);
  run("node", [join(here, "graph.mjs"), base, "--out", files.graph]);
  failed ||= run("python3", [join(here, "check-map.py"), "--audit", files.audit]) !== 0;
  run("python3", [join(here, "pillar.py"), "--audit", files.audit]);
} finally {
  if (server) try { process.kill(-server.pid); } catch {}
}

/* ---- the ranked list ----------------------------------------------------- */
const audit = JSON.parse(readFileSync(files.audit, "utf8"));
const { rows: links } = JSON.parse(readFileSync(files.links, "utf8"));
const graph = JSON.parse(readFileSync(files.graph, "utf8"));
const da = (p) => !p.startsWith("/en");
const list = (title, items) => {
  console.log(`\n${title} (${items.length})`);
  for (const i of items.slice(0, 15)) console.log(`  - ${i}`);
  if (items.length > 15) console.log(`  … and ${items.length - 15} more in ${outDir}/`);
};
console.log("\n================ mak run: to do, in Mak's order ================");
list("1. FAIL: breaks a rule outright", audit.filter((r) => r.fail.length).map((r) => `${r.path}: ${r.fail.join("; ")}`));
list("2. Rule 9: pages that matter with one link in, or one anchor from every page",
  links.filter((r) => da(r.path) && r.path !== "/" && (r.contentIn <= 1 || r.flags.some((f) => f.startsWith("same")))).map((r) => `${r.path}: ${r.contentIn} page(s) link in`));
list("3. Rule 5: description under 145 characters", audit.filter((r) => da(r.path) && r.desc.length < 145).map((r) => `${r.path}: ${r.desc.length} chars`));
list("4. Rule 5: primary keyword not fully in the H1", audit.filter((r) => da(r.path) && r.primary && r.kwInH1 !== "full").map((r) => `${r.path}: "${r.h1[0]}" ← ${r.primary}`));
list("5. Rule 12: knowledge-graph nodes not on the page (questions, not sentences to invent)",
  graph.filter((g) => g.missing?.length).map((g) => `${g.path}: ${g.missing.length} missing — ${g.missing.slice(0, 4).join(" · ")}${g.missing.length > 4 ? " …" : ""}`));
list("6. Rule 5: title outside 50–60 characters (still within 580 px)", audit.filter((r) => da(r.path) && (r.title.length < 50 || r.title.length > 60)).map((r) => `${r.path}: ${r.title.length} chars`));
console.log("\nThe Danish pages are listed; English mirrors them. Fix in this order, measure drafts with measure.mjs, run npm run verify, commit, push.");
process.exitCode = failed ? 1 : 0;

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

/*
 * Writes lib/page-dates.json: when each route's content last changed.
 *
 * Every page on the site now publishes a dateModified, and an answer engine
 * weighs recency — but a date is only worth having if it is true. The sitemap
 * in app/sitemap.ts already refuses to stamp `new Date()` on all 110 URLs for
 * exactly this reason: a build that changed one component would tell Google
 * the whole site had just been rewritten, and Google ignores lastmod entirely
 * once it stops being accurate.
 *
 * So the dates come from git, which is the one record of when a page's content
 * actually changed. For each route: the page file plus what it imports
 * directly, minus the site-wide furniture. The newest commit touching any of
 * them is the route's dateModified; the oldest commit touching the page file
 * itself is its datePublished.
 *
 * The subtraction is the whole trick. Walking imports transitively reached
 * Container, Header, i18n and nav from every page, so editing the navigation
 * once marked all twenty-one routes as revised that day — the same lie as
 * `new Date()`, arrived at by a longer route. What is left is the page's own
 * file and its own data: lib/guides.ts for a guide, lib/services.ts for a
 * service, components/Hero.tsx for the front page, whose words really do live
 * there.
 *
 * The result is committed rather than generated during `next build`. A CI
 * checkout is usually shallow, and a shallow clone would hand every route the
 * same date — which is the failure this exists to avoid. Run it when content
 * changes:
 *
 *   node scripts/build/page-dates.mjs
 */
const ROOT = process.cwd();
const APP = join(ROOT, "app", "[lang]");

/** `git log` for one file, ISO date, newest or oldest commit. */
function commitDate(file, which) {
  const args = ["log", which === "first" ? "--diff-filter=A" : "-1", "--format=%cI", "--", file];
  if (which === "first") args.splice(1, 0, "--reverse");
  const out = execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  const line = which === "first" ? out.split("\n")[0] : out;
  return line ? line.slice(0, 10) : null;
}

/** Resolve an import specifier to a file in this repo, or null for a package. */
function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = join(dirname(fromFile), spec);
  else return null;
  for (const ext of [".ts", ".tsx", ".mjs", ".json", "/index.ts", "/index.tsx"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  return existsSync(base) ? base : null;
}

/*
 * Site-wide furniture. Present on every page, so a change to one of these is a
 * change to the site's chrome and not to any page's content.
 */
const SHARED = [
  "components/Container", "components/Header", "components/Footer",
  "components/Breadcrumbs", "components/BreadcrumbSchema", "components/CtaSection",
  "components/Reveal", "components/ConsentBanner", "components/LanguageHint",
  "components/PageViewTracker", "components/Analytics", "components/Logo",
  "components/NotFoundPanel", "components/PageSchema", "components/SourceList",
  "lib/i18n", "lib/site", "lib/nav", "lib/company", "lib/format", "lib/routes",
  "lib/redirect", "lib/consent", "lib/db", "lib/analytics", "lib/visits",
  "lib/page-dates", "lib/sources", "lib/use-reduced-motion",
];

const isShared = (file) => {
  const rel = file.slice(ROOT.length + 1).replace(/\.(tsx?|mjs|json)$/, "");
  return SHARED.includes(rel);
};

/** The page file and what it imports directly, minus the shared furniture. */
function dependencies(entry) {
  const seen = new Set([entry]);
  const src = readFileSync(entry, "utf8");
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const file = resolveImport(m[1], entry);
    /* Only our own source counts. A bump of the react version is not an edit
       to the page's content. */
    if (file && !file.includes("node_modules") && !isShared(file)) seen.add(file);
  }
  return seen;
}

/* Route -> the page file that renders it. Dynamic segments share one file, so
   every guide gets the guide template's date unioned with lib/guides.ts —
   which is where a guide's own text lives, so that is the right answer. */
const routes = {
  "/": "page.tsx",
  "/flaadeloesninger": "flaadeloesninger/page.tsx",
  "/produkter": "produkter/page.tsx",
  "/produkter/[slug]": "produkter/[slug]/page.tsx",
  "/modeller": "modeller/page.tsx",
  "/modeller/[slug]": "modeller/[slug]/page.tsx",
  "/maskinen": "maskinen/page.tsx",
  "/kvalitet": "kvalitet/page.tsx",
  "/priser": "priser/page.tsx",
  "/tilbud-eksempel": "tilbud-eksempel/page.tsx",
  "/vejledninger": "vejledninger/page.tsx",
  "/vejledninger/[slug]": "vejledninger/[slug]/page.tsx",
  "/saelg-til-os": "saelg-til-os/page.tsx",
  "/reparation": "reparation/page.tsx",
  "/ydelser": "ydelser/page.tsx",
  "/ydelser/[slug]": "ydelser/[slug]/page.tsx",
  "/tilbud": "tilbud/page.tsx",
  "/om-os": "om-os/page.tsx",
  "/kontakt": "kontakt/page.tsx",
  "/handelsbetingelser": "handelsbetingelser/page.tsx",
  "/privatlivspolitik": "privatlivspolitik/page.tsx",
};

const out = {};
for (const [route, rel] of Object.entries(routes)) {
  const entry = join(APP, rel);
  if (!existsSync(entry)) {
    console.warn("missing page file for", route, "-", rel);
    continue;
  }
  const files = [...dependencies(entry)];
  const modified = files
    .map((f) => commitDate(f, "last"))
    .filter(Boolean)
    .sort()
    .pop();
  const published = commitDate(entry, "first");
  if (!modified) {
    console.warn("no git history for", route);
    continue;
  }
  out[route] = { published: published ?? modified, modified, files: files.length };
}

const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(
  join(ROOT, "lib", "page-dates.json"),
  JSON.stringify(sorted, null, 2) + "\n",
);
console.log(`wrote lib/page-dates.json — ${Object.keys(sorted).length} routes`);
for (const [route, d] of Object.entries(sorted)) {
  console.log(` ${route.padEnd(24)} published ${d.published}  modified ${d.modified}  (${d.files} files)`);
}

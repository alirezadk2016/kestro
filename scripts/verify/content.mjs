/*
 * The content gates, checked before anything is built.
 *
 * Every rule here is one that used to be a promise in a document: a unique
 * primary keyword, a commercial page that exists, an author who is a real
 * person in lib/company.ts, a source that is a real URL. A promise in a
 * document is kept until the day somebody is in a hurry; a check that fails
 * the build is kept every day.
 *
 * Static data only — no browser, no server, so it runs in about a second and
 * can gate the build rather than the deploy. The rendered-page checks stay in
 * checks.mjs where they belong.
 *
 * Exits non-zero on any failure.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const failures = [];
const fail = (message) => failures.push(message);

/* The data is TypeScript, so it is read as text rather than imported. That is
   deliberate: a check that needed a build step to run would not be able to
   gate the build. */
const guidesSrc = read("lib/guides.ts");
const companySrc = read("lib/company.ts");

/* The split below eats the newline before a block's first field, so the anchor
   has to allow the start of the string as well — without that, every article
   was skipped and the whole gate passed by doing nothing. */
const field = (block, name) => block.match(new RegExp(`(?:^|\\n)    ${name}: "([^"]*)"`))?.[1];

const blocks = guidesSrc
  .split(/\n  \{\n/)
  .slice(1)
  .filter((block) => block.includes("    slug: "));

if (blocks.length === 0) fail("no articles found — has the shape of lib/guides.ts changed?");

const CLUSTERS = [
  "memory-storage",
  "lifecycle",
  "workplace-hardware",
  "buying-condition",
  "uden-klynge",
];
const TYPES = ["grundviden", "beslutning", "erhvervs-it", "praktisk"];
const INTENTS = [
  "informational",
  "informational-commercial",
  "commercial-education",
  "high-commercial",
];

const teamIds = [...companySrc.matchAll(/\n    id: "([^"]+)"/g)].map((m) => m[1]);
const seenSlugs = new Set();
const seenKeywords = new Map();

/* Every internal href an article points at has to resolve to a real route.
   Routes are read off the filesystem rather than listed here, so a page that
   is renamed cannot leave a check passing against a name nobody uses. */
const routeExists = (href) => {
  const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "");
  if (clean === "" || clean === "/") return true;
  const segments = clean.slice(1).split("/");
  if (existsSync(new URL(`../../app/[lang]/${segments.join("/")}/page.tsx`, import.meta.url)))
    return true;
  /* A dynamic segment: /produkter/x is served by /produkter/[slug]. */
  const parent = segments.slice(0, -1).join("/");
  const last = segments.at(-1);
  if (
    parent &&
    existsSync(new URL(`../../app/[lang]/${parent}/[slug]/page.tsx`, import.meta.url))
  ) {
    const source = {
      produkter: "categories",
      modeller: "models",
      ydelser: "services",
      vejledninger: "guides",
    }[parent];
    if (!source) return true;
    const file = {
      categories: "lib/categories.ts",
      models: "lib/models.ts",
      services: "lib/services.ts",
      guides: "lib/guides.ts",
    }[source];
    return read(file).includes(`slug: "${last}"`);
  }
  return false;
};

for (const block of blocks) {
  const slug = field(block, "slug");
  if (!slug) continue;
  const at = `[${slug}]`;

  if (!/^[a-z0-9-]+$/.test(slug)) fail(`${at} slug is not lowercase-and-hyphens`);
  if (slug.length > 45) fail(`${at} slug is ${slug.length} characters, over the 45 limit`);
  if (seenSlugs.has(slug)) fail(`${at} duplicate slug`);
  seenSlugs.add(slug);

  const cluster = field(block, "cluster");
  if (!CLUSTERS.includes(cluster)) fail(`${at} cluster "${cluster}" is not one of the five`);

  const type = field(block, "type");
  if (!TYPES.includes(type)) fail(`${at} type "${type}" is not valid`);

  const intent = field(block, "intent");
  if (!INTENTS.includes(intent)) fail(`${at} intent "${intent}" is not valid`);

  const author = field(block, "author");
  if (!teamIds.includes(author)) fail(`${at} author "${author}" is not a person in lib/company.ts`);

  /* An empty primary keyword is allowed — it says "deliberately none", which
     step 3 decided for one guide. Two articles claiming the same one is not. */
  const keyword = field(block, "primaryKeyword");
  if (keyword === undefined) fail(`${at} has no primaryKeyword field`);
  else if (keyword !== "") {
    if (seenKeywords.has(keyword))
      fail(
        `${at} claims the primary keyword "${keyword}", already owned by [${seenKeywords.get(keyword)}]`,
      );
    seenKeywords.set(keyword, slug);
  }

  if (!block.includes("\n    tldr: {")) fail(`${at} has no tldr`);

  /* Word count on the Danish tldr: the answer, not a teaser and not an essay. */
  const tldrDa = block.match(/\n    tldr: \{\n      da:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  if (tldrDa) {
    const words = tldrDa.split(/\s+/).filter(Boolean).length;
    if (words < 25 || words > 90) fail(`${at} Danish tldr is ${words} words, outside 25-90`);
  }

  const related = block.match(/\n    related: \[([\s\S]*?)\n    \],/)?.[1] ?? "";
  const hrefs = [...related.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
  if (hrefs.length === 0) fail(`${at} has no related links`);
  for (const href of hrefs) if (!routeExists(href)) fail(`${at} related href ${href} has no route`);

  const sources = block.match(/\n    sources: \[([\s\S]*?)\n    \],/)?.[1] ?? "";
  for (const url of [...sources.matchAll(/"(https?:\/\/[^"]+)"/g)].map((m) => m[1])) {
    if (!url.startsWith("https://")) fail(`${at} source ${url} is not https`);
  }
}

/*
 * The English addresses are written twice, and they have to agree.
 *
 * lib/routes.ts is what localePath renders, so it decides what every link,
 * canonical, hreflang entry and sitemap <loc> says. next.config.mjs is what
 * rewrites that address onto the Danish route folder and 301s the old one.
 * Nothing at runtime notices when they disagree — the site simply links to an
 * address that answers 404, on every page at once, in the half of the site we
 * look at least. So they are compared here instead of trusted.
 */
const routesTs = read("lib/routes.ts");
const configMjs = read("next.config.mjs");

const pairsIn = (source, start) => {
  const body = source.slice(source.indexOf(start));
  const end = body.indexOf(body.trimStart().startsWith("export const") ? "};" : "];");
  return new Map(
    [...body.slice(0, end).matchAll(/"(\/[a-z-]+)":?\s*,?\s*"(\/[a-z-]+)"/g)].map((m) => [
      m[1],
      m[2],
    ]),
  );
};

const fromRoutes = pairsIn(routesTs, "export const englishPath");
const fromConfig = pairsIn(configMjs, "const englishRoutes");

if (fromRoutes.size === 0) fail("lib/routes.ts: could not read englishPath");
if (fromConfig.size === 0) fail("next.config.mjs: could not read englishRoutes");
if (fromRoutes.size !== fromConfig.size)
  fail(`englishPath has ${fromRoutes.size} routes, englishRoutes has ${fromConfig.size}`);

for (const [da, en] of fromRoutes) {
  if (!fromConfig.has(da)) fail(`${da} -> ${en} is in lib/routes.ts but not in next.config.mjs`);
  else if (fromConfig.get(da) !== en)
    fail(`${da} maps to ${en} in lib/routes.ts but ${fromConfig.get(da)} in next.config.mjs`);
}
for (const da of fromConfig.keys()) {
  if (!fromRoutes.has(da)) fail(`${da} is in next.config.mjs but not in lib/routes.ts`);
}

console.log(
  `content: ${blocks.length} articles, ${seenKeywords.size} primary keywords, ` +
    `${fromRoutes.size} english routes, ${failures.length} failures`,
);
for (const message of failures) console.error("  " + message);
process.exit(failures.length === 0 ? 0 : 1);

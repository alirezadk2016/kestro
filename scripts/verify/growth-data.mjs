/*
 * Pure growth-data checks. TypeScript is executed directly without a build,
 * server, credentials or network. All traffic and search labels are synthetic.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const modules = new Map();
const plain = (value) => JSON.parse(JSON.stringify(value));

function loadTypeScript(relative, overrides = null) {
  if (!overrides && modules.has(relative)) return modules.get(relative);
  const source = readFileSync(join(root, relative), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    require: (name) => {
      if (overrides?.imports && name in overrides.imports) return overrides.imports[name];
      if (name.startsWith("@/")) return loadTypeScript(name.slice(2) + ".ts");
      if (name.startsWith(".")) {
        const path = join(dirname(relative), name).replace(/\\/g, "/");
        return loadTypeScript(/\.tsx?$/.test(path) ? path : path + ".ts");
      }
      if (name === "node:crypto") return require(name);
      throw new Error(`Pure check rejected an unexpected dependency: ${name}`);
    },
    Date,
    Intl,
    Map,
    Set,
    URL,
    URLSearchParams,
    TextEncoder,
    ...(overrides?.globals ?? {}),
  });
  new vm.Script(compiled, { filename: relative }).runInContext(context);
  if (!overrides) modules.set(relative, module.exports);
  return module.exports;
}

export function verifyGrowthData() {
  const visit = loadTypeScript("lib/visits.ts");
  const campaign = loadTypeScript("lib/campaign-links.ts");
  const csv = loadTypeScript("lib/admin-csv.ts");
  const search = loadTypeScript("lib/search-console.ts");
  let checked = 0;
  const check = (name, fn) => {
    try {
      fn();
      checked++;
    } catch (error) {
      throw new Error(`growth data: ${name}: ${error.message}`, { cause: error });
    }
  };
  const attribution = (tags = {}, referrer = null) =>
    visit.resolveAttribution(tags, referrer, "www.kestro.dk");

  check("canonical campaign source and declared paid evidence", () => {
    const result = attribution({
      source: "IG",
      medium: "paid-social",
      campaign: "repair_2026",
      content: "story",
    });
    assert.equal(result.source, "Instagram");
    assert.equal(result.channel, "paid");
    assert.equal(result.method, "utm");
    assert.equal(result.campaign, "repair_2026");
    assert.equal(attribution({ source: "GOOGLE" }).channel, "search");
    assert.equal(attribution({ source: "GOOGLE" }).medium, null);
  });
  check("referrer source does not invent medium, campaign or app placement", () => {
    const result = attribution({}, "https://l.instagram.com/?u=unrelated");
    assert.equal(result.source, "Instagram");
    assert.equal(result.method, "referrer");
    assert.equal(result.referrerHost, "l.instagram.com");
    assert.equal(result.medium, null);
    assert.equal(result.content, null);
    assert.equal(result.campaign, null);
    assert.equal(attribution({ source: "newsletter", medium: "email" }).channel, "email");
  });
  check("source tags take precedence without rewriting referrer evidence", () => {
    const result = attribution({ source: "instagram", medium: "social" }, "https://www.google.dk/");
    assert.equal(result.source, "Instagram");
    assert.equal(result.referrerHost, "google.dk");
    assert.equal(result.method, "utm");
    assert.equal(
      attribution({ campaign: "label_only" }, "https://www.google.dk/").method,
      "referrer",
    );
  });
  check("missing, invalid and internal referrers remain direct or unknown", () => {
    for (const referrer of [
      null,
      "",
      "not a URL",
      "javascript:alert(1)",
      "https://www.kestro.dk/kontakt",
      "https://kestro.dk/",
    ]) {
      const result = attribution({}, referrer);
      assert.equal(result.source, "Direkte / ukendt");
      assert.equal(result.method, "unknown");
      assert.equal(result.referrerHost, null);
    }
  });
  check("lookalike search and social domains keep their actual hostname", () => {
    for (const host of [
      "google.example.invalid",
      "evilgoogle.com",
      "google.com.example.invalid",
      "instagram.com.example.invalid",
      "bing.com.example.invalid",
    ]) {
      const result = attribution({}, `https://${host}/`);
      assert.equal(result.source, host);
      assert.equal(result.channel, "referral");
    }
    assert.equal(attribution({}, "https://www.google.co.uk/").source, "Google");
    assert.equal(attribution({}, "https://www.google.dk/").source, "Google");
  });
  check("campaign fields independently reject non-text and bound labels", () => {
    const result = attribution({
      source: [],
      medium: { value: "cpc" },
      campaign: "x".repeat(120),
      content: "  two   words_1  ",
      term: "memory upgrade",
    });
    assert.equal(result.method, "unknown");
    assert.equal(result.medium, null);
    assert.equal(result.campaign.length, 80);
    assert.equal(result.content, "two words_1");
    assert.equal(result.term, "memory upgrade");
    const tags = visit.readCampaignTags(
      "?utm_source=ig&utm_campaign=repair&q=private-search&email=private%40example.invalid",
    );
    assert.ok(!JSON.stringify(tags).includes("private"));
    assert.deepEqual(Object.keys(tags).sort(), ["campaign", "content", "medium", "source", "term"]);
  });
  check("tracker payload excludes arbitrary URL parameters and full referring URL", () => {
    const effects = [];
    const calls = [];
    const tracker = loadTypeScript("components/PageViewTracker.tsx", {
      imports: {
        react: { useEffect: (fn) => effects.push(fn), useRef: (value) => ({ current: value }) },
        "next/navigation": { usePathname: () => "/reparation" },
      },
      globals: {
        window: {
          location: {
            search:
              "?utm_source=instagram&utm_medium=social&utm_campaign=repair&utm_content=bio&q=PRIVATE_SEARCH&email=PRIVATE_EMAIL",
          },
          setInterval: () => 1,
          clearInterval: () => {},
        },
        document: {
          referrer: "https://www.google.dk/search?q=PRIVATE_REFERRER",
          visibilityState: "visible",
          addEventListener: () => {},
          removeEventListener: () => {},
        },
        fetch: (url, options) => {
          calls.push({ url, body: JSON.parse(options.body) });
          return Promise.resolve();
        },
      },
    });
    tracker.default();
    effects.forEach((fn) => fn());
    assert.equal(calls[0].url, "/api/track");
    assert.equal(calls[0].body.referrer, "https://www.google.dk");
    assert.equal(calls[0].body.attribution.content, "bio");
    assert.deepEqual(Object.keys(calls[0].body).sort(), ["attribution", "path", "referrer"]);
    assert.ok(!JSON.stringify(calls).includes("PRIVATE"));
  });
  check("visitor hash stays deterministic for one salt and changes with daily salt", () => {
    assert.equal(
      visit.visitorId("192.0.2.1", "synthetic browser", "salt-one"),
      visit.visitorId("192.0.2.1", "synthetic browser", "salt-one"),
    );
    assert.notEqual(
      visit.visitorId("192.0.2.1", "synthetic browser", "salt-one"),
      visit.visitorId("192.0.2.1", "synthetic browser", "salt-two"),
    );
  });

  const linkInput = {
    destination: "/reparation",
    source: "instagram",
    medium: "social",
    campaign: "repair_launch",
    content: "bio",
    term: "",
  };
  check(
    "campaign builder creates own HTTPS destination and replaces arbitrary old parameters",
    () => {
      const result = campaign.buildCampaignLink({
        ...linkInput,
        destination: "https://kestro.dk/reparation/?email=private&old=1#ram",
      });
      assert.equal(result.error, null);
      const url = new URL(result.url);
      assert.equal(url.origin, "https://www.kestro.dk");
      assert.equal(url.pathname, "/reparation");
      assert.equal(url.hash, "#ram");
      assert.equal(url.searchParams.get("utm_content"), "bio");
      assert.equal(url.searchParams.get("email"), null);
      assert.equal(url.searchParams.get("old"), null);
      assert.equal(attribution(visit.readCampaignTags(url.search)).source, "Instagram");
    },
  );
  check(
    "campaign destinations reject outside sites, protocols, credentials, files and private paths",
    () => {
      for (const destination of [
        "//evil.example/",
        "https://www.kestro.dk.evil.example/",
        "http://www.kestro.dk/",
        "javascript:alert(1)",
        "https://user:password@www.kestro.dk/",
        "https://www.kestro.dk:444/",
        "/admin",
        "/api/track",
        "/hero/scene.webp",
        "/made-up-page",
      ]) {
        assert.ok(campaign.buildCampaignLink({ ...linkInput, destination }).error, destination);
      }
      assert.equal(campaign.buildCampaignLink({ ...linkInput, destination: "/en" }).error, null);
      assert.equal(
        campaign.buildCampaignLink({ ...linkInput, destination: "/en/repairs" }).error,
        null,
      );
    },
  );
  check(
    "campaign builder rejects overlong and invalid labels rather than silently truncating",
    () => {
      for (const [name, max] of [
        ["source", 40],
        ["medium", 40],
        ["campaign", 80],
        ["content", 80],
        ["term", 80],
      ]) {
        assert.ok(campaign.buildCampaignLink({ ...linkInput, [name]: "x".repeat(max + 1) }).error);
        assert.equal(
          campaign.buildCampaignLink({ ...linkInput, [name]: "x".repeat(max) }).error,
          null,
        );
      }
      assert.ok(campaign.buildCampaignLink({ ...linkInput, campaign: "=formula" }).error);
      assert.ok(campaign.buildCampaignLink({ ...linkInput, campaign: "" }).error);
    },
  );
  check(
    "CSV neutralizes spreadsheet formulas including leading whitespace and quotes every field",
    () => {
      for (const value of [
        '=HYPERLINK("https://evil.invalid")',
        "+SUM(1,2)",
        "@SUM(1)",
        "-1+2",
        " \t=1+1",
        "\r=1+1",
        "\uFEFF=1+1",
      ]) {
        assert.ok(csv.csvCell(value).startsWith("\"'"), value);
      }
      assert.equal(csv.csvCell('say "hello", again'), '"say ""hello"", again"');
      assert.equal(csv.csvCell(null), '""');
      assert.equal(csv.csvCell(12), '"12"');
      const rows = csv.csvRows([
        ["source", "visits"],
        ["Google", 12],
      ]);
      assert.ok(rows.startsWith("\uFEFF"));
      assert.ok(rows.endsWith("\r\n"));
    },
  );

  const sample = () => ({
    schemaVersion: 1,
    property: "sc-domain:kestro.dk",
    dateFrom: "2020-01-01",
    dateTo: "2020-01-07",
    timezone: "America/Los_Angeles",
    searchType: "web",
    generatedAt: "2020-01-08T12:00:00Z",
    source: "google_search_console",
    partial: false,
    totals: { clicks: 10, impressions: 100, position: 8 },
    daily: [{ date: "2020-01-01", clicks: 10, impressions: 100, position: 8 }],
    queries: [{ query: "synthetic repair", clicks: 3, impressions: 60, position: 9 }],
    pages: [
      { page: "https://www.kestro.dk/reparation", clicks: 10, impressions: 100, position: 8 },
    ],
  });
  const options = { dateFrom: "2020-01-01", dateTo: "2020-01-07", searchType: "web" };
  check("Search Console keeps global totals separate from privacy-limited query rows", () => {
    const result = search.validateSearchConsoleReport(sample());
    assert.equal(result.totals.clicks, 10);
    assert.equal(
      result.queries.reduce((sum, row) => sum + row.clicks, 0),
      3,
    );
    assert.equal(result.timezone, "America/Los_Angeles");
    assert.deepEqual(plain(result), { ...sample(), generatedAt: "2020-01-08T12:00:00.000Z" });
    assert.equal(search.searchCtr({ clicks: 3, impressions: 60, position: null }), 5);
    assert.equal(search.searchCtr({ clicks: 0, impressions: 0, position: null }), null);
  });
  check("Search Console JSON rejects other domains, extra dimensions and invalid metrics", () => {
    for (const replacement of [
      { property: "sc-domain:other.invalid" },
      { timezone: "UTC" },
      { searchType: "unknown" },
      { source: "invented_provider" },
      { customer: "unwanted field" },
      { totals: { clicks: -1, impressions: 10, position: 2 } },
      { totals: { clicks: 0.5, impressions: 10, position: 2 } },
      { totals: { clicks: 1, impressions: 10, position: Infinity } },
      { queries: [{ query: "synthetic", clicks: 1, impressions: 10, position: 3, country: "DK" }] },
    ])
      assert.throws(() => search.validateSearchConsoleReport({ ...sample(), ...replacement }));
    assert.equal(
      search.validateSearchConsoleReport({
        ...sample(),
        totals: { clicks: 0, impressions: 0, position: 0 },
      }).totals.position,
      null,
    );
  });
  check("Search Console rejects duplicate rows rather than adding their counts", () => {
    const original = sample();
    for (const group of ["queries", "pages", "daily"]) {
      assert.throws(() =>
        search.validateSearchConsoleReport({
          ...original,
          [group]: [original[group][0], original[group][0]],
        }),
      );
    }
    assert.throws(() =>
      search.validateSearchConsoleReport({
        ...original,
        queries: Array.from({ length: 5001 }, (_, i) => ({
          query: `synthetic-${i}`,
          clicks: 0,
          impressions: 0,
          position: null,
        })),
        daily: [],
        pages: [],
      }),
    );
  });
  check(
    "Search Console dates follow Pacific boundaries and reject impossible or out-of-range periods",
    () => {
      assert.equal(search.pacificToday(new Date("2020-01-02T02:00:00Z")), "2020-01-01");
      assert.equal(search.pacificToday(new Date("2020-07-02T07:30:00Z")), "2020-07-02");
      assert.equal(search.searchDateValid("2020-02-29"), true);
      assert.equal(search.searchDateValid("2021-02-29"), false);
      for (const [from, to] of [
        ["2020-01-07", "2020-01-01"],
        ["2014-01-01", "2014-01-07"],
        ["2020-01-01", "2022-01-01"],
        ["3000-01-01", "3000-01-02"],
      ]) {
        assert.throws(() => search.searchDateRange(from, to));
      }
      assert.throws(() =>
        search.validateSearchConsoleReport({
          ...sample(),
          daily: [{ date: "2020-02-01", clicks: 1, impressions: 2, position: 3 }],
        }),
      );
    },
  );
  check("Search Console accepts only own public HTTPS report links", () => {
    assert.equal(
      search.ownSearchPage("https://www.kestro.dk/reparation"),
      "https://www.kestro.dk/reparation",
    );
    for (const page of [
      "https://evil.invalid/",
      "https://www.kestro.dk.evil.invalid/",
      "http://www.kestro.dk/",
      "https://user:pass@www.kestro.dk/",
      "https://www.kestro.dk/admin",
      "https://www.kestro.dk/api/track",
      "https://www.kestro.dk:444/",
      "https://www.kestro.dk/reparation#ram",
    ]) {
      assert.throws(() => search.ownSearchPage(page));
    }
  });
  check("official English CSV preserves quoted query and import coverage", () => {
    const result = search.parseSearchConsoleImport(
      'Top queries,Clicks,Impressions,CTR,Position\r\n"synthetic, \"\"repair\"\"",3,60,5%,9.2\r\n',
      options,
    );
    assert.equal(result.queries[0].query, 'synthetic, "repair"');
    assert.equal(result.queries[0].position, 9.2);
    assert.equal(result.totals, null);
    assert.equal(result.partial, true);
    assert.equal(result.source, "csv_import");
  });
  check(
    "official Danish and tab-separated CSV handle decimal positions and zero missing position",
    () => {
      const danish = search.parseSearchConsoleImport(
        'Forespørgsler;Klik;Visninger;Klikrate;Position\nsyntetisk reparation;2;50;4%;"8,5"\n',
        options,
      );
      assert.equal(danish.queries[0].position, 8.5);
      const pages = search.parseSearchConsoleImport(
        "Top pages\tClicks\tImpressions\tCTR\tPosition\nhttps://www.kestro.dk/reparation\t0\t0\t0%\t0\n",
        options,
      );
      assert.equal(pages.pages[0].position, null);
      const dates = search.parseSearchConsoleImport(
        "Date,Clicks,Impressions,Position\n2020-01-01,2,50,8\n",
        options,
      );
      assert.equal(dates.daily[0].date, "2020-01-01");
    },
  );
  check(
    "CSV imports reject malformed files, extra dimensions, duplicates and oversized inputs",
    () => {
      for (const raw of [
        "",
        "Top queries,Clicks,Impressions,Position",
        'Top queries,Clicks,Impressions,Position\n"unfinished,1,10,2',
        "Top queries,Country,Clicks,Impressions,Position\nsynthetic,DK,1,10,2",
        "Top queries,Clicks,Impressions,Position\nsynthetic,1,10,2\nsynthetic,1,10,2",
        "Top queries,Clicks,Impressions,Position\nsynthetic,1,10,2,extra",
        "Top queries,Clicks,Impressions,Position\nsynthetic,NaN,10,2",
        "x".repeat(2 * 1024 * 1024 + 1),
      ]) {
        assert.throws(() => search.parseSearchConsoleImport(raw, options));
      }
    },
  );
  check("review suggestions remain evidence-linked editorial prompts", () => {
    const report = sample();
    report.queries[0] = {
      query: "synthetic opportunity",
      clicks: 1,
      impressions: 100,
      position: 10,
    };
    const small = search.searchReviewSuggestions(search.validateSearchConsoleReport(report));
    assert.ok(
      !small.some((row) => row.query === "synthetic opportunity"),
      "a small impression sample must not trigger a CTR action under Mak",
    );
    report.queries[0].impressions = 200;
    const suggestions = search.searchReviewSuggestions(search.validateSearchConsoleReport(report));
    assert.ok(suggestions.some((row) => row.query === "synthetic opportunity"));
    assert.ok(suggestions.some((row) => row.page === "https://www.kestro.dk/reparation"));
    assert.ok(suggestions.every((row) => !row.customer && !row.visitor));
  });
  return checked;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`growth data: ${verifyGrowthData()} checks passed`);
}

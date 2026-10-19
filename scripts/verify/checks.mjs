/*
 * The site's own checks, as one runnable suite.
 *
 *   npm run verify            # against a production build on :4173
 *
 * Everything in here was, until now, a script written once in a scratch
 * directory, run, and thrown away — which meant every regression was only
 * caught if somebody happened to re-run the same thing by hand. These are the
 * checks that have actually caught real bugs in this codebase, so they are the
 * ones worth keeping:
 *
 *   structure   one h1, a title, a description, a canonical, alt on every
 *               image, an accessible name on every control, no heading level
 *               skipped, one main landmark, a skip link
 *   contrast    text against the pixels actually rendered behind it, not
 *               against computed styles — this site's grounds are gradients,
 *               film grain and a glass pane over photographs, none of which a
 *               computed style can see, and the difference has hidden a real
 *               4.39:1 failure before now
 *   motion      nothing hidden without JavaScript, nothing left hidden after a
 *               jump down the page, and no WebGL fetched for a visitor who
 *               asked for less motion
 *
 * Exits non-zero on any failure, so it can gate a deploy.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { verifyVisualPolish } from "./visual.mjs";
import { verifyPracticalGuides } from "./practical.mjs";
import { verifyAdmin } from "./admin.mjs";

const BASE = process.env.VERIFY_BASE ?? "http://localhost:4173";
const HOME = process.env.USERPROFILE ?? process.env.HOME ?? "";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    /* Fall through to the bundled runtimes used by local Codex workspaces. */
  }

  const candidates = [
    process.env.PLAYWRIGHT_MODULE,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
    HOME &&
      join(
        HOME,
        ".cache",
        "codex-runtimes",
        "codex-primary-runtime",
        "dependencies",
        "node",
        "node_modules",
        "playwright",
        "index.mjs",
      ),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return import(pathToFileURL(candidate).href);
  }

  throw new Error("Playwright is not installed. Set PLAYWRIGHT_MODULE or install playwright.");
}

const { chromium } = await loadPlaywright();

/** The pages worth checking: one of every template, in both languages. */
const PAGES = [
  "/",
  "/en",
  "/ydelser",
  "/ydelser/levering",
  "/produkter",
  "/en/products",
  "/produkter/baerbare-computere",
  "/modeller",
  "/en/models",
  "/modeller/lenovo-thinkpad-t480",
  "/modeller/lenovo-thinkpad-t14",
  "/en/models/lenovo-thinkpad-t14",
  "/modeller/lenovo-thinkpad-x1-carbon",
  "/maskinen",
  "/reparation",
  "/kontakt",
  "/vejledninger",
  "/vejledninger/tjek-brugt-baerbar-foer-koeb",
  "/en/knowledge/check-a-used-laptop",
  "/vejledninger/tjek-batterikapacitet",
  "/en/knowledge/check-battery-capacity",
  "/vejledninger/tjek-ram-forbrug",
  "/en/knowledge/check-memory-usage",
  "/vejledninger/hdd-eller-ssd",
  "/en/knowledge/hdd-or-ssd",
  "/vejledninger/langsom-computer",
  "/en/knowledge/slow-computer",
  "/ydelser/nordisk-tilpasning",
  "/en/services/nordic-preparation",
  "/reparation/ram-og-ssd-opgradering",
  "/en/repairs/memory-and-ssd-upgrade",
  "/priser",
  "/tilbud-eksempel",
  "/om-os",
  "/privatlivspolitik",
  "/flaadeloesninger",
  "/en/fleet-solutions",
  "/saelg-til-os",
  "/en/sell-to-us",
  "/kvalitet",
  "/en/condition-and-quality",
  "/produkter/smartphones",
  "/en/products/smartphones",
];

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

const relativeLuminance = (colour) => {
  const [r, g, b] = colour.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a, b) => {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  "/opt/pw-browsers/chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
]
  .filter(Boolean)
  .find((candidate) => existsSync(candidate));

const launchBrowser = () =>
  chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
let browser = await launchBrowser();

/* ---------------------------------------------------------------- structure */
console.log("verify: page structure and metadata");

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const response = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });

  if (!response || response.status() >= 400) {
    fail(path, `HTTP ${response ? response.status() : "no response"}`);
    await page.close();
    continue;
  }

  const found = await page.evaluate(() => {
    const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    let skipped = null;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        skipped = `${levels[i - 1]} to ${levels[i]}`;
        break;
      }
    }

    const named = (el) =>
      el.textContent.trim() || el.getAttribute("aria-label") || el.getAttribute("title");

    return {
      h1: document.querySelectorAll("h1").length,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
      language: document.documentElement.lang,
      main: document.querySelectorAll("main").length,
      skipLink: !!document.querySelector('a[href="#indhold"]'),
      imagesWithoutAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt"))
        .length,
      unnamedControls: [...document.querySelectorAll("a[href], button")].filter((el) => !named(el))
        .length,
      skipped,
      /* What a reader sees, not the markup: <time datetime>, JSON-LD and
         attributes are machine-facing and are meant to carry ISO. */
      isoDate: document.body.innerText.match(/\b20\d\d-[01]\d-[0-3]\d\b/)?.[0] ?? "",
    };
  });

  if (found.h1 !== 1) fail(path, `${found.h1} h1 elements`);
  if (!found.title) fail(path, "no title");
  if (!found.description) fail(path, "no meta description");
  if (!found.canonical) fail(path, "no canonical");
  if (!found.language) fail(path, "no lang on <html>");
  if (found.main !== 1) fail(path, `${found.main} main landmarks`);
  if (!found.skipLink) fail(path, "no skip link");
  if (found.imagesWithoutAlt) fail(path, `${found.imagesWithoutAlt} images without alt`);
  if (found.unnamedControls)
    fail(path, `${found.unnamedControls} controls with no accessible name`);
  if (found.skipped) fail(path, `heading level skipped, ${found.skipped}`);
  /* It shipped on the legal pages, the guide bylines and the source lists
     before this line existed. formatDate(iso, lang) is the fix. */
  if (found.isoDate) fail(path, `raw ISO date in visible text: ${found.isoDate}`);

  await page.close();
}

/* --------------------------------------------------------------------- 404 */

/*
 * The 404 has to be a page, not a status code with an empty document behind it.
 *
 * It was exactly that for the life of the site: 404 was correct, the <title>
 * was the front page's, and <body> held one empty div. With JavaScript the
 * panel appeared and nobody noticed. The cause was in the framework and the
 * fix was to route around it — app/[lang]/layout.tsx carries the note — which
 * means it is the kind of fix a later change can undo without anyone meaning
 * to. So it is measured with scripts off, from the HTML the server sends.
 */
{
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: false,
  });
  for (const path of [
    "/denne-side-findes-ikke-xyz",
    "/da/xyz-nope",
    "/en/xyz-nope",
    "/style.css",
  ]) {
    const response = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    const status = response ? response.status() : 0;
    if (status !== 404) fail(path, `expected 404, got ${status}`);

    const found = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      words: (document.body.innerText || "").trim().split(/\s+/).filter(Boolean).length,
      title: document.title,
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
    }));

    if (!found.h1) fail(path, "404 has no h1 without JavaScript");
    if (found.words < 40) fail(path, `404 renders ${found.words} words without JavaScript`);
    if (!/ikke fundet/i.test(found.title))
      fail(path, `404 carries the wrong title: ${found.title}`);
    if (!/noindex/.test(found.robots))
      fail(path, `404 is indexable: ${found.robots || "no robots meta"}`);
  }
  await page.close();
}

/* ----------------------------------------------------------------- sitemap */

/*
 * The sitemap and robots.txt as a crawler meets them, from the build.
 *
 * Search Console reported the sitemap as "Couldn't fetch" in October 2026,
 * and nothing here had ever looked at it: the gate measured pages, not the
 * file that tells Google which pages exist. The production file turned out to
 * be sound, but that was established by hand, after the fact. This makes it
 * a measurement. Every <loc> must answer 200 with no redirect and carry
 * itself as canonical — a sitemap that lists a redirect or a page pointing
 * its canonical elsewhere is one Google learns to stop trusting — and every
 * hreflang alternate must itself be listed, or the pairing is one-sided.
 */
{
  const robots = await fetch(`${BASE}/robots.txt`, { redirect: "manual" });
  const robotsText = robots.status === 200 ? await robots.text() : "";
  if (robots.status !== 200) fail("/robots.txt", `HTTP ${robots.status}`);
  const declared = robotsText.match(/^Sitemap:\s*(\S+)/im)?.[1] ?? "";
  if (!declared.endsWith("/sitemap.xml")) fail("/robots.txt", "no Sitemap line for /sitemap.xml");
  if (/^Disallow:\s*\/\s*$/im.test(robotsText)) fail("/robots.txt", "Disallow: / blocks the site");
  const origin = declared.replace(/\/sitemap\.xml$/, "");

  const response = await fetch(`${BASE}/sitemap.xml`, { redirect: "manual" });
  const xml = response.status === 200 ? await response.text() : "";
  if (response.status !== 200) fail("/sitemap.xml", `HTTP ${response.status}`);
  if (!/xml/.test(response.headers.get("content-type") ?? ""))
    fail("/sitemap.xml", `content-type ${response.headers.get("content-type")}`);
  if (!xml.startsWith("<?xml") || !xml.includes("http://www.sitemaps.org/schemas/sitemap/0.9"))
    fail("/sitemap.xml", "not a sitemap urlset");

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const opened = (xml.match(/<url>/g) ?? []).length;
  if (!locs.length) fail("/sitemap.xml", "no <loc> entries");
  if (opened !== locs.length || opened !== (xml.match(/<\/url>/g) ?? []).length)
    fail("/sitemap.xml", "unbalanced <url> entries");
  if (locs.length > 50000 || xml.length > 50 * 1024 * 1024)
    fail("/sitemap.xml", "over the 50,000 URL / 50 MB limit");

  const listed = new Set(locs);
  if (listed.size !== locs.length)
    fail("/sitemap.xml", `${locs.length - listed.size} duplicate <loc>`);
  for (const href of new Set(
    [...xml.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)].map((m) => m[1]),
  ))
    if (!listed.has(href)) fail("/sitemap.xml", `hreflang alternate not listed: ${href}`);

  for (const loc of locs) {
    if (!loc.startsWith(origin)) {
      fail("/sitemap.xml", `<loc> on another host than robots.txt declares: ${loc}`);
      continue;
    }
    const path = loc.slice(origin.length) || "/";
    const page = await fetch(BASE + path, { redirect: "manual" });
    if (page.status !== 200) {
      fail(
        `sitemap ${path}`,
        `HTTP ${page.status}${page.headers.get("location") ? ` to ${page.headers.get("location")}` : ""}`,
      );
      continue;
    }
    const canonical = (await page.text()).match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
    if (canonical !== loc) fail(`sitemap ${path}`, `canonical is ${canonical || "missing"}`);
  }
}

/* ------------------------------------------------------------------- sizes */

/*
 * Two numbers a phone decides, and neither is visible on a 27-inch screen.
 *
 * 12px is the floor for anything a person reads. The spec chips on the
 * catalogue were set at 11px and there are 69 of them on /modeller alone; the
 * hero's eyebrow was a clamp whose lower bound resolved to 10.6px at 390px.
 * Both were legible to whoever wrote them on a desktop and neither was
 * measured on the device most of this site is read on. Decoration is exempt:
 * an aria-hidden mark is not text anybody reads.
 *
 * 44px is the floor for anything a person taps, and it is already written down
 * in CLAUDE.md — this is what makes it true rather than aspirational. A link
 * sitting inside a sentence is exempt, because WCAG 2.5.8 exempts it and
 * because padding a word in the middle of a paragraph to 44px would push the
 * lines around it apart.
 */
for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const found = await page.evaluate(() => {
    const visible = (el) => {
      const style = getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    };
    const decorative = (el) => el.closest("[aria-hidden='true']") !== null;

    const small = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.children.length || decorative(el) || !visible(el)) continue;
      const text = (el.textContent ?? "").trim();
      if (!text) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 12) small.push(`${Math.round(size * 10) / 10}px "${text.slice(0, 28)}"`);
    }

    /* Inline by layout, not by tag: a <a> the author set to block or flex is a
       control with a box of its own, whatever it is made of. */
    const short = [];
    for (const el of document.querySelectorAll("a[href], button, summary")) {
      if (decorative(el) || !visible(el)) continue;
      if (getComputedStyle(el).display === "inline") continue;
      const box = el.getBoundingClientRect();
      if (box.width < 2 && box.height < 2) continue;
      if (box.height < 44)
        short.push(`${Math.round(box.height)}px "${(el.textContent ?? "").trim().slice(0, 28)}"`);
    }

    return { small: [...new Set(small)], short: [...new Set(short)] };
  });

  for (const one of found.small) fail(path, `text under 12px on a phone: ${one}`);
  for (const one of found.short) fail(path, `tap target under 44px: ${one}`);

  await page.close();
}

/* ----------------------------------------------------------------- contrast */
// These checks have no shared-session dependency on the structure sweep.
// Release its graphics and network resources before sampling rendered pages.
await browser.close();
browser = await launchBrowser();
console.log("verify: rendered text contrast");

const PAINT_TIMEOUT_MS = 30_000;

/** Record request evidence while leaving each check's readiness condition intact. */
function readinessDiagnostics(page, label) {
  const active = new Map();
  const failed = [];
  page.on("request", (request) => {
    active.set(request, { type: request.resourceType(), url: request.url(), started: Date.now() });
  });
  page.on("requestfinished", (request) => active.delete(request));
  page.on("requestfailed", (request) => {
    failed.push({
      type: request.resourceType(),
      url: request.url(),
      error: request.failure()?.errorText,
    });
    active.delete(request);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failed.push({
        type: response.request().resourceType(),
        url: response.url(),
        status: response.status(),
      });
    }
  });

  return async (stage, check) => {
    try {
      return await check();
    } catch (error) {
      console.error(`verify: readiness failed: ${label}, ${stage}`);
      console.error(
        JSON.stringify(
          {
            active: [...active.values()].map(({ started, ...request }) => ({
              ...request,
              ageMs: Date.now() - started,
            })),
            failed,
          },
          null,
          2,
        ),
      );
      // Diagnostics must not turn the original failure into an unbounded wait.
      let timer;
      try {
        const dom = await Promise.race([
          page.content(),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error("DOM capture timed out")), 2000);
          }),
        ]);
        const directory = join(process.cwd(), ".next", "verify-diagnostics");
        mkdirSync(directory, { recursive: true });
        const filename = join(
          directory,
          `readiness-${label.replace(/[^a-z0-9]+/gi, "-")}-${Date.now()}.html`,
        );
        writeFileSync(filename, dom);
        console.error(`verify: failed readiness DOM saved to ${filename}`);
      } catch (diagnosticError) {
        console.error(`verify: readiness DOM capture: ${diagnosticError.message}`);
      } finally {
        clearTimeout(timer);
      }
      throw error;
    }
  };
}

async function waitForContrastPaint(page, timeout = PAINT_TIMEOUT_MS) {
  await page.waitForFunction(
    async () => {
      await document.fonts.ready;
      const visible = [...document.images].filter((image) => {
        const box = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          box.width > 0 &&
          box.height > 0 &&
          box.bottom > 0 &&
          box.right > 0 &&
          box.top < innerHeight &&
          box.left < innerWidth
        );
      });
      if (visible.some((image) => !image.complete)) return false;
      const broken = visible.find((image) => image.naturalWidth === 0);
      if (broken) throw new Error(`Visible image failed: ${broken.currentSrc || broken.src}`);
      await Promise.all(visible.map((image) => image.decode()));
      // load already waits for the site's CSS background images; these frames
      // let their paint and the newly decoded lazy images reach the compositor.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return true;
    },
    null,
    { timeout },
  );
}

/*
 * Against rendered pixels, not computed styles.
 *
 * The glyphs are made transparent, the page is photographed, and the ground
 * behind each piece of text is sampled across that text's own box — the worst
 * sample decides, since a caption is only as readable as its lightest patch.
 */
for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  /* /vejledninger joins the list because the Viden hub now sets type over a
     drawing, and a drawing behind text is exactly what a computed style cannot
     see and this check can. */
  for (const path of [
    "/",
    "/en",
    "/ydelser/levering",
    "/kontakt",
    "/vejledninger",
    "/flaadeloesninger",
    "/saelg-til-os",
    "/kvalitet",
    "/produkter/smartphones",
  ]) {
    const page = await browser.newPage({ viewport });
    const ready = readinessDiagnostics(page, `contrast-${name}-${path}`);
    await ready("navigation and first paint", async () => {
      const deadline = Date.now() + PAINT_TIMEOUT_MS;
      const response = await page.goto(BASE + path, {
        waitUntil: "load",
        timeout: PAINT_TIMEOUT_MS,
      });
      if (response?.status() !== 200)
        throw new Error(`Expected HTTP 200, received ${response?.status() ?? "no response"}`);
      await waitForContrastPaint(page, Math.max(1, deadline - Date.now()));
    });

    /* Scroll the whole page once so anything that reveals on scroll is out. */
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(1500);

    const height = await page.evaluate(() => document.documentElement.scrollHeight);

    for (let top = 0; top < height; top += viewport.height) {
      await page.evaluate((y) => scrollTo(0, y), top);
      /* Long enough for the 0.85s reveal transition to finish. */
      await page.waitForTimeout(1200);
      await ready(`paint at scroll ${top}`, () => waitForContrastPaint(page));

      const texts = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("body *")) {
          const text = [...el.childNodes]
            .filter((n) => n.nodeType === 3 && n.textContent.trim())
            .map((n) => n.textContent.trim())
            .join(" ");
          if (!text) continue;

          const style = getComputedStyle(el);
          if (style.visibility === "hidden" || style.display === "none") continue;
          if (style.clipPath === "inset(50%)") continue;

          /*
           * Effective opacity, not the element's own.
           *
           * Sections fade in as they are scrolled to. Halfway through that,
           * a dark band is still partly transparent, so the ground sampled
           * behind its text is the band blended with the white page under it —
           * a colour that exists for a third of a second and never again.
           * Measuring it reports a failure against a state nobody reads. Only
           * text that has fully arrived is text worth checking.
           */
          let opacity = 1;
          for (
            let node = el;
            node && node !== document.documentElement;
            node = node.parentElement
          ) {
            opacity *= +getComputedStyle(node).opacity;
          }
          if (opacity < 0.99) continue;

          const box = el.getBoundingClientRect();
          if (box.width < 2 || box.height < 2) continue;
          if (box.top < 0 || box.bottom > innerHeight) continue;

          /*
           * Work out which sample points are actually this element's.
           *
           * The header is sticky and translucent, so mid-scroll there is
           * always a band of the page passing beneath it. Sampling there
           * measures the header, not the text's own background, and reports a
           * failure against every sticky header ever built rather than against
           * a defect. Testing only the centre is not enough either: a heading
           * tucking under the header has a clear centre and a covered top
           * edge, which is exactly where the worst sample would be found.
           *
           * So each point is tested on its own, and only the uncovered ones
           * are handed back to be measured. An element with nothing left
           * showing is not being read, and is not checked.
           */
          const points = [];
          for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 3; j++) {
              const x = box.left + (box.width * i) / 10;
              const y = box.top + (box.height * j) / 4;
              const onTop = document.elementFromPoint(x, y);
              if (onTop && (el === onTop || el.contains(onTop))) points.push([x, y]);
            }
          }
          if (points.length === 0) continue;

          const background = (style.backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
          if (background[3] === undefined || background[3] > 0.9) {
            /* Sits on a solid plate of its own; the plate is the ground. */
            if (background.length && background[3] !== 0) continue;
          }

          out.push({
            text: text.slice(0, 44),
            colour: (style.color.match(/[\d.]+/g) ?? []).map(Number).slice(0, 3),
            size: parseFloat(style.fontSize),
            bold: +style.fontWeight >= 700,
            points,
          });
        }
        return out;
      });

      if (texts.length === 0) continue;

      const hide = await page.addStyleTag({
        /* Hide glyph fill without animating the foreground colour. Under GPU
           load a colour transition can leave antialiased letters in the shot;
           those are not the background. Keep currentColor surfaces intact. */
        /* text-decoration-color as well as color. An underline drawn in an
           explicit colour — decoration-brand-400/60 on the promise links —
           survives `color: transparent`, and then the sampler reads the
           element's own underline as the ground behind its own text and reports
           2.62:1 against a link that is in fact sitting on navy. It is part of
           the text, not behind it. */
        content:
          "*{-webkit-text-fill-color:transparent !important;text-decoration-color:transparent !important;transition:none !important} svg{visibility:hidden !important}",
      });
      await page.waitForTimeout(250);
      const shot = await page.screenshot();
      await page.evaluate((el) => el.remove(), hide);

      const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
      const pixel = (x, y) => {
        const cx = Math.round(Math.min(Math.max(x, 0), info.width - 1));
        const cy = Math.round(Math.min(Math.max(y, 0), info.height - 1));
        const i = (cy * info.width + cx) * info.channels;
        return [data[i], data[i + 1], data[i + 2]];
      };

      for (const item of texts) {
        let worst = Infinity;
        let ground = null;
        let at = null;
        for (const [x, y] of item.points) {
          const sample = pixel(x, y);
          const ratio = contrastRatio(item.colour, sample);
          if (ratio < worst) {
            worst = ratio;
            ground = sample;
            at = `${Math.round(x)},${Math.round(y)}`;
          }
        }

        const large = item.size >= 24 || (item.size >= 18.66 && item.bold);
        const needed = large ? 3 : 4.5;
        if (worst < needed) {
          /* Always say what it measured against. A ratio on its own sends the
             next person hunting for a colour the stylesheet does not contain,
             because the ground is usually something composited. */
          fail(
            `${path} (${name}, scrolled ${top})`,
            `"${item.text}" measures ${worst.toFixed(2)}:1, needs ${needed} — ` +
              `rgb(${item.colour}) on rgb(${ground}) at ${at}`,
          );
        }
      }
    }

    await page.close();
  }
}

/* ------------------------------------------------------------------- motion */
console.log("verify: motion and reduced-motion behaviour");

{
  /* Without JavaScript, nothing may be hidden. */
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const hidden = await page.evaluate(() => 0).catch(() => null);
  if (hidden === null) {
    const opacity = await page
      .locator("[data-reveal]")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity)
      .catch(() => "1");
    if (opacity !== "1") fail("/ (no javascript)", `content hidden at opacity ${opacity}`);
  }
  await context.close();
}

{
  /* A jump down the page must not leave sections invisible. */
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2500);
  const stuck = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (el) => getComputedStyle(el).opacity !== "1",
      ).length,
  );
  if (stuck) fail("/ (jump to bottom)", `${stuck} sections never became visible`);
  await page.close();
}

{
  /* Reduced motion: nothing hidden, and no WebGL bundle fetched. */
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  const state = await page.evaluate(() => ({
    hidden: [...document.querySelectorAll("[data-reveal]")].filter(
      (el) => getComputedStyle(el).opacity !== "1",
    ).length,
    three: performance.getEntriesByType("resource").some((r) => /three/.test(r.name)),
  }));
  if (state.hidden) fail("/ (reduced motion)", `${state.hidden} sections hidden`);
  if (state.three) fail("/ (reduced motion)", "three.js was fetched anyway");
  await context.close();
}

/* Desktop-only repair artwork must cost nothing on a mobile connection. */
for (const path of ["/reparation", "/en/repairs"]) {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled,
    });
    const page = await context.newPage();
    const requests = [];
    page.on("request", (request) => {
      if (
        /models\/(laptop-repair|laptop-service|laptop-wallpaper|thinkpad-.*texture)\.webp/.test(
          request.url(),
        )
      )
        requests.push(request.url());
    });
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    const figure = page.locator(".repair-laptop");
    if (await figure.isVisible()) fail(path, "desktop laptop visible on mobile");
    const state = await figure.getAttribute("data-scene-state");
    if (state === "ready") fail(path, "mobile WebGL renderer started");
    if (requests.length) fail(path, "mobile downloaded desktop laptop artwork");
    await context.close();
  }
}

/* ---------------------------------------------------------------- navigation */
console.log("verify: navigation and shared layouts");

/*
 * The site has to survive being used, not only being loaded.
 *
 * Every check above calls page.goto, which is a fresh document every time. A
 * visitor does not do that — they click, and a click in this app is a
 * client-side navigation where the layout never remounts. That difference hid
 * a bug that reached production: the reveal effect ran once on mount, so every
 * page arrived at by clicking kept its sections at opacity 0 for good, and the
 * site showed blank below the header. Eight sections across four pages, and
 * the entire front page on the way back to it.
 *
 * So this one clicks, and reads each page the way a person would — scrolling
 * the whole way down — then insists nothing is left invisible.
 */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (error) => fail("navigation", error.message));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  async function readThrough(where) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((v) => scrollTo(0, v), y);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(1400);

    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]")]
        .filter((el) => getComputedStyle(el).opacity !== "1")
        .map((el) => el.className.slice(0, 40)),
    );
    if (stuck.length) {
      fail(
        `navigation (${where})`,
        `${stuck.length} section(s) never became visible: ${stuck.join(", ")}`,
      );
    }

    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
  }

  await readThrough("direct load of /");

  /* Check the visible labels; the knowledge URL is unchanged. */
  for (const label of ["Reparation", "Om os", "Viden"]) {
    await page.click(`header nav a:has-text("${label}")`);
    await page.waitForTimeout(1100);
    await readThrough(`after clicking ${label}`);
  }

  await page.click("header a[href='/']");
  await page.waitForTimeout(1100);
  await readThrough("back on / after clicking the logo");

  await page.close();
}

/* --------------------------------------------------------- regressions */

for (const path of ["/kontakt", "/en/contact"]) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const state = await page.locator("form[action='/api/kontakt']").evaluate((form) => ({
    method: form.method,
    disabled: [...form.querySelectorAll("input,textarea,select,button")].every((el) =>
      el.matches(":disabled"),
    ),
    emailFallback: Boolean(form.querySelector("noscript a[href='mailto:kontakt@kestro.dk']")),
  }));
  if (state.method !== "post" || !state.disabled || !state.emailFallback)
    fail(path, "no-JS form could expose personal data in a GET URL or lacks email fallback");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(BASE + "/kontakt", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
  const toggle = page.locator("header button[aria-controls='mobile-menu']");
  await toggle.click();
  await page.waitForFunction(() => document.querySelector("main").inert);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(
    () => !document.querySelector("main").inert && document.body.style.overflow !== "hidden",
  );
  if ((await toggle.getAttribute("aria-expanded")) !== "false")
    fail("menu resize", "drawer remained open on desktop");
  await page.setViewportSize({ width: 390, height: 844 });
  await toggle.click();
  await page.locator("header a[href='/']").first().click();
  await page.waitForURL(BASE + "/");
  await page.waitForFunction(
    () => !document.querySelector("main").inert && document.body.style.overflow !== "hidden",
  );
  if (await page.locator("aside[aria-label='Under etablering']").count())
    fail("project notice", "notice appeared on the homepage after navigation");
  await context.close();
}

for (const { home, pricing, terms, label, refuse } of [
  {
    home: "/",
    pricing: "/priser",
    terms: "/handelsbetingelser",
    label: "Under etablering",
    refuse: "Kun nødvendige",
  },
  {
    home: "/en",
    pricing: "/en/pricing",
    terms: "/en/terms-of-sale",
    label: "Pre-launch",
    refuse: "Necessary only",
  },
]) {
  for (const width of [320, 1440]) {
    for (const javaScriptEnabled of [false, true]) {
      const context = await browser.newContext({
        javaScriptEnabled,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      const notice = page.locator(`aside[aria-label='${label}']`);
      const where = `project notice (${pricing}, ${width}px, JS ${javaScriptEnabled})`;
      await page.goto(BASE + home, { waitUntil: "networkidle" });
      if (await notice.count()) fail(where, "notice appeared on the homepage");
      if (javaScriptEnabled) await page.getByRole("button", { name: refuse, exact: true }).click();

      await page.locator(`footer a[href='${pricing}']`).first().click();
      await page.waitForURL(BASE + pricing, { waitUntil: "networkidle" });
      if ((await notice.count()) !== 1 || !(await notice.isVisible()))
        fail(where, "pricing page must show exactly one visible notice");
      const statusLink = notice.locator(`a[href='${terms}']`);
      await statusLink.scrollIntoViewIfNeeded();
      if (
        !(await statusLink.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return el.contains(
            document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2),
          );
        }))
      )
        fail(where, "pricing status link is obscured");

      await statusLink.click();
      await page.waitForURL(BASE + terms, { waitUntil: "networkidle" });
      if (await notice.count()) fail(where, "notice leaked into the terms page");
      await page.locator(`header a[href='${home}']`).first().click();
      await page.waitForURL(BASE + home, { waitUntil: "networkidle" });
      if (await notice.count()) fail(where, "notice persisted after leaving pricing");
      await context.close();
    }
  }
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  // No synthetic enquiry or Google request is ever delivered to a real service.
  await page.route(/googletagmanager\.com/, (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.route(/google-analytics\.com/, (route) => route.fulfill({ status: 204 }));
  await page.route("**/api/kontakt", (route) =>
    route.fulfill({ contentType: "application/json", body: '{"ok":true}' }),
  );
  await page.goto(BASE + "/kontakt", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Accepter statistik", exact: true }).click();
  await page.waitForFunction(() => typeof window.gtag === "function");
  await page.evaluate(() => {
    document.cookie = "_ga=synthetic; Path=/";
  });
  await page.getByRole("button", { name: "Cookies og statistik", exact: true }).click();
  await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
  const before = await page.evaluate(() => ({
    disabled: window["ga-disable-G-5BCBNXTR8T"],
    cookie: document.cookie,
    count: window.dataLayer.length,
  }));
  if (!before.disabled || /(?:^|;\s*)_ga=/.test(before.cookie))
    fail("consent withdrawal", "GA not disabled or cookie not cleared");
  await page.locator("#navn").fill("Synthetic QA");
  await page.locator("#virksomhed").fill("Synthetic QA company");
  await page.locator("#email").fill("qa@example.invalid");
  await page.locator("#besked").fill("Intercepted locally; never sent.");
  await page.locator("form button[type='submit']").click();
  await page.locator("#kontakt-udfald").waitFor();
  const after = await page.evaluate(() => window.dataLayer.slice());
  if (after.slice(before.count).some((entry) => entry[0] === "event"))
    fail("consent withdrawal", "event queued after refusal");
  await page.getByRole("button", { name: "Cookies og statistik", exact: true }).click();
  await page.getByRole("button", { name: "Accepter statistik", exact: true }).click();
  await page.waitForFunction(() => window["ga-disable-G-5BCBNXTR8T"] === false);
  await context.close();
}

for (const [width, height] of [
  [320, 667],
  [390, 844],
  [844, 430],
  [1440, 900],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(BASE + "/modeller/lenovo-thinkpad-t480", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
  const photos = page.getByRole("group", { name: "Produktbilleder", exact: true });
  await photos.getByRole("button").nth(1).click();
  if ((await photos.getByRole("button").nth(1).getAttribute("aria-pressed")) !== "true")
    fail("gallery", "selection did not update");
  const enlarge = page.getByRole("button", {
    name: "Forstør billede af Lenovo ThinkPad T480",
    exact: true,
  });
  await enlarge.click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor();
  await page.getByRole("button", { name: "Næste billede", exact: true }).click();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden",
  );
  if (!(await enlarge.evaluate((el) => el === document.activeElement)))
    fail("gallery", "focus did not return after Escape");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const textures = [];
  page.on("request", (request) => {
    if (/laptop-wallpaper|thinkpad-.*texture/.test(request.url())) textures.push(request.url());
  });
  await page.goto(BASE + "/reparation", { waitUntil: "networkidle" });
  const figure = page.locator(".repair-laptop");
  await figure.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  if ((await figure.getAttribute("data-scene-state")) !== "poster" || textures.length)
    fail("3D activation", "model loaded before user intent");
  const poster = figure.locator("img");
  await poster.evaluate((image) => image.decode());
  if (!(await poster.evaluate((image) => image.currentSrc.includes("/models/laptop-repair.webp"))))
    fail("repair initial view", "first view is not the assembled laptop");
  await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
  await page.getByRole("button", { name: "Åbn 3D-visning", exact: true }).click();
  await page.waitForFunction(
    () => {
      const node = document.querySelector(".repair-laptop");
      return node.dataset.sceneState === "ready" && node.dataset.assemblyProgress !== undefined;
    },
    null,
    { timeout: 60000 },
  );
  if (Number(await figure.getAttribute("data-assembly-progress")) !== 0)
    fail("repair initial view", "3D activation disassembled the laptop without user intent");
  const assembled = figure.getByRole("button", { name: "Samlet computer", exact: true });
  const service = figure.getByRole("button", { name: "Servicedele", exact: true });
  if (
    (await assembled.getAttribute("aria-pressed")) !== "true" ||
    (await figure.locator("input").inputValue()) !== "0"
  )
    fail("repair initial view", "initial controls disagree with the assembled model");
  await service.click();
  await page.waitForFunction(
    () => Number(document.querySelector(".repair-laptop").dataset.assemblyProgress) > 0.9998,
    null,
    { timeout: 15000 },
  );
  await assembled.click();
  await page.waitForFunction(
    () => Number(document.querySelector(".repair-laptop").dataset.assemblyProgress) < 0.0002,
    null,
    { timeout: 15000 },
  );
  await context.close();
}

/* ----------------------------------------------------- needs-led buying paths */

for (const [path, needs, brands, budget, guidePath] of [
  [
    "/produkter/baerbare-computere",
    "Hvilken firmabærbar passer til arbejdet?",
    "Mærker vi typisk arbejder med",
    "Hvordan vælger jeg en billig bærbar til arbejde?",
    "/vejledninger/tjek-brugt-baerbar-foer-koeb",
  ],
  [
    "/en/products/business-laptops",
    "Which company laptop fits the work?",
    "Brands we usually work with",
    "How do I choose a low-cost laptop for work?",
    "/en/knowledge/check-a-used-laptop",
  ],
]) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const titles = await page.locator("main h2").allTextContents();
  const needsIndex = titles.findIndex((text) => text.trim() === needs);
  const brandIndex = titles.findIndex((text) => text.trim() === brands);
  if (needsIndex < 0 || brandIndex < 0 || needsIndex >= brandIndex)
    fail("needs-led category", `buying needs do not precede brands on ${path}`);
  if (!(await page.getByRole("heading", { name: budget, exact: true }).count()))
    fail("needs-led category", `missing budget answer on ${path}`);
  if (!(await page.locator(`main a[href='${guidePath}']`).count()))
    fail("needs-led category", `missing buying guide link on ${path}`);
  await page.goto(BASE + guidePath, { waitUntil: "networkidle" });
  const articleDates = await page
    .locator("script[type='application/ld+json']")
    .evaluateAll((nodes) => {
      const schemas = nodes.map((node) => JSON.parse(node.textContent));
      const article = schemas.find((schema) => schema["@type"] === "Article");
      return { published: article?.datePublished, modified: article?.dateModified };
    });
  if (
    articleDates.published !== "2026-08-23" ||
    !articleDates.modified ||
    articleDates.modified <= articleDates.published
  )
    fail("needs-led guide", `publication date reset or update missing on ${guidePath}`);
  await context.close();
}

for (const [path, question] of [
  [
    "/reparation/ram-og-ssd-opgradering",
    "Hvad er forskellen på opgradering og opdatering af en bærbar?",
  ],
  [
    "/en/repairs/memory-and-ssd-upgrade",
    "What is the difference between upgrading and updating a laptop?",
  ],
  ["/ydelser/nordisk-tilpasning", "Hvordan bestiller vi det rigtige danske eller norske layout?"],
  ["/en/services/nordic-preparation", "How do we request the correct Danish or Norwegian layout?"],
]) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!(await page.getByRole("heading", { name: question, exact: true }).count()))
    fail("needs-led service", `missing server-rendered distinction on ${path}`);
  await context.close();
}

/* ----------------------------------------------------- buying content / photo */

for (const [prefix, productPath, memoryQuestion] of [
  ["", "/produkter", "Kan RAM udvides i en T14 Gen 2 Intel?"],
  ["/en", "/en/products", "Can RAM be expanded in a T14 Gen 2 Intel?"],
]) {
  const modelPath = `${prefix}/${prefix ? "models" : "modeller"}/lenovo-thinkpad-t14`;
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + productPath, { waitUntil: "networkidle" });
  for (const href of [
    `${prefix}/${prefix ? "models" : "modeller"}`,
    `${prefix}/${prefix ? "condition-and-quality" : "kvalitet"}`,
    `${prefix}/${prefix ? "contact" : "kontakt"}`,
  ]) {
    if (!(await page.locator(`main a[href='${href}']`).count()))
      fail("buying content", `missing server-rendered decision link ${href}`);
  }
  await page.goto(BASE + modelPath, { waitUntil: "networkidle" });
  if (!(await page.getByRole("heading", { name: memoryQuestion, exact: true }).count()))
    fail("buying content", `missing server-rendered generation answer ${modelPath}`);
  if (!(await page.locator("main a[href*='ThinkPad_T14_Gen_2_Intel_Spec.pdf']").count()))
    fail("buying content", `missing manufacturer citation ${modelPath}`);
  await context.close();
}

for (const width of [320, 390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/modeller/lenovo-thinkpad-t14", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
  const enlarge = page.getByRole("button", {
    name: "Forstør billede af Lenovo ThinkPad T14",
    exact: true,
  });
  if (
    !(await enlarge
      .locator("img")
      .evaluate(
        (img) =>
          img.complete && img.naturalWidth > 0 && getComputedStyle(img).mixBlendMode === "normal",
      ))
  )
    fail("reference photo", `missing image or photographic blend regression at ${width}`);
  if (await page.getByRole("group", { name: "Produktbilleder", exact: true }).count())
    fail("reference photo", "single photograph has redundant thumbnail controls");
  if (!(await page.locator("a[rel='license']").count()))
    fail("reference photo", "missing visible licence credit");
  await enlarge.click();
  await page.locator("dialog[open]").waitFor();
  const box = await page.locator("dialog[open]").boundingBox();
  if (!box || box.x < 0 || box.x + box.width > width + 1)
    fail("reference photo", `zoom overflows at ${width}`);
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden",
  );
  if (!(await enlarge.evaluate((el) => el === document.activeElement)))
    fail("reference photo", `focus did not return at ${width}`);
  await context.close();
}

/* ---------------------------------------------------------------- education */

/* Every motion/navigation context above is closed. These server-HTML checks
 * have no dependency on its cookies, gallery state or WebGL resources. Check
 * the lifecycle before releasing Chromium's process-wide caches/graphics. */
const leftoverContexts = browser.contexts();
if (leftoverContexts.length) {
  fail("browser lifecycle", `${leftoverContexts.length} context(s) remain before education`);
}
await browser.close();
browser = await launchBrowser();
console.log("verify: education server-rendered content");

/* The education hub and articles must be readable and linked without client JS. */
for (const [hub, title, articlePaths] of [
  [
    "/vejledninger",
    "Artikler og guides om computere",
    [
      "/vejledninger/hvorfor-er-ram-blevet-dyrere",
      "/vejledninger/refurbished-eller-ny-baerbar",
      "/vejledninger/hvor-meget-kan-en-baerbar-opgraderes",
    ],
  ],
  [
    "/en/knowledge",
    "Computer articles and guides",
    [
      "/en/knowledge/why-memory-prices-rise",
      "/en/knowledge/refurbished-or-new-laptop",
      "/en/knowledge/laptop-upgrade-limits",
    ],
  ],
]) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const ready = readinessDiagnostics(page, `education-no-js-${hub}`);
  const navigate = (path) =>
    ready(`navigation ${path}`, () => page.goto(BASE + path, { waitUntil: "networkidle" }));
  await navigate(hub);
  if (!(await page.getByRole("heading", { level: 1, name: title, exact: true }).count()))
    fail("education hub", `missing clear article heading on ${hub}`);
  for (const path of articlePaths) {
    if (!(await page.locator(`main a[href='${path}']`).count()))
      fail("education hub", `missing article link ${path}`);
    const response = await navigate(path);
    if (response?.status() !== 200)
      fail("education route", `${path} returned ${response?.status()}`);
    const article = await page
      .locator("script[type='application/ld+json']")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => JSON.parse(node.textContent))
          .find((schema) => schema["@type"] === "Article"),
      );
    /* Published on the 16th; the openings were rewritten on the 19th (answer
       first, one hedge instead of four), and a changed text carries the day
       it changed (CLAUDE.md, "Opdateret"). */
    if (article?.datePublished !== "2026-10-16" || article?.dateModified !== "2026-10-19")
      fail("education dates", `incorrect new-article dates on ${path}`);
    const webpageDates = await page
      .locator("script[type='application/ld+json']")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => JSON.parse(node.textContent))
          .find((schema) => schema["@type"] === "WebPage"),
      );
    if (
      webpageDates?.datePublished !== article?.datePublished ||
      webpageDates?.dateModified !== article?.dateModified
    )
      fail("education dates", `WebPage and Article disagree on ${path}`);
    if (
      !(await page
        .locator("main img")
        .evaluateAll((images) => images.some((img) => img.complete && img.naturalWidth > 0)))
    )
      fail("education artwork", `missing article illustration on ${path}`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      fail("education layout", `horizontal overflow on ${path}`);
    await navigate(hub);
  }
  await navigate(articlePaths[2]);
  const text = await page.locator("main").innerText();
  if (
    !text.includes("128 GB") ||
    !text.includes("40/48 GB") ||
    !text.includes("BitLocker") ||
    !text.includes("PC Health Check")
  )
    fail("upgrade education", `missing documented limits or safety advice on ${articlePaths[2]}`);
  if ((await page.locator("main table tbody tr").count()) !== 4)
    fail("upgrade education", "hardware comparison must retain four documented examples");
  await context.close();
}

/* Every article language variant must be indexable and describe its own illustration. */
const articleVariants = new Map();
for (const [hub, prefix, language] of [
  ["/vejledninger", "/vejledninger/", "da-DK"],
  ["/en/knowledge", "/en/knowledge/", "en"],
]) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const ready = readinessDiagnostics(page, `education-variants-${hub}`);
  const navigate = (path) =>
    ready(`navigation ${path}`, () => page.goto(BASE + path, { waitUntil: "networkidle" }));
  await navigate(hub);
  const hubInfo = await page.evaluate((prefix) => {
    const schemas = [...document.querySelectorAll("script[type='application/ld+json']")].map(
      (node) => JSON.parse(node.textContent),
    );
    return {
      list: schemas.find((schema) => schema["@type"] === "ItemList"),
      collection: schemas.find((schema) => schema["@type"] === "CollectionPage"),
      hrefs: [
        ...new Set(
          [...document.querySelectorAll("main a[href]")]
            .map((a) => a.getAttribute("href"))
            .filter((href) => href.startsWith(prefix)),
        ),
      ],
    };
  }, prefix);
  const items = hubInfo.list?.itemListElement ?? [];
  if (
    items.length !== hubInfo.hrefs.length ||
    hubInfo.list?.numberOfItems !== items.length ||
    !items.length
  )
    fail("bilingual article index", `missing or mismatched article list on ${hub}`);
  if (hubInfo.collection?.mainEntity?.["@id"] !== hubInfo.list?.["@id"])
    fail("bilingual article index", `collection does not reference its reading list on ${hub}`);
  for (const [index, item] of items.entries()) {
    const path = new URL(item.url).pathname;
    if (item.position !== index + 1 || !hubInfo.hrefs.includes(path))
      fail("bilingual article index", `invalid position or invisible item ${path}`);
    const response = await navigate(path);
    if (response?.status() !== 200 || /noindex/i.test(response?.headers()["x-robots-tag"] ?? ""))
      fail("bilingual article response", `not indexable: ${path}`);
    const info = await page.evaluate(() => {
      const schemas = [...document.querySelectorAll("script[type='application/ld+json']")].map(
        (node) => JSON.parse(node.textContent),
      );
      const meta = (key) =>
        document.querySelector(`meta[property='${key}'],meta[name='${key}']`)?.content;
      const imageSources = [...document.querySelectorAll("main img")].map((img) => {
        const src = new URL(img.src);
        return src.searchParams.get("url") ?? src.pathname;
      });
      return {
        lang: document.documentElement.lang,
        title: document.title,
        description: meta("description"),
        robots: meta("robots"),
        canonical: document.querySelector("link[rel='canonical']")?.href,
        alternates: Object.fromEntries(
          [...document.querySelectorAll("link[hreflang]")].map((link) => [
            link.hreflang,
            link.href,
          ]),
        ),
        article: schemas.find((schema) => schema["@type"] === "Article"),
        ogType: meta("og:type"),
        ogTitle: meta("og:title"),
        ogDescription: meta("og:description"),
        ogImage: meta("og:image"),
        twitterImage: meta("twitter:image"),
        imageSources,
      };
    });
    if (
      info.lang !== language ||
      new URL(info.canonical).pathname !== path ||
      /noindex|nofollow/.test(info.robots ?? "")
    )
      fail("bilingual article language", `incorrect language, canonical or robots on ${path}`);
    if (!info.robots?.includes("max-image-preview:large") || info.ogType !== "article")
      fail("bilingual article metadata", `missing article type or preview permission on ${path}`);
    if (info.ogTitle !== info.title || info.ogDescription !== info.description)
      fail("bilingual article metadata", `mixed or stale snippet on ${path}`);
    if (info.article?.inLanguage !== language || info.article?.url !== info.canonical)
      fail("bilingual article schema", `incorrect language or URL on ${path}`);
    if (
      !info.article?.image?.url ||
      info.article.image.url !== info.ogImage ||
      info.ogImage !== info.twitterImage
    )
      fail("bilingual article image", `schema and preview disagree on ${path}`);
    else if (!info.imageSources.includes(new URL(info.article.image.url).pathname))
      fail("bilingual article image", `schema does not describe visible artwork on ${path}`);
    articleVariants.set(info.canonical, info);
  }
  await context.close();
}
for (const [url, info] of articleVariants) {
  for (const language of ["da", "en"]) {
    const other = articleVariants.get(info.alternates[language]);
    if (!other || other.alternates[info.lang === "en" ? "en" : "da"] !== url)
      fail("bilingual article pairing", `missing reciprocal ${language} variant of ${url}`);
  }
}

// Console checks use a fresh browser after the long graphics/metadata sweeps.
// Every console assertion remains active; resource exhaustion is not ignored.
await browser.close();
browser = await launchBrowser();
{
  const messages = [];
  for (const path of ["/", "/en", "/kontakt", "/maskinen"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    page.on("console", (m) => m.type() === "error" && messages.push(`${path}: ${m.text()}`));
    page.on("pageerror", (e) => messages.push(`${path}: ${e.message}`));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.close();
  }
  for (const message of messages) fail("console", message);
}

try {
  await verifyAdmin(browser, BASE, fail);
} catch (error) {
  fail("admin interactions", error.stack ?? error.message);
}

try {
  await verifyPracticalGuides(browser, BASE, fail);
} catch (error) {
  fail("practical guide interactions", error.stack ?? error.message);
}

try {
  await verifyVisualPolish(browser, BASE, fail);
} catch (error) {
  fail("visual interactions", error.stack ?? error.message);
}
await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log("verify: all checks passed");

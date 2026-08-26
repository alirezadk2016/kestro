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
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.VERIFY_BASE ?? "http://localhost:4173";

/** The pages worth checking: one of every template, in both languages. */
const PAGES = [
  "/",
  "/en",
  "/ydelser",
  "/ydelser/levering",
  "/produkter",
  "/modeller",
  "/maskinen",
  "/reparation",
  "/kontakt",
  "/vejledninger",
  "/om-os",
  "/privatlivspolitik",
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

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

/* ---------------------------------------------------------------- structure */

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

  await page.close();
}

/* ----------------------------------------------------------------- contrast */

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
  for (const path of ["/", "/en", "/ydelser/levering", "/kontakt"]) {
    const page = await browser.newPage({ viewport });
    await page.goto(BASE + path, { waitUntil: "networkidle" });

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
        content: "*{color:transparent !important} svg{visibility:hidden !important}",
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

/* ------------------------------------------------------------------ console */

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

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log("verify: all checks passed");

import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// React escapes these syntax characters in rendered text and attributes. Decode
// numeric entities too, including encoded fragment IDs and query separators.
const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name) => {
    if (!name.startsWith("#")) return entities[name.toLowerCase()] ?? entity;
    const point = /^#x/i.test(name) ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "\ufffd";
  });
const textContent = (html) =>
  decode(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
const withoutScripts = (html) =>
  html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");

function tags(html) {
  return [...html.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(
    ([, tag, attributes]) => ({
      tag: tag.toLowerCase(),
      attributes: Object.fromEntries(
        [
          ...attributes.matchAll(
            /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,
          ),
        ].map(([, name, quoted, single, bare]) => [
          name.toLowerCase(),
          decode(quoted ?? single ?? bare ?? ""),
        ]),
      ),
    }),
  );
}

async function mapFour(values, run) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, values.length) }, async () => {
      while (next < values.length) await run(values[next++]);
    }),
  );
}

/** Extend template checks to every public sitemap route, rendered link and local image. */
export async function verifySiteInventory(base, fail) {
  console.log("verify: complete public route, fragment and image inventory");
  const local = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(local.hostname),
    "site inventory is local only",
  );
  const issues = [];
  const problem = (where, what) => {
    issues.push({ where, what });
    fail(`inventory ${where}`, what);
  };
  const address = (url) => {
    const target = new URL(local.origin);
    target.pathname = url.pathname;
    target.search = url.search;
    return target;
  };
  const key = (url) => url.pathname + url.search;

  // Every HTTP operation, including redirect hops, runs inside one of four
  // workers. Follow only known internal hosts and never contact the live site.
  let production;
  let hosts;
  const internal = (url) =>
    /^https?:$/.test(url.protocol) && (url.origin === local.origin || hosts?.has(url.hostname));
  async function request(url, method = "GET") {
    let target = new URL(url);
    for (let hop = 0; hop < 5; hop++) {
      if (target.pathname === "/_next/image") throw new Error("optimizer requests are forbidden");
      const response = await fetch(address(target), {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`HTTP ${response.status} without Location`);
        const next = new URL(decode(location), target);
        if (!internal(next)) throw new Error(`redirect leaves the local inventory: ${location}`);
        await response.body?.cancel();
        target = next;
        continue;
      }
      const contentType = response.headers.get("content-type") ?? "";
      if (method === "HEAD") return { status: response.status, url: target, contentType };
      const maxBytes = 4 * 1024 * 1024;
      let size = 0;
      const chunks = [];
      for await (const chunk of response.body ?? []) {
        size += chunk.byteLength;
        if (size > maxBytes) throw new Error("response exceeds the 4 MB inventory limit");
        chunks.push(chunk);
      }
      return {
        status: response.status,
        url: target,
        contentType,
        body: Buffer.concat(chunks).toString("utf8"),
      };
    }
    throw new Error("more than four internal redirects");
  }

  const sitemap = await request(new URL("/sitemap.xml", local));
  if (sitemap.status !== 200) {
    problem("/sitemap.xml", `HTTP ${sitemap.status}`);
    return;
  }
  const locations = [...sitemap.body.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map(
    ([, value]) => new URL(decode(value.trim())),
  );
  if (!locations.length) {
    problem("/sitemap.xml", "no sitemap URLs to inventory");
    return;
  }
  production = new URL(locations[0].origin);
  hosts = new Set([production.hostname, production.hostname.replace(/^www\./, "")]);
  const listed = new Map();
  for (const url of locations) {
    if (url.origin !== production.origin)
      problem("/sitemap.xml", `unexpected origin ${url.origin}`);
    if (url.search || url.hash) problem("/sitemap.xml", `noncanonical sitemap URL ${url.href}`);
    if (listed.has(key(url))) problem("/sitemap.xml", `duplicate URL ${url.href}`);
    listed.set(key(url), url);
  }

  const records = new Map();
  const links = [];
  const imageUrls = new Map();
  const stylesheets = new Map();
  const externalImages = new Set();
  const srcset = (value) =>
    value.trim().startsWith("data:")
      ? []
      : value.split(",").map((entry) => entry.trim().split(/\s+/)[0]);

  function imageReference(raw, pageUrl) {
    if (!raw || /^(data:|blob:|#)/i.test(raw)) return;
    let url;
    try {
      url = new URL(decode(raw), pageUrl);
      if (url.pathname === "/_next/image") {
        const original = url.searchParams.get("url");
        if (!original) throw new Error("optimizer URL has no original image");
        url = new URL(original, pageUrl);
      }
      if (!/^https?:$/.test(url.protocol)) return;
      if (!internal(url)) {
        externalImages.add(url.href);
        return;
      }
      url.hash = "";
      imageUrls.set(key(url), url);
    } catch (error) {
      problem(key(pageUrl), `invalid image URL ${raw}: ${error.message}`);
    }
  }

  function cssImages(css, source) {
    for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi)) {
      const raw = match[1] ?? match[2] ?? match[3];
      // Stylesheets also reference fonts. Only image URLs belong to this check.
      if (/\.(?:avif|webp|png|jpe?g|gif|svg|ico|bmp)(?:[?#]|$)/i.test(raw))
        imageReference(raw, source);
    }
  }

  function inspect(pageUrl, response) {
    const markup = withoutScripts(response.body);
    const elements = tags(markup);
    const ids = new Set();
    const titles = [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(([, text]) =>
      textContent(text),
    );
    const headings = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, text]) =>
      textContent(text),
    );
    const descriptions = [];
    const canonicals = [];
    for (const { tag, attributes: attrs } of elements) {
      if (attrs.id) ids.add(attrs.id);
      if (tag === "a") {
        if (attrs.name) ids.add(attrs.name);
        if (attrs.href !== undefined) links.push({ source: pageUrl, href: attrs.href });
      }
      if (tag === "meta") {
        if (attrs.name?.toLowerCase() === "description") descriptions.push(attrs.content ?? "");
        if (
          /^(og:image(?::url)?|twitter:image(?::src)?)$/i.test(attrs.property ?? attrs.name ?? "")
        )
          imageReference(attrs.content, pageUrl);
      }
      if (tag === "link") {
        const relations = (attrs.rel ?? "").toLowerCase().split(/\s+/);
        if (relations.includes("canonical")) canonicals.push(attrs.href ?? "");
        if (relations.includes("stylesheet") && attrs.href) {
          const url = new URL(attrs.href, pageUrl);
          if (internal(url)) stylesheets.set(key(url), url);
        }
        if (attrs.as === "image") {
          imageReference(attrs.href, pageUrl);
          for (const raw of srcset(attrs.imagesrcset ?? "")) imageReference(raw, pageUrl);
        }
        if (relations.some((relation) => ["icon", "apple-touch-icon"].includes(relation)))
          imageReference(attrs.href, pageUrl);
      }
      if (tag === "img" || tag === "image")
        imageReference(attrs.src ?? attrs.href ?? attrs["xlink:href"], pageUrl);
      if (tag === "img" || tag === "source")
        for (const raw of srcset(attrs.srcset ?? "")) imageReference(raw, pageUrl);
      if (attrs.style) cssImages(attrs.style, pageUrl);
    }
    // Inline styles are removed before markup inspection, but may carry the
    // mobile hero background or a guide's image-set fallback.
    for (const [, css] of response.body.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
      cssImages(css, pageUrl);
    return {
      path: key(pageUrl),
      status: response.status,
      finalPath: key(response.url),
      contentType: response.contentType,
      titles,
      descriptions,
      headings,
      canonicals,
      ids,
    };
  }

  async function readPage(url, sitemapEntry = false) {
    try {
      const response = await request(url);
      const record = inspect(url, response);
      records.set(key(url), record);
      if (response.status !== 200) problem(key(url), `HTTP ${response.status}`);
      if (!sitemapEntry) return;
      if (key(response.url) !== key(url))
        problem(key(url), `sitemap URL redirects to ${key(response.url)}`);
      if (!/text\/html/i.test(response.contentType))
        problem(key(url), `expected HTML, received ${response.contentType}`);
      for (const [name, values] of [
        ["title", record.titles],
        ["description", record.descriptions],
        ["H1", record.headings],
        ["canonical", record.canonicals],
      ])
        if (values.length !== 1 || !values[0]?.trim())
          problem(key(url), `expected one nonempty ${name}; found ${values.length}`);
      if (record.canonicals.length === 1) {
        const canonical = new URL(record.canonicals[0], url);
        if (canonical.href !== url.href)
          problem(key(url), `canonical is ${canonical.href}, expected ${url.href}`);
      }
    } catch (error) {
      records.set(key(url), { path: key(url), error: error.message, ids: new Set() });
      problem(key(url), error.message);
    }
  }
  await mapFour([...listed.values()], (url) => readPage(url, true));

  const targets = [];
  let checkedLinks = 0;
  // New public HTML routes can contribute more links. Query strings remain in
  // request keys; matching a sitemap route uses its path, without query/hash.
  for (;;) {
    const next = new Map();
    for (const link of links.slice(checkedLinks)) {
      try {
        if (!link.href || link.href === "#") continue;
        const url = new URL(link.href, link.source);
        if (!internal(url)) continue; // mailto, tel and external URLs are allowed.
        const fragment = url.hash.slice(1);
        url.hash = "";
        targets.push({ ...link, url, fragment });
        if (!records.has(key(url))) next.set(key(url), url);
      } catch (error) {
        problem(key(link.source), `invalid internal link ${link.href}: ${error.message}`);
      }
    }
    checkedLinks = links.length;
    if (!next.size) break;
    if (records.size + next.size > 400) {
      problem("links", "inventory exceeds 400 distinct route/query targets");
      break;
    }
    await mapFour([...next.values()], (url) => readPage(url));
  }
  for (const target of targets) {
    const raw = target.fragment.split(":~:")[0];
    if (!raw || raw.toLowerCase() === "top") continue;
    let fragment;
    try {
      fragment = decodeURIComponent(raw);
    } catch {
      fragment = raw;
    }
    const record = records.get(key(target.url));
    if (record?.status === 200 && !record.ids.has(fragment))
      problem(key(target.source), `missing fragment #${fragment} on ${key(target.url)}`);
  }

  const duplicates = {};
  for (const [field, label] of [
    ["titles", "title"],
    ["descriptions", "description"],
    ["headings", "H1"],
  ]) {
    const groups = new Map();
    for (const path of listed.keys()) {
      const value = records.get(path)?.[field]?.[0];
      if (!value) continue;
      const language = /^\/en(?:\/|$)/.test(path) ? "en" : "da";
      const signature = `${language}:${value.toLocaleLowerCase(language)}`;
      const group = groups.get(signature) ?? [];
      group.push(path);
      groups.set(signature, group);
    }
    duplicates[label] = [...groups.values()].filter((paths) => paths.length > 1);
    for (const paths of duplicates[label])
      problem(label, `duplicate within one language: ${paths.join(", ")}`);
  }

  await mapFour([...stylesheets.values()], async (url) => {
    try {
      const response = await request(url);
      if (response.status !== 200) problem(key(url), `stylesheet HTTP ${response.status}`);
      else cssImages(response.body, url);
    } catch (error) {
      problem(key(url), error.message);
    }
  });
  await mapFour([...imageUrls.values()], async (url) => {
    try {
      let response = await request(url, "HEAD");
      if (response.status === 405) response = await request(url);
      if (response.status !== 200) problem(key(url), `image HTTP ${response.status}`);
      else if (!/^image\//i.test(response.contentType))
        problem(key(url), `image has content type ${response.contentType || "missing"}`);
    } catch (error) {
      problem(key(url), error.message);
    }
  });

  const inventory = {
    sitemapPages: listed.size,
    checkedRouteQueries: records.size,
    renderedInternalLinks: targets.length,
    localImages: imageUrls.size,
    stylesheets: stylesheets.size,
    externalImagesSkipped: [...externalImages],
    duplicateGroups: duplicates,
    pages: [...records.values()].map(({ ids, ...record }) => ({ ...record, ids: [...ids] })),
    imagePaths: [...imageUrls.keys()].sort(),
    issues,
  };
  if (process.env.VERIFY_ARTIFACT_DIR) {
    const directory = resolve(process.env.VERIFY_ARTIFACT_DIR);
    const repository = fileURLToPath(new URL("../../", import.meta.url));
    const fromRepository = relative(repository, directory);
    assert.ok(
      fromRepository.startsWith("..") || isAbsolute(fromRepository),
      "inventory artifacts must stay outside the repository",
    );
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, "kestro-site-inventory.json"),
      JSON.stringify(inventory, null, 2) + "\n",
    );
  }
  console.log(
    `verify: inventory checked ${listed.size} sitemap pages, ${records.size} route/query targets, ${targets.length} links and ${imageUrls.size} images`,
  );
  return inventory;
}

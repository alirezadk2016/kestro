/** @type {import('next').NextConfig} */

/*
 * Security headers.
 *
 * The site is static, fonts are self-hosted by next/font and every image is
 * local, so the policy stays tight: the only external origin allowed is
 * Google's tag, and it is only ever requested after a visitor has accepted
 * statistics. Listing it here does not load it — components/Analytics.tsx
 * decides that — it only means the browser will not block it when it does.
 *
 * script-src keeps 'unsafe-inline' because Next inlines its hydration script
 * into statically generated HTML, and a per-request nonce cannot match a
 * cached page. With no third-party scripts and no user-generated content on
 * the site, the practical XSS surface is the JSON-LD block, which is escaped
 * where it is written.
 */
/*
 * No Vercel host is listed here and none is missing.
 *
 * Vercel's analytics and speed-insights clients are served from this site's
 * own origin in production — /_vercel/insights/script.js and its collector —
 * so 'self' already covers both the script and the beacon. The external
 * va.vercel-scripts.com address in the package is the debug build, used only
 * when running locally, where this policy is not served.
 *
 * Being first-party is also why they are worth having: nothing to allow, and
 * far less of the traffic lost to blockers than a third-party tag.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  /* These four fall back to default-src 'self' anyway, so they close nothing
     that was open — they are written out so the policy states its own intent
     rather than leaving a reader to derive it, and so a later change to
     default-src cannot quietly widen them. The site frames nothing, registers
     no service worker, ships no manifest and plays no media. */
  "frame-src 'none'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "media-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  /*
   * Cross-origin isolation, to the extent a site like this needs it.
   *
   * COOP severs the window.opener relationship, so a page that opens this one
   * cannot reach into it. CORP stops another origin embedding our responses as
   * a subresource — the read half of what frame-ancestors already refuses for
   * framing. Both are same-origin because nothing here is meant to be consumed
   * from anywhere else: no embeds, no widget, no cross-site API.
   *
   * COEP is deliberately not set. It would buy nothing without cross-origin
   * isolation being needed, and it breaks any third-party resource that does
   * not send CORP — including the tag, once statistics are accepted.
   */
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  /* Legacy Flash and PDF cross-domain policy files. Nothing here serves one,
     and this says so rather than leaving the default to the reader. */
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

/*
 * The three URLs step 3 folded into other pages.
 *
 * 301, not 308 or a deletion: each of these is in the sitemap today and may
 * carry something, and there is no Search Console history in this repository
 * to check whether it does. A permanent redirect keeps whatever equity exists
 * and costs nothing if there is none — a 404 would throw it away to save a
 * line of config.
 *
 * Both languages, always. A redirect on /produkter/gaming without one on
 * /en/produkter/gaming leaves half the hreflang cluster pointing at a page
 * that no longer answers.
 *
 * These run before middleware, so the rewrite to /da never sees them.
 */
const seoRedirects = [
  // Same intent as /tilbud, thinner page, worse form.
  ["/flaadeloesninger/forespoergsel", "/tilbud"],
  // No B2B intent to assign: wrong audience for the rest of the site.
  ["/produkter/gaming", "/produkter"],
  // Folded into the phones page, where a buyer of company phones looks.
  ["/produkter/smartwatches", "/produkter/smartphones"],
];

/*
 * The English tree's own addresses.
 *
 * Every English page used to sit on the Danish slug — /en/produkter,
 * /en/saelg-til-os, /en/vejledninger — so an English URL contained no English
 * at all, and the transliterated digraphs read as noise to the person deciding
 * whether to click. The route folders stay Danish, because that is the page's
 * identity everywhere else in the codebase; only the address changes.
 *
 * Kept in lockstep with lib/routes.ts, which is what localePath renders from.
 * If the two ever disagree, the site links to an address that does not resolve
 * — so the pair is checked in scripts/verify/content.mjs rather than trusted.
 *
 * Danish URLs do not move. Every old English URL keeps answering, with a 301
 * to its new address.
 */
const englishRoutes = [
  ["/flaadeloesninger", "/fleet-solutions"],
  ["/produkter", "/products"],
  ["/modeller", "/models"],
  ["/maskinen", "/inside-the-machine"],
  ["/kvalitet", "/condition-and-quality"],
  ["/priser", "/pricing"],
  ["/tilbud-eksempel", "/sample-quote"],
  ["/vejledninger", "/knowledge"],
  ["/saelg-til-os", "/sell-to-us"],
  ["/reparation", "/repairs"],
  ["/ydelser", "/services"],
  ["/tilbud", "/get-a-quote"],
  ["/om-os", "/about-us"],
  ["/kontakt", "/contact"],
  ["/privatlivspolitik", "/privacy-policy"],
  ["/handelsbetingelser", "/terms-of-sale"],

  /* Stage two: the slugs. Kept byte-identical to englishPath in lib/routes.ts —
     next.config.mjs cannot import TypeScript, so the list exists twice and
     scripts/verify asserts the two are the same. */
  ["/vejledninger/windows-10-support-slutter", "/knowledge/windows-10-end-of-support"],
  ["/vejledninger/refurbished-eller-brugt", "/knowledge/refurbished-or-used"],
  ["/vejledninger/reparere-eller-koebe-ny", "/knowledge/repair-or-replace"],
  ["/vejledninger/opgrader-ram-i-baerbar", "/knowledge/upgrade-laptop-memory"],
  ["/vejledninger/tjek-brugt-baerbar-foer-koeb", "/knowledge/check-a-used-laptop"],
  ["/vejledninger/samle-din-egen-pc", "/knowledge/build-your-own-pc"],
  ["/vejledninger/windows-11-paa-aeldre-maskine", "/knowledge/windows-11-on-older-hardware"],
  ["/vejledninger/slet-data-foer-du-saelger", "/knowledge/erase-data-before-selling"],
  ["/vejledninger/vaelg-erhvervsbaerbar", "/knowledge/thinkpad-vs-elitebook-vs-latitude"],
  ["/produkter/baerbare-computere", "/products/business-laptops"],
  ["/produkter/stationaere-computere", "/products/desktop-computers"],
  ["/produkter/skaerme", "/products/monitors"],
  ["/produkter/dockingstationer", "/products/docking-stations"],
  ["/ydelser/sourcing-og-indkoeb", "/services/sourcing-and-purchasing"],
  ["/ydelser/klargoering-og-test", "/services/preparation-and-testing"],
  ["/ydelser/nordisk-tilpasning", "/services/nordic-preparation"],
  ["/ydelser/opstart-af-arbejdspladser", "/services/workstation-setup"],
  ["/ydelser/overskudslager-og-returvarer", "/services/overstock-and-returns"],
  ["/ydelser/levering", "/services/delivery"],
];

/* Deepest first.
 *
 * Both the rewrites and the redirects below are emitted in this order, and
 * order decides the match. "/vejledninger" -> "/knowledge" generates a
 * wildcard rewrite of /en/knowledge/:path* onto /en/vejledninger/:path*; if it
 * were emitted before the entry for a specific guide, /en/knowledge/repair-or-
 * replace would be rewritten to /en/vejledninger/repair-or-replace, which is
 * not a route, and every English guide would 404. Sorting by segment count
 * puts every whole-path entry in front of the section it belongs to. */
englishRoutes.sort((a, b) => b[0].split("/").length - a[0].split("/").length);

/**
 * The English address of a Danish path, for the redirect targets below.
 *
 * Only the leading segment is translated, which is all englishRoutes covers:
 * /produkter/smartphones becomes /products/smartphones and a slug that has no
 * English form of its own is left alone.
 */
function toEnglish(path) {
  for (const [da, en] of englishRoutes) {
    if (path === da) return en;
    if (path.startsWith(`${da}/`)) return en + path.slice(da.length);
  }
  return path;
}

const nextConfig = {
  // Do not advertise the framework and its version.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /*
       * The panel, kept out of the index.
       *
       * A header rather than only the metadata robots tag, because this covers
       * the API routes under it too — those render no HTML and so have nowhere
       * to put a meta tag. Neither is the access control: the session is. This
       * is so a panel that is briefly misconfigured does not end up in a
       * search result.
       */
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
  async rewrites() {
    /* The English address serves the Danish route folder. A rewrite, not a
       redirect: the address in the bar stays English, which is the whole
       point, while Next resolves it against app/[lang]/<danish>/. */
    return englishRoutes.flatMap(([da, en]) => [
      { source: `/en${en}`, destination: `/en${da}` },
      { source: `/en${en}/:path*`, destination: `/en${da}/:path*` },
    ]);
  },
  async redirects() {
    return [
      ...seoRedirects.flatMap(([from, to]) => [
        /* 301 rather than `permanent: true`, which Next emits as 308. Google
           treats the two the same, but the approved plan says 301 and some
           older crawlers still handle it more predictably. */
        { source: from, destination: to, statusCode: 301 },
        /* Straight to the English destination's English address, not to its
           Danish one. Pointing /en/produkter/gaming at /en/produkter made two
           hops, because that address then 301s again to /en/products — and a
           chain is crawled more slowly and passes less than a single hop.
           Sending it to /en/products directly ends it in one. */
        { source: `/en${from}`, destination: `/en${toEnglish(to)}`, statusCode: 301 },
      ]),
      /* The old English addresses, permanently. Listed before nothing and
         after the folds above, so a page that was folded away is folded first
         rather than being redirected to an address that then redirects again. */
      ...englishRoutes.flatMap(([da, en]) => [
        { source: `/en${da}`, destination: `/en${en}`, statusCode: 301 },
        { source: `/en${da}/:path*`, destination: `/en${en}/:path*`, statusCode: 301 },
      ]),
      /*
       * The half-translated address, permanently.
       *
       * Stage one gave the sections English names and left the slugs alone, so
       * for a while the live address of an English guide was
       * /en/knowledge/reparere-eller-koebe-ny — a form neither map above
       * produces now. The entries above only cover the fully Danish path. This
       * folds the half-way address onto the finished one in a single hop.
       *
       * Only for entries that carry a slug: for a plain section both sides of
       * this pair would be the same address, and a rule whose source equals
       * its destination is a redirect loop.
       */
      ...englishRoutes
        .filter(([da]) => da.split("/").length > 2)
        .map(([da, en]) => ({
          source: `/en${en.slice(0, en.lastIndexOf("/"))}${da.slice(da.lastIndexOf("/"))}`,
          destination: `/en${en}`,
          statusCode: 301,
        })),
    ];
  },
};

export default nextConfig;

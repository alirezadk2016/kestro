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

const nextConfig = {
  // Do not advertise the framework and its version.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return seoRedirects.flatMap(([from, to]) => [
      /* 301 rather than `permanent: true`, which Next emits as 308. Google
         treats the two the same, but the approved plan says 301 and some
         older crawlers still handle it more predictably. */
      { source: from, destination: to, statusCode: 301 },
      { source: `/en${from}`, destination: `/en${to}`, statusCode: 301 },
    ]);
  },
};

export default nextConfig;

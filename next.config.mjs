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
];

const nextConfig = {
  // Do not advertise the framework and its version.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

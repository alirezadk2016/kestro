import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import NotFoundPanel from "@/components/NotFoundPanel";

/*
 * The 404, and the only one. It carries its own <html> and <body> because
 * nothing renders above it: this app has no app/layout.tsx — the root layout
 * is app/[lang]/layout.tsx, which is what makes /produkter and /en/products
 * two addresses of one tree — and a not-found document sits outside the
 * language segment entirely.
 *
 * It is reached the way it is on purpose. app/[lang]/layout.tsx sets
 * dynamicParams = false, so an address that is not a real route is refused by
 * the router rather than accepted and then refused by a page, and Next serves
 * this document prerendered. Calling notFound() from a page instead produces
 * the right status code and an empty body — see the note on that line for the
 * measurement.
 *
 * The cost is the header and the footer, which cannot be drawn without a
 * language and are not worth guessing one for. NotFoundPanel answers in both
 * languages and offers seven ways on, which is more than a nav bar would.
 *
 * One case is still only as good as the visitor's JavaScript: an unknown slug
 * under a Danish section — /produkter/<typo>, /modeller/<typo> — where
 * middleware has rewritten the address to /da/... . Next will not serve a
 * prerendered document for a route it refused while a middleware rewrite is in
 * flight, so it renders instead and the body arrives empty. The same slug at
 * its /da/ or /en/ address, and every address that matches no route at all,
 * gets this document whole. Measured, same build:
 *
 *   /produkter/ikke-en-model      404    7 words   x-middleware-rewrite
 *   /da/produkter/ikke-en-model   404   87 words   x-nextjs-prerender: 1
 *   /en/products/not-a-thing      404   87 words   x-nextjs-prerender: 1
 *   /denne-side-findes-ikke-xyz   404   87 words   x-nextjs-prerender: 1
 *
 * Closing it would mean teaching middleware every valid slug on the site — a
 * second copy of the routing table, shipped to the edge and consulted on every
 * request — to save the body of a page whose status code, title and
 * `noindex` are already right. Not worth the weight.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Siden blev ikke fundet | Kestro",
  description:
    "Siden findes ikke længere, eller adressen er skrevet forkert. Her er vejene videre.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <html lang="da">
      <body
        className={`${jakarta.variable} min-h-dvh bg-brand-950 font-sans text-paper antialiased`}
      >
        <NotFoundPanel />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import { company } from "@/lib/company";
import { langs, htmlLang, isLang, metaFor, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/* One family for the whole site. The wordmark is set in it too, so a heading
   next to the logo is the same letterforms rather than a near-miss. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

/*
 * Only "da" and "en" are languages.
 *
 * Without this, anything with a dot in it that middleware leaves alone —
 * /index.html, /wp-login.php, /style.css, and every path a scanner tries all
 * night — matched this segment with lang="index.html". The layout calls
 * notFound() for that, but the page beside it renders in parallel and reaches
 * copy[lang] first, throws, and the request comes back 500 instead of 404.
 *
 * Google treats a 5xx as "the host is unwell" and slows the crawl of the whole
 * site; a 404 costs nothing. Rejecting the param at the routing layer fixes it
 * for every page at once rather than one guard per file.
 */
export const dynamicParams = false;

const meta = {
  da: {
    title: "Kestro | Renoveret IT-hardware til virksomheder",
    description:
      "Kestro leverer kvalitetstestede, renoverede computere til danske og norske virksomheder, klargjort med opgraderet RAM og nordisk tastatur.",
  },
  en: {
    title: "Kestro | Refurbished IT hardware for businesses",
    description:
      "Kestro supplies tested, refurbished computers to companies in Denmark and Norway, prepared with upgraded memory and a Nordic keyboard.",
  },
} satisfies Record<Lang, { title: string; description: string }>;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "da";

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: meta[lang].title,
    description: meta[lang].description,
    ...metaFor("/", lang),
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  if (!isLang(params.lang)) notFound();
  const lang: Lang = params.lang;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: company.name,
    url: SITE_ORIGIN,
    description: meta[lang].description,
    email: company.email,
    ...(company.phoneDisplay ? { telephone: company.phoneDisplay } : {}),
    /* Street and CVR are added to the schema the moment they exist in
       lib/company.ts, so the structured data never claims an address the site
       does not show. */
    address: {
      "@type": "PostalAddress",
      ...(company.street ? { streetAddress: company.street } : {}),
      ...(company.postcode ? { postalCode: company.postcode } : {}),
      addressLocality: company.city,
      addressCountry: "DK",
    },
    ...(company.cvr ? { vatID: `DK${company.cvr.replace(/\D/g, "")}`, taxID: company.cvr } : {}),
    areaServed: ["DK", "NO"],
    contactPoint: {
      "@type": "ContactPoint",
      ...(company.phoneDisplay ? { telephone: company.phoneDisplay } : {}),
      email: company.email,
      contactType: "sales",
      areaServed: ["DK", "NO"],
      availableLanguage: ["da", "en"],
    },
  };

  /*
   * The site as an entity, alongside the company that runs it.
   *
   * Organization says who Kestro is; this says what kestro.dk is and which
   * language you are looking at, which is what lets Google tie the Danish and
   * English trees together as one site rather than two. No SearchAction: the
   * site has no search page, and declaring one that does not exist is the kind
   * of structured data that earns a manual action rather than a sitelink.
   */
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: company.name,
    url: lang === "da" ? SITE_ORIGIN : `${SITE_ORIGIN}/en`,
    description: meta[lang].description,
    inLanguage: lang === "da" ? "da-DK" : "en",
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  return (
    <html lang={htmlLang[lang]}>
      <body className={`${jakarta.variable} bg-brand-950 font-sans text-paper antialiased`}>
        <script
          type="application/ld+json"
          // Escape the angle bracket so a value can never close the script
          // tag early. Everything here is our own data today, but the escape
          // costs nothing and stops that from becoming a rule to remember.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header lang={lang} />
        <main id="indhold" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer lang={lang} />
        <Reveal />
        <ConsentBanner lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}

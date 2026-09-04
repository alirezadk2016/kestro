import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Analytics from "@/components/Analytics";
/* Aliased: the project already has a component called Analytics, and it is
   the Google one. Two different collectors with one name in one file is a
   mistake waiting to be made. */
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConsentBanner from "@/components/ConsentBanner";
import LanguageHint, { languageHintScript } from "@/components/LanguageHint";
import { company } from "@/lib/company";
import { langs, htmlLang, isLang, metaFor, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * One family for the whole site. The wordmark is set in it too, so a heading
 * next to the logo is the same letterforms rather than a near-miss.
 *
 * adjustFontFallback is off on purpose, and the fallback face is written by
 * hand in globals.css instead. Next's own version is `src: local("Arial")`,
 * and Chromium resolves local() by exact family name rather than through
 * fontconfig aliases — so on Android and most Linux, where nothing is
 * literally called Arial, that face never loads. Text then renders in
 * system-ui with none of the metric overrides, and when Plus Jakarta Sans
 * finally swaps in, every line box changes height at once.
 *
 * Measured on a 390px viewport at Slow 4G and 4x CPU: CLS 0.259 on every page
 * for a browser whose language is not Scandinavian, which is where the
 * language bar at the top of the document turns a 16px height change into a
 * shift of the whole page. Google's "poor" band starts at 0.25. With a
 * fallback face that resolves, the same measurement is 0.000.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
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
    title: "Refurbished erhvervscomputere til virksomheder | Kestro",
    description:
      "Kestro skaffer refurbished erhvervscomputere til danske og norske virksomheder. Pris, stand og garantivilkår står skriftligt, før I bestiller.",
  },
  en: {
    title: "Refurbished business computers for companies | Kestro",
    description:
      "Kestro sources refurbished business computers for companies in Denmark and Norway. Price, condition and warranty terms in writing before you order.",
  },
} satisfies Record<Lang, { title: string; description: string }>;

/*
 * The Search Console and Bing ownership tags, if there are any.
 *
 * Without a verified property nobody can see a single search impression: the
 * site can rank and be clicked and the only record of it is in Google's, not
 * ours. Verification is one meta tag, but the token is issued per property and
 * is not something that can be written here in advance — so it is read from
 * the environment and the tag simply does not render until it is set.
 *
 * That means verifying is a variable in Vercel and a redeploy, with no code
 * change and no commit. DNS verification stays the better option where the
 * domain's records are reachable; this is the fallback that always works.
 *
 * Not a secret: the token is a public claim of ownership, visible in the page
 * source of every verified site on the web. It is an environment variable
 * because it differs per deployment, not because it needs hiding.
 */
const verification = {
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
    : {}),
};

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "da";

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: meta[lang].title,
    description: meta[lang].description,
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
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
    /* The mark at 512×512, from app/logo/route.tsx. Google reads `logo` for
       the knowledge panel and states a 112px minimum, so neither the 32px
       favicon nor the 1200×630 social card could stand in for it — one is too
       small and the other is not a logo. Written as an ImageObject with its
       dimensions so the size does not have to be fetched to be known. */
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/logo`,
      width: 512,
      height: 512,
      caption: company.name,
    },
    /* The same file again as the organisation's general image. Distinct
       property, same asset: `logo` is the mark, `image` is what may be shown
       beside the entity. */
    image: `${SITE_ORIGIN}/logo`,
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
    /* The profiles that are this same organisation elsewhere. sameAs is how a
       search engine resolves three separate pages to one entity instead of
       guessing, and it reads from the same list the footer links from. */
    sameAs: company.social.map((profile) => profile.href),
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
        {lang === "da" && (
          <>
            {/* Before the bar below is parsed, so the first paint is already
                right and nothing shifts once React boots. */}
            <script dangerouslySetInnerHTML={{ __html: languageHintScript }} />
            <LanguageHint />
          </>
        )}
        <Header lang={lang} />
        <main id="indhold" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer lang={lang} />
        <Reveal />
        <ConsentBanner lang={lang} />
        <Analytics />
        {/*
         * Vercel's own two, beside Google's.
         *
         * The dashboard read zero visitors for the life of the site, and it
         * was right to: switching Web Analytics on in Vercel only opens the
         * endpoint. Nothing reports to it until the page ships the client that
         * pings it, and the project had never installed one. Zero meant
         * "nothing was ever sent", not "nobody came".
         *
         * These are deliberately not behind the consent banner, and Google's
         * tag deliberately still is. The difference is what each one does:
         * gtag sets identifiers and belongs to an advertising business, so it
         * is asked for. Vercel's collector sets no cookie, writes nothing to
         * the browser, and builds no cross-site profile — it counts a page
         * view and derives a country. That is the same footing as the server
         * log every host already keeps.
         *
         * It also fixes the hole that made the numbers useless: the tag only
         * ever counted visitors who pressed "Accepter statistik". Everyone who
         * declined or ignored the banner was invisible, and there is no way to
         * know how large that group is from inside it. This one counts
         * everybody, which is what makes a trend worth reading.
         *
         * Speed Insights is the one that matters for search: every Core Web
         * Vital measured so far has been a lab number from a throttled
         * headless browser here. This is field data from real devices, which
         * is the kind Google actually ranks on.
         *
         * Both are declared in the privacy policy. If this should sit behind
         * the banner after all, it is one condition here and nothing else.
         *
         * Only on Vercel, and that is not a detail. Both clients load from
         * /_vercel/…, which Vercel's edge serves and Next does not — so
         * everywhere else the browser gets a 404, refuses the HTML as a
         * script, and logs two errors on every page. The verify suite checks
         * the console on every route and caught exactly that. Teaching the
         * check to ignore it would have blunted a guard that has already
         * caught a real bug in this project; mounting them only where they
         * resolve costs nothing and leaves the console clean everywhere.
         */}
        {process.env.VERCEL && (
          <>
            <VercelAnalytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}

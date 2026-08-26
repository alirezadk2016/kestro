import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { company } from "@/lib/company";
import { langs, htmlLang, isLang, alternatesFor, type Lang } from "@/lib/i18n";

/* One family for the whole site. The wordmark is set in Manrope, so a heading
   next to the logo is the same letterforms rather than a near-miss. */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

const meta = {
  da: {
    title: "Kestro | Renoveret IT-hardware til virksomheder",
    description:
      "Kestro leverer kvalitetstestede, renoverede computere til danske og norske virksomheder – klargjort til det nordiske marked med opgraderet RAM og nordisk tastatur.",
  },
  en: {
    title: "Kestro | Refurbished IT hardware for businesses",
    description:
      "Kestro supplies tested, refurbished computers to companies in Denmark and Norway — prepared for the Nordic market with upgraded memory and a Nordic keyboard.",
  },
} satisfies Record<Lang, { title: string; description: string }>;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "da";

  return {
    metadataBase: new URL("https://www.kestro.dk"),
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: alternatesFor("/", lang),
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
    name: company.name,
    url: "https://www.kestro.dk",
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

  return (
    <html lang={htmlLang[lang]}>
      <body className={`${manrope.variable} bg-paper font-sans text-ink-900 antialiased`}>
        <script
          type="application/ld+json"
          // Escape the angle bracket so a value can never close the script
          // tag early. Everything here is our own data today, but the escape
          // costs nothing and stops that from becoming a rule to remember.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header lang={lang} />
        <main id="indhold" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer lang={lang} />
        <Reveal />
      </body>
    </html>
  );
}

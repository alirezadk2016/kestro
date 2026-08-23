import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company } from "@/lib/company";
import { langs, htmlLang, isLang, alternatesFor, type Lang } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Display face. A signage grotesque — sturdy rather than decorative, which is
   the right register for a company that sources industrial hardware. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
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
    telephone: company.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressCountry: "DK",
    },
    areaServed: ["DK", "NO"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company.phoneDisplay,
      email: company.email,
      contactType: "sales",
      areaServed: ["DK", "NO"],
      availableLanguage: ["da", "en"],
    },
  };

  return (
    <html lang={htmlLang[lang]}>
      <body className={`${inter.variable} ${archivo.variable} bg-paper font-sans text-ink-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}

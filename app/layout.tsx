import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kestro.dk"),
  title: "Kestro | Renoveret IT-hardware til virksomheder",
  description:
    "Kestro leverer kvalitetstestede, renoverede computere til danske og norske virksomheder – klargjort til det nordiske marked med opgraderet RAM og nordisk tastatur.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kestro",
  url: "https://www.kestro.dk",
  description:
    "Kestro leverer kvalitetstestede, renoverede computere til danske og norske virksomheder.",
  areaServed: ["DK", "NO"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

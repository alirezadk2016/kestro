import type { Metadata } from "next";
import Link from "next/link";
import {
  Laptop,
  Monitor,
  HardDrive,
  Tablet,
  Smartphone,
  Watch,
  Cable,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Produkter | Renoveret IT-udstyr til erhverv | Kestro",
  description:
    "Se vores kategorier af renoveret IT-udstyr: bærbare, stationære, mini-pc'er, tablets, smartphones, smartwatches, dockingstationer og gaming.",
  alternates: { canonical: "/produkter" },
};

const icons: Record<string, LucideIcon> = {
  "baerbare-computere": Laptop,
  "stationaere-computere": Monitor,
  "mini-pc": HardDrive,
  tablets: Tablet,
  smartphones: Smartphone,
  smartwatches: Watch,
  dockingstationer: Cable,
  gaming: Gamepad2,
};

export default function ProdukterPage() {
  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Produkter"
            description="Vi sourcer renoveret IT-udstyr per ordre – fra enkelte enheder til hele arbejdspladser. Vælg en kategori for at se, hvad vi typisk kan skaffe."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = icons[category.slug] ?? Laptop;
              return (
                <Link
                  key={category.slug}
                  href={`/produkter/${category.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-brand-700">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Se kategori
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Finder I ikke det, I leder efter?
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Vi holder ikke fast lager, men sourcer til den enkelte ordre. Det betyder, at vi ofte
              kan skaffe udstyr uden for de kategorier, der er vist her. Fortæl os, hvad I har brug
              for.
            </p>
            <Link
              href="/kontakt"
              className="mt-5 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Spørg efter en model
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

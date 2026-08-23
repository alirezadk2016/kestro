import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import QualifySection from "@/components/QualifySection";
import { categories } from "@/lib/categories";
import { getCategoryIcon } from "@/lib/category-icons";

export const metadata: Metadata = {
  title: "Hvad vi skaffer | Renoveret IT-udstyr til erhverv | Kestro",
  description:
    "Kestro er indkøbspartner på renoveret IT-udstyr: bærbare, stationære, mini-pc'er, tablets, smartphones, smartwatches, docking og gaming – sourcet til jeres ordre.",
  alternates: { canonical: "/produkter" },
};

export default function ProdukterPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Hvad vi skaffer"
            description="Kestro er indkøbspartner, ikke webshop. I fortæller, hvad I har brug for – vi finder det i vores leverandørnetværk, tester det og leverer det klar til brug."
          />

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Derfor finder I ingen priser eller lagerstatus her
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Vi køber ikke ind på forhånd og sidder ikke med et fast lager, I skal vælge fra. I
              stedet sourcer vi til den enkelte ordre. Fordelen for jer er, at I får de
              specifikationer, opgaven kræver – ikke bare det, der tilfældigvis står på hylden – og
              at I ikke betaler for et lager, andre skal have afsat.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Kategorierne nedenfor viser, hvad vi typisk kan skaffe, og hvilke mærker vi arbejder
              med. Pris og leveringstid aftaler vi ud fra jeres konkrete behov – og står det, I
              søger, ikke på listen, kan vi som regel skaffe det alligevel.
            </p>
          </div>

          <h2 className="mt-14 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kategorier
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/produkter/${category.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Se kategori
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>

        </Container>
      </section>

      <QualifySection />

      <CtaSection />
    </>
  );
}

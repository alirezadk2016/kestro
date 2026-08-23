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

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/produkter/${category.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-brand-700 sm:mt-4 sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                    {category.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 sm:mt-4 sm:text-sm">
                    Se kategori
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Vil I se konkrete modeller?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
              Vi har samlet de maskiner, vi oftest bliver bedt om at skaffe – ThinkPad, EliteBook,
              Latitude, EliteDesk og flere – med specifikationer og hvad de hver især egner sig til.
              Ingen priser og ingen lagerstatus: det er en oversigt, ikke en butik.
            </p>
            <Link
              href="/modeller"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-600 px-6 text-base font-semibold text-white transition hover:bg-brand-700"
            >
              Se modeloversigten
            </Link>
          </div>
        </Container>
      </section>

      <QualifySection />

      <CtaSection />
    </>
  );
}

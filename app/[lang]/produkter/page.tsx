import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import QualifySection from "@/components/QualifySection";
import { categories } from "@/lib/categories";
import { getCategoryIcon } from "@/lib/category-icons";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Hvad vi skaffer | Renoveret IT-udstyr til erhverv | Kestro",
    metaDescription:
      "Kestro er indkøbspartner på renoveret IT-udstyr: bærbare, stationære, mini-pc'er, tablets, smartphones, smartwatches, docking og gaming – sourcet til jeres ordre.",
    title: "Hvad vi skaffer",
    description:
      "Kestro er indkøbspartner, ikke webshop. I fortæller, hvad I har brug for – vi finder det i vores leverandørnetværk, tester det og leverer det klar til brug.",
    noPricesTitle: "Derfor finder I ingen priser eller lagerstatus her",
    noPrices1:
      "Vi køber ikke ind på forhånd og sidder ikke med et fast lager, I skal vælge fra. I stedet sourcer vi til den enkelte ordre. Fordelen for jer er, at I får de specifikationer, opgaven kræver – ikke bare det, der tilfældigvis står på hylden – og at I ikke betaler for et lager, andre skal have afsat.",
    noPrices2:
      "Kategorierne nedenfor viser, hvad vi typisk kan skaffe, og hvilke mærker vi arbejder med. Pris og leveringstid aftaler vi ud fra jeres konkrete behov – og står det, I søger, ikke på listen, kan vi som regel skaffe det alligevel.",
    categories: "Kategorier",
    seeCategory: "Se kategori",
    modelsTitle: "Vil I se konkrete modeller?",
    modelsBody:
      "Vi har samlet de maskiner, vi oftest bliver bedt om at skaffe – ThinkPad, EliteBook, Latitude, EliteDesk og flere – med specifikationer og hvad de hver især egner sig til. Ingen priser og ingen lagerstatus: det er en oversigt, ikke en butik.",
    modelsButton: "Se modeloversigten",
  },
  en: {
    metaTitle: "What we source | Refurbished business IT | Kestro",
    metaDescription:
      "Kestro is a sourcing partner for refurbished IT: laptops, desktops, mini PCs, monitors, tablets, smartphones, smartwatches, docking and gaming — sourced for your order.",
    title: "What we source",
    description:
      "Kestro is a sourcing partner, not a web shop. You tell us what you need — we find it in our supplier network, test it and deliver it ready to use.",
    noPricesTitle: "Why there are no prices or stock levels here",
    noPrices1:
      "We do not buy ahead, and we do not sit on a fixed stock for you to choose from. We source for the individual order instead. The advantage for you is that you get the specifications the job needs — not simply what happens to be on a shelf — and you are not paying for inventory somebody else has to clear.",
    noPrices2:
      "The categories below show what we can normally get and which brands we work with. Price and lead time are agreed from your specific needs — and if what you are after is not on the list, we can usually still get it.",
    categories: "Categories",
    seeCategory: "See category",
    modelsTitle: "Want to see specific models?",
    modelsBody:
      "We have collected the machines we are asked for most often — ThinkPad, EliteBook, Latitude, EliteDesk and more — with specifications and what each one suits. No prices and no stock levels: it is an overview, not a shop.",
    modelsButton: "See the model overview",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/produkter", params.lang),
  };
}

export default function ProdukterPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
          />

          <div className="mx-auto mt-10 max-w-3xl border border-paper-edge bg-paper-dim p-6 sm:p-8">
            <h2 className="text-base font-semibold text-ink-900">
              {c.noPricesTitle}
            </h2>
            <p className="mt-2 text-base leading-7 text-ink-600">{c.noPrices1}</p>
            <p className="mt-3 text-base leading-7 text-ink-600">{c.noPrices2}</p>
          </div>

          <h2 className="mt-14 text-center text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {c.categories}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="group flex flex-col border border-paper-edge bg-white p-4 transition hover:border-ink-400 sm:p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-800 sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink-900 group-hover:text-ink-900 sm:mt-4 sm:text-base">
                    {category.name[lang]}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-5 text-ink-600 sm:mt-2 sm:text-sm sm:leading-6">
                    {category.tagline[lang]}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 sm:mt-4 sm:text-sm">
                    {c.seeCategory}
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-14 max-w-3xl border border-paper-edge bg-white p-6 text-center shadow-sm sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
              {c.modelsTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-600">{c.modelsBody}</p>
            <Link
              href={localePath("/modeller", lang)}
              className="mt-6 inline-flex min-h-[48px] items-center justify-center bg-brand-950 px-7 text-base font-semibold tracking-tight text-paper transition hover:bg-brand-800"
            >
              {c.modelsButton}
            </Link>
          </div>
        </Container>
      </section>

      <QualifySection lang={lang} />

      <CtaSection lang={lang} />
    </>
  );
}

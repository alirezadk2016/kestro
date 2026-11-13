import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import CategoryArtwork from "./CategoryArtwork";
import { localePath, type Lang } from "@/lib/i18n";

const cards = [
  {
    slug: "baerbare-computere",
    title: { da: "Bærbare", en: "Laptops" },
    purpose: { da: "Arbejde på kontoret og på farten", en: "For the office and work on the move" },
  },
  {
    slug: "stationaere-computere",
    title: { da: "Stationære", en: "Desktop PCs" },
    purpose: { da: "En fast arbejdsplads", en: "For a fixed workstation" },
  },
  {
    slug: "skaerme",
    title: { da: "Skærme", en: "Monitors" },
    purpose: { da: "Mere plads til arbejdet", en: "More room for your work" },
  },
  {
    slug: "mini-pc",
    title: { da: "Mini-pc'er", en: "Mini PCs" },
    purpose: { da: "Et kompakt skrivebord", en: "For a compact desk setup" },
  },
];

export default function CategoryCards({ lang }: { lang: Lang }) {
  const da = lang === "da";
  return (
    <section className="border-b border-white/10 py-6 sm:py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <div>
            <h2 className="font-display t-h2 font-extrabold tracking-display text-paper">
              {da ? "Vælg udstyrstype" : "Choose your equipment"}
            </h2>
          </div>
          <Link
            href={localePath("/produkter", lang)}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
          >
            {da ? "Se alle 7 kategorier" : "See all 7 categories"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.slug}>
              <Link
                href={localePath(`/produkter/${card.slug}`, lang)}
                className="group block h-full overflow-hidden rounded-xl bg-paper-dim text-ink-900 ring-1 ring-inset ring-white/10 transition-shadow hover:ring-2 hover:ring-brand-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <CategoryArtwork
                  slug={card.slug}
                  lang={lang}
                  sizes="(min-width: 1024px) 24vw, 46vw"
                />
                <div className="flex items-start justify-between gap-2 border-t border-ink-200 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-snug text-ink-900 group-hover:text-brand-700 sm:text-base">
                      {card.title[lang]}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-ink-600">{card.purpose[lang]}</p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="mt-0.5 shrink-0 text-brand-700"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-paper/65">
          {da
            ? "Billederne viser udstyrstyper og modelreferencer, ikke enheder på lager."
            : "Images show equipment types and model references, not units in stock."}
        </p>
      </Container>
    </section>
  );
}

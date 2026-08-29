import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The four things a buyer is most often after, as picture cards.
 *
 * The captions are rendered here rather than baked into the images, so they
 * exist in both languages, a screen reader reads them, and a search engine
 * indexes them — the same reason the burnt-in captions came off the old hero
 * frames. The images carry the product and nothing else.
 *
 * Every card links to a page that already exists and already describes what it
 * claims; nothing here introduces a category the site cannot back.
 */
const cards = [
  {
    href: "/produkter/baerbare-computere",
    image: "/cards/cat-laptops.webp",
    width: 247,
    height: 116,
    title: { da: "Bærbare computere", en: "Business laptops" },
    brands: "Lenovo · HP · Dell",
    alt: {
      da: "Åben bærbar erhvervscomputer set fra siden",
      en: "An open business laptop seen from the side",
    },
  },
  {
    href: "/produkter/stationaere-computere",
    image: "/cards/cat-desktops.webp",
    width: 237,
    height: 116,
    title: { da: "Stationære computere", en: "Desktop PCs" },
    brands: "HP · Dell · Lenovo",
    alt: {
      da: "Stationær computer og en mini-pc side om side",
      en: "A desktop tower and a mini PC side by side",
    },
  },
  {
    href: "/produkter/skaerme",
    image: "/cards/cat-monitors.webp",
    width: 252,
    height: 116,
    title: { da: "Skærme og docking", en: "Monitors and docks" },
    brands: "Dell · Lenovo · HP",
    alt: {
      da: "Bredformatskærm med tastatur og en dockingstation",
      en: "A widescreen monitor with a keyboard and a docking station",
    },
  },
  {
    href: "/flaadeloesninger",
    image: "/cards/cat-fleet.webp",
    width: 337,
    height: 116,
    title: { da: "Flådeløsninger", en: "Fleet solutions" },
    brands: { da: "Fra 10 til 500+ enheder", en: "From 10 to 500+ devices" },
    alt: {
      da: "En række ens bærbare computere klargjort til levering",
      en: "A row of identical laptops prepared for delivery",
    },
  },
];

const copy = {
  da: { eyebrow: "Hvad vi skaffer", title: "Vælg en kategori" },
  en: { eyebrow: "What we source", title: "Pick a category" },
} satisfies Record<Lang, Record<string, string>>;

export default function CategoryCards({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-b border-white/10 bg-brand-950 py-12 sm:py-16" data-reveal>
      <Container>
        <div className="flex items-baseline gap-4">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.href}>
              <Link
                href={localePath(card.href, lang)}
                className="group flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white/[0.07]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-950/50">
                  <Image
                    src={card.image}
                    alt={card.alt[lang]}
                    width={card.width}
                    height={card.height}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 items-end justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-paper">{card.title[lang]}</h3>
                    <p className="mt-0.5 text-xs text-paper/55">
                      {typeof card.brands === "string" ? card.brands : card.brands[lang]}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition group-hover:bg-brand-500">
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

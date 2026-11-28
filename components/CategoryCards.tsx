import Link from "next/link";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";
import { categoryMedia } from "@/lib/category-media";
import { licenceLabel } from "@/lib/credits";
import ForgedPanel from "@/components/ForgedPanel";
import CategoryArtwork from "./CategoryArtwork";

/*
 * The four things a buyer is most often after, as picture cards.
 *
 * The captions are rendered here rather than baked into the images, so they
 * exist in both languages, a screen reader reads them, and a search engine
 * indexes them.
 *
 * The pictures are the products hub's own (lib/category-media.ts) since 28
 * November 2026: a real photograph where one exists — the owner's ThinkPad
 * T480 and a licensed Dell WD19 — and a labelled drawing of the format where
 * not. The cards carried AI-generated rooms with brandless machines before,
 * and a laptop on this site is a real one.
 *
 * Every card links to a page that already exists and already describes what it
 * claims; nothing here introduces a category the site cannot back.
 */
const cards = [
  {
    slug: "baerbare-computere",
    title: { da: "Bærbare computere", en: "Business laptops" },
    brands: ["Lenovo", "HP", "Dell"],
  },
  {
    slug: "stationaere-computere",
    title: { da: "Stationære computere", en: "Desktop PCs" },
    brands: ["HP", "Dell", "Lenovo"],
  },
  {
    slug: "skaerme",
    title: { da: "Skærme", en: "Monitors" },
    brands: ["Dell", "Lenovo", "HP"],
  },
  {
    slug: "dockingstationer",
    title: { da: "Dockingstationer", en: "Docking stations" },
    brands: ["Dell", "Lenovo", "HP"],
  },
];

const copy = {
  da: {
    title: "Refurbished computere og skærme, vi skaffer",
    all: "Se alle produkter",
    note: "Fotos af en ThinkPad T480 og en Dell WD19; stationær og skærm er tegninger af formatet.",
    photo: "Foto af Dell WD19:",
  },
  en: {
    title: "Refurbished computers and monitors we source",
    all: "See all products",
    note: "Photos of a ThinkPad T480 and a Dell WD19; the desktop and monitor are drawings of the format.",
    photo: "Dell WD19 photo:",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function CategoryCards({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const dock = categoryMedia.dockingstationer.credit!;
  const list = new Intl.ListFormat(lang === "da" ? "da" : "en-GB", { type: "conjunction" });

  return (
    <section className="border-b border-white/10 bg-brand-950 py-12 sm:py-20">
      <Container>
        {/* A heading that reads as one, on the type scale like every other
            section heading, in the words a buyer searches with. */}
        <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
          {c.title}
        </h2>

        {/* Two up on a phone: as a compact grid the whole range is one
            screen, which is what a menu is for. */}
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.slug}>
              <ForgedPanel
                href={localePath(`/produkter/${card.slug}`, lang)}
                faceClassName="p-0 overflow-hidden"
              >
                <CategoryArtwork
                  slug={card.slug}
                  lang={lang}
                  sizes="(min-width: 1024px) 24vw, 46vw"
                  className="rounded-t-[7px]"
                />
                <div className="flex flex-1 items-end justify-between gap-3 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-snug text-paper sm:text-base">
                      {card.title[lang]}
                    </h3>
                    {/* A list as a sentence, as on the products hub. */}
                    <p className="mt-0.5 text-xs leading-[1.45] text-paper/65">
                      {list.format(card.brands)}
                    </p>
                  </div>
                </div>
              </ForgedPanel>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-x-6 gap-y-1 text-xs leading-5 text-paper/65 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href={localePath("/produkter", lang)}
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 hover:text-paper"
          >
            {c.all}
          </Link>
          <p className="flex flex-wrap items-center gap-x-3">
            <span>{c.note}</span>
            <span>
              {c.photo}{" "}
              <a
                href={dock.source}
                className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-paper"
              >
                {dock.author} ↗
              </a>{" "}
              <a
                href={dock.licenceUrl}
                rel="license"
                className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-paper"
              >
                {licenceLabel(dock.licence, lang)}
              </a>
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}

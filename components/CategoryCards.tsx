import Image from "next/image";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";
import ForgedPanel from "@/components/ForgedPanel";

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
    width: 1200,
    height: 675,
    title: { da: "Bærbare computere", en: "Business laptops" },
    brands: ["Lenovo", "HP", "Dell"],
    alt: {
      da: "Åben bærbar erhvervscomputer set fra siden",
      en: "An open business laptop seen from the side",
    },
  },
  {
    href: "/produkter/stationaere-computere",
    image: "/cards/cat-desktops.webp",
    width: 1200,
    height: 675,
    title: { da: "Stationære computere", en: "Desktop PCs" },
    brands: ["HP", "Dell", "Lenovo"],
    alt: {
      da: "Stationær computer og en mini-pc side om side",
      en: "A desktop tower and a mini PC side by side",
    },
  },
  {
    href: "/produkter/skaerme",
    image: "/cards/cat-monitors.webp",
    width: 1200,
    height: 675,
    title: { da: "Skærme og docking", en: "Monitors and docks" },
    brands: ["Dell", "Lenovo", "HP"],
    alt: {
      da: "Bredformatskærm med tastatur og en dockingstation",
      en: "A widescreen monitor with a keyboard and a docking station",
    },
  },
  {
    href: "/produkter",
    image: "/cards/cat-fleet.webp",
    width: 1200,
    height: 675,
    title: { da: "Alle produkter", en: "All products" },
    /* A list of kinds, not of brands, so it reads as a sentence: at
       390px the dotted version broke with a dot alone at a line's edge. */
    brands: { da: "Bærbare, skærme og tilbehør", en: "Laptops, monitors and accessories" },
    alt: {
      da: "To stakke lukkede bærbare computere og én åben bærbar på et stenbord",
      en: "Two stacks of closed laptops and one open laptop on a stone desk",
    },
  },
];

const copy = {
  da: { title: "Refurbished computere og skærme, vi skaffer" },
  en: { title: "Refurbished computers and monitors we source" },
} satisfies Record<Lang, Record<string, string>>;

export default function CategoryCards({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-b border-white/10 bg-brand-950 py-12 sm:py-20">
      <Container>
        {/* A heading that reads as one. It was an h2 set as a tracked-caps
            label ("HVAD VI SKAFFER") with a rule beside it — a heading in the
            outline and a caption on the screen, and an audit counting the
            page's h2s found a row of labels among them. Now it is set on the
            type scale like every other section heading, and it says what the
            cards are in the words a buyer searches with. */}
        <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
          {c.title}
        </h2>

        {/* Two up on a phone. Six full-bleed cards stacked was most of a
            metre of scrolling for what is a menu — as a compact grid the
            whole range is one screen, which is what a menu is for. */}
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.href}>
              <ForgedPanel href={localePath(card.href, lang)} faceClassName="p-0 overflow-hidden">
                <div className="plate-well tile-z tile-z-near aspect-[16/9] overflow-hidden rounded-t-[7px] bg-ink-950/50">
                  <Image
                    src={card.image}
                    alt={card.alt[lang]}
                    width={card.width}
                    height={card.height}
                    quality={88}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 46vw"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 items-end justify-between gap-3 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-snug text-paper sm:text-base">
                      {card.title[lang]}
                    </h3>
                    <p className="mt-0.5 text-xs text-paper/65 leading-[1.45]">
                      {/* A list as a sentence, as on the products hub: "Lenovo,
                          HP og Dell". Joined with middle dots it was template
                          chrome, and the hub said the same thing another way. */}
                      {Array.isArray(card.brands)
                        ? new Intl.ListFormat(lang === "da" ? "da" : "en-GB", {
                            type: "conjunction",
                          }).format(card.brands)
                        : card.brands[lang]}
                    </p>
                  </div>
                </div>
              </ForgedPanel>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

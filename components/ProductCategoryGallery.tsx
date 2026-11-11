import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { localePath, type Lang } from "@/lib/i18n";

/** Owned category artwork illustrates equipment types, never a stock unit. */
const artwork: Record<
  string,
  { src: string; alt: { da: string; en: string }; focusClass?: string; sizes?: string }
> = {
  "baerbare-computere": {
    src: "/cards/cat-laptops.webp",
    alt: {
      da: "Illustration af en åben bærbar erhvervscomputer",
      en: "Illustration of an open business laptop",
    },
  },
  "stationaere-computere": {
    src: "/cards/cat-desktops.webp",
    alt: {
      da: "Illustration af en stationær computer med en mini-pc ved siden af",
      en: "Illustration of a desktop tower with a mini PC beside it",
    },
  },
  skaerme: {
    src: "/cards/cat-monitors.webp",
    alt: {
      da: "Illustration af en bredformatskærm, et tastatur og en dockingstation",
      en: "Illustration of a widescreen monitor, keyboard and docking station",
    },
  },
  "mini-pc": {
    src: "/cards/cat-desktops.webp",
    // Focus the whole mini-PC, rather than the taller tower beside it.
    focusClass: "scale-[2] origin-[97.5%_95.5%]",
    sizes: "(min-width: 1536px) 42vw, (min-width: 1024px) 48vw, 92vw",
    alt: {
      da: "Illustration af en kompakt mini-pc på et arbejdsbord",
      en: "Illustration of a compact mini PC on a workbench",
    },
  },
  tablets: {
    src: "/graphics/buyback.webp",
    // The tablet remains fully framed; the laptops in the wide scene recede.
    focusClass: "scale-[2.7] origin-[99%_54%]",
    sizes: "(min-width: 1536px) 57vw, (min-width: 1024px) 65vw, 125vw",
    alt: {
      da: "Illustration af en tablet på støtteben på et arbejdsbord",
      en: "Illustration of a tablet on its stand on a workbench",
    },
  },
  smartphones: {
    src: "/graphics/smartphones.webp",
    alt: {
      da: "Illustration af smartphones og et smartwatch på et arbejdsbord",
      en: "Illustration of smartphones and a smartwatch on a workbench",
    },
  },
  dockingstationer: {
    src: "/cards/cat-monitors.webp",
    // Reveal the complete dock and its front ports, not the whole monitor scene.
    focusClass: "scale-[3.2] origin-[95.5%_90.5%]",
    sizes: "(min-width: 1536px) 68vw, (min-width: 1024px) 77vw, 149vw",
    alt: {
      da: "Illustration af en kompakt dockingstation på et skrivebord",
      en: "Illustration of a compact docking station on a desk",
    },
  },
};

export default function ProductCategoryGallery({ lang }: { lang: Lang }) {
  return (
    <section
      id="product-categories"
      aria-labelledby="product-categories-heading"
      className="mt-10 sm:mt-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2
          id="product-categories-heading"
          className="t-h2 text-balance font-display font-extrabold text-paper"
        >
          {lang === "da" ? "Vælg en kategori" : "Choose a category"}
        </h2>
        <p className="text-xs leading-5 text-paper/65">
          {lang === "da"
            ? "Billederne illustrerer udstyrstyper, ikke konkrete varer på lager."
            : "The images illustrate equipment types, not individual items in stock."}
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-cols-12 lg:gap-5">
        {categories.map((category, index) => {
          const art = artwork[category.slug];
          const featured = index < 3;
          return (
            <li
              key={category.slug}
              className={`${index === 0 ? "col-span-2" : "col-span-1"} ${featured ? "sm:col-span-2 lg:col-span-4" : "sm:col-span-3 lg:col-span-3"} min-w-0`}
            >
              <Link
                href={localePath(`/produkter/${category.slug}`, lang)}
                className="plate plate-edge plate-lift group flex h-full min-h-[44px] flex-col overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <div className="plate-well relative aspect-[16/9] flex-none overflow-hidden bg-ink-950">
                  <Image
                    src={art.src}
                    alt={art.alt[lang]}
                    fill
                    priority={index === 0}
                    sizes={
                      art.sizes ??
                      (featured
                        ? "(min-width: 1536px) 28vw, (min-width: 1024px) 32vw, (min-width: 640px) 32vw, 92vw"
                        : "(min-width: 1536px) 21vw, (min-width: 1024px) 24vw, 46vw")
                    }
                    quality={85}
                    className={`object-cover ${art.focusClass ?? ""}`}
                  />
                </div>
                <div className={`flex flex-1 flex-col p-4 ${featured ? "lg:p-6" : "lg:p-5"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-display text-base font-bold leading-snug text-paper ${featured ? "lg:text-xl" : "lg:text-lg"}`}
                    >
                      {category.slug === "dockingstationer" && lang === "da"
                        ? "Docks og tilbehør"
                        : category.name[lang]}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-0.5 hidden h-5 w-5 flex-none text-brand-300 sm:block"
                      strokeWidth={2}
                    />
                  </div>
                  <p
                    className={`${index === 0 ? "" : "hidden sm:block "}mt-2 text-sm leading-[1.6] text-paper/75`}
                  >
                    {category.tagline[lang]}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-brand-300 group-hover:text-paper">
                    {lang === "da" ? "Udforsk" : "Explore"}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

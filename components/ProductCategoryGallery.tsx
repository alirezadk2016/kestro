import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { categoryApplications, categoryMedia } from "@/lib/category-media";
import { localePath, type Lang } from "@/lib/i18n";
import { getModelsForCategory } from "@/lib/models";
import CategoryArtwork from "./CategoryArtwork";

/*
 * The products hub's directory: laptops first and large, the four other
 * equipment types beside it.
 *
 * It was seven equal tiles. Two of them, tablets and smartphones, had no
 * model and no picture — a small icon in an empty frame — and the owner read
 * the row as confusing and artificial (2026-11-14) and asked for them to go.
 * Their pages stay, linked from the header and footer; only this directory
 * leaves them out. Laptops are 59 of the 68 models and the one category with
 * a real photograph, so they lead. Every card says how many models it holds,
 * which is a fact from lib/models, not a stock level.
 *
 * The "Referencefoto"/"Illustration" label sat on every card and again in the
 * note under them; it is said once, in the note. Photos sit on the same pale
 * well as the drawings (multiplied into it), so the row reads as one set.
 */
const LEFT_OUT = new Set(["tablets", "smartphones"]);

function count(n: number, da: boolean) {
  return da ? `${n} ${n === 1 ? "model" : "modeller"}` : `${n} ${n === 1 ? "model" : "models"}`;
}

/** "Lenovo, HP og Dell", most models first. */
function brandsOf(slug: string, da: boolean) {
  const tally = new Map<string, number>();
  for (const model of getModelsForCategory(slug))
    tally.set(model.brand, (tally.get(model.brand) ?? 0) + 1);
  const names = [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([brand]) => brand);
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} ${da ? "og" : "and"} ${names.at(-1)}`;
}

export default function ProductCategoryGallery({ lang }: { lang: Lang }) {
  const da = lang === "da";
  const credits = Object.values(categoryMedia).flatMap((media) => (media.credit ? [media.credit] : []));
  const shown = categories.filter((category) => !LEFT_OUT.has(category.slug));

  return (
    <section
      id="product-categories"
      aria-labelledby="product-categories-heading"
      className="mt-7 sm:mt-10"
    >
      <h2 id="product-categories-heading" className="t-h2 font-display font-extrabold text-paper">
        {da ? "Vælg udstyrstype" : "Choose your equipment"}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
        {shown.map((category, index) => {
          const lead = index === 0;
          const models = getModelsForCategory(category.slug).length;
          /* The category is named "…og tilbehør", but its three models are
             docks; a card that promises accessories sends a buyer to a page
             without any. */
          const title =
            category.slug === "dockingstationer"
              ? da
                ? /* A soft hyphen: at 320px the one long word overran its card. */
                  "Docking\u00ADstationer"
                : "Docking stations"
              : category.name[lang];
          return (
            <li
              key={category.slug}
              className={`min-w-0 ${lead ? "col-span-2 lg:col-span-6 lg:row-span-2" : "lg:col-span-3"}`}
            >
              <Link
                href={localePath(`/produkter/${category.slug}`, lang)}
                className="plate plate-edge plate-lift group flex h-full flex-col overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <CategoryArtwork
                  slug={category.slug}
                  lang={lang}
                  priority={index < 3}
                  sizes={lead ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 24vw, 46vw"}
                  /* Beside two rows of cards the lead is taller than a 4:3
                     frame; the frame takes the height instead of leaving a
                     navy gap, and the near-square photo fits it better. */
                  className={lead ? "lg:aspect-auto lg:min-h-0 lg:flex-1 lg:py-10 lg:pl-10 2xl:py-16 2xl:pl-16" : ""}
                />
                {/* On desktop the lead's name comes before its picture: at 1920
                    the picture alone filled the first screen and a buyer saw a
                    laptop with no name, count or way on. */}
                <div
                  className={`flex flex-col ${lead ? "p-4 sm:p-6 lg:order-first lg:flex-none lg:border-b lg:border-white/10" : "flex-1 p-3 sm:p-5"}`}
                >
                  <h3
                    className={`font-display font-bold leading-snug text-paper ${lead ? "t-h3" : "text-base sm:text-lg"}`}
                  >
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-5 text-paper/75">
                    {lead && models > 1
                      ? da
                        ? `${categoryApplications[category.slug].da}. ${count(models, da)} fra ${brandsOf(category.slug, da)}.`
                        : `${categoryApplications[category.slug].en}. ${count(models, da)} from ${brandsOf(category.slug, da)}.`
                      : categoryApplications[category.slug][lang]}
                  </p>
                  {!lead && (
                    /* A business buyer decides by brand first. */
                    <p className="mt-1 text-xs leading-5 text-paper/65">
                      {brandsOf(category.slug, da)}
                    </p>
                  )}
                  <span
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-300 group-hover:text-paper"
                  >
                    {lead
                      ? da
                        ? `Se alle ${models}`
                        : `See all ${models}`
                      : count(models, da)}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-6 text-xs leading-5 text-paper/65">
        <p className="max-w-2xl pt-3">
          {da
            ? "Bærbaren og docken er referencefotos, de øvrige tegninger. De viser udstyrstypen – ikke lager eller den enkelte enheds stand."
            : "The laptop and the dock are reference photos, the others drawings. They show the type of equipment, not stock or the condition of an individual unit."}
        </p>
        <details data-category-photo-credit className="group">
          <summary className="inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4 hover:text-paper">
            {da ? "Fotokredit" : "Photo credit"}
          </summary>
          <div className="max-w-lg pb-3">
            {credits.map((credit) => (
              <div key={credit.source}>
                <p>
                  {credit.subject} · {credit.author}
                </p>
                <div className="flex flex-wrap gap-x-4">
                  <a
                    href={credit.source}
                    className="inline-flex min-h-11 items-center text-brand-300 underline underline-offset-4 hover:text-paper"
                  >
                    {da ? "Originalfoto" : "Original photo"}
                  </a>
                  <a
                    href={credit.licenceUrl}
                    rel="license"
                    className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper"
                  >
                    {credit.licence}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

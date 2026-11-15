import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { categoryApplications, categoryMedia } from "@/lib/category-media";
import { localePath, type Lang } from "@/lib/i18n";
import { getModelsForCategory } from "@/lib/models";
import CategoryArtwork from "./CategoryArtwork";

/*
 * The products hub's directory: five equipment types in one compact row.
 *
 * It was seven equal tiles; two of them, tablets and smartphones, had no
 * model and no picture, and the owner asked for them to go (2026-11-14).
 * Their pages stay, linked from the header and footer.
 *
 * For one evening laptops led as a large card beside a 2x2 grid. At 1920 the
 * grid ran past the screen and the owner found it too big and ugly
 * (2026-11-15). Now every type gets the same small card, laptops first, and
 * the whole directory fits in the first screen at 1440 and 1920. Each card
 * gives the same four things: name, what sets it apart, brands, model count.
 * The count is a fact from lib/models, not a stock level.
 *
 * The photo/drawing label is said once, in the note under the row. Photos
 * multiply into the same pale well as the drawings, so the row reads as one
 * set.
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
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {shown.map((category, index) => {
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
              /* On a phone laptops take the full width, so the 2-column grid
                 below holds the other four without a hole. */
              className={`min-w-0 ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Link
                href={localePath(`/produkter/${category.slug}`, lang)}
                className="plate plate-edge plate-lift group flex h-full flex-col overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <CategoryArtwork
                  slug={category.slug}
                  lang={lang}
                  priority={index < 3}
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 19vw, (min-width: 640px) 31vw, 100vw"
                      : "(min-width: 1024px) 19vw, (min-width: 640px) 31vw, 46vw"
                  }
                />
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="font-display text-base font-bold leading-snug text-paper">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-paper/75">
                    {categoryApplications[category.slug][lang]}
                  </p>
                  {/* A business buyer decides by brand first. */}
                  <p className="mt-1 text-xs leading-5 text-paper/65">
                    {brandsOf(category.slug, da)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand-300 group-hover:text-paper">
                    {count(models, da)}
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

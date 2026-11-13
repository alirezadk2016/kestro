import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { categoryApplications, categoryMedia } from "@/lib/category-media";
import { localePath, type Lang } from "@/lib/i18n";
import CategoryArtwork from "./CategoryArtwork";

export default function ProductCategoryGallery({ lang }: { lang: Lang }) {
  const da = lang === "da";
  const credit = categoryMedia.dockingstationer.credit!;
  return (
    <section
      id="product-categories"
      aria-labelledby="product-categories-heading"
      className="mt-7 sm:mt-10"
    >
      <h2 id="product-categories-heading" className="t-h2 font-display font-extrabold text-paper">
        {da ? "Vælg udstyrstype" : "Choose your equipment"}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {categories.map((category, index) => {
          const media = categoryMedia[category.slug];
          return (
            <li key={category.slug} className="min-w-0">
              <Link
                href={localePath(`/produkter/${category.slug}`, lang)}
                className="plate plate-edge plate-lift group flex h-full flex-col overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <CategoryArtwork slug={category.slug} lang={lang} priority={index < 2} />
                <div className="flex flex-1 flex-col p-3 sm:p-5">
                  <h3 className="font-display text-base font-bold leading-snug text-paper sm:text-lg">
                    {category.slug === "dockingstationer" && da
                      ? "Docks og tilbehør"
                      : category.name[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-paper/75">
                    {categoryApplications[category.slug][lang]}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 group-hover:text-paper">
                      {da ? "Se udvalg" : "Explore"}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                    <span className="text-xs leading-5 text-paper/65">
                      {media.kind === "photo"
                        ? da
                          ? "Referencefoto"
                          : "Reference photo"
                        : "Illustration"}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-6 text-xs leading-5 text-paper/65">
        <p className="pt-3">
          {da
            ? "Referencefotos og tegninger viser udstyrstyper. De viser ikke lager eller den enkelte enheds stand."
            : "Reference photos and drawings show equipment types, not stock or the condition of an individual unit."}
        </p>
        <details data-category-photo-credit className="group">
          <summary className="inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4 hover:text-paper">
            {da ? "Fotokredit" : "Photo credit"}
          </summary>
          <div className="max-w-lg pb-3">
            <p>Dell WD19 · {credit.author}</p>
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
        </details>
      </div>
    </section>
  );
}

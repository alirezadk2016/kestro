import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import {
  budgetExamples,
  budgetAmount,
  budgetReadOn,
  budgetSource,
  formatDkk,
  budgetEnquiryPath,
} from "@/lib/pricing";
import { pricingMedia } from "@/lib/pricing-media";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import SourceList from "./SourceList";
import Container from "./Container";
import { buttonClass } from "./Button";

export default function BudgetExamples({ lang }: { lang: Lang }) {
  const da = lang === "da";
  return (
    <section
      id="budget-collection"
      className="border-y border-white/10 py-10 sm:py-16"
      aria-labelledby="budget-heading"
    >
      <Container>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <h2 id="budget-heading" className="t-h2 font-display font-extrabold text-paper">
            {da ? "Modeller og budgetter" : "Models and budgets"}
          </h2>
          <div>
            <p className="text-sm leading-6 text-paper/85">
              {da
                ? "Budgetreferencer, ikke Kestros salgspriser eller lager."
                : "Budget references, not Kestro selling prices or stock."}
            </p>
            <p className="mt-1 text-sm leading-6 text-paper/75">
              {da ? "Læst " : "Read "}
              <time dateTime={budgetReadOn}>{formatDate(budgetReadOn, lang)}</time>
              {da
                ? " · pr. enhed inkl. moms og servicegebyr, ekskl. fragt."
                : " · per unit including VAT and service fee, excluding shipping."}
            </p>
          </div>
        </div>
        <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {budgetExamples.map((item, index) => {
            const media = pricingMedia[item.model];
            return (
              <li
                key={item.model}
                data-budget-model={item.model}
                className="plate flex min-w-0 flex-col overflow-hidden"
              >
                <figure className="relative aspect-[4/3] overflow-hidden bg-paper-dim outline outline-1 -outline-offset-1 outline-white/10">
                  <Image
                    src={media.src}
                    alt={media.alt[lang]}
                    width={media.width}
                    height={media.height}
                    priority={index === 0}
                    sizes="(min-width: 1536px) 21vw, (min-width: 1280px) 24vw, (min-width: 640px) 46vw, 92vw"
                    className="h-full w-full object-contain"
                  />
                  <figcaption className="absolute left-3 top-3 rounded bg-ink-950/95 px-2.5 py-1 text-xs font-semibold leading-5 text-paper">
                    {media.kind === "photo" ? (da ? "Modelfoto" : "Model photo") : "Illustration"}
                  </figcaption>
                </figure>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                    {media.category[lang]}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-paper">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-paper/75 sm:min-h-12">
                    {item.configuration[lang]}
                  </p>
                  <p className="mt-5 text-xs font-semibold text-paper/65">
                    {da ? "Budget pr. enhed" : "Budget per unit"}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold tabular-nums text-paper md:text-3xl xl:text-2xl 2xl:text-3xl">
                    {da ? "Ca." : "Approx."} {formatDkk(budgetAmount(item), lang)}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-paper/75">
                    {da ? "Reference:" : "Reference:"} {formatDkk(item.observed, lang)} +{" "}
                    {formatDkk(item.fee, lang)} {da ? "servicegebyr." : "service fee."}
                  </p>
                  <div className="mt-auto pt-5">
                    <Link
                      data-budget-enquiry
                      href={budgetEnquiryPath(item, lang)}
                      aria-label={`${da ? "Spørg om konfigurationen" : "Ask about this configuration"}: ${item.name}`}
                      className={`${buttonClass("primary")} w-full px-3 py-2 text-center`}
                    >
                      <span>{da ? "Spørg om modellen" : "Ask about this model"}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 flex-none"
                        strokeWidth={2}
                      />
                    </Link>
                    <div className="mt-3 flex flex-col border-t border-white/10 pt-2">
                      <Link
                        data-budget-model-link
                        href={localePath(`/modeller/${item.model}`, lang)}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
                      >
                        {da ? "Model og specifikationer" : "Model and specifications"}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                      <a
                        data-budget-source
                        href={budgetSource(item).url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={`${da ? "Historisk priskilde" : "Historical price source"}: ${item.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                        className="inline-flex min-h-11 items-center gap-2 text-xs text-paper/75 underline underline-offset-4 hover:text-paper"
                      >
                        {da ? "Historisk priskilde" : "Historical price source"}
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-sm leading-6 text-paper/75">
          {da
            ? "Billederne viser modeltypen. Fotos og illustrationer viser ikke en bestemt vare hos forhandleren; stand og tastatur kan afvige."
            : "Images show the model type. Photos and illustrations do not show a particular retailer’s unit; condition and keyboard may differ."}
        </p>
        <details data-budget-credits className="group mt-3 border-t border-white/10">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-paper/85 [&::-webkit-details-marker]:hidden">
            {da ? "Om billederne" : "About the images"}
            <ChevronDown
              aria-hidden="true"
              size={18}
              strokeWidth={2}
              className="flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <p className="text-sm leading-6 text-paper/75">
            {da
              ? "T480-billedet er leveret af ejeren. De to Dell-illustrationer er originale skematiske tegninger; de er ikke produktfotografier og dokumenterer ikke tilbehør eller portplacering på en konkret enhed."
              : "The T480 image was supplied by the owner. The two Dell illustrations are original schematic drawings; they are not product photographs or evidence of accessories or port positions on an individual unit."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 pb-3 text-sm text-paper/75">
            <a
              href="https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg"
              className="inline-flex min-h-11 items-center text-brand-300 underline underline-offset-4 hover:text-paper"
            >
              T14 Gen 2 · Edvard10 · Wikimedia Commons
            </a>
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              rel="license"
              className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper"
            >
              CC0 1.0
            </a>
          </div>
        </details>
        <details className="group mt-4 max-w-3xl border-t border-white/10 pt-2">
          {/* The FactNote disclosure's shape, so the page's two folds open the
              same way rather than one with the browser's own triangle. */}
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-3 py-3 text-sm font-semibold text-paper/85 [&::-webkit-details-marker]:hidden">
            {da ? "Kilder og beregningsgrundlag" : "Sources and calculation"}
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 flex-none text-paper/65 transition-transform duration-200 group-open:rotate-180"
              strokeWidth={2}
            />
          </summary>
          {/* How the figures were reached, folded with the sources it rests
              on. It was a six-line paragraph of small print above the cards,
              the third telling of "not our prices" before a single figure. */}
          <p className="pt-2 text-sm leading-6 text-paper/75">
            {da
              ? "Per enhed i DKK, afrundet op til nærmeste 100 kr. fra de angivne eksterne detailpriser inklusive forhandlerens moms og oplyste servicegebyr. Referencer læst "
              : "Per unit in DKK, rounded up to the nearest DKK 100 from the external retail prices, including the retailer's VAT and stated service fee. References read "}
            <time dateTime={budgetReadOn}>{formatDate(budgetReadOn, lang)}</time>.
            {da
              ? " Hver reference gælder den angivne konfiguration; beløbene er ikke et markedsgennemsnit eller et løfte om momsfradrag. Fragt og afgifter ved levering til Norge er ikke beregnet."
              : " Each reference applies to the stated configuration; the amounts are not a market average or a promise of VAT deductibility. Shipping and taxes for Norway have not been calculated."}
          </p>
          <p className="mt-3 text-sm leading-6 text-paper/75">
            {da
              ? "Priskilderne kan vise andre priser eller standardkonfigurationer i dag. Kontrollér de aktuelle valg og vilkår hos forhandleren."
              : "Price sources may show different prices or default configurations today. Check the retailer’s current selections and terms."}
          </p>
          <SourceList
            lang={lang}
            ids={[...budgetExamples.map((item) => item.source), "budgetRetailTerms"]}
            className="py-4"
          />
        </details>
      </Container>
    </section>
  );
}

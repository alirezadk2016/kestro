import { ChevronDown } from "lucide-react";
import {
  budgetExamples,
  budgetAmount,
  budgetReadOn,
  budgetSource,
  formatDkk,
  budgetEnquiryPath,
} from "@/lib/pricing";
import { pricingMedia } from "@/lib/pricing-media";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import { getModel } from "@/lib/models";
import SourceList from "./SourceList";
import Container from "./Container";

export default function BudgetExamples({ lang }: { lang: Lang }) {
  const da = lang === "da";
  /* Four dated prices read at other retailers, as a price table: model,
     configuration, the amount and where it was read. It used to be the
     product catalogue (search, filters, sorting, "compare" boxes and a big
     "Spørg om pris" button on every card) with a price on each card, so
     the prices page looked like a second shop and a buyer could not tell
     which page sold what. Nothing here is for sale: the one action per row
     that matters is the source, and asking Kestro is a quiet link. */
  const rows = budgetExamples.map((item) => {
    const model = getModel(item.model);
    if (!model) throw new Error(`Unknown budget model: ${item.model}`);
    return { item, media: pricingMedia[item.model], source: budgetSource(item) };
  });
  return (
    <section
      id="budget-collection"
      className="border-y border-white/10 py-6 sm:py-12"
      aria-labelledby="budget-heading"
    >
      <Container>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <h2
            id="budget-heading"
            className="font-display t-h2 font-extrabold text-paper"
          >
            {da ? "Priseksempler fra andre forhandlere" : "Price examples from other retailers"}
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
        <div
          aria-hidden="true"
          className="mt-8 hidden grid-cols-[minmax(0,1fr)_10rem_minmax(0,15rem)] gap-6 px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-paper/65 md:grid"
        >
          <span>{da ? "Model og konfiguration" : "Model and configuration"}</span>
          <span>{da ? "Pris hos forhandler" : "Retailer price"}</span>
          <span />
        </div>
        <ul className="mt-4 grid gap-3 md:mt-0">
          {rows.map(({ item, media, source }) => (
            <li
              key={item.model}
              data-budget-model={item.model}
              className="plate grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 md:grid-cols-[4.5rem_minmax(0,1fr)_10rem_minmax(0,15rem)] md:items-center md:gap-x-6"
            >
              <figure className="relative aspect-[4/3] w-[4.5rem] overflow-hidden rounded-md bg-paper-dim">
                <Image
                  src={media.src}
                  width={media.width}
                  height={media.height}
                  alt={media.alt[lang]}
                  sizes="72px"
                  className="h-full w-full object-contain"
                />
              </figure>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold leading-snug text-paper">{item.name}</h3>
                <p className="mt-0.5 text-sm leading-5 text-paper/75">{item.configuration[lang]}</p>
                {media.kind === "illustration" && (
                  <p className="mt-0.5 text-xs leading-4 text-paper/65">Illustration</p>
                )}
              </div>
              <p className="col-span-2 text-base font-semibold tabular-nums text-paper md:col-span-1">
                <span className="mr-1.5 text-xs font-normal text-paper/65 md:sr-only">
                  {da ? "Pris hos forhandler:" : "Retailer price:"}
                </span>
                {da ? "ca." : "approx."} {formatDkk(budgetAmount(item), lang)}
              </p>
              <div className="col-span-2 flex flex-wrap items-center gap-x-5 md:col-span-1 md:justify-end">
                <a
                  data-budget-source
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`${da ? "Historisk priskilde" : "Historical price source"}: ${item.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-paper"
                >
                  {da ? "Historisk priskilde" : "Historical price source"}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <Link
                  data-budget-model-link
                  href={localePath(`/modeller/${item.model}`, lang)}
                  aria-label={`${da ? "Detaljer" : "Details"}: ${item.name}`}
                  className="inline-flex min-h-11 items-center text-sm text-paper/85 underline underline-offset-4 hover:text-paper"
                >
                  {da ? "Detaljer" : "Details"}
                </Link>
                <Link
                  data-budget-enquiry
                  href={budgetEnquiryPath(item, lang)}
                  aria-label={`${da ? "Spørg om pris" : "Enquire"}: ${item.name}`}
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-paper/85 underline underline-offset-4 hover:text-paper"
                >
                  {da ? "Spørg om pris" : "Enquire"}
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
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
        <details data-budget-basis className="group mt-4 border-t border-white/10">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-paper/85 [&::-webkit-details-marker]:hidden">
            {da ? "Kilder og beregningsgrundlag" : "Sources and calculation"}
            <ChevronDown
              aria-hidden="true"
              size={18}
              strokeWidth={2}
              className="flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none"
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
          <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {budgetExamples.map((item) => (
              <div key={item.model} data-budget-calculation={item.model}>
                <dt className="text-sm font-semibold text-paper">{item.name}</dt>
                <dd className="mt-1 text-sm leading-6 text-paper/75">
                  {formatDkk(item.observed, lang)} + {formatDkk(item.fee, lang)}{" "}
                  {da ? "servicegebyr" : "service fee"} → {formatDkk(budgetAmount(item), lang)}
                </dd>
              </div>
            ))}
          </dl>
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

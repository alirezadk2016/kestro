import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { budgetExamples, budgetAmount, budgetReadOn, budgetSource, formatDkk } from "@/lib/pricing";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import { getModel } from "@/lib/models";
import SourceList from "./SourceList";
import Container from "./Container";

export default function BudgetExamples({ lang }: { lang: Lang }) {
  const da = lang === "da";
  /* Four dated prices read at other retailers, as what they are: a price
     table. Model and configuration, the amount, and where it was read.

     It was a list of product cards: a photograph, the model name as a
     heading, "Detaljer" and "Spørg om pris" on every row. Three of the four
     pictures were the very files the products hub uses for its categories,
     so /priser read as a smaller /produkter with prices added, and the owner
     could not tell the two pages apart (2026-11-17). A price page answers
     "what does it cost"; the products hub shows what there is. Nothing here
     is for sale, so the one action per row is the source. Asking Kestro is a
     single call at the end of the page, and the model name still leads to
     its specification. */
  const rows = budgetExamples.map((item) => {
    if (!getModel(item.model)) throw new Error(`Unknown budget model: ${item.model}`);
    return { item, source: budgetSource(item) };
  });
  return (
    <section
      id="budget-collection"
      className="border-y border-white/10 py-6 sm:py-12"
      aria-labelledby="budget-heading"
    >
      <Container>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <h2 id="budget-heading" className="font-display t-h2 font-extrabold text-paper">
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

        <div className="plate mt-8 overflow-hidden">
          <table aria-labelledby="budget-heading" className="w-full border-collapse text-left">
            {/* Four columns from lg, where the width is there to use; two from
                sm, with the configuration under the model and the source under
                the price; one on a phone, where a price column left the model
                name 130px at 320 and the link broke over two lines. The moved
                copies are display:none, so a screen reader meets each value
                once. */}
            <thead>
              <tr className="text-xs uppercase tracking-wider text-paper/65">
                <th scope="col" className="px-3 py-3 font-semibold sm:px-6">
                  <span className="sm:hidden">{da ? "Model og pris" : "Model and price"}</span>
                  <span className="hidden sm:inline">Model</span>
                </th>
                <th scope="col" className="hidden px-3 py-3 font-semibold sm:px-6 lg:table-cell">
                  {da ? "Konfiguration" : "Configuration"}
                </th>
                <th
                  scope="col"
                  className="hidden whitespace-nowrap px-3 py-3 text-right font-semibold sm:table-cell sm:px-6"
                >
                  {da ? "Pris hos forhandler" : "Retailer price"}
                </th>
                <th scope="col" className="hidden px-3 py-3 font-semibold sm:px-6 lg:table-cell">
                  {da ? "Kilde" : "Source"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, source }) => {
                const sourceLink = (className: string) => (
                  <a
                    data-budget-source
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`${source.publisher}: ${da ? "historisk pris for" : "historical price for"} ${item.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                    className={`min-h-11 items-center gap-1 whitespace-nowrap text-sm text-brand-300 hover:text-paper ${className}`}
                  >
                    {source.publisher}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                );
                const price = (
                  <p className="flex min-h-11 items-center whitespace-nowrap text-base font-semibold tabular-nums text-paper">
                    {da ? "ca." : "approx."} {formatDkk(budgetAmount(item), lang)}
                  </p>
                );
                return (
                  <tr
                    key={item.model}
                    data-budget-model={item.model}
                    className="border-t border-white/10 align-top lg:align-middle"
                  >
                    <th scope="row" className="px-3 py-3 text-left font-normal sm:px-6 lg:py-2">
                      <Link
                        data-budget-model-link
                        href={localePath(`/modeller/${item.model}`, lang)}
                        className="inline-flex min-h-11 items-center whitespace-nowrap font-display text-base font-bold leading-snug text-paper underline decoration-white/25 underline-offset-4 hover:decoration-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm leading-5 text-paper/75 lg:hidden">
                        {item.configuration[lang]}
                      </p>
                      <div className="flex items-center justify-between gap-3 sm:hidden">
                        {price}
                        {sourceLink("inline-flex")}
                      </div>
                    </th>
                    <td className="hidden px-3 py-2 text-sm leading-5 text-paper/75 sm:px-6 lg:table-cell">
                      {item.configuration[lang]}
                    </td>
                    <td className="hidden px-3 py-3 text-right sm:table-cell sm:px-6 lg:py-2">
                      <div className="flex justify-end">{price}</div>
                      {sourceLink("inline-flex lg:hidden")}
                    </td>
                    <td className="hidden px-3 py-2 sm:px-6 lg:table-cell">
                      {sourceLink("inline-flex")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <details data-budget-basis className="group mt-4 border-b border-white/10">
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

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
            {/* The read date and "per unit" are in the page's opening answer
                just above; this line says only what that one does not. The
                rounding was in the folded calculation alone, so a buyer who
                followed a source and found 2,692 DKK met a different figure
                with no warning. */}
            <p className="mt-1 text-sm leading-6 text-paper/75">
              {da
                ? "Afrundet op til hele 100 kr., inkl. moms og servicegebyr, ekskl. fragt."
                : "Rounded up to the nearest DKK 100, including VAT and service fee, excluding shipping."}
            </p>
          </div>
        </div>

        <div className="plate mt-8 overflow-hidden">
          {/* One cell per value, laid out three ways: a table row from lg; a
              two-by-two grid from sm (model and price, configuration and
              source); a stack on a phone, where a price column left the model
              name 130px at 320 and the link broke over two lines. It was
              done with hidden copies once, which put each source link in the
              page three times. Changing a table part's display can strip its
              table semantics in some browsers, so the roles are stated. */}
          <table
            role="table"
            aria-labelledby="budget-heading"
            className="w-full border-collapse text-left"
          >
            <thead role="rowgroup" className="sr-only lg:not-sr-only">
              <tr role="row" className="text-xs text-paper/65">
                <th role="columnheader" scope="col" className="px-6 py-3 font-semibold">
                  Model
                </th>
                <th role="columnheader" scope="col" className="px-6 py-3 font-semibold">
                  {da ? "Konfiguration" : "Configuration"}
                </th>
                <th
                  role="columnheader"
                  scope="col"
                  className="whitespace-nowrap px-6 py-3 text-right font-semibold"
                >
                  {da ? "Pris hos forhandler" : "Retailer price"}
                </th>
                <th role="columnheader" scope="col" className="px-6 py-3 font-semibold">
                  {da ? "Kilde" : "Source"}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {rows.map(({ item, source }) => (
                <tr
                  key={item.model}
                  role="row"
                  data-budget-model={item.model}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-t border-white/10 px-3 py-3 first:border-t-0 sm:px-6 lg:table-row lg:p-0 lg:first:border-t"
                >
                  <th
                    role="rowheader"
                    scope="row"
                    className="col-span-2 text-left font-normal sm:col-span-1 lg:px-6 lg:py-2"
                  >
                    <Link
                      data-budget-model-link
                      href={localePath(`/modeller/${item.model}`, lang)}
                      className="inline-flex min-h-11 items-center whitespace-nowrap font-display text-base font-bold leading-snug text-paper underline decoration-white/25 underline-offset-4 hover:decoration-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                    >
                      {item.name}
                    </Link>
                  </th>
                  <td
                    role="cell"
                    className="col-span-2 text-sm leading-5 text-paper/75 sm:col-span-1 sm:col-start-1 sm:row-start-2 lg:px-6 lg:py-2"
                  >
                    {item.configuration[lang]}
                  </td>
                  <td
                    role="cell"
                    className="mt-1 whitespace-nowrap text-base font-semibold tabular-nums text-paper sm:col-start-2 sm:row-start-1 sm:mt-0 sm:text-right lg:px-6 lg:py-2"
                  >
                    {da ? "ca." : "approx."} {formatDkk(budgetAmount(item), lang)}
                  </td>
                  <td
                    role="cell"
                    className="mt-1 justify-self-end sm:col-start-2 sm:row-start-2 sm:mt-0 lg:px-6 lg:py-2"
                  >
                    <a
                      data-budget-source
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={`${source.publisher}: ${da ? "historisk pris for" : "historical price for"} ${item.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                      className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap text-sm text-brand-300 hover:text-paper"
                    >
                      {source.publisher}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details data-budget-basis className="group mt-4">
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

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { budgetExamples, budgetAmount, budgetSource, formatDkk } from "@/lib/pricing";
import { priceDisclaimer } from "@/lib/project";
import { company } from "@/lib/company";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import SourceList from "./SourceList";
import Container from "./Container";

export default function BudgetExamples({ lang }: { lang: Lang }) {
  const da = lang === "da";
  return (
    <section className="border-y border-white/10 py-10 sm:py-16" aria-labelledby="budget-heading">
      <Container>
        <div className="max-w-3xl">
          <p className="label text-brand-300">
            {da ? "Budget · ikke et salgstilbud" : "Budget · not a sales offer"}
          </p>
          <h2 id="budget-heading" className="t-h2 mt-3 font-display font-extrabold text-paper">
            {da ? "Et konkret udgangspunkt" : "A concrete starting point"}
          </h2>
          <p className="mt-4 text-base leading-7 text-paper/85">{priceDisclaimer[lang]}</p>
          <p className="mt-3 text-sm leading-6 text-paper/75">
            {da
              ? "Per enhed i DKK, afrundet op til nærmeste 100 kr. fra de angivne eksterne detailpriser inklusive forhandlerens moms og oplyste servicegebyr. Referencer læst "
              : "Per unit in DKK, rounded up to the nearest DKK 100 from the external retail prices, including the retailer's VAT and stated service fee. References read "}
            <time dateTime="2026-10-14">{formatDate("2026-10-14", lang)}</time>.
            {da
              ? " Ikke Kestros salgspriser, ikke et markeds-gennemsnit og ikke et løfte om momsfradrag. Tilpasning og andre konfigurationer kan ændre beløbet; fragt og afgifter ved levering til Norge er ikke beregnet."
              : " Not Kestro selling prices, a market average or a promise of VAT deductibility. Preparation and other configurations may change the amount; shipping and taxes for Norway have not been calculated."}
          </p>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {budgetExamples.map((item) => (
            <li key={item.model} className="plate flex flex-col p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-paper">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-paper/75">{item.configuration[lang]}</p>
              <p className="my-5 font-display text-3xl font-bold tabular-nums text-paper">
                {da ? "Ca." : "Approx."} {formatDkk(budgetAmount(item), lang)}
              </p>
              <p className="text-sm leading-6 text-paper/75">
                {da ? "Reference:" : "Reference:"} {formatDkk(item.observed, lang)} +{" "}
                {formatDkk(item.fee, lang)} {da ? "servicegebyr." : "service fee."}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 pt-3">
                <Link
                  href={localePath(`/modeller/${item.model}`, lang)}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
                >
                  {da ? "Se modellen" : "View model"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href={budgetSource(item).url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex min-h-11 items-center text-sm text-paper/75 underline underline-offset-4 hover:text-paper"
                >
                  {da ? "Prisgrundlag" : "Price reference"}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-paper/85">
          {da ? "Spørg om muligheder og konkret pris:" : "Ask about options and a specific price:"}{" "}
          <a
            href={`mailto:${company.email}`}
            className="inline-flex min-h-11 items-center font-semibold text-brand-300 underline underline-offset-4"
          >
            {company.email}
          </a>
        </p>
        <details className="mt-4 max-w-3xl border-t border-white/10 pt-2">
          <summary className="cursor-pointer py-3 text-sm font-semibold text-paper/85">
            {da ? "Kilder og beregningsgrundlag" : "Sources and calculation"}
          </summary>
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

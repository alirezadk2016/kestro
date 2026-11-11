import { ArrowUpRight } from "lucide-react";
import Container from "./Container";
import { buttonClass } from "./Button";
import { formatDate, type Lang } from "@/lib/i18n";
import { externalLaptops } from "@/lib/external-laptops";
import { sources } from "@/lib/sources";

const copy = {
  da: {
    heading: "Vores anbefalinger – køb hos andre",
    lead: "Tre erhvervsbærbare, vi anbefaler at sammenligne. Se pris og lager hos de eksterne forhandlere nedenfor.",
    notice:
      "De viste tilbud er ikke Kestros lager. Købet foregår hos forhandleren på dennes priser og vilkår.",
    seller: "Ekstern forhandler",
    checked: "Link og konfiguration tjekket",
    action: "Se pris og lager hos",
    newWindow: "åbner i en ny fane",
    future:
      "Vi planlægger et eget udvalg af erhvervsbærbare med fokus på konkurrencedygtige priser. Sortiment, pris og tidspunkt er endnu ikke fastlagt.",
  },
  en: {
    heading: "Our recommendations – buy elsewhere",
    lead: "Three business laptops we recommend comparing. View prices and stock at the external retailers below.",
    notice:
      "These offers are not Kestro stock. Purchases are made with the retailer at their prices and on their terms.",
    seller: "External retailer",
    checked: "Link and configuration checked",
    action: "View price and stock at",
    newWindow: "opens in a new tab",
    future:
      "We plan to offer our own selection of business laptops at competitive prices. The range, prices and timing are not yet confirmed.",
  },
};

/** The retailer handles the purchase; there is deliberately no Kestro offer or cart. */
export default function ExternalLaptopRecommendations({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const checkedDates = [...new Set(externalLaptops.map((item) => item.checkedOn))];
  const commonCheckedOn = checkedDates.length === 1 ? checkedDates[0] : null;
  return (
    <section
      id="external-laptop-recommendations"
      aria-labelledby="external-laptops-heading"
      className="border-y border-white/10 bg-ink-950 py-10 sm:py-16"
    >
      <Container>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
          <h2
            id="external-laptops-heading"
            className="t-h2 text-balance font-display font-extrabold text-paper lg:col-span-5"
          >
            {c.heading}
          </h2>
          <div className="lg:col-span-7">
            <p className="text-base leading-[1.7] text-paper/85">{c.lead}</p>
            <p className="mt-3 text-sm leading-6 text-paper/75">{c.notice}</p>
          </div>
        </div>

        <ul className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {externalLaptops.map((item) => (
            <li key={item.id} className="plate flex min-w-0 flex-col p-5 sm:p-7">
              <p className="text-sm font-semibold text-brand-300">{item.useCase[lang]}</p>
              <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-paper">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-paper/85">{item.configuration[lang]}</p>
              <p className="mt-2 text-sm leading-6 text-paper/65">{item.condition[lang]}</p>
              <p className="mt-5 text-base leading-[1.65] text-paper/85">{item.reason[lang]}</p>
              <p className="mt-3 text-sm leading-6 text-paper/75">{item.caveat[lang]}</p>

              <div className="mt-auto pt-6">
                <p className="border-t border-white/10 pt-4 text-sm leading-6 text-paper/75">
                  {c.seller}: <span className="font-semibold text-paper">{item.seller}</span>
                  <span aria-hidden="true"> · </span>
                  {item.buyerLabel[lang]}
                </p>
                {!commonCheckedOn && (
                  <p className="mt-1 text-xs leading-5 text-paper/65">
                    {c.checked}{" "}
                    <time dateTime={item.checkedOn}>{formatDate(item.checkedOn, lang)}</time>
                  </p>
                )}
                <a
                  href={sources[item.source].url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`${c.action} ${item.seller}: ${item.name} (${c.newWindow})`}
                  className={`${buttonClass("secondary")} mt-4 w-full px-4 py-2 text-center`}
                >
                  <span>
                    {c.action} {item.seller}
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" strokeWidth={2} />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {commonCheckedOn && (
            <p className="text-xs leading-5 text-paper/65">
              {c.checked}{" "}
              <time dateTime={commonCheckedOn}>{formatDate(commonCheckedOn, lang)}</time>
            </p>
          )}
          <p className="mt-4 border-l-2 border-brand-400/50 pl-4 text-sm leading-6 text-paper/75">
            {c.future}
          </p>
        </div>
      </Container>
    </section>
  );
}

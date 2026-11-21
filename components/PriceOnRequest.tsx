import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";
import { budgetExamples, budgetAmount, budgetReadOn, formatDkk } from "@/lib/pricing";
import { getModel } from "@/lib/models";

// Only documented external budget references; never a Kestro offer or stock claim.
const copy = {
  da: {
    heading: "Få et tilbud på modellen",
    /* The shared disclaimer began "Priserne er omtrentlige budgeteksempler" —
       on the sixteen model pages that show no figure, it explained prices
       that were not there. Without a figure, the box says how a price for
       this model is reached instead. */
    body: "Modelreference. Konfiguration, stand og pris afklares for jeres forespørgsel.",
    volume: "Skriv antal, specifikationer og ønsket tastatur.",
    volumeAccessory: "Skriv antal og hvilke maskiner, udstyret skal bruges med.",
    cta: "Send en forespørgsel",
    secondary: "Budgeteksempler og prisgrundlag",
  },
  en: {
    heading: "Get a quote for this model",
    body: "Model reference. Configuration, condition and price are confirmed for your enquiry.",
    volume: "Tell us the quantity, specifications and keyboard you need.",
    volumeAccessory: "Tell us the quantity and which machines it will be used with.",
    cta: "Send an enquiry",
    secondary: "Budget examples and pricing",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function PriceOnRequest({
  lang,
  /** Named on the quote form when the buyer arrives from a model page. */
  equipment,
  accessory = false,
  className = "",
}: {
  lang: Lang;
  equipment?: string;
  /** A monitor or a dock: no keyboard to choose, and the machines matter. */
  accessory?: boolean;
  className?: string;
}) {
  const c = copy[lang];
  const example = budgetExamples.find(
    (item) => item.name === equipment || getModel(item.model)?.name === equipment,
  );
  // The dated retailer configuration is a reference, not a selected Kestro configuration.
  const href = localePath(
    equipment ? `/tilbud?model=${encodeURIComponent(equipment)}` : "/tilbud",
    lang,
  );

  return (
    <div className={className} data-model-enquiry>
      <p className="font-display text-lg font-bold tracking-tight text-paper">{c.heading}</p>
      {/* "Not our price" once, where the figure is. The box said it three
          times: the general disclaimer, the small print under the figure,
          and the pre-launch line above the button. */}
      <p className="mt-2 text-sm leading-6 text-paper/75">{c.body}</p>
      <Link
        href={href}
        className={`${buttonClass("primary", "lg")} mt-4 w-full whitespace-nowrap sm:w-auto`}
      >
        {c.cta}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          strokeWidth={2}
          aria-hidden="true"
        />
      </Link>
      <p className="mt-3 text-xs leading-5 text-paper/65">
        {accessory ? c.volumeAccessory : c.volume}
      </p>
      {example && (
        <details className="group mt-4 border-y border-white/15">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-paper/85 [&::-webkit-details-marker]:hidden">
            {lang === "da"
              ? "Prisreference fra anden forhandler"
              : "Price reference from another retailer"}
            <ChevronDown
              size={16}
              aria-hidden="true"
              className="shrink-0 text-brand-300 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="pb-4">
            {/* Labelled as what it is, at the size of a reference: as a 24px
              "Budget ca. 2.700 DKK" headline in a box titled "ask about
              price", it read as Kestro's price for this machine. */}
            <p className="text-xs font-semibold text-paper/65">
              {lang === "da" ? "Pris hos en anden forhandler" : "Price at another retailer"}
            </p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums text-paper">
              {lang === "da" ? "ca." : "approx."} {formatDkk(budgetAmount(example), lang)}
            </p>
            <p className="mt-1 text-xs leading-5 text-paper/65">
              {lang === "da" ? "Prisreference læst" : "Price reference read"}{" "}
              <time dateTime={budgetReadOn}>{formatDate(budgetReadOn, lang)}</time>
            </p>
            <p className="mt-2 text-sm leading-6 text-paper/75">
              {example.name}: {example.configuration[lang]}
            </p>
            <p className="mt-2 text-sm leading-6 text-paper/75">
              {lang === "da"
                ? "Ekstern detailreference inkl. moms og servicegebyr – ikke Kestros salgspris."
                : "External retail reference incl. VAT and service fee — not a Kestro selling price."}
            </p>
            <Link
              href={localePath("/priser", lang)}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
            >
              {c.secondary}
            </Link>
          </div>
        </details>
      )}

      <Link
        href={localePath("/tilbud-eksempel", lang)}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
      >
        {lang === "da"
          ? "Se et eksempel på oplysningerne i et tilbud"
          : "See the information in a sample quote"}
      </Link>
      {!example && (
        <Link
          href={localePath("/priser", lang)}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper sm:ml-5"
        >
          {c.secondary}
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";
import {
  budgetExamples,
  budgetAmount,
  budgetReadOn,
  budgetEnquiryPath,
  formatDkk,
} from "@/lib/pricing";
import { getModel } from "@/lib/models";

// Only documented external budget references; never a Kestro offer or stock claim.
const copy = {
  da: {
    heading: "Spørg om pris og muligheder",
    /* The shared disclaimer began "Priserne er omtrentlige budgeteksempler" —
       on the sixteen model pages that show no figure, it explained prices
       that were not there. Without a figure, the box says how a price for
       this model is reached instead. */
    body: "Prisen på denne model afhænger af stand, konfiguration og antal. Skriv, hvad I skal bruge, så vender vi tilbage med muligheder og en præcis pris.",
    volume: "Skriv antal, specifikationer og ønsket tastatur.",
    volumeAccessory: "Skriv antal og hvilke maskiner, udstyret skal bruges med.",
    cta: "Send en forespørgsel",
    secondary: "Budgeteksempler og prisgrundlag",
  },
  en: {
    heading: "Ask about pricing and options",
    body: "The price of this model depends on condition, configuration and quantity. Tell us what you need, and we will come back with options and a specific price.",
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
  const href = example
    ? budgetEnquiryPath(example, lang)
    : localePath(equipment ? `/tilbud?model=${encodeURIComponent(equipment)}` : "/tilbud", lang);

  return (
    <div className={`plate p-6 sm:p-7 ${className}`}>
      <p className="font-display text-2xl font-extrabold tracking-display text-paper">
        {c.heading}
      </p>
      {/* "Not our price" once, where the figure is. The box said it three
          times: the general disclaimer, the small print under the figure,
          and the pre-launch line above the button. */}
      {!example && <p className="mt-3 text-sm leading-[1.6] text-paper/75">{c.body}</p>}
      {example && (
        <div className="mt-4 border-y border-white/10 py-4">
          <p className="font-display text-2xl font-bold tabular-nums text-paper">
            {lang === "da" ? "Budget ca." : "Budget approx."}{" "}
            {formatDkk(budgetAmount(example), lang)}
          </p>
          <p className="mt-1 text-xs leading-5 text-paper/65">
            {lang === "da" ? "Prisreference læst" : "Price reference read"}{" "}
            <time dateTime={budgetReadOn}>{formatDate(budgetReadOn, lang)}</time>
          </p>
          <p className="mt-2 text-sm leading-6 text-paper/75">
            {example.name} · {example.configuration[lang]}
          </p>
          <p className="mt-2 text-sm leading-6 text-paper/75">
            {lang === "da"
              ? "Ekstern detailreference inkl. moms og servicegebyr – ikke Kestros salgspris."
              : "External retail reference incl. VAT and service fee — not a Kestro selling price."}
          </p>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2.5 border-t border-white/10 pt-4 text-sm leading-[1.6] text-paper/75">
        <Layers className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-300" strokeWidth={1.75} />
        {accessory ? c.volumeAccessory : c.volume}
      </p>

      {/* Wraps as a row, never inside a label: in the narrow right column
          of a model page the button read "Send en / forespørgsel". */}
      <div className="mt-5 flex flex-col gap-x-5 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link href={href} className={`${buttonClass("primary")} whitespace-nowrap`}>
          {c.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
        <Link
          href={localePath("/priser", lang)}
          className="inline-flex min-h-[48px] items-center whitespace-nowrap text-sm font-semibold text-brand-300 transition hover:text-paper"
        >
          {c.secondary}
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { localePath, type Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";
import { priceDisclaimer } from "@/lib/project";
import { budgetExamples, budgetAmount, formatDkk } from "@/lib/pricing";
import { getModel } from "@/lib/models";

// Only documented external budget references; never a Kestro offer or stock claim.
const copy = {
  da: {
    heading: "Spørg om pris og muligheder",
    body: priceDisclaimer.da,
    volume: "Skriv antal, specifikationer og ønsket tastatur.",
    cta: "Send en forespørgsel",
    secondary: "Budgeteksempler og prisgrundlag",
  },
  en: {
    heading: "Ask about pricing and options",
    body: priceDisclaimer.en,
    volume: "Tell us the quantity, specifications and keyboard you need.",
    cta: "Send an enquiry",
    secondary: "Budget examples and price references",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function PriceOnRequest({
  lang,
  /** Named on the quote form when the buyer arrives from a model page. */
  equipment,
  className = "",
}: {
  lang: Lang;
  equipment?: string;
  className?: string;
}) {
  const c = copy[lang];
  const example = budgetExamples.find(
    (item) => item.name === equipment || getModel(item.model)?.name === equipment,
  );
  const href = equipment ? `/tilbud?model=${encodeURIComponent(equipment)}` : "/tilbud";

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
        {c.volume}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href={localePath(href, lang)} className={buttonClass("primary")}>
          {c.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
        <Link
          href={localePath("/priser", lang)}
          className="inline-flex min-h-[48px] items-center text-sm font-semibold text-brand-300 transition hover:text-paper"
        >
          {c.secondary}
        </Link>
      </div>
    </div>
  );
}

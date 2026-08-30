import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * What a machine costs — answered where the buyer asks it.
 *
 * Every model page describes a machine in detail and then said nothing at all
 * about price, which leaves the reader to guess whether they are on a shop
 * that forgot its prices or a supplier that works differently. This says which.
 *
 * No figure, and no "from" price either. Forbrugerombudsmanden treats a
 * fra-pris as a claim: the goods have to actually be obtainable at it. We
 * source per order, so until there is a price we can stand behind for a
 * specific configuration, quoting one would be a number the buyer plans
 * around and we cannot honour. Naming the three things that move the price is
 * more use to them than a figure that moves.
 *
 * The quantity line belongs here rather than in the closing CTA because
 * quantity is one of the things that changes the number.
 */
const copy = {
  da: {
    label: "Pris",
    heading: "Få et tilbud",
    body: "Prisen afhænger af specifikationer, stand og antal. Derfor sætter vi ikke et listetal på en maskine, der ikke er købt hjem endnu – I får en pris, der gælder jeres konkrete leverance.",
    volume: "Skal I bruge 5, 20 eller 100 maskiner? Vi sourcer, klargør og leverer det samlet.",
    cta: "Få et tilbud",
    secondary: "Hvad afgør prisen?",
  },
  en: {
    label: "Price",
    heading: "Get a quote",
    body: "The price depends on specification, condition and quantity. So we do not put a list figure on a machine that has not been bought in yet — you get a price that holds for your actual delivery.",
    volume: "Need 5, 20 or 100 machines? We source, prepare and deliver them together.",
    cta: "Get a quote",
    secondary: "What decides the price?",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function PriceOnRequest({
  lang,
  /** Where the enquiry goes. Fleet quantities have their own form. */
  href = "/kontakt",
  className = "",
}: {
  lang: Lang;
  href?: string;
  className?: string;
}) {
  const c = copy[lang];

  return (
    <div className={`border border-white/10 bg-white/[0.04] p-6 sm:p-7 ${className}`}>
      <p className="label text-brand-300">{c.label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold tracking-display text-paper">
        {c.heading}
      </p>
      <p className="mt-3 text-sm leading-6 text-paper/65">{c.body}</p>

      <p className="mt-4 flex items-start gap-2.5 border-t border-white/10 pt-4 text-sm leading-6 text-paper/75">
        <Layers className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-300" strokeWidth={1.75} />
        {c.volume}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={localePath(href, lang)}
          className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
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

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * What stands in front of the closing CTA.
 *
 * This was a logo strip with five empty "your logo here" tiles and a heading
 * that said the client list was still being built. Honest, but it was the last
 * thing a buyer read before deciding whether to write — and what it said was
 * "nobody has bought from us yet". It was also the only WCAG failure on the
 * page: 11px at 3.2:1.
 *
 * What replaces it is the strongest thing Kestro can show while there are no
 * customers to name: the document. Price per unit, condition, battery health
 * and warranty terms, in writing, before anyone commits — and a real example
 * of it, one click away. Nothing here is a claim the site cannot back.
 *
 * When there are customers who have agreed to be named, a logo row belongs
 * here again. Not before. docs/case-study-template.md has the rules.
 */
const copy = {
  da: {
    eyebrow: "Før I bestiller",
    title: "Alt står skriftligt, mens I stadig kan sige nej",
    sub: "Pris per enhed og samlet, den præcise specifikation, stand og batteritilstand per maskine, garantivilkår og hvem I kontakter, hvis noget går i stykker. Det er ikke et løfte om et tilbud — det er, hvad der står i det.",
    cta: "Se et rigtigt tilbud",
    points: [
      "Pris per enhed og samlet — ikke kun en totalsum",
      "Stand og batterikapacitet per enhed",
      "Garantivilkår, og hvem der håndterer en fejl",
      "En tidsramme, ikke et løfte vi ikke kan holde",
    ],
  },
  en: {
    eyebrow: "Before you order",
    title: "It is all in writing while you can still say no",
    sub: "Price per unit and in total, the exact specification, condition and battery health per machine, warranty terms and who to contact if something breaks. This is not a promise about a quote — it is what the quote says.",
    cta: "See a real quote",
    points: [
      "Price per unit and in total — not just a lump sum",
      "Condition and battery capacity per unit",
      "Warranty terms, and who handles a fault",
      "A time frame, not a promise we cannot keep",
    ],
  },
} satisfies Record<
  Lang,
  { eyebrow: string; title: string; sub: string; cta: string; points: string[] }
>;

export default function TrustStrip({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <div className="border-y border-white/10 bg-brand-950 py-12 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>
            <h2 className="mt-4 text-balance font-display text-2xl font-extrabold tracking-display text-paper sm:text-3xl">
              {c.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-paper/65 sm:text-base">{c.sub}</p>

            <Link
              href={localePath("/tilbud-eksempel", lang)}
              className="group mt-6 inline-flex min-h-[48px] items-center gap-2 border border-white/20 px-6 text-sm font-semibold text-paper transition hover:border-white/45"
            >
              <FileText className="h-4 w-4 text-brand-300" strokeWidth={1.75} />
              {c.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>

          <ul className="space-y-3 lg:col-span-6">
            {c.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 border-b border-white/10 pb-3 text-sm leading-6 text-paper/75 last:border-b-0"
              >
                <span aria-hidden="true" className="mt-2.5 h-px w-4 flex-shrink-0 bg-brand-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}

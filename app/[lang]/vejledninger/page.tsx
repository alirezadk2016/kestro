import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { guides } from "@/lib/guides";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Vejledninger til reparation, opgradering og køb | Kestro",
    metaDescription:
      "Gratis vejledninger om at reparere, opgradere og købe brugt computerudstyr. Skrevet så du kan klare det selv – og med et ærligt svar på, hvornår du ikke bør.",
    title: "Vejledninger",
    description:
      "Vi tjener penge på at skaffe og klargøre udstyr – ikke på at holde på viden. Her er det, vi selv ville have fortalt dig, hvis du ringede.",
    adviceTitle: "Gratis rådgivning",
    adviceBody:
      "Står du med et konkret spørgsmål, som ingen af vejledningerne svarer på, så skriv til os. Vi svarer på spørgsmål om reparation, opgradering og køb af brugt udstyr uden at sende en regning – også hvis svaret er, at du ikke skal købe noget af os.",
    adviceCta: "Stil et spørgsmål",
    readingSuffix: "min. læsning",
    read: "Læs vejledningen",
    forWhom: "Til",
  },
  en: {
    metaTitle: "Guides: repairing, upgrading and buying used IT | Kestro",
    metaDescription:
      "Free guides on repairing, upgrading and buying used computer equipment. Written so you can do it yourself — and honest about when you should not.",
    title: "Guides",
    description:
      "We make our money sourcing and preparing equipment, not hoarding knowledge. This is what we would have told you if you had phoned.",
    adviceTitle: "Free advice",
    adviceBody:
      "If you have a specific question none of the guides answers, write to us. We answer questions about repairs, upgrades and buying used equipment without sending an invoice — including when the answer is that you should not buy anything from us.",
    adviceCta: "Ask a question",
    readingSuffix: "min read",
    read: "Read the guide",
    forWhom: "For",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/vejledninger", params.lang),
  };
}

export default function VejledningerPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <>
      <section className="py-14 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />

          <ol className="mt-14 border-t border-white/15">
            {guides.map((guide, i) => (
              <li key={guide.slug} className="border-b border-white/10">
                <Link
                  href={localePath(`/vejledninger/${guide.slug}`, lang)}
                  className="group -mx-4 block rounded-xl px-4 py-7 transition-colors hover:bg-white/5"
                >
                  <div className="flex gap-5 sm:gap-8">
                    <span className="pt-1 font-display text-sm font-semibold tabular-nums text-paper/55 transition-colors group-hover:text-brand-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/55">
                        <span>
                          {c.forWhom} {guide.audience[lang].toLowerCase()}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {guide.readingMinutes} {c.readingSuffix}
                        </span>
                      </div>

                      <h2 className="mt-2.5 font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-2xl">
                        {guide.title[lang]}
                      </h2>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-paper/65">
                        {guide.summary[lang]}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                        {c.read}
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          strokeWidth={2}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-12 max-w-3xl border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper">
              {c.adviceTitle}
            </h2>
            <p className="mt-3 text-base leading-8 text-paper/65">{c.adviceBody}</p>
            <Link
              href={localePath("/kontakt", lang)}
              className="mt-6 inline-flex min-h-[48px] items-center bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700"
            >
              {c.adviceCta}
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

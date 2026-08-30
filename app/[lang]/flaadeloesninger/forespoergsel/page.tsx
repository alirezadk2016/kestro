import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

/*
 * The fleet enquiry, as a page.
 *
 * It used to be a #forespoergsel section further down /flaadeloesninger. An
 * anchor has no address of its own: Google indexes the page it sits on, the
 * link cannot be shared or measured on its own, and an ad pointing at it lands
 * a buyer at the top of a long page with the form somewhere below the fold.
 * As a page it has a title, a description and a URL of its own.
 */

const copy = {
  da: {
    metaTitle: "Flådeforespørgsel – tilbud på større IT-indkøb | Kestro",
    metaDescription:
      "Skriv antal, ønsket specifikation og tidsramme, så vender vi tilbage med, hvad vi kan skaffe, til hvilken pris og hvornår.",
    title: "Send jeres forespørgsel",
    intro:
      "Jo mere I skriver om antal, ønsket specifikation og tidsramme, jo hurtigere kan vi vende tilbage med noget konkret. Har I en liste over det udstyr, I skal af med, må I meget gerne nævne det – så regner vi på begge dele.",
    backLabel: "Flådeløsninger",
    helpTitle: "Ved I ikke, hvad I skal bede om?",
    helpBody:
      "Så skriv opgaven i stedet for specifikationerne: hvor mange medarbejdere, hvad de laver, og hvornår det skal stå klar. Vi foreslår en konfiguration ud fra det.",
    points: [
      "Antal maskiner, og om der skal skærme, docks eller kabler med.",
      "Hvad de skal bruges til – kontorarbejde, konstruktion, billedarbejde.",
      "Hvornår udstyret skal stå klar.",
      "Om I samtidig skal af med ældre maskiner.",
    ],
  },
  en: {
    metaTitle: "Fleet enquiry — a quote on a larger IT purchase | Kestro",
    metaDescription:
      "Tell us the quantity, the specification you want and the timing, and we come back with what we can source, at what price and when.",
    title: "Send us your enquiry",
    intro:
      "The more you write about quantity, the specification you want and the timing, the sooner we can come back with something concrete. If you have a list of the equipment you need to get rid of, mention it — we will price both sides.",
    backLabel: "Fleet solutions",
    helpTitle: "Not sure what to ask for?",
    helpBody:
      "Then describe the job rather than the specification: how many people, what they do, and when it has to be ready. We will propose a configuration from that.",
    points: [
      "How many machines, and whether monitors, docks or cables go with them.",
      "What they are for — office work, engineering, image work.",
      "When the equipment has to be ready.",
      "Whether you are also getting rid of older machines.",
    ],
  },
} satisfies Record<Lang, Record<string, string | string[]>>;

const formCopy = {
  subjectPrefix: { da: "Flådeforespørgsel", en: "Fleet enquiry" },
  messagePlaceholder: {
    da: "Fx: 120 bærbare til kontorbrug, min. 16 GB RAM og 512 GB SSD, gerne opgraderbare. Vi skal samtidig af med ca. 100 ældre maskiner. Ønsket levering: inden udgangen af næste kvartal.",
    en: "For example: 120 laptops for office use, at least 16 GB memory and a 512 GB SSD, ideally upgradable. We also need to get rid of about 100 older machines. Wanted delivery: before the end of next quarter.",
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle as string,
    description: c.metaDescription as string,
    alternates: alternatesFor("/flaadeloesninger/forespoergsel", params.lang),
  };
}

export default function FleetEnquiryPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <section className="lit lit-paper py-14 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <nav aria-label={c.backLabel as string} className="text-sm text-paper/55">
            <Link
              href={localePath("/flaadeloesninger", lang)}
              className="inline-flex min-h-[44px] items-center transition hover:text-paper"
            >
              {c.backLabel as string}
            </Link>
          </nav>

          <h1 className="mt-4 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
            {c.title as string}
          </h1>
          <p className="mt-5 text-lg leading-8 text-paper/65">{c.intro as string}</p>

          <div className="mt-10 border border-white/10 bg-white/[0.04] p-6 shadow-sm sm:p-8">
            <ContactForm
              lang={lang}
              subjectPrefix={formCopy.subjectPrefix}
              messagePlaceholder={formCopy.messagePlaceholder}
            />
          </div>

          <div className="mt-12 border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight text-paper">
              {c.helpTitle as string}
            </h2>
            <p className="mt-3 text-base leading-7 text-paper/65">{c.helpBody as string}</p>
            <ul className="mt-5 space-y-2.5">
              {(c.points as string[]).map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6 text-paper/65">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 flex-shrink-0 bg-brand-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

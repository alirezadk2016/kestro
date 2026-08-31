import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { localePath, metaFor, htmlLang, type Lang } from "@/lib/i18n";

/*
 * What it costs, without a price list.
 *
 * The site had no pricing information of any kind, which is the first thing a
 * buyer screening suppliers looks for and the fastest way to be dropped from a
 * shortlist. It cannot have a price list — we hold no stock, so there is no
 * shelf with prices on it, and a made-up "from" figure is exactly the kind of
 * claim markedsføringsloven §13 makes us document.
 *
 * What a buyer actually needs at this stage is not a number. It is to know why
 * there is no number, what will move theirs, and what they will be told before
 * they commit. That is answerable honestly and completely, and it is what this
 * page does. Not one figure on it is invented.
 */

const drivers = [
  {
    heading: { da: "Model og specifikation", en: "Model and specification" },
    body: {
      da: "Hvilken serie, hvor gammel en generation, og hvor meget hukommelse og disk der skal i. En maskine, der skal opgraderes til 32 GB, koster mere end den samme maskine med 8 GB.",
      en: "Which range, how old a generation, and how much memory and storage go in. A machine upgraded to 32 GB costs more than the same machine at 8 GB.",
    },
  },
  {
    heading: { da: "Stand", en: "Condition" },
    body: {
      da: "Kosmetisk stand flytter prisen mærkbart. Skal maskinerne stå på et mødebord hos jeres kunder, betaler I for det; skal de på et lager, gør I ikke.",
      en: "Cosmetic condition moves the price noticeably. If the machines sit in front of your customers you pay for that; if they sit in a warehouse you do not.",
    },
  },
  {
    heading: { da: "Antal", en: "Quantity" },
    body: {
      da: "Ti ens maskiner er billigere per stk. end tre forskellige. Det er ikke en mængderabat – det er, at ens maskiner er lettere at skaffe og klargøre samlet.",
      en: "Ten identical machines cost less each than three different ones. That is not a volume discount — identical machines are simply easier to source and prepare together.",
    },
  },
  {
    heading: { da: "Hvad der skal med", en: "What goes with them" },
    body: {
      da: "Dockingstationer, skærme, kabler og strømforsyninger følger sjældent med brugt udstyr. Det er den klassiske grund til, at et billigt tilbud pludselig ikke er billigt.",
      en: "Docks, monitors, cables and power supplies rarely come with used equipment. That is the classic reason a cheap quote suddenly stops being cheap.",
    },
  },
  {
    heading: { da: "Nordisk tilpasning og software", en: "Nordic preparation and software" },
    body: {
      da: "Tastaturet skiftes fysisk, og Windows sættes op. Har I egne licensaftaler eller et image, I ruller ud, bruger vi dem – det er billigere end at købe licenser med.",
      en: "The keyboard is physically swapped and Windows is set up. If you have your own licence agreements or an image you roll out, we use them — that costs less than buying licences with the machines.",
    },
  },
  {
    heading: { da: "Om I skal af med noget", en: "Whether you have kit to clear" },
    body: {
      da: "Skal jeres gamle maskiner væk samtidig, regner vi på begge dele. Det trækker som regel ned i den samlede pris.",
      en: "If your old machines need to go at the same time, we price both sides. That usually brings the total down.",
    },
  },
];

const copy = {
  da: {
    metaTitle: "Hvad koster brugte erhvervscomputere? | Kestro",
    metaDescription:
      "Hvorfor der ikke står en pris på siden, hvad der afgør jeres pris, og hvad der står i tilbuddet, før I bestiller noget som helst.",
    title: "Hvad koster det?",
    description:
      "Det ærlige svar er, at det afhænger – og her står præcis hvad det afhænger af. Ingen prisliste, men heller ingen overraskelser: prisen står skriftligt, før I bestiller.",
    whyTitle: "Hvorfor der ikke er en prisliste",
    whyBody1:
      "Vi holder ikke lager. Der står ingen hylde med maskiner og mærkater på, og derfor findes der ikke en pris, vi kan skrive op på forhånd. Vi går ud i leverandørnetværket, når vi ved, hvad opgaven kræver – og prisen er den, vi kan skaffe det til, plus vores arbejde.",
    whyBody2:
      "Vi kunne godt skrive “fra 1.995 kr.” og lade jer finde ud af resten undervejs. Det gør vi ikke. Et tal, vi ikke kan dokumentere for den konkrete leverance, er ikke oplysning – det er lokkemad, og I opdager det alligevel, når tilbuddet kommer.",
    driversTitle: "Hvad der afgør jeres pris",
    driversLead: "Seks ting flytter tallet. De første tre flytter det mest.",
    quoteTitle: "Det står i tilbuddet",
    quoteLead:
      "Prisen kommer aldrig alene. Alt herunder står skriftligt, før I bestiller noget som helst:",
    quotePoints: [
      "Pris per enhed og samlet – ikke kun en totalsum.",
      "Præcis hvilken model og specifikation, I får.",
      "Stand per enhed – og batteriets faktiske kapacitet i procent på de bærbare.",
      "Garantivilkårene, og hvem I kontakter, hvis noget går i stykker.",
      "Hvad der følger med, og hvad der ikke gør.",
      "En tidsramme – ikke et løfte om en fast leveringstid, vi ikke kan holde.",
    ],
    freeTitle: "Koster et tilbud noget?",
    freeBody:
      "Nej. Der er ingen pris på at spørge, og ingen forpligtelse, når I har fået svaret. Passer der ikke noget til opgaven, siger vi det – det er en kortere samtale end at sælge jer noget, der ikke løser problemet.",
    fastTitle: "Sådan får I et realistisk tal hurtigt",
    fastLead: "Jo mere af det her I skriver med det samme, jo færre runder frem og tilbage:",
    fastPoints: [
      "Hvor mange maskiner, og om de skal være ens.",
      "Hvad de skal bruges til – kontorarbejde, konstruktion, billedarbejde.",
      "Om der skal skærme, docks eller kabler med.",
      "Hvornår det skal stå klar.",
      "Om I samtidig skal af med ældre udstyr.",
    ],
    relatedTitle: "Videre herfra",
    related: [
      { href: "/kvalitet", label: "Stand, test og hvad I bør spørge om" },
      { href: "/ydelser/levering", label: "Levering og tidsrammer" },
      { href: "/tilbud", label: "Få et tilbud på jeres flåde" },
    ],
  },
  en: {
    metaTitle: "What do used business computers cost? How we price | Kestro",
    metaDescription:
      "No price list, because we hold no stock. What decides the price of used business IT, and what to write to get a realistic figure.",
    title: "What does it cost?",
    description:
      "The honest answer is that it depends — and this page says exactly what it depends on. No price list, but no surprises either: the price is in writing before you order.",
    whyTitle: "Why there is no price list",
    whyBody1:
      "We hold no stock. There is no shelf of machines with labels on them, so there is no price we can write up in advance. We go out into the supplier network once we know what the job needs — and the price is what we can source it for, plus our work.",
    whyBody2:
      "We could write “from DKK 1,995” and let you discover the rest along the way. We do not. A figure we cannot document for your actual order is not information, it is bait, and you find out when the quote arrives anyway.",
    driversTitle: "What decides your price",
    driversLead: "Six things move the figure. The first three move it most.",
    quoteTitle: "What the quote contains",
    quoteLead:
      "The price never arrives on its own. All of this is in writing before you order anything:",
    quotePoints: [
      "Price per unit and in total — not just a lump sum.",
      "Exactly which model and specification you are getting.",
      "Condition per unit — and the battery's actual capacity as a percentage on the laptops.",
      "The warranty terms, and who you contact if something breaks.",
      "What comes with them, and what does not.",
      "A timeframe — not a promise of a fixed delivery date we cannot keep.",
    ],
    freeTitle: "Does a quote cost anything?",
    freeBody:
      "No. There is no charge for asking and no obligation once you have the answer. If nothing suits the job we will say so — that is a shorter conversation than selling you something that does not solve the problem.",
    fastTitle: "How to get a realistic figure quickly",
    fastLead: "The more of this you write straight away, the fewer rounds back and forth:",
    fastPoints: [
      "How many machines, and whether they need to be identical.",
      "What they are for — office work, engineering, image work.",
      "Whether monitors, docks or cables go with them.",
      "When it has to be ready.",
      "Whether you are clearing out older equipment at the same time.",
    ],
    relatedTitle: "Where to go next",
    related: [
      { href: "/kvalitet", label: "Condition, testing and what to ask about" },
      { href: "/ydelser/levering", label: "Delivery and timeframes" },
      { href: "/tilbud", label: "Get a quote for your fleet" },
    ],
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/priser", params.lang),
  };
}

export default function PricingPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  /* The two questions a buyer types into a search box before they trust a
     supplier enough to write to them. Marked up so the answers can appear
     under the result rather than only on the page. */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: htmlLang[lang],
    mainEntity: [
      { q: c.whyTitle, a: `${c.whyBody1} ${c.whyBody2}` },
      { q: c.freeTitle, a: c.freeBody },
    ].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHeader
        title={c.title}
        description={c.description}
        lang={lang}
        href="/priser"
        crumb={lang === "da" ? "Priser" : "Pricing"}
      />

      <section className="lit lit-paper py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
              {c.whyTitle}
            </h2>
            <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.whyBody1}</p>
            <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.whyBody2}</p>

            <div className="mt-12 border-t border-white/15 pt-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                {c.driversTitle}
              </h2>
              <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.driversLead}</p>
            </div>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-x-12 border-t border-white/15 md:grid-cols-2">
            {drivers.map((driver, i) => (
              <li key={driver.heading.da} className="border-b border-white/10 py-6">
                <div className="flex gap-5">
                  <span className="pt-1 font-display text-sm font-semibold tabular-nums text-paper/55">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold tracking-tight text-paper">
                      {driver.heading[lang]}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-paper/65">{driver.body[lang]}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 max-w-3xl border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight text-paper">
              {c.quoteTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-paper/65">{c.quoteLead}</p>
            <ul className="mt-5 space-y-3">
              {c.quotePoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-paper/80">
                  <Check
                    className="mt-1.5 h-4 w-4 flex-shrink-0 text-brand-300"
                    strokeWidth={2.5}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 max-w-3xl border-t border-white/15 pt-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
              {c.freeTitle}
            </h2>
            <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.freeBody}</p>
          </div>

          <div className="mt-12 max-w-3xl border-t border-white/15 pt-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
              {c.fastTitle}
            </h2>
            <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.fastLead}</p>
            <ul className="mt-5 space-y-2.5">
              {c.fastPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-paper/65">
                  <span aria-hidden="true" className="mt-3 h-px w-4 flex-shrink-0 bg-brand-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 max-w-3xl border-t border-white/15 pt-8">
            <p className="eyebrow text-brand-300">{c.relatedTitle}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 px-5 text-sm font-semibold text-paper/80 transition hover:border-white/25 hover:text-paper"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

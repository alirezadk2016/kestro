import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Handshake, ShieldCheck, Banknote, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import CtaSection from "@/components/CtaSection";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Sælg jeres brugte IT-udstyr | Kestro",
    metaDescription:
      "Vi køber brugte erhvervscomputere, telefoner og tablets – med sikker datasletning og afhentning i Danmark og Norge.",
    title: "Sælg jeres brugte IT-udstyr",
    description:
      "Skal I udskifte medarbejdernes computere eller rydde op efter en flytning? Vi køber brugt erhvervsudstyr og giver det et nyt liv.",
    howTitle: "Sådan foregår det",
    buyTitle: "Hvad vi køber",
    buyNote: "Er I i tvivl, om jeres udstyr er relevant? Spørg os – vi kigger gerne på det.",
    dataTitle: "Datasikkerhed",
    dataBody:
      "Enhederne får slettet lagermedierne, før de klargøres til videresalg. Har I særlige krav til dokumentation for datasletning – f.eks. i forbindelse med jeres GDPR-procedurer – så sig til, når I kontakter os, så aftaler vi, hvordan det håndteres.",
    fleetTitle: "Skal hele flåden skiftes ud på én gang?",
    fleetBody:
      "Så kan vi håndtere begge ender: vi køber det gamle udstyr og leverer de nye enheder. Værdien af det brugte kan modregnes i det nye indkøb, så I får én aftale i stedet for to forløb.",
    fleetLink: "Se flådeløsninger",
    overstockTitle: "Også overskudslager og returvarer",
    overstockBody1:
      "Det er ikke kun udtjente medarbejdermaskiner, vi køber. Ligger der udstyr, som aldrig nåede ud til en kunde – returvarer, demoenheder, varer fra en aflyst ordre eller modeller, der ikke blev solgt – så står det og taber værdi, hver måned der går.",
    overstockBody2:
      "Fordi vi ikke selv skal have varerne på et lager, men finder køberen først, kan vi også tage partier, en almindelig opkøber ville sige nej til. Send os en liste med modeller, antal og stand, så siger vi ærligt, om vi kan afsætte det – og hvad det realistisk er værd.",
    formTitle: "Fortæl os, hvad I har",
    formBody: "Udfyld formularen, så vender vi tilbage med en vurdering.",
  },
  en: {
    metaTitle: "Sell us your used IT equipment | Kestro",
    metaDescription:
      "Replacing your company's IT equipment? Kestro buys used business computers, phones and tablets — with secure data erasure and collection in Denmark and Norway.",
    title: "Sell us your used IT equipment",
    description:
      "Replacing your staff computers, or clearing out after a move? We buy used business equipment and give it a second life.",
    howTitle: "How it works",
    buyTitle: "What we buy",
    buyNote: "Not sure whether your equipment is relevant? Ask us — we are happy to look at it.",
    dataTitle: "Data security",
    dataBody:
      "Machines have their storage media erased before they are prepared for resale. If you have specific requirements for erasure documentation — for your GDPR procedures, for instance — say so when you contact us and we agree how it is handled.",
    fleetTitle: "Replacing the whole fleet at once?",
    fleetBody:
      "Then we can handle both ends: we buy the old equipment and deliver the new machines. The value of the used kit can be offset against the new purchase, so you get one agreement instead of two processes.",
    fleetLink: "See fleet solutions",
    overstockTitle: "Overstock and returns as well",
    overstockBody1:
      "It is not only worn-out staff machines we buy. If you are sitting on equipment that never reached a customer — returns, demo units, goods from a cancelled order or models that never sold — it loses value every month it stands still.",
    overstockBody2:
      "Because we do not have to put the goods in a warehouse of our own, but find the buyer first, we can also take batches an ordinary buyer would turn down. Send us a list with models, quantity and condition, and we will tell you honestly whether we can place it — and what it is realistically worth.",
    formTitle: "Tell us what you have",
    formBody: "Fill in the form and we will come back with a valuation.",
  },
} satisfies Record<Lang, Record<string, string>>;

const formCopy = {
  subjectPrefix: { da: "Salg af brugt udstyr", en: "Selling used equipment" },
  messagePlaceholder: {
    da: "Antal enheder, modeller, cirka alder og stand – samt hvornår udstyret er klar til afhentning.",
    en: "Quantity, models, rough age and condition — and when the equipment is ready for collection.",
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/saelg-til-os", params.lang),
  };
}

const steps = [
  {
    icon: ClipboardList,
    title: { da: "1. Send os en liste", en: "1. Send us a list" },
    description: {
      da: "Fortæl os hvad I har – antal enheder, modeller og cirka alder. Jo mere præcist, jo hurtigere kan vi vurdere.",
      en: "Tell us what you have — quantity, models and rough age. The more precise, the faster we can assess it.",
    },
  },
  {
    icon: Handshake,
    title: { da: "2. I får et tilbud", en: "2. You get an offer" },
    description: {
      da: "Vi vurderer udstyret og vender tilbage med et bud. I er ikke bundet af noget, før I siger ja.",
      en: "We assess the equipment and come back with an offer. Nothing is binding until you say yes.",
    },
  },
  {
    icon: ShieldCheck,
    title: { da: "3. Afhentning og datasletning", en: "3. Collection and data erasure" },
    description: {
      da: "Vi aftaler afhentning, og alle data slettes sikkert, før enhederne klargøres til videresalg.",
      en: "We arrange collection, and all data is securely erased before the machines are prepared for resale.",
    },
  },
  {
    icon: Banknote,
    title: { da: "4. Betaling", en: "4. Payment" },
    description: {
      da: "Betaling sker efter den aftale, vi indgår – vi gennemgår vilkårene på forhånd.",
      en: "Payment follows the agreement we make — we go through the terms in advance.",
    },
  },
];

const accepted = [
  { da: "Bærbare computere", en: "Laptops" },
  { da: "Stationære computere", en: "Desktop computers" },
  { da: "Mini-pc'er", en: "Mini PCs" },
  { da: "Skærme", en: "Monitors" },
  { da: "Tablets", en: "Tablets" },
  { da: "Smartphones", en: "Smartphones" },
  { da: "Smartwatches", en: "Smartwatches" },
  { da: "Dockingstationer", en: "Docking stations" },
  { da: "Serverudstyr (efter aftale)", en: "Server equipment (by arrangement)" },
];

export default function SaelgTilOsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="py-14 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.howTitle}
            </h2>

            <div className="mt-8 space-y-8">
              {steps.map((step) => (
                <div key={step.title.da} className="flex gap-5">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300">
                    <step.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-paper">{step.title[lang]}</h3>
                    <p className="mt-1.5 text-base leading-7 text-paper/65">
                      {step.description[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-14 sm:py-24">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {c.buyTitle}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {accepted.map((item) => (
                  <li
                    key={item.da}
                    className="border border-white/15 px-3.5 py-1.5 text-sm text-paper/80"
                  >
                    {item[lang]}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-paper/55">{c.buyNote}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {c.dataTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-paper/65">{c.dataBody}</p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-brand-400/25 bg-brand-500/10 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-paper">{c.fleetTitle}</h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-paper/65">{c.fleetBody}</p>
            <Link
              href={localePath("/flaadeloesninger", lang)}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
            >
              {c.fleetLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.overstockTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.overstockBody1}</p>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.overstockBody2}</p>

            <h2 className="mt-14 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.formTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-paper/65">{c.formBody}</p>

            <div className="mt-8 border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <ContactForm
                lang={lang}
                subjectPrefix={formCopy.subjectPrefix}
                messagePlaceholder={formCopy.messagePlaceholder}
              />
            </div>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

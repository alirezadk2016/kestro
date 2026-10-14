import type { Metadata } from "next";
import MarkTile from "@/components/MarkTile";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { type CraftMarkName } from "@/components/CraftMark";
import RelatedLinks from "@/components/RelatedLinks";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import CtaSection from "@/components/CtaSection";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import FactNote from "@/components/FactNote";

const copy = {
  da: {
    metaTitle: "Sælg brugt IT-udstyr – vi henter og sletter data | Kestro",
    metaDescription:
      "Vi køber brugte computere, telefoner og tablets fra virksomheder i Danmark og Norge, henter dem og sletter lagermedierne. I får en vurdering først.",
    title: "Sælg jeres brugte IT-udstyr",
    /* Answer first: yes, what, and what happens to the data. */
    description:
      "Vi køber brugte erhvervscomputere, telefoner og tablets fra virksomheder i Danmark og Norge. Vi henter dem, sletter lagermedierne og giver dem et nyt liv – og I får en vurdering, før I beslutter jer.",
    howTitle: "Hvordan foregår et salg?",
    buyTitle: "Hvad køber I?",
    buyNote: "Er I i tvivl, om jeres udstyr er relevant? Spørg os – vi kigger gerne på det.",
    dataTitle: "Hvad sker der med vores data?",
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
    metaTitle: "Sell used IT equipment — collection, data erasure | Kestro",
    metaDescription:
      "Replacing company IT? Kestro buys used business computers, phones and tablets in Denmark and Norway, collects them and erases the storage.",
    title: "Sell your company's used IT equipment to us",
    description:
      "We buy used business computers, phones and tablets from companies in Denmark and Norway. We collect them, erase the storage and give them a second life — and you get a valuation before you decide.",
    howTitle: "How does a sale work?",
    buyTitle: "What do you buy?",
    buyNote: "Not sure whether your equipment is relevant? Ask us — we are happy to look at it.",
    dataTitle: "What happens to our data?",
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

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/saelg-til-os", params.lang),
  };
}

const steps = [
  {
    mark: "written" as CraftMarkName,
    title: { da: "1. Send os en liste", en: "1. Send us a list" },
    description: {
      da: "Fortæl os, hvad I har – antal enheder, modeller og cirka alder. Jo mere præcist, jo hurtigere kan vi vurdere.",
      en: "Tell us what you have — quantity, models and rough age. The more precise, the faster we can assess it.",
    },
  },
  {
    mark: "network" as CraftMarkName,
    title: { da: "2. I får et tilbud", en: "2. You get an offer" },
    description: {
      da: "Vi vurderer udstyret og vender tilbage med et bud. I er ikke bundet af noget, før I siger ja.",
      en: "We assess the equipment and come back with an offer. Nothing is binding until you say yes.",
    },
  },
  {
    mark: "tested" as CraftMarkName,
    title: { da: "3. Afhentning og datasletning", en: "3. Collection and data erasure" },
    description: {
      da: "Vi aftaler afhentning, og er der data på enhederne, slettes lagermedierne, før de klargøres til videresalg.",
      en: "We arrange collection, and if there is data on the units, the storage media are erased before the machines are prepared for resale.",
    },
  },
  {
    mark: "who" as CraftMarkName,
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

export default async function SaelgTilOsPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <PageSchema lang={lang} route="/saelg-til-os" name={c.title} description={c.description} />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/saelg-til-os"
            crumb={lang === "da" ? "Sælg til os" : "Sell to us"}
            updated="/saelg-til-os"
          />

          {/* The form is the page's one action and sits 2,700px down a phone,
              under the steps, the list and the data answer. The header's
              quote button is for buying, so this page had no way to its own
              form above the fold. */}
          <Button
            href="#saelg-formular"
            className="mt-8 w-full sm:w-auto"
            icon={<ArrowDown className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
          >
            {c.formTitle}
          </Button>

          <h2 className="mt-14 max-w-3xl text-balance font-display t-h2 font-extrabold tracking-display text-ink-900 sm:mt-16">
            {c.howTitle}
          </h2>

          {/* The same route as the front page's process: a spine down a
              phone, a rail across a desktop with a station per step. The four
              steps were a stack in the left third of a wide screen, with the
              other two thirds empty for a screen and a half. */}
          <ol className="relative mt-8 grid grid-cols-1 lg:mt-10 lg:grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 hidden h-px w-[calc(75%+2rem)] bg-ink-100 lg:block"
            />
            {steps.map((step, i) => (
              <li
                key={step.title.da}
                className="relative flex gap-5 pb-8 last:pb-0 lg:block lg:py-9 lg:pl-8 lg:pr-8 lg:first:pl-0"
              >
                <div aria-hidden="true" className="relative w-11 flex-none lg:hidden">
                  {i < steps.length - 1 && (
                    <span className="absolute left-1/2 top-12 h-[calc(100%-2.25rem)] w-px -translate-x-1/2 bg-gradient-to-b from-brand-600/50 via-ink-200 to-ink-200" />
                  )}
                  <MarkTile name={step.mark} size="md" className="relative" />
                </div>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-0 hidden flex-col items-start lg:flex ${
                    i === 0 ? "left-0" : "left-8"
                  }`}
                >
                  <span className="-mt-[4px] h-[7px] w-[7px] rotate-45 border border-brand-600" />
                  <span className="ml-[3px] h-9 w-px bg-gradient-to-b from-ink-300 to-transparent" />
                </span>
                <div className="min-w-0 flex-1 lg:flex-none">
                  <MarkTile name={step.mark} size="md" className="mb-5 !hidden lg:!inline-flex" />
                  <h3 className="text-base font-semibold text-ink-900 lg:text-lg">
                    {step.title[lang]}
                  </h3>
                  <p className="mt-1.5 text-base leading-[1.75] text-ink-700 lg:text-sm lg:leading-[1.6]">
                    {step.description[lang]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper-dim py-10 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
                {c.buyTitle}
              </h2>
              {/* A checklist, not pills: rounded plate-sm pills are the
                  site's onward links, and these went nowhere when tapped. */}
              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 min-[400px]:grid-cols-2">
                {accepted.map((item) => (
                  <li key={item.da} className="flex gap-2.5 text-base leading-6 text-ink-800">
                    <Check
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 flex-none text-brand-700"
                      strokeWidth={2}
                    />
                    {item[lang]}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-[1.6] text-ink-600">{c.buyNote}</p>
            </div>

            <div>
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
                {c.dataTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.75] text-ink-700">{c.dataBody}</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
            <h2 className="font-display t-h3 font-bold tracking-tight text-ink-900">
              {c.fleetTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-[1.75] text-ink-700">{c.fleetBody}</p>
            <Link
              href={localePath("/flaadeloesninger", lang)}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink-900"
            >
              {c.fleetLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          {/* Text and form side by side from lg: the form was a 600px column
              under the text with the right half of the screen empty beside
              both. On a phone the order is the same as before. */}
          <div className="grid max-w-3xl gap-14 lg:max-w-none lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
                {c.overstockTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.75] text-ink-700">{c.overstockBody1}</p>
              <p className="mt-4 text-base leading-[1.75] text-ink-700">{c.overstockBody2}</p>
            </div>

            <div className="lg:col-span-7">
              <h2
                id="saelg-formular"
                className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900"
              >
                {c.formTitle}
              </h2>
              <p className="mt-3 text-base leading-[1.75] text-ink-700">{c.formBody}</p>

              <div className="mt-8 plate p-6 sm:p-8">
                <ContactForm
                  lang={lang}
                  subjectPrefix={formCopy.subjectPrefix}
                  messagePlaceholder={formCopy.messagePlaceholder}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <RelatedLinks
        lang={lang}
        links={[
          {
            href: "/vejledninger/slet-data-foer-du-saelger",
            label: { da: "Sådan sletter I data først", en: "How to erase the data first" },
          },
          {
            href: "/ydelser/overskudslager-og-returvarer",
            label: { da: "Overskudslager og returvarer", en: "Surplus stock and returns" },
          },
        ]}
      />

      <FactNote lang={lang} ids={["nistSanitization"]} />

      <CtaSection lang={lang} />
    </>
  );
}

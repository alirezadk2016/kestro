import type { Metadata } from "next";
import MarkTile from "@/components/MarkTile";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { type CraftMarkName } from "@/components/CraftMark";
import ServiceTile from "@/components/ServiceTile";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import FactNote from "@/components/FactNote";
import { services as serviceList } from "@/lib/services";
import { repairs } from "@/lib/repairs";

const copy = {
  da: {
    metaTitle: "Ydelser: indkøb, klargøring, levering, opkøb af IT | Kestro",
    metaDescription:
      "Alle Kestros ydelser: indkøb af renoveret IT, flådeleverancer, klargøring med dansk tastatur, reparation, opkøb af brugt udstyr og nye arbejdspladser.",
    stepLink: "Læs mere",
    title: "Det hjælper vi med",
    /* Answer first, with the two counts the page actually lists. */
    description: `Kestro er leverandør af brugt erhvervs-IT: ${serviceList.length} ydelser fra indkøb til opstart af nye arbejdspladser og et værksted med ${repairs.length} slags reparationer. Vi køber ind, sælger videre, opgraderer og tager gammelt udstyr retur – og I skal kun forholde jer til ét sted.`,
    processTitle: "Sådan foregår en leverance",
    processSub: "Fra brugt udstyr i Sydeuropa til testede maskiner, klar til nordisk brug, hos jer.",
    qualityTitle: "Kvalitetssikring",
    qualityBody:
      "Stand, batteritilstand, konfiguration og garantivilkår står skriftligt, før I bestiller. Vi lover ikke et fast antal måneders garanti på forhånd, fordi det afhænger af udstyret og leverandøren.",
    qualityLink: "Sådan vurderer vi stand",
  },
  en: {
    metaTitle: "Services: sourcing, setup, delivery, buy-back of IT | Kestro",
    metaDescription:
      "All Kestro services: sourcing refurbished IT, fleet deliveries, Nordic keyboards, repairs and upgrades, buying used equipment and new workstations.",
    stepLink: "Read more",
    title: "What we help with",
    description: `Kestro is a supplier of used business IT: ${serviceList.length} services from purchasing to setting up new workstations, and a workshop with ${repairs.length} kinds of repair. We buy in, sell on, upgrade and take old equipment back — and you only have one place to deal with.`,
    processTitle: "How a delivery works",
    processSub:
      "From used equipment in southern Europe to tested, Nordic-ready machines at your desks.",
    qualityTitle: "Quality assurance",
    qualityBody:
      "Condition, battery health, configuration and warranty terms are in writing before you order. We do not promise a fixed number of months of warranty up front, because that depends on the equipment and the supplier.",
    qualityLink: "How we assess condition",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/ydelser", params.lang),
  };
}

const services = [
  {
    mark: "network" as CraftMarkName,
    title: { da: "Indkøb og sourcing", en: "Sourcing and purchasing" },
    description: {
      da: "I fortæller, hvad I skal bruge. Vi finder maskinerne i vores leverandørnetværk, klargør dem og leverer dem – fra enkelte enheder til hele afdelinger.",
      en: "You tell us what you need. We find the machines in our supplier network, prepare them and deliver — from single units to whole departments.",
    },
    href: "/produkter",
    linkLabel: { da: "Se hvad vi skaffer", en: "See what we source" },
  },
  {
    mark: "who" as CraftMarkName,
    title: { da: "Flådeleverancer", en: "Fleet deliveries" },
    description: {
      da: "Samme konfiguration til alle medarbejdere, faste specifikationer og mulighed for at bytte det gamle udstyr ind som en del af aftalen.",
      en: "The same configuration for every employee, fixed specifications, and the option to trade the old equipment in as part of the deal.",
    },
    href: "/flaadeloesninger",
    linkLabel: { da: "Se flådeløsninger", en: "See fleet solutions" },
  },
  {
    mark: "repair" as CraftMarkName,
    title: { da: "Opgradering og reparation", en: "Upgrades and repairs" },
    description: {
      da: "Mere hukommelse, ny disk, nyt batteri, nordisk tastatur, Windows og licenser. Ofte billigere end at udskifte maskinen – og vi siger til, hvis det ikke kan betale sig.",
      en: "More memory, a new disk, a new battery, a Danish or Norwegian keyboard, Windows and licences. Often cheaper than replacing the machine — and we say so when it is not worth it.",
    },
    href: "/reparation",
    linkLabel: { da: "Se opgraderinger", en: "See upgrades" },
  },
  {
    mark: "sustainable" as CraftMarkName,
    title: { da: "Opkøb af brugt udstyr", en: "Buying used equipment" },
    description: {
      da: "Vi køber og henter gamle maskiner og sletter lagermedierne. I får en vurdering, før I beslutter jer.",
      en: "We buy and collect old machines and erase the storage. You get a valuation before you decide.",
    },
    href: "/saelg-til-os",
    linkLabel: { da: "Få en vurdering", en: "Get a valuation" },
  },
  {
    mark: "batch" as CraftMarkName,
    title: { da: "Overskudslager og returvarer", en: "Overstock and returns" },
    description: {
      da: "Ligger der udstyr, der aldrig kom ud til kunderne – returvarer, demoenheder eller varer fra en aflyst ordre? Vi finder køberne i stedet for, at det står og taber værdi.",
      en: "Sitting on equipment that never reached a customer — returns, demo units or goods from a cancelled order? We find the buyers instead of letting it lose value on a shelf.",
    },
    href: "/ydelser/overskudslager-og-returvarer",
    linkLabel: { da: "Læs mere", en: "Read more" },
  },
  {
    mark: "install" as CraftMarkName,
    title: { da: "Opstart af nye arbejdspladser", en: "Setting up new workstations" },
    description: {
      da: "Skal alt stå klar til første arbejdsdag, hjælper vi med at vælge udstyret, klargøre det og få det leveret samlet – skærme, docks og kabler indregnet.",
      en: "If everything has to be ready for the first day of work, we help choose the equipment, prepare it and deliver it in one go — monitors, docks and cables included.",
    },
    href: "/ydelser/opstart-af-arbejdspladser",
    linkLabel: { da: "Læs mere", en: "Read more" },
  },
];

const steps = [
  {
    mark: "network" as CraftMarkName,
    slug: "sourcing-og-indkoeb",
    title: { da: "Sourcing og indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi finder brugte erhvervsbærbare og -stationære hos leverandører i Sydeuropa til den enkelte ordre – ikke ud fra, hvad der står på en hylde.",
      en: "We find used business laptops and desktops through suppliers in southern Europe for the individual order — not from whatever is on a shelf.",
    },
  },
  {
    mark: "tested" as CraftMarkName,
    slug: "klargoering-og-test",
    title: { da: "Klargøring, test og opgradering", en: "Preparation, testing and upgrades" },
    description: {
      da: "Funktionstest af skærm, tastatur, batteri og ydeevne. Slidte dele skiftes, RAM og SSD opgraderes efter behov, og data slettes.",
      en: "A function test of screen, keyboard, battery and performance. Worn parts are replaced, memory and disk upgraded where needed, and data erased.",
    },
  },
  {
    mark: "nordic" as CraftMarkName,
    slug: "nordisk-tilpasning",
    title: { da: "Nordisk tilpasning og software", en: "Nordic preparation and software" },
    description: {
      da: "Dansk eller norsk tastatur, Windows med drivere og sprogopsætning, og licenserne på plads fra dag ét.",
      en: "A Danish or Norwegian keyboard, Windows with drivers and language settings, and the licences in order from day one.",
    },
  },
  {
    mark: "delivery" as CraftMarkName,
    slug: "levering",
    title: { da: "Levering til virksomheden", en: "Delivery to the company" },
    description: {
      da: "Til virksomheder i Danmark og Norge. Leveringstiden afhænger af ordren, og tidsrammen får I, før I bestiller.",
      en: "To companies in Denmark and Norway. Lead time depends on the order, and you get the time frame before you order.",
    },
  },
];

export default async function YdelserPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <PageSchema
        lang={lang}
        type="CollectionPage"
        route="/ydelser"
        name={c.title}
        description={c.description}
      />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/ydelser"
            crumb={lang === "da" ? "Ydelser" : "Services"}

            updated="/ydelser"
          />

          {/* Was a hand-rolled Link card with a .plate and an 11px chip. It is
              the same object as the repair tiles — a card that goes somewhere,
              with a mark naming what is there — so it is the same component,
              and the site stops running two card languages on two pages. */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceTile
                key={service.title.da}
                href={localePath(service.href, lang)}
                mark={service.mark}
                title={service.title[lang]}
                summary={service.description[lang]}
                prompt={service.linkLabel[lang]}
                headingLevel={2}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.processTitle}
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.processSub}</p>

            <div className="mt-10 space-y-10">
              {steps.map((step) => (
                <Link
                  key={step.title.da}
                  href={localePath(`/ydelser/${step.slug}`, lang)}
                  className="group -mx-4 flex gap-5 rounded-xl px-4 py-4 transition-colors hover:bg-white/5 sm:gap-6"
                >
                  <MarkTile name={step.mark} size="md" />
                  <div>
                    <h3 className="text-lg font-semibold text-paper transition-colors group-hover:text-brand-300">
                      {step.title[lang]}
                    </h3>
                    <p className="mt-2 text-base leading-[1.75] text-paper/75">
                      {step.description[lang]}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                      {c.stepLink}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 plate p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-paper">{c.qualityTitle}</h3>
              <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.qualityBody}</p>
              <Link
                href={localePath("/kvalitet", lang)}
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
              >
                {c.qualityLink}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Faq lang={lang} />

      {/* The quality section says the machines are reset before they go on;
          this is what the levels of "reset" actually are. */}
      <FactNote lang={lang} ids={["nistSanitization"]} />

      <CtaSection lang={lang} />
    </>
  );
}

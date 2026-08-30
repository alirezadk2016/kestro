import type { Metadata } from "next";
import Link from "next/link";
import {
  PackageSearch,
  ShieldCheck,
  Keyboard,
  Truck,
  Building2,
  Wrench,
  Recycle,
  Boxes,
  Rocket,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Ydelser: indkøb, flåder, opgradering og opkøb | Kestro",
    metaDescription:
      "Indkøb af renoveret IT, flådeleverancer, opgradering og reparation, opkøb af brugt udstyr og opstart af nye arbejdspladser.",
    stepLink: "Læs mere",
    title: "Det hjælper vi med",
    description:
      "Kestro er indkøbspartner på brugt erhvervs-IT. Vi køber ind, sælger videre, opgraderer og tager gammelt udstyr retur – og I skal kun forholde jer til ét sted.",
    eyebrow: "Processen",
    processTitle: "Sådan foregår en leverance",
    processSub: "Fra brugt udstyr i Sydeuropa til testede, nordisk-klargjorte maskiner hos jer.",
    qualityTitle: "Kvalitetssikring",
    qualityBody:
      "Enhederne funktionstestes og nulstilles, før de sendes videre. Vi oplyser stand, batteritilstand, konfiguration og garantivilkår skriftligt, før I bestiller – og vi lover ikke et fast antal måneders garanti på forhånd, fordi det afhænger af udstyret og leverandøren bag den enkelte leverance.",
    qualityLink: "Se hvordan vi vurderer stand og kvalitet",
  },
  en: {
    metaTitle: "Services: sourcing, fleets, upgrades and buy-back | Kestro",
    metaDescription:
      "Sourcing refurbished IT, fleet deliveries, upgrades and repairs, buying used equipment and setting up new workstations.",
    stepLink: "Read more",
    title: "What we help with",
    description:
      "Kestro is a sourcing partner for used business IT. We buy in, sell on, upgrade and take old equipment back — and you only have one place to deal with.",
    eyebrow: "The process",
    processTitle: "How a delivery works",
    processSub:
      "From used equipment in southern Europe to tested, Nordic-ready machines at your desks.",
    qualityTitle: "Quality assurance",
    qualityBody:
      "The machines are function-tested and reset before they are passed on. We state condition, battery health, configuration and warranty terms in writing before you order — and we do not promise a fixed number of months of warranty up front, because that depends on the equipment and the supplier behind the individual delivery.",
    qualityLink: "See how we assess condition and quality",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/ydelser", params.lang),
  };
}

const services = [
  {
    icon: PackageSearch,
    title: { da: "Indkøb og sourcing", en: "Sourcing and purchasing" },
    description: {
      da: "I fortæller, hvad I skal bruge. Vi finder maskinerne i vores leverandørnetværk, klargør dem og leverer dem – fra enkelte enheder til hele afdelinger.",
      en: "You tell us what you need. We find the machines in our supplier network, prepare them and deliver — from single units to whole departments.",
    },
    href: "/produkter",
    linkLabel: { da: "Se hvad vi skaffer", en: "See what we source" },
  },
  {
    icon: Building2,
    title: { da: "Flådeleverancer", en: "Fleet deliveries" },
    description: {
      da: "Samme konfiguration til alle medarbejdere, faste specifikationer og mulighed for at bytte det gamle udstyr ind som en del af aftalen.",
      en: "The same configuration for every employee, fixed specifications, and the option to trade the old equipment in as part of the deal.",
    },
    href: "/flaadeloesninger",
    linkLabel: { da: "Se flådeløsninger", en: "See fleet solutions" },
  },
  {
    icon: Wrench,
    title: { da: "Opgradering og reparation", en: "Upgrades and repairs" },
    description: {
      da: "Mere hukommelse, ny disk, nyt batteri, nordisk tastatur, Windows og licenser. Ofte billigere end at udskifte maskinen – og vi siger til, hvis det ikke kan betale sig.",
      en: "More memory, a new disk, a new battery, a Nordic keyboard, Windows and licences. Often cheaper than replacing the machine — and we say so when it is not worth it.",
    },
    href: "/reparation",
    linkLabel: { da: "Se opgraderinger", en: "See upgrades" },
  },
  {
    icon: Recycle,
    title: { da: "Opkøb af brugt udstyr", en: "Buying used equipment" },
    description: {
      da: "Skal I af med gamle maskiner, køber vi dem og henter dem. Er der data på enhederne, sletter vi dem og kan levere dokumentation per enhed. I får en vurdering, før I beslutter jer.",
      en: "If you need to get rid of old machines, we buy them and collect them. If there is data on the units, we erase it and can provide documentation per device. You get a valuation before you decide.",
    },
    href: "/saelg-til-os",
    linkLabel: { da: "Få en vurdering", en: "Get a valuation" },
  },
  {
    icon: Boxes,
    title: { da: "Overskudslager og returvarer", en: "Overstock and returns" },
    description: {
      da: "Ligger der udstyr, der aldrig kom ud til kunderne – returvarer, demoenheder eller varer fra en aflyst ordre? Vi finder køberne i stedet for, at det står og taber værdi.",
      en: "Sitting on equipment that never reached a customer — returns, demo units or goods from a cancelled order? We find the buyers instead of letting it lose value on a shelf.",
    },
    href: "/ydelser/overskudslager-og-returvarer",
    linkLabel: { da: "Læs mere", en: "Read more" },
  },
  {
    icon: Rocket,
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
    icon: PackageSearch,
    slug: "sourcing-og-indkoeb",
    title: { da: "Sourcing og indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi arbejder som indkøbspartner og finder brugte erhvervsbærbare og -stationære hos leverandører i Sydeuropa – uden selv at binde kapital i fast lager. Det betyder, at vi kan tilpasse sourcingen til den enkelte ordre i stedet for at være begrænset af, hvad der tilfældigvis står på hylden.",
      en: "We work as a sourcing partner and find used business laptops and desktops through suppliers in southern Europe — without tying up capital in stock of our own. That means we can shape the sourcing around the individual order instead of being limited by whatever happens to be on a shelf.",
    },
  },
  {
    icon: ShieldCheck,
    slug: "klargoering-og-test",
    title: { da: "Klargøring, test og opgradering", en: "Preparation, testing and upgrades" },
    description: {
      da: "Enhederne gennemgår en funktionstest af skærm, tastatur, batteri og ydeevne. Slidte dele skiftes, RAM og SSD opgraderes efter behov, og tidligere data slettes, før enheden nulstilles.",
      en: "The machines go through a function test of screen, keyboard, battery and performance. Worn parts are replaced, memory and disk are upgraded where needed, and previous data is erased before the machine is reset.",
    },
  },
  {
    icon: Keyboard,
    slug: "nordisk-tilpasning",
    title: { da: "Nordisk tilpasning og software", en: "Nordic preparation and software" },
    description: {
      da: "Tastaturet skiftes til dansk eller norsk layout, så æ, ø og å sidder korrekt. Windows installeres med drivere og sprogopsætning, og vi hjælper med at få licenserne på plads, så maskinerne kører lovligt fra dag ét.",
      en: "The keyboard is changed to a Danish or Norwegian layout, so æ, ø and å sit where they should. Windows is installed with drivers and language settings, and we help get the licences in order so the machines run legally from day one.",
    },
  },
  {
    icon: Truck,
    slug: "levering",
    title: { da: "Levering til virksomheden", en: "Delivery to the company" },
    description: {
      da: "Vi leverer til virksomheder i Danmark og Norge i de mængder, I har brug for. Fordi vi sourcer per ordre, afhænger leveringstiden af den konkrete bestilling; vi oplyser en tidsramme, når vi har talt om jeres behov.",
      en: "We deliver to companies in Denmark and Norway in whatever quantity you need. Because we source per order, lead time depends on the specific order; we give you a time frame once we have talked about what you need.",
    },
  },
];

export default function YdelserPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="py-14 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title.da}
                href={localePath(service.href, lang)}
                className="group flex h-full flex-col border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-300 hover:border-white/35 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 text-base font-semibold text-paper group-hover:text-paper sm:text-lg">
                  {service.title[lang]}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-paper/65">
                  {service.description[lang]}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                  {service.linkLabel[lang]}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-14 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.processTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-paper/65">{c.processSub}</p>

            <div className="mt-10 space-y-10">
              {steps.map((step) => (
                <Link
                  key={step.title.da}
                  href={localePath(`/ydelser/${step.slug}`, lang)}
                  className="group -mx-4 flex gap-5 rounded-xl px-4 py-4 transition-colors hover:bg-white/5 sm:gap-6"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300 shadow-sm">
                    <step.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-paper transition-colors group-hover:text-brand-300">
                      {step.title[lang]}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-paper/65">
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

            <div className="mt-12 border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-paper">{c.qualityTitle}</h3>
              <p className="mt-3 text-base leading-7 text-paper/65">{c.qualityBody}</p>
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

      <CtaSection lang={lang} />
    </>
  );
}

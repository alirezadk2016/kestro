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

export const metadata: Metadata = {
  title: "Ydelser | Indkøb, flåder, opgradering og opkøb af brugt IT | Kestro",
  description:
    "Alt vi hjælper virksomheder med: indkøb af renoveret IT-udstyr, flådeleverancer, opgradering og reparation, opkøb af brugt udstyr, afsætning af overskudslager og opstart af nye arbejdspladser.",
  alternates: { canonical: "/ydelser" },
};

const services = [
  {
    icon: PackageSearch,
    title: "Indkøb og sourcing",
    description:
      "I fortæller, hvad I skal bruge. Vi finder maskinerne i vores leverandørnetværk, klargør dem og leverer dem – fra enkelte enheder til hele afdelinger.",
    href: "/produkter",
    linkLabel: "Se hvad vi skaffer",
  },
  {
    icon: Building2,
    title: "Flådeleverancer",
    description:
      "Samme konfiguration til alle medarbejdere, faste specifikationer og mulighed for at bytte det gamle udstyr ind som en del af aftalen.",
    href: "/flaadeloesninger",
    linkLabel: "Se flådeløsninger",
  },
  {
    icon: Wrench,
    title: "Opgradering og reparation",
    description:
      "Mere hukommelse, ny disk, nyt batteri, nordisk tastatur, Windows og licenser. Ofte billigere end at udskifte maskinen – og vi siger til, hvis det ikke kan betale sig.",
    href: "/reparation",
    linkLabel: "Se opgraderinger",
  },
  {
    icon: Recycle,
    title: "Opkøb af brugt udstyr",
    description:
      "Skal I af med gamle maskiner, køber vi dem, henter dem og sletter data med dokumentation per enhed. I får en vurdering, før I beslutter jer.",
    href: "/saelg-til-os",
    linkLabel: "Få en vurdering",
  },
  {
    icon: Boxes,
    title: "Overskudslager og returvarer",
    description:
      "Ligger der udstyr, der aldrig kom ud til kunderne – returvarer, demoenheder eller varer fra en aflyst ordre? Vi finder køberne i stedet for, at det står og taber værdi.",
    href: "/saelg-til-os",
    linkLabel: "Tal med os om afsætning",
  },
  {
    icon: Rocket,
    title: "Opstart af nye arbejdspladser",
    description:
      "Skal alt stå klar til første arbejdsdag, hjælper vi med at vælge udstyret, klargøre det og få det leveret samlet – skærme, docks og kabler indregnet.",
    href: "/kontakt",
    linkLabel: "Tal med os om opstart",
  },
];

const steps = [
  {
    icon: PackageSearch,
    title: "Sourcing og indkøb",
    description:
      "Vi arbejder som indkøbspartner og finder brugte erhvervsbærbare og -stationære hos leverandører i Sydeuropa – uden selv at binde kapital i fast lager. Det betyder, at vi kan tilpasse sourcingen til den enkelte ordre i stedet for at være begrænset af, hvad der tilfældigvis står på hylden.",
  },
  {
    icon: ShieldCheck,
    title: "Klargøring, test og opgradering",
    description:
      "Hver enhed gennemgår en funktionstest af skærm, tastatur, batteri og ydeevne. Slidte dele skiftes, RAM og SSD opgraderes efter behov, og tidligere data slettes sikkert, før enheden nulstilles.",
  },
  {
    icon: Keyboard,
    title: "Nordisk tilpasning og software",
    description:
      "Tastaturet skiftes til dansk eller norsk layout, så æ, ø og å sidder korrekt. Windows installeres med drivere og sprogopsætning, og vi hjælper med at få licenserne på plads, så maskinerne kører lovligt fra dag ét.",
  },
  {
    icon: Truck,
    title: "Levering til virksomheden",
    description:
      "Vi leverer til virksomheder i Danmark og Norge i de mængder, I har brug for. Fordi vi sourcer per ordre, afhænger leveringstiden af den konkrete bestilling; vi oplyser en tidsramme, når vi har talt om jeres behov.",
  },
];

export default function YdelserPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Det hjælper vi med"
            description="Kestro er indkøbspartner på brugt erhvervs-IT. Vi køber ind, sælger videre, opgraderer og tager gammelt udstyr retur – og I skal kun forholde jer til ét sted."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-brand-700 sm:text-lg">
                  {service.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                  {service.linkLabel}
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

      <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Processen
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sådan foregår en leverance
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Fra brugt udstyr i Sydeuropa til testede, nordisk-klargjorte maskiner hos jer.
            </p>

            <div className="mt-10 space-y-10">
              {steps.map((step) => (
                <div key={step.title} className="flex gap-5 sm:gap-6">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                    <step.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-base leading-7 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">Kvalitetssikring</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Ingen enhed sendes videre, før den er funktionstestet og nulstillet. Vi oplyser
                stand, batteritilstand, konfiguration og garantivilkår skriftligt, før I bestiller –
                og vi lover ikke et fast antal måneders garanti på forhånd, fordi det afhænger af
                udstyret og leverandøren bag den enkelte leverance.
              </p>
              <Link
                href="/kvalitet"
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Se hvordan vi vurderer stand og kvalitet
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Faq />

      <CtaSection />
    </>
  );
}

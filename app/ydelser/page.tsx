import type { Metadata } from "next";
import { PackageSearch, ShieldCheck, Keyboard, Truck } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Ydelser | Kestro",
  description:
    "Sådan finder, klargør og leverer Kestro renoveret erhvervshardware til virksomheder i Danmark og Norge.",
};

const steps = [
  {
    icon: PackageSearch,
    title: "Sourcing & indkøb",
    description:
      "Vi arbejder som broker og finder brugte erhvervsbærbare og -stationære fra pålidelige leverandører i Sydeuropa – uden selv at binde kapital i fast lager. Det betyder, at vi kan tilpasse sourcingen til den enkelte ordre i stedet for at være begrænset af, hvad der tilfældigvis står på hylden.",
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
      "Tastaturet skiftes til dansk/nordisk layout, så æ, ø og å sidder korrekt. Windows installeres med drivere og sprogopsætning, og vi hjælper med at få licenserne på plads, så maskinerne kører lovligt fra dag ét.",
  },
  {
    icon: Truck,
    title: "Levering til virksomheder",
    description:
      "Vi leverer til virksomheder i Danmark og Norge i de mængder, I har brug for – fra enkelte enheder til større indkøb. Fordi vi sourcer per ordre, afhænger leveringstiden af den konkrete bestilling; vi oplyser en tidsramme, når vi har talt om jeres behov.",
  },
];

export default function YdelserPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Sådan arbejder vi"
            description="Fra brugt udstyr i Sydeuropa til testet, nordisk-klargjort IT-hardware hos jer. Sådan ser processen ud, trin for trin."
          />

          <div className="mx-auto mt-16 max-w-3xl space-y-10">
            {steps.map((step) => (
              <div key={step.title} className="flex gap-6">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
                  <p className="mt-2 text-base leading-7 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hvad vi tilbyder
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Vi skaffer renoverede bærbare og stationære computere til erhverv – maskiner bygget
                til daglig kontorbrug frem for forbrugerbrug. Fordi vi sourcer per ordre, kan
                specifikationerne tilpasses den enkelte opgave: fortæl os om jeres behov, så finder
                vi enhederne, der matcher.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Kvalitetssikring
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Ingen enhed forlader klargøringen, før den er funktionstestet og nulstillet.
                Konkrete garantivilkår for jeres bestilling aftaler vi direkte, når vi har talt om
                omfang og enhedstype.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Faq />

      <CtaSection />
    </>
  );
}

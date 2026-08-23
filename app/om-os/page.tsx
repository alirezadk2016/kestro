import type { Metadata } from "next";
import { Route, Recycle, Users } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Om os | Kestro",
  description:
    "Kestro forbinder overskudshardware i Sydeuropa med virksomheder i Norden, der har brug for pålidelig IT uden nyprisen.",
};

const sections = [
  {
    icon: Route,
    title: "Hvad vi gør",
    description:
      "Kestro finder brugte erhvervsbærbare og -stationære fra pålidelige leverandører i Sydeuropa. Vi arbejder som broker uden fast eget lager, hvilket betyder, at vi sourcer enheder til den enkelte ordre i stedet for at være bundet af, hvad der tilfældigvis er på hylden. Hver enhed bliver funktionstestet, eventuelt opgraderet med mere RAM, og klargjort til det nordiske marked med dansk/nordisk tastatur og korrekt sprogopsætning, før den leveres til jer.",
  },
  {
    icon: Recycle,
    title: "Hvorfor renoveret hardware",
    description:
      "Renoveret udstyr forlænger enhedernes levetid, i stedet for at de kasseres for tidligt – og giver jer typisk samme ydeevne til en brøkdel af prisen på nyt. For virksomheder, der skal udstyre flere medarbejdere eller opgradere en hel IT-flåde, gør det en mærkbar forskel på budgettet.",
  },
  {
    icon: Users,
    title: "Hvem vi hjælper",
    description:
      "Vi arbejder med IT-indkøbere og beslutningstagere i danske og norske virksomheder – fra mindre virksomheder, der skal udstyre et nyt team, til større indkøb af flere enheder på én gang. Fortæl os om jeres behov, så finder vi de enheder, der matcher.",
  },
];

export default function OmOsPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Om Kestro"
            description="Vi bygger bro mellem overskudshardware i Sydeuropa og virksomheder i Danmark og Norge, der ønsker pålidelig IT-hardware uden den høje pris på nyt udstyr."
          />

          <div className="mx-auto mt-16 max-w-3xl space-y-10">
            {sections.map((section) => (
              <div key={section.title} className="flex gap-5">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <section.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

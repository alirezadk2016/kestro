import type { Metadata } from "next";
import { Route, Recycle, Users } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import TeamSection from "@/components/TeamSection";
import { team } from "@/lib/company";

export const metadata: Metadata = {
  title: "Om os | Kestro",
  description:
    "Kestro forbinder overskudshardware i Sydeuropa med virksomheder i Norden, der har brug for pålidelig IT uden nyprisen.",
};

const sections = [
  {
    icon: Route,
    title: "Vi er indkøbspartner – ikke webshop",
    description:
      "Kestro sidder ikke med et lager, I skal vælge fra. Vi arbejder som indkøbspartner: I fortæller, hvad I har brug for, og vi finder det i vores leverandørnetværk i Sydeuropa. Hver enhed bliver funktionstestet, eventuelt opgraderet med mere RAM, og klargjort til det nordiske marked med dansk/nordisk tastatur og korrekt sprogopsætning, før den leveres til jer.",
  },
  {
    icon: Recycle,
    title: "Fordelen ved ikke at have lager",
    description:
      "Når en leverandør har købt stort ind på forhånd, skal det lager afsættes – og I bliver tilbudt det, der står på hylden. Fordi vi sourcer til den enkelte ordre, kan vi i stedet gå efter de specifikationer, opgaven faktisk kræver. Samtidig forlænger renoveret udstyr enhedernes levetid og giver typisk samme ydeevne til en brøkdel af nyprisen.",
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

      <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
        <Container>
          <figure className="mx-auto max-w-3xl">
            <blockquote className="text-xl font-medium leading-9 text-slate-900 sm:text-2xl sm:leading-10">
              &ldquo;De fleste ringer til os, fordi de er trætte af at lede. De ved godt, hvad de
              skal bruge – de vil bare ikke bruge tre uger på at finde ud af, hvem der har det til
              den rigtige pris. Det er dét, vi laver.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{team[0].name}</span>
              {" – "}
              {team[0].role}, Kestro
            </figcaption>
          </figure>
        </Container>
      </section>

      <TeamSection />

      <CtaSection />
    </>
  );
}

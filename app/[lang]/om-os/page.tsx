import type { Metadata } from "next";
import { Route, Recycle, Users } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import WhyUs from "@/components/WhyUs";
import TeamSection from "@/components/TeamSection";
import { primaryContact } from "@/lib/company";
import { metaFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Om os | Kestro",
    metaDescription:
      "Kestro forbinder brugt erhvervshardware i Sydeuropa med virksomheder i Norden, der skal bruge testet IT-udstyr uden at købe nyt.",
    title: "Om Kestro",
    description:
      "Vi bygger bro mellem brugt erhvervshardware i Sydeuropa og virksomheder i Danmark og Norge, der hellere vil have en testet maskine til opgaven end en ny til listepris.",
    quote:
      "De fleste skriver til os, fordi de er trætte af at lede. De ved godt, hvad de skal bruge – de vil bare ikke bruge tre uger på at finde ud af, hvem der har det til den rigtige pris. Det er dét, vi laver.",
  },
  en: {
    metaTitle: "About us | Kestro",
    metaDescription:
      "Kestro connects used business hardware in southern Europe with companies in the Nordics that need tested IT equipment without buying new.",
    title: "About Kestro",
    description:
      "We bridge used business hardware in southern Europe and companies in Denmark and Norway that would rather have a tested machine for the job than a new one at list price.",
    quote:
      "Most people write to us because they are tired of searching. They know what they need — they just do not want to spend three weeks working out who has it at the right price. That is what we do.",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/om-os", params.lang),
  };
}

const sections = [
  {
    icon: Route,
    title: {
      da: "Vi er indkøbspartner – ikke webshop",
      en: "We are a sourcing partner, not a web shop",
    },
    description: {
      da: "Kestro sidder ikke med et lager, I skal vælge fra. Vi arbejder som indkøbspartner: I fortæller, hvad I har brug for, og vi finder det i vores leverandørnetværk i Sydeuropa. Enhederne bliver funktionstestet, opgraderet med mere RAM hvor det giver mening, og klargjort til det nordiske marked med dansk/nordisk tastatur og korrekt sprogopsætning, før den leveres til jer.",
      en: "Kestro does not sit on a warehouse for you to pick from. We work as a sourcing partner: you tell us what you need, and we find it in our supplier network in southern Europe. The machines are function-tested, upgraded with more memory where it makes sense, and prepared for the Nordic market with a Danish or Norwegian keyboard and the right language setup before it reaches you.",
    },
  },
  {
    icon: Recycle,
    title: {
      da: "Fordelen ved ikke at have lager",
      en: "The advantage of holding no stock",
    },
    description: {
      da: "Når en leverandør har købt stort ind på forhånd, skal det lager afsættes – og I bliver tilbudt det, der står på hylden. Fordi vi sourcer til den enkelte ordre, kan vi i stedet gå efter de specifikationer, opgaven faktisk kræver, og sætte en maskine i drift igen frem for at den skiftes ud.",
      en: "When a supplier has bought big in advance, that stock has to move — and what you get offered is what is on the shelf. Because we source for the individual order, we can go after the specifications the job actually needs instead, and put a machine back into service rather than see it replaced.",
    },
  },
  {
    icon: Users,
    title: { da: "Hvem vi hjælper", en: "Who we help" },
    description: {
      da: "Vi arbejder med IT-indkøbere og beslutningstagere i danske og norske virksomheder – fra mindre virksomheder, der skal udstyre et nyt team, til større indkøb af flere enheder på én gang. Fortæl os om jeres behov, så finder vi de enheder, der matcher.",
      en: "We work with IT buyers and decision-makers in Danish and Norwegian companies — from smaller businesses equipping a new team to larger purchases of many machines at once. Tell us what you need, and we will find the machines that match.",
    },
  },
];

export default function OmOsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  const salesContact = primaryContact(lang);
  return (
    <>
      <section className="py-10 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />

          <div className="mx-auto mt-16 max-w-3xl space-y-10">
            {sections.map((section) => (
              <div key={section.title.da} className="flex gap-5">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-300">
                  <section.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-paper">{section.title[lang]}</h2>
                  <p className="mt-3 text-base leading-7 text-paper/65">
                    {section.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-24">
        <Container>
          <figure className="mx-auto max-w-3xl">
            <blockquote className="text-xl font-medium leading-9 text-paper sm:text-2xl sm:leading-10">
              &ldquo;{c.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-paper/65">
              <span className="font-semibold text-paper">{salesContact.name}</span>
              {" – "}
              {salesContact.role[lang]}, Kestro
            </figcaption>
          </figure>
        </Container>
      </section>

      <WhyUs lang={lang} />

      <TeamSection lang={lang} />

      {/* TeamSection introduces them a screen above; twice is noise. */}
      <CtaSection lang={lang} people={false} />
    </>
  );
}

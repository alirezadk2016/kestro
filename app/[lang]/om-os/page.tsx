import type { Metadata } from "next";
import MarkTile from "@/components/MarkTile";
import Container from "@/components/Container";
import { type CraftMarkName } from "@/components/CraftMark";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import WhyUs from "@/components/WhyUs";
import TeamSection from "@/components/TeamSection";
import { company, primaryContact } from "@/lib/company";
import { metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import Faq, { type FaqItem } from "@/components/Faq";

const copy = {
  da: {
    metaTitle: "Om os – hvem I handler med | Kestro",
    metaDescription:
      "Kestro forbinder brugt erhvervshardware i Sydeuropa med virksomheder i Norden, der skal bruge testet IT-udstyr uden at købe nyt.",
    title: "Om Kestro",
    /* Answer first: what Kestro is, where, and for whom. */
    description:
      "Kestro er en indkøbspartner i Aarhus, der skaffer brugt erhvervshardware fra leverandører i Sydeuropa til virksomheder i 2 lande, Danmark og Norge – en testet maskine til opgaven frem for en ny til listepris.",
    quote:
      "De fleste skriver til os, fordi de er trætte af at lede. De ved godt, hvad de skal bruge – de vil bare ikke bruge tre uger på at finde ud af, hvem der har det til den rigtige pris. Det er dét, vi laver.",
  },
  en: {
    metaTitle: "About us – who you are dealing with | Kestro",
    metaDescription:
      "Kestro connects used business hardware in southern Europe with companies in the Nordics that need tested IT equipment without buying new.",
    title: "About Kestro",
    description:
      "Kestro is a sourcing partner in Aarhus that finds used business hardware through suppliers in southern Europe for companies in 2 countries, Denmark and Norway — a tested machine for the job rather than a new one at list price.",
    quote:
      "Most people write to us because they are tired of searching. They know what they need — they just do not want to spend three weeks working out who has it at the right price. That is what we do.",
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
    ...metaFor("/om-os", params.lang),
  };
}

const sections = [
  {
    mark: "network" as CraftMarkName,
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
    mark: "no-stock" as CraftMarkName,
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
    mark: "who" as CraftMarkName,
    title: { da: "Hvem hjælper vi?", en: "Who do we help?" },
    description: {
      da: "Vi arbejder med IT-indkøbere og beslutningstagere i danske og norske virksomheder – fra mindre virksomheder, der skal udstyre et nyt team, til større indkøb af flere enheder på én gang. Fortæl os om jeres behov, så finder vi de enheder, der matcher.",
      en: "We work with IT buyers and decision-makers in Danish and Norwegian companies — from smaller businesses equipping a new team to larger purchases of many machines at once. Tell us what you need, and we will find the machines that match.",
    },
  },
];

/* Who Kestro is, in the questions people ask before they write. Every answer
   is a fact the rest of the site already states: the city and markets from
   lib/company.ts, the sourcing model from the sections above. */
const aboutFaqs = (contact: { name: string; role: { da: string; en: string } }): FaqItem[] => [
  {
    question: { da: "Hvor ligger Kestro?", en: "Where is Kestro based?" },
    answer: {
      da: `I ${company.city}. Vi leverer til virksomheder i hele Danmark og Norge.`,
      en: `In ${company.city}. We deliver to companies throughout Denmark and Norway.`,
    },
  },
  {
    question: { da: "Er Kestro en webshop?", en: "Is Kestro a web shop?" },
    answer: {
      da: "Nej. Vi har ikke et lager, I vælger fra. Vi er indkøbspartner: I fortæller, hvad I har brug for, og vi finder det i vores leverandørnetværk i Sydeuropa, tester og klargør det, før det leveres.",
      en: "No. We have no warehouse for you to pick from. We are a sourcing partner: you tell us what you need, and we find it in our supplier network in southern Europe, test and prepare it before it is delivered.",
    },
  },
  {
    question: { da: "Hvem taler jeg med, når jeg skriver?", en: "Who do I talk to when I write?" },
    answer: {
      da: `${contact.name}, ${contact.role.da}. Beskeden lander hos den, der skriver tilbuddet – ikke i en supportkø – og I får svar inden for 1 arbejdsdag.`,
      en: `${contact.name}, ${contact.role.en}. The message lands with the person who writes the quote — not in a support queue — and you get a reply within 1 working day.`,
    },
  },
];

export default async function OmOsPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const salesContact = primaryContact(lang);
  return (
    <>
      <PageSchema
        lang={lang}
        type="AboutPage"
        route="/om-os"
        name={c.title}
        description={c.description}
      />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/om-os"
            crumb={lang === "da" ? "Om os" : "About us"}

            updated="/om-os"
          />

          <div className="mt-16 max-w-3xl space-y-10">
            {sections.map((section) => (
              <div key={section.title.da} className="flex gap-5">
                {/* Square plate and a hairline, the same as the feature row:
                    the mark inside is an orthographic drawing, and a rounded
                    pill around a technical drawing fights it. */}
                <MarkTile name={section.mark} size="md" />
                <div>
                  <h2 className="text-xl font-semibold text-paper">{section.title[lang]}</h2>
                  <p className="mt-3 text-base leading-[1.75] text-paper/65">
                    {section.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <figure className="max-w-3xl">
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

      <Faq
        lang={lang}
        items={aboutFaqs(salesContact)}
        title={{ da: "Spørgsmål om Kestro", en: "Questions about Kestro" }}
      />

      {/* TeamSection introduces them a screen above; twice is noise. */}
      <CtaSection lang={lang} people={false} />
    </>
  );
}

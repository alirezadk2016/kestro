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
    metaTitle: "Om Kestro – brugt erhvervs-IT fra Sydeuropa til Norden",
    metaDescription:
      "Kestro forbinder brugt erhvervshardware i Sydeuropa med virksomheder i Danmark og Norge, der skal bruge testet IT-udstyr uden at købe nyt.",
    title: "Om Kestro",
    /* Answer first: what Kestro is, where, and for whom. */
    description:
      "Kestro er en leverandør af brugt erhvervshardware i Aarhus. Vi finder maskinerne i et netværk af leverandører i Sydeuropa og leverer dem til virksomheder i to lande, Danmark og Norge – en testet maskine til opgaven frem for en ny til listepris.",
    quote:
      "De fleste skriver til os, fordi de er trætte af at lede. De ved godt, hvad de skal bruge – de vil bare ikke bruge tre uger på at finde ud af, hvem der har det til den rigtige pris. Det er dét, vi laver.",
  },
  en: {
    metaTitle: "About Kestro — used business IT from southern Europe",
    metaDescription:
      "Kestro connects used business hardware in southern Europe with companies in the Nordics that need tested IT equipment without buying new.",
    title: "About Kestro",
    description:
      "Kestro is a supplier of used business hardware in Aarhus. We find the machines through a network of suppliers in southern Europe and deliver them to companies in two countries, Denmark and Norway — a tested machine for the job rather than a new one at list price.",
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
      da: "Vi er leverandør – ikke webshop",
      en: "We are a supplier, not a web shop",
    },
    description: {
      da: "Vi leverer på bestilling: I fortæller, hvad I har brug for, og vi finder det i vores leverandørnetværk i Sydeuropa, tester det og klargør det med dansk eller norsk tastatur. Tilbud, faktura og reklamation går gennem os, ikke gennem leverandøren.",
      en: "We supply to order: you tell us what you need, and we find it in our supplier network in southern Europe, test it and prepare it with a Danish or Norwegian keyboard. The quote, the invoice and any complaint go through us, not through the supplier.",
    },
  },
  {
    mark: "no-stock" as CraftMarkName,
    title: {
      da: "Fordelen ved ikke at have lager",
      en: "The advantage of holding no stock",
    },
    description: {
      da: "Et stort lager skal afsættes, og så bliver I tilbudt det, der står på hylden. Vi skaffer til den enkelte ordre og går efter de specifikationer, opgaven kræver.",
      en: "A big stock has to be sold, so you get offered what is on the shelf. We source for the individual order and go after the specifications the job needs.",
    },
  },
  {
    mark: "who" as CraftMarkName,
    title: { da: "Hvem hjælper vi?", en: "Who do we help?" },
    description: {
      da: "IT-indkøbere og beslutningstagere i danske og norske virksomheder – fra et nyt team, der skal udstyres, til større indkøb af mange maskiner på én gang.",
      en: "IT buyers and decision-makers in Danish and Norwegian companies — from a new team to equip to larger purchases of many machines at once.",
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
      da: "Nej. Vi har ikke et lager, I vælger fra. Vi leverer på bestilling: I fortæller, hvad I har brug for, og vi finder det i vores leverandørnetværk i Sydeuropa, tester og klargør det, før det leveres.",
      en: "No. We have no warehouse for you to pick from. We supply to order: you tell us what you need, and we find it in our supplier network in southern Europe, test and prepare it before it is delivered.",
    },
  },
  {
    question: { da: "Hvem taler vi med, når vi skriver?", en: "Who do we talk to when we write?" },
    answer: {
      da: `${contact.name}, ${contact.role.da[0].toLowerCase()}${contact.role.da.slice(1)}. Skriv til vores fælles kontaktadresse for en uforpligtende samtale om projektet og jeres behov.`,
      en: `${contact.name}, ${contact.role.en}. Write to our shared contact address for a non-binding conversation about the project and your requirements.`,
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

          {/* Three statements side by side from lg, mark above the words so
              the columns keep their width; a stack in the left half of a
              wide page left the right half empty for a screen. */}
          <div className="mt-16 grid max-w-3xl gap-10 lg:max-w-none lg:grid-cols-3 lg:gap-12">
            {sections.map((section) => (
              <div key={section.title.da} className="flex gap-5 lg:flex-col lg:gap-4">
                {/* Square plate and a hairline, the same as the feature row:
                    the mark inside is an orthographic drawing, and a rounded
                    pill around a technical drawing fights it. */}
                <MarkTile name={section.mark} size="md" />
                <div>
                  <h2 className="font-display t-h3 font-bold tracking-tight text-ink-900">
                    {section.title[lang]}
                  </h2>
                  <p className="mt-3 text-base leading-[1.75] text-ink-700">
                    {section.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink-200 bg-paper-dim py-10 sm:py-20">
        <Container>
          <figure className="max-w-3xl">
            <blockquote className="text-xl font-medium leading-9 text-ink-900 sm:text-2xl sm:leading-10">
              &ldquo;{c.quote}&rdquo;
            </blockquote>
            {/* The words are the company's, so the caption says so. It used to
                name the market's sales contact, which put the same sentence in
                Mehdi's mouth in Danish and Ismail's in English. */}
            <figcaption className="mt-6 text-sm font-semibold text-ink-900">Kestro</figcaption>
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
      <CtaSection lang={lang} />
    </>
  );
}

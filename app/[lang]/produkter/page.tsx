import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCategoryGallery from "@/components/ProductCategoryGallery";
import CtaSection from "@/components/CtaSection";
import { categories } from "@/lib/categories";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";

const copy = {
  da: {
    metaTitle: "Brugt IT-udstyr til virksomheder: pc, skærm og dock | Kestro",
    metaDescription:
      "Brugte computere til erhverv: bærbare, stationære, mini-pc'er, skærme, tablets og docks – skaffet til ordren i Danmark og Norge, med vilkår på skrift.",
    title: "Brugt IT-udstyr, vi skaffer til virksomheder",
    description: `Vælg mellem ${categories.length} udstyrstyper til jeres arbejdsplads. Vi skaffer efter behov og afklarer konfiguration, stand og pris i et skriftligt tilbud.`,
    noStockLine: "Et indkøbsbudget kræver mere end prisen på selve computeren.",
    noStockLink: "Se budgeteksempler og prisgrundlag",
    noPrices1:
      "Nej. Vi skaffer udstyret til den enkelte ordre. Konfiguration, stand, pris og levering skal afklares i tilbuddet, før I tager stilling.",
    noPrices2:
      "Send modelnavn eller beskriv opgaven, antal og budget. Vi undersøger mulighederne; kataloget er eksempler på udstyrstyper og modelserier.",
    modelsButton: "Sammenlign specifikationer",
    modelHint: "Kender I allerede modellen?",
    choiceTitle: "Hvilken computer passer til jeres behov?",
    choiceLead:
      "Vælg efter opgaven og det udstyr, I allerede bruger. Et helt team behøver ikke den samme maskine, men hver løsning skal passe sammen.",
    requirementsTitle: "Det bør være afklaret før et køb",
    requirementsLead:
      "Bed om disse oplysninger for netop de enheder, I får. En modelbeskrivelse siger intet om den enkelte brugte maskines stand.",
    enquiry: "Beskriv jeres behov",
  },
  en: {
    metaTitle: "Used and refurbished business computers and IT | Kestro",
    metaDescription:
      "Used computers for firms: laptops, desktops, mini PCs, screens, tablets and docks, sourced per order in Denmark and Norway, all terms in writing.",
    title: "Used business computers we source",
    description: `Choose from ${categories.length} equipment types for your workplace. We source around your needs and clarify configuration, condition and price in a written quote.`,
    noStockLine: "An equipment budget needs more than the price of the computer itself.",
    noStockLink: "See budget examples and their basis",
    noPrices1:
      "No. We source equipment for the individual order. Configuration, condition, price and delivery need to be clarified in the quote before you decide.",
    noPrices2:
      "Send a model name or describe the work, quantity and budget. We investigate the options; the catalogue illustrates equipment types and model ranges.",
    modelsButton: "Compare specifications",
    modelHint: "Already know the model?",
    choiceTitle: "Which computer fits your needs?",
    choiceLead:
      "Choose around the job and the equipment you already use. A whole team need not have the same machine, but every setup needs to work together.",
    requirementsTitle: "What to clarify before buying",
    requirementsLead:
      "Ask for these details for the units you will actually get. A model description says nothing about the condition of the individual used machine.",
    enquiry: "Describe your requirements",
  },
} satisfies Record<Lang, Record<string, string>>;

const buyingChoices = [
  {
    title: { da: "Kontor, hjemmearbejde og startup", en: "Office, home working and startups" },
    body: {
      da: "Starter I en ny virksomhed? Fortæl os, hvilke programmer I bruger, om I arbejder mobilt, og hvad I vil bruge pr. arbejdsplads – med skærm, dock og licenser.",
      en: "Starting a new business? Tell us which applications you use, whether you work on the move, and what you want to spend per desk — monitor, dock and licences included.",
    },
    links: [
      {
        href: "/produkter/baerbare-computere",
        da: "Bærbar til arbejde og startup",
        en: "Laptops for work and startups",
      },
      {
        href: "/produkter/mini-pc",
        da: "Mini-pc'er til faste skriveborde",
        en: "Mini PCs for fixed desks",
      },
    ],
  },
  {
    title: { da: "CAD og krævende programmer", en: "CAD and demanding software" },
    body: {
      da: "Start med programmets krav, projekternes størrelse og behovet for grafik. Sammenlign en workstation med en almindelig erhvervscomputer, før I vælger processor og hukommelse.",
      en: "Start with the software requirements, project sizes and graphics needs. Compare a workstation with a standard business computer before choosing the processor and memory.",
    },
    links: [
      {
        href: "/produkter/baerbare-computere",
        da: "Bærbare efter programmets krav",
        en: "Laptops around software requirements",
      },
      {
        href: "/produkter/stationaere-computere",
        da: "Stationære til virksomheden",
        en: "Desktops for your business",
      },
    ],
  },
  {
    title: { da: "Nordisk tastatur og tilbehør", en: "Nordic keyboards and accessories" },
    body: {
      da: "Skal I købe en bærbar med dansk eller norsk tastatur, så afklar det fysiske layout og Windows-sprog. Kontrollér også, om jeres skærme og dock kan bruges igen.",
      en: "If you need a laptop with a Danish or Norwegian keyboard, clarify the physical layout and Windows language. Also check whether your monitors and dock can be reused.",
    },
    links: [
      {
        href: "/produkter/dockingstationer",
        da: "Docking og kompatibilitet",
        en: "Docking and compatibility",
      },
      {
        href: "/ydelser/nordisk-tilpasning",
        da: "Dansk eller norsk tastatur",
        en: "Danish or Norwegian keyboards",
      },
    ],
  },
];

const purchaseChecks = [
  {
    title: { da: "Konfiguration og tilbehør", en: "Configuration and accessories" },
    body: {
      da: "Præcis model og generation, processor, RAM, SSD, skærm og tastatur. Afklar også oplader, kabler og dockingstation.",
      en: "Exact model and generation, processor, RAM, SSD, display and keyboard. Clarify the charger, cables and docking station too.",
    },
    href: "/modeller",
    link: { da: "Sammenlign modeltyper", en: "Compare model types" },
  },
  {
    title: { da: "Stand og batteri", en: "Condition and battery" },
    body: {
      da: "Kosmetisk grad er ikke en batteritest. Bed om batteriets målte kapacitet og beskrivelsen af eventuelle brugsspor.",
      en: "A cosmetic grade is not a battery test. Ask for the measured battery capacity and a description of any wear.",
    },
    href: "/kvalitet",
    link: { da: "Forstå stand og funktionstest", en: "Understand condition and testing" },
  },
  {
    title: { da: "Software og licenser", en: "Software and licences" },
    body: {
      da: "En installeret Windows-version siger ikke, hvilken licens der følger med. Afklar udgave og aktivering, og om jeres egne licensaftaler skal bruges.",
      en: "An installed Windows version does not tell you which licence is included. Clarify the edition, activation and whether your own licensing agreements will be used.",
    },
    href: "/ydelser/nordisk-tilpasning",
    link: { da: "Tastatur, sprog og opsætning", en: "Keyboard, language and setup" },
  },
  {
    title: { da: "Samlet pris og ansvar", en: "Total cost and responsibility" },
    body: {
      da: "Prisgrundlag, fragt, levering, sælger og eventuelle garantivilkår skal stå klart, før en aftale indgås. Afklar også retur af gammelt udstyr og datasletning.",
      en: "The pricing basis, shipping, delivery, seller and any warranty terms need to be clear before an agreement. Clarify the return of old equipment and data erasure too.",
    },
    href: "/saelg-til-os",
    link: { da: "Vurdering af jeres gamle IT-udstyr", en: "Assessment of your old IT equipment" },
  },
];

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/produkter", params.lang),
  };
}

export default async function ProdukterPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <PageSchema
        lang={lang}
        type="CollectionPage"
        route="/produkter"
        name={c.title}
        description={c.description}
      />

      <section className="pb-8 pt-3 sm:py-8">
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[{ name: lang === "da" ? "Produkter" : "Products", href: "/produkter" }]}
            className="mb-3"
          />
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-12">
            <h1 className="t-h1 text-balance font-display font-extrabold tracking-display text-paper lg:col-span-6">
              {c.title}
            </h1>
            <div className="lg:col-span-6 lg:pt-1">
              <p className="text-base leading-[1.65] text-paper/85 sm:text-lg">{c.description}</p>
            </div>
          </div>

          <ProductCategoryGallery lang={lang} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-white/10 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-x-4">
              <p className="text-paper/75">{c.modelHint}</p>
              <Link
                href={localePath("/modeller", lang)}
                data-model-index-entry
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-300 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
              >
                {c.modelsButton}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <Link
              href={localePath("/priser", lang)}
              className="inline-flex min-h-11 items-center text-brand-300 underline underline-offset-4 hover:text-paper"
            >
              {c.noStockLink}
            </Link>
          </div>

          <details id="product-buying-help" className="plate group mt-8">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 p-5 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
              <h2 className="text-lg font-bold text-paper">{c.choiceTitle}</h2>
              <ChevronDown
                aria-hidden="true"
                className="h-5 w-5 flex-none text-brand-300 transition-transform duration-150 group-open:rotate-180"
                strokeWidth={2}
              />
            </summary>
            <div className="grid gap-8 border-t border-white/10 p-5 sm:p-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="text-sm leading-6 text-paper/75">{c.choiceLead}</p>
                <div className="mt-5 grid gap-6">
                  {buyingChoices.map((choice) => (
                    <article key={choice.title.da}>
                      <h3 className="font-display text-base font-bold text-paper">
                        {choice.title[lang]}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-paper/75">{choice.body[lang]}</p>
                      <ul className="mt-2">
                        {choice.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={localePath(link.href, lang)}
                              className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
                            >
                              {link[lang]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-paper">
                  {c.requirementsTitle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-paper/75">{c.requirementsLead}</p>
                <dl className="mt-5 grid gap-5">
                  {purchaseChecks.map((check) => (
                    <div key={check.href}>
                      <dt className="text-sm font-semibold text-paper">{check.title[lang]}</dt>
                      <dd className="mt-1 text-sm leading-6 text-paper/75">
                        {check.body[lang]}
                        {check.href !== "/modeller" && (
                          <Link
                            href={localePath(check.href, lang)}
                            className="mt-1 flex min-h-11 items-center text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
                          >
                            {check.link[lang]}
                          </Link>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </details>
          <p className="mt-5 text-xs leading-5 text-paper/65">
            {lang === "da" ? "Opdateret" : "Updated"}{" "}
            <time dateTime={pageUpdated("/produkter")} className="tabular-nums">
              {formatDate(pageUpdated("/produkter"), lang)}
            </time>
          </p>
        </Container>
      </section>

      {/* "Genkender I én af disse?" lives on the front page only. It stood here
          as well, the same four situations at the same 1,670px, so anyone who
          came from the front page met it twice in two clicks. */}

      <Faq
        lang={lang}
        title={{ da: "Spørgsmål om udvalget", en: "Questions about the range" }}
        items={[
          {
            question: { da: "Har I udstyret på lager?", en: "Do you have the equipment in stock?" },
            answer: { da: copy.da.noPrices1, en: copy.en.noPrices1 },
          },
          {
            question: {
              da: "Kan I skaffe noget, der ikke står her?",
              en: "Can you source something that is not listed here?",
            },
            answer: { da: copy.da.noPrices2, en: copy.en.noPrices2 },
          },
          {
            question: {
              da: "Hvilken Windows-version kommer computerne med?",
              en: "Which version of Windows do the computers come with?",
            },
            answer: {
              da: "Aftal version, udgave og licens for den valgte konfiguration. Windows 11 kræver blandt andet en understøttet processor, TPM 2.0 og Secure Boot. Microsofts almindelige support for Windows 10 sluttede den 14. oktober 2025.",
              en: "Agree the version, edition and licence for the chosen configuration. Windows 11 requires a supported processor, TPM 2.0 and Secure Boot among other things. Microsoft's general Windows 10 support ended on 14 October 2025.",
            },
          },
        ]}
      />

      <FactNote lang={lang} ids={["windows11Requirements", "windows10Eol"]} />

      <CtaSection lang={lang} />
    </>
  );
}

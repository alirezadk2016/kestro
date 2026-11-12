import type { Metadata } from "next";
import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { models } from "@/lib/models";
import { ChevronDown } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCategoryGallery from "@/components/ProductCategoryGallery";
import CtaSection from "@/components/CtaSection";
import { categories } from "@/lib/categories";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";
import { buttonClass } from "@/components/Button";
import { modelMedia } from "@/lib/model-media";
import { picturesFirst } from "@/lib/model-order";

/* One model from each kind of equipment, in catalogue order. Not a ranking:
   the site has no sales to rank by. Each is a preference, not a fixture:
   where the preferred model has no photograph and another model of the same
   kind has one, the shelf shows that one instead, so a row of four does not
   set one photograph beside three drawings when a fourth photo exists. */
const FEATURED = ["lenovo-thinkpad-t14", "dell-optiplex-5060", "dell-ultrasharp-u2419h", "dell-wd19"];

function featuredModels() {
  const isPhoto = (model: (typeof models)[number]) => modelMedia(model)?.kind === "photo";
  return FEATURED.flatMap((slug) => {
    const preferred = models.find((m) => m.slug === slug);
    if (!preferred) return [];
    if (isPhoto(preferred)) return [preferred];
    const [first] = picturesFirst(models.filter((m) => m.group === preferred.group));
    return [first && isPhoto(first) ? first : preferred];
  });
}

const copy = {
  da: {
    metaTitle: "Brugt IT-udstyr til virksomheder: pc, skærm og dock | Kestro",
    metaDescription:
      "Brugte computere til erhverv: bærbare, stationære, mini-pc'er, skærme, tablets og docks – skaffet til ordren i Danmark og Norge, med vilkår på skrift.",
    title: "Brugt IT-udstyr, vi skaffer til virksomheder",
    description: `Find brugt IT-udstyr i ${categories.length} kategorier til kontor, hjemmearbejde eller en nystartet virksomhed. Vælg en kategori for at se mulighederne.`,
    noStockLine: "Et indkøbsbudget kræver mere end prisen på selve computeren.",
    noStockLink: "Se budgeteksempler og prisgrundlag",
    noPrices1:
      "Vi køber ikke ind på forhånd og sidder ikke med et fast lager, I skal vælge fra. I stedet skaffer vi udstyret til den enkelte ordre. Fordelen for jer er, at I får de specifikationer, opgaven kræver – ikke bare det, der tilfældigvis står på hylden – og at prisen ikke skal dække et lager, der venter på at blive solgt.",
    noPrices2:
      "Kategorierne ovenfor viser, hvad vi typisk kan skaffe, og hvilke mærker vi arbejder med. Pris og leveringstid aftaler vi ud fra jeres behov – og står det, I søger, ikke på listen, kan vi som regel skaffe det alligevel.",
    modelsTitle: "Fra modelkataloget",
    modelsBody:
      "Et udsnit af modellerne med fulde specifikationer: en bærbar, en stationær, en skærm og en dock. Kataloget sammenligner hukommelse, lager, porte og muligheder for opgradering.",
    modelsButton: "Se alle modeller",
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
    description: `Find used IT equipment in ${categories.length} categories for office work, home working or a startup. Choose a category to explore the options.`,
    noStockLine: "An equipment budget needs more than the price of the computer itself.",
    noStockLink: "See budget examples and their basis",
    noPrices1:
      "We do not buy ahead, and we do not sit on a fixed stock for you to choose from. We source for the individual order instead. The advantage for you is that you get the specifications the job needs — not simply what happens to be on a shelf — and you are not paying for inventory somebody else has to clear.",
    noPrices2:
      "The categories above show what we can normally get and which brands we work with. Price and lead time are agreed from your needs — and if what you are after is not on the list, we can usually still get it.",
    modelsTitle: "From the model catalogue",
    modelsBody:
      "A selection of the models with full specifications: a laptop, a desktop, a monitor and a dock. The catalogue compares memory, storage, ports and upgrade options.",
    modelsButton: "See all models",
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

      <section className="py-8 sm:py-12">
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[{ name: lang === "da" ? "Produkter" : "Products", href: "/produkter" }]}
            className="mb-5"
          />
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-12">
            <h1 className="t-h1 text-balance font-display font-extrabold tracking-display text-paper lg:col-span-6">
              {c.title}
            </h1>
            <div className="lg:col-span-6 lg:pt-1">
              <p className="text-base leading-[1.65] text-paper/85 sm:text-lg">{c.description}</p>
              <Link
                href={localePath("/priser", lang)}
                className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 hover:text-paper"
              >
                {c.noStockLink}
              </Link>
              <p className="mt-2 text-xs leading-5 text-paper/65">
                {lang === "da" ? "Opdateret" : "Updated"}{" "}
                <time dateTime={pageUpdated("/produkter")} className="tabular-nums">
                  {formatDate(pageUpdated("/produkter"), lang)}
                </time>
              </p>
            </div>
          </div>

          <ProductCategoryGallery lang={lang} />

          <div className="mt-10 grid items-start gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-5">
            <details id="product-buying-choices" className="plate group">
              <summary className="flex min-h-[88px] cursor-pointer list-none items-center justify-between gap-5 p-5 marker:content-none sm:p-6 [&::-webkit-details-marker]:hidden">
                <h2 className="t-h3 font-display font-bold text-paper">{c.choiceTitle}</h2>
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 flex-none text-brand-300 transition-transform duration-150 group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <div className="border-t border-white/10 p-5 sm:p-6">
                <p className="text-base leading-[1.75] text-paper/75">{c.choiceLead}</p>
                <div className="mt-6 grid gap-6">
                  {buyingChoices.map((choice) => (
                    <article key={choice.title.da}>
                      <h3 className="font-display text-lg font-bold text-paper">
                        {choice.title[lang]}
                      </h3>
                      <p className="mt-3 text-base leading-[1.75] text-paper/75">
                        {choice.body[lang]}
                      </p>
                      <ul className="mt-auto pt-4">
                        {choice.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={localePath(link.href, lang)}
                              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 hover:text-paper"
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
            </details>

            <details id="product-purchase-checks" className="plate group">
              <summary className="flex min-h-[88px] cursor-pointer list-none items-center justify-between gap-5 p-5 marker:content-none sm:p-6 [&::-webkit-details-marker]:hidden">
                <h2 className="t-h3 font-display font-bold text-paper">{c.requirementsTitle}</h2>
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 flex-none text-brand-300 transition-transform duration-150 group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <div className="border-t border-white/10 p-5 sm:p-6">
                <p className="text-base leading-[1.75] text-paper/75">{c.requirementsLead}</p>
                <dl className="mt-6 grid gap-6">
                  {purchaseChecks.map((check) => (
                    <div key={check.href}>
                      <dt className="text-base font-semibold text-paper">{check.title[lang]}</dt>
                      <dd className="mt-2 text-base leading-[1.75] text-paper/75">
                        {check.body[lang]}
                        <Link
                          href={localePath(check.href, lang)}
                          className="mt-2 flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 hover:text-paper"
                        >
                          {check.link[lang]}
                        </Link>
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={localePath("/tilbud", lang)}
                  className={`${buttonClass("primary")} mt-8`}
                >
                  {c.enquiry}
                </Link>
              </div>
            </details>
          </div>

          {/* A shelf from the catalogue: one model from each kind of
              equipment, with the same card as /modeller. It was a heading and
              a button, which asked a buyer to leave the page to see any
              hardware at all. */}
          <div className="mt-14 border-t border-white/10 pt-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                  {c.modelsTitle}
                </h2>
                <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.modelsBody}</p>
              </div>
              <Link
                href={localePath("/modeller", lang)}
                className={`${buttonClass("secondary")} flex-none self-start lg:self-end`}
              >
                {c.modelsButton}
                <span className="tabular-nums text-paper/65">{models.length}</span>
              </Link>
            </div>
            <ul className="rail mt-8 md:grid md:grid-cols-2 md:gap-5 xl:grid-cols-4">
              {featuredModels().map((model) => (
                <li key={model.slug}>
                  <ModelCard model={model} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
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

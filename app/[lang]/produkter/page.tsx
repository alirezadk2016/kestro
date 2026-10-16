import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { categories } from "@/lib/categories";
import { getCategoryMark } from "@/lib/category-marks";
import MarkTile from "@/components/MarkTile";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";
import { models } from "@/lib/models";
import { buttonClass } from "@/components/Button";

const copy = {
  da: {
    metaTitle: "Brugt IT-udstyr til virksomheder: pc, skærm og dock | Kestro",
    metaDescription:
      "Refurbished bærbare, stationære, mini-pc'er, skærme, tablets og docks til virksomheder i Danmark og Norge – skaffet til ordren, med vilkår på skrift.",
    title: "Brugt IT-udstyr, vi skaffer til virksomheder",
    /* Answer first, with the counts the page and /modeller actually show. */
    description: `Sammenlign brugt IT-udstyr til virksomheder i ${categories.length} kategorier og ${models.length} beskrevne modeller. Start med medarbejdernes opgaver, programmer og eksisterende skærme – så kan en forespørgsel handle om den rigtige konfiguration, ikke kun et modelnavn.`,
    noStockLine: "Et indkøbsbudget kræver mere end prisen på selve computeren.",
    noStockLink: "Se budgeteksempler og prisgrundlag",
    noPrices1:
      "Vi køber ikke ind på forhånd og sidder ikke med et fast lager, I skal vælge fra. I stedet skaffer vi udstyret til den enkelte ordre. Fordelen for jer er, at I får de specifikationer, opgaven kræver – ikke bare det, der tilfældigvis står på hylden – og at prisen ikke skal dække et lager, der venter på at blive solgt.",
    noPrices2:
      "Kategorierne ovenfor viser, hvad vi typisk kan skaffe, og hvilke mærker vi arbejder med. Pris og leveringstid aftaler vi ud fra jeres konkrete behov – og står det, I søger, ikke på listen, kan vi som regel skaffe det alligevel.",
    categories: "Kategorier",
    seeCategory: "Se kategori",
    modelsTitle: "Vil I se konkrete modeller?",
    modelsBody:
      "ThinkPad, EliteBook, Latitude, EliteDesk og flere – med specifikationer og hvad de hver især egner sig til.",
    modelsButton: "Se modeloversigten",
    choiceTitle: "Hvilket IT-udstyr passer til arbejdspladsen?",
    choiceLead:
      "Vælg efter opgaven og det udstyr, I allerede bruger. Et helt team behøver ikke den samme maskine, men hver løsning skal passe sammen.",
    requirementsTitle: "Det bør være afklaret før et køb",
    requirementsLead:
      "Bed om disse oplysninger for den konkrete leverance. En modelbeskrivelse er ikke dokumentation for en bestemt brugt enheds stand.",
    enquiry: "Beskriv jeres behov",
  },
  en: {
    metaTitle: "Used and refurbished business computers and IT | Kestro",
    metaDescription:
      "Refurbished laptops, desktops, mini PCs, monitors, tablets and docks for companies in Denmark and Norway — sourced per order, terms in writing.",
    title: "Used business computers we source",
    description: `Compare used business IT across ${categories.length} categories and ${models.length} described models. Start with the team's tasks, software and existing monitors, so an enquiry identifies the right configuration rather than just a model name.`,
    noStockLine: "An equipment budget needs more than the price of the computer itself.",
    noStockLink: "See budget examples and their basis",
    noPrices1:
      "We do not buy ahead, and we do not sit on a fixed stock for you to choose from. We source for the individual order instead. The advantage for you is that you get the specifications the job needs — not simply what happens to be on a shelf — and you are not paying for inventory somebody else has to clear.",
    noPrices2:
      "The categories above show what we can normally get and which brands we work with. Price and lead time are agreed from your specific needs — and if what you are after is not on the list, we can usually still get it.",
    categories: "Categories",
    seeCategory: "See category",
    modelsTitle: "Want to see specific models?",
    modelsBody:
      "ThinkPad, EliteBook, Latitude, EliteDesk and more — with specifications and what each one suits.",
    modelsButton: "See the model overview",
    choiceTitle: "Which IT equipment fits the workplace?",
    choiceLead:
      "Choose around the job and the equipment you already use. A whole team need not have the same machine, but every setup needs to work together.",
    requirementsTitle: "What to clarify before buying",
    requirementsLead:
      "Ask for these details for the specific delivery. A model description is not evidence of the condition of an individual used device.",
    enquiry: "Describe your requirements",
  },
} satisfies Record<Lang, Record<string, string>>;

const buyingChoices = [
  {
    title: { da: "Kontor og hybridarbejde", en: "Office and hybrid work" },
    body: {
      da: "Oplys programmer, hvor meget maskinen skal transporteres, og om den skal køre flere skærme. Sammenlign hukommelse, skærm, batteritilstand og mulighed for opgradering.",
      en: "List the software, how often the machine travels and whether it needs multiple monitors. Compare memory, display, battery condition and upgrade options.",
    },
    links: [
      {
        href: "/produkter/baerbare-computere",
        da: "Bærbare til medarbejdere",
        en: "Laptops for your team",
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
        href: "/modeller/hp-zbook-15",
        da: "Se en mobil workstation",
        en: "Explore a mobile workstation",
      },
      {
        href: "/produkter/stationaere-computere",
        da: "Stationære til virksomheden",
        en: "Desktops for your business",
      },
    ],
  },
  {
    title: { da: "Skærme, docks og mobil adgang", en: "Monitors, docks and mobile access" },
    body: {
      da: "Notér skærmenes tilslutninger og dockens model. For firmatelefoner og tablets er apps, opdateringer og jeres enhedsstyring også en del af valget.",
      en: "Note the monitor connections and dock model. For company phones and tablets, apps, updates and your device management are also part of the choice.",
    },
    links: [
      {
        href: "/produkter/dockingstationer",
        da: "Docking og kompatibilitet",
        en: "Docking and compatibility",
      },
      {
        href: "/produkter/smartphones",
        da: "Firmatelefoner til teams",
        en: "Company phones for teams",
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
      da: "En installeret Windows-version siger ikke, hvilken licens der følger med. Afklar udgave, aktivering og om jeres egne licensaftaler skal bruges.",
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

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/produkter"
            crumb={lang === "da" ? "Produkter" : "Products"}

            updated="/produkter"
          />

          {/* One line, where there was a panel. The panel's two paragraphs
              were also the answers to two of the questions at the foot of
              this page, so they were on it twice; the full reasoning lives
              on /priser and in those answers. */}
          <p className="mt-6 max-w-3xl text-sm leading-[1.6] text-paper/65">
            {c.noStockLine}{" "}
            <Link
              href={localePath("/priser", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.noStockLink}
            </Link>
          </p>

          <h2 className="mt-14 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.categories}
          </h2>

          {/* Seven categories: four across on a desktop, and the last one
              two columns wide, so both rows are full. In three columns the
              docks sat alone on a third row. */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {categories.map((category, i) => {
              const last = i === categories.length - 1 && categories.length % 2 === 1;
              return (
                <Link
                  key={category.slug}
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className={`group flex items-start gap-4 plate plate-lift p-5 sm:p-6 ${last ? "sm:col-span-2" : ""}`}
                >
                  {/* Mark inline with the heading rather than stacked above
                      it — the stacked icon tile is the template card. */}
                  <MarkTile name={getCategoryMark(category.slug)} size="md" className="flex-none" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-base font-semibold leading-snug text-paper">
                      {category.name[lang]}
                    </h3>
                    <p className="mt-1.5 text-sm leading-[1.6] text-paper/75">
                      {category.tagline[lang]}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                      {c.seeCategory}
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 border-t border-white/10 pt-12">
            <h2 className="font-display t-h2 font-extrabold text-paper">{c.choiceTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-[1.75] text-paper/75">{c.choiceLead}</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {buyingChoices.map((choice) => (
                <article key={choice.title.da} className="plate flex flex-col p-5 sm:p-6">
                  <h3 className="font-display t-h3 font-bold text-paper">{choice.title[lang]}</h3>
                  <p className="mt-3 text-base leading-[1.75] text-paper/75">{choice.body[lang]}</p>
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

          <div className="mt-16 border-t border-white/10 pt-12">
            <h2 className="font-display t-h2 font-extrabold text-paper">{c.requirementsTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-[1.75] text-paper/75">
              {c.requirementsLead}
            </p>
            <dl className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
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
            <Link href={localePath("/tilbud", lang)} className={`${buttonClass("primary")} mt-8`}>
              {c.enquiry}
            </Link>
          </div>

          {/* Left-aligned with the grid above it, heading and button on one
              line on a wide screen. It was the one centred panel on the page,
              floating in the middle of a left-aligned column. */}
          <div className="mt-14 flex flex-col gap-6 border-y border-white/10 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {c.modelsTitle}
              </h2>
              <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.modelsBody}</p>
            </div>
            <Link
              href={localePath("/modeller", lang)}
              className={`${buttonClass("primary")} flex-none self-start lg:self-center`}
            >
              {c.modelsButton}
            </Link>
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
              da: "Aftal version, udgave og licens for den konkrete konfiguration. Windows 11 kræver blandt andet en understøttet processor, TPM 2.0 og Secure Boot. Microsofts almindelige support for Windows 10 sluttede den 14. oktober 2025.",
              en: "Agree the version, edition and licence for the actual configuration. Windows 11 requires a supported processor, TPM 2.0 and Secure Boot among other things. Microsoft's general Windows 10 support ended on 14 October 2025.",
            },
          },
        ]}
      />

      <FactNote lang={lang} ids={["windows11Requirements", "windows10Eol"]} />

      <CtaSection lang={lang} />
    </>
  );
}

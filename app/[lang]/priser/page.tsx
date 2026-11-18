import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Faq from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buttonClass } from "@/components/Button";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import BudgetExamples from "@/components/BudgetExamples";
import ProjectNotice from "@/components/ProjectNotice";
import { budgetExamples, budgetAmount, budgetReadOn } from "@/lib/pricing";

// Dated budget references and the factors a future, specific quote must account for.

const drivers = [
  {
    heading: { da: "Model og specifikation", en: "Model and specification" },
    body: {
      da: "Modelserie, generation, processor, hukommelse og lager skal afklares for den konkrete konfiguration.",
      en: "Clarify the model range, generation, processor, memory and storage for the specific configuration.",
    },
  },
  {
    heading: { da: "Stand", en: "Condition" },
    body: {
      da: "Aftal kosmetisk stand og beskrivelse af brugsspor, og på bærbare også batteriets kapacitet.",
      en: "Agree the cosmetic condition and description of wear, and for laptops the battery capacity too.",
    },
  },
  {
    heading: { da: "Antal", en: "Quantity" },
    body: {
      da: "Oplys antal enheder, og om model, konfiguration og stand skal være ens på tværs af leverancen.",
      en: "State the number of units and whether the model, configuration and condition must match across the delivery.",
    },
  },
  {
    heading: { da: "Hvad der skal med", en: "What goes with them" },
    body: {
      da: "Afklar skærme, dockingstationer, kabler og strømforsyninger, så tilbuddet omfatter det udstyr, I faktisk skal bruge.",
      en: "Clarify monitors, docks, cables and power supplies so the quote covers the equipment you actually need.",
    },
  },
  {
    heading: { da: "Nordisk tilpasning og software", en: "Nordic preparation and software" },
    body: {
      da: "Aftal fysisk tastaturlayout, Windows-udgave og klargøring, og oplys, om I har egne licensaftaler eller et image til udrulning.",
      en: "Agree the physical keyboard layout, Windows edition and preparation, and mention any licence agreements or deployment image of your own.",
    },
  },
  {
    heading: { da: "Om I skal af med noget", en: "Whether you have kit to clear" },
    body: {
      da: "Oplys model, antal og stand på det gamle udstyr, hvis I ønsker en vurdering sammen med forespørgslen.",
      en: "Include the model, quantity and condition of old equipment if you want an assessment alongside the enquiry.",
    },
  },
];

const copy = {
  da: {
    metaTitle: "Hvad koster brugte computere til virksomheder? | Kestro",
    metaDescription:
      "Vejledende budgetpriser på brugt IT og daterede priseksempler. Se, hvad prisen afhænger af, og spørg os om en konkret pris og muligheder for jer.",
    title: "Hvad koster brugte computere?",
    whyTitle: "Hvorfor er priserne vejledende?",
    whyBody1: "Model, stand, antal, tastatur og klargøring kan ændre beløbet.",
    whyBody2:
      "Vi afklarer muligheder, tilgængelighed og en præcis pris med jer, før I lægger et indkøbsbudget fast.",
    driversTitle: "Hvad afgør jeres pris?",
    quoteTitle: "Hvad står der i tilbuddet?",
    quoteBody:
      "Model, specifikation, stand og målt batterikapacitet pr. bærbar; pris pr. enhed og samlet med medfølgende tilbehør; garantivilkår og kontakt ved fejl; tidsramme og leveringsvilkår.",
    freeTitle: "Koster et tilbud noget?",
    freeBody:
      "Nej. Det koster intet at spørge, og svaret forpligter jer ikke. Passer intet til opgaven, siger vi det.",
    fastTitle: "Send os jeres behov",
    fastLead:
      "I behøver ikke kende modelnavnet. Skriv antal maskiner, programmerne I arbejder i, og hvornår udstyret skal være klar.",
    faqTitle: "Spørgsmål om priserne",
    enquiry: "Spørg om en konkret pris",
    example: "Se et tilbud felt for felt",
    related: [
      { href: "/kvalitet", label: "Stand, test og hvad I bør spørge om" },
      { href: "/ydelser/levering", label: "Levering og tidsrammer" },
    ],
  },
  en: {
    metaTitle: "What do used business computers cost? Examples | Kestro",
    metaDescription:
      "Indicative budgets for used business IT, dated retail price examples and what affects the price. Contact us to discuss options and a specific price.",
    title: "What do used business computers cost?",
    whyTitle: "Why are the prices indicative?",
    whyBody1: "Model, condition, quantity, keyboard and preparation can change the amount.",
    whyBody2:
      "We discuss the options, availability and a specific price with you before you fix a purchasing budget.",
    driversTitle: "What decides your price?",
    quoteTitle: "What does the quote contain?",
    quoteBody:
      "Model, specification, condition and measured battery capacity per laptop; price per unit and in total, with included accessories; warranty terms and who to contact about faults; time frame and delivery terms.",
    freeTitle: "Does a quote cost anything?",
    freeBody:
      "No. Asking costs nothing, and the answer does not commit you. If nothing suits the job, we say so.",
    fastTitle: "Send us your requirements",
    fastLead:
      "You do not need to know the model name. Tell us the number of machines, the applications you work in, and when the equipment needs to be ready.",
    faqTitle: "Questions about pricing",
    enquiry: "Ask for a specific price",
    example: "See a quote field by field",
    related: [
      { href: "/kvalitet", label: "Condition, testing, what to ask" },
      { href: "/ydelser/levering", label: "Delivery and time frames" },
    ],
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/priser", params.lang),
  };
}

export default async function PricingPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];

  /* Answer first, with the numbers: the range the examples below span,
     read from the same data the cards render, so it cannot drift from them. */
  const amounts = budgetExamples.map(budgetAmount);
  const nf = new Intl.NumberFormat(lang === "da" ? "da-DK" : "en-GB");
  const range = `${nf.format(Math.min(...amounts))}–${nf.format(Math.max(...amounts))} DKK`;
  const readOn = formatDate(budgetReadOn, lang);
  const lead =
    lang === "da"
      ? `Ca. ${range} pr. enhed for de brugte computere og skærme herunder, efter detailpriser hos eksterne forhandlere den ${readOn}.`
      : `Approx. ${range} per unit for the used computers and monitors below, from retail prices at external retailers on ${readOn}.`;
  /* The same sentence with the date marked up, so the read date is visible
     in the opening answer instead of a second time under the table heading. */
  const [leadHead, leadTail] = lead.split(readOn);

  return (
    <>
      <PageSchema lang={lang} route="/priser" name={c.title} description={lead} />

      {/* In the shared Container like every other page's header. Without it
          the breadcrumb and the h1 started at x=0 while the rest of the site
          sat on the container inset. */}
      <Container className="pb-6 pt-4">
        <Breadcrumbs
          lang={lang}
          trail={[{ name: lang === "da" ? "Priser" : "Pricing", href: "/priser" }]}
          className="mb-4"
        />
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-12">
          <h1 className="t-h1 text-balance font-display font-extrabold tracking-display text-paper">
            {c.title}
          </h1>
          <div>
            {/* The answer, at the lead size of the other hub pages; it was
                14-16px under a 44px heading. */}
            <p className="text-pretty text-base leading-[1.65] text-paper/85 sm:text-lg">
              {leadHead}
              {/* No-break spaces: "den 14. / okt. 2026" split the date at
                  1440 and at 390. */}
              <time dateTime={budgetReadOn}>{readOn.replace(/ /g, "\u00a0")}</time>
              {leadTail}
            </p>
            {/* With the answer it dates. It stood alone between the table and
                the factors that explain it. */}
            <p className="mt-2 text-xs leading-5 text-paper/65">
              {lang === "da" ? "Opdateret" : "Updated"}{" "}
              <time dateTime={pageUpdated("/priser")}>
                {formatDate(pageUpdated("/priser"), lang)}
              </time>
            </p>
          </div>
        </div>
      </Container>

      <BudgetExamples lang={lang} />

      {/* What moves a price, straight after the prices it explains. Six
          parallel factors, six plates, each a title and one sentence. */}
      <section aria-labelledby="price-drivers" className="py-10 sm:py-14">
        <Container>
          <h2
            id="price-drivers"
            className="font-display t-h2 font-extrabold tracking-display text-paper"
          >
            {c.driversTitle}
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {drivers.map((driver) => (
              <li key={driver.heading.da} className="plate p-4 sm:p-5">
                <h3 className="text-base font-bold text-paper">{driver.heading[lang]}</h3>
                <p className="mt-1 text-sm leading-6 text-paper/75">{driver.body[lang]}</p>
              </li>
            ))}
          </ul>

          {/* The page's one call to Kestro, directly under the factors a
              buyer has just read. On a phone it was 3,300px down, after two
              lists that repeated those factors. */}
          <div className="plate mt-8 flex flex-col gap-5 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              {/* t-h2 like every other h2 here: four sizes for one heading
                  level was how the page read as unfinished. */}
              <h2 className="font-display t-h2 font-extrabold tracking-display text-paper">
                {c.fastTitle}
              </h2>
              <p className="mt-2 text-base leading-[1.65] text-paper/85">{c.fastLead}</p>
            </div>
            <div className="flex flex-none flex-wrap items-center gap-x-6 gap-y-2">
              <Link href={localePath("/tilbud", lang)} className={buttonClass("primary")}>
                {c.enquiry}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href={localePath("/tilbud-eksempel", lang)}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                {c.example}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-6">
            {c.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={localePath(link.href, lang)}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  {link.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Once, beside the one place a reader could try to order. It sat
          between the price table and the factors that explain it. */}
      <ProjectNotice lang={lang} />

      {/* The three questions, as the site's FAQ: questions as headings, the
          answers folded, the schema built from the same array. They were four
          more 20px h2s, and three of them repeated the factors above. */}
      <Faq
        lang={lang}
        title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }}
        items={[
          {
            question: { da: copy.da.whyTitle, en: copy.en.whyTitle },
            answer: {
              da: `${copy.da.whyBody1} ${copy.da.whyBody2}`,
              en: `${copy.en.whyBody1} ${copy.en.whyBody2}`,
            },
          },
          {
            question: { da: copy.da.freeTitle, en: copy.en.freeTitle },
            answer: { da: copy.da.freeBody, en: copy.en.freeBody },
          },
          {
            question: { da: copy.da.quoteTitle, en: copy.en.quoteTitle },
            answer: { da: copy.da.quoteBody, en: copy.en.quoteBody },
          },
        ]}
      />
    </>
  );
}

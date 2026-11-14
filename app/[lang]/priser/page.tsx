import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Container from "@/components/Container";
import FaqSchema from "@/components/FaqSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buttonClass } from "@/components/Button";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import FactNote from "@/components/FactNote";
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
      da: "Aftal kosmetisk stand og beskrivelse af brugsspor. Batteriets kapacitet skal afklares særskilt på bærbare.",
      en: "Agree the cosmetic condition and description of wear. Clarify battery capacity separately for laptops.",
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
      da: "Aftal fysisk tastaturlayout, Windows-udgave og klargøring. Oplys, hvis I har egne licensaftaler eller et image til udrulning.",
      en: "Agree the physical keyboard layout, Windows edition and preparation. Mention existing licence agreements or an image for deployment.",
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
    quoteTitle: "Det står i tilbuddet",
    quoteLead: "Se, hvad der skal være afklaret på skrift:",
    quotePoints: [
      "Model, specifikation, stand og målt batterikapacitet pr. bærbar.",
      "Pris pr. enhed og samlet samt medfølgende tilbehør.",
      "Garantivilkår og kontakt ved fejl.",
      "Tidsramme og leveringsvilkår.",
    ],
    freeTitle: "Koster et tilbud noget?",
    freeBody:
      "Nej. Det koster intet at spørge, og svaret forpligter jer ikke. Passer intet til opgaven, siger vi det.",
    fastTitle: "Send os jeres behov",
    fastLead: "I behøver ikke kende modelnavnet. Start med:",
    fastPoints: [
      "Antal maskiner og programmerne, I arbejder i.",
      "Behov for skærme, docks og andet tilbehør.",
      "Ønsket tidspunkt og eventuelt gammelt udstyr til vurdering.",
    ],
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
    quoteTitle: "What the quote contains",
    quoteLead: "See what needs to be agreed in writing:",
    quotePoints: [
      "Model, specification, condition and measured battery capacity per laptop.",
      "Price per unit and in total, plus included accessories.",
      "Warranty terms and who to contact about faults.",
      "Time frame and delivery terms.",
    ],
    freeTitle: "Does a quote cost anything?",
    freeBody:
      "No. Asking costs nothing, and the answer does not commit you. If nothing suits the job, we say so.",
    fastTitle: "Send us your requirements",
    fastLead: "You do not need to know the model name. Start with:",
    fastPoints: [
      "The number of machines and applications you work in.",
      "Monitors, docks and other accessories you need.",
      "Your preferred timing and any old equipment to assess.",
    ],
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
  const lead =
    lang === "da"
      ? `Ca. ${range} pr. enhed for de brugte computere og skærme herunder, efter detailpriser hos eksterne forhandlere den ${formatDate(budgetReadOn, lang)}.`
      : `Approx. ${range} per unit for the used computers and monitors below, from retail prices at external retailers on ${formatDate(budgetReadOn, lang)}.`;

  /* The two questions a buyer types into a search box before they trust a
     supplier enough to write to them. Marked up so the answers can appear
     under the result rather than only on the page. */

  return (
    <>
      <PageSchema lang={lang} route="/priser" name={c.title} description={lead} />

      {/* The two questions this page answers in full. Built from the copy
          object rather than the language-resolved `c`, so both languages come
          from one place, the way FaqSchema expects. */}
      <FaqSchema
        lang={lang}
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
        ]}
      />

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
          <h1 className="t-h2 font-display font-extrabold tracking-display text-paper">
            {c.title}
          </h1>
          <p className="text-sm leading-6 text-paper/85 sm:text-base">{lead}</p>
        </div>
      </Container>

      <BudgetExamples lang={lang} />

      <Container className="py-3">
        <p className="text-xs leading-5 text-paper/65">
          {lang === "da" ? "Opdateret" : "Updated"}{" "}
          <time dateTime={pageUpdated("/priser")}>{formatDate(pageUpdated("/priser"), lang)}</time>
        </p>
      </Container>

      <ProjectNotice lang={lang} />

      <section className="lit lit-paper py-8 sm:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.whyTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper/75">
                {c.whyBody1} {c.whyBody2}
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.freeTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper/75">{c.freeBody}</p>
            </div>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.quoteTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper/75">{c.quoteLead}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-paper/85 marker:text-brand-300">
                {c.quotePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link
                href={localePath("/tilbud-eksempel", lang)}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                {c.example}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.fastTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper/75">{c.fastLead}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-paper/85 marker:text-brand-300">
                {c.fastPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href={localePath("/tilbud", lang)} className={`${buttonClass("primary")} mt-4`}>
                {c.enquiry}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <details className="group mt-8 border-y border-white/15">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <h2 className="font-display text-lg font-bold text-paper">{c.driversTitle}</h2>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="flex-none text-brand-300 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <ul className="grid gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
              {drivers.map((driver) => (
                <li key={driver.heading.da}>
                  <h3 className="text-sm font-bold text-paper">{driver.heading[lang]}</h3>
                  <p className="mt-1 text-sm leading-6 text-paper/75">{driver.body[lang]}</p>
                </li>
              ))}
            </ul>
          </details>

          <ul className="mt-3 flex flex-wrap gap-x-6">
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

      <FactNote lang={lang} ids={["dkWarranty"]} />
    </>
  );
}

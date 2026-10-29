import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";

/*
 * The quote, as its own page.
 *
 * Every "Få et tilbud" on the site used to land on /kontakt, which is a name,
 * an email and a blank box. A buyer who wants twenty machines has to invent a
 * specification from memory, and what arrives is usually "hvad koster en brugt
 * bærbar?" — a question no one can answer without knowing quantity, memory,
 * disk and keyboard, so the first reply is a list of questions and the quote is
 * a day later than it needed to be.
 *
 * This page asks those four things up front, with "ved ikke endnu" as a real
 * answer on every one of them, and says what happens after send. /kontakt stays
 * what it is: a way to reach a person about anything else.
 */

const copy = {
  da: {
    metaTitle: "Få et tilbud på brugte computere til virksomheden | Kestro",
    metaDescription:
      "Skriv antal, model og tidsramme for de brugte computere, I mangler. Vi afklarer resten i en uforpligtende dialog; formularen er ikke en bestilling.",
    title: "Få et tilbud på brugte computere",
    /* Answer first: what a quote is, what it costs, and when it comes back. */
    lead: "Skriv antal, specifikation og ønsket tidsramme, så afklarer vi de indledende muligheder. Forespørgslen er gratis og uforpligtende. Udfyld det, I ved – resten kan stå som »ved ikke endnu«.",
    formTitle: "Jeres forespørgsel",
    nextTitle: "Hvad sker der, når I sender?",
    nextSteps: [
      "Vi læser forespørgslen og spørger ind, hvis noget mangler, frem for at gætte på en pris.",
      "Vi søger i leverandørnetværket efter det, der reelt kan skaffes. Der er endnu ikke bekræftet lager eller en aftalt pris.",
      "I får et tilbud per enhed. Før et eventuelt køb skal sælger, pris og vilkår være afklaret – en forespørgsel er ikke en bestilling.",
    ],
    exampleTitle: "Se et tilbud, før I beder om et",
    exampleBody:
      "Eksemplet viser et tilbud på enhedsniveau – model, specifikation, kosmetisk stand, batteri, tastaturlayout og styresystem – så I ved, hvad der kommer retur, inden I udfylder noget.",
    exampleLink: "Se eksemplet",
    needTitle: "Hvad har vi brug for at vide?",
    needLead: "Jo mere I kan sige om de fire ting her, jo færre spørgsmål skal vi stille bagefter.",
    needItems: [
      {
        title: "Antal, og hvad der følger med",
        body: "Skærme, dockingstationer og kabler ændrer både prisen og leveringstiden. Et skøn er nok til at komme i gang.",
      },
      {
        title: "Hvad maskinerne skal bruges til",
        body: "Kontorarbejde, konstruktion og billedarbejde stiller vidt forskellige krav. Kender I ikke specifikationen, så beskriv opgaven – så foreslår vi et niveau.",
      },
      {
        title: "Hvornår det skal stå klar",
        body: "Vi skaffer maskinerne per ordre, så tidsrammen er en del af opgaven. Har I en fast dato, så skriv den med det samme.",
      },
      {
        title: "Om I samtidig skal af med noget",
        body: "Har I ældre maskiner, der skal væk, regner vi på begge dele, og værdien kan modregnes i indkøbet.",
      },
    ],
    needLinkLabel: "Sådan køber vi brugt udstyr",
    trustTitle: "Inden I skriver",
    trustLinks: [
      { href: "/priser", label: "Hvad afgør prisen" },
      { href: "/kvalitet", label: "Sådan vurderer vi stand og kvalitet" },
      { href: "/ydelser/opstart-af-arbejdspladser", label: "Opstart af nye arbejdspladser" },
      { href: "/flaadeloesninger", label: "Skal hele virksomheden udstyres?" },
    ],
    faqTitle: "Spørgsmål inden I sender",
    otherTitle: "Noget helt andet?",
    otherBody: "Skal I ikke bruge et tilbud, men have fat i et menneske, er kontaktsiden vejen.",
    otherLink: "Kontakt os",
  },
  en: {
    metaTitle: "Quote on used business computers, no obligation | Kestro",
    metaDescription:
      "Tell Kestro the quantity, specification and timing you need. We discuss the options in a non-binding conversation; submitting the form is not an order.",
    title: "Get a quote on used business computers",
    lead: "Tell us the quantity, specification and timing you need, and we discuss the initial options. The enquiry is free and non-binding. Fill in what you know; the rest can stay at “not sure yet”.",
    formTitle: "Your request",
    nextTitle: "What happens when you send it?",
    nextSteps: [
      "We read the request and ask if anything is missing, rather than guessing at a price.",
      "We search the supplier network for what can actually be sourced. There is no confirmed stock or agreed price yet.",
      "You get a quote per unit. Before any purchase, the seller, price and terms must be established — an enquiry is not an order.",
    ],
    exampleTitle: "See a quote before you ask for one",
    exampleBody:
      "The example is written per unit — model, specification, cosmetic condition, battery, keyboard layout and operating system — so you know what comes back before you fill anything in.",
    exampleLink: "See the example",
    needTitle: "What do we need to know?",
    needLead:
      "The more you can say about these four things, the fewer questions we have to ask afterwards.",
    needItems: [
      {
        title: "Quantity, and what goes with it",
        body: "Monitors, docking stations and cables change both the price and the delivery time. A rough number is enough to start.",
      },
      {
        title: "What the machines are for",
        body: "Office work, engineering and image work make very different demands. If you do not know the specification, describe the job — we suggest a level.",
      },
      {
        title: "When it has to be ready",
        body: "We source per order, so timing is part of the job. If you have a fixed date, give it straight away.",
      },
      {
        title: "Whether something is going out at the same time",
        body: "If you have older machines to move on, we price both sides, and the value can be offset against the purchase.",
      },
    ],
    needLinkLabel: "How we buy used equipment",
    trustTitle: "Before you write",
    trustLinks: [
      { href: "/priser", label: "What decides the price" },
      { href: "/kvalitet", label: "How we assess condition and quality" },
      { href: "/ydelser/opstart-af-arbejdspladser", label: "Setting up new workstations" },
      { href: "/flaadeloesninger", label: "Equipping the whole company?" },
    ],
    faqTitle: "Questions before you send",
    otherTitle: "Something else entirely?",
    otherBody:
      "If you do not need a quote but want to reach a person, the contact page is the way.",
    otherLink: "Contact us",
  },
} as const;

/*
 * The six things a buyer wants settled before they fill in a form.
 *
 * Every one of them is answered somewhere on the site already — the cost of
 * asking, the minimum order, that we hold no stock — but not on the page where
 * the question actually stops someone. Kept to what this page can answer:
 * warranty belongs to /kvalitet and what drives price belongs to /priser.
 */
const quoteFaqs = [
  {
    question: { da: "Koster det noget at få et tilbud?", en: "Does a quote cost anything?" },
    answer: {
      da: "Nej. Der er ingen binding i at spørge, og I betaler først noget, hvis I siger ja til et tilbud.",
      en: "No. Asking commits you to nothing, and you pay nothing unless you accept a quote.",
    },
  },
  {
    question: {
      da: "Hvad hvis vi ikke kender specifikationen endnu?",
      en: "What if we do not know the specification yet?",
    },
    answer: {
      da: "Så lad felterne stå som »ved ikke endnu«, og fortæl os i stedet, hvad maskinerne skal bruges til. Vi foreslår et niveau, I kan forholde jer til, frem for at bede jer gætte på hukommelse og processor.",
      en: "Leave the fields at “not sure yet” and tell us what the machines are for instead. We propose a level you can react to rather than asking you to guess at memory and processor.",
    },
  },
  {
    question: { da: "Er der et minimumsantal?", en: "Is there a minimum order?" },
    answer: {
      da: "Nej. Et tilbud kan lige så godt dække én maskine som en hel afdeling – skriv antallet i forespørgslen, så regner vi derfra.",
      en: "No. A quote can cover one machine just as well as a whole department — put the number in the enquiry and we work from there.",
    },
  },
  {
    question: { da: "Har I maskinerne på lager?", en: "Do you hold the machines in stock?" },
    answer: {
      da: "Nej. Vi skaffer maskinerne til hver ordre i vores leverandørnetværk frem for at sælge fra et fast lager. Det er også derfor, tilbuddet oplyser stand og leveringstid på det konkrete parti frem for en listepris.",
      en: "No. We source per order through our supplier network rather than selling from fixed stock. That is also why a quote states the condition and lead time of the actual batch rather than a list price.",
    },
  },
  {
    question: { da: "Hvad står der i tilbuddet?", en: "What is in the quote?" },
    answer: {
      da: "Antal, pris per enhed og specifikationen på enhedsniveau – model, hukommelse, lagring, skærm, kosmetisk stand, tastaturlayout og styresystem. Siden med et eksempel på et tilbud viser, hvordan det ser ud udfyldt.",
      en: "Quantity, price per unit and the specification written per unit — model, memory, storage, display, cosmetic condition, keyboard layout and operating system. The example quote page shows what that looks like filled in.",
    },
  },
  {
    question: {
      da: "Kan I regne på både det nye indkøb og det, vi skal af med?",
      en: "Can you price both the new purchase and what we are getting rid of?",
    },
    answer: {
      da: "Ja. Send en liste over det, der skal væk, sammen med forespørgslen, så regner vi begge veje, og værdien kan modregnes i indkøbet.",
      en: "Yes. Send a list of what needs to go along with the request, and we price both sides — the value can be offset against the purchase.",
    },
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
    ...metaFor("/tilbud", params.lang),
  };
}

export default async function QuotePage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];

  /* Built from the same array <Faq> renders, so the answers Google reads and
     the answers on the page are the same text by construction — the pattern
     /priser and /flaadeloesninger already use. */
  return (
    <>
      <PageSchema lang={lang} type="ContactPage" route="/tilbud" />

      <section className="lit lit-paper py-10 sm:py-20">
        <Container>
          <div className="max-w-5xl xl:max-w-none">
            <Breadcrumbs
              lang={lang}
              trail={[{ name: lang === "da" ? "Få et tilbud" : "Get a quote", href: "/tilbud" }]}
              className="mb-5"
            />
            <h1 className="max-w-3xl text-balance font-display t-h1 font-extrabold tracking-display text-paper">
              {c.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-[1.65] sm:text-lg sm:leading-[1.65] text-paper/85">
              {c.lead}
            </p>
            <p className="label mt-6 text-paper/65">
              {lang === "da" ? "Opdateret" : "Updated"}{" "}
              <time dateTime={pageUpdated("/tilbud")} className="tabular-nums text-paper/85">
                {formatDate(pageUpdated("/tilbud"), lang)}
              </time>
            </p>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="plate p-6 sm:p-8">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.formTitle}
                </h2>
                <div className="mt-6">
                  {/* The form reads ?model= and ?antal= itself, so this page
                    stays prerendered. */}
                  <ContactForm lang={lang} quote />
                </div>
              </div>

              <div className="space-y-8">
                <div className="plate p-6">
                  <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                    {c.nextTitle}
                  </h2>
                  <ol className="mt-4 space-y-3">
                    {c.nextSteps.map((step, i) => (
                      <li key={step} className="flex gap-3 text-sm leading-6 text-paper/75">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600/25 text-xs font-bold text-brand-200"
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* The strongest thing we can show someone who has not written
                  yet is the document they would get back. It was one link in a
                  list of four; here it is the thing you cannot miss. */}
                <div className="border border-brand-400/40 bg-brand-600/10 p-6">
                  <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                    {c.exampleTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-[1.6] text-paper/75">{c.exampleBody}</p>
                  <Link
                    href={localePath("/tilbud-eksempel", lang)}
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                  >
                    {c.exampleLink}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                    {c.trustTitle}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {c.trustLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={localePath(link.href, lang)}
                          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                        >
                          {link.label}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                    {c.otherTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-[1.6] text-paper/75">{c.otherBody}</p>
                  <Link
                    href={localePath("/kontakt", lang)}
                    className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                  >
                    {c.otherLink}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.needTitle}
            </h2>
            <p className="mt-4 text-base leading-[1.75] text-paper/75">{c.needLead}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {c.needItems.map((item) => (
              <div key={item.title} className="plate p-5 sm:p-8">
                <h3 className="flex gap-2.5 text-base font-semibold text-paper">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 flex-none text-brand-300"
                    strokeWidth={2}
                  />
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.6] text-paper/75">{item.body}</p>
              </div>
            ))}
          </div>

          <Link
            href={localePath("/saelg-til-os", lang)}
            className="mt-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
          >
            {c.needLinkLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Container>
      </section>

      <div className="border-t border-white/10">
        <Faq lang={lang} items={quoteFaqs} title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }} />
      </div>
    </>
  );
}

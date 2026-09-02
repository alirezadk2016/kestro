import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

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
    metaTitle: "Få et tilbud på brugt erhvervs-IT | Kestro",
    metaDescription:
      "Fortæl os antal, specifikation og hvornår det skal stå klar. Vi vender tilbage med pris per enhed, stand og leveringstid. Uforpligtende.",
    title: "Få et tilbud",
    lead: "Prisen afhænger af konfiguration, stand og antal, så den bliver regnet på jeres konkrete behov frem for på en liste. Udfyld det, I ved – resten kan stå som “ved ikke endnu”.",
    formTitle: "Jeres forespørgsel",
    nextTitle: "Hvad sker der, når I sender",
    nextSteps: [
      "Vi læser forespørgslen og spørger ind, hvis noget mangler.",
      "Vi finder maskinerne i leverandørnetværket og sender et tilbud med pris per enhed, stand, antal og leveringstid.",
      "I godkender – eller siger nej. Der er ingen binding i at spørge.",
    ],
    exampleTitle: "Se et tilbud, før I beder om et",
    exampleBody:
      "Eksemplet viser et tilbud på enhedsniveau – model, specifikation, kosmetisk stand, batteri, tastaturlayout og styresystem – så I ved, hvad der kommer retur, inden I udfylder noget.",
    exampleLink: "Se eksemplet",
    needTitle: "Det, vi har brug for at vide",
    needLead:
      "Ingen af felterne er obligatoriske, og “ved ikke endnu” er et brugbart svar. Men jo mere af det herunder, I kan sige noget om, jo mindre bliver det første svar en række spørgsmål tilbage.",
    needItems: [
      {
        title: "Antal, og hvad der følger med",
        body: "Skal der skærme, dockingstationer eller kabler med, ændrer det både prisen og hvor lang tid det tager at samle leverancen. Et cirka-tal er nok til at komme i gang – I kan altid justere, inden I siger ja.",
      },
      {
        title: "Hvad maskinerne skal bruges til",
        body: "Kontorarbejde, konstruktion og billedarbejde stiller vidt forskellige krav. Kender I ikke specifikationen, er opgaven et bedre svar: så foreslår vi et niveau, I kan forholde jer til, frem for at bede jer gætte på hukommelse og processor.",
      },
      {
        title: "Hvornår det skal stå klar",
        body: "Vi skaffer maskinerne per ordre, så tidsrammen er en del af opgaven og ikke en detalje til sidst. Har I en fast dato – en ny medarbejder, en flytning, et supportophør – så sig det med det samme.",
      },
      {
        title: "Om I samtidig skal af med noget",
        body: "Har I ældre maskiner, der skal væk, kan vi regne på begge dele på én gang, og værdien af det gamle kan modregnes i indkøbet.",
      },
    ],
    needLinkLabel: "Sådan køber vi brugt udstyr",
    processTitle: "Fra forespørgsel til tilbud",
    processLead:
      "Fire trin, og der er ingen binding i nogen af dem. Vi sætter ikke et antal dage på herunder – vi skaffer maskinerne per ordre, så tiden afhænger af, hvad der skal findes, og i hvilket antal. Til gengæld skal I ikke gætte, hvad der sker undervejs.",
    processSteps: [
      {
        title: "I sender forespørgslen",
        body: "Formularen herover er nok. Mangler der noget, vi skal bruge for at kunne regne på det, spørger vi ind frem for at gætte os frem til en pris, der ikke holder.",
      },
      {
        title: "Vi søger i leverandørnetværket",
        body: "Vi har ikke et lager, I vælger fra. Maskinerne findes hos vores leverandører, og det er her, det afgøres, hvad der reelt kan skaffes til den specifikation og det antal, I har bedt om.",
      },
      {
        title: "I får et tilbud, I kan læse",
        body: "Tilbuddet står på enhedsniveau frem for som ét tal. Eksempelsiden viser, hvordan det ser ud udfyldt. Kan specifikationen ikke fyldes i det antal, foreslår vi det nærmeste alternativ i stedet for at lade feltet stå tomt.",
      },
      {
        title: "I siger ja eller nej",
        body: "Der er ingen binding i at spørge. Siger I ja, aftaler vi klargøring, levering og vilkår, før noget sættes i gang.",
      },
    ],
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
    metaTitle: "Get a quote on used business IT | Kestro",
    metaDescription:
      "Tell us the quantity, the specification and when it has to be ready, and we come back with price per unit, condition and lead time. No obligation.",
    title: "Get a quote",
    lead: "The price depends on configuration, condition and quantity, so it is worked out against what you actually need rather than read off a list. Fill in what you know — the rest can stay at “not sure yet”.",
    formTitle: "Your request",
    nextTitle: "What happens when you send it",
    nextSteps: [
      "We read the request and ask if anything is missing.",
      "We find the machines in our supplier network and send a quote with price per unit, condition, quantity and lead time.",
      "You approve — or you say no. Asking commits you to nothing.",
    ],
    exampleTitle: "See a quote before you ask for one",
    exampleBody:
      "The example is written per unit — model, specification, cosmetic condition, battery, keyboard layout and operating system — so you know what comes back before you fill anything in.",
    exampleLink: "See the example",
    needTitle: "What we need to know",
    needLead:
      "None of the fields are required, and “not sure yet” is a usable answer. But the more of the below you can say something about, the less the first reply has to be a list of questions back.",
    needItems: [
      {
        title: "Quantity, and what goes with it",
        body: "Monitors, docking stations or cables change both the price and how long the delivery takes to assemble. A rough number is enough to start — you can adjust before you say yes.",
      },
      {
        title: "What the machines are for",
        body: "Office work, engineering and image work make very different demands. If you do not know the specification, the job is the better answer: we suggest a level you can react to rather than asking you to guess at memory and processor.",
      },
      {
        title: "When it has to be ready",
        body: "We source per order, so timing is part of the job rather than a detail at the end. If you have a fixed date — a new starter, an office move, a support deadline — say so straight away.",
      },
      {
        title: "Whether something is going out at the same time",
        body: "If you have older machines to move on, we can price both sides at once, and the value of the old can be offset against the purchase.",
      },
    ],
    needLinkLabel: "How we buy used equipment",
    processTitle: "From enquiry to quote",
    processLead:
      "Four steps, and none of them commits you to anything. We do not put a number of days on them below — we source per order, so the time depends on what has to be found and in what quantity. What you should not have to do is guess what is happening in between.",
    processSteps: [
      {
        title: "You send the request",
        body: "The form above is enough. If something is missing that we need in order to price it, we ask rather than guessing our way to a number that will not hold.",
      },
      {
        title: "We search the supplier network",
        body: "There is no warehouse for you to pick from. The machines sit with our suppliers, and that is where it is decided what can actually be sourced at the specification and quantity you asked for.",
      },
      {
        title: "You get a quote you can read",
        body: "The quote is written per unit rather than as a single number. The example page shows what that looks like filled in. If the specification cannot be met at that quantity, we propose the closest alternative instead of leaving the field blank.",
      },
      {
        title: "You say yes or no",
        body: "Asking commits you to nothing. If you say yes, we agree preparation, delivery and terms before anything is set in motion.",
      },
    ],
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
      da: "Så lad felterne stå som “ved ikke endnu”, og fortæl os i stedet, hvad maskinerne skal bruges til. Vi foreslår et niveau, I kan forholde jer til, frem for at bede jer gætte på hukommelse og processor.",
      en: "Leave the fields at “not sure yet” and tell us what the machines are for instead. We propose a level you can react to rather than asking you to guess at memory and processor.",
    },
  },
  {
    question: { da: "Er der et minimumsantal?", en: "Is there a minimum order?" },
    answer: {
      da: "Nej. Vi tilpasser leverancen fra enkelte enheder til større indkøb til hele teams eller virksomheder.",
      en: "No. We scale the delivery from single machines up to larger purchases for whole teams or companies.",
    },
  },
  {
    question: { da: "Har I maskinerne på lager?", en: "Do you hold the machines in stock?" },
    answer: {
      da: "Nej. Vi skaffer per ordre i vores leverandørnetværk frem for at sælge fra et fast lager. Det er også derfor, tilbuddet oplyser stand og leveringstid på det konkrete parti frem for en listepris.",
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

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/tilbud", params.lang),
  };
}

export default function QuotePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  /* Built from the same array <Faq> renders, so the answers Google reads and
     the answers on the page are the same text by construction — the pattern
     /priser and /flaadeloesninger already use. */
  return (
    <>
      <section className="lit lit-paper py-10 sm:py-20">
        <Container>
          <div className="max-w-5xl">
            <Breadcrumbs
              lang={lang}
              trail={[{ name: lang === "da" ? "Få et tilbud" : "Get a quote", href: "/tilbud" }]}
              className="mb-5"
            />
            <h1 className="max-w-3xl text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
              {c.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 text-paper/70">
              {c.lead}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="border border-white/10 bg-white/[0.04] p-6 shadow-sm sm:p-8">
                <h2 className="font-display text-lg font-bold tracking-tight text-paper">
                  {c.formTitle}
                </h2>
                <div className="mt-6">
                  {/* The form reads ?model= and ?antal= itself, so this page
                    stays prerendered. */}
                  <ContactForm lang={lang} quote />
                </div>
              </div>

              <div className="space-y-8">
                <div className="border-l-2 border-brand-400 bg-white/5 p-6">
                  <h2 className="font-display text-base font-bold tracking-tight text-paper">
                    {c.nextTitle}
                  </h2>
                  <ol className="mt-4 space-y-3">
                    {c.nextSteps.map((step, i) => (
                      <li key={step} className="flex gap-3 text-sm leading-6 text-paper/70">
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
                  <h2 className="font-display text-base font-bold tracking-tight text-paper">
                    {c.exampleTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-paper/70">{c.exampleBody}</p>
                  <Link
                    href={localePath("/tilbud-eksempel", lang)}
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                  >
                    {c.exampleLink}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="font-display text-base font-bold tracking-tight text-paper">
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
                  <h2 className="font-display text-base font-bold tracking-tight text-paper">
                    {c.otherTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-paper/65">{c.otherBody}</p>
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
            <h2 className="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.needTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.needLead}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {c.needItems.map((item) => (
              <div key={item.title} className="border border-white/10 bg-white/[0.04] p-5 sm:p-8">
                <h3 className="flex gap-2.5 text-base font-semibold text-paper">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-brand-300" strokeWidth={2.5} />
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-paper/65">{item.body}</p>
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

      <section className="py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.processTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.processLead}</p>

            <ol className="mt-10 space-y-6">
              {c.processSteps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-paper">{step.title}</h3>
                    <p className="mt-1 text-base leading-7 text-paper/65">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <div className="border-t border-white/10">
        <Faq lang={lang} items={quoteFaqs} title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }} />
      </div>
    </>
  );
}

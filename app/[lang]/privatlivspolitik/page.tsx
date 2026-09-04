import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { company } from "@/lib/company";
import { metaFor, type Lang, type Localized } from "@/lib/i18n";
import { legalUpdated } from "@/lib/legal";

/*
 * Required under GDPR art. 13 the moment a visitor can send us their name and
 * email. Everything here describes what the site actually does, which is the
 * only thing that makes it worth anything — so it has to be corrected whenever
 * the site changes, and it has twice: the contact form posts to our own API
 * now rather than opening a mail client, and visits are counted without
 * cookies for everyone, not only for those who accept Google.
 */

/* The date the sitemap also publishes, from lib/legal.ts — written once
   so the page and the <lastmod> can never disagree. */
const UPDATED = legalUpdated["/privatlivspolitik"];

const copy = {
  da: {
    metaTitle: "Privatlivspolitik | Kestro",
    metaDescription:
      "Sådan behandler Kestro personoplysninger: kontaktformularerne, de to værdier vi gemmer lokalt, cookiefri besøgstal — og den statistik fra Google, der kun kører, hvis I siger ja.",
    title: "Privatlivspolitik",
    description:
      "Hvilke oplysninger vi behandler, hvorfor, og hvad I kan kræve. Kort version: ingen reklamer, ingen deling til markedsføring, og intet der følger jer videre.",
    updated: "Senest opdateret",
  },
  en: {
    metaTitle: "Privacy policy | Kestro",
    metaDescription:
      "How Kestro handles personal data: the contact forms, the two values we store locally, cookieless visit counts — and the Google statistics that only run if you accept them.",
    title: "Privacy policy",
    description:
      "What data we process, why, and what you can require. Short version: no advertising, nothing shared for marketing, and nothing that follows you elsewhere.",
    updated: "Last updated",
  },
} satisfies Record<Lang, Record<string, string>>;

type Section = { heading: Localized; body: Localized[] };

const sections: Section[] = [
  {
    heading: { da: "Dataansvarlig", en: "Data controller" },
    body: [
      {
        da: `${company.name}, ${company.locationShort.da}. E-mail: ${company.email}.`,
        en: `${company.name}, ${company.locationShort.en}. Email: ${company.email}.`,
      },
    ],
  },
  {
    heading: { da: "Kort fortalt", en: "In short" },
    body: [
      {
        da: "Denne hjemmeside viser ingen reklamer og deler ikke oplysninger til markedsføring. Skrifttyper og billeder ligger på vores eget domæne. Vi tæller besøg og måler hastighed uden cookies – det kører altid, og det følger jer ikke videre. Google Analytics bruger vi kun, hvis I aktivt siger ja; siger I nej, bliver der ikke hentet noget fra Google overhovedet.",
        en: "This website shows no advertising and shares nothing for marketing. Fonts and images are served from our own domain. We count visits and measure speed without cookies — that always runs, and it does not follow you elsewhere. Google Analytics we use only if you actively say yes; if you say no, nothing is loaded from Google at all.",
      },
    ],
  },
  {
    heading: { da: "Cookies", en: "Cookies" },
    body: [
      {
        da: "Vi sætter ingen cookies af os selv. To små værdier gemmes lokalt i jeres browser: jeres svar på spørgsmålet om statistik, og om I har lukket beskeden om den engelske udgave. De sendes aldrig til os, og de bruges ikke til andet end at huske de to valg.",
        en: "We set no cookies of our own. Two small values are stored locally in your browser: your answer to the statistics question, and whether you have dismissed the note about the English version. They are never sent to us, and they are used for nothing but remembering those two choices.",
      },
      {
        da: "De to værdier er nødvendige for at kunne huske, hvad I har svaret, og kræver derfor ikke samtykke. Statistik gør: siger I ja i banneret, sætter Google Analytics sine egne cookies (_ga og _ga_*) for at kunne skelne besøg fra hinanden. De udløber efter to år og indeholder et tilfældigt id, ikke et navn. Siger I nej – eller svarer I ikke – bliver der hverken sat cookies eller sendt data.",
        en: "Those two values are necessary to remember what you answered, so they need no consent. Statistics do: if you say yes in the banner, Google Analytics sets its own cookies (_ga and _ga_*) to tell visits apart. They expire after two years and hold a random id, not a name. If you say no — or do not answer — nothing is set and nothing is sent.",
      },
    ],
  },
  {
    heading: { da: "Kontaktformularerne", en: "The contact forms" },
    body: [
      {
        da: "Når I sender en formular, går indholdet til vores egen server på kestro.dk, som sender det videre til os som en e-mail. Vi modtager altså først oplysninger, når I trykker send – men det er siden, der sender dem, ikke jeres eget mailprogram.",
        en: "When you submit a form, the content goes to our own server on kestro.dk, which passes it on to us as an email. So we receive information only once you press send — but it is the site that sends it, not your own mail client.",
      },
      {
        da: "Vi behandler: navn, virksomhed, e-mailadresse, telefonnummer hvis oplyst, indholdet af beskeden, og hvilken side på kestro.dk den blev sendt fra. På tilbudsformularen desuden det, I selv udfylder om antal, model, hukommelse, lagerplads, tastatur og ønsket leveringstidspunkt.",
        en: "We process: name, company, email address, phone number if given, the content of the message, and which page on kestro.dk it was sent from. On the quote form, also what you fill in about quantity, model, memory, storage, keyboard and preferred delivery date.",
      },
      {
        da: "Kan formularen ikke sende, viser den beskeden, så I kan kopiere den eller åbne den i jeres eget mailprogram. I det tilfælde forlader oplysningerne ikke jeres browser, før I selv sender dem.",
        en: "If the form cannot send, it shows you the message so you can copy it or open it in your own mail client. In that case the details do not leave your browser until you send them yourself.",
      },
    ],
  },
  {
    heading: { da: "Formål og retsgrundlag", en: "Purpose and legal basis" },
    body: [
      {
        da: "Vi behandler oplysningerne for at besvare henvendelsen og for at indgå eller opfylde en aftale med jer – databeskyttelsesforordningens artikel 6, stk. 1, litra b.",
        en: "We process the data to answer your enquiry and to enter into or perform an agreement with you — GDPR article 6(1)(b).",
      },
      {
        da: "Almindelig kundekontakt, opfølgning og driften og sikkerheden af hjemmesiden sker på grundlag af vores legitime interesse – artikel 6, stk. 1, litra f.",
        en: "Ordinary customer contact, follow-up, and the operation and security of the website rest on our legitimate interest — article 6(1)(f).",
      },
    ],
  },
  {
    heading: { da: "Statistik (Google Analytics)", en: "Statistics (Google Analytics)" },
    body: [
      {
        da: "Hvis I accepterer statistik i banneret, indlæser vi Google Analytics 4 og måler, hvilke sider der bliver læst, hvordan man er kommet ind på siden, og om en formular blev sendt. Vi sender aldrig navn, e-mail, telefonnummer eller indholdet af en besked til Google.",
        en: "If you accept statistics in the banner, we load Google Analytics 4 and measure which pages get read, how you arrived, and whether a form was sent. We never send your name, email, phone number or the content of a message to Google.",
      },
      {
        da: 'Retsgrundlaget er jeres samtykke – databeskyttelsesforordningens artikel 6, stk. 1, litra a, og cookiebekendtgørelsens § 3. Samtykket kan trækkes tilbage når som helst via linket "Cookies og statistik" nederst på siden; derefter indlæses Google ikke igen.',
        en: 'The legal basis is your consent — GDPR article 6(1)(a) and the Danish cookie order § 3. You can withdraw it at any time through the "Cookies and statistics" link at the bottom of the page; after that, Google is not loaded again.',
      },
      {
        da: "Google LLC behandler oplysningerne som databehandler og er amerikansk. Overførslen sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og EU-US Data Privacy Framework. Vi har slået deling til Googles annonceprodukter fra.",
        en: "Google LLC processes the data as our processor and is a US company. The transfer rests on the European Commission's standard contractual clauses and the EU-US Data Privacy Framework. Sharing with Google's advertising products is switched off.",
      },
    ],
  },
  {
    heading: {
      da: "Besøgstal og hastighed (Vercel)",
      en: "Visit counts and speed (Vercel)",
    },
    body: [
      {
        da: "Ud over Google Analytics tæller vi besøg med Vercel Analytics og måler sidernes hastighed med Vercel Speed Insights. Begge dele kører uanset, hvad I svarer i banneret, og det er der en grund til: de sætter ingen cookies, gemmer intet i jeres browser og følger jer ikke videre til andre hjemmesider. Der registreres et sidevisning, hvilket land forespørgslen kom fra, og hvor hurtigt siden blev vist.",
        en: "Alongside Google Analytics we count visits with Vercel Analytics and measure page speed with Vercel Speed Insights. Both run whatever you answer in the banner, and there is a reason for that: they set no cookies, store nothing in your browser and do not follow you to other websites. What is recorded is a page view, which country the request came from, and how quickly the page rendered.",
      },
      {
        da: "Retsgrundlaget er vores legitime interesse i at vide, om hjemmesiden bliver læst og om den er hurtig nok – databeskyttelsesforordningens artikel 6, stk. 1, litra f. Fordi der hverken sættes eller læses noget i jeres udstyr, er der ikke tale om cookies i cookiebekendtgørelsens forstand, og der indsamles ikke oplysninger, der kan pege på en bestemt person.",
        en: "The legal basis is our legitimate interest in knowing whether the site is read and whether it is fast enough — GDPR article 6(1)(f). Because nothing is written to or read from your device, these are not cookies in the sense of the Danish cookie order, and nothing is collected that can point to a particular person.",
      },
      {
        da: "Vercel Inc. er amerikansk og behandler oplysningerne som databehandler for os, på grundlag af EU-Kommissionens standardkontraktbestemmelser. Vercel er i forvejen vores hostingudbyder, så forespørgslen når dem under alle omstændigheder.",
        en: "Vercel Inc. is a US company and processes the data as our processor, on the basis of the European Commission's standard contractual clauses. Vercel already hosts the site, so the request reaches them in any case.",
      },
    ],
  },
  {
    heading: { da: "Serverlogs", en: "Server logs" },
    body: [
      {
        da: "Vores hostingudbyder registrerer tekniske oplysninger om besøg – blandt andet IP-adresse, tidspunkt og browsertype – for at kunne drive og sikre hjemmesiden. Loggene bruges ikke til at profilere besøgende.",
        en: "Our hosting provider records technical information about visits — IP address, time and browser type among others — in order to run and secure the website. The logs are not used to profile visitors.",
      },
    ],
  },
  {
    heading: { da: "Leverandører og overførsel", en: "Providers and transfers" },
    body: [
      {
        da: "Hjemmesiden hostes hos Vercel Inc., som også leverer de besøgstal og hastighedsmålinger, der er beskrevet ovenfor. Beskeder fra formularerne sendes som e-mail gennem Resend, Inc., og modtages i vores egen mailkonto. Accepterer I statistik, behandler Google LLC desuden besøgsdata for os. Alle tre er databehandlere på vores vegne.",
        en: "The website is hosted with Vercel Inc. Messages from the forms are sent as email through Resend, Inc., and land in our own mailbox. If you accept statistics, Google LLC also processes visit data for us. All three are processors acting on our behalf.",
      },
      {
        da: "Vercel, Resend og Google er amerikanske leverandører. Overførsel af personoplysninger til USA sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og/eller EU-US Data Privacy Framework.",
        en: "Vercel, Resend and Google are US providers. Transfers of personal data to the US take place under the European Commission's standard contractual clauses and/or the EU-US Data Privacy Framework.",
      },
    ],
  },
  {
    heading: { da: "Hvor længe vi gemmer", en: "How long we keep it" },
    body: [
      {
        da: "Vi gemmer korrespondance, så længe det er nødvendigt for dialogen eller kundeforholdet. Bilag, der er omfattet af bogføringsloven, gemmes i fem år fra udgangen af det regnskabsår, de vedrører.",
        en: "We keep correspondence for as long as the dialogue or the customer relationship requires. Records covered by the Danish Bookkeeping Act are kept for five years from the end of the financial year they relate to.",
      },
    ],
  },
  {
    heading: { da: "Jeres rettigheder", en: "Your rights" },
    body: [
      {
        da: "I har ret til indsigt i de oplysninger, vi behandler om jer, og ret til at få urigtige oplysninger rettet. I kan bede om sletning, om begrænsning af behandlingen, gøre indsigelse mod behandlingen og bede om dataportabilitet.",
        en: "You have the right to access the data we process about you and to have inaccurate data corrected. You may request erasure, request restriction of processing, object to the processing, and request data portability.",
      },
      {
        da: `Skriv til ${company.email}, hvis I vil gøre brug af en af rettighederne. I kan klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk.`,
        en: `Write to ${company.email} to exercise any of these rights. You may lodge a complaint with the Danish Data Protection Agency (Datatilsynet), Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk.`,
      },
    ],
  },
];

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/privatlivspolitik", params.lang),
  };
}

export default function PrivatlivspolitikPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <section className="py-10 sm:py-20">
      <Container>
        <PageHeader
          title={c.title}
          description={c.description}
          lang={lang}
          href="/privatlivspolitik"
          crumb={lang === "da" ? "Privatlivspolitik" : "Privacy policy"}
        />

        <div className="mt-14 max-w-3xl">
          {sections.map((section) => (
            <div key={section.heading.da} className="border-t border-white/10 py-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {section.heading[lang]}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.da}
                  className="mt-4 text-base leading-7 sm:leading-8 text-paper/65"
                >
                  {paragraph[lang]}
                </p>
              ))}
            </div>
          ))}

          <p className="border-t border-white/10 pt-8 text-sm text-paper/55">
            {c.updated}: {UPDATED}
          </p>
        </div>
      </Container>
    </section>
  );
}

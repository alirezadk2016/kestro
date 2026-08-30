import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { company } from "@/lib/company";
import { metaFor, type Lang, type Localized } from "@/lib/i18n";

/*
 * Required under GDPR art. 13 the moment a visitor can send us their name and
 * email. Everything here describes what the site actually does — it sets no
 * cookies, loads nothing from a third party, and the contact form opens the
 * visitor's own mail client rather than posting to a server of ours.
 */

/** Fixed, so "last updated" does not silently become the build date. */
const UPDATED = "2026-08-23";

const copy = {
  da: {
    metaTitle: "Privatlivspolitik | Kestro",
    metaDescription:
      "Sådan behandler Kestro personoplysninger. Hjemmesiden sætter ingen cookies og bruger ingen analyseværktøjer.",
    title: "Privatlivspolitik",
    description:
      "Hvilke oplysninger vi behandler, hvorfor, og hvad I kan kræve. Kort version: hjemmesiden i sig selv indsamler ingenting.",
    updated: "Senest opdateret",
  },
  en: {
    metaTitle: "Privacy policy | Kestro",
    metaDescription:
      "How Kestro handles personal data. The website sets no cookies and uses no analytics.",
    title: "Privacy policy",
    description:
      "What data we process, why, and what you can require. Short version: the website itself collects nothing.",
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
        da: "Denne hjemmeside bruger ingen analyse- eller sporingsværktøjer, viser ingen reklamer og henter intet fra tredjeparter. Skrifttyper og billeder ligger på vores eget domæne. Der sættes én cookie, og den husker kun, hvilket sprog I læser siden på – se afsnittet om cookies nedenfor.",
        en: "This website uses no analytics or tracking tools, shows no advertising, and loads nothing from third parties. Fonts and images are served from our own domain. One cookie is set, and it only remembers which language you are reading the site in — see the cookie section below.",
      },
    ],
  },
  {
    heading: { da: "Cookies", en: "Cookies" },
    body: [
      {
        da: "Vi sætter én cookie: kestro-lang. Den husker, om I læser siden på dansk eller engelsk, så jeres valg holder ved næste besøg. Den indeholder kun sprogkoden, den udløber efter et år, og den bruges hverken til statistik, profilering eller markedsføring.",
        en: "We set one cookie: kestro-lang. It remembers whether you are reading the site in Danish or English, so your choice holds on your next visit. It contains only the language code, it expires after a year, and it is not used for statistics, profiling or marketing.",
      },
      {
        da: "Fordi den er nødvendig for at levere siden på det sprog, I har valgt, kræver den ikke samtykke, og der er derfor ingen cookiebanner. Kommer der på et tidspunkt statistik eller sporing på siden, kommer der også en samtykkeløsning – og denne tekst bliver rettet, før det sker.",
        en: "Because it is necessary to deliver the site in the language you chose, it requires no consent, and there is therefore no cookie banner. If statistics or tracking are ever added, a consent mechanism comes with them — and this text is corrected before that happens.",
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
        da: "Hjemmesiden hostes hos Vercel Inc. Beskeder fra formularerne sendes som e-mail gennem Resend, Inc., og modtages i vores egen mailkonto. Begge behandler personoplysninger på vores vegne som databehandlere.",
        en: "The website is hosted with Vercel Inc. Messages from the forms are sent as email through Resend, Inc., and land in our own mailbox. Both process personal data on our behalf as processors.",
      },
      {
        da: "Vercel og Resend er amerikanske leverandører. Overførsel af personoplysninger til USA sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og/eller EU-US Data Privacy Framework.",
        en: "Vercel and Resend are US providers. Transfers of personal data to the US take place under the European Commission's standard contractual clauses and/or the EU-US Data Privacy Framework.",
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
    <section className="py-10 sm:py-24">
      <Container>
        <PageHeader title={c.title} description={c.description} />

        <div className="mt-14 max-w-3xl">
          {sections.map((section) => (
            <div key={section.heading.da} className="border-t border-white/10 py-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {section.heading[lang]}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.da} className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">
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

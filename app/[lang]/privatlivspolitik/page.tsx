import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { company } from "@/lib/company";
import { alternatesFor, type Lang, type Localized } from "@/lib/i18n";

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
        da: `${company.name}, ${company.locationShort.da}. E-mail: ${company.email}. Telefon: ${company.phoneDisplay}.`,
        en: `${company.name}, ${company.locationShort.en}. Email: ${company.email}. Phone: ${company.phoneDisplay}.`,
      },
    ],
  },
  {
    heading: { da: "Kort fortalt", en: "In short" },
    body: [
      {
        da: "Denne hjemmeside sætter ingen cookies, bruger ingen analyse- eller sporingsværktøjer og henter intet fra tredjeparter. Skrifttyper og billeder ligger på vores eget domæne. Derfor er der heller ingen cookiebanner – der er ikke noget at give samtykke til.",
        en: "This website sets no cookies, uses no analytics or tracking tools, and loads nothing from third parties. Fonts and images are served from our own domain. That is also why there is no cookie banner — there is nothing to consent to.",
      },
    ],
  },
  {
    heading: { da: "Kontaktformularerne", en: "The contact forms" },
    body: [
      {
        da: "Formularerne sender ikke data til os. Når I trykker send, åbner jeres eget mailprogram med teksten udfyldt, og I sender selv mailen. Vi modtager først oplysninger, når I aktivt sender dem.",
        en: "The forms do not send data to us. When you press send, your own mail client opens with the text filled in, and you send the message yourself. We receive information only once you actively send it.",
      },
      {
        da: "Når I skriver til os, behandler vi: navn, virksomhed, e-mailadresse, telefonnummer hvis oplyst, og indholdet af beskeden.",
        en: "When you write to us we process: name, company, email address, phone number if given, and the content of the message.",
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
        da: "Hjemmesiden hostes hos Vercel Inc., og e-mail behandles hos vores mailudbyder. Begge kan behandle personoplysninger på vores vegne som databehandlere.",
        en: "The website is hosted with Vercel Inc., and email is handled by our mail provider. Both may process personal data on our behalf as processors.",
      },
      {
        da: "Vercel er en amerikansk leverandør. Overførsel af personoplysninger til USA sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og/eller EU-US Data Privacy Framework.",
        en: "Vercel is a US provider. Transfers of personal data to the US take place under the European Commission's standard contractual clauses and/or the EU-US Data Privacy Framework.",
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
    alternates: alternatesFor("/privatlivspolitik", params.lang),
  };
}

export default function PrivatlivspolitikPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <PageHeader title={c.title} description={c.description} />

        <div className="mt-14 max-w-3xl">
          {sections.map((section) => (
            <div key={section.heading.da} className="border-t border-paper-edge py-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">
                {section.heading[lang]}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.da} className="mt-4 text-base leading-8 text-ink-600">
                  {paragraph[lang]}
                </p>
              ))}
            </div>
          ))}

          <p className="border-t border-paper-edge pt-8 text-sm text-ink-500">
            {c.updated}: {UPDATED}
          </p>
        </div>
      </Container>
    </section>
  );
}

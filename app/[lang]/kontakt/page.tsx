import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import ContactFlipCard from "@/components/ContactFlipCard";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, postalAddress } from "@/lib/company";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import Faq, { type FaqItem } from "@/components/Faq";
import FactNote from "@/components/FactNote";
import RelatedLinks from "@/components/RelatedLinks";
import type { SourceId } from "@/lib/sources";

const copy = {
  da: {
    metaTitle: "Kontakt Kestro, Aarhus – brugte computere til virksomheder",
    metaDescription:
      "Kontakt Kestro om brugt IT, en flåde eller udstyr, I skal af med. Skriv til kontakt@kestro.dk eller brug formularen til en uforpligtende forespørgsel.",
    title: "Kontakt os",
    /* Answer first: how to reach us, how fast, and to where — the three things
       a person landing here wants, before any of the context below. */
    description: `Skriv via formularen herunder eller direkte til ${company.email} om brugt erhvervs-IT i Danmark og Norge.`,
    quoteHint: "Skal I have en pris på maskiner?",
    quoteLink: "Brug tilbudsformularen",
    emailTitle: "Foretrækker I e-mail?",
    emailBody: "Skriv direkte til os, så vender vi tilbage hurtigst muligt.",
    companyTitle: "Projekt og kontakt",
    fieldCompany: "Virksomhed",
    fieldPhone: "Telefon",
    fieldEmail: "E-mail",
    fieldAddress: "Adresse",
    fieldServes: "Fokusområde",
    fieldCvr: "CVR",
    fieldHours: "Åbningstider",
    at: "hos",
    briefTitle: "Hvad skal der stå i beskeden?",
    briefBody:
      "Antal, type og tidsramme er det vigtigste. Resten sparer en runde spørgsmål.",
    brief1: "Antal enheder – også hvis det er et skøn.",
    brief2: "Type: bærbar, stationær, mini-pc, skærm, dockingstation eller andet.",
    brief3: "Krav til processor, hukommelse (RAM) og lagerplads, hvis I har dem.",
    brief4: "Tastaturlayout – dansk eller norsk – og hvilket land der skal leveres til.",
    brief5: "Hvornår udstyret skal stå klar.",
    brief6:
      "Skal I også af med gammelt udstyr: hvor mange enheder, og om I skal bruge dokumentation for datasletning.",
    faqTitle: "Spørgsmål, før I skriver",
  },
  en: {
    metaTitle: "Contact Kestro in Aarhus — used and refurbished business IT",
    metaDescription:
      "Contact Kestro about used business IT, a fleet or equipment to move on. Email kontakt@kestro.dk or use the form for an initial, non-binding enquiry.",
    title: "Contact us",
    description: `Write through the form below or directly to ${company.email} about used business IT in Denmark and Norway.`,
    quoteHint: "Need a price on machines?",
    quoteLink: "Use the quote form",
    emailTitle: "Prefer email?",
    emailBody: "Write to us directly and we will come back to you as soon as we can.",
    companyTitle: "Project and contact",
    fieldCompany: "Company",
    fieldPhone: "Phone",
    fieldEmail: "Email",
    fieldAddress: "Address",
    fieldServes: "Market focus",
    fieldCvr: "VAT no. (CVR)",
    fieldHours: "Opening hours",
    at: "at",
    briefTitle: "What should the message say?",
    briefBody:
      "Quantity, type and timing matter most. The rest saves a round of questions.",
    brief1: "Number of devices — an estimate is fine.",
    brief2: "Type: laptop, desktop, mini PC, monitor, docking station or something else.",
    brief3: "Requirements for processor, memory (RAM) and storage, if you have them.",
    brief4: "Keyboard layout — Danish or Norwegian — and which country it is going to.",
    brief5: "When the equipment needs to be ready.",
    brief6:
      "If you also have old equipment to move on: how many devices, and whether you need documentation of data erasure.",
    faqTitle: "Questions before you write",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * Questions people actually have at the point of writing, answered from what
 * the rest of the site already commits to: the reply time from the contact
 * card, the markets and minimum order from the front page FAQ, the Windows
 * answer from the Windows 10 guide, erasure from the sell-to-us page and data
 * handling from the privacy policy. Nothing here is a new promise.
 */
const contactFaqs: FaqItem[] = [
  {
    question: { da: "Hvor hurtigt svarer I?", en: "How quickly do you reply?" },
    answer: {
      da: "Vi læser henvendelserne og vender tilbage hurtigst muligt. Der er ikke en garanteret svartid i projektets etableringsfase.",
      en: "We read enquiries and get back to you as soon as we can. There is no guaranteed response time during the project's preparation phase.",
    },
  },
  {
    question: {
      da: "Er der et minimumsantal enheder?",
      en: "Is there a minimum number of devices?",
    },
    answer: {
      da: "Nej. Vi leverer alt fra en enkelt maskine til udstyr til hele teams og virksomheder i Danmark og Norge.",
      en: "No. We deliver anything from a single machine to equipment for whole teams and companies in Denmark and Norway.",
    },
  },
  {
    question: {
      da: "Vi kører stadig Windows 10 – hvad skal vi skrive?",
      en: "We still run Windows 10 — what should we write?",
    },
    answer: {
      da: "Antal maskiner og modelnavne. Ifølge Microsoft sluttede supporten for Windows 10 den 14. oktober 2025, og om en maskine kan opgraderes til Windows 11, afgøres bl.a. af TPM 2.0 og Secure Boot. Med listen kan vi sige, hvilke maskiner der kan opgraderes, og hvilke det bedre kan betale sig at skifte. Computerne på vores modelsider leveres med Windows 11 installeret.",
      en: "The number of machines and their model names. According to Microsoft, Windows 10 support ended on 14 October 2025, and whether a machine can move to Windows 11 is decided by TPM 2.0 and Secure Boot among other things. With the list we can tell you which machines can be upgraded and which are better replaced. The computers on our model pages are delivered with Windows 11 installed.",
    },
  },
  {
    question: {
      da: "Vi skal af med gamle maskiner – hvad sker der med data?",
      en: "We have old machines to move on — what happens to the data?",
    },
    answer: {
      da: "Lagermedierne slettes, før enhederne klargøres til videresalg. Skal I bruge dokumentation for sletningen til jeres egne GDPR-procedurer, så skriv det i beskeden. NIST, den amerikanske standardiseringsmyndighed, skelner mellem tre niveauer: Clear (overskrivning), Purge (sletning, der heller ikke kan gendannes i et laboratorium) og Destroy (fysisk destruktion). Det er en god idé at aftale, hvilket I har brug for.",
      en: "The storage is erased before the devices are prepared for resale. If you need documentation of the erasure for your own GDPR procedures, say so in the message. NIST, the US standards body, distinguishes three levels: Clear (overwriting), Purge (erasure that cannot be recovered even in a laboratory) and Destroy (physical destruction). It is worth agreeing which one you need.",
    },
  },
  {
    question: {
      da: "Hvad sker der med de oplysninger, vi sender?",
      en: "What happens to the details we send?",
    },
    answer: {
      da: "De bruges til at besvare henvendelsen og til at indgå eller opfylde en aftale med jer – databeskyttelsesforordningens artikel 6, stk. 1, litra b. Korrespondance gemmes, så længe dialogen eller kundeforholdet kræver det; bilag efter bogføringsloven i fem år. I kan altid bede om indsigt, rettelse eller sletning, og I kan klage til Datatilsynet.",
      en: "They are used to answer the enquiry and to enter into or perform an agreement with you — Article 6(1)(b) of the GDPR. Correspondence is kept as long as the conversation or the customer relationship needs it; accounting records under the Danish Bookkeeping Act for five years. You can always ask for access, correction or erasure, and you can complain to the Danish Data Protection Agency.",
    },
  },
  {
    question: { da: "Tager I imod private?", en: "Do you take private customers?" },
    answer: {
      da: "Kun i værkstedet. Indkøb og levering er til virksomheder, men reparation og opgradering tager vi imod fra både private og mindre virksomheder.",
      en: "Only in the workshop. Purchasing and delivery are for companies, but repairs and upgrades we take from individuals and smaller companies alike.",
    },
  },
];

/* Only the documents the answers above actually lean on. */
const contactSources: SourceId[] = ["windows10Eol", "windows11Requirements", "nistSanitization"];

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/kontakt", params.lang),
  };
}

export default async function KontaktPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <PageSchema
        lang={lang}
        type="ContactPage"
        route="/kontakt"
        name={c.title}
        description={c.description}
        sources={contactSources}
      />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/kontakt"
            crumb={lang === "da" ? "Kontakt" : "Contact"}
            updated="/kontakt"
          />

          <div className="mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              {/* Two forms on the site, and a buyer on this page should not
                  have to guess which one asks the right questions. */}
              <p className="mb-4 text-sm leading-[1.6] text-paper/75">
                {c.quoteHint}{" "}
                <Link
                  href={localePath("/tilbud", lang)}
                  className="inline-flex min-h-[44px] items-center font-semibold text-brand-300 underline decoration-brand-400/60 underline-offset-4 hover:text-paper"
                >
                  {c.quoteLink}
                </Link>
              </p>
              <div className="plate p-6 sm:p-8">
                <ContactForm lang={lang} />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <ContactFlipCard lang={lang} />

              <div className="plate p-6 sm:p-8">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.emailTitle}
                </h2>
                <p className="mt-2 text-sm leading-[1.6] text-paper/75">{c.emailBody}</p>
                <CopyEmailButton lang={lang} />
              </div>

              <div className="plate p-6 sm:p-8">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.companyTitle}
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/65">{c.fieldCompany}</dt>
                    <dd className="font-medium text-paper">{company.name}</dd>
                  </div>
                  {company.phoneDisplay && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/65">{c.fieldPhone}</dt>
                      <dd className="font-medium text-paper">{company.phoneDisplay}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/65">{c.fieldEmail}</dt>
                    <dd className="font-medium text-paper">{company.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/65">{c.fieldAddress}</dt>
                    <dd className="text-right font-medium text-paper">{postalAddress(lang)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/65">{c.fieldServes}</dt>
                    <dd className="font-medium text-paper">{company.serves[lang]}</dd>
                  </div>
                  {/* Shown when there is one. "Tilføjes snarest" against a CVR
                      number reads, to somebody about to order 120 machines, as a
                      company that does not exist yet. */}
                  {company.cvr && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/65">{c.fieldCvr}</dt>
                      <dd className="font-medium text-paper">
                        {company.cvr}
                        {company.legalForm ? ` · ${company.legalForm}` : ""}
                      </dd>
                    </div>
                  )}
                  {company.openingHours[lang] && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/65">{c.fieldHours}</dt>
                      <dd className="text-right font-medium text-paper">
                        {company.openingHours[lang]}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.briefTitle}
            </h2>
            <p className="mt-4 text-base leading-[1.75] text-paper/75">{c.briefBody}</p>
          </div>
          {/* Parallel items, so plates rather than hairline rows. */}
          <ul className="mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[c.brief1, c.brief2, c.brief3, c.brief4, c.brief5, c.brief6].map((item) => (
              <li key={item} className="plate flex gap-3 p-5 text-base leading-7 text-paper/75">
                <Check
                  aria-hidden="true"
                  className="mt-1.5 h-4 w-4 flex-none text-brand-300"
                  strokeWidth={2}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq
        lang={lang}
        items={contactFaqs}
        title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }}
        contactLink={false}
      />

      {/* Each answer above points somewhere that says it at length. */}
      <RelatedLinks
        lang={lang}
        links={[
          {
            href: "/vejledninger/windows-10-support-slutter",
            label: { da: "Windows 10-supporten er slut", en: "Windows 10 support has ended" },
          },
          {
            href: "/vejledninger/slet-data-foer-du-saelger",
            label: { da: "Sådan sletter I data først", en: "How to erase the data first" },
          },
          { href: "/saelg-til-os", label: { da: "Sælg jeres udstyr", en: "Sell your equipment" } },
          { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
          {
            href: "/privatlivspolitik",
            label: { da: "Privatlivspolitik", en: "Privacy policy" },
          },
        ]}
      />

      <FactNote lang={lang} ids={contactSources} />
    </>
  );
}

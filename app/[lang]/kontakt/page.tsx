import type { Metadata } from "next";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import ContactFlipCard from "@/components/ContactFlipCard";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, postalAddress } from "@/lib/company";
import { metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import Faq, { type FaqItem } from "@/components/Faq";
import FactNote from "@/components/FactNote";
import RelatedLinks from "@/components/RelatedLinks";
import type { SourceId } from "@/lib/sources";

const copy = {
  da: {
    metaTitle: "Kontakt os i Aarhus | Kestro",
    metaDescription:
      "Skriv til os om et indkøb, en flåde eller udstyr, I skal af med. Vi svarer inden for én arbejdsdag – og vi sælger ikke til jer i mellemtiden.",
    title: "Kontakt os",
    /* Answer first: how to reach us, how fast, and to where — the three things
       a person landing here wants, before any of the context below. */
    description: `Skriv via formularen herunder eller direkte til ${company.email}. I får svar inden for én arbejdsdag fra den, der skriver tilbuddet. Vi leverer i Danmark og Norge, og der er intet minimumsantal.`,
    emailTitle: "Foretrækker du email?",
    emailBody: "Skriv direkte til os, så vender vi tilbage hurtigst muligt.",
    companyTitle: "Virksomhedsoplysninger",
    fieldCompany: "Virksomhed",
    fieldPhone: "Telefon",
    fieldEmail: "Email",
    fieldAddress: "Adresse",
    fieldServes: "Leverer i",
    fieldCvr: "CVR",
    fieldHours: "Åbningstider",
    at: "hos",
    briefTitle: "Hvad skal der stå i beskeden?",
    briefBody:
      "Antal, type og tidsramme er det vigtigste. Jo mere af listen herunder beskeden har med, jo færre spørgsmål skal vi stille tilbage, før I får et forslag.",
    brief1: "Antal enheder – også hvis det er et skøn.",
    brief2: "Type: bærbar, stationær, mini-pc, skærm, dockingstation eller andet.",
    brief3: "Krav til processor, hukommelse (RAM) og lagerplads, hvis I har dem.",
    brief4: "Tastaturlayout – dansk eller norsk – og hvilket land der skal leveres til.",
    brief5: "Hvornår udstyret skal stå klar.",
    brief6: "Skal I også af med gammelt udstyr: hvor mange enheder, og om I skal bruge dokumentation for datasletning.",
    faqTitle: "Spørgsmål, før I skriver",
  },
  en: {
    metaTitle: "Contact us in Aarhus | Kestro",
    metaDescription:
      "Write to us about a purchase, a fleet, or equipment you need to move on. We reply within one working day, and we do not chase you in between.",
    title: "Contact us",
    description: `Write through the form below or directly to ${company.email}. You get a reply within one working day from the person who writes the quote. We deliver in Denmark and Norway, and there is no minimum order.`,
    emailTitle: "Prefer email?",
    emailBody: "Write to us directly and we will come back to you as soon as we can.",
    companyTitle: "Company details",
    fieldCompany: "Company",
    fieldPhone: "Phone",
    fieldEmail: "Email",
    fieldAddress: "Address",
    fieldServes: "Delivers in",
    fieldCvr: "VAT no. (CVR)",
    fieldHours: "Opening hours",
    at: "at",
    briefTitle: "What should the message say?",
    briefBody:
      "Quantity, type and timing matter most. The more of the list below the message covers, the fewer questions we have to ask back before you get a proposal.",
    brief1: "Number of devices — an estimate is fine.",
    brief2: "Type: laptop, desktop, mini PC, monitor, docking station or something else.",
    brief3: "Requirements for processor, memory (RAM) and storage, if you have them.",
    brief4: "Keyboard layout — Danish or Norwegian — and which country it is going to.",
    brief5: "When the equipment needs to be ready.",
    brief6: "If you also have old equipment to move on: how many devices, and whether you need documentation of data erasure.",
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
      da: "Inden for én arbejdsdag. Beskeden lander hos den, der skriver tilbuddet – ikke i en supportkø – så svaret kommer fra en, der kan svare på det, I spørger om.",
      en: "Within one working day. The message lands with the person who writes the quote — not in a support queue — so the answer comes from someone who can answer what you asked.",
    },
  },
  {
    question: {
      da: "Er der et minimumsantal enheder?",
      en: "Is there a minimum number of devices?",
    },
    answer: {
      da: "Nej. Vi leverer fra en enkelt maskine til indkøb til hele teams og virksomheder i Danmark og Norge.",
      en: "No. We deliver anything from a single machine to purchases for whole teams and companies in Denmark and Norway.",
    },
  },
  {
    question: {
      da: "Vi kører stadig Windows 10 – hvad skal vi skrive?",
      en: "We still run Windows 10 — what should we write?",
    },
    answer: {
      da: "Antal maskiner og modelnavne. Ifølge Microsoft sluttede supporten for Windows 10 den 14. oktober 2025, og om en maskine kan opgraderes til Windows 11, afgøres bl.a. af TPM 2.0 og Secure Boot. Med listen kan vi sige, hvilke maskiner der kan opgraderes, og hvilke der bedre kan betale sig at skifte. Computerne på vores modelsider leveres med Windows 11 installeret.",
      en: "The number of machines and their model names. According to Microsoft, Windows 10 support ended on 14 October 2025, and whether a machine can move to Windows 11 is decided by TPM 2.0 and Secure Boot among other things. With the list we can tell you which machines can be upgraded and which are better replaced. The computers on our model pages are delivered with Windows 11 installed.",
    },
  },
  {
    question: {
      da: "Vi skal af med gamle maskiner – hvad sker der med data?",
      en: "We have old machines to move on — what happens to the data?",
    },
    answer: {
      da: "Lagermedierne slettes, før enhederne klargøres til videresalg. Skal I bruge dokumentation for sletningen til jeres egne GDPR-procedurer, så skriv det i beskeden. NIST, den amerikanske standardiseringsmyndighed, skelner mellem tre niveauer af sletning – Clear, Purge og Destroy – og det er en god idé at aftale, hvilket I har brug for.",
      en: "The storage is erased before the devices are prepared for resale. If you need documentation of the erasure for your own GDPR procedures, say so in the message. NIST, the US standards body, distinguishes three levels of erasure — Clear, Purge and Destroy — and it is worth agreeing which one you need.",
    },
  },
  {
    question: {
      da: "Hvad sker der med de oplysninger, jeg sender?",
      en: "What happens to the details I send?",
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
              <div className="plate p-6 sm:p-8">
                <ContactForm lang={lang} />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <ContactFlipCard lang={lang} />

              <div className="plate p-6 sm:p-8">
                <h2 className="text-base font-semibold text-paper">{c.emailTitle}</h2>
                <p className="mt-2 text-sm leading-[1.6] text-paper/65">{c.emailBody}</p>
                <CopyEmailButton lang={lang} />
              </div>

              <div className="plate p-6 sm:p-8">
                <h2 className="text-base font-semibold text-paper">{c.companyTitle}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/55">{c.fieldCompany}</dt>
                    <dd className="font-medium text-paper">{company.name}</dd>
                  </div>
                  {company.phoneDisplay && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/55">{c.fieldPhone}</dt>
                      <dd className="font-medium text-paper">{company.phoneDisplay}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/55">{c.fieldEmail}</dt>
                    <dd className="font-medium text-paper">{company.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/55">{c.fieldAddress}</dt>
                    <dd className="text-right font-medium text-paper">{postalAddress(lang)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-paper/55">{c.fieldServes}</dt>
                    <dd className="font-medium text-paper">{company.serves[lang]}</dd>
                  </div>
                  {/* Shown when there is one. "Tilføjes snarest" against a CVR
                      number reads, to somebody about to order 120 machines, as a
                      company that does not exist yet. */}
                  {company.cvr && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/55">{c.fieldCvr}</dt>
                      <dd className="font-medium text-paper">
                        {company.cvr}
                        {company.legalForm ? ` · ${company.legalForm}` : ""}
                      </dd>
                    </div>
                  )}
                  {company.openingHours[lang] && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-paper/55">{c.fieldHours}</dt>
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
            <p className="mt-4 text-base leading-[1.75] text-paper/65">{c.briefBody}</p>
          </div>
          {/* Parallel items, so plates rather than hairline rows. */}
          <ul className="mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[c.brief1, c.brief2, c.brief3, c.brief4, c.brief5, c.brief6].map((item) => (
              <li key={item} className="plate flex gap-3 p-5 text-base leading-7 text-paper/75">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-brand-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq lang={lang} items={contactFaqs} title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }} />

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

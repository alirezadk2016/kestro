import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactFlipCard from "@/components/ContactFlipCard";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, postalAddress } from "@/lib/company";
import { metaFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Kontakt os i Aarhus | Kestro",
    metaDescription:
      "Skriv til os om et indkøb, en flåde eller udstyr, I skal af med. Vi svarer inden for én arbejdsdag – og vi sælger ikke til jer i mellemtiden.",
    title: "Kontakt os",
    description:
      "Fortæl os om jeres behov, og få et uforpligtende tilbud på renoveret erhvervshardware klargjort til det nordiske marked.",
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
  },
  en: {
    metaTitle: "Contact us in Aarhus | Kestro",
    metaDescription:
      "Write to us about a purchase, a fleet, or equipment you need to move on. We reply within one working day, and we do not chase you in between.",
    title: "Contact us",
    description:
      "Tell us what you need and get a no-obligation quote on refurbished business hardware prepared for the Nordic market.",
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
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/kontakt", params.lang),
  };
}

export default function KontaktPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <section className="py-10 sm:py-20">
      <Container>
        <PageHeader
          title={c.title}
          description={c.description}
          lang={lang}
          href="/kontakt"
          crumb={lang === "da" ? "Kontakt" : "Contact"}
        />

        <div className="mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <ContactForm lang={lang} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <ContactFlipCard lang={lang} />

            <div className="border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-base font-semibold text-paper">{c.emailTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-paper/65">{c.emailBody}</p>
              <CopyEmailButton lang={lang} />
            </div>

            <div className="border border-white/10 bg-white/[0.04] p-6 sm:p-8">
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
  );
}

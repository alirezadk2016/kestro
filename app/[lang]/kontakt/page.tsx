import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import TeamAvatar from "@/components/TeamAvatar";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, postalAddress, salesContact } from "@/lib/company";
import { alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Kontakt | Kestro",
    metaDescription:
      "Kontakt Kestro for et uforpligtende tilbud på renoveret IT-hardware klargjort til det nordiske marked.",
    title: "Kontakt os",
    description:
      "Fortæl os om jeres behov, og få et uforpligtende tilbud på renoveret erhvervshardware klargjort til det nordiske marked.",
    callDirect: "Ring direkte til",
    writeDirect: "Skriv direkte til",
    busy: "Har I travlt, eller er det nemmere at tage det over telefonen?",
    lands:
      "Beskeden lander hos den, der skriver tilbuddet – ikke i en supportkø. I får svar inden for én arbejdsdag.",
    mainNumber: "Hovednummer",
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
    metaTitle: "Contact | Kestro",
    metaDescription:
      "Contact Kestro for a no-obligation quote on refurbished IT hardware prepared for the Nordic market.",
    title: "Contact us",
    description:
      "Tell us what you need and get a no-obligation quote on refurbished business hardware prepared for the Nordic market.",
    callDirect: "Call",
    writeDirect: "Write directly to",
    busy: "In a hurry, or easier to sort it out over the phone?",
    lands:
      "Your message lands with the person who writes the quote, not in a support queue. You get an answer within one working day.",
    mainNumber: "Main number",
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
    alternates: alternatesFor("/kontakt", params.lang),
  };
}

export default function KontaktPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <section className="py-14 sm:py-24">
      <Container>
        <PageHeader title={c.title} description={c.description} />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="border border-paper-edge bg-white p-6 sm:p-8">
              <ContactForm lang={lang} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="border border-paper-edge bg-brand-950 p-6 text-white sm:p-8">
              <div className="flex items-center gap-4">
                <TeamAvatar member={salesContact} lang={lang} size={64} className="h-16 w-16" />
                <div>
                  {/* Without a number the card used to read "Call us" over a
                      question about phoning, and then render no button at all.
                      Same person, same card — it just says what actually
                      happens when you use the form beside it. */}
                  <h2 className="text-base font-semibold">
                    {salesContact.phoneHref ? c.callDirect : c.writeDirect} {salesContact.name}
                  </h2>
                  <p className="text-sm text-ink-400">{salesContact.role[lang]}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-ink-300">
                {salesContact.phoneHref ? c.busy : c.lands}
              </p>

              {/* A direct line when there is one; otherwise the card sends
                  people to the form and the address, which do work. */}
              {(salesContact.phoneHref || company.phoneHref) && (
                <a
                  href={`tel:${salesContact.phoneHref || company.phoneHref}`}
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-ink-900 transition hover:bg-paper-dim sm:w-auto"
                >
                  <Phone className="h-5 w-5" strokeWidth={2} />
                  {salesContact.phoneDisplay || company.phoneDisplay}
                </a>
              )}

              {salesContact.phoneHref && company.phoneDisplay && (
                <p className="mt-4 border-t border-white/10 pt-4 text-xs text-ink-400">
                  {c.mainNumber}: {company.phoneDisplay}
                </p>
              )}
            </div>

            <div className="border border-paper-edge bg-paper-dim p-6 sm:p-8">
              <h2 className="text-base font-semibold text-ink-900">{c.emailTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{c.emailBody}</p>
              <CopyEmailButton lang={lang} />
            </div>

            <div className="border border-paper-edge bg-white p-6 sm:p-8">
              <h2 className="text-base font-semibold text-ink-900">{c.companyTitle}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldCompany}</dt>
                  <dd className="font-medium text-ink-900">{company.name}</dd>
                </div>
                {company.phoneDisplay && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">{c.fieldPhone}</dt>
                    <dd className="font-medium text-ink-900">{company.phoneDisplay}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldEmail}</dt>
                  <dd className="font-medium text-ink-900">{company.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldAddress}</dt>
                  <dd className="text-right font-medium text-ink-900">{postalAddress(lang)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldServes}</dt>
                  <dd className="font-medium text-ink-900">{company.serves[lang]}</dd>
                </div>
                {/* Shown when there is one. "Tilføjes snarest" against a CVR
                    number reads, to somebody about to order 120 machines, as a
                    company that does not exist yet. */}
                {company.cvr && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">{c.fieldCvr}</dt>
                    <dd className="font-medium text-ink-900">
                      {company.cvr}
                      {company.legalForm ? ` · ${company.legalForm}` : ""}
                    </dd>
                  </div>
                )}
                {company.openingHours[lang] && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">{c.fieldHours}</dt>
                    <dd className="text-right font-medium text-ink-900">
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

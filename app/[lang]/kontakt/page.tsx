import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, team } from "@/lib/company";
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
    busy: "Har I travlt, eller er det nemmere at tage det over telefonen?",
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
    cvrPending: "Tilføjes snarest",
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
    busy: "In a hurry, or easier to sort it out over the phone?",
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
    cvrPending: "Added shortly",
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
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <PageHeader
          title={c.title}
          description={c.description}
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="border border-paper-edge bg-white p-6 sm:p-8">
              <ContactForm lang={lang} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="border border-paper-edge bg-ink-950 p-6 text-white sm:p-8">
              <div className="flex items-center gap-4">
                <Image
                  src={team[0].photo}
                  alt={`${team[0].name}, ${team[0].role[lang]} ${c.at} Kestro`}
                  width={112}
                  height={112}
                  className="h-16 w-16 flex-shrink-0 rounded-full object-cover object-top"
                />
                <div>
                  <h2 className="text-base font-semibold">{c.callDirect} {team[0].name}</h2>
                  <p className="text-sm text-ink-400">{team[0].role[lang]}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-ink-300">{c.busy}</p>

              <a
                href={`tel:${team[0].phoneHref}`}
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-ink-900 transition hover:bg-paper-dim sm:w-auto"
              >
                <Phone className="h-5 w-5" strokeWidth={2} />
                {team[0].phoneDisplay}
              </a>

              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-ink-400">
                {c.mainNumber}: {company.phoneDisplay}
              </p>
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
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldPhone}</dt>
                  <dd className="font-medium text-ink-900">{company.phoneDisplay}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldEmail}</dt>
                  <dd className="font-medium text-ink-900">{company.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldAddress}</dt>
                  <dd className="font-medium text-ink-900">{company.locationShort[lang]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldServes}</dt>
                  <dd className="font-medium text-ink-900">{company.serves[lang]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">{c.fieldCvr}</dt>
                  <dd className="font-medium italic text-ink-400">{c.cvrPending}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

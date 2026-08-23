import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";
import PageHeader from "@/components/PageHeader";
import { company, team } from "@/lib/company";

export const metadata: Metadata = {
  title: "Kontakt | Kestro",
  description:
    "Kontakt Kestro for et uforpligtende tilbud på renoveret IT-hardware klargjort til det nordiske marked.",
};

export default function KontaktPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <PageHeader
          title="Kontakt os"
          description="Fortæl os om jeres behov, og få et uforpligtende tilbud på renoveret erhvervshardware klargjort til det nordiske marked."
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white sm:p-8">
              <div className="flex items-center gap-4">
                <Image
                  src={team[0].photo}
                  alt={`${team[0].name}, ${team[0].role} hos Kestro`}
                  width={112}
                  height={112}
                  className="h-16 w-16 flex-shrink-0 rounded-full object-cover object-top"
                />
                <div>
                  <h2 className="text-base font-semibold">Ring direkte til {team[0].name}</h2>
                  <p className="text-sm text-slate-400">{team[0].role}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Har I travlt, eller er det nemmere at tage det over telefonen?
              </p>

              <a
                href={`tel:${team[0].phoneHref}`}
                className="mt-4 inline-flex items-center gap-2 text-lg font-bold transition hover:text-brand-300"
              >
                <Phone className="h-5 w-5" strokeWidth={2} />
                {team[0].phoneDisplay}
              </a>

              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-400">
                Hovednummer: {company.phoneDisplay}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-base font-semibold text-slate-900">Foretrækker du email?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Skriv direkte til os, så vender vi tilbage hurtigst muligt.
              </p>
              <CopyEmailButton />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-base font-semibold text-slate-900">Virksomhedsoplysninger</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Virksomhed</dt>
                  <dd className="font-medium text-slate-900">{company.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Telefon</dt>
                  <dd className="font-medium text-slate-900">{company.phoneDisplay}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-medium text-slate-900">{company.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Adresse</dt>
                  <dd className="font-medium text-slate-900">{company.locationShort}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Leverer i</dt>
                  <dd className="font-medium text-slate-900">{company.serves}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">CVR</dt>
                  <dd className="font-medium italic text-slate-400">Tilføjes snarest</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt | Kestro",
  description:
    "Kontakt Kestro for et uforpligtende tilbud på renoveret IT-hardware klargjort til det nordiske marked.",
};

export default function KontaktPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Kontakt os</h1>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Fortæl os om jeres behov, og få et uforpligtende tilbud på renoveret erhvervshardware
            klargjort til det nordiske marked.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-base font-semibold text-slate-900">Foretrækker du email?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Skriv direkte til os, så vender vi tilbage hurtigst muligt.
              </p>
              <a
                href="mailto:info@kestro.dk"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                info@kestro.dk
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:p-8">
              <h2 className="text-base font-semibold text-slate-900">Virksomhedsoplysninger</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Virksomhed</dt>
                  <dd className="font-medium text-slate-900">Kestro</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">CVR</dt>
                  <dd className="font-medium italic text-slate-400">Tilføjes snarest</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Adresse</dt>
                  <dd className="font-medium italic text-slate-400">Tilføjes snarest</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-slate-400">
                Fulde virksomhedsoplysninger opdateres her, når CVR-registreringen er på plads.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

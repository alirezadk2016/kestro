import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { models, modelGroups } from "@/lib/models";

export const metadata: Metadata = {
  title: "Modeller vi ofte skaffer | Brugte erhvervscomputere | Kestro",
  description:
    "Oversigt over de modeller, vi oftest bliver bedt om at skaffe – ThinkPad, EliteBook, Latitude, EliteDesk og flere. Specifikationer og hvad de egner sig til. Ikke lagervarer.",
  alternates: { canonical: "/modeller" },
};

export default function ModellerPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Modeller vi ofte skaffer"
            description="En oversigt over de maskiner, vi kender godt og oftest bliver bedt om at finde. Brug den til at blive klogere på, hvad der findes – og til at pege på noget konkret, når I skriver til os."
          />

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Det her er ikke en webshop
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Vi holder ikke lager, og der står ingen priser her. Listen viser modeltyper, ikke
              varer på hylden. Når I ved, hvad I skal bruge, finder vi maskinerne i vores
              leverandørnetværk og vender tilbage med pris, stand, antal og leveringstid.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Står jeres model ikke på listen, betyder det ikke, at vi ikke kan skaffe den. Spørg –
              det er som regel muligt.
            </p>
          </div>

          {modelGroups.map((group) => {
            const groupModels = models.filter((model) => model.group === group.id);
            if (groupModels.length === 0) return null;

            return (
              <div key={group.id} className="mt-14">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {group.name}
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">{group.description}</p>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {groupModels.map((model) => (
                    <li key={model.slug}>
                      <Link
                        href={`/modeller/${model.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:p-6"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {model.brand} · {model.format}
                        </span>
                        <h3 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-brand-700 sm:text-lg">
                          {model.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                          {model.tagline}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                          Se specifikationer
                          <span aria-hidden="true">&rarr;</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

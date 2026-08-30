import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { models, modelGroups } from "@/lib/models";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Modeller vi ofte skaffer | Brugte erhvervscomputere | Kestro",
    metaDescription:
      "De modeller vi oftest skaffer – ThinkPad, EliteBook, Latitude, EliteDesk og flere. Specifikationer og hvad de egner sig til. Ikke lagervarer.",
    title: "Modeller vi ofte skaffer",
    description:
      "En oversigt over de maskiner, vi kender godt og oftest bliver bedt om at finde. Brug den til at blive klogere på, hvad der findes – og til at pege på noget konkret, når I skriver til os.",
    noShopTitle: "Det her er ikke en webshop",
    noShopBody1:
      "Vi holder ikke lager, og der står ingen priser her. Listen viser modeltyper, ikke varer på hylden. Når I ved, hvad I skal bruge, finder vi maskinerne i vores leverandørnetværk og vender tilbage med pris, stand, antal og leveringstid.",
    noShopBody2:
      "Står jeres model ikke på listen, betyder det ikke, at vi ikke kan skaffe den. Spørg – det er som regel muligt.",
    qualityLink: "Sådan vurderer vi stand og kvalitet",
    seeSpecs: "Se specifikationer",
  },
  en: {
    metaTitle: "Models we often source | Used business computers | Kestro",
    metaDescription:
      "The models we are most often asked to source — ThinkPad, EliteBook, Latitude, EliteDesk and more. Specifications and what they suit. Not stock items.",
    title: "Models we often source",
    description:
      "An overview of the machines we know well and are most often asked to find. Use it to get a feel for what exists — and to point at something concrete when you write to us.",
    noShopTitle: "This is not a web shop",
    noShopBody1:
      "We do not hold stock, and there are no prices here. The list shows types of machine, not goods on a shelf. Once you know what you need, we find the machines in our supplier network and come back with price, condition, quantity and lead time.",
    noShopBody2:
      "If your model is not on the list, that does not mean we cannot get it. Ask — usually we can.",
    qualityLink: "How we assess condition and quality",
    seeSpecs: "See specifications",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/modeller", params.lang),
  };
}

export default function ModellerPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="py-14 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />

          <div className="mx-auto mt-10 max-w-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-base font-semibold text-paper">{c.noShopTitle}</h2>
            <p className="mt-2 text-base leading-7 text-paper/65">{c.noShopBody1}</p>
            <p className="mt-3 text-base leading-7 text-paper/65">{c.noShopBody2}</p>
            <Link
              href={localePath("/kvalitet", lang)}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.qualityLink}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {modelGroups.map((group) => {
            const groupModels = models.filter((model) => model.group === group.id);
            if (groupModels.length === 0) return null;

            return (
              <div key={group.id} className="mt-14">
                <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                  {group.name[lang]}
                </h2>
                <p className="mt-2 text-base leading-7 text-paper/65">{group.description[lang]}</p>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {groupModels.map((model) => (
                    <li key={model.slug}>
                      <Link
                        href={localePath(`/modeller/${model.slug}`, lang)}
                        className="group flex h-full flex-col border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-300 hover:border-white/35 sm:p-6"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-paper/55">
                          {model.brand} · {model.format[lang]}
                        </span>
                        <h3 className="mt-2 text-base font-semibold text-paper group-hover:text-paper sm:text-lg">
                          {model.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-paper/65">
                          {model.tagline[lang]}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                          {c.seeSpecs}
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

      <CtaSection lang={lang} />
    </>
  );
}

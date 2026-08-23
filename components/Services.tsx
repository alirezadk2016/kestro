import Link from "next/link";
import { PackageSearch, ShieldCheck, Keyboard, Truck, ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const services = [
  {
    icon: PackageSearch,
    title: { da: "Sourcing & indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi udvælger brugte erhvervscomputere af høj kvalitet fra pålidelige leverandører i Sydeuropa.",
      en: "We pick good used business computers from reliable suppliers in southern Europe.",
    },
  },
  {
    icon: ShieldCheck,
    title: { da: "Klargøring & test", en: "Preparation and testing" },
    description: {
      da: "Hver enhed gennemgår en fuld funktionstest, opgraderes med mere RAM og nulstilles til fabriksstand.",
      en: "Every machine goes through a full function test, gets more memory where needed and is reset to factory state.",
    },
  },
  {
    icon: Keyboard,
    title: { da: "Nordisk tilpasning", en: "Nordic preparation" },
    description: {
      da: "Dansk/nordisk tastaturlayout, sprogopsætning og mærkning – klar til brug fra dag ét.",
      en: "Danish or Norwegian keyboard layout, language setup and labelling — ready to use from day one.",
    },
  },
  {
    icon: Truck,
    title: { da: "Levering til virksomheder", en: "Delivery to companies" },
    description: {
      da: "Fleksible mængder og hurtig B2B-levering til virksomheder i Danmark og Norge.",
      en: "Flexible quantities and quick B2B delivery to companies in Denmark and Norway.",
    },
  },
];

const copy = {
  da: {
    eyebrow: "Processen",
    title: "Fra brugt til klar til brug",
    sub: "Sådan bliver renoveret hardware til en pålidelig del af jeres IT-flåde.",
    link: "Se hele processen",
  },
  en: {
    eyebrow: "The process",
    title: "From used to ready to use",
    sub: "How refurbished hardware becomes a dependable part of your IT fleet.",
    link: "See the whole process",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Services({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {c.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {c.sub}
          </p>
        </div>

        <ol className="relative mt-10 grid grid-cols-1 gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
          {/* Connecting line across the row on large screens */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-slate-300 lg:block"
          />

          {services.map((service, i) => (
            <li key={service.title.da} className="relative flex gap-4 sm:block">
              <div className="relative flex-shrink-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-700 shadow-sm">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>

              <div className="sm:mt-5">
                <h3 className="text-base font-semibold text-slate-900">{service.title[lang]}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{service.description[lang]}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href={localePath("/ydelser", lang)}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-600 hover:text-brand-700"
          >
            {c.link}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

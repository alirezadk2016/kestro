import { RefreshCw, BadgeCheck, PiggyBank, SlidersHorizontal } from "lucide-react";
import Container from "./Container";
import type { Lang } from "@/lib/i18n";

const benefits = [
  {
    icon: RefreshCw,
    title: { da: "Længere levetid", en: "A longer life" },
    description: {
      da: "Renoveret hardware forlænger enhedernes levetid, i stedet for at de kasseres for tidligt.",
      en: "Refurbishing keeps machines in use instead of scrapping them before their time.",
    },
  },
  {
    icon: BadgeCheck,
    title: { da: "Kvalitet & tillid", en: "Quality and trust" },
    description: {
      da: "Alle enheder er funktionstestet og klargjort, så jeres medarbejdere får pålideligt udstyr fra dag ét.",
      en: "Every machine is function-tested and prepared, so your staff get equipment they can rely on from day one.",
    },
  },
  {
    icon: PiggyBank,
    title: { da: "Bedre økonomi", en: "Better economics" },
    description: {
      da: "Få samme ydeevne til en brøkdel af prisen på nyt udstyr – ideelt til større indkøb.",
      en: "The same performance for a fraction of the new price — which matters most on larger purchases.",
    },
  },
  {
    icon: SlidersHorizontal,
    title: { da: "Fleksibilitet", en: "Flexibility" },
    description: {
      da: "Vi tilpasser leverancen til jeres behov i mængde og specifikationer, uden bindinger til fast lager.",
      en: "We match quantity and specification to what you need, without being tied to whatever is in a warehouse.",
    },
  },
];

const copy = {
  da: {
    eyebrow: "Hvorfor Kestro",
    title: "Hvorfor virksomheder vælger Kestro",
    sub: "Vi bygger bro mellem overskudshardware i Sydeuropa og virksomheder i Norden, der ønsker pålidelig IT-hardware uden den høje pris eller miljøbelastning fra nyt udstyr.",
  },
  en: {
    eyebrow: "Why Kestro",
    title: "Why companies choose Kestro",
    sub: "We bridge surplus hardware in southern Europe and companies in the Nordics that want dependable IT without the price or the environmental cost of buying new.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function WhyUs({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              {c.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {c.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {c.sub}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title.da}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 sm:h-10 sm:w-10">
                  <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </span>
                <dt className="mt-3 text-sm font-semibold text-slate-900 sm:mt-4 sm:text-base">
                  {benefit.title[lang]}
                </dt>
                <dd className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  {benefit.description[lang]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

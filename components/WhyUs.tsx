import { RefreshCw, BadgeCheck, PiggyBank, SlidersHorizontal } from "lucide-react";
import Container from "./Container";

const benefits = [
  {
    icon: RefreshCw,
    title: "Længere levetid",
    description:
      "Renoveret hardware forlænger enhedernes levetid, i stedet for at de kasseres for tidligt.",
  },
  {
    icon: BadgeCheck,
    title: "Kvalitet & tillid",
    description:
      "Alle enheder er funktionstestet og klargjort, så jeres medarbejdere får pålideligt udstyr fra dag ét.",
  },
  {
    icon: PiggyBank,
    title: "Bedre økonomi",
    description:
      "Få samme ydeevne til en brøkdel af prisen på nyt udstyr – ideelt til større indkøb.",
  },
  {
    icon: SlidersHorizontal,
    title: "Fleksibilitet",
    description:
      "Vi tilpasser leverancen til jeres behov i mængde og specifikationer, uden bindinger til fast lager.",
  },
];

export default function WhyUs() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Hvorfor Kestro
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Hvorfor virksomheder vælger Kestro
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Vi bygger bro mellem overskudshardware i Sydeuropa og virksomheder i Norden, der
              ønsker pålidelig IT-hardware uden den høje pris eller miljøbelastning fra nyt udstyr.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <benefit.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <dt className="mt-4 text-base font-semibold text-slate-900">{benefit.title}</dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-600">{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

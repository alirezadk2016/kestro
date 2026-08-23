
import Container from "./Container";
import type { Lang } from "@/lib/i18n";

const benefits = [
  {
    title: { da: "Længere levetid", en: "A longer life" },
    description: {
      da: "Renoveret hardware forlænger enhedernes levetid, i stedet for at de kasseres for tidligt.",
      en: "Refurbishing keeps machines in use instead of scrapping them before their time.",
    },
  },
  {
    title: { da: "Kvalitet & tillid", en: "Quality and trust" },
    description: {
      da: "Alle enheder er funktionstestet og klargjort, så jeres medarbejdere får pålideligt udstyr fra dag ét.",
      en: "Every machine is function-tested and prepared, so your staff get equipment they can rely on from day one.",
    },
  },
  {
    title: { da: "Bedre økonomi", en: "Better economics" },
    description: {
      da: "Få samme ydeevne til en brøkdel af prisen på nyt udstyr – ideelt til større indkøb.",
      en: "The same performance for a fraction of the new price — which matters most on larger purchases.",
    },
  },
  {
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
    <section className="bg-brand-950 py-16 text-paper sm:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-300">
              {c.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.75rem,3.5vw,3rem)] font-extrabold leading-[1.03] tracking-display text-paper">
              {c.title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-paper/60">{c.sub}</p>
          </div>

          <dl className="lg:col-span-7">
            {benefits.map((benefit) => (
              <div
                key={benefit.title.da}
                className="grid grid-cols-1 gap-2 border-t border-paper/15 py-6 last:border-b sm:grid-cols-12 sm:gap-8"
              >
                <dt className="font-display text-lg font-bold tracking-tight text-paper sm:col-span-4">
                  {benefit.title[lang]}
                </dt>
                <dd className="text-base leading-7 text-paper/60 sm:col-span-8">
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

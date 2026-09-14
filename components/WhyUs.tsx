import Container from "./Container";
import type { Lang } from "@/lib/i18n";

const benefits = [
  {
    title: { da: "Maskiner der bliver i brug", en: "Machines that stay in use" },
    description: {
      da: "Vi køber maskiner, der stadig kan arbejde, og sætter dem i drift igen i stedet for at de bliver skiftet ud efter tre år.",
      en: "We buy machines that can still do the work and put them back into service, rather than seeing them replaced after three years.",
    },
  },
  {
    title: { da: "Kvalitet & tillid", en: "Quality and trust" },
    description: {
      da: "Vi funktionstester og klargør maskinerne, før de sendes videre, og oplyser stand og batteritilstand skriftligt, før I bestiller.",
      en: "We function-test and prepare the machines before they go on, and put condition and battery state in writing before you order.",
    },
  },
  {
    title: { da: "Prisen ligger fast, før I bestiller", en: "The price is fixed before you order" },
    description: {
      da: "I får en pris per maskine i tilbuddet og kan holde den op mod et tilsvarende nyt indkøb. Vi regner ikke med besparelser, I ikke kan efterprøve.",
      en: "You get a price per machine in the quote and can hold it against a comparable new purchase. We do not quote savings you cannot check.",
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
    sub: "Vi køber brugt erhvervshardware i Sydeuropa, klargør det til nordisk brug og leverer det til virksomheder i Danmark og Norge.",
  },
  en: {
    eyebrow: "Why Kestro",
    title: "Why companies choose Kestro",
    sub: "We buy used business hardware in southern Europe, prepare it for Nordic use and deliver it to companies in Denmark and Norway.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function WhyUs({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="lit bg-brand-950 py-14 text-paper sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-[1.75] text-paper/65">{c.sub}</p>
        </div>

        {/* Parallel claims, not a sequence: plates on a phone, columns from
            sm where the row is already a row. */}
        <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0 sm:border-t sm:border-paper/15">
          {benefits.map((benefit) => (
            <div
              key={benefit.title.da}
              className="plate p-5 sm:border-b sm:border-paper/10 sm:bg-none sm:p-0 sm:py-6 sm:shadow-none"
            >
              <dt className="font-display text-base font-bold tracking-tight text-paper sm:text-lg">
                {benefit.title[lang]}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-paper/65 sm:text-base sm:leading-7">
                {benefit.description[lang]}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

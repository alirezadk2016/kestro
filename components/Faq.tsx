import Container from "./Container";

export type FaqItem = { question: string; answer: string };

const defaultFaqs: FaqItem[] = [
  {
    question: "Hvordan bestiller vi hos Kestro?",
    answer:
      "I kontakter os via formularen eller på info@kestro.dk og fortæller om jeres behov – antal enheder, specifikationer og tidsramme. Derefter finder vi de enheder, der matcher, og aftaler pris og levering direkte med jer.",
  },
  {
    question: "Hvor lang er leveringstiden?",
    answer:
      "Vi sourcer enheder per ordre i stedet for at holde fast lager, så leveringstiden afhænger af den konkrete bestilling. Vi oplyser en tidsramme, så snart vi kender omfanget.",
  },
  {
    question: "Hvilken garanti følger med?",
    answer:
      "Garantivilkår aftaler vi ud fra bestillingens omfang og enhedstype – vi går igennem det, når vi har talt om jeres behov.",
  },
  {
    question: "Er der et minimumsantal enheder?",
    answer:
      "Nej. Vi tilpasser leverancen fra enkelte enheder til større indkøb til hele teams eller virksomheder.",
  },
  {
    question: "Leverer I til hele Danmark og Norge?",
    answer: "Ja, vi leverer til virksomheder i hele Danmark og Norge.",
  },
];

export default function Faq({
  items = defaultFaqs,
  title = "Ofte stillede spørgsmål",
}: {
  items?: FaqItem[];
  title?: string;
}) {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        </div>

        <dl className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 border-t border-slate-200 sm:mt-12">
          {items.map((faq) => (
            <div key={faq.question} className="py-6">
              <dt className="text-base font-semibold text-slate-900">{faq.question}</dt>
              <dd className="mt-2 text-base leading-7 text-slate-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

import Container from "./Container";

const benefits = [
  {
    title: "Længere levetid",
    description:
      "Renoveret hardware forlænger enhedernes levetid, i stedet for at de kasseres for tidligt.",
  },
  {
    title: "Kvalitet & tillid",
    description:
      "Alle enheder er funktionstestet og klargjort, så jeres medarbejdere får pålideligt udstyr fra dag ét.",
  },
  {
    title: "Bedre økonomi",
    description:
      "Få samme ydeevne til en brøkdel af prisen på nyt udstyr – ideelt til større indkøb.",
  },
  {
    title: "Fleksibilitet",
    description:
      "Vi tilpasser leverancen til jeres behov i mængde og specifikationer, uden bindinger til fast lager.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Hvorfor virksomheder vælger Kestro
            </h2>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Vi bygger bro mellem overskudshardware i Sydeuropa og virksomheder i Norden, der
              ønsker pålidelig IT-hardware uden den høje pris eller miljøbelastning fra nyt udstyr.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <dt className="text-base font-semibold text-slate-900">{benefit.title}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Gauge, Recycle, Building2, Rocket } from "lucide-react";
import Container from "./Container";

const situations = [
  {
    icon: Gauge,
    question: "Har I computere, der er blevet for langsomme?",
    answer:
      "Ofte er det ét batteri, for lidt RAM eller en langsom disk. Vi opgraderer i stedet for at udskifte – og siger det ærligt, hvis det ikke kan betale sig.",
    href: "/reparation",
    linkLabel: "Se opgradering",
  },
  {
    icon: Recycle,
    question: "Står I med udstyr, I skal af med?",
    answer:
      "Vi køber brugte erhvervsmaskiner, henter dem og sletter alle data, før de får et nyt liv. I får en vurdering, før I beslutter jer.",
    href: "/saelg-til-os",
    linkLabel: "Få en vurdering",
  },
  {
    icon: Building2,
    question: "Skal I købe ind til flere medarbejdere?",
    answer:
      "Fra ti maskiner til hele flåden. Samme konfiguration hele vejen rundt, de specifikationer opgaven kræver, og mulighed for at bytte det gamle ind.",
    href: "/flaadeloesninger",
    linkLabel: "Se flådeløsninger",
  },
  {
    icon: Rocket,
    question: "Skal en ny virksomhed sættes op fra bunden?",
    answer:
      "Skal arbejdspladserne stå klar til første arbejdsdag, hjælper vi med at vælge udstyret, klargøre det og få det leveret samlet.",
    href: "/kontakt",
    linkLabel: "Tal med os om opstart",
  },
];

export default function QualifySection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Hvor står I?
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Genkender I én af disse?
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Vi er specialister i at koble virksomheder sammen med de rigtige leverandører – dem der
            leverer professionel kvalitet til en fornuftig pris. I slipper for at lede, forhandle og
            vurdere. Det er vores arbejde.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {situations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <h3 className="mt-5 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                {item.question}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.answer}</p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                {item.linkLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-slate-500">
          Passer jeres situation ikke helt ind i én af kasserne?{" "}
          <Link href="/kontakt" className="font-semibold text-brand-700 hover:text-brand-800">
            Skriv til os
          </Link>{" "}
          – de fleste henvendelser starter med et spørgsmål, ikke en bestilling.
        </p>
      </Container>
    </section>
  );
}

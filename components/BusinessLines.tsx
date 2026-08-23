import Link from "next/link";
import { ShoppingCart, Recycle, Wrench } from "lucide-react";
import Container from "./Container";

const lines = [
  {
    icon: ShoppingCart,
    title: "Køb renoveret udstyr",
    description:
      "Bærbare, stationære, tablets, telefoner og tilbehør – sourcet og klargjort til jeres behov.",
    href: "/produkter",
    linkLabel: "Se produkter",
  },
  {
    icon: Recycle,
    title: "Sælg jeres brugte udstyr",
    description:
      "Skal I udskifte medarbejdernes maskiner? Vi køber brugt erhvervsudstyr og sletter data sikkert.",
    href: "/saelg-til-os",
    linkLabel: "Få en vurdering",
  },
  {
    icon: Wrench,
    title: "Reparation og opgradering",
    description:
      "Batteri, RAM, SSD, skærm eller fejlfinding – for private og mindre virksomheder.",
    href: "/reparation",
    linkLabel: "Se værkstedet",
  },
];

export default function BusinessLines() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Hvad kan vi hjælpe med?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Vi arbejder med IT-udstyr hele vejen rundt – køb, salg og reparation.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {lines.map((line) => (
            <Link
              key={line.href}
              href={line.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <line.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                {line.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{line.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {line.linkLabel}
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

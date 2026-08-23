import Link from "next/link";
import { ShoppingCart, Recycle, Wrench, ArrowRight } from "lucide-react";
import Container from "./Container";

const lines = [
  {
    icon: ShoppingCart,
    title: "Køb renoveret udstyr",
    description:
      "Bærbare, stationære, tablets, telefoner og tilbehør – sourcet og klargjort til jeres behov.",
    href: "/produkter",
    linkLabel: "Se produkter",
    featured: true,
  },
  {
    icon: Recycle,
    title: "Sælg jeres brugte udstyr",
    description:
      "Skal I udskifte medarbejdernes maskiner? Vi køber brugt erhvervsudstyr og sletter data sikkert.",
    href: "/saelg-til-os",
    linkLabel: "Få en vurdering",
    featured: false,
  },
  {
    icon: Wrench,
    title: "Reparation og opgradering",
    description:
      "Batteri, RAM, SSD, skærm eller fejlfinding – for private og mindre virksomheder.",
    href: "/reparation",
    linkLabel: "Se værkstedet",
    featured: false,
  },
];

export default function BusinessLines() {
  return (
    <section className="bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Vores ydelser
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Hvad kan vi hjælpe med?
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Vi arbejder med IT-udstyr hele vejen rundt – køb, salg og reparation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {lines.map((line) => (
            <Link
              key={line.href}
              href={line.href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 transition sm:p-8 ${
                line.featured
                  ? "bg-slate-900 text-white shadow-lg hover:bg-slate-800"
                  : "border border-slate-200 bg-white shadow-sm hover:border-brand-300 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  line.featured ? "bg-white/10 text-white" : "bg-brand-50 text-brand-700"
                }`}
              >
                <line.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>

              <h3
                className={`mt-5 text-lg font-semibold ${
                  line.featured ? "text-white" : "text-slate-900 group-hover:text-brand-700"
                }`}
              >
                {line.title}
              </h3>

              <p
                className={`mt-2 flex-1 text-sm leading-6 ${
                  line.featured ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {line.description}
              </p>

              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                  line.featured ? "text-white" : "text-brand-700"
                }`}
              >
                {line.linkLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

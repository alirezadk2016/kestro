import Link from "next/link";
import { PackageSearch, ShieldCheck, Keyboard, Truck, ArrowRight } from "lucide-react";
import Container from "./Container";

const services = [
  {
    icon: PackageSearch,
    title: "Sourcing & indkøb",
    description:
      "Vi udvælger brugte erhvervscomputere af høj kvalitet fra pålidelige leverandører i Sydeuropa.",
  },
  {
    icon: ShieldCheck,
    title: "Klargøring & test",
    description:
      "Hver enhed gennemgår en fuld funktionstest, opgraderes med mere RAM og nulstilles til fabriksstand.",
  },
  {
    icon: Keyboard,
    title: "Nordisk tilpasning",
    description:
      "Dansk/nordisk tastaturlayout, sprogopsætning og mærkning – klar til brug fra dag ét.",
  },
  {
    icon: Truck,
    title: "Levering til virksomheder",
    description:
      "Fleksible mængder og hurtig B2B-levering til virksomheder i Danmark og Norge.",
  },
];

export default function Services() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Processen
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fra brugt til klar til brug
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Sådan bliver renoveret hardware til en pålidelig del af jeres IT-flåde.
          </p>
        </div>

        <ol className="relative mt-10 grid grid-cols-1 gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
          {/* Connecting line across the row on large screens */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-slate-300 lg:block"
          />

          {services.map((service, i) => (
            <li key={service.title} className="relative flex gap-4 sm:block">
              <div className="relative flex-shrink-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-700 shadow-sm">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>

              <div className="sm:mt-5">
                <h3 className="text-base font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href="/ydelser"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-600 hover:text-brand-700"
          >
            Se hele processen
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

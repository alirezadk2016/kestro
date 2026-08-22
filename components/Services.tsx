import Link from "next/link";
import Container from "./Container";

const services = [
  {
    title: "Sourcing & indkøb",
    description:
      "Vi udvælger brugte erhvervscomputere af høj kvalitet fra pålidelige leverandører i Sydeuropa.",
  },
  {
    title: "Klargøring & test",
    description:
      "Hver enhed gennemgår en fuld funktionstest, opgraderes med mere RAM og nulstilles til fabriksstand.",
  },
  {
    title: "Nordisk tilpasning",
    description:
      "Dansk/nordisk tastaturlayout, sprogopsætning og mærkning – klar til brug fra dag ét.",
  },
  {
    title: "Levering til virksomheder",
    description:
      "Fleksible mængder og hurtig B2B-levering til virksomheder i Danmark og Norge.",
  },
];

export default function Services() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fra brugt til klar til brug
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Sådan bliver renoveret hardware til en pålidelig del af jeres IT-flåde.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ydelser"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Se alle ydelser
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

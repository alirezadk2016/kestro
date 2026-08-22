import Link from "next/link";
import Container from "./Container";

export default function CtaSection() {
  return (
    <section className="bg-slate-900 py-20 sm:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Klar til at opgradere jeres IT-flåde?
        </h2>
        <p className="max-w-xl text-base leading-7 text-slate-400">
          Fortæl os om jeres behov, og få et uforpligtende tilbud på renoveret erhvervshardware
          klargjort til det nordiske marked.
        </p>
        <Link
          href="/kontakt"
          className="mt-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
        >
          Kontakt os i dag
        </Link>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-20 lg:py-24">
      {/* Soft brand glow for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Lad os finde den rigtige løsning til jer
        </h2>
        <p className="max-w-xl text-base leading-7 text-slate-400">
          Fortæl os om jeres situation, så vender vi tilbage med et konkret oplæg – uforpligtende og
          uden salgstale.
        </p>

        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/kontakt"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition hover:bg-brand-500"
          >
            Book en samtale
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
          <Link
            href="/flaadeloesninger"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Se flådeløsninger
          </Link>
        </div>
      </Container>
    </section>
  );
}

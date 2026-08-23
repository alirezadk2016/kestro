import Link from "next/link";
import Container from "./Container";
import CopyEmailButton from "./CopyEmailButton";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="opacity-0 motion-safe:animate-fade-up motion-reduce:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            B2B IT-hardware · Klar til det nordiske marked
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Renoveret IT-hardware,
            <span className="text-brand-600"> klargjort til jeres virksomhed</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Kestro finder kvalitets bærbare og stationære computere fra Sydeuropa, opgraderer og
            funktionstester dem, og klargør hver enhed til det nordiske marked – med dansk/nordisk
            tastatur og opgraderet RAM. Testet og klargjort før levering, til konkurrencedygtige priser.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 opacity-0 motion-safe:animate-fade-up-delayed-2 motion-reduce:opacity-100">
            <Link
              href="/ydelser"
              className="rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Se vores ydelser
            </Link>
            <Link
              href="/kontakt"
              className="rounded-full border border-slate-300 px-7 py-3.5 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Kontakt os
            </Link>
            <CopyEmailButton />
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}

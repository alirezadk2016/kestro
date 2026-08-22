import Link from "next/link";
import Container from "./Container";

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

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md opacity-0 motion-safe:animate-fade-up-delayed motion-reduce:opacity-100 lg:max-w-none">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-brand-100 via-brand-50 to-transparent blur-2xl motion-safe:animate-glow-drift" />
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Enhedsstatus</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Klar til levering
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: "Funktionstest", value: "Bestået" },
                { label: "RAM", value: "Opgraderet" },
                { label: "Tastatur", value: "Nordisk" },
                { label: "Software", value: "Nulstillet" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-500">{row.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-xs uppercase tracking-wide text-slate-400">Pris vs. nyt udstyr</p>
              <p className="mt-1 text-2xl font-bold">Typisk 40–60% under nyprisen</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

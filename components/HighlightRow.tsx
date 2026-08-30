import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * Three panels: what you send us, what we do to a machine, and what a fleet
 * order looks like. The middle one is the argument the whole company rests on
 * — a machine is opened, tested and put back together, not wiped and resold —
 * so it gets the picture that shows it.
 *
 * The step list beside the exploded view is DOM rather than the numbers baked
 * into the source image, for the usual reason: they are in two languages and
 * every one of them is documented on /ydelser.
 */
const steps = [
  {
    n: "01",
    title: { da: "Gennemgang", en: "Inspection" },
    note: { da: "Skærm, tastatur, porte, batteri", en: "Screen, keyboard, ports, battery" },
  },
  {
    n: "02",
    title: { da: "Rens", en: "Cleaning" },
    note: { da: "Indvendigt og udvendigt", en: "Inside and out" },
  },
  {
    n: "03",
    title: { da: "Opgradering", en: "Upgrades" },
    note: { da: "RAM og SSD efter behov", en: "Memory and SSD where needed" },
  },
  {
    n: "04",
    title: { da: "Test", en: "Testing" },
    note: { da: "Under belastning, ikke kun boot", en: "Under load, not just a boot" },
  },
  {
    n: "05",
    title: { da: "Klar til brug", en: "Ready for work" },
    note: { da: "Nordisk tastatur, Windows sat op", en: "Nordic keyboard, Windows set up" },
  },
];

const copy = {
  da: {
    askEyebrow: "Fortæl os, hvad I skal bruge",
    askTitle: "Få en pris\npå jeres opsætning",
    askBody:
      "Antal, specifikation og tidsramme — så finder vi maskinerne og vender tilbage med en pris, I kan regne på.",
    askLink: "Send en forespørgsel",
    refurbEyebrow: "Sådan klargør vi",
    refurbTitle: "Ikke bare rengjort.\nGennemgået.",
    refurbLink: "Se hele processen",
    refurbAlt: "En bærbar computer skilt ad i lag: skærm, tastatur, bundkort og bundplade",
    fleetEyebrow: "Flådeløsninger",
    fleetTitle: "Én leverandør.\nHele jeres IT.",
    fleetBody: "Fra 10 til 500+ enheder, samme opsætning hele vejen rundt.",
    fleetLink: "Se flådeløsninger",
    fleetAlt: "Et lokale med ens klargjorte bærbare computere stillet op på borde",
  },
  en: {
    askEyebrow: "Tell us what you need",
    askTitle: "Get a price\nfor your setup",
    askBody:
      "Quantity, specification and timing — we find the machines and come back with a price you can work with.",
    askLink: "Send an enquiry",
    refurbEyebrow: "How we prepare them",
    refurbTitle: "Not just cleaned.\nGone through.",
    refurbLink: "See the whole process",
    refurbAlt: "A laptop separated into layers: screen, keyboard, mainboard and base plate",
    fleetEyebrow: "Fleet solutions",
    fleetTitle: "One supplier.\nAll your IT.",
    fleetBody: "From 10 to 500+ devices, the same configuration throughout.",
    fleetLink: "See fleet solutions",
    fleetAlt: "A room of identical prepared laptops set out on desks",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function HighlightRow({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-b border-white/10 bg-ink-900 py-12 sm:py-16" data-reveal>
      <Container>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Send us a spec */}
          <div className="flex flex-col justify-between border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:col-span-4">
            <div>
              <span className="eyebrow text-brand-300">{c.askEyebrow}</span>
              <h2 className="mt-4 whitespace-pre-line font-display text-2xl font-extrabold leading-tight tracking-display text-paper sm:text-3xl">
                {c.askTitle}
              </h2>
              <p className="mt-4 text-sm leading-6 text-paper/65">{c.askBody}</p>
            </div>
            <Link
              href={localePath("/flaadeloesninger/forespoergsel", lang)}
              className="group mt-8 inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
            >
              {c.askLink}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>

          {/* How a machine is prepared */}
          <div className="border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:col-span-5">
            <span className="eyebrow text-brand-300">{c.refurbEyebrow}</span>
            <h2 className="mt-4 whitespace-pre-line font-display text-2xl font-extrabold leading-tight tracking-display text-paper sm:text-3xl">
              {c.refurbTitle}
            </h2>

            {/* Side by side only once there is room for it. On a phone the
                render collapsed to a stamp with the steps wrapping every three
                words beside it — stacked, the image is worth looking at and
                the list reads as a list. */}
            <div className="mt-6 flex flex-col gap-5 sm:flex-row">
              <Image
                src="/cards/exploded.webp"
                alt={c.refurbAlt}
                width={200}
                height={250}
                sizes="(min-width: 1024px) 16vw, 40vw"
                className="h-auto w-3/4 max-w-[240px] flex-shrink-0 self-center sm:w-[38%] sm:max-w-[200px]"
              />
              <ol className="min-w-0 flex-1 space-y-3">
                {steps.map((step) => (
                  <li key={step.n} className="flex gap-3">
                    <span className="font-display text-xs font-bold tabular-nums text-brand-300">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-paper">
                        {step.title[lang]}
                      </p>
                      <p className="text-xs leading-5 text-paper/55">{step.note[lang]}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Link
              href={localePath("/ydelser", lang)}
              className="group mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.refurbLink}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>

          {/* Fleet */}
          <Link
            href={localePath("/flaadeloesninger", lang)}
            className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden border border-white/10 p-6 transition hover:border-brand-400/40 sm:p-8 lg:col-span-3"
          >
            <Image
              src="/cards/fleet-scene.webp"
              alt={c.fleetAlt}
              fill
              sizes="(min-width: 1024px) 24vw, 92vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* The picture is a backdrop for the words, so it gets a ramp dark
                enough to read on rather than a flat tint. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,11,22,0.55) 0%, rgba(6,11,22,0.80) 55%, rgba(6,11,22,0.94) 100%)",
              }}
            />
            <div className="relative">
              <span className="eyebrow text-brand-300">{c.fleetEyebrow}</span>
              <h2 className="mt-3 whitespace-pre-line font-display text-2xl font-extrabold leading-tight tracking-display text-paper">
                {c.fleetTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-paper/75">{c.fleetBody}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                {c.fleetLink}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}

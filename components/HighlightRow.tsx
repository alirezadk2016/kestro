import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import CraftMark, { type CraftMarkName } from "./CraftMark";
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

/*
 * The three things an enquiry has to say, taken out of the sentence above them.
 *
 * The card said "Quantity, specification and timing" in a paragraph and then
 * left 200px of nothing before its button, because the grid stretches all
 * three cards to the tallest and this one had the least in it. Setting the
 * same three words as rows fills that space with the thing the card is
 * actually asking for rather than with air — and tells a reader what the form
 * on the other side of the button will want before they press it.
 */
const asks: { mark: CraftMarkName; label: { da: string; en: string } }[] = [
  { mark: "batch", label: { da: "Antal", en: "Quantity" } },
  { mark: "adjust", label: { da: "Specifikation", en: "Specification" } },
  { mark: "schedule", label: { da: "Tidsramme", en: "Timing" } },
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
          <div className="plate flex flex-col justify-between p-6 sm:p-8 lg:col-span-4">
            <div>
              <span className="eyebrow text-brand-300">{c.askEyebrow}</span>
              <h2 className="mt-4 whitespace-pre-line font-display text-2xl font-extrabold leading-tight tracking-display text-paper sm:text-3xl">
                {c.askTitle}
              </h2>
              <p className="mt-4 text-sm leading-6 text-paper/65">{c.askBody}</p>

              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {asks.map((ask) => (
                  <li key={ask.mark} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center plate-sm rounded-lg bg-brand-500/[0.10] text-paper/90">
                      <CraftMark name={ask.mark} className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-paper/85">{ask.label[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={localePath("/tilbud", lang)}
              className="group inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 min-h-[44px] text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-500 px-6 mt-8 w-full sm:w-auto"
            >
              {c.askLink}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>

          {/* How a machine is prepared */}
          <div className="plate p-6 sm:p-8 lg:col-span-5">
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
                /* The plate's own ratio, 900x1200. It is drawn with h-auto, so
                   the height follows the intrinsic aspect and a declaration
                   that disagrees with it reserves the wrong box and shifts the
                   list beside it on load. */
                width={200}
                height={267}
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
            className="plate plate-lift plate-edge group flex min-h-[280px] flex-col justify-end overflow-hidden p-6 sm:p-8 lg:col-span-3"
          >
            <Image
              src="/cards/fleet-scene.webp"
              alt={c.fleetAlt}
              fill
              sizes="(min-width: 1024px) 24vw, 92vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* The picture is a backdrop for the words, so it gets a ramp dark
                enough to read on rather than a flat tint — but only where the
                words are. At 0.55 across the top the photograph was gone: the
                card read as an empty navy rectangle beside two cards that had
                something in them. The ramp now starts light and does its work
                in the bottom half, where the heading and the body actually
                sit.

                The second attempt at this measured 3.81:1 on the link — the
                photograph came back and took the text's ground with it. The
                stops moved rather than the opacity: light to 36%, then hard
                over to 0.90 by 62%, which is above where any of the type
                begins. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,11,22,0.18) 0%, rgba(6,11,22,0.44) 36%, rgba(6,11,22,0.90) 62%, rgba(6,11,22,0.97) 100%)",
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

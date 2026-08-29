import Link from "next/link";
import Container from "./Container";
import FeatureStrip from "./FeatureStrip";
import HeroMark from "./HeroMark";
import HeroModel from "./HeroModel";
import HeroSpecs from "./HeroSpecs";
import { ui } from "@/lib/nav";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * No "use client" here on purpose. The hero is text, two links and a table of
 * facts — it renders on the server and ships no JavaScript of its own. The
 * entrance is the .rise utility in globals.css, and only the two pieces that
 * genuinely need the browser (the cycling enquiry panel, the WebGL laptop) are
 * client components.
 */

const copy = {
  da: {
    eyebrow: "Indkøbspartner på renoveret erhvervs-IT",
    headline: "Erhvervscomputere.\nKlar til Norden.",
    sub: "Vi finder maskinerne hos de rigtige leverandører og oplyser pris, stand og garantivilkår skriftligt, før I bestiller. Fra enkelte maskiner til hele medarbejderflåden.",
    secondary: "Se hvad vi skaffer",
  },
  en: {
    eyebrow: "Sourcing partner for refurbished business IT",
    headline: "Business computers.\nReady for the Nordics.",
    sub: "We find the machines with the right suppliers and put the price, the condition and the warranty terms in writing before you order. From single machines to the whole staff fleet.",
    secondary: "See what we source",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Hero({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="grain relative overflow-hidden bg-brand-950">
      {/*
        The room the carousel stands in, in three layers.

        The carousel brings its own lit backdrop and floor, but they stop at
        the edge of its canvas — and a lit object on a flat rectangle of navy
        reads as a picture pasted onto a wall rather than as something standing
        in the page. These continue that light outwards, so the glow behind the
        panes carries on into the hero and the field has a near side and a far
        side instead of being one even colour.

        All three are CSS, so they cost no request and nothing to draw.
      */}

      {/* The key light, sitting behind the model and spilling left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 95% at 76% 20%, rgba(46,121,255,0.20) 0%, rgba(24,50,124,0.10) 36%, transparent 70%)",
        }}
      />

      {/* The K mark, oversized and cropped by the left edge — a watermark
          behind the headline rather than decoration competing with it. */}
      <HeroMark className="pointer-events-none absolute -left-[14%] top-1/2 h-[52%] w-auto -translate-y-1/2 opacity-90 sm:-left-[8%] sm:h-[62%] lg:-left-[5%] lg:h-[72%]" />

      {/* Flat decorative SVGs with nothing for next/image to optimise —
          no format conversion, no responsive sizing a vector needs. */}
      {/* eslint-disable @next/next/no-img-element */}
      {/* A dotted world map, faint, in the field the model turns in. */}
      <img
        src="/world-dots.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[2%] top-[6%] hidden w-[46%] max-w-2xl opacity-[0.55] md:block"
      />

      {/* A network of connected points, denser toward the corner — the same
          idea as the world map, that Kestro's work spans more than one desk. */}
      <img
        src="/network-mesh.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[52%] max-w-3xl opacity-70 lg:block"
      />
      {/* eslint-enable @next/next/no-img-element */}

      {/* The floor falling away, so the band ends in shadow rather than at a
          line. It also gives the section below something to arrive on. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: "linear-gradient(180deg, rgba(4,8,18,0) 0%, rgba(4,8,18,0.5) 100%)",
        }}
      />

      <div className="relative z-10 pb-14 pt-14 sm:pb-20 sm:pt-20 md:pt-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <div className="rise">
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-brand-400" />
                  <span className="eyebrow text-brand-300">{c.eyebrow}</span>
                </div>

                <h1 className="mt-6 whitespace-pre-line text-balance font-display text-[clamp(2.25rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-display text-paper">
                  {c.headline}
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-paper/65 sm:text-lg sm:leading-8">
                  {c.sub}
                </p>
              </div>

              <div className="rise rise-1 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/*
                  The same words as the header's button and the closing one,
                  from lib/nav.ts.

                  This said "Få tilbud på jeres IT-behov" while the button
                  fixed to the top of the same screen said "Få en pris på jeres
                  løsning" — one destination, one form, two promises, both in
                  view at once. A buyer reading them has to work out whether
                  they are the same thing. There is one primary action on this
                  site and it is worded in one place.
                */}
                <Link
                  href={localePath("/kontakt", lang)}
                  className="inline-flex min-h-[52px] items-center justify-center bg-paper px-8 text-sm font-semibold tracking-tight text-brand-950 transition hover:bg-white"
                >
                  {ui.bookCall[lang]}
                </Link>
                <Link
                  href={localePath("/produkter", lang)}
                  className="inline-flex min-h-[52px] items-center justify-center border border-paper/25 px-8 text-sm font-semibold tracking-tight text-paper transition hover:border-paper/60"
                >
                  {c.secondary}
                </Link>
              </div>
            </div>

            {/* The machine, and the configuration beside it — the two halves
                of the same claim: this is the kind of hardware we source, and
                this is what you get told about it before you order. */}
            <div className="settle lg:col-span-4">
              <HeroModel
                lang={lang}
                className="mx-auto aspect-square w-full max-w-lg lg:max-w-none"
              />
            </div>

            <div className="rise rise-3 lg:col-span-3">
              <HeroSpecs lang={lang} className="mx-auto w-full max-w-lg lg:max-w-none" />
            </div>
          </div>
        </Container>
      </div>

      <FeatureStrip lang={lang} />
    </section>
  );
}

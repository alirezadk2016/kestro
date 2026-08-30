import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Container from "./Container";
import FeatureStrip from "./FeatureStrip";
import HeroMark from "./HeroMark";
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
    eyebrow: "Renoveret erhvervs-IT",
    /* Two lines, two weights of attention: what it is, then who it is for.
       The second line carries the brand colour, so the headline has a
       hierarchy inside itself rather than being one even block. */
    headlineTop: "Erhvervscomputere.",
    headlineAccent: "Klar til Norden.",
    sub: "Vi finder maskinerne hos de rigtige leverandører og oplyser pris, stand og garantivilkår skriftligt, før I bestiller. Fra enkelte maskiner til hele medarbejderflåden.",
    secondary: "Se hvad vi skaffer",
    machineAlt: "Lenovo ThinkPad T480, åbnet og set forfra",
  },
  en: {
    eyebrow: "Refurbished business IT",
    headlineTop: "Business computers.",
    headlineAccent: "Ready for the Nordics.",
    sub: "We find the machines with the right suppliers and put the price, the condition and the warranty terms in writing before you order. From single machines to the whole staff fleet.",
    secondary: "See what we source",
    machineAlt: "Lenovo ThinkPad T480, open and seen from the front",
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
          behind the headline rather than decoration competing with it.
          Only from lg: below that the hero stacks, the section grows to twice
          the height, and a mark sized against it runs straight through the
          headline and the spec list as a pair of stray diagonals. */}
      <HeroMark className="pointer-events-none absolute -left-[5%] top-1/2 hidden h-[72%] w-auto -translate-y-1/2 opacity-90 lg:block" />

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
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <div className="rise">
                <span className="inline-flex items-center rounded-full border border-brand-400/35 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  {c.eyebrow}
                </span>

                {/* Sized for the longest word it has to hold rather than for
                    the English: "Erhvervscomputere." is one 18-character word
                    that cannot break, and at a 4rem cap it ran straight out of
                    this column and into the machine beside it. */}
                <h1 className="mt-6 font-display text-[clamp(2rem,3.8vw,3.4rem)] font-extrabold leading-[1.04] tracking-display">
                  <span className="block text-paper">{c.headlineTop}</span>
                  <span className="block text-brand-500">{c.headlineAccent}</span>
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
                  href={localePath("/tilbud", lang)}
                  className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-7 text-sm font-semibold tracking-tight text-white transition hover:bg-brand-500"
                >
                  {ui.bookCall[lang]}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  href={localePath("/produkter", lang)}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold tracking-tight text-paper transition hover:border-white/35 hover:bg-white/[0.08]"
                >
                  {c.secondary}
                  <LayoutGrid className="h-4 w-4 text-paper/50" strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* The machine, and the configuration beside it — the two halves
                of the same claim: this is the kind of hardware we source, and
                this is what you get told about it before you order.

                The machine is lit rather than cut out on white: it arrives
                with its own key light, rim and floor, and the glow underneath
                carries that light out into the page so it stands in the hero
                rather than sitting on top of it. Its edges are feathered in
                the asset itself, so there is no rectangle to hide. */}
            <div className="settle relative lg:col-span-4">
              <div
                aria-hidden="true"
                /* Kept close to the machine. At 18% it spilled under the spec
                   column and lifted the ground there to rgb(57,77,123), which
                   took the list's label under AA. */
                className="pointer-events-none absolute -inset-x-[6%] -inset-y-[10%]"
                style={{
                  background:
                    "radial-gradient(50% 46% at 50% 46%, rgba(60,110,255,0.32) 0%, rgba(40,74,190,0.12) 42%, transparent 68%)",
                }}
              />
              <Image
                src="/hero/hero-laptop.webp"
                alt={c.machineAlt}
                width={542}
                height={445}
                priority
                sizes="(min-width: 1024px) 38vw, 96vw"
                className="relative mx-auto w-full max-w-xl lg:max-w-none"
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

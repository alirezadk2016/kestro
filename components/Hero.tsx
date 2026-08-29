import Link from "next/link";
import Container from "./Container";
import FeatureStrip from "./FeatureStrip";
import HeroReel from "./HeroReel";
import HeroSpec from "./HeroSpec";
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

      {/* The key light, sitting behind the carousel and spilling left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 95% at 76% 20%, rgba(46,121,255,0.20) 0%, rgba(24,50,124,0.10) 36%, transparent 70%)",
        }}
      />

      {/*
        A drafting grid: it suits a company that sells to a specification and
        gives the dark field something to hold without the blur-blob
        decoration. Aimed at the middle rather than at the carousel — behind
        photographs it was competing with them, and the empty half of the hero
        was the part that needed something in it.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(147,169,239,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,169,239,0.09) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(105% 95% at 42% 42%, #000 18%, transparent 74%)",
          WebkitMaskImage: "radial-gradient(105% 95% at 42% 42%, #000 18%, transparent 74%)",
        }}
      />

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
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
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

            <div className="settle lg:col-span-5">
              <HeroReel lang={lang} className="mx-auto w-full max-w-lg lg:max-w-none" />
            </div>
          </div>

          {/* The enquiry runs the full width under both columns. As a tall
              panel beside the headline it made the hero half a screen too long
              and was hidden on phones entirely; across the page it costs a
              fraction of the height and fits a phone in two columns. */}
          <HeroSpec lang={lang} className="rise rise-3 mt-14 sm:mt-16" />
        </Container>
      </div>

      <FeatureStrip lang={lang} />
    </section>
  );
}

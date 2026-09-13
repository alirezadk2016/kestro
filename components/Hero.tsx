import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Container from "./Container";
import FeatureStrip from "./FeatureStrip";
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

      {/*
       * The scene.
       *
       * A photograph of the room the product stands in: the lit K cut into the
       * wall, the glazing, the blue-hour waterfront, the machine on dark stone.
       * It carries what three separate decorations used to be asked to carry —
       * the K watermark, the world map, the cut-out laptop — so all three are
       * gone. One picture, one story.
       *
       * It is a band lifted out of the supplied artwork rather than the
       * artwork itself. That file is a mockup of the whole page: navigation,
       * headline, buttons, a spec panel and a feature strip are painted into
       * the pixels, and one of them reads "Professiomally". Used as-is, every
       * real element on this page would land on top of a painted copy of
       * itself. The band between the headline's last glyph and the painted
       * panel has no text in it at all, and that is what this is.
       *
       * Its left edge is feathered in the asset — alpha 3 at x=0 rising to 255
       * by x=400 — so it dissolves into the navy rather than ending at a line.
       * The same lesson as the hub plate: a rectangle always shows.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-no-repeat md:block"
        /* Contained, not oversized. Pushing it left to pull the machine out
           from behind the spec panel worked, and cost more than it bought:
           the lit K came forward onto the headline and took its legibility
           with it. The machine reads through the glass panel instead, which
           is what the panel is translucent for. */
        style={{
          backgroundImage: "url(/hero/scene.webp)",
          /* Anchored right of centre rather than centred: cover crops the
             sides, and the machine and the lit K both live in the right two
             thirds of the plate. Anchored hard right, cover cropped the lit K clean
             out of the frame; 56% brings the wall back and keeps the machine. */
          backgroundPosition: "50% center",
        }}
      />


      {/*
       * The scrim, over the photograph and under the words.
       *
       * Not a taste decision. Verify measured the headline at 2.25:1 against
       * the lit stone the K is cut into — rgb(255,255,255) on rgb(169,173,180)
       * — where 3 is the floor for type that size, and the English accent line
       * at 1.20:1. A photograph has no obligation to be dark where a sentence
       * lands, so the page has to make it so.
       *
       * Reaching further than it first did. At 0.78 by 44% the blue accent
       * line sat on lit stone at 2.40:1 against the 3 it needs, because the K
       * is cut into the wall the headline ends over. It holds 0.93 to 46% now
       * and lets go by 80% — the K still reads, the sentence still reads. The brief asked for the left of the frame to
       * stay calm and high-contrast; this is that, enforced rather than hoped
       * for.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgb(9,14,30) 0%, rgba(9,14,30,0.98) 30%, rgba(9,14,30,0.93) 46%, rgba(9,14,30,0.6) 58%, rgba(9,14,30,0.18) 70%, rgba(9,14,30,0) 80%)",
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

      {/* Sized to the photograph, not to the copy. The plate is 2252x1268, so
            the band it fills has to be about 1.78:1 or cover starts cropping to
            fill the difference — at min-h-[680px] plus padding plus the trust
            strip the section reached 1.44:1 and cover ate the lit K entirely.
            These heights put the section back at roughly the plate's own ratio. */}
      <div className="relative z-10 flex min-h-[420px] items-center pb-14 pt-14 sm:pb-16 sm:pt-16 md:min-h-[480px] md:pt-20 lg:min-h-[540px]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
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


            <div className="rise rise-3 lg:col-span-4 lg:col-start-9">
              <HeroSpecs lang={lang} className="mx-auto w-full max-w-lg lg:max-w-none" />
            </div>
          </div>
        </Container>
      </div>

      <FeatureStrip lang={lang} />
    </section>
  );
}

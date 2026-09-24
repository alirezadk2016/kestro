import { ArrowDown, LayoutGrid } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import FeatureStrip from "./FeatureStrip";
import { ui } from "@/lib/nav";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * No "use client" here on purpose. The hero is a photograph, six lines of text
 * and two links — it renders on the server and ships no JavaScript of its own.
 * The entrance is the .rise utility in globals.css.
 */

const copy = {
  da: {
    eyebrow: "Renoveret erhvervs-IT",
    /* Two lines, two weights of attention: what it is, then who it is for.
       The second line carries the brand colour, so the headline has a
       hierarchy inside itself rather than being one even block. */
    headlineTop: ["Erhvervscomputere."],
    headlineAccent: "Klar til Norden.",
    subLead: "Pålidelig. Testet. Bæredygtig.",
    sub: "IT der holder jeres forretning i gang.",
    secondary: "Se hvad vi skaffer",
  },
  en: {
    eyebrow: "Refurbished IT for businesses",
    headlineTop: ["Business", "computers."],
    headlineAccent: "Ready for the Nordics.",
    subLead: "Reliable. Tested. Sustainable.",
    sub: "IT that keeps your business moving.",
    secondary: "Explore computers",
  },
} satisfies Record<Lang, Record<string, string | string[]>>;

export default function Hero({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    /*
     * Sized to the photograph from md up.
     *
     * The scene fills the section with background-size: cover, and cover
     * crops whichever axis is proportionally longer. A section whose height
     * came from its copy was 2.06:1 against a 2.70:1 plate, so cover scaled to
     * the height and ate 450px off the sides — the plant on the left and the
     * right-hand window with it. Giving the section the plate's own ratio
     * means nothing is cropped and the composition arrives as it was framed.
     *
     * w-full is not decorative: without it the ratio drives the width as well
     * as the height, and at 1440 the section measured 1456px inside a 1440px
     * viewport.
     *
     * 1460px is where the ratio starts being affordable. An aspect-ratio is a
     * height, not a minimum, so below that width it asks for a box shorter
     * than the copy needs and the copy is simply clipped — at 1024 the ratio
     * wanted 422px against the 622px the words, the padding and the trust bar
     * actually occupy. Under 1460 the section is as tall as its contents and
     * cover crops the sides instead, which is the ordinary trade; over it,
     * nothing is cropped and the composition arrives as it was framed.
     *
     * The negative top margin is the header's own height, so the photograph
     * runs up behind it the way the reference does — the nav is 82% glass, and
     * a dark ceiling reading faintly through it is the difference between a
     * picture that starts under a bar and a room the bar is standing in. The
     * matching padding puts the copy back below it. 81px is what the header
     * measures at every width from 768 up; verify's overflow pass is what
     * catches it if that ever stops being true.
     */
    <section className="grain relative flex w-full flex-col overflow-hidden bg-brand-950 md:-mt-[81px] md:pt-[81px] min-[1460px]:aspect-[1942/800]">
      {/*
       * The scene.
       *
       * The room the product stands in: the lit K cut into the wall, the
       * glazing, the blue-hour waterfront, the machine on dark stone. It
       * carries what three separate decorations used to be asked to carry —
       * the K watermark, the world map, the cut-out laptop — so all three are
       * gone. One picture, one story.
       *
       * Every word in it has been taken out of the pixels rather than covered
       * up: the supplied artwork is a mockup of this whole page, with the
       * headline, both buttons, all four editorial marks and the trust bar
       * painted in. Used as-is, every real element here would land on top of a
       * painted copy of itself. The removal is a morphological opening — erode
       * then dilate — which deletes light strokes and puts the ground's own
       * level back, followed by a Coons patch over the block that remains.
       * See the note in the cleaning script for why that order and not the
       * other one.
       */}
      {/*
        Told to the browser before the stylesheet is parsed.

        The scene is a CSS background, which is the right call — it is
        decoration with no alt text to argue about, and it has to behave like
        cover/center, which an <img> does not do for free. The cost is that the
        preload scanner cannot see it: it is the largest element on the page,
        and the browser only learns the URL exists once two stylesheets have
        downloaded and parsed. Measured on the live site: 910ms of resource
        load delay against 240ms of actual download.

        This link is in the markup from the first byte, so the fetch starts
        with the CSS rather than after it. media, because the layer it belongs
        to is hidden below md — a phone should not spend its first connection
        on 85kB it will never draw.
      */}
      <link
        rel="preload"
        as="image"
        href="/hero/scene.webp"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/hero/scene-mobile.webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url(/hero/scene.webp)" }}
      />

      {/*
       * The scrim, over the photograph and under the words.
       *
       * Not a taste decision. Verify measures the headline against whatever
       * the picture is doing behind it, and a photograph has no obligation to
       * be dark where a sentence lands. The left third of this plate is
       * already near-black, so this only has to hold that and let go early —
       * by 64% the window, the machine and the lit K are untouched.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,7,17,0.82) 0%, rgba(4,7,17,0.90) 11%, rgba(4,7,17,0.88) 34%, rgba(4,7,17,0.60) 45%, rgba(4,7,17,0.20) 55%, rgba(4,7,17,0) 66%)",
        }}
      />

      {/*
       * The editorial marks: two stanzas set into the room and a scroll cue at
       * the right edge, placed where the reference sets them — the percentages
       * are that artwork's own coordinates divided by its 1942x719 frame, so
       * the type lands on the same pillar and the same pane it was drawn on.
       *
       * They are HTML, not painted into the plate, which is the only reason
       * they stay sharp at any zoom and can be translated later. Deliberately
       * quiet — paper/30 to paper/45, wide tracking, small — so they read as
       * marks on the architecture rather than as copy competing with the
       * headline. Hidden below lg, where there is no room for them in frame.
       */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <p className="absolute left-[51.3%] top-[17.2%] text-[11px] font-medium uppercase leading-[1.95] tracking-[0.34em] text-paper/55">
          People
          <br />
          Technology
          <br />
          A cleaner
          <br />
          Tomorrow
        </p>

        <div className="absolute left-[86.5%] top-[17.3%]">
          <p className="text-[11px] font-medium uppercase leading-[1.95] tracking-[0.34em] text-paper/55">
            It today
            <br />
            A brighter
            <br />
            Tomorrow
          </p>
          <span className="mt-3 block h-px w-8 bg-paper/25" />
        </div>

        <div className="absolute left-[95.3%] top-[75.4%] flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-paper/55">
            Scroll
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-paper/30 to-transparent" />
          <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 text-paper/55" strokeWidth={1.5} />
        </div>
      </div>

      <div /* Centred, but not in the middle. The reference sets the block
                  high in the frame — 87px of air above the eyebrow against 259
                  below the buttons — because the machine and the waterfront
                  need the lower half. A heavier bottom padding does that
                  without pinning the block to a pixel offset, and it is held
                  back until 2xl: below that the frame has no spare height to
                  give, and asking for it only makes the box taller than the
                  photograph's own ratio, which is paid for in cropped sides. */
        className="relative z-10 flex flex-1 items-center pb-12 pt-12 sm:pb-14 sm:pt-14 lg:pb-10 lg:pt-8 2xl:pb-24 2xl:pt-10"
      >
        <Container>
          <div className="max-w-2xl lg:max-w-[54%]">
            <div className="rise">
              {/*
                A line of tracked capitals, not a chip.
                
                It was a bordered pill in brand blue, which put a second
                button-shaped object directly above the two real buttons. The
                reference sets it as a quiet label — the same weight as the
                marks out in the room — and that is what an eyebrow is for.
                w-fit so a contrast checker measures the label rather than the
                full width of the block it sits in.
              */}
              <p className="w-fit text-[clamp(0.75rem,0.62vw,0.78rem)] font-medium uppercase tracking-[0.3em] text-paper/55">
                {c.eyebrow}
              </p>

              {/* Sized for the longest word it has to hold rather than for
                  the English: "Erhvervscomputere." is one 18-character word
                  that cannot break, and at too large a cap it runs straight
                  out of this column and into the machine beside it. */}
              <h1 className="mt-6 font-display text-[clamp(1.85rem,2.63vw,3.25rem)] font-extrabold leading-[1.02] tracking-display">
                {/* w-fit, not just block. A block span fills the column, and
                    the contrast check samples the whole box it is given — so
                    the blue line was being measured against the lit stone 150px
                    past its last glyph and failing at 1.57:1, while the ground
                    the letters actually sit on is the near-black wall. Shrink
                    the box to the words and the reading is the real one. */}
                {c.headlineTop.map((line) => (
                  <span key={line} className="block w-fit text-paper">
                    {line}
                  </span>
                ))}
                <span className="block w-fit text-brand-500">{c.headlineAccent}</span>
              </h1>

              <p className="mt-5 max-w-xl text-[clamp(0.95rem,0.98vw,1.2rem)] leading-[1.72]">
                <span className="block text-paper">{c.subLead}</span>
                <span className="block text-paper/70">{c.sub}</span>
              </p>
            </div>

            <div className="rise rise-1 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/*
                The same words as the header's button and the closing one,
                from lib/nav.ts. There is one primary action on this site and
                it is worded in one place.
              */}
              <Button href={localePath("/tilbud", lang)} size="lg">
                {ui.bookCall[lang]}
              </Button>
              <Button
                href={localePath("/produkter", lang)}
                intent="secondary"
                size="lg"
                icon={<LayoutGrid className="h-4 w-4 text-paper/50" strokeWidth={2} />}
              >
                {c.secondary}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/*
        The phone's version of the room, as a band rather than a backdrop.

        The scene was hidden below md, which meant the screen most B2B traffic
        arrives on — the most important screen there is — was flat navy with
        type on it while the desktop got the room.

        Laying the same photograph behind the copy does not fix it and cannot:
        the hero stacks on a phone, so the band is 390 by about 900, a ratio of
        0.43, and no crop of a 2.7:1 photograph fills that without enlarging it
        until only a vertical sliver of the middle survives. Tried, measured,
        and it is exactly what happened — the room vanished and the machine
        slid down behind the trust strip.

        So the picture gets a frame of its own at a ratio it can hold, after
        the words and before the facts, which is the shape of every mobile hero
        that works. The file is the phone's own cut: a square taken at 56%
        across the plate, chosen by rendering four candidates and looking, which
        holds the lit K, the machine and the water. 33kB against the desktop's
        85. The top edge fades into the copy above rather than starting on a
        line.
      */}
      <div
        aria-hidden="true"
        className="relative z-10 aspect-[4/3] w-full bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgb(11,20,38) 0%, rgba(11,20,38,0.6) 12%, rgba(11,20,38,0) 32%), url(/hero/scene-mobile.webp)",
        }}
      />

      <FeatureStrip lang={lang} />
    </section>
  );
}

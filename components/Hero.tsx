import { LayoutGrid } from "lucide-react";
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
    /* Two lines, two weights of attention: what it is, then who it is for.
       The second line carries the brand colour, so the headline has a
       hierarchy inside itself rather than being one even block.

       "Refurbished" is in the headline because it is the word the page is
       about and the word a buyer types; "Erhvervscomputere." alone said
       what but not which kind, and the h1 is the one line every reader and
       every crawler takes. */
    headlineTop: ["Refurbished", "erhvervscomputere."],
    headlineAccent: "Klar til Norden.",
    /* One sentence over the same two lines the slogan used, and it answers
       the question the page is for: what Kestro is, for whom, and in what
       state the machines arrive. "Leverandør", not "indkøbspartner": the
       buyer's contract is with Kestro, and the first sentence on the site is
       where that has to be unambiguous. */
    subLead: "Kestro er leverandør af brugt erhvervs-IT til virksomheder",
    sub: "i Danmark og Norge – testet og klar til brug.",
    secondary: "Se hvad vi skaffer",
    proof: ["Testet", "Nordisk tastatur", "Levering i DK & NO"],
  },
  en: {
    headlineTop: ["Refurbished", "business computers."],
    headlineAccent: "Ready for the Nordics.",
    subLead: "Kestro is a supplier of used business IT to companies",
    sub: "in Denmark and Norway — tested and ready to use.",
    secondary: "Explore computers",
    proof: ["Tested", "Nordic keyboard", "Delivery to DK & NO"],
  },
} satisfies Record<Lang, Record<string, string | string[]>>;

/* "erhvervs-IT" as one unbreakable unit. A browser may break a line after a
   hyphen, and Safari did exactly that on an iPhone; a nowrap span keeps the
   word in the text as written, which a non-breaking hyphen character would
   not. */
function keepTerm(text: string) {
  const term = "erhvervs-IT";
  const i = text.indexOf(term);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="whitespace-nowrap">{term}</span>
      {text.slice(i + term.length)}
    </>
  );
}

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

      {/* The header's own colour carried down into the hero on a phone. The
          bar ends on rgb(4 8 18) and the hero starts on brand-950, so the two
          met on a visible step; this lets the bar dissolve into the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 md:hidden"
        style={{ background: "linear-gradient(180deg, rgb(4,8,18) 0%, rgba(4,8,18,0) 100%)" }}
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
       * No words in the room. There were two English stanzas ("People /
       * Technology / A cleaner tomorrow", "IT today / A brighter tomorrow")
       * and a "Scroll" cue set into the photograph as HTML, and a book on
       * the desk with "Circular IT / Stronger businesses" on its spine. On a
       * Danish page they were the first text a crawler met after the
       * navigation and they said nothing a buyer could use, so the stanzas
       * are gone and the book's spine was cleaned out of the plate.
       */}

      <div /* Centred, but not in the middle. The reference sets the block
                  high in the frame — 87px of air above the eyebrow against 259
                  below the buttons — because the machine and the waterfront
                  need the lower half. A heavier bottom padding does that
                  without pinning the block to a pixel offset, and it is held
                  back until 2xl: below that the frame has no spare height to
                  give, and asking for it only makes the box taller than the
                  photograph's own ratio, which is paid for in cropped sides. */
        className="relative z-10 flex flex-1 items-center pb-5 pt-6 sm:pb-14 sm:pt-14 lg:pb-10 lg:pt-8 2xl:pb-24 2xl:pt-10"
      >
        <Container>
          <div className="max-w-2xl lg:max-w-[54%]">
            <div className="rise">
              {/* Sized for the longest word it has to hold rather than for
                  the English: "Erhvervscomputere." is one 18-character word
                  that cannot break, and at too large a cap it runs straight
                  out of this column and into the machine beside it. */}
              <h1 className="hero-title font-display font-extrabold leading-[1.02] tracking-display">
                {/* w-fit, not just block. A block span fills the column, and
                    the contrast check samples the whole box it is given — so
                    the blue line was being measured against the lit stone 150px
                    past its last glyph and failing at 1.57:1, while the ground
                    the letters actually sit on is the near-black wall. Shrink
                    the box to the words and the reading is the real one. */}
                {/* The trailing spaces are for everything that reads the text
                    rather than the layout: without them the h1's textContent
                    was "Businesscomputers.Ready for the Nordics." — which is
                    what a crawler, a screen reader's text mode and an audit
                    all quoted back. */}
                {c.headlineTop.map((line) => (
                  <span key={line} className="block w-fit text-paper">
                    {line}{" "}
                  </span>
                ))}
                <span className="block w-fit text-brand-500">{c.headlineAccent}</span>
              </h1>

              {/* One sentence on a phone, two lines from md. As two block
                  spans on a phone it broke into a long line, a short line and
                  a dimmer third — "…erhvervs-" / "IT til virksomheder" / "i
                  Danmark…" on an iPhone, which read as three fragments in two
                  colours. Inline below md it flows as the sentence it is, in
                  one colour; "erhvervs-IT" is kept whole, because a line that
                  ends on "erhvervs-" splits the one term a buyer searches. */}
              <p className="mt-4 max-w-xl text-base leading-[1.6] text-paper/85 max-md:text-balance md:mt-5 md:text-[clamp(0.95rem,0.98vw,1.2rem)] md:leading-[1.72]">
                <span className="md:block md:text-paper">{keepTerm(c.subLead)} </span>
                <span className="md:block md:text-paper/75">{c.sub}</span>
              </p>

              {/* Three facts on the first screen of a phone. On a wide screen
                  they are in the strip under the photograph, in view with the
                  headline; on a phone that strip starts below the fold, so the
                  first screen had a promise and a button and nothing a buyer
                  could check. They are the strip's own first, second and last
                  facts, and the strip hides those three on a phone so they are
                  not said twice. */}
              {/* Dots, not check icons: three icons and their gaps made the row
                  344px wide, so it broke onto a second line on every phone
                  narrower than 390 — the iPhone mini, the SE and most Android
                  phones at 360. Text with a dot between holds one line down
                  to 320. */}
              <ul className="mt-4 flex flex-wrap items-center gap-y-1 text-[13px] font-medium leading-5 text-paper/75 max-[359px]:text-xs md:hidden">
                {c.proof.map((fact, i) => (
                  <li key={fact} className="flex items-center">
                    {i > 0 && (
                      <span aria-hidden="true" className="mx-2 h-1 w-1 rounded-full bg-brand-300" />
                    )}
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* One primary action. On a phone the second one is a quiet link
                under it rather than a second full-width box of the same
                height, which made two equal bars compete for the thumb. */}
            <div className="rise rise-1 mt-6 flex flex-col gap-1 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
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
                icon={<LayoutGrid className="h-4 w-4 text-paper/65" strokeWidth={2} />}
                className="max-sm:min-h-[44px] max-sm:border-transparent max-sm:bg-transparent max-sm:text-paper/85"
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
        that works. The file is the phone's own cut, 4:3 from the cleaned
        plate (1040x780 from x 1040, y 210): the whole lit K, the whole machine
        and the water. The square it replaced cut the laptop off at the right
        edge. 37kB against the desktop's 85. The top edge fades into the copy
        above and the bottom into the facts below, so it starts and ends
        without a line.
      */}
      <div
        aria-hidden="true"
        className="relative z-10 aspect-[4/3] w-full bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgb(11,20,38) 0%, rgba(11,20,38,0.5) 7%, rgba(11,20,38,0) 17%, rgba(11,20,38,0) 82%, rgba(8,13,27,0.85) 100%), url(/hero/scene-mobile.webp)",
        }}
      />

      <FeatureStrip lang={lang} />
    </section>
  );
}

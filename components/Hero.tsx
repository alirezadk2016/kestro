import Link from "next/link";
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
    /* "Brugt" is the machine's history and "refurbished" the work done to it
       afterwards — the distinction the site's own guide draws. The headline
       says refurbished, so the sentence under it says what that means here,
       instead of using the two words as if they were one. */
    subLead: "Kestro skaffer brugte erhvervscomputere til virksomheder",
    sub: "i Danmark og Norge og gør dem klar – testede og med nordisk tastatur.",
    /* The project's status on the first screen, once, in small type. A buyer
       who learns it three screens down, after reading "supplier" and "get a
       quote", has reason to feel misled. */
    status:
      "Under etablering – endnu ikke en registreret virksomhed. Vi tager imod forespørgsler, ikke ordrer.",
    statusLink: "Status og vilkår",
    /* How buying works, on the first screen. It was one sentence ("we
       source per order, and price, condition and warranty are in writing")
       that said what is true but not what to do; a visitor still had to
       find out that the way in is an enquiry and that it binds nothing. */
    stepsLabel: "Sådan foregår det",
    steps: [
      "Skriv, hvad I skal bruge",
      "Få et skriftligt tilbud per enhed",
      "Beslut jer – en forespørgsel binder ikke",
    ],
    secondary: "Se produkterne",
  },
  en: {
    headlineTop: ["Refurbished", "business computers."],
    headlineAccent: "Ready for the Nordics.",
    subLead: "Kestro sources used business computers for companies",
    sub: "in Denmark and Norway and gets them ready — tested, with a Nordic keyboard.",
    status: "In preparation — not yet a registered business. We take enquiries, not orders.",
    statusLink: "Status and terms",
    stepsLabel: "How it works",
    steps: [
      "Tell us what you need",
      "Get a written quote per unit",
      "Decide — an enquiry commits you to nothing",
    ],
    secondary: "See the products",
  },
} satisfies Record<Lang, Record<string, string | string[]>>;

/* The full stop at the end of a headline line, tucked back against its word.
   Plus Jakarta Sans gives "." a wide left bearing, and at 36px with the
   headline's negative tracking the dot stood 7px off the "e" while every
   other pair sat 1px apart: on a phone it read "erhvervscomputere ." and
   "Norden .", which looks like a typing error in the one line everybody
   reads. The text is unchanged; only the dot's box moves. */
function tuckStop(text: string) {
  if (!text.endsWith(".")) return text;
  return (
    <>
      {text.slice(0, -1)}
      <span className="-ml-[0.1em]">.</span>
    </>
  );
}

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
     * the height and cropped the architectural setting. Giving the section the plate's own ratio
     * means nothing is cropped and the composition arrives as it was framed.
     *
     * w-full is not decorative: without it the ratio drives the width as well
     * as the height, and at 1440 the section measured 1456px inside a 1440px
     * viewport.
     *
     * From 1460px the photograph's ratio is a minimum height, not a fixed
     * aspect-ratio. Longer copy, wrapping translations and larger text must
     * be able to grow the section; otherwise overflow-hidden clips the
     * feature strip and the next section appears to cover its labels.
     *
     * The negative top margin is the header's own height, so the photograph
     * runs up behind it the way the reference does — the nav is 82% glass, and
     * a dark ceiling reading faintly through it is the difference between a
     * picture that starts under a bar and a room the bar is standing in. The
     * matching padding puts the copy back below it. 81px is what the header
     * measures at every width from 768 up; verify's overflow pass is what
     * catches it if that ever stops being true.
     */
    <section className="home-hero under-bar grain relative flex w-full flex-col overflow-hidden bg-brand-950 max-md:-mt-[65px] md:-mt-[81px] md:pt-[81px] min-[1460px]:min-h-[calc(100vw*800/1942)]">
      {/*
       * The scene.
       *
       * The room the product stands in: the glazing, the blue-hour waterfront,
       * the machine on dark stone. It
       * carries what three separate decorations used to be asked to carry —
       * the K watermark, the world map, the cut-out laptop — so all three are
       * gone. One picture, one story.
       *
       * The artwork contains no text or branding. Real headings, actions and
       * the Kestro logo remain in HTML. scripts/build-artwork.mjs exports the
       * desktop plate and a separate mobile crop from the same master.
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
        href="/hero/scene.avif"
        type="image/avif"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      {/* A separate portrait plate keeps the product below the mobile copy.
          Browsers without AVIF take the WebP from image-set(). */}
      <link
        rel="preload"
        as="image"
        href="/hero/scene-mobile-portrait.avif"
        type="image/avif"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <div
        aria-hidden="true"
        className="hero-scene pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
      />

      {/*
       * The scrim, over the photograph and under the words.
       *
       * Not a taste decision. Verify measures the headline against whatever
       * the picture is doing behind it, and a photograph has no obligation to
       * be dark where a sentence lands. The left third of this plate is
       * already near-black, so this only has to hold that and let go early —
       * by 66% the window and the machine are untouched.
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

      {/* Mobile copy sits directly on the portrait's quiet architectural
          upper half. From md the wrapper dissolves into the original layout. */}
      <div className="home-hero-frame relative flex flex-col md:contents">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 md:hidden">
          <div className="hero-scene-mobile absolute inset-0" />
          {/* Enough shade under the glass bar for the logo, no more. */}
          <div
            className="absolute inset-x-0 top-0 h-28"
            style={{
              background: "linear-gradient(180deg, rgba(4,8,18,0.5) 0%, rgba(4,8,18,0) 100%)",
            }}
          />
        </div>

        <div /* Centred, but not in the middle. The reference sets the block
                  high in the frame — 87px of air above the eyebrow against 259
                  below the buttons — because the machine and the waterfront
                  need the lower half. A heavier bottom padding does that
                  without pinning the block to a pixel offset, and it is held
                  back until 2xl: below that the frame has no spare height to
                  give, and asking for it only makes the box taller than the
                  photograph's own ratio, which is paid for in cropped sides. */
          className="home-hero-copy-wrap relative z-10 flex items-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-24 md:flex-1 md:pb-14 md:pt-14 lg:pb-10 lg:pt-8 2xl:pb-24 2xl:pt-10"
        >
          <Container className="home-hero-copy-container">
            <div className="home-hero-copy max-w-2xl lg:max-w-[54%]">
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
                      {tuckStop(line)}{" "}
                    </span>
                  ))}
                  <span className="block w-fit text-brand-500">{tuckStop(c.headlineAccent)}</span>
                </h1>

                {/* One sentence on a phone, two lines from md. As two block
                  spans on a phone it broke into a long line, a short line and
                  a dimmer third — "…erhvervs-" / "IT til virksomheder" / "i
                  Danmark…" on an iPhone, which read as three fragments in two
                  colours. Inline below md it flows as the sentence it is, in
                  one colour; "erhvervs-IT" is kept whole, because a line that
                  ends on "erhvervs-" splits the one term a buyer searches. */}
                <p className="home-hero-lead mt-4 max-w-xl text-base leading-[1.6] text-paper/85 max-md:text-balance md:mt-5 md:text-[clamp(0.95rem,0.98vw,1.2rem)] md:leading-[1.72]">
                  <span className="md:block md:text-paper">{keepTerm(c.subLead)} </span>
                  <span className="md:block md:text-paper/75">{c.sub}</span>
                </p>
                {/* Detailed steps remain in the desktop hero; the mobile frame
                  prioritizes its introduction and primary action. */}
                <ol
                  aria-label={c.stepsLabel}
                  className="home-hero-detail mt-3 max-w-xl space-y-1 text-[0.9375rem] leading-[1.55] text-paper/85 md:mt-4 md:space-y-1.5 md:text-[clamp(0.9rem,0.9vw,1.1rem)] max-md:[@media(max-height:600px)]:hidden"
                >
                  {(c.steps as string[]).map((step, i) => (
                    <li key={step} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        /* A solid disc, not a ring over the glass: where the
                         English lines wrap, the numerals sat on the lit part of
                         the photograph and brand-200 measured 4.0:1. */
                        className="inline-flex h-5 w-5 flex-none translate-y-[-1px] items-center justify-center rounded-full border border-brand-400/70 bg-brand-950 text-[0.6875rem] font-bold tabular-nums text-paper"
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                {/* No row of facts here any more. It said "Testet · Nordisk
                  tastatur · Levering" in the panel while the strip a thumb's
                  width below ran the same three with their reasons, so the
                  first screen said them twice; the panel keeps to the claim
                  and the action. */}
              </div>

              {/* One primary action. On a phone the second one is a quiet link
                under it rather than a second full-width box of the same
                height, which made two equal bars compete for the thumb. */}
              <div className="home-hero-actions rise rise-1 mt-6 flex flex-col gap-1 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
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

              <p className="home-hero-status rise rise-1 mt-4 max-w-xl text-[0.8125rem] leading-[1.55] text-paper/75 sm:mt-5 max-md:[@media(max-height:600px)]:hidden">
                {c.status}{" "}
                <Link
                  href={localePath("/handelsbetingelser", lang)}
                  rel="terms-of-service"
                  className="font-semibold text-paper/85 underline decoration-paper/40 underline-offset-4 hover:text-paper"
                >
                  {c.statusLink}
                </Link>
              </p>
            </div>
          </Container>
        </div>
      </div>

      <FeatureStrip lang={lang} />
    </section>
  );
}

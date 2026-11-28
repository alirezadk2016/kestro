import Image from "next/image";
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
    /* "i" is tied to "Danmark": as flowing text the line broke after the
       preposition and left it hanging at the end of the first line. */
    sub: "i\u00a0Danmark og Norge og gør dem klar – testede og med nordisk tastatur.",
    /* The project's status on the first screen, once, in small type. A buyer
       who learns it three screens down, after reading "supplier" and "get a
       quote", has reason to feel misled. */
    status:
      "Under etablering – endnu ikke en registreret virksomhed. Vi tager imod forespørgsler, ikke ordrer.",
    statusLink: "Status og vilkår",
    /* No list of steps here. Three numbered lines stood between the sentence
       and the buttons from md up (a phone never showed them), which made five
       blocks of text on the first screen: headline, sentence, steps, actions,
       status. How buying works is the process section and the written-quote
       section further down; the status line under the buttons already says
       an enquiry is not an order. */
    secondary: "Se produkterne",
    productAlt: "Modelfoto: Lenovo ThinkPad T480 set bagfra med åbent låg og portene i siden",
  },
  en: {
    headlineTop: ["Refurbished", "business computers."],
    headlineAccent: "Ready for the Nordics.",
    subLead: "Kestro sources used business computers for companies",
    sub: "in\u00a0Denmark and Norway and gets them ready — tested, with a Nordic keyboard.",
    status: "Pre-launch — not yet a registered business. We take enquiries, not orders.",
    statusLink: "Status and terms",
    secondary: "See the products",
    productAlt:
      "Model photo: Lenovo ThinkPad T480 seen from behind with the lid open and the side ports visible",
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
     * Sized to a 2.43:1 frame from 1460px up, the proportion the first
     * screen was composed at; below that the copy sets the height.
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
     * The negative top margin is the header's own height, so the section's
     * ground runs up behind the glass bar. The matching padding puts the copy
     * back below it. 81px is what the header
     * measures at every width from 768 up; verify's overflow pass is what
     * catches it if that ever stops being true.
     */
    <section className="home-hero under-bar grain relative isolate flex w-full flex-col overflow-hidden bg-brand-950 max-md:-mt-[65px] md:-mt-[81px] md:pt-[81px] min-[1460px]:min-h-[calc(100vw*800/1942)]">
      {/* On a phone the copy comes first and the machine stands under it.
          From md the wrapper dissolves into the original layout. */}
      <div className="home-hero-frame relative flex flex-col md:contents">
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
          {/*
           * The machine (28 November 2026).
           *
           * A photograph of a real Lenovo ThinkPad T480, cut out of its
           * studio ground (owner-supplied; docs/media-licenses.md). It
           * replaced an AI-generated room with a brandless laptop at a
           * window: a laptop on this site is a real one. The rear view keeps
           * the ThinkPad lid and the ports, and no dated screen. On a phone
           * it stands under the actions; from md it sits right of the copy,
           * in the frame the copy shares, so it never meets the feature
           * strip.
           */}
          <div className="hero-product pointer-events-none absolute -z-10">
            <Image
              src="/thinkpad-t480-2-cutout.webp"
              width={1179}
              height={1120}
              alt={c.productAlt}
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 42vw, 86vw"
              className="relative h-auto w-full"
            />
          </div>
          <Container className="home-hero-copy-container">
            <div className="home-hero-copy max-w-2xl md:max-w-[58%] lg:max-w-[54%]">
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

                {/* One sentence in one colour at every width. From md it was
                  two block spans, the first clause in white and the rest at
                  75%, so the sentence changed colour where the line happened
                  to break and read as a statement with a caption under it.
                  "erhvervs-IT" is kept whole, because a line that ends on
                  "erhvervs-" splits the one term a buyer searches. The
                  measure is narrower at md and lg, where the lit window starts
                  closer to the copy and a full-width line ran onto it. */}
                <p className="home-hero-lead mt-4 max-w-xl text-pretty text-base leading-[1.6] text-paper/85 md:mt-6 md:max-w-md md:text-[clamp(1.0625rem,1.25vw,1.3rem)] md:leading-[1.65] lg:max-w-lg 2xl:max-w-xl">
                  {keepTerm(c.subLead)} {c.sub}
                </p>

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

              <p className="home-hero-status rise rise-1 mt-4 max-w-xl text-pretty text-[0.8125rem] leading-[1.55] text-paper/75 sm:mt-5 md:max-w-md lg:max-w-xl max-md:[@media(max-height:600px)]:hidden">
                {c.status}{" "}
                <Link
                  href={localePath("/handelsbetingelser", lang)}
                  rel="terms-of-service"
                  className="whitespace-nowrap font-semibold text-paper/85 underline decoration-paper/40 underline-offset-4 hover:text-paper"
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

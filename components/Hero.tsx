import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import FeatureStrip from "./FeatureStrip";
import { ui } from "@/lib/nav";
import { localePath, type Lang } from "@/lib/i18n";
import artworkPlaceholders from "@/lib/artwork-placeholders.json";

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
    sub: "i Danmark og Norge og gør dem klar – testet, med nordisk tastatur.",
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
    alt: "En bærbar erhvervscomputer på et stenbord ved et vindue ud mod havnen i skumringen",
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
    alt: "A business laptop on a stone desk by a window over the harbour at dusk",
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
     * Words on paper, the picture beside them.
     *
     * It was the room at full bleed with the words on dark glass over it, the
     * bar running up into the ceiling: a tech launch, not a supplier. A
     * Danish buyer's other suppliers open with a plain statement of what they
     * sell on white, and so does this. The photograph is still the room —
     * the machine on the stone desk at blue hour — but framed, as a picture
     * in the page rather than the page's ground.
     *
     * On a phone the words come first, so the first screen says what Kestro
     * is and how buying works, and the picture follows the buttons.
     */
    <section className="border-b border-ink-200 bg-white">
      <Container className="grid items-center gap-8 pb-10 pt-8 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:py-16 xl:gap-16 2xl:py-20">
        <div className="lg:col-span-6">
          <div className="rise">
            {/* The trailing spaces are for everything that reads the text
                rather than the layout: without them the h1's textContent was
                "Businesscomputers.Ready for the Nordics." — which is what a
                crawler, a screen reader's text mode and an audit all quoted
                back. */}
            <h1 className="hero-title font-display font-extrabold leading-[1.04] tracking-display text-ink-900">
              {c.headlineTop.map((line) => (
                <span key={line} className="block">
                  {tuckStop(line)}{" "}
                </span>
              ))}
              <span className="block text-brand-600">{tuckStop(c.headlineAccent)}</span>
            </h1>

            {/* One sentence on a phone, two lines from md. "erhvervs-IT" is
                kept whole, because a line that ends on "erhvervs-" splits the
                one term a buyer searches. */}
            <p className="mt-5 max-w-xl text-base leading-[1.6] text-ink-700 max-md:text-balance md:text-lg md:leading-[1.65]">
              <span className="md:block md:text-ink-900">{keepTerm(c.subLead)} </span>
              <span className="md:block">{c.sub}</span>
            </p>

            <ol
              aria-label={c.stepsLabel}
              className="mt-5 max-w-xl space-y-1.5 text-[0.9375rem] leading-[1.55] text-ink-800 md:text-base"
            >
              {(c.steps as string[]).map((step, i) => (
                <li key={step} className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-5 w-5 flex-none translate-y-[-1px] items-center justify-center rounded-full bg-brand-50 text-[0.6875rem] font-bold tabular-nums text-brand-800 ring-1 ring-inset ring-brand-600/20"
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* One primary action. On a phone the second one is a quiet link
              under it rather than a second full-width box of the same height,
              which made two equal bars compete for the thumb. The words are
              the header's and the closing band's, from lib/nav.ts. */}
          <div className="rise rise-1 mt-7 flex flex-col gap-1 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <Button href={localePath("/tilbud", lang)} size="lg">
              {ui.bookCall[lang]}
            </Button>
            <Button
              href={localePath("/produkter", lang)}
              intent="secondary"
              size="lg"
              icon={<LayoutGrid className="h-4 w-4 text-ink-600" strokeWidth={2} />}
              className="max-sm:min-h-[48px] max-sm:border-transparent max-sm:bg-transparent"
            >
              {c.secondary}
            </Button>
          </div>

          {/* The project's status on the first screen, once, in small type. */}
          <p className="rise rise-1 mt-5 max-w-xl text-[0.8125rem] leading-[1.55] text-ink-600">
            {c.status}{" "}
            <Link
              href={localePath("/handelsbetingelser", lang)}
              rel="terms-of-service"
              className="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-brand-700 hover:decoration-brand-600"
            >
              {c.statusLink}
            </Link>
          </p>
        </div>

        {/* The room, framed. The phone's own near-square crop of the scene
            keeps the whole machine and the waterfront behind it, and it is
            the same file at every width, so there is one download. */}
        <div className="settle lg:col-span-6">
          <div className="plate-well overflow-hidden rounded-2xl">
            <Image
              src="/hero/scene-mobile.webp"
              alt={c.alt}
              width={820}
              height={796}
              priority
              quality={85}
              placeholder="blur"
              blurDataURL={artworkPlaceholders.heroMobile}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover lg:aspect-[820/796]"
            />
          </div>
        </div>
      </Container>

      <FeatureStrip lang={lang} />
    </section>
  );
}

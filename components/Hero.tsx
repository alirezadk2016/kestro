import Link from "next/link";
import Container from "./Container";
import HeroReel from "./HeroReel";
import HeroSpec from "./HeroSpec";
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
    primary: "Få tilbud på jeres IT-behov",
    secondary: "Se hvad vi skaffer",
  },
  en: {
    eyebrow: "Sourcing partner for refurbished business IT",
    headline: "Business computers.\nReady for the Nordics.",
    sub: "We find the machines with the right suppliers and put the price, the condition and the warranty terms in writing before you order. From single machines to the whole staff fleet.",
    primary: "Get a quote for your IT needs",
    secondary: "See what we source",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Hero({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="relative overflow-hidden bg-brand-950">
      {/*
        A drafting grid in CSS rather than an image: it costs no request, suits
        a company that sells to a specification, and gives the dark field
        something to hold without the blur-blob decoration.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(147,169,239,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,169,239,0.09) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(120% 90% at 70% 30%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 70% 30%, #000 30%, transparent 78%)",
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
                <Link
                  href={localePath("/kontakt", lang)}
                  className="inline-flex min-h-[52px] items-center justify-center bg-paper px-8 text-sm font-semibold tracking-tight text-brand-950 transition hover:bg-white"
                >
                  {c.primary}
                </Link>
                <Link
                  href={localePath("/produkter", lang)}
                  className="inline-flex min-h-[52px] items-center justify-center border border-paper/25 px-8 text-sm font-semibold tracking-tight text-paper transition hover:border-paper/60"
                >
                  {c.secondary}
                </Link>
              </div>
            </div>

            {/* On a wide screen the carousel is deliberately wider than its
                column and leans into the page gutter, which the section clips.
                Sized to the column, the panes turning away at the sides get
                cut off by their own container and the ring stops reading as a
                ring. */}
            <div className="rise rise-2 lg:col-span-5">
              <HeroReel
                lang={lang}
                className="mx-auto w-full max-w-lg lg:-mr-[12%] lg:w-[114%] lg:max-w-none"
              />
            </div>
          </div>

          {/* The enquiry runs the full width under both columns. As a tall
              panel beside the headline it made the hero half a screen too long
              and was hidden on phones entirely; across the page it costs a
              fraction of the height and fits a phone in two columns. */}
          <HeroSpec lang={lang} className="rise rise-3 mt-14 sm:mt-16" />
        </Container>
      </div>
    </section>
  );
}

import Link from "next/link";
import HeroModel from "./HeroModel";
import HeroSpec from "./HeroSpec";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * No "use client" here on purpose. The hero is text, two links and a table of
 * facts — it renders on the server and ships no JavaScript of its own. The
 * entrance is the .rise utility in globals.css, and only the two pieces that
 * genuinely need the browser (the cycling enquiry panel, the WebGL laptop) are
 * client components.
 */

/* Facts, not feature bullets. Set as a rule-separated row rather than pills —
   the pill-with-tiny-icon is the single most template-looking element there is. */
const FACTS = [
  { k: { da: "Base", en: "Based in" }, v: { da: "Aarhus", en: "Aarhus" } },
  { k: { da: "Leverer i", en: "Delivers in" }, v: { da: "DK & NO", en: "DK & NO" } },
  { k: { da: "Tastatur", en: "Keyboard" }, v: { da: "Nordisk", en: "Nordic" } },
];

const copy = {
  da: {
    eyebrow: "Indkøbspartner på renoveret erhvervs-IT",
    headline: "Erhvervscomputere.\nKlar til Norden.",
    sub: "Vi forbinder jer med de rigtige leverandører – så I får den rette pris og de rette garantivilkår. Fra enkelte maskiner til hele medarbejderflåden.",
    primary: "Få et tilbud",
    secondary: "Se hvad vi skaffer",
  },
  en: {
    eyebrow: "Sourcing partner for refurbished business IT",
    headline: "Business computers.\nReady for the Nordics.",
    sub: "We connect you with the right suppliers — so you get the right price and the right warranty terms. From single machines to the whole staff fleet.",
    primary: "Get a quote",
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-24 md:py-28 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="rise">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-brand-400" />
                <span className="eyebrow text-brand-300">
                  {c.eyebrow}
                </span>
              </div>

              <h1 className="mt-7 whitespace-pre-line text-balance font-display text-[clamp(2.25rem,6.5vw,4.5rem)] font-extrabold leading-[0.98] tracking-display text-paper">
                {c.headline}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-paper/65 sm:text-lg sm:leading-8">
                {c.sub}
              </p>
            </div>

            <div className="rise rise-1 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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

            <dl className="rise rise-3 mt-10 grid max-w-lg grid-cols-3 border-t border-paper/15 sm:mt-12">
              {FACTS.map((fact) => (
                <div key={fact.k.da} className="py-4 pr-6">
                  <dt className="label text-brand-300">
                    {fact.k[lang]}
                  </dt>
                  <dd className="mt-1 font-display text-base font-semibold tracking-tight text-paper sm:text-lg">
                    {fact.v[lang]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* On a wide screen the laptop is deliberately larger than its
              column and leans into the page gutter, which the section clips.
              Sized to the column it read as a thumbnail floating in a void. */}
          <div className="rise rise-2 lg:col-span-5">
            <HeroModel
              lang={lang}
              className="mx-auto w-full max-w-xs sm:max-w-sm lg:-ml-[14%] lg:w-[128%] lg:max-w-none"
            />
          </div>
        </div>

        {/* The enquiry runs the full width under both columns. As a tall panel
            beside the headline it made the hero half a screen too long and was
            hidden on phones entirely; across the page it costs a fraction of
            the height and fits a phone in two columns. */}
        <HeroSpec lang={lang} className="rise rise-3 mt-14 sm:mt-16" />
      </div>
    </section>
  );
}

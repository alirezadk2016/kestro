"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { localePath, type Lang } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

/* Facts, not feature bullets. Set as a rule-separated row rather than pills —
   the pill-with-tiny-icon is the single most template-looking element there is. */
const FACTS = [
  { k: { da: "Base", en: "Based in" }, v: { da: "Aarhus", en: "Aarhus" } },
  { k: { da: "Leverer i", en: "Delivers in" }, v: { da: "DK & NO", en: "DK & NO" } },
  { k: { da: "Tastatur", en: "Keyboard" }, v: { da: "Nordisk", en: "Nordic" } },
  { k: { da: "Lager", en: "Stock" }, v: { da: "Intet", en: "None" } },
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
    <section className="relative overflow-hidden bg-ink-950">
      {/* The graphic is texture, not subject: pushed right back so the type carries the frame. */}
      <div className="absolute inset-0 opacity-[0.28]">
        <Image
          src="/hero-dark.png"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover object-[70%_center]"
          sizes="100vw"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950 md:bg-gradient-to-r md:from-ink-950 md:via-ink-950/85 md:to-ink-950/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-accent-600/10 blur-[120px]"
      />

      <MotionConfig reducedMotion="user">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-16 sm:px-6 sm:pt-24 md:py-28 lg:px-8">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent-400" />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper/60 sm:text-xs">
                {c.eyebrow}
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl whitespace-pre-line font-display text-[clamp(2.25rem,8vw,5.25rem)] font-extrabold leading-[0.95] tracking-display text-paper">
              {c.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-paper/65 sm:text-lg sm:leading-8">{c.sub}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.15}
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link
              href={localePath("/kontakt", lang)}
              className="inline-flex min-h-[52px] items-center justify-center bg-paper px-8 text-sm font-semibold tracking-tight text-ink-950 transition hover:bg-white"
            >
              {c.primary}
            </Link>
            <Link
              href={localePath("/produkter", lang)}
              className="inline-flex min-h-[52px] items-center justify-center border border-paper/25 px-8 text-sm font-semibold tracking-tight text-paper transition hover:border-paper/60"
            >
              {c.secondary}
            </Link>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="mt-12 grid max-w-2xl grid-cols-2 border-t border-paper/15 sm:grid-cols-4"
          >
            {FACTS.map((fact) => (
              <div key={fact.k.da} className="border-b border-paper/10 py-4 pr-6 sm:border-b-0">
                <dt className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-paper/40">
                  {fact.k[lang]}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold tracking-tight text-paper">
                  {fact.v[lang]}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </MotionConfig>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ShieldCheck, Keyboard, Truck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

const TAGS = [
  { icon: ShieldCheck, label: "Testet" },
  { icon: Keyboard, label: "Nordisk tastatur" },
  { icon: Truck, label: "Levering i DK & NO" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* Dark-native graphic: top band on mobile, full-bleed right on desktop */}
      <div className="absolute inset-x-0 top-0 h-[42%] md:inset-0 md:h-full">
        <Image
          src="/hero-dark.png"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover object-[68%_38%] md:object-[65%_center]"
          sizes="100vw"
        />
        {/* Mobile: fade the band down into the panel. Desktop: keep the left column clean. */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/45 to-slate-900 md:bg-gradient-to-r md:from-slate-900 md:via-slate-900/70 md:to-transparent" />
      </div>

      <MotionConfig reducedMotion="user">
        <div className="relative z-10 mx-auto flex min-h-[36rem] w-full max-w-7xl flex-col justify-end px-5 pb-14 pt-32 sm:px-6 md:min-h-[38rem] md:justify-center md:px-8 md:py-28 lg:px-10">
          <div className="max-w-xl">
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Refurbished erhvervscomputere til Norden
              </span>

              <h1 className="mt-6 whitespace-pre-line text-[clamp(1.75rem,7vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
                {"Erhvervscomputere.\nKlar til Norden."}
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Vi forbinder jer med de rigtige leverandører – så I får den rette pris og de rette
                garantivilkår. Fra enkelte maskiner til hele medarbejderflåden.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.15}
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:bg-slate-100"
              >
                Få et tilbud
              </Link>
              <Link
                href="/produkter"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Se hvad vi skaffer
              </Link>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="visible"
              custom={0.4}
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5"
            >
              {TAGS.map((tag) => (
                <li key={tag.label} className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
                  <tag.icon className="h-4 w-4 text-brand-400" strokeWidth={2} />
                  {tag.label}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

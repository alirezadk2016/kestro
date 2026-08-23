"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

const TAGS = ["Testet", "Nordisk tastatur", "Levering i DK & NO"];

export default function Hero() {
  return (
    <section className="relative flex h-[calc(100dvh-4rem)] flex-col justify-end overflow-hidden px-5 pb-12 sm:h-[calc(100dvh-5rem)] sm:px-8 md:justify-center md:px-10 md:pb-0">
      <Image
        src="/hero-devices.png"
        alt=""
        fill
        priority
        className="pointer-events-none -z-10 object-cover grayscale"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/85 to-white/20" />

      <MotionConfig reducedMotion="user">
        <div className="relative z-10 max-w-xl">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            <span className="inline-flex items-center rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-black">
              Refurbished erhvervscomputere til Norden
            </span>

            <h1 className="mt-6 whitespace-pre-line text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
              {"Erhvervscomputere.\nKlar til Norden."}
            </h1>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.15}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black/80"
            >
              Få et tilbud
            </Link>
            <Link
              href="/ydelser"
              className="text-sm font-semibold text-black underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Sådan arbejder vi
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="mt-6 flex flex-wrap gap-2"
          >
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/15 bg-white/70 px-3 py-1 text-xs font-medium text-black sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  );
}

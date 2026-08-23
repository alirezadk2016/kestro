import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";
import { ui } from "@/lib/nav";

const copy = {
  da: {
    title: "Lad os finde den rigtige løsning til jer",
    body: "Fortæl os om jeres situation, så vender vi tilbage med et konkret oplæg – uforpligtende og uden salgstale.",
    secondary: "Se flådeløsninger",
  },
  en: {
    title: "Let us find the right solution for you",
    body: "Tell us about your situation and we will come back with a concrete proposal — no obligation and no sales pitch.",
    secondary: "See fleet solutions",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function CtaSection({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="relative overflow-hidden bg-brand-950 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-[130px]"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="h-px w-10 bg-brand-400" />
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.03] tracking-display text-paper">
              {c.title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-paper/60 sm:text-lg">{c.body}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link
              href={localePath("/kontakt", lang)}
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 bg-paper px-8 text-sm font-semibold tracking-tight text-brand-950 transition hover:bg-white"
            >
              {ui.bookCall[lang]}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
            <Link
              href={localePath("/flaadeloesninger", lang)}
              className="inline-flex min-h-[52px] items-center justify-center border border-paper/25 px-8 text-sm font-semibold tracking-tight text-paper transition hover:border-paper/60"
            >
              {c.secondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

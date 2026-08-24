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
    <section className="bg-brand-950 py-14 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="h-px w-8 bg-brand-400" />
          <h2 className="mt-6 text-balance font-display text-[clamp(1.875rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-paper/60">{c.body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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

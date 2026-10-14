import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "./Container";
import Button from "./Button";
import { localePath, type Lang } from "@/lib/i18n";
import { ui } from "@/lib/nav";

const copy = {
  da: {
    title: "Lad os finde den rigtige løsning til jer",
    body: "Fortæl os om jeres situation, så vender vi tilbage med et konkret oplæg – uforpligtende og uden salgstale.",
    write: "Skriv til os",
  },
  en: {
    title: "Let us find the right solution for you",
    body: "Tell us about your situation and we will come back with a concrete proposal — no obligation and no sales pitch.",
    write: "Write to us",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * The close of a page: one band, one sentence, one action.
 *
 * It used to be a display-size heading, two full buttons and the two people
 * behind the inbox with their photographs and titles — 786px on a phone, at
 * the foot of sixteen pages, directly above a footer that offered "Talk to an
 * adviser" and the address again. Read page after page it was the loudest
 * repetition on the site. The people are on /om-os, /kontakt and /tilbud,
 * where somebody deciding whether to write is looking for them; here the band
 * says the one thing and gets out of the way.
 *
 * A plain navy band, the one dark thing on a light page apart from the footer
 * under it: the end of the page, said once. It was a glass pane over a lit
 * stage with grain; on a light site that was the last of the effects.
 */
export default function CtaSection({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="bg-brand-950 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.title}
            </h2>
            <p className="mt-3 text-base leading-[1.65] text-paper/75">{c.body}</p>
          </div>
          <div className="flex flex-none flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
            <Button
              href={localePath("/tilbud", lang)}
              size="lg"
              className="w-full focus-visible:ring-offset-brand-950 sm:w-auto"
            >
              {ui.bookCall[lang]}
            </Button>
            <Link
              href={localePath("/kontakt", lang)}
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-paper/85 transition-colors hover:text-paper"
            >
              {c.write}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

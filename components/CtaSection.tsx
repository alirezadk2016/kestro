import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "./Container";
import Button from "./Button";
import { localePath, type Lang, type Localized } from "@/lib/i18n";
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

type Intent = "purchase" | "repair" | "buyback";
const taskCopy: Record<
  Exclude<Intent, "purchase">,
  { title: Localized; body: Localized; action: Localized; href: string }
> = {
  repair: {
    title: { da: "Skal vi se på jeres computer?", en: "Need help with your computer?" },
    body: {
      da: "Skriv model og hvad der er galt i reparationsformularen, så afklarer vi næste skridt.",
      en: "Tell us the model and what is wrong in the repair form, and we discuss the next step.",
    },
    action: { da: "Beskriv problemet", en: "Describe the problem" },
    href: "/reparation#reparation-formular",
  },
  buyback: {
    title: { da: "Hvilket udstyr skal I af med?", en: "What equipment are you getting rid of?" },
    body: {
      da: "Send modeller, antal og stand, så kan vi vurdere mulighederne.",
      en: "Send the models, quantity and condition so we can assess the options.",
    },
    action: { da: "Beskriv jeres udstyr", en: "Describe your equipment" },
    href: "/saelg-til-os#saelg-formular",
  },
};

/*
 * The close of a page: one glass band, one sentence, one action.
 *
 * It used to be a display-size heading, two full buttons and the two people
 * behind the inbox with their photographs and titles — 786px on a phone, at
 * the foot of sixteen pages, directly above a footer that offered "Talk to an
 * adviser" and the address again. Read page after page it was the loudest
 * repetition on the site. The people are on /om-os, /kontakt and /tilbud,
 * where somebody deciding whether to write is looking for them; here the band
 * says the one thing and gets out of the way.
 *
 * Glass on the stage's own light: the key light up and to the right shows
 * through the panel, which is what makes it read as a pane and not a box.
 */
export default function CtaSection({ lang, intent = "purchase" }: { lang: Lang; intent?: Intent }) {
  const c = copy[lang];
  const task = intent === "purchase" ? null : taskCopy[intent];

  return (
    <section className="stage py-10 sm:py-16">
      <Container>
        <div className="glass-band flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {task?.title[lang] ?? c.title}
            </h2>
            <p className="mt-3 text-base leading-[1.65] text-paper/75">
              {task?.body[lang] ?? c.body}
            </p>
          </div>
          <div className="flex flex-none flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
            <Button
              href={localePath(task?.href ?? "/tilbud", lang)}
              size="lg"
              className="w-full sm:w-auto"
            >
              {task?.action[lang] ?? ui.bookCall[lang]}
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

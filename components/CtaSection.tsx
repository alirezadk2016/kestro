import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import TeamAvatar from "./TeamAvatar";
import { teamFor } from "@/lib/company";
import { localePath, type Lang } from "@/lib/i18n";
import { ui } from "@/lib/nav";

const copy = {
  da: {
    title: "Lad os finde den rigtige løsning til jer",
    body: "Fortæl os om jeres situation, så vender vi tilbage med et konkret oplæg – uforpligtende og uden salgstale.",
    secondary: "Se flådeløsninger",
    who: "Dem I kommer til at tale med",
    meet: "Mød os",
  },
  en: {
    title: "Let us find the right solution for you",
    body: "Tell us about your situation and we will come back with a concrete proposal — no obligation and no sales pitch.",
    secondary: "See fleet solutions",
    who: "The people you will be talking to",
    meet: "Meet us",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function CtaSection({
  lang,
  /*
   * The band ends most pages on the site, so this is where the two names
   * behind it belong: a buyer reading "tell us about your situation" gets to
   * see who "us" is before writing. Turned off on the pages that already
   * introduce the team a screen earlier.
   */
  people = true,
}: {
  lang: Lang;
  people?: boolean;
}) {
  const c = copy[lang];
  const team = teamFor(lang);

  return (
    <section className="stage py-16 sm:py-28" data-reveal>
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

        {people && (
          <div className="mt-12 border-t border-paper/15 pt-8 lg:mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
              {c.who}
            </p>
            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-5">
              {team.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <TeamAvatar member={member} lang={lang} size={44} className="h-11 w-11" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-paper">{member.name}</p>
                    <p className="text-sm text-paper/60">{member.role[lang]}</p>
                  </div>
                </div>
              ))}
              <Link
                href={localePath("/om-os", lang)}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-paper/75 underline decoration-paper/30 underline-offset-4 transition hover:text-paper hover:decoration-paper sm:ml-auto"
              >
                {c.meet}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

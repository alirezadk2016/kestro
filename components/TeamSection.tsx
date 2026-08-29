import { Phone, Mail } from "lucide-react";
import Container from "./Container";
import TeamAvatar from "./TeamAvatar";
import { team, company } from "@/lib/company";
import type { Lang } from "@/lib/i18n";

const copy = {
  da: {
    eyebrow: "Kontaktpersoner",
    title: "Hvem I taler med",
    sub: "Hos os taler I med et menneske – ikke et sagsnummer.",
    write: "Skriv til os",
    at: "hos",
  },
  en: {
    eyebrow: "Who to contact",
    title: "Who you will be talking to",
    sub: "With us you talk to a person, not a case number.",
    write: "Write to us",
    at: "at",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function TeamSection({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="border-y border-white/10 bg-ink-900 py-14 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-paper/65">{c.sub}</p>
        </div>

        <div
          className={`mx-auto mt-10 grid grid-cols-1 gap-6 sm:mt-12 ${
            team.length === 1 ? "max-w-2xl" : "max-w-4xl md:grid-cols-2"
          }`}
        >
          {team.map((member) => (
            <div
              key={member.name}
              className="group relative flex flex-col gap-6 overflow-hidden border border-white/10 bg-white/[0.04] p-6 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] sm:flex-row sm:items-start sm:p-8 sm:text-left"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-brand-400 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />

              <TeamAvatar
                member={member}
                lang={lang}
                size={128}
                tone="quiet"
                rounded="rounded-2xl"
                className="mx-auto h-28 w-28 shadow-sm ring-1 ring-white/10 sm:mx-0 sm:h-32 sm:w-32"
              />

              <div className="min-w-0">
                <h3 className="text-xl font-bold text-paper">{member.name}</h3>
                <p className="mt-1.5 inline-flex items-center rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-300 ring-1 ring-inset ring-brand-400/30">
                  {member.role[lang]}
                </p>
                <p className="mt-4 text-sm leading-6 text-paper/65">{member.bio[lang]}</p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* A direct line only when there is one. Without it, writing
                      becomes the primary action rather than a fallback. */}
                  {member.phoneHref && (
                    <a
                      href={`tel:${member.phoneHref}`}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                      {member.phoneDisplay}
                    </a>
                  )}
                  <a
                    href={`mailto:${member.email ?? company.email}`}
                    className={
                      member.phoneHref
                        ? "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-paper/80 transition hover:border-white/35 hover:bg-white/5"
                        : "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                    }
                  >
                    <Mail
                      className={`h-4 w-4 flex-shrink-0 ${member.phoneHref ? "text-paper/50" : ""}`}
                      strokeWidth={2}
                    />
                    {c.write}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

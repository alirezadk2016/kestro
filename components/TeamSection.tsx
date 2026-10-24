import { Phone, Mail } from "lucide-react";
import Container from "./Container";
import TeamAvatar from "./TeamAvatar";
import { teamFor, company } from "@/lib/company";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";

const copy = {
  da: {
    title: "Hvem I taler med",
    sub: "Hos os taler I med et menneske – ikke et sagsnummer.",
    write: "Skriv til os",
    at: "hos",
  },
  en: {
    title: "Who you will be talking to",
    sub: "With us you talk to a person, not a case number.",
    write: "Write to us",
    at: "at",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function TeamSection({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const team = teamFor(lang);
  return (
    <section className="border-y border-white/10 bg-ink-900 py-12 sm:py-20">
      <Container>
        {/*
         * Left-aligned with the page, three across.
         *
         * This was a centred heading over a centred two-column grid four
         * columns narrow, so its left edge sat 150px in from every other
         * section's, the third person spanned a full row under the first two,
         * each card lifted on hover though none is a link, a coloured stripe
         * ran across the top of each, and the role was a <p> dressed as a
         * secondary button — 44px tall, bordered, with a hover state — which
         * a visitor tried to press. The role is a line of text now.
         */}
        <div className="max-w-2xl">
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-4 text-base leading-[1.75] text-paper/75">{c.sub}</p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            /* id is the anchor target: an article byline links to the real bio. */
            <li key={member.name} id={member.id} className="plate flex flex-col p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <TeamAvatar
                  member={member}
                  lang={lang}
                  size={72}
                  tone="quiet"
                  rounded="rounded-xl"
                  className="h-[72px] w-[72px] flex-none ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <h3 className="font-display t-h3 font-bold tracking-tight text-paper">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold leading-[1.5] text-brand-300">
                    {member.role[lang]}
                  </p>
                </div>
              </div>
              <p className="mt-5 flex-1 text-sm leading-[1.65] text-paper/75">{member.bio[lang]}</p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* A direct line only when there is one. Without it, writing
                    becomes the primary action rather than a fallback. */}
                {member.phoneHref && (
                  <a href={`tel:${member.phoneHref}`} className={buttonClass("primary")}>
                    <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                    {member.phoneDisplay}
                  </a>
                )}
                <a
                  href={`mailto:${member.email ?? company.email}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-paper transition hover:border-white/35 hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-brand-300" strokeWidth={2} />
                  {c.write}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

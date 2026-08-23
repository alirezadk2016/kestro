import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import Container from "./Container";
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
    <section className="border-y border-paper-edge bg-paper-dim py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-600">
            {c.eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {c.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-600">
            {c.sub}
          </p>
        </div>

        <div
          className={`mx-auto mt-10 grid grid-cols-1 gap-6 sm:mt-12 ${
            team.length === 1 ? "max-w-2xl" : "max-w-4xl md:grid-cols-2"
          }`}
        >
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-6 border border-paper-edge bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:p-8 sm:text-left"
            >
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role[lang]} ${c.at} Kestro`}
                width={320}
                height={320}
                className="mx-auto h-36 w-36 flex-shrink-0 rounded-2xl object-cover sm:mx-0 sm:h-40 sm:w-40"
              />

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-ink-900">{member.name}</h3>
                <p className="text-sm font-medium text-brand-700">{member.role[lang]}</p>
                <p className="mt-3 text-sm leading-6 text-ink-600">{member.bio[lang]}</p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <a
                    href={`tel:${member.phoneHref}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                    {member.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${member.email ?? company.email}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-400 hover:bg-white"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0 text-ink-400" strokeWidth={2} />
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

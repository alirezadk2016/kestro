"use client";

import { useState } from "react";
import { Phone, MapPin, Globe2 } from "lucide-react";
import TeamAvatar from "./TeamAvatar";
import { team, company, type TeamMember } from "@/lib/company";
import type { Lang } from "@/lib/i18n";

const copy = {
  da: {
    choose: "Vælg hvem I vil i kontakt med",
    nordic: "Danmark & Norden",
    international: "International",
    callDirect: "Ring direkte til",
    writeDirect: "Skriv direkte til",
    busy: "Har I travlt, eller er det nemmere at tage det over telefonen?",
    lands:
      "Beskeden lander hos den, der skriver tilbuddet – ikke i en supportkø. I får svar inden for én arbejdsdag.",
    mainNumber: "Hovednummer",
  },
  en: {
    choose: "Choose who you want to reach",
    nordic: "Denmark & Nordics",
    international: "International",
    callDirect: "Call",
    writeDirect: "Write directly to",
    busy: "In a hurry, or easier to sort it out over the phone?",
    lands:
      "Your message lands with the person who writes the quote, not in a support queue. You get an answer within one working day.",
    mainNumber: "Main number",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * Two contacts, two markets: Mehdi for Denmark and the Nordics, Ismail for
 * everyone reaching in from abroad. A flip rather than a plain toggle,
 * because the two are not variations on one card — they are two different
 * people to call, and the card should feel like it is turning to reveal one
 * or the other rather than merely relabelling itself.
 */
export default function ContactFlipCard({ lang }: { lang: Lang }) {
  const [showIntl, setShowIntl] = useState(false);
  const c = copy[lang];

  const nordicContact = team.find((member) => member.id === "mehdi") ?? team[0];
  const intlContact = team.find((member) => member.id === "ismail-masoumabadi") ?? team[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label={c.choose}
        className="mb-4 inline-flex w-full rounded-full border border-ink-200 bg-white p-1 text-sm font-semibold text-ink-600 sm:w-auto"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!showIntl}
          onClick={() => setShowIntl(false)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 transition sm:flex-none ${
            !showIntl ? "bg-brand-600 text-white" : "hover:text-ink-900"
          }`}
        >
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          {c.nordic}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showIntl}
          onClick={() => setShowIntl(true)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 transition sm:flex-none ${
            showIntl ? "bg-brand-600 text-white" : "hover:text-ink-900"
          }`}
        >
          <Globe2 className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          {c.international}
        </button>
      </div>

      <div className="[perspective:1600px]">
        <div
          className={`relative min-h-[272px] w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] sm:min-h-[248px] ${
            showIntl ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <Face lang={lang} c={c} member={nordicContact} hidden={showIntl} />
          <Face lang={lang} c={c} member={intlContact} hidden={!showIntl} flipped />
        </div>
      </div>
    </div>
  );
}

function Face({
  lang,
  c,
  member,
  hidden,
  flipped = false,
}: {
  lang: Lang;
  c: (typeof copy)["da"];
  member: TeamMember;
  hidden: boolean;
  flipped?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={`absolute inset-0 flex flex-col border border-paper-edge bg-brand-950 p-6 text-white [backface-visibility:hidden] sm:p-8 ${
        hidden ? "pointer-events-none" : ""
      } ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
    >
      <div className="flex items-center gap-4">
        <TeamAvatar member={member} lang={lang} size={64} className="h-16 w-16" />
        <div>
          <h2 className="text-base font-semibold">
            {member.phoneHref ? c.callDirect : c.writeDirect} {member.name}
          </h2>
          <p className="text-sm text-ink-400">{member.role[lang]}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-300">{member.phoneHref ? c.busy : c.lands}</p>

      <div className="mt-auto pt-4">
        {(member.phoneHref || company.phoneHref) && (
          <a
            href={`tel:${member.phoneHref || company.phoneHref}`}
            tabIndex={hidden ? -1 : undefined}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-ink-900 transition hover:bg-paper-dim sm:w-auto"
          >
            <Phone className="h-5 w-5" strokeWidth={2} />
            {member.phoneDisplay || company.phoneDisplay}
          </a>
        )}

        {member.phoneHref && company.phoneDisplay && (
          <p className="mt-4 border-t border-white/10 pt-4 text-xs text-ink-400">
            {c.mainNumber}: {company.phoneDisplay}
          </p>
        )}
      </div>
    </div>
  );
}

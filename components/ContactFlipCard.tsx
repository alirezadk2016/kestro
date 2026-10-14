"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Globe2 } from "lucide-react";
import TeamAvatar from "./TeamAvatar";
import { team, company, type TeamMember } from "@/lib/company";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";

const copy = {
  da: {
    choose: "Vælg hvem I vil i kontakt med",
    nordic: "Norden",
    international: "International",
    callDirect: "Ring direkte til",
    writeDirect: "Skriv direkte til",
    busy: "Har I travlt, eller er det nemmere at tage det over telefonen?",
    lands:
      "Skriv til vores fælles kontaktadresse med kontaktpersonens navn i emnet. Henvendelsen er uforpligtende.",
    mainNumber: "Hovednummer",
  },
  en: {
    choose: "Choose who you want to reach",
    nordic: "Nordics",
    international: "International",
    callDirect: "Call",
    writeDirect: "Write directly to",
    busy: "In a hurry, or easier to sort it out over the phone?",
    lands:
      "Email our shared contact address with the contact's name in the subject. The enquiry is non-binding.",
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
  /* Opens on the side the reader's own market belongs to: the Danish site is
     read from Scandinavia, so it starts on Mehdi; the English site is read
     from outside it, so it starts on Ismail. Either side is still one tap
     away — this only decides which is face up. */
  const [showIntl, setShowIntl] = useState(lang !== "da");
  const c = copy[lang];

  const nordicContact = team.find((member) => member.id === "mehdi") ?? team[0];
  const intlContact = team.find((member) => member.id === "ismail-masoumabadi") ?? team[0];

  return (
    <div>
      <div
        role="group"
        aria-label={c.choose}
        className="mb-4 inline-flex w-full rounded-full border border-white/15 bg-white/5 p-1 text-sm font-semibold text-paper/75 sm:w-auto"
      >
        <button
          type="button"
          aria-pressed={!showIntl}
          onClick={() => setShowIntl(false)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full min-h-[44px] px-3 py-2 transition sm:flex-none sm:px-4 ${
            !showIntl ? "bg-brand-600 text-white" : "hover:text-paper"
          }`}
        >
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          {c.nordic}
        </button>
        <button
          type="button"
          aria-pressed={showIntl}
          onClick={() => setShowIntl(true)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full min-h-[44px] px-3 py-2 transition sm:flex-none sm:px-4 ${
            showIntl ? "bg-brand-600 text-white" : "hover:text-paper"
          }`}
        >
          <Globe2 className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          {c.international}
        </button>
      </div>

      <div className="[perspective:1600px]">
        <div
          className={`relative grid min-h-[272px] w-full transition-transform duration-700 ease-out motion-reduce:transition-none [transform-style:preserve-3d] sm:min-h-[248px] ${
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
      className={`flex min-w-0 flex-col border border-white/10 bg-brand-950 p-6 text-white [grid-area:1/1] [backface-visibility:hidden] sm:p-8 ${
        hidden ? "pointer-events-none" : ""
      } ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
    >
      <div className="flex items-center gap-4">
        <TeamAvatar member={member} lang={lang} size={64} className="h-16 w-16" />
        <div>
          <h2 className="font-display t-h3 font-bold tracking-tight">
            {member.phoneHref ? c.callDirect : c.writeDirect} {member.name}
          </h2>
          <p className="text-sm text-paper/65 leading-[1.6]">{member.role[lang]}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-[1.6] text-paper/75">
        {member.phoneHref ? c.busy : c.lands}
      </p>

      <div className="mt-auto pt-4">
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent(`${lang === "da" ? "Til" : "For"} ${member.name} - Kestro`)}`}
          tabIndex={hidden ? -1 : undefined}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
        >
          <Mail aria-hidden="true" className="h-4 w-4 flex-none" />
          {company.email}
        </a>
        {(member.phoneHref || company.phoneHref) && (
          <a
            href={`tel:${member.phoneHref || company.phoneHref}`}
            tabIndex={hidden ? -1 : undefined}
            className={`${buttonClass("primary")} mt-4 w-full sm:w-auto`}
          >
            <Phone className="h-5 w-5" strokeWidth={2} />
            {member.phoneDisplay || company.phoneDisplay}
          </a>
        )}

        {member.phoneHref && company.phoneDisplay && (
          <p className="mt-4 border-t border-white/10 pt-4 text-xs text-paper/65 leading-[1.45]">
            {c.mainNumber}: {company.phoneDisplay}
          </p>
        )}
      </div>
    </div>
  );
}

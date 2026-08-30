import Link from "next/link";
import { Plus } from "lucide-react";
import Container from "./Container";
import Logo from "./Logo";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * A logo strip with nobody in it yet.
 *
 * The template this was built from puts real companies' logos here as
 * "trusted by" — Kestro has not delivered to any of them, so that would be a
 * false endorsement as well as a trademark problem. Kestro's own mark fills
 * the first tile instead of leaving the row empty, and the rest are open
 * slots a real client's logo moves into once there is one, rather than a
 * claim standing in for one that does not exist yet.
 */
const copy = {
  da: {
    eyebrow: "Kundelisten",
    title: "Vi bygger den lige nu",
    sub: "Kestro er et ungt firma. Den første plads er vores egen — resten venter på jeres logo.",
    cta: "Bliv den første kunde på listen",
    slot: "Jeres logo her",
  },
  en: {
    eyebrow: "The client list",
    title: "We are building it right now",
    sub: "Kestro is a young company. The first slot is our own — the rest are waiting for your logo.",
    cta: "Be the first client on the list",
    slot: "Your logo here",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function TrustStrip({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <div className="border-y border-white/10 bg-brand-950 py-14 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-4 text-balance font-display text-2xl font-extrabold tracking-display text-paper sm:text-3xl">
            {c.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-paper/60 sm:text-base">{c.sub}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="flex h-20 items-center justify-center border border-white/15 bg-white/[0.04]">
            <Logo className="h-6 w-auto opacity-90" idPrefix="trust" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <Link
              key={i}
              href={localePath("/kontakt", lang)}
              className="group flex h-20 flex-col items-center justify-center gap-1.5 border border-dashed border-white/15 text-paper/35 transition hover:border-brand-400/50 hover:text-brand-300"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              <span className="px-2 text-center text-[11px] leading-tight">{c.slot}</span>
            </Link>
          ))}
        </div>

        <Link
          href={localePath("/kontakt", lang)}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
        >
          {c.cta}
        </Link>
      </Container>
    </div>
  );
}

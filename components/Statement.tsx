import Container from "./Container";
import type { Lang } from "@/lib/i18n";

/*
 * One editorial beat right after the hero. No cards, no icons, no grid — the
 * page needs a moment where the argument is simply stated at size, otherwise
 * every section reads at the same volume.
 */
const copy = {
  da: {
    label: "Vores rolle",
    lead: "Vi holder ikke lager.",
    body: "Det er ikke en mangel – det er hele pointen. En leverandør med et fyldt lager sælger jer det, der står på hylden. Vi køber først, når I ved, hvad I skal bruge, og går efter de specifikationer, opgaven faktisk kræver.",
    kicker: "Derfor kan vi sige nej til en handel, der ikke er god for jer.",
  },
  en: {
    label: "Our role",
    lead: "We hold no stock.",
    body: "That is not a shortcoming — it is the whole point. A supplier with a full warehouse sells you what is on the shelf. We buy only once you know what you need, and go after the specifications the job actually requires.",
    kicker: "Which is why we can turn down a deal that is not good for you.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Statement({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-b border-paper-edge bg-paper py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-600" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-600">
              {c.label}
            </span>
          </div>

          <p className="mt-6 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-ink-900">
            {c.lead}
          </p>
          <p className="mt-6 text-lg leading-8 text-ink-600">{c.body}</p>
          <p className="mt-6 border-l-2 border-brand-600 pl-5 text-base leading-8 text-ink-800">
            {c.kicker}
          </p>
        </div>
      </Container>
    </section>
  );
}

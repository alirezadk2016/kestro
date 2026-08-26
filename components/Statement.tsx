import Link from "next/link";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * One editorial beat right after the hero. No cards, no icons, no grid — the
 * page needs a moment where the argument is simply stated at size, otherwise
 * every section reads at the same volume.
 *
 * The three commitments underneath belong here rather than in a section of
 * their own. A buyer comparing us to a supplier with ten years of history has
 * no reason to take "we hold no stock" as an advantage unless something
 * concrete follows it, and a separate "why us" band would add a screen of
 * scrolling to a page we just spent a pass shortening.
 *
 * Every line is something already documented elsewhere on the site, and each
 * links to the page that documents it. That is the point: a promise a buyer
 * can check in one click is worth more than three that only sound good. Do not
 * add a fourth here that has no page behind it.
 */
const copy = {
  da: {
    label: "Vores rolle",
    lead: "Vi holder ikke lager.",
    body: "Det er ikke en mangel – det er hele pointen. En leverandør med et fyldt lager sælger jer det, der står på hylden. Vi køber først, når I ved, hvad I skal bruge, og går efter de specifikationer, opgaven faktisk kræver.",
    kicker: "Derfor kan vi sige nej til en handel, der ikke er god for jer.",
    promisesLabel: "Det kan I holde os op på",
  },
  en: {
    label: "Our role",
    lead: "We hold no stock.",
    body: "That is not a shortcoming — it is the whole point. A supplier with a full warehouse sells you what is on the shelf. We buy only once you know what you need, and go after the specifications the job actually requires.",
    kicker: "Which is why we can turn down a deal that is not good for you.",
    promisesLabel: "Hold us to these",
  },
} satisfies Record<Lang, Record<string, string>>;

const promises = [
  {
    href: "/ydelser/levering",
    term: { da: "Skriftligt, før I bestiller", en: "In writing, before you order" },
    body: {
      da: "Pris, stand, batteritilstand og garantivilkår per enhed – på skrift, mens I stadig kan sige nej.",
      en: "Price, condition, battery health and warranty terms per unit — on paper, while you can still say no.",
    },
    link: { da: "Hvad der følger med leverancen", en: "What comes with the delivery" },
  },
  {
    href: "/ydelser/nordisk-tilpasning",
    term: { da: "Nordisk tastatur, fysisk skiftet", en: "Nordic keyboard, physically swapped" },
    body: {
      da: "Maskinerne kommer med spansk eller italiensk layout. Tastaturet bliver skiftet – det er ikke en indstilling i Windows.",
      en: "The machines arrive with a Spanish or Italian layout. The keyboard gets changed — it is not a Windows setting.",
    },
    link: { da: "Nordisk tilpasning", en: "Nordic preparation" },
  },
  {
    href: "/ydelser/klargoering-og-test",
    term: { da: "Testet enhed for enhed", en: "Tested unit by unit" },
    body: {
      da: "Hver tast trykkes igennem, og batteriets faktiske kapacitet oplyses i procent – ikke som “OK”.",
      en: "Every key gets pressed through, and the battery’s actual capacity is given as a percentage — not as “OK”.",
    },
    link: { da: "Klargøring og test", en: "Preparation and testing" },
  },
];

export default function Statement({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section
      className="lit lit-paper border-b border-paper-edge bg-paper py-14 sm:py-24"
      data-reveal
    >
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-600" />
            <span className="eyebrow text-brand-600">{c.label}</span>
          </div>

          <p className="mt-6 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-ink-900">
            {c.lead}
          </p>
          <p className="mt-6 text-lg leading-8 text-ink-600">{c.body}</p>
          <p className="mt-6 border-l-2 border-brand-600 pl-5 text-base leading-8 text-ink-800">
            {c.kicker}
          </p>
        </div>

        <p className="label mt-12 text-ink-500 sm:mt-16">{c.promisesLabel}</p>
        <dl className="mt-5 grid grid-cols-1 gap-x-12 border-t border-ink-900/12 sm:grid-cols-3">
          {promises.map((promise) => (
            <div
              key={promise.href}
              className="flex flex-col border-b border-ink-900/10 py-5 sm:h-full sm:border-b-0 sm:py-7"
            >
              <dt className="font-display text-base font-bold leading-snug tracking-tight text-ink-900">
                {promise.term[lang]}
              </dt>
              <dd className="mt-2 flex flex-1 flex-col text-sm leading-6 text-ink-600">
                {promise.body[lang]}
                <Link
                  href={localePath(promise.href, lang)}
                  className="mt-2.5 block self-start text-sm font-semibold text-brand-700 underline decoration-brand-400 decoration-2 underline-offset-4 hover:text-brand-800 sm:mt-auto sm:pt-2.5"
                >
                  {promise.link[lang]}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

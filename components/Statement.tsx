import Link from "next/link";
import Container from "./Container";
import CraftMark, { type CraftMarkName } from "./CraftMark";
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
    mark: "written" as CraftMarkName,
    term: { da: "Skriftligt, før I bestiller", en: "In writing, before you order" },
    body: {
      da: "Pris, stand, batteritilstand og garantivilkår per enhed – på skrift, mens I stadig kan sige nej.",
      en: "Price, condition, battery health and warranty terms per unit — on paper, while you can still say no.",
    },
    link: { da: "Hvad der følger med leverancen", en: "What comes with the delivery" },
  },
  {
    href: "/ydelser/nordisk-tilpasning",
    mark: "nordic" as CraftMarkName,
    term: { da: "Nordisk tastatur, fysisk skiftet", en: "Nordic keyboard, physically swapped" },
    body: {
      da: "Maskinerne kommer med spansk eller italiensk layout. Tastaturet bliver skiftet – det er ikke en indstilling i Windows.",
      en: "The machines arrive with a Spanish or Italian layout. The keyboard gets changed — it is not a Windows setting.",
    },
    link: { da: "Nordisk tilpasning", en: "Nordic preparation" },
  },
  {
    href: "/ydelser/klargoering-og-test",
    mark: "tested" as CraftMarkName,
    term: { da: "Testet enhed for enhed", en: "Tested unit by unit" },
    body: {
      da: "Hver tast trykkes igennem, og vi kan oplyse batteriets faktiske kapacitet i procent – ikke bare som “OK”.",
      en: "Every key gets pressed through, and we can give the battery’s actual capacity as a percentage — not just as “OK”.",
    },
    link: { da: "Klargøring og test", en: "Preparation and testing" },
  },
];

export default function Statement({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="stage py-10 sm:py-20" data-reveal>
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-400" />
            <span className="eyebrow text-brand-300">{c.label}</span>
          </div>

          <p className="mt-6 text-balance font-display t-display font-extrabold tracking-display text-paper">
            {c.lead}
          </p>
          <p className="mt-6 text-base leading-[1.65] sm:text-lg sm:leading-[1.65] text-paper/70">
            {c.body}
          </p>
          <p className="mt-6 border-l-2 border-brand-400 pl-5 text-base leading-[1.75] sm:leading-[1.75] text-paper/90">
            {c.kicker}
          </p>
        </div>

        <p className="label mt-12 text-paper/55 sm:mt-16">{c.promisesLabel}</p>
        {/*
         * Plates on a phone, columns from sm.
         *
         * These are three parallel promises, not a sequence, so a spine would
         * be the wrong device — but stacked and separated by hairlines they
         * read as rows of a table, which is what every flat list on this site
         * was doing on a phone. Three things you can pick up read as three
         * things. From sm the columns come back: at that width the row is
         * already a row and a plate around each one is a box inside a box.
         */}
        <dl className="mt-5 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-0 sm:border-t sm:border-paper/15">
          {promises.map((promise) => (
            <div
              key={promise.href}
              className="plate flex flex-col p-5 sm:h-full sm:bg-none sm:p-0 sm:py-7 sm:shadow-none"
            >
              {/* The mark of the thing being promised, not a bullet. Three
                  paragraphs under one label read as a footnote; the paper, the
                  key and the lens say which promise is which before the words
                  do, and they are the same three marks these claims carry
                  everywhere else on the site. */}
              <span className="mb-4 flex h-10 w-10 items-center justify-center plate-sm rounded-lg bg-brand-500/[0.10] text-paper/90">
                <CraftMark name={promise.mark} className="h-5 w-5" />
              </span>
              <dt className="font-display text-base font-bold leading-snug tracking-tight text-paper">
                {promise.term[lang]}
              </dt>
              <dd className="mt-2 flex flex-1 flex-col text-sm leading-6 text-paper/65">
                {promise.body[lang]}
                <Link
                  href={localePath(promise.href, lang)}
                  className="mt-2.5 block self-start text-sm font-semibold leading-6 text-brand-300 underline decoration-brand-400/60 decoration-2 underline-offset-4 hover:text-paper sm:mt-auto sm:pt-2.5"
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

import Link from "next/link";
import MarkTile from "@/components/MarkTile";
import Container from "./Container";
import { type CraftMarkName } from "./CraftMark";
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
    lead: "Vi holder ikke lager.",
    body: "Det er ikke en mangel – det er hele pointen. En leverandør med et fyldt lager sælger jer det, der står på hylden. Vi køber først, når I ved, hvad I skal bruge, og går efter de specifikationer, opgaven faktisk kræver.",
    kicker: "Derfor kan vi sige nej til en handel, der ikke er god for jer.",
    promisesLabel: "Det kan I holde os op på",
  },
  en: {
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
      da: "Hver tast trykkes igennem, og vi kan oplyse batteriets faktiske kapacitet i procent – ikke bare som »OK«.",
      en: "Every key gets pressed through, and we can give the battery’s actual capacity as a percentage — not just as “OK”.",
    },
    link: { da: "Klargøring og test", en: "Preparation and testing" },
  },
];

export default function Statement({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="stage py-12 sm:py-24">
      <Container>
        {/*
         * The statement on the left, the promises it buys on the right.
         *
         * It was a label, a display line set as a <p>, and then the three
         * promises as three equal columns with a mark above each heading:
         * Hallmark's three-column feature grid and icon-tile card in one row.
         * Now the line is the section's <h2>, and the promises are stacked
         * plates beside it with the mark inline, so the argument and its
         * proof read as one composition rather than a header and a grid.
         */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <h2 className="text-balance font-display t-display font-extrabold tracking-display text-paper">
              {c.lead}
            </h2>
            <p className="mt-6 text-base leading-[1.65] text-paper/70 sm:text-lg sm:leading-[1.65]">
              {c.body}
            </p>
            <p className="mt-6 text-base leading-[1.75] text-paper/90">{c.kicker}</p>
          </div>

          <div className="lg:col-span-6 lg:pt-3">
            <h3 className="label text-paper/55">{c.promisesLabel}</h3>
            <dl className="mt-4 space-y-3">
              {promises.map((promise) => (
                <div key={promise.href} className="plate flex gap-4 p-5 sm:p-6">
                  {/* The mark lives inside the <dt>: a <div> in a <dl> may
                      contain only <dt> and <dd>. */}
                  <dt className="flex-none">
                    <MarkTile name={promise.mark} size="md" />
                    <span className="sr-only">{promise.term[lang]}</span>
                  </dt>
                  <dd className="min-w-0">
                    <p
                      aria-hidden="true"
                      className="font-display text-base font-bold leading-snug tracking-tight text-paper"
                    >
                      {promise.term[lang]}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-paper/65">{promise.body[lang]}</p>
                    <Link
                      href={localePath(promise.href, lang)}
                      className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/60 decoration-2 underline-offset-4 hover:text-paper"
                    >
                      {promise.link[lang]}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
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
    explodedAlt: "En bærbar computer skilt ad i lag: skærm, tastatur, bundkort og bundplade",
  },
  en: {
    lead: "We hold no stock.",
    body: "That is not a shortcoming — it is the whole point. A supplier with a full warehouse sells you what is on the shelf. We buy only once you know what you need, and go after the specifications the job actually requires.",
    kicker: "Which is why we can turn down a deal that is not good for you.",
    promisesLabel: "Hold us to these",
    explodedAlt: "A laptop separated into layers: screen, keyboard, mainboard and base plate",
  },
} satisfies Record<Lang, Record<string, string>>;

const promises = [
  {
    href: "/handelsbetingelser",
    mark: "written" as CraftMarkName,
    term: { da: "I køber hos Kestro", en: "You buy from Kestro" },
    body: {
      da: "Vi skaffer maskinerne hos leverandører i vores netværk, men tilbud, faktura og reklamation går gennem os. Én modpart, ét sæt betingelser.",
      en: "We source the machines from suppliers in our network, but the quote, the invoice and any complaint go through us. One counterparty, one set of terms.",
    },
    link: { da: "Handelsbetingelserne", en: "Terms of sale" },
  },
  {
    href: "/ydelser/nordisk-tilpasning",
    mark: "nordic" as CraftMarkName,
    term: { da: "Dansk eller norsk tastatur", en: "Danish or Norwegian keyboard" },
    /* The result first, the origin second. "The machines arrive with a
       Spanish or Italian layout" as the opening line read as a warning; it
       is the reason the swap exists, not the thing a buyer gets. */
    body: {
      da: "Æ, ø og å trykt på tasterne. Mange maskiner kommer fra Sydeuropa med spansk eller italiensk tastatur, og det skifter vi fysisk før levering – det er ikke en indstilling i Windows.",
      en: "Æ, ø and å printed on the keys. Many machines come from southern Europe with a Spanish or Italian keyboard, and we physically swap it before delivery — it is not a Windows setting.",
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

            {/* The machine opened up, beside the promise that it is tested
                unit by unit. The left column ended a third of the way down
                the plates beside it; this is what fills it, and it is the
                one picture on the page that shows a machine is gone through
                rather than wiped and resold. */}
            <div className="plate-well relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src="/cards/exploded.webp"
                alt={c.explodedAlt}
                fill
                sizes="(min-width: 1024px) 560px, 92vw"
                className="object-cover object-[50%_42%]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-3">
            <h3 className="label text-paper/70">{c.promisesLabel}</h3>
            {/* Each title is written once. The title used to be an sr-only
                copy in the <dt> and an aria-hidden copy in the <dd>, which a
                screen reader handled but a crawler and every text extractor
                read twice: "I køber hos Kestro I køber hos Kestro". Now the
                <dt> carries the mark and the title together, and the <dd>
                is indented under the title so the mark still hangs in the
                margin. */}
            <dl className="mt-4 space-y-3">
              {promises.map((promise) => (
                <div key={promise.href} className="plate p-5 sm:p-6">
                  <dt className="flex items-center gap-4 font-display text-base font-bold leading-snug tracking-tight text-paper">
                    <MarkTile name={promise.mark} size="md" className="flex-none" />
                    {promise.term[lang]}
                  </dt>
                  <dd className="mt-2 sm:pl-[60px]">
                    <p className="text-sm leading-6 text-paper/75">{promise.body[lang]}</p>
                    <Link
                      href={localePath(promise.href, lang)}
                      rel={promise.href === "/handelsbetingelser" ? "terms-of-service" : undefined}
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

import Link from "next/link";
import { buttonClass } from "./Button";
import { ArrowRight, Check, FileText } from "lucide-react";
import Container from "./Container";
import TeamAvatar from "./TeamAvatar";
import { enquiryContacts } from "@/lib/company";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * What stands in front of the closing CTA: the document, and the way to ask
 * for one.
 *
 * This was a logo strip with five empty "your logo here" tiles and a heading
 * that said the client list was still being built. Honest, but it was the last
 * thing a buyer read before deciding whether to write — and what it said was
 * "nobody has bought from us yet". What replaced it is the strongest thing
 * Kestro can show while there are no customers to name: the quote. Price per
 * unit, condition, battery health and warranty terms, in writing, before
 * anyone commits — and a real example of it, one click away.
 *
 * It is the one place on the front page that says "in writing". That promise
 * was made four times down the page, in four phrasings, and repeated it read
 * as a slogan rather than as a fact.
 *
 * The form beside it is real. A panel further up listed "Antal ·
 * Specifikation · Tidsramme" as three bordered rows with icons — the shape of
 * a form with nothing to type into, which a reader clicked and nothing
 * happened. These are the three things that decide a price, as fields, and
 * the form is a plain GET to the quote page, which reads them and fills the
 * same fields in its own form (ContactForm's prefill). Name, company and email
 * are asked there, on the second step, so nothing personal ever travels in a
 * URL. It needs no JavaScript and no new endpoint.
 *
 * Light ground, like the answer block near the top: the two bands on the
 * brand board's light neutral are what give the page its rhythm. Text is
 * ink-600 or darker; the inputs are 16px so a phone does not zoom into them.
 *
 * When there are customers who have agreed to be named, a logo row belongs
 * near here again. Not before. docs/case-study-template.md has the rules.
 */
const copy = {
  da: {
    title: "Alt står skriftligt, mens I stadig kan sige nej",
    sub: "Tilbuddet viser pris per enhed og samlet, den præcise specifikation, stand og batteritilstand per maskine, garantivilkår og hvem I kontakter, hvis noget går i stykker. Det gælder i 14 dage.",
    cta: "Se et rigtigt tilbud",
    points: [
      "Pris per enhed og samlet – ikke kun en totalsum",
      "Stand og batterikapacitet per enhed",
      "Garantivilkår, og hvem der håndterer en fejl",
      "En tidsramme, ikke et løfte vi ikke kan holde",
    ],
    formTitle: "Få en pris på jeres opsætning",
    quantity: "Hvor mange maskiner?",
    model: "Udstyr eller model",
    modelPlaceholder: "Fx bærbare til kontorbrug, eller ThinkPad T14",
    when: "Hvornår skal det stå klar?",
    whenPlaceholder: "Fx inden udgangen af november",
    optional: "(valgfrit)",
    submit: "Fortsæt til tilbuddet",
    next: "Næste trin er navn, virksomhed og e-mail. Det er uforpligtende.",
    who: "Dem I kommer til at tale med",
    meet: "Mød os",
  },
  en: {
    title: "It is all in writing while you can still say no",
    sub: "The quote shows the price per unit and in total, the exact specification, condition and battery health per machine, warranty terms and who to contact if something breaks. It is valid for 14 days.",
    cta: "See a real quote",
    points: [
      "Price per unit and in total — not just a lump sum",
      "Condition and battery capacity per unit",
      "Warranty terms, and who handles a fault",
      "A time frame, not a promise we cannot keep",
    ],
    formTitle: "Get a price for your setup",
    quantity: "How many machines?",
    model: "Equipment or model",
    modelPlaceholder: "E.g. laptops for office use, or ThinkPad T14",
    when: "When does it need to be ready?",
    whenPlaceholder: "E.g. before the end of November",
    optional: "(optional)",
    submit: "Continue to the quote",
    next: "The next step is your name, company and email. Nothing is binding.",
    who: "The people you will be talking to",
    meet: "Meet us",
  },
} satisfies Record<
  Lang,
  {
    title: string;
    sub: string;
    cta: string;
    points: string[];
    formTitle: string;
    quantity: string;
    model: string;
    modelPlaceholder: string;
    when: string;
    whenPlaceholder: string;
    optional: string;
    submit: string;
    next: string;
    who: string;
    meet: string;
  }
>;

/* The quote form's own bands, so a value from here is always one it accepts. */
const quantities = ["1", "2–9", "10–49", "50+"] as const;

const inputClass =
  "block min-h-[48px] w-full rounded-lg border border-ink-300 bg-white px-3.5 text-base text-ink-900 placeholder:text-ink-500 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25";

export default function TrustStrip({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const team = enquiryContacts(lang);

  return (
    <section className="border-y border-ink-200 bg-paper-dim py-14 text-ink-900 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
              {c.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.75] text-ink-700">{c.sub}</p>

            <ul className="mt-6 space-y-3">
              {c.points.map((point) => (
                <li key={point} className="flex gap-3 text-base leading-6 text-ink-800">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 flex-none text-brand-600"
                    strokeWidth={2.5}
                  />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href={localePath("/tilbud-eksempel", lang)}
              className="group mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ink-300 bg-white px-5 text-sm font-semibold text-ink-900 transition hover:border-brand-600 hover:text-brand-700"
            >
              <FileText className="h-4 w-4 text-brand-600" strokeWidth={1.75} aria-hidden="true" />
              {c.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>

            {/* Who answers the form, beside the form. On the front page this
                strip closed a separate call-to-action band that repeated
                "Få et tilbud" a screen below this form; the band is gone from
                this page and the faces moved here, where a buyer deciding
                whether to write actually is. */}
            <div className="mt-10 border-t border-ink-200 pt-6">
              <p className="text-sm font-semibold text-ink-700">{c.who}</p>
              <ul className="mt-4 space-y-4">
                {team.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <TeamAvatar member={member} lang={lang} size={44} className="h-11 w-11" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-[1.5] text-ink-900">{member.name}</p>
                      <p className="text-sm leading-[1.5] text-ink-600">{member.role[lang]}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href={localePath("/om-os", lang)}
                className="group mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-700 underline decoration-brand-600/40 underline-offset-4 hover:text-brand-600"
              >
                {c.meet}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form
              method="get"
              action={localePath("/tilbud", lang)}
              className="sheet p-6 sm:p-8"
              aria-labelledby="quote-start-title"
            >
              <h3
                id="quote-start-title"
                className="font-display text-xl font-extrabold tracking-display text-ink-900 sm:text-2xl"
              >
                {c.formTitle}
              </h3>

              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold text-ink-800">{c.quantity}</legend>
                <div className="flex flex-wrap gap-2">
                  {quantities.map((band) => (
                    /* The radio is visually hidden and the label is the
                       control, so the label carries the checked state and the
                       keyboard focus ring through :has(). */
                    <label
                      key={band}
                      className="inline-flex min-h-[44px] min-w-[64px] cursor-pointer items-center justify-center rounded-lg border border-ink-300 bg-white px-4 text-sm font-semibold tabular-nums text-ink-800 transition hover:border-ink-500 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-800 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600"
                    >
                      <input type="radio" name="antal" value={band} className="sr-only" />
                      {band}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <label htmlFor="quote-start-model" className="mb-1.5 block text-sm font-semibold text-ink-800">
                  {c.model} <span className="font-normal text-ink-600">{c.optional}</span>
                </label>
                <input
                  id="quote-start-model"
                  name="model"
                  type="text"
                  maxLength={120}
                  autoComplete="off"
                  placeholder={c.modelPlaceholder}
                  className={inputClass}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="quote-start-when" className="mb-1.5 block text-sm font-semibold text-ink-800">
                  {c.when} <span className="font-normal text-ink-600">{c.optional}</span>
                </label>
                <input
                  id="quote-start-when"
                  name="hvornaar"
                  type="text"
                  maxLength={120}
                  autoComplete="off"
                  placeholder={c.whenPlaceholder}
                  className={inputClass}
                />
              </div>

              <button type="submit" className={`${buttonClass("primary", "lg")} mt-7 w-full sm:w-auto`}>
                {c.submit}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
              <p className="mt-3 text-sm leading-[1.5] text-ink-600">{c.next}</p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

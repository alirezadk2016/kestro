import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { company } from "@/lib/company";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

/*
 * What a quote from us actually looks like.
 *
 * The site kept promising that price, condition, battery health and warranty
 * arrive in writing before you order. A buyer's fair answer to that is "show
 * me" — and every other way of proving it needs something the company does not
 * have yet: customers to name, references to quote, a year of numbers to
 * average. This needs none of it. The document is the product, so showing the
 * document is the proof.
 *
 * One field is deliberately not filled in. We have no price history to draw an
 * illustrative figure from, and a made-up number in a sample is the number a
 * buyer anchors on — worse than no number, because it is wrong in a specific
 * direction. So the price rows are here, in the right place, marked as the one
 * thing that comes from the actual sourcing. That is also the honest summary
 * of the business: everything else can be promised in advance; the price
 * cannot.
 */

const lines = [
  {
    label: { da: "Model", en: "Model" },
    value: { da: "Lenovo ThinkPad T14 (Gen 2)", en: "Lenovo ThinkPad T14 (Gen 2)" },
  },
  {
    label: { da: "Processor", en: "Processor" },
    value: { da: "Intel Core i5-1135G7", en: "Intel Core i5-1135G7" },
  },
  { label: { da: "Hukommelse", en: "Memory" }, value: { da: "16 GB", en: "16 GB" } },
  {
    label: { da: "Lagring", en: "Storage" },
    value: { da: "512 GB NVMe SSD", en: "512 GB NVMe SSD" },
  },
  { label: { da: "Skærm", en: "Display" }, value: { da: '14" Full HD', en: '14" Full HD' } },
  {
    label: { da: "Kosmetisk stand", en: "Cosmetic condition" },
    value: {
      da: "Grad B – brugsspor på kabinet, ingen skader på skærm",
      en: "Grade B — marks on the chassis, no damage to the screen",
    },
  },
  {
    label: { da: "Batteri", en: "Battery" },
    value: { da: "87 % af oprindelig kapacitet, målt", en: "87 % of original capacity, measured" },
  },
  {
    label: { da: "Tastatur", en: "Keyboard" },
    value: { da: "Dansk – fysisk skiftet", en: "Danish — physically replaced" },
  },
  {
    label: { da: "Styresystem", en: "Operating system" },
    value: { da: "Windows 11 Pro, licens efter aftale", en: "Windows 11 Pro, licence as agreed" },
  },
  {
    label: { da: "Serienummer", en: "Serial number" },
    value: { da: "Oplyses per enhed ved levering", en: "Given per unit on delivery" },
  },
];

const copy = {
  da: {
    metaTitle: "Sådan ser et tilbud fra Kestro ud – eksempel | Kestro",
    metaDescription:
      "Et eksempel på et tilbud på brugt erhvervs-IT: model, stand, målt batterikapacitet, tastatur, garanti og tidsramme – felt for felt.",
    title: "Sådan ser et tilbud ud",
    description:
      "Vi skriver mange steder, at pris, stand, batteritilstand og garantivilkår står skriftligt, før I bestiller. Her er dokumentet, det står i. Det er et eksempel – ikke et tilbud – men felterne er de samme, og de bliver alle sammen udfyldt.",
    docLabel: "Eksempel",
    docTitle: "Tilbud",
    metaRows: [
      { k: "Tilbudsnummer", v: "K-0000 (eksempel)" },
      { k: "Dato", v: "Udfyldes ved afsendelse" },
      { k: "Gyldigt til", v: "14 dage fra dato" },
      { k: "Antal", v: "40 stk." },
    ],
    specTitle: "Per enhed",
    includedTitle: "Med i prisen",
    included: [
      "Funktionstest af skærm, tastatur, batteri, porte og ydeevne.",
      "Opgradering af hukommelse og disk til den aftalte specifikation.",
      "Dansk eller norsk tastatur, fysisk monteret.",
      "Windows sat op med drivere og sprog.",
      "Sletning af lagermediet før klargøring.",
      "Enkeltvis pakning og samlet levering.",
    ],
    excludedTitle: "Ikke med, medmindre det aftales",
    excluded: [
      "Dockingstationer, skærme, kabler og strømforsyninger.",
      "Tasker, mus og eksternt tastatur.",
      "Windows-licenser, hvis I bruger jeres egne.",
      "Opsætning på stedet hos jer.",
    ],
    termsTitle: "Vilkår i tilbuddet",
    terms: [
      {
        k: "Garanti",
        v: "Perioden står her i måneder, sammen med hvem I kontakter, hvis noget går i stykker. Den afhænger af den konkrete leverance, og derfor lover vi ikke et fast tal på forhånd – men tallet står her, før I bestiller.",
      },
      {
        k: "Tidsramme",
        v: "Et interval, ikke en dato. Vi sourcer per ordre, så vi oplyser tidsrammen, når vi ved, hvad der kan skaffes.",
      },
      {
        k: "Dokumentation",
        v: "Serienummer per maskine, og stand og batteritilstand per enhed – ikke per leverance.",
      },
    ],
    priceTitle: "Pris",
    priceRows: [
      { k: "Pris per enhed", v: "—" },
      { k: "Antal", v: "40 stk." },
      { k: "I alt ekskl. moms", v: "—" },
    ],
    priceNote:
      "Det er det eneste felt, vi ikke kan vise jer på forhånd. Vi har ikke lager, så prisen er den, vi kan skaffe udstyret til – og et opdigtet eksempeltal ville bare være et tal, I regner forkert med.",
    priceLink: "Hvad der afgør prisen",
    whyTitle: "Hvorfor alle felterne er der",
    whyBody:
      "Hvert felt herover findes, fordi det er et sted, en handel kan gå galt. “Grad B” uden en beskrivelse siger ingenting. Et batteri, der virker i en test, kan være på 60 % tre måneder senere. En garanti uden et navn på er svær at bruge. Vi skriver dem ned, så I kan holde os op på dem – og så I kan bede andre leverandører om det samme.",
    relatedTitle: "Videre herfra",
    related: [
      { href: "/kvalitet", label: "Stand, test og hvad I bør spørge om" },
      { href: "/priser", label: "Hvad koster det?" },
      { href: "/tilbud", label: "Send jeres krav – få et rigtigt tilbud" },
    ],
  },
  en: {
    metaTitle: "What a quote from Kestro looks like — an example | Kestro",
    metaDescription:
      "An example quote for used business IT: model, condition, measured battery capacity, keyboard, warranty and timeframe — field by field.",
    title: "What a quote looks like",
    description:
      "We say in a lot of places that price, condition, battery health and warranty terms are in writing before you order. This is the document they are written in. It is an example, not an offer — but the fields are the same, and every one of them gets filled in.",
    docLabel: "Example",
    docTitle: "Quote",
    metaRows: [
      { k: "Quote number", v: "K-0000 (example)" },
      { k: "Date", v: "Filled in when sent" },
      { k: "Valid until", v: "14 days from date" },
      { k: "Quantity", v: "40 units" },
    ],
    specTitle: "Per unit",
    includedTitle: "Included in the price",
    included: [
      "Function test of screen, keyboard, battery, ports and performance.",
      "Memory and storage upgraded to the agreed specification.",
      "Danish or Norwegian keyboard, physically fitted.",
      "Windows set up with drivers and language.",
      "Storage medium erased before preparation.",
      "Packed individually and delivered together.",
    ],
    excludedTitle: "Not included unless agreed",
    excluded: [
      "Docking stations, monitors, cables and power supplies.",
      "Bags, mice and external keyboards.",
      "Windows licences, if you are using your own.",
      "Setup on site with you.",
    ],
    termsTitle: "Terms in the quote",
    terms: [
      {
        k: "Warranty",
        v: "The period goes here in months, together with who you contact if something breaks. It depends on the actual order, which is why we do not promise a fixed number in advance — but the number is here before you order.",
      },
      {
        k: "Timeframe",
        v: "A range, not a date. We source per order, so we give the timeframe once we know what can be found.",
      },
      {
        k: "Documentation",
        v: "Serial number per machine, and condition and battery health per unit — not per delivery.",
      },
    ],
    priceTitle: "Price",
    priceRows: [
      { k: "Price per unit", v: "—" },
      { k: "Quantity", v: "40 units" },
      { k: "Total excluding VAT", v: "—" },
    ],
    priceNote:
      "That is the one field we cannot show you in advance. We hold no stock, so the price is what we can source the equipment for — and an invented example figure would just be a number you budget wrongly against.",
    priceLink: "What decides the price",
    whyTitle: "Why every field is there",
    whyBody:
      "Each field above exists because it is somewhere a deal goes wrong. “Grade B” with no description says nothing. A battery that passes a test can be at 60 % three months later. A warranty with no name on it is hard to use. We write them down so you can hold us to them — and so you can ask other suppliers for the same.",
    relatedTitle: "Where to go next",
    related: [
      { href: "/kvalitet", label: "Condition, testing and what to ask about" },
      { href: "/priser", label: "What does it cost?" },
      {
        href: "/tilbud",
        label: "Send your requirements — get a real quote",
      },
    ],
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/tilbud-eksempel", params.lang),
  };
}

export default function SampleQuotePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <>
      {/* In the shared Container like every other page's header. Without it
          the breadcrumb and the h1 started at x=0 while the rest of the site
          sat on the container inset. */}
      <Container>
        <PageHeader
          title={c.title}
          description={c.description}
          lang={lang}
          href="/tilbud-eksempel"
          crumb={lang === "da" ? "Sådan ser et tilbud ud" : "A sample quote"}
        />
      </Container>

      <section className="lit bg-brand-950 py-10 sm:py-20">
        <Container>
          {/*
            Styled as a document rather than as a web section: a buyer is being
            shown a piece of paper they will receive, and it should look like
            one — white, regardless of the dark page around it. The label in
            the corner is not decoration — nothing on this page may be
            mistaken for a live offer.
          */}
          <article className="max-w-3xl border border-ink-900/10 bg-white shadow-lg shadow-black/20">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-900/10 p-6 sm:p-8">
              <div>
                <p className="label text-brand-700">{company.name}</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-display text-ink-900">
                  {c.docTitle}
                </h2>
              </div>
              <span className="border border-brand-600 px-3 py-1 label text-brand-700">
                {c.docLabel}
              </span>
            </header>

            <dl className="grid grid-cols-1 gap-x-8 border-b border-ink-900/10 p-6 sm:grid-cols-2 sm:p-8">
              {c.metaRows.map((row) => (
                <div key={row.k} className="flex justify-between gap-4 py-1.5 text-sm">
                  <dt className="text-ink-500">{row.k}</dt>
                  <dd className="text-right font-medium text-ink-900">{row.v}</dd>
                </div>
              ))}
            </dl>

            <div className="border-b border-ink-900/10 p-6 sm:p-8">
              <h3 className="label text-ink-500">{c.specTitle}</h3>
              <dl className="mt-4">
                {lines.map((line) => (
                  <div
                    key={line.label.da}
                    className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink-900/8 py-2.5 text-sm last:border-b-0"
                  >
                    <dt className="text-ink-600">{line.label[lang]}</dt>
                    <dd className="font-medium text-ink-900">{line.value[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-1 gap-8 border-b border-ink-900/10 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <h3 className="label text-ink-500">{c.includedTitle}</h3>
                <ul className="mt-4 space-y-2">
                  {c.included.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-700">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-3 flex-shrink-0 bg-brand-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="label text-ink-500">{c.excludedTitle}</h3>
                <ul className="mt-4 space-y-2">
                  {c.excluded.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-500">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-3 flex-shrink-0 bg-ink-300"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-b border-ink-900/10 p-6 sm:p-8">
              <h3 className="label text-ink-500">{c.termsTitle}</h3>
              <dl className="mt-4 space-y-4">
                {c.terms.map((term) => (
                  <div key={term.k}>
                    <dt className="font-display text-sm font-bold tracking-tight text-ink-900">
                      {term.k}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-ink-600">{term.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-paper-dim p-6 sm:p-8">
              <h3 className="label text-ink-500">{c.priceTitle}</h3>
              <dl className="mt-4">
                {c.priceRows.map((row, i) => (
                  <div
                    key={row.k}
                    className={`flex justify-between gap-6 py-2 ${
                      i === c.priceRows.length - 1
                        ? "border-t border-ink-900/10 pt-3 font-display text-base font-bold text-ink-900"
                        : "text-sm text-ink-700"
                    }`}
                  >
                    <dt>{row.k}</dt>
                    <dd className="tabular-nums">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-l-2 border-brand-600 pl-4 text-sm leading-6 text-ink-600">
                {c.priceNote}
              </p>
              <Link
                href={localePath("/priser", lang)}
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
              >
                {c.priceLink}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </article>

          <div className="mt-12 max-w-3xl border-t border-white/15 pt-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
              {c.whyTitle}
            </h2>
            <p className="mt-4 text-base leading-7 sm:leading-8 text-paper/65">{c.whyBody}</p>

            <p className="eyebrow mt-10 text-brand-700">{c.relatedTitle}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 px-5 text-sm font-semibold text-paper/80 transition hover:border-white/25 hover:text-paper"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Grad A, B og C på brugt IT-udstyr – hvad betyder det? | Kestro",
    metaDescription:
      "Sådan graderes brugt erhvervsudstyr, hvad en funktionstest dækker, hvordan data slettes, og hvad I altid bør få oplyst, før I bestiller brugt IT til virksomheden.",
    title: "Stand, test og hvad I bør spørge om",
    description:
      "“Brugt” siger ikke i sig selv noget om kvalitet. Her er den gradering, branchen bruger, hvad en ordentlig funktionstest dækker, og hvad I altid bør få oplyst skriftligt – også af os.",
    gradingTitle: "Graderingen: A, B og C",
    gradingBody:
      "Graden beskriver, hvordan maskinen ser ud – ikke hvordan den virker. Alt udstyr skal bestå den samme funktionstest, uanset grad. Nogle leverandører kalder det guld, sølv og bronze, men det dækker over det samme.",
    suits: "Passer til:",
    warning:
      "Der findes ingen fælles standard for, hvad et bogstav betyder. To leverandører kan kalde den samme maskine grad A og grad B. Bed derfor altid om en beskrivelse af standen i ord – ikke bare et bogstav.",
    testTitle: "Hvad en funktionstest skal dække",
    testBody:
      "Det er her, forskellen mellem en billig og en dyr leverandør ligger. En maskine, der “starter op”, er ikke testet. Det her er, hvad vi kræver, før udstyret sendes videre til jer:",
    testNote:
      "Batteriet er det punkt, der oftest bliver sprunget over. Et batteri på 60 % af sin oprindelige kapacitet virker fint i en test og bliver et problem tre måneder senere. Spørg til tallet.",
    dataTitle: "Data på brugt udstyr",
    dataBody1:
      "Både når I køber og når I sælger, er data det punkt, der kan koste dyrt. En formateret disk er ikke en slettet disk. Data skal overskrives efter en anerkendt metode, eller disken skal destrueres fysisk, og der skal følge dokumentation med per enhed – ikke per leverance.",
    dataBody2:
      "Sælger I jeres gamle maskiner, så bed om en sletterapport med serienummer for hver enkelt enhed. Det er det dokument, I skal kunne vise frem, hvis nogen spørger, hvor persondata fra de gamle computere blev af.",
    warrantyTitle: "Garanti",
    warrantyBody1:
      "Garantien på brugt erhvervsudstyr afhænger af, hvem der står bag den enkelte leverance, og hvor gammelt udstyret er. Nogle maskiner har stadig producentens egen garanti; andre dækkes af leverandøren. Derfor lover vi ikke et fast antal måneder på forhånd.",
    warrantyBody2:
      "Til gengæld står garantiperioden altid skriftligt i tilbuddet, sammen med hvem I skal kontakte, hvis noget går i stykker. Får I et tilbud – fra os eller fra andre – hvor det ikke fremgår, så spørg, inden I skriver under.",
    disclosureTitle: "Det får I oplyst, før I bestiller",
    disclosureBody:
      "Vi sourcer per ordre, så vi kender det konkrete udstyr, før I siger ja. Alt herunder står i tilbuddet:",
    notIncludedTitle: "Det følger typisk ikke med som standard",
    notIncludedBody:
      "Strømforsyninger, kabler, dockingstationer, tasker og mus følger sjældent med brugt udstyr, medmindre det er aftalt. Det er den klassiske grund til, at et billigt tilbud pludselig ikke er billigt. Sig det højt fra start, så regner vi det med.",
    cta: "Få et tilbud, der er gennemskueligt",
  },
  en: {
    metaTitle: "Grade A, B and C on used IT equipment — what do they mean? | Kestro",
    metaDescription:
      "How used business equipment is graded, what a function test covers, how data is erased, and what you should always be told before ordering used IT for your company.",
    title: "Condition, testing and what to ask about",
    description:
      "“Used” says nothing about quality on its own. Here is the grading the industry uses, what a proper function test covers, and what you should always get in writing — from us as well.",
    gradingTitle: "The grading: A, B and C",
    gradingBody:
      "The grade describes how the machine looks — not how it works. All equipment has to pass the same function test, whatever the grade. Some suppliers call it gold, silver and bronze, but it means the same thing.",
    suits: "Suits:",
    warning:
      "There is no shared standard for what a letter means. Two suppliers can call the same machine grade A and grade B. So always ask for the condition described in words — not just a letter.",
    testTitle: "What a function test has to cover",
    testBody:
      "This is where a cheap supplier and a good one differ. A machine that “boots up” has not been tested. This is what we require before equipment is passed on to you:",
    testNote:
      "The battery is the point that gets skipped most often. A battery at 60% of its original capacity works fine in a test and becomes a problem three months later. Ask for the number.",
    dataTitle: "Data on used equipment",
    dataBody1:
      "Both when you buy and when you sell, data is the thing that can get expensive. A formatted disk is not an erased disk. Data has to be overwritten by a recognised method, or the disk destroyed physically, and documentation has to follow per device — not per delivery.",
    dataBody2:
      "If you are selling your old machines, ask for an erasure report with a serial number for each individual device. That is the document you need to be able to produce if anyone asks where the personal data from the old computers went.",
    warrantyTitle: "Warranty",
    warrantyBody1:
      "The warranty on used business equipment depends on who stands behind the individual delivery and how old the equipment is. Some machines still carry the manufacturer's own warranty; others are covered by the supplier. That is why we do not promise a fixed number of months up front.",
    warrantyBody2:
      "What we do is put the warranty period in writing in the quote, along with who to contact if something breaks. If you get a quote — from us or anyone else — where that is missing, ask before you sign.",
    disclosureTitle: "What you are told before you order",
    disclosureBody:
      "We source per order, so we know the specific equipment before you say yes. Everything below is in the quote:",
    notIncludedTitle: "What is usually not included as standard",
    notIncludedBody:
      "Power supplies, cables, docking stations, bags and mice rarely come with used equipment unless it has been agreed. That is the classic reason a cheap quote suddenly is not cheap. Say it up front and we will include it.",
    cta: "Get a quote you can see through",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/kvalitet", params.lang),
  };
}

const grades = [
  {
    grade: { da: "Grad A", en: "Grade A" },
    label: { da: "Som ny", en: "Like new" },
    description: {
      da: "Få eller ingen synlige brugsspor. På en armslængdes afstand ser maskinen ud som ny. Det er den dyreste grad, og forskellen til grad B er udelukkende kosmetisk.",
      en: "Few or no visible marks. At arm's length the machine looks new. It is the most expensive grade, and the difference from grade B is purely cosmetic.",
    },
    suits: {
      da: "Ledelse, salg og medarbejdere, der sidder over for kunder.",
      en: "Management, sales and staff who sit across from customers.",
    },
  },
  {
    grade: { da: "Grad B", en: "Grade B" },
    label: { da: "Lette brugsspor", en: "Light marks" },
    description: {
      da: "Synlige, men små brugsspor: lette ridser på låg eller håndledsstøtte, måske en blank tast. Skærmen er uden fejl, og maskinen fungerer som en grad A.",
      en: "Visible but small marks: light scratches on the lid or palm rest, perhaps a shiny key. The screen is flawless and the machine performs like a grade A.",
    },
    suits: {
      da: "Den typiske erhvervsmaskine. Her ligger det bedste forhold mellem pris og stand.",
      en: "The typical business machine. This is where price and condition balance best.",
    },
  },
  {
    grade: { da: "Grad C", en: "Grade C" },
    label: { da: "Tydelige brugsspor", en: "Clear marks" },
    description: {
      da: "Ridser, buler eller misfarvning, man lægger mærke til. Maskinen er stadig fuldt funktionsdygtig og testet på samme måde som de øvrige.",
      en: "Scratches, dents or discolouration you notice. The machine is still fully functional and tested exactly like the others.",
    },
    suits: {
      da: "Lager, produktion, værksted og arbejdspladser, hvor udstyret alligevel får hårde vilkår.",
      en: "Warehouse, production, workshop and any desk where the equipment gets rough treatment anyway.",
    },
  },
];

const testPoints = [
  {
    da: "Batteriets faktiske kapacitet målt op mod ny – ikke bare “virker”",
    en: "The battery's actual capacity measured against new — not just “it works”",
  },
  {
    da: "Skærmen tjekkes for døde pixels, indbrændinger og lysforskelle",
    en: "The screen checked for dead pixels, burn-in and brightness differences",
  },
  {
    da: "Alle taster, trackpad og eventuel trackpoint",
    en: "Every key, the trackpad and the TrackPoint where fitted",
  },
  {
    da: "Samtlige porte: USB, HDMI, netværk, lyd og kortlæser",
    en: "All ports: USB, HDMI, Ethernet, audio and card reader",
  },
  {
    da: "Wi-Fi, Bluetooth, kamera, mikrofon og højttalere",
    en: "Wi-Fi, Bluetooth, camera, microphone and speakers",
  },
  {
    da: "Blæser og temperatur under belastning",
    en: "Fan and temperature under load",
  },
  {
    da: "Diskens tilstand og resterende levetid (SMART-data)",
    en: "The disk's condition and remaining life (SMART data)",
  },
  {
    da: "BIOS nulstillet og fri for adgangskoder fra tidligere ejer",
    en: "BIOS reset and free of passwords from the previous owner",
  },
];

const disclosure = [
  {
    da: "Hvilken grad maskinerne har – og hvad det dækker over",
    en: "Which grade the machines are — and what that covers",
  },
  {
    da: "Batteriets tilstand i procent af ny kapacitet",
    en: "The battery's condition as a percentage of new capacity",
  },
  {
    da: "Den konkrete konfiguration: processor, hukommelse, disk og skærm",
    en: "The specific configuration: processor, memory, disk and screen",
  },
  {
    da: "Hvilket tastaturlayout maskinerne leveres med",
    en: "Which keyboard layout the machines are delivered with",
  },
  {
    da: "Hvilken Windows-licens der følger med, og hvordan den er knyttet til maskinen",
    en: "Which Windows licence is included and how it is tied to the machine",
  },
  {
    da: "Hvad der er i kassen: strømforsyning, kabler, dock eller taske",
    en: "What is in the box: power supply, cables, dock or bag",
  },
  {
    da: "Garantiperioden og hvem der håndterer en fejl, hvis den opstår",
    en: "The warranty period and who handles a fault if one appears",
  },
];

export default function KvalitetPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.gradingTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-ink-600">{c.gradingBody}</p>

            <div className="mt-8 space-y-4">
              {grades.map((grade) => (
                <div
                  key={grade.grade.da}
                  className="border border-paper-edge bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-ink-900">{grade.grade[lang]}</h3>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                      {grade.label[lang]}
                    </span>
                  </div>
                  <p className="mt-3 text-base leading-7 text-ink-600">{grade.description[lang]}</p>
                  <p className="mt-3 text-sm leading-6 text-ink-500">
                    <span className="font-semibold text-ink-700">{c.suits}</span> {grade.suits[lang]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 border-l-2 border-ink-900 bg-paper-dim p-5">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-ink-700" strokeWidth={2} />
              <p className="text-sm leading-6 text-ink-700">{c.warning}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-paper-edge bg-paper-dim py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.testTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-ink-600">{c.testBody}</p>

            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {testPoints.map((point) => (
                <li key={point.da} className="flex gap-3 text-sm leading-6 text-ink-600">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-accent-500" strokeWidth={2.5} />
                  {point[lang]}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-6 text-ink-500">{c.testNote}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.dataTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-600">{c.dataBody1}</p>
            <p className="mt-4 text-base leading-7 text-ink-600">{c.dataBody2}</p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.warrantyTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-600">{c.warrantyBody1}</p>
            <p className="mt-4 text-base leading-7 text-ink-600">{c.warrantyBody2}</p>
          </div>
        </Container>
      </section>

      <section className="border-t border-paper-edge bg-paper-dim py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.disclosureTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-ink-600">{c.disclosureBody}</p>

            <ul className="mt-8 space-y-3">
              {disclosure.map((item) => (
                <li key={item.da} className="flex gap-3 text-base leading-7 text-ink-600">
                  <Check className="mt-1.5 h-5 w-5 flex-shrink-0 text-accent-500" strokeWidth={2} />
                  {item[lang]}
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-paper-edge bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-ink-900">
                {c.notIncludedTitle}
              </h3>
              <p className="mt-2 text-base leading-7 text-ink-600">{c.notIncludedBody}</p>
              <Link
                href={localePath("/kontakt", lang)}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-brand-950 px-7 text-base font-semibold tracking-tight text-paper transition hover:bg-brand-800"
              >
                {c.cta}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

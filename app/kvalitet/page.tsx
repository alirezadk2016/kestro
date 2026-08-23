import type { Metadata } from "next";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Grad A, B og C på brugt IT-udstyr – hvad betyder det? | Kestro",
  description:
    "Sådan graderes brugt erhvervsudstyr, hvad en funktionstest dækker, hvordan data slettes, og hvad I altid bør få oplyst, før I bestiller brugt IT til virksomheden.",
  alternates: { canonical: "/kvalitet" },
};

const grades = [
  {
    grade: "Grad A",
    label: "Som ny",
    description:
      "Få eller ingen synlige brugsspor. På en armslængdes afstand ser maskinen ud som ny. Det er den dyreste grad, og forskellen til grad B er udelukkende kosmetisk.",
    suits: "Ledelse, salg og medarbejdere, der sidder over for kunder.",
  },
  {
    grade: "Grad B",
    label: "Lette brugsspor",
    description:
      "Synlige, men små brugsspor: lette ridser på låg eller håndledsstøtte, måske en blank tast. Skærmen er uden fejl, og maskinen fungerer som en grad A.",
    suits: "Den typiske erhvervsmaskine. Her ligger det bedste forhold mellem pris og stand.",
  },
  {
    grade: "Grad C",
    label: "Tydelige brugsspor",
    description:
      "Ridser, buler eller misfarvning, man lægger mærke til. Maskinen er stadig fuldt funktionsdygtig og testet på samme måde som de øvrige.",
    suits: "Lager, produktion, værksted og arbejdspladser, hvor udstyret alligevel får hårde vilkår.",
  },
];

const testPoints = [
  "Batteriets faktiske kapacitet målt op mod ny – ikke bare “virker”",
  "Skærmen tjekkes for døde pixels, indbrændinger og lysforskelle",
  "Alle taster, trackpad og eventuel trackpoint",
  "Samtlige porte: USB, HDMI, netværk, lyd og kortlæser",
  "Wi-Fi, Bluetooth, kamera, mikrofon og højttalere",
  "Blæser og temperatur under belastning",
  "Diskens tilstand og resterende levetid (SMART-data)",
  "BIOS nulstillet og fri for adgangskoder fra tidligere ejer",
];

const disclosure = [
  "Hvilken grad maskinerne har – og hvad det dækker over",
  "Batteriets tilstand i procent af ny kapacitet",
  "Den konkrete konfiguration: processor, hukommelse, disk og skærm",
  "Hvilket tastaturlayout maskinerne leveres med",
  "Hvilken Windows-licens der følger med, og hvordan den er knyttet til maskinen",
  "Hvad der er i kassen: strømforsyning, kabler, dock eller taske",
  "Garantiperioden og hvem der håndterer en fejl, hvis den opstår",
];

export default function KvalitetPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Stand, test og hvad I bør spørge om"
            description="“Brugt” siger ikke i sig selv noget om kvalitet. Her er den gradering, branchen bruger, hvad en ordentlig funktionstest dækker, og hvad I altid bør få oplyst skriftligt – også af os."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Graderingen: A, B og C
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Graden beskriver, hvordan maskinen <em>ser ud</em> – ikke hvordan den virker. Alt
              udstyr skal bestå den samme funktionstest, uanset grad. Nogle leverandører kalder det
              guld, sølv og bronze, men det dækker over det samme.
            </p>

            <div className="mt-8 space-y-4">
              {grades.map((grade) => (
                <div
                  key={grade.grade}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{grade.grade}</h3>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                      {grade.label}
                    </span>
                  </div>
                  <p className="mt-3 text-base leading-7 text-slate-600">{grade.description}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    <span className="font-semibold text-slate-700">Passer til:</span> {grade.suits}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" strokeWidth={2} />
              <p className="text-sm leading-6 text-slate-700">
                Der findes ingen fælles standard for, hvad et bogstav betyder. To leverandører kan
                kalde den samme maskine grad A og grad B. Bed derfor altid om en beskrivelse af
                standen i ord – ikke bare et bogstav.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Hvad en funktionstest skal dække
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Det er her, forskellen mellem en billig og en dyr leverandør ligger. En maskine, der
              “starter op”, er ikke testet. Det her er, hvad vi kræver, før udstyret sendes videre
              til jer:
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {testPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-brand-600" strokeWidth={2.5} />
                  {point}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-6 text-slate-500">
              Batteriet er det punkt, der oftest bliver sprunget over. Et batteri på 60 % af sin
              oprindelige kapacitet virker fint i en test og bliver et problem tre måneder senere.
              Spørg til tallet.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Data på brugt udstyr
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Både når I køber og når I sælger, er data det punkt, der kan koste dyrt. En formateret
              disk er ikke en slettet disk. Data skal overskrives efter en anerkendt metode, eller
              disken skal destrueres fysisk, og der skal følge dokumentation med per enhed – ikke
              per leverance.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Sælger I jeres gamle maskiner, så bed om en sletterapport med serienummer for hver
              enkelt enhed. Det er det dokument, I skal kunne vise frem, hvis nogen spørger, hvor
              persondata fra de gamle computere blev af.
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Garanti
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Garantien på brugt erhvervsudstyr afhænger af, hvem der står bag den enkelte
              leverance, og hvor gammelt udstyret er. Nogle maskiner har stadig producentens egen
              garanti; andre dækkes af leverandøren. Derfor lover vi ikke et fast antal måneder på
              forhånd.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Til gengæld står garantiperioden altid skriftligt i tilbuddet, sammen med hvem I skal
              kontakte, hvis noget går i stykker. Får I et tilbud – fra os eller fra andre – hvor
              det ikke fremgår, så spørg, inden I skriver under.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Det får I oplyst, før I bestiller
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Vi sourcer per ordre, så vi kender det konkrete udstyr, før I siger ja. Alt herunder
              står i tilbuddet:
            </p>

            <ul className="mt-8 space-y-3">
              {disclosure.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
                  <Check className="mt-1.5 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-slate-900">
                Det følger typisk ikke med som standard
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Strømforsyninger, kabler, dockingstationer, tasker og mus følger sjældent med brugt
                udstyr, medmindre det er aftalt. Det er den klassiske grund til, at et billigt
                tilbud pludselig ikke er billigt. Sig det højt fra start, så regner vi det med.
              </p>
              <Link
                href="/kontakt"
                className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-600 px-6 text-base font-semibold text-white transition hover:bg-brand-700"
              >
                Få et tilbud, der er gennemskueligt
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Layers,
  Cpu,
  Repeat,
  CalendarClock,
  FileSpreadsheet,
  ArrowRight,
  Phone,
  MonitorCog,
  Keyboard,
} from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import { team } from "@/lib/company";

export const metadata: Metadata = {
  title: "Flådeløsninger – udstyr hele virksomheden | Kestro",
  description:
    "Skal I udstyre et helt team eller hele virksomheden? Kestro leverer renoverede erhvervscomputere i større antal, med ensartet opsætning, opgraderet RAM og mulighed for at bytte jeres gamle udstyr ind.",
  alternates: { canonical: "/flaadeloesninger" },
};

const capabilities = [
  {
    icon: Layers,
    title: "Ensartet opsætning på tværs af flåden",
    description:
      "Én konfiguration til hele holdet gør support og udrulning enklere. Vi leverer samme model og specifikationer i hele leverancen, så jeres IT-afdeling ikke skal håndtere ti forskellige maskiner.",
  },
  {
    icon: Cpu,
    title: "Specifikationer tilpasset opgaven",
    description:
      "I bestemmer niveauet: mere RAM til de tunge brugere, større SSD, bedre skærm. Vi kan også prioritere modeller, der er nemme at opgradere senere, så maskinen kan følge med i flere år.",
  },
  {
    icon: Users,
    title: "Fra enkelte teams til hele virksomheden",
    description:
      "Om det er ti maskiner til et nyt team eller udskiftning af hele medarbejderflåden, tilpasser vi sourcingen til antallet. Fortæl os omfanget, så vender vi tilbage med, hvad vi kan skaffe.",
  },
  {
    icon: MonitorCog,
    title: "Windows, software og licenser",
    description:
      "Maskinerne leveres med Windows installeret, drivere på plads og dansk sprogopsætning. Vi hjælper med at få licenserne i orden – eller bruger jeres eksisterende aftaler – så flåden kører lovligt fra dag ét.",
  },
  {
    icon: Keyboard,
    title: "Nordisk tastatur i hele leverancen",
    description:
      "Importerede maskiner får skiftet tastatur til dansk/nordisk layout, så medarbejderne ikke skal lede efter æ, ø og å på maskiner købt i udlandet.",
  },
  {
    icon: CalendarClock,
    title: "Løbende leverance til nye medarbejdere",
    description:
      "Vokser I, kan vi holde en aftalt konfiguration ved lige, så nye medarbejdere får samme opsætning som resten – uden at I skal starte forfra med et indkøb hver gang.",
  },
];

const tradeInSteps = [
  {
    title: "I sender en oversigt",
    description:
      "Antal enheder, modeller og cirka alder på det, I skal af med – og hvad I har brug for i stedet.",
  },
  {
    title: "Vi regner begge veje",
    description:
      "I får både et bud på jeres gamle udstyr og en pris på det nye. Værdien af det gamle kan modregnes i det nye indkøb.",
  },
  {
    title: "Afhentning og datasletning",
    description:
      "Vi henter det gamle udstyr og sletter alle data, før enhederne klargøres til videresalg.",
  },
  {
    title: "Levering af den nye flåde",
    description:
      "De nye maskiner leveres testet og klargjort med dansk/nordisk tastatur, klar til udlevering.",
  },
];

const enterpriseFaqs = [
  {
    question: "Hvor mange enheder kan I levere?",
    answer:
      "Vi sourcer til den enkelte ordre frem for at sælge fra et fast lager, så antallet afhænger af, hvad der kan skaffes til den ønskede specifikation og tidsramme. Fortæl os omfanget, så melder vi konkret tilbage på, hvad vi kan levere og hvornår.",
  },
  {
    question: "Kan vi få samme model til alle medarbejdere?",
    answer:
      "Ja, det er typisk det, større kunder ønsker. Vi går efter én konfiguration i hele leverancen, så support og udrulning bliver enklere. Er en enkelt model ikke tilgængelig i det antal, foreslår vi nærmeste alternativ, før vi går videre.",
  },
  {
    question: "Kan vi selv bestemme RAM og lagring?",
    answer:
      "Ja. Vi opgraderer RAM og kan tilpasse lagring efter jeres behov. Skal maskinerne kunne opgraderes yderligere senere, prioriterer vi modeller, hvor det er muligt – sig til, hvis det er et krav.",
  },
  {
    question: "Kan vi bytte vores gamle udstyr ind?",
    answer:
      "Ja. Vi køber brugt erhvervsudstyr, og værdien kan modregnes i et nyt indkøb, så I både slipper for det gamle og får det nye i én aftale.",
  },
  {
    question: "Laver I løbende aftaler frem for enkeltordrer?",
    answer:
      "Ja, det kan vi aftale. Har I løbende behov – f.eks. maskiner til nye medarbejdere – kan vi holde en fast konfiguration ved lige, så I ikke skal specificere det forfra hver gang.",
  },
  {
    question: "Leveres maskinerne med Windows og licenser?",
    answer:
      "Ja. Maskinerne kan leveres med Windows installeret, drivere og dansk sprogopsætning. Har I egne licensaftaler eller et image, I ruller ud, bruger vi dem – ellers hjælper vi med at få licenserne på plads, så flåden kører lovligt.",
  },
  {
    question: "Kan I skifte tastaturet til dansk layout på hele leverancen?",
    answer:
      "Ja. Det er en fast del af klargøringen, når maskinerne kommer fra udlandet – så medarbejderne ikke skal lede efter æ, ø og å.",
  },
  {
    question: "Hvad med garanti og fakturering?",
    answer:
      "Garantivilkår og betalingsbetingelser aftaler vi ud fra ordrens omfang. Vi gennemgår det med jer, før I binder jer til noget.",
  },
];

export default function FlaadeloesningerPage() {
  return (
    <>
      <section className="bg-slate-900 py-14 text-white sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
              Til større virksomheder
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Udstyr hele virksomheden
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Skal alle medarbejdere have en computer – eller skal hele flåden skiftes ud? Vi
              leverer renoverede erhvervsmaskiner i større antal, med den opsætning I vælger, og
              tager gerne jeres gamle udstyr i bytte.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="#forespoergsel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Send en forespørgsel
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <a
                href={`tel:${team[0].phoneHref}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4" strokeWidth={2} />
                {team[0].phoneDisplay}
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400">
              <Image
                src={team[0].photo}
                alt={`${team[0].name}, ${team[0].role} hos Kestro`}
                width={80}
                height={80}
                className="h-10 w-10 rounded-full object-cover object-top"
              />
              <span>
                Tal med <span className="font-semibold text-white">{team[0].name}</span>,{" "}
                {team[0].role.toLowerCase()}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Til flådeindkøb
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Det, større indkøb kræver
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Bytteordning
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ud med det gamle, ind med det nye – i én aftale
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Når en virksomhed skifter flåde, står den typisk med to opgaver: at skaffe det nye og
              at komme af med det gamle. Vi kan håndtere begge dele. Værdien af jeres brugte udstyr
              kan modregnes i det nye indkøb, så I får én samlet aftale i stedet for to forløb.
            </p>

            <ol className="mt-10 space-y-6">
              {tradeInSteps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-base leading-7 text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/saelg-til-os"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Læs mere om, hvad vi køber
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section id="forespoergsel" className="scroll-mt-24 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <FileSpreadsheet className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Send jeres forespørgsel
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Jo mere I skriver om antal, ønsket specifikation og tidsramme, jo hurtigere kan vi
                  vende tilbage med noget konkret. Har I en liste over det udstyr, I skal af med,
                  må I meget gerne nævne det – så regner vi på begge dele.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm
                subjectPrefix="Flådeforespørgsel"
                messagePlaceholder="Fx: 120 bærbare til kontorbrug, min. 16 GB RAM og 512 GB SSD, gerne opgraderbare. Vi skal samtidig af med ca. 100 ældre maskiner. Ønsket levering: inden udgangen af næste kvartal."
              />
            </div>
          </div>
        </Container>
      </section>

      <div className="border-t border-slate-200 bg-slate-50">
        <Faq items={enterpriseFaqs} title="Spørgsmål om større ordrer" />
      </div>

      <section className="relative overflow-hidden bg-slate-900 py-14 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl"
        />
        <Container className="relative flex flex-col items-center gap-5 text-center">
          <Repeat className="h-8 w-8 text-brand-400" strokeWidth={1.75} />
          <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Skal vi regne på jeres flåde?
          </h2>
          <p className="max-w-xl text-base leading-7 text-slate-400">
            Ring, eller send en forespørgsel med antal og ønsket specifikation – så vender vi
            tilbage med, hvad vi kan skaffe.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href={`tel:${team[0].phoneHref}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              {team[0].phoneDisplay}
            </a>
            <Link
              href="#forespoergsel"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Send forespørgsel
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

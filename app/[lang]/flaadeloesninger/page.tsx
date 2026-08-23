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
import { localePath, alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Flådeløsninger – udstyr hele virksomheden | Kestro",
    metaDescription:
      "Skal I udstyre et helt team eller hele virksomheden? Kestro leverer renoverede erhvervscomputere i større antal, med ensartet opsætning, opgraderet RAM og mulighed for at bytte jeres gamle udstyr ind.",
    badge: "Til større virksomheder",
    title: "Udstyr hele virksomheden",
    intro:
      "Skal alle medarbejdere have en computer – eller skal hele flåden skiftes ud? Vi leverer renoverede erhvervsmaskiner i større antal, med den opsætning I vælger, og tager gerne jeres gamle udstyr i bytte.",
    sendEnquiry: "Send en forespørgsel",
    talkTo: "Tal med",
    eyebrow: "Til flådeindkøb",
    capabilitiesTitle: "Det, større indkøb kræver",
    tradeEyebrow: "Bytteordning",
    tradeTitle: "Ud med det gamle, ind med det nye – i én aftale",
    tradeBody:
      "Når en virksomhed skifter flåde, står den typisk med to opgaver: at skaffe det nye og at komme af med det gamle. Vi kan håndtere begge dele. Værdien af jeres brugte udstyr kan modregnes i det nye indkøb, så I får én samlet aftale i stedet for to forløb.",
    tradeLink: "Læs mere om, hvad vi køber",
    formTitle: "Send jeres forespørgsel",
    formBody:
      "Jo mere I skriver om antal, ønsket specifikation og tidsramme, jo hurtigere kan vi vende tilbage med noget konkret. Har I en liste over det udstyr, I skal af med, må I meget gerne nævne det – så regner vi på begge dele.",
    faqTitle: "Spørgsmål om større ordrer",
    ctaTitle: "Skal vi regne på jeres flåde?",
    ctaBody:
      "Ring, eller send en forespørgsel med antal og ønsket specifikation – så vender vi tilbage med, hvad vi kan skaffe.",
    ctaButton: "Send forespørgsel",
  },
  en: {
    metaTitle: "Fleet solutions — equip the whole company | Kestro",
    metaDescription:
      "Need to equip a whole team or the entire company? Kestro delivers refurbished business computers in volume, with a uniform configuration, upgraded memory and the option to trade your old equipment in.",
    badge: "For larger companies",
    title: "Equip the whole company",
    intro:
      "Does every employee need a computer — or does the whole fleet need replacing? We deliver refurbished business machines in volume, with the configuration you choose, and we are happy to take your old equipment in part exchange.",
    sendEnquiry: "Send an enquiry",
    talkTo: "Talk to",
    eyebrow: "For fleet purchases",
    capabilitiesTitle: "What a larger purchase actually needs",
    tradeEyebrow: "Trade-in",
    tradeTitle: "Old out, new in — in one agreement",
    tradeBody:
      "When a company changes its fleet, it usually faces two jobs: getting the new machines and getting rid of the old ones. We can handle both. The value of your used equipment can be offset against the new purchase, so you get one agreement instead of two processes.",
    tradeLink: "Read more about what we buy",
    formTitle: "Send us your enquiry",
    formBody:
      "The more you tell us about quantity, the specification you want and your timing, the faster we can come back with something concrete. If you have a list of the equipment you need to get rid of, mention it — then we can price both sides.",
    faqTitle: "Questions about larger orders",
    ctaTitle: "Shall we price up your fleet?",
    ctaBody:
      "Call, or send an enquiry with quantity and the specification you want — and we will come back with what we can source.",
    ctaButton: "Send enquiry",
  },
} satisfies Record<Lang, Record<string, string>>;

const formCopy = {
  subjectPrefix: { da: "Flådeforespørgsel", en: "Fleet enquiry" },
  messagePlaceholder: {
    da: "Fx: 120 bærbare til kontorbrug, min. 16 GB RAM og 512 GB SSD, gerne opgraderbare. Vi skal samtidig af med ca. 100 ældre maskiner. Ønsket levering: inden udgangen af næste kvartal.",
    en: "For example: 120 laptops for office use, at least 16 GB memory and a 512 GB SSD, ideally upgradable. We also need to get rid of about 100 older machines. Wanted delivery: before the end of next quarter.",
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/flaadeloesninger", params.lang),
  };
}

const capabilities = [
  {
    icon: Layers,
    title: {
      da: "Ensartet opsætning på tværs af flåden",
      en: "One configuration across the fleet",
    },
    description: {
      da: "Én konfiguration til hele holdet gør support og udrulning enklere. Vi leverer samme model og specifikationer i hele leverancen, så jeres IT-afdeling ikke skal håndtere ti forskellige maskiner.",
      en: "One configuration for the whole team makes support and rollout simpler. We deliver the same model and specification throughout, so your IT people are not handling ten different machines.",
    },
  },
  {
    icon: Cpu,
    title: {
      da: "Specifikationer tilpasset opgaven",
      en: "Specifications matched to the work",
    },
    description: {
      da: "I bestemmer niveauet: mere RAM til de tunge brugere, større SSD, bedre skærm. Vi kan også prioritere modeller, der er nemme at opgradere senere, så maskinen kan følge med i flere år.",
      en: "You set the level: more memory for the heavy users, a larger disk, a better screen. We can also favour models that are easy to upgrade later, so the machine keeps up for a few more years.",
    },
  },
  {
    icon: Users,
    title: {
      da: "Fra enkelte teams til hele virksomheden",
      en: "From a single team to the whole company",
    },
    description: {
      da: "Om det er ti maskiner til et nyt team eller udskiftning af hele medarbejderflåden, tilpasser vi sourcingen til antallet. Fortæl os omfanget, så vender vi tilbage med, hvad vi kan skaffe.",
      en: "Whether it is ten machines for a new team or replacing the entire staff fleet, we scale the sourcing to the quantity. Tell us the scope and we will come back with what we can get.",
    },
  },
  {
    icon: MonitorCog,
    title: { da: "Windows, software og licenser", en: "Windows, software and licences" },
    description: {
      da: "Maskinerne leveres med Windows installeret, drivere på plads og dansk sprogopsætning. Vi hjælper med at få licenserne i orden – eller bruger jeres eksisterende aftaler – så flåden kører lovligt fra dag ét.",
      en: "Machines arrive with Windows installed, drivers in place and the right language settings. We help get the licences in order — or work with the agreements you already have — so the fleet runs legally from day one.",
    },
  },
  {
    icon: Keyboard,
    title: {
      da: "Nordisk tastatur i hele leverancen",
      en: "A Nordic keyboard across the delivery",
    },
    description: {
      da: "Importerede maskiner får skiftet tastatur til dansk/nordisk layout, så medarbejderne ikke skal lede efter æ, ø og å på maskiner købt i udlandet.",
      en: "Imported machines get their keyboard changed to a Danish or Norwegian layout, so nobody has to hunt for æ, ø and å on a machine bought abroad.",
    },
  },
  {
    icon: CalendarClock,
    title: {
      da: "Løbende leverance til nye medarbejdere",
      en: "Ongoing supply for new employees",
    },
    description: {
      da: "Vokser I, kan vi holde en aftalt konfiguration ved lige, så nye medarbejdere får samme opsætning som resten – uden at I skal starte forfra med et indkøb hver gang.",
      en: "As you grow, we can keep an agreed configuration on file, so new employees get the same setup as everyone else — without you starting a purchase from scratch each time.",
    },
  },
];

const tradeInSteps = [
  {
    title: { da: "I sender en oversigt", en: "You send an overview" },
    description: {
      da: "Antal enheder, modeller og cirka alder på det, I skal af med – og hvad I har brug for i stedet.",
      en: "Quantity, models and rough age of what you need to move on — and what you need instead.",
    },
  },
  {
    title: { da: "Vi regner begge veje", en: "We price both sides" },
    description: {
      da: "I får både et bud på jeres gamle udstyr og en pris på det nye. Værdien af det gamle kan modregnes i det nye indkøb.",
      en: "You get both an offer on your old equipment and a price on the new. The value of the old can be offset against the new purchase.",
    },
  },
  {
    title: { da: "Afhentning og datasletning", en: "Collection and data erasure" },
    description: {
      da: "Vi henter det gamle udstyr og sletter alle data, før enhederne klargøres til videresalg.",
      en: "We collect the old equipment and erase all data before the machines are prepared for resale.",
    },
  },
  {
    title: { da: "Levering af den nye flåde", en: "Delivery of the new fleet" },
    description: {
      da: "De nye maskiner leveres testet og klargjort med dansk/nordisk tastatur, klar til udlevering.",
      en: "The new machines arrive tested and prepared with a Nordic keyboard, ready to hand out.",
    },
  },
];

const enterpriseFaqs = [
  {
    question: { da: "Hvor mange enheder kan I levere?", en: "How many machines can you deliver?" },
    answer: {
      da: "Vi sourcer til den enkelte ordre frem for at sælge fra et fast lager, så antallet afhænger af, hvad der kan skaffes til den ønskede specifikation og tidsramme. Fortæl os omfanget, så melder vi konkret tilbage på, hvad vi kan levere og hvornår.",
      en: "We source per order rather than selling from fixed stock, so the number depends on what can be found at the specification and timing you want. Tell us the scope and we come back concretely on what we can deliver and when.",
    },
  },
  {
    question: {
      da: "Kan vi få samme model til alle medarbejdere?",
      en: "Can we get the same model for everyone?",
    },
    answer: {
      da: "Ja, det er typisk det, større kunder ønsker. Vi går efter én konfiguration i hele leverancen, så support og udrulning bliver enklere. Er en enkelt model ikke tilgængelig i det antal, foreslår vi nærmeste alternativ, før vi går videre.",
      en: "Yes, and it is usually what larger customers want. We aim for one configuration across the delivery, which makes support and rollout simpler. If a single model is not available in that quantity, we propose the closest alternative before going ahead.",
    },
  },
  {
    question: {
      da: "Kan vi selv bestemme RAM og lagring?",
      en: "Can we choose the memory and storage?",
    },
    answer: {
      da: "Ja. Vi opgraderer RAM og kan tilpasse lagring efter jeres behov. Skal maskinerne kunne opgraderes yderligere senere, prioriterer vi modeller, hvor det er muligt – sig til, hvis det er et krav.",
      en: "Yes. We upgrade memory and can match storage to what you need. If the machines have to be upgradable further down the line, we favour models where that is possible — say so if it is a requirement.",
    },
  },
  {
    question: {
      da: "Kan vi bytte vores gamle udstyr ind?",
      en: "Can we trade our old equipment in?",
    },
    answer: {
      da: "Ja. Vi køber brugt erhvervsudstyr, og værdien kan modregnes i et nyt indkøb, så I både slipper for det gamle og får det nye i én aftale.",
      en: "Yes. We buy used business equipment, and the value can be offset against a new purchase, so the old goes and the new arrives under one agreement.",
    },
  },
  {
    question: {
      da: "Laver I løbende aftaler frem for enkeltordrer?",
      en: "Do you do ongoing agreements rather than one-off orders?",
    },
    answer: {
      da: "Ja, det kan vi aftale. Har I løbende behov – f.eks. maskiner til nye medarbejdere – kan vi holde en fast konfiguration ved lige, så I ikke skal specificere det forfra hver gang.",
      en: "Yes, that can be arranged. If you have a continuing need — machines for new employees, for instance — we can keep a fixed configuration on file so you do not have to specify it again each time.",
    },
  },
  {
    question: {
      da: "Leveres maskinerne med Windows og licenser?",
      en: "Do the machines come with Windows and licences?",
    },
    answer: {
      da: "Ja. Maskinerne kan leveres med Windows installeret, drivere og dansk sprogopsætning. Har I egne licensaftaler eller et image, I ruller ud, bruger vi dem – ellers hjælper vi med at få licenserne på plads, så flåden kører lovligt.",
      en: "Yes. Machines can arrive with Windows installed, drivers and the right language settings. If you have your own licence agreements or an image you roll out, we use those — otherwise we help get the licences in place so the fleet runs legally.",
    },
  },
  {
    question: {
      da: "Kan I skifte tastaturet til dansk layout på hele leverancen?",
      en: "Can you change the keyboard to a Nordic layout across the delivery?",
    },
    answer: {
      da: "Ja. Det er en fast del af klargøringen, når maskinerne kommer fra udlandet – så medarbejderne ikke skal lede efter æ, ø og å.",
      en: "Yes. It is a standard part of the preparation when machines come from abroad — so nobody has to hunt for æ, ø and å.",
    },
  },
  {
    question: { da: "Hvad med garanti og fakturering?", en: "What about warranty and invoicing?" },
    answer: {
      da: "Garantivilkår og betalingsbetingelser aftaler vi ud fra ordrens omfang. Vi gennemgår det med jer, før I binder jer til noget.",
      en: "Warranty terms and payment terms are agreed from the size of the order. We go through it with you before you commit to anything.",
    },
  },
];

export default function FlaadeloesningerPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <section className="bg-brand-950 py-14 text-white sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center border border-paper/25 bg-white/5 px-4 py-1.5 text-xs font-medium text-ink-200 sm:text-sm">
              {c.badge}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {c.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-ink-300 sm:text-lg">{c.intro}</p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="#forespoergsel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition hover:bg-paper-dim"
              >
                {c.sendEnquiry}
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

            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-ink-400">
              <Image
                src={team[0].photo}
                alt={`${team[0].name}, ${team[0].role[lang]}`}
                width={80}
                height={80}
                className="h-10 w-10 rounded-full object-cover object-top"
              />
              <span>
                {c.talkTo} <span className="font-semibold text-white">{team[0].name}</span>,{" "}
                {team[0].role[lang].toLowerCase()}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-600">
              {c.eyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.capabilitiesTitle}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item.title.da}
                className="flex gap-4 border border-paper-edge bg-white p-5 sm:block sm:p-8"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-800 sm:h-11 sm:w-11">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink-900 sm:mt-4">{item.title[lang]}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-600 sm:mt-2">
                    {item.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-paper-edge bg-paper-dim py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-600">
              {c.tradeEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {c.tradeTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-600">{c.tradeBody}</p>

            <ol className="mt-10 space-y-6">
              {tradeInSteps.map((step, i) => (
                <li key={step.title.da} className="flex gap-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink-900">{step.title[lang]}</h3>
                    <p className="mt-1 text-base leading-7 text-ink-600">{step.description[lang]}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href={localePath("/saelg-til-os", lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              {c.tradeLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section id="forespoergsel" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-800">
                <FileSpreadsheet className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  {c.formTitle}
                </h2>
                <p className="mt-3 text-base leading-7 text-ink-600">{c.formBody}</p>
              </div>
            </div>

            <div className="mt-8 border border-paper-edge bg-white p-6 sm:p-8">
              <ContactForm
                lang={lang}
                subjectPrefix={formCopy.subjectPrefix}
                messagePlaceholder={formCopy.messagePlaceholder}
              />
            </div>
          </div>
        </Container>
      </section>

      <div className="border-t border-paper-edge bg-paper-dim">
        <Faq
          lang={lang}
          items={enterpriseFaqs}
          title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }}
        />
      </div>

      <section className="relative overflow-hidden bg-brand-950 py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-950/20 blur-3xl"
        />
        <Container className="relative flex flex-col items-center gap-5 text-center">
          <Repeat className="h-8 w-8 text-brand-400" strokeWidth={1.75} />
          <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {c.ctaTitle}
          </h2>
          <p className="max-w-xl text-base leading-7 text-ink-400">{c.ctaBody}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href={`tel:${team[0].phoneHref}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              {team[0].phoneDisplay}
            </a>
            <Link
              href="#forespoergsel"
              className="inline-flex items-center justify-center border border-paper/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {c.ctaButton}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

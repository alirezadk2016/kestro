import type { Metadata } from "next";
import {
  BatteryCharging,
  MemoryStick,
  MonitorSmartphone,
  Wrench,
  Cog,
  Fan,
  HardDriveDownload,
  Cpu,
  Sparkles,
  Keyboard,
  MonitorCog,
  BadgeCheck,
} from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import CtaSection from "@/components/CtaSection";
import { alternatesFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Reparation og opgradering af computere | Kestro",
    metaDescription:
      "Reparation, opgradering og klargøring af computere – RAM og SSD, batteri, skærm, nordisk tastatur, reservedele, Windows-installation og licenser. For private og virksomheder.",
    title: "Reparation og opgradering",
    description:
      "Et lille værksted til computere, der ikke skal skiftes ud endnu. For private og mindre virksomheder – ikke kun store ordrer.",
    intro:
      "De fleste maskiner bliver skiftet ud, længe før de er slidt op. Ofte er det ét enkelt batteri, for lidt RAM eller en langsom harddisk, der får en ellers god computer til at føles færdig. Det kan som regel løses – billigere og hurtigere end at købe nyt.",
    whatWeDo: "Hvad vi laver",
    howTitle: "Sådan foregår det",
    step1: "Du beskriver problemet i formularen – gerne med model og hvad der sker.",
    step2: "Vi vender tilbage med, hvad vi umiddelbart tror det er, og hvad det koster at se på.",
    step3: "Når vi har haft maskinen i hånden, får du en endelig pris, før vi går i gang.",
    step4: "Du får besked, når den er klar.",
    pricesTitle: "Priser",
    pricesBody:
      "Prisen afhænger af, hvad der skal laves, og hvilke dele der skal bruges. Vi giver altid en pris, før vi går i gang – du bliver ikke overrasket bagefter. Skriv til os med, hvad der er galt, så vender vi tilbage med et estimat.",
    formTitle: "Beskriv problemet",
    formBody: "Skriv hvad der er galt, så vender vi tilbage med et estimat.",
  },
  en: {
    metaTitle: "Computer repairs and upgrades | Kestro",
    metaDescription:
      "Repairs, upgrades and setup for computers — memory and SSD, battery, screen, Nordic keyboard, spare parts, Windows installation and licences. For individuals and companies.",
    title: "Repairs and upgrades",
    description:
      "A small workshop for computers that do not need replacing yet. For individuals and smaller companies — not only large orders.",
    intro:
      "Most machines get replaced long before they are worn out. Often it is a single battery, too little memory or a slow hard disk that makes an otherwise good computer feel finished. That can usually be fixed — cheaper and faster than buying new.",
    whatWeDo: "What we do",
    howTitle: "How it works",
    step1: "You describe the problem in the form — ideally with the model and what happens.",
    step2: "We come back with what we think it is and what it costs to look at.",
    step3: "Once we have had the machine in hand, you get a final price before we start.",
    step4: "We let you know when it is ready.",
    pricesTitle: "Prices",
    pricesBody:
      "The price depends on what needs doing and which parts are needed. We always give a price before we start — no surprises afterwards. Write to us with what is wrong and we come back with an estimate.",
    formTitle: "Describe the problem",
    formBody: "Tell us what is wrong and we come back with an estimate.",
  },
} satisfies Record<Lang, Record<string, string>>;

const formCopy = {
  subjectPrefix: { da: "Reparation", en: "Repair" },
  messagePlaceholder: {
    da: "Hvilken model er det, og hvad sker der? Fx: MacBook Air 2020, holder kun strøm i en time.",
    en: "Which model is it, and what happens? For example: MacBook Air 2020, only holds charge for an hour.",
  },
};

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: alternatesFor("/reparation", params.lang),
  };
}

const services = [
  {
    icon: MemoryStick,
    title: { da: "RAM- og SSD-opgradering", en: "Memory and SSD upgrades" },
    description: {
      da: "Mere hukommelse og hurtigere lagring er ofte den billigste vej til en mærkbart hurtigere maskine.",
      en: "More memory and faster storage is often the cheapest route to a noticeably quicker machine.",
    },
  },
  {
    icon: BatteryCharging,
    title: { da: "Batteriskift", en: "Battery replacement" },
    description: {
      da: "Holder den bærbare ikke længere en arbejdsdag? Et nyt batteri koster en brøkdel af en ny maskine.",
      en: "Laptop no longer lasting a working day? A new battery costs a fraction of a new machine.",
    },
  },
  {
    icon: MonitorSmartphone,
    title: { da: "Skærmskift", en: "Screen replacement" },
    description: {
      da: "Revnet eller defekt skærm på bærbar, tablet eller telefon.",
      en: "Cracked or faulty screens on laptops, tablets and phones.",
    },
  },
  {
    icon: Keyboard,
    title: { da: "Tastaturskift og nordisk layout", en: "Keyboard swap and Nordic layout" },
    description: {
      da: "Defekt tastatur skiftes – og importerede maskiner kan få dansk/nordisk layout, så æ, ø og å sidder, hvor de skal.",
      en: "Faulty keyboards replaced — and imported machines can get a Danish or Norwegian layout, so æ, ø and å sit where they should.",
    },
  },
  {
    icon: Cog,
    title: { da: "Reservedele og komponentskift", en: "Spare parts and components" },
    description: {
      da: "Blæser, hængsler, ladestik, højttalere, kabler og andre slidte dele skiftes, så maskinen kan køre videre.",
      en: "Fans, hinges, charging ports, speakers, cables and other worn parts replaced so the machine keeps going.",
    },
  },
  {
    icon: Fan,
    title: { da: "Rens og køling", en: "Cleaning and cooling" },
    description: {
      da: "Støv og gammel kølepasta gør maskinen varm og larmende. En rens kan give ro og stabilitet tilbage.",
      en: "Dust and old thermal paste make a machine hot and loud. A clean can bring back quiet and stability.",
    },
  },
  {
    icon: MonitorCog,
    title: { da: "Windows-installation", en: "Windows installation" },
    description: {
      da: "Ren installation af Windows med drivere og opdateringer, så maskinen starter op som en ny.",
      en: "A clean Windows install with drivers and updates, so the machine starts up like new.",
    },
  },
  {
    icon: BadgeCheck,
    title: { da: "Software og licenser", en: "Software and licences" },
    description: {
      da: "Vi installerer de programmer, I bruger, og hjælper med at få licenserne på plads, så maskinerne kører lovligt fra første dag.",
      en: "We install the programs you use and help get the licences in place, so the machines run legally from day one.",
    },
  },
  {
    icon: HardDriveDownload,
    title: { da: "Ny opsætning og dataflytning", en: "Fresh setup and data migration" },
    description: {
      da: "Frisk installation af styresystem, og dine filer og programmer flyttet med over.",
      en: "A fresh operating system install, with your files and programs carried across.",
    },
  },
  {
    icon: Wrench,
    title: { da: "Fejlfinding", en: "Troubleshooting" },
    description: {
      da: "Maskinen starter ikke, går ned eller opfører sig underligt – vi finder årsagen og fortæller, hvad det vil koste at rette.",
      en: "The machine will not start, crashes or behaves oddly — we find the cause and tell you what it costs to fix.",
    },
  },
  {
    icon: Cpu,
    title: { da: "Samling af pc", en: "PC assembly" },
    description: {
      da: "Vi samler en maskine efter dine ønsker – enten helt fra bunden eller ved at opgradere den, du har.",
      en: "We build a machine to your spec — either from scratch or by upgrading the one you have.",
    },
  },
  {
    icon: Sparkles,
    title: { da: "Klargøring af brugt udstyr", en: "Setting up used equipment" },
    description: {
      da: "Har du købt en brugt maskine? Vi tjekker den igennem, sætter den op og gør den klar til brug.",
      en: "Bought a used machine? We check it over, set it up and make it ready to use.",
    },
  },
];

const repairFaqs = [
  {
    question: {
      da: "Hvad koster det at få set på maskinen?",
      en: "What does it cost to have the machine looked at?",
    },
    answer: {
      da: "Du får en pris, før vi går i gang. Skriv til os med model og hvad der sker, så vender vi tilbage med et estimat på, hvad det vil koste at undersøge og udbedre.",
      en: "You get a price before we start. Write to us with the model and what happens, and we come back with an estimate for investigating and fixing it.",
    },
  },
  {
    question: {
      da: "Kan det betale sig at reparere frem for at købe nyt?",
      en: "Is repairing worth it compared to buying new?",
    },
    answer: {
      da: "Ofte ja – særligt hvis det er batteri, RAM, lagring eller rens. Er skaden større end maskinens værdi, siger vi det ærligt og foreslår i stedet en renoveret erstatning.",
      en: "Often yes — especially for a battery, memory, storage or a clean. If the damage is worth more than the machine, we say so honestly and suggest a refurbished replacement instead.",
    },
  },
  {
    question: { da: "Mister jeg mine filer?", en: "Will I lose my files?" },
    answer: {
      da: "Nej, ikke som udgangspunkt. Skal maskinen sættes helt op på ny, flytter vi dine filer med over. Sig til, hvis der er noget, der er særligt vigtigt.",
      en: "No, not as a rule. If the machine has to be set up from scratch, we carry your files across. Tell us if something is particularly important.",
    },
  },
  {
    question: { da: "Tager I imod private kunder?", en: "Do you take private customers?" },
    answer: {
      da: "Ja. Værkstedet er både for private og mindre virksomheder – der er ingen minimumsordre.",
      en: "Yes. The workshop is for both individuals and smaller companies — there is no minimum order.",
    },
  },
  {
    question: { da: "Hvilke mærker arbejder I med?", en: "Which brands do you work on?" },
    answer: {
      da: "Vi arbejder med de fleste gængse mærker – bl.a. Lenovo, Dell, HP, Apple, ASUS og Acer. Er du i tvivl om din model, så spørg.",
      en: "We work on most common brands — Lenovo, Dell, HP, Apple, ASUS and Acer among others. If you are unsure about your model, just ask.",
    },
  },
  {
    question: {
      da: "Kan I skifte tastaturet til dansk layout?",
      en: "Can you change the keyboard to a Nordic layout?",
    },
    answer: {
      da: "Ja. Er maskinen købt i udlandet, eller er tastaturet slidt, kan vi skifte det til dansk/nordisk layout, så æ, ø og å sidder korrekt.",
      en: "Yes. If the machine was bought abroad, or the keyboard is worn, we can change it to a Danish or Norwegian layout so æ, ø and å sit correctly.",
    },
  },
  {
    question: {
      da: "Sørger I også for Windows og licenser?",
      en: "Do you handle Windows and licences too?",
    },
    answer: {
      da: "Vi installerer Windows med drivere og opdateringer og hjælper med at få licenserne på plads, så maskinerne kører lovligt. Har I jeres egne licensaftaler, bruger vi selvfølgelig dem – ellers taler vi om, hvad der passer til jeres opsætning.",
      en: "We install Windows with drivers and updates and help get the licences in place so the machines run legally. If you have your own licence agreements we use those — otherwise we talk about what fits your setup.",
    },
  },
];

export default function ReparationPage({ params }: { params: { lang: Lang } }) {
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
            <p className="text-base leading-7 text-slate-600">{c.intro}</p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {c.whatWeDo}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title.da}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 sm:h-10 sm:w-10">
                  <service.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900 sm:mt-4 sm:text-base">
                  {service.title[lang]}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                  {service.description[lang]}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {c.howTitle}
              </h2>
              <ol className="mt-6 space-y-4 text-base leading-7 text-slate-600">
                {[c.step1, c.step2, c.step3, c.step4].map((step, i) => (
                  <li key={step}>
                    <span className="font-semibold text-slate-900">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {c.pricesTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{c.pricesBody}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {c.formTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{c.formBody}</p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm
                lang={lang}
                subjectPrefix={formCopy.subjectPrefix}
                companyRequired={false}
                messagePlaceholder={formCopy.messagePlaceholder}
              />
            </div>
          </div>
        </Container>
      </section>

      <Faq lang={lang} items={repairFaqs} />

      <CtaSection lang={lang} />
    </>
  );
}

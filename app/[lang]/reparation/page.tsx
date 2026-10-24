import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import LaptopAssembly from "@/components/LaptopAssembly";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import CtaSection from "@/components/CtaSection";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import ServiceTile from "@/components/ServiceTile";
import { repairs } from "@/lib/repairs";
import PageSchema from "@/components/PageSchema";
import FactNote from "@/components/FactNote";

const copy = {
  da: {
    metaTitle: "Reparation af computer og bærbar – også for private | Kestro",
    metaDescription:
      "Batteri, skærm, RAM, SSD, tastatur og Windows på bærbare og stationære. Pris, før vi går i gang – og et ærligt svar, hvis det ikke kan betale sig.",
    title: "Reparation og opgradering af computere",
    description:
      "Et lille værksted til computere, der ikke skal skiftes ud endnu. Kestro sælger og skaffer IT til virksomheder – værkstedet er den ene undtagelse, hvor private også er velkomne.",
    intro:
      "Ofte er det batteriet, RAM eller harddisken, der får en ellers god computer til at føles færdig – og det kan som regel løses billigere end at købe nyt.",
    read: "Læs mere",
    whatWeDo: "Hvad vi laver",
    howTitle: "Sådan foregår det",
    step1: "Du beskriver problemet i formularen – gerne med model og hvad der sker.",
    step2: "Vi vender tilbage med, hvad vi umiddelbart tror, det er, og hvad det koster at se på.",
    step3: "Når vi har haft maskinen i hånden, får du en endelig pris, før vi går i gang.",
    step4: "Du får besked, når den er klar.",
    pricesTitle: "Priser",
    pricesBody:
      "Prisen afhænger af, hvad der skal laves, og hvilke dele der skal bruges. Vi giver en pris, før vi går i gang – du bliver ikke overrasket bagefter.",
    formTitle: "Beskriv problemet",
    formBody:
      "Skriv, hvad der er galt, og hvilken model det er, så vender vi tilbage med et estimat.",
  },
  en: {
    metaTitle: "Computer repairs and upgrades — individuals welcome | Kestro",
    metaDescription:
      "Battery, screen, memory, SSD, keyboard and Windows on laptops and desktops. A price before we start, and an honest answer if it is not worth it.",
    title: "Computer repairs and upgrades",
    description:
      "A small workshop for computers that do not need replacing yet. Kestro sources and supplies IT to companies — the workshop is the one exception, where individuals are welcome too.",
    intro:
      "Often it is the battery, the memory or the hard disk that makes an otherwise good computer feel finished — and that can usually be fixed for less than buying new.",
    read: "Read more",
    whatWeDo: "What we do",
    howTitle: "How it works",
    step1: "You describe the problem in the form — ideally with the model and what happens.",
    step2: "We come back with what we think it is and what it costs to look at.",
    step3: "Once we have had the machine in hand, you get a final price before we start.",
    step4: "We let you know when it is ready.",
    pricesTitle: "Prices",
    pricesBody:
      "The price depends on what needs doing and which parts are needed. We give you a price before we start — no surprises afterwards.",
    formTitle: "Describe the problem",
    formBody: "Tell us what is wrong and which model it is, and we come back with an estimate.",
  },
} satisfies Record<Lang, Record<string, string>>;

const formCopy = {
  subjectPrefix: { da: "Reparation", en: "Repair" },
  messagePlaceholder: {
    da: "Hvilken model er det, og hvad sker der? Fx: MacBook Air 2020, holder kun strøm i en time.",
    en: "Which model is it, and what happens? For example: MacBook Air 2020, only holds charge for an hour.",
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/reparation", params.lang),
  };
}

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
      da: "Ja – men kun i værkstedet. Resten af Kestro er indkøb og levering til virksomheder. Reparation og opgradering tager vi imod fra både private og mindre virksomheder, og der er ingen minimumsordre.",
      en: "Yes — but only in the workshop. The rest of Kestro is purchasing and delivery for companies. Repairs and upgrades we take from both individuals and smaller companies, and there is no minimum order.",
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
      da: "Ja. Er maskinen købt i udlandet, eller er tastaturet slidt, kan vi skifte det til dansk eller norsk layout, så æ, ø og å sidder korrekt.",
      en: "Yes. If the machine was bought abroad, or the keyboard is worn, we can change it to a Danish or Norwegian layout so æ, ø and å sit correctly.",
    },
  },
  {
    question: {
      da: "Sørger I også for Windows og licenser?",
      en: "Do you handle Windows and licences too?",
    },
    answer: {
      da: "Vi installerer Windows med drivere og opdateringer og hjælper med at få licenserne på plads, så maskinerne kører lovligt. Har du eller virksomheden egne licensaftaler, bruger vi selvfølgelig dem – ellers taler vi om, hvad der passer til opsætningen.",
      en: "We install Windows with drivers and updates and help get the licences in place so the machines run legally. If you have your own licence agreements we use those — otherwise we talk about what fits your setup.",
    },
  },
];

export default async function ReparationPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  return (
    <>
      <PageSchema lang={lang} route="/reparation" name={c.title} description={c.description} />

      <section className="py-8 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
            <div className="relative z-10 lg:col-span-6">
              <PageHeader
                title={c.title}
                description={c.description}
                lang={lang}
                href="/reparation"
                crumb={lang === "da" ? "Reparation" : "Repairs"}
                updated="/reparation"
              />
              {/* The form is the page's action and sat 4,100px down a phone;
                  the header's quote button is for buying machines. */}
              <Button
                href="#reparation-formular"
                className="mt-8 w-full sm:w-auto"
                icon={<ArrowDown className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
              >
                {c.formTitle}
              </Button>
            </div>

            <LaptopAssembly
              lang={lang}
              className="mt-6 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center"
            />

            <div className="mt-8 max-w-3xl lg:col-span-6 lg:mt-10">
              <p className="text-base leading-[1.75] text-paper/75">{c.intro}</p>
              <Link
                href={`${localePath("/vejledninger", lang)}#praktiske-guides`}
                className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-200 underline underline-offset-4"
              >
                {lang === "da"
                  ? "Vil du tjekke noget selv? Se vores praktiske guides"
                  : "Want to check something yourself? Explore our practical guides"}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.whatWeDo}
          </h2>

          {/* One column on a phone. At 390px two columns give a 170px card, and
              the summaries were wrapping to six lines inside it — which is also
              why there was no room for an icon big enough to read. */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {repairs.map((repair) => (
              <ServiceTile
                key={repair.slug}
                href={localePath(`/reparation/${repair.slug}`, lang)}
                mark={repair.mark}
                title={repair.name[lang]}
                summary={repair.summary[lang]}
                prompt={c.read}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:max-w-none">
            <div>
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {c.howTitle}
              </h2>
              {/* A sequence, so a spine: the numbers sit on a rail that runs
                  from the first step to the last. As a plain "1. 2. 3." list
                  it read as body copy that happened to be numbered. */}
              <ol className="relative mt-6 space-y-6">
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-brand-400/60 via-paper/15 to-paper/5"
                />
                {[c.step1, c.step2, c.step3, c.step4].map((step, i) => (
                  <li key={step} className="relative flex gap-4">
                    <span className="plate-sm relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-950 font-display text-xs font-bold tabular-nums text-brand-300">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-base leading-7 text-paper/75">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {c.pricesTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.75] text-paper/75">{c.pricesBody}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="split max-w-3xl">
            <h2
              id="reparation-formular"
              className="text-balance font-display t-h2 font-extrabold tracking-display text-paper"
            >
              {c.formTitle}
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.formBody}</p>

            <div className="mt-8 plate p-6 sm:p-8">
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

      <FactNote lang={lang} ids={["repairDirective"]} />

      <CtaSection lang={lang} intent="repair" />
    </>
  );
}

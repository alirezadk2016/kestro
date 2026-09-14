import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
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
    metaTitle: "Reparation og opgradering af firmacomputere | Kestro",
    metaDescription:
      "Batteri, disk, hukommelse og skærm på erhvervsmaskiner. I får en pris, før vi går i gang – og et ærligt svar, hvis det ikke kan betale sig.",
    title: "Reparation og opgradering",
    description:
      "Et lille værksted til computere, der ikke skal skiftes ud endnu. Kestro sælger og skaffer IT til virksomheder – værkstedet er den ene undtagelse, hvor private også er velkomne.",
    intro:
      "De fleste maskiner bliver skiftet ud, længe før de er slidt op. Ofte er det ét enkelt batteri, for lidt RAM eller en langsom harddisk, der får en ellers god computer til at føles færdig. Det kan som regel løses – billigere og hurtigere end at købe nyt.",
    read: "Læs mere",
    whatWeDo: "Hvad vi laver",
    howTitle: "Sådan foregår det",
    step1: "Du beskriver problemet i formularen – gerne med model og hvad der sker.",
    step2: "Vi vender tilbage med, hvad vi umiddelbart tror det er, og hvad det koster at se på.",
    step3: "Når vi har haft maskinen i hånden, får du en endelig pris, før vi går i gang.",
    step4: "Du får besked, når den er klar.",
    pricesTitle: "Priser",
    pricesBody:
      "Prisen afhænger af, hvad der skal laves, og hvilke dele der skal bruges. Vi giver en pris, før vi går i gang – du bliver ikke overrasket bagefter. Skriv til os med, hvad der er galt, så vender vi tilbage med et estimat.",
    formTitle: "Beskriv problemet",
    formBody: "Skriv hvad der er galt, så vender vi tilbage med et estimat.",
  },
  en: {
    metaTitle: "Computer repairs and upgrades | Kestro",
    metaDescription:
      "Repairs and upgrades — memory and SSD, battery, screen, Nordic keyboard and Windows. The workshop also takes individuals.",
    title: "Repairs and upgrades",
    description:
      "A small workshop for computers that do not need replacing yet. Kestro sources and supplies IT to companies — the workshop is the one exception, where individuals are welcome too.",
    intro:
      "Most machines get replaced long before they are worn out. Often it is a single battery, too little memory or a slow hard disk that makes an otherwise good computer feel finished. That can usually be fixed — cheaper and faster than buying new.",
    read: "Read more",
    whatWeDo: "What we do",
    howTitle: "How it works",
    step1: "You describe the problem in the form — ideally with the model and what happens.",
    step2: "We come back with what we think it is and what it costs to look at.",
    step3: "Once we have had the machine in hand, you get a final price before we start.",
    step4: "We let you know when it is ready.",
    pricesTitle: "Prices",
    pricesBody:
      "The price depends on what needs doing and which parts are needed. We give you a price before we start — no surprises afterwards. Write to us with what is wrong and we come back with an estimate.",
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
      <PageSchema lang={lang} route="/reparation" name={c.title} description={c.description} />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/reparation"
            crumb={lang === "da" ? "Reparation" : "Repairs"}

            updated="/reparation"
          />

          <div className="mt-12 max-w-3xl">
            <p className="text-base leading-[1.75] text-paper/65">{c.intro}</p>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            {c.whatWeDo}
          </h2>

          {/* One column on a phone. At 390px two columns give a 170px card, and
              the summaries were wrapping to six lines inside it — which is also
              why there was no room for an icon big enough to read. */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
          <div className="grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {c.howTitle}
              </h2>
              <ol className="mt-6 space-y-4 text-base leading-7 text-paper/65">
                {[c.step1, c.step2, c.step3, c.step4].map((step, i) => (
                  <li key={step}>
                    <span className="font-semibold text-paper">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {c.pricesTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.75] text-paper/65">{c.pricesBody}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.formTitle}
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-paper/65">{c.formBody}</p>

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

      <CtaSection lang={lang} />

      <FactNote lang={lang} ids={["repairDirective"]} />
    </>
  );
}

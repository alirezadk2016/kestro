import type { Metadata } from "next";
import {
  BatteryCharging,
  MemoryStick,
  MonitorSmartphone,
  Wrench,
  Fan,
  HardDriveDownload,
  Cpu,
  Sparkles,
} from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Reparation og opgradering af computere | Kestro",
  description:
    "Reparation, opgradering og samling af computere – batteriskift, RAM- og SSD-opgradering, skærmskift, rens og fejlfinding. For private og mindre virksomheder.",
  alternates: { canonical: "/reparation" },
};

const services = [
  {
    icon: MemoryStick,
    title: "RAM- og SSD-opgradering",
    description:
      "Mere hukommelse og hurtigere lagring er ofte den billigste vej til en mærkbart hurtigere maskine.",
  },
  {
    icon: BatteryCharging,
    title: "Batteriskift",
    description:
      "Holder den bærbare ikke længere en arbejdsdag? Et nyt batteri koster en brøkdel af en ny maskine.",
  },
  {
    icon: MonitorSmartphone,
    title: "Skærmskift",
    description: "Revnet eller defekt skærm på bærbar, tablet eller telefon.",
  },
  {
    icon: Fan,
    title: "Rens og køling",
    description:
      "Støv og gammel kølepasta gør maskinen varm og larmende. En rens kan give ro og stabilitet tilbage.",
  },
  {
    icon: HardDriveDownload,
    title: "Ny opsætning og dataflytning",
    description:
      "Frisk installation af styresystem, og dine filer og programmer flyttet med over.",
  },
  {
    icon: Wrench,
    title: "Fejlfinding",
    description:
      "Maskinen starter ikke, går ned eller opfører sig underligt – vi finder årsagen og fortæller, hvad det vil koste at rette.",
  },
  {
    icon: Cpu,
    title: "Samling af pc",
    description:
      "Vi samler en maskine efter dine ønsker – enten helt fra bunden eller ved at opgradere den, du har.",
  },
  {
    icon: Sparkles,
    title: "Klargøring af brugt udstyr",
    description:
      "Har du købt en brugt maskine? Vi tjekker den igennem, sætter den op og gør den klar til brug.",
  },
];

const repairFaqs = [
  {
    question: "Hvad koster det at få set på maskinen?",
    answer:
      "Du får en pris, før vi går i gang. Skriv til os med model og hvad der sker, så vender vi tilbage med et estimat på, hvad det vil koste at undersøge og udbedre.",
  },
  {
    question: "Kan det betale sig at reparere frem for at købe nyt?",
    answer:
      "Ofte ja – særligt hvis det er batteri, RAM, lagring eller rens. Er skaden større end maskinens værdi, siger vi det ærligt og foreslår i stedet en renoveret erstatning.",
  },
  {
    question: "Mister jeg mine filer?",
    answer:
      "Nej, ikke som udgangspunkt. Skal maskinen sættes helt op på ny, flytter vi dine filer med over. Sig til, hvis der er noget, der er særligt vigtigt.",
  },
  {
    question: "Tager I imod private kunder?",
    answer:
      "Ja. Værkstedet er både for private og mindre virksomheder – der er ingen minimumsordre.",
  },
  {
    question: "Hvilke mærker arbejder I med?",
    answer:
      "Vi arbejder med de fleste gængse mærker – bl.a. Lenovo, Dell, HP, Apple, ASUS og Acer. Er du i tvivl om din model, så spørg.",
  },
];

export default function ReparationPage() {
  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Reparation og opgradering"
            description="Et lille værksted til computere, der ikke skal skiftes ud endnu. For private og mindre virksomheder – ikke kun store ordrer."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <p className="text-base leading-7 text-slate-600">
              De fleste maskiner bliver skiftet ud, længe før de er slidt op. Ofte er det ét enkelt
              batteri, for lidt RAM eller en langsom harddisk, der får en ellers god computer til at
              føles færdig. Det kan som regel løses – billigere og hurtigere end at købe nyt.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Hvad vi laver
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sådan foregår det
              </h2>
              <ol className="mt-6 space-y-4 text-base leading-7 text-slate-600">
                <li>
                  <span className="font-semibold text-slate-900">1.</span> Du beskriver problemet i
                  formularen – gerne med model og hvad der sker.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">2.</span> Vi vender tilbage med, hvad
                  vi umiddelbart tror det er, og hvad det koster at se på.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">3.</span> Når vi har haft maskinen i
                  hånden, får du en endelig pris, før vi går i gang.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">4.</span> Du får besked, når den er
                  klar.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Priser
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Prisen afhænger af, hvad der skal laves, og hvilke dele der skal bruges. Vi giver
                altid en pris, før vi går i gang – du bliver ikke overrasket bagefter. Skriv til os
                med, hvad der er galt, så vender vi tilbage med et estimat.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Beskriv problemet
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Skriv hvad der er galt, så vender vi tilbage med et estimat.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm
                subjectPrefix="Reparation"
                companyRequired={false}
                messagePlaceholder="Hvilken model er det, og hvad sker der? Fx: MacBook Air 2020, holder kun strøm i en time."
              />
            </div>
          </div>
        </Container>
      </section>

      <Faq items={repairFaqs} />
    </>
  );
}

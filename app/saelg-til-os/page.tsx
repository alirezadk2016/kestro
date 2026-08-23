import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Handshake, ShieldCheck, Banknote, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Sælg jeres brugte IT-udstyr | Kestro",
  description:
    "Skal jeres virksomhed udskifte IT-udstyr? Kestro køber brugte erhvervscomputere, telefoner og tablets – med sikker datasletning og afhentning i Danmark og Norge.",
  alternates: { canonical: "/saelg-til-os" },
};

const steps = [
  {
    icon: ClipboardList,
    title: "1. Send os en liste",
    description:
      "Fortæl os hvad I har – antal enheder, modeller og cirka alder. Jo mere præcist, jo hurtigere kan vi vurdere.",
  },
  {
    icon: Handshake,
    title: "2. I får et tilbud",
    description:
      "Vi vurderer udstyret og vender tilbage med et bud. I er ikke bundet af noget, før I siger ja.",
  },
  {
    icon: ShieldCheck,
    title: "3. Afhentning og datasletning",
    description:
      "Vi aftaler afhentning, og alle data slettes sikkert, før enhederne klargøres til videresalg.",
  },
  {
    icon: Banknote,
    title: "4. Betaling",
    description: "Betaling sker efter den aftale, vi indgår – vi gennemgår vilkårene på forhånd.",
  },
];

const accepted = [
  "Bærbare computere",
  "Stationære computere",
  "Mini-pc'er",
  "Skærme",
  "Tablets",
  "Smartphones",
  "Smartwatches",
  "Dockingstationer",
  "Serverudstyr (efter aftale)",
];

export default function SaelgTilOsPage() {
  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <PageHeader
            title="Sælg jeres brugte IT-udstyr"
            description="Skal I udskifte medarbejdernes computere eller rydde op efter en flytning? Vi køber brugt erhvervsudstyr og giver det et nyt liv."
          />

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sådan foregår det
            </h2>

            <div className="mt-8 space-y-8">
              {steps.map((step) => (
                <div key={step.title} className="flex gap-5">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <step.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 text-base leading-7 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hvad vi køber
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {accepted.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-500">
                Er I i tvivl, om jeres udstyr er relevant? Spørg os – vi kigger gerne på det.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Datasikkerhed
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Alle enheder får slettet data, før de klargøres til videresalg. Har I særlige krav
                til dokumentation for datasletning – f.eks. i forbindelse med jeres GDPR-procedurer
                – så sig til, når I kontakter os, så aftaler vi, hvordan det håndteres.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Skal hele flåden skiftes ud på én gang?
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Så kan vi håndtere begge ender: vi køber det gamle udstyr og leverer de nye enheder.
              Værdien af det brugte kan modregnes i det nye indkøb, så I får én aftale i stedet for
              to forløb.
            </p>
            <Link
              href="/flaadeloesninger"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Se flådeløsninger
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Fortæl os, hvad I har
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Udfyld formularen, så vender vi tilbage med en vurdering.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm
                subjectPrefix="Salg af brugt udstyr"
                messagePlaceholder="Antal enheder, modeller, cirka alder og stand – samt hvornår udstyret er klar til afhentning."
              />
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

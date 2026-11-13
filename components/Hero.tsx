import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import { localePath, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    eyebrow: "Erhvervs-IT · Danmark og Norge",
    title: "Refurbished erhvervscomputere.",
    lead: "Vi skaffer efter jeres behov. Konfiguration, stand og pris afklares, før I tager stilling.",
    choose: "Se udstyret",
    enquire: "Beskriv behov",
    sourcing: "Skaffes efter behov · intet fast lager",
    status:
      "Under etablering – endnu ikke en registreret virksomhed. Vi tager imod forespørgsler, ikke ordrer.",
    terms: "Status og vilkår",
    photo: "Modelfoto · Lenovo ThinkPad T480",
    caption: "Konfiguration og software aftales for den konkrete enhed.",
    detail: "Se modellen",
    alt: "Lenovo ThinkPad T480 fotograferet forfra med åbent låg og tastatur synligt",
  },
  en: {
    eyebrow: "Business IT · Denmark and Norway",
    title: "Refurbished business computers.",
    lead: "We source around your needs. Configuration, condition and price are clarified before you decide.",
    choose: "See equipment",
    enquire: "Enquire",
    sourcing: "Sourced around your needs · no fixed stock",
    status: "Pre-launch — not yet a registered business. We take enquiries, not orders.",
    terms: "Status and terms",
    photo: "Model photo · Lenovo ThinkPad T480",
    caption: "Configuration and software are agreed for the specific unit.",
    detail: "View the model",
    alt: "Lenovo ThinkPad T480 photographed from the front with the lid open and keyboard visible",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Hero({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="border-b border-white/10 bg-brand-950 py-6 sm:py-12 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-300 sm:mb-4">
              {c.eyebrow}
            </p>
            <h1 className="t-display max-w-[14em] font-display font-extrabold tracking-display text-paper [overflow-wrap:anywhere] max-[389px]:!text-[1.75rem]">
              {c.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-paper/85 sm:text-lg">{c.lead}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-6">
              <Button
                href={localePath("/produkter", lang)}
                size="lg"
                className="!min-h-11 !px-4 sm:!min-h-[52px] sm:!px-6"
              >
                {c.choose}
              </Button>
              <Button href={localePath("/tilbud", lang)} intent="quiet" className="!px-0">
                {c.enquire}
              </Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-paper/70">{c.sourcing}</p>
            <p className="mt-5 max-w-lg border-t border-white/15 pt-4 text-xs leading-[1.65] text-paper/75">
              {c.status}{" "}
              <Link
                href={localePath("/handelsbetingelser", lang)}
                rel="terms-of-service"
                className="font-semibold text-paper underline decoration-paper/40 underline-offset-4 hover:text-brand-200"
              >
                {c.terms}
              </Link>
            </p>
          </div>
          {/* The compact phone introduction leads directly to the equipment
              gateway. A second full laptop image there would only delay it. */}
          <figure className="hidden overflow-hidden rounded-xl bg-paper-dim text-ink-900 lg:col-span-6 lg:block">
            <div className="flex h-[350px] items-center justify-center bg-white p-5 min-[1600px]:h-[400px]">
              <Image
                src="/thinkpad-t480-6.jpg"
                width={1179}
                height={1115}
                alt={c.alt}
                sizes="(min-width: 1536px) 40vw, (min-width: 1024px) 45vw, 1px"
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="border-t border-ink-200 px-5 py-4">
              <p className="text-sm font-semibold text-ink-900">{c.photo}</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <p className="text-xs leading-5 text-ink-600">{c.caption}</p>
                <Link
                  href={localePath("/modeller/lenovo-thinkpad-t480", lang)}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-600"
                >
                  {c.detail}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

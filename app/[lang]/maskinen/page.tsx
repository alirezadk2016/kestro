import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import MachineViewer from "@/components/MachineViewer";
import MachineInside from "@/components/MachineInside";
import { interiorParts } from "@/lib/machine-parts";
import { localePath, metaFor, htmlLang, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Maskinen indeni: hvad er RAM, SSD og køling? | Kestro",
    metaDescription:
      "Drej en bærbar erhvervscomputer rundt, og se hvor RAM, SSD, trådløst kort, køling og batteri sidder – hvad hver del gør, og hvad der kan opgraderes.",
    title: "Maskinen, del for del",
    description:
      "Drej den rundt, og tryk på en del. Udvendigt er det den maskine, vi skaffer; indvendigt er det en principskitse over, hvor tingene sidder – og hvad der kan skiftes, hvis I vil have et par år mere ud af udstyret.",
    outsideEyebrow: "Udvendigt",
    outsideTitle: "Det I kan se",
    outsideBody: "Vælg en del, så drejer maskinen hen til den. Eller tag fat i den og drej selv.",
    insideEyebrow: "Indvendigt",
    insideTitle: "Det I ikke kan se",
    insideBody:
      "Modellen ovenfor er en ydre skal – den har ingen inderside. Så det her er tegnet: hvor delene sidder i en typisk 14-tommer erhvervsbærbar, hvad de laver, og hvad der kan skiftes.",
    guidesPre: "Vil I selv i gang?",
    guidesLink: "Se vejledningerne",
    guidesPost:
      "– vi har skrevet trin for trin, hvordan I skifter RAM og tjekker en brugt maskine.",
  },
  en: {
    metaTitle: "Inside the machine: what is RAM, SSD and cooling? | Kestro",
    metaDescription:
      "Turn a business laptop round and see where the memory, SSD, wireless card, cooling and battery sit — what each part does, and what can be upgraded.",
    title: "The machine, part by part",
    description:
      "Turn it round, and tap a part. Outside is the machine we source; inside is a schematic of where things sit — and what can be changed if you want another couple of years out of the equipment.",
    outsideEyebrow: "Outside",
    outsideTitle: "What you can see",
    outsideBody:
      "Pick a part and the machine turns to it. Or take hold of it and turn it yourself.",
    insideEyebrow: "Inside",
    insideTitle: "What you cannot see",
    insideBody:
      "The model above is an outer shell — it has no inside. So this part is drawn: where the components sit in a typical 14-inch business laptop, what they do, and what can be changed.",
    guidesPre: "Want to do it yourselves?",
    guidesLink: "Read the guides",
    guidesPost: "— we have written step by step how to change memory and check a used machine.",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/maskinen", params.lang),
  };
}

export default function MaskinenPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  /*
   * Every part is a question and an answer, so the page is eligible for the
   * FAQ rich result. This is the one page on the site that answers "what is
   * RAM" in Danish with a business's own machines in front of it.
   */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: htmlLang[lang],
    mainEntity: interiorParts.map((part) => ({
      "@type": "Question",
      name: part.name[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: `${part.what[lang]} ${part.upgrade[lang]}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="py-14 sm:py-24">
        <Container>
          <PageHeader title={c.title} description={c.description} />
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-14 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="eyebrow text-brand-300">{c.outsideEyebrow}</span>
            <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-paper">
              {c.outsideTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-paper/65">{c.outsideBody}</p>
          </div>

          <div className="mt-12">
            <MachineViewer lang={lang} />
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="eyebrow text-brand-300">{c.insideEyebrow}</span>
            <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-paper">
              {c.insideTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-paper/65">{c.insideBody}</p>
          </div>

          <div className="mt-12">
            <MachineInside lang={lang} />
          </div>

          <p className="mt-12 max-w-2xl text-sm leading-7 text-paper/55">
            {c.guidesPre}{" "}
            <Link
              href={localePath("/vejledninger", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400 decoration-2 underline-offset-4 hover:text-paper"
            >
              {c.guidesLink}
            </Link>{" "}
            {c.guidesPost}
          </p>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}

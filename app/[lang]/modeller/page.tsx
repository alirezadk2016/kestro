import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import { models, modelGroups } from "@/lib/models";
import { formatDate, localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";
import ModelCatalogue from "@/components/ModelCatalogue";

const copy = {
  da: {
    metaTitle: "Brugte ThinkPad, EliteBook, Latitude og OptiPlex | Kestro",
    metaDescription:
      "18 brugte erhvervsmodeller fra Lenovo, HP og Dell. Se specifikationer, fordele og ulemper for pc'er, skærme og docks. Spørg til en specifik model.",
    title: "Brugte erhvervsmodeller: ThinkPad, EliteBook, Latitude og OptiPlex",
    /* Answer first, with the counts the page actually shows. */
    description: `Sammenlign ${models.length} brugte erhvervsmodeller i ${modelGroups.length} grupper fra bærbare til dockingstationer. Hver model har specifikationer, anvendelser og begrænsninger; få altid generation og konfiguration bekræftet.`,
    noStockLine:
      "Ingen priser og ingen lagerstatus her, fordi vi skaffer maskinerne til den enkelte ordre.",
    noStockLink: "Sådan bliver prisen til",
    byTypeLine: "Leder I efter en type maskine frem for en bestemt model?",
    byTypeLink: "Se computere til erhverv efter kategori",
    noShopBody1:
      "Vi holder ikke lager, og der står ingen priser her. Listen viser modeltyper, ikke varer på hylden. Når I ved, hvad I skal bruge, finder vi maskinerne i vores leverandørnetværk og vender tilbage med pris, stand, antal og leveringstid.",
    noShopBody2:
      "Send det præcise modelnummer, antal og de vigtigste krav. Vi kan undersøge mulighederne og relevante alternativer; listen er ikke en garanti for, hvad der er tilgængeligt.",
  },
  en: {
    metaTitle: "Refurbished ThinkPad, EliteBook, Latitude, OptiPlex | Kestro",
    metaDescription:
      "See 18 refurbished IT models from Lenovo, HP and Dell. Find specs, benefits and limits for PCs, monitors and docks. Ask about a specific unit here.",
    title: "Used business models: ThinkPad, EliteBook, Latitude and OptiPlex",
    description: `Compare ${models.length} used business models in ${modelGroups.length} groups, from laptops to docking stations. Each model has specifications, uses and limitations; always confirm the generation and configuration.`,
    noStockLine: "No prices or stock levels here, because we source the machines for each order.",
    noStockLink: "How the price is set",
    byTypeLine: "Looking for a type of machine rather than a specific model?",
    byTypeLink: "See business computers by category",
    noShopBody1:
      "We do not hold stock, and there are no prices here. The list shows types of machine, not goods on a shelf. Once you know what you need, we find the machines in our supplier network and come back with price, condition, quantity and lead time.",
    noShopBody2:
      "Send the exact model number, quantity and main requirements. We can investigate options and relevant alternatives; the list does not guarantee availability.",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/modeller", params.lang),
  };
}

export default async function ModellerPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const introductionEnd = c.description.indexOf(".") + 1;
  const introduction = c.description.slice(0, introductionEnd);
  const descriptionDetails = c.description.slice(introductionEnd).trim();
  return (
    <>
      <PageSchema
        lang={lang}
        type="CollectionPage"
        route="/modeller"
        name={c.title}
        description={c.description}
      />

      <section className="py-6 sm:py-12">
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[{ name: lang === "da" ? "Modeller" : "Models", href: "/modeller" }]}
            className="mb-3"
          />
          <div className="grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-12">
            <h1 className="t-h2 text-balance font-display font-extrabold tracking-display text-paper">
              {c.title}
            </h1>
            <div>
              <p className="text-sm leading-6 text-paper/85">{introduction}</p>
              <p className="mt-2 text-xs leading-5 text-paper/65">
                {lang === "da" ? "Opdateret" : "Updated"}{" "}
                <time dateTime={pageUpdated("/modeller")} className="tabular-nums text-paper/85">
                  {formatDate(pageUpdated("/modeller"), lang)}
                </time>
              </p>
            </div>
          </div>

          {/* One line, where there was a panel. The panel's two paragraphs
              were also the answers to two of the questions at the foot of
              this page, so they were on it twice; the full reasoning lives
              on /priser and in those answers. */}
          <p className="mt-4 max-w-3xl text-sm leading-6 text-paper/65">
            {c.noStockLine}{" "}
            <Link
              href={localePath("/priser", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.noStockLink}
            </Link>
          </p>
          <ModelCatalogue
            models={models}
            lang={lang}
            heading={lang === "da" ? "Find og sammenlign modeller" : "Find and compare models"}
          />

          {/* Preserve the category route for a buyer arriving without a model name. */}
          <p className="mt-6 max-w-3xl text-sm leading-[1.6] text-paper/65">
            {c.byTypeLine}{" "}
            <Link
              href={localePath("/produkter", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.byTypeLink}
            </Link>
          </p>

          <p className="mt-6 max-w-3xl text-sm leading-[1.6] text-paper/65">
            {lang === "da"
              ? "Billederne er modelfotos eller illustrationer af formatet – ikke den maskine, I får. En bærbar vises kun med et rigtigt foto af netop den model, så nogle står endnu uden billede."
              : "The pictures are model photos or illustrations of the format — not the machine you get. A laptop is only shown with a real photo of that exact model, so some have no picture yet."}
          </p>

          <details className="group mt-8 border-y border-white/10">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <h2 className="text-base font-semibold text-paper/85">
                {lang === "da" ? "Om modelgrupperne" : "About the model groups"}
              </h2>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 flex-none text-paper/65 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                strokeWidth={2}
              />
            </summary>
            <p className="max-w-3xl pb-6 text-sm leading-6 text-paper/75">{descriptionDetails}</p>
            <div className="grid gap-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
              {modelGroups.map((group) => (
                <div key={group.id}>
                  <h3 className="text-base font-semibold text-paper">{group.name[lang]}</h3>
                  <p className="mt-2 text-sm leading-6 text-paper/75">{group.description[lang]}</p>
                </div>
              ))}
            </div>
          </details>
        </Container>
      </section>

      <Faq
        lang={lang}
        title={{ da: "Spørgsmål om modellerne", en: "Questions about the models" }}
        items={[
          {
            question: {
              da: "Kan I skaffe en model, der ikke står på listen?",
              en: "Can you source a model that is not on the list?",
            },
            answer: { da: copy.da.noShopBody2, en: copy.en.noShopBody2 },
          },
          {
            question: { da: "Har I modellerne på lager?", en: "Do you have the models in stock?" },
            answer: { da: copy.da.noShopBody1, en: copy.en.noShopBody1 },
          },
          {
            question: {
              da: "Hvilken Windows-version kommer computerne med?",
              en: "Which version of Windows do the computers come with?",
            },
            answer: {
              da: "Aftal version, udgave og licens for den valgte konfiguration. Windows 11 kræver blandt andet en understøttet processor, TPM 2.0 og Secure Boot. Microsofts almindelige support for Windows 10 sluttede den 14. oktober 2025.",
              en: "Agree the version, edition and licence for the chosen configuration. Windows 11 requires a supported processor, TPM 2.0 and Secure Boot among other things. Microsoft's general Windows 10 support ended on 14 October 2025.",
            },
          },
        ]}
      />

      <FactNote lang={lang} ids={["windows11Requirements", "windows10Eol"]} />

      <CtaSection lang={lang} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { models, modelGroups } from "@/lib/models";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";
import SpecChips from "@/components/SpecChips";

const copy = {
  da: {
    metaTitle: "Brugte ThinkPad, EliteBook, Latitude og OptiPlex | Kestro",
    metaDescription:
      "18 brugte erhvervsmodeller fra Lenovo, HP og Dell. Se specifikationer, fordele og ulemper for pc'er, skærme og docks. Spørg til en specifik model.",
    title: "Brugte erhvervsmodeller: ThinkPad, EliteBook, Latitude og OptiPlex",
    /* Answer first, with the counts the page actually shows. */
    description: `Sammenlign ${models.length} brugte erhvervsmodeller i ${modelGroups.length} grupper fra bærbare til dockingstationer. Hver model har specifikationer, anvendelser og begrænsninger; få altid generation og konkret konfiguration bekræftet.`,
    noStockLine:
      "Ingen priser og ingen lagerstatus her, fordi vi skaffer maskinerne til den enkelte ordre.",
    noStockLink: "Sådan bliver prisen til",
    byTypeLine: "Leder I efter en type maskine frem for en bestemt model?",
    byTypeLink: "Se computere til erhverv efter kategori",
    noShopBody1:
      "Vi holder ikke lager, og der står ingen priser her. Listen viser modeltyper, ikke varer på hylden. Når I ved, hvad I skal bruge, finder vi maskinerne i vores leverandørnetværk og vender tilbage med pris, stand, antal og leveringstid.",
    noShopBody2:
      "Send det præcise modelnummer, antal og de vigtigste krav. Vi kan undersøge mulighederne og relevante alternativer; listen er ikke en garanti for, hvad der er tilgængeligt.",
    seeSpecs: "Se specifikationer",
  },
  en: {
    metaTitle: "Refurbished ThinkPad, EliteBook, Latitude, OptiPlex | Kestro",
    metaDescription:
      "See 18 refurbished IT models from Lenovo, HP and Dell. Find specs, benefits and limits for PCs, monitors and docks. Ask about a specific unit here.",
    title: "Used business models: ThinkPad, EliteBook, Latitude and OptiPlex",
    description: `Compare ${models.length} used business models in ${modelGroups.length} groups, from laptops to docking stations. Each model has specifications, uses and limitations; always confirm the generation and actual configuration.`,
    noStockLine: "No prices or stock levels here, because we source the machines for each order.",
    noStockLink: "How the price is set",
    byTypeLine: "Looking for a type of machine rather than a specific model?",
    byTypeLink: "See business computers by category",
    noShopBody1:
      "We do not hold stock, and there are no prices here. The list shows types of machine, not goods on a shelf. Once you know what you need, we find the machines in our supplier network and come back with price, condition, quantity and lead time.",
    noShopBody2:
      "Send the exact model number, quantity and main requirements. We can investigate options and relevant alternatives; the list does not guarantee availability.",
    seeSpecs: "See specifications",
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
  return (
    <>
      <PageSchema
        lang={lang}
        type="CollectionPage"
        route="/modeller"
        name={c.title}
        description={c.description}
      />

      <section className="py-10 sm:py-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/modeller"
            crumb={lang === "da" ? "Modeller" : "Models"}

            updated="/modeller"
          />

          {/* One line, where there was a panel. The panel's two paragraphs
              were also the answers to two of the questions at the foot of
              this page, so they were on it twice; the full reasoning lives
              on /priser and in those answers. */}
          <p className="mt-6 max-w-3xl text-sm leading-[1.6] text-paper/65">
            {c.noStockLine}{" "}
            <Link
              href={localePath("/priser", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.noStockLink}
            </Link>
          </p>
          {/* Search Console lands "computer til erhverv" and its variants
              here, on the model catalogue. A search that names no model
              belongs to the general category (mak rule 2), so the catalogue
              points there in so many words. */}
          <p className="mt-2 max-w-3xl text-sm leading-[1.6] text-paper/65">
            {c.byTypeLine}{" "}
            <Link
              href={localePath("/produkter", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.byTypeLink}
            </Link>
          </p>

          {modelGroups.map((group) => {
            const groupModels = models.filter((model) => model.group === group.id);
            if (groupModels.length === 0) return null;

            return (
              <div key={group.id} className="mt-14">
                <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                  {group.name[lang]}
                </h2>
                <p className="mt-2 max-w-3xl text-base leading-[1.75] text-paper/75">
                  {group.description[lang]}
                </p>

                {/* A shelf to swipe on a phone (.rail), the grid from md. */}
                <ul className="rail mt-6 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                  {groupModels.map((model) => (
                    <li key={model.slug}>
                      <Link
                        href={localePath(`/modeller/${model.slug}`, lang)}
                        className="plate plate-lift group flex h-full flex-col p-5 sm:p-6"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-paper/65">
                          {model.brand} · {model.format[lang]}
                        </span>
                        <h3 className="mt-2 text-base font-semibold text-paper group-hover:text-paper sm:text-lg">
                          {model.name}
                        </h3>
                        <p className="mt-2 text-sm leading-[1.6] text-paper/75">
                          {model.tagline[lang]}
                        </p>
                        <SpecChips model={model} lang={lang} />
                        {/* Pushes the footer row down so every card in a row ends
                            level, whether it got three chips, two or none. */}
                        <span className="flex-1" />
                        {/* The card's one action, which is what tapping it does. It
                            also said "Få et tilbud" in white beside it: not a
                            link, on every card, five groups down the page. */}
                        <span className="mt-4 inline-flex items-center gap-1.5 border-t border-white/10 pt-3 text-sm font-semibold text-brand-300">
                          {c.seeSpecs}
                          <span aria-hidden="true">&rarr;</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
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
              da: "Aftal version, udgave og licens for den konkrete konfiguration. Windows 11 kræver blandt andet en understøttet processor, TPM 2.0 og Secure Boot. Microsofts almindelige support for Windows 10 sluttede den 14. oktober 2025.",
              en: "Agree the version, edition and licence for the actual configuration. Windows 11 requires a supported processor, TPM 2.0 and Secure Boot among other things. Microsoft's general Windows 10 support ended on 14 October 2025.",
            },
          },
        ]}
      />

      <FactNote lang={lang} ids={["windows11Requirements", "windows10Eol"]} />

      <CtaSection lang={lang} />
    </>
  );
}

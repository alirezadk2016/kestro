import type { FaqItem } from "@/components/Faq";
import type { Category } from "./categories";
import { countWord, type Lang } from "./i18n";
import { models } from "./models";
import type { SourceId } from "./sources";

/*
 * What a category page answers, built from lib/categories.ts and lib/models.ts.
 *
 * Same reasoning as lib/model-copy.ts: generated from the data the page
 * already renders, so the questions and the brand list cannot disagree with
 * the table further down. The one figure in the lead is the count of the list
 * on the page.
 */

/** Categories whose machines run Windows, and so the only ones that cite it. */
const COMPUTERS = new Set(["baerbare-computere", "stationaere-computere", "mini-pc"]);

const lc = (text: string) =>
  /^[A-ZÆØÅ][a-zæøå]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;

const list = (items: string[], and: string) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;

export function categoryLead(category: Category, lang: Lang): string {
  if (category.slug === "baerbare-computere") {
    return lang === "da"
      ? "Find en brugt bærbar til erhverv efter dit behov: kontor, hjemmearbejde eller startup. Afklar opgaver, budget og dansk eller norsk tastatur, før du vælger computer."
      : "Find a used business laptop around your needs: office work, home working or a startup. Clarify tasks, budget and a Danish or Norwegian keyboard before choosing a computer.";
  }
  const n = category.brands.length;
  const some = list(category.brands.slice(0, 3), lang === "da" ? "og" : "and");
  /* A definition, then the count: "X from Kestro are <tagline>." */
  return lang === "da"
    ? `${category.name.da} fra Kestro er ${lc(category.tagline.da)}. Vi skaffer fra ${n} mærker og serier, blandt andet ${some}.`
    : `${category.name.en} from Kestro are ${lc(category.tagline.en)}. We source from ${n} brands and ranges, including ${some}.`;
}

const PREPARED: Record<string, { da: string; en: string }> = {
  "baerbare-computere": {
    da: "Bed om testresultat, dokumentation for sletning, dansk eller norsk tastatur og en beskrivelse af stand og batteri. Aftal, hvad der skal klargøres, og hvad der følger med.",
    en: "Ask for test results, erasure documentation, a Danish or Norwegian keyboard, and a description of condition and battery health. Agree what preparation is needed and what is included.",
  },
  "stationaere-computere": {
    da: "Bed om testresultat, dokumentation for sletning og oplysninger om Windows-licens. Aftal også tastatur, mus og skærmkabler, hvis de skal med.",
    en: "Ask for test results, erasure documentation and Windows licence details. Also agree on a keyboard, mouse and monitor cables if needed.",
  },
  "mini-pc": {
    da: "Bed om testresultat, dokumentation for sletning og oplysninger om Windows-licens. Kontrollér, at den rigtige strømforsyning og eventuelt VESA-beslag er med.",
    en: "Ask for test results, erasure documentation and Windows licence details. Check that the correct power supply and any required VESA mount are included.",
  },
  skaerme: {
    da: "Bed om oplysninger om pixel- og panelskader, fodens justering og de medfølgende kabler. En skærm uden fod eller det rigtige kabel kræver ekstra tilbehør.",
    en: "Ask about pixel and panel defects, stand adjustment and included cables. A monitor without a stand or the right cable needs extra accessories.",
  },
  dockingstationer: {
    da: "Få oplyst det præcise dock-modelnummer, strømforsyning, værtskabel og eventuelt behov for firmware eller drivere. Samme stikform betyder ikke nødvendigvis samme funktion.",
    en: "Confirm the exact dock model number, power supply, host cable and any firmware or driver requirements. The same connector shape does not necessarily mean the same functionality.",
  },
  tablets: {
    da: "Bed om batteritilstand, test af touchskærm og bekræftelse på, at enheden er frigivet fra tidligere ejer og administration. Nulstilling alene dokumenterer ikke, at en tablet kan tilmeldes jeres MDM.",
    en: "Ask for battery health, touchscreen test results and confirmation that the device has been released from its previous owner and management. A reset alone does not establish that a tablet can enrol in your MDM.",
  },
  smartphones: {
    da: "Bed om batteritilstand, test af skærm, kamera og opladning samt bekræftelse på, at telefonen er frigivet fra tidligere ejer og administration. Aftal tilbehør og eventuel håndtering af de gamle telefoner særskilt.",
    en: "Ask for battery health, screen, camera and charging test results, and confirmation that the phone has been released from its previous owner and management. Agree accessories and any handling of old phones separately.",
  },
};

const BUYING_QUESTIONS: Record<string, FaqItem> = {
  "baerbare-computere": {
    question: {
      da: "Hvilken bærbar passer til mit behov?",
      en: "Which laptop fits my needs?",
    },
    answer: {
      da: "Start med de programmer, medarbejderne bruger, og om maskinen skal med på farten. Sammenlign derefter præcis processor, RAM, skærm, vægt og batteritilstand. Kontrollér, om RAM kan udvides, og om jeres eksisterende dock kan oplade maskinen og drive de ønskede skærme.",
      en: "Start with the applications staff use and whether the laptop will travel. Then compare the exact processor, RAM, display, weight and battery health. Check whether RAM is upgradeable and whether your existing dock can charge the laptop and drive the required monitors.",
    },
  },
  "stationaere-computere": {
    question: {
      da: "Skal vi vælge en tower, SFF eller mini-pc?",
      en: "Should we choose a tower, SFF or mini PC?",
    },
    answer: {
      da: "En tower giver typisk mest plads til udvidelser, mens SFF fylder mindre. En mini-pc passer til en kompakt arbejdsplads, men har færre muligheder for ekstra kort og drev. Kontrollér kabinet, strømforsyning, kortplads og skærmudgange på den konkrete model, især til CAD eller flere skærme.",
      en: "A tower generally leaves the most room for expansion, while SFF takes less space. A mini PC suits a compact desk but offers fewer options for extra cards and drives. Check the actual chassis, power supply, card clearance and display outputs, especially for CAD or multiple monitors.",
    },
  },
  "mini-pc": {
    question: {
      da: "Hvad skal vi kontrollere på en mini-pc til kontoret?",
      en: "What should we check on an office mini PC?",
    },
    answer: {
      da: "Se på antal skærmudgange, netværk, støjkrav og plads til RAM og lager. Et modelnavn kan dække flere kabinetter og valgfrie porte, så bed om billeder af de faktiske tilslutninger. Aftal strømforsyning og beslag, hvis pc'en skal monteres bag en skærm.",
      en: "Check display outputs, networking, noise requirements and room for RAM and storage. A model name can cover different chassis and optional ports, so request photos of the actual connectors. Agree on the power supply and mount if the PC will sit behind a monitor.",
    },
  },
  skaerme: {
    question: {
      da: "Hvordan passer en brugt skærm til vores arbejdsplads?",
      en: "How do we match a used monitor to our workstation?",
    },
    answer: {
      da: "Vælg størrelse og opløsning efter arbejdsopgaven og pladsen på bordet. Kontrollér derefter pc'ens eller dockens udgang, skærmens indgang og det nødvendige kabel. USB-C er ikke i sig selv en garanti for opladning eller billedsignal; få den konkrete models funktioner bekræftet.",
      en: "Choose size and resolution around the work and desk space. Then check the PC or dock output, monitor input and required cable. USB-C alone does not guarantee charging or a video signal; confirm the capabilities of the exact model.",
    },
  },
  dockingstationer: {
    question: {
      da: "Hvordan ved vi, om en dock passer til vores bærbare?",
      en: "How do we know whether a dock fits our laptops?",
    },
    answer: {
      da: "Send laptop-model, dock-model og skærmenes opløsning og tilslutninger. USB-C, Thunderbolt og USB-docks med DisplayLink stiller forskellige krav. Kontrollér både billedsignal, nødvendig opladningseffekt og eventuelle drivere; et USB-C-stik alene er ikke nok til at afgøre kompatibilitet.",
      en: "Send the laptop model, dock model, and monitor resolutions and connections. USB-C, Thunderbolt and USB docks using DisplayLink have different requirements. Check video support, required charging power and any drivers; a USB-C connector alone cannot establish compatibility.",
    },
  },
  tablets: {
    question: {
      da: "Hvad bør vi tjekke på tablets til medarbejdere?",
      en: "What should we check on tablets for staff?",
    },
    answer: {
      da: "Få det præcise modelnummer, lagerplads, Wi-Fi- eller mobilnetvariant og status for sikkerhedsopdateringer. Kontrollér også jeres apps og MDM, samt om tastatur eller pen passer til generationen. Tilbehør fra én generation passer ikke nødvendigvis til den næste.",
      en: "Confirm the exact model number, storage, Wi-Fi or cellular variant, and security update status. Also check your apps and MDM, and whether the keyboard or pen fits that generation. Accessories for one generation do not necessarily fit the next.",
    },
  },
  smartphones: {
    question: {
      da: "Hvad er vigtigt ved brugte firmatelefoner?",
      en: "What matters when choosing used business phones?",
    },
    answer: {
      da: "Sammenlign præcis model, resterende sikkerhedsopdateringer, batteritilstand og lagerplads. Kontrollér jeres apps, MDM og behov for fysisk SIM eller eSIM på den konkrete variant. Bed om enheder uden tidligere ejers konto- eller administrationslås; en kosmetisk grad siger ikke noget om disse forhold.",
      en: "Compare the exact model, remaining security updates, battery health and storage. Check your apps, MDM, and physical SIM or eSIM requirements against the specific variant. Request devices without a previous owner's account or management lock; a cosmetic grade does not establish any of these details.",
    },
  },
};

export function categoryFaqs(category: Category): FaqItem[] {
  const name = { da: lc(category.name.da), en: lc(category.name.en) };
  const known = models.filter((m) => m.category === category.slug).map((m) => m.name);
  const items: FaqItem[] = [
    {
      question: {
        da: `Hvilke mærker af ${name.da} skaffer I?`,
        en: `Which brands of ${name.en} do you source?`,
      },
      answer: {
        da: `Blandt andre disse ${category.brands.length}: ${list(category.brands, "og")}. Står jeres mærke ikke på listen, så spørg.`,
        en: `These ${category.brands.length} among others: ${list(category.brands, "and")}. If yours is not on the list, ask.`,
      },
    },
  ];

  if (known.length) {
    items.push({
      question: {
        da: `Hvilke modeller af ${name.da} har I beskrevet?`,
        en: `Which models of ${name.en} have you described?`,
      },
      answer: {
        /* A sentence does not start with a digit, so the count is a word. */
        da: `${countWord(known.length, "da", true)} i detaljer: ${list(known, "og")}. ${known.length === 1 ? "Den" : "Hver"} har sin egen side med typisk konfiguration, hvad den er god til, og hvad man skal være opmærksom på.`,
        en: `${countWord(known.length, "en", true)} in detail: ${list(known, "and")}. ${known.length === 1 ? "It has" : "Each has"} its own page with the typical configuration, what it suits and what to watch for.`,
      },
    });
  }

  items.push({
    question: {
      da: `Hvad skal vi oplyse for at få et tilbud på ${name.da}?`,
      en: `What should we tell you to get a quote on ${name.en}?`,
    },
    answer: {
      da: `Antal, hvad udstyret skal bruges til, og hvornår I skal bruge det. ${category.specNote.da}`,
      en: `Quantity, what the equipment is for, and when you need it. ${category.specNote.en}`,
    },
  });

  const buyingQuestion = BUYING_QUESTIONS[category.slug];
  if (buyingQuestion) items.push(buyingQuestion);
  if (category.slug === "baerbare-computere") {
    items.push(
      {
        question: {
          da: "Hvordan vælger jeg en billig bærbar til arbejde?",
          en: "How do I choose a low-cost laptop for work?",
        },
        answer: {
          da: "Sæt et samlet budget, og vælg efter de programmer, du faktisk bruger. Sammenlign batteritilstand, skærm, tastatur, medfølgende oplader og muligheder for opgradering. En lav købspris er ikke nødvendigvis en lav samlet pris, hvis der mangler tilbehør eller skal skiftes batteri. Bed om pris på den konkrete løsning.",
          en: "Set a total budget and choose around the applications you actually use. Compare battery health, display, keyboard, included charger and upgrade options. A low purchase price is not necessarily a low total cost if accessories or a battery replacement are needed. Ask for a price for the specific setup.",
        },
      },
      {
        question: {
          da: "Hvilken bærbar passer til en startup eller nystartet virksomhed?",
          en: "Which laptop suits a startup or new business?",
        },
        answer: {
          da: "Skriv de første arbejdsopgaver ned: mail, regnskab, videomøder, udvikling eller design. Afklar derefter mobilitet, RAM, skærme, licenser og budget per medarbejder. Til en startup er det nyttigt at kunne genbruge skærme og docks og udvide løsningen, når næste medarbejder starter; dyrere hardware er ikke automatisk det rigtige valg.",
          en: "List the initial tasks: email, accounting, video calls, development or design. Then clarify mobility, RAM, monitors, licences and budget per employee. A startup benefits from reusing monitors and docks and expanding the setup as staff join; more expensive hardware is not automatically the right choice.",
        },
      },
      {
        question: {
          da: "Kan jeg få en bærbar med dansk eller norsk tastatur?",
          en: "Can I request a laptop with a Danish or Norwegian keyboard?",
        },
        answer: {
          da: "Angiv dansk eller norsk fysisk tastaturlayout i forespørgslen, og bed om et billede af tasterne. Et nordisk kombinationslayout, et udskiftet tastatur og klistermærker er forskellige løsninger. Muligheden for et fysisk skift og eventuelt baggrundslys skal afklares for den konkrete maskine; Windows-sprog ændrer ikke tegnene på tasterne.",
          en: "Specify a Danish or Norwegian physical keyboard layout in the enquiry and request a photo of the keys. A combined Nordic layout, replacement keyboard and stickers are different solutions. A physical swap and any backlight must be checked for the exact machine; changing Windows language does not change the printed keys.",
        },
      },
    );
  }

  const prepared = PREPARED[category.slug];
  if (prepared) {
    items.push({
      question: {
        da: `Hvad skal være aftalt om klargøring af ${name.da}?`,
        en: `What should be agreed about preparing ${name.en}?`,
      },
      answer: {
        da: `${prepared.da} Få også leveringsadresse, fragt og tidsramme bekræftet skriftligt.`,
        en: `${prepared.en} Also get the delivery address, shipping cost and lead time confirmed in writing.`,
      },
    });
  }

  if (COMPUTERS.has(category.slug)) {
    items.push({
      question: {
        da: "Hvilken Windows-version kommer maskinerne med?",
        en: "Which version of Windows do the machines come with?",
      },
      answer: {
        da: "Aftal version, udgave og licens for den konkrete maskine. Windows 11 kræver blandt andet en understøttet processor, TPM 2.0 og Secure Boot; et modelnavn alene er ikke nok. Microsofts almindelige support for Windows 10 sluttede den 14. oktober 2025.",
        en: "Agree the version, edition and licence for the specific machine. Windows 11 requires a supported processor, TPM 2.0 and Secure Boot among other things; a model name alone is not enough. Microsoft's general Windows 10 support ended on 14 October 2025.",
      },
    });
  }

  items.push(whyUsed);

  items.push({
    question: { da: `Har I ${name.da} på lager?`, en: `Do you have ${name.en} in stock?` },
    answer: {
      da: "Nej. Vi skaffer udstyret til den enkelte ordre i stedet for at holde lager, så specifikationerne følger opgaven. Der er ingen minimumsordre.",
      en: "No. We source per order rather than holding stock, so the specification follows the job. There is no minimum order.",
    },
  });

  return items;
}

export const categorySources = (category: Category): SourceId[] =>
  COMPUTERS.has(category.slug)
    ? ["windows11Requirements", "windows10Eol", "ewasteMonitor"]
    : ["ewasteMonitor"];

/** Why used rather than new, without claiming anything about the equipment itself. */
export const whyUsed: FaqItem = {
  question: { da: "Hvorfor brugt frem for nyt?", en: "Why used rather than new?" },
  answer: {
    da: "Fordi udstyr, der stadig kan det, opgaven kræver, gør mere gavn i brug end som affald. Ifølge ITU og UNITAR producerede verden 62 mio. ton elektronikaffald i 2022, og 22,3 % af det blev dokumenteret indsamlet og genanvendt.",
    en: "Because equipment that can still do what the job needs does more good in use than as waste. According to ITU and UNITAR, the world generated 62 million tonnes of e-waste in 2022, and 22.3% of it was documented as collected and recycled.",
  },
};

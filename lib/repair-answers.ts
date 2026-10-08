import type { FaqItem } from "@/components/Faq";
import type { Lang } from "./i18n";
import type { Repair } from "./repairs";
import type { SourceId } from "./sources";

/*
 * The questions under each repair page.
 *
 * Two are asked of every repair because every customer asks them, and the
 * answers are the workshop's standing ones from /reparation: a price before
 * any work starts, and private customers welcome. The third is the one that
 * belongs to that repair, answered from its own page or, where the answer is
 * someone else's rule, from the source registry — which is then cited.
 */

/** "Batteriskift" → "batteriskift", but "Windows-installation" and "PC building" keep their capital. */
const lc = (name: string) =>
  /^Windows/.test(name) || !/^[A-ZÆØÅ][a-zæøå]/.test(name)
    ? name
    : name[0].toLowerCase() + name.slice(1);

const shared = (repair: Repair): FaqItem[] => [
  {
    question: {
      da: `Hvad koster ${lc(repair.name.da)}?`,
      en: `What does ${lc(repair.name.en)} cost?`,
    },
    answer: {
      da: "Du får en pris, før vi går i gang. Skriv model og hvad der sker, så vender vi tilbage med et estimat – og et ærligt svar, hvis det ikke kan betale sig.",
      en: "You get a price before we start. Write the model and what happens, and we come back with an estimate — and an honest answer if it is not worth doing.",
    },
  },
  {
    question: {
      da: `Kan private få lavet ${lc(repair.name.da)}?`,
      en: `Can private customers have ${lc(repair.name.en)} done?`,
    },
    answer: {
      da: "Ja. Værkstedet er den ene del af Kestro, hvor private også er velkomne – resten er indkøb og levering til virksomheder. Der er ingen minimumsordre.",
      en: "Yes. The workshop is the one part of Kestro where individuals are welcome too — the rest is purchasing and delivery for companies. There is no minimum order.",
    },
  },
];

const compatibleParts: FaqItem = {
  question: {
    da: "Må et uafhængigt værksted bruge kompatible reservedele?",
    en: "May an independent workshop use compatible spare parts?",
  },
  answer: {
    da: "Ja. Ifølge EU's reparationsdirektiv 2024/1799, der skal anvendes i medlemsstaterne fra 31. juli 2026, må producenter ikke forhindre uafhængige værksteder i at bruge originale, brugte, kompatible eller 3D-printede reservedele.",
    en: "Yes. Under EU repair directive 2024/1799, which applies in the member states from 31 July 2026, manufacturers may not impede independent repairers from using original, second-hand, compatible or 3D-printed spare parts.",
  },
};

const windowsMinimum: FaqItem = {
  question: {
    da: "Hvad kræver Windows 11 af maskinen?",
    en: "What does Windows 11 require of the machine?",
  },
  answer: {
    da: "Ifølge Microsoft mindst en 64-bit processor på 1 GHz med 2 kerner, 4 GB RAM, 64 GB lager, TPM 2.0 og UEFI med Secure Boot. Det er gulvet – til kontorarbejde med mange programmer åbne er mere hukommelse end minimum det, der mærkes.",
    en: "According to Microsoft, at least a 1 GHz 64-bit processor with 2 cores, 4 GB RAM, 64 GB storage, TPM 2.0 and UEFI with Secure Boot. That is the floor — for office work with many programs open, memory above the minimum is what you notice.",
  },
};

type Extra = { faqs: FaqItem[]; sources: SourceId[] };

const specific: Record<string, Extra> = {
  batteriskift: { faqs: [compatibleParts], sources: ["repairDirective"] },
  "ram-og-ssd-opgradering": {
    faqs: [
      {
        question: {
          da: "Hvor meget RAM kan min maskine tage?",
          en: "How much memory can my machine take?",
        },
        answer: {
          da: "Det afhænger af modellen. En ThinkPad T480 leveres typisk med 8 GB og kan udvides til 32 GB, mens en X1 Carbon har hukommelsen loddet fast fra fabrikken. Vi oplyser, hvor meget netop din maskine maksimalt kan tage, før vi bestiller noget.",
          en: "It depends on the model. A ThinkPad T480 typically comes with 8 GB and can be expanded to 32 GB, while an X1 Carbon has its memory soldered at the factory. We tell you the most your machine can take before we order anything.",
        },
      },
      windowsMinimum,
    ],
    sources: ["windows11Requirements"],
  },
  skaermskift: { faqs: [compatibleParts], sources: ["repairDirective"] },
  "tastaturskift-og-nordisk-layout": { faqs: [compatibleParts], sources: ["repairDirective"] },
  "reservedele-og-komponentskift": {
    faqs: [
      {
        question: {
          da: "Kan det betale sig at skifte en enkelt del?",
          en: "Is it worth replacing a single part?",
        },
        answer: {
          da: "Ofte. De fleste maskiner, der bliver kasseret, fejler én ting – et hængsel, et ladestik, en blæser. Vi finder ud af, hvilken del der fejler, før vi bestiller noget, og siger til, hvis delen koster mere, end maskinen er værd.",
          en: "Often. Most machines that get scrapped have one fault — a hinge, a charging port, a fan. We find out which part has failed before we order anything, and say so if the part costs more than the machine is worth.",
        },
      },
    ],
    sources: [],
  },
  "rens-og-koeling": {
    faqs: [
      {
        question: {
          da: "Hvorfor bliver en varm maskine langsommere?",
          en: "Why does a hot machine get slower?",
        },
        answer: {
          da: "Fordi den sætter sig selv ned i fart for ikke at tage skade. Den er altså ikke bare larmende – den er også langsommere, og det bliver ofte læst som, at maskinen er for gammel. Tit er den bare stoppet til med støv og tør kølepasta.",
          en: "Because it slows itself down to avoid damage. So it is not just loud — it is slower too, and that is often read as the machine being too old. Often it is simply clogged with dust and dry thermal paste.",
        },
      },
    ],
    sources: [],
  },
  "windows-installation": {
    faqs: [
      {
        question: {
          da: "Hvilken Windows-version installerer I?",
          en: "Which version of Windows do you install?",
        },
        answer: {
          da: "Windows 11, hvis maskinen opfylder kravene – ifølge Microsoft blandt andet TPM 2.0 og Secure Boot. Supporten for Windows 10 sluttede 14. oktober 2025, så en maskine på Windows 10 får ikke længere sikkerhedsrettelser.",
          en: "Windows 11, if the machine meets the requirements — according to Microsoft, TPM 2.0 and Secure Boot among others. Windows 10 support ended on 14 October 2025, so a machine on Windows 10 no longer gets security fixes.",
        },
      },
    ],
    sources: [],
  },
  "software-og-licenser": {
    faqs: [
      {
        question: {
          da: "Følger licenserne med brugt hardware?",
          en: "Do licences come with used hardware?",
        },
        answer: {
          da: "Nej, ikke automatisk. Hardware og licenser købes hver for sig, så afklar hvilke licenser I allerede har, før maskinerne står på skrivebordene. Vi siger til, hvis noget ikke kan overdrages.",
          en: "No, not automatically. Hardware and licences are bought separately, so settle which licences you already have before the machines are on the desks. We tell you if something cannot be transferred.",
        },
      },
    ],
    sources: [],
  },
  "ny-opsaetning-og-dataflytning": {
    faqs: [
      {
        question: {
          da: "Hvornår bliver den gamle maskine slettet?",
          en: "When is the old machine erased?",
        },
        answer: {
          da: "Først når vi har gennemgået listen over filer, profiler og programmer med jer. NIST skelner mellem 3 niveauer af sletning – Clear, Purge og Destroy – så sig til, hvis den gamle maskine skal sælges eller kasseres.",
          en: "Only once we have gone through the list of files, profiles and programs with you. NIST distinguishes 3 levels of erasure — Clear, Purge and Destroy — so say if the old machine is to be sold or scrapped.",
        },
      },
    ],
    sources: [],
  },
  fejlfinding: {
    faqs: [
      {
        question: {
          da: "Retter I fejlen med det samme?",
          en: "Do you fix the fault straight away?",
        },
        answer: {
          da: "Nej. Vi finder årsagen først og melder tilbage med, hvad en reparation vil koste, før vi retter noget – og siger det, hvis den ikke kan betale sig.",
          en: "No. We find the cause first and come back with what a repair will cost before we fix anything — and say so if it is not worth it.",
        },
      },
    ],
    sources: [],
  },
  "samling-af-pc": {
    faqs: [
      {
        question: {
          da: "Kan I bygge videre på vores eksisterende maskine?",
          en: "Can you build on our existing machine?",
        },
        answer: {
          da: "Ja, hvis den kan bære det. Det, der afgør delene, er hvad maskinen skal kunne – og om der allerede står en maskine, der kan bygges videre på i stedet for at starte forfra.",
          en: "Yes, if it can carry it. What decides the parts is what the machine has to do — and whether there is already a machine that can be built on instead of starting over.",
        },
      },
      windowsMinimum,
    ],
    sources: ["windows11Requirements"],
  },
  "klargoering-af-brugt-udstyr": {
    faqs: [
      {
        question: {
          da: "Hvornår er et brugt batteri for slidt?",
          en: "When is a used battery too worn?",
        },
        answer: {
          da: "Over 80 % af den oprindelige kapacitet er almindeligt slid, under 70 % er det tid til at skifte. Vi oplyser batteriets faktiske kapacitet i procent, når vi har gennemgået maskinen.",
          en: "Above 80% of the original capacity is ordinary wear; below 70% it is time to replace it. We state the battery's actual capacity as a percentage once we have been through the machine.",
        },
      },
    ],
    sources: [],
  },
};

export function repairFaqs(repair: Repair): FaqItem[] {
  return [...(specific[repair.slug]?.faqs ?? []), ...shared(repair)];
}

/** The page's own sources plus any a specific answer above quotes, once each. */
export function repairSources(repair: Repair): SourceId[] {
  return [...new Set([...(repair.sources ?? []), ...(specific[repair.slug]?.sources ?? [])])];
}

export const repairFaqTitle = (repair: Repair, lang: Lang) =>
  lang === "da" ? `Spørgsmål om ${lc(repair.name.da)}` : `Questions about ${lc(repair.name.en)}`;

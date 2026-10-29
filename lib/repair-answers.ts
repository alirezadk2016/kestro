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
      en: `What is the price of ${lc(repair.name.en)}?`,
    },
    answer: {
      da: "Du får en pris, før vi går i gang. Skriv modellen, og hvad der sker, så vender vi tilbage med et estimat – og et ærligt svar, hvis det ikke kan betale sig.",
      en: "You get a price before we start. Write the model and what happens, and we come back with an estimate — and an honest answer if it is not worth doing.",
    },
  },
  {
    question: {
      da: `Kan private også få hjælp til ${lc(repair.name.da)}?`,
      en: `Can private customers get help with ${lc(repair.name.en)} too?`,
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
    da: "Ifølge Microsoft mindst en 64-bit processor på 1 GHz med 2 kerner, 4 GB RAM, 64 GB lager, TPM 2.0 og UEFI med Secure Boot. Det er minimum – til kontorarbejde med mange programmer åbne er det mere hukommelse, der kan mærkes.",
    en: "According to Microsoft, at least a 1 GHz 64-bit processor with 2 cores, 4 GB RAM, 64 GB storage, TPM 2.0 and UEFI with Secure Boot. That is the floor — for office work with many programs open, memory above the minimum is what you notice.",
  },
};

type Extra = { faqs: FaqItem[]; sources: SourceId[] };

const specific: Record<string, Extra> = {
  batteriskift: {
    faqs: [
      {
        question: {
          da: "Hvornår haster et batteriskift?",
          en: "When is a battery replacement urgent?",
        },
        answer: {
          da: "Når batteriet er opsvulmet – bunden buler, eller tastaturet løfter sig. Så stop med at bruge maskinen, og få batteriet skiftet sikkert. Slukker maskinen pludselig, selvom den viser strøm tilbage, er det også et typisk tegn på et slidt batteri.",
          en: "When the battery is swollen — the base bulges or the keyboard lifts. Stop using the machine, and have the battery replaced safely. A machine that shuts down suddenly while it still shows charge left is another typical sign of a worn battery.",
        },
      },
      compatibleParts,
    ],
    sources: ["repairDirective"],
  },
  "ram-og-ssd-opgradering": {
    faqs: [
      {
        question: {
          da: "Hvor meget RAM kan min maskine tage?",
          en: "How much memory can my machine take?",
        },
        answer: {
          da: "Det afhænger af den præcise maskine, dens sokler og om hukommelsen er fastloddet. Slå producentens specifikation op, og kontrollér også, hvad der allerede er installeret. Få maksimal kapacitet, kompatible dele og pris afklaret, før du køber en opgradering.",
          en: "It depends on the exact machine, its slots and whether memory is soldered. Check the manufacturer's specification and what is already installed. Confirm maximum capacity, compatible parts and price before buying an upgrade.",
        },
      },
      {
        question: {
          da: "Kan det betale sig at opgradere en gammel bærbar?",
          en: "Is upgrading an old laptop worthwhile?",
        },
        answer: {
          da: "Sammenhold pris på dele og arbejde med batteri, skærm, hængsler og understøttelse af styresystemet. Hvis flere dele er slidte, bør du også sammenligne med en anden computer. En opgradering giver kun mening, hvis den løser den konkrete begrænsning; der loves ikke en bestemt hastighedsforbedring.",
          en: "Compare parts and labour cost against the battery, screen, hinges and operating system support. If several parts are worn, compare a replacement computer too. An upgrade only makes sense if it addresses the actual limitation; no particular speed improvement is promised.",
        },
      },
      {
        question: {
          da: "Hvad er forskellen på opgradering og opdatering af en bærbar?",
          en: "What is the difference between upgrading and updating a laptop?",
        },
        answer: {
          da: "Her betyder opgradering ændringer i hardware, eksempelvis RAM eller SSD. Opdatering handler om Windows, drivere eller programmer. En langsom maskine skal undersøges, før man vælger mellem de to. Tag backup af vigtige filer før ændringer, især hvis lageret skal skiftes.",
          en: "Here, upgrading means hardware changes such as RAM or an SSD. Updating concerns Windows, drivers or applications. Investigate a slow machine before choosing between the two. Back up important files before changes, especially when replacing storage.",
        },
      },
      {
        question: {
          da: "Hvilken SSD passer i min bærbare?",
          en: "Which SSD fits my laptop?",
        },
        answer: {
          da: "Det afgøres af den ledige plads i maskinen. En M.2-plads kan være til SATA eller NVMe, og nogle bærbare har i stedet en 2,5-tommer SATA-plads. Vi tjekker modellens specifikation, før vi bestiller en disk.",
          en: "The free slot in the machine decides it. An M.2 slot can take SATA or NVMe, and some laptops have a 2.5-inch SATA bay instead. We check the model's specification before ordering a drive.",
        },
      },
      windowsMinimum,
    ],
    sources: ["windows11Requirements"],
  },
  skaermskift: {
    faqs: [
      {
        question: {
          da: "Hvorfor skal I vide, præcis hvilket panel der sidder i?",
          en: "Why do you need to know exactly which panel is fitted?",
        },
        answer: {
          da: "Fordi samme model ofte er solgt med og uden touch og i flere opløsninger, og det nye panel skal matche det gamle. Er skærmen helt sort, mens maskinen kører, kan fejlen også sidde i kablet eller baglyset – det undersøger vi, før vi bestiller et panel.",
          en: "Because the same model is often sold with and without touch and in several resolutions, and the new panel has to match the old one. If the screen is completely dark while the machine runs, the fault can also be in the cable or the backlight — we check that before ordering a panel.",
        },
      },
      compatibleParts,
    ],
    sources: ["repairDirective"],
  },
  "tastaturskift-og-nordisk-layout": {
    faqs: [
      {
        question: {
          da: "Kan man ikke bare bruge klistermærker?",
          en: "Couldn't you just use stickers?",
        },
        answer: {
          da: "Det kan man, men klistermærker kan slides af og sidde skævt. Vi skifter det fysiske tastatur, så æ, ø og å er trykt på tasterne.",
          en: "You could, but stickers can wear off and sit crooked. We replace the physical keyboard, so æ, ø and å are printed on the keys.",
        },
      },
      compatibleParts,
    ],
    sources: ["repairDirective"],
  },
  "reservedele-og-komponentskift": {
    faqs: [
      {
        question: {
          da: "Kan det betale sig at skifte en enkelt del?",
          en: "Is it worth replacing a single part?",
        },
        answer: {
          da: "Ofte. Mange maskiner bliver kasseret på grund af én enkelt fejl – et hængsel, et ladestik, en blæser. Vi finder ud af, hvilken del der fejler, før vi bestiller noget, og siger til, hvis delen koster mere, end maskinen er værd.",
          en: "Often. Many machines get scrapped over a single fault — a hinge, a charging port, a fan. We find out which part has failed before we order anything, and say so if the part costs more than the machine is worth.",
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
          da: "Fordi den skruer selv ned for farten for ikke at tage skade. Den er altså ikke bare larmende – den er også langsommere, og det bliver ofte forvekslet med, at maskinen er for gammel. Tit er den bare stoppet til med støv og tør kølepasta.",
          en: "Because it slows itself down to avoid damage. So it is not just loud — it is slower too, and that is often mistaken for the machine being too old. Often it is simply clogged with dust and dry thermal paste.",
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
          da: "Nej, ikke automatisk. Hardware og licenser købes hver for sig – både Windows og Office eller Microsoft 365 – så afklar, hvilke licenser du allerede har, før maskinerne står på skrivebordene. Vi siger til, hvis noget ikke kan overdrages.",
          en: "No, not automatically. Hardware and licences are bought separately — Windows as well as Office or Microsoft 365 — so settle which licences you already have before the machines are on the desks. We tell you if something cannot be transferred.",
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
          da: "Først når vi har gennemgået listen over filer, profiler og programmer med dig. NIST skelner mellem tre niveauer af sletning: Clear (overskrivning), Purge (sletning, så data heller ikke kan gendannes i et laboratorium) og Destroy (fysisk destruktion). Sig til, hvis den gamle maskine skal sælges eller kasseres.",
          en: "Only once we have gone through the list of files, profiles and programs with you. NIST distinguishes three levels of erasure: Clear (overwriting), Purge (erasure that cannot be recovered even in a laboratory) and Destroy (physical destruction). Say if the old machine is to be sold or scrapped.",
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
      {
        question: {
          da: "Hvad skal jeg skrive om fejlen?",
          en: "What should I tell you about the fault?",
        },
        answer: {
          da: "Hvad der sker, og hvornår: en blå skærm med en fejlkode, bip eller lyde ved opstart, en maskine, der genstarter af sig selv, eller en, der slet ikke starter. Har du et billede af fejlbeskeden, så send det med.",
          en: "What happens, and when: a blue screen with an error code, beeps or noises at start-up, a machine that restarts on its own, or one that will not start at all. If you have a photo of the error message, send it along.",
        },
      },
    ],
    sources: [],
  },
  "samling-af-pc": {
    faqs: [
      {
        question: {
          da: "Kan I bygge videre på min eksisterende maskine?",
          en: "Can you build on our existing machine?",
        },
        answer: {
          da: "Ja, hvis den kan bære det. Det, der afgør delene, er, hvad maskinen skal kunne – og om der allerede står en maskine, der kan bygges videre på i stedet for at starte forfra.",
          en: "Yes, if it can carry it. What decides the parts is what the machine has to do — and whether there is already a machine that can be built on instead of starting over.",
        },
      },
      {
        question: {
          da: "Hvilke dele skal passe sammen?",
          en: "Which parts have to match?",
        },
        answer: {
          da: "Processoren skal passe til bundkortets sokkel, strømforsyningen skal kunne klare grafikkortet, og kabinettet skal have plads til både grafikkort og køler. Vi vælger dem efter, hvad maskinen skal bruges til.",
          en: "The processor has to fit the motherboard's socket, the power supply has to handle the graphics card, and the case needs room for both the graphics card and the cooler. We choose them by what the machine will be used for.",
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
          da: "Sådan læser vi det: over 80 % af den oprindelige kapacitet er almindeligt slid, under 70 % er det tid til at skifte. Vi oplyser batteriets faktiske kapacitet i procent, når vi har gennemgået maskinen.",
          en: "As we read it: above 80% of the original capacity is ordinary wear; below 70% it is time to replace it. We state the battery's actual capacity as a percentage once we have been through the machine.",
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

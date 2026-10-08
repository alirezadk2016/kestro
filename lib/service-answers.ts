import type { FaqItem } from "@/components/Faq";
import type { Localized } from "./i18n";
import type { SourceId } from "./sources";

/*
 * What each service page answers first, and the questions under it.
 *
 * Kept beside lib/services.ts rather than in it because `summary` there is also
 * the one-liner on the /ydelser cards, and a card does not want three
 * sentences. The lead is the page's own opening: what the service is, with the
 * figure in it, in the words the page already uses further down.
 *
 * Every answer restates something the page or the rest of the site already
 * commits to — the service copy itself, the front page FAQ, /saelg-til-os and
 * the model pages. A source is attached only where an answer quotes it.
 */

type ServiceAnswers = { lead: Localized; faqs: FaqItem[]; sources: SourceId[] };

const noStock: FaqItem = {
  question: {
    da: "Har Kestro maskinerne på lager?",
    en: "Does Kestro hold the machines in stock?",
  },
  answer: {
    da: "Nej. Vi holder ikke lager og køber først ind, når der ligger en konkret ordre. Derfor følger specifikationerne opgaven i stedet for det, der tilfældigvis står på en hylde.",
    en: "No. We hold no stock and buy only once there is an actual order. That is why the specification follows the job rather than whatever happens to be on a shelf.",
  },
};

const erasure: FaqItem = {
  question: {
    da: "Hvad sker der med data på enhederne?",
    en: "What happens to the data on the devices?",
  },
  answer: {
    da: "Lagermedierne slettes, før enhederne klargøres igen, og vi oplyser, hvilken metode der er brugt. NIST, den amerikanske standardiseringsmyndighed, skelner mellem 3 niveauer – Clear, Purge og Destroy – så aftal på forhånd, hvilket I har brug for, og om I skal bruge dokumentation.",
    en: "The storage is erased before the devices are prepared again, and we tell you which method was used. NIST, the US standards body, distinguishes 3 levels — Clear, Purge and Destroy — so agree up front which one you need and whether you need documentation.",
  },
};

const windows: FaqItem = {
  question: {
    da: "Hvilken Windows-version kommer maskinerne med?",
    en: "Which version of Windows do the machines come with?",
  },
  answer: {
    da: "Windows 11, installeret med drivere. Ifølge Microsoft sluttede supporten for Windows 10 den 14. oktober 2025, og Windows 11 kræver blandt andet TPM 2.0 og Secure Boot.",
    en: "Windows 11, installed with drivers. According to Microsoft, Windows 10 support ended on 14 October 2025, and Windows 11 requires TPM 2.0 and Secure Boot among other things.",
  },
};

export const serviceAnswers: Record<string, ServiceAnswers> = {
  "sourcing-og-indkoeb": {
    lead: {
      da: "Sourcing er, at vi finder brugte erhvervsmaskiner hos leverandører i Sydeuropa til jeres konkrete ordre – fra 1 maskine til en hel flåde – og først køber ind, når I ved, hvad I skal bruge.",
      en: "Sourcing means we find used business machines through suppliers in southern Europe for your specific order — from 1 machine to a whole fleet — and buy only once you know what you need.",
    },
    faqs: [
      noStock,
      {
        question: { da: "Hvilke maskiner kan I skaffe?", en: "Which machines can you source?" },
        answer: {
          da: "Erhvervsserier frem for forbrugermodeller: bærbare som ThinkPad, EliteBook og Latitude, stationære og små formfaktorer, og skærme, dockingstationer, tastaturer og mus, så en plads er komplet.",
          en: "Business ranges rather than consumer models: laptops such as ThinkPad, EliteBook and Latitude, desktops and small form factors, and monitors, docks, keyboards and mice so a desk is complete.",
        },
      },
      {
        question: { da: "Hvad afhænger prisen af?", en: "What does the price depend on?" },
        answer: {
          da: "Specifikationerne, standen, antallet og tilbehøret. Vi sætter ikke listepriser på maskiner, vi ikke har købt endnu – prisen står i tilbuddet og gælder den konkrete leverance.",
          en: "The specification, the condition, the quantity and the accessories. We do not put list prices on machines we have not bought yet — the price is in the quote and holds for that delivery.",
        },
      },
      {
        question: { da: "Hvorfor brugt frem for nyt?", en: "Why used rather than new?" },
        answer: {
          da: "Fordi en erhvervsmaskine, der er bygget til at blive serviceret, kan holde til en runde mere. Ifølge ITU og UNITAR producerede verden 62 mio. ton elektronikaffald i 2022, og 22,3 % af det blev dokumenteret indsamlet og genanvendt.",
          en: "Because a business machine built to be serviced can take another round. According to ITU and UNITAR, the world generated 62 million tonnes of e-waste in 2022, and 22.3% of it was documented as collected and recycled.",
        },
      },
    ],
    sources: ["ewasteMonitor"],
  },

  "klargoering-og-test": {
    lead: {
      da: "Klargøring er arbejdet mellem indkøb og levering: en funktionstest af 4 ting – skærm, tastatur, batteri og ydeevne – opgradering efter behov og sletning af lagermediet, før maskinen sættes op igen.",
      en: "Preparation is the work between purchase and delivery: a function test of 4 things — screen, keyboard, battery and performance — upgrades where needed, and erasing the storage before the machine is set up again.",
    },
    faqs: [
      {
        question: {
          da: "Hvad bliver testet på en brugt maskine?",
          en: "What gets tested on a used machine?",
        },
        answer: {
          da: "Skærm, tastatur, batteri og ydeevne. Portene testes med udstyr i, fordi en port, der er slidt løs, ikke ses udefra, og skærmen åbnes og lukkes helt, fordi hængslerne er den mest oversete slitagedel.",
          en: "Screen, keyboard, battery and performance. The ports are tested with something plugged in, because a port worn loose cannot be seen from outside, and the lid is opened and closed fully, because the hinges are the most overlooked wear part.",
        },
      },
      {
        question: { da: "Hvordan bliver batteriet vurderet?", en: "How is the battery assessed?" },
        answer: {
          da: "Som den faktiske kapacitet i procent af ny – ikke bare »OK«. Stand og batteritilstand oplyses skriftligt per enhed.",
          en: "As its actual capacity as a percentage of new — not just “OK”. Condition and battery health are stated in writing per unit.",
        },
      },
      {
        question: { da: "Bliver maskinerne opgraderet?", en: "Are the machines upgraded?" },
        answer: {
          da: "Efter behov. RAM opgraderes, hvor opgaven kræver det, maskinerne sendes som udgangspunkt videre med SSD, og slidte dele skiftes.",
          en: "Where needed. Memory is upgraded where the job calls for it, the machines go out with an SSD as standard, and worn parts are replaced.",
        },
      },
      erasure,
    ],
    sources: ["nistSanitization"],
  },

  "nordisk-tilpasning": {
    lead: {
      da: "Nordisk tilpasning er 2 ting: et fysisk skift af tastaturet til dansk eller norsk layout, så æ, ø og å sidder rigtigt, og Windows sat op med drivere og sprog, så maskinen er klar fra dag 1.",
      en: "Nordic preparation is 2 things: a physical keyboard swap to a Danish or Norwegian layout, so æ, ø and å are where they belong, and Windows set up with drivers and language, so the machine is ready from day 1.",
    },
    faqs: [
      {
        question: {
          da: "Er det et fysisk tastaturskift eller en indstilling?",
          en: "Is it a physical keyboard swap or a setting?",
        },
        answer: {
          da: "Et fysisk skift. Maskiner fra Sydeuropa har spansk eller italiensk layout, så tastaturet skiftes til dansk eller norsk, og tasterne har de rigtige tegn trykt på.",
          en: "A physical swap. Machines from southern Europe have a Spanish or Italian layout, so the keyboard is replaced with a Danish or Norwegian one, and the keys have the right characters printed on them.",
        },
      },
      {
        question: { da: "Kan tastaturet få baggrundslys?", en: "Can the keyboard be backlit?" },
        answer: {
          da: "Baggrundslys er ikke standard på alle modeller. Skal I bruge det, så sig til, når vi taler om specifikationerne.",
          en: "A backlight is not standard on every model. If you need one, say so when we talk about the specification.",
        },
      },
      windows,
      {
        question: { da: "Hvad med licenserne?", en: "What about the licences?" },
        answer: {
          da: "Har I egne licensaftaler eller et image, I ruller ud, bruger vi dem. Ellers hjælper vi med at få licenserne på plads, så maskinerne kører lovligt fra dag 1.",
          en: "If you have your own licence agreements or an image you roll out, we use those. Otherwise we help get the licences in place so the machines run legally from day 1.",
        },
      },
    ],
    sources: ["windows10Eol", "windows11Requirements"],
  },

  levering: {
    lead: {
      da: "Levering er én samlet leverance til 1 eller flere adresser i Danmark og Norge, med en tidsramme, der står skriftligt i tilbuddet, før I bestiller noget.",
      en: "Delivery is one consignment to 1 or more addresses in Denmark and Norway, with a time frame that is in the quote, in writing, before you order anything.",
    },
    faqs: [
      {
        question: { da: "Hvor lang er leveringstiden?", en: "How long is the lead time?" },
        answer: {
          da: "Det afhænger af den konkrete bestilling, fordi vi sourcer per ordre og ikke sælger fra et lager. Vi lover ikke en fast leveringstid på forhånd – tidsrammen står i tilbuddet sammen med pris og stand.",
          en: "It depends on the specific order, because we source per order rather than selling from stock. We do not promise a fixed lead time up front — the time frame is in the quote, with the price and condition.",
        },
      },
      {
        question: { da: "Hvad følger med leverancen?", en: "What comes with the delivery?" },
        answer: {
          da: "Serienummer per maskine, stand og batteritilstand skriftligt per enhed, og garantivilkårene skriftligt, før I bestiller.",
          en: "A serial number per machine, condition and battery health in writing per unit, and the warranty terms in writing before you order.",
        },
      },
      {
        question: {
          da: "Kan I tage de gamle maskiner med retur?",
          en: "Can you take the old machines back?",
        },
        answer: {
          da: "Ja. Vi køber brugte erhvervsmaskiner og henter dem, og det kan aftales sammen med leverancen. Lagermedierne slettes, før enhederne klargøres til videresalg – NIST skelner mellem 3 niveauer af sletning, Clear, Purge og Destroy, så sig til, hvis I skal bruge dokumentation.",
          en: "Yes. We buy used business machines and collect them, and that can be agreed alongside the delivery. The storage is erased before the devices are prepared for resale — NIST distinguishes 3 levels of erasure, Clear, Purge and Destroy, so say if you need documentation.",
        },
      },
    ],
    sources: ["nistSanitization"],
  },

  "overskudslager-og-returvarer": {
    lead: {
      da: "Overskudslager er 4 slags udstyr, der aldrig nåede en kunde: returvarer, demoenheder, varer fra aflyste ordrer og modeller udfaset midt i et indkøb. Det taber værdi hver måned, det står stille, så vi finder køberne for jer.",
      en: "Surplus stock is 4 kinds of equipment that never reached a customer: returns, demo units, goods from cancelled orders and models discontinued mid-purchase. It loses value every month it sits still, so we find the buyers for you.",
    },
    faqs: [
      {
        question: { da: "Hvilket udstyr tager I imod?", en: "What equipment do you take?" },
        answer: {
          da: "Returvarer, demoenheder, varer fra en aflyst ordre og modeller, der blev udfaset midt i et indkøb. Det er sjældent defekt – bare svært at komme af med gennem de normale kanaler.",
          en: "Returns, demo units, goods from a cancelled order and models discontinued mid-purchase. It is rarely faulty — just hard to move through the normal channels.",
        },
      },
      {
        question: {
          da: "Er vi bundet, når vi beder om en vurdering?",
          en: "Are we committed once we ask for a valuation?",
        },
        answer: {
          da: "Nej. I får en vurdering, før I beslutter jer, og I er ikke bundet af at have bedt om den.",
          en: "No. You get a valuation before you decide, and asking for it commits you to nothing.",
        },
      },
      erasure,
    ],
    sources: ["nistSanitization"],
  },

  "opstart-af-arbejdspladser": {
    lead: {
      da: "En komplet arbejdsplads er 4 dele – maskine, skærm, dockingstation og tastatur – sat op ens hver gang og leveret samlet til datoen, så alt virker den første morgen.",
      en: "A complete workstation is 4 parts — machine, monitor, docking station and keyboard — set up the same way every time and delivered together for the date, so everything works on the first morning.",
    },
    faqs: [
      {
        question: { da: "Hvad bliver oftest glemt?", en: "What usually gets forgotten?" },
        answer: {
          da: "Dockingstationer, og om modellen kræver en bestemt serie. Skærme, kabler og strømforsyninger nok til alle pladser. Og licenser – og hvem der ejer dem, når medarbejderen skifter maskine.",
          en: "Docks, and whether the model needs a particular series. Monitors, cables and power supplies for every desk. And licences — and who owns them when the employee changes machine.",
        },
      },
      {
        question: { da: "Kan det hele leveres samlet?", en: "Can it all be delivered together?" },
        answer: {
          da: "Ja. Vi taler opgaven igennem først – hvor mange pladser, hvad de skal lave, og hvornår de skal stå klar – og finder, klargør og leverer udstyret samlet, så I har én modtagelse frem for fem.",
          en: "Yes. We talk the job through first — how many desks, what they are for, and when they must be ready — then find, prepare and deliver the equipment together, so you have one delivery instead of five.",
        },
      },
      windows,
    ],
    sources: ["windows10Eol", "windows11Requirements"],
  },
};

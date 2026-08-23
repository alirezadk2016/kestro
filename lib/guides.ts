import type { Localized } from "./i18n";

/**
 * The guide section.
 *
 * Separate from the B2B pages on purpose: a procurement manager and someone
 * who wants to put more memory in their own laptop are not the same reader,
 * and mixing them weakens both. These pages exist to answer a question well
 * enough that the reader does not need us — which is exactly why the ones who
 * would rather not do it themselves call.
 *
 * Every guide targets a question people actually type. Nothing here is a
 * teaser for a paid course; if courses arrive later, they get their own type.
 */

export type GuideSection = {
  heading: Localized;
  body: Localized[];
  /** Optional list — used where steps or checks read better than prose. */
  list?: Localized[];
};

export type Guide = {
  slug: string;
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  summary: Localized;
  /** Who the guide is written for, so a reader can self-select on the hub. */
  audience: Localized;
  readingMinutes: number;
  /** ISO date. Shown, and used for the article schema. */
  updated: string;
  intro: Localized;
  sections: GuideSection[];
  /** What to do if you would rather not do it yourself. */
  closing: Localized;
};

export const guides: Guide[] = [
  {
    slug: "reparere-eller-koebe-ny",
    title: {
      da: "Reparere eller købe ny? Sådan regner du på det",
      en: "Repair or replace? How to work it out",
    },
    metaTitle: {
      da: "Reparere eller købe ny computer? Sådan regner du på det | Kestro",
      en: "Repair or replace your computer? How to work it out | Kestro",
    },
    metaDescription: {
      da: "En enkel måde at afgøre, om din computer kan betale sig at reparere: hvad delene koster, hvad maskinen er værd, og hvornår du skal lade være.",
      en: "A simple way to decide whether your computer is worth repairing: what the parts cost, what the machine is worth, and when to stop.",
    },
    summary: {
      da: "Regnestykket der afgør, om en langsom eller defekt maskine skal repareres eller skiftes ud.",
      en: "The calculation that decides whether a slow or broken machine gets repaired or replaced.",
    },
    audience: { da: "Private og mindre virksomheder", en: "Individuals and small businesses" },
    readingMinutes: 4,
    updated: "2026-08-23",
    intro: {
      da: "De fleste maskiner bliver skiftet ud, længe før de er slidt op. Spørgsmålet er ikke, om en computer kan repareres – det kan næsten alle – men om det kan betale sig. Her er den måde, vi selv regner på, når nogen spørger.",
      en: "Most machines get replaced long before they are worn out. The question is not whether a computer can be repaired — almost all of them can — but whether it is worth it. Here is how we work it out when someone asks.",
    },
    sections: [
      {
        heading: { da: "Start med maskinens værdi", en: "Start with what the machine is worth" },
        body: [
          {
            da: "Slå op, hvad den samme model koster brugt i dag. Det tal er loftet. Som tommelfingerregel: koster reparationen mere end halvdelen af, hvad maskinen er værd, skal du tænke dig om. Koster den mere end maskinen er værd, er svaret nej.",
            en: "Look up what the same model costs used today. That figure is your ceiling. As a rule of thumb: if the repair costs more than half of what the machine is worth, think twice. If it costs more than the machine is worth, the answer is no.",
          },
        ],
      },
      {
        heading: { da: "De billige fejl", en: "The cheap faults" },
        body: [
          {
            da: "Fire ting står bag langt de fleste henvendelser, og alle fire er billige at rette i forhold til en ny maskine:",
            en: "Four things are behind the large majority of enquiries, and all four are cheap to fix compared with a new machine:",
          },
        ],
        list: [
          {
            da: "Batteriet holder ikke en arbejdsdag. Et batteri er en sliddel – den skal skiftes efter nogle år, præcis som dæk på en bil.",
            en: "The battery no longer lasts a working day. A battery is a wear part — it gets replaced after a few years, like tyres on a car.",
          },
          {
            da: "For lidt hukommelse. En maskine med 4 GB føles død i dag; med 8 eller 16 GB føles den som en anden computer.",
            en: "Too little memory. A machine with 4 GB feels dead today; at 8 or 16 GB it feels like a different computer.",
          },
          {
            da: "En gammel harddisk i stedet for SSD. Det er den enkeltdel, der gør mest forskel på hverdagsfornemmelsen.",
            en: "An old hard disk instead of an SSD. That single part makes the biggest difference to how the machine feels day to day.",
          },
          {
            da: "Støv og gammel kølepasta. Maskinen bliver varm, blæseren larmer, og ydelsen skrues ned automatisk.",
            en: "Dust and old thermal paste. The machine runs hot, the fan gets loud, and performance is throttled automatically.",
          },
        ],
      },
      {
        heading: { da: "De dyre fejl", en: "The expensive faults" },
        body: [
          {
            da: "Bundkort, hængsler der har revet kabinettet i stykker, og væskeskader ligger i den anden ende. På en ældre maskine overstiger de næsten altid værdien. Skærme ligger midt imellem: prisen svinger meget efter model, så få den oplyst, før du beslutter.",
            en: "Motherboards, hinges that have torn the chassis apart, and liquid damage sit at the other end. On an older machine they almost always exceed its value. Screens sit in between: the price varies a lot by model, so get it quoted before you decide.",
          },
        ],
      },
      {
        heading: { da: "Regn også tiden med", en: "Count the time too" },
        body: [
          {
            da: "En ny maskine skal sættes op, programmer skal installeres, og filer skal flyttes. For en virksomhed er det ofte en halv arbejdsdag per medarbejder. Den time koster også noget, og den udgift forsvinder, hvis den gamle maskine bare kører videre.",
            en: "A new machine has to be set up, software installed and files moved. For a company that is often half a working day per employee. That time costs money too, and the cost disappears if the old machine simply keeps running.",
          },
        ],
      },
    ],
    closing: {
      da: "Er du i tvivl, så skriv til os med model og hvad der sker. Vi siger ærligt, hvis det ikke kan betale sig – det er billigere for os at sige nej end at lave en reparation, du fortryder.",
      en: "If you are unsure, write to us with the model and what happens. We will say honestly if it is not worth it — it is cheaper for us to say no than to do a repair you regret.",
    },
  },
  {
    slug: "opgrader-ram-i-baerbar",
    title: {
      da: "Sådan opgraderer du hukommelsen i en bærbar",
      en: "How to upgrade the memory in a laptop",
    },
    metaTitle: {
      da: "Sådan opgraderer du RAM i en bærbar computer – trin for trin | Kestro",
      en: "How to upgrade RAM in a laptop — step by step | Kestro",
    },
    metaDescription: {
      da: "Find ud af, om din bærbare kan få mere RAM, hvilken type du skal købe, og hvordan du skifter den. Med de fælder, folk oftest falder i.",
      en: "Find out whether your laptop can take more RAM, which type to buy, and how to fit it — including the traps people fall into.",
    },
    summary: {
      da: "Den billigste opgradering der findes – hvis maskinen overhovedet kan tage imod den.",
      en: "The cheapest upgrade there is — if the machine can take it at all.",
    },
    audience: { da: "Private der selv vil prøve", en: "People who want to do it themselves" },
    readingMinutes: 5,
    updated: "2026-08-23",
    intro: {
      da: "Mere hukommelse er som regel den billigste vej til en mærkbart hurtigere maskine. Men det virker kun, hvis maskinen kan udvides, og hvis du køber den rigtige type. Her er rækkefølgen.",
      en: "More memory is usually the cheapest route to a noticeably faster machine. But it only works if the machine can be expanded, and if you buy the right type. Here is the order to do it in.",
    },
    sections: [
      {
        heading: { da: "Tjek først, om det kan lade sig gøre", en: "First check whether it is possible" },
        body: [
          {
            da: "Mange tynde maskiner har hukommelsen loddet fast på bundkortet. Så kan den ikke skiftes – uanset hvad. ThinkPad X1 Carbon er et typisk eksempel. Slå din præcise model op hos producenten, eller kig i servicemanualen, som Lenovo, HP og Dell udgiver frit.",
            en: "Many thin machines have the memory soldered to the motherboard. Then it cannot be changed — whatever you do. The ThinkPad X1 Carbon is a typical example. Look up your exact model with the manufacturer, or check the service manual that Lenovo, HP and Dell publish freely.",
          },
          {
            da: "Er der sokler, står der som regel også, hvor mange der er, og hvad maskinen maksimalt understøtter. Begge dele skal du bruge.",
            en: "If there are slots, the same source usually says how many, and the maximum the machine supports. You need both numbers.",
          },
        ],
      },
      {
        heading: { da: "Køb den rigtige type", en: "Buy the right type" },
        body: [
          {
            da: "Fire ting skal passe, og de står alle sammen på modulet:",
            en: "Four things have to match, and all of them are printed on the module:",
          },
        ],
        list: [
          {
            da: "Generation: DDR3, DDR4 eller DDR5. De passer ikke i hinandens sokler, og der er ingen adapter.",
            en: "Generation: DDR3, DDR4 or DDR5. They do not fit each other's slots, and there is no adapter.",
          },
          {
            da: "Formfaktor: bærbare bruger SO-DIMM, stationære bruger de lange DIMM-moduler.",
            en: "Form factor: laptops use SO-DIMM, desktops use the long DIMM modules.",
          },
          {
            da: "Hastighed i MHz. Et hurtigere modul kører ned til maskinens hastighed – det virker, men du betaler for noget, du ikke får.",
            en: "Speed in MHz. A faster module runs down at the machine's speed — it works, but you pay for something you do not get.",
          },
          {
            da: "To ens moduler frem for ét stort, hvis der er to sokler. Det giver dobbelt båndbredde og kan mærkes på grafikken i maskiner uden grafikkort.",
            en: "Two matching modules rather than one large one, if there are two slots. That doubles the bandwidth and is noticeable on graphics in machines without a graphics card.",
          },
        ],
      },
      {
        heading: { da: "Selve skiftet", en: "The swap itself" },
        body: [
          {
            da: "Sluk maskinen, tag strømmen ud, og tag det eksterne batteri af, hvis der er et. Skru bunden af, og rør ved noget metal på kabinettet, før du rører modulet – statisk elektricitet er den eneste reelle risiko.",
            en: "Shut the machine down, unplug it, and remove the external battery if there is one. Take the bottom cover off, and touch bare metal on the chassis before you touch the module — static is the only real risk.",
          },
          {
            da: "Klemmerne i hver side af soklen springer ud til siden, og modulet vipper op. Det nye sættes i skråt og trykkes ned, til klemmerne klikker. Det skal ikke tvinges: passer det ikke, er det den forkerte type.",
            en: "The clips on each side of the slot spring outwards and the module tilts up. The new one goes in at an angle and is pressed down until the clips click. It should not be forced: if it does not fit, it is the wrong type.",
          },
        ],
      },
      {
        heading: { da: "Bagefter", en: "Afterwards" },
        body: [
          {
            da: "Tænd maskinen og tjek, at den ser hele mængden. I Windows står det under Indstillinger, System, Om. Ser den kun halvdelen, sidder det ene modul ikke ordentligt – tag det ud og sæt det i igen.",
            en: "Power up and check that the machine sees all of it. In Windows that is under Settings, System, About. If it only sees half, one module is not seated properly — take it out and refit it.",
          },
        ],
      },
    ],
    closing: {
      da: "Vil du hellere have det gjort, klarer vi det – og vi tjekker samtidig, om der er andet, der trækker maskinen ned. Skriv til os med modellen.",
      en: "If you would rather have it done, we can do it — and we will check at the same time whether anything else is holding the machine back. Write to us with the model.",
    },
  },
  {
    slug: "tjek-brugt-baerbar-foer-koeb",
    title: {
      da: "Ti ting du skal tjekke på en brugt bærbar, før du køber",
      en: "Ten things to check on a used laptop before you buy",
    },
    metaTitle: {
      da: "Købe brugt bærbar? Ti ting du skal tjekke først | Kestro",
      en: "Buying a used laptop? Ten things to check first | Kestro",
    },
    metaDescription: {
      da: "Batteri, skærm, tastatur, porte og disk – en gennemgang du kan lave på ti minutter, før du betaler for en brugt computer.",
      en: "Battery, screen, keyboard, ports and disk — a check you can do in ten minutes before paying for a used computer.",
    },
    summary: {
      da: "En gennemgang på ti minutter, der afslører det, sælgeren ikke skrev i annoncen.",
      en: "A ten-minute check that reveals what the seller left out of the listing.",
    },
    audience: { da: "Alle der køber brugt", en: "Anyone buying second-hand" },
    readingMinutes: 5,
    updated: "2026-08-23",
    intro: {
      da: "Brugt udstyr er en god handel, når du ved, hvad du får. Listen her er den samme, vi selv går igennem, før noget bliver sendt videre – og du kan lave det meste af den, mens sælgeren står ved siden af.",
      en: "Used equipment is a good deal when you know what you are getting. This list is the same one we go through before anything is passed on — and you can do most of it while the seller is standing next to you.",
    },
    sections: [
      {
        heading: { da: "Det du kan se på ti minutter", en: "What you can see in ten minutes" },
        body: [
          {
            da: "Tag maskinen i hånden og gå listen igennem i rækkefølge. Hvert punkt tager under et minut.",
            en: "Pick the machine up and work through the list in order. Each point takes under a minute.",
          },
        ],
        list: [
          {
            da: "Batteriets tilstand. I Windows: åbn Kommandoprompt og skriv powercfg /batteryreport. Rapporten viser den oprindelige kapacitet over for den nuværende. Under 70 procent betyder, at et nyt batteri er på vej.",
            en: "Battery health. In Windows: open Command Prompt and type powercfg /batteryreport. The report shows the original capacity against the current one. Below 70 percent means a new battery is coming.",
          },
          {
            da: "Skærmen på hvid og på sort baggrund. Døde pixels ses på hvid, lysutæthed og indbrænding ses på sort.",
            en: "The screen on a white and then a black background. Dead pixels show on white; backlight bleed and burn-in show on black.",
          },
          {
            da: "Hver eneste tast. Åbn et tomt dokument og tryk dem alle igennem. En enkelt død tast er billig at leve med, men den skal med i prisen.",
            en: "Every single key. Open a blank document and press through all of them. One dead key is cheap to live with, but it belongs in the price.",
          },
          {
            da: "Alle porte med noget i. Tag en USB-nøgle og et HDMI-kabel med. Porte, der aldrig blev testet, er den hyppigste ubehagelige overraskelse.",
            en: "Every port, with something in it. Bring a USB stick and an HDMI cable. Ports that were never tested are the most common unpleasant surprise.",
          },
          {
            da: "Diskens tilstand. Programmet CrystalDiskInfo læser SMART-data og siger, hvor meget disken har kørt, og om den melder fejl.",
            en: "Disk health. CrystalDiskInfo reads the SMART data and tells you how long the disk has run and whether it is reporting errors.",
          },
          {
            da: "Blæseren under belastning. Åbn en håndfuld faner, og lyt. Skrabende lyd er et leje på vej ud.",
            en: "The fan under load. Open a handful of tabs and listen. A scraping sound is a bearing on its way out.",
          },
          {
            da: "Kamera, mikrofon og højttalere. Start et opkald med dig selv i et vilkårligt program.",
            en: "Camera, microphone and speakers. Start a call with yourself in any app.",
          },
          {
            da: "Hængslerne. Åbn og luk skærmen langsomt. Knirken eller slør ender med at revne kabinettet.",
            en: "The hinges. Open and close the screen slowly. Creaking or play ends up cracking the chassis.",
          },
          {
            da: "BIOS-adgangskode og enhedslåse. Genstart og gå ind i BIOS. En låst maskine fra en tidligere ejer kan ikke altid låses op – heller ikke af os.",
            en: "BIOS password and device locks. Restart and enter the BIOS. A machine locked by a previous owner cannot always be unlocked — not by us either.",
          },
          {
            da: "Windows-licensen. Under Indstillinger, System, Aktivering skal der stå, at Windows er aktiveret.",
            en: "The Windows licence. Under Settings, System, Activation it should say that Windows is activated.",
          },
        ],
      },
      {
        heading: { da: "Spørg om to ting", en: "Ask two questions" },
        body: [
          {
            da: "Følger strømforsyningen med? Og hvorfor sælges maskinen? Det første er en reel udgift, hvis svaret er nej. Det andet får du sjældent et falsk svar på, hvis du spørger ligeud.",
            en: "Is the power supply included? And why is the machine being sold? The first is a real cost if the answer is no. The second rarely gets you a false answer if you ask straight out.",
          },
        ],
      },
      {
        heading: { da: "Hvad et bogstav ikke fortæller", en: "What a letter does not tell you" },
        body: [
          {
            da: "Sælgere skriver ofte grad A eller B. Der findes ingen fælles standard for, hvad bogstaverne betyder – to sælgere kan kalde den samme maskine hver sit. Bed om standen beskrevet i ord.",
            en: "Sellers often write grade A or B. There is no shared standard for what the letters mean — two sellers can call the same machine different things. Ask for the condition described in words.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal maskinen bruges i en virksomhed, laver vi den gennemgang for jer og skriver resultatet ned, før I betaler. Det er hele forskellen på at købe brugt og at gætte.",
      en: "If the machine is for a company, we do that check for you and write down the result before you pay. That is the whole difference between buying used and guessing.",
    },
  },
  {
    slug: "samle-din-egen-pc",
    title: { da: "Sådan samler du din egen pc", en: "How to build your own PC" },
    metaTitle: {
      da: "Samle sin egen pc: rækkefølge, dele og de klassiske fejl | Kestro",
      en: "Building your own PC: order, parts and the classic mistakes | Kestro",
    },
    metaDescription: {
      da: "Hvilke dele skal passe sammen, i hvilken rækkefølge samler du, og hvad går galt første gang. En gennemgang uden mystik.",
      en: "Which parts have to match, what order to assemble in, and what goes wrong the first time. A walkthrough without the mystique.",
    },
    summary: {
      da: "Rækkefølgen, de dele der skal passe sammen, og fejlene alle laver første gang.",
      en: "The order, the parts that must match, and the mistakes everyone makes first time.",
    },
    audience: { da: "Private og gaming", en: "Individuals and gaming" },
    readingMinutes: 6,
    updated: "2026-08-23",
    intro: {
      da: "At samle en pc er lettere, end det ser ud. Delene kan kun sidde ét sted, og de kan stort set ikke sættes forkert i. Det svære er at vælge dele, der passer sammen – resten er skruearbejde.",
      en: "Building a PC is easier than it looks. Parts only fit in one place, and they can barely be inserted the wrong way. The hard part is choosing components that fit together — the rest is screwing things in.",
    },
    sections: [
      {
        heading: { da: "De fem ting der skal passe sammen", en: "The five things that must match" },
        body: [
          {
            da: "Vælg i denne rækkefølge, så låser hvert valg det næste:",
            en: "Choose in this order, and each choice narrows the next:",
          },
        ],
        list: [
          {
            da: "Processoren bestemmer soklen. Bundkortet skal have præcis den sokkel – der findes ingen mellemløsning.",
            en: "The processor decides the socket. The motherboard must have exactly that socket — there is no in-between.",
          },
          {
            da: "Bundkortet bestemmer hukommelsens generation, DDR4 eller DDR5, og hvor mange moduler der er plads til.",
            en: "The motherboard decides the memory generation, DDR4 or DDR5, and how many modules there is room for.",
          },
          {
            da: "Kabinettet bestemmer, hvor langt et grafikkort og hvor høj en køler der kan være. Mål efter, i stedet for at håbe.",
            en: "The case decides how long a graphics card and how tall a cooler will fit. Measure, rather than hope.",
          },
          {
            da: "Strømforsyningen skal kunne klare grafikkortet med luft over. Producenten oplyser et anbefalet wattal – følg det.",
            en: "The power supply has to handle the graphics card with headroom. The manufacturer states a recommended wattage — follow it.",
          },
          {
            da: "Bundkortet bestemmer også antallet af M.2-pladser til SSD. To er rart, én er nok til de fleste.",
            en: "The motherboard also decides the number of M.2 slots for SSDs. Two is nice, one is enough for most people.",
          },
        ],
      },
      {
        heading: { da: "Rækkefølgen ved samling", en: "The order of assembly" },
        body: [
          {
            da: "Sæt processor, hukommelse og M.2-disk i bundkortet, mens det ligger på bordet. Der er langt bedre plads dér end nede i kabinettet, og det er den fejl, folk oftest fortryder.",
            en: "Fit the processor, memory and M.2 drive to the motherboard while it is lying on the table. There is far more room there than down in the case, and this is the mistake people most often regret.",
          },
          {
            da: "Så kommer bundkortet i kabinettet, derefter strømforsyningen, og til sidst grafikkortet. Kabler føres bagest, mens der stadig er plads til hænderne.",
            en: "Then the motherboard goes into the case, then the power supply, and the graphics card last. Route the cables behind the tray while there is still room for your hands.",
          },
        ],
      },
      {
        heading: { da: "De klassiske fejl", en: "The classic mistakes" },
        body: [
          {
            da: "Fire ting står bag næsten alle maskiner, der ikke vil starte første gang:",
            en: "Four things are behind almost every machine that will not start the first time:",
          },
        ],
        list: [
          {
            da: "Det ekstra 8-benede strømstik til processoren øverst på bundkortet er ikke sat i. Maskinen er helt død.",
            en: "The extra 8-pin CPU power connector at the top of the board is not plugged in. The machine is completely dead.",
          },
          {
            da: "Hukommelsen sidder i de forkerte sokler. Manualen siger hvilke to der skal bruges, når du kun har to moduler.",
            en: "Memory is in the wrong slots. The manual says which two to use when you only have two modules.",
          },
          {
            da: "Skærmen er sat i bundkortets udgang i stedet for grafikkortets. Billedet er sort, selvom alt virker.",
            en: "The monitor is plugged into the motherboard output instead of the graphics card. The screen is black even though everything works.",
          },
          {
            da: "Afstandsboltene mellem kabinet og bundkort mangler eller sidder forkert. Det kortslutter bundkortet mod pladen.",
            en: "The standoffs between case and motherboard are missing or misplaced. That shorts the board against the tray.",
          },
        ],
      },
      {
        heading: { da: "Første start", en: "First boot" },
        body: [
          {
            da: "Gå i BIOS først. Tjek at processoren, hele hukommelsen og disken er der, og slå XMP eller EXPO til, så hukommelsen kører den hastighed, du betalte for. Derefter installerer du Windows fra en USB-nøgle.",
            en: "Go into the BIOS first. Check that the processor, all the memory and the drive are there, and switch on XMP or EXPO so the memory runs at the speed you paid for. Then install Windows from a USB stick.",
          },
        ],
      },
    ],
    closing: {
      da: "Vil du hellere have den samlet, gør vi det – enten helt fra bunden eller ved at opgradere den maskine, du allerede har. Skriv til os med, hvad den skal bruges til.",
      en: "If you would rather have it built, we can do that — either from scratch or by upgrading the machine you already have. Write to us with what it is for.",
    },
  },
  {
    slug: "windows-11-paa-aeldre-maskine",
    title: {
      da: "Windows 11 på en ældre maskine: hvad kræver det?",
      en: "Windows 11 on an older machine: what does it take?",
    },
    metaTitle: {
      da: "Windows 11 på en ældre computer – krav og muligheder | Kestro",
      en: "Windows 11 on an older computer — requirements and options | Kestro",
    },
    metaDescription: {
      da: "TPM, Secure Boot og processorkrav forklaret, og hvad du gør, hvis maskinen ikke er på listen.",
      en: "TPM, Secure Boot and processor requirements explained, and what to do if your machine is not on the list.",
    },
    summary: {
      da: "Hvorfor en fungerende maskine pludselig ikke må opdatere – og hvad mulighederne så er.",
      en: "Why a working machine is suddenly not allowed to update — and what the options are.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 4,
    updated: "2026-08-23",
    intro: {
      da: "Mange maskiner, der kører helt fint, får at vide, at de ikke kan opdatere til Windows 11. Det handler sjældent om ydelse og næsten altid om tre krav, der kan tjekkes på et par minutter.",
      en: "Plenty of machines that run perfectly well are told they cannot update to Windows 11. That is rarely about performance and almost always about three requirements you can check in a couple of minutes.",
    },
    sections: [
      {
        heading: { da: "De tre krav", en: "The three requirements" },
        body: [
          {
            da: "TPM 2.0 er en sikkerhedschip. De fleste erhvervsmaskiner fra 2016 og frem har den, men den er nogle gange slået fra i BIOS fra fabrikken. Secure Boot skal være slået til, og maskinen skal starte i UEFI-tilstand, ikke i den gamle Legacy-tilstand.",
            en: "TPM 2.0 is a security chip. Most business machines from 2016 onwards have it, but it is sometimes switched off in the BIOS from the factory. Secure Boot must be enabled, and the machine has to boot in UEFI mode rather than the old Legacy mode.",
          },
          {
            da: "Processoren skal desuden stå på Microsofts liste. Det er den grænse, der rammer hårdest, og den kan ikke omgås ved at ændre en indstilling.",
            en: "The processor also has to be on Microsoft's list. That is the limit that bites hardest, and it cannot be worked around by changing a setting.",
          },
        ],
      },
      {
        heading: { da: "Tjek det selv", en: "Check it yourself" },
        body: [
          {
            da: "Tryk Windows-tasten og R, skriv tpm.msc og tryk enter. Vinduet fortæller, om der er en TPM, og hvilken version. Skriv msinfo32 samme sted: der står både BIOS-tilstand, som skal være UEFI, og Secure Boot-tilstand.",
            en: "Press the Windows key and R, type tpm.msc and hit enter. The window tells you whether there is a TPM and which version. Type msinfo32 in the same place: it shows both BIOS mode, which should be UEFI, and Secure Boot state.",
          },
          {
            da: "Står TPM som slået fra, er det ofte bare en indstilling i BIOS – den hedder typisk PTT på Intel og fTPM på AMD.",
            en: "If the TPM shows as disabled, that is often just a BIOS setting — usually called PTT on Intel and fTPM on AMD.",
          },
        ],
      },
      {
        heading: {
          da: "Hvis maskinen ikke kan komme med",
          en: "If the machine cannot come along",
        },
        body: [
          {
            da: "Der findes vejledninger til at omgå kravene. Vi anbefaler det ikke på en maskine, der skal bruges i en virksomhed: Microsoft giver ingen garanti for opdateringer bagefter, og en maskine uden sikkerhedsopdateringer er et problem, ikke en besparelse.",
            en: "There are guides to bypassing the requirements. We do not recommend it on a machine used in a company: Microsoft gives no guarantee of updates afterwards, and a machine without security updates is a problem, not a saving.",
          },
          {
            da: "Det fornuftige alternativ er en brugt erhvervsmaskine, der opfylder kravene. De findes i mængder, netop fordi virksomheder skiftede flåde af samme grund.",
            en: "The sensible alternative is a used business machine that meets the requirements. There are plenty about, precisely because companies changed fleets for the same reason.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal en hel flåde vurderes, kan vi gennemgå listen med jer og sige, hvilke maskiner der kan følge med, og hvilke der bedre kan betale sig at skifte.",
      en: "If a whole fleet needs assessing, we can go through the list with you and say which machines can come along and which are better replaced.",
    },
  },
  {
    slug: "slet-data-foer-du-saelger",
    title: {
      da: "Sådan sletter du data, før du sælger eller kasserer en computer",
      en: "How to erase data before selling or scrapping a computer",
    },
    metaTitle: {
      da: "Slet data før salg af computer – sådan gør du det rigtigt | Kestro",
      en: "Erase data before selling a computer — how to do it properly | Kestro",
    },
    metaDescription: {
      da: "Formatering er ikke sletning. Sådan fjerner du data rigtigt fra SSD og harddisk, og hvad en virksomhed skal kunne dokumentere.",
      en: "Formatting is not erasing. How to properly remove data from an SSD or hard disk, and what a company must be able to document.",
    },
    summary: {
      da: "Formatering er ikke sletning. Forskellen kan koste dyrt, hvis det er en firmamaskine.",
      en: "Formatting is not erasing. The difference gets expensive if it is a company machine.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 4,
    updated: "2026-08-23",
    intro: {
      da: "Når en maskine skifter hænder, følger data med, hvis man ikke gør noget aktivt. En hurtig formatering fjerner kun indholdsfortegnelsen – filerne ligger der stadig og kan hentes frem med gratis værktøjer.",
      en: "When a machine changes hands, the data goes with it unless you actively do something. A quick format only removes the index — the files are still there and can be recovered with free tools.",
    },
    sections: [
      {
        heading: { da: "For en privat maskine", en: "For a personal machine" },
        body: [
          {
            da: "Log ud af alt først: Microsoft-konto, Google, iCloud og eventuel diskkryptering. Slå derefter Windows' egen nulstilling til med indstillingen, der fjerner alt og renser drevet. Den overskriver, i stedet for bare at slette henvisningerne.",
            en: "Sign out of everything first: Microsoft account, Google, iCloud and any disk encryption. Then run Windows' own reset with the option that removes everything and cleans the drive. That overwrites, rather than simply deleting the references.",
          },
          {
            da: "Har maskinen allerede kørt med BitLocker eller FileVault slået til, er sagen enklere: slettes nøglen, er data i praksis uigenkaldelige.",
            en: "If the machine has been running with BitLocker or FileVault enabled, it is simpler: delete the key and the data is effectively unrecoverable.",
          },
        ],
      },
      {
        heading: { da: "SSD og harddisk er ikke ens", en: "SSDs and hard disks are not the same" },
        body: [
          {
            da: "På en gammeldags harddisk med plader virker overskrivning. På en SSD flytter controlleren data rundt, så en overskrivning ikke nødvendigvis rammer alle celler. Til SSD bruger man producentens Secure Erase, som findes i deres eget værktøj, eller man destruerer drevet fysisk.",
            en: "On an old-fashioned platter hard disk, overwriting works. On an SSD the controller moves data around, so an overwrite does not necessarily reach every cell. For SSDs you use the manufacturer's Secure Erase, found in their own tool, or you destroy the drive physically.",
          },
        ],
      },
      {
        heading: { da: "For en virksomhed er det ikke nok", en: "For a company that is not enough" },
        body: [
          {
            da: "Har maskinen indeholdt personoplysninger, skal I kunne dokumentere, at de er væk – ikke bare vide det. Forlang en sletterapport med serienummer for hver enkelt enhed fra den, der håndterer udstyret. Det er det dokument, I skal kunne lægge frem, hvis nogen spørger.",
            en: "If the machine has held personal data, you have to be able to document that it is gone — not merely know it. Require an erasure report with a serial number for each individual device from whoever handles the equipment. That is the document you need to be able to produce if anyone asks.",
          },
          {
            da: "Husk også BIOS-adgangskoder og enhedslåse. En maskine, der stadig er bundet til jeres administration, kan ikke bruges af den næste ejer.",
            en: "Remember BIOS passwords and device locks too. A machine still tied to your management system is unusable for the next owner.",
          },
        ],
      },
    ],
    closing: {
      da: "Køber vi jeres udstyr, sletter vi data som en del af aftalen og leverer dokumentationen med. I kan også bare bede om rådgivningen – den koster ingenting.",
      en: "If we buy your equipment, erasing the data is part of the deal and the documentation comes with it. You are also welcome to just ask for the advice — that costs nothing.",
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

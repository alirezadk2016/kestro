import type { Localized } from "@/lib/i18n";
import type { SourceId } from "@/lib/sources";

/** Shared by the published pages and the source-managed admin catalogue. */
export const practicalGuideDates = { published: "2026-10-17", modified: "2026-10-19" } as const;

/** Practical tasks stay in the guide tree; calculators support the task. */
export type PracticalGuideSlug =
  | "tjek-batterikapacitet"
  | "tjek-ram-forbrug"
  | "hdd-eller-ssd"
  | "langsom-computer"
  | "baerbar-larmer-eller-bliver-varm"
  | "overfoer-filer-til-ny-pc"
  | "computer-gaar-ned"
  | "dansk-tastatur-paa-importeret-computer";

export type PracticalGuideStep = {
  title: Localized;
  body: Localized;
  /** A command the reader runs locally, never executed by the website. */
  command?: string;
};

export type PracticalGuide = {
  slug: PracticalGuideSlug;
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  /** One sentence for the hub, distinct from the page's answer-first intro. */
  summary: Localized;
  intro: Localized;
  /*
   * The four guides of 26 November 2026 have no picture. The first four use
   * AI-generated illustrations of a component; a fan, a file transfer, a crash
   * and a keyboard layout have no component to show that is not already on
   * another guide, and the owner wants no more invented pictures. Their hero
   * lists the steps instead.
   */
  /** Published and modified, where they differ from the first four guides'. */
  dates?: { published: string; modified: string };
  steps: PracticalGuideStep[];
  result: { title: Localized; body: Localized }[];
  limits: Localized;
  sourceIds: SourceId[];
  related: { href: string; label: Localized }[];
  tool?: "battery" | "ram";
};

export const practicalGuides: PracticalGuide[] = [
  {
    slug: "tjek-batterikapacitet",
    title: {
      da: "Tjek batterikapacitet i Windows",
      en: "Check battery capacity in Windows",
    },
    metaTitle: {
      da: "Tjek batterikapacitet: Windows-rapport og tal | Kestro",
      en: "Check battery capacity: Windows report and data | Kestro",
    },
    metaDescription: {
      da: "Lav en batterirapport i Windows, find designkapacitet og fuld opladningskapacitet, og beregn kapacitet i procent. Følg guiden, og forstå dine tal.",
      en: "Check Windows battery capacity with a report and two figures, work out the percentage in our calculator, and see what it means for the battery life.",
    },
    summary: {
      da: "Find rapporten, og beregn kapaciteten med to tal fra Windows.",
      en: "Find the report and calculate capacity with two Windows figures.",
    },
    intro: {
      da: "Skriv powercfg /batteryreport i Kommandoprompt, og find Design Capacity og Full Charge Capacity i rapporten. Del den anden med den første, og gang med 100: 40.000 mWh ud af 50.000 mWh er 80 % af batteriets kapacitet fra nyt.",
      en: "Run powercfg /batteryreport in Command Prompt and find Design Capacity and Full Charge Capacity in the report. Divide the second by the first and multiply by 100: 40,000 mWh out of 50,000 mWh is 80% of the battery's capacity when new.",
    },
    steps: [
      {
        title: { da: "Åbn Kommandoprompt", en: "Open Command Prompt" },
        body: {
          da: "Søg efter Kommandoprompt i Start, højreklik, og vælg Kør som administrator. På en arbejdscomputer kan det kræve hjælp fra jeres IT-ansvarlige.",
          en: "Search for Command Prompt in Start, right-click it and choose Run as administrator. On a work computer, you may need your IT administrator's help.",
        },
      },
      {
        title: { da: "Opret rapporten", en: "Create the report" },
        body: {
          da: "Skriv kommandoen nedenfor, og tryk Enter. Windows viser stien til den HTML-fil, der er blevet gemt på computeren.",
          en: "Enter the command below and press Enter. Windows displays the path to the HTML file saved on your computer.",
        },
        command: "powercfg /batteryreport",
      },
      {
        title: { da: "Find de to kapaciteter", en: "Find the two capacity figures" },
        body: {
          da: "Åbn filen via Stifinder, og find Design Capacity og Full Charge Capacity under Installed batteries. Brug værdier fra samme batteri og i samme enhed.",
          en: "Open the file through File Explorer and find Design Capacity and Full Charge Capacity under Installed batteries. Use figures for the same battery in the same unit.",
        },
      },
      {
        title: {
          da: "Beregn, og sammenlign med hverdagen",
          en: "Calculate, then compare with daily use",
        },
        body: {
          da: "Skriv begge tal i beregneren nedenfor i hele mWh. Hold resultatet op mod, hvor længe computeren faktisk holder uden oplader.",
          en: "Enter both figures in whole mWh in the calculator below. Hold the result up against how long the computer actually lasts away from its charger.",
        },
      },
    ],
    tool: "battery",
    result: [
      {
        title: {
          da: "Kapacitet og opladning er forskellige tal",
          en: "Capacity and charge are different figures",
        },
        body: {
          da: "100 % opladet betyder fuldt i forhold til batteriets nuværende kapacitet. Det betyder ikke, at batteriet kan lagre lige så meget energi som fra nyt. Kapaciteten er heller ingen garanti for batteritid: hvor længe en opladning holder, afhænger også af skærmens lysstyrke, og hvad der kører.",
          en: "A 100% charge means full relative to the battery's current capacity. It does not mean the battery stores as much energy as when it was new. Nor is capacity a guarantee of battery life: how long a charge lasts also depends on screen brightness and what is running.",
        },
      },
      {
        title: {
          da: "Flere batterier, et tal mangler, eller over 100 %",
          en: "Two batteries, a missing figure, or over 100%",
        },
        body: {
          da: "Har computeren to batterier, så beregn dem hver for sig. Mangler et tal, eller giver det over 100 %, så tjek, at begge tal er fra samme batteri og i mWh, før du konkluderer noget.",
          en: "If the computer has two batteries, calculate each one separately. If a figure is missing or the result is over 100%, check that both figures come from the same battery and are in mWh before you conclude anything.",
        },
      },
    ],
    limits: {
      da: "Er batteriet synligt opsvulmet – buler bunden, eller løfter tastaturet sig – så stop med at bruge computeren, og få batteriet skiftet sikkert. Det gælder, uanset hvad rapporten viser.",
      en: "If the battery is visibly swollen — the base bulges or the keyboard lifts — stop using the computer and have the battery replaced safely, whatever the report says.",
    },
    sourceIds: [
      "windowsBatteryReport",
      "windowsBatteryCare",
      "surfaceBatteryCapacity",
      "swollenBatterySafety",
    ],
    related: [
      {
        href: "/vejledninger/tjek-ram-forbrug",
        label: { da: "Se, hvor meget RAM du bruger", en: "See how much RAM you use" },
      },
      {
        href: "/vejledninger/langsom-computer",
        label: {
          da: "Find årsagen til en langsom computer",
          en: "Find what is slowing your computer",
        },
      },
      {
        href: "/reparation/batteriskift",
        label: { da: "Få hjælp til batteriskift", en: "Get help replacing a battery" },
      },
    ],
  },
  {
    slug: "tjek-ram-forbrug",
    title: { da: "Tjek RAM-forbrug i Windows", en: "Check RAM usage in Windows" },
    metaTitle: {
      da: "Tjek RAM-forbrug i Windows: find behovet for RAM | Kestro",
      en: "Check RAM usage in Windows: find your RAM needs | Kestro",
    },
    metaDescription: {
      da: "Tjek RAM-forbrug i Jobliste. Se brugt og ledig RAM, og find de apps, der fylder. Læs guiden trin for trin, før du beslutter, om du vil købe ny RAM.",
      en: "Check RAM use in Task Manager: see used and free RAM, find the apps that fill it, and then work out the percentage before you decide to buy more.",
    },
    summary: {
      da: "Se dit hukommelsesforbrug, før du beslutter at købe mere RAM.",
      en: "See your memory usage before deciding to buy more RAM.",
    },
    intro: {
      da: "Tryk Ctrl + Shift + Esc, og vælg Ydeevne → Hukommelse i Jobliste for at se RAM-forbruget. Mål, mens du bruger dine almindelige programmer; et øjebliksbillede alene afgør ikke, om du mangler RAM.",
      en: "Press Ctrl + Shift + Esc and select Performance → Memory in Task Manager to see RAM usage. Check while using your normal applications; one snapshot alone does not establish a need for more RAM.",
    },
    steps: [
      {
        title: { da: "Åbn dine almindelige programmer", en: "Open your usual applications" },
        body: {
          da: "Brug computeren, som du plejer, med de programmer og faner, du har brug for. Undersøg den situation, hvor du oplever ventetid.",
          en: "Use the computer as usual with the applications and tabs you need. Investigate the situation in which you notice delays.",
        },
      },
      {
        title: { da: "Åbn Hukommelse i Jobliste", en: "Open Memory in Task Manager" },
        body: {
          da: "Tryk Ctrl + Shift + Esc, og vælg Ydeevne → Hukommelse. Hvis visningen er begrænset, skal du først vælge Flere oplysninger.",
          en: "Press Ctrl + Shift + Esc, then choose Performance → Memory. If the view is limited, select More details first.",
        },
      },
      {
        title: { da: "Notér brugt og tilgængelig RAM", en: "Note used and available RAM" },
        body: {
          da: "Aflæs I brug og Tilgængelig på samme tidspunkt. Lagt sammen giver de den RAM, Windows kan bruge – det er det tal, beregneren kalder samlet brugbar RAM.",
          en: "Read In use and Available at the same moment. Added together, they give the RAM Windows can use — the figure the calculator calls total usable RAM.",
        },
      },
      {
        title: { da: "Find de programmer, der fylder", en: "Find the applications using memory" },
        body: {
          da: "Se hukommelseskolonnen under Processer, og luk kun programmer, du kender og ikke skal bruge, efter at have gemt arbejdet. Undersøg derefter samme opgave igen.",
          en: "Check the Memory column under Processes, and close only familiar applications you do not need after saving your work. Then check the same task again.",
        },
      },
    ],
    tool: "ram",
    result: [
      {
        title: { da: "Se efter et gentaget behov", en: "Look for a recurring need" },
        body: {
          da: "Hvis hukommelsen gentagne gange er presset, mens de nødvendige programmer kører, er RAM værd at undersøge. Se også CPU og disk, så du ikke overser en anden flaskehals.",
          en: "If memory repeatedly comes under pressure while the applications you need are running, investigate RAM. Also check CPU and disk activity so you do not overlook another bottleneck.",
        },
      },
      {
        title: { da: "Kontrollér modellen før et køb", en: "Check the model before buying" },
        body: {
          da: "RAM kan være fastloddet, udskiftelig eller en blanding. Den præcise model, RAM-type, sokler og producentens kapacitetsgrænse bestemmer mulighederne.",
          en: "RAM may be soldered, replaceable or a mixture. The exact model, memory type, sockets and manufacturer's capacity limit determine your options.",
        },
      },
    ],
    limits: {
      da: "Tallene viser, hvor meget RAM der bruges, ikke RAM-hastigheden. Lukker programmer sig selv, eller får du blå skærm, kan der være en fejl – ikke bare for lidt RAM. Det kræver en egentlig fejlfinding, ikke en beregning.",
      en: "The figures show how much memory is in use, not how fast it is. If programs close by themselves or you get blue screens, there may be a fault — not just too little RAM. That calls for proper troubleshooting, not a calculation.",
    },
    sourceIds: ["windowsPerformanceCheck", "memoryGenerations", "thinkpadT480Specs"],
    related: [
      {
        href: "/vejledninger/opgrader-ram-i-baerbar",
        label: { da: "Læs, hvad et RAM-skift kræver", en: "Read what a RAM replacement involves" },
      },
      {
        href: "/vejledninger/hvor-meget-kan-en-baerbar-opgraderes",
        label: {
          da: "Undersøg modellens opgraderingsmuligheder",
          en: "Investigate the model's upgrade options",
        },
      },
      {
        href: "/vejledninger/langsom-computer",
        label: {
          da: "Undersøg CPU og disk sammen med RAM",
          en: "Check CPU and disk alongside RAM",
        },
      },
    ],
  },
  {
    slug: "hdd-eller-ssd",
    title: {
      da: "HDD eller SSD: hvad sidder i din computer?",
      en: "HDD or SSD: what is in your computer?",
    },
    metaTitle: {
      da: "HDD eller SSD: find dit drev og det rette format | Kestro",
      en: "SSD or HDD? How to tell which drive you have | Kestro",
    },
    metaDescription: {
      da: "HDD eller SSD? Find dit drev i Windows og lær om M.2, SATA og NVMe. Tjek format, stik og filer før et nyt drev. Læs vores vejledning trin for trin.",
      en: "SSD or HDD? Find the drive type in Windows, learn what M.2, SATA and NVMe mean, and check the format and your files before fitting a new one.",
    },
    summary: {
      da: "Find drevtypen, og se, hvad en ny SSD skal passe til.",
      en: "Identify the drive type and understand what a compatible SSD must match.",
    },
    intro: {
      da: "Se efter drevtype og model under Ydeevne → Disk i Jobliste. Før et skift skal både drevets fysiske format og forbindelsen passe; M.2 beskriver formen og betyder ikke automatisk NVMe.",
      en: "Look for the drive type and model under Performance → Disk in Task Manager. A replacement must match both the physical format and the connection; M.2 describes the shape and does not automatically mean NVMe.",
    },
    steps: [
      {
        title: { da: "Find drevet i Windows", en: "Find the drive in Windows" },
        body: {
          da: "Tryk Ctrl + Shift + Esc, og vælg Ydeevne → Disk. Notér drevets model, og om Windows angiver det som HDD eller SSD; kontrollér hvert relevant drev, hvis du har flere.",
          en: "Press Ctrl + Shift + Esc and select Performance → Disk. Note the drive's model, and whether Windows lists it as HDD or SSD; check each relevant drive if you have more than one.",
        },
      },
      {
        title: { da: "Afklar typen, hvis den mangler", en: "Confirm the type if it is missing" },
        body: {
          da: "Søg efter drevets præcise model på producentens supportside. En drevbogstavsbetegnelse som C: eller den ledige plads fortæller ikke, om lageret er en HDD eller SSD.",
          en: "Look up the drive's exact model on its manufacturer's support site. A drive letter such as C: or the amount of free space does not identify it as an HDD or SSD.",
        },
      },
      {
        title: { da: "Kontrollér format og interface", en: "Check the format and interface" },
        body: {
          da: "Læs computerens specifikationer og servicemanual for fx 2,5-tommer eller M.2, længde, SATA eller PCIe/NVMe samt eventuel adapter. Et M.2-stik kan ikke alene bekræfte kompatibiliteten.",
          en: "Check the computer's specifications and service manual for 2.5-inch or M.2 format, length, SATA or PCIe/NVMe and any adapter. An M.2 socket alone does not establish compatibility.",
        },
      },
      {
        title: { da: "Lav en plan for dine filer", en: "Plan what happens to your files" },
        body: {
          da: "Kontrollér din sikkerhedskopi før et skift, og vælg mellem dataflytning og en ny installation. Gem eventuelle gendannelsesnøgler privat og sikkert.",
          en: "Check your backup before replacing a drive and choose between data migration and a fresh installation. Keep any recovery keys private and secure.",
        },
      },
    ],
    result: [
      {
        title: {
          da: "M.2, SATA og NVMe betyder forskellige ting",
          en: "M.2, SATA and NVMe describe different things",
        },
        body: {
          da: "M.2 er et fysisk format. Et M.2-drev kan bruge SATA eller PCIe med NVMe, og computerens understøttelse skal passe til det valgte drev.",
          en: "M.2 is a physical format. An M.2 drive can use SATA or PCIe with NVMe, and the computer must support the drive you choose.",
        },
      },
      {
        title: { da: "Mere plads løser ikke alt", en: "More space does not solve everything" },
        body: {
          da: "Et lagerproblem kan handle om plads, ventetid, software eller fejl. Brug dine observationer og den præcise model, før du beslutter at købe et større eller andet drev.",
          en: "A storage problem may involve space, waiting times, software or faults. Use your observations and the exact model before deciding to buy a larger or different drive.",
        },
      },
    ],
    limits: {
      da: "Guiden finder drevtypen; den tester ikke, om drevet er sundt. Forsvinder filer, eller kommer der læsefejl, så tag en kopi af dine data først – før du tester eller skifter noget.",
      en: "This guide identifies the drive; it does not test whether the drive is healthy. If files go missing or read errors appear, copy your data first — before you test or replace anything.",
    },
    sourceIds: [
      "windowsPerformanceCheck",
      "ssdFormFactors",
      "thinkpadT480Specs",
      "bitlockerRecovery",
    ],
    related: [
      {
        href: "/vejledninger/hvor-meget-kan-en-baerbar-opgraderes",
        label: {
          da: "Se, hvad din bærbare kan opgraderes med",
          en: "See what can be upgraded in your laptop",
        },
      },
      {
        href: "/vejledninger/langsom-computer",
        label: {
          da: "Find andre årsager til langsomhed",
          en: "Find other causes of slow performance",
        },
      },
      {
        href: "/reparation/ram-og-ssd-opgradering",
        label: { da: "Få hjælp til en SSD-opgradering", en: "Get help with an SSD upgrade" },
      },
    ],
  },
  {
    slug: "langsom-computer",
    title: {
      da: "Langsom computer? Find det, der bremser",
      en: "Slow computer? Find what is holding it back",
    },
    metaTitle: {
      da: "Langsom computer? Tjek CPU, RAM og disk i Windows | Kestro",
      en: "Slow computer? Check CPU, RAM and disk in Windows | Kestro",
    },
    metaDescription: {
      da: "Langsom computer? Tjek CPU, RAM og disk i Jobliste, og find det program, der bremser. Følg guiden trin for trin, før du bruger penge på nye dele.",
      en: "Slow computer? Check CPU, RAM and disk usage. Find the busy app, then follow the steps to decide what to do before you choose new parts.",
    },
    summary: {
      da: "Find flaskehalsen i dine normale opgaver, før du vælger en løsning.",
      en: "Find the bottleneck in your normal tasks before choosing a solution.",
    },
    intro: {
      da: "Åbn Jobliste med Ctrl + Shift + Esc, mens computeren føles langsom, og se CPU, hukommelse og disk. Notér, hvilken opgave og proces der falder sammen med ventetiden; mere RAM eller en ny SSD er ikke automatisk løsningen.",
      en: "Open Task Manager with Ctrl + Shift + Esc while the computer feels slow and check CPU, memory and disk. Note which task and process coincide with the delay; more RAM or a new SSD is not automatically the answer.",
    },
    steps: [
      {
        title: { da: "Genskab den langsomme opgave", en: "Repeat the task that feels slow" },
        body: {
          da: "Åbn de programmer, du normalt bruger, og notér, om ventetiden sker ved opstart, under arbejdet eller kun i én app. Gem arbejdet, før du ændrer noget.",
          en: "Open the applications you normally use and note whether the delay occurs at startup, during work or only in one app. Save your work before changing anything.",
        },
      },
      {
        title: { da: "Se CPU, hukommelse og disk", en: "Check CPU, memory and disk" },
        body: {
          da: "Tryk Ctrl + Shift + Esc, og åbn Ydeevne i Jobliste. Se, hvilken ressource der er presset samtidig med ventetiden, og gentag observationen.",
          en: "Press Ctrl + Shift + Esc and open Performance in Task Manager. Observe which resource is under pressure during the delay, then repeat the observation.",
        },
      },
      {
        title: { da: "Find processen bag forbruget", en: "Find the process behind the usage" },
        body: {
          da: "Gå til Processer, og se kolonnen for den relevante ressource. Luk kun kendte, unødvendige programmer efter at have gemt; afslut ikke ukendte systemprocesser.",
          en: "Go to Processes and check the column for the relevant resource. Close only familiar, unnecessary applications after saving; do not end unknown system processes.",
        },
      },
      {
        title: { da: "Prøv én ændring og sammenlign", en: "Try one change and compare" },
        body: {
          da: "Luk fx unødvendige faner, eller gennemgå velkendte startapps, og gentag samme opgave. Hvis du genstarter, skal dokumenter være gemt, og de samme nødvendige programmer åbnes igen.",
          en: "For example, close unnecessary tabs or review familiar startup apps, then repeat the same task. If you restart, save documents first and reopen the same necessary applications.",
        },
      },
    ],
    result: [
      {
        title: {
          da: "Hukommelsen er gentagne gange presset",
          en: "Memory repeatedly comes under pressure",
        },
        body: {
          da: "Undersøg RAM-forbruget og modellens muligheder for mere hukommelse. Der skal være et observeret behov og en kompatibel opgradering, før et køb giver mening.",
          en: "Investigate RAM usage and the model's memory options. There should be an observed need and a compatible upgrade before a purchase makes sense.",
        },
      },
      {
        title: { da: "CPU eller disk er presset", en: "CPU or disk is under pressure" },
        body: {
          da: "Find først processen og opgaven. Ved diskforbrug undersøges også ledig plads og drevtype; mere RAM løser ikke automatisk en CPU-begrænsning.",
          en: "Identify the process and task first. For disk activity, also check free space and drive type; more RAM does not automatically resolve a CPU limitation.",
        },
      },
    ],
    limits: {
      da: "Slukker computeren uden varsel, eller kommer der fejlmeddelelser, er det ikke et spørgsmål om ydelse. Så er der brug for en egentlig fejlfinding.",
      en: "If the computer shuts down without warning or shows error messages, it is not a performance question. That needs proper troubleshooting.",
    },
    sourceIds: ["windowsPerformanceCheck"],
    related: [
      {
        href: "/vejledninger/tjek-ram-forbrug",
        label: { da: "Tjek RAM-forbruget trin for trin", en: "Check RAM usage step by step" },
      },
      {
        href: "/vejledninger/hdd-eller-ssd",
        label: {
          da: "Find din drevtype: HDD eller SSD",
          en: "Identify your drive type: HDD or SSD",
        },
      },
      {
        href: "/vejledninger/reparere-eller-koebe-ny",
        label: {
          da: "Regn på reparation eller udskiftning",
          en: "Weigh repair against replacement",
        },
      },
    ],
  },
  {
    slug: "baerbar-larmer-eller-bliver-varm",
    dates: { published: "2026-11-26", modified: "2026-11-27" },
    title: {
      da: "Bærbar larmer eller bliver varm: find årsagen",
      en: "Laptop loud or hot: find the cause",
    },
    metaTitle: {
      da: "Bærbar larmer eller bliver varm? Find årsagen | Kestro",
      en: "Laptop loud or running hot? Find the cause | Kestro",
    },
    metaDescription: {
      da: "Bærbar larmer eller bliver varm? Se, hvad der arbejder i Jobliste, giv luften fri vej, og vælg en køligere strømtilstand. Hjælper det ikke, tjek køleren.",
      en: "Laptop loud or hot? See what is working in Task Manager, give the air a free path and pick a cooler power mode. If that fails, look at the cooler.",
    },
    summary: {
      da: "Find ud af, om blæseren arbejder, fordi den skal, eller fordi køleren er stoppet til.",
      en: "Tell whether the fan works because it must, or because the cooler is clogged.",
    },
    intro: {
      da: "En bærbar larmer, når blæseren skal fjerne varme, og varmen kommer fra det, processoren laver. Se først i Jobliste (Ctrl + Shift + Esc), hvad der bruger CPU, og stil maskinen på et hårdt, plant underlag. Larmer den, selv når Jobliste viser, at intet bruger CPU, er køleren det næste sted at se: støv i ribberne eller udtørret kølepasta.",
      en: "A laptop gets loud when the fan has to remove heat, and the heat comes from what the processor is doing. First check in Task Manager (Ctrl + Shift + Esc) what is using the CPU, and put the machine on a hard, flat surface. If it stays loud while Task Manager shows nothing using the CPU, the cooler is the next place to look: dust in the fins or dried-out thermal paste.",
    },
    steps: [
      {
        title: { da: "Se, hvad der arbejder", en: "See what is working" },
        body: {
          da: "Åbn Jobliste med Ctrl + Shift + Esc, og sortér Processer efter CPU. Et program, der bruger meget, får blæseren til at gå, også når du ikke selv laver noget.",
          en: "Open Task Manager with Ctrl + Shift + Esc and sort Processes by CPU. A program using a lot keeps the fan running, even when you are not doing anything yourself.",
        },
      },
      {
        title: { da: "Giv luften fri vej", en: "Give the air a free path" },
        body: {
          da: "Brug maskinen på et bord, ikke på en dyne, en pude eller skødet, og hold luftindtag og udblæsning fri. Et blødt underlag kan lukke for luften i bunden.",
          en: "Use the machine on a desk, not on a duvet, a cushion or your lap, and keep the air intake and exhaust clear. A soft surface can close off the air at the bottom.",
        },
      },
      {
        title: { da: "Vælg en køligere strømtilstand", en: "Choose a cooler power mode" },
        body: {
          da: "Under Indstillinger → System → Strøm og batteri kan du vælge en strømtilstand, der sparer strøm og giver mindre varme. Producentens eget program kan også have en kølig eller stille profil.",
          en: "Under Settings → System → Power & battery you can choose a power mode that saves energy and makes less heat. The manufacturer's own app may also have a cool or quiet profile.",
        },
      },
      {
        title: { da: "Opdater BIOS og drivere", en: "Update the BIOS and drivers" },
        body: {
          da: "Hent BIOS og drivere fra producentens supportside til netop din model; en opdatering kan ændre, hvordan blæseren styres. Har maskinen BitLocker, så hav genoprettelsesnøglen klar først.",
          en: "Get the BIOS and drivers from the manufacturer's support page for your exact model; an update can change how the fan is controlled. If the machine uses BitLocker, have the recovery key ready first.",
        },
      },
      {
        title: {
          da: "Larmer den stadig i ro, så tjek køleren",
          en: "Still loud when idle? Check the cooler",
        },
        body: {
          da: "Så er støv i køleribberne eller tør kølepasta den sandsynlige årsag. At se efter kræver, at maskinen åbnes: kun med strømmen afbrudt og efter modellens servicevejledning.",
          en: "Then dust in the cooling fins or dried thermal paste is the likely cause. Checking means opening the machine: only with the power disconnected and following the model's service manual.",
        },
      },
    ],
    result: [
      {
        title: {
          da: "Blæseren må gerne høres under belastning",
          en: "The fan may be heard under load",
        },
        body: {
          da: "Et videomøde, et tungt regneark eller en Windows-opdatering får blæseren til at gå. Det er støj, mens maskinen ikke laver noget, der er tegnet på et problem.",
          en: "A video call, a heavy spreadsheet or a Windows update sets the fan going. It is noise while the machine is doing nothing that signals a problem.",
        },
      },
      {
        title: { da: "Varm og langsom hænger sammen", en: "Hot and slow go together" },
        body: {
          da: "En varm processor skruer selv ned for farten for ikke at tage skade. En maskine, der bliver langsom, når den bliver varm, kan derfor have et køleproblem frem for for lidt kraft.",
          en: "A hot processor slows itself down to avoid damage. A machine that slows down as it heats up may therefore have a cooling problem rather than too little power.",
        },
      },
    ],
    limits: {
      da: "Slukker maskinen af sig selv, når den arbejder, eller buler bunden eller tastaturet, så stop med at bruge den, og få den set efter. Et opsvulmet batteri må ikke presses eller punkteres.",
      en: "If the machine switches itself off while working, or the base or keyboard bulges, stop using it and have it checked. A swollen battery must not be pressed or punctured.",
    },
    sourceIds: [
      "windowsPerformanceCheck",
      "bitlockerRecovery",
      "laptopServiceSafety",
      "swollenBatterySafety",
    ],
    related: [
      {
        href: "/reparation/rens-og-koeling",
        label: {
          da: "Få bærbaren renset og ny kølepasta",
          en: "Have the laptop cleaned and repasted",
        },
      },
      {
        href: "/vejledninger/langsom-computer",
        label: {
          da: "Find årsagen til en langsom computer",
          en: "Find what is slowing your computer",
        },
      },
      {
        href: "/vejledninger/computer-gaar-ned",
        label: { da: "Når computeren går ned", en: "When the computer crashes" },
      },
    ],
  },
  {
    slug: "overfoer-filer-til-ny-pc",
    dates: { published: "2026-11-26", modified: "2026-11-27" },
    title: {
      da: "Overføre filer til ny pc uden at glemme noget",
      en: "Transfer files to a new PC without leaving anything behind",
    },
    metaTitle: {
      da: "Overføre filer til ny pc: sådan får du det hele med | Kestro",
      en: "Transfer files to a new PC and miss nothing | Kestro",
    },
    metaDescription: {
      da: "Overføre filer til ny pc? Lav en liste, kopiér via OneDrive, Windows Backup eller en ekstern disk, og tjek alt på den nye, før den gamle bliver slettet.",
      en: "Moving files to a new PC? Write a list, copy it via OneDrive, Windows Backup or a USB drive, and test it all on the new PC before the old is wiped.",
    },
    summary: {
      da: "Få filer, bogmærker og adgangskoder med over, før den gamle maskine slettes.",
      en: "Bring files, bookmarks and passwords across before the old machine is wiped.",
    },
    intro: {
      da: "Lav først en liste over det, der skal med: mapperne Skrivebord, Dokumenter, Billeder og Downloads, browserens bogmærker og adgangskoder og de programmer, du bruger. Kopiér filerne via OneDrive, Windows Backup eller en ekstern disk, og tjek dem på den nye pc, før den gamle bliver slettet.",
      en: "First list what has to come with you: the Desktop, Documents, Pictures and Downloads folders, the browser's bookmarks and passwords, and the programs you use. Copy the files via OneDrive, Windows Backup or an external drive, and check them on the new PC before the old one is wiped.",
    },
    steps: [
      {
        title: { da: "Skriv listen", en: "Write the list" },
        body: {
          da: "Notér mapperne med filer, browserens bogmærker og gemte adgangskoder, mailprogrammet og de programmer og licenser, der skal bruges igen. Programmer kopieres ikke som filer; de installeres på den nye pc.",
          en: "Note the folders with files, the browser's bookmarks and saved passwords, the mail program, and the programs and licences you will need again. Programs are not copied as files; they are installed on the new PC.",
        },
      },
      {
        title: { da: "Brug din konto", en: "Use your account" },
        body: {
          da: "Med en Microsoft-konto kan OneDrive og Windows Backup tage mapperne og indstillingerne med, så de kommer frem, når den nye pc sættes op med samme konto. Er det en arbejdscomputer, så spørg IT først: firmaets konto bestemmer, hvad der må gemmes hvor.",
          en: "With a Microsoft account, OneDrive and Windows Backup can take the folders and settings with them, so they appear when the new PC is set up with the same account. On a work computer, ask IT first: the company's account decides what may be stored where.",
        },
      },
      {
        title: { da: "Eller brug en ekstern disk", en: "Or use an external drive" },
        body: {
          da: "Kopiér mapperne over på en USB-disk i Stifinder, og kopiér dem ind på den nye pc. Tjek, at disken har plads nok, før du går i gang.",
          en: "Copy the folders onto a USB drive in File Explorer, then copy them onto the new PC. Check that the drive has enough space before you start.",
        },
      },
      {
        title: { da: "Log ind i browseren", en: "Sign in to the browser" },
        body: {
          da: "Logger du ind med samme konto i browseren på den nye pc, følger bogmærker og gemte adgangskoder med, hvis synkronisering var slået til på den gamle.",
          en: "Sign in with the same account in the browser on the new PC, and bookmarks and saved passwords follow, if sync was switched on on the old one.",
        },
      },
      {
        title: { da: "Tjek, før den gamle slettes", en: "Check before the old one is wiped" },
        body: {
          da: "Åbn nogle filer fra hver mappe på den nye pc, og log ind i de programmer, du bruger. Slet først den gamle maskine, når alt er fundet.",
          en: "Open a few files from each folder on the new PC and sign in to the programs you use. Wipe the old machine only once everything has been found.",
        },
      },
    ],
    result: [
      {
        title: { da: "Det, der bliver glemt", en: "What gets forgotten" },
        body: {
          da: "Dokumenterne ligger i mapper, du kan se. Det, der ikke ligger i en mappe, er lettere at glemme: browserens gemte adgangskoder, mailprofilen, genvejene på skrivebordet og det ene program, kun én person bruger.",
          en: "Documents sit in folders you can see. What is not in a folder is easier to forget: the browser's saved passwords, the mail profile, the desktop shortcuts and the one program only one person uses.",
        },
      },
      {
        title: { da: "Nulstilling er ikke sletning", en: "A reset is not erasure" },
        body: {
          da: "Windows' nulstilling med Rens data gør gendannelse sværere, men ifølge Microsoft opfylder den ikke standarder for datasletning. Skal den gamle maskine sælges, så slet den efter en standard.",
          en: "Windows' reset with Clean data makes recovery harder, but according to Microsoft it does not meet data-erasure standards. If the old machine is to be sold, erase it to a standard.",
        },
      },
    ],
    limits: {
      da: "Er den gamle disk krypteret med BitLocker, og skal den læses i en anden maskine, så find genoprettelsesnøglen først. Microsoft kan ikke genskabe en mistet nøgle.",
      en: "If the old drive is encrypted with BitLocker and is to be read in another machine, find the recovery key first. Microsoft cannot recreate a lost key.",
    },
    sourceIds: ["windowsResetErasure", "bitlockerRecovery"],
    related: [
      {
        href: "/reparation/ny-opsaetning-og-dataflytning",
        label: { da: "Få flytningen gjort for dig", en: "Have the move done for you" },
      },
      {
        href: "/vejledninger/slet-data-foer-du-saelger",
        label: {
          da: "Slet data, før den gamle sælges",
          en: "Erase data before the old one is sold",
        },
      },
      {
        href: "/vejledninger/computer-gaar-ned",
        label: { da: "Når computeren går ned", en: "When the computer crashes" },
      },
    ],
  },
  {
    slug: "computer-gaar-ned",
    dates: { published: "2026-11-26", modified: "2026-11-27" },
    title: {
      da: "Computer går ned: find mønsteret i Windows",
      en: "Computer keeps crashing: find the pattern in Windows",
    },
    metaTitle: {
      da: "Computer går ned? Find mønsteret i Windows | Kestro",
      en: "Computer keeps crashing? Find the pattern | Kestro",
    },
    metaDescription: {
      da: "Computer går ned eller fryser? Skriv stopkoden ned, find historikken i perfmon /rel, opdater drivere, og lad Windows selv teste RAM'en til sidst.",
      en: "Computer crashing or freezing? Note the stop code, read the history with perfmon /rel, update drivers, and test the memory with Windows' own tool.",
    },
    summary: {
      da: "Skil en fejlskærm, en maskine, der slukker, og en, der fryser, fra hinanden.",
      en: "Tell an error screen, a machine that switches off and one that freezes apart.",
    },
    intro: {
      da: "Skriv ned, hvad der sker, når computeren går ned: en fejlskærm med en stopkode, en maskine, der bare slukker, eller en skærm, der fryser. Tryk så Windows + R, og skriv perfmon /rel: oversigten viser, hvornår Windows har registreret nedbrud, og det mønster peger på årsagen.",
      en: "Write down what happens when the computer crashes: an error screen with a stop code, a machine that simply switches off, or a screen that freezes. Then press Windows + R and type perfmon /rel: the overview shows when Windows recorded crashes, and that pattern points to the cause.",
    },
    steps: [
      {
        title: { da: "Notér, hvad der sker", en: "Note what happens" },
        body: {
          da: "Fejlskærm, sluk uden varsel og frysning er tre forskellige fejl. Fejlskærmen er blå i Windows 10 og sort i en opdateret Windows 11; tag et billede af den, for stopkoden og et eventuelt drivernavn peger på årsagen.",
          en: "An error screen, a sudden switch-off and a freeze are three different faults. The error screen is blue in Windows 10 and black in an up-to-date Windows 11; take a photo of it, because the stop code and any driver name point to the cause.",
        },
      },
      {
        title: { da: "Se historikken", en: "Read the history" },
        body: {
          da: "Tryk Windows + R, skriv kommandoen nedenfor, og tryk Enter. Oversigten viser dag for dag, hvornår Windows eller et program er gået ned.",
          en: "Press Windows + R, type the command below and press Enter. The overview shows, day by day, when Windows or a program crashed.",
        },
        command: "perfmon /rel",
      },
      {
        title: { da: "Opdater Windows og drivere", en: "Update Windows and drivers" },
        body: {
          da: "Kør Windows Update, og hent drivere og BIOS fra producentens supportside til din model. Begyndte nedbruddene efter en ny driver eller et nyt stykke udstyr, så start der.",
          en: "Run Windows Update, and get drivers and the BIOS from the manufacturer's support page for your model. If the crashes started after a new driver or a new device, start there.",
        },
      },
      {
        title: { da: "Test hukommelsen", en: "Test the memory" },
        body: {
          da: "Gem dit arbejde, tryk Windows + R, og skriv kommandoen nedenfor. Vælg at genstarte nu; Windows tester RAM og viser resultatet, når du er logget ind igen.",
          en: "Save your work, press Windows + R and type the command below. Choose to restart now; Windows tests the RAM and shows the result once you have signed in again.",
        },
        command: "mdsched.exe",
      },
      {
        title: {
          da: "Slukker den under belastning, så tjek varmen",
          en: "Switches off under load? Check the heat",
        },
        body: {
          da: "En maskine, der slukker uden fejlskærm, når den arbejder hårdt, kan være for varm. Guiden om en bærbar, der larmer eller bliver varm, viser, hvad du selv kan gøre.",
          en: "A machine that switches off without an error screen while working hard may be overheating. The guide on a laptop that is loud or hot shows what you can do yourself.",
        },
      },
    ],
    result: [
      {
        title: { da: "Ét nedbrud er ikke et mønster", en: "One crash is not a pattern" },
        body: {
          da: "Går computeren ned en enkelt gang og kører derefter normalt, er der intet mønster at gå efter endnu. Det er gentagelsen – samme program, samme tidspunkt, samme stopkode – der viser årsagen.",
          en: "If the computer crashes once and then runs normally, there is no pattern to follow yet. It is the repetition — the same program, the same time, the same stop code — that shows the cause.",
        },
      },
      {
        title: {
          da: "Fejlskærm eller ingen besked",
          en: "An error screen or no message",
        },
        body: {
          da: "En fejlskærm med stopkode betyder, at Windows selv stoppede og skrev hvorfor. En maskine, der slukker helt uden besked, kan også skyldes strøm, batteri eller varme.",
          en: "An error screen with a stop code means Windows stopped itself and said why. A machine that switches off without any message may also be down to power, the battery or heat.",
        },
      },
    ],
    limits: {
      da: "Er der vigtige data på maskinen, så tag en kopi, før du tester videre. Og opdaterer du BIOS på en maskine med BitLocker, så hav genoprettelsesnøglen klar; Microsoft kan ikke genskabe en mistet nøgle.",
      en: "If there are important files on the machine, copy them before testing further. And if you update the BIOS on a machine with BitLocker, have the recovery key ready; Microsoft cannot recreate a lost key.",
    },
    sourceIds: ["bitlockerRecovery"],
    related: [
      {
        href: "/reparation/fejlfinding",
        label: { da: "Få fejlen fundet", en: "Have the fault found" },
      },
      {
        href: "/vejledninger/baerbar-larmer-eller-bliver-varm",
        label: {
          da: "Når bærbaren larmer eller bliver varm",
          en: "When the laptop is loud or hot",
        },
      },
      {
        href: "/vejledninger/overfoer-filer-til-ny-pc",
        label: { da: "Tag en kopi af dine filer", en: "Copy your files somewhere safe" },
      },
    ],
  },
  {
    slug: "dansk-tastatur-paa-importeret-computer",
    dates: { published: "2026-11-26", modified: "2026-11-27" },
    title: {
      da: "Dansk tastatur på importeret computer: tre løsninger",
      en: "Danish keyboard on an imported computer: three options",
    },
    metaTitle: {
      da: "Dansk tastatur på importeret computer: 3 løsninger | Kestro",
      en: "Danish keyboard on an imported laptop: 3 options | Kestro",
    },
    metaDescription: {
      da: "Dansk tastatur på importeret computer: tilføj dansk layout i Windows, find æ, ø og å på udenlandske taster, og vælg klistermærker eller nyt tastatur.",
      en: "Danish keyboard on an imported laptop: add the layout in Windows, find æ, ø and å on foreign keys, then pick stickers or a fitted Nordic keyboard.",
    },
    summary: {
      da: "Få æ, ø og å på en bærbar med amerikansk eller tysk tastatur.",
      en: "Get æ, ø and å on a laptop with a US or German keyboard.",
    },
    intro: {
      da: "Tilføj dansk tastatur i Windows under Indstillinger → Tid og sprog → Sprog og område, og skift med Windows + mellemrum. Så skriver tasterne dansk, men der står stadig det udenlandske på dem: på et amerikansk tastatur ligger æ, ø og å på tasterne ; ' og [. Varigt løses det med klistermærker eller et nyt nordisk tastatur.",
      en: "Add the Danish keyboard in Windows under Settings → Time & language → Language & region, and switch with Windows + Space. The keys then type Danish, but they still show the foreign characters: on a US keyboard, æ, ø and å sit on the ; ' and [ keys. The lasting fix is stickers or a new Nordic keyboard.",
    },
    steps: [
      {
        title: { da: "Se, hvilket tastatur du har", en: "See which keyboard you have" },
        body: {
          da: "Et amerikansk tastatur har en bred, lav Enter-tast og ingen tast mellem venstre Shift og Z. Et nordisk har en høj Enter og en ekstra tast med < og > ved venstre Shift. Et tysk har Z og Y byttet om.",
          en: "A US keyboard has a wide, low Enter key and no key between left Shift and Z. A Nordic one has a tall Enter and an extra key with < and > by left Shift. A German one has Z and Y swapped.",
        },
      },
      {
        title: { da: "Tilføj dansk tastatur i Windows", en: "Add the Danish keyboard in Windows" },
        body: {
          da: "Gå til Indstillinger → Tid og sprog → Sprog og område (på engelsk Windows: Settings → Time & language → Language & region). Tilføj dansk, eller tilføj det danske tastatur under det sprog, du allerede bruger; Windows' visningssprog kan blive, som det er.",
          en: "Go to Settings → Time & language → Language & region. Add Danish, or add the Danish keyboard under the language you already use; Windows' display language can stay as it is.",
        },
      },
      {
        title: { da: "Skift mellem tastaturerne", en: "Switch between keyboards" },
        body: {
          da: "Tryk Windows-tasten + mellemrum for at skifte. Det aktive layout står i proceslinjen ved uret.",
          en: "Press the Windows key + Space to switch. The active layout is shown on the taskbar by the clock.",
        },
      },
      {
        title: { da: "Find æ, ø og å", en: "Find æ, ø and å" },
        body: {
          da: "Med dansk layout skriver et amerikansk tastatur æ på ;-tasten, ø på '-tasten og å på [-tasten; på et tysk er det Ö, Ä og Ü, og Z og Y bytter plads. Tegnene < og > ligger på en tast, et amerikansk tastatur ikke har, så skift tilbage med Windows + mellemrum, når du skal bruge dem.",
          en: "With the Danish layout, a US keyboard types æ on the ; key, ø on the ' key and å on the [ key; on a German keyboard it is Ö, Ä and Ü, and Z and Y swap places. The < and > characters sit on a key a US keyboard does not have, so switch back with Windows + Space when you need them.",
        },
      },
      {
        title: { da: "Vælg den varige løsning", en: "Choose the lasting fix" },
        body: {
          da: "Klistermærker er billige, men kan slides af og sidde skævt. Et nyt nordisk tastatur skal passe til modellen, og med eller uden baggrundslys er ikke altid den samme del.",
          en: "Stickers are cheap but can wear off and sit crooked. A new Nordic keyboard has to fit the model, and with or without backlight is not always the same part.",
        },
      },
    ],
    result: [
      {
        title: {
          da: "Layout er en indstilling, tastaturet er en del",
          en: "A layout is a setting, the keyboard is a part",
        },
        body: {
          da: "Windows-indstillingen ændrer, hvad tasterne skriver, ikke hvad der står på dem. Derfor rammer man forkert på æ, ø og å, indtil tasterne passer.",
          en: "The Windows setting changes what the keys type, not what is printed on them. That is why æ, ø and å keep going wrong until the keys match.",
        },
      },
      {
        title: {
          da: "Nordisk er ikke altid både dansk og norsk",
          en: "Nordic is not always both Danish and Norwegian",
        },
        body: {
          da: "Et nordisk tastatur kan være dansk, norsk eller kombineret. Spørg efter et billede af tasterne; navnet alene siger det ikke.",
          en: "A Nordic keyboard may be Danish, Norwegian or combined. Ask for a photo of the keys; the name alone does not say.",
        },
      },
    ],
    limits: {
      da: "På en arbejdscomputer kan sprog og tastatur være låst af IT. Så er det IT, der skal tilføje det danske tastatur.",
      en: "On a work computer, language and keyboard settings may be locked by IT. Then it is IT who adds the Danish keyboard.",
    },
    sourceIds: [],
    related: [
      {
        href: "/reparation/tastaturskift-og-nordisk-layout",
        label: {
          da: "Få skiftet til et nordisk tastatur",
          en: "Have a Nordic keyboard fitted",
        },
      },
      {
        href: "/ydelser/nordisk-tilpasning",
        label: {
          da: "Køb bærbare med dansk tastatur",
          en: "Buy laptops with a Danish keyboard",
        },
      },
      {
        href: "/vejledninger/tjek-brugt-baerbar-foer-koeb",
        label: {
          da: "Tjek en brugt bærbar, før du køber",
          en: "Check a used laptop before you buy",
        },
      },
    ],
  },
];

/** The dates a guide shows and states in its markup. */
export function practicalDates(guide: PracticalGuide) {
  return guide.dates ?? practicalGuideDates;
}

export function getPracticalGuide(slug: string): PracticalGuide | undefined {
  return practicalGuides.find((guide) => guide.slug === slug);
}

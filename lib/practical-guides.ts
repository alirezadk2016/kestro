import type { Localized } from "@/lib/i18n";
import type { SourceId } from "@/lib/sources";

/** Practical tasks stay in the guide tree; calculators support the task. */
export type PracticalGuideSlug =
  "tjek-batterikapacitet" | "tjek-ram-forbrug" | "hdd-eller-ssd" | "langsom-computer";

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
  image: string;
  imageAlt: Localized;
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
      en: "Check Windows battery capacity with a report and two figures. See retained capacity and learn what the result tells you. Read it all step by step.",
    },
    summary: {
      da: "Find rapporten, og beregn kapaciteten med to tal fra Windows.",
      en: "Find the report and calculate capacity with two Windows figures.",
    },
    intro: {
      da: "Windows kan lave en batterirapport med kommandoen powercfg /batteryreport. Fuld opladningskapacitet divideret med designkapacitet gange 100 viser, hvor meget af den oprindelige kapacitet rapporten angiver.",
      en: "Windows can create a battery report with powercfg /batteryreport. Full charge capacity divided by design capacity, multiplied by 100, gives the reported capacity as a percentage of its original specification.",
    },
    image: "/images/practical/battery.webp",
    imageAlt: {
      da: "Illustrativt foto af et intakt laptopbatteri ved en åben computer",
      en: "Illustrative photograph of an intact laptop battery beside an open computer",
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
          da: "Beregn og sammenhold med hverdagen",
          en: "Calculate and compare with daily use",
        },
        body: {
          da: "Indtast begge tal i beregneren her på siden; den kræver hele mWh. Sammenhold resultatet med, hvor længe computeren faktisk kan bruges uden oplader.",
          en: "Enter both figures in this page's calculator, which uses whole mWh. Compare the result with how long the computer actually lasts away from its charger.",
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
          da: "100 % opladet betyder fuldt i forhold til batteriets nuværende kapacitet. Det betyder ikke, at batteriet kan lagre lige så meget energi som fra nyt.",
          en: "A 100% charge means full relative to the battery's current capacity. It does not mean the battery stores as much energy as when it was new.",
        },
      },
      {
        title: {
          da: "Mangler tallene? Lad dem stå åbne",
          en: "Missing figures? Leave them unknown",
        },
        body: {
          da: "Har computeren flere batterier, beregnes de hver for sig. Hvis kapaciteten mangler, eller resultatet er over 100 %, skal rapport og enheder kontrolleres, før du drager en konklusion.",
          en: "Calculate each battery separately if the computer has more than one. If capacity is missing or the result exceeds 100%, check the report and units before drawing a conclusion.",
        },
      },
    ],
    limits: {
      da: "Resultatet er en beregning af rapporterede kapaciteter, ikke en fysisk sikkerhedstest eller en garanti for batteritid. Ved synlig opsvulmning skal du stoppe brugen og få hjælp til sikker udskiftning.",
      en: "The result calculates reported capacities; it is not a physical safety test or a battery-life guarantee. If the battery is visibly swollen, stop using the device and get help with safe replacement.",
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
      da: "Tjek RAM-forbrug i Jobliste. Se brugt og ledig RAM, og find de apps, der fylder. Læs guiden trin for trin før du beslutter, om du vil købe ny RAM.",
      en: "Check RAM usage in Windows. See used and free RAM, and identify the apps using it. Read the guide in full here, then follow it step by step.",
    },
    summary: {
      da: "Se dit hukommelsesforbrug, før du beslutter at købe mere RAM.",
      en: "See your memory usage before deciding to buy more RAM.",
    },
    intro: {
      da: "Tryk Ctrl + Shift + Esc, og vælg Ydeevne → Hukommelse i Jobliste for at se RAM-forbruget. Mål, mens du bruger dine almindelige programmer; et øjebliksbillede alene afgør ikke, om du mangler RAM.",
      en: "Press Ctrl + Shift + Esc and select Performance → Memory in Task Manager to see RAM usage. Check while using your normal applications; one snapshot alone does not establish a need for more RAM.",
    },
    image: "/images/practical/ram.webp",
    imageAlt: {
      da: "Illustrativt foto af et SO-DIMM RAM-modul ved en laptops hukommelsessokler",
      en: "Illustrative photograph of a SO-DIMM RAM module beside a laptop's memory sockets",
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
          da: "Læs I brug og Tilgængelig i samme øjeblik; deres sum er en praktisk tilnærmelse til den brugbare RAM. Brug samme enhed i beregneren, og undlad hardware-reserveret hukommelse.",
          en: "Read In use and Available at the same moment; their sum is a practical approximation of usable RAM. Use the same unit in the calculator and leave out hardware-reserved memory.",
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
      da: "Beregneren bruger dine indtastede værdier og måler hverken fysisk RAM-hastighed eller hukommelsesfejl. En høj forbrugsprocent alene er ikke en diagnose.",
      en: "The calculator uses the figures you enter; it measures neither physical RAM speed nor memory errors. A high usage percentage alone is not a diagnosis.",
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
      en: "HDD or SSD: identify your drive and its format | Kestro",
    },
    metaDescription: {
      da: "HDD eller SSD? Find dit drev i Windows og lær om M.2, SATA og NVMe. Tjek format, stik og filer før et nyt drev. Læs vores vejledning trin for trin.",
      en: "HDD or SSD? Find the drive type. Read this guide to M.2, SATA and NVMe, then check the fit and files before a new drive. See it all step by step.",
    },
    summary: {
      da: "Find drevtypen, og forstå hvad en passende SSD skal matche.",
      en: "Identify the drive type and understand what a compatible SSD must match.",
    },
    intro: {
      da: "Se efter drevtype og model under Ydeevne → Disk i Jobliste. Før et skift skal både drevets fysiske format og forbindelsen passe; M.2 beskriver formen og betyder ikke automatisk NVMe.",
      en: "Look for the drive type and model under Performance → Disk in Task Manager. A replacement must match both the physical format and connection; M.2 describes the shape and does not automatically mean NVMe.",
    },
    image: "/images/practical/ssd.webp",
    imageAlt: {
      da: "Illustrativt foto af en 2,5-tommer SATA SSD og et M.2 SSD-modul",
      en: "Illustrative photograph of a 2.5-inch SATA SSD and an M.2 SSD module",
    },
    steps: [
      {
        title: { da: "Find drevet i Windows", en: "Find the drive in Windows" },
        body: {
          da: "Tryk Ctrl + Shift + Esc, og vælg Ydeevne → Disk. Notér drevmodel og HDD eller SSD, hvis Windows viser typen; kontrollér hvert relevant drev, hvis du har flere.",
          en: "Press Ctrl + Shift + Esc and select Performance → Disk. Note the model and HDD or SSD if Windows displays the type; check each relevant drive if you have more than one.",
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
      da: "Guiden identificerer lager og kompatibilitet; den tester ikke drevets tilstand. Ved mistanke om datatab eller gentagne læsefejl skal data prioriteres før en belastningstest.",
      en: "This guide identifies storage and compatibility; it does not test drive health. If data loss or recurring read errors are suspected, prioritise the data before running a load test.",
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
          da: "Se, hvad din bærbar kan opgraderes med",
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
      da: "Langsom computer? Tjek CPU, RAM og disk i Jobliste. Find de apps i brug, og dit næste skridt. Læs guiden trin for trin før du vælger nye dele.",
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
    image: "/images/practical/performance.webp",
    imageAlt: {
      da: "Illustrativt foto af en laptops køleblæser, varmerør og processorens køleplade",
      en: "Illustrative photograph of a laptop cooling fan, heat pipe and processor cooling plate",
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
      da: "Jobliste viser ressourceforbrug, ikke en fuld hardwarediagnose. Browsermålinger kan heller ikke isolere fysisk CPU- eller RAM-hastighed; uforklarede udfald eller fejl kræver en nærmere undersøgelse.",
      en: "Task Manager shows resource usage, not a complete hardware diagnosis. Browser measurements cannot isolate physical CPU or RAM speed either; unexplained shutdowns or errors need further investigation.",
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
];

export function getPracticalGuide(slug: string): PracticalGuide | undefined {
  return practicalGuides.find((guide) => guide.slug === slug);
}

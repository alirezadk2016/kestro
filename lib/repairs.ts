import type { Localized } from "./i18n";
import type { CraftMarkName } from "@/components/CraftMark";
import type { SourceId } from "./sources";

/*
 * The repair pages.
 *
 * Every one of these was a tile on /reparation with no address of its own, so
 * somebody searching "batteriskift bærbar" landed on a grid of twelve things
 * and had to guess which one answered them. Each tile is a page now.
 *
 * Nothing here is a new promise. No price, no turnaround, no guarantee — the
 * site does not have those to give, and a repair page is exactly where an
 * invented one would do the most damage. What each page carries is what the
 * work actually involves and what we need from the customer to start it.
 */

export type RepairBand = {
  range: string;
  reading: Localized;
};

export type Repair = {
  slug: string;
  mark: CraftMarkName;
  name: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  /** The line on the tile. */
  summary: Localized;
  /**
   * The answer, first.
   *
   * An AI-SEO audit reported no answer-first structure on these pages, and it
   * was right: every one of them opened with context and got to the point in
   * the third sentence. A reader skimming, and a model quoting, both take the
   * first paragraph. So the first paragraph is now the answer, in two or
   * three sentences, and the context follows it.
   */
  answer: Localized;
  /** The paragraph under the heading. */
  intro: Localized;
  /**
   * Sources from lib/sources.ts that this page actually leans on. Only where
   * a verified source genuinely bears on the work — an invented citation is
   * worse than none.
   */
  sources?: readonly SourceId[];
  /** What the job consists of. */
  does: Localized[];
  /** What we need before we can start. */
  needs: Localized[];
  /** Battery only: how to read a percentage, and how to find one. */
  bands?: RepairBand[];
  bandsNote?: Localized;
  howTo?: { heading: Localized; steps: Localized[] }[];
};

export const repairs: Repair[] = [
  {
    slug: "batteriskift",
    mark: "battery",
    name: { da: "Batteriskift", en: "Battery replacement" },
    metaTitle: {
      da: "Batteriskift til bærbar – og hvordan du tjekker batteriets tilstand",
      en: "Laptop battery replacement — and how to check your battery health",
    },
    metaDescription: {
      da: "Hvad batteriprocenten betyder, hvordan du selv måler den på Windows og Mac, og hvornår et batteri er værd at skifte.",
      en: "What the battery percentage means, how to measure it yourself on Windows and Mac, and when a battery is worth replacing.",
    },
    summary: {
      da: "Holder den bærbare ikke længere en arbejdsdag? Batteriet er en af de billigste dele at skifte – vi oplyser prisen, før vi går i gang.",
      en: "Laptop no longer lasting a working day? The battery is one of the cheapest parts to change — we quote the price before we start.",
    },
    answer: {
      da: "Et batteri er slidt, når det ikke længere holder en arbejdsdag. Tallet at gå efter er batteriets kapacitet i procent af da det var nyt: over 80% er almindeligt slid, under 70% er det tid til at skifte. Du finder tallet selv på ti sekunder — powercfg /batteryreport på Windows, Systemindstillinger → Batteri på en Mac.",
      en: "A battery is worn out when it no longer lasts a working day. The number to go by is its capacity as a percentage of new: above 80% is normal wear, below 70% it is time to replace it. You can find the number yourself in ten seconds — powercfg /batteryreport on Windows, System Settings → Battery on a Mac.",
    },
    intro: {
      da: "Et batteri mister kapacitet, mens det bliver brugt. Det er ikke en fejl – det er sådan litium-ion opfører sig. Spørgsmålet er ikke, om kapaciteten falder, men hvornår faldet begynder at koste dig en arbejdsdag. Det tal kan du selv slå op på ti sekunder, og herunder står både hvordan og hvad tallet betyder.",
      en: "A battery loses capacity while it is being used. That is not a fault — it is how lithium-ion behaves. The question is not whether capacity falls but when the fall starts costing you a working day. You can look that number up yourself in ten seconds, and below is both how and what the number means.",
    },
    does: [
      {
        da: "Vi måler den faktiske kapacitet i procent af ny, før vi foreslår noget.",
        en: "We measure the actual capacity as a percentage of new before suggesting anything.",
      },
      {
        da: "Vi skifter batteriet og kontrollerer, at maskinen lader og aflader, som den skal bagefter.",
        en: "We replace the battery and check that the machine charges and discharges correctly afterwards.",
      },
      {
        da: "Det gamle batteri tager vi med til korrekt bortskaffelse, hvis I vil af med det.",
        en: "We take the old battery away for correct disposal if you want it gone.",
      },
    ],
    needs: [
      {
        da: "Maskinens model – den står oftest på undersiden eller i systemoplysningerne.",
        en: "The machine's model — usually on the underside or in the system information.",
      },
      {
        da: "Batteriprocenten, hvis du har slået den op. Så kan vi sige, om et skift overhovedet kan betale sig.",
        en: "The battery percentage, if you have looked it up. Then we can say whether a replacement is worth it at all.",
      },
    ],
    bands: [
      {
        range: "90–100%",
        reading: {
          da: "Som ny. Maskinen holder, hvad den blev solgt til at holde.",
          en: "As new. The machine lasts what it was sold to last.",
        },
      },
      {
        range: "80–90%",
        reading: {
          da: "Almindeligt slid. De fleste maskiner klarer stadig en arbejdsdag.",
          en: "Normal wear. Most machines still manage a working day.",
        },
      },
      {
        range: "70–80%",
        reading: {
          da: "Du kan mærke det. Planlæg et skift, men det haster sjældent.",
          en: "You notice it. Plan a replacement, though it is rarely urgent.",
        },
      },
      {
        range: "Under 70%",
        reading: {
          da: "Skift det. Herfra er maskinen reelt bundet til en stikkontakt.",
          en: "Replace it. Below this the machine is effectively tied to a socket.",
        },
      },
    ],
    bandsNote: {
      da: "Det er sådan vi læser tallet – ikke en officiel standard. Kapacitet er kun den ene halvdel: hvor længe maskinen faktisk holder, afhænger også af skærmens lysstyrke, hvad der kører, og hvilken maskine det er. To maskiner på 85% holder ikke nødvendigvis lige længe.",
      en: "That is how we read the number — not an official standard. Capacity is only half of it: how long a machine actually lasts also depends on screen brightness, what is running, and which machine it is. Two machines at 85% will not necessarily last the same time.",
    },
    howTo: [
      {
        heading: { da: "Windows", en: "Windows" },
        steps: [
          { da: "Åbn Kommandoprompt eller PowerShell.", en: "Open Command Prompt or PowerShell." },
          {
            da: "Skriv powercfg /batteryreport og tryk Enter.",
            en: "Type powercfg /batteryreport and press Enter.",
          },
          {
            da: "Åbn den HTML-fil, kommandoen skriver stien til.",
            en: "Open the HTML file whose path the command prints.",
          },
          {
            da: "Find DESIGN CAPACITY og FULL CHARGE CAPACITY. Den sidste divideret med den første er batteriets tilstand i procent. Rapporten viser også CYCLE COUNT – antal fulde opladninger.",
            en: "Find DESIGN CAPACITY and FULL CHARGE CAPACITY. The second divided by the first is the battery's health as a percentage. The report also shows CYCLE COUNT — the number of full charges.",
          },
        ],
      },
      {
        heading: { da: "Mac", en: "Mac" },
        steps: [
          {
            da: "Åbn Systemindstillinger og vælg Batteri.",
            en: "Open System Settings and choose Battery.",
          },
          {
            da: "Klik på ⓘ ved siden af Batteriets tilstand. Her står den maksimale kapacitet i procent.",
            en: "Click the ⓘ next to Battery Health. The maximum capacity is shown there as a percentage.",
          },
          {
            da: "Hold Alt nede og klik på Æble-menuen → Systemoplysninger → Strøm for at se antal cyklusser.",
            en: "Hold Option and click the Apple menu → System Information → Power to see the cycle count.",
          },
        ],
      },
    ],
  },
  {
    slug: "ram-og-ssd-opgradering",
    mark: "memory",
    name: { da: "RAM- og SSD-opgradering", en: "Memory and SSD upgrades" },
    metaTitle: {
      da: "RAM- og SSD-opgradering af bærbare og stationære",
      en: "Memory and SSD upgrades for laptops and desktops",
    },
    metaDescription: {
      da: "Mere hukommelse og hurtigere lagring er ofte den billigste vej til en mærkbart hurtigere maskine. Sådan finder vi ud af, om det kan betale sig.",
      en: "More memory and faster storage is often the cheapest route to a noticeably quicker machine. How we work out whether it is worth it.",
    },
    summary: {
      da: "Mere hukommelse og hurtigere lagring er ofte den billigste vej til en mærkbart hurtigere maskine.",
      en: "More memory and faster storage is often the cheapest route to a noticeably quicker machine.",
    },
    answer: {
      da: "Mere RAM eller en SSD er som regel billigere end en ny maskine og gør større forskel. Hvilken af de to der hjælper, afhænger af hvad maskinen venter på: en langsom disk mærkes ved opstart og når programmer åbner, for lidt hukommelse mærkes når der er mange ting åbne på én gang.",
      en: "More memory or an SSD is usually cheaper than a new machine and makes more difference. Which of the two helps depends on what the machine is waiting for: a slow disk shows at startup and when programs open, too little memory shows when a lot is open at once.",
    },
    intro: {
      da: "En maskine, der føles langsom, er sjældent langsom af samme grund hver gang. Skal den vente på disken, eller er den løbet tør for hukommelse? De to problemer føles ens og koster ikke det samme at løse, så vi kigger efter, hvad der faktisk er flaskehalsen, før vi foreslår en del.",
      en: "A machine that feels slow is rarely slow for the same reason twice. Is it waiting on the disk, or has it run out of memory? The two feel alike and do not cost the same to fix, so we look for what the bottleneck actually is before proposing a part.",
    },
    does: [
      {
        da: "Vi ser efter, hvad maskinen står og venter på, før vi skifter noget.",
        en: "We look at what the machine is waiting on before changing anything.",
      },
      {
        da: "Vi flytter Windows og dine filer med over på den nye disk, så du ikke skal sætte alt op igen.",
        en: "We move Windows and your files across to the new disk so you do not have to set everything up again.",
      },
      {
        da: "Vi oplyser, hvor meget maskinen maksimalt kan tage, så opgraderingen ikke bliver spildt.",
        en: "We tell you the machine's maximum, so the upgrade is not wasted.",
      },
    ],
    needs: [
      { da: "Model og årgang på maskinen.", en: "The machine's model and year." },
      {
        da: "Hvad den bruges til – det afgør, om det er hukommelse eller disk, der mangler.",
        en: "What it is used for — that decides whether memory or disk is what is missing.",
      },
    ],
  },
  {
    slug: "skaermskift",
    mark: "screen",
    name: { da: "Skærmskift", en: "Screen replacement" },
    metaTitle: {
      da: "Skærmskift på bærbar, tablet og telefon",
      en: "Screen replacement for laptops, tablets and phones",
    },
    metaDescription: {
      da: "Revnet eller defekt skærm. Hvad vi skifter, og hvad vi skal vide for at finde den rigtige skærm.",
      en: "Cracked or faulty screens. What we replace, and what we need to know to find the right panel.",
    },
    summary: {
      da: "Revnet eller defekt skærm på bærbar, tablet eller telefon.",
      en: "Cracked or faulty screens on laptops, tablets and phones.",
    },
    answer: {
      da: "En revnet eller defekt skærm kan skiftes på de fleste bærbare, tablets og telefoner. Det afgørende er ikke maskinens model alene — den samme model er ofte solgt med flere forskellige paneler, så vi skal vide hvilket der sidder i netop din.",
      en: "A cracked or faulty screen can be replaced on most laptops, tablets and phones. What decides it is not the model alone — the same model was often sold with several different panels, so we need to know which one is in yours.",
    },
    intro: {
      da: "En revne breder sig, og en skærm med en død stribe bliver ikke bedre af at vente. Den samme maskinmodel er ofte solgt med flere forskellige paneler, så det afgørende er ikke modellen alene – det er hvilket panel der sidder i netop din.",
      en: "A crack spreads, and a screen with a dead line does not improve by waiting. The same model was often sold with several different panels, so the model alone is not what decides it — it is which panel is in yours.",
    },
    does: [
      {
        da: "Vi identificerer panelet i maskinen, ikke bare modellen.",
        en: "We identify the panel in the machine, not just the model.",
      },
      {
        da: "Vi kontrollerer bagefter for døde pixels, farve og lysstyrke i hele fladen.",
        en: "We check afterwards for dead pixels, colour and brightness across the whole surface.",
      },
    ],
    needs: [
      { da: "Model og serienummer.", en: "Model and serial number." },
      {
        da: "Et billede af skaden, hvis skærmen stadig kan tændes.",
        en: "A photo of the damage, if the screen still turns on.",
      },
    ],
  },
  {
    slug: "tastaturskift-og-nordisk-layout",
    mark: "keyboard",
    name: { da: "Tastaturskift og nordisk layout", en: "Keyboard swap and Nordic layout" },
    metaTitle: {
      da: "Tastaturskift og dansk/nordisk layout",
      en: "Keyboard replacement and Danish or Nordic layout",
    },
    metaDescription: {
      da: "Defekt tastatur skiftes, og importerede maskiner kan få dansk eller nordisk layout, så æ, ø og å sidder, hvor de skal.",
      en: "Faulty keyboards replaced, and imported machines can get a Danish or Nordic layout so æ, ø and å sit where they should.",
    },
    summary: {
      da: "Defekt tastatur skiftes – og importerede maskiner kan få dansk/nordisk layout, så æ, ø og å sidder, hvor de skal.",
      en: "Faulty keyboards replaced — and imported machines can get a Danish or Norwegian layout, so æ, ø and å sit where they should.",
    },
    answer: {
      da: "Ja, importerede maskiner kan få dansk eller nordisk tastatur. Det er et fysisk skift, ikke en indstilling: man kan ændre layoutet i Windows, men så står der stadig det forkerte på tasterne, og det er æ, ø og å man rammer forkert hele dagen.",
      en: "Yes, imported machines can get a Danish or Nordic keyboard. It is a physical swap, not a setting: you can change the layout in Windows, but the keys still say the wrong thing, and æ, ø and å are what you then mistype all day.",
    },
    intro: {
      da: "Brugt erhvervsudstyr kommer ofte ind med tysk eller amerikansk tastatur. Man kan skifte layoutet i Windows, men så står der stadig det forkerte på tasterne, og det er de tre danske bogstaver, man rammer forkert hele dagen. Vi skifter det fysiske tastatur i stedet.",
      en: "Used business equipment often arrives with a German or US keyboard. You can change the layout in Windows, but the keys still say the wrong thing, and it is the three Danish letters you then mistype all day. We change the physical keyboard instead.",
    },
    does: [
      {
        da: "Vi skifter det fysiske tastatur og sætter layoutet i styresystemet til at passe.",
        en: "We change the physical keyboard and set the layout in the operating system to match.",
      },
      {
        da: "Vi trykker hver tast igennem bagefter.",
        en: "We press every key through afterwards.",
      },
    ],
    needs: [
      {
        da: "Model og hvilket layout maskinen har nu.",
        en: "The model, and which layout the machine has now.",
      },
      {
        da: "Om der skal baggrundsbelysning i – det er ikke altid det samme tastatur.",
        en: "Whether it needs backlighting — that is not always the same keyboard.",
      },
    ],
  },
  {
    slug: "reservedele-og-komponentskift",
    mark: "parts",
    name: { da: "Reservedele og komponentskift", en: "Spare parts and components" },
    metaTitle: { da: "Reservedele og komponentskift", en: "Spare parts and component replacement" },
    metaDescription: {
      da: "Blæser, hængsler, ladestik, højttalere og kabler. De dele der slides, og som en maskine ellers bliver kasseret på.",
      en: "Fans, hinges, charging ports, speakers and cables. The parts that wear, and that a machine otherwise gets scrapped over.",
    },
    summary: {
      da: "Blæser, hængsler, ladestik, højttalere, kabler og andre slidte dele skiftes, så maskinen kan køre videre.",
      en: "Fans, hinges, charging ports, speakers, cables and other worn parts replaced so the machine keeps going.",
    },
    answer: {
      da: "De fleste maskiner der bliver kasseret, fejler én ting: et hængsel, et ladestik, en blæser. Den slags dele kan skiftes, og EU's reparationsdirektiv forpligter producenter til ikke at spærre for brugte og kompatible reservedele.",
      en: "Most machines that get scrapped have one thing wrong with them: a hinge, a charging port, a fan. Parts like that can be replaced, and the EU repair directive obliges manufacturers not to block the use of used and compatible spare parts.",
    },
    sources: ["repairDirective"] as const,
    intro: {
      da: "De fleste maskiner, der bliver skiftet ud, fejler én ting. Et hængsel, der har revet sig løs, eller et ladestik, der er blevet slidt af fem år med samme kabel. Det er den slags, der afgør, om en maskine har tre år mere i sig eller ryger på lageret.",
      en: "Most machines that get replaced have one thing wrong with them. A hinge that has torn loose, or a charging port worn out by five years of the same cable. That is the kind of thing that decides whether a machine has three more years in it or goes on a shelf.",
    },
    does: [
      {
        da: "Vi finder ud af, hvilken del der fejler, før vi bestiller noget.",
        en: "We work out which part has failed before ordering anything.",
      },
      {
        da: "Vi siger til, hvis delen koster mere, end maskinen er værd.",
        en: "We say so if the part costs more than the machine is worth.",
      },
    ],
    needs: [
      { da: "Model og serienummer.", en: "Model and serial number." },
      {
        da: "En beskrivelse af, hvad der sker – og hvornår det sker.",
        en: "A description of what happens — and when it happens.",
      },
    ],
  },
  {
    slug: "rens-og-koeling",
    mark: "cooling",
    name: { da: "Rens og køling", en: "Cleaning and cooling" },
    metaTitle: {
      da: "Rens og køling – varm og larmende maskine",
      en: "Cleaning and cooling — a hot, loud machine",
    },
    metaDescription: {
      da: "Støv og gammel kølepasta gør en maskine varm og larmende, og en varm maskine sætter sig selv ned i fart. Hvad en rens gør.",
      en: "Dust and old thermal paste make a machine hot and loud, and a hot machine slows itself down. What a clean does.",
    },
    summary: {
      da: "Støv og gammel kølepasta gør maskinen varm og larmende. En rens kan give ro og stabilitet tilbage.",
      en: "Dust and old thermal paste make a machine hot and loud. A clean can bring back quiet and stability.",
    },
    answer: {
      da: "En maskine, der er blevet varm og larmende, er som regel stoppet til med støv og har tør kølepasta. Den er ikke bare højlydt — den sætter også sig selv ned i fart for ikke at tage skade, og det bliver ofte læst som at maskinen er for gammel.",
      en: "A machine that has gone hot and loud is usually clogged with dust with dried-out thermal paste. It is not just noisy — it also slows itself down to avoid damage, and that often gets read as the machine being past it.",
    },
    intro: {
      da: "En maskine, der bliver for varm, sætter sig selv ned i fart for ikke at tage skade. Den er altså ikke bare larmende – den er også langsommere, og det bliver ofte læst som at maskinen er ved at være for gammel. Tit er den bare stoppet til.",
      en: "A machine that gets too hot slows itself down to avoid damage. So it is not just loud — it is slower too, and that often gets read as the machine being past it. Often it is simply clogged.",
    },
    does: [
      {
        da: "Vi åbner maskinen, renser køleribber og blæser, og skifter kølepasta.",
        en: "We open the machine, clean the fins and fan, and replace the thermal paste.",
      },
      {
        da: "Vi belaster den bagefter og ser, hvor temperaturen lægger sig.",
        en: "We load it afterwards and see where the temperature settles.",
      },
    ],
    needs: [
      {
        da: "Model, og om maskinen larmer hele tiden eller kun under belastning.",
        en: "The model, and whether it is loud all the time or only under load.",
      },
    ],
  },
  {
    slug: "windows-installation",
    mark: "install",
    name: { da: "Windows-installation", en: "Windows installation" },
    metaTitle: {
      da: "Ren Windows-installation med drivere",
      en: "A clean Windows install with drivers",
    },
    metaDescription: {
      da: "Windows sat op fra bunden med de rigtige drivere, så en langsom maskine starter rent igen. Hvad vi gør, og hvornår det kan betale sig.",
      en: "Windows set up from scratch with the right drivers, so a slow machine boots clean again. What we do, and when it is worth doing.",
    },
    summary: {
      da: "Ren installation af Windows med drivere og opdateringer, så maskinen starter op som en ny.",
      en: "A clean Windows install with drivers and updates, so the machine starts up like new.",
    },
    answer: {
      da: "En ren Windows-installation fjerner alt på maskinen og sætter styresystemet op fra bunden med de rigtige drivere. Det er den hurtigste måde at gøre en fem år gammel maskine brugbar igen — og fordi den fjerner alt, skal data der skal med over, siges før og ikke efter.",
      en: "A clean Windows install wipes the machine and sets the operating system up from scratch with the right drivers. It is the quickest way to make a five-year-old machine usable again — and because it removes everything, data that has to come across must be named before, not after.",
    },
    sources: ["windows10Eol", "windows11Requirements"] as const,
    intro: {
      da: "En maskine, der har kørt i fem år, har lag på lag af programmer, den ikke bruger længere. En ren installation fjerner dem alle sammen på én gang – men den fjerner også alt andet, så rækkefølgen betyder noget.",
      en: "A machine that has run for five years has layer on layer of software it no longer uses. A clean install removes all of it at once — but it removes everything else too, so the order matters.",
    },
    does: [
      {
        da: "Vi installerer Windows rent og henter driverne til netop den model.",
        en: "We install Windows clean and fetch the drivers for that exact model.",
      },
      {
        da: "Vi kører opdateringerne igennem, så maskinen ikke skal bruge sin første dag på det.",
        en: "We run the updates through, so the machine does not spend its first day on them.",
      },
    ],
    needs: [
      {
        da: "Om der er data på maskinen, der skal med over. Sig det før, ikke efter.",
        en: "Whether there is data on the machine that has to come across. Say so before, not after.",
      },
      {
        da: "Hvilken Windows-version og licens I kører på.",
        en: "Which Windows version and licence you are on.",
      },
    ],
  },
  {
    slug: "software-og-licenser",
    mark: "written",
    name: { da: "Software og licenser", en: "Software and licences" },
    metaTitle: { da: "Software og licenser på plads", en: "Software and licences in order" },
    metaDescription: {
      da: "Programmerne og licenserne på plads, før maskinerne når frem til medarbejderne. Hvad vi sætter op, og hvad I selv skal levere.",
      en: "Software and licences in place before the machines reach your staff. What we set up, and what you need to supply.",
    },
    summary: {
      da: "Vi installerer de programmer, I bruger, og hjælper med at få licenserne på plads, så maskinerne kører lovligt fra første dag.",
      en: "We install the programs you use and help get the licences in order, so the machines run legally from day one.",
    },
    answer: {
      da: "Licenser følger ikke automatisk med brugt hardware. De to ting købes hver for sig, og det er værd at have afklaret, hvilke licenser I allerede har, før maskinerne står på skrivebordene.",
      en: "Licences do not automatically come with used hardware. The two are bought separately, and it is worth settling which licences you already hold before the machines are on the desks.",
    },
    intro: {
      da: "Brugt hardware og licenser er to forskellige ting, og den ene følger ikke automatisk med den anden. Det er værd at have styr på, før maskinerne står på skrivebordene.",
      en: "Used hardware and licences are two different things, and one does not automatically come with the other. Worth settling before the machines are on the desks.",
    },
    does: [
      {
        da: "Vi installerer de programmer, I bruger i forvejen.",
        en: "We install the software you already use.",
      },
      {
        da: "Vi hjælper med at få licenserne på plads og siger til, hvis noget ikke kan overdrages.",
        en: "We help get the licences in order and say so if something cannot be transferred.",
      },
    ],
    needs: [
      {
        da: "En liste over de programmer, maskinerne skal have.",
        en: "A list of the software the machines need.",
      },
      { da: "Hvilke licenser I allerede har.", en: "Which licences you already hold." },
    ],
  },
  {
    slug: "ny-opsaetning-og-dataflytning",
    mark: "adjust",
    name: { da: "Ny opsætning og dataflytning", en: "Fresh setup and data migration" },
    metaTitle: { da: "Ny opsætning og flytning af data", en: "Fresh setup and moving your data" },
    metaDescription: {
      da: "Frisk installation af styresystem, og filer og programmer flyttet med over på den nye maskine.",
      en: "A fresh operating system install, with files and software moved across to the new machine.",
    },
    summary: {
      da: "Frisk installation af styresystem, og dine filer og programmer flyttet med over.",
      en: "A fresh operating system install, with your files and software moved across.",
    },
    answer: {
      da: "Ved et maskinskift er det ikke maskinen der tager tid — det er de to dage bagefter, hvor man opdager hvad der ikke kom med over. Derfor gennemgår vi listen over filer, profiler og programmer før flytningen, og først derefter bliver den gamle maskine slettet.",
      en: "With a new machine it is not the machine that takes time — it is the two days afterwards spent finding what did not come across. So we go through the list of files, profiles and software before the move, and only then is the old machine wiped.",
    },
    sources: ["nistSanitization"] as const,
    intro: {
      da: "Det, der tager tid ved en ny maskine, er sjældent maskinen. Det er de to dage, hvor man opdager, hvad der ikke kom med over. Derfor gennemgår vi, hvad der skal flyttes, før vi går i gang – ikke bagefter.",
      en: "What takes time with a new machine is rarely the machine. It is the two days spent discovering what did not come across. So we go through what has to move before we start, not after.",
    },
    does: [
      {
        da: "Vi sætter maskinen op og flytter filer, profiler og programmer med over.",
        en: "We set the machine up and move files, profiles and software across.",
      },
      {
        da: "Vi gennemgår listen med jer, før den gamle maskine bliver slettet.",
        en: "We go through the list with you before the old machine is wiped.",
      },
    ],
    needs: [
      { da: "Adgang til den gamle maskine.", en: "Access to the old machine." },
      {
        da: "Hvilke konti og programmer der skal virke fra dag ét.",
        en: "Which accounts and software have to work from day one.",
      },
    ],
  },
  {
    slug: "fejlfinding",
    mark: "repair",
    name: { da: "Fejlfinding", en: "Troubleshooting" },
    metaTitle: {
      da: "Fejlfinding – maskinen starter ikke eller går ned",
      en: "Troubleshooting — the machine will not start or keeps crashing",
    },
    metaDescription: {
      da: "Maskinen starter ikke, går ned eller opfører sig underligt. Vi finder årsagen og fortæller, hvad det vil koste at rette.",
      en: "The machine will not start, crashes or behaves oddly. We find the cause and tell you what a fix would cost.",
    },
    summary: {
      da: "Maskinen starter ikke, går ned eller opfører sig underligt – vi finder årsagen og fortæller, hvad det vil koste at rette.",
      en: "The machine will not start, crashes or behaves oddly — we find the cause and tell you what a fix would cost.",
    },
    answer: {
      da: "Vi finder årsagen først og melder tilbage med, hvad en reparation vil koste, før vi retter noget. Det vi leder efter er et mønster: hvornår sker fejlen, og hvad kører der, når den sker.",
      en: "We find the cause first and report back with what a repair would cost before fixing anything. What we look for is a pattern: when does the fault happen, and what is running when it does.",
    },
    sources: ["dkWarranty"] as const,
    intro: {
      da: "En maskine, der går ned en gang om ugen, er sværere at finde fejlen på end en, der slet ikke starter. Det første vi leder efter, er et mønster: hvornår sker det, og hvad kører der, når det sker.",
      en: "A machine that crashes once a week is harder to diagnose than one that will not start at all. The first thing we look for is a pattern: when does it happen, and what is running when it does.",
    },
    does: [
      {
        da: "Vi finder årsagen først og melder tilbage, før vi retter noget.",
        en: "We find the cause first and report back before fixing anything.",
      },
      {
        da: "Vi siger det, hvis en reparation ikke kan betale sig.",
        en: "We say so if a repair is not worth doing.",
      },
    ],
    needs: [
      {
        da: "Hvornår fejlen sker, og hvad der kører, når den sker.",
        en: "When the fault happens, and what is running when it does.",
      },
      {
        da: "Om der er vigtige data på maskinen.",
        en: "Whether there is important data on the machine.",
      },
    ],
  },
  {
    slug: "samling-af-pc",
    mark: "assembly",
    name: { da: "Samling af pc", en: "PC assembly" },
    metaTitle: { da: "Samling og opgradering af pc", en: "PC assembly and upgrades" },
    metaDescription: {
      da: "Vi samler en maskine efter jeres ønsker – enten helt fra bunden eller ved at opgradere den, I har.",
      en: "We build a machine to your specification — from scratch, or by upgrading the one you have.",
    },
    summary: {
      da: "Vi samler en maskine efter dine ønsker – enten helt fra bunden eller ved at opgradere den, du har.",
      en: "We build a machine to your specification — from scratch, or by upgrading the one you have.",
    },
    answer: {
      da: "Vi bygger efter opgaven, ikke efter et datablad. Det der afgør delene er, hvad maskinen skal kunne — og om der allerede står en maskine, der kan bygges videre på i stedet for at starte forfra.",
      en: "We build for the job, not to a spec sheet. What decides the parts is what the machine has to do — and whether there is already a machine to build on rather than start over.",
    },
    intro: {
      da: "En maskine, der skal kunne én bestemt ting rigtig godt, er sjældent den, der står på hylden. Vi bygger efter opgaven, ikke efter et datablad.",
      en: "A machine that has to do one particular thing well is rarely the one on the shelf. We build for the job, not to a spec sheet.",
    },
    does: [
      {
        da: "Vi sammensætter delene efter, hvad maskinen skal bruges til.",
        en: "We put the parts together around what the machine is for.",
      },
      {
        da: "Vi samler, installerer og belaster den, før den bliver leveret.",
        en: "We assemble, install and load-test it before it is delivered.",
      },
    ],
    needs: [
      {
        da: "Hvad maskinen skal kunne – ikke hvilke dele I tror, den skal have.",
        en: "What the machine has to do — not which parts you think it needs.",
      },
      {
        da: "Om der er en eksisterende maskine, der kan bygges videre på.",
        en: "Whether there is an existing machine to build on.",
      },
    ],
  },
  {
    slug: "klargoering-af-brugt-udstyr",
    mark: "tested",
    name: { da: "Klargøring af brugt udstyr", en: "Setting up used equipment" },
    metaTitle: { da: "Klargøring af brugt udstyr", en: "Setting up used equipment" },
    metaDescription: {
      da: "Har I købt en brugt maskine? Vi tjekker den igennem, sætter den op og gør den klar til brug.",
      en: "Bought a used machine? We check it over, set it up and get it ready to use.",
    },
    summary: {
      da: "Har du købt en brugt maskine? Vi tjekker den igennem, sætter den op og gør den klar til brug.",
      en: "Bought a used machine? We check it over, set it up and get it ready to use.",
    },
    answer: {
      da: "En brugt maskine er en ukendt størrelse, indtil nogen har set efter. Vi gennemgår den, oplyser batteriets faktiske kapacitet i procent, sætter den op og siger til, hvis noget er slidt nok til at skulle skiftes.",
      en: "A used machine is an unknown until somebody has looked. We go through it, give the battery's actual capacity as a percentage, set it up, and say so if anything is worn enough to need replacing.",
    },
    sources: ["dkWarranty"] as const,
    intro: {
      da: "En brugt maskine, der lige er kommet ind ad døren, er en ukendt størrelse, indtil nogen har set efter. Det, der er værd at vide, er hvad der er slidt, og hvad der er skiftet – og det står sjældent i annoncen.",
      en: "A used machine that has just come through the door is an unknown until somebody has looked. What is worth knowing is what is worn and what has been replaced — and that is rarely in the listing.",
    },
    does: [
      {
        da: "Vi gennemgår maskinen og oplyser batteriets faktiske kapacitet i procent.",
        en: "We go through the machine and give the battery's actual capacity as a percentage.",
      },
      {
        da: "Vi sætter den op, så den er klar til at blive brugt.",
        en: "We set it up so it is ready to be used.",
      },
    ],
    needs: [
      {
        da: "Maskinen, og hvad den skal bruges til.",
        en: "The machine, and what it is going to be used for.",
      },
    ],
  },
];

export const getRepair = (slug: string) => repairs.find((r) => r.slug === slug);

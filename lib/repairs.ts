import type { Localized } from "./i18n";
import type { CraftMarkName } from "@/components/CraftMark";
import type { SourceId } from "./sources";
import { batteryBands } from "./battery-bands";

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
  /**
   * The page's heading, when it should carry the search phrase and the
   * short `name` (menus, cards, breadcrumbs) should not. Mak rule 5.
   */
  h1?: Localized;
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
  /** A practical guide that lets the reader measure the problem first. */
  tool?: { href: string; label: Localized };
  howTo?: { heading: Localized; steps: Localized[] }[];
};

export const repairs: Repair[] = [
  {
    slug: "batteriskift",
    mark: "battery",
    name: { da: "Batteriskift", en: "Battery replacement" },
    h1: { da: "Batteriskift på bærbar", en: "Laptop battery replacement" },
    metaTitle: {
      da: "Batteriskift på bærbar: tjek batteriet først | Kestro",
      en: "Laptop battery replacement: check its health first | Kestro",
    },
    metaDescription: {
      da: "Hvad batteriprocenten betyder, hvordan du selv måler den på Windows og Mac, og hvornår et nyt batteri betaler sig. Du får prisen, før vi går i gang.",
      en: "What the battery percentage means, how to measure it yourself on Windows and Mac, and when a new battery is worth it. A price before we start.",
    },
    summary: {
      da: "Holder den bærbare ikke en arbejdsdag længere? Et nyt batteri er en af de billigste reparationer.",
      en: "Laptop no longer lasting a working day? A new battery is one of the cheapest repairs.",
    },
    answer: {
      da: "Et batteri er slidt, når det ikke længere holder en arbejdsdag. Tallet at gå efter er kapaciteten i procent af, hvad batteriet kunne som nyt: over 80 % er almindeligt slid, under 70 % er det tid til at skifte. Du finder tallet selv på ti sekunder – powercfg /batteryreport på Windows, Systemindstillinger → Batteri på en Mac.",
      en: "A battery is worn out when it no longer lasts a working day. The number to go by is its capacity as a percentage of new: above 80% is normal wear, below 70% it is time to replace it. You can find the number yourself in ten seconds — powercfg /batteryreport on Windows, System Settings → Battery on a Mac.",
    },
    intro: {
      da: "Et batteri mister kapacitet, mens det bliver brugt. Det er ikke en fejl – det er sådan litium-ion opfører sig. Spørgsmålet er ikke, om kapaciteten falder, men hvornår faldet begynder at koste dig en arbejdsdag. Herunder står, hvordan du slår tallet op, og hvad det betyder.",
      en: "A battery loses capacity while it is being used. That is not a fault — it is how lithium-ion behaves. The question is not whether capacity falls but when the fall starts costing you a working day. Below is how to look the number up, and what it means.",
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
        da: "Det gamle batteri tager vi med til korrekt bortskaffelse, hvis du vil af med det.",
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
    bands: batteryBands,
    bandsNote: {
      da: "Det er sådan, vi læser tallet – ikke en officiel standard. Kapacitet er kun den ene halvdel: hvor længe maskinen faktisk holder, afhænger også af skærmens lysstyrke, hvad der kører, og hvilken maskine det er. To maskiner på 85% holder ikke nødvendigvis lige længe.",
      en: "That is how we read the number — not an official standard. Capacity is only half of it: how long a machine actually lasts also depends on screen brightness, what is running, and which machine it is. Two machines at 85% will not necessarily last the same time.",
    },
    tool: {
      href: "/vejledninger/tjek-batterikapacitet",
      label: {
        da: "Regn kapaciteten ud i vores beregner",
        en: "Work out the capacity in our calculator",
      },
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
            da: "Find DESIGN CAPACITY og FULL CHARGE CAPACITY. Del FULL CHARGE CAPACITY med DESIGN CAPACITY, og gang med 100 – så har du batteriets tilstand i procent. Rapporten viser også CYCLE COUNT, altså antallet af fulde opladninger.",
            en: "Find DESIGN CAPACITY and FULL CHARGE CAPACITY. Divide FULL CHARGE CAPACITY by DESIGN CAPACITY and multiply by 100 — that is the battery's health as a percentage. The report also shows CYCLE COUNT, the number of full charges.",
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
            da: "Hold Alt (⌥) nede, og klik på Æble-menuen → Systemoplysninger → Strøm for at se antal cyklusser.",
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
    tool: {
      href: "/vejledninger/tjek-ram-forbrug",
      label: {
        da: "Mål først, om du mangler RAM",
        en: "First measure whether you are short of RAM",
      },
    },
    metaTitle: {
      da: "RAM og SSD: opgradering af din gamle bærbare | Kestro",
      en: "Upgrade an old laptop: RAM and SSD options | Kestro",
    },
    metaDescription: {
      da: "Opgradering af gammel bærbar: tjek RAM, SSD og flaskehalse, før du køber nyt. Få afklaret kompatibilitet og pris, før du vælger den rette løsning.",
      en: "Upgrade an old laptop: check RAM, SSD and the real bottleneck before replacing it. Discuss compatibility and price before choosing the next step.",
    },
    summary: {
      da: "Undersøg, om den gamle bærbare kan få mere RAM eller en SSD, før du vælger en ny computer.",
      en: "Check whether the old laptop can take more RAM or an SSD before choosing a new computer.",
    },
    answer: {
      da: "Opgradering af en gammel bærbar kan være relevant, hvis RAM eller lager er flaskehalsen, og delene kan skiftes. Afklar først symptomer, kompatibilitet og maskinens øvrige stand. En Windows-opdatering er en softwareændring; den giver ikke i sig selv mere fysisk hukommelse eller en større SSD.",
      en: "Upgrading an old laptop may help if memory or storage is the bottleneck and the parts can be replaced. First clarify symptoms, compatibility and the rest of the machine's condition. A Windows update is a software change; it does not by itself add physical memory or a larger SSD.",
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
    h1: {
      da: "Skærmskift på bærbar, tablet og telefon",
      en: "Laptop, tablet and phone screen replacement",
    },
    metaTitle: {
      da: "Skærmskift på bærbar, tablet og telefon: pris først | Kestro",
      en: "Screen replacement for laptops, tablets and phones | Kestro",
    },
    metaDescription: {
      da: "Revnet eller defekt skærm? Samme model fås med flere paneler, så vi finder det, der sidder i netop din maskine. Du får prisen, før vi går i gang.",
      en: "Cracked or faulty screen? One model ships with several panels, so we identify the panel in your machine, not just the model. A price before we start.",
    },
    summary: {
      da: "Revnet eller defekt skærm på bærbar, tablet eller telefon.",
      en: "Cracked or faulty screens on laptops, tablets and phones.",
    },
    answer: {
      da: "En revnet eller defekt skærm kan skiftes på de fleste bærbare, tablets og telefoner. Det afgørende er ikke maskinens model alene – den samme model er ofte solgt med flere forskellige paneler, så vi skal vide, hvilket panel der sidder i netop din.",
      en: "A cracked or faulty screen can be replaced on most laptops, tablets and phones. What decides it is not the model alone — the same model was often sold with several different panels, so we need to know which one is in yours.",
    },
    intro: {
      da: "En revne breder sig, og en skærm med en død stribe bliver ikke bedre af at vente. Derfor finder vi først ud af, præcis hvilket panel der skal i, og bestiller så det rigtige.",
      en: "A crack spreads, and a screen with a dead stripe does not improve by waiting. So we first establish exactly which panel goes in, and then order the right one.",
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
    h1: {
      da: "Tastaturskift på bærbar og nordisk layout",
      en: "Laptop keyboard swap and Nordic layout",
    },
    metaTitle: {
      da: "Tastaturskift og dansk tastatur på bærbar | Kestro",
      en: "Keyboard replacement and Danish or Norwegian layout | Kestro",
    },
    metaDescription: {
      da: "Defekt tastatur skiftes, og importerede bærbare kan få dansk eller norsk layout, så æ, ø og å er trykt på tasterne. For både virksomheder og private.",
      en: "Faulty keyboards replaced, and imported laptops can get a Danish or Norwegian layout with æ, ø and å printed on the keys. Individuals welcome.",
    },
    summary: {
      da: "Defekt tastatur skiftes, og importerede maskiner kan få dansk eller norsk layout med æ, ø og å.",
      en: "A faulty keyboard replaced, and imported machines can get a Danish or Norwegian layout with æ, ø and å.",
    },
    answer: {
      da: "Importerede maskiner kan få dansk eller norsk tastatur. Det er et fysisk skift, ikke en indstilling: man kan ændre layoutet i Windows, men så står der stadig det forkerte på tasterne, og det er æ, ø og å, man rammer forkert hele dagen.",
      en: "Imported machines can get a Danish or Norwegian keyboard. It is a physical swap, not a setting: you can change the layout in Windows, but the keys still say the wrong thing, and æ, ø and å are what you then mistype all day.",
    },
    intro: {
      da: "Brugt erhvervsudstyr kommer ofte ind med tysk eller amerikansk tastatur. Vi skifter hele det fysiske tastatur, så det, der står på tasterne, passer til layoutet i Windows.",
      en: "Used business equipment often arrives with a German or US keyboard. We replace the whole physical keyboard, so what is printed on the keys matches the layout in Windows.",
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
        en: "The model and which layout the machine has now.",
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
    h1: { da: "Reservedele og komponentskift til bærbar", en: "Laptop spare parts and components" },
    metaTitle: {
      da: "Reservedele til bærbar: blæser, hængsler, ladestik | Kestro",
      en: "Laptop spare parts: fans, hinges, charging ports | Kestro",
    },
    metaDescription: {
      da: "Reservedele til bærbar: blæser, hængsler, ladestik, højttalere og kabler – delene, der slides. Vi skifter dem, så en ellers god maskine ikke kasseres.",
      en: "Laptop spare parts: fans, hinges, charging ports, speakers and cables, the parts that wear. We fit them, so a good laptop is not scrapped over one.",
    },
    summary: {
      da: "Blæser, hængsler, ladestik, højttalere, kabler og andre slidte dele skiftes, så maskinen kan køre videre.",
      en: "Fans, hinges, charging ports, speakers, cables and other worn parts replaced so the machine keeps going.",
    },
    answer: {
      da: "Mange maskiner bliver kasseret på grund af én enkelt fejl: et hængsel, et ladestik, en blæser. Den slags dele kan skiftes, og EU's reparationsdirektiv forpligter producenter til ikke at spærre for brugte og kompatible reservedele.",
      en: "Many machines get scrapped over a single fault: a hinge, a charging port, a fan. Parts like that can be replaced, and the EU repair directive obliges manufacturers not to block the use of used and compatible spare parts.",
    },
    sources: ["repairDirective"] as const,
    intro: {
      da: "Et hængsel, der har revet sig løs. Et ladestik, der er slidt af fem år med samme kabel. Det er den slags, der afgør, om en maskine har tre år mere i sig eller ryger på lageret.",
      en: "A hinge that has torn loose. A charging port worn out by five years of the same cable. That is the kind of thing that decides whether a machine has three more years in it or goes on a shelf.",
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
    h1: { da: "Rens og køling af bærbar", en: "Laptop cleaning and cooling" },
    metaTitle: {
      da: "Varm og larmende bærbar? Rens og ny kølepasta | Kestro",
      en: "Hot, loud laptop? Cleaning and new thermal paste | Kestro",
    },
    metaDescription: {
      da: "Støv og tør kølepasta gør en computer varm, larmende og langsom, fordi den skruer ned for farten. Vi renser, skifter pasta og måler temperaturen.",
      en: "Dust and dried-out thermal paste make a computer hot, loud and slow, because it throttles itself. We clean it, re-paste it and check the temperature.",
    },
    summary: {
      da: "Støv og gammel kølepasta gør maskinen varm og larmende. En rens kan give ro og stabilitet tilbage.",
      en: "Dust and old thermal paste make a machine hot and loud. A clean can bring back quiet and stability.",
    },
    answer: {
      da: "En maskine, der er blevet varm og larmende, er som regel stoppet til med støv og har tør kølepasta. Den er ikke bare højlydt – den skruer også selv ned for farten for ikke at tage skade, og det bliver ofte forvekslet med, at maskinen er for gammel.",
      en: "A machine that has gone hot and loud is usually clogged with dust and has dried-out thermal paste. It is not just noisy — it also slows itself down to avoid damage, and that often gets mistaken for the machine being past it.",
    },
    intro: {
      da: "Det sker gradvist: Støvet samler sig i køleribberne, og kølepastaen tørrer ud med årene, så maskinen bliver lidt varmere og lidt langsommere måned for måned. Derfor opdager man det sjældent, før blæseren larmer hele tiden.",
      en: "It happens gradually: dust builds up in the cooling fins and the thermal paste dries out over the years, so the machine gets a little hotter and a little slower month by month. That is why it is rarely noticed until the fan is loud all the time.",
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
        en: "The model and whether it is loud all the time or only under load.",
      },
    ],
  },
  {
    slug: "windows-installation",
    mark: "install",
    name: { da: "Windows-installation", en: "Windows installation" },
    h1: { da: "Geninstallation af Windows", en: "Reinstalling Windows" },
    metaTitle: {
      da: "Geninstallation af Windows med de rigtige drivere | Kestro",
      en: "Clean Windows reinstall with the right drivers | Kestro",
    },
    metaDescription: {
      da: "Geninstallation af Windows fra bunden med de rigtige drivere, så en langsom computer starter rent igen. Hvad vi gør, og hvornår det kan betale sig.",
      en: "Reinstalling Windows from scratch with the right drivers, so a slow computer boots clean again. What we do, and when it is worth doing. Price first.",
    },
    summary: {
      da: "Ren installation af Windows med drivere og opdateringer, så maskinen starter op som en ny.",
      en: "A clean Windows install with drivers and updates, so the machine starts up like new.",
    },
    answer: {
      da: "En ren Windows-installation fjerner alt på maskinen og sætter styresystemet op fra bunden med de rigtige drivere. Det er den hurtigste måde at gøre en fem år gammel maskine brugbar igen. Fordi alt bliver fjernet, skal du sige på forhånd, hvilke data der skal med over.",
      en: "A clean Windows install wipes the machine and sets the operating system up from scratch with the right drivers. It is the quickest way to make a five-year-old machine usable again. Because everything is removed, tell us beforehand which data has to come across.",
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
        da: "Hvilken Windows-version og licens du kører på.",
        en: "Which Windows version and licence you are on.",
      },
    ],
  },
  {
    slug: "software-og-licenser",
    mark: "written",
    name: { da: "Software og licenser", en: "Software and licences" },
    h1: {
      da: "Software og licenser til firmacomputere",
      en: "Software and licences for company computers",
    },
    metaTitle: {
      da: "Software og licenser på nye firmacomputere | Kestro",
      en: "Software and licences on new company computers | Kestro",
    },
    metaDescription: {
      da: "Licenser og programmer til firmacomputere på plads, før maskinerne når medarbejderne: hvad vi sætter op, hvad der kan flyttes, og hvad I leverer.",
      en: "Software and licences for company computers, in place before they reach your staff: what we set up, what can be transferred, and what you supply.",
    },
    summary: {
      da: "Dine programmer installeret og licenserne på plads, så maskinen kører lovligt fra første dag.",
      en: "Your programs installed and the licences in place, so the machine runs legally from day one.",
    },
    answer: {
      da: "Licenser følger ikke automatisk med brugt hardware. De to ting købes hver for sig, så det er værd at afklare, hvilke licenser du allerede har, før maskinerne står på skrivebordene.",
      en: "Licences do not automatically come with used hardware. The two are bought separately, and it is worth settling which licences you already hold before the machines are on the desks.",
    },
    intro: {
      da: "Nogle licenser er knyttet til den enkelte maskine, andre til en bruger eller en konto. Hvilken slags du har, afgør, om licensen kan flyttes til en ny maskine – og det er det, vi ser på først.",
      en: "Some licences are tied to the machine, others to a user or an account. Which kind you have decides whether it can move to a new machine — and that is what we look at first.",
    },
    does: [
      {
        da: "Vi installerer de programmer, du bruger i forvejen.",
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
      { da: "Hvilke licenser du allerede har.", en: "Which licences you already hold." },
    ],
  },
  {
    slug: "ny-opsaetning-og-dataflytning",
    mark: "adjust",
    name: { da: "Ny opsætning og dataflytning", en: "Fresh setup and data migration" },
    h1: {
      da: "Opsætning af ny computer og flytning af data",
      en: "Setting up a new computer and moving your data",
    },
    metaTitle: {
      da: "Flyt data til ny computer – og få den sat op | Kestro",
      en: "Move data to a new computer — setup and transfer | Kestro",
    },
    metaDescription: {
      da: "Flyt data til ny computer: vi installerer styresystemet, flytter filer, profiler og programmer – og gennemgår listen med dig, før den gamle slettes.",
      en: "New computer? We install the system and move your files, profiles and software, then go through the list with you before the old one is wiped clean.",
    },
    summary: {
      da: "Styresystemet installeres på ny, og dine filer og programmer flyttes med over.",
      en: "A fresh installation of the operating system, with your files and software moved across.",
    },
    answer: {
      da: "Ved et maskinskift er det ikke maskinen, der tager tid – det er de to dage bagefter, hvor man opdager, hvad der ikke kom med over. Derfor gennemgår vi listen over filer, profiler og programmer før flytningen, og først derefter bliver den gamle maskine slettet.",
      en: "With a new machine it is not the machine that takes time — it is the two days afterwards spent finding what did not come across. So we go through the list of files, profiles and software before the move, and only then is the old machine wiped.",
    },
    sources: ["nistSanitization"] as const,
    intro: {
      da: "Det er sjældent dokumenterne, der bliver glemt. Det er browserens gemte adgangskoder, mailprofilen, genvejene på skrivebordet og det ene program, kun én person bruger. Dem sætter vi på listen fra starten.",
      en: "It is rarely the documents that get forgotten. It is the saved browser passwords, the mail profile, the desktop shortcuts and the one program only one person uses. We put those on the list from the start.",
    },
    does: [
      {
        da: "Vi sætter maskinen op og flytter filer, profiler og programmer med over.",
        en: "We set the machine up and move files, profiles and software across.",
      },
      {
        da: "Vi gennemgår listen med dig, før den gamle maskine bliver slettet.",
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
    h1: {
      da: "Fejlfinding: computeren starter ikke eller går ned",
      en: "Troubleshooting: the computer will not start or crashes",
    },
    tool: {
      href: "/vejledninger/langsom-computer",
      label: {
        da: "Er den bare langsom? Find selv det, der bremser",
        en: "Just slow? Find what is holding it back yourself",
      },
    },
    metaTitle: {
      da: "Computer starter ikke eller går ned? Fejlfinding | Kestro",
      en: "Computer won't start or keeps crashing? Diagnosis | Kestro",
    },
    metaDescription: {
      da: "Fejlfinding: starter computeren ikke, går den ned, eller opfører den sig underligt? Vi finder årsagen og siger, hvad det koster, før vi går i gang.",
      en: "Fault diagnosis: computer will not start, crashes or behaves oddly? We find the cause and tell you what the fix would cost before we start any work.",
    },
    summary: {
      da: "Starter den ikke, går den ned, eller opfører den sig underligt? Vi finder årsagen og siger, hvad det koster at rette.",
      en: "Will it not start, does it crash or behave oddly? We find the cause and tell you what it costs to fix.",
    },
    answer: {
      da: "Vi finder årsagen først og melder tilbage med, hvad en reparation vil koste, før vi retter noget. Det, vi leder efter, er et mønster: hvornår sker fejlen, og hvad kører der, når den sker.",
      en: "We find the cause first and report back with what a repair would cost before fixing anything. What we look for is a pattern: when does the fault happen, and what is running when it does.",
    },
    sources: ["dkWarranty"] as const,
    intro: {
      da: "En maskine, der går ned en gang om ugen, er sværere at finde fejlen på end en, der slet ikke starter. Jo mere du kan fortælle om, hvornår det sker, jo hurtigere finder vi årsagen.",
      en: "A machine that crashes once a week is harder to diagnose than one that will not start at all. The more you can tell us about when it happens, the sooner we find the cause.",
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
    h1: { da: "Få samlet en pc efter opgaven", en: "Get a PC built for the job" },
    metaTitle: {
      da: "Få samlet en pc efter opgaven – bygget og testet | Kestro",
      en: "Custom PC building and upgrades, load-tested | Kestro",
    },
    metaDescription: {
      da: "Få samlet en pc efter opgaven, ikke efter et datablad – fra bunden eller videre på din nuværende maskine. Samlet, installeret og belastningstestet.",
      en: "Get a PC built to the job rather than to a datasheet, from scratch or on top of the machine you already have. Assembled, installed and load-tested.",
    },
    summary: {
      da: "En maskine samlet efter dine ønsker – fra bunden eller ved at opgradere den, du har.",
      en: "A machine built to your wishes — from scratch or by upgrading the one you have.",
    },
    answer: {
      da: "Vi bygger efter opgaven, ikke efter et datablad. Delene vælges efter, hvad maskinen skal kunne – og efter, om der allerede står en maskine, der kan bygges videre på i stedet for at starte forfra.",
      en: "We build for the job, not to a spec sheet. What decides the parts is what the machine has to do — and whether there is already a machine to build on rather than start over.",
    },
    intro: {
      da: "En maskine, der skal kunne én bestemt ting rigtig godt, er sjældent den, der står på hylden. Fortæl os, hvad den skal bruges til, så foreslår vi delene – du behøver ikke kende dem på forhånd.",
      en: "A machine that has to do one particular thing well is rarely the one on the shelf. Tell us what it is for and we propose the parts — you do not need to know them in advance.",
    },
    does: [
      {
        da: "Vi sammensætter delene efter, hvad maskinen skal bruges til.",
        en: "We put the parts together around what the machine is for.",
      },
      {
        da: "Vi samler, installerer og belastningstester den, før den bliver leveret.",
        en: "We assemble, install and load-test it before it is delivered.",
      },
    ],
    needs: [
      {
        da: "Hvad maskinen skal kunne – ikke hvilke dele du tror, den skal have.",
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
    h1: {
      da: "Klargøring og tjek af brugt computer",
      en: "Preparing and checking a used computer",
    },
    metaTitle: {
      da: "Tjek af brugt computer: batteri, stand, klargøring | Kestro",
      en: "Used computer check-up: battery, condition, setup | Kestro",
    },
    metaDescription: {
      da: "Har du købt en brugt computer? Vi gennemgår den, oplyser batteriets faktiske kapacitet i procent, klargør den og siger til, hvis noget skal skiftes.",
      en: "Bought a used computer? We check it, state the battery's actual capacity in percent, prepare it and tell you if anything needs replacing. Price first.",
    },
    summary: {
      da: "Købt en brugt maskine? Vi tjekker den igennem og gør den klar til brug.",
      en: "Bought a used machine? We check it over and get it ready to use.",
    },
    answer: {
      da: "En brugt maskine er en ukendt størrelse, indtil nogen har set efter. Vi gennemgår den, oplyser batteriets faktiske kapacitet i procent, sætter den op og siger til, hvis noget er slidt nok til at skulle skiftes.",
      en: "A used machine is an unknown until somebody has looked. We go through it, give the battery's actual capacity as a percentage, set it up, and say so if anything is worn enough to need replacing.",
    },
    sources: ["dkWarranty"] as const,
    intro: {
      da: "Det, der er værd at vide, er, hvad der er slidt, og hvad der er skiftet – og det står sjældent i annoncen.",
      en: "What is worth knowing is what is worn and what has been replaced — and that is rarely in the listing.",
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
        en: "The machine and what it is going to be used for.",
      },
    ],
  },
];

/**
 * The four repairs each repair page links to, by topic.
 *
 * Mak rule 9: link between related pages, and spread the links so every page
 * that matters gets some. The page used to take the first four repairs in the
 * list, so batteriskift, RAM/SSD, skærmskift and tastaturskift had twelve
 * links each from the same card, and the other eight had one, from the hub.
 * Each repair now appears in three to six of these lists.
 */
export const relatedRepairs: Record<string, string[]> = {
  batteriskift: [
    "reservedele-og-komponentskift",
    "rens-og-koeling",
    "fejlfinding",
    "klargoering-af-brugt-udstyr",
  ],
  "ram-og-ssd-opgradering": [
    "windows-installation",
    "ny-opsaetning-og-dataflytning",
    "samling-af-pc",
    "fejlfinding",
  ],
  skaermskift: [
    "reservedele-og-komponentskift",
    "tastaturskift-og-nordisk-layout",
    "batteriskift",
    "fejlfinding",
  ],
  "tastaturskift-og-nordisk-layout": [
    "skaermskift",
    "reservedele-og-komponentskift",
    "klargoering-af-brugt-udstyr",
    "batteriskift",
  ],
  "reservedele-og-komponentskift": [
    "batteriskift",
    "skaermskift",
    "tastaturskift-og-nordisk-layout",
    "rens-og-koeling",
  ],
  "rens-og-koeling": [
    "fejlfinding",
    "reservedele-og-komponentskift",
    "ram-og-ssd-opgradering",
    "batteriskift",
  ],
  "windows-installation": [
    "software-og-licenser",
    "ny-opsaetning-og-dataflytning",
    "ram-og-ssd-opgradering",
    "fejlfinding",
  ],
  "software-og-licenser": [
    "windows-installation",
    "ny-opsaetning-og-dataflytning",
    "klargoering-af-brugt-udstyr",
    "samling-af-pc",
  ],
  "ny-opsaetning-og-dataflytning": [
    "windows-installation",
    "software-og-licenser",
    "samling-af-pc",
    "klargoering-af-brugt-udstyr",
  ],
  fejlfinding: ["rens-og-koeling", "windows-installation", "skaermskift", "ram-og-ssd-opgradering"],
  "samling-af-pc": [
    "ram-og-ssd-opgradering",
    "windows-installation",
    "software-og-licenser",
    "rens-og-koeling",
  ],
  "klargoering-af-brugt-udstyr": [
    "batteriskift",
    "tastaturskift-og-nordisk-layout",
    "windows-installation",
    "software-og-licenser",
  ],
};

export const getRepair = (slug: string) => repairs.find((r) => r.slug === slug);

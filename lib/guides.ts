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

/*
 * The taxonomy Viden is organised by.
 *
 * Held in data rather than in the URL. Step 3 made the same call for model
 * pages: a hierarchy expressed in a path costs a redirect the day an article
 * changes cluster, and buys nothing Google cannot already read from
 * breadcrumbs and internal links. It also means the section can one day move
 * to /viden by renaming one path segment, with the structure already built.
 *
 * Four working clusters, each with a commercial page waiting at the bottom,
 * plus an honest bucket for the one guide that belongs to none. Step 3 decided
 * samle-din-egen-pc was the wrong audience and should be kept but not built
 * on; filing it under a cluster it does not belong to would quietly reverse
 * that decision.
 */
export type Cluster =
  "memory-storage" | "lifecycle" | "workplace-hardware" | "buying-condition" | "uden-klynge";

/** What kind of question the article answers. Drives nothing but the label. */
export type ArticleType = "grundviden" | "beslutning" | "erhvervs-it" | "praktisk";

/**
 * How close the reader is to buying — and therefore how loud the page is
 * allowed to be about it. The template reads this; a designer never decides
 * CTA weight per article.
 */
export type Intent =
  "informational" | "informational-commercial" | "commercial-education" | "high-commercial";

export type ClusterMeta = {
  id: Cluster;
  /** Anchor on the hub. Part of a URL the moment anyone links to it. */
  anchor: string;
  name: Localized;
  description: Localized;
};

export const clusters: ClusterMeta[] = [
  {
    id: "lifecycle",
    anchor: "levetid-og-udskiftning",
    name: { da: "Levetid og udskiftning", en: "Lifecycle and replacement" },
    description: {
      da: "Hvornår en maskine har gjort sit, hvad supportdatoer betyder for en flåde, og hvordan man skifter uden at skifte alt.",
      en: "When a machine has done its job, what support dates mean for a fleet, and how to replace without replacing everything.",
    },
  },
  {
    id: "buying-condition",
    anchor: "koeb-stand-og-afhaendelse",
    name: { da: "Køb, stand og afhændelse", en: "Buying, condition and disposal" },
    description: {
      da: "Hvad man skal se efter, før man køber brugt — og hvad der skal ske med udstyret, når det skal videre.",
      en: "What to look for before buying used — and what has to happen to the equipment when it moves on.",
    },
  },
  {
    id: "memory-storage",
    anchor: "hukommelse-og-lagring",
    name: { da: "Hukommelse og lagring", en: "Memory and storage" },
    description: {
      da: "RAM og lagerplads: hvor meget der skal til, hvad der kan opgraderes, og hvornår det kan betale sig.",
      en: "Memory and storage: how much is needed, what can be upgraded, and when it is worth doing.",
    },
  },
  {
    id: "workplace-hardware",
    anchor: "arbejdspladsen",
    name: { da: "Arbejdspladsen", en: "The workplace" },
    description: {
      da: "Skærme, dockingstationer og alt det, der gør en maskine til en arbejdsplads.",
      en: "Monitors, docking stations and everything that turns a machine into a workplace.",
    },
  },
  {
    id: "uden-klynge",
    anchor: "oevrige",
    name: { da: "Øvrige vejledninger", en: "Other guides" },
    description: {
      da: "Står uden for klyngerne. De bliver stående, men der bygges ikke videre på dem.",
      en: "Outside the clusters. They stay, but nothing is built on top of them.",
    },
  },
];

export const getCluster = (id: Cluster): ClusterMeta =>
  clusters.find((cluster) => cluster.id === id) ?? clusters[clusters.length - 1];

export type GuideSection = {
  heading: Localized;
  body: Localized[];
  /** Optional list — used where steps or checks read better than prose. */
  list?: Localized[];
  /**
   * Optional comparison, rendered as a real <table>.
   *
   * Where two things differ along several axes, a table says it in a glance
   * and prose does not. It is semantic HTML rather than a styled grid on
   * purpose: a crawler, a screen reader and a language model all read a table
   * as a table, and the comparison is usually the part worth quoting.
   */
  table?: { caption: Localized; head: Localized[]; rows: Localized[][] };
};

export type Guide = {
  slug: string;
  /** Which cluster the article belongs to. Exactly one. */
  cluster: Cluster;
  type: ArticleType;
  intent: Intent;
  /**
   * The one search this article is written to own. Checked against every other
   * article and against docs/seo-keyword-map.csv — two pages may never claim
   * the same primary. Empty string means deliberately none, which is a
   * decision, not an omission.
   */
  primaryKeyword: string;
  /** Team member id from lib/company.ts. Never a name typed in here. */
  author: string;
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  summary: Localized;
  /** Who the guide is written for, so a reader can self-select on the hub. */
  audience: Localized;
  readingMinutes: number;
  /** ISO date. Shown, and used for the article schema. */
  updated: string;
  /**
   * The answer, before the reader scrolls. 40-60 words.
   *
   * Separate from `summary`, which is a teaser written for the hub. This one
   * has to be usable on its own: someone who reads this and leaves should have
   * got what they came for.
   */
  tldr: Localized;
  intro: Localized;
  sections: GuideSection[];
  /** What to do if you would rather not do it yourself. */
  closing: Localized;
  /**
   * The page that resolves what the guide raised.
   *
   * A guide that answers a question and then stops leaves the reader to find
   * the commercial page on their own — and leaves the commercial page without
   * the link. One or two, always to somewhere that already exists.
   */
  related: { href: string; label: Localized }[];
  /**
   * Questions the guide raises but does not answer in the body.
   *
   * Optional, and only where a reader genuinely has a question left — a guide
   * that ends with four invented questions is padding. Same shape as <Faq>
   * takes, and the page marks it up from this array, so what a reader sees and
   * what Google reads cannot drift apart.
   */
  faqs?: { question: Localized; answer: Localized }[];
  /**
   * Where a claim on the page can be checked.
   *
   * A guide that states dates and requirements and cites nobody asks to be
   * taken on trust. The href is localised because the authoritative page often
   * exists in Danish too, and a Danish reader should land on the Danish one.
   * Only real, reachable pages belong here — a dead citation is worse than
   * none.
   */
  sources?: { href: Localized; label: Localized }[];
};

export const guides: Guide[] = [
  /*
   * First in the array on purpose.
   *
   * The hub lists guides in this order, and every other guide's "flere
   * vejledninger" block takes the first three that are not itself — so
   * position one is the only position that earns this page inbound links from
   * across the section. Step 3, rule 1: no page under three inbound links.
   *
   * Every date and requirement below comes from Microsoft and can be changed
   * by Microsoft. That is why the page carries its edit date and says out loud
   * that the terms should be checked rather than trusted from a web page.
   */
  {
    slug: "windows-10-support-slutter",
    cluster: "lifecycle",
    type: "erhvervs-it",
    intent: "informational-commercial",
    primaryKeyword: "windows 10 support slut virksomhed",
    author: "alireza",
    title: {
      da: "Windows 10: supporten er slut – hvad gør I nu?",
      en: "Windows 10 support has ended — what now?",
    },
    metaTitle: {
      da: "Windows 10 support slut: hvad nu for virksomheden? | Kestro",
      en: "Windows 10 end of support: what it means | Kestro",
    },
    metaDescription: {
      da: "Supporten sluttede 14. oktober 2025. Hvad det betyder for jeres maskiner, hvordan I finder ud af, hvilke der kan opgraderes, og hvad I gør med resten.",
      en: "Support ended on 14 October 2025. What that means for your machines, how to work out which ones can be upgraded, and what to do with the rest.",
    },
    summary: {
      da: "Maskinerne holder ikke op med at virke – men sikkerhedsopdateringerne er stoppet. Sådan gør I op, hvad der skal ske med hvilke.",
      en: "The machines do not stop working — but the security updates have stopped. How to work out what happens to which.",
    },
    audience: {
      da: "Virksomheder med maskiner på Windows 10",
      en: "Companies with machines still on Windows 10",
    },
    readingMinutes: 7,
    updated: "2026-08-31",
    tldr: {
      da: "Supporten sluttede 14. oktober 2025. Maskinerne virker stadig, men de får ikke længere sikkerhedsopdateringer. Opgørelsen afgør resten: en del af flåden kan opgraderes til Windows 11, en del skal skiftes, og en del kan vente. Det er sjældent, at alle tre ikke er i spil på én gang.",
      en: "Support ended on 14 October 2025. The machines still run, but they no longer receive security updates. The inventory decides the rest: part of the fleet can be upgraded to Windows 11, part needs replacing, and part can wait. It is rare that all three are not in play at once.",
    },
    intro: {
      da: "Den 14. oktober 2025 stoppede Microsoft med at udsende sikkerhedsopdateringer til Windows 10. Der skete ikke noget synligt den dag, og det er præcis derfor, opgaven er let at udskyde. Denne vejledning handler ikke om, hvorvidt I skal gøre noget, men om hvordan I finder ud af hvad – uden at skifte maskiner, der ikke behøver at blive skiftet.",
      en: "On 14 October 2025 Microsoft stopped issuing security updates for Windows 10. Nothing visible happened that day, which is exactly why the job is easy to put off. This guide is not about whether you need to do something, but about working out what — without replacing machines that do not need replacing.",
    },
    sections: [
      {
        heading: {
          da: "Hvad der faktisk skete den 14. oktober 2025",
          en: "What actually happened on 14 October 2025",
        },
        body: [
          {
            da: "Microsoft holdt op med at udsende sikkerhedsopdateringer, kvalitetsopdateringer og teknisk support til Windows 10. Ingen maskine blev slukket, ingen licens holdt op med at virke, og ingen fil forsvandt. En Windows 10-maskine starter i dag præcis som den gjorde i oktober 2025.",
            en: "Microsoft stopped issuing security updates, quality updates and technical support for Windows 10. No machine was switched off, no licence stopped working, and no file disappeared. A Windows 10 machine boots today exactly as it did in October 2025.",
          },
          {
            da: "Det, der stoppede, er strømmen af rettelser til sårbarheder, der bliver fundet efter den dato. Forskellen viser sig ikke med det samme. Den viser sig, når der bliver fundet noget nyt, og rettelsen kommer til Windows 11 og ikke til jer.",
            en: "What stopped is the flow of fixes for vulnerabilities found after that date. The difference does not show up immediately. It shows up when something new is found, and the fix ships for Windows 11 and not for you.",
          },
          {
            da: "Datoer og vilkår herunder kommer fra Microsoft, og det er Microsoft, der kan ændre dem. Siden her bærer sin redigeringsdato øverst – brug den til at vurdere, hvor gammel informationen er, og slå det aktuelle op hos Microsoft, før I træffer en beslutning, der koster penge.",
            en: "The dates and terms below come from Microsoft, and Microsoft is who can change them. This page carries its edit date at the top — use it to judge how old the information is, and check Microsoft's current position before making a decision that costs money.",
          },
        ],
      },
      {
        heading: {
          da: "Support og hardwarekrav er to forskellige spørgsmål",
          en: "Support status and hardware eligibility are two different questions",
        },
        body: [
          {
            da: "De to bliver blandet sammen i næsten enhver samtale om det her, og det fører til forkerte beslutninger begge veje. Spørgsmålene er uafhængige.",
            en: "The two get mixed together in almost every conversation about this, and that leads to wrong decisions in both directions. The questions are independent.",
          },
          {
            da: "Det første handler om styresystemet: får Windows 10 stadig sikkerhedsopdateringer? Svaret er det samme for hver eneste maskine i verden, uanset hvor ny eller dyr den er. En maskine købt i går, der kører Windows 10, er lige så uden opdateringer som en fra 2017.",
            en: "The first is about the operating system: is Windows 10 still receiving security updates? The answer is the same for every machine in the world, however new or expensive. A machine bought yesterday running Windows 10 is exactly as unpatched as one from 2017.",
          },
          {
            da: "Det andet handler om den enkelte maskine: må den installere Windows 11? Her er svaret forskelligt fra maskine til maskine, og det afgøres af TPM 2.0, Secure Boot i UEFI-tilstand og om processoren står på Microsofts liste. Kravene og hvordan I tjekker dem står i vejledningen om Windows 11 på en ældre maskine.",
            en: "The second is about the individual machine: is it allowed to install Windows 11? Here the answer differs from machine to machine, decided by TPM 2.0, Secure Boot in UEFI mode, and whether the processor is on Microsoft's list. The requirements and how to check them are in our guide on Windows 11 on an older machine.",
          },
          {
            da: "Konsekvensen er værd at holde fast i: “vores maskiner er kun tre år gamle” svarer ikke på det første spørgsmål, og “Windows 10 er udløbet” svarer ikke på det andet. I skal have begge svar, før I ved, hvad opgaven koster.",
            en: "The consequence is worth holding on to: “our machines are only three years old” does not answer the first question, and “Windows 10 has expired” does not answer the second. You need both answers before you know what the job costs.",
          },
        ],
      },
      {
        heading: {
          da: "ESU: den betalte forlængelse",
          en: "ESU: the paid extension",
        },
        body: [
          {
            da: "Microsoft tilbyder Extended Security Updates til organisationer: sikkerhedsrettelser til Windows 10 mod betaling, købt et år ad gangen i et begrænset antal år efter slutdatoen. Det er rettelser og ikke andet – ingen nye funktioner og ingen almindelig teknisk support.",
            en: "Microsoft offers Extended Security Updates to organisations: paid security fixes for Windows 10, bought a year at a time for a limited number of years past the end date. It is fixes and nothing else — no new features and no general technical support.",
          },
          {
            da: "ESU er en bro, ikke en destination. Prisen stiger for hvert år, man forlænger, og slutdatoen rykker sig kun – den forsvinder ikke. Programmet er værd at bruge til at få en udskiftning til at ske i den rigtige rækkefølge frem for på én weekend; det er ikke værd at bruge som en måde at lade være med at beslutte sig.",
            en: "ESU is a bridge, not a destination. The price rises with each year you extend, and the end date only moves — it does not disappear. The programme is worth using to make a replacement happen in the right order rather than over one weekend; it is not worth using as a way of not deciding.",
          },
          {
            da: "Vi oplyser ikke priser eller nøjagtige vilkår her, fordi de ændrer sig, og fordi de afhænger af, hvilke aftaler I har i forvejen. Spørg jeres Microsoft-partner eller slå programmet op hos Microsoft.",
            en: "We do not quote prices or exact terms here, because they change and because they depend on the agreements you already have. Ask your Microsoft partner or look the programme up with Microsoft.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad I bør tjekke på de maskiner, I har",
          en: "What to check on the machines you already have",
        },
        body: [
          {
            da: "Opgørelsen er det eneste, der gør resten af beslutningen billig. Uden den bliver svaret enten “vi skifter det hele”, som koster for meget, eller “vi venter”, som ikke er en beslutning. Gå listen igennem én maskine ad gangen.",
            en: "The inventory is the one thing that makes the rest of the decision cheap. Without it the answer is either “we replace everything”, which costs too much, or “we wait”, which is not a decision. Go through the list one machine at a time.",
          },
        ],
        list: [
          {
            da: "Hvor mange maskiner kører reelt stadig Windows 10? Tallet er tit et andet end det, man husker.",
            en: "How many machines are actually still on Windows 10? The number is often not the one people remember.",
          },
          {
            da: "Opfylder maskinen Windows 11-kravene – TPM 2.0, Secure Boot i UEFI, processor på listen?",
            en: "Does the machine meet the Windows 11 requirements — TPM 2.0, Secure Boot in UEFI, processor on the list?",
          },
          {
            da: "Hvordan står maskinen fysisk? Batteri, lagerplads og hukommelse afgør, om den er værd at tage med videre, også når den godt må.",
            en: "What condition is the machine in? Battery, storage and memory decide whether it is worth taking forward, even when it is allowed to come.",
          },
          {
            da: "Hvad bruges den til? En maskine i receptionen og en maskine til konstruktion har ikke det samme svar.",
            en: "What is it used for? A reception machine and an engineering workstation do not have the same answer.",
          },
          {
            da: "Er den dækket af ESU i dag, og hvor længe? Det afgør, hvor meget tid I reelt har.",
            en: "Is it covered by ESU today, and for how long? That decides how much time you actually have.",
          },
          {
            da: "Behandler den personoplysninger? GDPR kræver passende tekniske foranstaltninger, og en maskine, der ikke længere modtager sikkerhedsopdateringer, er svær at argumentere for som passende. Tag den del med den, der har ansvaret for databeskyttelse hos jer – det er en vurdering, ikke en formalitet.",
            en: "Does it handle personal data? The GDPR requires appropriate technical measures, and a machine that no longer receives security updates is hard to argue is appropriate. Take that part to whoever is responsible for data protection with you — it is a judgement, not a formality.",
          },
          {
            da: "Er den på leasing eller stadig i garanti? Det ændrer, hvornår det giver mening at skifte den.",
            en: "Is it leased or still under warranty? That changes when replacing it makes sense.",
          },
        ],
      },
      {
        heading: {
          da: "Tre veje – og de fleste flåder skal bruge alle tre",
          en: "Three routes — and most fleets need all three",
        },
        body: [
          {
            da: "Opgrader. Opfylder maskinen kravene, og er den i øvrigt god nok til opgaven, er opgraderingen til Windows 11 den billigste vej. Microsoft har hidtil stillet opgraderingen til rådighed uden beregning for maskiner med en gyldig Windows 10-licens, der opfylder kravene – bekræft det aktuelle vilkår, før I planlægger ud fra det. For mange flåder er det her, størstedelen af maskinerne ender.",
            en: "Upgrade. If the machine meets the requirements and is otherwise good enough for the job, upgrading to Windows 11 is the cheapest route. Microsoft has so far made the upgrade available at no charge for machines with a valid Windows 10 licence that meet the requirements — confirm the current terms before planning around it. For many fleets this is where most machines end up.",
          },
          {
            da: "Udskift. Maskiner, der ikke opfylder kravene, og maskiner, der godt må, men er slidte, skal skiftes. Det betyder ikke nødvendigvis nyt: en brugt erhvervsmaskine, der opfylder kravene, gør det samme arbejde. Der er usædvanligt mange af dem på markedet netop nu, fordi andre virksomheder skiftede flåde af nøjagtig samme grund.",
            en: "Replace. Machines that do not meet the requirements, and machines that do but are worn out, need replacing. That does not have to mean new: a used business machine that meets the requirements does the same work. There are unusually many of them about right now, precisely because other companies changed fleets for exactly the same reason.",
          },
          {
            da: "Planlæg. Nogle maskiner kan vente: dem uden netværk, dem uden personoplysninger, dem der er bundet til software, som ikke kan flytte endnu. At vente er et fint valg, når det er truffet med en dato og en begrundelse. Det er et dårligt valg, når det bare er det, der sker.",
            en: "Plan. Some machines can wait: the ones off the network, the ones with no personal data, the ones tied to software that cannot move yet. Waiting is a fine choice when it is made with a date and a reason. It is a poor choice when it is simply what happens.",
          },
          {
            da: "Det er sjældent, at en hel flåde falder i én af de tre kasser. Blandingen er det normale – og det er også derfor, opgørelsen er pengene værd, før nogen beslutter noget.",
            en: "It is rare for a whole fleet to fall into one of the three boxes. A mixture is the normal outcome — and that is also why the inventory is worth the effort before anyone decides anything.",
          },
        ],
      },
      {
        heading: {
          da: "Rækkefølgen, der gør det til et projekt frem for en brand",
          en: "The order that makes this a project rather than a fire",
        },
        body: [
          {
            da: "Lav opgørelsen først, og sortér derefter maskinerne i de tre veje. Beslut så, hvad der skal ske med dem, der går ud – de har en værdi, og den værdi kan modregnes i det, der kommer ind. Læg til sidst en rækkefølge, så udskiftningen sker i hold og ikke på én gang: en flåde, der skiftes samlet, skal også skiftes samlet næste gang.",
            en: "Do the inventory first, then sort the machines into the three routes. Then decide what happens to the ones going out — they have a value, and that value can be offset against what comes in. Finally set an order so the replacement happens in batches rather than all at once: a fleet replaced in one go has to be replaced in one go next time as well.",
          },
          {
            da: "Hvis I standardiserer på én konfiguration, mens I alligevel er i gang, bliver den næste runde nemmere. Det er sjældent muligt for hele flåden, men det er næsten altid muligt for den største gruppe af medarbejdere.",
            en: "If you standardise on one configuration while you are at it, the next round gets easier. That is rarely possible for the whole fleet, but it is almost always possible for the largest group of employees.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal en hel flåde gøres op, kan vi gennemgå listen med jer og sige, hvilke maskiner der kan opgraderes, og hvilke der bedre kan betale sig at skifte. Skal der skiftes noget, skaffer vi brugte erhvervsmaskiner, der opfylder Windows 11-kravene, og vi kan give et bud på de gamle samtidig. Der er ingen binding i at spørge.",
      en: "If a whole fleet needs assessing, we can go through the list with you and say which machines can be upgraded and which are better replaced. If something does need replacing, we source used business machines that meet the Windows 11 requirements, and we can price the old ones at the same time. Asking commits you to nothing.",
    },
    related: [
      {
        href: "/vejledninger/windows-11-paa-aeldre-maskine",
        label: {
          da: "Kravene til Windows 11, og hvordan I tjekker dem",
          en: "The Windows 11 requirements, and how to check them",
        },
      },
      {
        href: "/produkter",
        label: { da: "Udstyr vi kan skaffe", en: "Equipment we can source" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på udskiftningen", en: "Get a quote for the replacement" },
      },
    ],
    sources: [
      {
        href: {
          da: "https://www.microsoft.com/da-dk/windows/end-of-support",
          en: "https://www.microsoft.com/en-us/windows/end-of-support",
        },
        label: {
          da: "Microsoft: Windows 10 og ophør af support",
          en: "Microsoft: Windows 10 end of support",
        },
      },
    ],
    faqs: [
      {
        question: {
          da: "Holder vores Windows 10-maskiner op med at virke?",
          en: "Will our Windows 10 machines stop working?",
        },
        answer: {
          da: "Nej. De starter, kører og logger på som før. Det, der er stoppet, er sikkerhedsopdateringerne – og den forskel mærkes ikke på en bestemt dag, men når der bliver fundet en ny sårbarhed, og rettelsen ikke længere kommer til jer.",
          en: "No. They boot, run and log in as before. What has stopped is the security updates — and that difference is not felt on a particular day, but when a new vulnerability is found and the fix no longer reaches you.",
        },
      },
      {
        question: {
          da: "Er opgraderingen til Windows 11 gratis?",
          en: "Is the upgrade to Windows 11 free?",
        },
        answer: {
          da: "Microsoft har hidtil stillet opgraderingen til rådighed uden beregning for maskiner med en gyldig Windows 10-licens, der opfylder hardwarekravene. Vilkårene kan ændres, og de er Microsofts – bekræft det aktuelle, før I lægger et budget på det.",
          en: "Microsoft has so far made the upgrade available at no charge for machines with a valid Windows 10 licence that meet the hardware requirements. The terms can change and they are Microsoft's — confirm the current position before building a budget on it.",
        },
      },
      {
        question: {
          da: "Kan vi bare blive på Windows 10?",
          en: "Can we simply stay on Windows 10?",
        },
        answer: {
          da: "Teknisk set ja. Om det er forsvarligt afhænger af, hvad maskinerne bruges til, om de er på netværket, og hvilke forpligtelser I har omkring de data, de behandler. ESU er den understøttede måde at købe sig tid på; at blive uden ESU er en risiko, nogen hos jer bør have taget stilling til frem for at arve.",
          en: "Technically yes. Whether it is defensible depends on what the machines are used for, whether they are on the network, and what obligations you have around the data they handle. ESU is the supported way to buy time; staying on without it is a risk somebody with you should have decided to accept rather than inherited.",
        },
      },
      {
        question: {
          da: "Hvor mange af vores maskiner skal skiftes?",
          en: "How many of our machines need replacing?",
        },
        answer: {
          da: "Det kan ikke besvares uden opgørelsen, og enhver, der svarer på det uden at have set listen, gætter. Det almindelige billede er en blanding: nogle kan opgraderes, nogle skal skiftes, og nogle kan vente.",
          en: "That cannot be answered without the inventory, and anyone who answers it without seeing the list is guessing. The usual picture is a mixture: some can be upgraded, some need replacing, and some can wait.",
        },
      },
      {
        question: {
          da: "Kan I hjælpe med at vurdere flåden?",
          en: "Can you help assess the fleet?",
        },
        answer: {
          da: "Ja. Send en liste over maskinerne – model og cirka alder er nok til at komme i gang – så gennemgår vi den med jer. Skal der skaffes noget, kan vi regne på det, og skal noget ud, kan vi byde på det samtidig.",
          en: "Yes. Send a list of the machines — model and rough age is enough to start — and we will go through it with you. If something needs sourcing we can price it, and if something is going out we can bid on it at the same time.",
        },
      },
    ],
  },
  {
    slug: "refurbished-eller-brugt",
    cluster: "buying-condition",
    type: "grundviden",
    intent: "informational-commercial",
    primaryKeyword: "refurbished vs brugt",
    author: "alireza",
    title: {
      da: "Refurbished eller brugt: hvad er forskellen?",
      en: "Refurbished or used: what is the difference?",
    },
    metaTitle: {
      da: "Refurbished vs brugt: hvad er forskellen? | Kestro",
      en: "Refurbished vs used: what is the difference? | Kestro",
    },
    metaDescription: {
      da: "Brugt beskriver maskinens historie. Refurbished beskriver et arbejde, nogen har udført på den. Hvorfor de ikke er ens – og hvad en virksomhed bør spørge om.",
      en: "Used describes the machine's history. Refurbished describes work somebody did to it. Why the two words are not the same — and what a company should ask about.",
    },
    summary: {
      da: "To ord, der bruges i flæng, og en forskel, der afgør hvad I får. Sådan finder I ud af, hvad der faktisk er lavet ved maskinen.",
      en: "Two words used interchangeably, and a difference that decides what you get. How to find out what was actually done to the machine.",
    },
    audience: {
      da: "Indkøbere og IT-ansvarlige",
      en: "Buyers and IT managers",
    },
    readingMinutes: 8,
    updated: "2026-08-31",
    tldr: {
      da: "Brugt beskriver maskinens historie: den har haft en ejer før. Refurbished beskriver et arbejde, nogen har udført på den bagefter – kontrol, rengøring, udskiftning af slidte dele, sletning af data. Forskellen er reel, men ordet er ikke en standard, nogen håndhæver. To sælgere kan bruge det om vidt forskellige processer, og derfor er spørgsmålet ikke om en maskine er refurbished, men hvad der konkret blev gjort ved den.",
      en: "Used describes the machine's history: it had an owner before. Refurbished describes work somebody did to it afterwards — checking, cleaning, replacing worn parts, erasing data. The difference is real, but the word is not a standard anyone enforces. Two sellers can use it for completely different processes, which is why the question is not whether a machine is refurbished, but what was actually done to it.",
    },
    intro: {
      da: "De to ord står side om side i næsten enhver annonce for brugt IT-udstyr, og de bliver brugt, som om de betyder det samme. Det gør de ikke – men forskellen ligger ikke i ordene. Den ligger i det arbejde, ordene påstår er udført, og det er dét, en indkøber skal have svar på.",
      en: "The two words sit side by side in almost every advert for used IT equipment, and they get used as though they mean the same thing. They do not — but the difference is not in the words. It is in the work the words claim was done, and that is what a buyer needs an answer to.",
    },
    sections: [
      {
        heading: { da: "Hvad de to ord dækker", en: "What the two words cover" },
        body: [
          {
            da: "Brugt er en oplysning om historie. Maskinen har haft en ejer, den har været tændt, og den er solgt videre. Ordet siger ingenting om, hvilken stand den er i, om nogen har set på den, eller om der stadig ligger data på disken. En brugt maskine kan være upåklagelig, og den kan være defekt – begge dele er dækket af det samme ord.",
            en: "Used is a statement about history. The machine has had an owner, it has been switched on, and it has been sold on. The word says nothing about what condition it is in, whether anyone has looked at it, or whether there is still data on the drive. A used machine can be immaculate or it can be broken — the same word covers both.",
          },
          {
            da: "Refurbished er en oplysning om arbejde. Nogen har haft maskinen igennem en proces, før den blev sat til salg. Hvad den proces indeholder, varierer: den kan være en visuel gennemgang og en formatering, og den kan være funktionstest, udskiftning af batteri og disk, dokumenteret datasletning og ny opsætning. Begge dele bliver solgt under samme ord.",
            en: "Refurbished is a statement about work. Somebody has taken the machine through a process before putting it up for sale. What that process contains varies: it can be a visual check and a format, and it can be functional testing, a new battery and drive, documented data erasure and a fresh setup. Both are sold under the same word.",
          },
          {
            da: "Det er derfor, de to ord ikke er hinandens modsætninger. Alt refurbished udstyr er brugt. Ikke alt brugt udstyr er refurbished. Og to maskiner, der begge kaldes refurbished, kan have været gennem vidt forskellige processer.",
            en: "That is why the two words are not opposites. All refurbished equipment is used. Not all used equipment is refurbished. And two machines both called refurbished can have been through completely different processes.",
          },
        ],
        table: {
          caption: {
            da: "Hvad ordene brugt og refurbished siger om en maskine",
            en: "What the words used and refurbished say about a machine",
          },
          head: [
            { da: "", en: "" },
            { da: "Brugt", en: "Used" },
            { da: "Refurbished", en: "Refurbished" },
          ],
          rows: [
            [
              { da: "Hvad ordet beskriver", en: "What the word describes" },
              { da: "Maskinens historie", en: "The machine's history" },
              { da: "Et arbejde udført på maskinen", en: "Work performed on the machine" },
            ],
            [
              { da: "Siger noget om stand", en: "Says something about condition" },
              { da: "Nej", en: "No" },
              {
                da: "Kun hvis sælgeren beskriver processen",
                en: "Only if the seller describes the process",
              },
            ],
            [
              { da: "Test før salg", en: "Testing before sale" },
              { da: "Ikke underforstået", en: "Not implied" },
              { da: "Underforstået, men ikke ensartet", en: "Implied, but not consistent" },
            ],
            [
              { da: "Datasletning", en: "Data erasure" },
              { da: "Ikke underforstået", en: "Not implied" },
              {
                da: "Varierer, og dokumentation er sjældnere end sletning",
                en: "Varies, and documentation is rarer than erasure",
              },
            ],
            [
              { da: "Slidte dele skiftet", en: "Worn parts replaced" },
              { da: "Nej", en: "No" },
              {
                da: "Nogle gange – batteri og disk oftest",
                en: "Sometimes — battery and drive most often",
              },
            ],
            [
              { da: "Ord med en fast betydning", en: "A word with a fixed meaning" },
              { da: "Ja, i praksis", en: "Yes, in practice" },
              { da: "Nej", en: "No" },
            ],
          ],
        },
      },
      {
        heading: {
          da: "Hvorfor forskellen ikke er garanteret",
          en: "Why the difference is not guaranteed",
        },
        body: [
          {
            da: "Refurbished er et markedsføringsord, ikke en mærkning nogen kontrollerer. Der findes ikke en instans, der godkender, hvornår en sælger må bruge det, og der findes ikke ét sæt trin, alle følger. En sælger, der bruger tre timer per maskine, og en sælger, der bruger tre minutter, kan skrive det samme i annoncen.",
            en: "Refurbished is a marketing word, not a label anyone polices. There is no body that approves when a seller may use it, and there is no single set of steps everyone follows. A seller who spends three hours per machine and a seller who spends three minutes can write the same thing in the advert.",
          },
          {
            da: "Det gør ikke ordet værdiløst. Det flytter bare, hvor man skal kigge: væk fra ordet og hen på beskrivelsen af, hvad der blev gjort. En sælger, der har lavet et reelt stykke arbejde, har som regel ikke noget imod at fortælle præcis hvilket – og en, der ikke har, svarer i almindeligheder.",
            en: "That does not make the word worthless. It just moves where you have to look: away from the word and onto the description of what was done. A seller who has done real work usually has no objection to saying exactly what — and one who has not answers in generalities.",
          },
          {
            da: "Der findes brancheordninger og standarder for dele af arbejdet, især for datasletning, hvor der findes anerkendte metodebeskrivelser. Om en konkret sælger følger dem, er noget man skal spørge om og få skriftligt. Vi henviser ikke til en bestemt standard her, fordi vi ikke kan bekræfte, hvilken en given leverandør arbejder efter.",
            en: "There are industry schemes and standards for parts of the work, particularly for data erasure, where recognised method descriptions exist. Whether a given seller follows them is something to ask about and get in writing. We do not point to a specific standard here, because we cannot confirm which one any given supplier works to.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad der kan variere fra sælger til sælger",
          en: "What varies from seller to seller",
        },
        body: [
          {
            da: "Når to tilbud på samme model ligger langt fra hinanden i pris, er forskellen sjældent maskinen. Den er som regel en eller flere af posterne herunder.",
            en: "When two quotes on the same model are far apart on price, the difference is rarely the machine. It is usually one or more of the items below.",
          },
        ],
        list: [
          {
            da: "Hvor grundigt der er testet: en visuel gennemgang, en opstartstest, eller en gennemgang af porte, tastatur, skærm, batteri og lagermedie hver for sig.",
            en: "How thoroughly it was tested: a visual check, a boot test, or a run through ports, keyboard, screen, battery and drive one at a time.",
          },
          {
            da: "Hvad der er skiftet: ingenting, kun det defekte, eller også det slidte – batteri og lagermedie er de to, der oftest afgør, hvor længe maskinen holder hos jer.",
            en: "What was replaced: nothing, only what was broken, or the worn parts too — battery and drive are the two that most often decide how long the machine lasts with you.",
          },
          {
            da: "Hvordan data er håndteret: en formatering, en installation ovenpå, eller en egentlig sletning af lagermediet. De tre er ikke det samme, og kun den sidste fjerner data.",
            en: "How data was handled: a format, an install on top, or an actual erasure of the drive. The three are not the same, and only the last removes data.",
          },
          {
            da: "Om der følger dokumentation med: en sletterapport, en liste over serienumre, en angivelse af batteriets målte tilstand. Dokumentation er det, der gør en påstand efterprøvelig.",
            en: "Whether documentation comes with it: an erasure report, a list of serial numbers, a statement of the battery's measured condition. Documentation is what makes a claim checkable.",
          },
          {
            da: "Hvordan stand er beskrevet: en bogstavskala, en fritekstbeskrivelse eller ingenting. Skalaerne er sælgerens egne og betyder ikke det samme to steder.",
            en: "How condition is described: a letter scale, a free-text description, or nothing. The scales are the seller's own and do not mean the same thing in two places.",
          },
          {
            da: "Hvilke vilkår der gælder bagefter: hvad der er aftalt om fejl, hvor længe, og hvad I skal gøre. Vores egne vilkår står på siden om stand og kvalitet.",
            en: "What terms apply afterwards: what has been agreed about faults, for how long, and what you have to do. Our own terms are on the condition and quality page.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad der ændrer sig, når I køber mange maskiner",
          en: "What changes when you buy many machines",
        },
        body: [
          {
            da: "For én maskine er forskellen mellem brugt og refurbished en risiko, I bærer selv, og som kan løses med en returnering. For fyrre maskiner er den en driftsopgave. Det er dér, ordet holder op med at være en detalje.",
            en: "For one machine, the difference between used and refurbished is a risk you carry yourself, and one a return can solve. For forty machines it is an operations problem. That is where the word stops being a detail.",
          },
          {
            da: "Et konkret eksempel: fyrre maskiner købt som brugte uden ensartet proces kan have fem forskellige batteritilstande, tre forskellige diskstørrelser og to Windows-versioner. Hver afvigelse er en support-sag, der lander hos jer i løbet af det første år. Fyrre maskiner gennem den samme proces har den samme opsætning, og afvigelserne er kendt på forhånd.",
            en: "A concrete example: forty machines bought as used with no consistent process can arrive with five different battery conditions, three different drive sizes and two Windows versions. Every deviation is a support case that lands with you during the first year. Forty machines through the same process have the same setup, and the deviations are known up front.",
          },
          {
            da: "Derfor er det spørgsmål, der betyder mest ved et større indkøb, ikke hvad den enkelte maskine fejler, men om alle maskiner har været gennem det samme. En liste over serienumre med den enkelte maskines tilstand er mere værd end en pæn beskrivelse af partiet som helhed.",
            en: "So the question that matters most on a larger purchase is not what is wrong with the individual machine, but whether all the machines went through the same thing. A list of serial numbers with each machine's condition is worth more than a nice description of the batch as a whole.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad en virksomhed bør spørge om",
          en: "What a company should ask about",
        },
        body: [
          {
            da: "Spørgsmålene herunder handler om sælgerens proces, ikke om den enkelte maskine – det sidste står i vejledningen om, hvad man skal tjekke på en brugt bærbar. Stil dem, før I beder om en pris, så svaret ikke bliver skrevet bagefter.",
            en: "The questions below are about the seller's process, not the individual machine — that is covered in the guide on what to check on a used laptop. Ask them before you ask for a price, so the answer is not written afterwards.",
          },
        ],
        list: [
          {
            da: "Hvad indeholder jeres proces konkret, trin for trin?",
            en: "What does your process contain, step by step?",
          },
          {
            da: "Hvad blev testet på denne maskine, og hvad var resultatet?",
            en: "What was tested on this machine, and what was the result?",
          },
          {
            da: "Hvordan er lagermediet håndteret, og får vi dokumentation for det?",
            en: "How was the drive handled, and do we get documentation for it?",
          },
          {
            da: "Er batteriets tilstand målt, og hvad står der?",
            en: "Has the battery's condition been measured, and what does it say?",
          },
          {
            da: "Hvad betyder jeres standsbetegnelse helt præcist?",
            en: "What exactly does your condition grading mean?",
          },
          {
            da: "Hvad er aftalt, hvis der viser sig en fejl, og hvor længe gælder det?",
            en: "What is agreed if a fault turns up, and for how long does it apply?",
          },
          {
            da: "Får vi den samme konfiguration på tværs af hele leverancen?",
            en: "Do we get the same configuration across the whole delivery?",
          },
          {
            da: "Kan vi få det skriftligt, før vi bestiller?",
            en: "Can we have that in writing before we order?",
          },
        ],
      },
      {
        heading: { da: "Sådan ser vi på det hos Kestro", en: "How we see it at Kestro" },
        body: [
          {
            da: "Vi bruger ordet refurbished, fordi det er det ord, markedet bruger, og fordi en indkøber leder efter det. Men vi går ikke ud fra, at ordet i sig selv fortæller jer noget. Vi holder ikke lager: vi skaffer maskinerne per ordre i vores leverandørnetværk, og det betyder, at vi kender det konkrete parti frem for at beskrive en generel proces.",
            en: "We use the word refurbished because it is the word the market uses, and because a buyer looks for it. But we do not assume the word tells you anything by itself. We hold no stock: we source per order through our supplier network, which means we know the actual batch rather than describing a general process.",
          },
          {
            da: "I praksis betyder det, at tilbuddet står på enhedsniveau frem for som ét tal: model, hukommelse, lagring, skærm, kosmetisk stand, batteri, tastaturlayout og styresystem. Eksempelsiden viser, hvordan det ser ud udfyldt. Vi tester og klargør maskinerne, før de sendes, og vi skifter tastaturlayout på maskiner, der kommer fra udlandet.",
            en: "In practice that means the quote is written per unit rather than as a single number: model, memory, storage, screen, cosmetic condition, battery, keyboard layout and operating system. The example page shows what that looks like filled in. We test and prepare the machines before they are sent, and we change the keyboard layout on machines that come from abroad.",
          },
          {
            da: "Og lige så vigtigt: vi lover ikke en fast proces på tværs af alt, hvad der findes i markedet. Hvad der kan skaffes til en given specifikation og et givent antal, afhænger af, hvad der er tilgængeligt, når I spørger. Kan vi ikke fylde specifikationen, siger vi det og foreslår det nærmeste alternativ. Det er en dårligere overskrift end et løfte – og det er det, der gør, at tallene i tilbuddet holder.",
            en: "And just as importantly: we do not promise a fixed process across everything in the market. What can be sourced at a given specification and quantity depends on what is available when you ask. If we cannot meet the specification, we say so and propose the closest alternative. That is a worse headline than a promise — and it is what makes the numbers in the quote hold.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal I bruge udstyr og vil hellere have svarene end ordene, så send os specifikationen og antallet. I får et tilbud på enhedsniveau, hvor stand og opsætning står skriftligt, før I bestiller. Der er ingen binding i at spørge.",
      en: "If you need equipment and would rather have the answers than the words, send us the specification and the quantity. You get a quote written per unit, with condition and setup in writing before you order. Asking commits you to nothing.",
    },
    related: [
      {
        href: "/kvalitet",
        label: { da: "Vores standard, stand og vilkår", en: "Our standard, condition and terms" },
      },
      {
        href: "/produkter",
        label: { da: "Udstyr vi kan skaffe", en: "Equipment we can source" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på enhedsniveau", en: "Get a quote written per unit" },
      },
    ],
    faqs: [
      {
        question: { da: "Hvad betyder refurbished?", en: "What does refurbished mean?" },
        answer: {
          da: "At nogen har haft maskinen gennem en proces, før den blev sat til salg – typisk kontrol, rengøring, sletning af data og udskiftning af det, der var slidt eller defekt. Ordet siger ikke i sig selv, hvad processen indeholdt, fordi der ikke findes én fælles definition.",
          en: "That somebody put the machine through a process before it went up for sale — typically checking, cleaning, erasing data and replacing what was worn or broken. The word does not by itself say what the process contained, because there is no single shared definition.",
        },
      },
      {
        question: { da: "Hvad betyder brugt?", en: "What does used mean?" },
        answer: {
          da: "At maskinen har haft en ejer før og er solgt videre. Det er en oplysning om historie, ikke om stand: en brugt maskine kan være i fin stand eller defekt, og ordet skelner ikke.",
          en: "That the machine had an owner before and has been sold on. It is a statement about history, not condition: a used machine can be in fine shape or broken, and the word does not distinguish.",
        },
      },
      {
        question: {
          da: "Er refurbished bedre end brugt?",
          en: "Is refurbished better than used?",
        },
        answer: {
          da: "Som regel, men ikke automatisk. Refurbished betyder, at der er lavet et arbejde – ikke hvor meget. En brugt maskine fra en sælger, der beskriver den præcist, kan være et bedre køb end en refurbished maskine fra en, der ikke vil sige, hvad der blev gjort.",
          en: "Usually, but not automatically. Refurbished means work was done — not how much. A used machine from a seller who describes it precisely can be a better buy than a refurbished one from a seller who will not say what was done.",
        },
      },
      {
        question: {
          da: "Hvad bør en virksomhed kontrollere?",
          en: "What should a company check?",
        },
        answer: {
          da: "Sælgerens proces frem for annoncens ord: hvad der blev testet, hvad der blev skiftet, hvordan lagermediet er håndteret, om der følger dokumentation med, hvad standsbetegnelsen betyder, hvilke vilkår der gælder ved fejl, og om hele leverancen har den samme opsætning.",
          en: "The seller's process rather than the advert's wording: what was tested, what was replaced, how the drive was handled, whether documentation comes with it, what the condition grading means, what terms apply if there is a fault, and whether the whole delivery has the same setup.",
        },
      },
      {
        question: {
          da: "Er alt refurbished udstyr testet?",
          en: "Is all refurbished equipment tested?",
        },
        answer: {
          da: "Nej. Det er den mest almindelige misforståelse. Ordet er ikke reguleret, så omfanget af test afhænger helt af sælgeren – og det er derfor, spørgsmålet skal stilles konkret frem for at blive taget for givet.",
          en: "No. That is the most common misunderstanding. The word is not regulated, so how much testing happens depends entirely on the seller — which is why the question has to be asked specifically rather than assumed.",
        },
      },
    ],
  },
  {
    slug: "reparere-eller-koebe-ny",
    cluster: "lifecycle",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "reparere eller købe ny computer",
    author: "alireza",
    title: {
      da: "Reparere eller købe ny? Sådan regner du på det",
      en: "Repair or replace? How to work it out",
    },
    metaTitle: {
      da: "Reparere eller købe ny computer? Sådan regner du | Kestro",
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
    tldr: {
      da: "Regn på det i stedet for at gætte. Er reparationen under en tredjedel af, hvad en tilsvarende brugt maskine koster, og har maskinen mere end et par år tilbage i sig, er reparation som regel det billigste. Er den det ikke, køber man tid, ikke en løsning.",
      en: "Do the arithmetic instead of guessing. If the repair costs less than a third of an equivalent used machine and the machine has more than a couple of years left in it, repairing is usually cheapest. If it does not, you are buying time rather than a solution.",
    },
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
    related: [
      {
        href: "/reparation",
        label: { da: "Reparation og opgradering", en: "Repairs and upgrades" },
      },
      { href: "/priser", label: { da: "Hvad afgør prisen", en: "What decides the price" } },
    ],
    faqs: [
      {
        question: {
          da: "Hvornår kan det ikke betale sig at reparere en computer?",
          en: "When is a computer not worth repairing?",
        },
        answer: {
          da: "Slå op, hvad den samme model koster brugt i dag – det tal er loftet. Koster reparationen mere end halvdelen af det, skal du tænke dig om. Koster den mere end maskinen er værd, er svaret nej.",
          en: "Look up what the same model costs used today — that figure is the ceiling. If the repair costs more than half of it, think twice. If it costs more than the machine is worth, the answer is no.",
        },
      },
      {
        question: {
          da: "Hvorfor føles min gamle computer langsom?",
          en: "Why does my old computer feel slow?",
        },
        answer: {
          da: "Fire ting står bag langt de fleste henvendelser: et batteri der ikke holder en arbejdsdag, for lidt hukommelse, en gammeldags harddisk i stedet for SSD, og støv og gammel kølepasta, der får maskinen til at skrue ydelsen ned. Alle fire er billige at rette i forhold til en ny maskine.",
          en: "Four things are behind the large majority of enquiries: a battery that no longer lasts a working day, too little memory, an old hard disk instead of an SSD, and dust and old thermal paste making the machine throttle itself. All four are cheap to fix compared with a new machine.",
        },
      },
      {
        question: {
          da: "Hvilke reparationer er de dyre?",
          en: "Which repairs are the expensive ones?",
        },
        answer: {
          da: "Bundkort, hængsler der har revet kabinettet i stykker, og væskeskader. På en ældre maskine overstiger de næsten altid maskinens værdi. Skærme ligger midt imellem – prisen svinger meget efter model, så få den oplyst, før du beslutter.",
          en: "Motherboards, hinges that have torn the chassis apart, and liquid damage. On an older machine they almost always exceed what the machine is worth. Screens sit in between — the price varies a lot by model, so get it quoted before you decide.",
        },
      },
      {
        question: {
          da: "Skal tiden til opsætning regnes med?",
          en: "Should the setup time be counted?",
        },
        answer: {
          da: "Ja. En ny maskine skal sættes op, programmer installeres og filer flyttes. For en virksomhed er det ofte en halv arbejdsdag per medarbejder, og den udgift forsvinder, hvis den gamle maskine bare kører videre.",
          en: "Yes. A new machine has to be set up, software installed and files moved. For a company that is often half a working day per employee, and the cost disappears if the old machine simply keeps running.",
        },
      },
    ],
  },
  {
    slug: "opgrader-ram-i-baerbar",
    cluster: "memory-storage",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "opgradere ram i bærbar",
    author: "alireza",
    title: {
      da: "Sådan opgraderer du hukommelsen i en bærbar",
      en: "How to upgrade the memory in a laptop",
    },
    metaTitle: {
      da: "Sådan opgraderer du RAM i en bærbar computer | Kestro",
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
    tldr: {
      da: "De fleste erhvervsbærbare kan skiftes RAM på med en skruetrækker og ti minutter. Det, der afgør det, er ikke evnen, men typen: SO-DIMM eller loddet fast, DDR3, DDR4 eller DDR5, og hvor meget kortet overhovedet understøtter. Tjek de tre først.",
      en: "Most business laptops take a memory change with a screwdriver and ten minutes. What decides it is not skill but type: SO-DIMM or soldered down, DDR3, DDR4 or DDR5, and how much the board supports at all. Check those three first.",
    },
    intro: {
      da: "Mere hukommelse er som regel den billigste vej til en mærkbart hurtigere maskine. Men det virker kun, hvis maskinen kan udvides, og hvis du køber den rigtige type. Her er rækkefølgen.",
      en: "More memory is usually the cheapest route to a noticeably faster machine. But it only works if the machine can be expanded, and if you buy the right type. Here is the order to do it in.",
    },
    sections: [
      {
        heading: {
          da: "Tjek først, om det kan lade sig gøre",
          en: "First check whether it is possible",
        },
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
    related: [
      {
        href: "/reparation",
        label: { da: "Få os til at opgradere den", en: "Have us do the upgrade" },
      },
      {
        href: "/modeller",
        label: { da: "Modeller, der er nemme at opgradere", en: "Models that are easy to upgrade" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Kan man opgradere hukommelsen i alle bærbare?",
          en: "Can the memory be upgraded in every laptop?",
        },
        answer: {
          da: "Nej. Mange tynde maskiner har hukommelsen loddet fast på bundkortet, og så kan den ikke skiftes – uanset hvad. Slå din præcise model op hos producenten eller i servicemanualen, før du køber noget.",
          en: "No. Many thin machines have the memory soldered to the motherboard, and then it cannot be changed at all. Look your exact model up with the manufacturer or in the service manual before you buy anything.",
        },
      },
      {
        question: {
          da: "Hvilken slags RAM skal jeg købe?",
          en: "Which kind of RAM should I buy?",
        },
        answer: {
          da: "Generationen skal passe – DDR3, DDR4 eller DDR5 passer ikke i hinandens sokler, og der findes ingen adapter. Formfaktoren skal passe: bærbare bruger SO-DIMM, stationære de lange DIMM-moduler. Et hurtigere modul kører ned til maskinens hastighed – det virker, men du betaler for noget, du ikke får.",
          en: "The generation has to match — DDR3, DDR4 and DDR5 do not fit each other's sockets, and there is no adapter. The form factor has to match: laptops use SO-DIMM, desktops the long DIMM modules. A faster module runs down to the machine's speed — it works, but you pay for something you do not get.",
        },
      },
      {
        question: {
          da: "Er to moduler bedre end ét stort?",
          en: "Are two modules better than one large one?",
        },
        answer: {
          da: "Hvis der er to sokler, ja. To ens moduler giver dobbelt båndbredde, og det kan mærkes på grafikken i maskiner uden grafikkort.",
          en: "If there are two sockets, yes. Two matching modules give double the bandwidth, and that is noticeable on graphics in machines without a graphics card.",
        },
      },
      {
        question: {
          da: "Maskinen ser kun halvdelen af hukommelsen – hvad er galt?",
          en: "The machine only sees half the memory — what is wrong?",
        },
        answer: {
          da: "Så sidder det ene modul ikke ordentligt. Tag det ud og sæt det i igen. Du kan se, hvor meget maskinen faktisk ser, under Indstillinger, System, Om i Windows.",
          en: "One of the modules is not seated properly. Take it out and put it back in. You can see how much the machine actually sees under Settings, System, About in Windows.",
        },
      },
    ],
  },
  {
    slug: "tjek-brugt-baerbar-foer-koeb",
    cluster: "buying-condition",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "hvad skal man tjekke på en brugt bærbar",
    author: "alireza",
    title: {
      da: "Ti ting du skal tjekke på en brugt bærbar, før du køber",
      en: "Ten things to check on a used laptop before you buy",
    },
    metaTitle: {
      da: "Ti ting du skal tjekke på en brugt bærbar | Kestro",
      en: "Buying a used laptop? Ten things to check first | Kestro",
    },
    metaDescription: {
      da: "Batteri, hængsler, porte, skærm og tastatur: tjeklisten, der afslører, om en brugt bærbar holder til et par år mere hos jer.",
      en: "Battery, screen, keyboard, ports and disk — a check you can do in ten minutes before paying for a used computer.",
    },
    summary: {
      da: "En gennemgang på ti minutter, der afslører det, sælgeren ikke skrev i annoncen.",
      en: "A ten-minute check that reveals what the seller left out of the listing.",
    },
    audience: { da: "Alle der køber brugt", en: "Anyone buying second-hand" },
    readingMinutes: 5,
    updated: "2026-08-23",
    tldr: {
      da: "Kosmetisk stand er det, man ser først, og det, der betyder mindst. Det, der afgør købet, er batteriets faktiske tilstand, om lagermediet har været brugt hårdt, om alle porte virker, og om maskinen kan komme med over på et understøttet styresystem.",
      en: "Cosmetic condition is what you see first and what matters least. What decides the purchase is the real state of the battery, whether the drive has had a hard life, whether every port works, and whether the machine can come along to a supported operating system.",
    },
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
    related: [
      {
        href: "/kvalitet",
        label: {
          da: "Sådan vurderer vi stand og kvalitet",
          en: "How we assess condition and quality",
        },
      },
      {
        href: "/produkter/baerbare-computere",
        label: { da: "Brugte bærbare computere", en: "Used business laptops" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Hvordan tjekker jeg batteriets tilstand på en brugt bærbar?",
          en: "How do I check the battery condition on a used laptop?",
        },
        answer: {
          da: "Åbn Kommandoprompt i Windows og skriv powercfg /batteryreport. Rapporten viser den oprindelige kapacitet over for den nuværende. Under 70 procent betyder, at et nyt batteri er på vej.",
          en: "Open the Command Prompt in Windows and type powercfg /batteryreport. The report shows the original capacity against the current one. Under 70 per cent means a new battery is on the way.",
        },
      },
      {
        question: {
          da: "Hvad skal jeg tjekke, før jeg køber en brugt bærbar?",
          en: "What should I check before buying a used laptop?",
        },
        answer: {
          da: "Batteriets tilstand, skærmen på både hvid og sort baggrund, hver eneste tast, alle porte med noget i dem, diskens SMART-data, blæseren under belastning, kamera og mikrofon og højttalere, hængslerne, BIOS-adgangskode og enhedslåse, at Windows er aktiveret, og om strømforsyningen følger med. Hvert punkt tager under et minut.",
          en: "The battery condition, the screen on both a white and a black background, every single key, all the ports with something in them, the drive's SMART data, the fan under load, camera and microphone and speakers, the hinges, BIOS password and device locks, that Windows is activated, and whether the power supply is included. Each point takes under a minute.",
        },
      },
      {
        question: {
          da: "Hvad betyder grad A eller grad B?",
          en: "What do grade A and grade B mean?",
        },
        answer: {
          da: "Ikke noget fast. Der findes ingen fælles standard for, hvad bogstaverne betyder, og to sælgere kan kalde den samme maskine hver sit. Bed om standen beskrevet i ord.",
          en: "Nothing fixed. There is no common standard for what the letters mean, and two sellers can call the same machine different things. Ask for the condition described in words.",
        },
      },
      {
        question: {
          da: "Hvorfor er BIOS-adgangskoden vigtig på en brugt maskine?",
          en: "Why does the BIOS password matter on a used machine?",
        },
        answer: {
          da: "Fordi en maskine, der stadig er låst af en tidligere ejer, ikke altid kan låses op – heller ikke af os. Genstart og gå ind i BIOS, før du køber.",
          en: "Because a machine still locked by a previous owner cannot always be unlocked — not even by us. Restart and go into the BIOS before you buy.",
        },
      },
    ],
  },
  {
    slug: "samle-din-egen-pc",
    cluster: "uden-klynge",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "",
    author: "alireza",
    title: { da: "Sådan samler du din egen pc", en: "How to build your own PC" },
    metaTitle: {
      da: "Samle sin egen pc: rækkefølge, dele og fejl | Kestro",
      en: "Building your own PC: order, parts and mistakes | Kestro",
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
    tldr: {
      da: "Rækkefølgen gør arbejdet nemt: bundkort, CPU, køler og RAM samles uden for kabinettet, og først derefter skrues det hele i. De fejl, der koster tid, er næsten altid strøm, der ikke er sat i, eller RAM, der ikke sidder helt fast.",
      en: "The order makes the work easy: motherboard, CPU, cooler and memory go together outside the case, and only then does the whole thing get screwed in. The mistakes that cost time are almost always power that is not plugged in, or memory that is not fully seated.",
    },
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
    related: [
      {
        href: "/produkter/stationaere-computere",
        label: { da: "Brugte stationære computere", en: "Used desktop computers" },
      },
    ],
    faqs: [
      {
        question: {
          da: "I hvilken rækkefølge skal delene vælges?",
          en: "In what order should the parts be chosen?",
        },
        answer: {
          da: "Processoren bestemmer soklen, og bundkortet skal have præcis den sokkel. Bundkortet bestemmer hukommelsens generation og antallet af moduler. Kabinettet bestemmer, hvor langt et grafikkort og hvor høj en køler der kan være. Strømforsyningen skal kunne klare grafikkortet med luft over. Vælg i den rækkefølge, så låser hvert valg det næste.",
          en: "The processor decides the socket, and the motherboard has to have exactly that socket. The motherboard decides the memory generation and how many modules fit. The case decides how long a graphics card and how tall a cooler can be. The power supply has to handle the graphics card with headroom. Choose in that order and each choice locks the next.",
        },
      },
      {
        question: {
          da: "Skal bundkortet samles i kabinettet?",
          en: "Should the motherboard be assembled in the case?",
        },
        answer: {
          da: "Nej. Sæt processor, hukommelse og M.2-disk i bundkortet, mens det ligger på bordet. Der er langt bedre plads dér end nede i kabinettet, og det er den fejl, folk oftest fortryder.",
          en: "No. Fit the processor, memory and M.2 drive to the motherboard while it is lying on the table. There is far more room there than down in the case, and it is the mistake people most often regret.",
        },
      },
      {
        question: {
          da: "Pc'en vil ikke starte første gang – hvad er det typisk?",
          en: "The PC will not start the first time — what is it usually?",
        },
        answer: {
          da: "Fire ting står bag næsten alle. Det ekstra 8-benede strømstik til processoren er ikke sat i, og så er maskinen helt død. Hukommelsen sidder i de forkerte sokler. Skærmen er sat i bundkortets udgang i stedet for grafikkortets, og så er billedet sort, selvom alt virker. Eller afstandsboltene mellem kabinet og bundkort mangler og kortslutter bundkortet mod pladen.",
          en: "Four things are behind nearly all of them. The extra 8-pin processor power connector is not plugged in, and the machine is completely dead. The memory is in the wrong sockets. The monitor is plugged into the motherboard's output instead of the graphics card's, so the picture is black although everything works. Or the standoffs between case and motherboard are missing and short the board against the plate.",
        },
      },
      {
        question: {
          da: "Hvad skal man gøre, første gang maskinen starter?",
          en: "What should be done the first time the machine starts?",
        },
        answer: {
          da: "Gå i BIOS først. Tjek at processoren, hele hukommelsen og disken er der, og slå XMP eller EXPO til, så hukommelsen kører den hastighed, du betalte for. Derefter installerer du Windows fra en USB-nøgle.",
          en: "Go into the BIOS first. Check that the processor, all the memory and the drive are there, and turn on XMP or EXPO so the memory runs at the speed you paid for. Then install Windows from a USB stick.",
        },
      },
    ],
  },
  {
    slug: "windows-11-paa-aeldre-maskine",
    cluster: "lifecycle",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "windows 11 krav gammel computer",
    author: "alireza",
    title: {
      da: "Windows 11 på en ældre maskine: hvad kræver det?",
      en: "Windows 11 on an older machine: what does it take?",
    },
    metaTitle: {
      da: "Windows 11 på en ældre maskine: hvad kræver det? | Kestro",
      en: "Windows 11 on an older computer — requirements | Kestro",
    },
    metaDescription: {
      da: "TPM 2.0, Secure Boot og processorkrav forklaret – og hvad I stiller op med de maskiner i flåden, der ikke kommer med over.",
      en: "TPM, Secure Boot and processor requirements explained, and what to do if your machine is not on the list.",
    },
    summary: {
      da: "Hvorfor en fungerende maskine pludselig ikke må opdatere – og hvad mulighederne så er.",
      en: "Why a working machine is suddenly not allowed to update — and what the options are.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 4,
    updated: "2026-08-23",
    tldr: {
      da: "Tre ting afgør det: TPM 2.0, Secure Boot i UEFI-tilstand, og om processoren står på Microsofts liste. De to første er ofte kun en indstilling i BIOS. Den tredje kan ikke omgås — og det er dér, en maskine, der kører helt fint, alligevel må skiftes.",
      en: "Three things decide it: TPM 2.0, Secure Boot in UEFI mode, and whether the processor is on Microsoft's list. The first two are often just a BIOS setting. The third cannot be worked around — and that is where a machine running perfectly well still has to be replaced.",
    },
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
    related: [
      {
        href: "/produkter/baerbare-computere",
        label: { da: "Maskiner, der kommer med over", en: "Machines that make the jump" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på udskiftningen", en: "Get a quote for the replacement" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Hvad kræver Windows 11 af maskinen?",
          en: "What does Windows 11 require of the machine?",
        },
        answer: {
          da: "TPM 2.0, Secure Boot slået til, og at maskinen starter i UEFI-tilstand frem for den gamle Legacy-tilstand. Derudover skal processoren stå på Microsofts liste, og det er den grænse, der rammer hårdest – den kan ikke omgås ved at ændre en indstilling.",
          en: "TPM 2.0, Secure Boot switched on, and the machine booting in UEFI mode rather than the old legacy mode. On top of that the processor has to be on Microsoft's list, and that is the limit that bites hardest — it cannot be got round by changing a setting.",
        },
      },
      {
        question: {
          da: "Hvordan tjekker jeg, om min maskine opfylder kravene?",
          en: "How do I check whether my machine meets the requirements?",
        },
        answer: {
          da: "Tryk Windows-tasten og R, skriv tpm.msc og tryk enter – vinduet fortæller, om der er en TPM, og hvilken version. Skriv msinfo32 samme sted: der står både BIOS-tilstand, som skal være UEFI, og Secure Boot-tilstand.",
          en: "Press the Windows key and R, type tpm.msc and press enter — the window says whether there is a TPM and which version. Type msinfo32 in the same place: it shows both the BIOS mode, which has to be UEFI, and the Secure Boot state.",
        },
      },
      {
        question: {
          da: "TPM står som slået fra – kan det laves om?",
          en: "TPM shows as switched off — can that be changed?",
        },
        answer: {
          da: "Ofte ja. Det er tit bare en indstilling i BIOS, og den hedder typisk PTT på Intel og fTPM på AMD.",
          en: "Often yes. It is frequently just a setting in the BIOS, usually called PTT on Intel and fTPM on AMD.",
        },
      },
      {
        question: {
          da: "Kan man omgå kravene til Windows 11?",
          en: "Can the Windows 11 requirements be bypassed?",
        },
        answer: {
          da: "Der findes vejledninger til det, men vi anbefaler det ikke på en maskine, der skal bruges i en virksomhed. Microsoft giver ingen garanti for opdateringer bagefter, og en maskine uden sikkerhedsopdateringer er et problem i sig selv.",
          en: "Guides to doing it exist, but we do not recommend it on a machine that will be used in a company. Microsoft gives no guarantee of updates afterwards, and a machine without security updates is a problem in itself.",
        },
      },
    ],
  },
  {
    slug: "slet-data-foer-du-saelger",
    cluster: "buying-condition",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "sikker datasletning",
    author: "alireza",
    title: {
      da: "Sådan sletter du data, før du sælger eller kasserer en computer",
      en: "How to erase data before selling or scrapping a computer",
    },
    metaTitle: {
      da: "Sikker datasletning før salg eller kassering | Kestro",
      en: "Erase data before selling a computer — how to | Kestro",
    },
    metaDescription: {
      da: "En formateret disk er ikke en slettet disk. Sådan sletter I data forsvarligt, og hvad en sletterapport med serienummer skal indeholde.",
      en: "Formatting is not erasing. How to properly remove data from an SSD or hard disk, and what a company must be able to document.",
    },
    summary: {
      da: "Formatering er ikke sletning. Forskellen kan koste dyrt, hvis det er en firmamaskine.",
      en: "Formatting is not erasing. The difference gets expensive if it is a company machine.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 4,
    updated: "2026-08-23",
    tldr: {
      da: "At slette filer og tømme papirkurven fjerner ikke data. På en SSD er den rigtige fremgangsmåde en indbygget secure erase eller kryptering efterfulgt af sletning af nøglen. Skal udstyret ud af en virksomhed, er dokumentationen for sletningen lige så vigtig som sletningen selv.",
      en: "Deleting files and emptying the recycle bin does not remove data. On an SSD the right approach is a built-in secure erase, or encryption followed by destroying the key. If the equipment is leaving a company, the documentation of the erasure matters as much as the erasure itself.",
    },
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
        heading: {
          da: "For en virksomhed er det ikke nok",
          en: "For a company that is not enough",
        },
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
    related: [
      {
        href: "/saelg-til-os",
        label: { da: "Sælg jeres brugte udstyr til os", en: "Sell your used equipment to us" },
      },
      {
        href: "/ydelser/overskudslager-og-returvarer",
        label: { da: "Overskudslager og returvarer", en: "Surplus stock and returns" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Er det nok at slette filerne og tømme papirkurven?",
          en: "Is deleting the files and emptying the recycle bin enough?",
        },
        answer: {
          da: "Nej. Det fjerner ikke data. Brug Windows' egen nulstilling med indstillingen, der fjerner alt og renser drevet – den overskriver i stedet for bare at slette.",
          en: "No. That does not remove the data. Use Windows' own reset with the option that removes everything and cleans the drive — it overwrites rather than just deleting.",
        },
      },
      {
        question: {
          da: "Hvordan sletter man data på en SSD?",
          en: "How is data erased on an SSD?",
        },
        answer: {
          da: "På en SSD flytter controlleren data rundt, så en overskrivning ikke nødvendigvis rammer alle celler. Brug producentens Secure Erase. Har maskinen allerede kørt med diskkryptering slået til, er sagen enklere: slettes nøglen, er data i praksis uigenkaldelige.",
          en: "On an SSD the controller moves data around, so overwriting does not necessarily reach every cell. Use the manufacturer's Secure Erase. If the machine has already been running with drive encryption switched on it is simpler: delete the key and the data is in practice unrecoverable.",
        },
      },
      {
        question: {
          da: "Hvad skal en virksomhed gøre ud over at slette?",
          en: "What does a company have to do beyond erasing?",
        },
        answer: {
          da: "Har maskinen indeholdt personoplysninger, skal I kunne dokumentere, at de er væk – ikke bare vide det. Forlang en sletterapport med serienummer for hver enkelt enhed fra den, der håndterer udstyret.",
          en: "If the machine has held personal data, you have to be able to document that it is gone — not merely know it. Demand an erasure report with a serial number for each individual device from whoever handles the equipment.",
        },
      },
      {
        question: {
          da: "Hvad med BIOS-adgangskoder og enhedslåse?",
          en: "What about BIOS passwords and device locks?",
        },
        answer: {
          da: "De skal fjernes sammen med data. En maskine, der stadig er bundet til jeres administration, kan ikke bruges af den næste ejer.",
          en: "They have to come off along with the data. A machine that is still tied to your administration cannot be used by the next owner.",
        },
      },
    ],
  },
  {
    slug: "vaelg-erhvervsbaerbar",
    cluster: "buying-condition",
    type: "beslutning",
    intent: "commercial-education",
    primaryKeyword: "thinkpad vs elitebook vs latitude",
    author: "alireza",
    title: {
      da: "ThinkPad, EliteBook eller Latitude: hvilken skal I vælge?",
      en: "ThinkPad, EliteBook or Latitude: which should you choose?",
    },
    metaTitle: {
      da: "ThinkPad vs EliteBook vs Latitude til erhverv | Kestro",
      en: "ThinkPad vs EliteBook vs Latitude for business | Kestro",
    },
    metaDescription: {
      da: "De tre store erhvervsserier ligner hinanden på databladet. Forskellene ligger i hukommelsesloftet, tastaturet, dokken og kortlæseren – og de koster først noget, når maskinerne står på bordene.",
      en: "The three big business series look alike on a spec sheet. The differences are in the memory ceiling, the keyboard, the dock and the card reader — and they only cost you something once the machines are on the desks.",
    },
    summary: {
      da: "Tre serier bygget til det samme arbejde. Hvor de faktisk skiller sig – og hvilken forskel der rammer jer.",
      en: "Three series built for the same job. Where they actually differ — and which difference will hit you.",
    },
    audience: {
      da: "Indkøbere og IT-ansvarlige, der skal vælge én serie til flere maskiner",
      en: "Buyers and IT managers choosing one series for several machines",
    },
    readingMinutes: 9,
    updated: "2026-09-13",
    tldr: {
      da: "Alle tre serier er bygget til kontorarbejde og holder til det. Forskellene, der koster noget: Latitude tager mest hukommelse (op til 64 GB i to sokler), EliteBook har intet TrackPoint, og Dells ældre E-Port-docks passer ikke til den nuværende generation. Skal medarbejderne bruge adgangskort, skal kortlæseren bestilles bevidst – den sidder ikke i alle modeller.",
      en: "All three series are built for office work and stand up to it. The differences that cost you something: the Latitude takes the most memory (up to 64 GB across two slots), the EliteBook has no TrackPoint, and Dell's older E-Port docks do not fit the current generation. If staff use access cards, the card reader has to be ordered deliberately — it is not in every model.",
    },
    intro: {
      da: "ThinkPad T-serien, EliteBook 800-serien og Latitude 5000-serien fylder mest på det brugte erhvervsmarked. De er bygget til det samme, de holder omtrent lige længe, og på et datablad ligner de hinanden. Forskellene dukker først op, når maskinerne skal stå på fyrre borde og dele docks, skærme og adgangskort med det udstyr, der allerede er i huset.",
      en: "The ThinkPad T series, the EliteBook 800 series and the Latitude 5000 series dominate the used business market. They are built for the same job, they last about as long, and on a spec sheet they look alike. The differences only surface when the machines have to sit on forty desks and share docks, monitors and access cards with the equipment already in the building.",
    },
    sections: [
      {
        heading: { da: "De tre serier, kort", en: "The three series, briefly" },
        body: [
          {
            da: "T14 er det, T480 blev til: erhvervskabinet, godt tastatur og dele, der kan skaffes. Den findes både med Intel og med AMD Ryzen PRO. EliteBook 840 er HP's svar på samme opgave – tynd, meget udbredt og derfor nem at skaffe i antal. Latitude 5410 er Dells arbejdsmaskine med alle porte i behold.",
            en: "The T14 is what the T480 turned into: a business chassis, a good keyboard and parts you can get. It comes with either Intel or AMD Ryzen PRO. The EliteBook 840 is HP's answer to the same job — thin, very common, and therefore easy to source in quantity. The Latitude 5410 is Dell's workhorse with every port still on it.",
          },
          {
            da: "Tallene herunder er dem, maskinerne typisk kommer med, når vi sourcer dem. Hukommelse og disk kan ændres inden levering; resten kan ikke.",
            en: "The figures below are what the machines typically arrive with when we source them. Memory and disk can be changed before delivery; the rest cannot.",
          },
        ],
        table: {
          caption: {
            da: "ThinkPad T14, EliteBook 840 og Latitude 5410 sammenlignet",
            en: "ThinkPad T14, EliteBook 840 and Latitude 5410 compared",
          },
          head: [
            { da: "", en: "" },
            { da: "ThinkPad T14", en: "ThinkPad T14" },
            { da: "EliteBook 840", en: "EliteBook 840" },
            { da: "Latitude 5410", en: "Latitude 5410" },
          ],
          rows: [
            [
              { da: "Hukommelse", en: "Memory" },
              { da: "8–16 GB, kan typisk udvides", en: "8–16 GB, usually expandable" },
              { da: "8–32 GB i to sokler", en: "8–32 GB across two slots" },
              { da: "8–64 GB i to sokler", en: "8–64 GB across two slots" },
            ],
            [
              { da: "Processor", en: "Processor" },
              {
                da: "Intel 10./11. gen. eller AMD Ryzen PRO",
                en: "Intel 10th/11th gen or AMD Ryzen PRO",
              },
              { da: "Intel 8. generation", en: "Intel 8th generation" },
              { da: "Intel 10. eller 11. generation", en: "Intel 10th or 11th generation" },
            ],
            [
              { da: "Lagring", en: "Storage" },
              { da: "256–512 GB NVMe, kan udskiftes", en: "256–512 GB NVMe, replaceable" },
              { da: "256–512 GB NVMe, kan udskiftes", en: "256–512 GB NVMe, replaceable" },
              { da: "256–512 GB NVMe, kan udskiftes", en: "256–512 GB NVMe, replaceable" },
            ],
            [
              { da: "Porte", en: "Ports" },
              {
                da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, kortlæser, combo-jack",
                en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet, card reader, combo jack",
              },
              {
                da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, combo-jack",
                en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet, combo jack",
              },
              {
                da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, combo-jack – smartkortlæser på nogle modeller",
                en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet, combo jack — smart card reader on some models",
              },
            ],
            [
              { da: "Styresystem", en: "Operating system" },
              { da: "Windows 11", en: "Windows 11" },
              { da: "Windows 10 eller 11", en: "Windows 10 or 11" },
              { da: "Windows 10 eller 11", en: "Windows 10 or 11" },
            ],
          ],
        },
      },
      {
        heading: {
          da: "Hukommelsesloftet er den forskel, der holder længst",
          en: "The memory ceiling is the difference that lasts longest",
        },
        body: [
          {
            da: "Processorgenerationen bestemmer, hvor hurtig maskinen er i dag. Hukommelsesloftet bestemmer, hvor længe den bliver ved med at være hurtig nok. Latitude 5410 tager op til 64 GB i to sokler, EliteBook 840 op til 32 GB i to sokler, og T14 leveres typisk med 8–16 GB, som normalt kan udvides.",
            en: "The processor generation decides how fast the machine is today. The memory ceiling decides how long it goes on being fast enough. The Latitude 5410 takes up to 64 GB across two slots, the EliteBook 840 up to 32 GB across two slots, and the T14 typically ships with 8–16 GB that can usually be expanded.",
          },
          {
            da: "For almindeligt kontorarbejde er 16 GB rigeligt, og loftet er ligegyldigt. Skal maskinen bruges til udvikling, tunge regneark, billedarbejde eller mange virtuelle maskiner, er det loftet, der afgør, om I kan opgradere om to år i stedet for at købe igen.",
            en: "For ordinary office work 16 GB is plenty and the ceiling is irrelevant. If the machine is going to run development work, heavy spreadsheets, image work or several virtual machines, the ceiling is what decides whether you can upgrade in two years instead of buying again.",
          },
          {
            da: "Vær opmærksom på de tynde modeller. X1 Carbon og tilsvarende ultrabooks har hukommelsen loddet fast på bundkortet, og så er den mængde, maskinen købes med, den mængde, den har resten af sit liv.",
            en: "Watch out for the thin models. The X1 Carbon and comparable ultrabooks have the memory soldered to the motherboard, and then whatever the machine is bought with is what it has for the rest of its life.",
          },
        ],
      },
      {
        heading: {
          da: "Tastaturet er en migreringsomkostning",
          en: "The keyboard is a migration cost",
        },
        body: [
          {
            da: "EliteBook 840 har ikke noget TrackPoint. Kommer medarbejderne fra ThinkPads, er det den største omstilling – større end processoren og større end skærmen. Det står sjældent i regnearket, men det er den forskel, folk lægger mærke til den første uge.",
            en: "The EliteBook 840 has no TrackPoint. If your staff are coming from ThinkPads, that is the biggest adjustment — bigger than the processor and bigger than the screen. It rarely makes it into the spreadsheet, but it is the difference people notice in the first week.",
          },
          {
            da: "Den anden vej rundt gælder det samme: skifter I fra HP eller Dell til ThinkPad, får I en pegepind midt i tastaturet, som nogle bruger hver dag og andre aldrig rører. Ingen af delene er et argument mod en serie. Det er et argument for at vælge én serie og blive ved den.",
            en: "It works the same way round: move from HP or Dell to ThinkPad and you get a pointing stick in the middle of the keyboard that some people use every day and others never touch. Neither is an argument against a series. It is an argument for picking one series and staying with it.",
          },
          {
            da: "Uanset hvilken serie I vælger, skifter vi tastaturet fysisk til dansk eller norsk layout på maskiner, der kommer fra udlandet, så æ, ø og å sidder rigtigt og tegnene er trykt på tasterne.",
            en: "Whichever series you choose, we physically change the keyboard to a Danish or Norwegian layout on machines that come from abroad, so æ, ø and å sit where they should and the characters are printed on the keys.",
          },
        ],
      },
      {
        heading: { da: "Docks og adgangskort", en: "Docks and access cards" },
        body: [
          {
            da: "Har I docks i forvejen, er de tit den dyreste del af beslutningen. Dells docks til denne generation bruger USB-C, og ældre E-Port-docks fra Dell passer ikke. Har I et lager fuldt af dem, er de ikke et argument for Latitude – de er et argument for at regne på, hvad udskiftningen koster.",
            en: "If you already have docks, they are often the most expensive part of the decision. Dell's docks for this generation use USB-C, and older Dell E-Port docks do not fit. If you have a cupboard full of them, they are not an argument for the Latitude — they are an argument for working out what replacing them costs.",
          },
          {
            da: "Arbejdspladser med HP-docks i forvejen har den samme overvejelse den anden vej, og her er EliteBook 840 den nemme vej. ThinkPad-siden har både mekaniske dockstik på de ældre modeller og USB-C på de nyere, så dér afhænger det af, hvilken generation I har stående.",
            en: "Workplaces that already have HP docks have the same consideration in reverse, and there the EliteBook 840 is the easy path. The ThinkPad side has mechanical dock connectors on the older models and USB-C on the newer ones, so there it depends which generation you already have.",
          },
          {
            da: "Bruger medarbejderne adgangskort, skal smartkortlæseren bestilles bevidst. Den sidder på nogle Latitude-modeller og ikke på andre, og det er ikke noget, der kan sættes i bagefter. Det er værd at få skrevet ind i tilbuddet frem for at opdage det ved udrulningen.",
            en: "If staff use access cards, the smart card reader has to be ordered deliberately. It is on some Latitude models and not on others, and it is not something that can be added afterwards. Worth writing into the quote rather than discovering at rollout.",
          },
        ],
      },
      {
        heading: { da: "Sure View: vælg det bevidst", en: "Sure View: choose it deliberately" },
        body: [
          {
            da: "Nogle EliteBook-modeller har Sure View, et indbygget privatlivsfilter, der kan slås til. Det er godt i toget og i en lufthavn. Det gør også skærmen mørkere på kontoret, hver dag, for den medarbejder der sidder med den.",
            en: "Some EliteBook models have Sure View, a built-in privacy filter you can switch on. It is good on a train and in an airport. It also makes the screen darker in the office, every day, for whoever is sitting at it.",
          },
          {
            da: "Det er hverken en fejl eller en bonus – det er et valg. Skal maskinerne bruges af folk, der rejser med fortrolige data, er det pengene værd. Skal de stå på faste pladser på et kontor, er det en ulempe, I betaler for.",
            en: "It is neither a fault nor a bonus — it is a choice. If the machines are for people travelling with confidential data, it earns its place. If they are going to sit at fixed desks in an office, it is a drawback you are paying for.",
          },
        ],
      },
      {
        heading: { da: "Sådan vælger I", en: "How to choose" },
        body: [
          {
            da: "Rækkefølgen herunder er den, der plejer at give det rigtige svar hurtigst. Den starter med det, der er dyrest at tage fejl af.",
            en: "The order below is the one that usually gets to the right answer fastest. It starts with what is most expensive to get wrong.",
          },
        ],
        list: [
          {
            da: "Hvad står der allerede? Docks, skærme og kabler afgør ofte valget før specifikationerne gør.",
            en: "What is already there? Docks, monitors and cables often decide the choice before the specifications do.",
          },
          {
            da: "Skal medarbejderne bruge adgangskort? Så skal kortlæseren stå i tilbuddet.",
            en: "Do staff need access cards? Then the card reader has to be in the quote.",
          },
          {
            da: "Hvad skal maskinen lave om to år? Det afgør, hvor højt hukommelsesloftet skal være.",
            en: "What will the machine be doing in two years? That decides how high the memory ceiling needs to be.",
          },
          {
            da: "Hvad kommer folk fra? TrackPoint eller ej er den forskel, brugerne mærker først.",
            en: "What are people coming from? TrackPoint or not is the difference users feel first.",
          },
          {
            da: "Rejser de med maskinen? Kun dér giver Sure View mening.",
            en: "Do they travel with it? Only then does Sure View make sense.",
          },
          {
            da: "Vælg så én serie til hele holdet. Ens maskiner er nemmere at udrulle, understøtte og udskifte end den bedste maskine til hver enkelt.",
            en: "Then pick one series for the whole team. Identical machines are easier to roll out, support and replace than the best machine for each individual.",
          },
        ],
      },
    ],
    closing: {
      da: "Er I i tvivl mellem to serier, så skriv til os med, hvad I har stående i forvejen, og hvad maskinerne skal bruges til. Vi sourcer alle tre serier og har ingen grund til at anbefale den ene frem for den anden – vi sender et skriftligt tilbud på den, der passer, uden at der er bundet noget op.",
      en: "If you are torn between two series, write to us with what you already have and what the machines are for. We source all three series and have no reason to favour one over another — we will send a written quote on whichever fits, with nothing committed.",
    },
    related: [
      {
        href: "/produkter/baerbare-computere",
        label: { da: "De bærbare, vi skaffer", en: "The laptops we source" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et skriftligt tilbud", en: "Get a written quote" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Er ThinkPad bedre end EliteBook og Latitude?",
          en: "Is the ThinkPad better than the EliteBook and the Latitude?",
        },
        answer: {
          da: "Nej. Alle tre er bygget til erhvervsbrug og holder til daglig kontorbrug. Forskellene ligger i hukommelsesloft, tastatur, dockstik og kortlæser – ikke i kvalitet. Den rigtige serie er den, der passer til det udstyr og de vaner, I har i forvejen.",
          en: "No. All three are built for business use and stand up to daily office work. The differences are in the memory ceiling, the keyboard, the dock connector and the card reader — not in quality. The right series is the one that fits the equipment and the habits you already have.",
        },
      },
      {
        question: {
          da: "Skal vi vælge Intel eller AMD i en T14?",
          en: "Should we choose Intel or AMD in a T14?",
        },
        answer: {
          da: "De to varianter er ikke helt ens. AMD Ryzen PRO giver typisk flere kerner for pengene, Intel-varianterne har oftere Thunderbolt. Er der software i huset, der er certificeret til det ene, følger valget den software. Er der ikke, betyder forskellen lidt til almindeligt kontorarbejde.",
          en: "The two variants are not quite the same. AMD Ryzen PRO typically gives more cores for the money; the Intel variants more often have Thunderbolt. If there is software in the building certified for one of them, the choice follows that software. If not, the difference means little for ordinary office work.",
        },
      },
      {
        question: {
          da: "Kan vi blande serierne i den samme leverance?",
          en: "Can we mix the series in the same delivery?",
        },
        answer: {
          da: "Ja, og nogle gange giver det mening – for eksempel en tyndere maskine til dem, der rejser, og en opgraderbar til dem, der sidder fast. Men jo flere serier, jo flere docks, strømforsyninger og reservedele skal I holde styr på. Under omkring ti maskiner er det sjældent besværet værd.",
          en: "Yes, and sometimes it makes sense — a thinner machine for the people who travel and an upgradable one for those at fixed desks, for instance. But the more series you run, the more docks, power supplies and spare parts you have to keep track of. Under about ten machines it is rarely worth the trouble.",
        },
      },
      {
        question: {
          da: "Får vi dansk tastatur uanset hvilken serie vi vælger?",
          en: "Do we get a Danish keyboard whichever series we choose?",
        },
        answer: {
          da: "Ja. Maskiner sourcet i udlandet kommer ofte med spansk eller italiensk layout, og vi skifter tastaturet fysisk til dansk eller norsk, før de leveres. Det er et fysisk skift, ikke en indstilling i Windows – tasterne har de rigtige tegn trykt på.",
          en: "Yes. Machines sourced abroad often arrive with Spanish or Italian layouts, and we physically change the keyboard to Danish or Norwegian before delivery. It is a physical swap, not a Windows setting — the keys have the right characters printed on them.",
        },
      },
    ],
  },
  {
    slug: "dock-og-skaerme-til-arbejdspladsen",
    cluster: "workplace-hardware",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "hvor mange skærme kan en dock klare",
    author: "alireza",
    title: {
      da: "Dock og skærme: hvor mange kan en arbejdsplads klare?",
      en: "Docks and monitors: how many can one desk take?",
    },
    metaTitle: {
      da: "Hvor mange skærme kan en dockingstation klare? | Kestro",
      en: "How many monitors can a docking station run? | Kestro",
    },
    metaDescription: {
      da: "Antallet af skærme afhænger af docken, ikke af computeren. Forskellen på mekaniske docks og USB-C, hvad de hver især kan trække, og hvorfor stikkene skal passe i begge ender.",
      en: "The number of monitors depends on the dock, not the computer. The difference between mechanical and USB-C docks, what each can drive, and why the connectors have to match at both ends.",
    },
    summary: {
      da: "Docken afgør, hvor mange skærme der kan sidde på pladsen. Sådan finder I ud af hvilken, før I køber skærmene.",
      en: "The dock decides how many monitors a desk can run. How to work out which one before you buy the monitors.",
    },
    audience: {
      da: "IT-ansvarlige, der skal sætte faste arbejdspladser op",
      en: "IT managers setting up fixed desks",
    },
    readingMinutes: 7,
    updated: "2026-09-13",
    tldr: {
      da: "Det er docken, ikke computeren, der sætter grænsen for antallet af skærme. Mekaniske docks klikker fast under maskinen og passer kun til én serie; USB-C-docks virker på tværs af mærker. To skærme klarer stort set alle docks, tre kræver den rigtige variant. Tjek stikkene i begge ender, før I køber – ældre docks har DVI og VGA, som nye skærme sjældent har.",
      en: "It is the dock, not the computer, that caps how many monitors a desk can run. Mechanical docks click onto the bottom of the machine and fit only one series; USB-C docks work across brands. Two monitors is within reach of almost any dock, three needs the right variant. Check the connectors at both ends before buying — older docks have DVI and VGA, which new monitors rarely do.",
    },
    intro: {
      da: "Spørgsmålet kommer altid i den forkerte rækkefølge. Skærmene bliver købt først, og så viser det sig, at docken på pladsen kun kan trække to af dem, eller at den har et stik, ingen af skærmene har. Docken er den billigste del af arbejdspladsen og den, der bestemmer mest. Den bør vælges først.",
      en: "The question almost always arrives in the wrong order. The monitors get bought first, and then it turns out the dock at the desk will only drive two of them, or that it has a connector none of the monitors has. The dock is the cheapest part of the desk and the part that decides the most. It should be chosen first.",
    },
    sections: [
      {
        heading: { da: "To slags docks", en: "Two kinds of dock" },
        body: [
          {
            da: "Mekaniske docks klikker fast i et stik i bunden af maskinen. ThinkPad Ultra Dock er den udbredte af slagsen: maskinen sættes ned i docken, og alt er forbundet. Det er hurtigt og holdbart, men stikket findes kun på én producents maskiner og kun på bestemte generationer.",
            en: "Mechanical docks click into a connector on the underside of the machine. The ThinkPad Ultra Dock is the common one: the machine drops onto the dock and everything is connected. It is fast and durable, but the connector exists only on one manufacturer's machines, and only on certain generations.",
          },
          {
            da: "USB-C-docks forbinder med ét kabel, der klarer data, skærm og strøm på én gang. Dell WD19 og HP USB-C Dock G5 er de to, vi oftest skaffer. Fordelen er, at de virker på tværs af mærker – en WD19 kører fint på en EliteBook.",
            en: "USB-C docks connect with a single cable carrying data, display and power at once. The Dell WD19 and the HP USB-C Dock G5 are the two we source most often. The advantage is that they work across brands — a WD19 runs an EliteBook perfectly well.",
          },
          {
            da: "Har I ældre Dell E-Port-docks stående, passer de ikke til den nuværende generation Latitude. Det er værd at få afklaret, før docken regnes med som noget, I allerede har.",
            en: "If you have older Dell E-Port docks in a cupboard, they do not fit the current generation of Latitude. Worth settling before the dock is counted as something you already own.",
          },
        ],
        table: {
          caption: {
            da: "De tre docks, vi oftest skaffer",
            en: "The three docks we source most often",
          },
          head: [
            { da: "", en: "" },
            { da: "ThinkPad Ultra Dock", en: "ThinkPad Ultra Dock" },
            { da: "Dell WD19", en: "Dell WD19" },
            { da: "HP USB-C Dock G5", en: "HP USB-C Dock G5" },
          ],
          rows: [
            [
              { da: "Forbindelse", en: "Connection" },
              { da: "Mekanisk stik under maskinen", en: "Mechanical connector under the machine" },
              { da: "USB-C, ét kabel", en: "USB-C, one cable" },
              { da: "USB-C, ét kabel", en: "USB-C, one cable" },
            ],
            [
              { da: "Skærme", en: "Monitors" },
              { da: "Op til tre", en: "Up to three" },
              { da: "Op til tre afhængigt af variant", en: "Up to three depending on the variant" },
              { da: "To", en: "Two" },
            ],
            [
              { da: "Skærmstik", en: "Display outputs" },
              { da: "DisplayPort, DVI og VGA", en: "DisplayPort, DVI and VGA" },
              { da: "DisplayPort og HDMI", en: "DisplayPort and HDMI" },
              { da: "DisplayPort og HDMI", en: "DisplayPort and HDMI" },
            ],
            [
              { da: "Passer til", en: "Fits" },
              { da: "Kun ThinkPads med dockstik", en: "Only ThinkPads with the dock connector" },
              { da: "USB-C-maskiner, også andre mærker", en: "USB-C machines, other brands too" },
              { da: "USB-C-maskiner, oftest HP", en: "USB-C machines, usually HP" },
            ],
          ],
        },
      },
      {
        heading: { da: "Hvor mange skærme", en: "How many monitors" },
        body: [
          {
            da: "To skærme er inden for rækkevidde af stort set enhver dock på listen. Tre er det ikke. ThinkPad Ultra Dock kan tre samtidig, WD19 kan tre på nogle varianter og to på andre, og G5-docken er en to-skærms dock.",
            en: "Two monitors is within reach of essentially any dock on the list. Three is not. The ThinkPad Ultra Dock will do three at once, the WD19 does three on some variants and two on others, and the G5 is a two-monitor dock.",
          },
          {
            da: "Variant er det vigtige ord ved WD19. Docken findes i flere udgaver, der ligner hinanden udvendigt, og antallet af skærme følger udgaven. Skal der tre skærme på pladsen, skal den præcise variant stå i tilbuddet – ikke bare modelnavnet.",
            en: "Variant is the important word with the WD19. The dock exists in several versions that look alike from the outside, and the monitor count follows the version. If a desk needs three monitors, the exact variant has to be in the quote — not just the model name.",
          },
        ],
      },
      {
        heading: {
          da: "Stikkene skal passe i begge ender",
          en: "The connectors have to match at both ends",
        },
        body: [
          {
            da: "Det er her, de fleste opsætninger går galt. ThinkPad Ultra Dock har DisplayPort, DVI og VGA. DVI og VGA er fra en tid, hvor skærme havde dem, og en ny kontorskærm har det sjældent. Docken kan altså trække tre skærme, som skærmene ikke kan tage imod.",
            en: "This is where most setups come apart. The ThinkPad Ultra Dock has DisplayPort, DVI and VGA. DVI and VGA are from a time when monitors had them, and a current office monitor rarely does. So the dock can drive three monitors the monitors cannot accept.",
          },
          {
            da: "Adaptere findes og virker, men de er en ekstra ting per plads, der kan blive væk, og en ekstra ting at bestille i antal. Er der frit valg, er det nemmere at vælge dock og skærme med de samme stik end at samle to generationer med adaptere.",
            en: "Adapters exist and work, but they are one more thing per desk to lose, and one more thing to order in quantity. Given a free choice, it is easier to pick a dock and monitors with the same connectors than to bridge two generations with adapters.",
          },
        ],
      },
      {
        heading: { da: "Skærmene", en: "The monitors" },
        body: [
          {
            da: "Til almindeligt kontorarbejde er 24 tommer IPS med mat overflade det, der går igen – Dell UltraSharp U2419H, HP EliteDisplay E243 og Lenovo ThinkVision T24i er alle i den klasse. Mat overflade betyder færre genskin fra vinduer og loftslys, og det mærkes mere i hverdagen end et par hundrede pixels.",
            en: "For ordinary office work, a 24-inch IPS panel with a matte finish is what keeps coming up — the Dell UltraSharp U2419H, HP EliteDisplay E243 and Lenovo ThinkVision T24i are all in that class. A matte finish means fewer reflections from windows and ceiling lights, and that is felt more day to day than a few hundred extra pixels.",
          },
          {
            da: "Skal der stå to ved siden af hinanden, er rammen værd at kigge på. Tynde rammer betyder, at der ikke løber en tyk streg ned midt i synsfeltet, hvor de to skærme mødes.",
            en: "If two are going side by side, the bezel is worth a look. Thin bezels mean there is no thick bar running down the middle of the field of view where the two monitors meet.",
          },
        ],
      },
      {
        heading: { da: "Én dock på alle pladser", en: "One dock at every desk" },
        body: [
          {
            da: "Det billigste, I kan gøre for en flåde, er at have den samme dock på hver plads. Så kan enhver maskine sættes ved enhver plads, en defekt dock kan byttes fra lageret uden at nogen skal tænke over det, og der er én slags kabel at bestille.",
            en: "The cheapest thing you can do for a fleet is to have the same dock at every desk. Then any machine can sit at any desk, a failed dock can be swapped from the shelf without anyone having to think about it, and there is one kind of cable to order.",
          },
          {
            da: "Det taler for USB-C frem for mekanisk, selv i en ren ThinkPad-flåde. Mekaniske docks er gode, så længe alle maskiner har stikket – og den dag en enkelt afdeling får en anden model, holder det op med at være sandt.",
            en: "That argues for USB-C over mechanical, even in an all-ThinkPad fleet. Mechanical docks are good for as long as every machine has the connector — and the day one department gets a different model, that stops being true.",
          },
        ],
        list: [
          {
            da: "Vælg docken før skærmene. Den sætter grænsen, ikke computeren.",
            en: "Choose the dock before the monitors. It sets the limit, not the computer.",
          },
          {
            da: "Skal der tre skærme på, skal den præcise dockvariant stå i tilbuddet.",
            en: "If three monitors are going on, the exact dock variant has to be in the quote.",
          },
          {
            da: "Tjek at dockens skærmstik findes på de skærme, I køber.",
            en: "Check that the dock's display outputs exist on the monitors you are buying.",
          },
          {
            da: "Samme dock på alle pladser slår den bedste dock på hver enkelt plads.",
            en: "The same dock at every desk beats the best dock at each individual desk.",
          },
        ],
      },
    ],
    closing: {
      da: "Skriv til os med, hvor mange skærme der skal stå på pladsen, og hvilke maskiner der skal kunne sættes ved den. Så finder vi docken, der passer til begge dele, og skriver varianten ind i tilbuddet, så der ikke er noget at gætte på ved leveringen.",
      en: "Write to us with how many monitors a desk needs and which machines have to be able to sit at it. We will find the dock that fits both and write the variant into the quote, so there is nothing to guess at on delivery.",
    },
    related: [
      {
        href: "/produkter/dockingstationer",
        label: { da: "Dockingstationer, vi skaffer", en: "The docks we source" },
      },
      {
        href: "/produkter/skaerme",
        label: { da: "Skærme til kontoret", en: "Monitors for the office" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Kan jeg bruge en Dell-dock til en HP-maskine?",
          en: "Can I use a Dell dock with an HP machine?",
        },
        answer: {
          da: "Ja, hvis det er en USB-C-dock. WD19 forbinder over USB-C og er ikke bundet til Dell-maskiner. Mekaniske docks kan ikke – de sidder i et stik, som kun findes på én producents maskiner.",
          en: "Yes, if it is a USB-C dock. The WD19 connects over USB-C and is not tied to Dell machines. Mechanical docks cannot — they sit in a connector that exists only on one manufacturer's machines.",
        },
      },
      {
        question: {
          da: "Oplader docken også maskinen?",
          en: "Does the dock charge the machine too?",
        },
        answer: {
          da: "USB-C-docks gør, over det samme kabel som skærm og data. Det er hele pointen med ét kabel: maskinen sættes på pladsen med én forbindelse og lader imens. Hvor meget strøm docken kan levere, varierer, og en maskine med et krævende grafikkort kan trække mere, end docken giver.",
          en: "USB-C docks do, over the same cable as display and data. That is the whole point of one cable: the machine arrives at the desk on a single connection and charges while it sits there. How much power a dock can deliver varies, and a machine with a demanding graphics card can draw more than the dock supplies.",
        },
      },
      {
        question: {
          da: "Er to skærme bedre end én stor?",
          en: "Are two monitors better than one large one?",
        },
        answer: {
          da: "Til sagsbehandling og arbejde med to dokumenter ved siden af hinanden, som regel ja – vinduer kan ligge fast hver sit sted. Til arbejde i ét stort program kan én bred skærm være bedre. To ens 24-tommers er den nemmeste at skaffe i antal og den billigste at erstatte, når en går i stykker.",
          en: "For casework and anything that means two documents side by side, usually yes — windows can stay put in their own place. For work inside one large application, a single wide monitor can be better. Two identical 24-inch panels are the easiest to source in quantity and the cheapest to replace when one fails.",
        },
      },
      {
        question: {
          da: "Hvad hvis skærmene har DisplayPort og docken kun har VGA?",
          en: "What if the monitors have DisplayPort and the dock only has VGA?",
        },
        answer: {
          da: "Så skal der adapter på, og VGA er analogt – billedet bliver mærkbart blødere end over DisplayPort. På en enkelt plads er det til at leve med. På tredive er det nemmere og billigere at finde en dock, der passer til skærmene.",
          en: "Then an adapter is needed, and VGA is analogue — the picture is noticeably softer than over DisplayPort. At one desk that is liveable. At thirty it is easier and cheaper to find a dock that matches the monitors.",
        },
      },
    ],
  },
  {
    slug: "standardiser-firmacomputere",
    cluster: "lifecycle",
    type: "erhvervs-it",
    intent: "informational-commercial",
    primaryKeyword: "standardisering af computere i virksomheden",
    author: "alireza",
    title: {
      da: "Standardisering: hvorfor ens maskiner er billigere end de bedste",
      en: "Standardising: why identical machines cost less than the best ones",
    },
    metaTitle: {
      da: "Standardisering af computere i virksomheden | Kestro",
      en: "Standardising computers across a company | Kestro",
    },
    metaDescription: {
      da: "Hver ekstra model koster ikke bare en maskine mere – den koster docks, strømforsyninger, reservedele og en ting mere, IT skal kunne. Hvad standardisering faktisk sparer, og hvornår man ikke skal.",
      en: "Every extra model costs more than one more machine — it costs docks, power supplies, spare parts and one more thing IT has to know. What standardising actually saves, and when not to do it.",
    },
    summary: {
      da: "Den bedste maskine til hver medarbejder er dyrere end den samme maskine til alle. Her er regnestykket, der sjældent bliver stillet op.",
      en: "The best machine for each employee costs more than the same machine for everyone. Here is the sum that rarely gets written down.",
    },
    audience: {
      da: "IT-ansvarlige og indkøbere med en flåde at holde kørende",
      en: "IT managers and buyers with a fleet to keep running",
    },
    readingMinutes: 8,
    updated: "2026-09-13",
    tldr: {
      da: "En ekstra model i flåden koster mere end den ene maskine. Den koster en dock mere på lageret, en strømforsyning mere, et sæt reservedele mere og en ting mere, IT skal kunne i hovedet. Standardisering betyder ikke ens maskiner til alle – det betyder få niveauer frem for mange. To eller tre konfigurationer dækker de fleste virksomheder, og de skal stå på skrift, så den næste bestilling ikke starter forfra.",
      en: "An extra model in the fleet costs more than the one machine. It costs another dock on the shelf, another power supply, another set of spare parts and one more thing IT has to keep in its head. Standardising does not mean identical machines for everyone — it means few tiers rather than many. Two or three configurations cover most companies, and they need to be written down so the next order does not start from scratch.",
    },
    intro: {
      da: "Beslutningen bliver sjældent taget. Den sker: en afdeling får et behov, der bliver købt noget andet den gang, og to år senere står der fire modeller på kontoret, som ingen har valgt tilsammen. Hver enkelt indkøb var fornuftigt. Summen er ikke.",
      en: "The decision is rarely made. It happens: one department has a need, something different gets bought that time, and two years later there are four models in the office that nobody chose together. Each purchase on its own was sensible. The sum is not.",
    },
    sections: [
      {
        heading: {
          da: "Hvad der bliver dobbelt, når der er to modeller",
          en: "What doubles when there are two models",
        },
        body: [
          {
            da: "En maskine er ikke bare en maskine. Den kommer med en dock, den skal have strøm fra en bestemt slags forsyning, den har et tastatur, der kan gå i stykker, og en måde at blive sat op på. Alt det ganges med antallet af modeller, ikke med antallet af medarbejdere.",
            en: "A machine is not just a machine. It comes with a dock, it takes power from a particular kind of supply, it has a keyboard that can break, and a way of being set up. All of that multiplies by the number of models, not by the number of employees.",
          },
          {
            da: "Tyve ens maskiner har én slags reservedel. Ti og ti har to. Det er den samme flåde og den samme pris på maskinerne, men det andet lager er dobbelt så bredt, og den dag noget går i stykker, er sandsynligheden for at have den rigtige del på hylden lavere.",
            en: "Twenty identical machines have one kind of spare part. Ten and ten have two. Same fleet, same price on the machines, but the second store cupboard is twice as wide, and the day something breaks, the odds of having the right part on the shelf are lower.",
          },
        ],
        table: {
          caption: {
            da: "Hvad der skal holdes styr på per model i flåden",
            en: "What has to be kept track of per model in the fleet",
          },
          head: [
            { da: "", en: "" },
            { da: "Én model", en: "One model" },
            { da: "To modeller", en: "Two models" },
          ],
          rows: [
            [
              { da: "Docks på lageret", en: "Docks on the shelf" },
              { da: "Én type", en: "One type" },
              {
                da: "To typer, hvis dockstikket er forskelligt",
                en: "Two types, if the dock connector differs",
              },
            ],
            [
              { da: "Strømforsyninger", en: "Power supplies" },
              { da: "Én type", en: "One type" },
              {
                da: "To typer, medmindre begge bruger USB-C",
                en: "Two types, unless both use USB-C",
              },
            ],
            [
              { da: "Reservedele", en: "Spare parts" },
              { da: "Ét sæt: tastatur, batteri, disk", en: "One set: keyboard, battery, disk" },
              { da: "To sæt", en: "Two sets" },
            ],
            [
              { da: "Opsætning", en: "Setup" },
              { da: "Én fremgangsmåde", en: "One procedure" },
              { da: "To, med hver sine drivere", en: "Two, each with its own drivers" },
            ],
            [
              { da: "Når en maskine dør", en: "When a machine dies" },
              { da: "Enhver låner fra puljen", en: "Anyone borrows from the pool" },
              { da: "Kun halvdelen passer til pladsen", en: "Only half of them fit the desk" },
            ],
          ],
        },
      },
      {
        heading: {
          da: "Standardisering er ikke ens maskiner til alle",
          en: "Standardising is not identical machines for everyone",
        },
        body: [
          {
            da: "Her går de fleste diskussioner i hårdknude, fordi ordet bliver hørt som om alle skal have den samme maskine. Det skal de ikke. Grafikeren har brug for mere, end bogholderiet har, og det er ikke en holdning, man kan standardisere sig ud af.",
            en: "This is where most of these discussions tie themselves in knots, because the word gets heard as everyone having the same machine. They should not. The designer needs more than the finance department does, and that is not an opinion you can standardise your way out of.",
          },
          {
            da: "Det, der standardiseres, er antallet af niveauer. To eller tre dækker de fleste virksomheder: en almindelig kontormaskine, en med mere hukommelse og disk til de tunge brugere, og eventuelt en let en til dem, der rejser. Samme serie, samme dock, samme reservedele – forskellig konfiguration.",
            en: "What gets standardised is the number of tiers. Two or three cover most companies: an ordinary office machine, one with more memory and disk for the heavy users, and perhaps a light one for the people who travel. Same series, same dock, same spare parts — different configuration.",
          },
          {
            da: "Det er forskellen på at vælge én serie og at vælge én maskine. Serien holder lageret smalt. Konfigurationen inden for serien lader folk få det, de skal bruge.",
            en: "That is the difference between choosing one series and choosing one machine. The series keeps the store cupboard narrow. The configuration within the series lets people have what they need.",
          },
        ],
      },
      {
        heading: {
          da: "Konfigurationen skal stå på skrift",
          en: "The configuration has to be written down",
        },
        body: [
          {
            da: "En standard, der kun findes i hovedet på den, der købte sidst, holder indtil den person er på ferie. Skriv niveauerne ned: serie, processor, hukommelse, disk, skærmstørrelse, tastaturlayout og hvilken dock der hører til.",
            en: "A standard that exists only in the head of whoever bought last time lasts until that person is on holiday. Write the tiers down: series, processor, memory, disk, screen size, keyboard layout and which dock goes with it.",
          },
          {
            da: "Vi holder en aftalt konfiguration på skrift for de kunder, der beder om det, så den næste medarbejder får samme opsætning som resten uden at nogen skal starte et indkøb forfra. Det er den billigste del af hele øvelsen og den, der oftest bliver sprunget over.",
            en: "We keep an agreed configuration on file for the customers who ask for it, so the next employee gets the same setup as everyone else without anyone starting a purchase from scratch. It is the cheapest part of the whole exercise and the one most often skipped.",
          },
        ],
      },
      {
        heading: { da: "Hvornår man ikke skal standardisere", en: "When not to standardise" },
        body: [
          {
            da: "Standardisering er en fordel, der vokser med antallet. Under omkring ti maskiner er der ikke rigtig et lager at holde smalt, og så er det mere værd at give hver enkelt den maskine, der passer bedst.",
            en: "Standardising is an advantage that grows with the count. Under about ten machines there is not really a store cupboard to keep narrow, and then it is worth more to give each person the machine that fits them best.",
          },
          {
            da: "Den anden undtagelse er den enlige specialist. Har I én medarbejder, der har brug for en mobil arbejdsstation med 64 GB hukommelse og et rigtigt grafikkort, er det en dårlig handel at holde hele flåden tilbage for at slippe for én ekstra model. Køb den maskine, skriv den ind som en undtagelse, og lad resten være standarden.",
            en: "The other exception is the lone specialist. If you have one employee who needs a mobile workstation with 64 GB of memory and a real graphics card, holding the whole fleet back to avoid one extra model is a bad trade. Buy that machine, write it in as an exception, and let the rest be the standard.",
          },
          {
            da: "Undtagelsen er ikke problemet. Problemet er undtagelsen, der ikke blev skrevet ned, og som to år senere ligner en model, nogen valgte med vilje.",
            en: "The exception is not the problem. The problem is the exception nobody wrote down, which two years later looks like a model somebody chose on purpose.",
          },
        ],
      },
      {
        heading: { da: "Sådan kommer I i gang", en: "How to start" },
        body: [
          {
            da: "Man behøver ikke skifte hele flåden for at standardisere den. Det sker af sig selv over et par udskiftningsrunder, hvis beslutningen bliver truffet én gang og skrevet ned.",
            en: "You do not have to replace a whole fleet to standardise it. It happens on its own over a couple of replacement rounds, as long as the decision gets made once and written down.",
          },
        ],
        list: [
          {
            da: "Tæl, hvad der står nu: modeller, ikke maskiner. Tallet plejer at overraske.",
            en: "Count what is there now: models, not machines. The number usually surprises.",
          },
          {
            da: "Vælg én serie, I kan skaffe brugt i antal over flere år.",
            en: "Pick one series you can source used, in quantity, over several years.",
          },
          {
            da: "Læg to eller tre niveauer inden for den serie – ikke flere.",
            en: "Set two or three tiers inside that series — no more.",
          },
          {
            da: "Vælg docken til serien, og hold den samme på alle pladser.",
            en: "Choose the dock for the series, and keep it the same at every desk.",
          },
          {
            da: "Skriv niveauerne ned et sted, den næste indkøber kan finde dem.",
            en: "Write the tiers down somewhere the next buyer can find them.",
          },
          {
            da: "Udskift efterhånden som maskinerne går af, ikke på én gang.",
            en: "Replace as machines retire, not all at once.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal I lægge en standard, kan vi skaffe den samme serie i antal over tid frem for det, der tilfældigvis er på lager en given uge. Skriv til os med, hvad der står nu, og hvor mange I skal bruge – så foreslår vi niveauerne og holder dem på skrift til næste bestilling.",
      en: "If you are setting a standard, we can source the same series in quantity over time rather than whatever happens to be in stock in a given week. Write to us with what you have now and how many you need — we will propose the tiers and keep them on file for the next order.",
    },
    related: [
      {
        href: "/flaadeloesninger",
        label: { da: "Flåder og større leverancer", en: "Fleets and larger deliveries" },
      },
      {
        href: "/vejledninger/vaelg-erhvervsbaerbar",
        label: { da: "Hvilken serie skal I vælge?", en: "Which series should you choose?" },
      },
    ],
    faqs: [
      {
        question: {
          da: "Hvor mange maskiner skal der til, før standardisering betaler sig?",
          en: "How many machines does it take before standardising pays off?",
        },
        answer: {
          da: "Omkring ti er der, hvor det begynder at kunne mærkes, og over tredive er det svært at argumentere imod. Under ti er der ikke nok af hver ting til, at et smalt lager betyder noget.",
          en: "Around ten is where it starts to be felt, and over thirty it is hard to argue against. Under ten there is not enough of each thing for a narrow store cupboard to matter.",
        },
      },
      {
        question: {
          da: "Kan I skaffe den samme model i flere år?",
          en: "Can you source the same model for several years?",
        },
        answer: {
          da: "På de udbredte erhvervsserier, ja – de blev solgt i meget store antal til virksomheder, og de kommer på det brugte marked i mange år derefter. Det er en af grundene til at vælge en udbredt serie frem for en sjælden: den sjældne er svær at skaffe igen, når I skal bruge tre mere.",
          en: "On the common business series, yes — they were sold to companies in very large numbers, and they reach the used market for many years afterwards. That is one reason to pick a common series over a rare one: the rare one is hard to source again when you need three more.",
        },
      },
      {
        question: {
          da: "Skal skærmene også være ens?",
          en: "Do the monitors have to be identical too?",
        },
        answer: {
          da: "Det betyder mindre end maskinerne, fordi en skærm passer til alt med det rigtige stik. Men står der to ved siden af hinanden på samme plads, bør de to være ens – forskellig størrelse eller farvegengivelse ved siden af hinanden er en daglig irritation.",
          en: "It matters less than the machines, because a monitor fits anything with the right connector. But if two are sitting side by side at the same desk, those two should match — different sizes or colour rendering next to each other is a daily irritation.",
        },
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

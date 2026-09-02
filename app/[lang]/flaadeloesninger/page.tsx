import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Layers,
  Cpu,
  Repeat,
  CalendarClock,
  ArrowRight,
  Phone,
  MonitorCog,
  Keyboard,
} from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";
import TeamAvatar from "@/components/TeamAvatar";
import Faq from "@/components/Faq";
import { primaryContact } from "@/lib/company";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    metaTitle: "Computere til flere medarbejdere – flådeløsninger | Kestro",
    metaDescription:
      "Fra ti maskiner til en hel medarbejderflåde: samme konfiguration hele vejen rundt, samlet levering og gamle maskiner hentet retur.",
    badge: "Til større virksomheder",
    title: "Udstyr hele virksomheden",
    intro:
      "Skal alle medarbejdere have en computer – eller skal hele flåden skiftes ud? Vi leverer renoverede erhvervsmaskiner i større antal, med den opsætning I vælger, og tager gerne jeres gamle udstyr i bytte.",
    sendEnquiry: "Send en forespørgsel",
    talkTo: "Tal med",
    eyebrow: "Til flådeindkøb",
    capabilitiesTitle: "Det, større indkøb kræver",
    scaleEyebrow: "Omfang",
    scaleTitle: "Ti, halvtreds og to hundrede maskiner er tre forskellige opgaver",
    scaleLead:
      "Antallet ændrer ikke bare prisen – det ændrer, hvordan indkøbet skal gribes an. Vi holder ikke lager, men skaffer maskinerne per ordre i vores leverandørnetværk, og det er dér, forskellen mellem ti og to hundrede enheder viser sig først.",
    scaleClose:
      "Prisen per enhed følger ikke antallet alene. Den afhænger af model, stand, specifikation og hvad der er tilgængeligt, når I spørger.",
    scaleCloseLink: "Hvad der afgør prisen",
    rolloutEyebrow: "Forløbet",
    rolloutTitle: "Sådan forløber en flådeleverance, uge for uge",
    rolloutLead:
      "Rækkefølgen herunder er den samme hver gang. Hvor lang tid hvert trin tager, er den ikke: det afhænger af antal, specifikation og hvad leverandørnetværket har, når I spørger. Ugerne er derfor vejledende og ikke et tilsagn – men de siger, hvad der skal ske hvornår, og hvornår vi har brug for noget fra jer.",
    tradeEyebrow: "Bytteordning",
    tradeTitle: "Ud med det gamle, ind med det nye – i én aftale",
    tradeBody:
      "Når en virksomhed skifter flåde, står den typisk med to opgaver: at skaffe det nye og at komme af med det gamle. Vi kan håndtere begge dele. Værdien af jeres brugte udstyr kan modregnes i det nye indkøb, så I får én samlet aftale i stedet for to forløb.",
    tradeLink: "Læs mere om, hvad vi køber",
    formTitle: "Send jeres forespørgsel",
    formBody:
      "Jo mere I skriver om antal, ønsket specifikation og tidsramme, jo hurtigere kan vi vende tilbage med noget konkret. Har I en liste over det udstyr, I skal af med, må I meget gerne nævne det – så regner vi på begge dele.",
    faqTitle: "Spørgsmål om større ordrer",
    ctaTitle: "Skal vi regne på jeres flåde?",
    ctaBody:
      "Ring, eller send en forespørgsel med antal og ønsket specifikation – så vender vi tilbage med, hvad vi kan skaffe.",
    ctaButton: "Send forespørgsel",
  },
  en: {
    metaTitle: "Fleet solutions — equip the whole company | Kestro",
    metaDescription:
      "Refurbished business computers in volume: one configuration across the fleet, upgraded memory and the option to trade your old equipment in.",
    badge: "For larger companies",
    title: "Equip the whole company",
    intro:
      "Does every employee need a computer — or does the whole fleet need replacing? We deliver refurbished business machines in volume, with the configuration you choose, and we are happy to take your old equipment in part exchange.",
    sendEnquiry: "Send an enquiry",
    talkTo: "Talk to",
    eyebrow: "For fleet purchases",
    capabilitiesTitle: "What a larger purchase actually needs",
    scaleEyebrow: "Scale",
    scaleTitle: "Ten, fifty and two hundred machines are three different jobs",
    scaleLead:
      "Quantity does not just change the price — it changes how the purchase has to be run. We hold no stock; we source per order through our supplier network, and that is where the difference between ten and two hundred units shows up first.",
    scaleClose:
      "Price per unit does not follow quantity alone. It depends on model, condition, specification and what is available when you ask.",
    scaleCloseLink: "What decides the price",
    rolloutEyebrow: "The process",
    rolloutTitle: "How a fleet delivery runs, week by week",
    rolloutLead:
      "The order below is the same every time. How long each step takes is not: it depends on quantity, specification and what the supplier network has when you ask. The weeks are indicative rather than a commitment — but they say what happens when, and when we need something from you.",
    tradeEyebrow: "Trade-in",
    tradeTitle: "Old out, new in — in one agreement",
    tradeBody:
      "When a company changes its fleet, it usually faces two jobs: getting the new machines and getting rid of the old ones. We can handle both. The value of your used equipment can be offset against the new purchase, so you get one agreement instead of two processes.",
    tradeLink: "Read more about what we buy",
    formTitle: "Send us your enquiry",
    formBody:
      "The more you tell us about quantity, the specification you want and your timing, the faster we can come back with something concrete. If you have a list of the equipment you need to get rid of, mention it — then we can price both sides.",
    faqTitle: "Questions about larger orders",
    ctaTitle: "Shall we price up your fleet?",
    ctaBody:
      "Call, or send an enquiry with quantity and the specification you want — and we will come back with what we can source.",
    ctaButton: "Send enquiry",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/flaadeloesninger", params.lang),
  };
}

const capabilities = [
  {
    icon: Layers,
    title: {
      da: "Ensartet opsætning på tværs af flåden",
      en: "One configuration across the fleet",
    },
    description: {
      da: "Én konfiguration til hele holdet gør support og udrulning enklere. Vi leverer samme model og specifikationer i hele leverancen, så jeres IT-afdeling ikke skal håndtere ti forskellige maskiner.",
      en: "One configuration for the whole team makes support and rollout simpler. We deliver the same model and specification throughout, so your IT people are not handling ten different machines.",
    },
  },
  {
    icon: Cpu,
    title: {
      da: "Specifikationer tilpasset opgaven",
      en: "Specifications matched to the work",
    },
    description: {
      da: "I bestemmer niveauet: mere RAM til de tunge brugere, større SSD, bedre skærm. Vi kan også prioritere modeller, der er nemme at opgradere senere, så maskinen kan følge med i flere år.",
      en: "You set the level: more memory for the heavy users, a larger disk, a better screen. We can also favour models that are easy to upgrade later, so the machine keeps up for a few more years.",
    },
  },
  {
    icon: Users,
    title: {
      da: "Fra enkelte teams til hele virksomheden",
      en: "From a single team to the whole company",
    },
    description: {
      da: "Om det er ti maskiner til et nyt team eller udskiftning af hele medarbejderflåden, tilpasser vi sourcingen til antallet. Fortæl os omfanget, så vender vi tilbage med, hvad vi kan skaffe.",
      en: "Whether it is ten machines for a new team or replacing the entire staff fleet, we scale the sourcing to the quantity. Tell us the scope and we will come back with what we can get.",
    },
  },
  {
    icon: MonitorCog,
    title: { da: "Windows, software og licenser", en: "Windows, software and licences" },
    description: {
      da: "Maskinerne leveres med Windows installeret, drivere på plads og dansk sprogopsætning. Vi hjælper med at få licenserne i orden – eller bruger jeres eksisterende aftaler – så flåden kører lovligt fra dag ét.",
      en: "Machines arrive with Windows installed, drivers in place and the right language settings. We help get the licences in order — or work with the agreements you already have — so the fleet runs legally from day one.",
    },
  },
  {
    icon: Keyboard,
    title: {
      da: "Nordisk tastatur i hele leverancen",
      en: "A Nordic keyboard across the delivery",
    },
    description: {
      da: "Importerede maskiner får skiftet tastatur til dansk/nordisk layout, så medarbejderne ikke skal lede efter æ, ø og å på maskiner købt i udlandet.",
      en: "Imported machines get their keyboard changed to a Danish or Norwegian layout, so nobody has to hunt for æ, ø and å on a machine bought abroad.",
    },
  },
  {
    icon: CalendarClock,
    title: {
      da: "Løbende leverance til nye medarbejdere",
      en: "Ongoing supply for new employees",
    },
    description: {
      da: "Vokser I, kan vi holde en aftalt konfiguration ved lige, så nye medarbejdere får samme opsætning som resten – uden at I skal starte forfra med et indkøb hver gang.",
      en: "As you grow, we can keep an agreed configuration on file, so new employees get the same setup as everyone else — without you starting a purchase from scratch each time.",
    },
  },
];

/*
 * What actually changes with quantity.
 *
 * The page promised "from a single team to the whole company" in two
 * sentences. For a buyer who has to defend the purchase internally, the
 * useful answer is not that we scale — it is what gets harder, and where the
 * decision moves. Sourcing per order rather than from stock is exactly where
 * ten units and two hundred stop being the same job.
 */
/*
 * The one conversion target, with the volume band preselected.
 *
 * Step 3, rule 5: every CTA goes to /tilbud, and this page's goes there with
 * ?antal=50%2B. ContactForm already reads the parameter and prefills the
 * select — the link was simply never pointed at it. The buyer can still
 * change the band; this only saves the click for the reader this page is
 * written for.
 */
const QUOTE_HREF = "/tilbud?antal=50%2B";

const scaleTiers = [
  {
    range: { da: "Op til omkring 10 enheder", en: "Up to around 10 units" },
    body: {
      da: "Én model i ét parti er som regel til at finde, og hele leverancen kan komme på én gang. Her handler det mest om at ramme den rigtige specifikation: hvad skal maskinen bruges til, og hvor længe skal den holde. En udskiftning af firmacomputere i den størrelse kan klares uden en egentlig projektplan.",
      en: "One model in a single batch is usually findable, and the whole delivery can arrive at once. At this size it is mostly about getting the specification right: what the machine is for, and how long it has to last. Replacing company computers at that scale does not need a project plan.",
    },
  },
  {
    range: { da: "Omkring 20-50 enheder", en: "Around 20-50 units" },
    body: {
      da: "Her begynder ensartetheden at koste noget. Et parti på halvtreds ens maskiner med samme byggeår findes ikke altid, og så står valget mellem at vente, at betale mere, eller at acceptere to nært beslægtede modeller. Vi siger, hvad der reelt kan skaffes, før I binder jer. Samtidig bliver listen over serienumre og den gamle flåde en opgave i sig selv.",
      en: "This is where uniformity starts to cost something. A batch of fifty identical machines from the same build year is not always out there, and the choice becomes: wait, pay more, or accept two closely related models. We tell you what can actually be sourced before you commit. At the same time, the serial-number list and the old fleet turn into a job of their own.",
    },
  },
  {
    range: { da: "50-200+ enheder", en: "50-200+ units" },
    body: {
      da: "Et indkøb i den størrelse løber typisk over flere leverandører og over tid, og leverancen deles næsten altid op i hold. Konfigurationen skal låses tidligt – ændrer den sig undervejs, begynder sourcingen forfra på resten. Til gengæld er det her, en fast aftalt opsætning tjener sig hjem: support på to hundrede ens maskiner er en anden opgave end support på to hundrede forskellige.",
      en: "A purchase that size usually runs across several suppliers and over time, and the delivery is nearly always split into batches. The configuration has to be locked early — change it midway and sourcing starts again on whatever is left. In return, this is where an agreed setup pays for itself: supporting two hundred identical machines is a different job from supporting two hundred different ones.",
    },
  },
];

/*
 * The order of a fleet delivery.
 *
 * The weeks are labels for sequence, not a delivery promise — sourcing per
 * order means the duration genuinely depends on what the network has that
 * week. Saying so on the page is better than a number we would have to walk
 * back on the first order that took longer.
 */
const rolloutPhases = [
  {
    when: { da: "Uge 1 · Afklaring", en: "Week 1 · Scoping" },
    body: {
      da: "Vi taler antal, brugstyper og deadline igennem: hvor mange maskiner, til hvilket arbejde, og hvornår de skal stå på bordene. Har I udstyr, der skal væk samtidig, hører vi om det nu frem for til sidst. Ud af det kommer én specifikation, vi begge kan læse.",
      en: "We go through quantity, user types and deadline: how many machines, for what work, and when they have to be on the desks. If you have equipment that needs to go at the same time, we hear about it now rather than at the end. What comes out is one specification we can both read.",
    },
  },
  {
    when: { da: "Uge 1-2 · Sourcing og tilbud", en: "Week 1-2 · Sourcing and quote" },
    body: {
      da: "Vi søger i leverandørnetværket og vender tilbage med det, der faktisk kan skaffes: model, stand, antal, pris per enhed og leveringstid. Kan specifikationen ikke fyldes i det antal, siger vi det og foreslår det nærmeste alternativ i stedet for at love noget, der ikke findes.",
      en: "We search the supplier network and come back with what can actually be sourced: model, condition, quantity, price per unit and delivery time. If the specification cannot be filled at that quantity, we say so and propose the closest alternative rather than promising something that is not there.",
    },
    link: {
      href: "/ydelser/sourcing-og-indkoeb",
      label: { da: "Sådan arbejder vi med sourcing", en: "How we work with sourcing" },
    },
  },
  {
    when: { da: "Efter accept · Klargøring", en: "After acceptance · Preparation" },
    body: {
      da: "Vi tester og klargør maskinerne: RAM og lagring bringes op på det aftalte, Windows, drivere og sprogopsætning kommer på plads, og tastaturerne skiftes til nordisk layout. Skal I bruge en liste over serienumre til jeres aktivregister, aftaler vi det her – ikke efter levering.",
      en: "We test and prepare the machines: memory and storage are brought up to what was agreed, Windows, drivers and language settings are put in place, and the keyboards are changed to a Nordic layout. If you need a serial-number list for your asset register, we agree that here — not after delivery.",
    },
    link: {
      href: "/ydelser/klargoering-og-test",
      label: { da: "Hvad klargøringen omfatter", en: "What preparation covers" },
    },
  },
  {
    when: { da: "Levering", en: "Delivery" },
    body: {
      da: "Leverancen kommer enten samlet eller i hold. Ved større ordrer er hold som regel det rigtige: I kan begynde at rulle ud på den første portion, mens resten er på vej, i stedet for at vente på, at alt er klar på én gang.",
      en: "The delivery arrives either in one go or in batches. On larger orders batches are usually right: you can start rolling out the first portion while the rest is on its way, instead of waiting for everything to be ready at once.",
    },
    link: {
      href: "/ydelser/levering",
      label: { da: "Levering til virksomheden", en: "Delivery to the company" },
    },
  },
  {
    when: {
      da: "Efter levering · Det gamle og det næste",
      en: "After delivery · The old and the next",
    },
    body: {
      da: "Vi kan hente det gamle udstyr og slette lagermedierne, og værdien kan modregnes i indkøbet. Vokser I videre, kan den aftalte konfiguration holdes ved lige, så den næste medarbejder får samme maskine som resten.",
      en: "We can collect the old equipment and erase the storage media, and the value can be offset against the purchase. If you keep growing, the agreed configuration can be kept on file, so the next employee gets the same machine as everyone else.",
    },
    link: {
      href: "/ydelser/opstart-af-arbejdspladser",
      label: { da: "Opstart af nye arbejdspladser", en: "Setting up new workstations" },
    },
  },
];

const tradeInSteps = [
  {
    title: { da: "I sender en oversigt", en: "You send an overview" },
    description: {
      da: "Antal enheder, modeller og cirka alder på det, I skal af med – og hvad I har brug for i stedet.",
      en: "Quantity, models and rough age of what you need to move on — and what you need instead.",
    },
  },
  {
    title: { da: "Vi regner begge veje", en: "We price both sides" },
    description: {
      da: "I får både et bud på jeres gamle udstyr og en pris på det nye. Værdien af det gamle kan modregnes i det nye indkøb.",
      en: "You get both an offer on your old equipment and a price on the new. The value of the old can be offset against the new purchase.",
    },
  },
  {
    title: { da: "Afhentning og datasletning", en: "Collection and data erasure" },
    description: {
      da: "Vi henter det gamle udstyr og sletter data på lagermedierne, før enhederne klargøres til videresalg. Skal I bruge dokumentation for sletningen, aftaler vi det på forhånd.",
      en: "We collect the old equipment and erase the storage media before the machines are prepared for resale. If you need documentation of the erasure, we agree that up front.",
    },
  },
  {
    title: { da: "Levering af den nye flåde", en: "Delivery of the new fleet" },
    description: {
      da: "De nye maskiner leveres testet og klargjort med dansk/nordisk tastatur, klar til udlevering.",
      en: "The new machines arrive tested and prepared with a Nordic keyboard, ready to hand out.",
    },
  },
];

const enterpriseFaqs = [
  {
    question: { da: "Hvor mange enheder kan I levere?", en: "How many machines can you deliver?" },
    answer: {
      da: "Vi sourcer til den enkelte ordre frem for at sælge fra et fast lager, så antallet afhænger af, hvad der kan skaffes til den ønskede specifikation og tidsramme. Fortæl os omfanget, så melder vi konkret tilbage på, hvad vi kan levere og hvornår.",
      en: "We source per order rather than selling from fixed stock, so the number depends on what can be found at the specification and timing you want. Tell us the scope and we come back concretely on what we can deliver and when.",
    },
  },
  {
    question: {
      da: "Kan vi få samme model til alle medarbejdere?",
      en: "Can we get the same model for everyone?",
    },
    answer: {
      da: "Ja, det er typisk det, større kunder ønsker. Vi går efter én konfiguration i hele leverancen, så support og udrulning bliver enklere. Er en enkelt model ikke tilgængelig i det antal, foreslår vi nærmeste alternativ, før vi går videre.",
      en: "Yes, and it is usually what larger customers want. We aim for one configuration across the delivery, which makes support and rollout simpler. If a single model is not available in that quantity, we propose the closest alternative before going ahead.",
    },
  },
  {
    question: {
      da: "Kan vi selv bestemme RAM og lagring?",
      en: "Can we choose the memory and storage?",
    },
    answer: {
      da: "Ja. Vi opgraderer RAM og kan tilpasse lagring efter jeres behov. Skal maskinerne kunne opgraderes yderligere senere, prioriterer vi modeller, hvor det er muligt – sig til, hvis det er et krav.",
      en: "Yes. We upgrade memory and can match storage to what you need. If the machines have to be upgradable further down the line, we favour models where that is possible — say so if it is a requirement.",
    },
  },
  {
    question: {
      da: "Kan vi bytte vores gamle udstyr ind?",
      en: "Can we trade our old equipment in?",
    },
    answer: {
      da: "Ja. Vi køber brugt erhvervsudstyr, og værdien kan modregnes i et nyt indkøb, så I både slipper for det gamle og får det nye i én aftale.",
      en: "Yes. We buy used business equipment, and the value can be offset against a new purchase, so the old goes and the new arrives under one agreement.",
    },
  },
  {
    question: {
      da: "Laver I løbende aftaler frem for enkeltordrer?",
      en: "Do you do ongoing agreements rather than one-off orders?",
    },
    answer: {
      da: "Ja, det kan vi aftale. Har I løbende behov – f.eks. maskiner til nye medarbejdere – kan vi holde en fast konfiguration ved lige, så I ikke skal specificere det forfra hver gang.",
      en: "Yes, that can be arranged. If you have a continuing need — machines for new employees, for instance — we can keep a fixed configuration on file so you do not have to specify it again each time.",
    },
  },
  {
    question: {
      da: "Leveres maskinerne med Windows og licenser?",
      en: "Do the machines come with Windows and licences?",
    },
    answer: {
      da: "Ja. Maskinerne kan leveres med Windows installeret, drivere og dansk sprogopsætning. Har I egne licensaftaler eller et image, I ruller ud, bruger vi dem – ellers hjælper vi med at få licenserne på plads, så flåden kører lovligt.",
      en: "Yes. Machines can arrive with Windows installed, drivers and the right language settings. If you have your own licence agreements or an image you roll out, we use those — otherwise we help get the licences in place so the fleet runs legally.",
    },
  },
  {
    question: {
      da: "Kan I skifte tastaturet til dansk layout på hele leverancen?",
      en: "Can you change the keyboard to a Nordic layout across the delivery?",
    },
    answer: {
      da: "Ja. Det er en fast del af klargøringen, når maskinerne kommer fra udlandet – så medarbejderne ikke skal lede efter æ, ø og å.",
      en: "Yes. It is a standard part of the preparation when machines come from abroad — so nobody has to hunt for æ, ø and å.",
    },
  },
  {
    question: {
      da: "Hvad sker der, hvis behovet ændrer sig undervejs?",
      en: "What happens if the requirement changes along the way?",
    },
    answer: {
      da: "Sig til så tidligt som muligt. Er sourcingen ikke afsluttet, kan vi som regel justere antal eller specifikation undervejs. Er en del af leverancen allerede skaffet, gælder ændringen den resterende del – og vi siger klart, hvad der kan nås, og hvad der ikke kan.",
      en: "Tell us as early as you can. If the sourcing is not finished, we can usually adjust quantity or specification along the way. If part of the delivery has already been sourced, the change applies to what is left — and we say clearly what can still be done and what cannot.",
    },
  },
  {
    question: {
      da: "Kan leverancen deles op i flere hold?",
      en: "Can the delivery be split into batches?",
    },
    answer: {
      da: "Ja, og ved større ordrer er det ofte det bedste. I kan rulle ud på den første portion, mens resten skaffes, i stedet for at vente på, at hele flåden er samlet.",
      en: "Yes, and on larger orders it is often the better way. You can roll out the first portion while the rest is sourced, rather than waiting for the whole fleet to be assembled.",
    },
  },
  {
    question: { da: "Hvad med garanti og fakturering?", en: "What about warranty and invoicing?" },
    answer: {
      da: "Garantivilkår og betalingsbetingelser aftaler vi ud fra ordrens omfang. Vi gennemgår det med jer, før I binder jer til noget.",
      en: "Warranty terms and payment terms are agreed from the size of the order. We go through it with you before you commit to anything.",
    },
  },
];

export default function FlaadeloesningerPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];
  const salesContact = primaryContact(lang);

  /* Marked up from the same array <Faq> renders, so the answers Google reads
     and the answers on the page are the same text by construction. Same
     inline approach as /priser and /maskinen. */
  return (
    <>
      <section className="bg-brand-950 py-14 text-white sm:py-20 lg:py-24">
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[
              {
                name: lang === "da" ? "Flådeløsninger" : "Fleet solutions",
                href: "/flaadeloesninger",
              },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center border border-paper/25 bg-white/5 px-4 py-1.5 text-xs font-medium text-ink-200 sm:text-sm">
              {c.badge}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {c.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-ink-300 sm:text-lg">{c.intro}</p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href={localePath(QUOTE_HREF, lang)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-950 transition hover:bg-paper-dim"
              >
                {c.sendEnquiry}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              {salesContact.phoneHref && (
                <a
                  href={`tel:${salesContact.phoneHref}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" strokeWidth={2} />
                  {salesContact.phoneDisplay}
                </a>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-ink-400">
              <TeamAvatar member={salesContact} lang={lang} size={40} className="h-10 w-10" />
              <span>
                {c.talkTo} <span className="font-semibold text-white">{salesContact.name}</span>,{" "}
                {salesContact.role[lang].toLowerCase()}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.capabilitiesTitle}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item.title.da}
                className="flex gap-4 border border-white/10 bg-white/[0.04] p-5 sm:block sm:p-8"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300 sm:h-11 sm:w-11">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-paper sm:mt-4">{item.title[lang]}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-paper/65 sm:mt-2">
                    {item.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <span className="eyebrow text-brand-300">{c.scaleEyebrow}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.scaleTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.scaleLead}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {scaleTiers.map((tier) => (
              <div
                key={tier.range.da}
                className="border border-white/10 bg-white/[0.04] p-5 sm:p-8"
              >
                <h3 className="text-base font-semibold text-paper">{tier.range[lang]}</h3>
                <p className="mt-2 text-sm leading-6 text-paper/65">{tier.body[lang]}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-2xl">
            <p className="text-base leading-7 text-paper/65">{c.scaleClose}</p>
            <Link
              href={localePath("/priser", lang)}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
            >
              {c.scaleCloseLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="eyebrow text-brand-300">{c.rolloutEyebrow}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.rolloutTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.rolloutLead}</p>

            <ol className="mt-10 space-y-6">
              {rolloutPhases.map((phase, i) => (
                <li key={phase.when.da} className="flex gap-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-paper">{phase.when[lang]}</h3>
                    <p className="mt-1 text-base leading-7 text-paper/65">{phase.body[lang]}</p>
                    {phase.link && (
                      <Link
                        href={localePath(phase.link.href, lang)}
                        className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
                      >
                        {phase.link.label[lang]}
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="eyebrow text-brand-300">{c.tradeEyebrow}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.tradeTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-paper/65">{c.tradeBody}</p>

            <ol className="mt-10 space-y-6">
              {tradeInSteps.map((step, i) => (
                <li key={step.title.da} className="flex gap-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-paper">{step.title[lang]}</h3>
                    <p className="mt-1 text-base leading-7 text-paper/65">
                      {step.description[lang]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href={localePath("/saelg-til-os", lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
            >
              {c.tradeLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      <div className="border-t border-white/10">
        <Faq
          lang={lang}
          items={enterpriseFaqs}
          title={{ da: copy.da.faqTitle, en: copy.en.faqTitle }}
        />
      </div>

      <section className="relative overflow-hidden bg-brand-950 py-10 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-950/20 blur-3xl"
        />
        <Container className="relative flex flex-col items-center gap-5 text-center">
          <Repeat className="h-8 w-8 text-brand-400" strokeWidth={1.75} />
          <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {c.ctaTitle}
          </h2>
          <p className="max-w-xl text-base leading-7 text-ink-400">{c.ctaBody}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            {/* Only when there is a number. Without the guard this rendered a
                filled blue pill with a phone icon, no label and href="tel:" —
                the loudest button on the page, doing nothing. */}
            {salesContact.phoneHref && (
              <a
                href={`tel:${salesContact.phoneHref}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <Phone className="h-4 w-4" strokeWidth={2} />
                {salesContact.phoneDisplay}
              </a>
            )}
            <Link
              href={localePath(QUOTE_HREF, lang)}
              className={
                salesContact.phoneHref
                  ? "inline-flex items-center justify-center border border-paper/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  : "inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              }
            >
              {c.ctaButton}
            </Link>
          </div>
        </Container>
      </section>

      <RelatedLinks
        lang={lang}
        links={[
          {
            href: "/ydelser/opstart-af-arbejdspladser",
            label: { da: "Opstart af nye arbejdspladser", en: "Setting up new workstations" },
          },
          {
            href: "/ydelser/levering",
            label: { da: "Levering til virksomheden", en: "Delivery to the company" },
          },
          {
            href: "/kvalitet",
            label: { da: "Stand, test og garanti", en: "Condition, testing and warranty" },
          },
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import MarkTile from "@/components/MarkTile";
import HeaderArt from "@/components/HeaderArt";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Container from "@/components/Container";
import { type CraftMarkName } from "@/components/CraftMark";
import ForgedPanel from "@/components/ForgedPanel";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedLinks from "@/components/RelatedLinks";
import TeamAvatar from "@/components/TeamAvatar";
import Faq from "@/components/Faq";
import { primaryContact } from "@/lib/company";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";
import { buttonClass } from "@/components/Button";
import FleetRollout from "@/components/FleetRollout";

const copy = {
  da: {
    metaTitle: "Computere til medarbejdere – én model, én levering | Kestro",
    metaDescription:
      "Fra ti maskiner til hele virksomheden: samme konfiguration hele vejen rundt, samlet levering og de gamle maskiner hentet retur. Ét samlet tilbud.",
    badge: "Til større virksomheder",
    title: "Udstyr hele virksomheden",
    intro:
      "Skal alle medarbejdere have en computer – eller skal hele flåden skiftes ud? Vi leverer renoverede erhvervsmaskiner i større antal, med den opsætning I vælger, og tager gerne jeres gamle udstyr i bytte.",
    sendEnquiry: "Send en forespørgsel",
    talkTo: "Tal med",
    capabilitiesTitle: "Det, større indkøb kræver",
    scaleTitle: "Ti, halvtreds og to hundrede maskiner er tre forskellige opgaver",
    scaleLead:
      "Antallet ændrer ikke kun prisen, men også, hvordan indkøbet gribes an – fordi vi skaffer maskinerne til hver ordre i stedet for at sælge fra lager.",
    scaleClose:
      "Prisen per enhed afhænger af model, stand og specifikation, og af, hvad der kan skaffes – ikke af antallet alene.",
    scaleCloseLink: "Hvad der afgør prisen",
    rolloutTitle: "Sådan forløber en flådeleverance, uge for uge",
    rolloutLead:
      "Rækkefølgen er den samme hver gang. Ugerne er vejledende, fordi de afhænger af antal og specifikation, og af, hvad leverandørnetværket har.",
    tradeTitle: "Ud med det gamle, ind med det nye – i én aftale",
    tradeBody:
      "Vi kan købe jeres gamle udstyr og modregne værdien i det nye indkøb – én aftale i stedet for to forløb.",
    tradeLink: "Læs mere om, hvad vi køber",
    faqTitle: "Spørgsmål om større ordrer",
    ctaTitle: "Skal vi regne på jeres flåde?",
    ctaBody:
      "Send en forespørgsel med antal og ønsket specifikation, så vender vi tilbage med, hvad vi kan skaffe.",
    ctaButton: "Send forespørgsel",
  },
  en: {
    metaTitle: "Business computers in bulk — fleet solutions | Kestro",
    metaDescription:
      "From ten machines to the whole company: one configuration across the fleet, a single delivery and the old machines collected. All of it in one quote.",
    badge: "For larger companies",
    title: "Equip the whole company",
    intro:
      "Does every employee need a computer — or does the whole fleet need replacing? We deliver refurbished business machines in volume, with the configuration you choose, and we are happy to take your old equipment in part exchange.",
    sendEnquiry: "Send an enquiry",
    talkTo: "Talk to",
    capabilitiesTitle: "What a larger purchase actually needs",
    scaleTitle: "Ten, fifty and two hundred machines are three different jobs",
    scaleLead:
      "Quantity changes not just the price but how the purchase is run — because we source the machines for each order rather than selling from stock.",
    scaleClose:
      "Price per unit depends on model, condition, specification and what can be sourced — not on quantity alone.",
    scaleCloseLink: "What decides the price",
    rolloutTitle: "How a fleet delivery runs, week by week",
    rolloutLead:
      "The order is the same every time. The weeks are indicative, because they depend on quantity, specification and what the supplier network has.",
    tradeTitle: "Old out, new in — in one agreement",
    tradeBody:
      "We can buy your old equipment and offset its value against the new purchase — one agreement instead of two processes.",
    tradeLink: "Read more about what we buy",
    faqTitle: "Questions about larger orders",
    ctaTitle: "Shall we price up your fleet?",
    ctaBody:
      "Send an enquiry with quantity and the specification you want, and we will come back with what we can source.",
    ctaButton: "Send enquiry",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/flaadeloesninger", params.lang),
  };
}

const capabilities = [
  {
    mark: "batch" as CraftMarkName,
    title: {
      da: "Ensartet opsætning på tværs af flåden",
      en: "One configuration across the fleet",
    },
    description: {
      da: "Samme model og specifikation i hele leverancen, så IT-afdelingen supporterer én maskine – ikke ti.",
      en: "The same model and specification throughout, so IT supports one machine, not ten.",
    },
  },
  {
    mark: "assembly" as CraftMarkName,
    title: {
      da: "Specifikationer tilpasset opgaven",
      en: "Specifications matched to the work",
    },
    description: {
      da: "Mere RAM til de tunge brugere, større SSD, bedre skærm – og gerne modeller, der kan opgraderes senere.",
      en: "More memory for the heavy users, a larger SSD, a better screen — and models that can be upgraded later.",
    },
  },
  {
    mark: "install" as CraftMarkName,
    title: { da: "Windows, software og licenser", en: "Windows, software and licences" },
    description: {
      da: "Windows, drivere og dansk sprogopsætning på plads. Vi bruger jeres licensaftaler eller hjælper med nye.",
      en: "Windows, drivers and language settings in place. We use your licence agreements or help with new ones.",
    },
  },
  {
    mark: "nordic" as CraftMarkName,
    title: {
      da: "Nordisk tastatur i hele leverancen",
      en: "Danish or Norwegian keyboards across the delivery",
    },
    description: {
      da: "Tastaturet skiftes til dansk eller norsk layout på hver maskine, der kommer fra udlandet.",
      en: "The keyboard is changed to a Danish or Norwegian layout on every machine that comes from abroad.",
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
      da: "Én model i ét parti er som regel til at finde, og alt kan leveres på én gang. Det handler mest om at ramme den rigtige specifikation.",
      en: "One model in one batch is usually findable, and everything can arrive at once. It is mostly about getting the specification right.",
    },
  },
  {
    range: { da: "Omkring 10–50 enheder", en: "Around 10–50 units" },
    body: {
      da: "Halvtreds ens maskiner fra samme byggeår findes ikke altid. Så står valget mellem at vente, betale mere eller tage to nært beslægtede modeller – og I får at vide, hvad der reelt kan skaffes, før I binder jer.",
      en: "Fifty identical machines from the same build year are not always out there. Then the choice is to wait, pay more or take two closely related models — and you hear what can actually be sourced before you commit.",
    },
  },
  {
    range: { da: "50–200+ enheder", en: "50–200+ units" },
    body: {
      da: "Indkøbet løber over flere leverandører, og leverancen deles i hold, så konfigurationen låses tidligt. Til gengæld er support på to hundrede ens maskiner en helt anden opgave end på to hundrede forskellige.",
      en: "Sourcing runs across several suppliers and the delivery is split into batches, so the configuration is locked early. In return, supporting two hundred identical machines is a different job from two hundred different ones.",
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
      da: "Antal, brugstyper og deadline – og om gammelt udstyr skal væk samtidig. Ud af det kommer én specifikation, vi begge kan læse.",
      en: "Quantity, user types and deadline — and whether old equipment has to go at the same time. Out of it comes one specification we can both read.",
    },
  },
  {
    when: { da: "Uge 1–2 · Sourcing og tilbud", en: "Week 1–2 · Sourcing and quote" },
    body: {
      da: "Vi vender tilbage med det, der faktisk kan skaffes: model, stand, antal, pris per enhed og leveringstid – eller det nærmeste alternativ.",
      en: "We come back with what can actually be sourced: model, condition, quantity, price per unit and delivery time — or the closest alternative.",
    },
    link: {
      href: "/ydelser/sourcing-og-indkoeb",
      label: { da: "Sådan arbejder vi med sourcing", en: "How we work with sourcing" },
    },
  },
  {
    when: { da: "Efter accept · Klargøring", en: "After acceptance · Preparation" },
    body: {
      da: "Test, RAM og lagring efter aftale, Windows og drivere, dansk eller norsk tastatur. Skal I bruge en serienummerliste til aktivregistret, aftales den her.",
      en: "Testing, memory and storage as agreed, Windows and drivers, a Danish or Norwegian keyboard. If you need a serial-number list for the asset register, it is agreed here.",
    },
    link: {
      href: "/ydelser/klargoering-og-test",
      label: { da: "Hvad klargøringen omfatter", en: "What preparation covers" },
    },
  },
  {
    when: { da: "Levering", en: "Delivery" },
    body: {
      da: "Samlet eller i hold. Ved større ordrer kan I rulle ud på den første portion, mens resten er på vej.",
      en: "In one go or in batches. On larger orders you can roll out the first portion while the rest is on its way.",
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
      da: "Vi kan hente det gamle udstyr, slette lagermedierne og modregne værdien. Den aftalte konfiguration kan holdes ved lige til nye medarbejdere.",
      en: "We can collect the old equipment, erase the storage and offset its value. The agreed configuration can be kept on file for new employees.",
    },
    link: {
      href: "/ydelser/opstart-af-arbejdspladser",
      label: { da: "Opstart af nye arbejdspladser", en: "Setting up new workstations" },
    },
  },
];

const enterpriseFaqs = [
  {
    question: { da: "Kan vi købe bærbare i større antal?", en: "Can we buy laptops in bulk?" },
    answer: {
      da: "Ja – bærbare, stationære og skærme. Vi skaffer maskinerne til den enkelte ordre frem for at sælge fra et fast lager, så antallet afhænger af, hvad der kan skaffes til den ønskede specifikation og tidsramme. Fortæl os omfanget, så melder vi konkret tilbage på, hvad vi kan levere og hvornår.",
      en: "Yes – laptops, desktops and monitors. We source per order rather than selling from fixed stock, so the number depends on what can be found at the specification and timing you want. Tell us the scope and we come back concretely on what we can deliver and when.",
    },
  },
  {
    question: {
      da: "Kan vi få samme model til alle medarbejdere?",
      en: "Can we get the same model for everyone?",
    },
    answer: {
      da: "Ja, det er typisk det, større kunder ønsker. Vi går efter én konfiguration i hele leverancen, så support og udrulning bliver enklere. Er en enkelt model ikke tilgængelig i det antal, foreslår vi det nærmeste alternativ, før vi går videre.",
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
      da: "Sig til så tidligt som muligt. Er indkøbet ikke afsluttet, kan vi som regel justere antal eller specifikation undervejs. Er en del af leverancen allerede skaffet, gælder ændringen den resterende del – og vi siger klart, hvad der kan nås, og hvad der ikke kan.",
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

export default async function FlaadeloesningerPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const salesContact = primaryContact(lang);

  /* Marked up from the same array <Faq> renders, so the answers Google reads
     and the answers on the page are the same text by construction. Same
     inline approach as /priser and /maskinen. */
  return (
    <>
      <PageSchema lang={lang} route="/flaadeloesninger" />

      {/* Left-aligned on the type scale like every other page header. This
          was the one page with a centred hero, a pill badge and its own
          h1 sizes (3xl/4xl/5xl), so it read as a landing page bolted onto
          the site rather than a page of it. */}
      <section className="bg-brand-950 py-12 text-white max-md:-mt-[65px] max-md:pt-0 sm:py-16">
        <Container>
          {/* The fleet room beside the text from lg. On a phone it is the
              header's ground under the glass bar, and the trail, title, lead
              and both actions sit on glass over its foot. The trail lives in
              the text column so that the room can come first on a phone. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-14">
            <div className="glass-card relative z-10 max-w-3xl max-md:-mt-14 lg:col-span-7">
              <Breadcrumbs
                lang={lang}
                trail={[
                  {
                    name: lang === "da" ? "Flådeløsninger" : "Fleet solutions",
                    href: "/flaadeloesninger",
                  },
                ]}
                className="mb-6 sm:mb-8"
              />
              <p className="label text-brand-300">{c.badge}</p>
              <h1 className="mt-3 text-balance font-display t-h1 font-extrabold tracking-display text-paper">
                {c.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.65] text-paper/85 sm:text-lg sm:leading-[1.65]">
                {c.intro}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href={localePath(QUOTE_HREF, lang)} className={buttonClass("primary")}>
                  {c.sendEnquiry}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                {salesContact.phoneHref && (
                  <a href={`tel:${salesContact.phoneHref}`} className={buttonClass("primary")}>
                    <Phone className="h-4 w-4" strokeWidth={2} />
                    {salesContact.phoneDisplay}
                  </a>
                )}
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm text-paper/75">
                <TeamAvatar member={salesContact} lang={lang} size={40} className="h-10 w-10" />
                <span>
                  {c.talkTo} <span className="font-semibold text-white">{salesContact.name}</span>,{" "}
                  {salesContact.role[lang].toLowerCase()}
                </span>
              </div>
            </div>

            <HeaderArt
              src="/cards/fleet-scene.webp"
              width={1536}
              height={1024}
              alt={
                lang === "da"
                  ? "Et lokale med ens klargjorte bærbare computere stillet op på borde"
                  : "A room of identical prepared laptops set out on desks"
              }
              className="mt-10 aspect-[3/2] lg:col-span-5 lg:mt-12 lg:self-center"
              bleed
            />
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.capabilitiesTitle}
            </h2>
          </div>

          {/* Panels, not cards: these describe what the service covers and
              there is nowhere for them to go. ForgedPanel without an href is
              static — no tilt, no pointer light — because a card that lifts
              when you point at it is saying it is clickable. */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {capabilities.map((item) => (
              /* Mark beside the heading, as on every other card on the site:
                 a large tile stacked on top of each of six panels was the
                 icon-tile grid in its plainest form. */
              <ForgedPanel key={item.title.da} faceClassName="p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <MarkTile name={item.mark} size="md" className="flex-none" />
                  <div className="min-w-0">
                    <h3 className="font-display t-h3 font-bold tracking-tight text-paper">
                      {item.title[lang]}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.65] text-paper/75">
                      {item.description[lang]}
                    </p>
                  </div>
                </div>
              </ForgedPanel>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.scaleTitle}
            </h2>
            <p className="mt-4 text-base leading-[1.75] text-paper/75">{c.scaleLead}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {scaleTiers.map((tier) => (
              <div key={tier.range.da} className="plate p-5 sm:p-8">
                <h3 className="text-base font-semibold text-paper">{tier.range[lang]}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-paper/75">{tier.body[lang]}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-2xl">
            <p className="text-base leading-[1.75] text-paper/75">{c.scaleClose}</p>
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

      <FleetRollout
        lang={lang}
        title={c.rolloutTitle}
        lead={c.rolloutLead}
        phases={rolloutPhases}
      />

      <section className="pb-10 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            {/* Trade-in in one sentence. Its four steps were a full band of
              their own, repeating step 5 above and the question below; the
              process lives on /saelg-til-os. */}
            <div className="mt-12 max-w-3xl rounded-2xl border border-brand-400/25 bg-brand-500/10 p-6 sm:p-8">
              <h2 className="text-balance font-display t-h3 font-bold tracking-tight text-paper">
                {c.tradeTitle}
              </h2>
              <p className="mt-2 text-base leading-[1.75] text-paper/75">{c.tradeBody}</p>
              <Link
                href={localePath("/saelg-til-os", lang)}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 hover:text-paper"
              >
                {c.tradeLink}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
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

      {/* Onward links and sources before the closing band, as on every other
          page: the last thing above the footer is the request, not a list of
          citations after it. */}
      <RelatedLinks
        lang={lang}
        links={[
          /* Not the two the steps above already link with the same words:
             one anchor twice to one page is a wasted link (mak rule 9). */
          {
            href: "/tilbud-eksempel",
            label: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
          },
          {
            href: "/ydelser/nordisk-tilpasning",
            label: { da: "Dansk og norsk tastatur", en: "Danish and Norwegian keyboards" },
          },
          {
            href: "/kvalitet",
            label: { da: "Stand, test og garanti", en: "Condition, testing and warranty" },
          },
          {
            href: "/vejledninger/standardiser-firmacomputere",
            label: {
              da: "Sådan standardiserer I firmaets computere",
              en: "How to standardise your company's computers",
            },
          },
          {
            href: "/ydelser",
            label: {
              da: "Alle ydelser fra indkøb til opstart",
              en: "Every service, from sourcing to setup",
            },
          },
        ]}
      />

      {/* Lit by the site's own wash rather than a blurred orb, which was
          bg-brand-950 on bg-brand-950 and drew nothing. */}
      <section className="lit overflow-hidden bg-brand-950 py-10 sm:py-20">
        {/* Left-aligned like the closing band on every other page, and
            without the centred icon tile on top — that one tile was the
            only centred mark-over-heading left on the site. */}
        <Container className="relative flex flex-col items-start gap-5">
          <h2 className="max-w-2xl text-balance font-display t-display font-extrabold tracking-display text-paper">
            {c.ctaTitle}
          </h2>
          <p className="max-w-xl text-base leading-[1.75] text-paper/75">{c.ctaBody}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            {/* Only when there is a number. Without the guard this rendered a
                filled blue pill with a phone icon, no label and href="tel:" —
                the loudest button on the page, doing nothing. */}
            {salesContact.phoneHref && (
              <a href={`tel:${salesContact.phoneHref}`} className={buttonClass("primary")}>
                <Phone className="h-4 w-4" strokeWidth={2} />
                {salesContact.phoneDisplay}
              </a>
            )}
            <Link
              href={localePath(QUOTE_HREF, lang)}
              className={salesContact.phoneHref ? buttonClass("secondary") : buttonClass("primary")}
            >
              {c.ctaButton}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

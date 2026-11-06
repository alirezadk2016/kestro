import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { company, postalAddress } from "@/lib/company";
import { localePath, metaFor, type Lang, type Localized, formatDate } from "@/lib/i18n";
import { legalUpdated } from "@/lib/legal";
import PageSchema from "@/components/PageSchema";
import { project, projectNotice, priceDisclaimer } from "@/lib/project";

/*
 * Salgs- og leveringsbetingelser.
 *
 * These are contract terms, not marketing copy: once they are on the site and
 * a quote refers to them, they govern real orders. Two consequences run
 * through the whole file.
 *
 * First, nothing here invents a commercial promise. Delivery time, price,
 * condition grade and warranty period are all "as stated in the quote",
 * because that is exactly what the rest of the site already says and because
 * we hold no stock — every order is sourced for it. A term that promised a
 * delivery window would be a promise no page on this site backs.
 *
 * Second, this is a handelskøb — business to business only. That is not a
 * stylistic choice: it decides which law applies. Købeloven is deviable
 * between businesses (§1 stk. 2), the buyer carries a duty to examine on
 * receipt (§51) and to complain without undue delay (§52), and none of
 * forbrugeraftaleloven's consumer protections — the 14-day right of
 * withdrawal above all — are in play. Selling one machine to a private person
 * would put the whole of this document on the wrong footing, which is why
 * clause 1 says so in the first line.
 *
 * The CISG exclusion in clause 13 is there because Kestro sells into Norway.
 * Denmark and Norway are both parties, so a cross-border sale would fall under
 * the convention by default rather than under Danish law as clause 13
 * otherwise provides.
 */

/* The date the sitemap also publishes, from lib/legal.ts — written once
   so the page and the <lastmod> can never disagree. */
const UPDATED = legalUpdated["/handelsbetingelser"];

const commercialCopy = {
  da: {
    metaTitle: "Handelsbetingelser for erhvervskunder | Kestro",
    metaDescription:
      "Kestros salgs- og leveringsbetingelser: tilbud, betaling netto 14 dage, levering, stand, reklamation og ansvar. Kun salg til virksomheder.",
    title: "Handelsbetingelser",
    description:
      "Handelsbetingelserne er de 14 punkter herunder, og de gælder for alle tilbud og ordrer hos Kestro, medmindre vi har aftalt andet skriftligt. Vi sælger kun til virksomheder.",
    updated: "Senest opdateret",
    privacyLead: "Hvordan vi behandler personoplysninger står i",
    privacyLink: "privatlivspolitikken",
    detailsTitle: "Virksomhedsoplysninger",
  },
  en: {
    metaTitle: "Terms of sale for business customers | Kestro",
    metaDescription:
      "Kestro's terms of sale and delivery: quotes, payment 14 days net, delivery, condition, defects and liability. Business customers only.",
    title: "Terms of sale",
    description:
      "The terms of sale are the 14 sections below, and they apply to every quote and order with Kestro unless we have agreed otherwise in writing. We sell to businesses only.",
    updated: "Last updated",
    privacyLead: "How we handle personal data is set out in the",
    privacyLink: "privacy policy",
    detailsTitle: "Company details",
  },
} satisfies Record<Lang, Record<string, string>>;

type Clause = { heading: Localized; body: Localized[] };

// Retained as an inactive draft. Launching requires a fresh legal review, including consumer repairs.
const commercialClauses: Clause[] = [
  {
    heading: { da: "1. Anvendelse og aftalegrundlag", en: "1. Scope and basis of agreement" },
    body: [
      {
        da: "Disse betingelser gælder for alle tilbud, ordrebekræftelser, salg og leverancer fra Kestro. Vi sælger udelukkende til virksomheder, offentlige myndigheder og andre erhvervsdrivende. Købet er dermed et handelskøb, og forbrugeraftaleloven – herunder den 14 dages fortrydelsesret – finder ikke anvendelse.",
        en: "These terms apply to every quote, order confirmation, sale and delivery from Kestro. We sell exclusively to businesses, public authorities and other traders. The purchase is therefore a commercial sale, and the Danish Consumer Contracts Act — including its 14-day right of withdrawal — does not apply.",
      },
      {
        da: "Betingelserne udgør sammen med vores skriftlige tilbud det samlede aftalegrundlag. Købers egne indkøbsbetingelser gælder ikke, uanset om de fremgår af købers ordre eller anden korrespondance, medmindre vi skriftligt har accepteret dem. Afvigelser fra disse betingelser er kun bindende, når de står skriftligt i tilbuddet eller ordrebekræftelsen.",
        en: "Together with our written quote, these terms constitute the entire basis of the agreement. The buyer's own purchasing terms do not apply, whether or not they appear on the buyer's order or in other correspondence, unless we have accepted them in writing. Departures from these terms bind us only when stated in writing in the quote or order confirmation.",
      },
    ],
  },
  {
    heading: { da: "2. Tilbud og indgåelse af aftale", en: "2. Quotes and formation of contract" },
    body: [
      {
        da: "Et tilbud fra Kestro er gyldigt i 14 dage fra tilbuddets dato, medmindre andet fremgår af tilbuddet. Aftalen er indgået, når køber har accepteret tilbuddet skriftligt, og vi har bekræftet ordren.",
        en: "A quote from Kestro is valid for 14 days from its date unless the quote says otherwise. The agreement is formed when the buyer has accepted the quote in writing and we have confirmed the order.",
      },
      {
        da: "Vi har ikke lager. Udstyret skaffes til den konkrete ordre, og et tilbud er derfor betinget af, at udstyret fortsat kan skaffes i den oplyste stand og til den oplyste pris. Kan det ikke lade sig gøre, kontakter vi køber med et ændret tilbud, før vi bestiller. Køber er ikke bundet af det ændrede tilbud.",
        en: "We hold no stock. The equipment is sourced for the specific order, so a quote is conditional on the equipment still being obtainable in the stated condition and at the stated price. If it is not, we contact the buyer with a revised quote before ordering. The buyer is not bound by the revised quote.",
      },
    ],
  },
  {
    heading: { da: "3. Priser", en: "3. Prices" },
    body: [
      {
        da: "Alle priser er i danske kroner og eksklusive moms, told, afgifter og fragt, medmindre andet udtrykkeligt fremgår af tilbuddet. Prisen for den enkelte leverance er den, der står i tilbuddet.",
        en: "All prices are in Danish kroner and exclude VAT, duties, levies and freight unless the quote expressly states otherwise. The price for a given delivery is the one stated in the quote.",
      },
      {
        da: "Vi offentliggør ingen prisliste, fordi prisen afhænger af, hvad udstyret kan skaffes til på bestillingstidspunktet. Priser i markedsføringsmateriale og på hjemmesiden er vejledende og udgør ikke et tilbud.",
        en: "We publish no price list, because the price depends on what the equipment can be sourced for at the time of ordering. Prices in marketing material and on the website are indicative and do not constitute an offer.",
      },
    ],
  },
  {
    heading: { da: "4. Betaling", en: "4. Payment" },
    body: [
      {
        da: "Betalingsbetingelsen er netto 14 dage fra fakturadato, medmindre andet er aftalt skriftligt. Ved første ordre eller ved større leverancer kan vi kræve hel eller delvis forudbetaling; det oplyses i så fald i tilbuddet.",
        en: "Payment terms are 14 days net from the invoice date unless agreed otherwise in writing. On a first order, or for larger deliveries, we may require payment in advance in whole or in part; where we do, the quote says so.",
      },
      {
        da: "Ved forsinket betaling påløber morarente efter rentelovens regler fra forfaldsdagen, og vi kan opkræve rykkergebyr og kompensationsbeløb i det omfang, renteloven giver adgang til det i erhvervsforhold. Køber kan ikke modregne krav i købesummen eller tilbageholde betaling på grund af en reklamation, som vi ikke skriftligt har anerkendt.",
        en: "On late payment, default interest accrues from the due date under the Danish Interest Act, and we may charge reminder fees and the statutory compensation amount to the extent that Act permits between businesses. The buyer may not set off claims against the purchase price or withhold payment on account of a complaint we have not accepted in writing.",
      },
    ],
  },
  {
    heading: { da: "5. Levering og risikoovergang", en: "5. Delivery and passing of risk" },
    body: [
      {
        da: "Leveringstidspunktet aftales for den enkelte ordre og fremgår af tilbuddet eller ordrebekræftelsen. Vi oplyser et forventet leveringstidspunkt, når vi har bekræftet, hvad der kan skaffes. Vi leverer i Danmark og Norge.",
        en: "The delivery date is agreed for each order and appears in the quote or order confirmation. We state an expected delivery date once we have confirmed what can be sourced. We deliver in Denmark and Norway.",
      },
      {
        da: "Risikoen for udstyret overgår til køber ved levering på den aftalte adresse, eller – hvis køber selv afhenter eller bruger egen fragtfører – når udstyret overgives til køber eller dennes fragtfører. Bliver leveringen forsinket af forhold hos leverandøren eller fragtføreren, underretter vi køber hurtigst muligt og oplyser en ny forventet dato.",
        en: "Risk in the equipment passes to the buyer on delivery at the agreed address or — if the buyer collects, or uses its own carrier — when the equipment is handed to the buyer or that carrier. If delivery is delayed by circumstances at the supplier or the carrier, we notify the buyer as soon as possible and state a new expected date.",
      },
    ],
  },
  {
    heading: { da: "6. Ejendomsforbehold", en: "6. Retention of title" },
    body: [
      {
        da: "Det leverede forbliver Kestros ejendom, indtil købesummen er betalt fuldt ud med tillæg af eventuelle renter og omkostninger. Køber må ikke sælge, pantsætte eller på anden måde råde over udstyret til skade for ejendomsforbeholdet, før betaling er sket.",
        en: "The goods delivered remain Kestro's property until the purchase price has been paid in full, together with any interest and costs. Until payment, the buyer may not sell, pledge or otherwise deal with the equipment in a way that prejudices the retention of title.",
      },
    ],
  },
  {
    heading: { da: "7. Udstyrets stand", en: "7. Condition of the equipment" },
    body: [
      {
        da: "Vi sælger brugt og renoveret erhvervsudstyr. Stand er ikke ensartet, og den beskrives derfor for hver leverance i tilbuddet: kosmetisk stand, målt batterikapacitet i procent af ny, hvilke dele der er skiftet eller opgraderet, og hvilket styresystem der er installeret. Beskrivelsen i tilbuddet er den aftalte stand.",
        en: "We sell used and refurbished business equipment. Condition is not uniform, and it is therefore described for each delivery in the quote: cosmetic condition, measured battery capacity as a percentage of new, which parts have been replaced or upgraded, and which operating system is installed. The description in the quote is the agreed condition.",
      },
      {
        da: "Almindelige brugsspor, der er beskrevet i tilbuddet, er ikke en mangel. Medmindre andet står i tilbuddet, leveres udstyret uden originalemballage, uden originalt tilbehør og uden softwarelicenser ud over det installerede styresystem.",
        en: "Ordinary marks of use that are described in the quote are not a defect. Unless the quote states otherwise, equipment is supplied without original packaging, without original accessories and without software licences beyond the operating system installed.",
      },
      {
        da: "Lagermediet i brugt udstyr slettes, før udstyret sættes op igen, og vi oplyser, hvilken metode der er anvendt. Køber er selv ansvarlig for at sikre egne data på udstyr, som køber sender til os.",
        en: "Storage media in used equipment are erased before the equipment is set up again, and we state which method was used. The buyer is responsible for securing its own data on equipment the buyer sends to us.",
      },
    ],
  },
  {
    heading: { da: "8. Mangler og reklamation", en: "8. Defects and complaints" },
    body: [
      {
        da: "Køber skal undersøge det leverede straks ved modtagelsen, jf. købelovens regler om handelskøb. Reklamation over mangler, der kunne konstateres ved en sådan undersøgelse, skal ske skriftligt uden ugrundet ophold og senest 8 arbejdsdage efter modtagelsen. Reklamation over transportskader skal ske straks ved modtagelsen og noteres over for fragtføreren.",
        en: "The buyer must examine the goods immediately on receipt, in accordance with the Danish Sale of Goods Act's rules for commercial sales. Complaints about defects that such an examination would reveal must be made in writing without undue delay and no later than 8 working days after receipt. Complaints about transport damage must be made immediately on receipt and recorded with the carrier.",
      },
      {
        da: "For mangler, der viser sig senere, gælder den reklamationsperiode, der er anført i tilbuddet for den enkelte leverance. Perioden aftales pr. ordre, fordi den afhænger af udstyrets alder og stand, og den står altid skriftligt, før køber bestiller. Er der ikke aftalt en periode i tilbuddet, gælder købelovens regler.",
        en: "For defects that appear later, the complaint period stated in the quote for that delivery applies. The period is agreed per order, because it depends on the age and condition of the equipment, and it is always stated in writing before the buyer orders. Where no period is agreed in the quote, the Sale of Goods Act applies.",
      },
      {
        da: "Ved en berettiget reklamation afhjælper vi manglen ved reparation eller omlevering, eller vi giver et forholdsmæssigt afslag. Valget mellem disse er vores. Kan manglen ikke afhjælpes inden for rimelig tid, kan køber hæve købet for den mangelfulde del af leverancen.",
        en: "Where a complaint is justified, we remedy the defect by repair or replacement, or we grant a proportionate reduction. The choice between these is ours. If the defect cannot be remedied within a reasonable time, the buyer may cancel the purchase as regards the defective part of the delivery.",
      },
      {
        da: "Reklamationsretten omfatter ikke fejl, der skyldes almindelig slitage, forkert brug, manglende vedligeholdelse, indgreb foretaget af andre end os, uheld, væskeskade eller ændringer i købers eget it-miljø. Sliddele – herunder batterier – er kun omfattet i det omfang, tilbuddet siger det.",
        en: "The right to complain does not cover faults caused by ordinary wear, incorrect use, lack of maintenance, work carried out by anyone other than us, accident, liquid damage or changes in the buyer's own IT environment. Wear parts — batteries in particular — are covered only to the extent the quote says so.",
      },
    ],
  },
  {
    heading: { da: "9. Ansvarsbegrænsning", en: "9. Limitation of liability" },
    body: [
      {
        da: "Kestro er ikke ansvarlig for indirekte tab, herunder driftstab, avancetab, tab af data, tab af goodwill eller købers krav fra tredjemand. Vores samlede erstatningsansvar for en leverance kan ikke overstige det beløb, køber har betalt for den pågældende leverance.",
        en: "Kestro is not liable for indirect loss, including loss of operation, loss of profit, loss of data, loss of goodwill or third-party claims against the buyer. Our total liability for a delivery cannot exceed the amount the buyer has paid for that delivery.",
      },
      {
        da: "Begrænsningerne gælder ikke, hvor ansvaret følger af ufravigelig lovgivning, herunder produktansvarsloven, eller hvor tabet skyldes grov uagtsomhed eller forsæt fra vores side.",
        en: "These limitations do not apply where liability follows from mandatory law, including the Danish Product Liability Act, or where the loss is caused by our gross negligence or wilful misconduct.",
      },
    ],
  },
  {
    heading: { da: "10. Force majeure", en: "10. Force majeure" },
    body: [
      {
        da: "Ingen af parterne er ansvarlig for manglende opfyldelse, der skyldes forhold uden for partens kontrol, som parten ikke burde have taget i betragtning ved aftalens indgåelse. Det gælder blandt andet krig, myndighedsindgreb, importrestriktioner, strejke, brand, alvorlige it-nedbrud og svigt hos underleverandører af samme grund. Varer forholdet mere end 60 dage, kan hver part hæve aftalen for den berørte leverance uden erstatningspligt.",
        en: "Neither party is liable for non-performance caused by circumstances beyond its control that it could not reasonably have taken into account when the agreement was made — including war, action by public authorities, import restrictions, strike, fire, serious IT outages and failure by subcontractors for the same reasons. If the circumstance lasts more than 60 days, either party may cancel the agreement for the affected delivery without liability.",
      },
    ],
  },
  {
    heading: { da: "11. Returnering og annullering", en: "11. Returns and cancellation" },
    body: [
      {
        da: "Da udstyret skaffes til den konkrete ordre, kan en bekræftet ordre ikke annulleres, og udstyr kan ikke returneres, medmindre andet er aftalt skriftligt, eller der er tale om en berettiget reklamation efter punkt 8. Aftales en returnering, skal udstyret være i samme stand som ved levering.",
        en: "Because the equipment is sourced for the specific order, a confirmed order cannot be cancelled and equipment cannot be returned, unless agreed otherwise in writing or unless there is a justified complaint under clause 8. Where a return is agreed, the equipment must be in the same condition as on delivery.",
      },
    ],
  },
  {
    heading: { da: "12. Persondata og fortrolighed", en: "12. Personal data and confidentiality" },
    body: [
      {
        da: "Vi behandler personoplysninger om købers kontaktpersoner for at kunne indgå og opfylde aftalen. Behandlingen er beskrevet i privatlivspolitikken. Parterne behandler oplysninger om hinandens forhold, som ikke er offentligt tilgængelige, fortroligt.",
        en: "We process personal data about the buyer's contacts in order to enter into and perform the agreement. That processing is described in the privacy policy. Each party keeps confidential any non-public information about the other.",
      },
    ],
  },
  {
    heading: { da: "13. Lovvalg og værneting", en: "13. Governing law and venue" },
    body: [
      {
        da: "Aftalen er underlagt dansk ret. Den internationale købelov (CISG) finder ikke anvendelse, heller ikke på leverancer til Norge. Tvister, der ikke kan løses i mindelighed, afgøres ved de danske domstole med Kestros hjemting som værneting.",
        en: "The agreement is governed by Danish law. The UN Convention on Contracts for the International Sale of Goods (CISG) does not apply, including to deliveries to Norway. Disputes that cannot be settled amicably are decided by the Danish courts, with Kestro's registered venue as the place of jurisdiction.",
      },
    ],
  },
  {
    heading: { da: "14. Ændringer", en: "14. Changes" },
    body: [
      {
        da: "Vi kan ændre disse betingelser. For en indgået aftale gælder den version, der var gældende, da tilbuddet blev afgivet. Datoen nederst viser, hvornår den aktuelle version trådte i kraft.",
        en: "We may change these terms. For an agreement already made, the version in force when the quote was issued applies. The date at the foot of this page shows when the current version took effect.",
      },
    ],
  },
];

const copy = project.prelaunch
  ? {
      da: {
        ...commercialCopy.da,
        metaDescription:
          "Kestro er under etablering. Læs om uforpligtende forespørgsler, vejledende budgetpriser og kontakt. Ingen bestilling eller betaling her på siden.",
        description: projectNotice.da.body,
        detailsTitle: "Projekt og kontakt",
      },
      en: {
        ...commercialCopy.en,
        metaDescription:
          "Kestro is still in preparation. Read about non-binding enquiries, indicative budgets and contact. No orders or payments are accepted on the site.",
        description: projectNotice.en.body,
        detailsTitle: "Project and contact",
      },
    }
  : commercialCopy;

const previewClauses: Clause[] = [
  {
    heading: { da: "1. Sidens status", en: "1. Site status" },
    body: [{ da: projectNotice.da.body, en: projectNotice.en.body }],
  },
  {
    heading: { da: "2. Forespørgsler er ikke bestillinger", en: "2. Enquiries are not orders" },
    body: [
      {
        da: "Kontakt- og tilbudsformularerne bruges til at drøfte behov og indledende muligheder. En besked er ikke en bestilling, reservation eller aftale om køb eller reparation. I bliver ikke bedt om at betale gennem siden.",
        en: "The contact and quote forms are for discussing requirements and initial options. A message is not an order, reservation or agreement to buy or repair anything. You will not be asked to pay through this site.",
      },
    ],
  },
  {
    heading: { da: "3. Vejledende priser og modeller", en: "3. Indicative prices and models" },
    body: [
      { da: priceDisclaimer.da, en: priceDisclaimer.en },
      {
        da: "Budgeteksempler bygger på daterede, offentlige detailpriser fra de angivne eksterne forhandlere. De er ikke Kestros salgspriser. Modeller, billeder og specifikationer beskriver eksempler, ikke bekræftet lager eller en bestemt leverance. Siden lover ikke momsfradrag.",
        en: "Budget examples are based on dated public retail prices from the stated external retailers. They are not Kestro selling prices. Models, images and specifications describe examples, not confirmed stock or a particular delivery. The site does not promise VAT deductibility.",
      },
    ],
  },
  {
    heading: { da: "4. Før eventuelt salg eller reparation", en: "4. Before any sale or repair" },
    body: [
      {
        da: "Før projektet åbner for handel, skal sælgerens identitet, kontaktoplysninger og relevante registreringer være afklaret. Konkrete vilkår for pris, afgifter, levering, betaling og reklamation skal oplyses før en aftale. En privat kundes køb eller reparation må ikke behandles efter erhvervsvilkår. Indlevering, undersøgelsesgebyr og arbejde aftales på forhånd; send ikke udstyr uden en konkret aftale.",
        en: "Before the project opens for trading, the seller's identity, contact details and relevant registrations must be established. Specific terms for price, taxes, delivery, payment and complaints must be provided before an agreement. A private customer's purchase or repair must not be treated under business-only terms. Handover, diagnostic fees and work must be agreed in advance; do not send equipment without a specific arrangement.",
      },
    ],
  },
];
const clauses = project.prelaunch ? previewClauses : commercialClauses;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/handelsbetingelser", params.lang),
  };
}

export default async function TermsPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const address = postalAddress(lang);

  return (
    <>
      <PageSchema
        lang={lang}
        route="/handelsbetingelser"
        name={c.title}
        description={c.description}
      />

      <section className="pb-12 pt-10 sm:pb-16 sm:pt-20">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/handelsbetingelser"
            crumb={lang === "da" ? "Handelsbetingelser" : "Terms of sale"}
          />
        </Container>
      </section>

      {/* The document on paper. A legal text is the one thing on the site a
          reader reads start to finish, and it was 26 paragraphs of grey on
          navy; as a white sheet on the light band it is a document, which
          is what it is, and it joins the FAQs and the quote as the site's
          paper. */}
      <section className="border-y border-ink-200 bg-paper-dim py-10 text-ink-900 sm:py-16">
        <Container>
          <article className="sheet max-w-3xl px-6 pb-8 sm:px-10 sm:pb-10">
            {clauses.map((clause) => (
              <div
                key={clause.heading.da}
                className="border-t border-ink-200 py-8 first:border-t-0"
              >
                <h2 className="font-display t-h3 font-bold tracking-tight text-ink-900">
                  {clause.heading[lang]}
                </h2>
                {clause.body.map((paragraph) => (
                  <p
                    key={paragraph.da}
                    className="mt-4 text-base leading-[1.75] text-ink-700 sm:leading-[1.75]"
                  >
                    {paragraph[lang]}
                  </p>
                ))}
              </div>
            ))}

            {/* The disclosure e-handelsloven §7 requires. Each row renders only
                when lib/company.ts actually holds the value — a legal page is the
                last place to print a placeholder where a registration number
                belongs. */}
            <div className="border-t border-ink-200 py-8 first:border-t-0">
              <h2 className="font-display t-h3 font-bold tracking-tight text-ink-900">
                {c.detailsTitle}
              </h2>
              <dl className="mt-4 space-y-2 text-base leading-7 text-ink-700 sm:leading-8">
                <div className="flex gap-x-3">
                  <dt className="text-ink-600">{lang === "da" ? "Navn" : "Name"}</dt>
                  <dd>
                    {company.name}
                    {company.legalForm ? ` ${company.legalForm}` : ""}
                  </dd>
                </div>
                {address && (
                  <div className="flex gap-x-3">
                    <dt className="text-ink-600">{lang === "da" ? "Adresse" : "Address"}</dt>
                    <dd>{address}</dd>
                  </div>
                )}
                {company.cvr && (
                  <div className="flex gap-x-3">
                    <dt className="text-ink-600">CVR</dt>
                    <dd>{company.cvr}</dd>
                  </div>
                )}
                <div className="flex gap-x-3">
                  <dt className="text-ink-600">{lang === "da" ? "E-mail" : "Email"}</dt>
                  <dd>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-brand-700 underline decoration-brand-600/40 underline-offset-4 hover:text-brand-600"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
                {company.phoneDisplay && (
                  <div className="flex gap-x-3">
                    <dt className="text-ink-600">{lang === "da" ? "Telefon" : "Phone"}</dt>
                    <dd>{company.phoneDisplay}</dd>
                  </div>
                )}
              </dl>
            </div>

            <p className="border-t border-ink-200 pt-8 text-sm leading-[1.6] text-ink-600">
              {c.privacyLead}{" "}
              <Link
                href={localePath("/privatlivspolitik", lang)}
                className="font-semibold text-brand-700 underline decoration-brand-600/40 underline-offset-4 hover:text-brand-600"
              >
                {c.privacyLink}
              </Link>
              .
            </p>

            <p className="mt-4 text-sm text-ink-600 leading-[1.6]">
              {c.updated}: <time dateTime={UPDATED}>{formatDate(UPDATED, lang)}</time>
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}

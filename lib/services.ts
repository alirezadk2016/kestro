import type { Localized } from "./i18n";

/**
 * The service pages.
 *
 * Each of these was a block on /ydelser with no address of its own, which
 * meant one page had to rank for six different things at once. A company
 * searching "klargøring af brugte computere" and one searching "levering af
 * IT til virksomheder" are looking for different answers, and now each has a
 * page that gives one.
 *
 * Nothing here is a new promise. The copy is what the site already said about
 * these steps, expanded — anything that would need evidence we do not have
 * stayed out.
 */

export type ServiceSection = {
  heading: Localized;
  body: Localized[];
  list?: Localized[];
};

export type Service = {
  slug: string;
  name: Localized;
  /**
   * The page's heading, when it should carry the search phrase and the
   * short `name` (menus, cards, breadcrumbs) should not. Mak rule 5.
   */
  h1?: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  /** One line under the heading. */
  summary: Localized;
  intro: Localized;
  sections: ServiceSection[];
  /** Where to go next, as paths that already exist. */
  related: { href: string; label: Localized }[];
};

export const services: Service[] = [
  {
    slug: "sourcing-og-indkoeb",
    name: { da: "Sourcing og indkøb", en: "Sourcing and purchasing" },
    h1: { da: "Sourcing og IT-indkøb til erhverv", en: "Sourcing and IT purchasing for business" },
    metaTitle: {
      da: "IT-indkøb til erhverv – vi skaffer modellen | Kestro",
      en: "IT purchasing for business — we source the model | Kestro",
    },
    metaDescription: {
      da: "IT-indkøb til erhverv: vi finder det rigtige brugte IT-udstyr hos leverandører i Sydeuropa og køber først ind, når I ved, hvad I skal bruge – ikke før.",
      en: "We find used business computers through suppliers in southern Europe to match what you need, rather than selling what happens to be in stock.",
    },
    summary: {
      da: "Vi finder det rigtige IT-udstyr til jer – og køber først ind, når I ved, hvad I skal bruge.",
      en: "We find the right IT equipment for you — and buy only once you know what you need.",
    },
    intro: {
      da: "Kestro holder ikke lager. Som jeres indkøbspartner finder vi brugte erhvervsbærbare og -stationære hos leverandører i Sydeuropa, når der ligger en konkret ordre. Det lyder som en mangel, men det er hele pointen: vi er ikke bundet af, hvad vi tilfældigvis har købt hjem.",
      en: "Kestro holds no stock. As your sourcing partner we find used business laptops and desktops through suppliers in southern Europe once there is an actual order. That sounds like a shortcoming; it is the whole point. We are not tied to whatever we happened to buy in.",
    },
    sections: [
      {
        heading: { da: "Sådan foregår det", en: "How it works" },
        body: [
          {
            da: "I fortæller, hvad opgaven kræver: antal, skærmstørrelse, hukommelse, disk, om der skal dockingstationer og skærme med. Vi går ud i leverandørnetværket og finder maskiner, der passer, og vender tilbage med pris, stand og en tidsramme.",
            en: "You tell us what the work needs: quantity, screen size, memory, disk, whether docks and monitors go with it. We go out into the supplier network, find machines that fit, and come back with price, condition and a time frame.",
          },
          {
            da: "Passer der ikke noget til opgaven, siger vi det. Det er en kortere samtale end at sælge jer noget, der ikke løser problemet.",
            en: "If nothing fits the job, we say so. That is a shorter conversation than selling you something that does not solve the problem.",
          },
        ],
      },
      {
        heading: { da: "Hvorfor det gør en forskel", en: "Why it makes a difference" },
        body: [
          {
            da: "En leverandør, der har købt stort ind på forhånd, skal have det lager afsat. Det er ikke ondsindet – det er økonomi. Men det betyder, at I bliver tilbudt det, der står på hylden, frem for det, opgaven kræver.",
            en: "A supplier who has bought in bulk up front has to move that stock. That is not malice, it is economics. But it means you are offered what is on the shelf rather than what the job needs.",
          },
        ],
        list: [
          {
            da: "Specifikationerne følger opgaven i stedet for lagerbeholdningen.",
            en: "The specification follows the job rather than the inventory.",
          },
          {
            da: "Samme konfiguration hele vejen rundt, når I køber ind til flere.",
            en: "The same configuration throughout when you are buying for several people.",
          },
          {
            da: "Ingen pres for at tage en model, der er tæt på, men ikke rigtig.",
            en: "No pressure to take a model that is close but not right.",
          },
        ],
      },
      {
        heading: { da: "Hvad vi kan skaffe", en: "What we can source" },
        body: [
          {
            da: "Vi arbejder med erhvervsserier frem for forbrugermodeller – maskiner, der er bygget til at blive serviceret, og som der findes reservedele til flere år frem. Det er dem, der kan holde til en runde mere.",
            en: "We work with business ranges rather than consumer models — machines built to be serviced, with spare parts available for years to come. Those are the ones that hold up for another round.",
          },
        ],
        list: [
          {
            da: "Bærbare: ThinkPad, EliteBook, Latitude og tilsvarende erhvervsserier.",
            en: "Laptops: ThinkPad, EliteBook, Latitude and equivalent business ranges.",
          },
          {
            da: "Stationære i store og små kabinetter til kontorpladser og receptioner.",
            en: "Desktops in large and small cases for desks and reception areas.",
          },
          {
            da: "Skærme, dockingstationer, tastaturer og mus, så en plads er komplet.",
            en: "Monitors, docking stations, keyboards and mice, so a desk arrives complete.",
          },
          {
            da: "Nordisk tastatur og dansk opsætning, hvis maskinerne skal bruges her.",
            en: "Danish or Norwegian keyboards and setup when the machines are to be used here.",
          },
        ],
      },
      {
        heading: { da: "5, 20 eller 100 maskiner", en: "5, 20 or 100 machines" },
        body: [
          {
            da: "Antallet ændrer opgaven. Fem maskiner er et indkøb; halvtreds er en udrulning, hvor det betyder noget, at alle maskiner er ens, at de kommer samlet, og at de gamle bliver hentet med retur.",
            en: "Quantity changes the job. Five machines is a purchase; fifty is a rollout, where it matters that every machine is identical, that they arrive together, and that the old ones go back with us.",
          },
          {
            da: "Ved større antal skaffer vi den samme konfiguration til alle, klargør maskinerne ens og aftaler leveringen, så I ikke skal koordinere den maskine for maskine.",
            en: "At larger quantities we source a single configuration throughout, prepare them the same way and agree the delivery, so you are not coordinating it machine by machine.",
          },
        ],
      },
      {
        heading: { da: "Hvad prisen afhænger af", en: "What the price depends on" },
        body: [
          {
            da: "Vi sætter ikke listepriser på maskiner, vi ikke har købt endnu. Prisen kommer, når vi ved, hvad opgaven kræver – og så gælder den den konkrete leverance i stedet for at være et tal, der alligevel skal laves om.",
            en: "We do not put list prices on machines we have not bought yet. The price comes once we know what the job needs — and then it holds for that actual delivery rather than being a figure that has to be revised anyway.",
          },
        ],
        list: [
          {
            da: "Specifikationerne: processor, hukommelse, disk og skærmstørrelse.",
            en: "The specification: processor, memory, disk and screen size.",
          },
          {
            da: "Standen: kosmetisk stand og batteriets tilstand flytter prisen mærkbart.",
            en: "The condition: cosmetic grade and battery health move the price noticeably.",
          },
          {
            da: "Antallet: en samlet ordre købes anderledes ind end en enkelt maskine.",
            en: "The quantity: a single combined order is bought differently than one machine.",
          },
          {
            da: "Tilbehør og klargøring: dock, skærm, nordisk tastatur, opsætning og levering.",
            en: "Accessories and preparation: dock, monitor, Danish or Norwegian keyboard, setup and delivery.",
          },
        ],
      },
      {
        heading: { da: "Fortæl os, hvad I søger", en: "Tell us what you are looking for" },
        body: [
          {
            da: "I behøver ikke have en modelliste klar. Skriv, hvor mange maskiner det drejer sig om, hvad de skal bruges til, og hvornår I skal have dem – så foreslår vi noget konkret.",
            en: "You do not need a list of models ready. Tell us how many machines it is about, what they will be used for, and when you need them — and we will come back with something concrete.",
          },
          {
            da: "Ved I mere end det, går det hurtigere: skærmstørrelse, hukommelse, om der skal dockingstationer og skærme med, og om tastaturerne skal være danske eller norske.",
            en: "If you know more than that, it goes faster: screen size, memory, whether docks and monitors are included, and whether the keyboards need to be Danish or Norwegian.",
          },
        ],
      },
    ],
    related: [
      { href: "/produkter", label: { da: "Produkter vi skaffer", en: "Products we source" } },
      { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
      { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
    ],
  },
  {
    slug: "klargoering-og-test",
    name: { da: "Klargøring, test og opgradering", en: "Preparation, testing and upgrades" },
    h1: { da: "Klargøring og test af computere til medarbejdere", en: "Preparing and testing computers for employees" },
    metaTitle: {
      da: "Klargøring og test af computere til medarbejdere | Kestro",
      en: "Preparing computers for employees — tested, set up | Kestro",
    },
    metaDescription: {
      da: "Funktionstest af skærm, tastatur, batteri og ydeevne, opgradering efter behov og sletning af lagermediet, før maskinen sættes op til medarbejderen.",
      en: "Function testing of screen, keyboard, battery and performance, upgrades where needed, and the storage erased before the machine is set up.",
    },
    summary: {
      da: "Det, der sker, fra maskinen er købt, til den står på et skrivebord.",
      en: "What happens between buying a machine and having it on a desk.",
    },
    intro: {
      da: "En brugt maskine er ikke klar, fordi den tænder. Den er klar, når nogen har trykket hver tast igennem, målt batteriet, kigget efter revner ved hængslerne og skiftet det, der er slidt. Det er det arbejde, der ligger mellem indkøb og levering.",
      en: "A used machine is not ready because it turns on. It is ready when somebody has pressed every key, measured the battery, looked for cracks at the hinges and replaced what is worn. That is the work between buying and delivering.",
    },
    sections: [
      {
        heading: { da: "Det bliver testet", en: "What gets tested" },
        body: [
          {
            da: "Enhederne gennemgår en funktionstest af skærm, tastatur, batteri og ydeevne. Vi tester porte med udstyr i – en USB-port, der er slidt løs, ses ikke udefra – og åbner og lukker skærmen helt, fordi hængsler er den mest oversete slitagedel på en brugt bærbar.",
            en: "The machines go through a function test of screen, keyboard, battery and performance. Ports are tested with something plugged in — a USB port worn loose does not show from the outside — and the screen is opened and closed fully, because hinges are the most overlooked wear part on a used laptop.",
          },
        ],
        list: [
          {
            da: "Skærm: pletter, døde pixels, lysstyrke i hele fladen.",
            en: "Screen: marks, dead pixels, brightness across the whole panel.",
          },
          {
            da: "Tastatur: hver tast trykkes igennem. Én tast, der hænger, er nok.",
            en: "Keyboard: every key pressed. One sticking key is enough.",
          },
          {
            da: "Batteri: den faktiske kapacitet i procent af ny, ikke bare »OK«.",
            en: "Battery: the actual capacity as a percentage of new, not just “OK”.",
          },
          {
            da: "Køling: blæser og ribber renses, og kølepastaen skiftes.",
            en: "Cooling: fan and fins cleaned, thermal paste replaced.",
          },
        ],
      },
      {
        heading: { da: "Det bliver opgraderet", en: "What gets upgraded" },
        body: [
          {
            da: "Hukommelse og disk er de to dele, der oftest afgør, om en ellers god maskine føles træg. Vi opgraderer RAM efter behov, og maskinerne sendes som udgangspunkt videre med SSD. Slidte dele skiftes, og lagermediet slettes, før maskinen sættes op igen – vi oplyser, hvilken metode der er brugt.",
            en: "Memory and disk are the two parts that most often decide whether an otherwise good machine feels sluggish. We upgrade memory where it is needed, and the machines we pass on come with an SSD as standard. Worn parts are replaced, and the storage media are erased before the machine is set up again — we tell you which method was used.",
          },
        ],
      },
    ],
    related: [
      { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
      { href: "/maskinen", label: { da: "Maskinen indeni", en: "Inside the machine" } },
      { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
    ],
  },
  {
    slug: "nordisk-tilpasning",
    name: { da: "Nordisk tilpasning og software", en: "Nordic preparation and software" },
    h1: {
      da: "Dansk eller norsk tastatur på din bærbare",
      en: "A Danish or Norwegian keyboard for your laptop",
    },
    metaTitle: {
      da: "Dansk og norsk tastatur til bærbare computere | Kestro",
      en: "Danish and Norwegian laptop keyboards and setup | Kestro",
    },
    metaDescription: {
      da: "Dansk eller norsk tastatur til din bærbare: afklar fysisk layout, taster og sprog i Windows. Send dine krav og få svar om tilpasning af den konkrete pc.",
      en: "Need Danish or Norwegian keys on your laptop? Check the printed layout and Windows options. Send us your details to discuss a keyboard that fits.",
    },
    summary: {
      da: "Æ, ø og å, hvor de skal være – og et styresystem, der taler dansk.",
      en: "Æ, ø and å where they belong — and an operating system that speaks the language.",
    },
    intro: {
      da: "Ved køb af en bærbar med dansk tastatur skal både de trykte tegn og den valgte indtastning passe. Det samme gælder norsk tastatur. Angiv land, ønsket fysisk layout og eventuelt baggrundslys; mulighederne afhænger af maskinen og det tastatur, der kan skaffes.",
      en: "When buying a laptop with a Danish keyboard, both the printed keys and the selected input layout need to match. The same applies to a Norwegian keyboard. Specify country, physical layout and any backlight; options depend on the machine and the keyboard that can be sourced.",
    },
    sections: [
      {
        heading: { da: "Tastaturet", en: "The keyboard" },
        body: [
          {
            da: "En bærbar med udenlandsk tastatur kan kræve et fysisk tastaturskift for at få danske eller norske tegn. Afklar, om løsningen er et dansk, norsk eller kombineret nordisk layout. Bed om et billede af tasterne; klistermærker, et udskiftet tastatur og en sprogindstilling er ikke det samme.",
            en: "A laptop with a foreign keyboard may need a physical replacement for Danish or Norwegian key labels. Clarify whether the solution is a Danish, Norwegian or combined Nordic layout. Request a photo of the keys; stickers, a replacement keyboard and a language setting are not the same thing.",
          },
          {
            da: "Baggrundsbelysning er ikke standard på alle modeller. Skal I bruge det, så sig til, når vi taler om specifikationerne.",
            en: "Backlighting is not standard on every model. If you need it, say so when we talk about the specification.",
          },
        ],
      },
      {
        heading: { da: "Windows og licenser", en: "Windows and licences" },
        body: [
          {
            da: "Windows sættes op med drivere og sprogopsætning. Licensforholdet aftaler vi med jer: har I egne licensaftaler eller et image, I ruller ud, bruger vi dem – ellers hjælper vi med at få licenserne på plads, så maskinerne kører lovligt fra dag ét.",
            en: "Windows is set up with drivers and language settings. The licence position is agreed with you: if you have your own licence agreements or an image you roll out, we use those — otherwise we help get the licences in place so the machines run legally from day one.",
          },
        ],
      },
    ],
    related: [
      { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
      { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
      { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
    ],
  },
  {
    slug: "levering",
    name: { da: "Levering til virksomheden", en: "Delivery to the company" },
    h1: { da: "Levering af IT-udstyr til virksomheden", en: "Delivering IT equipment to your company" },
    metaTitle: {
      da: "IT-udstyr leveret til virksomheder i DK og Norge | Kestro",
      en: "Delivery of business IT in Denmark and Norway | Kestro",
    },
    metaDescription: {
      da: "Levering af IT-udstyr til virksomheder: samlet til én eller flere adresser i Danmark og Norge, med en tidsramme, I får skriftligt, før I bestiller noget.",
      en: "Delivery of business IT to companies in Denmark and Norway, in whatever quantity you need, with a lead time you get in writing before you commit.",
    },
    summary: {
      da: "Én modtagelse, pakket enkeltvis, med en tidsramme aftalt på forhånd.",
      en: "One delivery, packed individually, with a time frame agreed up front.",
    },
    intro: {
      da: "Vi leverer til virksomheder i Danmark og Norge. Maskinerne pakkes enkeltvis og leveres samlet, så I kun har én modtagelse at holde styr på – også når der er skærme, docks og kabler med.",
      en: "We deliver to companies in Denmark and Norway. Machines are packed individually and delivered together, so you only have one delivery to handle — including when monitors, docks and cables go with it.",
    },
    sections: [
      {
        heading: { da: "Om leveringstid", en: "About lead time" },
        body: [
          {
            da: "Fordi vi skaffer maskinerne til hver ordre og ikke sælger fra et lager, afhænger leveringstiden af den konkrete bestilling. Vi lover ikke en fast leveringstid på forhånd – vi oplyser en tidsramme, når vi har talt om, hvad I skal bruge, og den står i tilbuddet sammen med pris og stand.",
            en: "Because we source per order rather than selling from stock, lead time depends on the specific order. We do not promise a fixed delivery time up front — we give you a time frame once we have talked about what you need, and it goes in the quote alongside price and condition.",
          },
        ],
      },
      {
        heading: { da: "Det følger med leverancen", en: "What comes with the delivery" },
        body: [],
        list: [
          {
            da: "Serienummer per maskine, så I kan spore den enkelte enhed bagefter.",
            en: "A serial number per machine, so you can trace an individual unit afterwards.",
          },
          {
            da: "Stand og batteritilstand oplyst skriftligt per enhed.",
            en: "Condition and battery state reported in writing, per unit.",
          },
          {
            da: "Garantivilkårene skriftligt, før I bestiller.",
            en: "The warranty terms in writing, before you order.",
          },
        ],
      },
    ],
    related: [
      { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
      { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
      { href: "/kontakt", label: { da: "Få et tilbud", en: "Get a quote" } },
    ],
  },
  {
    slug: "overskudslager-og-returvarer",
    name: { da: "Overskudslager og returvarer", en: "Overstock and returns" },
    h1: { da: "Overskudslager og returvarer af IT-udstyr", en: "IT overstock and returned equipment" },
    metaTitle: {
      da: "Sælg IT-overskudslager, returvarer og demoenheder | Kestro",
      en: "Sell IT overstock, returned stock and demo units | Kestro",
    },
    metaDescription: {
      da: "Overskudslager af IT: returvarer, demoenheder og udstyr fra aflyste ordrer taber værdi hver måned, det står stille. Vi finder køberne i stedet for jer.",
      en: "Surplus IT stock and returns: demo units and equipment from cancelled orders lose value every month they sit unused. We find the buyers for you.",
    },
    summary: {
      da: "Udstyr, der aldrig nåede en kunde, taber værdi hver måned, det står stille.",
      en: "Equipment that never reached a customer loses value every month it sits still.",
    },
    intro: {
      da: "Ligger der udstyr, der aldrig kom ud til kunderne? Returvarer, demoenheder, varer fra en aflyst ordre eller en model, der blev udfaset midt i et indkøb. Det er sjældent defekt – det er bare svært at komme af med gennem de normale kanaler.",
      en: "Sitting on equipment that never reached a customer? Returns, demo units, goods from a cancelled order, or a model that was discontinued in the middle of a purchase. It is rarely faulty — it is just hard to move through the usual channels.",
    },
    sections: [
      {
        heading: { da: "Hvad vi gør ved det", en: "What we do with it" },
        body: [
          {
            da: "Vi handler begge veje. Det samme netværk, vi bruger til at finde maskiner til nordiske virksomheder, kan bruges til at finde køberne til jeres. I får en vurdering, før I beslutter jer, og I er ikke bundet af at have bedt om den.",
            en: "We trade in both directions. The same network we use to find machines for Nordic companies can be used to find the buyers for yours. You get a valuation before you decide, and asking for one commits you to nothing.",
          },
          {
            da: "Er der data på enhederne, slettes lagermedierne, før de klargøres til videresalg. Skal I bruge dokumentation for sletningen, aftaler vi det på forhånd.",
            en: "If there is data on the machines, the storage media are erased before they are prepared for resale. If you need documentation of the erasure, we agree that up front.",
          },
        ],
      },
    ],
    related: [
      { href: "/saelg-til-os", label: { da: "Sælg til os", en: "Sell to us" } },
      { href: "/kontakt", label: { da: "Få en vurdering", en: "Get a valuation" } },
    ],
  },
  {
    slug: "opstart-af-arbejdspladser",
    name: { da: "Opstart af nye arbejdspladser", en: "Setting up new workstations" },
    h1: { da: "IT-udstyr til nye medarbejdere: opstart af arbejdspladser", en: "IT equipment for new starters: workstation setup" },
    metaTitle: {
      da: "IT-udstyr til nye medarbejdere – klar fra dag ét | Kestro",
      en: "IT equipment for new employees — ready on day one | Kestro",
    },
    metaDescription: {
      da: "IT-udstyr til nye medarbejdere: en komplet arbejdsplads med maskine, skærm, dock og tastatur, sat op ens hver gang og leveret til den aftalte dato.",
      en: "A complete workstation for each new starter: computer, monitor, dock and keyboard, set up the same way every time and delivered on the date.",
    },
    summary: {
      da: "Alt skal virke den første morgen. Det er en anden opgave end at købe maskiner.",
      en: "Everything has to work on the first morning. That is a different job from buying machines.",
    },
    intro: {
      da: "En ny afdeling eller en ny virksomhed har en dato. Enten står udstyret klar den morgen, eller også gør det ikke. Det er ikke et indkøb, det er en leveranceplan – og den mest almindelige fejl er at bestille maskinerne og glemme alt det, der skal til for at bruge dem.",
      en: "A new department or a new company has a date. Either the equipment is ready that morning or it is not. That is not a purchase, it is a delivery plan — and the most common mistake is ordering the machines and forgetting everything needed to use them.",
    },
    sections: [
      {
        heading: { da: "Det plejer at blive glemt", en: "What usually gets forgotten" },
        body: [],
        list: [
          {
            da: "Dockingstationer, og om modellen kræver en bestemt serie.",
            en: "Docking stations, and whether the model needs a particular series.",
          },
          {
            da: "Skærme, kabler og strømforsyninger nok til alle pladser.",
            en: "Monitors, cables and power supplies enough for every desk.",
          },
          { da: "Tastaturlayout til alle maskiner.", en: "Keyboard layout on every machine." },
          {
            da: "Licenser, og hvem der ejer dem, når medarbejderen skifter maskine.",
            en: "Licences, and who owns them when an employee changes machine.",
          },
        ],
      },
      {
        heading: { da: "Sådan hjælper vi", en: "How we help" },
        body: [
          {
            da: "Vi taler opgaven igennem først: hvor mange pladser, hvad de skal lave, og hvornår det skal stå klar. Så finder vi udstyret, klargør det og leverer det samlet, så I har én modtagelse frem for fem.",
            en: "We talk the job through first: how many desks, what they are for, and when it has to be ready. Then we find the equipment, prepare it and deliver it together, so you take delivery once rather than five times.",
          },
        ],
      },
    ],
    related: [
      { href: "/produkter", label: { da: "Produkter vi skaffer", en: "Products we source" } },
      { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
      { href: "/kontakt", label: { da: "Tal med os om opstart", en: "Talk to us about setup" } },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

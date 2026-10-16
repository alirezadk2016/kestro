import type { Localized } from "@/lib/i18n";

/*
 * The sources the site is allowed to cite.
 *
 * A closed registry rather than a link written inline wherever it is needed,
 * for one reason: everything in here has been read at the URL it names, and
 * the figure quoted beside it is the figure that document actually gives. A
 * claim on this site either points at one of these or it is not made. Nothing
 * is cited from memory, and nothing here is a summary of a summary — if the
 * primary document could not be reached, it is not in this file.
 *
 * `claim` is the part that matters and the part that goes stale. It is the
 * single fact the entry is used to support, written as the source states it,
 * so anyone editing a page can check the sentence against the source without
 * re-reading the whole document. If a source updates its figure, the figure
 * changes here and every page that cites it changes with it.
 *
 * `accessed` is when the document was last read and the claim confirmed. It is
 * not decoration: a regulation with a future application date, or a report
 * with an annual edition, is only true as of a date.
 */
export type Source = {
  id: string;
  /** Who published it. The name a reader would recognise, not a domain. */
  publisher: string;
  title: Localized;
  url: string;
  /** The document's own publication year, where it states one. */
  published?: string;
  /** ISO date this was last read and the claim below confirmed. */
  accessed: string;
  /** The one fact this entry supports, as the source states it. */
  claim: Localized;
};

export const sources = {
  thinkpadX1CarbonGen7: {
    id: "thinkpadX1CarbonGen7",
    publisher: "Lenovo",
    title: { da: "ThinkPad X1 Carbon Gen 7: PSREF", en: "ThinkPad X1 Carbon Gen 7: PSREF" },
    url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_X1_Carbon_7th_Gen/ThinkPad_X1_Carbon_7th_Gen_Spec.pdf",
    accessed: "2026-10-16",
    claim: {
      da: "X1 Carbon Gen 7 har 8 eller 16 GB fastloddet RAM uden sokler. Lenovo angiver to Thunderbolt 3-porte; kablet Ethernet kræver en separat adapter.",
      en: "X1 Carbon Gen 7 has 8 or 16 GB of soldered RAM without slots. Lenovo lists two Thunderbolt 3 ports; wired Ethernet requires a separate adapter.",
    },
  },
  thinkpadT14Gen2Intel: {
    id: "thinkpadT14Gen2Intel",
    publisher: "Lenovo",
    title: { da: "ThinkPad T14 Gen 2 Intel: PSREF", en: "ThinkPad T14 Gen 2 Intel: PSREF" },
    url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_T14_Gen_2_Intel/ThinkPad_T14_Gen_2_Intel_Spec.pdf",
    accessed: "2026-10-16",
    claim: {
      da: "T14 Gen 2 Intel har fastloddet RAM og én DDR4 SO-DIMM-sokkel. Iris Xe kræver dual-channel-hukommelse; med single-channel fungerer grafikken som Intel UHD.",
      en: "T14 Gen 2 Intel has soldered RAM and one DDR4 SO-DIMM slot. Iris Xe requires dual-channel memory; with single-channel memory the graphics function as Intel UHD.",
    },
  },
  latitudeMemory: {
    id: "latitudeMemory",
    publisher: "Dell",
    title: { da: "Latitude 5410: hukommelse", en: "Latitude 5410: memory" },
    url: "https://www.dell.com/support/manuals/en-us/latitude-14-5410-laptop/latitude_5410_specs/memory?guid=guid-239fc4c1-eca1-47c1-afd1-fc24284c76e9&lang=en-us",
    accessed: "2026-10-14",
    claim: {
      da: "Latitude 5410 har to SoDIMM-sokler til DDR4. Dell angiver maksimalt 32 GB RAM.",
      en: "Latitude 5410 has two DDR4 SoDIMM slots. Dell specifies a maximum of 32 GB RAM.",
    },
  },
  latitudeProcessors: {
    id: "latitudeProcessors",
    publisher: "Dell",
    title: { da: "Latitude 5410: processorer", en: "Latitude 5410: processors" },
    url: "https://www.dell.com/support/manuals/en-us/latitude-14-5410-laptop/latitude_5410_specs/processors?guid=guid-ef8410b6-1db7-4ff7-89e0-a2db671dbe0c&lang=en-us",
    accessed: "2026-10-14",
    claim: {
      da: "Dells processorvalg til Latitude 5410 omfatter Core i5-8365U fra 8. generation samt Core i3, i5 og i7 fra 10. generation, ikke 11. generation.",
      en: "Dell's Latitude 5410 processor options include the 8th-generation Core i5-8365U and 10th-generation Core i3, i5 and i7, not 11th-generation processors.",
    },
  },
  latitudePorts: {
    id: "latitudePorts",
    publisher: "Dell",
    title: { da: "Latitude 5410: porte", en: "Latitude 5410: ports" },
    url: "https://www.dell.com/support/manuals/en-us/latitude-14-5410-laptop/latitude_5410_specs/ports-and-connectors?guid=guid-3aabd552-e72e-49db-bc78-735fe1734fc9&lang=en-us",
    accessed: "2026-10-14",
    claim: {
      da: "Latitude 5410 har tre USB-A-porte, en USB-C-port, HDMI, RJ-45 og kombineret lydstik.",
      en: "Latitude 5410 has three USB-A ports, one USB-C port, HDMI, RJ-45 and a headset jack.",
    },
  },
  optiplexSpecs: {
    id: "optiplexSpecs",
    publisher: "Dell",
    title: {
      da: "OptiPlex 5060: tekniske specifikationer",
      en: "OptiPlex 5060: technical specifications",
    },
    url: "https://i.dell.com/sites/csdocuments/Shared-Content_data-Sheets_Documents/en/OptiPlex_5060_Spec_Sheet.pdf",
    accessed: "2026-10-14",
    claim: {
      da: "OptiPlex 5060 bruger Intel-processorer fra 8. generation, med T-varianter i Micro. To DisplayPort-udgange er standard; HDMI er et valgfrit ekstra modul.",
      en: "OptiPlex 5060 uses 8th-generation Intel processors, with T variants in Micro. Two DisplayPort outputs are standard; HDMI is an optional module.",
    },
  },
  windows10Servicing: {
    id: "windows10Servicing",
    publisher: "Microsoft Learn",
    title: { da: "Windows 10: ESU og LTSC-support", en: "Windows 10: ESU and LTSC servicing" },
    url: "https://learn.microsoft.com/en-us/windows/release-health/release-information",
    accessed: "2026-10-14",
    claim: {
      da: "Windows 10 version 22H2 er ude af almindelig support, men ESU modtager særskilte sikkerhedsrettelser. Enterprise- og IoT Enterprise-LTSC-udgaver har egne supportdatoer.",
      en: "Windows 10 version 22H2 is out of general support but ESU receives separate security fixes. Enterprise and IoT Enterprise LTSC editions have their own support dates.",
    },
  },
  budgetT480: {
    id: "budgetT480",
    publisher: "refurbed.dk",
    title: {
      da: "Prisreference: ThinkPad T480 i5-8250U",
      en: "Price reference: ThinkPad T480 i5-8250U",
    },
    url: "https://www.refurbed.dk/p/lenovo-tp-t480-8250u/95266/",
    accessed: "2026-10-14",
    claim: {
      da: "Vist produktpris: 2.655 DKK for i5-8250U, 16 GB, 256 GB SSD og nordisk tastatur. Et dateret detailpriseksempel, ikke Kestros lager eller tilbud.",
      en: "Displayed product price: DKK 2,655 for i5-8250U, 16 GB, 256 GB SSD and Nordic keyboard. A dated retail example, not Kestro stock or an offer.",
    },
  },
  budgetT14: {
    id: "budgetT14",
    publisher: "refurbed.dk",
    title: {
      da: "Prisreference: ThinkPad T14 G2 i5-1145G7",
      en: "Price reference: ThinkPad T14 G2 i5-1145G7",
    },
    url: "https://www.refurbed.dk/p/lenovo-thinkpad-t14-g2-1145g7/",
    accessed: "2026-10-14",
    claim: {
      da: "Vist produktpris: 2.955 DKK for i5-1145G7, 16 GB, 256 GB SSD, nordisk tastatur og stand God.",
      en: "Displayed product price: DKK 2,955 for i5-1145G7, 16 GB, 256 GB SSD, Nordic keyboard and Good condition.",
    },
  },
  budgetOptiplex: {
    id: "budgetOptiplex",
    publisher: "refurbed.dk",
    title: { da: "Prisreference: OptiPlex 5060 SFF", en: "Price reference: OptiPlex 5060 SFF" },
    url: "https://www.refurbed.dk/en-dk/p/dell-optiplez-5060-sff/",
    accessed: "2026-10-14",
    claim: {
      da: "Vist produktpris: 2.029 DKK for i5-8400, 8 GB, 256 GB SSD og stand Fremragende.",
      en: "Displayed product price: DKK 2,029 for i5-8400, 8 GB, 256 GB SSD and Excellent condition.",
    },
  },
  budgetMonitor: {
    id: "budgetMonitor",
    publisher: "refurbed.dk",
    title: { da: "Prisreference: Dell U2419H", en: "Price reference: Dell U2419H" },
    url: "https://www.refurbed.dk/p/dell-ultrasharp-u2419h/",
    accessed: "2026-10-14",
    claim: {
      da: "Vist produktpris: 1.185 DKK for Dell U2419H med fod, stand God.",
      en: "Displayed product price: DKK 1,185 for Dell U2419H with stand, Good condition.",
    },
  },
  budgetRetailTerms: {
    id: "budgetRetailTerms",
    publisher: "refurbed.dk",
    title: {
      da: "Prisreferencernes moms og servicegebyr",
      en: "VAT and service fees for the price references",
    },
    url: "https://www.refurbed.dk/tos/",
    accessed: "2026-10-14",
    claim: {
      da: "Punkt 8.3: produktpriser vises inklusive moms, uden løfte om momsfradrag. Punkt 9: separat servicegebyr; 15 DKK ved produktværdi over 1.000 til 1.500 DKK, 30 DKK over 2.000 til 2.500 DKK og 37 DKK over 2.500 til 5.000 DKK.",
      en: "Section 8.3: product prices include VAT, without promising VAT deductibility. Section 9: separate service fee; DKK 15 for product value over 1,000 to 1,500, DKK 30 over 2,000 to 2,500 and DKK 37 over 2,500 to 5,000.",
    },
  },
  windows10Eol: {
    id: "windows10Eol",
    publisher: "Microsoft",
    title: {
      da: "Windows 10 support er slut",
      en: "Windows 10 support has ended",
    },
    url: "https://learn.microsoft.com/en-us/windows/release-health/release-information",
    accessed: "2026-10-14",
    claim: {
      da: "Den almindelige support til Windows 10 version 22H2 sluttede 14. oktober 2025. Extended Security Updates (ESU) er en særskilt mulighed for fortsatte sikkerhedsrettelser; LTSC-udgaver har andre supportdatoer.",
      en: "General Windows 10 version 22H2 support ended on 14 October 2025. Extended Security Updates (ESU) is a separate option for continued security fixes; LTSC editions have different support dates.",
    },
  },

  ewasteMonitor: {
    id: "ewasteMonitor",
    publisher: "ITU / UNITAR",
    title: {
      da: "The Global E-waste Monitor 2024",
      en: "The Global E-waste Monitor 2024",
    },
    url: "https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-waste-Monitor-2024.aspx",
    published: "2024",
    accessed: "2026-09-13",
    claim: {
      da: "Verden producerede 62 mio. ton elektronikaffald i 2022. 22,3 % af det blev dokumenteret indsamlet og genanvendt. Mængden ventes at nå 82 mio. ton i 2030.",
      en: "The world generated 62 million tonnes of e-waste in 2022. 22.3% of it was documented as formally collected and recycled. The figure is projected to reach 82 million tonnes by 2030.",
    },
  },

  repairDirective: {
    id: "repairDirective",
    publisher: "EUR-Lex",
    title: {
      da: "Direktiv (EU) 2024/1799 om fælles regler til fremme af reparation af varer",
      en: "Directive (EU) 2024/1799 on common rules promoting the repair of goods",
    },
    url: "https://eur-lex.europa.eu/eli/dir/2024/1799/oj/eng",
    published: "2024",
    accessed: "2026-09-13",
    claim: {
      da: "Direktivet trådte i kraft 30. juli 2024 og skal anvendes i medlemsstaterne fra 31. juli 2026. Producenter må ikke forhindre uafhængige værksteder i at bruge originale, brugte, kompatible eller 3D-printede reservedele.",
      en: "The directive entered into force on 30 July 2024 and applies in the member states from 31 July 2026. Manufacturers may not impede independent repairers from using original, second-hand, compatible or 3D-printed spare parts.",
    },
  },

  dkWarranty: {
    id: "dkWarranty",
    publisher: "Forbrug.dk (Konkurrence- og Forbrugerstyrelsen)",
    title: {
      da: "Reklamationsret i 2 år",
      en: "Two-year legal warranty",
    },
    url: "https://forbrug.dk/regler/reklamationsret-i-2-aar",
    accessed: "2026-09-13",
    claim: {
      da: "Købeloven giver 2 års reklamationsret ved forbrugerkøb. Der kan ikke aftales en kortere frist, og det kan ikke aftales, at dele af produktet er undtaget.",
      en: "The Danish Sale of Goods Act gives a two-year right to complain on consumer purchases. A shorter deadline cannot be agreed, and parts of the product cannot be excluded from it.",
    },
  },

  windows11Requirements: {
    id: "windows11Requirements",
    publisher: "Microsoft",
    title: {
      da: "Windows 11 – specifikationer og systemkrav",
      en: "Windows 11 specifications and system requirements",
    },
    url: "https://www.microsoft.com/en-us/windows/windows-11-specifications",
    accessed: "2026-09-13",
    claim: {
      da: "Windows 11 kræver mindst en 64-bit processor på 1 GHz med 2 kerner, 4 GB RAM, 64 GB lager, TPM 2.0 og UEFI med Secure Boot.",
      en: "Windows 11 requires at minimum a 1 GHz 64-bit processor with 2 cores, 4 GB RAM, 64 GB storage, TPM 2.0 and UEFI with Secure Boot.",
    },
  },

  nistSanitization: {
    id: "nistSanitization",
    publisher: "NIST",
    title: {
      da: "NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization",
      en: "NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization",
    },
    url: "https://csrc.nist.gov/pubs/sp/800/88/r2/final",
    accessed: "2026-09-13",
    claim: {
      da: "NIST definerer tre niveauer af datasletning – Clear, Purge og Destroy – efter hvor stor en indsats det kræver at gendanne data bagefter.",
      en: "NIST defines three levels of media sanitisation — Clear, Purge and Destroy — by the level of recovery effort each one defeats.",
    },
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;

export const sourceList = (ids: readonly SourceId[]): Source[] => ids.map((id) => sources[id]);

/**
 * The `citation` value for a page's schema.
 *
 * schema.org/citation takes either text or a CreativeWork. A CreativeWork with
 * a url and a publisher is what lets an answer engine follow the reference
 * rather than only read that one was claimed.
 */
export const citationSchema = (ids: readonly SourceId[], lang: "da" | "en") =>
  ids.map((id) => {
    /* Annotated, not inferred. `satisfies` keeps each entry's literal type, so
       without this the optional `published` is missing from the union for the
       entries that do not set one. */
    const source: Source = sources[id];
    return {
      "@type": "CreativeWork",
      name: source.title[lang],
      url: source.url,
      publisher: { "@type": "Organization", name: source.publisher },
      ...(source.published ? { datePublished: source.published } : {}),
    };
  });

/**
 * A registry entry in the shape lib/guides.ts already uses for its reference
 * list, so a guide cites the same verified URL and the same publisher wording
 * as the rest of the site rather than a second copy that can drift.
 */
export const guideSource = (id: SourceId) => {
  const source: Source = sources[id];
  return {
    href: { da: source.url, en: source.url },
    label: {
      da: `${source.publisher}: ${source.title.da}`,
      en: `${source.publisher}: ${source.title.en}`,
    },
  };
};

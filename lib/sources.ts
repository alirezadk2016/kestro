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
  windows10Eol: {
    id: "windows10Eol",
    publisher: "Microsoft",
    title: {
      da: "Windows 10 support er slut",
      en: "Windows 10 support has ended",
    },
    url: "https://www.microsoft.com/en-us/windows/end-of-support",
    accessed: "2026-09-13",
    claim: {
      da: "Supporten for Windows 10 sluttede 14. oktober 2025. Microsoft leverer ikke længere softwareopdateringer, sikkerhedsrettelser eller teknisk hjælp til Windows 10-pc'er.",
      en: "Windows 10 support ended on 14 October 2025. Microsoft no longer provides software updates, security fixes or technical assistance for Windows 10 PCs.",
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
      da: "Windows 11 — specifikationer og systemkrav",
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
      da: "NIST definerer tre niveauer af datasletning — Clear, Purge og Destroy — efter hvor stor en indsats det kræver at gendanne data bagefter.",
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

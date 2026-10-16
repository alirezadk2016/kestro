# Viden — fase 1

Datoen er 31-08-2026. Fase 1 af Viden-systemet: fundamentet, uden en eneste ny artikel.

## Beslutningen, alt andet hviler på

**Viden er ikke en URL. Viden er `/vejledninger` opgraderet.**

Sektionen hedder Viden i navigationen, i brødkrummen og i overskriften. URL'en er uændret: `/vejledninger` og `/vejledninger/[slug]`, på begge sprog. Navnet er det, en læser husker; URL'en er det, der koster 301'er at flytte. Hubben ejer intet søgeord i kortet, så omdøbningen koster ingenting.

Det giver tre ting på én gang: ingen kannibalisering med en anden vidensside, ingen migration før der er data, der kan retfærdiggøre den — og en struktur, hvor selve flytningen en dag kun er ét sti-segment, fordi taksonomien allerede ligger i data frem for i URL'en.

## Taksonomi

Fem klynger. Fire arbejdende, én ærlig restkategori.

| Klynge                   | Anker                        | Artikler i dag |
| ------------------------ | ---------------------------- | -------------- |
| Levetid og udskiftning   | `#levetid-og-udskiftning`    | 3              |
| Køb, stand og afhændelse | `#koeb-stand-og-afhaendelse` | 2              |
| Hukommelse og lagring    | `#hukommelse-og-lagring`     | 1              |
| Arbejdspladsen           | `#arbejdspladsen`            | 0 (vises ikke) |
| Øvrige vejledninger      | `#oevrige`                   | 1              |

**Afvigelse fra blueprintet, med vilje:** klyngen hed `windows-lifecycle` der. Den hedder `lifecycle` her, fordi to af de tre artikler i den ikke handler om Windows — "reparere eller købe ny" er levetidsøkonomi. At presse dem ind under et Windows-navn ville have gjort taksonomien forkert for at holde et dokument ret.

`uden-klynge` findes, fordi trin 3 besluttede, at `samle-din-egen-pc` er forkert publikum: behold den, byg ikke videre på den. At file den under en klynge, den ikke hører til, ville stiltiende have omgjort den beslutning.

## Hvad hver artikel nu bærer

`cluster` · `type` · `intent` · `primaryKeyword` · `author` · `tldr` — alle påkrævede, alle håndhævet af `scripts/verify/content.mjs`.

`intent` er ikke pynt: skabelonen læser den og afgør, hvor højt siden må tale om at sælge. Tre artikler med `informational` har ikke længere det store CTA-afsnit. En vejledning i at slette en disk, før man sælger den, har ikke noget at gøre med den samme salgsblok som en om at skifte en flåde.

## Forfatter og E-E-A-T

`Article.author` var `Organization`, hvilket ikke siger noget, en læser eller en søgemaskine kan veje. Den er nu `Person`: navn, rolle og et link til personens rigtige kort på `/om-os`, alt sammen hentet fra `lib/company.ts`. Intet er skrevet ind i indholdet, og intet er opfundet.

Alle syv artikler står i Alireza Makvandis navn — medstifter og teknisk ansvarlig, hvis rolle i forvejen er beskrevet som at sikre, at specifikationerne er korrekte, før en maskine bliver præsenteret. Det er præcis den påstand, artiklerne gør.

## Det visuelle system

Tier 0 og 1, som blueprintet foreskriver. Ingen WebGL nogen steder i Viden.

`components/ClusterMark.tsx` er fire tegninger i et teknisk dokuments sprog: ortografisk, tynd streg, ingen fyld ud over en vask, én lyskilde. Inline SVG — omkring et kilobyte, ingen forespørgsel, skalerer til enhver skærm, arver `currentColor` og er der, før JavaScript er.

Målt: **0 kB JavaScript tilføjet.** Alt nyt er serverrenderet. Three.js indlæses ikke på nogen Viden-side, hverken ved load eller efter scroll til bunden.

## Målt efter

| Kontrol                                                    | Resultat                                                             |
| ---------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm run verify`                                           | bestået (indeholder nu indholdsporten)                               |
| `tsc --noEmit`, `next lint`, `prettier --check`            | rene                                                                 |
| Indholdsport                                               | 7 artikler, 6 primære søgeord, 0 fejl                                |
| Sider auditeret                                            | 108, **0 fund**                                                      |
| Sitemap                                                    | 108, uændret                                                         |
| Døde links · links til redirects · sider under 3 indgående | 0 · 0 · 0                                                            |
| Titler og beskrivelser                                     | 108 unikke, alle inden for længdegrænserne                           |
| `BreadcrumbList`                                           | præcis én på hver side undtagen de to forsider                       |
| `Article`                                                  | 14, alle med `Person` og `articleSection`                            |
| `FAQPage`                                                  | 10, kun hvor der er reelle spørgsmål                                 |
| JavaScript per Viden-side                                  | 383 kB — uændret fra før                                             |
| CLS                                                        | 0                                                                    |
| Tilgængelighed                                             | 0 fund                                                               |
| Vandret overflow, 320-1440 px                              | ingen                                                                |
| Uden JavaScript                                            | hub 449 ord, artikel 1.440 ord, alle ankre virker, FAQ-svar i DOM'en |

## Search Console-baseline

**UNKNOWN.**

Der er ingen Search Console-adgang fra dette miljø og ingen eksport i repoet. Sitemappet blev indsendt for to dage siden, så der findes endnu ingen historik at læse. Visninger, klik, CTR, placeringer og indekseringsstatus er derfor ikke registreret her, og der er ikke gættet på dem.

**Det, der skal fanges manuelt, før fase 2 begynder:** antal indekserede sider, samlede visninger, og forespørgselsrapporten som den ser ud i dag. Uden det tal kan intet i fase 2 tilskrives noget.

## Fase 2 er ikke begyndt

Ingen nye artikler er oprettet. Ingen RAM-artikel. Ingen slugs ændret, ingen redirects tilføjet, ingen kommercielle URL'er rørt.

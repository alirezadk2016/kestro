# Indholdsplan: 20 artikler til B2B-søgeintention

Skrevet ud fra ét kriterium: en IT-ansvarlig, der skal købe 20–100 maskiner,
skal kunne træffe en beslutning efter at have læst siden. Alt andet er trafik,
vi ikke kan konvertere.

## Hvad der allerede findes

Seks vejledninger. Fem af dem er brugbare i en B2B-tragt; én er det ikke:

| Side | Vurdering |
| --- | --- |
| `/vejledninger/reparere-eller-koebe-ny` | Behold. Rammer TCO-spørgsmålet direkte. |
| `/vejledninger/tjek-brugt-baerbar-foer-koeb` | Behold. Skriv en erhvervsvariant (nr. 3 nedenfor). |
| `/vejledninger/opgrader-ram-i-baerbar` | Behold. Teknisk, men bygger tillid. |
| `/vejledninger/windows-11-paa-aeldre-maskine` | Behold og udvid – se nr. 6. |
| `/vejledninger/slet-data-foer-du-saelger` | Behold. Understøtter `/saelg-til-os`. |
| `/vejledninger/samle-din-egen-pc` | **Forkert publikum.** Trækker hobbyister, ikke indkøbere. Lad den ligge, men lad være med at bygge videre på sporet. |

## Prioriteret liste

P1 = skriv først, direkte købsintention. P2 = understøtter beslutningen.
P3 = brand og bredde.

| # | Titel (arbejdstitel) | Intention | Interne links | Pri |
| --- | --- | --- | --- | --- |
| 1 | Refurbished erhvervscomputere: hvad det betyder, og hvad det ikke betyder | Definition + indvending | `/kvalitet`, `/produkter` | P1 |
| 2 | Brugt eller refurbished? Forskellen der afgør, hvad I får | Sammenligning | `/kvalitet`, `/ydelser/klargoering-og-test` | P1 |
| 3 | Sådan vurderer I en brugt erhvervsbærbar før et større indkøb | Købsguide, erhverv | `/kvalitet`, `/tilbud` | P1 |
| 4 | Hvad koster brugte erhvervscomputere – og hvorfor svaret er "det afhænger" | Pris uden at lyve | `/priser`, `/tilbud-eksempel` | P1 |
| 5 | Hvor meget RAM skal en kontormaskine have i 2026? | Specifikationsvalg | `/vejledninger/opgrader-ram-i-baerbar`, `/modeller` | P1 |
| 6 | Windows 11 i virksomheden: hvilke brugte maskiner kan følge med | Compliance-drevet udskiftning | eksisterende Win11-guide, `/modeller` | P1 |
| 7 | Sådan standardiserer I på én maskinkonfiguration | Flådedrift | `/flaadeloesninger`, `/ydelser/sourcing-og-indkoeb` | P1 |
| 8 | Indkøb af IT til 5, 20 og 100 medarbejdere: tre forskellige opgaver | Skalering | `/tilbud`, `/flaadeloesninger` | P1 |
| 9 | ThinkPad T-serie vs. EliteBook vs. Latitude til kontorbrug | Modelvalg | `/modeller/*` | P1 |
| 10 | TCO på en medarbejdermaskine over fire år | Økonomi | `/priser`, `/reparation` | P2 |
| 11 | SSD-krav: hvornår 256 GB er nok, og hvornår det ikke er | Specifikation | `/maskinen` | P2 |
| 12 | Sikker datasletning ved udskiftning af firmamaskiner | Risiko/GDPR | `/saelg-til-os`, eksisterende sletteguide | P2 |
| 13 | Hvad skal stå i et tilbud på brugt IT, før I skriver under | Indkøbstjekliste | `/tilbud-eksempel`, `/priser` | P2 |
| 14 | Garanti på refurbished erhvervsudstyr: hvad man realistisk kan forvente | Indvending | `/kvalitet` | P2 |
| 15 | IT-udstyr til en nystartet virksomhed: rækkefølgen der sparer penge | Segment | `/produkter`, `/tilbud` | P2 |
| 16 | IT til den lille virksomhed uden IT-afdeling | Segment | `/ydelser`, `/reparation` | P2 |
| 17 | Nordisk tastatur, sprogopsætning og hvorfor importmaskiner driller | Praktisk barriere | `/ydelser/nordisk-tilpasning` | P2 |
| 18 | Livscyklus for firmacomputere: hvornår udskifter man reelt? | Strategi | `/reparation`, `/saelg-til-os` | P3 |
| 19 | CO2 ved genbrug af én bærbar – med kilde, ikke med marketingtal | Bæredygtighed | `/om-os` | P3 |
| 20 | Dockingstationer og skærme: sådan gør I en arbejdsplads komplet | Mersalg | `/produkter/skaerme`, `/produkter/tilbehoer` | P3 |

## Regler for hver artikel

- **Svar først.** Konklusionen i de første to afsnit. Resten er belæg.
- **Én reel opgave per side.** Ingen sider, der dækker fire søgninger halvt.
- **Tabeller frem for adjektiver**, hvor der er tal at stille op.
- **Tal, vi kan stå inde for.** Eksterne påstande (CO2, markedstal,
  Windows 11-krav) skal have kilde og dato — ikke fordi et værktøj beder om
  det, men fordi de bliver forældede og skal kunne efterprøves.
- **Internt link til den side, der løser problemet** — som regel `/tilbud`,
  `/modeller` eller den relevante `/ydelser/*`.
- **Ingen artikel uden en grund til at eksistere.** Tynde sider koster
  autoritet på hele domænet, ikke kun på sig selv.

## Tempo

To artikler om måneden slår tyve på én uge. Hver ny guide skal ind i
`lib/guides.ts` med en reel `updated`-dato — det er de eneste sider i sitemap,
der bærer `lastmod`, netop fordi datoen dér er ægte.

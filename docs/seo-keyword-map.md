# Trin 2 — søgeordskortlægning for kestro.dk

Filer: dette dokument og `docs/seo-keyword-map.csv`.

**Ingen kode, intet indhold, ingen metadata, ingen routes, intet sitemap og ingen sider er ændret i dette trin.** Alt herunder er forslag, der venter på godkendelse.

## Datagrundlaget

De 156 søgeord kommer fra `docs/seo/keyword-research.csv` (trin 1). `search_volume`, `keyword_difficulty` og `cpc` står stadig som **`unknown`** på hver eneste række, og de er ført videre som `unknown` her. Denne session har ingen adgang til Keyword Planner, Ahrefs eller Semrush, og et opdigtet tal ville blive til en prioritering, nogen handlede på.

**Prioritet er derfor sat på forretningsrelevans og intention, ikke på volumen:**

- **High** — enten P0 i researchen, eller P1 med høj kommerciel værdi. Ord, en indkøber bruger, når der er en ordre i sigte.
- **Medium** — understøtter beslutningen, men lukker den sjældent selv.
- **Low** — bredde, brand eller emner uden for det, Kestro faktisk sælger.

## Fordeling

| Dimension | Fordeling |
| --- | --- |
| Sprog | dansk 138 · engelsk 17 · norsk/dansk 1 |
| Intention | commercial 95 · informational 36 · transactional 13 · commercial investigation 10 · navigational 2 |
| Prioritet | High 79 · Medium 64 · Low 13 |
| Sidetype | eksisterende 133 · ny 17 · ikke målrettet 6 |
| B2B-intention | ja 69 · delvist 87 |
| URL'er med søgeord | 70 |

### Kategorier

| Kategori | Søgeord |
| --- | --- |
| Mærke/model | 22 |
| Kerne | 19 |
| Engelsk | 17 |
| B2B: flåde | 12 |
| Service: reparation | 10 |
| Produkt: bærbare | 9 |
| B2B: indkøb | 9 |
| Tillid: stand | 9 |
| Produkt: tablets/telefoner | 6 |
| B2B: opkøb | 5 |
| Tillid: data | 5 |
| Beslutning: økonomi | 5 |
| Lokalt | 5 |
| Produkt: stationære | 4 |
| Produkt: skærme | 4 |
| Service: klargøring | 4 |
| Produkt: mini-pc | 3 |
| Produkt: docking | 3 |
| Beslutning: software | 3 |
| Brand | 2 |

## Reglerne kortlægningen følger

1. **Ét primært søgeord per URL, og aldrig det samme primære ord på to sider.** 69 URL'er har et primært ord; ingen URL har to.
2. **Kommercielle ord til kategori-, ydelses- og produktsider.** Informationelle ord til vejledninger. Mærke- og modelord til modelsider.
3. **En side laves ikke, fordi et søgeord findes.** Et ord uden en side, Kestro har en grund til at have, står som "ikke målrettet" med begrundelsen i noten.
4. **Dansk er det primære marked.** Engelsk er den sekundære spejling af de samme sider, ikke et selvstændigt indholdsspor.
5. **Ingen opfundne tal.** Volumen, konkurrence og placeringer er `unknown`.

## Kannibalisering

Fem reelle konflikter, en enkelt af dem alvorlig.

| Alvor | Sider | Problem | Anbefaling |
| --- | --- | --- | --- |
| **Høj** | `/tilbud` og `/flaadeloesninger/forespoergsel` | To sider, samme intention: få et tilbud. Begge har en formular, begge er indekserbare, og de konkurrerer om nøjagtig de samme søgninger. | Behold **én**. Enten 301 fra `/flaadeloesninger/forespoergsel` til `/tilbud`, eller gør flådesiden strengt flåde-specifik (50+ enheder) med et andet primært ord. Beslut i trin 3. |
| Mellem | `/produkter` og `/modeller` | `/modeller` bærer "brugte erhvervscomputere" i sin title; `/produkter` skal eje de generiske kerneord. | `/produkter` ejer kategorien, `/modeller` ejer mærke og model. Titlen på `/modeller` skal væk fra kategoriordene. |
| Mellem | `/kvalitet`, `/vejledninger/tjek-brugt-baerbar-foer-koeb` og `/ydelser/klargoering-og-test` | Alle tre taler om stand, batteri og funktionstest. | `/kvalitet` = vores standard og garanti. Guiden = køberens egen tjekliste. Ydelsessiden = hvad vi gør ved maskinen. |
| Mellem | `/flaadeloesninger` og `/ydelser/opstart-af-arbejdspladser` | Begge handler om "udstyr til medarbejdere". | Flåde = mange enheder på én gang. Opstart = én ny medarbejder ad gangen, løbende. |
| Lav | `/reparation`, `/vejledninger/reparere-eller-koebe-ny`, `/vejledninger/opgrader-ram-i-baerbar` | Overlap på opgradering. | Ydelsen sælger; vejledningerne svarer. Hold købsordene væk fra guiderne. |
| Lav (hold øje) | `/priser` og `/tilbud` | "Hvad koster det" mod "få et tilbud". | Adskilt i dag. De smelter sammen, hvis `/priser` begynder at bede om en henvendelse i stedet for at forklare. |

## Sider uden et meningsfuldt primært søgeord

Ikke en fejl i sig selv — men det skal være et valg.

| Side | Vurdering |
| --- | --- |
| `/om-os` | E-E-A-T-side. Brandord hører til forsiden; denne skal bygge tillid, ikke rangere. Ingen primær tildelt, med vilje. |
| `/tilbud-eksempel` | Konverteringsaktiv, ikke en landingsside. Den stærkeste side på sitet til at overbevise — og den svageste til at blive fundet. Behold den som intern destination. |
| `/maskinen` | Informationel dybde uden et købsord. Fint som støtte til `/kvalitet` og modelsiderne. |
| `/vejledninger/samle-din-egen-pc` | Rammer hobbyister på et B2B-domæne. Ingen B2B-intention at tildele. Behold, men byg ikke videre på sporet. |
| `/produkter/gaming` | Ingen B2B-intention. Kandidat til fjernelse i trin 3. |
| `/produkter/smartwatches` | Ingen reel B2B-intention. Kandidat til fjernelse i trin 3. |
| `/privatlivspolitik`, `/kontakt` (delvist) | Nødvendige sider. `/kontakt` kan først tage de lokale ord, når CVR, adresse og telefon findes. |

## Intention ingen eksisterende side kan svare på

| Søgning | Hvorfor den eksisterende side ikke rækker |
| --- | --- |
| windows 10 support slut virksomhed | `/vejledninger/windows-11-paa-aeldre-maskine` svarer på kravene, ikke på **anledningen** og tidspresset. |
| refurbished vs brugt | Ingen side definerer forskellen — og den er Kestros positionering. |
| thinkpad vs elitebook vs latitude | Modelsiderne beskriver hver sin maskine; ingen af dem sammenligner. |
| standardisering af computere i virksomheden | `/flaadeloesninger` sælger det, men forklarer det ikke. |
| it-udstyr til nystartet virksomhed / mindre virksomheder | Segmentsøgninger uden en side, der taler til segmentet. |
| hvor meget ram har man brug for | RAM-guiden viser **hvordan** man opgraderer, ikke **hvor meget** der skal til. |
| tco / levetid på en firmacomputer | `/priser` handler om vores pris, ikke om kundens fireårsregnskab. |

## Nye sider, der bør laves — men ikke er lavet

Prioriteret. Ingen af dem er oprettet, og ingen bør laves som tynd tekst.

| # | Foreslået URL | Primært søgeord | Hvorfor den skal findes | Pri |
| --- | --- | --- | --- | --- |
| 1 | `/vejledninger/windows-10-support-slutter` | windows 10 support slut virksomhed | Tidsbestemt anledning, der udløser præcis det indkøb Kestro lever af. | P0 |
| 2 | `/vejledninger/refurbished-eller-brugt` | refurbished vs brugt | Definerer forskellen og dermed Kestros egen position. Toppen af tragten. | P1 |
| 3 | `/vejledninger/vaelg-erhvervsbaerbar` | thinkpad vs elitebook vs latitude | Sammenligning med købsintention, som ingen dansk konkurrent ejer. | P1 |
| 4 | `/vejledninger/standardiser-firmacomputere` | standardisering af computere i virksomheden | Flådekøberens egentlige problem, forklaret frem for solgt. | P1 |
| 5 | `/vejledninger/it-til-nystartet-virksomhed` | it-udstyr til nystartet virksomhed | Segmentside, der matcher en reel kundetype. | P1 |
| 6 | `/vejledninger/it-til-mindre-virksomheder` | it til mindre virksomheder | Samme, for virksomheden uden IT-afdeling. | P1 |
| 7 | `/vejledninger/ram-og-ssd-til-kontormaskiner` | hvor meget ram har man brug for | Specifikationsspørgsmålet, der afgør, hvad der skal sources. | P1 |
| 8 | `/vejledninger/tco-paa-firmacomputere` | tco på firmacomputere | Økonomiargumentet, en indkøber skal bruge internt. | P2 |
| 9 | `/vejledninger/leasing-eller-koeb` | leasing eller køb af firmacomputere | Sammenligning, ikke et produkt: Kestro leaser ikke. Kun hvis der er tid til overs. | P3 |

**Sider der ikke skal laves:** lokalsider for København (ingen tilstedeværelse), en norsk `/no`-version (ingen norsk redaktionel plan — hreflang til tomme sider skader), udbuds- og institutionssider (ingen udbudserfaring at vise), og regnskabsemner som afskrivning (uden for kompetencen).

Uden for søgeordskortet, men blokerende for flere af siderne ovenfor: **handelsbetingelser** og **CVR, adresse og telefon**. Uden dem kan `/kontakt` ikke tage de lokale søgninger, og LocalBusiness-schema giver ingen mening.

## Side for side

De 26 vigtigste sider. Modelsiderne følger én regel og er ikke listet enkeltvis: **primært ord = "<model> brugt"**, sekundært = modelnavn + pris/specifikationer, title = `Brugt <model> til erhverv | Kestro`, H1 = modelnavnet. Det er allerede sådan, de 36 sider er sat op.

### `/`

- **Primært søgeord:** refurbished computere erhverv
- **Sekundære:** brugt it-udstyr; erhvervscomputere; kestro
- **Intention:** Commercial
- **Målgruppe:** IT-ansvarlig eller indehaver, der overvejer brugt frem for nyt
- **Anbefalet title (55 tegn):** Refurbished erhvervscomputere til virksomheder | Kestro
- **Anbefalet meta description (142 tegn):** Kestro skaffer refurbished erhvervscomputere til danske og norske virksomheder. Pris, stand og garantivilkår står skriftligt, før I bestiller.
- **Anbefalet H1:** Erhvervscomputere. Klar til Norden.

### `/produkter`

- **Primært søgeord:** brugt it-udstyr til virksomheder
- **Sekundære:** refurbished computere; computere til virksomheder; leverandør af brugt it-udstyr
- **Intention:** Commercial
- **Målgruppe:** Indkøber, der vil se hvad der overhovedet kan skaffes
- **Anbefalet title (59 tegn):** Brugt IT-udstyr til virksomheder – hvad vi skaffer | Kestro
- **Anbefalet meta description (145 tegn):** Bærbare, stationære, skærme, docking og tilbehør som brugt erhvervs-IT. Vi sourcer per ordre, så specifikationen følger opgaven og ikke et lager.
- **Anbefalet H1:** Hvad vi skaffer

### `/produkter/baerbare-computere`

- **Primært søgeord:** brugte bærbare computere
- **Sekundære:** refurbished bærbar; brugt bærbar til erhverv; erhvervsbærbar
- **Intention:** Commercial
- **Målgruppe:** Indkøber til kontorarbejdspladser
- **Anbefalet title (45 tegn):** Brugte bærbare computere til erhverv | Kestro
- **Anbefalet meta description (146 tegn):** Refurbished erhvervsbærbare fra ThinkPad-, EliteBook- og Latitude-serierne. Funktionstestet, nordisk tastatur og skriftlige vilkår før bestilling.
- **Anbefalet H1:** Bærbare computere

### `/produkter/stationaere-computere`

- **Primært søgeord:** brugte stationære computere
- **Sekundære:** refurbished stationær pc; stationær computer til kontor; brugt workstation
- **Intention:** Commercial
- **Målgruppe:** Indkøber til faste kontorpladser
- **Anbefalet title (48 tegn):** Brugte stationære computere til erhverv | Kestro
- **Anbefalet meta description (135 tegn):** Refurbished stationære erhvervsmaskiner og små formfaktorer til kontoret. Vi sourcer til den enkelte ordre og oplyser stand skriftligt.
- **Anbefalet H1:** Stationære computere

### `/produkter/skaerme`

- **Primært søgeord:** brugte skærme
- **Sekundære:** refurbished skærme erhverv; kontorskærm; dobbeltskærm
- **Intention:** Commercial
- **Målgruppe:** Indkøber, der udstyrer arbejdspladser
- **Anbefalet title (44 tegn):** Brugte skærme til kontor og erhverv | Kestro
- **Anbefalet meta description (128 tegn):** Refurbished kontorskærme i 22 til 27 tommer, leveret sammen med maskiner og docking, så en arbejdsplads står komplet fra dag ét.
- **Anbefalet H1:** Skærme

### `/produkter/mini-pc`

- **Primært søgeord:** brugt mini pc
- **Sekundære:** mini pc erhverv; thinkcentre tiny
- **Intention:** Commercial
- **Målgruppe:** Indkøber til pladsbegrænsede opstillinger
- **Anbefalet title (38 tegn):** Brugte mini-pc'er til erhverv | Kestro
- **Anbefalet meta description (143 tegn):** Refurbished mini-pc'er og små formfaktorer til receptioner, kasseborde og kontorpladser med lidt plads. Sourcet per ordre, testet før levering.
- **Anbefalet H1:** Mini-pc'er

### `/produkter/dockingstationer`

- **Primært søgeord:** dockingstation til bærbar
- **Sekundære:** brugt dockingstation; usb-c dock
- **Intention:** Commercial
- **Målgruppe:** Indkøber, der laver dockede arbejdspladser
- **Anbefalet title (45 tegn):** Dockingstationer til erhvervsbærbare | Kestro
- **Anbefalet meta description (142 tegn):** Brugte dockingstationer, kabler og tilbehør, der passer til de maskiner vi leverer – så skærme og netværk virker uden at nogen skal fejlfinde.
- **Anbefalet H1:** Dockingstationer & tilbehør

### `/produkter/tablets`

- **Primært søgeord:** brugte tablets til erhverv
- **Sekundære:** refurbished ipad virksomhed
- **Intention:** Commercial
- **Målgruppe:** Indkøber til mobile roller
- **Anbefalet title (35 tegn):** Brugte tablets til erhverv | Kestro
- **Anbefalet meta description (133 tegn):** Refurbished tablets til lager, service og mødelokaler. Vi skaffer dem per ordre og oplyser stand og batteritilstand, før I bestiller.
- **Anbefalet H1:** Tablets

### `/produkter/smartphones`

- **Primært søgeord:** refurbished mobiltelefoner erhverv
- **Sekundære:** brugte iphones til virksomheder; firmatelefoner brugt
- **Intention:** Commercial
- **Målgruppe:** Indkøber til firmatelefoner
- **Anbefalet title (52 tegn):** Refurbished mobiltelefoner til virksomheder | Kestro
- **Anbefalet meta description (138 tegn):** Brugte firmatelefoner sourcet per ordre. Stand og batteritilstand oplyses per enhed, og gamle telefoner kan hentes retur med datasletning.
- **Anbefalet H1:** Smartphones

### `/modeller`

- **Primært søgeord:** lenovo thinkpad brugt
- **Sekundære:** brugte laptops; erhvervsbærbar; modeller
- **Intention:** Commercial investigation
- **Målgruppe:** Indkøber, der sammenligner modeller
- **Anbefalet title (45 tegn):** Modeller vi ofte skaffer til erhverv | Kestro
- **Anbefalet meta description (155 tegn):** De erhvervsmodeller vi oftest bliver bedt om at finde, med specifikationer og hvad de egner sig til. Ingen lager, ingen listepriser – vi sourcer per ordre.
- **Anbefalet H1:** Modeller vi ofte skaffer

### `/flaadeloesninger`

- **Primært søgeord:** computere til flere medarbejdere
- **Sekundære:** indkøb af 20 computere; udskiftning af firmacomputere; computere til hele kontoret
- **Intention:** Commercial
- **Målgruppe:** IT-ansvarlig med 10-500 enheder at udskifte
- **Anbefalet title (58 tegn):** Computere til flere medarbejdere – flådeløsninger | Kestro
- **Anbefalet meta description (130 tegn):** Fra ti maskiner til en hel medarbejderflåde: samme konfiguration hele vejen rundt, samlet levering og gamle maskiner hentet retur.
- **Anbefalet H1:** Udstyr hele virksomheden

### `/tilbud`

- **Primært søgeord:** tilbud på it-udstyr
- **Sekundære:** få et tilbud; pristilbud it
- **Intention:** Transactional
- **Målgruppe:** Indkøber klar til at spørge
- **Anbefalet title (42 tegn):** Få et tilbud på brugt erhvervs-IT | Kestro
- **Anbefalet meta description (136 tegn):** Fortæl os antal, specifikation og hvornår det skal stå klar. Vi vender tilbage med pris per enhed, stand og leveringstid. Uforpligtende.
- **Anbefalet H1:** Få et tilbud

### `/priser`

- **Primært søgeord:** hvad koster brugte computere til erhverv
- **Sekundære:** pris på refurbished computere; hvad koster 20 bærbare
- **Intention:** Commercial investigation
- **Målgruppe:** Indkøber, der skal lave et budget
- **Anbefalet title (46 tegn):** Hvad koster brugte erhvervscomputere? | Kestro
- **Anbefalet meta description (129 tegn):** Hvorfor der ikke står en pris på siden, hvad der afgør jeres pris, og hvad der står i tilbuddet, før I bestiller noget som helst.
- **Anbefalet H1:** Hvad koster det?

### `/kvalitet`

- **Primært søgeord:** garanti på refurbished computere
- **Sekundære:** grade a b c refurbished; brugte computere med garanti; er refurbished computere gode
- **Intention:** Commercial investigation
- **Målgruppe:** Indkøber, der vurderer risiko
- **Anbefalet title (52 tegn):** Garanti og stand på refurbished erhvervs-IT | Kestro
- **Anbefalet meta description (136 tegn):** Hvad grad A, B og C dækker, hvad en funktionstest skal indeholde, og hvad I bør have skriftligt om garanti, før I køber brugt IT-udstyr.
- **Anbefalet H1:** Stand, test og hvad I bør spørge om

### `/saelg-til-os`

- **Primært søgeord:** sælg brugt it-udstyr
- **Sekundære:** opkøb af brugt it-udstyr; sælg brugte firmacomputere; vurdering af brugt it
- **Intention:** Transactional
- **Målgruppe:** Virksomhed, der skal af med udstyr
- **Anbefalet title (36 tegn):** Sælg jeres brugte IT-udstyr | Kestro
- **Anbefalet meta description (134 tegn):** Vi køber brugte erhvervsmaskiner, henter dem og sletter lagermedierne, før de får et nyt liv. I får en vurdering, før I beslutter jer.
- **Anbefalet H1:** Sælg jeres brugte IT-udstyr

### `/reparation`

- **Primært søgeord:** reparation af firmacomputere
- **Sekundære:** udskift batteri i bærbar; ssd opgradering erhverv
- **Intention:** Commercial
- **Målgruppe:** Virksomhed med maskiner, der halter
- **Anbefalet title (52 tegn):** Reparation og opgradering af firmacomputere | Kestro
- **Anbefalet meta description (139 tegn):** Batteri, disk, hukommelse og skærm på erhvervsmaskiner. I får en pris, før vi går i gang – og et ærligt svar, hvis det ikke kan betale sig.
- **Anbefalet H1:** Reparation og opgradering

### `/ydelser/sourcing-og-indkoeb`

- **Primært søgeord:** it-indkøb til erhverv
- **Sekundære:** it sourcing; indkøbspartner it-udstyr; skaffe specifik computermodel
- **Intention:** Commercial
- **Målgruppe:** Indkøber, der vil have en partner frem for en webshop
- **Anbefalet title (52 tegn):** IT-indkøb til erhverv – sourcing uden lager | Kestro
- **Anbefalet meta description (129 tegn):** Vi finder det rigtige IT-udstyr til jer hos leverandører i Sydeuropa og køber først ind, når I ved, hvad I skal bruge – ikke før.
- **Anbefalet H1:** Sourcing og indkøb

### `/ydelser/klargoering-og-test`

- **Primært søgeord:** klargøring af computere til medarbejdere
- **Sekundære:** funktionstest af brugt computer; opsætning af firmacomputere
- **Intention:** Commercial
- **Målgruppe:** IT-ansvarlig, der vil vide hvad der sker før levering
- **Anbefalet title (54 tegn):** Klargøring og test af brugte erhvervsmaskiner | Kestro
- **Anbefalet meta description (134 tegn):** Funktionstest af skærm, tastatur, batteri og ydeevne, opgradering efter behov og sletning af lagermediet, før maskinen sættes op igen.
- **Anbefalet H1:** Klargøring, test og opgradering

### `/ydelser/nordisk-tilpasning`

- **Primært søgeord:** nordisk tastatur på importeret computer
- **Sekundære:** dansk tastaturlayout; licenser til firmacomputere
- **Intention:** Commercial
- **Målgruppe:** IT-ansvarlig med importeret hardware
- **Anbefalet title (44 tegn):** Nordisk tastatur og dansk opsætning | Kestro
- **Anbefalet meta description (130 tegn):** Tastaturet skiftes fysisk til dansk eller norsk layout, og Windows sættes op med drivere og sprog, så maskinen er klar fra dag ét.
- **Anbefalet H1:** Nordisk tilpasning og software

### `/ydelser/opstart-af-arbejdspladser`

- **Primært søgeord:** it-udstyr til nye medarbejdere
- **Sekundære:** onboarding it; arbejdsplads til ny medarbejder
- **Intention:** Commercial
- **Målgruppe:** HR eller IT, der modtager nye medarbejdere
- **Anbefalet title (39 tegn):** IT-udstyr til nye medarbejdere | Kestro
- **Anbefalet meta description (126 tegn):** En komplet arbejdsplads til den nye medarbejder: maskine, skærm, dock og tastatur, sat op ens hver gang og leveret til datoen.
- **Anbefalet H1:** Opstart af arbejdspladser

### `/ydelser/levering`

- **Primært søgeord:** levering af it-udstyr til virksomheder
- **Sekundære:** udrulning af nye computere; levering i hele danmark
- **Intention:** Commercial
- **Målgruppe:** Indkøber, der planlægger en udrulning
- **Anbefalet title (47 tegn):** Levering af IT-udstyr til virksomheder | Kestro
- **Anbefalet meta description (129 tegn):** Samlet levering til én eller flere adresser i Danmark og Norge, med en tidsramme, I får oplyst skriftligt, før I bestiller noget.
- **Anbefalet H1:** Levering til virksomheden

### `/ydelser/overskudslager-og-returvarer`

- **Primært søgeord:** overskudslager it
- **Sekundære:** returvarer it; demoenheder salg
- **Intention:** Transactional
- **Målgruppe:** Virksomhed med usolgt eller returneret udstyr
- **Anbefalet title (42 tegn):** Overskudslager og returvarer i IT | Kestro
- **Anbefalet meta description (128 tegn):** Returvarer, demoenheder og udstyr fra aflyste ordrer taber værdi hver måned det står stille. Vi finder køberne i stedet for jer.
- **Anbefalet H1:** Overskudslager og returvarer

### `/vejledninger/slet-data-foer-du-saelger`

- **Primært søgeord:** sikker datasletning
- **Sekundære:** datasletning virksomhed; sletterapport; gdpr bortskaffelse it
- **Intention:** Informational
- **Målgruppe:** Dataansvarlig, der skal af med udstyr
- **Anbefalet title (53 tegn):** Sikker datasletning før salg eller kassering | Kestro
- **Anbefalet meta description (134 tegn):** En formateret disk er ikke en slettet disk. Sådan sletter I data forsvarligt, og hvad en sletterapport med serienummer skal indeholde.
- **Anbefalet H1:** Sådan sletter du data, før du sælger eller kasserer en computer

### `/vejledninger/tjek-brugt-baerbar-foer-koeb`

- **Primært søgeord:** hvad skal man tjekke på en brugt bærbar
- **Sekundære:** tjekliste brugt computer; batteritilstand brugt bærbar
- **Intention:** Informational
- **Målgruppe:** Køber, der vil undgå en dårlig handel
- **Anbefalet title (50 tegn):** Ti ting du skal tjekke på en brugt bærbar | Kestro
- **Anbefalet meta description (124 tegn):** Batteri, hængsler, porte, skærm og tastatur: tjeklisten, der afslører, om en brugt bærbar holder til et par år mere hos jer.
- **Anbefalet H1:** Ti ting du skal tjekke på en brugt bærbar, før du køber

### `/vejledninger/windows-11-paa-aeldre-maskine`

- **Primært søgeord:** windows 11 krav gammel computer
- **Sekundære:** tpm 2.0 krav; windows 11 pro på brugt computer
- **Intention:** Informational
- **Målgruppe:** IT-ansvarlig før en Windows-udskiftning
- **Anbefalet title (57 tegn):** Windows 11 på en ældre maskine: hvad kræver det? | Kestro
- **Anbefalet meta description (122 tegn):** TPM 2.0, Secure Boot og processorkrav forklaret – og hvad I stiller op med de maskiner i flåden, der ikke kommer med over.
- **Anbefalet H1:** Windows 11 på en ældre maskine: hvad kræver det?

### `/kontakt`

- **Primært søgeord:** brugte computere aarhus
- **Sekundære:** it-udstyr til virksomheder aarhus
- **Intention:** Navigational
- **Målgruppe:** Nogen, der vil tale med et menneske
- **Anbefalet title (32 tegn):** Kontakt Kestro – Aarhus | Kestro
- **Anbefalet meta description (141 tegn):** Skriv til os om et indkøb, en flåde eller udstyr, I skal af med. Vi svarer inden for én arbejdsdag – og vi sælger ikke til jer i mellemtiden.
- **Anbefalet H1:** Kontakt os

## hreflang

Kortlægningen respekterer den opsætning, der allerede kører, og foreslår ingen ændring af den:

- Hver dansk URL har præcis én engelsk modpart på `/en` + samme sti, og omvendt. Alle 112 sider bærer `da`, `en` og `x-default`, symmetrisk begge veje.
  <br>_Note tilføjet efter trin 4 (30-08-2026): tallet var 112, da kortlægningen blev skrevet. Trin 4 fjernede tre URL'er med 301, så det er 106 nu. Symmetrien er uændret._
- **Ingen engelsk søgeord er tildelt en dansk URL og omvendt.** De 17 engelske ord peger alle på `/en/...`-modparten af den side, det danske ord peger på.
- De ni foreslåede nye sider skal oprettes i **begge** sprog samtidig, ellers brydes symmetrien. Hvis en side kun giver mening på dansk, skal den engelske modpart ikke laves halvt — så skal siden holdes ude af hreflang-klyngen helt.
- `x-default` peger på dansk. Det er korrekt for et dansk primærmarked.
- **Kendt afvigelse, ikke ændret her:** de engelske URL'er bruger danske slugs (`/en/flaadeloesninger`). Det er et reelt CTR-problem, men en URL-migrering med 301'er hører til trin 3, ikke til kortlægningen.

## Tal

- **Søgeord kortlagt:** 156
- **Til eksisterende sider:** 133
- **Til nye sider:** 17 ord fordelt på 9 foreslåede sider
- **Ikke målrettet:** 6 (med begrundelse per ord i CSV'en)
- **URL'er med mindst ét søgeord:** 70
- **URL'er med et defineret primært ord:** 69 — ingen URL har to, og intet primært ord findes på to URL'er
- **Kannibaliseringskonflikter:** 6 (1 høj, 4 mellem, 1 lav under observation)
- **Sider uden meningsfuldt primært ord:** 7

## De 20 vigtigste søgeord

High-prioritet og primære, vægtet efter hvor tæt kategorien og intentionen er på en ordre. Modelsiderne er stærke long tail, men de kommer efter kerne-, flåde- og indkøbsordene, fordi de hver især kun rammer én maskine.

| # | Søgeord | Sprog | Intention | Kategori | Side |
| --- | --- | --- | --- | --- | --- |
| 1 | brugt it-udstyr til virksomheder | da | commercial | Kerne | `/produkter` |
| 2 | refurbished computere erhverv | da | commercial | Kerne | `/` |
| 3 | sælg brugt it-udstyr | da | transactional | B2B: opkøb | `/saelg-til-os` |
| 4 | tilbud på it-udstyr | da | transactional | B2B: indkøb | `/tilbud` |
| 5 | computere til flere medarbejdere | da | commercial | B2B: flåde | `/flaadeloesninger` |
| 6 | it til mindre virksomheder | da | commercial | B2B: flåde | `/vejledninger/it-til-mindre-virksomheder` |
| 7 | it-indkøb til erhverv | da | commercial | B2B: indkøb | `/ydelser/sourcing-og-indkoeb` |
| 8 | it-udstyr til nye medarbejdere | da | commercial | B2B: flåde | `/ydelser/opstart-af-arbejdspladser` |
| 9 | it-udstyr til nystartet virksomhed | da | commercial | B2B: flåde | `/vejledninger/it-til-nystartet-virksomhed` |
| 10 | hvad koster brugte computere til erhverv | da | commercial investigation | B2B: indkøb | `/priser` |
| 11 | standardisering af computere i virksomheden | da | informational | B2B: flåde | `/vejledninger/standardiser-firmacomputere` |
| 12 | brugte bærbare computere | da | commercial | Produkt: bærbare | `/produkter/baerbare-computere` |
| 13 | garanti på refurbished computere | da | commercial investigation | Tillid: stand | `/kvalitet` |
| 14 | hvad skal man tjekke på en brugt bærbar | da | informational | Tillid: stand | `/vejledninger/tjek-brugt-baerbar-foer-koeb` |
| 15 | sikker datasletning | da | informational | Tillid: data | `/vejledninger/slet-data-foer-du-saelger` |
| 16 | brugte skærme | da | commercial | Produkt: skærme | `/produkter/skaerme` |
| 17 | brugte stationære computere | da | commercial | Produkt: stationære | `/produkter/stationaere-computere` |
| 18 | klargøring af computere til medarbejdere | da | commercial | Service: klargøring | `/ydelser/klargoering-og-test` |
| 19 | reparere eller købe ny computer | da | commercial investigation | Service: reparation | `/vejledninger/reparere-eller-koebe-ny` |
| 20 | hvor meget ram har man brug for | da | informational | Service: reparation | `/vejledninger/ram-og-ssd-til-kontormaskiner` |

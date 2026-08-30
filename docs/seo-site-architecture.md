# Trin 3 — endelig SEO-arkitektur for kestro.dk

Kilde: `docs/seo-keyword-map.csv` (trin 2). Målinger: den kørende produktionsbuild af `41c23bb`, 30. august 2026.

**Intet er ændret.** Ingen sider, routes, metadata, schema, sitemap, design eller indhold. Dette dokument er en plan, der venter på godkendelse, og hver enkelt beslutning står med den måling, den bygger på.

## Målingerne beslutningerne hviler på

Interne indgående links (uden header og footer tæller alle sider i menuen 55), ordantal og antal modeller knyttet til siden:

| Side | Indgående | Ord | Modeller |
| --- | --- | --- | --- |
| `/produkter/baerbare-computere` | 19 | 688 | 9 |
| `/produkter/skaerme` | 13 | 513 | 3 |
| `/produkter/dockingstationer` | 12 | 455 | 3 |
| `/produkter/stationaere-computere` | 12 | 456 | 2 |
| `/produkter/mini-pc` | 10 | 433 | 1 |
| `/produkter/tablets` | 9 | 364 | 0 |
| `/produkter/smartphones` | 9 | 345 | 0 |
| `/produkter/smartwatches` | 9 | 345 | 0 |
| `/produkter/gaming` | 9 | 365 | 0 |
| `/flaadeloesninger/forespoergsel` | 4 | 338 | 0 |
| `/ydelser/opstart-af-arbejdspladser` | 1 | 413 | 0 |
| `/ydelser/overskudslager-og-returvarer` | 1 | 396 | 0 |
| `/vejledninger/windows-11-paa-aeldre-maskine` | 1 | 556 | 0 |
| `/vejledninger/slet-data-foer-du-saelger` | 1 | 536 | 0 |

To ting springer ud af tabellen:

1. **Fire kategorier har ingen modeller under sig** — tablets, smartphones, smartwatches og gaming. De øvrige fem har 1-9.
2. **De sider, der skal bære de vigtigste søgeord, er dem med færrest links.** Windows 11-guiden og datasletningsguiden har ét indgående link hver, og de er primære for to High-prioritets søgeord. Det er ikke et indholdsproblem, det er et arkitekturproblem.

## 1. `/tilbud` mod `/flaadeloesninger/forespoergsel`

**Beslutning: 301 fra `/flaadeloesninger/forespoergsel` til `/tilbud`.**

| Kriterium | `/tilbud` | `/flaadeloesninger/forespoergsel` |
| --- | --- | --- |
| Ord | 389 | 338 |
| Indgående links | 55 (i menuen) | 4 |
| Formular | Antalsbånd 1 / 2-9 / 10-49 / 50+, model, RAM, disk, tastatur, dato | Fri tekst |
| Primært søgeord | tilbud på it-udstyr | ingen egen |

De to sider har samme intention, samme handling og samme formular. `/tilbud` har den bedre formular, hele menuen peger på den, og antalsbåndet 50+ dækker præcis det, flådeforespørgslen fandtes for. `/flaadeloesninger` beholder sin CTA, men den peger fremover på `/tilbud?antal=50%2B`.

**UNKNOWN:** om `/flaadeloesninger/forespoergsel` rangerer på noget eller får trafik i dag. Der er ingen Search Console- eller analytics-data at slå op i endnu. En 301 er netop derfor det rigtige valg frem for en sletning: den bevarer det, der måtte være, uden at vi behøver at vide det først.

## 2. `/produkter` mod `/modeller`

**Beslutning: begge beholdes, med skarpt adskilte roller. Ingen URL-flytning.**

- `/produkter` ejer **kategorien**: "brugt it-udstyr til virksomheder". Den svarer på *hvilke typer udstyr kan I skaffe*.
- `/modeller` ejer **mærke og model**: "lenovo thinkpad brugt". Den svarer på *hvilke konkrete maskiner kender I*.

Kannibaliseringen i dag er i titlen: `/modeller` hedder "Modeller vi ofte skaffer | Brugte erhvervscomputere | Kestro" og tager dermed kategoriordene. Den skal hedde "Modeller vi ofte skaffer til erhverv | Kestro" (trin 2, side-for-side).

**Overvejet og fravalgt:** at flytte modelsiderne ind under kategorierne (`/produkter/baerbare-computere/lenovo-thinkpad-t480`). Det ville udtrykke hierarkiet i URL'en, men koster 36 301-redirects, 36 canonicals, 36 hreflang-par og en periode med to sæt URL'er i indekset — mod en gevinst, der er teoretisk. Hierarkiet udtrykkes i stedet i brødkrummer og interne links, hvor Google faktisk læser det.

## 3. `/kvalitet` og de beslægtede sider

**Beslutning: tre sider, tre roller, ingen overlap i primære ord.**

| Side | Rolle | Primært ord | Må ikke tage |
| --- | --- | --- | --- |
| `/kvalitet` | **Vores standard og garanti** | garanti på refurbished computere | "hvad skal man tjekke" |
| `/vejledninger/tjek-brugt-baerbar-foer-koeb` | **Køberens egen tjekliste** | hvad skal man tjekke på en brugt bærbar | "garanti" |
| `/ydelser/klargoering-og-test` | **Hvad vi gør ved maskinen** | klargøring af computere til medarbejdere | "grad A B C" |

De tre skal krydslinke: kvalitet → tjekliste ("vil I selv tjekke, så her er listen"), tjekliste → kvalitet ("sådan gør vi"), klargøring → kvalitet.

## 4. `/flaadeloesninger` mod `/ydelser/opstart-af-arbejdspladser`

**Beslutning: begge beholdes. De løser to forskellige opgaver.**

- `/flaadeloesninger` = **mange enheder på én gang**, et projekt med en dato. Primært: "computere til flere medarbejdere".
- `/ydelser/opstart-af-arbejdspladser` = **én ny medarbejder ad gangen**, løbende. Primært: "it-udstyr til nye medarbejdere".

Problemet er ikke overlap, det er synlighed: opstartssiden har **ét** indgående link. Den skal linkes fra `/flaadeloesninger` ("skal I kun bruge én arbejdsplads ad gangen?"), fra `/ydelser` og fra `/tilbud`.

## 5. `/produkter/gaming` og `/produkter/smartwatches`

**Beslutning: begge ud af arkitekturen. De er de eneste to sider på sitet uden en B2B-intention at tildele.**

| Side | Ord | Modeller | B2B-søgeord i trin 2 | Beslutning |
| --- | --- | --- | --- | --- |
| `/produkter/gaming` | 365 | 0 | ingen | **301 → `/produkter`** |
| `/produkter/smartwatches` | 345 | 0 | ingen | **Flet ind i `/produkter/smartphones` som et afsnit, derefter 301** |

Gaming trækker hobbyister ind på et domæne, hvis hele indhold taler til indkøbere; det er ikke bare irrelevant trafik, det er et forkert signal om, hvad sitet handler om. Smartwatches er tættere på forretningen — en virksomhed, der køber firmatelefoner, kan spørge til ure — men den fortjener et afsnit, ikke en side.

**Konsekvens:** sitemap går fra 112 til 108 URL'er (to sider × to sprog). Menuen mister to punkter.

**Alternativ, hvis I hellere vil beholde dem:** `noindex, follow` og ude af sitemap og menu. Så findes de stadig for en kunde, der spørger, uden at fortynde domænet. Vælg én af de to — at lade dem ligge som de er, er den eneste mulighed uden fordele.

**UNKNOWN:** om nogen af de to sider rangerer eller får trafik i dag. Ingen Search Console-data. 301 bevarer, en sletning gør ikke — derfor 301.

## 6. Den endelige arkitektur

```
/                                   Forside · brand + hovedord
│
├── /produkter                      KATEGORIHUB
│   ├── /produkter/baerbare-computere        (9 modeller)
│   ├── /produkter/stationaere-computere     (2)
│   ├── /produkter/skaerme                   (3)
│   ├── /produkter/dockingstationer          (3)
│   ├── /produkter/mini-pc                   (1)
│   ├── /produkter/tablets                   (0)
│   └── /produkter/smartphones               (0, + smartwatches som afsnit)
│
├── /modeller                       MODELINDEKS
│   └── /modeller/<model>                    (36 sider, flad struktur)
│
├── /ydelser                        YDELSESHUB
│   ├── /ydelser/sourcing-og-indkoeb
│   ├── /ydelser/klargoering-og-test
│   ├── /ydelser/nordisk-tilpasning
│   ├── /ydelser/levering
│   ├── /ydelser/opstart-af-arbejdspladser
│   └── /ydelser/overskudslager-og-returvarer
│
├── /flaadeloesninger               SEGMENT · mange enheder på én gang
├── /saelg-til-os                   OMVENDT FLOW · vi køber
├── /reparation                     SIDEYDELSE
│
├── /kvalitet                       TILLID · standard og garanti
├── /priser                         TILLID · hvad afgør prisen
├── /tilbud-eksempel                TILLID · dokumentet, ikke en landingsside
├── /maskinen                       TILLID · teknisk dybde
│
├── /tilbud                         KONVERTERING · én formular, ét sted
│
├── /vejledninger                   INDHOLDSHUB
│   └── /vejledninger/<guide>                (6 i dag + 8 foreslåede)
│
└── /om-os · /kontakt · /privatlivspolitik   VIRKSOMHED
```

**Fire niveauer, ikke fem.** Der oprettes **ingen underkategorier** (`/produkter/baerbare-computere/14-tommer` og lignende). Trin 2 fandt ingen søgning, der efterspørger dem, og en underkategori uden efterspørgsel er en tynd side, der stjæler links fra sin forælder. Det er en beslutning, ikke en forglemmelse.

Engelsk spejler dansk 1:1 under `/en` med samme stier. Ingen selvstændige engelske sider, ingen `/no`.

## 7. Interne links

I dag er interne links stort set lig med menuen: alt i menuen har 55 indgående, alt udenfor har 1-13. Det er derfor de vigtigste undersider er svagest. Reglerne herunder er skrevet for at rette netop det.

**Regel 1 — ingen side under tre indgående links.** Fem sider er under i dag:
`/vejledninger/windows-11-paa-aeldre-maskine` (1), `/vejledninger/slet-data-foer-du-saelger` (1),
`/ydelser/opstart-af-arbejdspladser` (1), `/ydelser/overskudslager-og-returvarer` (1) og
`/modeller/hp-zbook-15` (2). De to første er primære for High-prioritets søgeord.

**Regel 2 — kategori ↔ model.** Kategorisiden linker til hver model i sin kategori. Modelsiden linker tilbage til sin kategori og til to beslægtede modeller. (Delvist på plads i dag.)

**Regel 3 — vejledning → den side, der løser problemet.** Hver guide slutter med ét link til den kommercielle side, der svarer på det, guiden rejste:

| Guide | Linker til |
| --- | --- |
| tjek-brugt-baerbar-foer-koeb | `/kvalitet`, `/produkter/baerbare-computere` |
| slet-data-foer-du-saelger | `/saelg-til-os` |
| windows-11-paa-aeldre-maskine | `/produkter/baerbare-computere`, `/tilbud` |
| opgrader-ram-i-baerbar | `/reparation` |
| reparere-eller-koebe-ny | `/reparation`, `/priser` |

**Regel 4 — kommerciel side → den guide, der fjerner indvendingen.** `/kvalitet` → tjeklisten. `/priser` → TCO-guiden (når den findes). `/flaadeloesninger` → standardiseringsguiden (når den findes).

**Regel 5 — én vej til konvertering.** Alle CTA'er peger på `/tilbud`. `/flaadeloesninger` peger på `/tilbud?antal=50%2B`. Ingen anden formular.

**Regel 6 — ankertekst beskriver målet, og gentages ikke ordret.** Ikke fem links med teksten "brugte bærbare computere". Variation er ikke pynt her: identiske ankre på tværs af sitet ligner et mønster frem for en henvisning.

**Regel 7 — hubs linker nedad, altid komplet.** `/ydelser` til alle seks ydelser, `/vejledninger` til alle guides, `/produkter` til alle kategorier. Det er den billigste rettelse af 1-link-problemet.

## 8. Brødkrummer

82 af 112 sider har `BreadcrumbList` i dag. De 30, der mangler, er hubs og topsider — altså forældrene til dem, der har den.

**Regel: en brødkrumme markeres kun op, hvis den også står på siden.** Derfor skal hubsiderne have en synlig sti, ikke bare schema.

| Sidetype | Sti |
| --- | --- |
| Topside (`/produkter`, `/ydelser`, `/vejledninger`, `/modeller`, `/kvalitet` …) | Forside › **Siden** |
| Kategori | Forside › Hvad vi skaffer › **Kategori** |
| Model | Forside › Modeller › **Model** |
| Ydelse | Forside › Ydelser › **Ydelse** |
| Vejledning | Forside › Vejledninger › **Guide** |
| `/tilbud`, `/kontakt`, `/om-os` | Forside › **Siden** |

Modelsiderne står under `/modeller`, ikke under deres kategori: stien skal matche den vej, brugeren faktisk kan gå, og URL'en er flad. Kategorien nås fra et link i brødteksten i stedet.

## 9. Behold · flet · redirect · noindex

| Side | Beslutning | Begrundelse |
| --- | --- | --- |
| / | Behold | Forside, hovedord |
| /produkter + 5 kategorier med modeller | Behold | Kerne i arkitekturen |
| /produkter/tablets | Behold, men styrk | Har B2B-søgeord (P2), men 0 modeller og 364 ord |
| /produkter/smartphones | Behold, udvid | Modtager smartwatches-afsnittet |
| /produkter/smartwatches | **Flet + 301** → `/produkter/smartphones` | 0 modeller, 0 B2B-søgeord, 345 ord |
| /produkter/gaming | **301** → `/produkter` | Forkert publikum for et B2B-domæne |
| /modeller + 36 modelsider | Behold | Long tail med købsintention |
| /flaadeloesninger | Behold | Segmentside, 55 links |
| /flaadeloesninger/forespoergsel | **301** → `/tilbud` | Samme intention, tyndere side, dårligere formular |
| /ydelser + 6 ydelsessider | Behold, link bedre | To af dem har ét indgående link |
| /kvalitet, /priser, /tilbud-eksempel, /maskinen | Behold | Tillidsspor, hver med sin rolle |
| /tilbud | Behold | Den ene konverteringsside |
| /saelg-til-os, /reparation | Behold | Egne intentioner, egne primære ord |
| /vejledninger + 5 guides | Behold | Informationelt spor |
| /vejledninger/samle-din-egen-pc | Behold, men **byg ikke videre** | Forkert publikum; ikke skadelig nok til at fjerne |
| /om-os, /kontakt, /privatlivspolitik | Behold | Virksomhed og jura |
| /api/version | Ingen ændring | Ikke i sitemap, ikke crawlbar |

**Ingen sider foreslås `noindex`.** Alt, der ikke skal indekseres, foreslås enten 301'et eller flettet — en `noindex`-side, der stadig ligger i menuen, er en side, ingen har taget stilling til.

## 10. Dansk, engelsk og hreflang

Opsætningen i dag er korrekt og ændres ikke: 112 sider, hver med `da`, `en` og `x-default`, symmetrisk begge veje, `x-default` mod dansk.

**Krav til enhver ændring i denne plan:**

1. Hver 301 skal laves **i begge sprog** samtidig: `/produkter/gaming` → `/produkter` og `/en/produkter/gaming` → `/en/produkter`.
2. `app/sitemap.ts` skal opdateres i samme deploy, ellers peger sitemap på URL'er, der redirecter.
3. hreflang-klyngen for en fjernet side skal fjernes helt — ikke pege på en URL, der redirecter.
4. Nye sider oprettes i begge sprog samtidig, eller slet ikke.

**Kendt afvigelse, bevidst ikke rettet her:** de engelske URL'er bruger danske slugs (`/en/flaadeloesninger`, `/en/vejledninger`). Det er et reelt CTR-problem for en engelsksproget læser i søgeresultatet, men en oversættelse af slugs er 56 301'er oveni de tre, denne plan allerede foreslår. **Anbefaling: gør det i en separat omgang, efter denne plan er sat i drift og har ligget stabilt.** Ikke to URL-migreringer i samme deploy.

## 11. Nye sider, i den rækkefølge de skal laves

Fra trin 2, uændret, med prioritet efter forretningsværdi:

| Pri | URL | Primært søgeord |
| --- | --- | --- |
| P0 | `/vejledninger/windows-10-support-slutter` | windows 10 support slut virksomhed |
| P1 | `/vejledninger/refurbished-eller-brugt` | refurbished vs brugt |
| P1 | `/vejledninger/vaelg-erhvervsbaerbar` | thinkpad vs elitebook vs latitude |
| P1 | `/vejledninger/standardiser-firmacomputere` | standardisering af computere i virksomheden |
| P1 | `/vejledninger/it-til-nystartet-virksomhed` | it-udstyr til nystartet virksomhed |
| P1 | `/vejledninger/it-til-mindre-virksomheder` | it til mindre virksomheder |
| P1 | `/vejledninger/ram-og-ssd-til-kontormaskiner` | hvor meget ram har man brug for |
| P2 | `/vejledninger/tco-paa-firmacomputere` | tco på firmacomputere |
| P2 | `/vejledninger/leasing-eller-koeb` | leasing eller køb af firmacomputere |

Alle ni er vejledninger. Det er ikke en tilfældighed: kategorierne og ydelserne findes allerede, og det, der mangler, er svarene på de spørgsmål, der kommer *før* nogen ser på en kategori.

## 12. Risici og det, der kræver din beslutning

| # | Beslutning | Risiko hvis vi tager fejl |
| --- | --- | --- |
| 1 | 301 fra `/flaadeloesninger/forespoergsel` til `/tilbud` | Lav. Siden er tynd og har fire links. Hvis den mod forventning rangerer, bevarer 301'en det. |
| 2 | 301 fra `/produkter/gaming` til `/produkter` | Lav-mellem. Hvis gaming faktisk trækker trafik, mister vi den — men det er trafik uden købsintention på et B2B-domæne. |
| 3 | Flet smartwatches ind i smartphones | Lav. Indholdet bevares som afsnit. |
| 4 | Ingen underkategorier | Lav. Kan altid tilføjes senere, hvis der kommer efterspørgsel. Det omvendte — at fjerne dem igen — er dyrere. |
| 5 | Modelsider bliver liggende fladt under `/modeller` | Lav. Alternativet koster 36 redirects for en teoretisk gevinst. |
| 6 | Engelske slugs udskydes | Mellem. Vi lever med et CTR-tab på det sekundære marked, indtil det gøres. |

**Tre ting, jeg ikke kan afgøre for jer, fordi der ikke er data:**

1. **UNKNOWN — trafik og placeringer.** Der er ingen Search Console-historik og ingen analytics endnu (GA4 er implementeret, men først målt fra den dag, den er live og nogen har accepteret statistik). Hver eneste "behold eller fjern" herover er truffet på indhold, søgeordskort og interne links — ikke på målt trafik. **Anbefaling: kør Search Console i mindst 30 dage, før de tre 301'er sættes i drift.**
2. **UNKNOWN — sælger I reelt gaming-udstyr og smartwatches?** Hvis en kunde har spurgt efter dem, ændrer det billedet. Kortet kan kun se sitet.
3. **UNKNOWN — hvilken build der kører i produktion.** Fastslået i går, at det ikke er den nyeste. `/api/version` svarer på det, når den er deployet.

## 13. Sammenfatning

| | Før | Efter |
| --- | --- | --- |
| Sider i sitemap | 112 | 108 |
| Kategorier | 9 | 7 |
| Konverteringsformularer | 2 | 1 |
| Kannibaliseringskonflikter | 6 | 0 |
| Sider uden primært søgeord | 7 | 5 (bevidst: /om-os, /tilbud-eksempel, /maskinen, samle-din-egen-pc, /privatlivspolitik) |
| Brødkrummer | 82/112 | 108/108 |
| Sider med under 3 indgående links | 5 | 0 |

Ingen af tallene i højre kolonne er nået endnu. De er målet for trin 4-6, når du har godkendt planen.

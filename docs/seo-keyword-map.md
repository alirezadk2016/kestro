# Søgeordskort for kestro.dk

Filer: dette dokument og `docs/seo-keyword-map.csv`. CSV'en har én række per søgeord – 191 i alt, 170 danske og 20 engelske – og for hver række den title, siden har i dag, og om søgeordet står i den.

Anden udgave. Den første var en plan; denne er gennemført: 122 titles og 111 meta descriptions er skrevet om på de 136 URL'er i sitemap'et, og hver eneste er målt i pixels, sådan som Google klipper dem.

## Hvad der var galt

Listen så grundig ud, men den gav ikke klik. Seks konkrete fejl:

1. **Reparationssiderne manglede helt.** 24 URL'er – 12 danske og 12 engelske – havde ikke et eneste søgeord. Det er netop de sider, hvor folk søger med et akut problem: »batteriskift bærbar«, »computer starter ikke«, »skærmskift bærbar«. Deres titles havde heller ikke brandet med: »Klargøring af brugt udstyr«, »Reservedele og komponentskift«.
2. **Titlerne beskrev siden indefra i stedet for søgningen.** »Modeller vi ofte skaffer til erhverv«, »Om os – hvem I handler med«, »Viden om erhvervs-IT«. Ingen skriver de ord i Google.
3. **Atten modeltitler var den samme skabelon:** »Brugt Lenovo ThinkPad T480 til erhverv«. »Til erhverv« er ikke noget, nogen søger på, og titlen lovede ikke noget, en butiksannonce ikke også lover.
4. **27 descriptions var længere end Google viser** (ca. 920 px) og blev klippet midt i en sætning. Mange sluttede med »Skaffes til jeres ordre« – en oplysning, ikke en grund til at klikke.
5. **En title var for lang:** Windows 10-guiden, 591 px.
6. **Rækkerne pegede forkert.** 14 søgeord pegede på guides, der endnu ikke er skrevet. To af dem (om SSD) havde allerede en rigtig side, de kunne pege på. Alle 17 engelske søgeord pegede på adresser som `/en/produkter/baerbare-computere`, som 301-viderestiller; de rigtige engelske adresser er `/en/products/business-laptops`.

Før: af de primære søgeord, der pegede på en side, der findes, stod 37 helt i sidens title, 10 delvist og 1 slet ikke. 21 primære søgeord pegede enten på en guide, der ikke er skrevet, eller på en engelsk adresse, der viderestiller.

Nu: 84 primære søgeord. 68 står helt i title, 9 delvist (et synonym som »ældre« for »gammel« eller et småord), 0 slet ikke. 7 peger på foreslåede guides, der ikke er skrevet endnu, og er markeret som det.

## Reglerne for en title

**Det, folk skriver, først. Hvad de får, bagefter. »| Kestro« til sidst. Højst 580 px.**

- **Modeller:** `Brugt <model>: specs, fordele og ulemper | Kestro` – engelsk `Refurbished <model>: specs, pros and cons | Kestro`. Modelnavnet og »brugt« er søgningen. »Fordele og ulemper« lover det, siden faktisk har – afsnittene »God til« og »Vær opmærksom på« – og som ingen butiksannonce med en pris har. Hvor modelnavnet er for langt, falder »Lenovo« ud (folk skriver »thinkpad t480«, ikke »lenovo thinkpad t480«).
- **Reparation:** jobbet eller symptomet først – »Batteriskift på bærbar«, »Computer starter ikke eller går ned?«, »Varm og larmende bærbar?«. Når folk søger på symptomet, er titlen formuleret som deres spørgsmål.
- **Kategorier:** »Brugte <kategori> …« plus mærkerne, når der er plads – mærkenavne er det, en indkøber genkender i et søgeresultat.
- **Brugt og refurbished:** det danske marked bruger begge ord. Danske titles bruger »brugt«, og »refurbished« står i description eller som andet ord i title. Engelske titles bruger »refurbished«.
- **Brandet** står sidst på hver side. Hvor »Kestro« allerede står i titlen (kontakt, om os), står det ikke to gange.

## Reglerne for en description

**560–920 px. Første sætning svarer, sidste sætning giver en grund til at klikke.**

- Konkrete fakta fra siden selv: skærmstørrelse, processorgeneration, antal sokler, »målt batterikapacitet i procent«, »dansk eller norsk tastatur«.
- Slutningen er det, kunden får: »Tilbud med stand og batteri«, »Pris, før vi går i gang«, »Svar inden for én arbejdsdag«.
- **Ingen tal, siden ikke selv har.** Ingen priser, ingen leveringstider, ingen garantiperiode. Garantien står i tilbuddet, og det er præcis det, en description siger. Hvor en model har en reel svaghed (loddet RAM på X1 Carbon, Ultra Dock passer kun til visse ThinkPads), står den i description. Det er ærligt, og det er det, der skiller siden ud fra en butik.

## Side for side

Primært søgeord og title for hver dansk side. De engelske sider følger samme mønster og står i CSV'en.

### Forside, hubs og tillid

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/` | brugte computere til virksomheder | Brugte og refurbished computere til virksomheder \| Kestro | Refurbished erhvervscomputere til virksomheder \| Kestro |
| `/produkter` | brugt it-udstyr til virksomheder | Brugt IT-udstyr til virksomheder: pc, skærm og dock \| Kestro | Brugt IT-udstyr til virksomheder – hvad vi skaffer \| Kestro |
| `/modeller` | brugt thinkpad | Brugte ThinkPad, EliteBook, Latitude og OptiPlex \| Kestro | Modeller vi ofte skaffer til erhverv \| Kestro |
| `/reparation` | computer reparation | Reparation af computer og bærbar – også for private \| Kestro | Reparation og opgradering af firmacomputere \| Kestro |
| `/ydelser` | — | Ydelser: indkøb, klargøring, levering og opkøb af IT \| Kestro | Ydelser: indkøb, flåder, opgradering og opkøb \| Kestro |
| `/vejledninger` | — | Vejledninger: køb, tjek og udskiftning af erhvervs-IT \| Kestro | Viden om erhvervs-IT: køb og udskiftning \| Kestro |
| `/flaadeloesninger` | computere til medarbejdere | Computere til alle medarbejdere – én model, én levering \| Kestro | Computere til flere medarbejdere – flådeløsninger \| Kestro |
| `/kvalitet` | garanti på refurbished computere | Refurbished computere: grad A, B og C og garanti \| Kestro | Garanti og stand på refurbished erhvervs-IT \| Kestro |
| `/priser` | hvad koster brugte computere | Hvad koster brugte computere til virksomheder? \| Kestro | Hvad koster brugte erhvervscomputere? \| Kestro |
| `/tilbud` | tilbud på brugte computere | Få et tilbud på brugte computere til virksomheden \| Kestro | Få et tilbud på brugt erhvervs-IT \| Kestro |
| `/tilbud-eksempel` | — | Eksempel på et tilbud på brugt IT – felt for felt \| Kestro | Sådan ser et tilbud fra Kestro ud – eksempel \| Kestro |
| `/saelg-til-os` | sælg brugt it-udstyr | Sælg brugt IT-udstyr – vi henter og sletter data \| Kestro | Sælg jeres brugte IT-udstyr \| Kestro |
| `/kontakt` | brugte computere aarhus | Kontakt Kestro, Aarhus – brugte computere til virksomheder | Kontakt os i Aarhus \| Kestro |
| `/om-os` | — | Om Kestro – brugt erhvervs-IT fra Sydeuropa til Norden | Om os – hvem I handler med \| Kestro |
| `/maskinen` | — | Hvad er RAM, SSD og køling? Se en bærbar indefra \| Kestro | Maskinen indeni: hvad er RAM, SSD og køling? \| Kestro |
| `/handelsbetingelser` | — | Handelsbetingelser for erhvervskunder \| Kestro | uændret |
| `/privatlivspolitik` | — | Privatlivspolitik \| Kestro | uændret |

### Kategorier

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/produkter/baerbare-computere` | brugte bærbare computere | Brugte bærbare computere til erhverv \| Kestro | uændret |
| `/produkter/dockingstationer` | dockingstation til bærbar | Dockingstation til bærbar – brugte docks til erhverv \| Kestro | Dockingstationer til erhvervsbærbare \| Kestro |
| `/produkter/mini-pc` | brugt mini pc | Brugte mini-pc'er til erhverv – ThinkCentre Tiny m.fl. \| Kestro | Brugte mini-pc'er til erhverv \| Kestro |
| `/produkter/skaerme` | brugte skærme | Brugte skærme til kontoret – 22 til 27 tommer \| Kestro | Brugte skærme til kontor og erhverv \| Kestro |
| `/produkter/smartphones` | brugte firmatelefoner | Brugte firmatelefoner – refurbished iPhone og Samsung \| Kestro | Refurbished mobiltelefoner til virksomheder \| Kestro |
| `/produkter/stationaere-computere` | brugte stationære computere | Brugte stationære computere til kontoret \| Kestro | Brugte stationære computere til erhverv \| Kestro |
| `/produkter/tablets` | brugte tablets til erhverv | Brugte tablets til erhverv – iPad, Galaxy Tab, Surface \| Kestro | Brugte tablets til erhverv \| Kestro |

### Modeller

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/modeller/dell-latitude-5410` | dell latitude brugt | Brugt Dell Latitude 5410: specs, fordele og ulemper \| Kestro | Brugt Dell Latitude 5410 til erhverv \| Kestro |
| `/modeller/dell-latitude-7490` | dell latitude 7490 brugt | Brugt Dell Latitude 7490: specs, fordele og ulemper \| Kestro | Brugt Dell Latitude 7490 til erhverv \| Kestro |
| `/modeller/dell-optiplex-5060` | dell optiplex brugt | Brugt Dell OptiPlex 5060: specs, fordele og ulemper \| Kestro | Brugt Dell OptiPlex 5060 til erhverv \| Kestro |
| `/modeller/dell-ultrasharp-u2419h` | dell u2419h brugt | Brugt Dell U2419H-skærm: specs, fordele og ulemper \| Kestro | Brugt Dell UltraSharp U2419H skærm til erhverv \| Kestro |
| `/modeller/dell-wd19` | dell wd19 dock brugt | Brugt Dell WD19-dock: specs, fordele og ulemper \| Kestro | Brugt Dell WD19 dockingstation til erhverv \| Kestro |
| `/modeller/hp-elitebook-840` | hp elitebook brugt | Brugt HP EliteBook 840: specs, fordele og ulemper \| Kestro | Brugt HP EliteBook 840 til erhverv \| Kestro |
| `/modeller/hp-elitedesk-800` | hp elitedesk 800 brugt | Brugt HP EliteDesk 800: specs, fordele og ulemper \| Kestro | Brugt HP EliteDesk 800 til erhverv \| Kestro |
| `/modeller/hp-elitedisplay-e243` | hp elitedisplay e243 | Brugt HP EliteDisplay E243: specs, fordele og ulemper \| Kestro | Brugt HP EliteDisplay E243 skærm til erhverv \| Kestro |
| `/modeller/hp-probook-450` | hp probook 450 brugt | Brugt HP ProBook 450: specs, fordele og ulemper \| Kestro | Brugt HP ProBook 450 til erhverv \| Kestro |
| `/modeller/hp-usb-c-dock-g5` | hp usb-c dock g5 | Brugt HP USB-C Dock G5: specs, fordele og ulemper \| Kestro | Brugt HP USB-C Dock G5 til erhverv \| Kestro |
| `/modeller/hp-zbook-15` | hp zbook brugt | Brugt HP ZBook 15: specs, fordele og ulemper \| Kestro | Brugt HP ZBook 15 mobil workstation til erhverv \| Kestro |
| `/modeller/lenovo-thinkcentre-m720q` | thinkcentre m720q brugt | Brugt ThinkCentre M720q Tiny: fordele og ulemper \| Kestro | Brugt Lenovo ThinkCentre M720q Tiny mini-pc \| Kestro |
| `/modeller/lenovo-thinkpad-l14` | thinkpad l14 brugt | Brugt Lenovo ThinkPad L14: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkPad L14 til erhverv \| Kestro |
| `/modeller/lenovo-thinkpad-t14` | thinkpad t14 brugt | Brugt Lenovo ThinkPad T14: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkPad T14 til erhverv \| Kestro |
| `/modeller/lenovo-thinkpad-t480` | brugt thinkpad t480 | Brugt Lenovo ThinkPad T480: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkPad T480 til erhverv \| Kestro |
| `/modeller/lenovo-thinkpad-ultra-dock` | thinkpad ultra dock brugt | Brugt ThinkPad Ultra Dock: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkPad Ultra Dock til erhverv \| Kestro |
| `/modeller/lenovo-thinkpad-x1-carbon` | thinkpad x1 carbon brugt | Brugt ThinkPad X1 Carbon: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkPad X1 Carbon til erhverv \| Kestro |
| `/modeller/lenovo-thinkvision-t24i` | thinkvision t24i brugt | Brugt ThinkVision T24i: specs, fordele og ulemper \| Kestro | Brugt Lenovo ThinkVision T24i skærm til erhverv \| Kestro |

### Reparation

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/reparation/batteriskift` | batteriskift bærbar | Batteriskift på bærbar: tjek batteritilstanden først \| Kestro | Batteriskift til bærbar – tjek batteriets tilstand |
| `/reparation/fejlfinding` | computer starter ikke | Computer starter ikke eller går ned? Fejlfinding \| Kestro | Fejlfinding – maskinen starter ikke eller går ned |
| `/reparation/klargoering-af-brugt-udstyr` | tjek af brugt computer | Tjek af brugt computer: batteri, stand og opsætning \| Kestro | Klargøring af brugt udstyr |
| `/reparation/ny-opsaetning-og-dataflytning` | flytte data til ny computer | Flyt data til ny computer – opsætning og dataflytning \| Kestro | Ny opsætning og flytning af data |
| `/reparation/ram-og-ssd-opgradering` | ram og ssd opgradering | RAM- og SSD-opgradering af bærbar og stationær \| Kestro | RAM- og SSD-opgradering af bærbare og stationære |
| `/reparation/rens-og-koeling` | rens af bærbar | Varm og larmende bærbar? Rens og ny kølepasta \| Kestro | Rens og køling – varm og larmende maskine |
| `/reparation/reservedele-og-komponentskift` | reservedele bærbar | Reservedele til bærbar: blæser, hængsler, ladestik \| Kestro | Reservedele og komponentskift |
| `/reparation/samling-af-pc` | få samlet en pc | Få samlet en pc efter opgaven – bygget og testet \| Kestro | Samling og opgradering af pc |
| `/reparation/skaermskift` | skærmskift bærbar | Skærmskift på bærbar, tablet og telefon \| Kestro | Skærmskift på bærbar, tablet og telefon |
| `/reparation/software-og-licenser` | licenser til firmacomputere | Software og licenser på nye firmacomputere \| Kestro | Software og licenser på plads |
| `/reparation/tastaturskift-og-nordisk-layout` | tastaturskift bærbar | Tastaturskift og dansk tastatur på bærbar \| Kestro | Tastaturskift og dansk eller norsk layout |
| `/reparation/windows-installation` | geninstallere windows | Geninstallation af Windows med de rigtige drivere \| Kestro | Ren Windows-installation med drivere |

### Ydelser

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/ydelser/klargoering-og-test` | klargøring af computere til medarbejdere | Klargøring af computere til medarbejdere \| Kestro | Klargøring og test af brugte erhvervsmaskiner \| Kestro |
| `/ydelser/levering` | levering af it-udstyr til virksomheder | Levering af IT-udstyr til virksomheder i DK og Norge \| Kestro | Levering af IT-udstyr til virksomheder \| Kestro |
| `/ydelser/nordisk-tilpasning` | dansk tastatur på importeret computer | Dansk tastatur og opsætning på importerede pc'er \| Kestro | Nordisk tastatur og dansk opsætning \| Kestro |
| `/ydelser/opstart-af-arbejdspladser` | it-udstyr til nye medarbejdere | IT-udstyr til nye medarbejdere – klar fra dag ét \| Kestro | IT-udstyr til nye medarbejdere \| Kestro |
| `/ydelser/overskudslager-og-returvarer` | overskudslager it | Sælg overskudslager og returvarer i IT \| Kestro | Overskudslager og returvarer i IT \| Kestro |
| `/ydelser/sourcing-og-indkoeb` | it-indkøb til erhverv | IT-indkøb til erhverv – vi skaffer modellen \| Kestro | IT-indkøb til erhverv – sourcing uden lager \| Kestro |

### Vejledninger

| URL | Primært søgeord | Title nu | Title før |
| --- | --- | --- | --- |
| `/vejledninger/opgrader-ram-i-baerbar` | opgradere ram i bærbar | Opgrader RAM i bærbar: tjek, køb og skift selv \| Kestro | Sådan opgraderer du RAM i en bærbar computer \| Kestro |
| `/vejledninger/refurbished-eller-brugt` | refurbished vs brugt | Refurbished vs. brugt: hvad er forskellen? \| Kestro | uændret |
| `/vejledninger/reparere-eller-koebe-ny` | reparere eller købe ny computer | Reparere eller købe ny computer? Sådan regner du \| Kestro | uændret |
| `/vejledninger/samle-din-egen-pc` | — | Byg din egen pc: dele, rækkefølge og typiske fejl \| Kestro | Samle sin egen pc: rækkefølge, dele og fejl \| Kestro |
| `/vejledninger/slet-data-foer-du-saelger` | sikker datasletning | Sikker datasletning før salg eller kassering \| Kestro | uændret |
| `/vejledninger/tjek-brugt-baerbar-foer-koeb` | hvad skal man tjekke på en brugt bærbar | Ti ting du skal tjekke på en brugt bærbar \| Kestro | uændret |
| `/vejledninger/windows-10-support-slutter` | windows 10 support slut virksomhed | Windows 10-support slut: hvad gør virksomheden nu? \| Kestro | Windows 10-supporten er slut: hvad nu for virksomheden? \| Kestro |
| `/vejledninger/windows-11-paa-aeldre-maskine` | windows 11 krav gammel computer | Windows 11 på ældre computer: krav og løsninger \| Kestro | Windows 11 på en ældre maskine: hvad kræver det? \| Kestro |

## Reparation: de nye søgeord

41 rækker er nye eller flyttet hertil. Hver reparationsside ejer ét job, og hvert job har ét primært ord:

| Side | Primært | Sekundære |
| --- | --- | --- |
| `/reparation` | computer reparation | reparation af firmacomputere; pc reparation; reparation af bærbar; computer reparation aarhus |
| `/reparation/batteriskift` | batteriskift bærbar | udskift batteri i bærbar; skift batteri bærbar; tjek batteri bærbar |
| `/reparation/fejlfinding` | computer starter ikke | computer går ned |
| `/reparation/klargoering-af-brugt-udstyr` | tjek af brugt computer | — |
| `/reparation/ny-opsaetning-og-dataflytning` | flytte data til ny computer | overføre filer til ny pc |
| `/reparation/ram-og-ssd-opgradering` | ram og ssd opgradering | skifte ssd i bærbar; ssd opgradering firmacomputere |
| `/reparation/rens-og-koeling` | rens af bærbar | bærbar larmer; bærbar bliver varm; skift kølepasta |
| `/reparation/reservedele-og-komponentskift` | reservedele bærbar | skift blæser bærbar; ladestik bærbar reparation |
| `/reparation/samling-af-pc` | få samlet en pc | pc samling |
| `/reparation/skaermskift` | skærmskift bærbar | skift skærm bærbar; revnet skærm bærbar |
| `/reparation/software-og-licenser` | licenser til firmacomputere | software installation firmacomputer |
| `/reparation/tastaturskift-og-nordisk-layout` | tastaturskift bærbar | dansk tastatur skift |
| `/reparation/windows-installation` | geninstallere windows | ren windows installation |

**Aarhus.** »Computer reparation aarhus« står som sekundært ord på `/reparation`, men ikke i titlen. Lokale søgninger er dem med størst købsintention for et værksted. Ordet kommer i titlen og på siden, så snart værkstedets adresse er bekræftet og står på siden. En title, der lover Aarhus, uden at siden siger hvor, er en klikfælde.

**Skillelinjer, så siderne ikke konkurrerer:**

- `/reparation/ram-og-ssd-opgradering` = få det gjort. `/vejledninger/opgrader-ram-i-baerbar` = gør det selv.
- `/reparation/tastaturskift-og-nordisk-layout` = én maskine med forkert tastatur. `/ydelser/nordisk-tilpasning` = hele leverancen tilpasset før levering.
- `/reparation/klargoering-af-brugt-udstyr` = én maskine, du har købt brugt. `/ydelser/klargoering-og-test` = maskiner til jeres medarbejdere.
- `/reparation/samling-af-pc` = vi bygger den. `/vejledninger/samle-din-egen-pc` = du bygger den.

## Rettet i listen

- **Flyttet til en side, der findes:** »skifte ssd i bærbar« og »ssd opgradering firmacomputere« → `/reparation/ram-og-ssd-opgradering`. »udskift batteri i bærbar« → `/reparation/batteriskift`. »dansk tastatur skift« → `/reparation/tastaturskift-og-nordisk-layout`. »licenser til firmacomputere« → `/reparation/software-og-licenser`.
- **Forsiden** ejer nu »brugte computere til virksomheder«, som står ordret i dens title. »refurbished computere erhverv« er sekundært.
- **Omdøbt, så ordet er det, folk skriver:** »computere til flere medarbejdere« → »computere til medarbejdere«. Modelordene følger ét mønster, »<model> brugt«. »nordisk tastatur« → »dansk tastatur«. Hver omdøbning står i CSV'ens noter.
- **Engelske rækker** peger nu på de rigtige engelske adresser.
- **Guides, der ikke findes,** er markeret »SIDEN FINDES IKKE – forslag« i noterne. De rangerer ikke, før de er skrevet.

## Kannibalisering

| Status | Sider | Afgørelse |
| --- | --- | --- |
| Løst | `/produkter` og `/modeller` | `/modeller` bærer mærkenavnene i title, `/produkter` kategoriordene. |
| Løst | `/tilbud` og `/flaadeloesninger/forespoergsel` | Den anden side findes ikke længere. |
| Løst | `/` og `/produkter` | Forsiden: »brugte computere til virksomheder«. `/produkter`: »brugt IT-udstyr til virksomheder«. |
| Hold øje | `/kvalitet`, `/vejledninger/tjek-brugt-baerbar-foer-koeb`, `/ydelser/klargoering-og-test` | Vores standard / køberens tjekliste / hvad vi gør ved maskinen. |
| Hold øje | `/flaadeloesninger` og `/ydelser/opstart-af-arbejdspladser` | Mange maskiner på én gang / én ny medarbejder ad gangen. |
| Hold øje | `/priser` og `/tilbud` | »Hvad koster det« forklarer; »få et tilbud« beder om en henvendelse. |

## Guides, der bør skrives

Stadig gyldige fra første udgave. To af dem er skrevet siden (Windows 10 og refurbished mod brugt).

| Foreslået URL | Primært søgeord | Hvorfor |
| --- | --- | --- |
| `/vejledninger/vaelg-erhvervsbaerbar` | thinkpad vs elitebook vs latitude | Sammenligning med købsintention, og modelsiderne findes allerede at linke til. |
| `/vejledninger/ram-og-ssd-til-kontormaskiner` | hvor meget ram har man brug for | Spørgsmålet, der afgør, hvad der skal skaffes. |
| `/vejledninger/standardiser-firmacomputere` | standardisering af computere i virksomheden | Flådekøberens egentlige problem. |
| `/vejledninger/it-til-nystartet-virksomhed` | it-udstyr til nystartet virksomhed | En reel kundetype. |
| `/vejledninger/it-til-mindre-virksomheder` | it til mindre virksomheder | Virksomheden uden IT-afdeling. |
| `/vejledninger/tco-paa-firmacomputere` | tco på firmacomputere | Økonomiargumentet, en indkøber skal bruge internt. |
| `/vejledninger/leasing-eller-koeb` | leasing eller køb af firmacomputere | Kun hvis der er tid til overs – Kestro leaser ikke. |

## Hvad der stadig mangler: rigtige tal

`Search volume`, `Keyword difficulty` og `CPC` står stadig som `unknown` på hver række. Prioriteringen bygger på intention og forretningsværdi, ikke på volumen. Et opdigtet tal ville blive til en beslutning, nogen handlede på.

Tre ting gør den næste runde præcis:

1. **Google Search Console → Effektivitet → Forespørgsler og Sider, tre måneder, eksporteret.** Visninger, klik og CTR per søgning og per side viser, hvilke titles der ses uden at blive klikket på – dem skal der arbejdes på først.
2. **Volumen fra Google Ads' søgeordsplanlægger** for de cirka 80 primære ord.
3. **Værkstedets adresse,** så »Aarhus« kan komme i reparationstitlerne.

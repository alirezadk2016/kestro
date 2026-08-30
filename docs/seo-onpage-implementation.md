# Trin 4 — on-page-implementering

Datoen er 30-08-2026. Dette dokument beskriver, hvad der faktisk blev ændret i koden i trin 4, og hvad der blev målt bagefter. Trin 1–3 var analyse; dette er det første trin, der rører produktionen.

Uden for dette trin, med vilje: de ni nye vejledninger fra kortlægningen er ikke oprettet, og de engelske slugs er ikke oversat.

## Datagrundlag og dets grænse

**Der findes ingen Search Console-data, ingen analytics-eksport og ingen rangeringsdata i repoet.** Det er kontrolleret, ikke antaget: der er ingen `search-console`-eksport, ingen GA-rapport og ingen klik-, visnings- eller placeringstal nogen steder i historikken. GA4 blev først koblet på dagen før, så der er heller ikke nået at samle trafik.

Det betyder konkret, at de tre 301-redirects herunder **ikke** er truffet på trafikdata. De er truffet på intention: to URL'er uden B2B-hensigt og én, der konkurrerede med `/tilbud` om nøjagtig den samme søgning. Hvis der senere dukker Search Console-data op, som viser reelle indgange på de tre URL'er, skal beslutningen tages op igen — redirectet bevarer under alle omstændigheder den trafik, der måtte være.

## Det, der er ændret

### 1. Redirects (301, ikke 308)

| Fra                               | Til                      | Hvorfor                                                                                                       |
| --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/flaadeloesninger/forespoergsel` | `/tilbud`                | Kannibalisering markeret **Høj** i trin 2: to formularer, samme intention, samme søgninger.                   |
| `/produkter/gaming`               | `/produkter`             | Ingen B2B-intention. Trak et publikum, Kestro ikke sælger til.                                                |
| `/produkter/smartwatches`         | `/produkter/smartphones` | Ingen reel B2B-intention alene. Indholdet er flyttet ind på smartphone-siden i stedet for at blive smidt væk. |

Hver regel findes i to udgaver, dansk og `/en`, altså seks regler i alt. De ligger i `next.config.mjs` som `statusCode: 301` og ikke `permanent: true`, fordi `permanent` udsender 308. 308 er teknisk korrekt, men 301 er den kode, søgemaskiner har håndteret i tredive år, og der er intet at vinde ved at være først med 308 på et domæne, der lige er begyndt at blive indekseret.

Redirects i `next.config.mjs` kører før middleware, så de rammer også de bare stier, middleware ellers ville skrive om til `/da`.

Ruten `app/[lang]/flaadeloesninger/forespoergsel/page.tsx` er slettet. De to kategorier er fjernet fra `lib/categories.ts`, hvorved deres ruter forsvinder af sig selv gennem `generateStaticParams`.

### 2. Kategorier: 9 → 7

`gaming` og `smartwatches` er væk. Smartwatch-indholdet er ikke tabt: `smartphones` har fået `Apple Watch` og `Samsung Galaxy Watch` med i mærkelisten, et "Smartwatches til teams"-anvendelsestilfælde og en udvidet specifikationsnote. Tagline og metadata på siden er skrevet om, så den dækker begge dele ærligt.

### 3. Titles og meta descriptions

De godkendte forslag fra trin 2 er lagt ind. I alt 27 metadatafelter gennem kategori- og modeldata, 12 på ydelsessiderne, 12 på vejledningerne, forsiden på begge sprog og `/produkter/skaerme` særskilt (dens tekst indeholder `24"`, så den bruger enkelte anførselstegn og blev ikke ramt af den regex, der lagde resten ind).

Kannibaliseringen mellem `/produkter` og `/modeller` er lukket ved at flytte `/modeller` væk fra kategoriordene på begge sprog: "Modeller vi ofte skaffer til erhverv" og "Models we often source for business".

Fire titler afveg fra trin 2 efter måling og er rettet her:

| Side           | Før                                                    | Nu                                           | Hvorfor                                                                                                                                          |
| -------------- | ------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/kontakt`     | Kontakt Kestro – Aarhus \| Kestro                      | Kontakt os i Aarhus \| Kestro                | Brandet stod to gange i samme title.                                                                                                             |
| `/en/kontakt`  | Contact \| Kestro                                      | Contact us in Aarhus \| Kestro               | Spejlede ikke den danske. Beskrivelsen er ligeledes skrevet om, så den siger det samme som den danske.                                           |
| `/om-os`       | Om os \| Kestro                                        | Om os – hvem I handler med \| Kestro         | 14 tegn er for lidt til at fortjene et klik. Siden har med vilje intet primært søgeord; den skal bygge tillid, og titlen siger nu, hvad man får. |
| `/en/kvalitet` | Grade A, B and C on used IT equipment — what they mean | Grade A, B and C on refurbished IT \| Kestro | Eneste side uden brandsuffiks. Søgeordet er bevaret, længden er nu inden for grænsen.                                                            |

Ingen priser og ingen `offers` i Product-schema. Der er stadig ingen prisliste, der kan bære det.

### 4. Intern struktur

- `components/Breadcrumbs.tsx` (ny) tegner brødkrummestien og udsender `BreadcrumbList`-schema fra den samme liste, så det synlige og det maskinlæsbare ikke kan sige noget forskelligt.
- `components/PageHeader.tsx` har fået `lang`, `href` og `crumb` og tegner stien, når de er givet.
- `components/RelatedLinks.tsx` (ny) er "Videre herfra"-rækken på de kommercielle sider.
- `lib/guides.ts`: hver vejledning har fået `related` — den kommercielle side, der løser det, vejledningen rejser.
- `lib/categories.ts`: valgfrit `guides`-felt, så en kategoriside kan pege på den vejledning, der fjerner indvendingen.
- Modelsiderne foretrækker nu naboer i samme kategori før samme gruppe.

Formålet var de fem svage sider, trin 3 udpegede. Alle fem er over tre indgående interne links nu.

## Målt bagefter

Alt herunder er kørt mod en produktionsbuild af den endelige kode.

| Kontrol                                  | Resultat                                                     |
| ---------------------------------------- | ------------------------------------------------------------ |
| `npm run verify`                         | alle kontroller bestået                                      |
| `tsc --noEmit`, `next lint`              | rene                                                         |
| Sider auditeret                          | 106 af 106, **0 fund**                                       |
| Sitemap                                  | 106 URL'er, ingen dubletter, alle på `https://www.kestro.dk` |
| Sitemap-alternates                       | `da`, `en`, `x-default` på hver eneste URL                   |
| `robots.txt`                             | peger på `https://www.kestro.dk/sitemap.xml`                 |
| Canonical                                | selvrefererende på alle 106                                  |
| hreflang                                 | `da`, `en`, `x-default` på alle 106; alle mål svarer 200     |
| Brødkrummer                              | 104 af 106 — forsiderne undtaget, som de skal være           |
| Interne link-mål afprøvet                | 142                                                          |
| Døde links (4xx/5xx)                     | 0                                                            |
| Interne links til en redirect            | 0                                                            |
| Sider under tre indgående links          | 0                                                            |
| Titler                                   | 106 unikke, ingen over 60 tegn, alle med brandsuffiks        |
| Beskrivelser                             | 106 unikke, alle mellem 70 og 165 tegn                       |
| Redirects                                | alle seks svarer 301, alle mål svarer 200                    |
| Fjernede URL'er i sitemap eller hreflang | 0                                                            |
| Tilgængelighed                           | 0 fund                                                       |

## Det, der stadig mangler — og som ikke er vores at beslutte

CVR, adresse og telefon i `lib/company.ts`. Uden dem kan `/kontakt` ikke tage de lokale søgninger, og `LocalBusiness`-schema giver ingen mening. Handelsbetingelser mangler stadig som side.

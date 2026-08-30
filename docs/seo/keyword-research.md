# Trin 1 — søgeordsanalyse for kestro.dk

Fil: `docs/seo/keyword-research.csv` (UTF-8 med BOM, komma-separeret — åbner
direkte i Excel og kan importeres i Google Sheets uden opsætning).

**Ingen kode og intet indhold på sitet er ændret i dette trin.**

## Det vigtigste først: hvad der er målt, og hvad der ikke er

Kolonnerne `search_volume`, `keyword_difficulty` og `cpc` står som **`unknown`
på alle 156 rækker**, og `data_source` siger `not measured`.

Det er ikke sjusk. Denne session har ingen adgang til Google Keyword Planner,
Ahrefs, Semrush eller anden licenseret volumendata, og et opdigtet tal i en
volumenkolonne er værre end et tomt felt: det bliver til en prioritering, som
nogen handler på. Du bad selv om, at ukendt data blev markeret som ukendt.

**Sådan fyldes de tre kolonner ud senere** — arket er bygget til at blive
udfyldt på plads, uden at noget andet skal laves om:

1. Google Keyword Planner (gratis med en Ads-konto): land = Danmark, sprog =
   dansk. Indsæt `keyword`-kolonnen i "Get search volume". Giver et interval,
   ikke et præcist tal — skriv intervallet.
2. Ahrefs eller Semrush, database DK: giver volumen, KD og CPC i én eksport.
   Match på `keyword` og indsæt.
3. Sæt `data_source` til værktøj + dato, så det senere kan ses, hvor tallet
   kommer fra og hvor gammelt det er.

Alt andet i arket — klynge, intention, kommerciel værdi, prioritet, relaterede
søgeord og dækning i dag — er **vurderinger**, ikke måledata. De bygger på
Kestros faktiske forretning, sitets 112 eksisterende sider og en gennemgang af,
hvad de danske konkurrenter rent faktisk optimerer efter.

## Marked og konkurrenter, som de ser ud i søgeresultaterne

Gennemgået i søgeresultaterne (august 2026):

- **Webshops med lager:** Greenoff, Kontor Syd, Føniks (fcomputer.dk),
  brugtecomputere.dk, Uniplus, Kosmos Renew, Hertels Boresko, ITLagersalg,
  NTKR.
- **Opkøb / buy-back:** Datamarked, Brugt-IT.dk, Renewtech, Elitecom, Foxway,
  ServiceIT Erhverv.
- **Store erhvervsleverandører:** Atea (Atea Refurbish), SOLID IT.

To ting følger af det:

1. **Sproget i markedet er "refurbished"**, ikke "renoveret". Låneordet
   dominerer også dansksprogede sider. "Renoveret" bruges, men er sekundært.
   Kestros egne sider skal kunne begge dele uden at lyde som en oversættelse.
2. **Alle konkurrenter sælger fra lager og markedsfører 1–2 års garanti.**
   Kestro sourcer per ordre og lover ikke et fast antal måneder. Det er en
   reel forskel, og den betyder, at Kestro **ikke** skal jagte
   "billige brugte computere" — men derimod de søgninger, hvor spørgsmålet er
   *indkøb*: antal, konfiguration, ens maskiner, tidsramme, dokumentation.

## Klynger (20)

Kerne refurbished erhvervs-IT · Bærbare · Stationære · Mini-pc · Skærme ·
Dockingstationer · Tablets og telefoner · Mærker og modeller · Flåde og volumen ·
Sourcing og indkøb · Opkøb og salg til os · Datasletning og GDPR ·
Stand, kvalitet og garanti · Reparation og opgradering · Nordisk klargøring ·
Økonomi og levetid · Windows og software · Geo og lokalt · Brand ·
Engelsk (sekundært marked).

## Kolonner i CSV'en

| Kolonne | Betydning |
| --- | --- |
| `cluster` | Emneklynge — bruges i trin 2 til at undgå kannibalisering |
| `keyword` | Søgeordet, som det skrives |
| `language` | da / en (ét felt er markeret `no/da`) |
| `search_volume`, `keyword_difficulty`, `cpc` | **unknown** — se ovenfor |
| `data_source` | `not measured`, indtil et værktøj har leveret tallet |
| `search_intent` | commercial / transactional / commercial investigation / informational / navigational |
| `commercial_value` | Vurderet værdi for Kestros forretning: high / medium / low |
| `priority` | P0 essentiel · P1 høj · P2 nyttig · P3 valgfri |
| `related_keywords` | Varianter, der hører til samme side — ikke egne sider |
| `candidate_page` | Foreløbig kandidat. **Den endelige mapping sker i trin 2.** |
| `coverage_today` | covered / partial / gap på sitet i dag |
| `note` | Hvorfor søgeordet er med — eller hvorfor det er nedprioriteret |

## Hvad der bevidst ikke er med

- **Prissøgninger med et tal i** ("bærbar under 2000 kr"): Kestro har ingen
  faste priser og skal ikke lokke med tal, der ikke findes.
- **Offentlige udbud** ("udbud it-udstyr kommune"): kræver udbudserfaring, der
  ikke er beskrevet nogen steder på sitet.
- **Regnskab og afskrivning**: uden for Kestros kompetence.
- **Gaming og smartwatches**: findes som kategorier på sitet i dag, men trækker
  et publikum, der ikke køber 20 maskiner. Behandles i trin 3.
- **Anmeldelses- og "erfaringer"-søgninger**: kan ikke arbejdes med, før der er
  rigtige kunder og rigtige profiler. Ingen opdigtede anmeldelser.

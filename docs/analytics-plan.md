# Analytics og konverteringsmåling

Status pr. 14. oktober 2026: GA4 er implementeret i `components/Analytics.tsx`
bag et aktivt ja til statistik. Før accept indlæses intet Google-script.
`track()` kontrollerer det aktuelle samtykke for hver hændelse. Tilbagekaldelse
slår også et allerede indlæst tag fra, sender denied-status til Consent Mode
og rydder de førsteparts-GA-cookies, siden har adgang til. Ændringer i andre
faner synkroniseres via storage-hændelsen.

Derudover findes egne aggregerede besøgstal (`PageViewTracker`) og Vercel
Web Analytics/Speed Insights på Vercel. De sidste er ikke bag GA-samtykket;
deres faktiske databehandling og overførselsgrundlag skal vurderes særskilt,
ikke antages lovlige alene fordi de er cookiefri. Se privatlivspolitikken.

## Hvad der skal måles

| Event                | Hvorfor                           | Hvor                                     |
| -------------------- | --------------------------------- | ---------------------------------------- |
| `quote_cta_click`    | Hvilke CTA'er fører til `/tilbud` | header, hero, CtaSection, PriceOnRequest |
| `enquiry_form_start` | Første fokus i formularen         | alle ContactForm-instanser               |
| `generate_lead`      | API accepterede forespørgslen     | alle ContactForm-instanser               |
| `enquiry_form_error` | Netværksfejl eller API-status     | alle ContactForm-instanser               |
| `email_click`        | Klik på mailto                    | footer, kontaktkort                      |
| `phone_click`        | Når nummeret findes               | header, kontaktkort                      |

`form` skelner kontakt fra tilbud. Tilbudsformularens `generate_lead` har
desuden `quantity_band`. Navn, e-mail, telefon, fritekst og URL-parametre må
aldrig sendes som event-parametre. Et API-svar er ikke dokumentation for et
salg, særligt mens projektet er under etablering.

## Consent

- GA4 sætter cookies og behandler personoplysninger. Uden forudgående
  samtykke er det ikke lovligt i DK/EU, og en cookiebanner er derfor en del
  af opgaven — ikke en eftertanke.
- Alternativet, hvis I helst vil undgå banneren: en cookieløs, aggregeret
  løsning (Plausible, Umami, Fathom, selvhostet eller EU-hostet). Den giver
  ikke brugerrejser på individniveau, men den giver præcis de tal ovenfor,
  og den udløser i praksis ikke samtykkekrav, når den er konfigureret uden
  personhenførbare data. **Det er en juridisk vurdering, I skal have
  bekræftet — ikke en garanti herfra.**
- Server-side hændelser fra `/api/kontakt` (antal sendte forespørgsler, per
  bånd) kræver ingen samtykke, fordi det er vores egen driftsdata. Det er den
  billigste første måling og bør laves uanset hvad.

## Verifikation

`npm run verify` tester accept, tilbagekaldelse, cookie-rydning, ingen events
efter afslag og fornyet accept. Google-scriptet og kontakt-API'et mockes i
testen, så syntetiske personoplysninger aldrig sendes til en rigtig modtager.
GA-property-indstillinger, databehandleraftaler og juridiske forhold kan ikke
bekræftes af en lokal browsertest.

## Search Console

### Privat vækstpanel · 21. oktober 2026

`/admin/trafik` tæller besøg med 30 minutters inaktivitet som sessionsgrænse,
ikke unikke personer. Kilde og kampagne fastholdes fra besøgets første signal.
Kun fem UTM-mærkater accepteres; den rå querystreng sendes ikke af trackeren.
Manglende henviser vises som **Direkte / ukendt**, og historiske rækker beholder
en tydelig legacy-markering. Ældre kildelabels kan klassificeres, men tidligere
kampagner, medier eller betalt trafik opfindes ikke. Besøg kobles ikke til
navngivne henvendelser. Filtertabeller deler samme nævner; live-oplysninger er
separat markeret og påvirkes ikke af kilde-/kampagnefiltrene.

`/admin/kampagner` bygger mærkede links til publicerede sider. `utm_content=bio`
beskriver det delte link; det er ikke bevis for eksponering i Instagram Explore.
Browserens henviser kan være manglende eller reduceret til domænet.

`/admin/seo` gemmer validerede, private Search Console-rapporter. Samme ejendom,
periode og søgetype erstattes atomisk, så genimport ikke lægger tal sammen.
JSON-rapporten kan indeholde de separate dag-, forespørgsels- og sidetabeller;
en enkelt officiel CSV-tabel kan også importeres. En query-/side-CSV har ingen
samlet ejendomstotal. Skjulte forespørgsler og leverandørens rækkegrænser betyder,
at synlige queryrækker ikke nødvendigvis summerer til rapportens klik.

Egne besøgsdage bruger UTC; Search Console bruger America/Los_Angeles. Google-
klik er ikke det samme som egne besøg. Forsinkede dage, delvise rapporter og
fraværende forbindelser vises eksplicit. Windsor.ai kan kun opdateres fra
serveren med en særskilt konfigureret `WINDSOR_API_KEY`; en forbindelse i en
administrators chat er ikke en automatisk forbindelse i webapplikationen.
Ingen API-nøgle eller virkelig rapport må indgå i kildekoden.

Primære beskrivelser: [Google om Search Console-data](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive),
[Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query),
[MDN om Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy).

### Kontrol i Google-kontoen

Ejerskab, indeksering og søgetrafik skal bekræftes i den faktiske konto. Kontrollér:

- en ejendom for **både** `https://www.kestro.dk` og domæneejendommen, så
  redirect-adfærden kan ses.
- Regelmæssigt kig på "Sider" → "Ikke indekseret", ikke kun på dækningstallet.

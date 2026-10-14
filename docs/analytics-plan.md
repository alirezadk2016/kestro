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

Ejerskab, indeksering og søgetrafik skal bekræftes i den faktiske konto. Kontrollér:

- en ejendom for **både** `https://www.kestro.dk` og domæneejendommen, så
  redirect-adfærden kan ses.
- Regelmæssigt kig på "Sider" → "Ikke indekseret", ikke kun på dækningstallet.

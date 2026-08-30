# Analytics og konverteringsmåling

Status i dag: **ingen analytics på sitet.** Ingen GA4, ingen tags, ingen
tredjepartsscripts. Det er grunden til, at siden loader, som den gør — og det
er også grunden til, at vi ikke kan svare på, hvor mange der starter en
tilbudsforespørgsel og ikke sender den.

Intet er implementeret her. Det er et valg: consent-krav skal afklares, før
der lægges et script ind, og det er en beslutning om jura og forretning, ikke
om kode.

## Hvad der skal måles

| Event | Hvorfor | Hvor |
| --- | --- | --- |
| `quote_cta_click` | Hvilke CTA'er fører til `/tilbud` | header, hero, CtaSection, PriceOnRequest |
| `quote_form_start` | Første tastetryk i formularen | `/tilbud`, `/flaadeloesninger/forespoergsel` |
| `quote_form_submit` | Den egentlige konvertering | samme |
| `quote_form_error` | Hvor mange rammer fejlpanelet | samme |
| `contact_click` | Sekundær vej | `/kontakt` |
| `email_click` | mailto og kopiér-knappen | footer, kontaktkort |
| `phone_click` | Når nummeret findes | header, kontaktkort |

Antal-båndet (1, 2–9, 10–49, 50+) bør følge med `quote_form_submit` som
parameter. Det er den ene dimension, der afgør, om trafikken er den rigtige:
hundrede forespørgsler på én maskine er ikke bedre end fem på tredive.

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

## Rækkefølge

1. Log indsendte forespørgsler server-side i `/api/kontakt` (bånd, side,
   sprog — ingen personoplysninger ud over dem, der allerede sendes i mailen).
2. Beslut consent-model.
3. Læg først derefter en client-side analytics ind, med events som ovenfor.

## Search Console

Allerede sat op og fungerer. Tilføj:
- en ejendom for **både** `https://www.kestro.dk` og domæneejendommen, så
  redirect-adfærden kan ses.
- Regelmæssigt kig på "Sider" → "Ikke indekseret", ikke kun på dækningstallet.

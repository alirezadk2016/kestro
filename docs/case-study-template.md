# Skabelon: kundecase

Ingen case offentliggøres uden skriftligt ja fra kunden — til teksten, til
tallene og til om virksomhedens navn må nævnes. Et "det er fint nok" i telefonen
er ikke et ja.

Indtil den første rigtige case findes, står der ingen kundelogoer, ingen
udtalelser og ingen "betroet af"-sektion på sitet. En tom sektion er bedre end
en opdigtet.

## Struktur

**Overskrift:** hvad kunden fik, ikke hvad vi gjorde.
*"32 identiske ThinkPads til to kontorer på tre uger"*

**Fakta-boks** (det en indkøber scanner efter først):
- Branche og størrelse (kan være anonymiseret: "rådgivningsvirksomhed, 40 ansatte")
- Antal enheder
- Maskintype og konfiguration
- Tidsramme fra forespørgsel til levering
- Om der samtidig blev hentet gammelt udstyr retur

**Opgaven.** Hvad de stod med, i deres ord. To-tre afsnit.

**Hvad vi gjorde.** Kun det, der faktisk skete i denne ordre — ikke den
generelle proces, den står allerede på `/ydelser`.

**Resultatet.** Tal, hvis der er tal. Ellers en konkret observation. Ingen
procenter, vi ikke kan dokumentere.

**Citat.** Én udtalelse, godkendt skriftligt, med navn og titel. Et anonymt
citat er svagere end intet citat — det læses som opfundet.

## Teknisk, når den første case er godkendt

- `lib/cases.ts` med samme mønster som `lib/guides.ts`: typet, lokaliseret,
  med `updated`-dato.
- Sider på `/cases` og `/cases/[slug]`, med i `app/sitemap.ts`.
- Ingen `Review`- eller `AggregateRating`-schema. Det kræver reelle,
  indsamlede anmeldelser og udløser en manuel handling, hvis det bygges på
  udvalgte citater.
- Et logo-bånd først, når der er mindst fire kunder, der har sagt ja til at
  blive vist. Tre logoer ser tyndere ud end ingen.

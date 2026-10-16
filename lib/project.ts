import type { Lang } from "./i18n";

// A deliberate launch gate, not an inference from a missing registration number.
export const project = { prelaunch: true } as const;

export const projectNotice: Record<Lang, { label: string; body: string; link: string }> = {
  da: {
    label: "Under etablering",
    body: "Kestro er et projekt under etablering, endnu ikke en registreret virksomhed. Siden er til præsentation og uforpligtende forespørgsler; vi modtager ikke ordrer eller betaling her.",
    link: "Status og vilkår",
  },
  en: {
    label: "Pre-launch",
    body: "Kestro is a project in preparation, not yet a registered business. This site is for presentation and non-binding enquiries; we do not accept orders or payments here.",
    link: "Status and terms",
  },
};

export const priceDisclaimer: Record<Lang, string> = {
  da: "Priserne er omtrentlige budgeteksempler, ikke bindende tilbud eller en bekræftelse på lager. Kontakt os for at afklare muligheder, tilgængelighed og en konkret pris, før I planlægger et køb.",
  en: "Prices are approximate budget examples, not binding offers or confirmation of stock. Contact us to discuss options, availability and a specific price before planning a purchase.",
};

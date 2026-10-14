"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { company } from "@/lib/company";
import { events, track } from "@/lib/analytics";
import { localePath, type Lang, type Localized } from "@/lib/i18n";
import { buttonClass } from "./Button";
import { projectNotice } from "@/lib/project";

/* From lib/company.ts, so the fallback address in the "we could not send"
   panel can never drift from the one the route delivers to. */
const CONTACT_EMAIL = company.email;

/*
 * The form posts to /api/kontakt, which sends the message and answers.
 *
 * There is no mailto: path any more. Handing a visitor a mailto asks their
 * machine to have a mail client configured and asks them to press send a
 * second time inside it; on a work laptop with webmail, the enquiry is simply
 * lost, and the site cannot even tell that it happened.
 *
 * If the route has no mail credentials yet, or the send fails, the form says
 * so and puts the finished message in front of the visitor to copy or open —
 * it does not redirect the browser and it does not claim we received anything.
 */
type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

const copy = {
  da: {
    name: "Navn",
    namePlaceholder: "Fulde navn",
    company: "Virksomhed",
    companyPlaceholder: "Firmanavn",
    optional: "(valgfrit)",
    email: "E-mail",
    emailPlaceholder: "navn@virksomhed.dk",
    phone: "Telefon",
    phonePlaceholder: "+45 12 34 56 78",
    message: "Besked",
    submit: "Send besked",
    unavailableTitle: "Formularen kan ikke sende lige nu",
    unavailableBody: "Send beskeden direkte til os i stedet – den står klar herunder.",
    openMail: "Åbn i mailprogram",
    copyMessage: "Kopiér beskeden",
    copied: "Kopieret",
    orCall: "Eller ring på",
    back: "Tilbage til formularen",
    sending: "Sender …",
    thanksTitle: "Tak for jeres henvendelse.",
    thanksBody:
      "Svaret kommer på e-mail til den adresse, I har skrevet – tjek også spam-mappen. Mangler vi noget, spørger vi ind. Henvendelsen binder jer ikke.",
    thanksAgain: "Send en besked mere",
    privacy: "Vi bruger kun oplysningerne til at besvare henvendelsen. Se",
    privacyLink: "privatlivspolitikken",
    quoteSubject: "Tilbudsforespørgsel",
    quantityLegend: "Hvor mange maskiner?",
    quantityHelp: "Vælg det nærmeste – tallet må gerne ændre sig undervejs.",
    equipment: "Udstyr eller model",
    equipmentPlaceholder: "Fx bærbare til kontorbrug eller ThinkPad T14",
    ram: "Hukommelse",
    storage: "Lagerplads",
    keyboard: "Tastatur",
    keyboardDa: "Dansk",
    keyboardNo: "Norsk",
    keyboardEn: "Engelsk (UK/US)",
    deadline: "Hvornår skal det stå klar?",
    deadlinePlaceholder: "Fx inden udgangen af oktober",
    moreDetails: "Hukommelse, disk, tastatur og tidsramme",
    dontKnow: "Ved ikke endnu",
    quoteMessage: "Andet, vi skal vide",
    quoteMessagePlaceholder:
      "Fx: dockingstationer til alle pladser, vi skal samtidig af med 30 ældre maskiner, levering til to adresser.",
    quoteSubmit: "Send en forespørgsel",
    quoteThanksTitle: "Tak – forespørgslen er sendt.",
    quoteThanksBody:
      "Vi læser forespørgslen og vender tilbage om mulighederne. Den er ikke en ordre eller reservation.",
    nextTitle: "Hvad sker der nu?",
    defaultSubject: "Henvendelse",
    defaultPlaceholder: "Fortæl os om jeres behov – antal enheder, specifikationer, tidsramme m.m.",
    from: "fra",
    via: "via kestro.dk",
  },
  en: {
    name: "Name",
    namePlaceholder: "Your full name",
    company: "Company",
    companyPlaceholder: "Company name",
    optional: "(optional)",
    email: "Email",
    emailPlaceholder: "you@company.com",
    phone: "Phone",
    phonePlaceholder: "+45 12 34 56 78",
    message: "Message",
    submit: "Send message",
    unavailableTitle: "The form cannot send right now",
    unavailableBody: "Send the message to us directly instead — it is ready below.",
    openMail: "Open in mail app",
    copyMessage: "Copy the message",
    copied: "Copied",
    orCall: "Or call",
    back: "Back to the form",
    sending: "Sending …",
    thanksTitle: "Thank you for getting in touch.",
    thanksBody:
      "The reply comes by email to the address you gave — check your spam folder too. If anything is missing, we ask. The enquiry does not bind you.",
    thanksAgain: "Send another message",
    privacy: "We use the details only to answer the enquiry. See the",
    privacyLink: "privacy policy",
    quoteSubject: "Quote request",
    quantityLegend: "How many machines?",
    quantityHelp: "Pick the nearest — the number can still change.",
    equipment: "Equipment or model",
    equipmentPlaceholder: "E.g. laptops for office use, or ThinkPad T14",
    ram: "Memory",
    storage: "Storage",
    keyboard: "Keyboard",
    keyboardDa: "Danish",
    keyboardNo: "Norwegian",
    keyboardEn: "English (UK/US)",
    deadline: "When does it need to be ready?",
    deadlinePlaceholder: "E.g. before the end of October",
    moreDetails: "Memory, storage, keyboard and timing",
    dontKnow: "Not sure yet",
    quoteMessage: "Anything else we should know",
    quoteMessagePlaceholder:
      "E.g. docking stations for every desk, we also need to get rid of 30 older machines, delivery to two addresses.",
    quoteSubmit: "Send an enquiry",
    quoteThanksTitle: "Thank you — your request is on its way.",
    quoteThanksBody:
      "We will read the enquiry and discuss the options with you. It is not an order or reservation.",
    nextTitle: "What happens now?",
    defaultSubject: "Enquiry",
    defaultPlaceholder:
      "Tell us what you need — number of devices, specifications, timing and anything else.",
    from: "from",
    via: "via kestro.dk",
  },
} satisfies Record<Lang, Record<string, string>>;

/* Kept out of `copy` so that stays a flat string map: what happens after the
   form is sent, in the order it happens. Nothing here is a promise the site
   does not already make elsewhere. */
const nextSteps: Record<Lang, string[]> = {
  da: [
    "Vi læser forespørgslen og spørger ind, hvis noget mangler.",
    "Vi afklarer de indledende muligheder. Modeller og budgeteksempler er ikke bekræftet lager.",
    "Før et eventuelt køb skal sælger, pris og vilkår være afklaret. At spørge er ikke at bestille.",
  ],
  en: [
    "We read the request and ask if anything is missing.",
    "We discuss the initial options. Models and budget examples are not confirmed stock.",
    "Before any purchase, the seller, price and terms must be established. Asking is not ordering.",
  ],
};

type ContactFormProps = {
  lang: Lang;
  subjectPrefix?: Localized;
  messagePlaceholder?: Localized;
  companyRequired?: boolean;
  /**
   * Quote mode: the same form, plus the handful of fields that decide a price.
   *
   * A blank message box asks a buyer to compose a specification from memory,
   * and what comes back is usually "hvad koster en brugt bærbar?" — a question
   * nobody can answer, so the first reply has to ask for quantity, memory,
   * disk and keyboard anyway. Asking here saves that round trip. Everything
   * except quantity may be left at "ved ikke endnu": a buyer who does not know
   * the specification yet is exactly who we want to hear from.
   */
  quote?: boolean;
  /** Prefills the equipment field, e.g. from a model page. */
  defaultEquipment?: string;
  /** Preselects a quantity band, e.g. from a fleet page. */
  defaultQuantity?: string;
};

/* The quantity bands. Ranges rather than exact numbers: a buyer rarely knows
   whether it is 18 or 22 machines, and the band is what changes how we source. */
const quantities = ["1", "2–9", "10–49", "50+"] as const;

export default function ContactForm({
  lang,
  subjectPrefix,
  messagePlaceholder,
  companyRequired = true,
  quote = false,
  defaultEquipment = "",
  defaultQuantity = "",
}: ContactFormProps) {
  const c = copy[lang];
  const subject_prefix = subjectPrefix?.[lang] ?? (quote ? c.quoteSubject : c.defaultSubject);
  const placeholder =
    messagePlaceholder?.[lang] ?? (quote ? c.quoteMessagePlaceholder : c.defaultPlaceholder);
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const started = useRef(false);
  useEffect(() => setReady(true), []);

  /*
   * Where submitting lands you.
   *
   * Pressing send replaces the whole form with an outcome panel. React does
   * not move focus when it does that, so the button you just pressed stops
   * existing and focus falls to <body> — a keyboard user is put back at the
   * top of the document, and a screen reader says nothing at all. Whether the
   * message was sent or failed is then the one thing on the page you cannot
   * find out without going looking.
   *
   * So the panel is focused when it appears, and it carries a live role:
   * alert when the send did not happen, status when it did.
   *
   * Focusing scrolls, and the header is sticky, so the panel landed with its
   * top edge at the top of the viewport and its heading behind the header —
   * "Tak for jeres henvendelse" half hidden, on the one screen that has to be
   * unambiguous. Measured: the header is 65px on a 390px viewport and 81px
   * from lg. scroll-mt-24 is 96px, so the heading clears it in both.
   */
  const outcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent" || status === "error" || status === "unavailable") {
      outcomeRef.current?.focus();
    }
  }, [status]);
  const emptyValues = {
    navn: "",
    virksomhed: "",
    email: "",
    telefon: "",
    besked: "",
    /* Quote fields. Unused and never rendered when `quote` is false. */
    antal: defaultQuantity || quantities[0],
    udstyr: defaultEquipment,
    ram: "",
    disk: "",
    tastatur: "",
    hvornaar: "",
    /* Honeypot. Hidden from people, filled in by bots. */
    website: "",
  };
  const [values, setValues] = useState(emptyValues);
  /* The four specification fields fold away on the quote form: three fields
     are required and eleven were on screen, which on a phone read as a long
     form to fill in. They open by themselves when something arrives filled
     in, from the front page's mini form or a link. */
  const [moreOpen, setMoreOpen] = useState(false);
  const specFilled = Boolean(values.ram || values.disk || values.tastatur || values.hvornaar);

  /*
   * Prefill from the link the buyer arrived on: /tilbud?model=…&antal=….
   *
   * Read here rather than from the page's searchParams because the quote page
   * is prerendered — a server component that reads a query string would have
   * to opt the whole page out of static rendering to fill in one field. This
   * runs after hydration, so the markup the server sent and the markup React
   * expects still match.
   */
  useEffect(() => {
    if (!quote) return;
    const params = new URLSearchParams(window.location.search);
    const model = params.get("model")?.trim().slice(0, 120) ?? "";
    const band = params.get("antal") ?? "";
    /* "When" arrives from the front page's first step (TrustStrip), along
       with the band and the model. Text only, capped, and bound as a value —
       React escapes it, so a query string cannot become markup. */
    const when = params.get("hvornaar")?.trim().slice(0, 120) ?? "";
    if (!model && !band && !when) return;
    setValues((prev) => ({
      ...prev,
      udstyr: prev.udstyr || model,
      hvornaar: prev.hvornaar || when,
      antal: quantities.includes(band as (typeof quantities)[number]) ? band : prev.antal,
    }));
  }, [quote]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * What the enquiry actually says.
   *
   * In quote mode the specification is a set of fields rather than prose, so
   * it is written out here as labelled lines — the same text goes to the API
   * and into the mail fallback, so the two can never describe different
   * requests.
   */
  function messageBody() {
    if (!quote) return values.besked;

    const spec = [
      `${c.quantityLegend} ${values.antal}`,
      values.udstyr ? `${c.equipment}: ${values.udstyr}` : null,
      values.ram ? `${c.ram}: ${values.ram}` : null,
      values.disk ? `${c.storage}: ${values.disk}` : null,
      values.tastatur ? `${c.keyboard}: ${values.tastatur}` : null,
      values.hvornaar ? `${c.deadline} ${values.hvornaar}` : null,
    ].filter((line): line is string => line !== null);

    return values.besked ? `${spec.join("\n")}\n\n${values.besked}` : spec.join("\n");
  }

  /** The finished message, for the visitor to copy or hand to their mail app. */
  function composed() {
    const subject = `${subject_prefix} ${c.from} ${values.virksomhed || values.navn} ${c.via}`;
    const body = [
      `${c.name}: ${values.navn}`,
      values.virksomhed ? `${c.company}: ${values.virksomhed}` : null,
      `${c.email}: ${values.email}`,
      values.telefon ? `${c.phone}: ${values.telefon}` : null,
      "",
      messageBody(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    return { subject, body };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.navn,
          company: values.virksomhed,
          email: values.email,
          phone: values.telefon,
          message: messageBody(),
          subject: subject_prefix,
          page: window.location.pathname,
          website: values.website,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        /* The conversion. Nothing the visitor typed is sent — only which form
           it was and, on the quote form, the quantity band, because that is
           the one dimension that says whether the traffic is the right kind. */
        track(events.generateLead, {
          form: quote ? "quote" : "contact",
          ...(quote ? { quantity_band: values.antal } : {}),
        });
        return;
      }

      /* 503 means the server has no mail credentials yet. That is ours to fix,
         not the visitor's, so it gets the same honest panel as a failure. */
      setStatus(response.status === 503 ? "unavailable" : "error");
      track(events.formError, { form: quote ? "quote" : "contact", status: response.status });
    } catch {
      /* Offline, or the request was blocked. */
      setStatus("unavailable");
      track(events.formError, { form: quote ? "quote" : "contact", reason: "network" });
    }
  }

  async function copyMessage() {
    const { subject, body } = composed();
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard refused. The mail link beside it still works. */
    }
  }

  /*
   * min-h-11 is 44px, which is the floor for something you tap.
   *
   * The padding alone gave 42, and two pixels does not sound like a bug until
   * it is a phone, a thumb and the field that turns a visitor into an enquiry.
   * The text stays at 16px so iOS does not zoom the page when the field takes
   * focus — a smaller size there is the other classic way a mobile form loses
   * people.
   */
  const inputClasses =
    "w-full min-h-11 rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-base sm:text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25 [&:user-invalid]:border-red-600 [&:user-invalid]:ring-2 [&:user-invalid]:ring-red-600/20";

  if (status === "unavailable" || status === "error") {
    const { subject, body } = composed();
    const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    return (
      <div
        ref={outcomeRef}
        role="alert"
        tabIndex={-1}
        aria-labelledby="kontakt-udfald"
        className="plate scroll-mt-24 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:p-8"
      >
        <h3
          id="kontakt-udfald"
          className="font-display text-xl font-bold tracking-tight text-ink-900"
        >
          {c.unavailableTitle}
        </h3>
        <p className="mt-3 text-base leading-[1.75] text-ink-700">{c.unavailableBody}</p>

        <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap border border-ink-200 bg-ink-50 p-4 font-mono text-xs leading-6 text-ink-700">
          {body}
        </pre>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={copyMessage} className={buttonClass("primary")}>
            {copied ? c.copied : c.copyMessage}
          </button>
          <a
            href={mailHref}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-ink-300 bg-ink-50 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-400 hover:text-ink-900"
          >
            {c.openMail}
          </a>
        </div>

        {company.phoneHref && (
          <p className="mt-5 text-sm leading-[1.6] text-ink-600">
            {c.orCall}{" "}
            <a
              href={`tel:${company.phoneHref}`}
              className="font-semibold text-brand-700 underline decoration-brand-600/60 decoration-2 underline-offset-4 hover:text-ink-900"
            >
              {company.phoneDisplay}
            </a>
            .
          </p>
        )}

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-ink-600 underline decoration-ink-300 underline-offset-4 hover:text-ink-900"
        >
          {c.back}
        </button>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div
        ref={outcomeRef}
        role="status"
        tabIndex={-1}
        aria-labelledby="kontakt-udfald"
        className="plate scroll-mt-24 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:p-8"
      >
        <h3
          id="kontakt-udfald"
          className="font-display text-xl font-bold tracking-tight text-ink-900"
        >
          {quote ? c.quoteThanksTitle : c.thanksTitle}
        </h3>
        <p className="mt-3 text-base leading-[1.75] text-ink-700">
          {quote ? c.quoteThanksBody : c.thanksBody}
        </p>

        {quote && (
          <ol className="mt-6 space-y-3 border-t border-ink-200 pt-5">
            {nextSteps[lang].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-ink-700">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues);
            started.current = false;
            setStatus("idle");
          }}
          className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-700 underline decoration-brand-600/60 decoration-2 underline-offset-4 hover:text-ink-900"
        >
          {c.thanksAgain}
        </button>
      </div>
    );
  }

  return (
    <form
      action="/api/kontakt"
      method="post"
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        if (started.current) return;
        started.current = true;
        track(events.formStart, { form: quote ? "quote" : "contact" });
      }}
      className="relative space-y-5"
    >
      <p className="border-l-2 border-brand-600 pl-4 text-sm leading-6 text-ink-800">
        {projectNotice[lang].body}
      </p>
      <noscript>
        <p className="text-sm leading-6 text-ink-800">
          {lang === "da"
            ? "Formularen kræver JavaScript. Skriv i stedet til "
            : "This form requires JavaScript. Please email "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </noscript>
      <fieldset
        disabled={!ready}
        className="min-w-0 space-y-5"
        aria-label={lang === "da" ? "Kontaktformular" : "Enquiry form"}
      >
        {quote && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink-800">
              {c.quantityLegend} <span className="text-brand-600">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {quantities.map((band) => (
                <label
                  key={band}
                  className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-lg border px-5 text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
                    values.antal === band
                      ? "border-brand-600 bg-brand-100 text-ink-900"
                      : "border-ink-300 bg-ink-50 text-ink-700 hover:border-ink-400 hover:text-ink-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="antal"
                    value={band}
                    checked={values.antal === band}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {band}
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm leading-[1.5] text-ink-700">{c.quantityHelp}</p>
          </fieldset>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="navn" className="mb-1.5 block text-sm font-medium text-ink-800">
              {c.name} <span className="text-brand-600">*</span>
            </label>
            <input
              id="navn"
              name="navn"
              type="text"
              autoComplete="name"
              required
              value={values.navn}
              onChange={handleChange}
              className={inputClasses}
              placeholder={c.namePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="virksomhed" className="mb-1.5 block text-sm font-medium text-ink-800">
              {c.company}{" "}
              {companyRequired ? (
                <span className="text-brand-600">*</span>
              ) : (
                <span className="text-ink-600">{c.optional}</span>
              )}
            </label>
            <input
              id="virksomhed"
              name="virksomhed"
              type="text"
              autoComplete="organization"
              required={companyRequired}
              value={values.virksomhed}
              onChange={handleChange}
              className={inputClasses}
              placeholder={c.companyPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
              {c.email} <span className="text-brand-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder={c.emailPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-ink-800">
              {c.phone}
            </label>
            <input
              id="telefon"
              name="telefon"
              type="tel"
              autoComplete="tel"
              value={values.telefon}
              onChange={handleChange}
              className={inputClasses}
              placeholder={c.phonePlaceholder}
            />
          </div>
        </div>

        {quote && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="udstyr" className="mb-1.5 block text-sm font-medium text-ink-800">
                {c.equipment}
              </label>
              <input
                id="udstyr"
                name="udstyr"
                type="text"
                value={values.udstyr}
                onChange={handleChange}
                className={inputClasses}
                placeholder={c.equipmentPlaceholder}
              />
            </div>

            <details
              open={moreOpen || specFilled}
              onToggle={(event) => setMoreOpen(event.currentTarget.open)}
              className="group sm:col-span-2"
            >
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink-900 [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  strokeWidth={2}
                />
                {c.moreDetails} <span className="font-normal text-ink-600">{c.optional}</span>
              </summary>
              <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ram" className="mb-1.5 block text-sm font-medium text-ink-800">
                    {c.ram}
                  </label>
                  <select
                    id="ram"
                    name="ram"
                    value={values.ram}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">{c.dontKnow}</option>
                    <option value="8 GB">8 GB</option>
                    <option value="16 GB">16 GB</option>
                    <option value="32 GB+">32 GB+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="disk" className="mb-1.5 block text-sm font-medium text-ink-800">
                    {c.storage}
                  </label>
                  <select
                    id="disk"
                    name="disk"
                    value={values.disk}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">{c.dontKnow}</option>
                    <option value="256 GB SSD">256 GB SSD</option>
                    <option value="512 GB SSD">512 GB SSD</option>
                    <option value="1 TB SSD+">1 TB SSD+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tastatur"
                    className="mb-1.5 block text-sm font-medium text-ink-800"
                  >
                    {c.keyboard}
                  </label>
                  <select
                    id="tastatur"
                    name="tastatur"
                    value={values.tastatur}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">{c.dontKnow}</option>
                    {/* The value is what lands in the enquiry, which is read in
                      Danish; the label is in the reader's language. */}
                    <option value="Dansk">{c.keyboardDa}</option>
                    <option value="Norsk">{c.keyboardNo}</option>
                    <option value="Engelsk (UK/US)">{c.keyboardEn}</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hvornaar"
                    className="mb-1.5 block text-sm font-medium text-ink-800"
                  >
                    {c.deadline}
                  </label>
                  <input
                    id="hvornaar"
                    name="hvornaar"
                    type="text"
                    value={values.hvornaar}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder={c.deadlinePlaceholder}
                  />
                </div>
              </div>
            </details>
          </div>
        )}

        <div>
          <label htmlFor="besked" className="mb-1.5 block text-sm font-medium text-ink-800">
            {quote ? c.quoteMessage : c.message}{" "}
            {quote ? (
              <span className="text-ink-600">{c.optional}</span>
            ) : (
              <span className="text-brand-600">*</span>
            )}
          </label>
          <textarea
            id="besked"
            name="besked"
            required={!quote}
            rows={quote ? 4 : 5}
            value={values.besked}
            onChange={handleChange}
            className={inputClasses}
            placeholder={placeholder}
          />
        </div>

        {/* Hidden from people by position rather than display:none, which some
          bots check for. Never focusable, never announced, and deliberately
          carries no visible text: search snippets have picked up off-screen
          honeypot labels before, which makes a contact result look like a raw
          form dump instead of a company page. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={handleChange}
          />
        </div>

        <div>
          {/* The site's one button, from the same string as the front page's
            form: full width under the thumb on a phone, its own width on a
            wide screen. It was a hand-written 44px pill a third of the
            width, without the press state the real button has. */}
          <button
            type="submit"
            disabled={status === "sending"}
            aria-busy={status === "sending"}
            className={`${buttonClass("primary", "lg")} w-full sm:w-auto disabled:opacity-60`}
          >
            {status === "sending" ? c.sending : quote ? c.quoteSubmit : c.submit}
          </button>

          <p className="mt-3 text-sm leading-[1.5] text-ink-700">
            {c.privacy}{" "}
            <Link
              href={localePath("/privatlivspolitik", lang)}
              className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
            >
              {c.privacyLink}
            </Link>
            .
          </p>
        </div>
      </fieldset>
    </form>
  );
}

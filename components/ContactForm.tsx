"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { company } from "@/lib/company";
import { localePath, type Lang, type Localized } from "@/lib/i18n";

const CONTACT_EMAIL = "info@kestro.dk";

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
    namePlaceholder: "Dit fulde navn",
    company: "Virksomhed",
    companyPlaceholder: "Firmanavn",
    optional: "(valgfrit)",
    email: "Email",
    emailPlaceholder: "dig@virksomhed.dk",
    phone: "Telefon",
    phonePlaceholder: "+45 12 34 56 78",
    message: "Besked",
    submit: "Send besked",
    unavailableTitle: "Formularen kan ikke sende lige nu",
    unavailableBody:
      "Send beskeden direkte til os i stedet – den står klar herunder. Vi svarer inden for én arbejdsdag.",
    openMail: "Åbn i mailprogram",
    copyMessage: "Kopiér beskeden",
    copied: "Kopieret",
    orCall: "Eller ring på",
    back: "Tilbage til formularen",
    sending: "Sender …",
    thanksTitle: "Tak for jeres henvendelse.",
    thanksBody: "Vi vender tilbage inden for én arbejdsdag.",
    thanksAgain: "Send en besked mere",
    privacy: "Vi bruger kun oplysningerne til at besvare henvendelsen. Se",
    privacyLink: "privatlivspolitikken",
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
    unavailableBody:
      "Send the message to us directly instead — it is ready below. We answer within one working day.",
    openMail: "Open in mail app",
    copyMessage: "Copy the message",
    copied: "Copied",
    orCall: "Or call",
    back: "Back to the form",
    sending: "Sending …",
    thanksTitle: "Thank you for getting in touch.",
    thanksBody: "We will come back to you within one working day.",
    thanksAgain: "Send another message",
    privacy: "We use the details only to answer the enquiry. See the",
    privacyLink: "privacy policy",
    defaultSubject: "Enquiry",
    defaultPlaceholder:
      "Tell us what you need — number of devices, specifications, timing and anything else.",
    from: "from",
    via: "via kestro.dk",
  },
} satisfies Record<Lang, Record<string, string>>;

type ContactFormProps = {
  lang: Lang;
  subjectPrefix?: Localized;
  messagePlaceholder?: Localized;
  companyRequired?: boolean;
};

export default function ContactForm({
  lang,
  subjectPrefix,
  messagePlaceholder,
  companyRequired = true,
}: ContactFormProps) {
  const c = copy[lang];
  const subject_prefix = subjectPrefix?.[lang] ?? c.defaultSubject;
  const placeholder = messagePlaceholder?.[lang] ?? c.defaultPlaceholder;
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState({
    navn: "",
    virksomhed: "",
    email: "",
    telefon: "",
    besked: "",
    /* Honeypot. Hidden from people, filled in by bots. */
    website: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
      values.besked,
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
          message: values.besked,
          subject: subject_prefix,
          page: window.location.pathname,
          website: values.website,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        return;
      }

      /* 503 means the server has no mail credentials yet. That is ours to fix,
         not the visitor's, so it gets the same honest panel as a failure. */
      setStatus(response.status === 503 ? "unavailable" : "error");
    } catch {
      /* Offline, or the request was blocked. */
      setStatus("unavailable");
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

  const inputClasses =
    "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none focus:ring-2 focus:ring-brand-400/40";

  if (status === "unavailable" || status === "error") {
    const { subject, body } = composed();
    const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    return (
      <div className="border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper">
          {c.unavailableTitle}
        </h3>
        <p className="mt-3 text-base leading-7 text-paper/65">{c.unavailableBody}</p>

        <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap border border-white/10 bg-ink-950/50 p-4 font-mono text-xs leading-6 text-paper/75">
          {body}
        </pre>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyMessage}
            className="inline-flex min-h-[44px] items-center bg-brand-600 px-6 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700"
          >
            {copied ? c.copied : c.copyMessage}
          </button>
          <a
            href={mailHref}
            className="inline-flex min-h-[44px] items-center border border-white/15 px-6 text-sm font-semibold text-paper/75 transition hover:border-white/40 hover:text-paper"
          >
            {c.openMail}
          </a>
        </div>

        {company.phoneHref && (
          <p className="mt-5 text-sm leading-6 text-paper/55">
            {c.orCall}{" "}
            <a
              href={`tel:${company.phoneHref}`}
              className="font-semibold text-brand-300 underline decoration-brand-400/60 decoration-2 underline-offset-4 hover:text-paper"
            >
              {company.phoneDisplay}
            </a>
            .
          </p>
        )}

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-paper/55 underline decoration-paper/30 underline-offset-4 hover:text-paper"
        >
          {c.back}
        </button>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
        <h3 className="font-display text-xl font-bold tracking-tight text-paper">
          {c.thanksTitle}
        </h3>
        <p className="mt-3 text-base leading-7 text-paper/65">{c.thanksBody}</p>
        <button
          type="button"
          onClick={() => {
            setValues({
              navn: "",
              virksomhed: "",
              email: "",
              telefon: "",
              besked: "",
              website: "",
            });
            setStatus("idle");
          }}
          className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/60 decoration-2 underline-offset-4 hover:text-paper"
        >
          {c.thanksAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="navn" className="mb-1.5 block text-sm font-medium text-paper/80">
            {c.name} <span className="text-brand-400">*</span>
          </label>
          <input
            id="navn"
            name="navn"
            type="text"
            required
            value={values.navn}
            onChange={handleChange}
            className={inputClasses}
            placeholder={c.namePlaceholder}
          />
        </div>

        <div>
          <label htmlFor="virksomhed" className="mb-1.5 block text-sm font-medium text-paper/80">
            {c.company}{" "}
            {companyRequired ? (
              <span className="text-brand-400">*</span>
            ) : (
              <span className="text-paper/45">{c.optional}</span>
            )}
          </label>
          <input
            id="virksomhed"
            name="virksomhed"
            type="text"
            required={companyRequired}
            value={values.virksomhed}
            onChange={handleChange}
            className={inputClasses}
            placeholder={c.companyPlaceholder}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-paper/80">
            {c.email} <span className="text-brand-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder={c.emailPlaceholder}
          />
        </div>

        <div>
          <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-paper/80">
            {c.phone}
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            value={values.telefon}
            onChange={handleChange}
            className={inputClasses}
            placeholder={c.phonePlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="besked" className="mb-1.5 block text-sm font-medium text-paper/80">
          {c.message} <span className="text-brand-400">*</span>
        </label>
        <textarea
          id="besked"
          name="besked"
          required
          rows={5}
          value={values.besked}
          onChange={handleChange}
          className={inputClasses}
          placeholder={placeholder}
        />
      </div>

      {/* Hidden from people by position rather than display:none, which some
          bots check for. Never focusable, never announced. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
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
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-[48px] items-center bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700 disabled:opacity-60"
        >
          {status === "sending" ? c.sending : c.submit}
        </button>

        <p className="mt-3 text-xs leading-5 text-paper/50">
          {c.privacy}{" "}
          <Link
            href={localePath("/privatlivspolitik", lang)}
            className="underline decoration-paper/30 underline-offset-2 hover:text-paper"
          >
            {c.privacyLink}
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

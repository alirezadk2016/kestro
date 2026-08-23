"use client";

import { FormEvent, useState } from "react";
import type { Lang, Localized } from "@/lib/i18n";

const CONTACT_EMAIL = "info@kestro.dk";

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
    note: "åbnes din egen e-mailklient med beskeden udfyldt og klar til afsendelse til",
    noteLead: "Når du klikker",
    defaultSubject: "Henvendelse",
    defaultPlaceholder:
      "Fortæl os om jeres behov – antal enheder, specifikationer, tidsramme m.m.",
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
    note: "your own email client opens with the message filled in and ready to send to",
    noteLead: "When you click",
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
  const [values, setValues] = useState({
    navn: "",
    virksomhed: "",
    email: "",
    telefon: "",
    besked: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  const inputClasses =
    "w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none focus:ring-2 focus:ring-accent-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="navn" className="mb-1.5 block text-sm font-medium text-ink-700">
            {c.name} <span className="text-accent-500">*</span>
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
          <label htmlFor="virksomhed" className="mb-1.5 block text-sm font-medium text-ink-700">
            {c.company}{" "}
            {companyRequired ? (
              <span className="text-accent-500">*</span>
            ) : (
              <span className="text-ink-400">{c.optional}</span>
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
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
            {c.email} <span className="text-accent-500">*</span>
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
          <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-ink-700">
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
        <label htmlFor="besked" className="mb-1.5 block text-sm font-medium text-ink-700">
          {c.message} <span className="text-accent-500">*</span>
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

      <div>
        <button
          type="submit"
          className="bg-ink-950 px-7 py-3.5 text-sm font-semibold tracking-tight text-paper transition hover:bg-ink-800"
        >
          {c.submit}
        </button>
        <p className="mt-3 text-xs leading-5 text-ink-500">
          {c.noteLead} &ldquo;{c.submit}&rdquo;, {c.note} {CONTACT_EMAIL}.
        </p>
      </div>
    </form>
  );
}

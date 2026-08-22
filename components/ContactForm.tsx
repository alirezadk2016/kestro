"use client";

import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "info@kestro.dk";

export default function ContactForm() {
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

    const subject = `Henvendelse fra ${values.virksomhed || values.navn} via kestro.dk`;
    const body = [
      `Navn: ${values.navn}`,
      `Virksomhed: ${values.virksomhed}`,
      `Email: ${values.email}`,
      values.telefon ? `Telefon: ${values.telefon}` : null,
      "",
      values.besked,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  const inputClasses =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="navn" className="mb-1.5 block text-sm font-medium text-slate-700">
            Navn <span className="text-brand-600">*</span>
          </label>
          <input
            id="navn"
            name="navn"
            type="text"
            required
            value={values.navn}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Dit fulde navn"
          />
        </div>

        <div>
          <label htmlFor="virksomhed" className="mb-1.5 block text-sm font-medium text-slate-700">
            Virksomhed <span className="text-brand-600">*</span>
          </label>
          <input
            id="virksomhed"
            name="virksomhed"
            type="text"
            required
            value={values.virksomhed}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Firmanavn"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email <span className="text-brand-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="dig@virksomhed.dk"
          />
        </div>

        <div>
          <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-slate-700">
            Telefon
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            value={values.telefon}
            onChange={handleChange}
            className={inputClasses}
            placeholder="+45 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label htmlFor="besked" className="mb-1.5 block text-sm font-medium text-slate-700">
          Besked <span className="text-brand-600">*</span>
        </label>
        <textarea
          id="besked"
          name="besked"
          required
          rows={5}
          value={values.besked}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Fortæl os om jeres behov – antal enheder, specifikationer, tidsramme m.m."
        />
      </div>

      <div>
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Send besked
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Når du klikker &ldquo;Send besked&rdquo;, åbnes din egen e-mailklient med beskeden udfyldt og
          klar til afsendelse til {CONTACT_EMAIL}.
        </p>
      </div>
    </form>
  );
}

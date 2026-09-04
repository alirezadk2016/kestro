import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnquiry, setEnquiryStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleString("da-DK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  });

export default async function EnquiryPage({ params }: { params: { id: string } }) {
  const enquiry = await getEnquiry(params.id);
  if (!enquiry) notFound();

  /* Opening it is reading it. Only from "new", so a message that has already
     been replied to is not quietly demoted by being looked at again. */
  if (enquiry.status === "new") await setEnquiryStatus(enquiry.id, "read");

  const facts = [
    { label: "Email", value: enquiry.email },
    { label: "Telefon", value: enquiry.phone },
    { label: "Virksomhed", value: enquiry.company },
    { label: "Sendt fra", value: enquiry.page },
    { label: "Modtaget", value: when(enquiry.created_at) },
  ].filter((fact) => fact.value);

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-sm text-paper/50 transition hover:text-paper">
        ← Alle beskeder
      </Link>

      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">{enquiry.name}</h1>
      {enquiry.subject && <p className="mt-1 text-sm text-paper/55">{enquiry.subject}</p>}

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 border-y border-white/10 py-4 text-sm sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="flex gap-2">
            <dt className="text-paper/40">{fact.label}</dt>
            <dd className="min-w-0 truncate text-paper/80">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {/* whitespace-pre-wrap, because the visitor's line breaks are part of
          what they wrote and collapsing them rewrites their message. */}
      <div className="mt-6 whitespace-pre-wrap border-l-2 border-brand-400 bg-white/[0.04] p-5 text-sm leading-6 text-paper/85">
        {enquiry.message}
      </div>

      {enquiry.status === "replied" && enquiry.reply_body ? (
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.14em] text-brand-300/70">
            Besvaret {enquiry.replied_at ? when(enquiry.replied_at) : ""}
          </h2>
          <div className="mt-3 whitespace-pre-wrap border border-white/10 p-5 text-sm leading-6 text-paper/70">
            {enquiry.reply_body}
          </div>
          <p className="mt-3 text-sm text-paper/45">
            Skriv nedenfor igen, hvis der skal følges op.
          </p>
        </div>
      ) : null}

      <form action="/api/admin/reply" method="post" className="mt-8">
        <input type="hidden" name="id" value={enquiry.id} />
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-paper/80">
          Svar til {enquiry.name}
        </label>
        <textarea
          id="body"
          name="body"
          rows={9}
          required
          placeholder={`Hej ${enquiry.name.split(" ")[0]},\n\n`}
          className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm leading-6 text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none focus:ring-2 focus:ring-brand-400/40"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="bg-brand-600 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-brand-500">
            Send svar
          </button>
          {/* The reply goes from the site, and lands in their inbox as coming
              from us with their address as reply-to — so their answer to our
              answer arrives in the normal mailbox, not here. */}
          <span className="text-xs text-paper/40">
            Sendes til {enquiry.email} · svar lander i kontakt@kestro.dk
          </span>
        </div>
      </form>

      <form action="/api/admin/archive" method="post" className="mt-10 border-t border-white/10 pt-5">
        <input type="hidden" name="id" value={enquiry.id} />
        <button className="text-sm text-paper/40 transition hover:text-paper">
          Arkivér denne besked
        </button>
      </form>
    </div>
  );
}

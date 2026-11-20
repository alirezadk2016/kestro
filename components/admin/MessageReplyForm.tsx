"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AlertIcon, SendIcon } from "@/components/admin/icons";
import { looksLikeEmail } from "@/lib/mail-safe";

/** Enhancement only: without JS the same form still posts to the guarded route.
 * A failed request keeps the reply in memory; no customer text is persisted in
 * the browser or copied to analytics. */
export default function MessageReplyForm({
  id,
  name,
  email,
  mailReady,
}: {
  id: string;
  name: string;
  email: string;
  mailReady: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const posting = useRef(false);
  const firstName = name.trim().split(/\s+/)[0] || name;
  const recipientValid = looksLikeEmail(email);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting.current || !mailReady || !recipientValid) return;
    if (!event.currentTarget.reportValidity()) return;
    const form = new FormData(event.currentTarget);
    if (!String(form.get("body") ?? "").trim()) {
      setError("Skriv et svar, før du sender.");
      return;
    }

    posting.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        body: form,
        credentials: "same-origin",
        signal: AbortSignal.timeout(20000),
      });
      const destination = new URL(response.url);
      if (
        response.ok &&
        destination.origin === window.location.origin &&
        destination.pathname === `/admin/beskeder/${id}` &&
        destination.searchParams.get("sendt") === "1"
      ) {
        setBody("");
        router.replace(`${destination.pathname}${destination.search}`);
        router.refresh();
      } else if (response.status === 403 || destination.pathname === "/admin") {
        setError(
          "Din session er udløbet. Behold teksten her, og log ind i en anden fane, før du prøver igen.",
        );
      } else if (
        response.ok &&
        destination.origin === window.location.origin &&
        destination.pathname === `/admin/beskeder/${id}` &&
        ["mail", "send", "ukendt"].includes(destination.searchParams.get("fejl") ?? "")
      ) {
        // Same pathname keeps this client component and its draft alive, while
        // the server reads the short-lived, httpOnly provider-error cookie.
        router.replace(`${destination.pathname}${destination.search}`);
        router.refresh();
      } else {
        setError(
          "Afsendelsen kunne ikke bekræftes. Kontrollér leveringen hos mailudbyderen, før du sender igen. Din tekst er bevaret her.",
        );
      }
    } catch {
      setError(
        "Forbindelsen blev afbrudt. Kontrollér leveringen hos mailudbyderen, før du sender igen. Din tekst er bevaret her.",
      );
    } finally {
      posting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      action="/api/admin/reply"
      method="post"
      onSubmit={submit}
      aria-busy={pending}
      className="mt-5"
    >
      <input type="hidden" name="id" value={id} />
      <label htmlFor="reply-body" className="block text-sm font-medium text-paper">
        Svar til {name}
      </label>
      <p id="reply-recipient" className="mt-1 break-words text-xs leading-5 text-paper/70">
        Sendes som e-mail til {email}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || body.trim().length > 0}
          onClick={() =>
            setBody(
              `Hej ${firstName},\n\nTak for din henvendelse til Kestro.\n\nVenlig hilsen\nKestro`,
            )
          }
          className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 px-3 text-xs font-medium text-paper/80 hover:border-white/30 hover:text-paper disabled:cursor-not-allowed disabled:text-paper/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
        >
          Bekræft modtagelse
        </button>
        <button
          type="button"
          disabled={pending || body.trim().length > 0}
          onClick={() =>
            setBody(
              `Hej ${firstName},\n\nTak for din henvendelse. Vil du sende modelnavn og en kort beskrivelse af dit behov, så vi kan vurdere det nærmere?\n\nVenlig hilsen\nKestro`,
            )
          }
          className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 px-3 text-xs font-medium text-paper/80 hover:border-white/30 hover:text-paper disabled:cursor-not-allowed disabled:text-paper/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
        >
          Bed om flere oplysninger
        </button>
      </div>
      <textarea
        id="reply-body"
        name="body"
        rows={9}
        required
        maxLength={10000}
        readOnly={pending}
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setError("");
        }}
        aria-describedby="reply-recipient reply-help"
        placeholder={`Hej ${firstName},\n\n`}
        className="mt-3 w-full rounded-lg border border-white/15 bg-brand-950 px-4 py-3.5 text-sm leading-7 text-paper transition placeholder:text-paper/65 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
      />
      <div
        id="reply-help"
        className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs leading-5 text-paper/65"
      >
        <p>Tilpas teksten, før du sender. Kladder gemmes ikke.</p>
        <p className="tabular-nums">{body.length.toLocaleString("da-DK")} / 10.000 tegn</p>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-400/[0.07] p-4 text-sm leading-6 text-red-100"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-red-300" />
          <span>{error}</span>
        </p>
      )}
      {!mailReady && (
        <p className="mt-4 text-sm leading-6 text-amber-100">
          Mailafsendelse er ikke konfigureret. Se Systemstatus, før du sender et svar.
        </p>
      )}
      <button
        disabled={pending || !mailReady || !recipientValid}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-paper/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      >
        <SendIcon className="h-4 w-4" />
        {pending ? "Sender…" : "Send svar"}
      </button>
    </form>
  );
}

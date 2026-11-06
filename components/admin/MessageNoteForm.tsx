"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { BUTTON, INPUT } from "@/components/admin/tokens";

/** Kept only in this mounted editor, including after a failed save. */
export default function MessageNoteForm({
  id,
  initialNote,
  outcome,
}: {
  id: string;
  initialNote: string;
  outcome?: "saved" | "error";
}) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState(
    outcome === "saved"
      ? "Noten er gemt."
      : outcome === "error"
        ? "Noten kunne ikke gemmes. Prøv igen."
        : "",
  );
  const [failed, setFailed] = useState(outcome === "error");
  const posting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting.current || !event.currentTarget.reportValidity()) return;
    const form = new FormData(event.currentTarget);
    posting.current = true;
    setPending(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/note", {
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
        destination.searchParams.get("note") === "saved"
      ) {
        setFailed(false);
        setNotice("Noten er gemt.");
        setNote(note.trim());
        router.refresh();
      } else {
        setFailed(true);
        setNotice(
          response.status === 403 || destination.pathname === "/admin"
            ? "Din session er udløbet. Teksten er bevaret her. Log ind i en anden fane, og gem igen."
            : "Noten kunne ikke gemmes. Teksten er bevaret her. Kontrollér forbindelsen under System, og prøv igen.",
        );
      }
    } catch {
      setFailed(true);
      setNotice("Forbindelsen blev afbrudt. Teksten er bevaret her. Prøv at gemme igen.");
    } finally {
      posting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      action="/api/admin/note"
      method="post"
      onSubmit={submit}
      aria-busy={pending}
      className="mt-4"
    >
      <input type="hidden" name="id" value={id} />
      <label htmlFor="internal-note" className="sr-only">
        Intern note
      </label>
      <textarea
        id="internal-note"
        name="note"
        rows={6}
        maxLength={5000}
        readOnly={pending}
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
          setNotice("");
        }}
        aria-describedby="note-help note-limit"
        placeholder="Aftaler og næste skridt…"
        className={`${INPUT} w-full py-3 leading-6 placeholder:text-paper/65`}
      />
      {notice && (
        <p
          role={failed ? "alert" : "status"}
          className={`mt-3 text-sm leading-6 ${failed ? "text-amber-100" : "text-emerald-200"}`}
        >
          {notice}
        </p>
      )}
      <button disabled={pending} className={`${BUTTON} mt-3 w-full`}>
        {pending ? "Gemmer…" : "Gem note"}
      </button>
      <p id="note-limit" className="mt-3 text-xs leading-5 text-paper/65">
        Op til 5.000 tegn. Gem en tom note for at fjerne den.
      </p>
    </form>
  );
}

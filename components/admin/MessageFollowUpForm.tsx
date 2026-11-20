"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BUTTON, INPUT } from "@/components/admin/tokens";

export default function MessageFollowUpForm({
  id,
  initialPriority,
  initialDate,
  outcome,
}: {
  id: string;
  initialPriority: "normal" | "high";
  initialDate: string | null;
  outcome?: "saved" | "error";
}) {
  const router = useRouter();
  const [priority, setPriority] = useState(initialPriority);
  const [date, setDate] = useState(initialDate ?? "");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(outcome === "error");
  const [notice, setNotice] = useState(
    outcome === "saved"
      ? "Opfølgningen er gemt."
      : outcome === "error"
        ? "Opfølgningen kunne ikke gemmes."
        : "",
  );
  const posting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting.current || !event.currentTarget.reportValidity()) return;
    const body = new FormData(event.currentTarget);
    posting.current = true;
    setPending(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/follow-up", {
        method: "POST",
        body,
        credentials: "same-origin",
        signal: AbortSignal.timeout(20000),
      });
      const destination = new URL(response.url);
      const saved =
        response.ok &&
        destination.origin === window.location.origin &&
        destination.pathname === `/admin/beskeder/${id}` &&
        destination.searchParams.get("followup") === "saved";
      setFailed(!saved);
      setNotice(
        saved
          ? "Opfølgningen er gemt."
          : response.status === 403 || destination.pathname === "/admin"
            ? "Sessionen er udløbet. Dine valg er bevaret her. Log ind i en anden fane, og gem igen."
            : "Opfølgningen kunne ikke gemmes. Dine valg er bevaret her. Prøv igen.",
      );
      if (saved) router.refresh();
    } catch {
      setFailed(true);
      setNotice("Forbindelsen blev afbrudt. Dine valg er bevaret her. Prøv at gemme igen.");
    } finally {
      posting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      action="/api/admin/follow-up"
      method="post"
      onSubmit={submit}
      aria-busy={pending}
      className="mt-4 space-y-4"
    >
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="followup-priority" className="mb-2 block text-xs font-medium text-paper/75">
          Prioritet
        </label>
        <select
          id="followup-priority"
          name="priority"
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value as "normal" | "high");
            setNotice("");
          }}
          disabled={pending}
          className={`${INPUT} w-full`}
        >
          <option value="normal">Normal</option>
          <option value="high">Høj</option>
        </select>
      </div>
      <div>
        <label htmlFor="followup-date" className="mb-2 block text-xs font-medium text-paper/75">
          Følg op den
        </label>
        <input
          id="followup-date"
          name="follow_up_on"
          type="date"
          min="0001-01-01"
          max="9999-12-31"
          value={date}
          readOnly={pending}
          onChange={(event) => {
            setDate(event.target.value);
            setNotice("");
          }}
          className={`${INPUT} w-full min-w-0 [color-scheme:dark]`}
          aria-describedby="followup-help"
        />
      </div>
      <p id="followup-help" className="text-xs leading-5 text-paper/70">
        Intern planlægning efter dato i København. Der sendes ingen påmindelsesmail.
      </p>
      {date && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setDate("");
            setNotice("");
          }}
          className="inline-flex min-h-11 items-center text-xs font-medium text-brand-200 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
        >
          Ryd dato
        </button>
      )}
      {notice && (
        <p
          role={failed ? "alert" : "status"}
          className={`text-sm leading-6 ${failed ? "text-amber-100" : "text-emerald-200"}`}
        >
          {notice}
        </p>
      )}
      <button disabled={pending} className={`${BUTTON} w-full`}>
        {pending ? "Gemmer…" : "Gem opfølgning"}
      </button>
    </form>
  );
}

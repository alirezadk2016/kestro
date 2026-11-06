"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { BUTTON, INPUT } from "@/components/admin/tokens";

/** The selection belongs only to the rows in this form, never another page. */
export default function InboxBulk({
  children,
  q,
  statusFilter,
  source,
  sort,
}: {
  children: ReactNode;
  q: string;
  statusFilter: string;
  source?: string;
  sort: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function count() {
    setSelected(form.current?.querySelectorAll('input[name="ids"]:checked').length ?? 0);
    setError("");
  }

  function toggleAll() {
    const boxes = Array.from(
      form.current?.querySelectorAll<HTMLInputElement>('input[name="ids"]') ?? [],
    );
    const select = boxes.some((box) => !box.checked);
    boxes.forEach((box) => {
      box.checked = select;
    });
    count();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    if (event.currentTarget.querySelectorAll('input[name="ids"]:checked').length === 0) {
      event.preventDefault();
      setError("Vælg mindst én besked på denne side.");
      return;
    }
    setPending(true);
  }

  return (
    <form
      ref={form}
      action="/api/admin/bulk-status"
      method="post"
      onChange={count}
      onSubmit={submit}
      aria-label="Håndtér valgte beskeder"
      aria-busy={pending}
      className="mt-3"
    >
      <input type="hidden" name="q" value={q} />
      <input type="hidden" name="statusFilter" value={statusFilter} />
      <input type="hidden" name="source" value={source ?? ""} />
      <input type="hidden" name="sort" value={sort} />
      <details className="mb-3 rounded-lg border border-white/10 bg-white/[0.025] px-4">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm font-medium text-paper/85">
          <span>Håndtér flere beskeder</span>
          <span className="text-xs tabular-nums text-paper/70">{selected} valgt</span>
        </summary>
        <div className="border-t border-white/10 pb-4 pt-3">
          <p className="text-xs leading-5 text-paper/70">
            Kun markerede beskeder på denne side ændres. Der sendes ingen e-mail.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <button type="button" onClick={toggleAll} className={BUTTON}>
              Vælg / ryd denne side
            </button>
            <div className="min-w-0 flex-1 sm:flex-none">
              <label htmlFor="bulk-status" className="mb-2 block text-xs text-paper/75">
                Handling
              </label>
              <select
                id="bulk-status"
                name="status"
                required
                defaultValue=""
                className={`${INPUT} w-full`}
              >
                <option value="" disabled>
                  Vælg handling
                </option>
                <option value="read">Markér som læst</option>
                <option value="new">Markér som ulæst</option>
                <option value="archived">Arkivér</option>
              </select>
            </div>
            <button disabled={pending} className={`${BUTTON} w-full sm:w-auto`}>
              {pending ? "Gemmer…" : "Anvend på valgte"}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm text-amber-100">
              {error}
            </p>
          )}
        </div>
      </details>
      {children}
    </form>
  );
}

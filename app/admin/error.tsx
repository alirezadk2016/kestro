"use client";

import { BUTTON, CARD } from "@/components/admin/tokens";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className={`${CARD} p-6`}>
      <h1 className="font-display text-2xl font-bold">Arbejdsrummet kunne ikke åbnes</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-paper/75">
        Prøv at hente siden igen. En afbrudt visning betyder ikke, at en besked eller handling er
        blevet gemt.
      </p>
      <button type="button" onClick={reset} className={`${BUTTON} mt-5`}>
        Prøv igen
      </button>
    </div>
  );
}

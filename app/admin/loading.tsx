export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="py-8">
      <p className="text-sm font-medium text-paper/80">Henter arbejdsrummet…</p>
      <p className="mt-2 text-sm text-paper/65">Beskeder og målinger hentes sikkert.</p>
      <div aria-hidden="true" className="mt-6 space-y-3">
        <div className="h-2 w-40 rounded bg-white/10" />
        <div className="h-24 rounded-xl border border-white/10 bg-white/[0.025]" />
        <div className="h-24 rounded-xl border border-white/10 bg-white/[0.025]" />
      </div>
    </div>
  );
}

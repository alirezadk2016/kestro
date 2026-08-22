const items = [
  { value: "Testet", label: "Og klargjort før levering" },
  { value: "40–60%", label: "Typisk under nyprisen" },
  { value: "DK / NO", label: "Nordisk tastatur & sprog" },
  { value: "B2B", label: "Fokus på virksomhedskunder" },
];

export default function UspBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{item.value}</p>
            <p className="mt-1.5 text-sm text-slate-600">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

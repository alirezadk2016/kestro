import { ShieldCheck, TrendingDown, Globe2, Building2 } from "lucide-react";

const items = [
  { icon: ShieldCheck, value: "Testet", label: "Og klargjort før levering" },
  { icon: TrendingDown, value: "40–60%", label: "Typisk under nyprisen" },
  { icon: Globe2, value: "DK / NO", label: "Nordisk tastatur & sprog" },
  { icon: Building2, value: "B2B", label: "Fokus på virksomhedskunder" },
];

export default function UspBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <item.icon className="mb-2 h-5 w-5 text-brand-600" strokeWidth={1.75} />
            <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{item.value}</p>
            <p className="mt-1.5 text-sm text-slate-600">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

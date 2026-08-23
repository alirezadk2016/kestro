import { ShieldCheck, TrendingDown, Globe2, Building2 } from "lucide-react";

const items = [
  { icon: ShieldCheck, value: "Testet", label: "Og klargjort før levering" },
  { icon: TrendingDown, value: "40–60%", label: "Typisk under nyprisen" },
  { icon: Globe2, value: "DK / NO", label: "Nordisk tastatur & sprog" },
  { icon: Building2, value: "B2B", label: "Fokus på virksomhedskunder" },
];

export default function UspBar() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden bg-slate-200 px-0 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center bg-white px-4 py-7 text-center sm:py-9"
          >
            <item.icon className="mb-2.5 h-5 w-5 text-brand-600" strokeWidth={1.75} />
            <p className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { ShieldCheck, TrendingDown, Globe2, Building2 } from "lucide-react";
import type { Lang } from "@/lib/i18n";

const items = [
  {
    icon: ShieldCheck,
    value: { da: "Testet", en: "Tested" },
    label: { da: "Og klargjort før levering", en: "And prepared before delivery" },
  },
  {
    icon: TrendingDown,
    value: { da: "40–60%", en: "40–60%" },
    label: { da: "Typisk under nyprisen", en: "Typically below the new price" },
  },
  {
    icon: Globe2,
    value: { da: "DK / NO", en: "DK / NO" },
    label: { da: "Nordisk tastatur & sprog", en: "Nordic keyboard and language" },
  },
  {
    icon: Building2,
    value: { da: "B2B", en: "B2B" },
    label: { da: "Fokus på virksomhedskunder", en: "Built around business customers" },
  },
];

export default function UspBar({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden bg-slate-200 px-0 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label.da}
            className="flex flex-col items-center bg-white px-4 py-7 text-center sm:py-9"
          >
            <item.icon className="mb-2.5 h-5 w-5 text-brand-600" strokeWidth={1.75} />
            <p className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {item.value[lang]}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{item.label[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const features = [
  {
    href: "/kvalitet",
    title: { da: "Stand og funktionstest", en: "Condition and testing" },
    sub: { da: "Se, hvad der skal afklares", en: "See what needs to be checked" },
  },
  {
    href: "/ydelser/nordisk-tilpasning",
    title: { da: "Nordisk tastatur og sprog", en: "Nordic keyboard and language" },
    sub: { da: "Tilpasning til jeres arbejdsplads", en: "Preparation for your workplace" },
  },
  {
    href: "/tilbud-eksempel",
    title: { da: "Pris og vilkår på skrift", en: "Price and terms in writing" },
    sub: { da: "Se et tydeligt mærket eksempel", en: "View a clearly labelled example" },
  },
];

export default function FeatureStrip({ lang }: { lang: Lang }) {
  return (
    <div className="relative z-10 border-y border-white/10 bg-ink-950/85">
      <Container>
        <ul className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {features.map((feature) => (
            <li key={feature.href} className="md:px-5 md:first:pl-0 md:last:pr-0">
              <Link
                href={localePath(feature.href, lang)}
                className="group flex min-h-16 items-center justify-between gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 md:min-h-24"
              >
                <span>
                  <span className="block text-sm font-semibold text-paper group-hover:text-brand-200">
                    {feature.title[lang]}
                  </span>
                  <span className="mt-1 hidden text-xs leading-5 text-paper/65 md:block">
                    {feature.sub[lang]}
                  </span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-brand-300" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

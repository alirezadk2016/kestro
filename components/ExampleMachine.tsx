import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { getModel } from "@/lib/models";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * A concrete machine on the front page. We do not hold stock, so this is
 * framed as an example of what we source — the point is to show what a
 * business-class laptop actually is, not to sell this one.
 */
const highlights = [
  { da: "Erhvervsserie – ikke en forbrugermodel", en: "Business range — not a consumer model" },
  { da: "RAM og SSD kan skiftes", en: "Memory and SSD can be changed" },
  { da: "Dansk eller norsk tastatur", en: "Danish or Norwegian keyboard" },
  { da: "Windows installeret og klar", en: "Windows installed and ready" },
];

const copy = {
  da: {
    eyebrow: "Et konkret eksempel",
    body: "Sådan ser en typisk maskine ud, når vi skaffer bærbare til en virksomhed: en erhvervsmodel, der kan repareres og opgraderes, med nordisk tastatur og Windows installeret. Vi har den ikke på lager – vi finder den, når I har brug for den.",
    link: "Se specifikationer og flere billeder",
  },
  en: {
    eyebrow: "One concrete example",
    body: "This is what a typical machine looks like when we source laptops for a company: a business model that can be repaired and upgraded, with a Nordic keyboard and Windows installed. We do not hold it in stock — we find it when you need it.",
    link: "See specifications and more photos",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function ExampleMachine({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const model = getModel("lenovo-thinkpad-t480");
  if (!model?.images) return null;

  const image = model.images[0];

  return (
    <section className="border-b border-paper-edge bg-paper py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden border border-paper-edge bg-white">
            <Image
              src={image.src}
              alt={image.alt[lang]}
              width={1179}
              height={1115}
              className="h-full w-full object-contain p-4 sm:p-8"
              sizes="(max-width: 1024px) 92vw, 560px"
            />
          </div>

          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
              {c.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[1.05] tracking-display text-ink-900">
              {model.name}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-600 sm:text-lg">
              {c.body}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight.da}
                  className="border border-ink-900/15 px-3.5 py-1.5 text-sm text-ink-700"
                >
                  {highlight[lang]}
                </li>
              ))}
            </ul>

            <Link
              href={localePath(`/modeller/${model.slug}`, lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-ink-900 transition hover:text-accent-600"
            >
              {c.link}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
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
  { da: "Windows sat op – licens aftales", en: "Windows set up — licence agreed with you" },
];

const copy = {
  da: {
    title: "Sådan ser en typisk maskine ud",
    body: "Typisk en erhvervsmodel som denne: den kan repareres og opgraderes og får nordisk tastatur og Windows sat op. Vi finder den, når I har brug for den.",
    link: "Se specifikationer og flere billeder",
    illustration: "Erhvervsbærbar – illustreret",
  },
  en: {
    title: "What a typical machine looks like",
    body: "Typically a business model like this one: it can be repaired and upgraded, and gets a Nordic keyboard and Windows set up. We find it when you need it.",
    link: "See specifications and more photos",
    illustration: "Business laptop — illustrated",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function ExampleMachine({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const model = getModel("lenovo-thinkpad-t480");
  if (!model?.images) return null;

  return (
    <section className="stage py-10 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square w-full min-w-0 max-lg:max-h-[55svh]">
            <Image
              src="/models/laptop-assembly.webp?v=service-v2"
              fill
              quality={88}
              alt={
                lang === "da"
                  ? "Illustreret sort erhvervsbærbar med individuelle taster og rød TrackPoint"
                  : "Illustrated black business laptop with individual keys and red TrackPoint"
              }
              sizes="(min-width: 1536px) 40vw, (min-width: 1024px) 560px, 92vw"
              className="object-contain"
            />
          </div>
          <div>
            {/* The heading says what the section is; the model is the example
                in it. With the model name as the h2, the front page's outline
                had a product name standing level with "Hvad er refurbished
                erhvervs-IT?" — a laptop as one of the page's topics. */}
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.title}
            </h2>
            <p className="mt-2 font-display text-lg font-bold text-brand-300">{c.illustration}</p>
            <p className="mt-4 text-base leading-[1.65] text-paper/75 sm:text-lg">{c.body}</p>

            {/* A checklist, not pills: a rounded plate-sm pill is the site's
                onward-link shape, and on a phone four of them under a
                picture read as four buttons that did nothing. */}
            <ul className="mt-6 space-y-2.5">
              {highlights.map((highlight) => (
                <li key={highlight.da} className="flex gap-2.5 text-base leading-6 text-paper/85">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 flex-none text-brand-300"
                    strokeWidth={2}
                  />
                  {highlight[lang]}
                </li>
              ))}
            </ul>

            <Link
              href={localePath(`/modeller/${model.slug}`, lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.link}
              <span className="sr-only">: {model.name}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

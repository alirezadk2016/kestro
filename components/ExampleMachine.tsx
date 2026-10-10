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
  { da: "Windows sat op – licens aftales", en: "Windows set up — licence agreed with you" },
];

const copy = {
  da: {
    title: "Sådan ser en typisk maskine ud",
    body: "Når vi skaffer bærbare til en virksomhed, er det typisk en erhvervsmodel som denne: den kan repareres og opgraderes, får nordisk tastatur og Windows sat op. Vi har den ikke på lager – vi finder den, når I har brug for den.",
    link: "Se specifikationer og flere billeder",
  },
  en: {
    title: "What a typical machine looks like",
    body: "When we source laptops for a company, it is typically a business model like this one: it can be repaired and upgraded, and gets a Nordic keyboard and Windows set up. We do not hold it in stock — we find it when you need it.",
    link: "See specifications and more photos",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function ExampleMachine({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const model = getModel("lenovo-thinkpad-t480");
  if (!model?.images) return null;

  /* The closed lid, not the open machine. The open one's screen shows a
     Windows 10 start menu, and the page says the machines ship with
     Windows 11 — the photograph argued with the paragraph beside it. */
  const image = model.images.find((img) => img.src === "/thinkpad-t480-2.jpg") ?? model.images[0];

  return (
    <section className="stage py-10 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/*
            The machine on a dark ground with a light behind it, rather than
            centred on a white card.

            The source photograph is a black laptop shot on white. On a white
            card it is a catalogue thumbnail — the one image on the page with
            no depth at all, on a page whose whole visual argument is lit
            hardware against dark. scripts/build-cutout.mjs removes the white
            so the machine can stand in the same light as the hero, which costs
            one gradient and a shadow and makes it the same object as the ones
            turning at the top of the page.
          */}
          <div className="plate-well relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-950/40">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(52% 46% at 50% 42%, rgba(84,116,236,0.32) 0%, rgba(66,92,200,0.12) 46%, transparent 74%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[14%] bottom-[10%] h-[12%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(2,5,14,0.6) 0%, rgba(2,5,14,0) 70%)",
              }}
            />
            <Image
              src="/thinkpad-t480-2-cutout.webp"
              alt={image.alt[lang]}
              width={1179}
              height={1120}
              className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10"
              sizes="(max-width: 1024px) 92vw, 560px"
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
            <p className="mt-2 font-display text-lg font-bold text-brand-300">{model.name}</p>
            <p className="mt-4 text-base leading-[1.65] text-paper/75 sm:text-lg">{c.body}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight.da}
                  className="plate-sm rounded-full px-3.5 py-1.5 text-sm text-paper/80"
                >
                  {highlight[lang]}
                </li>
              ))}
            </ul>

            <Link
              href={localePath(`/modeller/${model.slug}`, lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
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

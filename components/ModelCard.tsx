import Image from "next/image";
import Link from "next/link";
import { localePath, type Lang } from "@/lib/i18n";
import type { Model } from "@/lib/models";
import { modelMedia } from "@/lib/model-media";
import SpecChips from "./SpecChips";
import { buttonClass } from "./Button";

/*
 * A model in the catalogue: picture, maker and format, name, one line, the
 * figures a buyer compares, and the two things a buyer does next.
 *
 * It was a text card — name, sentence, chips — repeated eighteen times, and a
 * range of business hardware shown without one picture of the hardware is
 * what made the product pages read as a draft. Every card now opens on the
 * same studio frame (public/products, public/pricing, or a licensed photo),
 * labelled so a drawing is never taken for the unit a buyer gets. A laptop
 * is never drawn: without a real photograph its frame stays empty.
 *
 * The name is the card's link and stretches over the whole card; "Få pris"
 * sits above it as a second, separate target, so a buyer can ask for a price
 * without opening the page first. Two actions, never a link inside a link.
 */
export default function ModelCard({
  model,
  lang,
  eyebrow = "brand-format",
  priority = false,
  headingLevel = "h3",
}: {
  model: Model;
  lang: Lang;
  eyebrow?: "brand-format" | "format";
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const media = modelMedia(model);
  const da = lang === "da";
  const Heading = headingLevel;
  const quoteHref = localePath(`/tilbud?model=${encodeURIComponent(model.name)}`, lang);

  return (
    <article className="plate plate-lift group relative flex h-full min-w-0 flex-col overflow-hidden">
      {media ? (
        <figure className="relative aspect-[4/3] overflow-hidden bg-paper-dim">
          <Image
            src={media.src}
            alt={media.alt[lang]}
            width={media.width}
            height={media.height}
            priority={priority}
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 80vw"
            className={`h-full w-full ${
              media.kind === "photo" ? "object-cover" : "object-contain"
            } transition-transform duration-300 motion-safe:group-hover:scale-[1.02]`}
          />
          <figcaption className="absolute left-3 top-3 rounded bg-ink-950/90 px-2 py-0.5 text-xs font-semibold leading-5 text-paper">
            {media.kind === "photo" ? (da ? "Modelfoto" : "Model photo") : "Illustration"}
          </figcaption>
        </figure>
      ) : (
        /* A laptop without a real photograph of that model shows none — the
           owner ruled out drawings of laptops. The empty well keeps the row
           even beside cards that have one, and says why it is empty. */
        <div className="flex aspect-[4/3] items-center justify-center bg-paper-dim px-6 text-center">
          <p className="text-sm font-medium text-ink-600">
            {da ? "Intet modelfoto endnu" : "No model photo yet"}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
          {eyebrow === "brand-format" ? `${model.brand} · ${model.format[lang]}` : model.format[lang]}
        </p>
        <Heading className="mt-2 font-display text-lg font-bold leading-snug text-paper">
          <Link
            href={localePath(`/modeller/${model.slug}`, lang)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-300"
          >
            {model.name}
          </Link>
        </Heading>
        <p className="mt-2 text-sm leading-6 text-paper/75">{model.tagline[lang]}</p>
        <SpecChips model={model} lang={lang} />
        <span className="flex-1" />
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-300"
          >
            {da ? "Specifikationer" : "Specifications"}
            <span>&rarr;</span>
          </span>
          <Link
            href={quoteHref}
            aria-label={da ? `Få pris på ${model.name}` : `Get a price for ${model.name}`}
            className={`${buttonClass("primary")} relative z-10 whitespace-nowrap !px-4`}
          >
            {da ? "Få pris" : "Get a price"}
          </Link>
        </div>
      </div>
    </article>
  );
}

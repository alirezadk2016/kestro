import Image from "next/image";
import Link from "next/link";
import { localePath, type Lang, type Localized } from "@/lib/i18n";
import { cardSpecs, type Model, type ModelGroup } from "@/lib/models";
import { modelMedia } from "@/lib/model-media";
import Logo from "./Logo";
import { buttonClass } from "./Button";

/*
 * A category's models as a list a buyer can compare down the page: a small
 * picture, the name, what it is for, and the same two or three figures in
 * the same column on every row, with "Få pris" at the end.
 *
 * The category pages used the catalogue's card grid. Nine cards of 600px
 * each put the figures a buyer compares — processor, memory, storage — in a
 * different place on every card and three rows apart; and with six laptops
 * still waiting for a real photograph, most of the screen was empty frames.
 * /modeller keeps the cards; here the list does the comparing.
 *
 * Every row is one link to the model (the name stretches over the row) and
 * one separate "Få pris" link above it. Below lg the row stacks: picture and
 * name, then the figures with their labels, then the action.
 */

const LABELS: Record<"computer" | "screen", Localized[]> = {
  computer: [
    { da: "Processor", en: "Processor" },
    { da: "Hukommelse", en: "Memory" },
    { da: "Lagring", en: "Storage" },
  ],
  screen: [
    { da: "Panel", en: "Panel" },
    { da: "Opløsning", en: "Resolution" },
  ],
};

const kind = (group: ModelGroup) =>
  group === "skaerme" ? "screen" : group === "docking" ? null : "computer";

/* Written out in full so Tailwind sees every class it has to generate. The
   action column is a fixed 7rem on every row and on the header, so the
   figures line up under their labels whatever the button says. */
const ROW: Record<number, string> = {
  0: "lg:grid-cols-[minmax(0,1fr)_7rem]",
  2: "lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_7rem]",
  3: "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_7rem]",
};
const SPECS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function Thumb({ model, lang }: { model: Model; lang: Lang }) {
  const media = modelMedia(model);
  const frame = "relative aspect-[4/3] w-20 flex-none overflow-hidden rounded-lg sm:w-24";
  if (!media) {
    return (
      <span
        aria-hidden="true"
        className={`${frame} flex items-center justify-center border border-white/[0.06] bg-ink-950/70`}
      >
        <Logo tone="light" className="h-5 w-auto opacity-[0.16]" />
      </span>
    );
  }
  const cover = media.kind === "photo" && media.width / media.height <= 1.42;
  return (
    <span className={`${frame} bg-paper-dim outline outline-1 -outline-offset-1 outline-white/10`}>
      <Image
        src={media.src}
        alt={media.alt[lang]}
        width={media.width}
        height={media.height}
        sizes="96px"
        className={`h-full w-full ${cover ? "object-cover" : "object-contain"}`}
      />
    </span>
  );
}

export default function ModelList({ models, lang }: { models: Model[]; lang: Lang }) {
  const da = lang === "da";
  const first = models[0] ? kind(models[0].group) : null;
  const labels = first ? LABELS[first] : [];
  const columns = labels.length;

  return (
    <div className="mt-8">
      {columns > 0 && (
        <div
          aria-hidden="true"
          className={`hidden gap-6 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-paper/65 lg:grid ${ROW[columns]}`}
        >
          <span>{da ? "Model" : "Model"}</span>
          <span className={`grid gap-4 ${SPECS[columns]}`}>
            {labels.map((label) => (
              <span key={label.da}>{label[lang]}</span>
            ))}
          </span>
          <span />
        </div>
      )}

      <ul className="grid gap-3">
        {models.map((model) => {
          const specs = kind(model.group) ? cardSpecs(model, lang).slice(0, columns) : [];
          const rowLabels = kind(model.group) ? LABELS[kind(model.group)!] : [];
          return (
            <li key={model.slug} className="min-w-0">
              <article
                className={`plate plate-lift group relative grid gap-4 p-4 sm:p-5 lg:items-center lg:gap-6 ${ROW[specs.length > 0 ? columns : 0]}`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <Thumb model={model} lang={lang} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                      {model.brand} · {model.format[lang]}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold leading-snug text-paper sm:text-lg">
                      <Link
                        href={localePath(`/modeller/${model.slug}`, lang)}
                        className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-300"
                      >
                        {model.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-paper/75">{model.tagline[lang]}</p>
                  </div>
                </div>

                {specs.length > 0 && (
                  <dl className={`grid gap-4 border-t border-white/10 pt-4 lg:border-0 lg:pt-0 ${SPECS[specs.length]}`}>
                    {specs.map((spec, i) => (
                      <div key={spec} className="min-w-0">
                        <dt className="text-xs text-paper/65 lg:sr-only">{rowLabels[i]?.[lang]}</dt>
                        <dd className="mt-0.5 text-sm font-medium leading-5 text-paper/85 lg:mt-0">{spec}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <Link
                  href={localePath(`/tilbud?model=${encodeURIComponent(model.name)}`, lang)}
                  aria-label={da ? `Få pris på ${model.name}` : `Get a price for ${model.name}`}
                  className={`${buttonClass("primary")} relative z-10 justify-self-start whitespace-nowrap !px-4 lg:justify-self-end`}
                >
                  {da ? "Få pris" : "Get a price"}
                </Link>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-sm leading-6 text-paper/65">
        {da
          ? "Billederne er modelfotos eller illustrationer af formatet – ikke den maskine, I får."
          : "The pictures are model photos or illustrations of the format — not the machine you get."}
      </p>
    </div>
  );
}

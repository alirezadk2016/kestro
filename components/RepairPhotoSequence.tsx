import Image from "next/image";
import { useId } from "react";
import type { Lang } from "@/lib/i18n";
import styles from "./RepairPhotoSequence.module.css";

const stages = [
  {
    value: "cover",
    src: "/images/repairs/ram-01-cover.webp",
    label: { da: "Dæksel", en: "Cover" },
    caption: {
      da: "Bunddækslet er stadig på plads.",
      en: "The bottom cover is still in place.",
    },
    alt: {
      da: "Nærbillede af en bærbars underside med bunddækslet monteret på en mørk arbejdsflade.",
      en: "Close view of a laptop underside with its bottom cover fitted, on a dark work surface.",
    },
  },
  {
    value: "open",
    src: "/images/repairs/ram-02-open.webp",
    label: { da: "Adgang", en: "Open" },
    caption: {
      da: "Dækslet er taget af. Det gamle RAM-modul sidder stadig i soklen.",
      en: "The cover is off. The old memory module is still in its socket.",
    },
    alt: {
      da: "Åbent RAM-rum i en bærbar computer, hvor det gamle RAM-modul stadig sidder i soklen.",
      en: "An open laptop memory compartment with the old memory module still in its socket.",
    },
  },
  {
    value: "removed",
    src: "/images/repairs/ram-03-removed.webp",
    label: { da: "RAM ud", en: "Remove" },
    caption: {
      da: "Det gamle RAM-modul er taget ud.",
      en: "The old memory module has been removed.",
    },
    alt: {
      da: "Det gamle RAM-modul ligger ved siden af den åbne bærbare computer, og RAM-soklen er tom.",
      en: "The old memory module rests beside the open laptop, leaving its memory socket empty.",
    },
  },
  {
    value: "installed",
    src: "/images/repairs/ram-04-installed.webp",
    label: { da: "Ny RAM", en: "Fit" },
    caption: {
      da: "Det nye RAM-modul er sat i soklen.",
      en: "The replacement memory module is seated in its socket.",
    },
    alt: {
      da: "Et nyt RAM-modul sidder i soklen i den åbne bærbare computer.",
      en: "A replacement memory module fitted in the socket of the open laptop.",
    },
  },
] as const;

/** Native radios keep every photo stage available on phones and without JavaScript. */
export default function RepairPhotoSequence({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  const id = useId();
  const disclosureId = `${id}-disclosure`;

  return (
    <figure className={`${styles.figure} ${className}`} data-repair-sequence>
      <fieldset className={styles.sequence} aria-describedby={disclosureId}>
        <legend className={styles.legend}>
          {lang === "da" ? "En RAM-opgradering" : "A memory upgrade"}
        </legend>

        <div className={styles.frame} data-repair-frame>
          {stages.map((stage) => (
            <div
              key={stage.value}
              id={`${id}-photo-${stage.value}`}
              className={styles.panel}
              data-repair-panel={stage.value}
            >
              <Image
                src={stage.src}
                alt={stage.alt[lang]}
                width={1200}
                height={900}
                sizes="(min-width: 1536px) 49vw, (min-width: 1280px) 686px, (min-width: 1024px) 54vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                priority={stage.value === "open"}
                loading={stage.value === "open" ? "eager" : "lazy"}
                className={styles.photo}
              />
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          {stages.map((stage, index) => (
            <div key={stage.value} className={styles.control}>
              <input
                id={`${id}-choice-${stage.value}`}
                className={styles.choice}
                type="radio"
                name={`${id}-repair-stage`}
                value={stage.value}
                defaultChecked={stage.value === "open"}
                aria-controls={`${id}-photo-${stage.value}`}
                aria-describedby={`${id}-caption-${stage.value}`}
              />
              <label className={styles.controlLabel} htmlFor={`${id}-choice-${stage.value}`}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <span>{stage.label[lang]}</span>
              </label>
            </div>
          ))}
        </div>

        <div className={styles.captions}>
          {stages.map((stage) => (
            <p
              key={stage.value}
              id={`${id}-caption-${stage.value}`}
              className={styles.caption}
              data-repair-caption={stage.value}
            >
              {stage.caption[lang]}
            </p>
          ))}
        </div>
      </fieldset>

      <figcaption id={disclosureId} className={styles.disclosure} data-repair-disclosure>
        {lang === "da"
          ? "AI-genereret illustration. Opbygningen varierer efter model."
          : "AI-generated illustration. Layout varies by model."}
      </figcaption>
    </figure>
  );
}

import Image from "next/image";
import { useId, type ReactNode } from "react";
import Container from "./Container";
import type { Lang } from "@/lib/i18n";
import styles from "./RepairPhotoSequence.module.css";

const stages = [
  {
    value: "cover",
    src: "/images/repairs/workbench-cover.webp",
    label: { da: "Lukket", en: "Closed" },
    caption: {
      da: "Bunddækslet sidder på den lukkede computer.",
      en: "The bottom cover is fitted to the closed laptop.",
    },
    alt: {
      da: "En hel bærbar computer ligger med bunddækslet opad på en mørk arbejdsflade.",
      en: "A complete closed laptop rests underside-up on a dark work surface.",
    },
  },
  {
    value: "open",
    src: "/images/repairs/workbench-open.webp",
    label: { da: "Åbnet", en: "Opened" },
    caption: {
      da: "Dækslet er taget af, og det gamle RAM-modul sidder i soklen.",
      en: "The cover is off, with the original memory module still in its socket.",
    },
    alt: {
      da: "En hel bærbar med åbnet underside og det gamle grønne RAM-modul monteret; dækslet ligger bagved.",
      en: "A complete laptop with its underside open and original green memory installed; the cover rests behind it.",
    },
  },
  {
    value: "removed",
    src: "/images/repairs/workbench-removed.webp",
    label: { da: "Udtaget", en: "Removed" },
    caption: {
      da: "RAM-modulet er taget ud og lagt ved siden af computeren.",
      en: "The original memory has been removed and placed beside the laptop.",
    },
    alt: {
      da: "Den åbne bærbare har en tom RAM-sokkel, og det gamle grønne modul ligger på underlaget ved siden af.",
      en: "The open laptop has an empty memory socket, with the original green module resting on the mat beside it.",
    },
  },
  {
    value: "installed",
    src: "/images/repairs/workbench-installed.webp",
    label: { da: "Monteret", en: "Fitted" },
    caption: {
      da: "Det nye RAM-modul er monteret. Det gamle ligger på underlaget.",
      en: "The replacement is fitted, with the original module still on the mat.",
    },
    alt: {
      da: "Et nyt sort RAM-modul sidder i den åbne bærbare, og det gamle grønne modul ligger ved siden af.",
      en: "A black replacement memory module is fitted in the open laptop, while the old green module rests beside it.",
    },
  },
] as const;

/** One composed workbench scene with native controls and no 3D renderer. */
export default function RepairPhotoSequence({
  lang,
  children,
  className = "",
}: {
  lang: Lang;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const disclosureId = `${id}-disclosure`;
  return (
    <section className={`${styles.hero} ${className}`}>
      <Container className={styles.copyContainer}>
        <div className={styles.copy}>{children}</div>
      </Container>
      <figure className={styles.figure} data-repair-sequence>
        <fieldset className={styles.sequence} aria-describedby={disclosureId}>
          <legend className="sr-only">
            {lang === "da" ? "En RAM-opgradering, trin for trin" : "A memory upgrade, step by step"}
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
                  width={1983}
                  height={793}
                  sizes="(min-width: 1536px) 1500px, (min-width: 1024px) 98vw, (min-width: 768px) 1200px, 167vw"
                  priority={stage.value === "open"}
                  loading="eager"
                  fetchPriority={stage.value === "open" ? "high" : "low"}
                  className={styles.photo}
                />
              </div>
            ))}
          </div>
          <div className={styles.band}>
            <Container className={styles.bandLayout}>
              <div className={styles.summary}>
                <p className={styles.title}>
                  {lang === "da" ? "En RAM-opgradering" : "A memory upgrade"}
                </p>
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
                      <span className={styles.preview} aria-hidden="true">
                        <Image
                          src={stage.src}
                          alt=""
                          width={150}
                          height={100}
                          sizes="240px"
                          className={styles.thumbnail}
                        />
                      </span>
                      <span className={styles.labelCopy}>
                        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                        <span>{stage.label[lang]}</span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <p id={disclosureId} className={styles.disclosure} data-repair-disclosure>
                {lang === "da"
                  ? "AI-genereret illustration. Opbygningen varierer efter model."
                  : "AI-generated illustration. Layout varies by model."}
              </p>
            </Container>
          </div>
        </fieldset>
      </figure>
    </section>
  );
}

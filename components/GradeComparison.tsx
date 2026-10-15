"use client";

import Image from "next/image";
import { Sparkles, ScanLine, ScanEye, ZoomIn, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Grade = { grade: string; label: string; description: string; suits: string };
const icons = [Sparkles, ScanLine, ScanEye];
const images = ["/graphics/grade-a.webp", "/graphics/grade-b.webp", "/graphics/grade-c.webp"];

export default function GradeComparison({
  lang,
  grades,
  suitsLabel,
}: {
  lang: Lang;
  grades: Grade[];
  suitsLabel: string;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const oldOverflow = useRef("");
  const [zoom, setZoom] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const label = lang === "da" ? "Sammenlign kosmetisk stand" : "Compare cosmetic condition";
  const note =
    lang === "da"
      ? "Illustrative eksempler, ikke lagerfotos. Bed om billeder af den konkrete enhed."
      : "Illustrative examples, not photos of available stock. Ask for photos of the actual unit.";
  const alt = (grade: Grade) =>
    lang === "da"
      ? `Illustration af et lukket laptoplåg: ${grade.label.toLowerCase()}`
      : `Illustrative closed laptop lid: ${grade.label.toLowerCase()}`;
  const closeLabel = lang === "da" ? "Luk billede" : "Close image";
  function close() {
    document.body.style.overflow = oldOverflow.current;
    trigger.current?.focus();
  }
  useEffect(() => {
    const modal = dialog.current;
    setEnhanced(true);
    return () => {
      if (modal?.open) document.body.style.overflow = oldOverflow.current;
    };
  }, []);

  return (
    <div className="grade-comparison">
      <fieldset className="grade-selector">
        <legend className="sr-only">{label}</legend>
        {grades.map((grade, index) => {
          const Icon = icons[index];
          return (
            <label key={grade.grade} className={`grade-choice grade-choice-${index}`}>
              <input
                type="radio"
                name={id}
                value={index}
                defaultChecked={index === 0}
                aria-label={`${grade.grade}: ${grade.label}`}
              />
              <span className="grade-choice-face">
                <span className="grade-letter" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>
                  <strong>{grade.grade}</strong>
                  <span className="grade-choice-label">{grade.label}</span>
                </span>
                <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="grade-panels">
        {grades.map((grade, index) => (
          <section
            key={grade.grade}
            className="grade-panel"
            data-grade={index}
            aria-labelledby={`${id}-grade-${index}`}
          >
            <div className="grade-photo">
              <Image
                src={images[index]}
                width={720}
                height={720}
                sizes="(min-width:1024px) 45vw, 100vw"
                alt={alt(grade)}
              />
              {enhanced && (
                <button
                  type="button"
                  className="grade-zoom"
                  title={lang === "da" ? "Forstør billede" : "Enlarge image"}
                  aria-label={`${lang === "da" ? "Forstør" : "Enlarge"} ${grade.grade}`}
                  onClick={(event) => {
                    trigger.current = event.currentTarget;
                    oldOverflow.current = document.body.style.overflow;
                    setZoom(index);
                    dialog.current?.showModal();
                    document.body.style.overflow = "hidden";
                  }}
                >
                  <ZoomIn size={20} aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="grade-description">
              <h3
                id={`${id}-grade-${index}`}
                className="font-display text-2xl font-semibold text-paper"
              >
                {grade.grade}
              </h3>
              <p className="mt-2 text-sm font-semibold text-brand-300">{grade.label}</p>
              <p className="mt-5 text-base leading-[1.75] text-paper/85">{grade.description}</p>
              <div className="grade-suits">
                <ScanEye size={20} strokeWidth={1.6} aria-hidden="true" />
                <p className="text-sm leading-[1.7] text-paper/75">
                  <strong className="text-paper">{suitsLabel}</strong> {grade.suits}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
      <p className="grade-image-note text-sm leading-[1.6] text-paper/75">{note}</p>
      <dialog
        ref={dialog}
        className="grade-lightbox"
        aria-label={label}
        onClose={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          type="button"
          className="grade-lightbox-close"
          aria-label={closeLabel}
          title={closeLabel}
          onClick={() => dialog.current?.close()}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <Image src={images[zoom]} width={720} height={720} alt={alt(grades[zoom])} />
        <p className="mt-3 text-sm leading-[1.6] text-paper/85">
          {grades[zoom].grade}: {grades[zoom].label}
        </p>
      </dialog>
    </div>
  );
}

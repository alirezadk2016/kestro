"use client";

import { Sparkles, ScanLine, ScanEye } from "lucide-react";
import { useId } from "react";
import type { Lang } from "@/lib/i18n";

type Grade = { grade: string; label: string; description: string; suits: string };
const icons = [Sparkles, ScanLine, ScanEye];

/*
 * The three grades, chosen with native radios and shown one at a time by CSS,
 * so it works without script.
 *
 * Each grade had a picture: the same closed laptop lid three times with
 * more wear on each. They were AI-generated, and a picture of wear that no
 * machine has is the one place a grade must not be illustrated by invention.
 * They went on 28 November 2026; what each grade means is in the words, and
 * the photograph that counts is the one of the individual unit, which the
 * text tells the buyer to ask for.
 */
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
  const label = lang === "da" ? "Sammenlign kosmetisk stand" : "Compare cosmetic condition";

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
      <div className="grade-panels plate">
        {grades.map((grade, index) => (
          <section
            key={grade.grade}
            className="grade-panel"
            data-grade={index}
            aria-labelledby={`${id}-grade-${index}`}
          >
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
    </div>
  );
}

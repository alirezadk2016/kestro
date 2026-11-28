import Link from "next/link";

import Container from "@/components/Container";
import { localePath, type Lang } from "@/lib/i18n";
import { getPracticalGuide, type PracticalGuide } from "@/lib/practical-guides";
import styles from "./practical.module.css";

/*
 * The eight guides as two rows of four (27 November 2026).
 *
 * The first four had AI-generated photographs of components, and they went:
 * a picture on this site is a real one or none. Without them the directory of
 * one large picture and three thumbnails had nothing to arrange, so both rows
 * are text panels now: checks first, led by the one to start with, then faults
 * and setup.
 */
const ROWS: { id: "check" | "faults"; slugs: string[] }[] = [
  {
    id: "check",
    slugs: ["langsom-computer", "tjek-batterikapacitet", "tjek-ram-forbrug", "hdd-eller-ssd"],
  },
  {
    id: "faults",
    slugs: [
      "baerbar-larmer-eller-bliver-varm",
      "overfoer-filer-til-ny-pc",
      "computer-gaar-ned",
      "dansk-tastatur-paa-importeret-computer",
    ],
  },
];
const FEATURED = "langsom-computer";

export default function PracticalGuides({ lang }: { lang: Lang }) {
  const c =
    lang === "da"
      ? {
          label: "Praktisk hjælp",
          title: "Praktiske guides",
          intro:
            "Det, du selv kan tjekke og ordne i Windows: batteriet, RAM, drevet, en langsom eller varm maskine, nedbrud, filer til en ny pc og dansk tastatur.",
          check: "Tjek din computer",
          faults: "Fejl og opsætning",
          feature: "Start her, hvis du er i tvivl",
        }
      : {
          label: "Practical help",
          title: "Practical guides",
          intro:
            "What you can check and fix yourself in Windows: the battery, the RAM, the drive, a slow or hot machine, crashes, files for a new PC and a Danish keyboard.",
          check: "Check your computer",
          faults: "Faults and setup",
          feature: "Start here if you are unsure",
        };

  return (
    <section id="praktiske-guides" aria-labelledby="practical-title" className={styles.hub}>
      <Container>
        <div className={styles.sectionHeading}>
          <div>
            <p className="eyebrow text-brand-700">{c.label}</p>
            <h2
              id="practical-title"
              className="mt-3 font-display t-h2 font-extrabold tracking-display text-ink-900"
            >
              {c.title}
            </h2>
          </div>
          <p className="text-base leading-7 text-ink-600">{c.intro}</p>
        </div>
        {ROWS.map((row, index) => (
          <div key={row.id}>
            <h3
              className={`${index ? "mt-10" : ""} font-display t-h3 font-bold tracking-tight text-ink-900`}
            >
              {c[row.id]}
            </h3>
            <ul className={styles.moreList}>
              {row.slugs
                .map((slug) => getPracticalGuide(slug) as PracticalGuide)
                .map((guide) => {
                  const featured = guide.slug === FEATURED;
                  return (
                    <li key={guide.slug}>
                      <Link
                        href={localePath(`/vejledninger/${guide.slug}`, lang)}
                        className={`${styles.quickGuide} ${styles.quickGuideText} ${featured ? styles.quickGuideFeatured : ""}`}
                      >
                        <div className={styles.quickCopy}>
                          {featured && <p className={styles.kicker}>{c.feature}</p>}
                          <h4 className="font-display text-base font-bold leading-snug sm:text-lg">
                            {guide.title[lang]}
                          </h4>
                          <p>{guide.summary[lang]}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </Container>
    </section>
  );
}

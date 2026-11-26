import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";
import { localePath, type Lang } from "@/lib/i18n";
import { practicalGuides } from "@/lib/practical-guides";
import styles from "./practical.module.css";

export default function PracticalGuides({ lang }: { lang: Lang }) {
  const featured = practicalGuides.find((guide) => guide.slug === "langsom-computer")!;
  /* The four with a picture keep the directory they were drawn for; the four
     without one (26 November 2026) are a row of their own below it. */
  const rest = practicalGuides.filter((guide) => guide !== featured && guide.image);
  const more = practicalGuides.filter((guide) => !guide.image);
  const c =
    lang === "da"
      ? {
          label: "Praktisk hjælp",
          title: "Praktiske guides",
          intro:
            "Det, du selv kan tjekke og ordne i Windows: batteriet, RAM, drevet, en langsom eller varm maskine, nedbrud, filer til en ny pc og dansk tastatur.",
          more: "Fejl og opsætning",
          open: "Åbn guiden",
          feature: "Start her, hvis du er i tvivl",
          photo: "Billederne er AI-genererede illustrationer.",
        }
      : {
          label: "Practical help",
          title: "Practical guides",
          intro:
            "What you can check and fix yourself in Windows: the battery, the RAM, the drive, a slow or hot machine, crashes, files for a new PC and a Danish keyboard.",
          more: "Faults and setup",
          open: "Open the guide",
          feature: "Start here if you are unsure",
          photo: "The pictures are AI-generated illustrations.",
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
        <div className={styles.directory}>
          <Link
            href={localePath(`/vejledninger/${featured.slug}`, lang)}
            className={styles.feature}
          >
            <div className={styles.featureCopy}>
              <p className={styles.kicker}>{c.feature}</p>
              <h3 className="font-display t-h3 font-bold tracking-tight">{featured.title[lang]}</h3>
              <p className={styles.featureSummary}>{featured.summary[lang]}</p>
              <span className={styles.featureAction}>{c.open}</span>
            </div>
            <div className={styles.featurePhoto}>
              <Image
                src={featured.image!}
                alt={featured.imageAlt![lang]}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 100vw"
              />
            </div>
          </Link>
          <ul className={styles.quickList}>
            {rest.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={localePath(`/vejledninger/${guide.slug}`, lang)}
                  className={styles.quickGuide}
                >
                  <Image
                    src={guide.image!}
                    alt=""
                    width={1200}
                    height={900}
                    sizes="112px"
                    className={styles.thumbnail}
                  />
                  <div className={styles.quickCopy}>
                    <h3 className="font-display text-base font-bold leading-snug sm:text-lg">
                      {guide.title[lang]}
                    </h3>
                    <p>{guide.summary[lang]}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <h3 className="mt-10 font-display t-h3 font-bold tracking-tight text-ink-900">{c.more}</h3>
        <ul className={styles.moreList}>
          {more.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={localePath(`/vejledninger/${guide.slug}`, lang)}
                className={`${styles.quickGuide} ${styles.quickGuideText}`}
              >
                <div className={styles.quickCopy}>
                  <h4 className="font-display text-base font-bold leading-snug sm:text-lg">
                    {guide.title[lang]}
                  </h4>
                  <p>{guide.summary[lang]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-5 text-ink-600">{c.photo}</p>
      </Container>
    </section>
  );
}

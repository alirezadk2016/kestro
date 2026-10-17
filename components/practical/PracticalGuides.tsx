import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { localePath, type Lang } from "@/lib/i18n";
import { practicalGuides } from "@/lib/practical-guides";
import styles from "./practical.module.css";

export default function PracticalGuides({ lang }: { lang: Lang }) {
  const featured = practicalGuides.find((guide) => guide.slug === "langsom-computer")!;
  const rest = practicalGuides.filter((guide) => guide !== featured);
  const c =
    lang === "da"
      ? {
          label: "Kestro · Praktisk hjælp",
          title: "Praktiske guides",
          intro: "Et spørgsmål. En guide. Et konkret næste skridt.",
          open: "Åbn guiden",
          feature: "Start her, hvis du er i tvivl",
          photo: "AI-genererede emnebilleder. Trinene viser, hvad du skal gøre i Windows.",
        }
      : {
          label: "Kestro · Practical help",
          title: "Practical guides",
          intro: "One question. One guide. A clear next step.",
          open: "Open the guide",
          feature: "Start here if you are unsure",
          photo: "AI-generated topic images. The steps explain what to do in Windows.",
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
              <span className={styles.featureAction}>
                {c.open}
                <ArrowRight size={20} aria-hidden="true" />
              </span>
            </div>
            <div className={styles.featurePhoto}>
              <Image
                src={featured.image}
                alt={featured.imageAlt[lang]}
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
                    src={guide.image}
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
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-5 text-xs leading-5 text-ink-600">{c.photo}</p>
      </Container>
    </section>
  );
}

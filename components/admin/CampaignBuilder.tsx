"use client";

import { useRef, useState } from "react";
import { buildCampaignLink, campaignPresets, type CampaignLinkInput } from "@/lib/campaign-links";
import styles from "@/components/admin/growth.module.css";

const initial: CampaignLinkInput = {
  destination: "https://www.kestro.dk/vejledninger",
  source: "instagram",
  medium: "social",
  campaign: "",
  content: "bio",
  term: "",
};

export default function CampaignBuilder({ modelPaths = [] }: { modelPaths?: string[] }) {
  const [values, setValues] = useState<CampaignLinkInput>(initial);
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState(false);
  const output = useRef<HTMLTextAreaElement>(null);
  const result = buildCampaignLink(values, modelPaths);
  const activePreset = campaignPresets.find(
    (preset) =>
      preset.source === values.source &&
      preset.medium === values.medium &&
      preset.content === values.content &&
      preset.term === values.term,
  );

  function change(key: keyof CampaignLinkInput, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setStatus("");
    setManual(false);
  }

  async function copy() {
    if (!result.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setStatus("Linket er kopieret. Brug det på den valgte placering.");
      setManual(false);
    } catch {
      setManual(true);
      setStatus("Automatisk kopiering er blokeret. Markér og kopiér linket i feltet.");
      output.current?.focus();
      output.current?.select();
    }
  }

  return (
    <div className={styles.builder}>
      <div>
        <p className={styles.label}>Start med en placering</p>
        <div className={styles.presetList} role="group" aria-label="Kampagneskabeloner">
          {campaignPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={activePreset?.id === preset.id}
              className={styles.preset}
              onClick={() => {
                setValues((current) => ({
                  ...current,
                  source: preset.source,
                  medium: preset.medium,
                  content: preset.content,
                  term: preset.term,
                }));
                setStatus("");
                setManual(false);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <form
          className={`${styles.builderFields} mt-6`}
          onSubmit={(event) => {
            event.preventDefault();
            void copy();
          }}
        >
          <div className={`${styles.field} ${styles.builderFull}`}>
            <label htmlFor="campaign-destination">Destinationsside</label>
            <input
              id="campaign-destination"
              name="destination"
              type="text"
              inputMode="url"
              maxLength={600}
              value={values.destination}
              onChange={(event) => change("destination", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="destination-note"
            />
            <p id="destination-note" className={styles.status}>
              En offentlig side på kestro.dk. Gamle URL-parametre erstattes.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="campaign-source">Kilde</label>
            <input
              id="campaign-source"
              name="source"
              maxLength={40}
              value={values.source}
              onChange={(event) => change("source", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="campaign-medium">Medie</label>
            <input
              id="campaign-medium"
              name="medium"
              maxLength={40}
              value={values.medium}
              onChange={(event) => change("medium", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="campaign-name">Kampagnenavn</label>
            <input
              id="campaign-name"
              name="campaign"
              maxLength={80}
              placeholder="fx ram-guide-oktober"
              value={values.campaign}
              onChange={(event) => change("campaign", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="campaign-content">Placering / variant</label>
            <input
              id="campaign-content"
              name="content"
              maxLength={80}
              value={values.content}
              onChange={(event) => change("content", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={`${styles.field} ${styles.builderFull}`}>
            <label htmlFor="campaign-term">Betalt søgeord (valgfrit)</label>
            <input
              id="campaign-term"
              name="term"
              maxLength={80}
              value={values.term}
              onChange={(event) => change("term", event.target.value)}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="term-note"
            />
            <p id="term-note" className={styles.status}>
              Kun dit kampagnemærke. Det afslører ikke, hvad en person søgte efter på Google.
            </p>
          </div>
          <button type="submit" className="sr-only" tabIndex={-1}>
            Kopiér kampagnelink
          </button>
        </form>
      </div>
      <section className={styles.builderOutput} aria-labelledby="campaign-output-title">
        <h3 id="campaign-output-title" className={styles.sectionHeading}>
          Dit færdige link
        </h3>
        <p className={styles.sectionCopy}>
          Del dette link på den placering, du har mærket. Besøgene kan derefter findes under Trafik.
        </p>
        <label htmlFor="campaign-output" className="sr-only">
          Færdigt kampagnelink
        </label>
        <textarea
          id="campaign-output"
          ref={output}
          readOnly
          value={result.url}
          placeholder="Udfyld kampagnenavnet for at danne linket."
          className={`${styles.input} ${styles.outputUrl}`}
          spellCheck={false}
          aria-describedby="campaign-validation"
          onFocus={(event) => {
            if (manual) event.currentTarget.select();
          }}
        />
        <p id="campaign-validation" className={result.error ? styles.error : styles.status}>
          {result.error ?? "Klar til at dele. Linket indeholder kun dine valgte kampagnemærker."}
        </p>
        <div className={styles.outputActions}>
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!result.url}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Kopiér link
          </button>
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Åbn link ↗
            </a>
          )}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className={`${styles.status} mt-4`}>
          {status}
        </p>
        <p className={`${styles.note} mt-6`}>
          Placeringer som bio, story og reel er dine egne mærker. De beviser ikke, at besøget kom
          fra Instagram Explore. Brug ikke navne, e-mails eller andre kundedata i mærkerne.
        </p>
      </section>
    </div>
  );
}

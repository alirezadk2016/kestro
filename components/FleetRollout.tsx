import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  Boxes,
  SlidersHorizontal,
  Truck,
  RefreshCw,
} from "lucide-react";
import Container from "./Container";
import FleetJourneyVisual from "./FleetJourneyVisual";
import { localePath, type Lang, type Localized } from "@/lib/i18n";

type Phase = { when: Localized; body: Localized; link?: { href: string; label: Localized } };
const icons = [ClipboardList, Boxes, SlidersHorizontal, Truck, RefreshCw];

export default function FleetRollout({
  lang,
  title,
  lead,
  phases,
}: {
  lang: Lang;
  title: string;
  lead: string;
  phases: Phase[];
}) {
  return (
    <section className="fleet-rollout" data-fleet-journey aria-labelledby="fleet-rollout-title">
      <Container>
        <div className="fleet-rollout-heading">
          <h2 id="fleet-rollout-title" className="font-display t-h2 font-extrabold text-paper">
            {title}
          </h2>
          <p className="text-base leading-[1.75] text-paper/75">{lead}</p>
        </div>
        <div className="fleet-rollout-body">
          <FleetJourneyVisual lang={lang} stages={phases.map((phase) => phase.when[lang])} />
          <ol className="fleet-rollout-steps">
            {phases.map((phase, index) => {
              const Icon = icons[index];
              return (
                <li key={phase.when.da} id={`fleet-phase-${index + 1}`} data-journey-step>
                  <div className="fleet-phase-marker" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon size={23} strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-paper">
                    {phase.when[lang]}
                  </h3>
                  <p className="mt-4 text-base leading-[1.75] text-paper/75">{phase.body[lang]}</p>
                  {phase.link && (
                    <Link href={localePath(phase.link.href, lang)} className="fleet-phase-link">
                      {phase.link.label[lang]}
                      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

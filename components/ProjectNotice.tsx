import Link from "next/link";
import { localePath, type Lang } from "@/lib/i18n";
import { project, projectNotice } from "@/lib/project";
import Container from "./Container";

export default function ProjectNotice({ lang }: { lang: Lang }) {
  if (!project.prelaunch) return null;
  const c = projectNotice[lang];
  return (
    <aside aria-label={c.label} className="relative z-20 border-b border-ink-200 bg-white py-3">
      <Container>
        <div className="flex flex-col gap-1 text-sm leading-6 lg:flex-row lg:items-center lg:gap-5">
          <p className="min-w-0 flex-1 text-ink-800">
            <strong className="font-semibold text-brand-800">{c.label}. </strong>
            {c.body}
          </p>
          <Link
            href={localePath("/handelsbetingelser", lang)}
            className="inline-flex min-h-11 flex-none items-center font-semibold text-brand-800 underline underline-offset-4 hover:text-ink-900"
          >
            {c.link}
          </Link>
        </div>
      </Container>
    </aside>
  );
}

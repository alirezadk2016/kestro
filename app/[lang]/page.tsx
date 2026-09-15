import Hero from "@/components/Hero";
import AnswerBlock from "@/components/AnswerBlock";
import CategoryCards from "@/components/CategoryCards";
import HighlightRow from "@/components/HighlightRow";
import Statement from "@/components/Statement";
import QualifySection from "@/components/QualifySection";
import Services from "@/components/Services";
import ExampleMachine from "@/components/ExampleMachine";
import TrustStrip from "@/components/TrustStrip";
import CtaSection from "@/components/CtaSection";
import type { Lang } from "@/lib/i18n";
import PageSchema from "@/components/PageSchema";

/*
 * The front page is the one route a junk first segment can still reach.
 *
 * middleware.ts passes a path through unrewritten when it ends in a real
 * asset extension, so a request for a stylesheet that does not exist —
 * /style.css — arrives at the router as a single segment and matches this
 * page with lang="style.css". Every deeper shape is either rewritten (and so
 * lands on the catch-all, which reads no language) or has a layout that
 * answers isLang with notFound() before anything touches copy[lang].
 *
 * Refusing the param here is what keeps that one case a 404 rather than the
 * 500 it used to be, and it costs nothing: this page has no dynamic params
 * beyond the two languages.
 */
export const dynamicParams = false;

export default async function Home(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;

  return (
    <>
      <PageSchema
        lang={lang}
        route="/"
        sources={["ewasteMonitor", "windows10Eol", "repairDirective"]}
      />

      <Hero lang={lang} />
      <AnswerBlock lang={lang} />
      <CategoryCards lang={lang} />
      <HighlightRow lang={lang} />
      <Statement lang={lang} />
      <QualifySection lang={lang} />
      <Services lang={lang} />
      <ExampleMachine lang={lang} />
      <TrustStrip lang={lang} />
      <CtaSection lang={lang} />
    </>
  );
}

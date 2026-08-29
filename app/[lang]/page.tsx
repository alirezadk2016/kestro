import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards";
import HighlightRow from "@/components/HighlightRow";
import Statement from "@/components/Statement";
import QualifySection from "@/components/QualifySection";
import Services from "@/components/Services";
import ExampleMachine from "@/components/ExampleMachine";
import TrustStrip from "@/components/TrustStrip";
import CtaSection from "@/components/CtaSection";
import type { Lang } from "@/lib/i18n";

export default function Home({ params }: { params: { lang: Lang } }) {
  const { lang } = params;

  return (
    <>
      <Hero lang={lang} />
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

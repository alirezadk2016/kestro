import Container from "@/components/Container";
import BatteryHealth from "@/components/BatteryHealth";
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
      {/* Directly under the hero, because the spec list in it states a battery
          percentage and this is what that percentage means. Anywhere further
          down and the claim and its explanation are on different screens. */}
      <section className="border-b border-white/10 py-14 sm:py-20">
        <Container>
          <BatteryHealth lang={lang} />
        </Container>
      </section>
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

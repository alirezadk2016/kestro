import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import QualifySection from "@/components/QualifySection";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import ExampleMachine from "@/components/ExampleMachine";
import CtaSection from "@/components/CtaSection";
import type { Lang } from "@/lib/i18n";

export default function Home({ params }: { params: { lang: Lang } }) {
  const { lang } = params;

  return (
    <>
      <Hero lang={lang} />
      <Statement lang={lang} />
      <QualifySection lang={lang} />
      <Services lang={lang} />
      <WhyUs lang={lang} />
      <ExampleMachine lang={lang} />
      <CtaSection lang={lang} />
    </>
  );
}

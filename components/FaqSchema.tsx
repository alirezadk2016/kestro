import { htmlLang, type Lang, type Localized } from "@/lib/i18n";

/*
 * A page's questions and answers, marked up.
 *
 * Five pages built this object by hand — the machine page, pricing, the quote
 * page, fleet solutions and every guide that carries FAQs — and each one also
 * repeated the `<` escape that keeps a value from closing the script tag
 * early. Five copies is five chances for one of them to drift from the copy
 * the page actually shows, and FAQ markup that is not on the page is the kind
 * of structured data that earns a manual action rather than a rich result.
 *
 * So it lives here, next to BreadcrumbSchema, which solved the same problem
 * for the trail. <Faq> renders it automatically from the array it is already
 * displaying. Pages that draw their questions some other way — /maskinen lays
 * its parts out as cards, not an accordion — pass the same shape in directly,
 * which keeps the one rule that matters: the markup is built from whatever the
 * page renders, never written out beside it.
 */
export type FaqEntry = { question: Localized; answer: Localized };

export default function FaqSchema({ lang, items }: { lang: Lang; items: FaqEntry[] }) {
  if (!items.length) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: htmlLang[lang],
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[lang],
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

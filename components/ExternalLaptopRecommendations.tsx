import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Container from "./Container";
import { buttonClass } from "./Button";
import { formatDate, type Lang } from "@/lib/i18n";
import { externalLaptops } from "@/lib/external-laptops";
import { sources } from "@/lib/sources";

const copy = {
  da: {
    heading: "Vores anbefalinger – køb hos andre",
    lead: "To modeller at starte med. Sammenlign konfigurationen, og se aktuel pris hos forhandleren.",
    photoNote:
      "Modelfotos – ikke forhandlerens konkrete varer. Tastatur og stand kan afvige fra billederne.",
    alternative: "En anden mulighed",
    credits: "Foto og licens",
    processed:
      "Begge fotos er skaleret og konverteret til WebP. Produktets udseende er ikke ændret. HP-fotoet i denne version deles under CC BY-SA 4.0.",
    notice:
      "De viste tilbud er ikke Kestros lager. Købet foregår hos forhandleren på dennes priser og vilkår.",
    seller: "Ekstern forhandler",
    checked: "Link og konfiguration tjekket",
    action: "Se pris og lager hos",
    newWindow: "åbner i en ny fane",
    future:
      "Vi planlægger et eget udvalg af erhvervsbærbare med fokus på konkurrencedygtige priser. Sortiment, pris og tidspunkt er endnu ikke fastlagt.",
  },
  en: {
    heading: "Our recommendations – buy elsewhere",
    lead: "Two models to start with. Compare the configuration, then check the retailer’s current price.",
    photoNote:
      "Model photos, not the retailer’s individual units. Keyboard layout and condition may differ from the pictures.",
    alternative: "Another option",
    credits: "Photo credits and licences",
    processed:
      "Both photos are resized and converted to WebP. The products’ appearance is unchanged. This version of the HP photo is shared under CC BY-SA 4.0.",
    notice:
      "These offers are not Kestro stock. Purchases are made with the retailer at their prices and on their terms.",
    seller: "External retailer",
    checked: "Link and configuration checked",
    action: "View price and stock at",
    newWindow: "opens in a new tab",
    future:
      "We plan to offer our own selection of business laptops at competitive prices. The range, prices and timing are not yet confirmed.",
  },
};

/** The retailer handles the purchase; there is deliberately no Kestro offer or cart. */
export default function ExternalLaptopRecommendations({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const featured = externalLaptops.filter((item) => item.photo);
  const alternatives = externalLaptops.filter((item) => !item.photo);
  const checkedDates = [...new Set(externalLaptops.map((item) => item.checkedOn))];
  const commonCheckedOn = checkedDates.length === 1 ? checkedDates[0] : null;
  return (
    <section
      id="external-laptop-recommendations"
      aria-labelledby="external-laptops-heading"
      className="border-y border-white/10 bg-ink-950 py-8 sm:py-12"
    >
      <Container>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
          <h2
            id="external-laptops-heading"
            className="t-h2 text-balance font-display font-extrabold text-paper lg:col-span-5"
          >
            {c.heading}
          </h2>
          <div className="lg:col-span-7">
            <p className="hidden text-base leading-[1.7] text-paper/85 sm:block">{c.lead}</p>
            <p className="mt-3 text-sm leading-6 text-paper/75">{c.notice}</p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-paper/75">{c.photoNote}</p>
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:gap-7">
          {featured.map((item) => (
            <li
              key={item.id}
              data-external-laptop={item.id}
              data-featured-laptop
              className="plate flex min-w-0 flex-col overflow-hidden"
            >
              {item.photo && (
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-900 outline outline-1 -outline-offset-1 outline-white/10 sm:aspect-[16/10]">
                  <Image
                    src={item.photo.src}
                    width={item.photo.width}
                    height={item.photo.height}
                    alt={item.photo.alt[lang]}
                    priority={item.id === "thinkpad-t14-g2"}
                    sizes="(min-width: 1536px) 42vw, (min-width: 768px) 46vw, 92vw"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-7">
                <p className="text-sm font-semibold text-brand-300">{item.useCase[lang]}</p>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-paper sm:text-2xl">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-paper/85">{item.configuration[lang]}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-paper/85">
                  {item.condition[lang]}
                </p>
                <p className="mt-2 text-sm leading-6 text-paper/75">{item.caveat[lang]}</p>

                <div className="mt-auto pt-6">
                  <p className="border-t border-white/10 pt-4 text-sm leading-6 text-paper/75">
                    {c.seller}: <span className="font-semibold text-paper">{item.seller}</span>
                    <span aria-hidden="true"> · </span>
                    {item.buyerLabel[lang]}
                  </p>
                  {!commonCheckedOn && (
                    <p className="mt-1 text-xs leading-5 text-paper/65">
                      {c.checked}{" "}
                      <time dateTime={item.checkedOn}>{formatDate(item.checkedOn, lang)}</time>
                    </p>
                  )}
                  <a
                    data-merchant-link
                    href={sources[item.source].url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`${c.action} ${item.seller}: ${item.name} (${c.newWindow})`}
                    className={`${buttonClass("secondary")} mt-4 w-full px-4 py-2 text-center`}
                  >
                    <span>
                      {c.action} {item.seller}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 flex-none"
                      strokeWidth={2}
                    />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {alternatives.map((item) => (
          <article
            key={item.id}
            data-external-laptop={item.id}
            className="plate mt-5 grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8"
          >
            <div>
              <p className="text-sm font-semibold text-brand-300">
                {c.alternative} · {item.useCase[lang]}
              </p>
              <h3 className="mt-2 text-lg font-bold text-paper">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-paper/85">{item.configuration[lang]}</p>
              <p className="mt-1 text-sm leading-6 text-paper/75">
                {item.condition[lang]} · {item.caveat[lang]}
              </p>
            </div>
            <div className="lg:w-72">
              <p className="mb-3 text-sm leading-6 text-paper/75">
                {c.seller}: <span className="font-semibold text-paper">{item.seller}</span> ·{" "}
                {item.buyerLabel[lang]}
              </p>
              {!commonCheckedOn && (
                <p className="mb-3 text-xs leading-5 text-paper/65">
                  {c.checked}{" "}
                  <time dateTime={item.checkedOn}>{formatDate(item.checkedOn, lang)}</time>
                </p>
              )}
              <a
                data-merchant-link
                href={sources[item.source].url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`${c.action} ${item.seller}: ${item.name} (${c.newWindow})`}
                className={`${buttonClass("secondary")} w-full px-4 py-2 text-center`}
              >
                <span>
                  {c.action} {item.seller}
                </span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" strokeWidth={2} />
              </a>
            </div>
          </article>
        ))}

        <div className="mt-6">
          {commonCheckedOn && (
            <p className="text-xs leading-5 text-paper/65">
              {c.checked}{" "}
              <time dateTime={commonCheckedOn}>{formatDate(commonCheckedOn, lang)}</time>
            </p>
          )}
          <details data-photo-credits className="group/credits mt-2 border-b border-white/10">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-paper/85 [&::-webkit-details-marker]:hidden">
              {c.credits}
              <ChevronDown
                aria-hidden="true"
                size={18}
                strokeWidth={2}
                className="flex-none transition-transform group-open/credits:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <ul className="grid gap-x-8 gap-y-2 pb-3 md:grid-cols-2">
              {featured.map(
                (item) =>
                  item.photo && (
                    <li key={item.id} className="text-sm leading-6 text-paper/75">
                      <span className="block font-semibold text-paper">{item.name}</span>
                      <div className="flex flex-wrap items-center gap-x-4">
                        <a
                          href={item.photo.source}
                          className="inline-flex min-h-11 items-center text-brand-300 underline underline-offset-4 hover:text-paper"
                        >
                          {item.photo.author} · Wikimedia Commons
                        </a>
                        <a
                          href={item.photo.licenceUrl}
                          rel="license"
                          className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper"
                        >
                          {item.photo.licence}
                        </a>
                      </div>
                    </li>
                  ),
              )}
            </ul>
            <p className="pb-5 text-sm leading-6 text-paper/75">{c.processed}</p>
          </details>
          <p className="mt-5 border-l-2 border-brand-400/50 pl-4 text-sm leading-6 text-paper/75">
            {c.future}
          </p>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import ConsentReset from "./ConsentReset";
import { company, postalAddress } from "@/lib/company";
import { buyNav, companyNav, productExtras, serviceNav, type NavLink } from "@/lib/nav";
import { categories } from "@/lib/categories";
import { localePath, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    blurb:
      "Kestro: refurbished erhvervs-IT til virksomheder i Danmark og Norge. Maskinerne skaffes hos leverandører i vores netværk og klargøres til det nordiske marked; tilbud, faktura og reklamation går gennem Kestro.",
    products: "Produkter",
    buy: "Sådan køber I",
    services: "Ydelser",
    company: "Virksomhed",
    delivers: "Leverer i",
    follow: "Følg Kestro på",
    pages: "Sider",
    rights: "Alle rettigheder forbeholdes.",
    cvrLabel: "CVR",
    trademarks:
      "Produktnavne og varemærker tilhører deres respektive ejere. Kestro er ikke tilknyttet Lenovo, HP, Dell, Apple, Microsoft eller andre nævnte producenter.",
  },
  en: {
    blurb:
      "Kestro: refurbished business IT for companies in Denmark and Norway. The machines are sourced from suppliers in our network and prepared for the Nordic market; the quote, the invoice and any complaint go through Kestro.",
    products: "Products",
    buy: "How to buy",
    services: "Services",
    company: "Company",
    delivers: "Delivers in",
    follow: "Follow Kestro on",
    pages: "Pages",
    rights: "All rights reserved.",
    cvrLabel: "CVR",
    trademarks:
      "Product names and trademarks belong to their respective owners. Kestro is not affiliated with Lenovo, HP, Dell, Apple, Microsoft or any other manufacturer named on this site.",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * The two brand marks, drawn here.
 *
 * lucide dropped its brand icons at v1, so there is nothing to import — and
 * pulling in a whole icon package for two glyphs would cost more than the
 * glyphs. These are the standard outline shapes at the same 24px grid and the
 * same stroke weight as every other icon on the site, so they sit with them
 * rather than beside them.
 */
function SocialGlyph({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="h-[18px] w-[18px]"
    >
      {name === "Instagram" ? (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
          <path d="M17.5 6.5h.01" />
        </>
      ) : (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </>
      )}
    </svg>
  );
}

/*
 * Mast-headed, not a sitemap.
 *
 * This was the footer every generated site ships: a blurb in one column, two
 * columns of stacked links (one eleven deep) and a copyright line — Hallmark's
 * "AI footer", and on the front page a tall column of links beside a half-empty
 * row. Every link is still here, because the internal linking depends on them,
 * but they now run as two wrapped rows under a wordmark that closes the page,
 * and the legal details sit on one band at the bottom.
 *
 * The page above already ends on a large call to action (CtaSection), so the
 * footer does not repeat one: the wordmark and a line about the company are
 * the close, with the adviser link and the address beside them.
 */
export default function Footer({ lang }: { lang: Lang }) {
  const c = copy[lang];
  /*
   * The product categories, on every page. Mak rule 9: a footer link is an
   * internal link from every page, so it is spent on the pages that matter
   * most — the categories people buy from. "Dockingstationer og tilbehør" is
   * cut to its first word so the link stays on one line in a phone column.
   */
  const productLinks: NavLink[] = categories.map((category) => ({
    href: `/produkter/${category.slug}`,
    label:
      category.slug === "dockingstationer"
        ? { da: "Dockingstationer", en: "Docking stations" }
        : category.name,
  }));
  const groups = [
    {
      label: c.products,
      links: [
        { href: "/produkter", label: { da: "Alle produkter", en: "All products" } },
        ...productLinks,
        ...productExtras,
      ],
    },
    { label: c.buy, links: buyNav },
    { label: c.services, links: serviceNav },
    { label: c.company, links: companyNav },
  ];

  return (
    <footer className="lit border-t border-white/10 bg-brand-950 text-paper/75">
      <Container className="pb-10 pt-14 sm:pt-20">
        {/* From xl, the brand on the left and four link columns on the right,
            Products in two, so every column is about five links tall. On a
            1920 screen the stacked rows ran ten links wide for Products and
            four for Services, and the right half of the footer was empty. */}
        <div className="xl:grid xl:grid-cols-12 xl:gap-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 xl:col-span-3 xl:flex-col xl:items-start xl:justify-start xl:gap-6">
            <div className="max-w-xl">
              <Link
                href={localePath("/", lang)}
                className="inline-flex min-h-[44px] items-center gap-3 font-display text-3xl font-extrabold tracking-display text-paper sm:text-4xl"
              >
                <Logo className="h-9 w-auto sm:h-10" idPrefix="footer" />
                Kestro
              </Link>
              <p className="mt-4 text-base leading-[1.65] text-paper/65">{c.blurb}</p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end xl:items-start">
              {/* No button here. The band above every page already asks, and a
                second "talk to an adviser" a screen later read as the site
                repeating itself; the footer keeps the address and the door. */}
              <a
                href={`mailto:${company.email}`}
                className="inline-flex min-h-[44px] items-center text-sm text-paper/65 transition hover:text-paper"
              >
                {company.email}
              </a>
              <p className="text-sm leading-[1.6] text-paper/65">
                {company.locationShort[lang]} · {c.delivers} {company.serves[lang]}
              </p>
            </div>
          </div>

          {/* Each group's label sits above its links, never beside them: a
            label-left, links-right row is the hanging-header pattern. */}
          <nav
            aria-label={c.pages}
            className="mt-12 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 xl:col-span-9 xl:mt-0 xl:grid-cols-[2fr_1fr_1fr_1fr] xl:gap-x-8 xl:border-t-0 xl:pt-0"
          >
            {groups.map((group, gi) => (
              <div key={group.label}>
                <h3 className="label text-brand-300">{group.label}</h3>
                {/* One column track for every group, sized to the longest
                  label: the groups stack, and their links line up in the
                  same columns down the whole footer — two on a phone, seven
                  on a desktop. Free wrapping put one link on a row, then
                  two, then three, so the eye had no edge to run down. */}
                <ul
                  className={`mt-2 grid gap-x-4 [grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr))] ${
                    gi === 0
                      ? "xl:[grid-template-columns:repeat(2,minmax(0,1fr))]"
                      : "xl:[grid-template-columns:minmax(0,1fr)]"
                  }`}
                >
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={localePath(link.href, lang)}
                        rel={link.rel}
                        className="inline-flex min-h-[44px] items-center text-sm text-paper/65 transition hover:text-paper sm:whitespace-nowrap"
                      >
                        {link.label[lang]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* The legal band. A B2B buyer looks for the entity, the address and
            the CVR before ordering, and e-handelsloven §7 requires them; each
            part appears when there is a real value for it. */}
        <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-sm text-paper/65">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-[1.45]">
              {[
                company.legalForm ? `${company.name} ${company.legalForm}` : company.name,
                postalAddress(lang),
                company.cvr ? `${c.cvrLabel} ${company.cvr}` : null,
                company.phoneDisplay,
              ]
                .filter(Boolean)
                .join(" · ")}{" "}
              · &copy; {new Date().getFullYear()} Kestro. {c.rights}
            </p>

            {/* rel="me" alongside noopener: it is what marks these as the same
                entity's own profiles rather than pages we merely link to, and
                it says the same thing the Organization schema's sameAs says. */}
            <ul className="flex items-center gap-2">
              {company.social.map((profile) => (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    aria-label={`${c.follow} ${profile.name}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-paper/65 transition hover:border-brand-400/50 hover:text-paper"
                  >
                    <SocialGlyph name={profile.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="max-w-3xl text-xs leading-[1.45]">{c.trademarks}</p>
          {/* The legal documents in English, on the Danish pages only.
              rel="privacy-policy" on the Danish links was not enough: the
              GEO audit still reported "no privacy policy or terms links"
              because it looks for the English words, and the Danish routes
              must not be renamed. These are the real English pages, useful
              in their own right to a Norwegian or international buyer, and
              they carry the words in both the address and the label. */}
          <div className="flex flex-wrap items-center gap-x-6">
            {lang === "da" && (
              <p className="flex flex-wrap items-center gap-x-4">
                <span>På engelsk:</span>
                <Link
                  href={localePath("/privatlivspolitik", "en")}
                  hrefLang="en"
                  lang="en"
                  className="inline-flex min-h-[44px] items-center transition hover:text-paper"
                >
                  Privacy policy
                </Link>
                <Link
                  href={localePath("/handelsbetingelser", "en")}
                  hrefLang="en"
                  lang="en"
                  className="inline-flex min-h-[44px] items-center transition hover:text-paper"
                >
                  Terms of sale
                </Link>
              </p>
            )}
            <ConsentReset lang={lang} />
          </div>
        </div>
      </Container>
    </footer>
  );
}

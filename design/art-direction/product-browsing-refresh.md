# Product browsing refresh

> **2026-11-15 — five categories in one compact row.** The owner read the
> seven-tile hub as confusing and artificial and asked for tablets and
> smartphones to leave it: they had no model and no picture, only a mark in an
> empty frame. Their pages and URLs stay, linked from the header and footer.
> A large laptop card beside a 2x2 grid followed for one evening; at 1920 it
> ran past the screen and the owner found it too big. Now five equal cards
> sit in one row from 1024px (three columns from 640, laptops full width on a
> phone), so the directory fits the first screen at 1440 and 1920. Each card
> gives name, what sets it apart, brands and model count. The photo/drawing
> label is said once under the row, and photos multiply into the same pale
> well as the drawings. Everything below describes the seven-tile version.

## Product and scope

Kestro helps Danish and Norwegian businesses compare refurbished IT. The
products hub should answer “which category?” in one click; the laptop page
should show the actual recommended model before asking the visitor to read.
Scope: existing products hub and laptop category, Danish and English. No new
routes, checkout, inventory claims, prices or promises. Existing title,
description, H1, canonical, hreflang and category destinations stay intact.

The owner has explicitly delegated design decisions and publication across
this ongoing site task. This brief uses the taste-first redesign workflow
without reopening approval checkpoints.

## Existing read and direction

Preserve navy, Jakarta, brand blue, `.plate`, the shared Container and type
scale. The weak point is an icon directory followed by several text sections;
the recent laptop recommendations are three dense text cards without images.

Chosen direction: a photographic product directory with quiet editorial
hierarchy. Image, model/category, essential facts, one obvious destination.
Detailed advice becomes native disclosures. Alternative considered: a full
white retail storefront; rejected because it implies an active shop and
replaces the site's established visual identity. Another rejected direction:
animated 3D showroom, which the owner already found artificial.

Reference route: tasteful-ui catalog → media / consumer tech → Apple. Only
its restrained image hierarchy and separation of essential facts from deeper
detail transfer. No imitation of typography, navigation, branded imagery or
launch-page spectacle.

## Layout and components

- Hub: one seven-category image directory, not competing entrance grids.
  Three primary category photographs and four compact visual cards. Use
  existing owned category artwork, accurately described in alt text.
  Compact mobile cards show their picture, category and action; descriptions
  return from sm. The Danish dock card uses the concise label “Docks og
  tilbehør”, leaving the category URL, H1 and metadata unchanged. Mini-PC,
  tablet and dock scene frames focus on the actual object using CSS cropping.
- Laptop header: compact H1 and short existing lead; no large generic image
  ahead of the actual product photographs. A direct anchor remains usable
  with and without JavaScript.
  On mobile, the lead is a concise use-case sentence and the redundant
  recommendation introduction is hidden, so the first actual product image
  appears in the first screen. Seller and representative-photo notices remain.
- Recommendations: two featured photo cards for T14 Gen 2 and EliteBook 840
  G8. Full local photographs, `object-contain`, intrinsic dimensions, stable
  dark frames, meaningful alt text. The Dell 5420 remains a compact secondary
  comparison with its existing seller and condition caveat. Do not fill an
  image slot with a different Dell model or a synthetic reconstruction.
- Model photography is explicitly representative: not the seller's exact
  unit, condition, screen or physical keyboard. T14 CC0 and HP CC BY-SA 4.0
  source/author/licence links remain available in a native credit disclosure.
  The HP derivative remains CC BY-SA 4.0; only resize and WebP conversion.
- Buyer help and older model library are native disclosures after the
  recommendations, preserving useful content and all model/guide links.
- No filtering application, carousel, hover-only action, new dependencies,
  cart, scrape, third-party image load or fabricated Offer markup.

## Craft rules

Existing paper/ink and brand tokens; body text at least paper/65. Category
images fill their scene frames; exact product photos are contained without
cutting ports or keyboard. Photo frames have a neutral white/10 outline on
dark backgrounds. One 2px ArrowUpRight for merchant destinations, 2px
ChevronDown for disclosures. Native disclosure state provides a static cue;
only short color/transform transitions, reduced-motion safe. At least 44px
targets; normal wrapping at 320px. Mobile stacks image cards and never hides
essential seller or condition information.

## Verification and critique

Review both languages at 320, 390, 768, 1024, 1440 and 1920. Check actual
images, credits, keyboard focus, disclosure open/closed, no-JS category and
merchant paths, back navigation, exact seller URLs, overflow, contrast and
all existing metadata. Run the repository's full `npm run verify` gate,
including security/admin regression. Inspect screenshots before release.
Publish only after the gate passes; confirm production SHA and live flows.

Success means visible product recognition, one click to a category, less
initial reading and honest external buying. Reject a layout that is more
decorated but obscures condition, actual merchant or the next action.

## The catalogue as one ledger — 18 November 2026

The owner found the laptop category amateur and dated. Read against
Anthropic's frontend-design skill (anthropics/skills, 2026-11-18), the list
was its "SaaS card kit": 59 white cards on navy, one radius, one shadow, each
repeating "Processor, Hukommelse, Lagring". The plan, checked against the
skill's list of defaults before building:

- **Subject:** a business buyer comparing laptop lines and generations.
- **Layout:** the list view is one dark panel, a rule between rows and the
  spec columns named once above them (when every row shares them); actions
  sit in a fixed 11rem column so the heads align. The grid view keeps the
  hub's white sheets.
- **The one bold thing:** only the pictures stand on light, on the
  `.product-well` floor, like products on a lit shelf in a dark room.
- **Toolbar** over the list column, not the page: a field, the count, sort
  and view. Filters are a column of type on a desktop, a panel on a phone;
  native controls take the dark colour scheme.
- **Lead:** answer first, from the data: "59 modeller fra Lenovo, HP og
  Dell, fordelt på 10 serier." The "Køb hos andre" link left the top of the
  page; the external retailers are still the disclosure after the range.

## The modern pass — 19 November 2026

The owner looked at the ledger and said it still was not modern. Measured at
1920, 1440 and 390, the dated parts were the controls, not the list: square
checkboxes in a 220px sidebar, the filters reading as a form beside the
table, a plain select and a visible "Sammenlign modelserier" heading
repeating the page's own subject.

- **One command bar.** Search, count, sort and view share a bar that stays
  under the header while the list scrolls (from lg), on the navy at 80% with
  a blur so the rows read through it. Every control is a pill; the sort is
  a native select with its own chevron; the view switch is a segmented pair
  with a white active half.
- **Facets are chips**, and the native checkbox still carries the state: it
  covers the chip transparently, so a click, a keyboard and Playwright reach
  the real control, and the chip fills brand blue when it is checked. (Where
  the chips live changed the same day; see below.)
- **A row is one target.** The model name's link covers the row; compare
  and enquire sit above it. The row lights faintly under the pointer and
  under keyboard focus. Compare is a quiet pill with a dot, enquire a soft
  pill that fills blue on hover — the header keeps the one solid blue button.
- **The picture spans the name and its use**, so the format, the name and
  the one-line use sit together beside a 144px picture instead of the use
  line falling under the picture.
- The models heading stays for the outline and leaves the screen; the
  placeholder's family name is written as the brand writes it, not in
  tracked capitals.

Left as it is: the grid view's white sheets (the hub's language), and the
short placeholder band on models without a photo — a tall empty frame would
be a picture of nothing.

### Facets as buttons, the same day

The owner, on the chip rows: cluttered and useless. Measured at 1440: three
rows of chips (17 choices) and, once something was chosen, a fourth row of
tags repeating the chips that were on — 230px of controls before the first
model.

- From lg each facet is one button in the command bar, beside the search:
  Mærke, Serie, Type. It opens its chips under it; a click elsewhere or
  Escape closes it, and Escape returns focus to the button. A chosen facet
  shows how many of its chips are on.
- The row of selected-filter tags is gone. The facet's count, the phone's
  "Filtre (n)" and "Nulstil filtre", now beside the result count, cover it.
- On a phone nothing moved: the chips stay in the Filtre panel.
- At 1024 the bar holds one line: the search is narrower and "Sortér"
  is left to the screen reader until xl.

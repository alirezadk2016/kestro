# Product browsing refresh

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

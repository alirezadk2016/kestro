# One product journey — 13 November 2026

## Problem and direction

The owner's complaint is structural. `/produkter` presents seven equipment
categories, then repeats four actual model cards using an older, larger visual
component. Category pages repeat model-library material, while the laptop page
gives external retailer recommendations similar visual weight to its own model
guide. The product dropdown puts explanatory pages before actual categories.
The homepage repeats laptop imagery and sourcing claims across separate bands.

Apply the confirmed Kestro navy/blue system in Tasteful UI production mode.
The owner has already authorized autonomous design choices and publication.
This pass removes competing decisions and duplicates, rather than adding a new
design vocabulary. Mak's stable URLs and distinct search intents remain intact.

## Rules for the correction

- Homepage: one equipment gateway. Remove Statement and ExampleMachine; keep
  the concise company answer/FAQ, service gateway, process and quote form.
  The fourth gateway links to all products; fleet sourcing has its own service
  gateway rather than another equipment card.
- Product hub: choose one of seven categories. Remove the four-model shelf.
  One compact comparison link serves people who already know their model.
  Buying advice becomes one native disclosure, with all useful advice retained.
- Categories: one catalogue before secondary guidance. Remove the repeated
  T480 gallery. Preserve its old library fragment as an alias to the catalogue.
  External purchasing remains available in an explicitly optional disclosure;
  its existing deep link must reveal it in one click with and without JS.
- Menu: categories first, then all-model comparison. Machine internals, quality
  and sample quote keep their contextual/footer destinations. About stays in
  the footer and team information; Contact stays in the main menu.
- Guides: compact topic jump links, followed by the actual topic sections.
  Remove the duplicate illustrated index and adjacent duplicate footer entry.
- Preserve routes, metadata, canonical/hreflang, sitemap, source/licence links,
  legal/project status, exact dated budgets, model facts and quote handoffs.

## Review and release

Validate the before/after homepage and hub length, one visible product/model
presentation per relevant page, header/mobile menu order, category selection,
native disclosures and external fragment reveal. Check Danish and English at
320/390/1024/1440/1920, retaining accessible focus and 44px controls. Add only
meaningful regression coverage for the changed browsing structure. Freeze the
source after visual review, run the required full `npm run verify`, publish,
match the production SHA and exercise the live simplified journey.

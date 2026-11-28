# Kestro catalogue — 13 November 2026

## Scope and direction

The owner supplied Elgiganten's filtered gaming-laptop listing and explicitly
chose both the model/product catalogue and the dated pricing collection.
They have already delegated design and publication decisions. Implement in the
existing Next/React/Tailwind stack; no new route, dependency or checkout.

Use the reference's useful retail structure: a left filter column, a compact
search/sort toolbar, identifiable product cards and a comparison shortlist.
Keep Kestro's navy, Jakarta typography, brand blue, shared Button/Container and
plate surfaces. Catalogue product images sit on restrained light neutral stages.
Reference routing: tasteful-ui → retail/Meta and consumer-tech/Apple for image
hierarchy and restraint only. Do not copy retailer branding, campaigns or assets.

## Product truth

Eighteen model families describe possible configurations, not sellable SKUs.
Filter by actual brand, group and model text. Sort by catalogue order or model
name. RAM/SSD/CPU prose is not a verified numeric inventory facet. Do not add
stock, ratings, sales rankings, discounts or current Kestro prices.

The four dated pricing examples retain their exact configurations, observation
date, VAT/service-fee basis, source and quote handoff. Budget sorting explicitly
uses the historical reference, never a current offer. Preserve all existing
page titles, H1s, metadata, canonical/hreflang/routes and useful deep links.

## Interface

- One shared explorer, localized server-supplied entries. Real links and all
  items are server-rendered. JS progressively enables native search, checkboxes,
  sorting and comparison; script-disabled visitors retain every model link.
- Desktop: filter rail with brand/group counts, toolbar with result count and
  grid/list choice, two/three-column image cards. Mobile: compact full-device
  thumbnail beside the title, information/action below, in-flow filter panel.
- Phones omit the redundant grid/list toggle and repeated visible section
  headings while preserving the heading outline for assistive technology.
  Desktop budget references use four columns on wide screens. Configuration
  lines reserve two desktop rows so all four budget amounts share a baseline.
- Page openings are compact, with unchanged H1s and factual copy. Pricing's
  complete project-status notice follows the clearly labelled budget collection;
  the quote form still states the project status before collecting an enquiry.
  The non-price/non-stock budget label and observation date remain above cards.
- Active filters can be removed individually or reset. An empty result explains
  the state and provides reset/enquiry actions. No filtering network requests.
- Query state restores after reload and Back. Existing group fragments remain.
  Native controls avoid crawlable facet-combination link explosions.
- Select up to three model references. A bounded bottom tray opens a real inline
  comparison table with qualified existing specs and per-model enquiry links.
  Selection survives filtering/sorting. Removing/clearing is explicit.
- The comparison excludes the duplicate model-name fact before taking six
  qualified fields, preserving real port information. Mobile columns fit one
  complete model beside sticky row labels. The active tray adds body clearance
  so final footer and privacy controls remain reachable.
- Legacy group hashes scroll to their actual card after filtering commits,
  preventing a stale unfiltered scroll position. A one-model category omits
  facets and comparison that could not provide a meaningful choice.
- All images remain contained and labelled photograph/illustration. Six laptop
  families lack clean cleared photographs; show a deliberate typographic model
  reference panel, not a fabricated laptop or photograph of a sibling model.
  Eight bounded research queries found no suitable new photo for this release.

## Craft, evaluation and release

Minimum 12px type, paper/65 dark-surface text floor, 44px controls, visible focus
and native checkbox state. No 3D, carousel, decorative motion or extra gradients.
Retain site consent/privacy/security gates. Comparison must not obscure final
card actions and its horizontal scroll stays inside its labelled region.

Inspect both languages at 320, 390, 768, 1024, 1440 and 1920, plus short landscape
and script-disabled rendering. Exercise facets, OR/AND logic, sort, empty/reset,
comparison limit/removal, exact quote destinations, reload/Back, canonical and
query noindex. Review actual screenshots and iterate before freezing code.
Run the full required npm run verify gate once the implementation is frozen;
publish only after success and verify production SHA and a real live flow.

Presentation/interface change: Page-Dates: skip. Historical values and actual
model facts are not refreshed or invented. Report real image limitations and
measured test results; do not manufacture a 10/10 score.

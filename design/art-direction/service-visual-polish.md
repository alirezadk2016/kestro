# Service And Product Visual Polish

## Boundaries

Preserve routes, metadata, bilingual copy, forms, pricing, legal notices and
the desktop homepage. The accompanying mobile-hero brief covers the only
homepage change. No dependencies are added.

## Composition

- Fleet delivery: one heading, a sticky desktop equipment scene and five
  readable stages. Native scrolling and real anchor links; no scroll capture.
  Reuse the repair assembly model and its keyboard texture. Closed lids rotate
  about the existing hinge. A fixed camera and restrained pointer response
  keep scale consistent. Render only while something changes and is visible.
  Mobile, reduced motion, Save-Data and no-JS use the existing fleet poster;
  desktop textures and Three are not requested in those modes.
- Buyback: a workspace photograph connects the introductory copy to the
  devices being discussed. Four numbered steps use consistent outline icons.
  The original enquiry form and its anchor remain unchanged.
- Quality: native A/B/C radio controls select a real comparison panel, even
  without JavaScript. One photographic angle makes cosmetic differences
  comparable. Photos are explicitly illustrative, not available stock.
  An optional native dialog supports enlarged inspection and keyboard exit.
- Smartphones: a unified product presentation replaces the empty right half.
  The additional introduction follows the photograph on mobile. Brand links
  lead to the existing localized enquiry form with its model field prefilled.
  All other product categories keep their current presentation.

## Artwork

Generated bitmap masters live in assets/artwork; export dimensions, crops and
generation directions live in manifest.json. Rebuild with
`node scripts/build-artwork.mjs visual-ui`.

- buyback.png: realistic closed business laptops, tablet and phone on the
  site's dark stone desk, Nordic blue-hour setting, warm neutral key light;
  hardware grouped on the right, quiet left space, no baked UI or claims.
- smartphones.png: plausible business phones and smartwatch, detailed camera
  lenses and metal edges, same room and blue screen ribbon; no logos or labels.
- grades.png: three matched square views of the same closed graphite laptop.
  A nearly unmarked, B light cosmetic scratches, C visible wear; identical
  angle, lighting and scale. Cropped into grade-a/b/c.webp for comparison.

## Verification

The production verification gate includes both languages, real pixel contrast,
phone overflow and tap targets, no-JS content, enquiry prefill, grade keyboard
selection and dialog focus restoration, lightweight fleet modes, scroll-stage
reversal and nonblank WebGL pixels. Screenshots are additionally reviewed at
390, 1440 and 1920px, including all five fleet poses. No enquiry is submitted
to the real inbox during visual testing.

# Mobile Homepage Hero

## Scope

Preserve-mode redesign of the homepage's first mobile frame, below 768px.
Keep desktop presentation, routes, metadata, the H1, primary action, consent
copy and all subsequent sections unchanged. No WebGL, new dependency or
JavaScript animation. Keep the original hero assets; add a portrait variant.

Design read: Scandinavian business IT for organizational buyers, expressed
through a believable workspace, precise hardware and immediately legible type.
DESIGN_VARIANCE: 5, MOTION_INTENSITY: 2, VISUAL_DENSITY: 3.
Use existing Tailwind tokens, Plus Jakarta Sans and Lucide button icons.
Palette: #060B16, #0B1426, #1E40FF, #3B82F6, #BECFFD, #FFFFFF.

## Baseline And Direction

Subjective design assessment: 5.5/10 for the old mobile composition; the old
photograph itself is about 8/10. These are design judgments, not user testing.
At 390x844 with the English-language hint, the primary action started at
y=776 and the consent dialog covered it. The glass panel was 427px tall.
At 320x667, the panel rose into the product image instead.

Retain the recognizable room and screen ribbon. Move the first message and
action onto the portrait's dark architectural upper half, without a card.
Show the complete laptop below the copy. Use fixed font-size steps and zero
letter spacing on mobile; keep the long Danish word intact. The first
sentence remains visible. The detailed sourcing steps stay in the
desktop hero, with the fuller explanation still available further down.
Keep a hint of the following feature strip on ordinary portrait screens.

Rejected: more glass, animated 3D, invented trust badges, decorative technical
callouts, and enlarging the existing square crop underneath another panel.
Those would compete with the product or add download and rendering cost.

## Artwork

Built-in image_gen, using public/hero/scene-mobile.webp as the reference.
Master: assets/artwork/hero-mobile-portrait.png.
Exports: public/hero/scene-mobile-portrait.avif and .webp, 820x1458.
Rebuild only this variant: `node scripts/build-artwork.mjs hero-mobile`.
The device is illustrative hardware, not a photographed stock item or a
claim that the depicted machine is a particular catalog model.

### Generation Prompt

Use case: product-mockup. Asset type: portrait photographic background for the MOBILE hero of Kestro, a Scandinavian business-computer sourcing website. Input image 1 is the reference for the exact visual language, room, dark stone desk, blue-hour Nordic waterfront, and premium realistic black business laptop. Create a new art-directed PORTRAIT 9:16 composition of this same setting, not a screenshot or a UI mockup. IMPORTANT composition for real HTML text: the upper 50 percent of the frame must be calm, near-black architectural wall/ceiling in deep charcoal with only subtle natural surface texture and very subdued window reflection; no laptop and no bright window panes in that upper half. The large laptop is fully visible in the lower middle, occupying approximately x=12%-88%, y=56%-83%. The whole screen, hinges, realistically spaced individual chiclet keys, touchpad, front edge and port details must be crisp and physically plausible. The laptop is open at a normal working angle and seen from a graceful three-quarter front-left position, resting naturally on a dark textured stone desktop. Place the blue-hour waterfront glazing behind and around the laptop in the LOWER half, preserving the reference's Scandinavian architectural context and tiny warm natural lights, not abstract blue smoke. The bottom 12 percent is quiet dark desk in natural shadow. Premium commercial PRODUCT PHOTOGRAPHY, meticulously believable materials, controlled blue rim light and soft neutral key light, subtle warm reflections, no artificial neon lighting. Screen displays only one elegant blue light curve on black, as in the reference. Clear product detail and accurate perspective matter more than atmosphere. No people, no holograms, no extra laptops, no floating components, no diagrams, no badges, no lettering, no logos, no watermark. Do not bake any text, cards, buttons or other website UI into the image. Preserve the brand mood of the supplied image; change the portrait framing and negative-space allocation for legible mobile-first composition.

## Acceptance Checks

- Both languages at 320, 360, 375, 390 and 430px, plus the 767/768 boundary.
- First visit with consent unanswered and language hint shown or absent.
- Primary action is readable and reachable without dismissing consent on
  ordinary portrait screens; small-height screens must remain scrollable.
- No text/product collision, clipped headline, horizontal overflow or new JS.
- One relevant hero download per device; no portrait download on desktop.
- Desktop screenshots match the baseline, and wide hero assets are unchanged.
- No-JS and reduced-motion cases; production build and repository verify gate.

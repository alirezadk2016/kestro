# Repair workbench — corrective redesign

## Product context and failed baseline

The repair landing page introduces Kestro's service and leads to the existing
enquiry form. The owner rejected the previous macro-photo gallery as amateur and
inconsistent with the site. That visual rejection overrides the earlier artwork
acceptance: functional correctness did not establish visual quality.

The old 5:7 layout enlarged a guide macro to roughly 900 × 675px beside 300px of
copy. Its closed state showed anonymous plastic and coarse mat, while tiny text
controls looked like a detached demonstrator. Kestro's homepage and category
photography instead use complete hardware, dark stone, architectural depth,
blue-hour fill and restrained warm reflections.

The owner has delegated design choices and publication in this session. Use
tasteful-ui's taste-first redesign mode autonomously. The existing site's assets
and components are the primary reference; the Apple reference contributes only
restraint and a clear photographic subject, not its fonts, colours or branding.

## Directions considered

1. Conservative: cap a 3:2 photo at 600–650px beside the copy. This corrects scale
   but retains the disconnected picture-and-copy pattern.
2. Integrated workbench: set copy into the quiet side of a panoramic service
   scene, with one full-width selector band below. The complete laptop and room
   materials reconnect the repair page to the rest of Kestro.

Choose direction 2. Design variance 5, motion intensity 1, visual density 3.
The intended feeling is careful, calm service, with the repair enquiry primary.

## Implementation brief

- Keep Jakarta, the existing type scale, Container, Button and navy/paper/blue
  palette. Preserve routes, main copy, metadata, form and service content.
- From 1280px, use one 500–600px photographic field. A contained, right-aligned
  panorama preserves every chassis corner. Copy occupies about 40% of the
  existing Container and sits vertically centred over the quiet left side.
- A navy selector band follows the photograph rather than covering hardware.
  A short RAM example label and active caption sit left; four photographic
  selectors sit right. A blue thumbnail edge marks selection, with a separate
  high-contrast keyboard focus ring. No broad tinted number boxes.
- Below 1280px, stack compact copy, a 3:2 crop of the right-hand device, controls
  and caption. Crop only the panorama's quiet left region. All hardware corners
  must remain visible in the intended phone composition.
- Native same-name radio inputs retain keyboard and no-JavaScript operation.
  Targets are at least 44px. Motion is restricted to 140ms control colour/edge
  feedback and disabled under reduced motion. No autoplay or WebGL.

## Artwork contract

A generic powered-off business laptop lies lid-closed and underside-up on a fine
graphite ESD pad over dark stone. Neutral task light makes parts readable, with
restrained blue-hour fill and a warm reflection connecting it to the site's
photography. All four states share camera, room, chassis, scale, tools and light.

States: fitted base cover; removed cover with original green RAM seated; empty
socket with original green RAM on the pad; black replacement seated while old
green RAM remains in that pad position. Default is open. The removed cover
rests behind the device in open states. Captions identify visible changes only.
One AI disclosure identifies the imagery as illustrative; no exact-model,
compatibility, tested-device or actual-workshop claim is made. Prompt and origin
records live beside the four delivery assets.

## Acceptance and verification

First inspect actual 1280/1440/1920 and phone screenshots against the user's
rejected baseline. Judge whole-device recognition, copy/photo balance, brand
materials, control scale, useful scene area and legibility. Passing tests alone
does not approve the design.

Verify bilingual exact state/source agreement, distinct decoded assets, stable
frame position and size across stages, native keyboard and no-JavaScript
behaviour, touch targets, focus, reduced motion, no horizontal overflow, no
WebGL and the enquiry anchor. Run the mandatory repository gate after visual
revision, then confirm the deployed commit and smoke-test the live page.

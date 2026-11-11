# Reference Product Photography

These photographs identify a model, not an available unit, its condition,
its configuration or a relationship with the manufacturer or photographer.
The model gallery carries a visible source and licence credit.

## ThinkPad T14 Gen 2 Intel

- Asset: `public/models/t14/gen2-intel-reference.webp`
- Photographer: Edvard10
- Source: https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg
- Original: https://upload.wikimedia.org/wikipedia/commons/a/ac/ThinkPad_T14.jpg
- Licence: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Checked: 2026-10-16. The source identifies the Intel Gen 2 variant.
- Processing: resized to 1600 x 1200, converted to WebP, metadata removed.
  No retouching, recolouring or changes to the product or its screen.

Existing owner-supplied ThinkPad T480 photographs remain unchanged.

## HP EliteBook 840 G8

- Asset: `public/models/elitebook/840-g8-reference.webp`
- Photographer: Infinatious
- Source: https://commons.wikimedia.org/wiki/File:HP_EliteBook_840_G8.png
- Original: https://upload.wikimedia.org/wikipedia/commons/9/9a/HP_EliteBook_840_G8.png
- Licence: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/
- The resized WebP derivative is available under the same CC BY-SA 4.0 licence.
- Checked: 2026-11-11. File identifies the exact 840 G8 model; own work.
- Original: 1948 x 1799 PNG, SHA256
  `E295CC1EC37497E9DA15DECD8C8CC541EE98128D5AF2970C5E569F1B57B053B0`.
- Processing: resized to 1280 x 1182 and converted to WebP, alpha preserved.
  No retouching, recolouring, screen replacement or product reconstruction.
- WebP SHA256:
  `6B0F8BB23DF5715C40C7F495BF7A9D4581248AC9BDE7787A0A2848B0FDAA2D5F`.
- The image has a UK keyboard; it is not the seller's individual unit or an
  illustration of the seller's Nordic keyboard, condition or included software.

The laptop recommendations have a shared visible model-photo notice and a
native photo-credit disclosure containing both authors, original file pages,
licences and the processing note. The Dell Latitude 5420 recommendation uses
no substituted photograph: no suitable exact-model licence was verified.

## Original pricing illustrations

- Assets: `public/pricing/optiplex-5060-sff-illustration.svg` and
  `public/pricing/ultrasharp-u2419h-illustration.svg`.
- Created for Kestro on 2026-11-11 as original code-native SVG artwork.
- These are labelled illustrations, not photographs of actual stock, seller
  units or evidence of a specific device's condition, accessories or ports.
- No manufacturer/retailer image or manual drawing was copied, traced,
  embedded or linked as an external image. No logos or operating-system
  screenshots appear in the artwork.
- OptiPlex: the thin SFF chassis uses the published approximate proportions
  292 x 92.6 x 290 mm, distinct from the Micro or mini-tower. The front vent
  pattern and I/O arrangement are an original schematic treatment, not an
  assertion of exact component positions or included optional equipment.
- U2419H: the screen treatment uses a 16:9 panel with a slim black frame and
  silver pedestal; published body width/height are 538.5 x 313.7 mm. The
  stand/base and reflections are original schematic artwork.
- Factual references, checked 2026-11-11:
  - https://www.dell.com/support/manuals/en-in/optiplex-5060-sff/optiplex_5060_sff_setup_and_specs/physical-system-dimensions?guid=guid-9a766954-743d-41f1-b3ce-8828e4297689&lang=en-us
  - https://www.dell.com/support/manuals/en-in/optiplex-5060-sff/optiplex_5060_sff_setup_and_specs/front-view?guid=guid-cd24c6a2-daef-411f-8e94-0c7e9ff8d174&lang=en-us
  - https://dl.dell.com/manuals/all-products/esuprt_display_projector/esuprt_display/dell-u2419h-monitor_user%27s-guide_en-us.pdf

The factual references do not grant a licence to republish Dell's artwork.
The price collection must retain a visible illustration label for these
assets and its separate model-photo/individual-unit distinction.

## Original product illustrations

- Assets: `public/products/*.svg`, fourteen files, one per model without a
  licensed photograph or a pricing illustration.
- Generated for Kestro on 2026-11-11 by `scripts/build/product-art.mjs`
  (deterministic; rerun after changing a definition). Code-native artwork in
  the language of the pricing illustrations: pale studio field, soft floor
  shadow, graphite hardware, empty screens, no logos.
- They show a format, not a model's exact appearance: 14 or 15.6 inches, the
  thin X1 profile, the TrackPoint on the ThinkPads, the ProBook 450's numeric
  keypad, an upright SFF case, a one-litre case, a monitor on a
  height-adjustable column, a mechanical dock and USB-C docks. Each of those
  comes from lib/models.ts. Colour is not recorded there, so every machine
  is the same neutral graphite.
- No manufacturer or retailer image, drawing or manual was copied, traced or
  referenced for proportions beyond those facts.
- Every frame that shows one carries the label "Illustration", and each alt
  text in `lib/model-media.ts` describes what is drawn.

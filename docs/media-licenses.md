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

- Assets: `public/products/*.svg`, seven files: the desktops, monitors and
  docks without a licensed photograph or a pricing illustration.
- Laptops have none. On 2026-11-11 the owner asked that every laptop shown
  be a real photograph of that model, so the seven laptop drawings (X1
  Carbon, L14, EliteBook 840, ProBook 450, Latitude 5410, Latitude 7490,
  ZBook 15) were deleted. Those models show no picture until a licensed
  exact-model or owner-supplied photograph is added.
- Generated for Kestro on 2026-11-11 by `scripts/build/product-art.mjs`
  (deterministic; rerun after changing a definition). Code-native artwork in
  the language of the pricing illustrations: pale studio field, soft floor
  shadow, graphite hardware, empty screens, no logos.
- They show a format, not a model's exact appearance: an upright SFF case,
  a one-litre case, a monitor on a height-adjustable column, a mechanical
  dock and USB-C docks. Each of those
  comes from lib/models.ts. Colour is not recorded there, so every machine
  is the same neutral graphite.
- No manufacturer or retailer image, drawing or manual was copied, traced or
  referenced for proportions beyond those facts.
- Every frame that shows one carries the label "Illustration", and each alt
  text in `lib/model-media.ts` describes what is drawn.

## Laptop photographs searched for, not yet added (2026-11-11)

Wikimedia Commons was searched (categories ThinkPad X1 Carbon, ThinkPad L
series, HP EliteBook, HP EliteBook 840, HP ProBook, HP ZBook, Dell Latitude,
Dell Latitude 7490, and full-text search for each model and generation).
The image server (upload.wikimedia.org) then refused every download from
the build environment with HTTP 429 for more than fifteen minutes, so no
file below has been downloaded, viewed or checked against its page. Nothing
was substituted.

- Latitude 7490: https://commons.wikimedia.org/wiki/File:Dell_Latitude_7490_running_Ubuntu_Cinnamon_23.10.jpg
  by Ahunt, CC0, own work, 2071 x 1944, described as "A Dell Latitude 7490
  running Ubuntu Cinnamon 23.10". Best candidate; view it first (it is also
  filed under free screenshots, so confirm it is a photograph of the
  machine).
- X1 Carbon (page covers Gen 6-8): four files named "ThinkPad X1 Carbon
  gen7 (0)-(3)", IAEA Imagebank, CC BY 2.0. They are meeting photographs
  of named people with the laptop on the table; the generation comes only
  from the Commons file name. Usable only if the laptop can be shown
  without the people and the generation can be confirmed.
- Latitude 5410 and X1 Carbon Gen 8: LaptopMedia "360 degrees" videos,
  CC BY 3.0 per the uploader, but marked "License review needed". Not
  usable until the licence review passes.
- L14, EliteBook 840 G5/G6, ProBook 450 G7/G8, ZBook 15 G5/G6, Latitude
  5420: no file on Commons identifies these models (other generations
  only: EliteBook 840 G1/G3/G4/G8, ZBook 15 G3, L15 Gen 3).

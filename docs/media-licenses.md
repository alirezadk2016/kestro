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

- Assets: `public/products/*.svg`, five files since 2026-11-12 (the WD19's
  and the ThinkPad Ultra Dock's were replaced by photographs): the desktops,
  monitors and the dock without a licensed photograph or a pricing
  illustration.
- Laptops have none. On 2026-11-11 the owner asked that every laptop shown
  be a real photograph of that model, so the seven laptop drawings (X1
  Carbon, L14, EliteBook 840, ProBook 450, Latitude 5410, Latitude 7490,
  ZBook 15) were deleted. Those models show no picture until a licensed
  exact-model or owner-supplied photograph is added; the Latitude 7490 got
  one on 2026-11-12.
- Generated for Kestro on 2026-11-11 by `scripts/build/product-art.mjs`
  (deterministic; rerun after changing a definition). Code-native artwork in
  the language of the pricing illustrations: pale studio field, soft floor
  shadow, graphite hardware, empty screens, no logos.
- They show a format, not a model's exact appearance: an upright SFF case,
  a one-litre case, a monitor on a height-adjustable column and a USB-C
  dock. Each of those
  comes from lib/models.ts. Colour is not recorded there, so every machine
  is the same neutral graphite.
- No manufacturer or retailer image, drawing or manual was copied, traced or
  referenced for proportions beyond those facts.
- Every frame that shows one carries the label "Illustration", and each alt
  text in `lib/model-media.ts` describes what is drawn.

## Dell Latitude 7490

- File: `public/models/latitude-7490/front-open-reference.webp` (1600 x 1200)
- Source page: https://commons.wikimedia.org/wiki/File:Dell_Latitude_7490_running_Ubuntu_Cinnamon_23.10.jpg
- Author: Ahunt (own work, taken 2024-03-14)
- Licence: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Accessed: 2026-11-12, from the Commons 1920 px thumbnail of the 2071 x 1944
  original. Viewed at 8-bit: a photograph of the machine itself (open on a
  wooden table, Dell logo, 8th-generation Intel sticker), not a screenshot,
  although Commons also files it under free screenshots. The screen shows an
  Ubuntu Cinnamon desktop; the alt text says it shows a Linux desktop.
- Changes: cropped to 4:3 and resized to 1600 x 1200; WebP quality 82;
  metadata removed. The whole screen and keyboard are in frame; the lower
  palm rest is cut because the open laptop is taller than a 4:3 frame. No
  retouching, recolouring or other edits.

## Dell Dock WD19

All three files are derivatives and stay under CC BY-SA 4.0. The credit on
the page says "cropped" or "resized".

- File: `public/models/dell-wd19/rear-ports-reference.webp` (1600 x 1200,
  the card image)
  - Source page: https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5814.jpg
  - Author: Raimond Spekking (own work, taken 2025-11-13)
  - Licence: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/
  - Accessed: 2026-11-12, from the 3840 px Commons thumbnail of the 5768 x
    3245 original. Commons names the model as WD19, type K20A; the rating
    label in the same series (file -5810) reads "WD19 / K20A".
  - Changes: cropped to 4:3 around the rear port row (audio, two
    DisplayPort, HDMI, USB-C, two USB-A, Ethernet, power) and resized to
    1600 x 1200; the cable end of the dock falls outside the frame. WebP
    quality 82, metadata removed. No other edits.
- File: `public/models/dell-wd19/vent-end-reference.webp` (1600 x 1200)
  - Source page: https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5815.jpg
  - Author: Raimond Spekking (own work, taken 2025-11-13)
  - Licence: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/
  - Accessed: 2026-11-12, from the 1920 px Commons thumbnail of the 3377 x
    3377 original.
  - Changes: cropped to 4:3 (the far end of the dock falls outside the frame)
    and resized to 1600 x 1200; WebP quality 82, metadata removed. No other
    edits.

- File: `public/models/dell-wd19/front-reference.webp` (1600 x 900, third
  in the gallery)
  - Source page: https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5812.jpg
  - Author: Raimond Spekking (own work, taken 2025-11-13)
  - Licence: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/
  - Accessed: 2026-11-12, from the 1920 px Commons thumbnail of the 5578 x
    3138 original. Front face: power button, USB-C, USB-A, audio jack.
  - Changes: not cropped (the dock spans the frame); resized to 1600 x 900,
    WebP quality 82, metadata removed. The credit on the page says
    "resized". No other edits.

The WD19 illustration (`public/products/dell-wd19.svg`) was deleted with its
entry in `scripts/build/product-art.mjs` and its alt in `lib/model-media.ts`.

## Lenovo ThinkPad Ultra Dock

A trimmed derivative; it stays under CC BY-SA 4.0. The credit on the page says
"trimmed".

- File: `public/models/lenovo-thinkpad-ultra-dock/top-view-reference.webp`
  (1600 x 777)
- Source page: https://commons.wikimedia.org/wiki/File:ThinkPad_Ultra_docking_station.JPG
- Author: Paowee (own work, taken 2023-11-18)
- Licence: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/
- Accessed: 2026-11-12, from the 3840 px Commons thumbnail of the 4191 x
  2115 original; licence and author re-checked through the Commons API the
  same day. Commons describes it as "A Lenovo ThinkPad Ultra docking
  station". Viewed at 8-bit: the dock alone from above on a white surface,
  docking connector, guides, Lenovo and ThinkPad logos and the side tower
  all in frame. Chosen over "ThinkPad T470 docked in the Ultra docking
  station" (same author and licence), where the laptop covers the dock
  except for its tower.
- Changes: only the empty margins trimmed (the whole device stays in frame,
  natural aspect about 2.06:1, not cropped to 4:3) and resized to 1600 px
  wide; WebP quality 82, metadata removed. No straightening, exposure or
  other edits.
- Second gallery view: `public/models/lenovo-thinkpad-ultra-dock/docked-t470-reference.webp`
  (1600 x 1057), from https://commons.wikimedia.org/wiki/File:ThinkPad_T470_docked_in_the_Ultra_docking_station.JPG,
  Paowee (own work, taken 2023-11-18), CC BY-SA 4.0,
  https://creativecommons.org/licenses/by-sa/4.0/. Accessed 2026-11-12
  from the 1920 px Commons thumbnail of the 3910 x 2582 original; viewed at
  8-bit. It shows how the dock is used, with a T470 (a T480-era machine)
  clicked onto it. Not cropped; resized to 1600 x 1057, WebP quality 82,
  metadata removed, no other edits. The credit on the page says "resized".

The Ultra Dock illustration (`public/products/lenovo-thinkpad-ultra-dock.svg`)
was deleted with its entry (and the now unused drawing function) in
`scripts/build/product-art.mjs` and its alt in `lib/model-media.ts`.

## Models still without a photograph (searched 2026-11-12)

Searched: Wikimedia Commons full-text and title search per model and
generation (the API rate-limited this environment repeatedly, so some
queries ran two or three times), plus Openverse (licences CC0, PDM, BY,
BY-SA), which also indexes Commons and Flickr. Flickr's image server
(live.staticflickr.com) is blocked by this build environment's network
policy, so a photo hosted only on Flickr cannot be downloaded here; those
are listed as candidates. Nothing was substituted, and no drawing, render or
generated image was added.

Laptops and the workstation (each keeps its empty dark well):

- ThinkPad X1 Carbon (page: Gen 6-8). Candidate: "Lenovo X1 carbon 6th
  generation" by pedrik, CC BY 2.0,
  https://www.flickr.com/photos/24388834@N04/39826813730 (licence, author
  and 6th-generation title confirmed on the Flickr page; 4151 x 3916
  original). Tried again on 2026-11-12: Openverse's record
  (be28099e-3133-4452-9aa5-e4e9b7efb3d8) and its image proxy hold only the
  1024 x 966 size, below the 1200 px minimum, and every size on
  live.staticflickr.com (and the farm/c1 static hosts) is refused by this
  environment's proxy. Not used; it needs the 1600 px or larger file
  downloaded from somewhere Flickr is reachable. The four IAEA
  Imagebank "ThinkPad X1 Carbon gen7 (0)-(3)" files (CC BY 2.0) were
  viewed and rejected: each screen shows a video call with identifiable
  people, and one has a person's hand in frame. Other Commons X1 Carbon
  files are Gen 1, 2 or 5.
- ThinkPad L14: nothing on Commons or Openverse.
- EliteBook 840 (page: G5 and G6): Commons has G1, G3, G4 and G8 only.
- ProBook 450 (page: G7 and G8): nothing; Commons has a ProBook 640 G1.
- Latitude 5410: nothing; the LaptopMedia video on Commons is still
  "License review needed".
- Latitude 5420 (`lib/external-laptops.ts`): nothing on Commons or
  Openverse.
- ZBook 15 (page: G5 and G6): Commons and Openverse have G3, ZBook 14/17
  and an older "ZBook Mobile 15" press photo only.

Desktops, monitors and docks (each keeps its labelled illustration):

- EliteDesk 800 (page: G4 and G5 SFF): Commons has the 800 G2 mini and 705
  G1 only.
- ThinkCentre M720q Tiny: Commons has the M715q and M75q-1, other models.
- OptiPlex 5060 (SFF and Micro): one exact file, "Dell OptiPlex 5060
  Micro" by Jackpen7, CC BY-SA 4.0,
  https://commons.wikimedia.org/wiki/File:Dell_OptiPlex_5060_Micro.jpg.
  Viewed and not used: an upright Micro mounted behind a monitor, so a 4:3
  frame cuts the machine in half and the background is a desk, cables
  and the monitor. Kept the pricing illustration.
- UltraSharp U2419H, EliteDisplay E243, ThinkVision T24i: nothing; Commons
  and Openverse have other UltraSharp and ThinkVision models.
- ThinkPad Ultra Dock: photographed since 2026-11-12 (above), shown whole
  at its natural aspect now that the card frames wide photos uncropped.
- HP USB-C Dock G5: nothing; "USB-C dock front/back" on Commons is a
  third-party dock.

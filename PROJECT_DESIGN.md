# Kestro: product section only

## Confirmed refinement — 21 November 2026

The owner accepted the product audit and asked to implement the whole product
redesign. Work starts from ad6e63b; the older local checkout is not the baseline.
Retain the navy/blue Jakarta identity and five compact equipment categories.
Use coherent pale product cards in both grid and list views, a fixed image
frame, linked images, concise decision facts and clear comparison states.
Default to a responsive grid, twelve initial results and progressive access
to every model. Buyer-use and screen-size filters must describe model data,
not claim an offered configuration or stock. Keep all no-JS links, fragments,
browser restoration and search semantics. Model details lead with the device,
practical use, key facts and enquiry; longer specifications remain accessible.
External price references remain visibly separate from Kestro enquiries.
Use exact-model owner-supplied or licensed imagery with attribution. A missing
exact photo gets an intentional model-reference panel, never a fictional or
wrong-generation machine. Extend verified photo coverage where sources allow.
Homepage, shared header/footer, admin, repairs and education are out of scope.
Before publication: complete production verify, desktop/mobile DA/EN visual
inspection, image/credit checks and a baseline diff confirming scoped changes.

## Product and scope

Kestro is a pre-launch B2B equipment sourcing project for Denmark and Norway.
The public catalogue describes model families, not stocked units. Visitors
choose a type, compare relevant models and send a non-binding enquiry.
Keep every existing public URL, search intent, metadata and factual source.

The owner's explicit scope is the product sales section: product categories,
model comparisons/details and budget examples. Do not redesign the homepage,
shared navigation/footer, consent banner, service pages or global identity as
part of product work. The homepage and shared shell were restored exactly to
the version before d39f0b6 after the owner corrected the overbroad scope.

**2026-11-17:** the owner explicitly asked for the front page to be reviewed
and refined, with structural changes allowed and the brand's look kept. That
work and its reasons are in `design/art-direction/front-page-2026-11.md`. The
shared navigation, footer and consent banner remain out of scope.

This is a production implementation in the existing Next/Tailwind stack.
The prior ten-point critique did not authorise changing the homepage. Future
work must preserve it unless the owner explicitly requests changes there.

## Visual direction

Retain the existing homepage, Kestro blue, navy shell, Jakarta typography and
established type scale. Within products, replace theatrical category scenes with quiet, fully visible equipment
references on pale neutral surfaces. Light catalogue sheets separate the
actual decision from surrounding guidance. Use the existing sheet and plate
system; avoid decorative motion, fake studio photos and extra promotional
sections. This stays close to the brand, informed by the tasteful-ui retail
reference family: photography and clear action hierarchy, not copied layouts.

## Information hierarchy

- Home: preserve the existing page and its components without changes.
- Products: choose an equipment type. No repeated individual model shelf.
- Categories: compact introduction then the single working model catalogue.
- Models: compare specifications and applications, not a second inventory.
- Budget examples: clearly dated external references, not live selling prices.
- Each model row: recognisable name, practical application, three key facts,
  detail link and enquiry. Preserve comparison and filters without leading
  every mobile visit with a wall of controls.

## Truth and imagery

Use existing owner-supplied or licensed exact-model photographs. Keep genuine
photo content and provenance; no sibling models substituted. Existing drawings
remain explicitly illustrations. Missing photos use a compact model reference,
not invented devices. Reference pictures never prove an offered unit's
condition. Exact configuration, battery, condition, accessories, price and
availability must be confirmed for the actual enquiry. No fabricated reports,
customer history, stock, ratings or guarantees.

## Acceptance

Check DA and EN at 320/390 and 1440/1920 widths. Confirm homepage/source parity
with the version before the unrequested redesign. Measure first-model position,
page lengths and overflow. Preserve search AND semantics, browser restoration,
legacy fragments, no-JS links/disclosures, comparison focus and prefilled
enquiries. Run the repository's complete production verification gate before
publication; inspect screenshots independently of passing tests.

## Compact product grid — 21 November 2026

The owner rejected tall cards. Grid cards now prioritize scanning: a 136–140px
device/reference frame, one combined format/title link, three key facts and a
44px action row. Application prose remains on model pages and in list view.
Use one/two/three/four columns as width allows, keeping desktop card widths
similar at 1440 and 1920. Target a maximum 390px grid card on desktop and 410px
on phones, with full-device photos, readable facts and honest references.

## Exact-model catalogue photos — 21 November 2026

Add genuine, licensed full-device reference photos in the existing compact
frames and model galleries. Preserve the complete hardware, original keyboard,
screen and colours; optimize dimensions and WebP encoding. Keep source titles,
authors and licenses with the images, with catalogue credits collapsed by
default. The new registry provides 26 additional models with primary photos;
33 of 68 models now have one. The remaining 35 require a suitable exact-model
photo with permission, rather than a generated device or another generation.

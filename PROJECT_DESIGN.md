# Kestro: product section only

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

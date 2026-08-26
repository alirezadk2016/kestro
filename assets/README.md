# Originals

Drop original files here: logo vectors, photographs straight off the camera or
phone, anything a designer hands over.

Nothing in this folder is served. Next.js only serves `public/`, so a 12 MB
photograph sitting here costs a visitor nothing — it is the source, not the
asset. The optimised, resized, converted versions get generated from these and
committed into `public/` separately, which is why the originals are worth
keeping in the repository rather than being thrown away after one export.

Send the largest version you have. Downscaling later is free; the detail that
was compressed out of a phone-messenger copy is gone for good.

## What goes where

    assets/logo/       vector originals — .svg, .ai, .pdf, .eps
    assets/photos/     photographs — workshop, machines, packing, team
    assets/brand/      brand board, colour references, type specimens

## Photographs

Two things to check before uploading, because neither can be fixed afterwards:

  - No faces in frame that have not agreed to be on a public website. That is
    a GDPR question, not a taste one.
  - The picture has to be ours. A photograph found online is a copyright claim
    waiting on a commercial site, and it is the one asset a competitor can
    trivially reverse-image-search.

## renders/

The generated product renders the hero reel is cut from.

`exploded-frames.png` is the one the site actually uses:
scripts/build-reel-frames.mjs cuts its thirteen tiles into public/reel/. Re-run
that script after replacing it and the reel picks up the new frames — the crop
rectangles live in the script, not in an image editor.

Three of these are not on the site, and two of them should stay off it:

  - `storyboard.png` — a shot list for an animation, not artwork. Kept as the
    brief it is.
  - `exploded-infographic.png` — reads "SODIMM DDR5 memory". Refurbished
    business laptops of the generation we source are DDR4. It is a specific,
    checkable, wrong specification claim, which under markedsføringsloven §13
    is ours to document the moment we publish it.
  - `desk-mockup.png` — the laptop on the desk is showing a Kestro website
    that does not exist: different navigation, different headline, English
    only. A picture of a company's own site that is not its own site is the
    one image on a page a visitor can disprove instantly.

If any of these is ever wanted on the site, the fix is a new render, not a
smaller crop.

## The customer-journey set

Six frames uploaded as a replacement for the reel — a buyer wondering where to
shop, an adviser, a technician, packing, delivery, a happy team. They are not
on the site, and none of them can go on it as they stand.

  - **The logo is not ours.** Every frame carries a wheat-or-leaf mark and a
    lowercase "kestro" — on the polo shirts, the backdrop, the mug, the boxes,
    the van. The site's header shows the K. One page cannot show a company two
    marks and be believed about anything else.
  - **They show a company that does not exist.** A staffed advice desk, a
    workshop with racking, a branded delivery van, a boardroom of colleagues.
    Kestro is two people who source per order. Depicting a workforce and a
    fleet is not decoration, it is a claim about the business, and under
    markedsføringsloven §5 it is the kind of claim that has to be true.
  - **The captions are burnt into the pixels, in English only.** The site is
    Danish and English from one source. Text inside an image cannot be
    translated, cannot be selected, cannot be read aloud, and cannot be
    indexed. Two of them ("Great price", "Fast and secure delivery") are also
    claims we removed from the copy on purpose.

What would make a set like this usable, in order of how much it matters: the
correct mark; no staff, premises or vehicles we do not have; and no text inside
the frame — captions belong in lib/reel-frames.ts, where they exist in both
languages and link to the page that documents them.

Once a corrected set exists, dropping it in is one run of
scripts/build-reel-frames.mjs and one edit to the id list in lib/reel-view.json
and lib/reel-frames.ts.

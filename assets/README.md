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

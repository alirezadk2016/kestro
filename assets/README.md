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
    assets/photos/     photographs — workshop, machines, packing
    assets/team/       one portrait per person, named after their id
    assets/brand/      brand board, colour references, type specimens

## assets/team/

One file per person, named after the `id` in `lib/company.ts`:

    assets/team/ismail-masoumabadi.jpg
    assets/team/mehdi.jpg

Then run:

    node scripts/build-team-photos.mjs

That writes `public/team/<id>.webp` at 320×320 and rewrites
`lib/team-photos.json`. The site reads that file, so a person with no
photograph on disk renders as a monogram instead of a broken image, and gets a
face the moment the file lands — there is nothing to edit in the code.

The crop is square and anchored at the top, which is the crop a portrait
survives; a centred square crop takes the forehead off. Send the original off
the phone, not a screenshot of it.

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

## renders/journey/

The six frames the hero carousel runs on: the question a buyer starts with,
the conversation, the workshop, packing, delivery, the desks in use.

scripts/build-reel-frames.mjs cuts them into public/reel/. Re-run it after
replacing any of them.

### What the script removes, and why

Each source frame has a numbered badge and a caption bar burnt into the bottom
of the picture. The script measures where they start — the bar is not at the
same height in every frame, because a two-line caption starts higher than a
one-line one — and crops above them.

That is not tidying. Text inside an image cannot be translated, selected, read
aloud, or indexed, and this site is Danish and English from one source. The
captions the carousel shows live in lib/reel-frames.ts, in both languages, each
linked to the page that documents it. Two of the burnt-in ones were also claims
the copy does not make: "Great price", and "Fast and secure delivery" — the
delivery caption now says the timeframe is given before you order, which is
what /ydelser/levering actually says.

### What is still wrong with them

Cropping cannot reach these. They are in the pictures themselves, and the fix
is a new render, not a smaller crop.

  - **The logo is not ours.** Five of the six carry a wheat-or-leaf mark with a
    lowercase "kestro" — on the backdrop, the polo shirts, the boxes, the van,
    the meeting-room screen. The site's header shows the K. Both appear on
    screen at once on the front page. A visitor who notices is being told the
    site does not know its own name, and that is a bad thing to be wondering
    while reading a page whose argument is that we write everything down
    accurately.
  - **Two frames still carry English text in the picture.** Frame 1's speech
    bubble and frame 2's "Great quality / Great price / Reliable support" card
    sit in the middle of the composition, so a Danish visitor reads English
    inside the image and a Danish caption beside it.
  - **They show a company that does not exist yet.** A staffed advice desk, a
    warehouse with racking, a branded delivery van, a boardroom of colleagues.
    Kestro is two people who source per order. Depicting a workforce and a
    fleet is not decoration, it is a claim about the business, and under
    markedsføringsloven §5 it is the kind of claim that has to be true.

A corrected set needs, in order of how much it matters: the K mark; no text
inside the frame; and no staff, premises or vehicles the company does not have.
Dropping one in is a run of scripts/build-reel-frames.mjs and an edit to the id
lists in lib/reel-view.json and lib/reel-frames.ts.

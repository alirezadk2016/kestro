# Kestro — artwork brief: category cards, exploded view, fleet room

Six images. One set, one light, one grade. Written to be re-runnable: if a
render has to be redone in six months it must come back matching, so the style
block below is copied verbatim into every prompt and only the SUBJECT line
changes. That is the whole discipline — a set is made by locking the lighting,
the lens and the grade, not by generating six nice pictures.

## Why these are being replaced

The four category cards are generic "product floating in a blue glow" renders.
All four share the same lighting, the same pool of saturated blue and the same
three-quarter float, so the row reads as stock rather than as this company —
and none of them belongs to the hero photograph directly above them.

## The light, measured off the hero plate rather than guessed

Sampled from `public/hero/scene.webp` (2600x1071):

| zone                | hex       | luminance |
| ------------------- | --------- | --------- |
| shadow, left wall   | `#00040a` | 4         |
| stone desk, mid     | `#1e2938` | 40        |
| lit concrete pillar | `#4d473c` | 71        |
| window, blue hour   | `#708baa` | 135       |
| water               | `#627a95` | 119       |
| laptop body         | `#161e25` | 29        |

Mean luminance of the whole plate: **39/255**. It is a low-key image.

The finding that matters: **the key light is warm and the fill is cool.** The
concrete the key falls on is `#4d473c` — a warm grey — while the ambient
through the glazing is `#708baa`, blue hour. The current cards are lit with one
saturated blue from everywhere, which is exactly why they look pasted on. Warm
tungsten key, cool blue-hour fill, near-black shadow. Brand blue `#1E40FF`
appears only as a screen glow or an edge accent, never as the room light.

## Rendered sizes, measured in the browser at 1440px

| asset            | file     | rendered    | note                                                                                                                         |
| ---------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 4 category cards | 1000x565 | **290x163** | subject must fill ~70% of the width or it is mush                                                                            |
| exploded view    | 880x1176 | **164x219** | four layers at 164px wide: separation has to be extreme                                                                      |
| fleet room       | 1100x733 | **290x521** | **the source is 3:2 landscape and the slot is 0.56 portrait** — the sides are being thrown away. Generate this one portrait. |

That last row is a defect in the current asset, not a preference.

## Locked style block — verbatim in every prompt

> Low-key architectural product photography, blue-hour Nordic office. Warm
> tungsten key from camera left raking across the subject, cool blue-hour
> window fill from camera right, near-black background falling to #00040a.
> Dark honed stone surface #1e2938 with a soft specular reflection under the
> subject. 100mm macro, f/5.6, shot at desk height. Restrained, filmic,
> desaturated blue-grey grade, deep shadows, no lift in the blacks. Visible
> material texture — brushed magnesium, matte soft-touch plastic, honed stone.
> Editorial commercial photography, sharp focus, grounded contact shadow.

Negative, every prompt: `no logos, no brand marks, no text, no watermark, no
lens flare, no HDR halos, no oversaturated blue, no floating objects, no
plastic CGI look, no cluttered background`.

## Subjects

1. **cat-laptops** (16:9) — one open business laptop, three-quarter from front
   left, black soft-touch chassis, matte 14" display dark with a faint
   `#1E40FF` wave, squared-off lid, classic raised-key layout.
2. **cat-desktops** (16:9) — one small form-factor desktop tower standing on
   the stone, front ports visible, one blue power LED.
3. **cat-monitors** (16:9) — two 24" monitors side by side, slight inward
   angle, thin bezels, a dock and one cable in front of them.
4. **cat-fleet** (16:9) — six identical closed laptops stacked in two neat
   columns of three, edge-on, the stack lit from the left.
5. **exploded** (3:4) — one business laptop separated into four horizontal
   layers with wide air between them: display panel, keyboard deck,
   mainboard with visible heat pipe and two memory modules, base plate.
   Layers lit individually so each edge separates against black.
6. **fleet-room** (**2:3 portrait, not landscape**) — a long bench of
   identical prepared laptops receding from the camera, lids open, screens
   dark, the room falling to black behind. Subject in the **top two-thirds**:
   the bottom third of this frame is covered by a gradient and the card's
   heading.

## Rules this set may not break

- No manufacturer logo, wordmark or model badge anywhere, and specifically no
  red pointing-stick nub between the G, H and B keys. The silhouette may read
  as a classic business laptop — squared black chassis, raised keys, a thick
  hinge — because that is genuinely what this category looks like. The
  identification may not: the footer of this site states that Kestro is not
  affiliated with Lenovo, HP, Dell, Apple or Microsoft, and a render carrying
  a maker's cue would be the page contradicting its own disclaimer. A model
  asked for "ThinkPad-like" reaches for the red nub first, so it is named here
  as a negative rather than left to chance.
- No invented interface. Screens are dark or carry an abstract wave, never a
  fake OS, never a fake dashboard, never text.
- No people. This is equipment, and a stock-looking person would undo the rest.
- Nothing floats. Everything sits on the stone with a contact shadow.

## Production settings

Higgsfield `gpt_image_2_5`, variant `flare`.

| setting      | value                                                                            | why                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| quality      | `medium`                                                                         | `low` is the default and is what the first test pass used. `high` is 3 credits against `medium`'s 1.5, and at 290x163 rendered the difference does not reach the screen. |
| resolution   | `2k`                                                                             | The card slot is 290px wide and drawn at 2x on a retina display; 2k leaves headroom for the fleet frame, which is cropped hard.                                          |
| aspect_ratio | `16:9` for the four cards, `3:4` for the exploded view, `2:3` for the fleet room | The fleet slot renders at 290x521, which is portrait. The current asset is 3:2 landscape and is having its sides thrown away.                                            |

Six images at `medium`/`2k` is 9 credits.

## Known constraint on this workstation

Higgsfield returns results on `d8j0ntlcm91z4.cloudfront.net`, which this
environment's egress proxy refuses (403 on CONNECT). Renders can be commissioned
from here and they appear in the user's widget, but they cannot be fetched,
inspected or written into `public/` from here. The route that works is the one
used for the hero plate: the user downloads from the widget and commits the file
to the repo, and the integration happens against the committed asset.

That is why the first pass is two variants of one subject rather than six
subjects: the style block has to be confirmed by someone who can see it before
the remaining renders are paid for.

## Measured state of the assets being replaced

`node scripts/build/check-cards.mjs`, run against the six files in
`public/cards` before any of them were replaced:

```
cat-laptops.webp     1000x565  ratio 1.770  mean L  21.2  highlight r-b  -80.7  sd@render 23.5
cat-desktops.webp    1000x565  ratio 1.770  mean L  29.3  highlight r-b  -97.4  sd@render 25.2
cat-monitors.webp    1000x565  ratio 1.770  mean L  31.0  highlight r-b  -79.5  sd@render 27.5
cat-fleet.webp       1000x565  ratio 1.770  mean L  28.5  highlight r-b -108.7  sd@render 22.9
exploded.webp         880x1176 ratio 0.748  mean L  34.5  highlight r-b  -42.7  sd@render 34.5
fleet-scene.webp     1100x733  ratio 1.501  mean L  64.1  highlight r-b  -63.8  sd@render 50.7
```

`highlight r-b` is red minus blue averaged over everything brighter than 150.
**All six are negative, four of them heavily** — the brightest part of every
card is blue. The hero's key light falls on concrete at `#4d473c`, which is
warm. That single number is what "they look pasted onto the page" means when
it stops being a matter of taste, and it is the thing the replacements have to
fix.

The other two findings confirm what the browser measurement showed: the fleet
asset is 1.501 against a slot that wants 0.667, and at mean luminance 64 it is
also the one image that does not live in the hero's exposure.

## What was built instead

The six renders were commissioned from an image generator and the generator's
CDN is unreachable from this machine — the host is blocked at the proxy, and
routing around it is not on the table. So the artwork was drawn rather than
bought, which turns out to be the better answer on every count the brief
cares about:

- **The light can be matched on purpose.** The grounds are cut from
  `public/hero/scene.webp` itself, between 30% and 60% across the plate. That
  band is the lit concrete, the one part of the scene whose highlights measure
  warm. The drawing on top is lit from the same direction — warm key on the
  left, cool fill on the right — because the gradients say so, not because a
  model happened to agree.
- **Nothing is invented.** No logo, no maker's badge, no red nub, no screen
  interface, no text in the pixels. The four category cards are one object
  each; the teardown and the fleet room are drawn to the alt text the page
  already carries, rather than the alt text being rewritten to match a
  picture.
- **It is reproducible.** `npm run build:cards` re-renders all six from
  `scripts/build/cards/`. The artwork is a file in the repository that can be
  changed, not an asset nobody can regenerate.

The projection is a true isometric. Objects are near-opaque with gradient
faces and contact shadows: drawn translucent and flat, as the first passes
were, a four-layer teardown and a room of desks read as wireframe soup rather
than as things.

### The second pass: they were lifeless

The first version passed every number in the checker and still looked like
nothing: mid-grey boxes with a uniform hairline all the way round, sitting on
a blurred photograph that read as smudge. Passing the measurements is not the
same as being good, and the measurements were a proxy for the problem, not the
problem.

What changed, and why each one matters:

- **Graphite, not grey.** A mid-grey body with a mid-grey edge is a clay
  render. A near-black body with a hot cream edge is a product shot. The light
  does not land on the faces; it catches the edges, and the faces stay dark.
- **Every edge is weighted by where the light is.** A box stroked at one value
  the whole way round is clip art — the tell is that the edge running away
  from the light is as bright as the edge facing it, which happens in no
  photograph ever taken. The upper-left silhouette takes the key full on; the
  far side gets a cool kicker whose only job is to separate a near-black
  object from a near-black room; the rest falls away.
- **The screens emit.** The same shape, blurred and bright underneath the
  panel, is what the eye reads as a lit display. Without it a screen is a blue
  rectangle painted on a dark box.
- **A stage, a floor and a reflection.** One warm pool behind the object, a
  floor that arrives rather than starting at a hard line, and the drawing
  mirrored about its own foot and faded out. The reflection is the cheapest
  thing that separates a product shot from a diagram — and it showed nothing
  at first because the contact shadow was being mirrored along with the
  object, landing on top of the bright edges it was meant to be reflecting.
- **The photograph is texture now, not subject.** At full strength it competed
  with the object and lost; at a third opacity and heavy blur it is the grain
  of a room rather than a picture of one.
- **The tower turned to face the room.** Seen edge-on it was a narrow column
  in a 16:9 frame and measured 14.3 on local contrast — mush. Front-on, with
  a recessed intake well to be light against, it fills the same frame and
  measures 19.3.

One rule in the checker changed with it. The warmth test now ignores emissive
pixels: a lit screen is supposed to be the brightest blue thing in the frame,
and if a powered display counted against the test, the only way to pass would
be to stop drawing screens that are switched on. The test is about where the
key light comes from, which is what it was always for.

### The third pass: rendered, not drawn

The drawings were lit correctly and still read as diagrams, because a drawing
has no material — nothing on it is reflecting a room. `lib/laptop-scene.mjs`
already said exactly this about the hero's own model: _"metal with nothing to
reflect renders as flat grey however many lights are pointed at it — this is
the difference between a diagram and a product shot."_

So the cards are rendered now, in that same studio, off that same laptop where
the subject is a laptop. `scripts/build/cards3d/render3d.mjs` draws each
subject as real geometry with real PBR materials, a real cast shadow and a
real camera, on a transparent ground; `scripts/build/cards/render.mjs` then
composites it over the artboard's hero crop, warm pool, floor and grain. The
light stays measured off the photograph; the subject is now lit rather than
shaded.

Two things had to be learned the hard way again:

- **The hero hangs the lid on `rotation.z`.** Rotating it about `x` sent the
  lid down through the base and blew up every bounding box measured off it,
  which is why the first fleet stack was five laptops spread over a column
  three times too tall.
- **A warm softbox was added to the studio, and then pulled most of the way
  back.** The fleet card is five blue-black lids at metalness 0.55, and the
  hero's studio is all cool panels because the hero sits on a blue-lit
  photograph — so those faces had only blue to reflect. One warm overhead
  panel fixes it. At the intensity that made the measurement go green it also
  turned a blue-black tower brass, which is the whole failure mode of tuning
  a picture to a number instead of looking at it. It sits at a third of that.

### Measured, after

```
cat-laptops.webp     1200x675  ratio 1.778  mean L  31.6  highlight r-b  -2.7  sd@render 28.1
cat-desktops.webp    1200x675  ratio 1.778  mean L  27.2  highlight r-b   0.0  sd@render 20.1
cat-monitors.webp    1200x675  ratio 1.778  mean L  32.8  highlight r-b   n/a  sd@render 30.8
cat-fleet.webp       1200x675  ratio 1.778  mean L  31.9  highlight r-b -25.9  sd@render 32.4
exploded.webp         900x1200 ratio 0.750  mean L  27.3  highlight r-b   n/a  sd@render 18.9
fleet-scene.webp      900x1350 ratio 0.667  mean L  22.5  highlight r-b   n/a  sd@render 18.5
```

**`cat-fleet` fails the warmth test at -25.9, and it is left failing.** The
card is a stack of five closed machines, and a closed machine is a lid: the
model's chassis material, which is blue-black. The key light on that card is
the same warm key as on the other five, which measure 0.0 and better under it.
What the test is picking up is the product's own colour, not the light in the
room. Faking it would mean either gold-plating the hardware or quietly moving
the threshold, and the number is more useful telling the truth. It is listed
here so nobody reads a red line as an unnoticed regression.

`fleet-scene`'s local contrast is measured over its top 62% now. That card is
a backdrop: its lower half is ramped to near-black on purpose so a heading has
something to sit on, and measuring "is the subject mush" across a region that
is deliberately black measures the ramp rather than the artwork.

## Handover

1. `node scripts/build/cards3d/render3d.mjs public/cards/3d` re-renders the
   subjects; `npm run build:cards` then composites and re-measures them
   and re-measures them against the numbers above.
2. `npm run verify` before committing: two of these sit under text, and the
   contrast check is what catches a card that got too light.
3. If real product photography is ever shot, it replaces the drawings at the
   same six paths and sizes. The checker is the acceptance test.

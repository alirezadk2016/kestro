# Laptop Product and Service Views

The repair-page viewer described below was retired on 27 October 2026.
`RepairPhotoSequence.tsx` now presents four synchronized illustrative service
photographs with native step selection on every screen. Its current brief is
[`repair-photo-sequence.md`](repair-photo-sequence.md). The shared model and
render utilities remain available for the homepage still and other product
views; the legacy repair choreography below is historical build documentation.

## Scope

The homepage is deliberately quiet: `ExampleMachine.tsx` renders a static,
assembled illustration. There is no WebGL, sticky story or scroll-driven
teardown in that section. The main homepage hero is independent and unchanged.

The workshop header at `/reparation` and `/en/repairs` uses `LaptopAssembly.tsx`
on desktop (1024px and above). Below that breakpoint the entire viewer,
including poster and controls, is absent from the layout. A media-scoped
picture source prevents mobile poster downloads, even without JavaScript;
the renderer's media-query guard prevents Three.js and texture downloads.
Resizing below the breakpoint disposes an active renderer.
Its initial poster and interactive state show the assembled laptop from the
front. Teardown starts only when the visitor selects service mode or moves
the range input; activating 3D does not jump straight to loose components. Pointer hover
adds a restrained, damped response; dragging or arrow keys rotates the camera.
The assembled/service icon buttons and native range input control teardown.
The page's wheel scrolling is never captured. The reset icon restores the
viewing angle without changing the assembly state.

Existing copy, SEO, service links, contact form and catalogue assets are intact.

## Mechanical Choreography

`laptop-assembly-model.mjs` keeps serviceable components as independent meshes,
with a thinner enclosure and keycaps. The lid pivots around the hinge; the
intact device lifts clear of the surface and turns to its service side before
any parts are removed. Captive
screws loosen along their own axes and remain with the bottom cover. The cover
first lifts clear, then parks nearly flat behind the device. It does not stand
upright like a detached display or obscure the service area.

Memory modules tilt around their connector edges before being extracted.
Storage slides out of its connector before lifting. The internal battery and
cooling assembly release later. The motherboard, soldered chips, display,
touchpad and keyboard remain intact: keys do not float off their keyboard.
Reversing the control reverses the same continuous sequence.

Transforms never animate part scale. The camera fits the complete motion
envelope once per viewing angle/aspect rather than zooming to each pose.
Convex hulls of transformed mesh bounds keep framing tight without treating
empty corners of a global bounding box as hardware. Deliberate camera elevation
and target changes accompany the service-side turn. Pointer rotation and hover
are damped; teardown uses an interruptible, critically damped timeline and
quintic phase transitions, without elastic bounce. `laptop-motion.mjs` holds
the exact damped step and endpoint stops; its timing is checked at 15, 30, 60
and 120fps, including continuous retargeting.

## Rendering and Fallbacks

`laptop-assembly-scene.mjs` supplies studio lighting, physical materials,
reflections and adaptive-resolution shadows, updated only when hardware moves.
The renderer loads near the
workshop header, pauses offscreen/when hidden and sleeps when settled.
Reduced motion, data saving, missing WebGL and context loss retain the assembled
poster. The control row reserves its space but is invisible and disabled when
the renderer is unavailable. The static homepage always works without JS.

`npm run build:assembly` exports both `public/models/laptop-assembly.webp`
(assembled) and `public/models/laptop-service.webp` (service). It checks pixels
at eleven phases, invariant part scales/lens distance, 84 keycaps and 32 camera
framing cases. Set `ASSEMBLY_PREVIEW_DIR` to export the reviewed poses. The
renderer requires Playwright and Chromium, with the existing environment
variable overrides. `--check` verifies without writing assets.
`--repair-only` exports only `public/models/laptop-repair.webp`, the workshop's
assembled initial view. This matches the viewer's lens and lighting without
changing the homepage still or re-exporting shared textures.

## Artwork and Hardware References

The `assets/artwork/thinkpad-*-reference.png` masters are original generated
studies approved during the design review, not manufacturer photography.
Quality-84 WebP atlases are exported at their original dimensions without
cropping; original PNG masters are retained. The keyboard atlas
supplies US key legends; selected regions of the internal study supply RAM
and SSD surface detail. These remain genuine 3D meshes, not photograph layers.

Proportions and service relationships were informed by the existing local
product photographs and the official
[Lenovo T480 service manual](https://download.lenovo.com/pccbbs/mobiles_pdf/t480_hmm_en.pdf).
The manual's photographs are not redistributed. This is a simplified service
illustration, not engineering-validated T480 CAD, a repair instruction or a
promise of a supplied configuration. Optional storage, board, keyboard and
battery configurations vary. The catalogue retains its real photographs,
specifications and existing GLBs.

The display uses the original generated Scandinavian landscape in
`assets/artwork/laptop-wallpaper.png`, exported at 1536x960, quality 80, to
`public/models/laptop-wallpaper.webp`.
Both 1200x1200 posters use quality 86. All WebP exports use effort 6.

Original prompt: "Photorealistic Scandinavian desktop wallpaper, not a laptop
image. Angular granite mountains and a still Norwegian fjord, mineral rock
detail, remnant snow, deep blue foreground water and naturally softened distant
peaks. Blue-hour daylight, pale cool horizon, subtle warm light grazing a ridge.
Restrained 16:10 landscape photography. No people, buildings, devices, frames,
typography, logos, watermark, icons, interface, neon glow or oversaturation."

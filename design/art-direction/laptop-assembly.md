# Homepage Laptop Assembly

The typical-machine section uses a scroll-controlled Three.js assembly inspired
by the supplied product assembly video. The homepage hero is independent and
unchanged by this implementation.

`ExampleMachine.tsx` retains the bilingual copy and real catalogue link.
`LaptopAssembly.tsx` supplies the responsive scene and desktop sticky stage.
`laptop-assembly-model.mjs` builds an independent detailed device: rounded
anodized-metal panels, sculpted instanced keycaps and Nordic legends, ports,
glass touchpad, webcam shutter, hinges, PCB traces and solder, fan, copper
heatpipes, SO-DIMM modules, NVMe storage, battery pouches and bottom-cover screws.
`laptop-assembly-scene.mjs` supplies physical materials, studio reflections,
adaptive-resolution self-shadows and a soft contact shadow. The illustration
is not an exact model specification. The catalogue's GLBs and photographs are
unchanged.

Scroll progress closes the layers, with the reverse scroll reopening them.
The renderer is imported near the section, pauses outside the viewport and
when hidden, and sleeps after its camera and parts settle. Reduced motion,
data saving and unavailable WebGL retain the static poster.

Run `npm run build:assembly` to regenerate `public/models/laptop-assembly.webp`
from the exact same scene. The renderer needs Playwright and Chromium, using
the same environment variables supported by the existing verification tools.
The export checks canvas pixels and framing before writing the poster.
Set `ASSEMBLY_PREVIEW_DIR` to export every checked phase and render-cost data.

## Display Artwork

`assets/artwork/laptop-wallpaper.png` is an original built-in imagegen image,
exported at 1536x960, quality 88, to `public/models/laptop-wallpaper.webp`.
It is loaded only when the assembly enters the viewport's loading margin.

Prompt: "Photorealistic Scandinavian desktop wallpaper, not a laptop image.
Angular granite mountains and a still Norwegian fjord, mineral rock detail,
remnant snow, deep blue foreground water and naturally softened distant peaks.
Blue-hour daylight, pale cool horizon, subtle warm light grazing a ridge.
Restrained 16:10 landscape photography. No people, buildings, devices, frames,
typography, logos, watermark, icons, interface, neon glow or oversaturation."

# Homepage Laptop Assembly

The typical-machine section uses a scroll-controlled Three.js assembly inspired
by the supplied product assembly video. The homepage hero is independent and
unchanged by this implementation.

`ExampleMachine.tsx` retains the bilingual copy and real catalogue link.
`LaptopAssembly.tsx` supplies the responsive scene, desktop sticky stage and
mobile visual track. Horizontal drag rotates the camera without consuming
vertical page scrolling; arrow keys and Home provide a keyboard alternative.
The localized reset control restores the initial camera angle.
`laptop-assembly-model.mjs` builds an independent detailed device: rounded
matte black soft-touch panels, sculpted instanced keycaps with reference-based
US legends, red TrackPoint, ports, Mylar-style touchpad, webcam shutter, hinges,
PCB traces and solder, radial fan, single copper heatpipe, two SO-DIMM modules,
storage caddy and NVMe illustration, internal and removable batteries, speakers
and bottom-cover screws. `laptop-keyboard.mjs` maps the approved keyboard artwork
onto 84 independent keycaps rather than placing one photograph over a flat plane.
`laptop-assembly-scene.mjs` supplies physical materials, studio reflections,
adaptive-resolution self-shadows and a soft contact shadow. The illustration
is not engineering-validated ThinkPad CAD or a promise of a supplied
configuration. The catalogue's GLBs and photographs are unchanged.

Scroll progress starts assembled and separates the enclosure, keyboard,
display layers and serviceable components in stages. Reverse scrolling
reassembles them. Soldered components remain attached to the board.
Camera distance fits the assembly bounds at every phase and viewing angle.
The renderer is imported near the section, pauses outside the viewport and
when hidden, and sleeps after its camera and parts settle. Reduced motion,
data saving and unavailable WebGL retain the static poster.

Run `npm run build:assembly` to regenerate `public/models/laptop-assembly.webp`
from the exact same scene. The renderer needs Playwright and Chromium, using
the same environment variables supported by the existing verification tools.
The export checks canvas pixels and framing before writing the poster.
Set `ASSEMBLY_PREVIEW_DIR` to export every checked phase and render-cost data.

## Hardware References

The two `assets/artwork/thinkpad-*-reference.png` masters are original generated
studies approved during the design review, not manufacturer photography.
Their corresponding WebP atlases are exported at quality 94 without cropping.
The internal study informed materials and layout; selected UV regions supply
RAM and SSD surface detail. Physical meshes remain independently animated.

Proportions and service-part relationships were checked against the official
[Lenovo T480 service manual](https://download.lenovo.com/pccbbs/mobiles_pdf/t480_hmm_en.pdf)
and existing local product photographs. The manual's photographs are not
redistributed. This remains a simplified illustration: optional motherboard,
storage, keyboard and battery configurations vary.

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

# Homepage Laptop Assembly

The typical-machine section uses a scroll-controlled Three.js assembly inspired
by the supplied product assembly video. The homepage hero is independent and
unchanged by this implementation.

`ExampleMachine.tsx` retains the bilingual copy and real catalogue link.
`LaptopAssembly.tsx` supplies the responsive scene and desktop sticky stage.
`laptop-assembly-scene.mjs` reuses the existing GLB exterior and adds illustrative
memory, storage, cooling, battery and base layers. The picture is identified as
an illustration; the catalogue's actual model photographs are unchanged.

Scroll progress closes the layers, with the reverse scroll reopening them.
The renderer is imported near the section, pauses outside the viewport and
when hidden, and sleeps after its camera and parts settle. Reduced motion,
data saving and unavailable WebGL retain the static poster.

Run `npm run build:assembly` to regenerate `public/models/laptop-assembly.webp`
from the exact same scene. The renderer needs Playwright and Chromium, using
the same environment variables supported by the existing verification tools.
The export checks canvas pixels and framing before writing the poster.

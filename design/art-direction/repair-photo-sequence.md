# Repair Hero: Photographic RAM Sequence

This macro-gallery direction was rejected by the owner after publication on
27 October 2026. Its functional and continuity checks did not establish brand
fit or compositional quality. The corrective direction is documented in
[`repair-workbench.md`](repair-workbench.md); the record below is historical.

## Scope and intent

Replace the repair page's interactive laptop render with a photographic example
of a RAM replacement. A visitor needs to recognise careful, practical computer
service and reach the repair enquiry action. The sequence supports that decision;
it is not an installation manual or documentation of a customer repair.

Keep the existing Kestro palette, Plus Jakarta Sans, page heading, primary action,
routes and surrounding service content. Use four native radio controls and CSS
to change the photograph and caption. No WebGL, rotation, draggable model,
disassembly slider, automatic playback or JavaScript is needed for this sequence.

## Baseline audit and reasons

This baseline is a source and artwork review, not a measured browser assessment.
The preceding hero used a six-column/six-column split and a square 3D viewport.
The asset showed a complete laptop with an illuminated landscape wallpaper;
controls offered an assembled view, service parts, separation and orbit reset.

The laptop read as a synthetic product demonstration rather than physical
repair work. The square framing allocated substantial space around a floating
device. Its interaction taught visitors how to manipulate a viewer, while the
page's real task was to describe a computer problem. Swapping only the raster
inside that same frame would preserve the problem.

The practical guide photographs supply a more appropriate material vocabulary:
charcoal antistatic mat, matte black chassis, blue circuit board, natural green
RAM and restrained neutral light. The new sequence derives from one master
scene so that those materials belong to the same machine across all four states.

## Composition and hierarchy

- Desktop: five columns of copy and seven columns of photography. Give the
  repair bay enough width to recognise the socket, module and retaining hardware.
- Use the tight 4:3 landscape service-bay photograph as the dominant visual.
  The crop deliberately concentrates on the socket and surrounding mat; it does
  not show the full chassis, keyboard, screen or removed cover beside the machine.
  Preserve this native crop;
  do not put it inside the old square product-viewer viewport or add a faux
  application toolbar.
- Keep the existing repair enquiry action in the copy column. The stage controls
  remain visually secondary and sit immediately below the photograph.
- Show one stage caption below its selector row. Each caption explains only the
  visible change, using one or two short sentences.
- Default to the open, installed-original state. It communicates repair more
  directly than an anonymous closed underside, while stage 1 remains available.
- On phones, stack copy, action and full-width photograph. The implementation
  retains four columns of concise stage labels; verify that they remain readable
  at the narrowest supported width. Do not force a viewport-height scene or
  depend on horizontal swiping.
- Keep the hardware in the photograph and all text in HTML. Use the existing
  navy surfaces and blue selection accent; do not add glow, technical overlays,
  decorative status badges or simulated diagnostics.

## Stage contract

| Value       | Danish short label | English short label | Visible physical state                                        |
| ----------- | ------------------ | ------------------- | ------------------------------------------------------------- |
| `cover`     | Dæksel             | Cover               | Matching cover encloses the same cropped service area.        |
| `open`      | Adgang             | Open                | Cover removed; original green module seated in the socket.    |
| `removed`   | RAM ud             | Remove              | Socket empty; original green module rests flat on the mat.    |
| `installed` | Ny RAM             | Fit                 | Replacement seated; original green module remains on the mat. |

The imagery ends with the replacement installed. Do not label the final image
as reassembled, powered on or tested: those actions are not shown. Avoid capacity
figures or exact-model claims that cannot be established from an illustrative
photograph.

The visible disclosure appears once: “AI-genereret illustration. Opbygningen
varierer efter model.” / “AI-generated illustration. Layout varies by model.”
Do not describe the scene as a photograph of Kestro's workshop or of an actual
customer machine.

## Interaction and accessibility

The sequence wrapper is `[data-repair-sequence]`. Four native radios have the
values `cover`, `open`, `removed` and `installed`, with `open` initially checked.
Use a labelled group and labels associated through each radio's `id`. A label
must offer a minimum 44px target and an unmistakable checked and focus-visible
state. Native arrow keys and label activation must work with JavaScript disabled.

The image area is `[data-repair-frame]`; each image belongs to
`[data-repair-panel="stage-value"]`. Captions sit in a separate shared container
below the controls and are keyed by `[data-repair-caption="stage-value"]`.
Inactive panels and captions use `display: none` so they do not contribute
duplicate readable content. The disclosure is `[data-repair-disclosure]`.
These hooks support browser verification without coupling checks to visual copy.

Reserve the image's aspect ratio to avoid layout movement. A subtle opacity
transition is optional; respect reduced motion and never interpolate the laptop's
geometry between photographs.

## Artwork acceptance criteria

The current master is a tight service-bay crop. Battery disconnection and the
complete laptop exterior are outside the frame and cannot be inspected. Do not
claim that the photograph visibly establishes those details.

- Preserve the exact camera angle, crop, scale, light direction, mat texture,
  screwdriver placement and contact shadows between states.
- Keep visible chassis edges, screw positions, blue board routing, fan and
  surrounding components fixed. Edits should change only the intended service
  state and the objects physically moved by it.
- Match the cover to the visible chassis geometry. A cover must rest on or attach
  to the machine; it must not hover above it.
- Maintain the socket's black rails and metal side hardware when the original
  module is removed. The empty state must not invent another motherboard.
- Installed modules sit flat in a credible socket with retained side edges and
  their connector contacts hidden in the socket. Detached modules lie flat on the
  mat with credible scale and contact shadows.
- The removed original remains in the same mat position in stages 3 and 4. The
  replacement must not appear both installed and detached in the final state.
- Avoid people, hands, floating parts, glowing internals, powered-open operation,
  diagrams, invented labels, branding and legible fictional specifications.
- Keep mechanically important shapes sharp. Photo texture should read as matte
  plastic, circuit board, metal and fabric rather than uniformly glossy CGI.

## Observed artwork review and verification status

All four PNG masters and their saved 1200 × 900 WebP delivery copies were visually
reviewed on 27 October 2026. The service-bay
crop, visible chassis, tools and neutral lighting remain recognisably consistent.
The closed cover encloses the same region; the open frame presents the green
module; the removed frame exposes the socket and places that module on the mat;
the installed frame adds a black replacement while retaining the removed green
module in its mat position. Materials and contact shadows read naturally. No
material continuity or floating-part issue was identified in the inspected artwork.

This is a visual review of illustrative anatomy, not a compatibility, pin-count
or exact-model assessment.

The refreshed Danish browser screenshots were visually reviewed at 1440 × 1000
(desktop), 1920 × 1080 (wide) and 390 × 844 (mobile), using the three overview
captures under `outputs/repair-photo-redesign/` in the task workspace. All four
mobile stage captures and the desktop installed-state capture were also checked.
The five/seven desktop composition gives the repair image clear emphasis while
keeping the enquiry action prominent. On mobile, copy and the full-width enquiry
action precede the photograph; four stage controls fit their row without clipped
labels. The active state, stage caption and AI disclosure remain readable. The
hardware changes remain recognisable at displayed size, with no material
naturalness issue, text collision or broken image crop identified. Visual
composition and artwork QC pass for these reviewed captures.

English browser presentation, native keyboard controls, no-JavaScript behaviour,
reduced motion, automated overflow checks and the full repository gate are
verified separately. That test gate is pending at the time of this visual review.
This brief does not assign a final quality score or claim that the gate has passed.

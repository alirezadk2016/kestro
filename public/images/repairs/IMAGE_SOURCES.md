# Repair sequence image origins

## Status

Created on 27 October 2026 with the built-in imagegen tool. All four selected
PNG masters received a visual review and were exported as 1200 × 900 WebP
delivery copies at quality 86. Conversion resizes and reencodes only; it does
not alter the scene. The delivery files are approximately 165–190 kB each.

## Origin and permitted interpretation

These assets are AI-generated illustrative photographs, made with the built-in
imagegen tool. They are not photographs of Kestro premises, customer devices or
a repair performed by Kestro. They do not identify an exact laptop model and
must not be presented as a model-specific service procedure.

The visual source is `public/images/practical/ram.webp`, created on 17 October 2026. Its original generation notes are in
[`../practical/IMAGE_SOURCES.md`](../practical/IMAGE_SOURCES.md). On 27 October
2026, an imagegen edit produced a new open-laptop master with a green RAM module
installed in the service bay. The other sequence states derive from that new
master, with the removed state also informing the final installed state, to
preserve the machine, camera, tools and lighting.

New open-master generation artifact:
`exec-1ef3b43e-ae36-4d05-9fa0-0282c1eb6473.png`.

## Intended delivery assets

| File                    | State                                                      | Source relationship                                                                 |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ram-01-cover.webp`     | Matching cover fitted over the service bay                 | Edit derived from the new open master.                                              |
| `ram-02-open.webp`      | Original green RAM module installed, service bay open      | New open master.                                                                    |
| `ram-03-removed.webp`   | Empty socket; original green module resting on the mat     | Edit derived from the new open master.                                              |
| `ram-04-installed.webp` | Replacement installed; removed original remains on the mat | Edit derived from the new open master and the removed-state reference where needed. |

## Generation record

The following generated masters were inspected on 27 October 2026:

| State                    | Generation artifact                             |
| ------------------------ | ----------------------------------------------- |
| Cover fitted             | `exec-9028fc99-1be4-4172-930e-a9ecb64488be.png` |
| Open, original installed | `exec-1ef3b43e-ae36-4d05-9fa0-0282c1eb6473.png` |
| Original removed         | `exec-336b3ebb-b70a-4bba-87b3-5efc56a3debe.png` |
| Replacement installed    | `exec-ff36314f-3afc-4aa2-a3d8-1f890f8070c4.png` |

The [complete prompt set](PROMPTS.md) records each edit target and constraint.
Selected masters are retained outside the public repository in the task
workspace under `outputs/repair-photo-redesign/masters/`. The four files above
are the project-bound delivery assets. No real-device identity or exact-model
compatibility is claimed.

## Review record

All four masters have been viewed at full resolution. Observed continuity:

- Matching tight service-bay crop, recognisable chassis edges, screws, tools and
  neutral light throughout the sequence.
- A closed cover over the same service region in stage 1; a green installed
  module in stage 2; an empty socket and flat detached module in stage 3.
- A black replacement in the socket in stage 4, with the original green module
  still resting in the same mat position as stage 3.
- Natural matte materials and credible contact shadows; no material floating-part
  or scene-continuity issue identified at intended hero scale.

This is an illustrative anatomy review, not verification of a real device, exact
pin count, physical compatibility or a completed repair. All four WebP delivery
copies were also visually reviewed; their framing and scene match the masters.

The composition does not show the whole laptop, its keyboard or screen, or the
removed cover beside it. Battery disconnection is outside the crop and cannot be
verified. The final frame must not imply that reassembly or testing is shown.

The page discloses once: “AI-genereret illustration. Opbygningen varierer efter
model.” / “AI-generated illustration. Layout varies by model.” Production layout and accessibility
checks are recorded with the implementation, not asserted by this source file.

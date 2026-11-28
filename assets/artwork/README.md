# KESTRO Artwork

Original imagegen PNG masters for the website's October 2026 visual refresh.
The generated hardware and environments are editorial illustrations. Actual
catalog photography, team portraits, logos and the interactive 3D model keep
their original sources and identity.

The set uses graphite metal, dark stone, neutral-to-warm key light and restrained
electric-blue accents. Guide covers use clear component photography and technical
composition, with no labels baked into their pixels. Both languages use the same
artwork; titles, explanations and accessible descriptions stay in HTML.

`manifest.json` records the complete prompt set, native source dimensions and
every web export. Masters in this directory are never served to visitors.

Run `npm run build:artwork` to export the complete set or `npm run build:cards`
to export only the category and technical cards. Outputs use native resolution
or downsampling, never upscaling. Hero assets have separate desktop/mobile crops
and AVIF/WebP formats. Other web assets use WebP; next/image selects display sizes.

The old procedural render scripts remain available for reference. They do not
overwrite this set through the default build:cards command.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## The hero laptop

`npm run build:model` turns `assets/laptop/scene.gltf` into the two files the
site ships, then re-renders the poster frame:

- `public/models/laptop-base.glb` — chassis, keyboard, ports
- `public/models/laptop-lid.glb` — screen and lid shell
- `public/models/laptop-still.webp` — the poster frame

It is two files because the lid moves. The source is one rigid scene, so the
build splits it by height — everything above the chassis is lid — and the site
hangs the lid off a pivot at the hinge so it can open and close. The hinge, the
closed angle, the camera, the lighting and the timing all live in
`lib/hero-view.json`.

`lib/laptop-scene.mjs` builds the scene, and both the live canvas
(`components/HeroModel.tsx`) and the poster renderer
(`scripts/render-hero-still.mjs`) use it, so the two cannot drift apart. Re-run
`npm run build:model` after changing either the view file or the scene module.

Every visitor sees the poster frame. The WebGL canvas is loaded afterwards,
during an idle moment, and only when the visitor has not asked for reduced
motion, has not turned on data saver, and is not on a low-memory device.
three.js is a dynamic import, so it never reaches the initial bundle.

`/maskinen` uses the same scene twice over: `components/MachineViewer.tsx`
turns off the spin and steers it by pose instead, one pose per part, from
`lib/machine-parts.ts`. The inside of that page is a drawing, not the model —
the model is an outer shell with no components in it — so the board, the RAM
slots and the rest are inline SVG in `components/MachineInside.tsx`, laid out
from the same data file.

**Licence:** the source model is a Sketchfab/Fab export. Confirm its licence
terms before the site goes live — most Sketchfab models are CC-BY and require
the author to be credited. If attribution is required, the credit belongs in
the footer or on the privacy/legal page.

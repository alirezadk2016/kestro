# Product catalogue

11 November 2026. The owner called the product sales section amateur and
asked for it to look professional with more products. The weak point was
not the copy: eighteen model cards with no picture of the hardware, a laptop
range hidden in a closed fold, and model pages that opened on an icon.

- One product card (`components/ModelCard.tsx`) everywhere a model is
  listed: /modeller, every category page, the products hub and the
  "same class" shelf on model pages. Picture, maker and format, name, one
  line, the spec chips, and two actions: the stretched name link to the
  specifications and "Få pris", which opens the quote form with the model
  filled in.
- Every model has a picture: the owner's T480 photographs, the CC0 T14
  photograph, the two pricing illustrations, and fourteen new studio
  illustrations in the same language (`docs/media-licenses.md`). Later the
  same day the owner ruled out artificial pictures of laptops: the seven
  laptop drawings were deleted, and a laptop without a real photograph of
  that model shows no picture. Each frame
  is labelled "Modelfoto" or "Illustration"; one line per page says the
  pictures are not the unit a buyer gets.
- /modeller opens on an index of its five groups with counts. Four columns
  from 2xl, so a 1920 screen is not half empty.
- The laptop page shows its models in the open, after the external
  recommendations; the brand list stays in its fold. (Superseded 12
  November, below.)
- The products hub shows one model of each kind instead of a button that
  sent the buyer elsewhere to see any hardware.
- Model pages without photographs open on their illustration, with the
  price box under it.

Not done here: new models. They need specifications from the makers' own
documents and licensed photographs, and this session's network could not
reach them. A personal environment "kestro" with those hosts now exists.

## 12 November: models first, as a list

The owner asked for a product section that is simpler and more useful.

- Category pages show their models first, as a list rather than cards
  (`components/ModelList.tsx`): picture, name and use, then processor,
  memory and storage in fixed columns under one header (screens: panel and
  resolution), and "Få pris" in a fixed 7rem column so the figures line up
  on every row. Below lg each row stacks with its labels shown.
- On the laptop page the external recommendations follow the models, and
  the header button reads "Se modellerne".
- /modeller keeps the card grid: it is the overview, the category is where
  a buyer compares.
- A model page's related row is three models, photographed first, with a
  link to the whole category.
- Every model page says it is not in stock yet and where it can be found
  meanwhile ("Har I brug for den nu?", `components/RetailLinks.tsx`).

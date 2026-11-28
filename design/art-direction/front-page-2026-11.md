# Front page, November 2026

The owner asked for the front page to be reviewed as graphic design, in a
loop: ask, look, fix, ask again (2026-11-17). Scope, in the owner's answers:
structure may change, the brand's look stays, and the rest is delegated.
`PROJECT_DESIGN.md` kept the front page frozen "unless the owner explicitly
requests changes there"; this is that request.

Mode: taste-first redesign, confined to the existing navy room, the Jakarta
type scale, `.plate`/`.sheet` and the page's N N L N N L rhythm. Direction:
quiet precision. One claim and one action on the first screen, one spacing
rhythm down the page, no dead paper at 1440 and wider.

## Round 1: what the page was asked, and what the evidence said

Measured at 1904x912, 1440x900, 1280x720, 768x1024, 390x844, 320x640.

| Question | Evidence | Change |
| --- | --- | --- |
| Does the first screen have one focal point? | Five blocks of text from md up: headline, sentence, three numbered steps, two buttons, status note, 525px of copy. A phone never showed the steps. | The steps left the hero. How buying works is told in the process and written-quote sections. |
| Does the sentence read as one sentence? | From md the first clause was white and the rest 75%, so the colour changed where the line broke. | One colour, flowing text, "i Danmark" tied with a no-break space. |
| Do the five facts under the hero stand on one ground? | The strip was 70% navy over the photograph: three facts on flat navy, two on lit stone. The fifth ended 110px short of the container's right edge. | 90% ground; from xl the columns take their own width and the row runs edge to edge. |
| Is there one vertical rhythm? | Section padding at desktop was 64, 96, 112, 80 and 96px. | 80 for the cards directly under the hero, 96 for every other section. |
| Is there dead space at 1440 and wider? | The answer block's left column held 290px of text beside 660px of questions: 370px of empty paper. | The answer sits beside its question, and the eight follow-up questions run in two independent columns across the full width. The answer starts on the right column's own left edge. |

## Round 2: asked of the result

| Question | Evidence | Change |
| --- | --- | --- |
| Does the h1 outrank the h2s on a laptop? | At 1440 the headline was 38px over 34px section headings. | `.hero-title` grows at 3.3vw instead of 2.63vw and reaches the 52px display cap at 1576px. 47px at 1440. |
| Is the sentence under it readable at laptop sizes? | 16px at 1440 under a 47px headline. | 17 to 21px (`clamp(1.0625rem, 1.25vw, 1.3rem)`). |
| Does any hero text leave the dark wall? | At 768 the sentence and the status note ran onto the lit window; at 1440 the English sentence reached the pillar. | Narrower measure at md, lg and xl. |
| Is any link broken over two lines? | At 1024 the English "Status and terms" wrapped. | The link does not wrap. |

## Round 3: the sections under the fold

Measured at 1904x912, 1440x900 and 390x844, with the pointer on each linked
panel.

| Question | Evidence | Change |
| --- | --- | --- |
| Does a card answer the pointer without performing? | The eight linked panels tipped back 7 degrees, grew 1.2% and lifted their icon 34px off the face over 420ms. Type on a rotated plane renders soft at the moment somebody reads it. `.forge`, on the same element and later in the file, also set its own 420ms transform transition, so any faster value on `.tile` was ignored. | The tile rises 3px in 180ms and stays flat; the frame, face and rim use the same timing. The icon still lights its ring. |
| On a phone, does the form follow the promise it keeps? | At 390 the quote section ran heading, list, sample-quote button, the two faces and "Mød os", and only then the form: 700px of scrolling between "Alt står skriftligt" and the first field. | Three blocks in a grid. A phone reads promise, form, faces; from lg the promise and the faces share the left column and the form spans both rows, as before. |
| Do the example texts fit the fields? | At 390 "Fx bærbare til kontorbrug eller ThinkPad T14" was cut at "ThinkPa"; at 320 the date example was cut too. The field has 210px at 320. | "Fx bærbare, ThinkPad T14" (188px) and "Fx inden for en måned" (164px), in both forms that used them. |
| Does any line start or end on a separator? | At 390 the all-products card broke "Bærbare · skærme · / tilbehør" with a dot at a line's edge, either way round. | It lists kinds, so it reads as a list: "Bærbare, skærme og tilbehør". The brand lines are short and keep their dots. |
| Do the four situations share a left edge on a phone? | The fleet card had 28px of padding over the 20px of the three cards under it, so its mark stood 8px right of theirs. | 20px on a phone, 36px from sm as before. |

## Left as it is, and why

- The hero photograph and the four category scenes. One room, one light, one
  grade is the brief in `cards-brief.md`; the owner expressed no wish to
  change the pictures.
- The situations section's one-large-three-small layout and the process
  spine. Both were reworked on the owner's earlier feedback and their
  reasons are in the components.
- The sources bar above the closing section, where every other page has it.
- The order of the sections. Navy, navy, light, navy, navy, light is the
  page's rhythm and the answer block stays the second band a crawler reads.

## Open, for the owner

- Whether the four category cards should stay as dark room scenes or become
  the light product cards the products hub now uses.
- Whether the status note stays on the first screen once the business is
  registered.

# Kestro administration

An operator's workbench for enquiries, offers and repair follow-up. The owner
needs to find an unanswered request, understand its context and act without
losing the customer message. Traffic belongs in its own view, not above the queue.

Domain: enquiries, company contacts, quote requests, unread work, mail delivery,
internal handover notes, archived cases. Colour world: Kestro navy, blue intent,
paper text, graphite inset controls, muted steel metadata, amber delivery issues,
green confirmed outcomes. One brand hue; semantic colours only for state.

Signature: a blue unread rail and a compact, URL-addressable workflow queue.
Reject equal KPI tiles in favour of an actionable queue, a decorative dashboard
hero in favour of a concise work header, and eight tiny mobile tabs in favour
of three daily-work links plus a clearly labelled full menu. No invented figures
or pretend CMS controls.

## Expanded workbench direction

The operator opens Kestro between customer conversations: find unanswered work,
see what is due, then move to the relevant contact or website resource. The
workspace should feel like a carefully arranged service desk, with work in the
centre and reference material within reach.

Navigation has four groups: Arbejde (Oversigt, Beskeder, Opfølgning, Kontakter),
Websted (Indhold, Medier), Vækst (Trafik & kilder, Google & SEO, Kampagnelinks),
and Drift (System). Desktop keeps all ten links in the rail. Mobile keeps the three daily-work destinations
visible and opens all ten in a native modal navigation menu. Escape, keyboard
containment and return focus come from the native dialog; a resize closes it.
Without JavaScript the menu button is replaced by direct links to the other
seven sections; the desktop grouping and normal native navigation still work.

| Component checkpoint        | Decisions before implementation                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell intent / hierarchy    | Find work first; grouped destinations beat a flat icon list. The active item has the blue edge, weight and a restrained tint.                                    |
| Shell palette / depth       | Existing navy canvas, a slightly raised navy menu, steel metadata, Kestro blue for action. One quiet border separates navigation from work.                      |
| Shell type / spacing        | Jakarta; 14px destinations, 12px group labels, 44px minimum controls. 4px spacing grid with 16–24px group separation.                                            |
| Overview intent / hierarchy | Answer the next enquiry and complete due follow-ups. One dominant queue column, compact work strip, and narrower reference column replace the equal-card stack.  |
| Overview surfaces / palette | Queue uses the existing raised surface; follow-ups use an open list with date signals. Amber marks actual overdue work or connection problems, never decoration. |
| Overview type / spacing     | 32px page title, 17–20px section titles, 14px copy, 12px metadata; tabular figures. 24px internal padding and 24–32px between groups.                            |
| Shared furniture            | PageHeader and EmptyState reuse the same type and control scale. Eyebrows are at least 12px. No extra entrance animation or decorative metrics.                  |

Contacts are derived from enquiries; content and media describe the real site
sources. Labels must not suggest a customer register or publishing capability
that the backing data does not provide. Failed queries display an unavailable
state, while a confirmed empty result displays an empty state.

## Colour roles and reference review

The admin palette stays separate from the public site. A deeper Kestro navy
rail (#0b1426) recedes behind the slate work canvas (#101827). The working panel
(#162132), inset control (#0e1726), and modal level (#1c2a40) have distinct roles;
the same border is not repeatedly painted at adjoining edges. Muted metadata
uses #a6b1c3, secondary copy #c4cbd8, and primary text #f5f7fb. Kestro blue marks
actions and current location. Amber always has a word explaining the issue.

References informed principles, not a copied composition:

- [Linear's March 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh): let navigation recede and give task content priority; remove redundant visual boundaries.
- [Vercel Geist colour roles](https://vercel.com/geist/colors): distinguish backgrounds, controls, state borders and readable text rather than tinting everything independently.

The make-interfaces-feel-better skill informed visible focus, matching inset
controls, explicit colour transitions, tabular figures and restrained motion.
Static figures do not get hover effects that imply an action.

Catalogue checkpoint: the owner should find a published guide, its exact
language variant or a real artwork asset. The focal point is a title/search
and compact thumbnail row, not a wall of large images. Metadata is evidence,
not a fabricated SEO score or search position. Content is source-managed;
the media catalogue exposes 56 actual assets with format, dimensions and bytes,
18 per page, plus copy/download and known Viden usage. No upload or CMS action
is suggested. Shared headers and 12px metadata/14px body text match the rest
of the workbench. A strict pre-build manifest check guards stale asset data.

## Critique rubric and iteration record

Scores below describe the pre-expansion source review, on a five-point scale;
they are design estimates, not user testing or a claim of completeness. Final
visual scores remain pending desktop/mobile review of the running build.

| Criterion               | Baseline              | Cause                                                                                                        | Implemented iteration / evidence still needed                                                                                                                  |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task hierarchy          | 2/5                   | Equal-weight cards preceded the queue; the overview read as a vertical report.                               | Compact work strip, dominant queue, due list, and a quieter reference column. Check first-viewport priority at 390/1440/1920px.                                |
| Colour and contrast     | 3/5                   | Mostly translucent versions of one surface did not explain different roles.                                  | Named canvas, panel, inset, modal and control-border roles. Numeric text contrast checked; rendered overlays still need browser measurement.                   |
| Spacing and typography  | 3/5                   | Ten-pixel eyebrows contradicted the readability brief; page headers varied.                                  | Twelve-pixel metadata floor, shared page header and empty state, 44px controls. Check wraps and density with long real-shaped fixture text.                    |
| Navigation and mobile   | 2/5 at expanded scope | Four tabs could not sensibly grow to eight.                                                                  | Four desktop groups; three daily-work links plus a native full menu with focus/Escape handling. Check open/close, keyboard containment, resize and deep links. |
| States and truthfulness | 4/5                   | Existing unavailable/session states were sound, but expansion could imply unsupported editing or empty data. | Keep guarded queries and unavailable states; show real inventories and planned work. Verify database failures, empty results and permissions with fixtures.    |

Iteration note: a first control-border candidate measured 2.86:1 against the
inset, below the intended 3:1 boundary. A second candidate (#5b6b83) still
measured 2.99:1 against the panel. The final #64748b measures 3.40:1 against
the panel and also clears the inset boundary.
Muted metadata measures 7.47:1 against the panel; white on primary blue measures
6.50:1. These calculations do not replace the release gate or visual review.

Visual iteration: root reviewed the synthetic dashboard at desktop and 390px.
The desktop composition received a provisional 8.5/10 for the dominant queue,
quiet reference column and grouped navigation. The mobile version received
7.5/10: the first message started around 650px because the introductory copy
and call to action stacked above the work strip and queue header. This is a
review judgement from screenshots, not user testing or a completeness score.

The bounded correction uses the shared header's optional compact-mobile mode
on Overview, Content and Media. Its redundant introduction is hidden below 640px, while the
short title and a 44px "Nye beskeder" action can share a row at 390px; narrower
screens can wrap. The full action name remains accessible, and desktop text
and layout stay unchanged. The next synthetic screenshot placed the first
Overview row at about 525px and the first Media image at about 544px on mobile.
Content retained a coherent title, search and inventory hierarchy on desktop.
These observations precede the stronger light-strip iteration below; an updated
screenshot is still needed before assigning its revised mobile score.

### More visible overview iteration

The owner asked for a more striking change after the first structural pass.
The earlier view was orderly, but the status strip, work queue and reference
column still occupied near-identical navy tones. The palette score stayed
provisional because role separation did not translate into an immediate visual
change. Adding extra decorative charts or colours would not address that cause.

The overview now introduces one cool-paper work strip, using the existing brand
neutral (#F3F4F6) with ink-600 labels and ink-900 figures. New messages lead in
brand-700 with a larger figure; the adjacent two counts remain quieter. This is
one grouped definition list with three real destinations, not three KPI cards.
Counts still distinguish unavailable data from a confirmed zero. The band stays
compact on mobile, and all three links retain their 44px minimum target.

The quieter Websted column now shows the actual laptop artwork used by the
public site. Its explicit public-site caption opens the real site in a new tab;
the asset is not presented as a live screenshot or analytics evidence. The image
adds Kestro's hardware context while the queue keeps the dominant working area.
Both changes reuse the existing palette, typeface, radii and image asset. There
is no new animation or new public-facing claim. Final desktop/mobile appearance,
first-message position, contrast and layout remain subject to the running-build
review and complete release gate; no higher score is asserted from source alone.

Final overview review: the contrast between the paper work strip, navy queue
and real laptop artwork is visible at 1440px. At 390px the first message still
starts around 523px, keeping the status band compact. The second counter now
counts all active enquiries and links to that exact filter; an unanswered-only
number must not lead to a queue containing answered messages. Desktop and mobile
composition receive a provisional 9/10 design judgement after this iteration,
up from the baseline's roughly 6/10. This is a screenshot-based review, not user
research or a guarantee of no defects. The complete release gate remains required.

Release evidence, 19 October 2026: the full `npm run verify` gate passed,
including rendered public contrast/layout/motion checks, all seven admin browser
scenarios, security checks and all nine synthetic workflow scenarios. The two
Back-navigation regressions now pass after the restored route is refreshed.
The login composition was also inspected at 1440px and 390px, with a 320px
overflow/target check. Catalogue media previews show the original images fully
decoded. Synthetic screenshots contain no real customer records. Database SQL
was independently exercised in isolated PostgreSQL with the production driver's
parameter serialization; no production enquiry was changed during verification.

## Component checkpoints

Login checkpoint: the owner should recognise Kestro and reach the password
field immediately. Desktop pairs the site's original laptop artwork and a
short Jakarta introduction with a separate raised form; mobile removes the
supporting artwork and keeps the compact form first. The same navy, panel and
steel control-border roles apply. Form semantics, session boundaries and
failed-password feedback are unchanged. The artwork is a brand cue, not a
live preview. Type steps are 40px introduction, 24px form title, 14px body and
12px metadata, with 32px form padding and controls at least 44px high.

| Surface      | Intent and hierarchy                                                                                                                                                                                 | Depth and spacing                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Shell        | Eight grouped destinations; three daily-work links and an accessible full menu on mobile. Current destination wins through weight and blue state. Shared administrator access is described honestly. | Same navy as canvas, subtle dividing rail. 4px base, 44px controls.          |
| Overview     | New/unanswered work first, then recent messages and direct destinations. Database failure must not look like zero messages.                                                                          | Border-led groups, 24px padding, 32px sections.                              |
| Inbox/detail | Search and status before rows; original message and reply are primary, contact data and internal notes secondary.                                                                                    | Inset native controls, 12–16px row gaps, readable 14–16px copy.              |
| Traffic      | Explicit 7/30/90-day scope; comparable visit figures, page views and ranked sources. Live is labelled separately.                                                                                    | Compact grouped figures, chart and ranked tables; accessible textual values. |
| System       | Configuration and a tested DB read are separate. Show what is configured, what failed and what the owner can do next. Never display keys.                                                            | Calm status rows, no fake health scores or permission toggles.               |

Typography: existing Plus Jakarta Sans; 28–32px page titles, 17px section titles,
14px controls/body, 12px metadata at least paper/65. Tabular figures. Border-only
depth, modest shared radius, visible blue focus, no entrance animation. Native
forms, links and selects preserve keyboard use and no-JavaScript navigation.

Security: middleware, per-page/endpoint sessions and DB-level gates remain.
No roles, new accounts or access scope are introduced. Notes stay server-side;
customer data is not cached in browser storage or written into screenshots in git.

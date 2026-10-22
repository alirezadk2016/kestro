# Public site quality review

22 October 2026. This review retains Kestro's existing navy/paper identity,
Jakarta typography, artwork and public URLs. The priority is to remove friction
and repetition from actual journeys rather than add sections or decoration.

## Findings and decisions

- Product navigation needed a current-section cue, 44px destinations and reliable
  closure. Mobile navigation also needs to isolate consent and language-hint
  controls, contain keyboard focus and fit the space actually available.
- Repair, buyback and surplus-enquiry actions must lead to their existing task
  forms. A purchase quote is not the destination for these actions.
- Language changes preserve existing quote selections and the current section;
  unrelated query parameters are not copied.
- General contact accepts private customers. English quote requests carry an
  explicit form kind instead of relying on a Danish subject substring.
- Browser and API validation share limits. Accepted messages are never silently
  shortened, including composed quote specifications. A server validation error
  keeps the draft and returns focus to the relevant field.
- Article contents remain reopenable after moving from phone to desktop.
- Square and 4:3 educational images preserve their subjects. Open Graph and
  Article metadata use the real dimensions. Artwork descriptions match the
  depicted equipment; the same framing is used in the admin catalogue.
- Repair pages show a static illustration on phones and without JavaScript;
  the optional desktop renderer remains deferred.
- The prices page explains the external-budget/stock limitation once, retaining
  dated references, configuration, VAT, rounding and Norway-shipping details.
- Search Console import controls lock during asynchronous work so edits cannot
  invalidate a preview while its report is being saved.

## Verification scope

The mandatory production-build gate includes static content/media checks,
public-template and bilingual article metadata, contrast, reduced-motion and
JavaScript-off behaviour, navigation/search, educational tools, private admin
flows, independent security requests and isolated synthetic admin workflows.
Focused regressions exercise the findings above at 320/390px and desktop sizes.
Captures and actual account data stay outside the public repository.

Changes to interface labels, validation, navigation and image framing do not
date every public article anew. Only the revised prices-page wording receives
a new content date. The previous privacy disclosure keeps its own revision.

A successful build is not a claim that every possible browser state is free of
defects. Mail delivery configuration and a continuous server-side Windsor
connection remain deployment settings, reported honestly in the private System
view; a chat connection does not configure either setting automatically.

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
hero in favour of a concise work header, and hidden mobile destinations in favour
of four visible navigation items. No invented figures or pretend CMS controls.

## Component checkpoints

| Surface      | Intent and hierarchy                                                                                                                      | Depth and spacing                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Shell        | Four visible destinations; current destination wins through weight and blue state. Shared administrator access is described honestly.     | Same navy as canvas, subtle dividing rail. 4px base, 44px controls.          |
| Overview     | New/unanswered work first, then recent messages and direct destinations. Database failure must not look like zero messages.               | Border-led groups, 24px padding, 32px sections.                              |
| Inbox/detail | Search and status before rows; original message and reply are primary, contact data and internal notes secondary.                         | Inset native controls, 12–16px row gaps, readable 14–16px copy.              |
| Traffic      | Explicit 7/30/90-day scope; comparable visit figures, page views and ranked sources. Live is labelled separately.                         | Compact grouped figures, chart and ranked tables; accessible textual values. |
| System       | Configuration and a tested DB read are separate. Show what is configured, what failed and what the owner can do next. Never display keys. | Calm status rows, no fake health scores or permission toggles.               |

Typography: existing Plus Jakarta Sans; 28–32px page titles, 17px section titles,
14px controls/body, 12px metadata at least paper/65. Tabular figures. Border-only
depth, modest shared radius, visible blue focus, no entrance animation. Native
forms, links and selects preserve keyboard use and no-JavaScript navigation.

Security: middleware, per-page/endpoint sessions and DB-level gates remain.
No roles, new accounts or access scope are introduced. Notes stay server-side;
customer data is not cached in browser storage or written into screenshots in git.

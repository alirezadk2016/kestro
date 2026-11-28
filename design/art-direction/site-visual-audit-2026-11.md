# Whole-site visual review — 11 November 2026

## Context and scope

This is a corrective review of the current Kestro site, anchored to production
commit `31e09bc`. The previous local checkout was thirty commits behind and was
updated before the baseline was captured. Retain the navy/paper palette, Jakarta
type scale, existing hardware artwork, public URLs, bilingual content and all
admin security boundaries. The owner delegated design decisions and publication
in the existing conversation.

The task is to find graphical and interaction defects across the public route
inventory and private administration, then give an honest design assessment.
Passing browser assertions is evidence of technical correctness, not a claim of
perfect visual design. No invented business claims, prices or workshop photos.

## Direction and alternatives

Use the site's own homepage, marks, material tokens, split sections and timeline
as the reference. Variance 2/10, motion 1/10, density 4/10.

1. A new site-wide skin would add visual variance without repairing the actual
   navigation and breakpoint defects. Rejected.
2. Preserve the existing direction and correct concrete failures in navigation,
   tablet row composition, process structure and admin state feedback. Chosen.

On the services process, the old single 768px column leaves the right side empty
on wide displays and its four disconnected entries lack the route/spine already
used by the homepage. The existing split pattern gives the heading and lead a
left column, while an ordered timeline and quality panel occupy the right.
Keep the same reading order on a phone. No added prose or decorative imagery.

## Verification and assessment

Capture every sitemap route at 390px and 1440px; inspect full-page captures of
the main template families, plus focused 320/640/768/1024/1920 and short landscape
states where relevant. Inspect populated admin views with isolated synthetic
fixtures, never real enquiry screenshots. Recheck fixed interaction states and
run `npm run verify` before publication.

Score product fit, task clarity, hierarchy, density, visual consistency, craft,
readability, responsiveness and originality independently from the technical
gate. Record accepted limitations and recommendations in the external audit
report rather than claiming a universal 10/10.

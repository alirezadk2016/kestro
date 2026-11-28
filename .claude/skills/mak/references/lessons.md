# Lessons

## Log

| Lesson | Status | Source material | Rules |
| --- | --- | --- | --- |
| 2-1 | Learned 14 Oct 2026 | Owner's transcript (0:00–9:46 of a 63-minute session) and 10 screenshots up to 55:43: the pillar-cluster slides, the keyword-pool sheet, the pillar sheet, and a computer-parts category sheet | 6, 7; adds to 2; the order of work |
| 2-2 | Learned 13–14 Oct 2026 | Owner's transcript (0:00–20:17 of the first 30-minute audio cut of a ~55-minute session); 11 screenshots of the sheets and slides (13 Oct); 18 more screenshots up to ~55 min (14 Oct): the on-page slides 47–50, the SEO-check extension on large shops, the keyword-research and homework sheets, the keyword tool's sources. The second audio cut (`2-2_2`) arrived 14 Oct; Hugging Face answers 403, so the owner sent a clean transcript of it (0:00–~10:00). It covers the same opening as the first cut, in better words, and corrected rule 2: the watch shop's "gifts" is a parent name over birthday and Valentine's, not an example of thin categories | 1–5; 14 Oct adds URL and the snippet preview to 5, harvest sources and short seeds to 4, and corrects and extends 2 |
| 2-3 | Learned 14 Oct 2026 | Owner's machine transcript of the session audio (URL structure, anchor text, internal links, menu and footer links) and 13 screenshots: on-page slides 47–58 (URL anatomy, optimal URL, numbers in URLs, hierarchy without dependency, heading roles), internal-linking slides from a second deck, the pillar sheet with its URL column, an AI-drafted category content structure ending in deep content | 8, 9, 10; heading roles added to 5 |
| 2-4 | Learned 14 Oct 2026 | Owner's machine transcript of 0:00–23:24 and 29:15–29:58 (the video itself could not be sent) and 4 screenshots: AI-drafted content structures, the knowledge-graph example, the two Search Console property types, the Search Console overview. The gap 23:24–29:15 is unknown; it continued the Search Console setup | 11, 12, 13, 14; the course's whole-method recap in "The order of work" |

**After 2-4** the owner asked for the skill to be completed with what the
course did not cover. That is `references/beyond-course.md`, marked as not
from the course, and the `run` verb (`scripts/run.mjs`).

## How to learn a lesson (`mak learn`)

1. **Get the words.**
   - An owner's transcript is best. Machine transcripts mishear Persian, so
     read for meaning, not wording.
   - Audio alone can be transcribed with faster-whisper (PyPI). Its model
     weights come from huggingface.co, which this environment blocks unless
     the owner allows `huggingface.co`, `cdn-lfs.huggingface.co` and
     `*.hf.co`.
   - Read the screenshots for the sheets, slides and tools on screen.
2. **Strip everything that is not method:**
   - names, phone numbers, Telegram handles, member lists;
   - other people's businesses, clients, prices.

   None of it is stored anywhere. The repository is public.
3. **Write the rules in our own words** into `references/method.md`.
   - A rule extends an existing section, or opens the next number.
   - Tag every rule with the lesson.
   - Note how it applies to Kestro under **At Kestro**.
4. **Update SKILL.md.**
   - If a rule is new, add it to the one-screen summary.
   - If a lesson changes a limit or a sheet, update `snippets.md` or
     `sheets.md`.
5. **Check the site against the new rule** in the same change (CLAUDE.md
   requires it).
   - Run `audit.mjs` and `check-map.py`.
   - Record the result in `docs/seo-playbook.md`: what passes, what breaks,
     what needs the owner's evidence.
6. **Update this log.**
7. **Commit and push.** A docs-only change still runs the content check:
   `node scripts/verify/content.mjs`.
8. **Report to the owner in Persian:**
   - what the lesson teaches;
   - what was saved;
   - what the site does not yet meet;
   - what is needed from them.

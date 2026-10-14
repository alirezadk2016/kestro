# Lessons

## Log

| Lesson | Status | Source material | Rules |
| --- | --- | --- | --- |
| 2-1 | Learned 14 Oct 2026 | Owner's transcript (0:00–9:46 of a 63-minute session) and 10 screenshots up to 55:43: the pillar-cluster slides, the keyword-pool sheet, the pillar sheet, and a computer-parts category sheet | 6, 7; adds to 2; the order of work |
| 2-2 | Learned 13 Oct 2026 | Owner's transcript (0:00–20:17 of a 30-minute audio cut of a ~55-minute session) and 11 screenshots of the session's sheets and slides | 1–5 |
| 2-3 | Waiting | — | — |
| 2-4 | Waiting | — | — |

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

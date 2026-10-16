#!/usr/bin/env python3
"""
mak check-map — the keyword map against the method (references/method.md).

    python3 .claude/skills/mak/scripts/check-map.py [--map docs/seo-keyword-map.csv] [--audit mak-audit.json]

--audit is the JSON written by audit.mjs; with it, URLs are checked against
the live sitemap and keywords against the live titles.

Reports:
  FAIL  two primary keywords on one URL; one keyword on two rows
  FAIL  a primary keyword pointing at a URL that is not in the sitemap and not
        marked New (proposed)
  RULE3 an informational keyword sitting on a non-blog page: read Danish page
        one before keeping it there
  RULE4 a keyword that contains another page's primary keyword: it probably
        belongs to that page (child or sibling), not this one
  NEW   proposed pages (Existing/New Page = New)
"""
import csv, json, re, sys
from collections import Counter, defaultdict

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

rows = list(csv.DictReader(open(arg("--map", "docs/seo-keyword-map.csv"), encoding="utf-8-sig")))
audit = json.load(open(arg("--audit"))) if arg("--audit") else None
live = {r["path"] for r in audit} if audit else None
STOP = {"til", "i", "af", "på", "for", "og", "en", "et", "med", "a", "the", "and", "of", "to", "in", "on"}
words = lambda s: [w for w in re.sub(r"[^\wæøå ]", " ", s.lower()).split() if w not in STOP]
blog = lambda u: u.startswith("/vejledninger") or u.startswith("/en/knowledge")

problems = 0
def say(tag, msg):
    global problems
    if tag == "FAIL": problems += 1
    print(f"{tag:5} {msg}")

prim = defaultdict(list)
for r in rows:
    if r["Primary/Secondary"] == "Primary": prim[r["Primary URL"]].append(r["Keyword"])
for u, ks in prim.items():
    if len(ks) > 1: say("FAIL", f"{u} has {len(ks)} primary keywords: {ks}")
for k, n in Counter(r["Keyword"] for r in rows).items():
    if n > 1: say("FAIL", f"keyword on {n} rows: {k}")

if live is not None:
    for r in rows:
        u = r["Primary URL"]
        if u.startswith("/") and u not in live and r["Existing/New Page"] != "New":
            say("FAIL", f"{r['Keyword']} → {u}: not in the sitemap and not marked New")

for r in rows:
    u = r["Primary URL"]
    if r["Intent"].startswith("informational") and u.startswith("/") and not blog(u):
        say("RULE3", f"{r['Keyword']} → {u} ({r['Primary/Secondary']}): informational on a non-blog page — check page one")

"""Rule 4: a page does not take its children's keywords. A keyword on page A
that contains the primary of a page B more specific than A (deeper path, or a
longer primary that includes A's) is B's keyword, not A's. The reverse — a
child's keyword containing its parent's words — is normal and not reported."""
primaries = {u: ks[0] for u, ks in prim.items()}
def more_specific(b, a):
    if a in ("/", "/en"): return b not in ("/", "/en")
    if b.startswith(a.rstrip("/") + "/"): return True
    pa, pb = set(words(primaries.get(a, ""))), set(words(primaries.get(b, "")))
    return bool(pa) and pa < pb
for r in rows:
    a, mine = r["Primary URL"], set(words(r["Keyword"]))
    for b, k in primaries.items():
        if b == a or k == r["Keyword"]: continue
        theirs = set(words(k))
        if theirs and theirs <= mine and more_specific(b, a):
            say("RULE4", f"{r['Keyword']} on {a} contains the primary of the more specific {b} (\"{k}\") — move it there")

for r in rows:
    if r["Existing/New Page"] == "New":
        say("NEW", f"{r['Keyword']} → {r['Primary URL']} ({r['Primary/Secondary']})")

print(f"\n{len(rows)} keywords, {len(prim)} URLs with a primary, {problems} failures")
sys.exit(1 if problems else 0)

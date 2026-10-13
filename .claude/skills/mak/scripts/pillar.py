#!/usr/bin/env python3
"""
mak pillar — rebuild docs/seo-pillar-cluster.csv, Kestro's version of the
course's pillar-cluster sheet (references/sheets.md).

    python3 .claude/skills/mak/scripts/pillar.py --audit mak-audit.json [--out docs/seo-pillar-cluster.csv]

Reads the site's own data (lib/categories.ts, models, repairs, services,
guides — through `npx tsx`), the live titles, descriptions and h1s from the
audit, and primary keywords and proposed pages from docs/seo-keyword-map.csv.
One row per page, stepped by tree and level, with title/description length in
characters and pixels. Grouping rows ("Efter model") are not pages. Proposed
pages are rows with Findes = nej.

Run it from the repository root after audit.mjs, and after any change to the
structure or the keyword map.
"""
import csv, json, subprocess, sys
from collections import Counter

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

audit = {r["path"]: r for r in json.load(open(arg("--audit", "mak-audit.json")))}
out = arg("--out", "docs/seo-pillar-cluster.csv")
kw = list(csv.DictReader(open("docs/seo-keyword-map.csv", encoding="utf-8-sig")))
prim = {r["Primary URL"]: r["Keyword"] for r in kw if r["Primary/Secondary"] == "Primary"}
proposed = {r["Primary URL"]: r["Keyword"] for r in kw if r["Existing/New Page"] == "New" and r["Primary/Secondary"] == "Primary"}

st = json.loads(subprocess.check_output(["npx", "tsx", "-e", """
import { models } from "./lib/models";
import { categories } from "./lib/categories";
import { guides, clusters } from "./lib/guides";
import { services } from "./lib/services";
import { repairs } from "./lib/repairs";
const n = (x: any) => x?.da ?? x;
console.log(JSON.stringify({
  cats: categories.map((c: any) => ({ slug: c.slug, name: n(c.name) })),
  models: models.map((m: any) => ({ slug: m.slug, cat: m.category, name: n(m.name) })),
  clusters: clusters.map((c: any) => ({ id: c.id, name: n(c.name) })),
  guides: guides.map((g: any) => ({ slug: g.slug, cluster: g.cluster, title: n(g.title) })),
  services: services.map((s: any) => ({ slug: s.slug, name: n(s.name) })),
  repairs: repairs.map((r: any) => ({ slug: r.slug, name: n(r.name) })),
}));
"""], text=True).strip().splitlines()[-1])

COLS = ["Træ", "Niveau 1", "Niveau 2", "Niveau 3", "URL", "Findes", "Primært søgeord", "SEO-title", "Title-tegn",
        "Title-px", "Meta description", "Description-tegn", "Description-px", "H1", "Note"]
rows = []
def page(tree, l1="", l2="", l3="", url="", note=""):
    a = audit.get(url)
    rows.append({"Træ": tree, "Niveau 1": l1, "Niveau 2": l2, "Niveau 3": l3, "URL": url,
                 "Findes": "ja" if a else "nej", "Primært søgeord": prim.get(url, proposed.get(url, "")),
                 "SEO-title": a["title"] if a else "", "Title-tegn": len(a["title"]) if a else "",
                 "Title-px": a["titlePx"] if a else "", "Meta description": a["desc"] if a else "",
                 "Description-tegn": len(a["desc"]) if a else "", "Description-px": a["descPx"] if a else "",
                 "H1": " / ".join(a["h1"]) if a else "", "Note": note})
def group(tree, l1="", l2="", note="Grupperingsrække – ikke en side."):
    rows.append({**{c: "" for c in COLS}, "Træ": tree, "Niveau 1": l1, "Niveau 2": l2, "Findes": "—", "Note": note})

by_cat = {}
for m in st["models"]: by_cat.setdefault(m["cat"], []).append(m)
page("Produkter", url="/produkter", note="Hub for produkttræet.")
for c in st["cats"]:
    page("Produkter", c["name"], url=f"/produkter/{c['slug']}")
    ms = by_cat.get(c["slug"], [])
    if c["slug"] == "mini-pc":  # the OptiPlex Micro is a mini PC too: one product, two categories (rule 2)
        ms = ms + [m for m in st["models"] if m["slug"] == "dell-optiplex-5060"]
    if ms:
        group("Produkter", c["name"], "Efter model")
        for m in ms:
            note = "Står også under Mini-pc'er (Micro-udgaven)." if m["slug"] == "dell-optiplex-5060" else ""
            page("Produkter", c["name"], "Efter model", m["name"], f"/modeller/{m['slug']}", note)
page("Modeller", url="/modeller", note="Tværgående hub for alle modelsider; ejer de generiske mærkeord.")
page("Reparation", url="/reparation", note="Værkstedet. Private er velkomne.")
for r in st["repairs"]: page("Reparation", r["name"], url=f"/reparation/{r['slug']}")
page("Ydelser", url="/ydelser")
for s in st["services"]: page("Ydelser", s["name"], url=f"/ydelser/{s['slug']}")
page("Vejledninger (blog)", url="/vejledninger", note="Bloggens træ – kun informationelle søgninger (regel 3).")
for cl in st["clusters"]:
    gs = [g for g in st["guides"] if g["cluster"] == cl["id"]]
    group("Vejledninger (blog)", cl["name"], note="Emne – vist på /vejledninger." if gs else "Emne uden artikler endnu.")
    for g in gs: page("Vejledninger (blog)", cl["name"], g["title"], url=f"/vejledninger/{g['slug']}")
for u, k in proposed.items():
    if u not in audit:
        rows.append({**{c: "" for c in COLS}, "Træ": "Forslag", "Niveau 1": u.rsplit("/", 1)[0], "Niveau 2": u.rsplit("/", 1)[-1],
                     "URL": u, "Findes": "nej", "Primært søgeord": k, "Note": "Foreslået side fra søgeordskortet."})
for u in ["/", "/flaadeloesninger", "/kvalitet", "/priser", "/tilbud", "/tilbud-eksempel", "/saelg-til-os",
          "/kontakt", "/om-os", "/maskinen", "/handelsbetingelser", "/privatlivspolitik"]:
    page("Sider", u, url=u)

w = csv.DictWriter(open(out, "w", encoding="utf-8-sig", newline=""), fieldnames=COLS)
w.writeheader(); w.writerows(rows)
missing = [u for u in audit if not u.startswith("/en") and u not in {r["URL"] for r in rows}]
print(f"{out}: {len(rows)} rows {dict(Counter(r['Findes'] for r in rows))}")
if missing: print("Danish pages in the sitemap with no row (add them to the tree):", missing)

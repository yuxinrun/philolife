"""Generate sitemap.xml from local content files."""
import glob
import os
import re
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://yuxinrun.github.io/philolife/"

paths = ["", "western-philosophy/", "eastern-philosophy/", "life-philosophy/",
         "self-and-consciousness/", "relationships/", "mind-and-spirit/", "wisdom/",
         "thinkers/", "books/", "articles/", "topics/", "search/", "about/"]

for f in glob.glob(str(ROOT / "src/content/articles/*.md")):
    m = re.search(r"^slug:\s*(.+)$", open(f, encoding="utf-8").read(), re.M)
    if m:
        paths.append("articles/" + m.group(1).strip() + "/")

for f in glob.glob(str(ROOT / "src/content/*.ts")):
    text = open(f, encoding="utf-8").read()
    if f.endswith("thinkers.ts"):
        paths += ["thinkers/" + x + "/" for x in re.findall(r"^\s*id: '([^']+)'", text, re.M)]
    elif f.endswith("books.ts"):
        paths += ["books/" + x + "/" for x in re.findall(r"^\s*id: '([^']+)'", text, re.M)]
    elif f.endswith("topics.ts"):
        paths += ["topics/" + x + "/" for x in re.findall(r"^\s*id: '([^']+)'", text, re.M)]

paths = sorted(set(paths))
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in paths:
    lines.append(f"  <url><loc>{escape(BASE + '#/' + p)}</loc></url>")
lines.append("</urlset>")
(ROOT / "public/sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("sitemap entries:", len(paths))

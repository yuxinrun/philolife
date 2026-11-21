"""Download public-domain / CC0 Wikimedia assets, compress to WebP, generate original book covers.

Run from the repository root:  python scripts/build_assets.py
"""
import html
import io
import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36", "Referer": "https://commons.wikimedia.org/"}
API_UA = {"User-Agent": "PhiloLifeBuilder/1.0 (educational static site; hello@example.com)"}
MAX_BYTES = 45 * 1024 * 1024

# (output relative path, Commons filename or ('search', query), max dimension)
ASSETS = [
    ("public/images/hero/school-of-athens.webp", '"The School of Athens" by Raffaello Sanzio da Urbino.jpg', 1800),

    ("public/images/philosophers/socrates.webp", "Socrates Louvre.jpg", 760),
    ("public/images/philosophers/plato.webp", "Plato Pio-Clemetino Inv305.jpg", 760),
    ("public/images/philosophers/aristotle.webp", "Aristotle Altemps Inv8575.jpg", 760),
    ("public/images/philosophers/epicurus.webp", "Epicurus-Altes Museum.jpg", 760),
    ("public/images/philosophers/epictetus.webp", "Cover of The Discourses of Epictetus, circa 1887.png", 760),
    ("public/images/philosophers/seneca.webp", "Bust of Pseudo-Seneca MET DP359039.jpg", 760),
    ("public/images/philosophers/marcus-aurelius.webp", "Head Marcus Aurelius archmus Heraklion.jpg", 760),
    ("public/images/philosophers/augustine.webp", "Attributed to Francisco de Zurbarán - Saint Augustine, Bishop of Hippo (354-430) in Meditation, circa 1620 - 1624.jpg", 760),
    ("public/images/philosophers/descartes.webp", "Frans Hals - Portret van René Descartes.jpg", 760),
    ("public/images/philosophers/spinoza.webp", "Baruch Spinoza portrait HAB original.jpg", 760),
    ("public/images/philosophers/hume.webp", "David Hume Ramsay.jpg", 760),
    ("public/images/philosophers/rousseau.webp", "'Portrait of Jean-Jacques Rousseau' by François Guérin.jpg", 760),
    ("public/images/philosophers/kant.webp", "Immanuel Kant (1724-1804) engraving.jpg", 760),
    ("public/images/philosophers/hegel.webp", "Georg Wilhelm Friedrich Hegel by Julius Ludwig Sebbers.jpg", 760),
    ("public/images/philosophers/schopenhauer.webp", "Arthur Schopenhauer by J Schäfer, 1859b.jpg", 760),
    ("public/images/philosophers/nietzsche.webp", "Nietzsche1882.jpg", 760),
    ("public/images/philosophers/kierkegaard.webp", "Kierkegaard 1870 by Marstrand.jpg", 760),
    ("public/images/philosophers/heidegger.webp", "Hans Thoma - Schwarzwaldlandschaft (1867) - Staatl. Kunsthalle Karlsruhe.jpg", 900),
    ("public/images/philosophers/sartre.webp", "Johannes Vermeer - Girl Reading a Letter at an Open Window - WGA24614.jpg", 900),
    ("public/images/philosophers/camus.webp", "Crashing Waves-Alfred T Bricher.jpg", 900),
    ("public/images/philosophers/wittgenstein.webp", "Gezicht op de Tempel van Minerva te Athene, RP-P-1941-237.jpg", 900),
    ("public/images/philosophers/confucius.webp", ("search", "Confucius and His Disciples Yanzi and Huizi at the Apricot Altar"), 900),
    ("public/images/philosophers/mencius.webp", "Mencius.jpg", 760),
    ("public/images/philosophers/laozi.webp", "Chen Hongshou - Paintings after Ancient Masters, Laozi Riding an Ox - 1979.27.1.2 - Cleveland Museum of Art.tiff", 900),
    ("public/images/philosophers/zhuangzi.webp", "Dschuang-Dsi-Schmetterlingstraum-Zhuangzi-Butterfly-Dream.jpg", 900),
    ("public/images/philosophers/xunzi.webp", "Portrait of Xun Zi.jpg", 760),
    ("public/images/philosophers/mozi.webp", "Mozi.jpg", 760),
    ("public/images/philosophers/zhu-xi.webp", "Portraits of Famous Men - Zhu Xi.jpg", 760),
    ("public/images/philosophers/wang-yangming.webp", "Qing Painting- Snow Scene of the Mountains Beyond the Great Wall 01.jpg", 1000),
    ("public/images/philosophers/nagarjuna.webp", "Tsapa Namgyal - The Teacher and Philosopher Nagarjuna - Walters 543008.jpg", 900),
    ("public/images/philosophers/buddha.webp", "Stone Buddha Head.jpg", 900),

    ("public/images/articles/meaning.webp", "AsherDurand-Lake Scene Mountains 1874.jpg", 1000),
    ("public/images/articles/happiness.webp", "Cole Thomas The Temple of Segesta with the Artist Sketching 1843.jpg", 1000),
    ("public/images/articles/freedom.webp", "Gezicht op de Tempel van Minerva te Athene, RP-P-1941-237.jpg", 1000),
    ("public/images/articles/loneliness.webp", "Crashing Waves-Alfred T Bricher.jpg", 1000),
    ("public/images/articles/death.webp", "Drawing, Trophy with Winged Hourglass, 1830–1850 (CH 18109261).jpg", 1000),
    ("public/images/articles/fate.webp", "Print, Funffte Ausgab seiner vorhabenden werckes - Unterschiedliche Neuinventirte Verkleiden Zu Modernen und Astonmischen Perpendicul-Uhren - , ca. 1720 (CH 18655073).jpg", 1000),
    ("public/images/articles/love.webp", "Le Jardin chinois (detail) by François Boucher.jpg", 1000),
    ("public/images/articles/thinking.webp", "Johannes Vermeer - Girl Reading a Letter at an Open Window - WGA24614.jpg", 1000),
    ("public/images/articles/values.webp", "Leviathan frontispiece cropped British Museum.jpg", 1000),
    ("public/images/articles/self.webp", "Plato Pio-Clemetino Inv305.jpg", 1000),
    ("public/images/articles/desire.webp", "The Holy Family by Candlelight (Jacob Jordaens) - Nationalmuseum - 18772.tif", 1000),
    ("public/images/articles/uncertainty.webp", "Albert Bierstadt - Untitled (mountains and lake).jpg", 1000),
    ("public/images/articles/suffering.webp", "Ephesus Ruins of the Temple of Diana Eph.jpg", 1000),
    ("public/images/articles/calm.webp", "Albert Bierstadt - Untitled (mountains and lake).jpg", 1000),
    ("public/images/articles/solitude.webp", "Qing Painting- Snow Scene of the Mountains Beyond the Great Wall 03.jpg", 1000),
]

ARTICLE_COPY = {
    "socrates": "socrates", "plato": "plato", "aristotle": "aristotle", "epicurus": "epicurus",
    "seneca": "seneca", "kant": "kant", "schopenhauer": "schopenhauer", "nietzsche": "nietzsche",
    "kierkegaard": "kierkegaard", "hegel": "hegel", "descartes": "descartes", "confucius": "confucius",
    "mencius": "mencius", "laozi": "laozi", "zhuangzi": "zhuangzi", "mozi": "mozi",
    "wang-yangming": "wang-yangming", "zen": "buddha", "buddha": "buddha", "sartre": "sartre",
    "camus": "camus", "heidegger": "heidegger",
}

TOPIC_COPY = {
    "meaning": "articles/meaning", "happiness": "articles/happiness", "freedom": "articles/freedom",
    "self": "articles/self", "death": "articles/death", "love": "articles/love",
}


def api(params):
    params["format"] = "json"
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=API_UA), timeout=45) as r:
        return json.load(r)


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def resolve(spec):
    if isinstance(spec, tuple):
        q = spec[1]
        d = api({
            "action": "query", "generator": "search", "gsrsearch": q + " filetype:bitmap",
            "gsrnamespace": 6, "gsrlimit": 10, "prop": "imageinfo",
            "iiprop": "extmetadata|url", "iiurlwidth": 800,
        })
        for p in d.get("query", {}).get("pages", {}).values():
            ii = p.get("imageinfo", [{}])[0]
            lic = ii.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "")
            if "public domain" in lic.lower() or "cc0" in lic.lower():
                return p["title"], ii
        raise RuntimeError("no PD search result for " + q)
    title = spec if spec.startswith("File:") else "File:" + spec
    d = api({
        "action": "query", "titles": title, "prop": "imageinfo",
        "iiprop": "extmetadata|url|size", "iiurlwidth": 800,
    })
    for p in d.get("query", {}).get("pages", {}).values():
        if "missing" in p:
            raise RuntimeError("missing file: " + title)
        return p["title"], p["imageinfo"][0]
    raise RuntimeError("no result for " + title)


def save_webp(data, out, max_dim):
    img = Image.open(io.BytesIO(data))
    if img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", img.size, (245, 242, 235))
        img = img.convert("RGBA")
        bg.paste(img, mask=img.getchannel("A"))
        img = bg
    else:
        img = img.convert("RGB")
    img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "WEBP", quality=82, method=5)
    return img.size


FONT_CANDIDATES = [
    "C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/simhei.ttf",
    "C:/Windows/Fonts/simsun.ttc", "C:/Windows/Fonts/segoeui.ttf",
]


def font(size):
    for p in FONT_CANDIDATES:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


BOOKS = [
    ("理想国", "柏拉图", "THE REPUBLIC", "#3E4A42"),
    ("尼各马可伦理学", "亚里士多德", "NICOMACHEAN ETHICS", "#4A4038"),
    ("形而上学", "亚里士多德", "METAPHYSICS", "#3A414A"),
    ("沉思录", "马可·奥勒留", "MEDITATIONS", "#4A463B"),
    ("致美诺凯乌斯的信", "伊壁鸠鲁", "LETTER TO MENOECEUS", "#40504A"),
    ("道德经", "老子", "DAO DE JING", "#3F4438"),
    ("庄子", "庄子及后学", "ZHUANGZI", "#464038"),
    ("论语", "孔子及其弟子", "THE ANALECTS", "#4A3F39"),
    ("孟子", "孟子及其弟子", "MENCIUS", "#3E4B43"),
    ("传习录", "王阳明", "CHUANXILU", "#484339"),
    ("坛经", "慧能", "THE PLATFORM SUTRA", "#40483F"),
    ("纯粹理性批判", "康德", "CRITIQUE OF PURE REASON", "#333C45"),
    ("实践理性批判", "康德", "CRITIQUE OF PRACTICAL REASON", "#3A3E48"),
    ("伦理学", "斯宾诺莎", "ETHICS", "#404A42"),
    ("作为意志和表象的世界", "叔本华", "THE WORLD AS WILL", "#3B3E42"),
    ("查拉图斯特拉如是说", "尼采", "THUS SPOKE ZARATHUSTRA", "#4A3E36"),
    ("善恶的彼岸", "尼采", "BEYOND GOOD AND EVIL", "#43403A"),
    ("存在与时间", "海德格尔", "BEING AND TIME", "#35403D"),
    ("存在与虚无", "萨特", "BEING AND NOTHINGNESS", "#3E4048"),
    ("西西弗神话", "加缪", "THE MYTH OF SISYPHUS", "#4B453A"),
    ("局外人", "加缪", "THE STRANGER", "#404648"),
    ("存在主义是一种人道主义", "萨特", "EXISTENTIALISM IS A HUMANISM", "#43443B"),
    ("哲学研究", "维特根斯坦", "PHILOSOPHICAL INVESTIGATIONS", "#3B454B"),
    ("第二性", "波伏娃", "THE SECOND SEX", "#4A4145"),
    ("正义论", "罗尔斯", "A THEORY OF JUSTICE", "#3C4646"),
    ("社会契约论", "卢梭", "THE SOCIAL CONTRACT", "#474138"),
    ("忏悔录", "奥古斯丁", "CONFESSIONS", "#443E36"),
    ("人生的智慧", "叔本华", "THE WISDOM OF LIFE", "#464237"),
    ("悲剧的诞生", "尼采", "THE BIRTH OF TRAGEDY", "#493E3B"),
    ("西方哲学史", "罗素", "A HISTORY OF WESTERN PHILOSOPHY", "#3C434A"),
    ("申辩篇", "柏拉图", "APOLOGY", "#414A43"),
    ("斐多篇", "柏拉图", "PHAEDO", "#3E4148"),
    ("会饮篇", "柏拉图", "SYMPOSIUM", "#4A403E"),
    ("手册", "爱比克泰德", "ENCHIRIDION", "#45473C"),
    ("道德谱系学", "尼采", "ON THE GENEALOGY OF MORALS", "#42403B"),
    ("精神现象学", "黑格尔", "PHENOMENOLOGY OF SPIRIT", "#3B4448"),
    ("焦虑的概念", "克尔凯郭尔", "THE CONCEPT OF ANXIETY", "#444140"),
    ("爱的艺术", "弗洛姆", "THE ART OF LOVING", "#4C433E"),
    ("瓦尔登湖", "梭罗", "WALDEN", "#3F4A3E"),
    ("道德形而上学奠基", "康德", "GROUNDWORK", "#39414A"),
    ("法句经", "佛教经典", "THE DHAMMAPADA", "#41483D"),
    ("金刚经", "大乘佛教经典", "THE DIAMOND SUTRA", "#463F37"),
    ("心经", "大乘佛教经典", "THE HEART SUTRA", "#3F463E"),
    ("逻辑哲学论", "维特根斯坦", "TRACTATUS", "#3B4249"),
]


def wrap_cn(text, max_chars):
    return [text[i:i + max_chars] for i in range(0, len(text), max_chars)]


def make_book_cover(out, idx, title, author, english, color):
    w, h = 700, 1000
    img = Image.new("RGB", (w, h), color)
    d = ImageDraw.Draw(img)
    d.rectangle([28, 28, w - 28, h - 28], outline=(211, 204, 189), width=2)
    d.rectangle([38, 38, w - 38, h - 38], outline=(160, 149, 128), width=1)
    d.line([(w // 2 - 60, 120), (w // 2 + 60, 120)], fill=(161, 122, 80), width=2)
    d.text((w // 2, 92), "PHILOFLIFE · CLASSICS", font=font(17), fill=(200, 192, 174), anchor="mm")

    lines = wrap_cn(title, 9)[:3]
    f = font(60 if len(lines) == 1 else 48)
    y = h // 2 - len(lines) * 34
    for line in lines:
        d.text((w // 2, y), line, font=f, fill=(245, 242, 235), anchor="mm")
        y += 68 if len(lines) == 1 else 60

    d.line([(w // 2 - 50, h // 2 + 130), (w // 2 + 50, h // 2 + 130)], fill=(161, 122, 80), width=1)
    d.text((w // 2, h // 2 + 175), author, font=font(25), fill=(214, 206, 190), anchor="mm")

    ef = font(17)
    ew = d.textlength(english, font=ef)
    step = english.split()
    chunks, cur = [], ""
    for word in step:
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=ef) > w - 140 and cur:
            chunks.append(cur)
            cur = word
        else:
            cur = trial
    if cur:
        chunks.append(cur)
    y = h - 190
    for line in chunks[:3]:
        d.text((w // 2, y), line, font=ef, fill=(190, 182, 165), anchor="mm")
        y += 28

    d.text((w // 2, h - 82), f"{idx:02d}", font=font(20), fill=(161, 122, 80), anchor="mm")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "WEBP", quality=85, method=5)


def main():
    rows = []
    for i, (rel, spec, max_dim) in enumerate(ASSETS, 1):
        out = ROOT / rel
        try:
            title, info = resolve(spec)
            em = info.get("extmetadata", {})
            meta_row = {
                "file": rel, "title": title.replace("File:", ""),
                "artist": strip_html(em.get("Artist", {}).get("value", "")) or "见来源页",
                "source": em.get("DescriptionUrl", {}).get("value", "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))),
                "license": strip_html(em.get("LicenseShortName", {}).get("value", "")) or "见来源页",
                "size": "",
            }
            if out.exists() and out.stat().st_size > 1000:
                from PIL import Image as _Img
                with _Img.open(out) as im:
                    meta_row["size"] = f"{im.width}×{im.height}"
                rows.append(meta_row)
                print(f"[{i}/{len(ASSETS)}] SKIP {rel}")
                continue
            url = info.get("thumburl") or info.get("url")
            if not url:
                raise RuntimeError("no image url")
            url = url.split("?")[0]
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            size = save_webp(data, out, min(max_dim, 1280))
            time.sleep(5)
            meta_row["size"] = f"{size[0]}×{size[1]}"
            rows.append(meta_row)
            print(f"[{i}/{len(ASSETS)}] OK {rel} ({size[0]}x{size[1]})")
        except Exception as e:
            print(f"[{i}/{len(ASSETS)}] FAIL {rel}: {e}")

    fallback = ROOT / "public/images/philosophers/nagarjuna.webp"
    if not fallback.exists():
        source = ROOT / "public/images/philosophers/buddha.webp"
        if source.exists():
            shutil.copyfile(source, fallback)
            rows.append({"file": "public/images/philosophers/nagarjuna.webp", "title": "本地复用：Stone Buddha Head（替代素材，原planned图像下载受限）", "artist": "见 Stone Buddha Head 条目", "source": "项目本地资源复用", "license": "同原始条目（Public domain）", "size": "复用"})

    for out_name, src in ARTICLE_COPY.items():
        src_path = ROOT / "public/images/philosophers" / (src + ".webp")
        dst = ROOT / "public/images/articles" / (out_name + ".webp")
        if src_path.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src_path, dst)
            rows.append({"file": str(dst.relative_to(ROOT)).replace("\\", "/"), "title": f"复用本地资源 {src_path.name}", "artist": "见原始条目", "source": "项目本地资源复用", "license": "同原始条目", "size": "复用"})
    for out_name, src in TOPIC_COPY.items():
        src_path = ROOT / "public/images" / (src + ".webp")
        dst = ROOT / "public/images/topics" / (out_name + ".webp")
        if src_path.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src_path, dst)
            rows.append({"file": str(dst.relative_to(ROOT)).replace("\\", "/"), "title": f"复用本地资源 {src_path.name}", "artist": "见原始条目", "source": "项目本地资源复用", "license": "同原始条目", "size": "复用"})

    for i, (title, author, english, color) in enumerate(BOOKS, 1):
        rel = f"public/images/books/{i:02d}.webp"
        make_book_cover(ROOT / rel, i, title, author, english, color)
        rows.append({"file": rel, "title": f"原创程序化封面：{title}", "artist": "PhiloLife 原创设计（Pillow 程序化生成）", "source": "项目原创", "license": "原创作品，随本站使用", "size": "700×1000"})

    lines = [
        "# 图片来源与授权清单", "",
        "本站所有图片均存储于项目本地，运行时不请求任何远程图片服务。",
        "历史图像均来自 Wikimedia Commons，仅选用标注为 Public domain 或 CC0 的文件；",
        "每一条均记录了原始文件名、作者、来源页面与授权类型。",
        "书籍封面为本站使用 Pillow 程序化生成的原创设计，无第三方版权负担。",
        "无法取得可靠公有领域素材的条目，采用同类公有领域图像或统一风格的原创 SVG 替代，并已在表中注明。",
        "", "| 本地文件 | 原始作品 / 说明 | 作者 | 来源页面 | 授权 | 尺寸 |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for r in rows:
        lines.append("| {file} | {title} | {artist} | {source} | {license} | {size} |".format(**r))
    (ROOT / "image-sources.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Wrote image-sources.md with", len(rows), "entries")


if __name__ == "__main__":
    main()

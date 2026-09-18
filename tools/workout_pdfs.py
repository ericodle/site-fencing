#!/usr/bin/env python3
"""Render docs/park_workouts/*.md to print-ready A4 PDFs.

    python3 tools/workout_pdfs.py            # rebuild every PDF
    python3 tools/workout_pdfs.py 03         # rebuild the ones whose name matches

The Markdown stays the source of truth. Each session's timetable carries its
work-to-rest pattern as the last phrase of the third column — "60 s work / 60 s
rest", "easy throughout", "continuous work", "rest" — and that phrase is what
this script turns into the bars: one timeline across the whole hour, one strip
under every block heading, one strip inside every timetable row. Black is work,
gold is easy, white hatching is rest.

Needs google-chrome on PATH for the HTML-to-PDF step and nothing else.
"""
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "docs", "park_workouts")

WORK, EASY, REST = "work", "easy", "rest"
PX_PER_MIN = 12.0          # 60 min -> 720 user units
BAR_H = 22


# ---------------------------------------------------------------- timetable

def parse_minutes(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def parse_seconds(value, unit):
    return int(value) * (60 if unit.startswith("min") else 1)


PATTERN_RE = re.compile(
    r"(\d+)\s*(s|sec|secs|min|mins)\s*work\s*/\s*(\d+)\s*(s|sec|secs|min|mins)\s*rest",
    re.I)
ROW_RE = re.compile(r"^\|\s*(\d:\d\d)[–-](\d:\d\d)\s*\|([^|]*)\|(.*?)\|\s*$")


def split_intervals(seconds, cell):
    """The (kind, seconds) run of one timetable row."""
    m = PATTERN_RE.search(cell)
    if m:
        work = parse_seconds(m.group(1), m.group(2).lower())
        rest = parse_seconds(m.group(3), m.group(4).lower())
        out, left = [], seconds
        while left > 0:
            out.append((WORK, min(work, left)))
            left -= min(work, left)
            if left <= 0:
                break
            out.append((REST, min(rest, left)))
            left -= min(rest, left)
        return out
    tail = cell.rsplit("·", 1)[-1].strip().lower()
    if tail.startswith("easy"):
        return [(EASY, seconds)]
    if tail.startswith("rest"):
        return [(REST, seconds)]
    return [(WORK, seconds)]


def parse_timetable(text):
    blocks = []
    for line in text.splitlines():
        m = ROW_RE.match(line)
        if not m:
            continue
        start, end, name, work = m.groups()
        seconds = (parse_minutes(end) - parse_minutes(start)) * 60
        blocks.append({
            "start": parse_minutes(start), "end": parse_minutes(end),
            "label": name.strip(), "cell": work.strip(),
            "seconds": seconds, "runs": split_intervals(seconds, work),
        })
    if blocks:
        prev = 0
        for b in blocks:
            if b["start"] != prev:
                raise SystemExit(f"workout_pdfs: gap or overlap at {b['start']} min")
            prev = b["end"]
        if prev != 60:
            raise SystemExit(f"workout_pdfs: schedule ends at {prev} min, not 60")
    return blocks


CHAR_W = 6.4          # user units per character at the timeline label size


def fit_label(label, span):
    """The longest form of a block name that fits inside its segment."""
    head = label.split("—")[0].strip()
    for candidate in (head, head[:4] + ".", head[:1]):
        if len(candidate) * CHAR_W <= span - 3:
            return candidate
    return ""


# ---------------------------------------------------------------- the bars

FILL = {WORK: "url(#work%d)", EASY: "#cbb768", REST: "url(#rest%d)"}
_uid = [0]


def defs(uid):
    return (
        f'<defs>'
        f'<pattern id="rest{uid}" width="6" height="6" patternUnits="userSpaceOnUse" '
        f'patternTransform="rotate(45)">'
        f'<rect width="6" height="6" fill="#ffffff"/>'
        f'<line x1="0" y1="0" x2="0" y2="6" stroke="#c3c7cd" stroke-width="1.6"/>'
        f'</pattern>'
        f'<linearGradient id="work{uid}" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="#2b2b33"/><stop offset="1" stop-color="#16161b"/>'
        f'</linearGradient>'
        f'</defs>')


def runs_svg(runs, width, height, stroke=True):
    """One proportional strip. Width is in user units, scaled to the box."""
    _uid[0] += 1
    uid = _uid[0]
    total = sum(s for _, s in runs) or 1
    x, parts = 0.0, []
    for kind, secs in runs:
        w = width * secs / total
        fill = FILL[kind] % uid if "%d" in FILL[kind] else FILL[kind]
        parts.append(f'<rect x="{x:.2f}" y="0" width="{w:.2f}" height="{height}" fill="{fill}"/>')
        x += w
    edge = (f'<rect x="0.4" y="0.4" width="{width - 0.8:.2f}" height="{height - 0.8}" '
            f'fill="none" stroke="#9aa0a7" stroke-width="0.8"/>') if stroke else ""
    return (f'<svg class="bar" viewBox="0 0 {width} {height}" preserveAspectRatio="none" '
            f'role="img">{defs(uid)}{"".join(parts)}{edge}</svg>')


def timeline_svg(blocks):
    """The whole hour: block letters above, the strip, a minute axis below."""
    _uid[0] += 1
    uid = _uid[0]
    w, top, h = 60 * PX_PER_MIN, 16, BAR_H
    parts = [defs(uid)]
    for b in blocks:
        x = b["start"] * PX_PER_MIN
        span = (b["end"] - b["start"]) * PX_PER_MIN
        cx = x
        for kind, secs in b["runs"]:
            bw = span * secs / b["seconds"]
            fill = FILL[kind] % uid if "%d" in FILL[kind] else FILL[kind]
            parts.append(f'<rect x="{cx:.2f}" y="{top}" width="{bw:.2f}" height="{h}" fill="{fill}"/>')
            cx += bw
        parts.append(f'<line x1="{x:.2f}" y1="{top - 4}" x2="{x:.2f}" y2="{top + h + 4}" '
                     f'stroke="#16161b" stroke-width="1.1"/>')
        key = fit_label(b["label"], span)
        if key:
            half = len(key) * CHAR_W / 2
            cx = min(max(x + span / 2, half), w - half)
            parts.append(f'<text x="{cx:.2f}" y="{top - 5}" text-anchor="middle" '
                         f'class="tl-key">{html.escape(key)}</text>')
    parts.append(f'<rect x="0" y="{top}" width="{w}" height="{h}" fill="none" '
                 f'stroke="#16161b" stroke-width="1.1"/>')
    for minute in range(0, 61, 5):
        x = minute * PX_PER_MIN
        parts.append(f'<line x1="{x}" y1="{top + h}" x2="{x}" y2="{top + h + 5}" '
                     f'stroke="#6b7177" stroke-width="0.8"/>')
        anchor = "start" if minute == 0 else "end" if minute == 60 else "middle"
        parts.append(f'<text x="{x}" y="{top + h + 15}" text-anchor="{anchor}" '
                     f'class="tl-min">{minute}</text>')
    return (f'<svg class="timeline" viewBox="0 0 {w} {top + h + 20}" role="img">'
            f'{"".join(parts)}</svg>')


def block_strip(block):
    """The bar that sits under a block heading, with its own caption."""
    m = PATTERN_RE.search(block["cell"])
    rounds = sum(1 for k, _ in block["runs"] if k == WORK)
    if m:
        caption = (f'{rounds} × {m.group(1)} {m.group(2)} work / '
                   f'{m.group(3)} {m.group(4)} rest')
    else:
        tail = block["cell"].rsplit("·", 1)[-1].strip()
        caption = tail[:1].upper() + tail[1:]
    return (f'<div class="strip"><div class="strip-bar">'
            f'{runs_svg(block["runs"], 720, 14)}</div>'
            f'<div class="strip-cap">{html.escape(caption)}</div></div>')


LEGEND = (
    '<div class="legend">'
    '<span><svg class="sw" viewBox="0 0 20 10" preserveAspectRatio="none">'
    '<rect width="20" height="10" fill="#1d1d23"/></svg>work</span>'
    '<span><svg class="sw" viewBox="0 0 20 10" preserveAspectRatio="none">'
    '<rect width="20" height="10" fill="#cbb768"/></svg>warm-up, mobility, cool-down</span>'
    '<span><svg class="sw" viewBox="0 0 20 10" preserveAspectRatio="none">'
    '<defs><pattern id="legrest" width="6" height="6" patternUnits="userSpaceOnUse" '
    'patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/>'
    '<line x1="0" y1="0" x2="0" y2="6" stroke="#c3c7cd" stroke-width="1.6"/></pattern></defs>'
    '<rect width="20" height="10" fill="url(#legrest)" stroke="#9aa0a7" stroke-width="0.8"/>'
    '</svg>rest</span></div>')


# ---------------------------------------------------------------- markdown

INLINE = [
    (re.compile(r"`([^`]+)`"), r"<code>\1</code>"),
    (re.compile(r"\*\*([^*]+)\*\*"), r"<strong>\1</strong>"),
]
HEAD_RE = re.compile(r"^(\d:\d\d)[–-](\d:\d\d)\s*·\s*(.*)$")


def inline(text):
    out = html.escape(text)
    for pattern, repl in INLINE:
        out = pattern.sub(repl, out)
    return out


def render_table(rows, blocks):
    timed = [ROW_RE.match(r) for r in rows]
    is_timetable = all(timed[i] for i in range(len(rows)) if i not in (0, 1))
    body = []
    for i, row in enumerate(rows):
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if i == 1 and set("".join(cells)) <= set("-: "):
            continue
        tag = "th" if i == 0 else "td"
        rendered = [f"<{tag}>{inline(c)}</{tag}>" for c in cells]
        if is_timetable and i > 1:
            block = next((b for b in blocks if b["label"] == cells[1].strip()
                          and parse_minutes(cells[0].split("–")[0]) == b["start"]), None)
            if block:
                rendered[-1] = (f"<td>{inline(cells[-1])}"
                                f"<span class=\"cellbar\">{runs_svg(block['runs'], 240, 7)}"
                                f"</span></td>")
        body.append("<tr>" + "".join(rendered) + "</tr>")
    cls = "timetable" if is_timetable else "grid"
    return f'<table class="{cls}">{"".join(body)}</table>'


def render(text, blocks):
    lines = text.splitlines()
    out, i, first_para_done = [], 0, False
    by_start = {b["start"]: b for b in blocks}
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("# "):
            out.append(f"<h1>{inline(line[2:])}</h1>")
            i += 1
            continue
        if line.startswith("## "):
            heading = line[3:].strip()
            m = HEAD_RE.match(heading)
            out.append(f"<h2>{inline(heading)}</h2>")
            if m and parse_minutes(m.group(1)) in by_start:
                out.append(block_strip(by_start[parse_minutes(m.group(1))]))
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i])
                i += 1
            out.append(render_table(rows, blocks))
            continue
        if line.startswith("    "):
            buf = []
            while i < len(lines) and (lines[i].startswith("    ") or not lines[i].strip()):
                buf.append(lines[i][4:])
                i += 1
            out.append("<pre>" + html.escape("\n".join(buf).strip("\n")) + "</pre>")
            continue
        bullet = re.match(r"^(-|\d+\.)\s+", line)
        if bullet:
            ordered = not line.startswith("-")
            items, current = [], None
            while i < len(lines) and lines[i].strip():
                m = re.match(r"^(?:-|\d+\.)\s+(.*)$", lines[i])
                if m:
                    if current is not None:
                        items.append(current)
                    current = m.group(1)
                else:
                    current = f"{current} {lines[i].strip()}"
                i += 1
            if current is not None:
                items.append(current)
            tag = "ol" if ordered else "ul"
            out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("|", "#", "    ")) \
                and not re.match(r"^(-|\d+\.)\s+", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        para = " ".join(buf)
        if not first_para_done and out and out[-1].startswith("<h1"):
            out.append(f'<p class="meta">{inline(para)}</p>')
            first_para_done = True
        elif para.startswith("**Marker for the log:**") or para.startswith("**Stop rule:**"):
            out.append(f'<p class="callout">{inline(para)}</p>')
        else:
            out.append(f"<p>{inline(para)}</p>")
    return "\n".join(out)


# ---------------------------------------------------------------- page shell

CSS = """
@page { size: A4; margin: 15mm 14mm 13mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; color: #16161b; background: #fff;
       font: 10.4pt/1.45 "Liberation Serif", Georgia, serif; }
h1 { margin: 0 0 2mm; font-size: 20pt; letter-spacing: .06em; font-weight: 600;
     text-transform: uppercase; }
h2 { margin: 7mm 0 1.6mm; font-size: 12.2pt; letter-spacing: .02em; font-weight: 600;
     border-bottom: 1px solid #d9c98d; padding-bottom: 1.2mm; break-after: avoid; }
h2 + .strip, h2 + p, h2 + ul, h2 + ol, h2 + table { break-before: avoid; }
p { margin: 0 0 2.6mm; }
ul, ol { margin: 0 0 2.8mm; padding-left: 5.5mm; }
li { margin: 0 0 1.2mm; }
code { font: 9pt "DejaVu Sans Mono", monospace; }
pre { font: 8.6pt/1.5 "DejaVu Sans Mono", monospace; background: #f4f4f2;
      border-left: 2px solid #cbb768; padding: 2.4mm 3mm; margin: 0 0 3mm;
      white-space: pre-wrap; break-inside: avoid; }
.meta { font: 8.8pt/1.45 "DejaVu Sans", sans-serif; color: #55595f;
        border-bottom: 2px solid #16161b; padding-bottom: 2.4mm; margin-bottom: 4mm; }
.callout { font-size: 10pt; background: #faf7ec; border-left: 3px solid #cbb768;
           padding: 2mm 3mm; margin: 0 0 2.6mm; break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin: 0 0 3.5mm;
        font: 8.8pt/1.35 "DejaVu Sans", sans-serif; break-inside: avoid; }
th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .07em;
     border-bottom: 1.4px solid #16161b; padding: 0 2mm 1.4mm 0; }
td { vertical-align: top; padding: 1.6mm 2mm 1.6mm 0; border-bottom: .6px solid #dcdee1; }
td:last-child, th:last-child { padding-right: 0; }
.timetable td:first-child { white-space: nowrap; font-variant-numeric: tabular-nums; }
.timetable td:nth-child(2) { font-weight: 600; }
.timetable td:last-child { width: 46%; }
.cellbar { display: block; margin-top: 1.4mm; }
.cellbar .bar { display: block; width: 100%; height: 2.1mm; }
.timeline { display: block; width: 100%; height: auto; margin: 0 0 1.5mm; }
.tl-key { font: 600 11px "DejaVu Sans", sans-serif; fill: #16161b; }
.tl-min { font: 9px "DejaVu Sans", sans-serif; fill: #6b7177; }
.legend { font: 8pt "DejaVu Sans", sans-serif; color: #55595f; margin: 0 0 5mm; }
.legend span { margin-right: 6mm; white-space: nowrap; }
.legend .sw { width: 7mm; height: 2.4mm; margin-right: 1.4mm; vertical-align: middle; }
.strip { margin: 0 0 3mm; break-inside: avoid; }
.strip-bar .bar { display: block; width: 100%; height: 3.4mm; }
.strip-cap { font: 8pt "DejaVu Sans", sans-serif; color: #55595f; margin-top: 1mm; }
.foot { margin-top: 8mm; padding-top: 2mm; border-top: 1px solid #d9c98d;
        font: 8pt "DejaVu Sans", sans-serif; color: #7b8189; }
"""

FOOT = ("Sheshouzuo Fencing Club · 射手座擊劍會 · internal training document · "
        "source: docs/park_workouts/%s")


def page(title, body, source):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
            f'<title>{html.escape(title)}</title><style>{CSS}</style></head><body>'
            f'{body}<p class="foot">{FOOT % html.escape(source)}</p></body></html>')


def build(md_path, out_dir, chrome):
    name = os.path.basename(md_path)
    text = open(md_path, encoding="utf-8").read()
    blocks = parse_timetable(text)
    body = render(text, blocks)
    if blocks:
        marker = '<table class="timetable">'
        intro = timeline_svg(blocks) + LEGEND
        body = body.replace(marker, intro + marker, 1)
    title = text.splitlines()[0].lstrip("# ").strip()
    pdf = os.path.join(out_dir, name[:-3] + ".pdf")
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "page.html")
        with open(src, "w", encoding="utf-8") as f:
            f.write(page(title, body, name))
        subprocess.run(
            [chrome, "--headless", "--disable-gpu", "--no-sandbox",
             f"--user-data-dir={os.path.join(tmp, 'profile')}",
             "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw",
             "--virtual-time-budget=4000", f"--print-to-pdf={pdf}", f"file://{src}"],
            check=True, capture_output=True)
    return pdf


def main():
    chrome = shutil.which("google-chrome") or shutil.which("chromium")
    if not chrome:
        raise SystemExit("workout_pdfs: no google-chrome or chromium on PATH")
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    names = sorted(n for n in os.listdir(SRC) if n.endswith(".md"))
    if wanted:
        names = [n for n in names if any(w in n for w in wanted)]
    if not names:
        raise SystemExit("workout_pdfs: nothing to build")
    for name in names:
        pdf = build(os.path.join(SRC, name), SRC, chrome)
        print(f"  {os.path.relpath(pdf, ROOT)}  {os.path.getsize(pdf) // 1024} KB")


if __name__ == "__main__":
    main()

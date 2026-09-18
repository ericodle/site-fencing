"""The drawn figures: the piste, right of way, a pool sheet, and the
Sagittarius chart.

Each one is generated from the real numbers in geometry.py rather than drawn by
hand, so the shapes stay editable. build.py patches the output into index.html.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from geometry import (STARS, ASTERISM, sgr_project, star_radius,
                      PISTE_LENGTH_M, ON_GUARD_FROM_CENTRE_M, WARNING_ZONE_M)


def piste():
    """Fig. 1 — the strip, to FIE proportion, dimensioned."""
    L, R = 90, 1010
    mid = (L + R) / 2
    u = (R - L) / PISTE_LENGTH_M
    eg = ON_GUARD_FROM_CENTRE_M * u
    warn = WARNING_ZONE_M * u
    hatch = "".join(f'<path d="M{x} 40 L{x + 18} 88"/>'
                    for x in list(range(L, int(L + warn), 10)) + list(range(int(R - warn), R, 10)))
    return (f'<svg class="fig" viewBox="0 0 1100 140" aria-hidden="true">'
            f'<clipPath id="pc"><rect x="{L}" y="40" width="{R - L}" height="48"/></clipPath>'
            f'<g class="hatch" clip-path="url(#pc)">{hatch}</g>'
            f'<rect class="rule" x="{L}" y="40" width="{R - L}" height="48"/>'
            f'<path class="rule bold" d="M{mid:.0f} 30 V98"/>'
            f'<path class="rule dash" d="M{mid - eg:.0f} 40 V88 M{mid + eg:.0f} 40 V88"/>'
            f'<path class="tick" d="M{L} 110 V118 M{R} 110 V118 M{L} 114 H{R}"/>'
            f'<text class="dim" x="{mid:.0f}" y="132" text-anchor="middle">{PISTE_LENGTH_M:.0f} metres</text>'
            f'<text class="dim" x="{mid:.0f}" y="24" text-anchor="middle">centre</text>'
            f'<text class="dim" x="{mid - eg:.0f}" y="24" text-anchor="middle">on guard</text>'
            f'<text class="dim" x="{mid + eg:.0f}" y="24" text-anchor="middle">on guard</text>'
            f'<text class="dim" x="{L + warn / 2:.0f}" y="24" text-anchor="middle">warning</text>'
            f'<text class="dim" x="{R - warn / 2:.0f}" y="24" text-anchor="middle">warning</text>'
            f'</svg>')


def right_of_way():
    """Fig. 2 — the tempo of a phrase. Labels sit clear of the rules."""
    return ('<svg class="fig" viewBox="0 0 1100 150" aria-hidden="true">'
            '<text class="dim" x="150" y="52" text-anchor="end">attacker</text>'
            '<text class="dim" x="150" y="114" text-anchor="end">defender</text>'
            '<path class="rule faint" d="M170 48 H1010 M170 110 H1010"/>'
            '<path class="rule bold" d="M230 48 H560"/><path class="rule bold" d="M560 110 H660"/>'
            '<path class="rule bold" d="M660 110 H880"/>'
            '<path class="tick" d="M230 40 V56 M560 40 V118 M660 102 V118 M880 102 V118"/>'
            '<circle class="node" cx="230" cy="48" r="4"/><circle class="node" cx="560" cy="110" r="4"/>'
            '<circle class="node" cx="880" cy="110" r="4"/>'
            '<text class="dim" x="230" y="28" text-anchor="middle">initiate</text>'
            '<text class="dim" x="560" y="28" text-anchor="middle">arrives</text>'
            '<text class="dim" x="610" y="138" text-anchor="middle">parry</text>'
            '<text class="dim" x="770" y="138" text-anchor="middle">riposte</text>'
            '<path class="brace" d="M560 74 H660 M560 70 V78 M660 70 V78"/>'
            '<text class="dim em" x="610" y="66" text-anchor="middle">one tempo</text>'
            '</svg>')


POOL_NAMES = ["Chen", "Odle", "Ku", "Lin", "Huang"]
POOL_RESULTS = {
    (0, 1): "V5", (0, 2): "D3", (0, 3): "V5", (0, 4): "V5",
    (1, 0): "D4", (1, 2): "V5", (1, 3): "D2", (1, 4): "V5",
    (2, 0): "V5", (2, 1): "D2", (2, 3): "V5", (2, 4): "V5",
    (3, 0): "D3", (3, 1): "V5", (3, 2): "D1", (3, 4): "D4",
    (4, 0): "D1", (4, 1): "D3", (4, 2): "D0", (4, 3): "V5",
}


def pool_sheet():
    """Fig. 3 — a five-fencer pool, diagonal struck out."""
    n, cw, ch, ox, oy = 5, 150, 44, 190, 34
    cells, text = [], []
    for i in range(n):
        for j in range(n):
            x, y = ox + j * cw, oy + i * ch
            if i == j:
                cells.append(f'<rect class="blank" x="{x}" y="{y}" width="{cw}" height="{ch}"/>')
            elif (i, j) in POOL_RESULTS:
                text.append(f'<text class="score" x="{x + cw / 2:.0f}" y="{y + ch / 2 + 6:.0f}" '
                            f'text-anchor="middle">{POOL_RESULTS[(i, j)]}</text>')
    for i in range(n + 1):
        cells.append(f'<path class="rule" d="M{ox} {oy + i * ch} H{ox + n * cw}"/>')
        cells.append(f'<path class="rule" d="M{ox + i * cw} {oy} V{oy + n * ch}"/>')
    for i in range(n):
        text.append(f'<text class="dim" x="{ox - 14}" y="{oy + i * ch + ch / 2 + 4:.0f}" '
                    f'text-anchor="end">{POOL_NAMES[i]}</text>')
        text.append(f'<text class="dim" x="{ox + i * cw + cw / 2:.0f}" y="{oy - 12}" '
                    f'text-anchor="middle">{i + 1}</text>')
    return (f'<svg class="fig pool" viewBox="0 0 {ox + n * cw + 30} {oy + n * ch + 20}" '
            f'aria-hidden="true">{"".join(cells)}{"".join(text)}</svg>')


def sky_chart(width=560.0):
    """The fixed background chart. Right-hand pad keeps the longest star name in."""
    P = {k: sgr_project(v[0], v[1]) + (v[2], v[3], v[4]) for k, v in STARS.items()}
    xs = [p[0] for p in P.values()]
    ys = [p[1] for p in P.values()]
    x0, x1 = min(xs) - 1.2, max(xs) + 5.6
    y0, y1 = min(ys) - 2.0, max(ys) + 2.0
    h = round(width * (y1 - y0) / (x1 - x0))

    def to(x, y):
        return (round((x - x0) / (x1 - x0) * width, 1), round((y - y0) / (y1 - y0) * h, 1))

    grid = []
    d = -45
    while d <= -15:
        a, b = to(*sgr_project(17.8, d)), to(*sgr_project(19.8, d))
        grid.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}"/>')
        d += 5
    r = 18.0
    while r <= 19.51:
        a, b = to(*sgr_project(r, -13.0)), to(*sgr_project(r, -47.0))
        grid.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}"/>')
        r += 0.5
    seg = []
    for a, b in ASTERISM:
        pa, pb = to(P[a][0], P[a][1]), to(P[b][0], P[b][1])
        seg.append(f'<path d="M{pa[0]} {pa[1]} L{pb[0]} {pb[1]}"/>')
    dots, labels = [], []
    for k, (x, y, mag, bayer, name) in P.items():
        px, py = to(x, y)
        rad = star_radius(mag)
        dots.append(f'<circle cx="{px}" cy="{py}" r="{rad}"/>')
        labels.append(f'<text class="bayer" x="{round(px + rad + 4, 1)}" y="{round(py - 4, 1)}">{bayer}</text>')
        if name:
            labels.append(f'<text class="starname" x="{round(px + rad + 4, 1)}" '
                          f'y="{round(py + 8, 1)}">{name}</text>')
    return (f'<svg viewBox="0 0 {width:.0f} {h}">'
            f'<g class="grid">{"".join(grid)}</g>'
            f'<g class="asterism">{"".join(seg)}</g>'
            f'<g class="stars">{"".join(dots)}</g>'
            f'<g class="labels">{"".join(labels)}</g></svg>')

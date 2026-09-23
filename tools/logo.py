#!/usr/bin/env python3
"""Trace the club emblem into assets/logo.svg.   Needs numpy, pillow, vtracer.

The source is assets/logo-2.png: an engraving in black ink on paper, with two
gold hilts. The site is dark, so the trace inverts it — the ink becomes light
linework on nothing, and the hilts keep their gold — which is also why it is a
trace and not the PNG with its background knocked out: black ink on a black
page would vanish.

Two layers, traced separately, because they want opposite treatment:

- The ink is one color, so it is traced as a binary mask and filled with a
  single light value. This is the part that is faithful down to the hatching.
- The hilts are traced in color, after a light median filter and a palette of
  twelve golds. Without both, the engraving texture turns every hilt into
  thousands of slivers and the file into megabytes; with more of either they
  go flat and read as cartoon brass.

Ink within a few pixels of gold is dropped: in the original it is the dark
outline that separates each hilt from the paper, and inverted it becomes a
white halo around it.

Run it when the source art changes, then tools/icons.py for the rasters.
"""
import os, re, tempfile
import numpy as np
from PIL import Image, ImageFilter
import vtracer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SCALE = 2           # trace at twice the source size: smoother curves
INK = "#ecedef"     # --paper in css/styles.css
GOLDS = 12
HALO_PX = 7
TRACE = dict(corner_threshold=60, splice_threshold=45, path_precision=1, mode="spline")


def trace(image, **opts):
    with tempfile.TemporaryDirectory() as tmp:
        src, out = os.path.join(tmp, "in.png"), os.path.join(tmp, "out.svg")
        image.save(src)
        vtracer.convert_image_to_svg_py(src, out, **TRACE, **opts)
        svg = open(out).read()
    # vtracer writes translate() offsets to fourteen places; one is plenty.
    svg = re.sub(r"\d+\.\d{2,}", lambda m: f"{float(m.group()):.1f}", svg)
    return re.findall(r"<path [^>]*/>", svg)


def main():
    src = Image.open(os.path.join(ROOT, "assets/logo-2.png")).convert("RGB")
    w, h = src.width * SCALE, src.height * SCALE
    big = src.resize((w, h), Image.LANCZOS)
    rgb = np.asarray(big)
    px = rgb.astype(float) / 255

    gold = (px.max(axis=2) - px.min(axis=2)) > 0.16
    near_gold = np.asarray(Image.fromarray(np.where(gold, 255, 0).astype("uint8"))
                           .filter(ImageFilter.MaxFilter(HALO_PX))) > 0
    ink = (px.mean(axis=2) < 0.55) & ~near_gold

    ink_paths = trace(Image.fromarray(np.where(ink, 0, 255).astype("uint8")),
                      colormode="binary", filter_speckle=6, length_threshold=4.0)
    ink_paths = [re.sub(r' fill="[^"]*"', "", p) for p in ink_paths]

    smooth = np.asarray(big.filter(ImageFilter.MedianFilter(3)))
    palette = (Image.fromarray(smooth[gold].reshape(-1, 1, 3))
               .quantize(colors=GOLDS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
               .convert("RGB"))
    hilts = rgb.copy()
    hilts[gold] = np.asarray(palette).reshape(-1, 3)
    alpha = np.where(gold, 255, 0).astype("uint8")
    gold_paths = trace(Image.fromarray(np.dstack([hilts, alpha]), "RGBA"),
                       colormode="color", hierarchical="stacked", filter_speckle=6,
                       color_precision=8, layer_difference=1, length_threshold=3.0)

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" '
           f'aria-label="Kuou Fencing Club">\n'
           f'<g>{"".join(gold_paths)}</g>\n'
           f'<g fill="{INK}">{"".join(ink_paths)}</g>\n</svg>\n')
    with open(os.path.join(ROOT, "assets/logo.svg"), "w") as f:
        f.write(svg)
    print(f"wrote assets/logo.svg ({len(svg) // 1024} KB, {len(ink_paths)} ink + {len(gold_paths)} gold paths)")


if __name__ == "__main__":
    main()

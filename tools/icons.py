#!/usr/bin/env python3
"""Render the PNG rasters from their SVG sources.  Needs cairosvg."""
import os
import cairosvg

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

cairosvg.svg2png(url=os.path.join(ROOT, "assets/img/og.svg"),
                 write_to=os.path.join(ROOT, "assets/img/og.png"),
                 output_width=1200, output_height=630)
for size in (180, 192, 512):
    name = "apple-touch-icon" if size == 180 else f"icon-{size}"
    cairosvg.svg2png(url=os.path.join(ROOT, "assets/favicon.svg"),
                     write_to=os.path.join(ROOT, f"assets/img/{name}.png"),
                     output_width=size, output_height=size)
print("rendered og.png, apple-touch-icon.png, icon-192.png, icon-512.png")

#!/usr/bin/env python3
"""Render every raster from its SVG source.   Needs cairosvg and pillow.

    assets/logo.webp        the emblem as the pages show it: header, footer, app
    assets/favicon.png      the emblem on the page's ground
    assets/img/*icon*.png   home-screen icons, emblem inside the maskable safe zone
    assets/img/og.png       the social card

The pages load the WebP rather than logo.svg: the trace is 670 KB of engraving,
and at the sizes the emblem is shown a 320px raster is indistinguishable from it
at a twentieth of the weight.
"""
import io, os
import cairosvg
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
LOGO = os.path.join(ROOT, "assets/logo.svg")
GROUND = (10, 10, 11, 255)   # --ink-900 in css/styles.css


def path(rel):
    return os.path.join(ROOT, rel)


def emblem(height):
    return Image.open(io.BytesIO(cairosvg.svg2png(url=LOGO, output_height=height))).convert("RGBA")


def icon(size, fill):
    """The emblem centered on the ground, `fill` of the icon's height."""
    mark = emblem(round(size * fill))
    square = Image.new("RGBA", (size, size), GROUND)
    square.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return square


emblem(320).save(path("assets/logo.webp"), quality=86, method=6)
icon(64, 0.94).save(path("assets/favicon.png"), optimize=True)
# Maskable icons are cropped to a circle 80% of the width; the emblem's own
# circle has to sit inside it.
for size in (180, 192, 512):
    name = "apple-touch-icon" if size == 180 else f"icon-{size}"
    icon(size, 0.76).convert("RGB").save(path(f"assets/img/{name}.png"), optimize=True)
# `unsafe` lets cairosvg follow the card's href to ../logo.svg; without it the
# emblem is silently left out.
cairosvg.svg2png(url=path("assets/img/og.svg"), write_to=path("assets/img/og.png"),
                 output_width=1200, output_height=630, unsafe=True)
print("rendered logo.webp, favicon.png, apple-touch-icon.png, icon-192.png, icon-512.png, og.png")

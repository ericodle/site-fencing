"""Shared source data for everything drawn on the site.

The site's figures are not decoration — the coastline, the star positions and
the piste dimensions are real, and this module is where those numbers live so
they stay editable. Nothing here writes files; see build.py.
"""
import math

# ── Taiwan ───────────────────────────────────────────────────────────────────
# Coarse coastline, clockwise from the northern cape (Fugui) round to the
# north-west. 29 points: enough to be recognisably Taiwan, not a survey.
# Used by the brand mark in marks.py.
COASTLINE = [
    (121.53, 25.30), (121.65, 25.28), (121.92, 25.13), (121.86, 24.98),
    (121.83, 24.60), (121.78, 24.35), (121.65, 24.05), (121.52, 23.75),
    (121.44, 23.40), (121.40, 23.10), (121.25, 22.80), (121.05, 22.55),
    (120.92, 22.25), (120.86, 21.92), (120.75, 22.05), (120.62, 22.30),
    (120.45, 22.50), (120.28, 22.65), (120.18, 22.90), (120.10, 23.20),
    (120.08, 23.55), (120.14, 23.85), (120.35, 24.12), (120.52, 24.35),
    (120.75, 24.62), (120.92, 24.85), (121.05, 25.05), (121.20, 25.15),
    (121.38, 25.28),
]

_TW_LAT0 = math.radians(23.6)


def tw_project(lon, lat):
    """Equirectangular, scaled by cos(lat) so the island is not stretched."""
    return ((lon - 120.0) * math.cos(_TW_LAT0), -(lat - 25.5))


def tw_bounds(pad=0.10):
    pts = [tw_project(*c) for c in COASTLINE]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad


def tw_outline(to_px):
    """Closed path for the coastline, given a projected->pixel mapper."""
    parts = []
    for i, c in enumerate(COASTLINE):
        x, y = to_px(*tw_project(*c))
        parts.append(f"{'M' if i == 0 else 'L'}{x} {y}")
    return " ".join(parts) + " Z"


# ── Sagittarius ──────────────────────────────────────────────────────────────
# J2000 right ascension (hours), declination (degrees), visual magnitude,
# Bayer letter, proper name. The Teapot plus its northern and southern outliers.
STARS = {
    "gamma2":  (18 + 5/60 + 48.5/3600, -(30 + 25/60 + 27/3600), 2.99, "γ", "ALNASL"),
    "delta":   (18 + 20/60 + 59.6/3600, -(29 + 49/60 + 41/3600), 2.70, "δ", "KAUS MEDIA"),
    "epsilon": (18 + 24/60 + 10.3/3600, -(34 + 23/60 + 5/3600),  1.85, "ε", "KAUS AUSTRALIS"),
    "lambda":  (18 + 27/60 + 58.2/3600, -(25 + 25/60 + 18/3600), 2.81, "λ", "KAUS BOREALIS"),
    "phi":     (18 + 45/60 + 39.4/3600, -(26 + 59/60 + 27/3600), 3.17, "φ", ""),
    "sigma":   (18 + 55/60 + 15.9/3600, -(26 + 17/60 + 48/3600), 2.05, "σ", "NUNKI"),
    "zeta":    (19 + 2/60 + 36.7/3600,  -(29 + 52/60 + 49/3600), 2.60, "ζ", "ASCELLA"),
    "tau":     (19 + 6/60 + 56.4/3600,  -(27 + 40/60 + 14/3600), 3.32, "τ", ""),
    "mu":      (18 + 13/60 + 45.8/3600, -(21 + 3/60 + 32/3600),  3.85, "μ", ""),
    "eta":     (18 + 17/60 + 37.6/3600, -(36 + 45/60 + 42/3600), 3.11, "η", ""),
    "xi2":     (18 + 57/60 + 43.9/3600, -(21 + 6/60 + 24/3600),  3.51, "ξ", ""),
    "omicron": (19 + 4/60 + 40.9/3600,  -(21 + 44/60 + 30/3600), 3.77, "ο", ""),
    "pi":      (19 + 9/60 + 45.8/3600,  -(21 + 1/60 + 25/3600),  2.89, "π", ""),
}

# The standard asterism: the Teapot, plus lambda-mu and epsilon-eta, plus the
# northern chain xi2-omicron-pi.
ASTERISM = [
    ("gamma2", "delta"), ("delta", "epsilon"), ("delta", "lambda"),
    ("lambda", "phi"), ("phi", "sigma"), ("sigma", "tau"), ("tau", "zeta"),
    ("zeta", "epsilon"), ("zeta", "phi"), ("lambda", "mu"),
    ("epsilon", "eta"), ("xi2", "omicron"), ("omicron", "pi"),
]

_SGR_DEC0 = math.radians(-28.0)


def sgr_project(ra_hours, dec_deg):
    return (-(ra_hours * 15.0) * math.cos(_SGR_DEC0), -dec_deg)


def star_radius(mag):
    """Brighter stars draw larger, as they do on a real chart."""
    return round(max(1.0, 3.7 - 0.74 * mag), 2)


# ── The piste ────────────────────────────────────────────────────────────────
PISTE_LENGTH_M = 14.0     # FIE t.4
ON_GUARD_FROM_CENTRE_M = 2.0
WARNING_ZONE_M = 2.0      # the hatched stretch before each rear limit

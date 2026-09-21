"""The brand marks: logo, favicon and the social card.

The mark is the Sagittarius arrow crossing the island — the sign the club is
named for, over the ground it fences on.

The island is ground, not figure: a dark fill with a silver coast, so it sits
behind the gold arrow rather than competing with it. A mid-tone silhouette was
tried first and read as a grey blob, because island and arrow shared a value.
Below roughly 40px the coast drops out and the mark falls back to the arrow
alone, which is the honest limit of putting two forms in one square.

Avoid SVG <mask> in anything here: the PNG icons are rendered with cairosvg,
which does not apply them the way browsers do.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from geometry import tw_bounds, tw_outline

# These mirror --grad-gold in css/styles.css, which is the palette's source of
# truth. SVG gradient stops cannot read CSS custom properties, so the values are
# restated here; if the palette moves, move both.
GOLD_SHAFT = ('<stop offset="0" stop-color="#8f7320"/>'
              '<stop offset=".28" stop-color="#d4af37"/>'
              '<stop offset=".46" stop-color="#fbf0c4"/>'
              '<stop offset=".62" stop-color="#d4af37"/>'
              '<stop offset="1" stop-color="#a8862a"/>')
GOLD_HEAD = ('<stop offset="0" stop-color="#fbf0c4"/>'
             '<stop offset=".45" stop-color="#e0c25e"/>'
             '<stop offset="1" stop-color="#9c7f26"/>')


def island_path(height, cx, cy, ndigits=1):
    """Taiwan sized to `height`, centred on (cx, cy). Returns (path, width)."""
    x0, x1, y0, y1 = tw_bounds(pad=0.02)
    w = height * (x1 - x0) / (y1 - y0)

    def to_px(x, y):
        return (round(cx - w / 2 + (x - x0) / (x1 - x0) * w, ndigits),
                round(cy - height / 2 + (y - y0) / (y1 - y0) * height, ndigits))

    return tw_outline(to_px), w


def logo(size=64, aria="Kuou Fencing Club"):
    island, _ = island_path(height=size * 0.81, cx=size * 0.50, cy=size * 0.50)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="{aria}">
  <defs>
    <linearGradient id="sz-shaft" x1="8" y1="60" x2="56" y2="14" gradientUnits="userSpaceOnUse">{GOLD_SHAFT}</linearGradient>
    <linearGradient id="sz-head" x1="34" y1="14" x2="50" y2="30" gradientUnits="userSpaceOnUse">{GOLD_HEAD}</linearGradient>
    <linearGradient id="sz-steel" x1="22" y1="32" x2="32" y2="42" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7d858c"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#8b9298"/>
    </linearGradient>
  </defs>
  <!-- Taiwan, as ground: dark fill, silver coast, behind the arrow -->
  <path d="{island}" fill="#191b1e"/>
  <path d="{island}" fill="none" stroke="#b9c0c7" stroke-width="1.4" stroke-linejoin="round"/>
  <!-- Sagittarius arrow: the gold shaft brightens toward the point -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
    <path d="M12 52 L50 14" stroke="url(#sz-shaft)"/>
    <path d="M34 14 H50 V30" stroke="url(#sz-head)"/>
    <path d="M22 32 L32 42" stroke="url(#sz-steel)" stroke-width="4.5"/>
  </g>
</svg>
'''


def favicon(size=64):
    island, _ = island_path(height=size * 0.80, cx=size * 0.50, cy=size * 0.50)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  <defs>
    <linearGradient id="s" x1="8" y1="60" x2="56" y2="14" gradientUnits="userSpaceOnUse">{GOLD_SHAFT}</linearGradient>
    <linearGradient id="h" x1="33" y1="16" x2="48" y2="31" gradientUnits="userSpaceOnUse">{GOLD_HEAD}</linearGradient>
  </defs>
  <rect width="{size}" height="{size}" rx="14" fill="#0a0a0b"/>
  <path d="{island}" fill="#1c1f22"/>
  <path d="{island}" fill="none" stroke="#b9c0c7" stroke-width="1.5" stroke-linejoin="round"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
    <path d="M14 50 L48 16" stroke="url(#s)"/>
    <path d="M33 16 H48 V31" stroke="url(#h)"/>
    <path d="M23 33 L31 41" stroke="#dfe4e8" stroke-width="4.5"/>
  </g>
</svg>
'''


def social_card():
    """The 1200x630 Open Graph card. Same mark, drawn large."""
    island, _ = island_path(height=340, cx=830, cy=315, ndigits=0)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="shaft" x1="0" y1="1" x2="1" y2="0">{GOLD_SHAFT}</linearGradient>
    <linearGradient id="head" x1="0" y1="0" x2="1" y2="1">{GOLD_HEAD}</linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7d858c"/><stop offset="0.45" stop-color="#ffffff"/><stop offset="1" stop-color="#8b9298"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0b"/>

  <!-- Taiwan, then the arrow across it -->
  <path d="{island}" fill="#17191c"/>
  <path d="{island}" fill="none" stroke="#b9c0c7" stroke-width="2" stroke-linejoin="round" opacity="0.85"/>
  <g transform="translate(830 315) scale(1.15)">
    <circle r="185" fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="1.5"/>
    <circle r="160" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5" stroke-dasharray="4 12"/>
    <g stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M-110 110 L100 -100" stroke="url(#shaft)" stroke-width="16"/>
      <path d="M20 -100 H106 V-14" stroke="url(#head)" stroke-width="16"/>
      <path d="M-48 8 L2 58" stroke="url(#steel)" stroke-width="13"/>
    </g>
    <circle cx="-110" cy="110" r="15" fill="#7d858c"/>
  </g>

  <g font-family="DejaVu Sans, sans-serif">
    <text x="90" y="214" fill="#d4af37" font-size="26" letter-spacing="7">TAIPEI, TAIWAN  ·  EST. 2019</text>
    <text x="90" y="300" fill="#ecedef" font-size="66" font-weight="bold" letter-spacing="1">KUOU</text>
    <text x="90" y="374" fill="#ecedef" font-size="66" font-weight="bold" letter-spacing="1">FENCING CLUB</text>
    <text x="90" y="440" fill="#b9c0c7" font-size="40" font-family="Droid Sans Fallback, sans-serif">擊劍會</text>
    <text x="90" y="508" fill="#a8aeb5" font-size="27">Physical · Mental · Data-driven</text>
    <text x="90" y="548" fill="#a8aeb5" font-size="27" font-family="Droid Sans Fallback, sans-serif">身體・心理・數據導向・銳劍　軍刀</text>
  </g>
  <rect x="0" y="614" width="1200" height="16" fill="url(#head)"/>
</svg>
'''


if __name__ == "__main__":
    root = os.path.join(os.path.dirname(__file__), "..")
    open(os.path.join(root, "assets/logo.svg"), "w").write(logo())
    open(os.path.join(root, "assets/favicon.svg"), "w").write(favicon())
    open(os.path.join(root, "assets/img/og.svg"), "w").write(social_card())
    print("wrote assets/logo.svg, assets/favicon.svg, assets/img/og.svg")

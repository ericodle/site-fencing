"""The social card.

The emblem itself is traced from the artwork by logo.py; the card places it
beside the club's name. It is referenced, not inlined, so the card never goes
stale against the emblem — cairosvg resolves the relative href when icons.py
renders the PNG, as a browser does opening the SVG.
"""
import os

# Mirrors the gold end of --grad-gold in css/styles.css, which is the palette's
# source of truth. SVG gradient stops cannot read CSS custom properties, so the
# values are restated here; if the palette moves, move both.
GOLD_HEAD = ('<stop offset="0" stop-color="#fbf0c4"/>'
             '<stop offset=".45" stop-color="#e0c25e"/>'
             '<stop offset="1" stop-color="#9c7f26"/>')


def social_card():
    """The 1200x630 Open Graph card: the name on the left, the emblem on the right."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="head" x1="0" y1="0" x2="1" y2="1">{GOLD_HEAD}</linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0b"/>
  <image href="../logo.svg" x="680" y="62" width="460" height="473"/>

  <g font-family="DejaVu Sans, sans-serif">
    <text x="90" y="214" fill="#d4af37" font-size="26" letter-spacing="7">TAIPEI, TAIWAN  ·  EST. 2019</text>
    <text x="90" y="300" fill="#ecedef" font-size="66" font-weight="bold" letter-spacing="1">KUOU</text>
    <text x="90" y="374" fill="#ecedef" font-size="66" font-weight="bold" letter-spacing="1">FENCING CLUB</text>
    <text x="90" y="440" fill="#b9c0c7" font-size="40" font-family="Droid Sans Fallback, sans-serif">古歐擊劍會</text>
    <text x="90" y="508" fill="#a8aeb5" font-size="27">Physical · Mental · Data-driven</text>
    <text x="90" y="548" fill="#a8aeb5" font-size="27" font-family="Droid Sans Fallback, sans-serif">身體・心理・數據導向・銳劍　軍刀</text>
  </g>
  <rect x="0" y="614" width="1200" height="16" fill="url(#head)"/>
</svg>
'''


if __name__ == "__main__":
    root = os.path.join(os.path.dirname(__file__), "..")
    open(os.path.join(root, "assets/img/og.svg"), "w").write(social_card())
    print("wrote assets/img/og.svg")

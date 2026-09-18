# Sheshouzuo Fencing Club · 射手座擊劍會

Marketing site for **Sheshouzuo Fencing Club** — an online-first fencing club in
Taipei. Three pillars: **physical training**, **mental training**, **data-driven**.
Épée and saber, taught in English and Chinese, at regular venues and pop-up
practices all over the city.

**射手座** is Sagittarius, the archer — the sign the club opened beneath in
December 2019 — and the logo is that archer's arrow. There is a pun in the name:
箭 (arrow) and 劍 (sword) are both *jiàn*.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
package manager. Open `index.html` in a browser and it works.

```
index.html          the whole page
404.html            not-found page
css/styles.css      all styling
js/config.js        the bits an owner edits — form endpoint, socials, language
js/events.js        club calendar events, which also feed the tournament desk
js/main.js          language switch, nav, reveals, share, embeds, calendar, contact form
assets/             logo, favicon, social card, generated icons, star tiles
site.webmanifest    installable-app metadata
sitemap.xml         one URL; update lastmod when the copy changes materially
.github/workflows/  deploys the repo root to GitHub Pages on push to main
```

## Palette

Black, gold and silver, with blue and green as accents. All of it is defined
once as tokens at the top of `css/styles.css` and referenced everywhere else;
nothing in the stylesheet hardcodes a brand hex.

Black is the ground, kept neutral so the two metals read as metal on it:

| Token | Hex | Role |
| --- | --- | --- |
| `--ink-900` | `#0a0a0b` | page ground |
| `--ink-800` … `--ink-600` | `#101012` → `#212125` | raised surfaces, in that order |
| `--onyx` | `#0a0a0b` | the dark label that sits on every bright fill |
| `--line` / `--line-strong` | white at 9% / 18% | borders |

Gold is primary, silver secondary:

| Token | Hex | Role |
| --- | --- | --- |
| `--gold` | `#d4af37` | the core gold |
| `--gold-soft` / `--gold-bright` | `#e0c25e` / `#f2d98a` | lit ends of the gold range |
| `--gold-deep` | `#8f7320` | **fills only** — 4.4:1 on the ground, under AA for text |
| `--silver` | `#b9c0c7` | the core silver |
| `--silver-soft` / `--silver-deep` | `#dfe4e8` / `#7d858c` | lit and shaded silver |

Blue `#5aa9e6` and green `#52c98a` are accents, used only where they carry
meaning — never as decoration. Green is success (`.reg-pill.open`,
`.form-status.ok`). Both, with gold and silver, give the five calendar event
types a real categorical spread: weekly silver, practice blue, tournament gold,
inter-club green, social deep gold. `.form-status.err` stays warm on purpose:
an error must not read as a success.

Three rules the tokens exist to keep:

- **Silver is a light metal.** Anything sitting on a silver or gold fill takes
  `--onyx`, not `--paper`. This is the inversion to watch when editing older
  rules: the secondary color used to be dark and wanted light text on it.
- **`--gold-deep` is the only token that cannot carry text on the ground.**
  Everything else clears AA: silver 10.8:1, gold 9.4:1, green 9.5:1, blue 7.8:1.
- **Gradients clipped to text, or sitting under a dark label, stay light end to
  end.** That is `--grad-lit`. `--grad-gold`, `--grad-silver` and `--grad-duo`
  run into their dark stops and are decorative only.

`.btn-line` is outlined rather than filled, so it reads as secondary to the gold
primary beside it while keeping LINE's `#06c755` in the border and glyph.
`.line-fab` stays solid — it floats alone.

### Making it read as metal

Fencing is a metal sport, so gold and silver are treated as surfaces rather than
as colors. Three things do the work, and they are meant to be used together:

- **Specular ramps.** `--grad-gold`, `--grad-silver` and `--grad-duo` alternate
  bright and dark stops across the face instead of ramping smoothly from one
  tone to another — that alternation is what the eye reads as a reflection
  rolling off a curved surface. `--grad-lit` does the same but keeps every stop
  light, so the dark label it carries still clears AA (worst stop 10.4:1).
- **`--brushed`.** Fine directional striations, layered *over* a metal fill as a
  second background layer: `background: var(--brushed), var(--grad-lit)`.
- **`--bevel` / `--bevel-soft`.** Inset shadows that light the top edge and
  shade the bottom, so a filled element reads as a machined plate rather than a
  painted rectangle. `--bevel` is for large surfaces, `--bevel-soft` for chips
  and small icon plates.

Cards get the same idea more cheaply: a 1px lit line as the first layer of their
background, which bevels the top edge without another pseudo-element (`.card`
already uses `::after` for its hover border and `.pillar` uses `::before` for
its accent bar).

The arrow mark in `assets/logo.svg`, the favicon, the og card and the hero art
all share one blade gradient — dark, bright, specular white band, bright, dark —
so the shaft catches light the way a blade does.

### The background

Not flat black. Four layers, back to front:

1. `body` background — `--ink-900`.
2. `body::before` (z −3) — gold light from one corner, silver from the other,
   black deepening at the bottom.
3. `.starfield` (z −2) — `--mesh` and `--sheen` as a static background on the
   wrapper, with the two drifting star layers as children on top. `--mesh` is a
   pair of hairline rulings at a 9px pitch: a fencing mask is a fine wire grid,
   and it is the one piece of metal every fencer looks through. `--sheen` is a
   coarser brushed striation across the same plate. The wrapper is masked with a
   radial gradient so the texture fades at the edges and reads as texture rather
   than as a chart grid — it is masked on its own layer precisely so it does not
   dim the corner glows underneath it.
4. `body::after` (z −1) — film grain.

### The night sky

The club is named after a constellation, so the background is one. A fixed
`.starfield` div holds two tiled layers — `assets/img/stars-far.svg` (dense,
tiny, dim) and `assets/img/stars-near.svg` (sparse, brighter) — drifting in
opposite directions at different speeds, so scrolling past reads as depth rather
than wallpaper. Stars are white, silver and a few gold, so the sky belongs to
the palette. Both tiles are generated, not hand-placed, and tile seamlessly.

Stars are kept deliberately small and dim. A bright 2px dot next to a nav label
reads as a stray period, which is why anything sitting over the sky — the nav,
the marquee, the hero kicker, every card — carries an opaque dark base rather
than a translucent one.

The layering, back to front: `body` background (the ground), `body::before`
(nebula glows, z −3), `.starfield` (z −2), `body::after` (film grain, z −1),
then content.

The constellation drawn in the hero art and again in the closing CTA band is the
real thing: the Teapot asterism of Sagittarius, plotted from J2000 right
ascension and declination for its eight main stars — Kaus Australis, Nunki, Kaus
Media, Ascella, Kaus Borealis, Alnasl, Phi and Tau. Star size follows visual
magnitude, so the brightest stars in the sky are the brightest on the page, and
the connecting lines are the standard asterism. Both are inline SVG at true
proportions; if you resize one, scale it, do not stretch it.

`prefers-reduced-motion` stops the drift and the twinkle along with everything
else, and the sky is hidden in print.

## Running it locally

Any static server works. The page also opens straight from the filesystem, but a
server is closer to production:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Bilingual content

Every translatable string is a pair of data attributes on the element that holds
it, so both languages are in the HTML source — readable, indexable, and visible
even with JavaScript off:

```html
<h2 data-en="Pick your weapon" data-zh="選擇你的劍">Pick your weapon</h2>
```

Attributes use the same pattern with the attribute name appended:
`data-en-placeholder`, `data-zh-aria-label`, and so on for `title`, `alt` and
`value`.

`js/main.js` swaps them on load and when the EN / 中文 switch is pressed. The
choice is remembered in `localStorage`, and `?lang=zh` forces one for a link you
are sending to somebody. A first-time visitor gets Chinese if their browser asks
for Chinese, English otherwise — change `defaultLang` in `js/config.js` to pin it.

**To add a section**: write the markup, put both languages on every text element,
and add `class="reveal"` to fade it in on scroll.

## What to change before this goes live

Placeholder details are scattered through `index.html`. Search and replace:

| Placeholder | Where |
| --- | --- |
| `sheshouzuo.tw` | canonical link, Open Graph URLs, JSON-LD, `robots.txt`, `sitemap.xml` |
| `@sheshouzuofencing` | social rail, social cards, footer, coach links, JSON-LD `sameAs` |
| `@sheshouzuo` (LINE) | every `line.me` link, plus `js/config.js` |
| `+886 2 2762 1234` | contact list, footer, WhatsApp link, JSON-LD |
| `hello@sheshouzuo.tw` | `#contact` channels, footer, `js/config.js` (contact form inbox) |
| Address and coordinates | `#visit` section, JSON-LD `address` / `geo`, map `data-q` |
| `REPLACE_WITH_YOUTUBE_ID` | `data-video` on the YouTube embed in `#social` |
| Coach bios and photos | `#coaches` |
| Calendar events (samples) | `js/events.js` — also feeds the `#tournaments` list |
| Park meeting point (Minsheng Park) | `#faq`, `#visit`, `js/events.js` |

Coach portraits are gradient placeholders showing initials. Drop a photo in and
it takes over:

```html
<div class="portrait"><img src="assets/img/coach-odle.jpg" alt="Coach Eric Odle"></div>
```

The Instagram wall works the same way — the six tiles in `#social` are gradient
placeholders that link to the profile. Put post images in `assets/img/feed/` and
point each tile at its post.

## Social integrations

- **Links**: a fixed left rail on desktop, a card grid in `#social`, and the
  footer — Instagram, Facebook, LINE, YouTube, Threads, Discord, WhatsApp.
- **LINE**: the primary contact channel, as it should be in Taiwan. Hero
  button, a floating button on mobile, and the first row in `#contact`.
- **Embeds**: the YouTube player, the Facebook page plugin and the map are
  *click-to-load*. Nothing third-party is requested until a visitor asks for it,
  which keeps the page fast and keeps their cookies out of it until they opt in.
- **Sharing**: the native share sheet where the browser supports it, with LINE,
  Facebook, WhatsApp and copy-link as the fallback row.
- **Cards**: Open Graph and Twitter tags point at `assets/img/og.png` (1200×630,
  regenerate from `assets/img/og.svg`).
- **Search**: `SportsClub` JSON-LD in the `<head>` carries the address, hours,
  languages and social profiles.

## The contact form

There is no booking system: people reach out on LINE, Instagram, WhatsApp,
Facebook or email, all listed in `#contact`. The form next to that list sends an
email without leaving the page. `js/config.js` decides where it goes:

- `formEndpoint: ""` — posts through [FormSubmit](https://formsubmit.co) to
  `email`. No account needed; the first message sends an activation link to
  that inbox, and nothing is delivered until it is clicked. `email` is a
  placeholder, so replace it before launch.
- `formEndpoint: "https://formspree.io/f/xxxxxxxx"` — or any endpoint that
  accepts a `POST` of JSON. Formspree, Formspark, Basin, a Cloudflare Worker.

If sending fails, the visitor is told to email the address directly or use LINE.

There is a honeypot field bots fill in and people never see; those submissions
are dropped silently.

## The calendar

The club is online-first, so `#calendar` is the one schedule: weekly sessions,
pop-up practices all over Taipei, tournaments and socials, in a month grid with
type filters, a list of the month's special events, and a details dialog
with a map link. Past events stay on
the grid, dimmed, and cannot be opened.

Events live in `js/events.js` — there is no database yet. Each one has a
`type` (`practice`, `tournament`, `interclub` or `social`), `start` and `end`
in Taipei time (`"2026-10-03 09:00"`, or a bare date for all-day and multi-day
events), and English and Chinese `title`, `place` and `details`. Give an event
a `registration` object and it also appears in the tournament desk list. Add
`repeat: "weekly"` and an `until` date for a regular session: it appears every
week on the grid, under the Weekly filter, but stays out of the month's list of
special events. The field reference is at the top of the file.

## Deploying

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
Enable it once under **Settings → Pages → Build and deployment → Source: GitHub
Actions**. For a custom domain, add a `CNAME` file containing the domain and
point the DNS at GitHub.

Any other static host works too — there is nothing to build, so
`netlify deploy`, `wrangler pages deploy .` or an rsync to a VPS all work on the
directory as it stands.

## Regenerating images

`assets/img/og.png` and the app icons come from the SVGs next to them:

```bash
python3 - <<'PY'
import cairosvg
cairosvg.svg2png(url="assets/img/og.svg", write_to="assets/img/og.png", output_width=1200, output_height=630)
for size in (180, 192, 512):
    name = "apple-touch-icon" if size == 180 else f"icon-{size}"
    cairosvg.svg2png(url="assets/favicon.svg", write_to=f"assets/img/{name}.png", output_width=size, output_height=size)
PY
```

## Accessibility and performance notes

- Single stylesheet, single script, one web-font request, two small star
  tiles. No trackers.
- Everything reachable by keyboard; the mobile menu closes on `Escape`.
- `prefers-reduced-motion` switches off the reveals, the floating arrow and
  smooth scrolling.
- The FAQ is native `<details>`, so it works before JavaScript runs.

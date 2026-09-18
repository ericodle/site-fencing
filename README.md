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

A neutral dark base, with "jade cave" as the accent palette on top of it. Both
are defined once as tokens at the top of `css/styles.css` and referenced
everywhere else; nothing in the stylesheet hardcodes a brand hex.

The base is what stops the page reading as one flat wash of green:

| Token | Hex | Role |
| --- | --- | --- |
| `--ink-900` | `#0b0d0e` | page ground |
| `--ink-800` … `--ink-600` | `#111416` → `#222829` | raised surfaces, in that order |
| `--line` / `--line-strong` | white at 9% / 18% | borders, deliberately neutral |

The four jade cave colors then sit on that base as accent:

| Token | Hex | Role |
| --- | --- | --- |
| `--cave` | `#00201e` | jade-tinted depth, and the dark label on every bright fill |
| `--slate` | `#3a5268` | the cold pole; secondary accent, never body text |
| `--jade` | `#007f5f` | fills and structure, not text on the ground |
| `--spark` | `#00e88a` | the bright edge; accents, hover, primary CTA |

`--jade-soft`, `--jade-deep`, `--slate-soft` and `--slate-deep` are derived from
those four.

Three rules the tokens exist to keep:

- **`--jade` and `--slate` are too dark to carry text on `--ink-900`** (3.9:1 and
  2.4:1). Text on the ground uses `--paper`, `--muted`, `--spark` or
  `--slate-soft`; `--jade` and `--slate` are for fills, borders and icons.
- **Gradients clipped to text, or sitting under a dark label, stay light end to
  end.** That is what `--grad-spark` is for. `--grad-jade`, `--grad-slate` and
  `--grad-cave` run into their dark stops and are decorative only.
- **`.btn-line` is outlined, not filled.** LINE's `#06c755` is fixed by their
  brand and lands about 47 units from `--jade-soft` in sRGB, so a filled LINE
  button and a filled primary read as the same button. The border and glyph keep
  the green; the fill does not. `.line-fab` stays solid — it floats alone.

The one deliberate off-palette color is `.form-status.err`, which stays warm: an
error must not read as a success in an all-green scheme.

### The night sky

The club is named after a constellation, so the background is one. A fixed
`.starfield` div holds two tiled layers — `assets/img/stars-far.svg` (dense,
tiny, dim) and `assets/img/stars-near.svg` (sparse, brighter) — drifting in
opposite directions at different speeds, so scrolling past reads as depth rather
than wallpaper. Both tiles are generated, not hand-placed, and tile seamlessly.

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

# Ember Tide Fencing Club · 焰潮擊劍會

Marketing site for **Ember Tide Fencing Club** — Taipei's only bilingual fencing
club. Foil, épée and sabre, coached in English and Mandarin, in Songshan District.

> 箭出如火，劍走如水。 The arrow flies like fire. The blade flows like water.

The name joins the two elements the club trains — **ember** for the attack you
commit to entirely, **tide** for the defense that yields and returns — under
Sagittarius, the archer, the sign the club opened beneath in December 2019. The
Chinese name 焰潮 carries the same pair, and the logo is the archer's arrow, half
flame and half water. There is a pun hiding in it: 箭 (arrow) and 劍 (sword) are
both *jiàn*.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
package manager. Open `index.html` in a browser and it works.

```
index.html          the whole page
404.html            not-found page
css/styles.css      all styling
js/config.js        the bits an owner edits — form endpoint, socials, language
js/main.js          language switch, nav, reveals, share, embeds, booking form
assets/             logo, favicon, social card, generated icons
site.webmanifest    installable-app metadata
sitemap.xml         one URL; update lastmod when the copy changes materially
.github/workflows/  deploys the repo root to GitHub Pages on push to main
```

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
| `embertide.tw` | canonical link, Open Graph URLs, JSON-LD, `robots.txt`, `sitemap.xml` |
| `@embertidefencing` | social rail, social cards, footer, coach links, JSON-LD `sameAs` |
| `@embertide` (LINE) | every `line.me` link, plus `js/config.js` |
| `+886 2 2762 1234` | contact list, footer, WhatsApp link, JSON-LD |
| `hello@embertide.tw` | contact list, footer, `js/config.js` |
| Address and coordinates | `#visit` section, JSON-LD `address` / `geo`, map `data-q` |
| `REPLACE_WITH_YOUTUBE_ID` | `data-video` on the YouTube embed in `#social` |
| Coach names, bios and photos | `#coaches` |
| Prices, schedule rows | `#pricing`, `#schedule` |

Coach portraits are gradient placeholders showing initials. Drop a photo in and
it takes over:

```html
<div class="portrait"><img src="assets/img/coach-lin.jpg" alt="Coach Lin Wei-chen"></div>
```

The Instagram wall works the same way — the six tiles in `#social` are gradient
placeholders that link to the profile. Put post images in `assets/img/feed/` and
point each tile at its post.

## Social integrations

- **Links**: a fixed left rail on desktop, a card grid in `#social`, and the
  footer — Instagram, Facebook, LINE, YouTube, TikTok, Threads, Discord, WhatsApp.
- **LINE**: the primary contact channel, as it should be in Taiwan. Header
  button, hero button, a floating button on mobile, and the contact list.
- **Embeds**: the YouTube player, the Facebook page plugin and the map are
  *click-to-load*. Nothing third-party is requested until a visitor asks for it,
  which keeps the page fast and keeps their cookies out of it until they opt in.
- **Sharing**: the native share sheet where the browser supports it, with LINE,
  Facebook, WhatsApp and copy-link as the fallback row.
- **Cards**: Open Graph and Twitter tags point at `assets/img/og.png` (1200×630,
  regenerate from `assets/img/og.svg`).
- **Search**: `SportsClub` JSON-LD in the `<head>` carries the address, hours,
  languages and social profiles.

## The booking form

`js/config.js` decides where a trial request goes:

- `formEndpoint: ""` — opens the visitor's mail app with the request filled in.
  Works with no backend at all, which is where the site starts.
- `formEndpoint: "https://formspree.io/f/xxxxxxxx"` — or any endpoint that
  accepts a `POST` of JSON. Formspree, Formspark, Basin, a Cloudflare Worker.

There is a honeypot field bots fill in and people never see; those submissions
are dropped silently.

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

- Single stylesheet, single script, one web-font request. No trackers.
- Everything reachable by keyboard; the mobile menu closes on `Escape`.
- `prefers-reduced-motion` switches off the reveals, the floating arrow and
  smooth scrolling.
- The schedule is a real `<table>` with headers; the FAQ is native `<details>`,
  so it works before JavaScript runs.

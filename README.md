# Kuou Fencing Club

Marketing site for **Kuou Fencing Club** — an online-first fencing club in
Taipei. Three pillars: **physical training**, **mental training**, **data-driven**.
Épée and saber, taught in English and Chinese, at regular venues and pop-up
practices all over the city.

The emblem is the club's crest — crossed épée and saber over Taiwan, KUOU
interlaced across them — and `.skychart` plots Sagittarius, the sign the club
opened beneath in December 2019. The Chinese name is **古歐擊劍會**, and
**古歐** alone wherever the English says just "Kuou".

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
package manager. Open `index.html` in a browser and it works.

```
index.html          the whole page
404.html            not-found page
css/styles.css      all styling
js/config.js        the bits an owner edits — form endpoint, socials, language,
                    and the member app's address
js/events.js        club calendar events, which also feed the tournament desk
js/main.js          language switch, nav, reveals, share, embeds, calendar, contact form
assets/             emblem (artwork, trace, raster), favicon, social card, icons
tools/              generators for every drawing (see below)
site.webmanifest    installable-app metadata
sitemap.xml         one URL; update lastmod when the copy changes materially
wrangler.jsonc      Cloudflare Workers config — domain, 404 handling
.assetsignore       what the deploy leaves out (docs/, tools/, git plumbing)
.github/workflows/  deploys the repo root to Cloudflare Workers on push to main
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

The specular ramps reference these tokens for their named stops; only the
in-between highlight and shade values are literals, because those have no token.
`tools/marks.py` restates the gold values because SVG gradient stops cannot read
CSS custom properties — that is the one place the palette is duplicated, and it
is commented as such.

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

### Line work, not light

The look is engraved rather than lit. There is no glow, no `backdrop-filter`, no
radial atmosphere, no gradient-clipped text and no border radius anywhere in the
stylesheet — depth comes from drawn geometry, hairline rules and overlap. Gold is
ink, not a light source. `--rule` and `--rule-faint` are the two structural
hairlines everything is drawn with.

Cards are printed plates: a rule, plus a second rule set outside it with
`outline-offset`, which costs nothing and reads as a plate border rather than a
drop shadow. Buttons are flat ink with a hard edge.

The metal ramps (`--grad-gold`, `--grad-silver`, `--grad-duo`) survive only on
thin rules and bars — a 2px edge with a specular ramp reads as a metal edge,
where the same ramp across a button face reads as plastic.

### The figures

Each principle carries the diagram that goes with it, drawn in hairlines, and
this is why the plates run full width rather than in three columns: the figures
label themselves at 9px in their own viewBox, which is unreadable at column
width.

- **Fig. 1** — the piste to FIE proportion: 14 m, centre line, on-guard lines at
  2 m either side, hatched warning zones, dimensioned.
- **Fig. 2** — right of way as a tempo diagram: the attack initiates and
  arrives, the parry answers, the riposte follows, with the one-tempo window
  braced.
- **Fig. 3** — a pool sheet: five fencers, V/D notation, the diagonal struck out.

Figure styling lives under `.fig` — `.rule`, `.tick`, `.hatch`, `.brace`,
`.node`, `.dim`, `.score`. Strokes carry `vector-effect: non-scaling-stroke` so
hairlines stay 1px at any render size.

### The sky

`.skychart` is a fixed, drawn star chart, not a field of dots: Sagittarius
plotted from J2000 right ascension and declination for thirteen stars, with the
coordinate grid ruled, magnitudes to scale and the Bayer designations labelled.
It replaced a drifting starfield, which was decorative where this is accurate.

The ground behind it is two drawn textures. `--mesh` is a fencing-mask wire grid
at a 9px pitch. `--streaks` lays silver hairlines diagonally across it, like
blade traces or the grain of brushed steel — five rulings at coprime pitches
(231/521, 149/331, 86/211, 59/157, 23/41) and mixed weights, so the set never
resolves into an obvious repeat. Plates sit on an opaque `--ink-800`, so the
streaks read in the open space between them and never behind body copy.

### Type

Cinzel for display, EB Garamond for body, Noto Serif TC for Chinese. The sans
that was here before was the single clearest tell that the design came out of a
kit. A transitional serif has a smaller x-height, so the whole scale is set a
step larger than it would be for a sans — the base is `clamp(1.18rem, 1.08rem +
0.4vw, 1.34rem)`.

## The drawings are generated

Every drawn asset — the three figures, the sky chart, the emblem and the social
card — comes out of `tools/`, not out of hand-edited path data. The source numbers are real
and they live in one place so they stay editable.

```
tools/geometry.py   the numbers: Sagittarius in J2000 RA/Dec, the FIE piste
                    dimensions
tools/figures.py    the four drawings built from those numbers
tools/marks.py      the social card
tools/build.py      regenerates everything and patches it into the markup
tools/logo.py       traces the emblem artwork into assets/logo.svg
                    (needs numpy, pillow, vtracer)
tools/icons.py      renders the rasters (needs cairosvg, pillow)
```

```bash
python3 tools/build.py          # rewrite the assets, report what changed
python3 tools/build.py --check  # exit 1 if anything is out of date
python3 tools/icons.py          # then re-render the PNGs
```

`build.py` finds each figure in the markup by the class on its `<svg>`, so the
surrounding captions, figure wrappers and bilingual attributes are never
touched.

### The emblem

The artwork is `assets/logo-2.png`: an engraving in black ink on paper, with
gold hilts. The site is dark, so `tools/logo.py` traces it inverted into
`assets/logo.svg` — light linework, gold kept — rather than knocking out the
paper, which would leave black ink on a black page. Its docstring has the
tracing trade-offs. The source PNG is not deployed.

The pages show `assets/logo.webp`, rendered from the SVG by `tools/icons.py`,
not the SVG itself: the trace is 670 KB of engraving, and at 60–120px a raster
is indistinguishable from it. The emblem carries the club's name, so the header
and footer show it alone, with no text lockup beside it. The member app uses
the same files, copied into its `public/`.

Change the artwork, then:

```bash
python3 tools/logo.py && python3 tools/icons.py
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
`data-en-placeholder`, `data-zh-aria-label`, and so on for `title`, `alt`,
`value` and `content` — the full list is `ATTRS` at the top of `js/main.js`.

`js/main.js` swaps them on load and when the EN / 中文 switch is pressed. The
`<title>` and the meta description use the same pattern — `data-en`/`data-zh` on
the title, `data-en-content`/`data-zh-content` on the meta — so the markup is
the only place either string lives. They used to be restated inside `main.js`,
which meant editing the messaging in two files and keeping them in sync by
hand. The
choice is remembered in `localStorage`, and `?lang=zh` forces one for a link you
are sending to somebody. A first-time visitor gets Chinese if their browser asks
for Chinese, English otherwise — change `defaultLang` in `js/config.js` to pin it.

**To add a section**: write the markup, put both languages on every text element,
and add `class="reveal"` to fade it in on scroll.

## What to change before this goes live

Placeholder details are scattered through `index.html`. Search and replace:

| Placeholder | Where |
| --- | --- |
| `@kuoufencing` | social rail, social cards, footer, coach links, JSON-LD `sameAs`, every `line.me` link, plus `js/config.js` |
| `+886 2 2762 1234` | contact list, footer, WhatsApp link, JSON-LD |
| `hello@kuou.dev` | `#contact` channels, footer, `js/config.js` (contact form inbox) |
| Address and coordinates | `#visit` section, JSON-LD `address` / `geo`, map `data-q` |
| `REPLACE_WITH_YOUTUBE_ID` | `data-video` on the YouTube embed in `#social` |
| Coach bios and photos | `#coaches` |
| Calendar events (samples) | `js/events.js` — also feeds the `#tournaments` list |
| Park meeting point (Minsheng Park) | `#faq`, `#visit`, `js/events.js` |
| `app.kuou.dev` | `appUrl` in `js/config.js`, plus the fallback `href` on each `[data-app-link]` |

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

## The member app

The club runs a separate app — attendance polls, bouts, competition results — at
its own subdomain. Three links point at it: one in the header on desktop, one in
the collapsed menu on a phone, and one in the footer under **Club**. All three
carry `data-app-link`, and `js/main.js` rewrites their `href` from `appUrl` in
`js/config.js` on load, so the address is set in one place.

The literal `href` in `index.html` is the no-JS fallback and is what a visitor
with JavaScript off follows, so it has to stay in step with `appUrl` — or just
change `appUrl` and let the rewrite handle the rest.

`data-app-link`'s value is the path to append, so a second link elsewhere can
point at `/signup` or `/calendar` without touching the script.

The button is silver rather than gold on purpose. Gold is for what a *visitor*
came to do — get in touch — and this one is for somebody who already joined.

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

The site is served by **Cloudflare Workers** at `www.kuou.dev`, straight off
the Workers static asset store. There is no `main` in `wrangler.jsonc` and no
Worker code: a request for a file that exists is answered by Cloudflare's asset
store without a Worker ever running, so traffic costs nothing and there is no
cold start. A request for a path that does not exist gets `404.html`.

The asset directory is the repository root — nothing is built, so the repo *is*
the site. `.assetsignore` is what keeps `docs/` (internal administration: the
mission statement, waiver and media release), `tools/` and the git plumbing out
of the upload. Anything added to the repo that must not be served has to be
listed there. To see exactly what a deploy would publish:

```bash
WRANGLER_LOG=debug npx wrangler@4 deploy --dry-run 2>&1 | grep 'Ignoring asset'
```

### Credentials

`wrangler` reads `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` from a
`.env` file in the repository root. It is gitignored and is the only place
either value lives on this machine — nothing about the account is baked into a
tracked file, which is why a fresh clone has to write it:

```bash
cat > .env <<'EOF'
CLOUDFLARE_ACCOUNT_ID=...   # dashboard → Workers & Pages → right-hand sidebar
CLOUDFLARE_API_TOKEN=...    # My Profile → API Tokens → "Edit Cloudflare Workers"
EOF
npx wrangler@4 deploy
```

Scope the token to this account and the `kuou.dev` zone.

`npx wrangler@4 login` works instead of a token for a one-off deploy from this
machine, but CI needs the token either way.

### Continuous deploys

Pushing to `main` deploys via `.github/workflows/deploy.yml`, which runs the
same `wrangler deploy`. It needs the same two values as repository secrets —
**Settings → Secrets and variables → Actions** → `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN`. (Cloudflare's own Workers Builds can watch the repo
instead, from the dashboard, if you would rather not keep a token on GitHub.)

### DNS

`wrangler.jsonc` claims `www.kuou.dev` as a custom domain, so the first deploy
creates the DNS record and orders the certificate by itself — there is no
record to add by hand, and no CNAME file. The zone just has to already be in
the Cloudflare account.

The apex is the one piece that lives in the dashboard. Add a proxied `AAAA`
record for `@` pointing at `100::` (the discard address — it exists only to
give Cloudflare something to intercept), then **Rules → Redirect Rules** with
hostname `kuou.dev` → dynamic redirect to
`concat("https://www.kuou.dev", http.request.uri.path)`, 301. Keep SSL/TLS on
**Full (strict)**; `.dev` is HSTS-preloaded, so plain HTTP is never an option
anyway.

Any other static host still works — there is nothing to build, so a Netlify
deploy, GitHub Pages or an rsync to a VPS all work on the directory as it
stands.

## Accessibility and performance notes

- Single stylesheet, single script, one web-font request. Every drawing is
  inline SVG; the only image the page requests is the emblem, at 35 KB. No
  trackers.
- Everything reachable by keyboard; the mobile menu closes on `Escape`.
- `prefers-reduced-motion` switches off the reveals, the floating arrow and
  smooth scrolling.
- The FAQ is native `<details>`, so it works before JavaScript runs.
- Form controls are floored at 16px, because iOS Safari zooms the page when a
  focused control is smaller than that.

### On a phone

Four breakpoints, and two of them exist for reasons specific to this design:

- **1180px** — the fixed social rail goes.
- **1020px** — the plate prose and index drop to one column. The figures carry
  9px labels inside their own viewBox, and below roughly this width a
  half-measure figure stops resolving them.
- **900px** — the nav collapses to the burger, and the sky chart becomes a
  background rather than a companion to the type.
- **560px** — buttons go full width, the plate's outer rule is dropped because
  it costs 5px of gutter a phone cannot spare, and the CTA constellation is
  hidden.

The figures do not shrink to fit a phone. They keep their real size and scroll
sideways inside `.plate-fig`, with the caption pinned via `position: sticky`,
because the labelled detail is the whole point of them — a piste diagram
squeezed to 350px is a smudge.

# Квадрат — Design System

**Квадрат** ("Kvadrat", Russian for "square") is a real-estate agency ("Агентство
недвижимости") operating a Cian-style classifieds site: property catalog
(new-builds, apartments, rooms, houses, land, commercial), mortgage brokerage,
articles/news/promotions, and a team of realtors. The brand voice is
"личный агент по недвижимости" — a personal, always-reachable agent, not an
anonymous listings board.

This design system was extracted from:

- **Figma file** — a single high-fidelity homepage mockup ("Untitled.fig",
  page `Page-1`, frame `Main`, node `1:2`, 1920×8621px). The file defines **no
  Figma components** (0 local/external) — it is one large static comp, not a
  component library — so the reusable primitives in `components/` are this
  system's own standard set, inferred from the comp's repeated visual
  patterns (buttons, cards, pills, icon rings), not copied 1:1 from named
  Figma components.
- **`kvadrat-laravel` codebase** (mounted read-only) — a Laravel 13 (API) +
  Nuxt 4 (frontend) monorepo for the same product, still in the *design/
  planning* phase: extensive architecture docs (`docs/architecture/`, `docs/adr/`)
  but no bootstrapped UI code yet (`apps/web/app/app.vue` is the untouched Nuxt
  starter template). It confirms product scope (listings, articles, reviews,
  XML feed import, geo-radius search) but contributed no visual material.
- **Uploaded font files** — the full Proxima Nova family (Regular → Black,
  condensed and extra-condensed cuts, italics), matching the `fontFamily`
  declared throughout the Figma comp.

Nothing in this system was invented from brand guesswork — colors, type
sizes, spacing, shadows, and copy are transcribed from the source comp's
exact values (e.g. the brand blue is `rgb(36,169,226)`, never rounded to a
"nice" hex).

## Index

- `styles.css` — global stylesheet entry point (imports everything under `tokens/`)
- `tokens/` — colors, typography, spacing, shadows, `@font-face`
- `assets/`
  - `logo/` — extracted vector logo (`kvadrat-logo-full.svg`, `kvadrat-mark.svg`)
  - `fonts/` — Proxima Nova `.ttf` files
  - `images/` — property/city/interior photography, avatars, floorplans (from the source comp)
  - `icons/` — misc source vector icons (calculator, calendar, home, star, etc.)
- `components/` — reusable UI primitives (see Components below)
- `guidelines/` — foundation specimen cards (colors, type, spacing, shadows, brand)
- `ui_kits/homepage/` — interactive recreation of the Kvadrat homepage
- `readme.md` — this file

## Components

No source component library existed, so this is a standard set sized to what
the homepage comp actually uses:

- **Core** — `Button`, `Badge`, `IconBadge`, `Avatar`, `Logo`, `StatRing`
- **Forms** — `Input`, `Select`
- **Cards** — `PropertyCard`, `ArticleCard`, `ServiceCard`
- **Navigation** — `NavBar`, `Footer`

### Intentional additions
- `Logo` — a thin wrapper around the extracted SVG artwork; not a Figma
  component, added so the wordmark is reusable and never hand-redrawn.
- `IconBadge` / `StatRing` — the comp repeats a circular-ring visual motif
  (carousel arrows, mortgage-rate callouts) three times with no named
  component behind it; factored out because the pattern is load-bearing to
  the brand's "glow ring" look.

## Content fundamentals

- **Language & register**: all copy is Russian, formal-informal register —
  addresses the reader as "Вы" (formal "you"), e.g. *"Отстаивание Ваших
  интересов и надежная поддержка в любой ситуации"*. Never casual "ты".
- **Voice**: personal-agent, not marketplace. The tagline is *"Ваш личный
  агент по недвижимости"* ("Your personal real-estate agent") — first-person
  possessive framing throughout headers ("Заказать консультацию", "Оставить
  заявку", "Найдем объект по вашим пожеланиям" — "**We'll find** the property
  **for you**").
- **Casing**: sentence case almost everywhere, including headings — never
  full-caps except tiny eyebrow labels (`letter-spacing` wide, `12–14px`,
  e.g. "БОЛЬШАЯ БАЗА", "АГЕНТСТВО НЕДВИЖИМОСТИ") which are set in the CSS via
  `text-transform`, not typed in caps in the copy itself.
- **Numbers as trust signals**: real, specific numbers stand in for
  credibility — phone numbers front-and-center in the header/footer at 22px
  extrabold ("+7 (999) 777-33-50"), interest rates ("8,4%"), price-from
  callouts ("650 тыс. руб"), floor/area specs on every listing ("86 м² · 6/10").
  Never vague ("competitive rates") — always a concrete figure.
- **CTA verbs**: "Заказать" (order/request), "Оставить заявку" (leave a
  request), "Подробнее" (more details), "Все объекты/статьи/услуги" (see-all).
  Short, imperative, 1–3 words, never punctuated with "!".
- **Trust & availability copy**: "Сейчас открыты" (currently open) with a
  live green status dot; dual contact channels always paired (office landline
  + mobile/Viber/WhatsApp) — reachability is a repeated motif.
- **No emoji, no exclamation marks, no ALL-CAPS shouting.** The tone is
  professional-warm, closer to a boutique agency brochure than a marketplace app.
- **Placeholder content**: the source comp itself contains literal lorem-ipsum
  and "Тестовый заголовок ..." placeholder strings in several editorial slots
  (team bio, some card titles) — these are the *comp author's* unfinished
  placeholders, not brand voice to imitate. Real Russian copy exists for every
  primary section (hero, services, mortgage, catalog) and that is what this
  system's UI kit uses.

## Visual foundations

- **Color**: one saturated brand blue (`rgb(36,169,226)` → gradient to
  `rgb(23,140,190)`) used exclusively for CTAs, links, active/status
  accents, and a signature "glow" ring-shadow. Everything else is neutral:
  near-black text (`rgb(27,27,27)`), mid-gray body copy (`rgb(122,122,122)`),
  a dark charcoal (`rgb(47,51,54)`) for header/footer/dark panels, and a
  barely-tinted blue-white (`rgb(245,251,254)`) for section backgrounds — no
  secondary brand hue exists.
- **Type**: Proxima Nova only, at a wide weight range (Thin 100 → Black 900).
  Headlines lean bold/extrabold with *tight* line-height (80–90%) and
  generous positive letter-spacing (3–25% em) — a display-condensed feel
  despite using the regular (not condensed) cut. Body copy is regular-weight
  14px at 130% line-height. Uppercase eyebrow labels always carry wide
  tracking (10–20%).
- **Spacing/layout**: a fixed 1920px desktop canvas with content locked to a
  390px side margin; sections breathe at 60–90px vertical rhythm; card grids
  use small, tight gaps (~21–24px) rather than generous whitespace — density
  reads "real-estate listings," not "airy marketing site."
- **Backgrounds**: full-bleed architectural photography (building exteriors,
  interiors, city aerials) behind dark gradient scrims in the hero and
  mortgage sections; flat blue-white or white section backgrounds elsewhere.
  No repeating patterns/textures, no illustration style — always real photos
  or geometric vector accents (angular "Subtract" cutout shapes bleeding off
  frame edges, used purely as decorative flourishes, never as containers).
- **Shadows — the system's most distinctive trait**: cards on white use a
  **brand-blue-tinted** shadow (`rgba(42,107,155, 0.15–0.4)`), not neutral
  gray/black — softer and warmer than typical Material-style elevation.
  Buttons and dark-panel elements use true black shadow instead
  (`rgba(0,0,0,0.4)`). A third shadow flavor — an inset hairline ring *plus*
  an external blue glow (`0 4px 10px rgb(36,169,226)`) — marks interactive
  circular elements (stat rings, avatar backdrops) as the brand's signature
  "glow" treatment.
  Corner radii: **cards and photos are always square (0px radius)**; buttons,
  pills, filter chips and tags are **always fully rounded** (`border-radius:
  100px`); icon frames and avatars are circles. There is no intermediate
  (8px/12px "soft rounded corner") radius anywhere in the source.
- **Buttons**: one shape (pill), one primary treatment (blue gradient +
  black drop-shadow). Hover/press states are not explicit in the static comp;
  this system applies a conservative `brightness(1.08)` hover and `scale(0.97)`
  press, consistent with the brand's otherwise subtle, non-bouncy motion language.
- **Motion**: the source comp has no animation to observe (a static Figma
  frame) — components here use short (120–150ms) ease transitions for
  hover/press only; no entrance animation, no bounce/spring easing implied
  anywhere in the source's visual language.
- **Transparency/blur**: used sparingly — a faint `rgba(255,255,255,0.02–0.24)`
  wash on decorative cutout shapes and inset hairlines, never a frosted-glass
  blur effect.
- **Imagery color vibe**: warm-neutral color architectural photography (dusk
  building exteriors, daylight interiors) — not black & white, not
  heavily color-graded or grainy.
- **Fixed elements**: header is a two-row dark bar (thin black strip + main
  navigation bar) that sits directly on top of the hero photo with a gradient
  scrim beneath it — not observed to be sticky/fixed on scroll in the static comp.

## Iconography

- **No icon font, no SVG icon library** — the comp uses a handful of
  one-off vector glyphs (calculator, calendar, home, percent badge, star,
  left-arrow) drawn as bespoke paths, copied verbatim into `assets/icons/`.
  There are too few distinct icons in the source to justify a systematic set;
  when a UI kit needs a glyph beyond what's in `assets/icons/`, use a plain
  minimal-stroke SVG in the same weight (1.2–1.5px stroke) rather than
  introducing a different icon family.
- **No emoji, no Unicode-glyph icons** anywhere in the source.
- **Photography stands in for icons** in several places — service tiles use
  a small corner photo rather than a pictogram; only the mortgage-program
  tiles and carousel arrows use true vector icons.
- **The percent badge** (`assets/icons/percent-badge.svg`) is the closest
  thing to a "mascot" icon in the source — a large rounded "%" mark used once
  as a background flourish in the mortgage section.

## Caveats

- **No Figma component library** — every primitive here is inferred from a
  single static comp, not extracted from Figma variants/props. Treat
  `components/` as a faithful *starting point*, not a verbatim port.
- **The codebase is pre-UI** — `kvadrat-laravel/apps/web` has no real
  screens yet, so the homepage UI kit is built purely from the Figma comp.
- **Lorem ipsum in the source** — several comp sections (team bio, footer
  About text) use literal Latin placeholder copy; the UI kit uses the real
  Russian copy that exists, and shortens/omits sections that were pure filler
  rather than inventing new marketing copy.
- **Some source images could not be located** by hash in the extracted asset
  set (a handful of `assets/<hash>.png` references in the comp had no
  matching file) — the UI kit substitutes the nearest available photo of the
  same subject (building exterior, interior, etc.) from the assets that did
  copy successfully.

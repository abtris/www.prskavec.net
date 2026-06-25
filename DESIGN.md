---
name: Prskavec.Net
description: The personal site of an SRE — editorial type lit by a single incident-orange signal on a near-black ground.
colors:
  signal: "#ff5c2e"
  signal-warm: "#ffae3a"
  live: "#b8ff5c"
  ink: "#0c0c0a"
  ink-deep: "#050504"
  paper: "#ede4d3"
  paper-dim: "#8b8378"
  paper-faint: "#857c6e"
  rule: "#2a2823"
  rule-bright: "#3a382f"
typography:
  display:
    fontFamily: "Instrument Serif, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.8rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0"
  headline:
    fontFamily: "Instrument Serif, Iowan Old Style, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Instrument Serif, Iowan Old Style, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0"
  body:
    fontFamily: "Newsreader, Iowan Old Style, Georgia, serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  xs: "1px"
  sm: "2px"
  md: "4px"
  lg: "6px"
  full: "999px"
spacing:
  xs: "0.35rem"
  sm: "0.7rem"
  md: "1.5rem"
  lg: "2rem"
  section: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1rem"
  button-secondary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.paper-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.7rem"
  chip-signal:
    textColor: "{colors.signal}"
  chip-live:
    textColor: "{colors.live}"
  card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "0"
    padding: "2rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.paper-dim}"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.paper}"
---

# Design System: Prskavec.Net

## 1. Overview

**Creative North Star: "The 3AM Console"**

This is the screen an on-call engineer stares into when the pager goes off: a near-black surface where one incident-orange signal is the only thing that earns your eye. The system marries the discipline of a monitoring console — mono labels, ruled separators, a single alert color — with the calm authority of editorial typography. The serif headlines are the expert's voice; the orange is the thing that needs attention. Nothing glows that doesn't matter.

The density is deliberate and confident. Surfaces are flat and matte, lit only by a faint film grain and two barely-there radial glows in the corners, like phosphor bleed on a dark display. Type does the heavy lifting: oversized Instrument Serif italics for the voice, a humanist Newsreader for long-form reading, and JetBrains Mono for every label, tag, and timestamp — the console annotations. Color is rationed. The whole palette is paper-on-ink plus exactly one saturated accent, so when the orange appears it reads as *signal*, never decoration.

This system explicitly rejects the generic-SaaS landing page (gradient blobs, rounded-card grids, hero-metric templates, Inter-everywhere neutrality), the corporate-LinkedIn résumé (stock professionalism, badge walls, buzzword bullets), and the trend-chasing AI template (an eyebrow above every section, identical icon-heading-text card rows). Credibility here comes from craft and the work shown, not from claims. A visitor should wonder how it was built, not which tool built it.

**Key Characteristics:**
- Near-black ground (`ink` #0c0c0a), never a tinted near-white or cream.
- Exactly one saturated accent (`signal` #ff5c2e — Incident Ember), rationed to ≤10% of any surface.
- Three-voice typography: Instrument Serif display, Newsreader body, JetBrains Mono labels.
- Flat by default; depth appears only as a response to state.
- Atmosphere from film grain + corner radial glows, not from shadows or gradients-as-decoration.
- Mono labels carry all metadata (dates, sections, tags) in tracked uppercase.

## 2. Colors

A monochromatic paper-on-ink ramp lit by a single incident-orange signal, with two rare functional accents (warm amber, live green).

### Primary
- **Incident Ember** (`#ff5c2e`): The one saturated color and the whole point of the palette. Used for the single thing that should draw the eye — hover/active states, link underlines, the drop-cap, the `:focus-visible` ring, the live-dot, key italic words in headlines. It is the signal in the noise; spend it sparingly.

### Secondary
- **Warm Amber** (`#ffae3a`): A rarer warm companion to the ember. Inline `code` text and search-result highlight `mark`. Signals "machine token" inside prose without competing with the primary ember.

### Tertiary
- **Live Green** (`#b8ff5c`): Strictly functional. The "upcoming / live / next on stage" status only — the pulsing live-dot and upcoming-talk chips. Never decorative; its presence means "happening soon."

### Neutral
- **Paper** (`#ede4d3`): The primary reading color on the dark ground (~10.5:1 on ink). All body text, headlines, and active labels.
- **Paper Dim** (`#8b8378`): Secondary text — subheads, event names, muted labels, captions (~5.2:1 on ink; clears AA for body).
- **Paper Faint** (`#857c6e`): The quietest legible tier — vertical marginalia, keyboard hints, colophon, the talk/post counts, the faded decorative numbers. Clears AA at ~4.8:1 on ink while staying a step below `paper-dim`, so it reads as "present but subordinate" without dropping below contrast.
- **Ink** (`#0c0c0a`): The body ground. Near-black with the barest warm bias.
- **Ink Deep** (`#050504`): A darker well for recessed surfaces — code blocks, media posters, the search panel backdrop.
- **Rule** (`#2a2823`): The default hairline — borders, dividers, dashed list separators.
- **Rule Bright** (`#3a382f`): The hover/emphasis border, one step up from rule.

### Named Rules
**The One Signal Rule.** Incident Ember appears on ≤10% of any screen. It marks the single thing that matters in that view — the next action, the live event, the active link. If two things are orange, neither reads as signal. Spend it like an alert, not like a brand color.

**The No-Cream Rule.** The ground is `ink`, never a warm near-white. "Paper" is a text color here, not a background. Warmth comes from the ember and the type, never from tinting the surface toward beige.

## 3. Typography

**Display Font:** Instrument Serif (with Iowan Old Style, Georgia, serif)
**Body Font:** Newsreader (with Iowan Old Style, Georgia, serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, monospace)

**Character:** A high-contrast three-voice system. Instrument Serif is the dramatic, slightly theatrical display voice — used large and frequently in italic for emphasis. Newsreader is the workhorse: a warm, readable humanist serif for long-form. JetBrains Mono is the console annotation layer — every date, tag, section marker, and kbd hint. The pairing works because the two serifs sit at opposite ends of their scale (display drama vs. reading calm) and the mono provides a hard machine counterpoint to both.

### Hierarchy
- **Display** (Instrument Serif, 400, `clamp(2.8rem, 8vw, 6rem)`, lh 0.98): Hero headlines and section feature lines. Italic is used liberally for emphasis on key words, often in Incident Ember. Max caps at the 6rem (~96px) display ceiling; ratio 2.14× stays inside the ≤2.5× clamp bound.
- **Headline** (Instrument Serif, 400, `2.5rem`, lh 1.05, ls -0.015em): In-article `h2`. Sets the prose rhythm.
- **Title** (Instrument Serif, 400, `1.875rem`, lh 1.15): Talk-row titles, post-card titles, `h3`. The repeated "object title" voice across listings.
- **Body** (Newsreader, 400, `1.2rem`, lh 1.65): Editorial prose. Capped at 68ch for readable measure; block elements (tables, code, images) span the full column.
- **Label** (JetBrains Mono, 500, `0.875rem`, ls 0.14em, UPPERCASE): All metadata — section markers, dates, tags, nav links, vitals. The console layer. `0.875rem` is the floor; do not set mono labels smaller.

### Named Rules
**The Console-Annotation Rule.** Anything that is metadata — a date, a section name, a tag, a status, a keyboard hint — is set in JetBrains Mono, uppercase, tracked at 0.14em. Prose and headlines are never mono. This split is what makes the page read like an instrument.

**The Italic-Emphasis Rule.** Emphasis in headlines is carried by Instrument Serif *italic* (and occasionally Incident Ember), never by bold or by a heavier weight. The display face has one weight; contrast comes from size, italic, and color.

## 4. Elevation

Flat by default; depth is a response to state, never a resting decoration. At rest, surfaces are matte and separated by hairline rules (`rule` / `rule-bright`), not by shadows. Atmosphere comes from two production sources: a fixed film-grain overlay (SVG fractal noise, ~3.5% opacity, `mix-blend-mode: overlay`) and two faint corner radial glows in Incident Ember/Warm Amber on the body — phosphor-bleed, not drop-shadow. Shadows appear only on interaction.

### Shadow Vocabulary
- **Hard Offset** (`box-shadow: 4px 4px 0 var(--color-rule-bright)`): The signature button hover. A crisp, mechanical offset — no blur — that pairs with a `translate(-2px,-2px)` lift. Reads as a physical key press, not a soft float.
- **Ember Glow** (`box-shadow: 0 8px 24px -12px rgba(255,92,46,0.4)`): Hover lift on media posters. A diffuse ember halo that says "active" without lighting up at rest.
- **Modal Lift** (`box-shadow: 0 30px 80px -20px rgba(0,0,0,0.7)`): Reserved for the search command palette — the one true overlay that must float above everything.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces carry no shadow until the user touches them. Resting depth is hairline rules and tonal layering (`ink` → `ink-deep`). If a card has a drop-shadow sitting idle, it's wrong.

**The Hard-Shadow Rule.** Interactive shadows are crisp offsets (`Xpx Ypx 0`), not soft ambient blur — the mechanical feel is intentional. Soft blur is allowed only for the ember glow and the single modal lift.

## 5. Components

Components feel **precise and mechanical** — sharp 1px rules, 2px radii, hard-offset hover shadows, mono labels. Well-built tooling, not soft product UI.

### Buttons
- **Shape:** Effectively square (2px radius — `rounded.sm`). Mono uppercase label, tracked, with a trailing `→` arrow.
- **Primary (`.link-arrow-primary`):** Ember-filled at rest — `signal` background, `ink` text, `0.7rem 1rem` padding. The one filled-ember element marks the single action that matters (e.g. the hero's "View Talks"). Hover lifts `translate(-2px,-2px)` with a Hard Offset shadow in `ink-deep`. This filled CTA is *the action*; the ember on a status chip's border or an italic headline word is passive emphasis, so the One Signal Rule still holds.
- **Secondary (`.link-arrow`):** Transparent fill, `paper` text, 1px `rule-bright` border, same padding. Hover fills with Incident Ember (text → `ink`), lifts with the Hard Offset shadow.
- **Quiet (`.link-quiet`):** No box — `paper-dim` mono text + arrow, `0.7rem 0.4rem` padding for alignment/tap. Recedes behind the primary; hover shifts to `signal` and nudges the arrow. Used for tertiary hero links (Read Writing, Podcast).

### Chips (`.mono-tag`)
- **Style:** Transparent fill, mono `0.875rem` text, 1px `rule-bright` border, 2px radius, `0.35rem 0.7rem` padding, often led by a glyph (▲ ◆ ◉).
- **State / Variants:** `chip-signal` (ember text + border) for emphasis; `chip-live` (live-green text + border) with a pulsing dot for upcoming/live status; `status-past` (dim text) for archived.

### Cards / Containers (`.card`)
- **Corner Style:** Square (0 radius). The crispness is the point.
- **Background:** `ink` with a near-invisible top-down white gradient (1.2%→0) for the faintest sheen.
- **Shadow Strategy:** None at rest (see Flat-At-Rest Rule); on hover the border brightens to `rule-bright` and the card lifts `translateY(-2px)`.
- **Border:** 1px `rule`. A 2.5rem Incident Ember tick (`.card-accent`) pins the top-left corner.
- **Internal Padding:** `2rem` (`spacing.lg`).

### Inputs / Fields (search palette)
- **Style:** The search input is borderless inside the panel, set in Instrument Serif *italic* `1.55rem` — the one place an input becomes display type. Caret is Incident Ember.
- **Focus:** Global `:focus-visible` is a 2px Incident Ember outline, 3px offset. The palette itself rises with `search-rise` (0.18s) and sits on an ember-tinted blurred backdrop.

### Navigation (`.nav-link`)
- **Style:** Mono uppercase, `paper-dim` at rest. An Incident Ember underline grows from the left (`scaleX(0)→1`) on hover and on `[data-active="true"]`; text brightens to `paper`. Text labels, never icon-only (the search trigger carries an `aria-label` + `sr-only` text).

### Talk Row (signature component)
A three-column baseline-aligned grid (`7rem | 1fr | auto`): mono date, serif title + mono event, trailing arrow. On hover the whole row indents (`padding-left: 0.75rem`) and the title turns Incident Ember — a tactile "this is selectable" shift with no box or background. Collapses to a single column under 700px. This row is the workhorse of the talks and homepage listings and best captures the system's voice: mono metadata, serif object-title, ember on intent.

## 6. Do's and Don'ts

### Do:
- **Do** keep the ground `ink` (#0c0c0a) or `ink-deep` (#050504). Warmth lives in the ember and the type, never in the background.
- **Do** ration Incident Ember to ≤10% of a screen — the one action, link, or status that matters (The One Signal Rule).
- **Do** set every piece of metadata (dates, sections, tags, kbd, status) in JetBrains Mono, uppercase, tracked 0.14em, at ≥0.875rem.
- **Do** carry headline emphasis with Instrument Serif *italic* (and sparing ember), not bold.
- **Do** keep surfaces flat at rest; let shadow be a response to hover/focus only (Hard Offset for buttons, Ember Glow for media).
- **Do** use full 1px borders and hairline rules to separate content, with square-ish corners (0–2px).
- **Do** keep the three text tiers legible: `paper` (~15.6:1) for primary, `paper-dim` (~5.2:1) for secondary, `paper-faint` (~4.8:1) for the quietest metadata — all clear AA. Differentiate them by size/case/tracking, not by dropping below contrast.
- **Do** pair the grain overlay + corner radial glows for atmosphere instead of decorative gradients.
- **Do** gate all motion behind `@media (prefers-reduced-motion: reduce)` — the rise reveals settle to their resting state and the live-dot stops pulsing when the preference is set.

### Don't:
- **Don't** ship the generic-SaaS landing page — no gradient blobs, rounded-card grids, hero-metric templates, or Inter-everywhere neutrality.
- **Don't** drift into the corporate-LinkedIn résumé — no stock-photo professionalism, buzzword bullets, badge walls, or timeline widgets.
- **Don't** scaffold like a trend-chasing AI template — no eyebrow kicker above every section, no identical icon-heading-text card rows. (Numbered section markers like § 01/02/03 count: drop them unless the section truly is an ordered sequence.)
- **Don't** darken `paper-faint` back below ~4.5:1 on ink "for elegance" — the quiet tier must stay legible. Carry "even quieter" decoration with opacity on a passing color, not an out-of-contrast token.
- **Don't** use a colored `border-left`/`border-right` stripe wider than 1px as an accent; use a full border or a corner tick (`.card-accent`) instead.
- **Don't** use `background-clip: text` gradient headlines or decorative glassmorphism.
- **Don't** let two elements be ember at once in the same view — it kills the signal.
- **Don't** soften the system toward beige, rounded, or shadowed-at-rest; if it looks cozy, it's off-brand.

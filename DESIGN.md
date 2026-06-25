---
name: Kipo Design System
description: CFDI 4.0 e-invoicing for Mexican freelancers and micro-businesses — the tool that liberates. Quotes and inventory management available for subscribers.
colors:
  rojo-kipo: "#e00b26"
  rojo-oscuro: "#bc0921"
  rojo-suave: "#f0606c"
  verde-viral: "#C6F542"
  verde-viral-fuerte: "#A9D92B"
  papel: "#f8f6f5"
  papel-sutil: "#edeae8"
  papel-300: "#d5d0cd"
  papel-400: "#aba4a0"
  papel-500: "#7a7370"
  papel-600: "#4d4744"
  papel-700: "#332e2b"
  tinta: "#032641"
  tinta-800: "#0a3352"
  tinta-700: "#124066"
  tinta-600: "#1c4f78"
  tinta-500: "#2d6a9f"
  blanco: "#FFFFFF"
  exito: "#16A34A"
  exito-bg: "#DCFCE7"
  alerta: "#CA8A04"
  alerta-bg: "#FEF9C3"
  peligro: "#bc0921"
  peligro-bg: "#FEE2E5"
  borrador: "#7C3AED"
  borrador-bg: "#EDE9FE"
typography:
  display:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: '"Inter", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: '"Inter", system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  mono:
    fontFamily: '"Geist Mono", ui-monospace, "SF Mono", monospace'
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.rojo-kipo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-accent:
    backgroundColor: "{colors.verde-viral}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.papel-700}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.rojo-kipo}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  card-featured:
    backgroundColor: "{colors.rojo-kipo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  badge-neutral:
    backgroundColor: "{colors.papel-sutil}"
    textColor: "{colors.papel-600}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-brand:
    backgroundColor: "{colors.rojo-oscuro}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  input:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.papel-700}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
---

# Design System: Kipo

## 1. Overview

**Creative North Star: "The Tool That Liberates"**

Kipo is not accounting software — it's SAT bureaucracy transformed into a fast, human tool. The design system carries that promise in every visual decision: the screen that used to intimidate now acts, and acts fast. The identity is not borrowed from the American fintech sector or government portals; it speaks with its own red-and-white accent on deep navy.

The personality is **Modern · Agile · Human**. Modern through resolved information density, typographic weight, and clear hierarchy. Agile because the interface never puts unnecessary screens between the user and their task. Human through the visual temperature (crisp white surfaces, decisive red, deep navy authority) and a voice that doesn't condescend.

The system explicitly rejects two ghosts: the **government portal** (institutional blue, flat hierarchy, intimidating forms) and the **generic American SaaS** (hero-metric big number, navy/gold gradient, stock photos, uppercase eyebrows above every section). If a screen could belong to the SAT or to any San Francisco SaaS, it's poorly designed.

**Key Characteristics:**
- Color as signature, not decoration: Kipo red appears on action, not as wallpaper.
- Typography that acts: Plus Jakarta Sans carries the weight; Inter executes; Geist Mono measures.
- Rhythmic spacing: 4px base scale, never arbitrary values.
- Soft corners (12–16px) that say "modern product" without saying "2021 app."
- Shadows that whisper: navy-tinted, low-profile, never the harsh black of Material 2014.
- Financial data always in tabular monospaced — zero ambiguity about any figure.

## 2. Colors: The Three-Color Palette

Three colors. No ambiguity. Every design decision traces back to one of them.

### Primary
- **Kipo Red** (`#e00b26`): The brand red. Used on primary buttons (gradient `#e00b26 → #bc0921`), active element borders, action text, and critical status icons. Never as a page background, never decorative.
- **Red Dark** (`#bc0921`): The dark end of the gradient. Also the `danger` color for CFDI error states — semantically coherent with the brand.

**The One Red Rule.** The Kipo Red → Red Dark gradient is Kipo's visual voice. Using it on more than one element per screen dilutes the signal. One primary CTA per view, not three.

### Secondary
- **Viral Green** (`#C6F542`): The conversion accent. "Cobrar ahora" buttons, success indicators in payment flows, landing CTAs. High saturation, high contrast against dark ink. Never on small text; green at 12px fails readability.
- **Strong Viral Green** (`#A9D92B`): The hover/active state of the green. Also as `accent-strong` for lime glow shadows under CTAs.

### Neutral
- **Papel** (`#f8f6f5`): Light-theme page background. Barely-off-white, almost neutral — lets the red and navy carry the personality.
- **Papel Sutil** (`#edeae8`): Secondary surfaces, resting inputs, subtle borders.
- **Tinta** (`#032641`): The deep navy. **Heading text in light mode**, dark-theme background, footer, dark section bands. The authoritative ink.
- **White** (`#FFFFFF`): Card surfaces in light theme. Never as a page background.

### Status
- **Éxito** (`#16A34A`): "Timbrada" (Stamped) state — saturated green, not minty teal.
- **Alerta** (`#CA8A04`): "Pendiente" (Pending) state — amber/gold. Never orange; orange reads as error, not caution.
- **Peligro** (`#bc0921`): "Rechazada" (Rejected) state — the brand dark red. Semantic coherence: brand and error share the same temperature.
- **Borrador** (`#7C3AED`): "Borrador" (Draft) state — purple/violet, completely distinct from the other three to avoid red-green colorblindness confusion.

## 3. Typography: Three Voices, One Workshop

**Display / Title Font:** Plus Jakarta Sans (700/600, `system-ui` fallback)
**Body / UI Font:** Inter (400/500/600, `system-ui` fallback)
**Data / Mono Font:** Geist Mono (500/600, `ui-monospace` → `"SF Mono"` fallback)

**Character:** Plus Jakarta Sans has the exact geometric-humanist authority for a modern Mexican product — not as cold as a Grotesk, not as decorative as Circular. Inter executes without distraction. Geist Mono imposes precision on every amount: the user should never wonder if they misread a zero.

### Hierarchy

- **Display** (700, 3.5rem, lh 1.05, ls -0.03em): Landing hero — one use per page, maximum. Always `text-wrap: balance`.
- **Headline** (700, 2.5rem, lh 1.18, ls -0.015em): H1 on internal screens. Strong declarations.
- **Title** (600, 1.5rem, lh 1.35, ls -0.01em): H2/H3, section headings, highlighted invoice names.
- **Body** (400, 1rem, lh 1.6): All body copy. Maximum 65ch wide. `text-wrap: pretty` on long paragraphs to prevent orphans.
- **Label** (600, 0.75rem, lh 1.2): Field labels, badges, eyebrows when justified. Never uppercase unless a specific approved design calls for it.
- **Mono** (600, 1rem, lh 1.5, ls -0.01em, `font-variant-numeric: tabular-nums`): RFCs, amounts, folios, stamp dates, totals. **Required for any financial or tax data.**

**The Three Voices Rule.** Display/Title is the one that speaks. Body is the one that explains. Mono is the one that signs. Mixing fonts outside these roles breaks hierarchy and confuses the user on data-heavy screens.

## 4. Elevation

The system uses navy-tinted shadows — never harsh black. The shadow tint is `rgba(3, 38, 65, α)`. Shadows are so subtle they could be overlooked, but without them the screen feels flat.

**The Whisper Rule.** Shadows are contextual information, not decoration. A resting card has `shadow-sm`. An interactive card lifts to `shadow-md` on hover. Nothing else carries a shadow at the same time as the focused element.

### Shadow Vocabulary
- **Ambient** (`0 1px 2px rgba(3,38,65,0.06)` — `shadow-xs`): Minimal separation. Resting inputs, badges.
- **Resting card** (`0 2px 8px rgba(3,38,65,0.08)` — `shadow-sm`): Default card surfaces.
- **Elevated card / hover** (`0 6px 20px rgba(3,38,65,0.10)` — `shadow-md`): Hover on interactive card.
- **Brand glow** (`0 10px 30px rgba(224,11,38,0.28)` — `shadow-brand`): Exclusive to the primary button and featured StampCard. One per screen.
- **Accent glow** (`0 8px 24px rgba(169,217,43,0.35)` — `shadow-accent`): Exclusive to the lime accent button. One per screen.

## 5. Components

### Buttons

Compact and decisive. No `uppercase` or wide `letter-spacing` — the text speaks for itself.

- **Shape:** Soft corners, 12px radius (`rounded.md`) on MD/LG, 8px (`rounded.sm`) on SM.
- **Primary:** Gradient `#e00b26 → #bc0921` (135°), white text, `shadow-brand`. Scales to `0.97` on `mousedown`. One visible primary per screen.
- **Accent:** Background `#C6F542`, text `#032641` (deep navy). `shadow-accent`. For conversion CTAs on the landing.
- **Secondary:** White background, `1.5px solid #d5d0cd` border, `shadow-xs`. The safe neutral for secondary actions.
- **Ghost:** Transparent, brand-color text. No border. For tertiary actions without visual noise.
- **Danger:** Background `#bc0921` (Red Dark), white text. For confirmed destructive actions.
- **Disabled:** Opacity 0.45. No hover or press feedback.

### Cards / Containers

- **Corner Style:** 16px radius (`rounded.lg`) standard; 24px (`rounded.xl`) for sheets and modals.
- **Background:** White on `#f8f6f5`. Never off-white on off-white (no surface contrast).
- **Shadow:** `shadow-sm` at rest. `shadow-md` + `translateY(-2px)` on interactive hover.
- **Border:** `1px solid #edeae8` — subtle, not structural.
- **Internal Padding:** `var(--space-5)` (20px) by default.
- **Featured variant:** Brand gradient as background, white text, `shadow-brand`. Only for StampCard and pricing hero cards.

### Inputs / Fields

- **Style:** White background, `1.5px solid #d5d0cd` border, 12px radius. No tinted background.
- **Focus:** `border-color` shifts to `var(--brand)` + `box-shadow: 0 0 0 4px var(--focus-ring)`. Never the default browser outline.
- **Error:** `border-color: #bc0921`. Error message in red below the field, 12px.
- **Mono mode:** For RFC, amounts, folios — activates Geist Mono + `tabular-nums`.

### Badge / Status Chips

- **Shape:** `border-radius: 999px` (pill). Compact: `4px 10px` padding.
- **Tones:** `neutral` (papel-sutil bg), `brand` (red-50 bg, rojo-oscuro text), `success`, `warning`, `danger`, `info`.
- **Solid variant:** Solid tone background, white text — for badges on dark surfaces.

### StampCard (Kipo Signature Component)

The core monetization component. CFDI stamp pack, checkout micro-card.

- **Default:** White, subtle border, `shadow-xs`. Counter in Geist Mono at 34px.
- **Featured:** Full brand gradient, `shadow-brand`. One per screen.
- **Selected:** `2px solid var(--brand)` border.
- **Press:** Scale `0.98` on mousedown.

## 6. Do's and Don'ts

### Do:
- **Do** use Geist Mono + `tabular-nums` for all financial data: amounts, RFCs, folios, stamp dates. No exceptions.
- **Do** use `#032641` (Tinta) for all heading text in light mode — it's the brand ink, not just a neutral.
- **Do** limit the Kipo Red → Red Dark gradient to one action element per screen.
- **Do** use `data-theme="dark"` on the `<html>` element to activate the Tinta navy palette for dark mode.
- **Do** verify contrast ≥ 4.5:1 for body text. `#032641` on `#f8f6f5` passes with significant margin.
- **Do** include `@media (prefers-reduced-motion: reduce)` for every entrance animation.
- **Do** cap body text lines at 65ch maximum.
- **Do** use `text-wrap: balance` on all H1–H3 headings.
- **Do** label every CFDI status with the correct Badge tone: `success` = Timbrada, `warning` = Pendiente, `danger` = Rechazada, `info` = Borrador.

### Don't:
- **Don't** imitate Mexican government portals (SAT, IMSS): institutional blue, formless hierarchy, intimidating tables.
- **Don't** replicate generic American SaaS: hero-metric big number, gradient text, happy-team stock photos, uppercase eyebrow above every section.
- **Don't** use `border-left` greater than 1px as a color accent on cards or alerts. No side-stripe borders.
- **Don't** use `background-clip: text` with a gradient for decorative text. Kipo red is solid as action, never as effect.
- **Don't** apply glassmorphism (`backdrop-filter: blur`) as decoration.
- **Don't** use Viral Green (`#C6F542`) on text smaller than 18px on a light background — contrast fails 3:1.
- **Don't** show two elements with `shadow-brand` or `shadow-accent` simultaneously.
- **Don't** use section numbers (01 / 02 / 03) as default visual scaffolding unless the content IS an ordered sequence.
- **Don't** create identical card grids (icon + heading + text × N).
- **Don't** use generic neutral grays — every neutral in Kipo's palette has a specific tonal identity.

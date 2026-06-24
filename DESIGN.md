---
name: Kipo Design System
description: CFDI 4.0 e-invoicing and POS for Mexican freelancers and micro-businesses — the tool that liberates.
colors:
  tomate-kipo: "#CE0D2F"
  sangria: "#9F0824"
  verde-viral: "#C6F542"
  verde-viral-fuerte: "#A9D92B"
  crema-base: "#FAF8FB"
  crema-100: "#F1EAE0"
  crema-200: "#E4D9C9"
  crema-400: "#A99E8C"
  crema-600: "#574F44"
  crema-900: "#1A150F"
  tinta-900: "#182230"
  tinta-700: "#2B3A4B"
  tinta-500: "#4C6075"
  blanco: "#FFFFFF"
  exito: "#16A34A"
  exito-bg: "#DCFCE7"
  alerta: "#CA8A04"
  alerta-bg: "#FEF9C3"
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
    backgroundColor: "{colors.tomate-kipo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-accent:
    backgroundColor: "{colors.verde-viral}"
    textColor: "{colors.tinta-900}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.crema-900}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tomate-kipo}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  card-featured:
    backgroundColor: "{colors.tomate-kipo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  badge-neutral:
    backgroundColor: "{colors.crema-200}"
    textColor: "{colors.crema-600}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-brand:
    backgroundColor: "{colors.sangria}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  input:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.crema-900}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
---

# Design System: Kipo

## 1. Overview

**Creative North Star: "The Tool That Liberates"**

Kipo is not accounting software — it's SAT bureaucracy transformed into a fast, human tool. The design system carries that promise in every visual decision: the screen that used to intimidate now acts, and acts fast. The identity is not borrowed from the American fintech sector or government portals; it speaks with its own red-and-cream accent.

The personality is **Modern · Agile · Human**. Modern through resolved information density, typographic weight, and clear hierarchy. Agile because the interface never puts unnecessary screens between the user and their task. Human through the visual temperature (warm cream, vivid red, generous typography) and a voice that doesn't condescend.

The system explicitly rejects two ghosts: the **government portal** (institutional blue, flat hierarchy, intimidating forms) and the **generic American SaaS** (hero-metric big number, navy/gold gradient, stock photos, uppercase eyebrows above every section). If a screen could belong to the SAT or to any San Francisco SaaS, it's poorly designed.

**Key Characteristics:**
- Color as signature, not decoration: Kipo red appears on action, not as wallpaper.
- Typography that acts: Plus Jakarta Sans carries the weight; Inter executes; Geist Mono measures.
- Rhythmic spacing: 4px base scale, never arbitrary values.
- Soft corners (12–16px) that say "modern product" without saying "2021 app."
- Shadows that whisper: warm-tinted, low-profile, never the harsh black of Material 2014.
- Financial data always in tabular monospaced — zero ambiguity about any figure.

## 2. Colors: The Workshop Palette

Two reds with character, a green that converts, and warm surfaces that are not generic cream.

### Primary
- **Kipo Red** (`#CE0D2F`): The brand red. Used on primary buttons (as gradient `#CE0D2F → #9F0824`), active element borders, action text, and critical status icons. Never as a page background, never decorative.
- **Sangria** (`#9F0824`): The dark end of the gradient. Also the `danger` color for CFDI error states — semantically coherent with the brand.

**The One Red Rule.** The Kipo Red → Sangria gradient is Kipo's visual voice. Using it on more than one element per screen dilutes the signal. One primary CTA per view, not three.

### Secondary
- **Viral Green** (`#C6F542`): The conversion accent. "Cobrar ahora" buttons, success indicators in payment flows, landing CTAs. High saturation, high contrast against dark ink. Never on small text; green at 12px fails readability.
- **Strong Viral Green** (`#A9D92B`): The hover/active state of the green. Also as `accent-strong` for lime glow shadows under CTAs.

### Neutral
- **Cream Base** (`#FAF8FB`): Light-theme page background. Not pure white, not generic AI paper — it has a barely perceptible warm temperature that complements the red without imposing it.
- **Cream 100** (`#F1EAE0`): Secondary surfaces, resting inputs, separators. The warmth of the palette comes from here, not from the brand.
- **Cream 200** (`#E4D9C9`): Subtle borders, neutral badge backgrounds, surface hover states.
- **Cream 900** (`#1A150F`): Strong text on light. Near-black with warm temperature.
- **Ink Night** (`#182230`): Dark-theme base (premium landing, future dark mode). Slate-blue, not pure black — more cinema than terminal.
- **White** (`#FFFFFF`): Card surfaces in light theme. Never as a page background.

### Status
- **Success** (`#16A34A`): "Timbrada" (Stamped) state — saturated green, not minty teal.
- **Warning** (`#CA8A04`): "Pendiente" (Pending) state — amber/gold. Never orange; orange reads as error, not caution.
- **Sangria** (`#9F0824`): "Rechazada" (Rejected) state — the same brand sangria. Semantic coherence: brand and error share the same temperature.
- **Draft** (`#7C3AED`): "Borrador" (Draft) state — purple/violet, completely distinct from the other three to avoid red-green colorblindness confusion.

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

The system uses warm-tinted shadows — never harsh black. The shadow tint is warm-cream: `rgba(26, 21, 15, α)`. Shadows are so subtle they could be overlooked, but without them the screen feels flat.

**The Whisper Rule.** Shadows are contextual information, not decoration. A resting card has `shadow-sm` (2px/8px). An interactive card lifts to `shadow-md` (6px/20px) on hover. Nothing else carries a shadow at the same time as the focused element. Two elements competing in elevation is a design failure.

### Shadow Vocabulary
- **Ambient** (`0 1px 2px rgba(26,21,15,0.06)` — `shadow-xs`): Minimal separation. Resting inputs, badges.
- **Resting card** (`0 2px 8px rgba(26,21,15,0.07)` — `shadow-sm`): Default card surfaces.
- **Elevated card / hover** (`0 6px 20px rgba(26,21,15,0.09)` — `shadow-md`): Hover on interactive card.
- **Brand glow** (`0 10px 30px rgba(206,13,47,0.28)` — `shadow-brand`): Exclusive to the primary button and featured StampCard. Reinforces the action signal with red temperature. One per screen.
- **Accent glow** (`0 8px 24px rgba(169,217,43,0.35)` — `shadow-accent`): Exclusive to the lime accent button. One per screen.

## 5. Components

### Buttons

Compact and decisive. No `uppercase` or wide `letter-spacing` — the text speaks for itself.

- **Shape:** Soft corners, 12px radius (`rounded.md`) on MD/LG, 8px (`rounded.sm`) on SM.
- **Primary:** Gradient `#CE0D2F → #9F0824` (135°), white text, `shadow-brand`. Scales to `0.97` on `mousedown` — real tactile feedback. One visible primary per screen.
- **Accent:** Background `#C6F542`, text `#182230` (dark ink). `shadow-accent`. For conversion CTAs on the landing.
- **Secondary:** White background, `1.5px solid #D3CBDB` border, `shadow-xs`. The safe neutral for secondary actions.
- **Ghost:** Transparent, brand-color text. No border. For tertiary actions without visual noise.
- **Danger:** Background `#9F0824` (Sangria), white text. For confirmed destructive actions.
- **Disabled:** Opacity 0.45. No hover or press feedback.

### Cards / Containers

- **Corner Style:** 16px radius (`rounded.lg`) standard; 24px (`rounded.xl`) for sheets and modals.
- **Background:** White on cream. Never cream on cream (no surface contrast).
- **Shadow:** `shadow-sm` at rest. `shadow-md` + `translateY(-2px)` on interactive hover.
- **Border:** `1px solid #E4D9C9` — subtle, not structural.
- **Internal Padding:** `var(--space-5)` (20px) by default. Never less than `var(--space-4)` (16px).
- **Featured variant:** Brand gradient as background, white text, `shadow-brand`. Only for StampCard and pricing hero cards.

### Inputs / Fields

- **Style:** White background, `1.5px solid #D3CBDB` border, 12px radius. No tinted background.
- **Focus:** `border-color` shifts to `var(--brand)` + `box-shadow: 0 0 0 4px var(--focus-ring)` (red at 40% transparency). Never the default browser outline.
- **Error:** `border-color: #9F0824` (Sangria). Error message in red below the field, 12px.
- **Mono mode:** For RFC, amounts, folios — activates Geist Mono + `tabular-nums` on the input. Use `mono={true}` prop.
- **Prefix/Suffix:** Typographic adornments in muted/mono: `$`, `MXN`, RFC prefix.

### Badge / Status Chips

- **Shape:** `border-radius: 999px` (pill). Compact: `4px 10px` padding.
- **Tones:** `neutral` (cream-200 bg), `brand` (red-50 bg, sangria text), `success`, `warning`, `danger`, `info`.
- **Solid variant:** Solid tone background, white text — for badges on dark surfaces.
- **Dot indicator:** 7px circle before the label. Semantic: indicates live status (stamped/pending).

### Switch

- **On:** Brand gradient (`#CE0D2F → #9F0824`) as track. White thumb with `shadow-sm`.
- **Off:** `#C8BCA8` (cream-300). Not black, not cold gray.
- **Transition:** `200ms ease-out` for background and thumb. Feels instant to the user.

### StampCard (Kipo Signature Component)

The core monetization component. CFDI stamp pack, checkout micro-card.

- **Default:** White, subtle border, `shadow-xs`. Counter in Geist Mono at 34px.
- **Featured:** Full brand gradient, "Más popular" ribbon in Viral Green on dark ink, `shadow-brand`.
- **Selected:** `2px solid var(--brand)` border.
- **Press:** Scale `0.98` on mousedown — it's a button, not a passive card.

## 6. Do's and Don'ts

### Do:
- **Do** use Geist Mono + `tabular-nums` for all financial data: amounts, RFCs, folios, stamp dates. No exceptions.
- **Do** limit the Kipo Red → Sangria gradient to one action element per screen. Its power comes from its scarcity.
- **Do** use `data-theme="dark"` on premium landing sections to automatically activate the Ink Night palette.
- **Do** verify contrast ≥ 4.5:1 for body text. Cream-900 (`#1A150F`) on Cream-100 (`#F1EAE0`) always passes.
- **Do** include `@media (prefers-reduced-motion: reduce)` for every entrance animation. Field users don't want effects.
- **Do** cap body text lines at 65ch maximum. Invoices have lots of text; line width matters.
- **Do** use `text-wrap: balance` on all H1–H3 headings.
- **Do** label every CFDI status with the correct Badge tone: `success` = Timbrada, `warning` = Pendiente, `danger` = Rechazada, `info` = Borrador.

### Don't:
- **Don't** imitate Mexican government portals (SAT, IMSS): institutional blue, formless hierarchy, intimidating tables. If a screen looks like the SAT portal, it's wrong.
- **Don't** replicate generic American SaaS: hero-metric big number, navy/gold gradient, happy-team stock photos, uppercase eyebrow above every section. Kipo has its own identity.
- **Don't** use `border-left` greater than 1px as a color accent on cards or alerts. No side-stripe borders.
- **Don't** use `background-clip: text` with a gradient for decorative text. Kipo red is solid as action, never as effect.
- **Don't** apply glassmorphism (`backdrop-filter: blur`) as decoration. It only appears for a specific functional reason.
- **Don't** use Viral Green (`#C6F542`) on text smaller than 18px on a light background — contrast fails 3:1.
- **Don't** show two elements with `shadow-brand` or `shadow-accent` simultaneously. Competing elevation loses both.
- **Don't** use section numbers (01 / 02 / 03) as default visual scaffolding unless the content IS an ordered sequence where order carries meaning.
- **Don't** create identical card grids (icon + heading + text × N). If the content is the same shape, the component is wrong.
- **Don't** use generic neutral grays (e.g. `#888888`) — every neutral in Kipo's palette has warm or slate-blue temperature.

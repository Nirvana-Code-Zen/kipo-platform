---
name: Kipo design system
description: **Kipo** — *Factura. Sin drama.* — is a next-generation Mexican e-invoicing (CFDI 4.0) SaaS built for **freelancers and micro-businesses (2–3 employees)**. Subscribers also get access to quotes and inventory managment. It turns the bureaucratic dread of Mexican fiscal compliance into a fast, friendly, mobile-first experience: scan your Constancia de Situación Fiscal, charge a client, and timbrar a SAT-valid invoice in seconds — paying only for the stamps you use. The personality is **fast-casual, friendly-professional, trustworthy, ultra-clean** — a fintech that balances absolute financial precision with zero bureaucratic stiffness.
---

## Sources
This system was authored from a written brand brief plus uploaded brand assets — **no external codebase or Figma file was provided.** Source assets the brief shipped:
- Logo: `Kipo-logo.png` (had a baked-in checkerboard, not used), `kipo-logo.svg` (white-box background — cleaned into `assets/kipo-mark.svg`, transparent).
- Fonts: Plus Jakarta Sans, Inter, Geist Mono (used); Lato + Urbanist (uploaded but **not** part of the type system).

---

## CONTENT FUNDAMENTALS

**Language:** Mexican Spanish, always. Informal "tú", never "usted". The brand talks *to* the user like a sharp friend who happens to know taxes.

**Tone:** Warm, plain, confident, anti-bureaucratic. Kipo removes drama — copy never adds it. Short sentences. Active voice. Lead with the outcome ("Listo, ya quedó tu factura"), not the mechanism.

**Casing:** Sentence case everywhere — headings, buttons, labels. Never ALL-CAPS except tiny eyebrow/label text (`letter-spacing: 0.04em`, uppercase, 12px). No Title Case On Every Word.

**Voice — do / don't:**
- ✅ "Escanea tu constancia y nosotros llenamos lo demás."
- ✅ "Te quedan 8 timbres. Recarga desde $3.50 c/u."
- ✅ "Cobrar ahora" · "Timbrar y cobrar $2,400.00" · "Empieza gratis"
- ❌ "Proceso de timbrado CFDI completado exitosamente." (cold, robotic)
- ❌ "Estimado usuario, proceda a capturar su RFC." (stiff, usted)

**Fiscal vocabulary is kept, plain language wraps it.** Real terms users know — *timbrar, CFDI, RFC, constancia, conciliación, folio, IVA, uso CFDI* — are used directly (users trust precision), but always surrounded by friendly framing. Never invent euphemisms for fiscal terms.

**Numbers & money:** always `$1,200.00` format (Mexican locale, 2 decimals, comma thousands), set in Geist Mono. Currency code `MXN` shown where ambiguity matters. RFC, folios, and tax IDs are always mono + tabular.

**Emoji:** not used in the product UI or marketing copy. The brand reads as a serious-but-warm fintech; arrows (→ ▲) and Lucide icons carry the playfulness instead.

---

## VISUAL FOUNDATIONS

**Colors.** The identity is a **deep magenta → plum gradient** (`--kipo-gradient`, `#9A1B5E → #B81D53`, 135°) — used on the logo, hero balance cards, primary buttons, avatars, and premium invoice headers. A single **neon-lime accent** (`#C6F542`) is reserved for the highest-conversion CTA on any view ("Cobrar", "Empieza gratis") — it must stay rare to keep its punch. Backgrounds split two ways: **premium plum-tinted darks** (`--kipo-ink-900…500`) for marketing and "wow" surfaces, and **clean near-white grays** (`--kipo-gray-50/0`) for the dense app interface. Status uses calm, legible green/amber/red/blue with soft tinted backgrounds.

**Type.** Three families, strict roles: **Plus Jakarta Sans** (700/800, tight −0.02 to −0.03em) for all headings and hero titles — geometric, energetic. **Inter** (400/500/600) for body and UI — pixel-perfect on 6" screens. **Geist Mono** (tabular-nums) for *every* financial value: amounts, RFC, folios, tax tables, prices. If it's a number that matters fiscally, it's mono.

**Spacing.** 4px base scale. Generous breathing room; the app is calm, not cramped. Container max 1200px (web), 390–420px app frame.

**Backgrounds.** No photography, no stock imagery, no hand illustration. Surfaces are **flat color or the brand gradient**. The landing hero is solid plum-ink with a glowing gradient phone-mock; the light product zone sits on `--kipo-gray-50` with a 40px rounded top lip. Subtle gradient *glows* (`box-shadow` with brand/accent color) sit under hero cards and CTAs — never busy gradient backgrounds.

**Corners.** Signature soft radii: **12px** default controls/cards, **16px** large cards, **24px** hero/sheets, full **pill** for badges and the neon CTA. Nothing sharp-cornered.

**Cards.** Flat. White (or ink) surface, 1px subtle border, **soft low plum-tinted shadow** (`--shadow-sm`, `rgba(60,14,45,…)` — never harsh black). Interactive cards lift 2px and raise to `--shadow-md` on hover. No colored-left-border cards, no glassmorphism in the app.

**Shadows.** Two systems: **elevation** (xs→lg, soft, plum-tinted, low-spread) and **glow** (`--shadow-brand` magenta, `--shadow-accent` lime) under primary CTAs and hero cards to signal "tap me".

**Borders.** 1px `--border-subtle` for dividers/cards; 1.5px `--border-strong` for inputs; brand-colored 1.5px on focus with a 4px soft `--focus-ring` halo.

**Transparency & blur.** Used sparingly: sticky nav uses `backdrop-filter: blur(14px)` over translucent ink; on-gradient chips use `rgba(255,255,255,0.12–0.18)`. The app body avoids glass.

**Animation.** Quick and friendly, never bouncy-cartoon. `--ease-out` `cubic-bezier(0.22,1,0.36,1)`, 120–320ms. Hover = lift/scale-up subtle; **press = `scale(0.97–0.98)`** (tactile shrink). Switches and bars ease their state. Honor `prefers-reduced-motion`.

**Hover / press states.** Buttons: press shrinks. Cards: hover lifts. Links/ghost: color shifts to `--brand` / brightens. Disabled: 45% opacity, no-drop cursor.

**Imagery vibe.** N/A — Kipo is illustration-free and photo-free by design; the gradient mark *is* the visual signature. Keep it that way unless the brief changes.

---

## ICONOGRAPHY

- **Icon set: [Lucide](https://lucide.dev)** (loaded from CDN, `lucide@0.475.0`). ⚠️ **Substitution flag:** the brief shipped no icon assets, so Lucide was chosen as the closest match to the brand — clean, rounded, ~2px stroke, friendly-but-precise, exactly the fintech-but-warm feel. If Kipo has an official icon set, swap it in and update the kits.
- **Usage:** outline icons at 18–26px, `currentColor`, ~2px stroke. Rendered in React via `<i data-lucide="name">` + `window.lucide.createIcons()` (see `ui_kits/*/Chrome.jsx` / `Sections.jsx`). Common glyphs: `qr-code`, `scan-line`, `stamp`, `zap`, `file-text`, `building-2`, `credit-card`, `wand-sparkles`, `arrow-right`.
- **Logo / brand mark:** `assets/kipo-mark.svg` — a magenta-gradient triskelion knot, transparent background, works on dark and light. Pair with the "Kipo" wordmark in Plus Jakarta Sans 800. On dark surfaces it can be tinted white via `filter: brightness(0) invert(1)` where a mono mark is needed.
- **Emoji:** not used. **Unicode glyphs:** only arrows/triangles (→ ▲ ·) as lightweight inline accents.

---

## INDEX / MANIFEST

**Root**
- `styles.css` — global entry (imports only). Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent Skill manifest.

**Tokens** (`tokens/`)
- `fonts.css` — `@font-face` for Plus Jakarta Sans, Inter, Geist Mono.
- `colors.css` — brand/accent/neutral/status scales + light & `[data-theme="dark"]` semantic aliases.
- `typography.css` — families, weights, scale, line-heights, `.kipo-num` mono helper.
- `spacing.css` — spacing, radius, shadow, motion, layout tokens.

**Assets** (`assets/`)
- `kipo-mark.svg` (cleaned, transparent), `kipo-logo.svg` / `kipo-logo.png` (originals), `fonts/`.

**Components** (`components/`) — namespace `window.KipoDesignSystem_71566c`
- `core/` — `Button`, `Card`, `Avatar`
- `forms/` — `Input` (mono mode for fiscal values), `Switch`
- `feedback/` — `Badge` (invoice/payment status tones)
- `billing/` — `StampCard` (pay-as-you-go stamp packs — Kipo's monetization unit)

**UI kits** (`ui_kits/`)
- `mobile-app/` — the Kipo web app, mobile-first responsive (Home, Cobrar, Premium invoice, Timbres, Facturas).
- `landing/` — marketing site.

**Foundation cards** (`guidelines/`) — the specimen cards rendered in the Design System tab (Colors, Type, Spacing, Brand).


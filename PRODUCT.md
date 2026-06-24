# Product

## Register

product

## Users

**End users:** Mexican freelancers and micro-businesses (1–3 employees) — independent accountants, designers, technicians, and merchants who issue CFDI 4.0 invoices. Non-technical users. They work on desktop and mobile, often under time pressure when invoicing a client on-site or closing out the day.

**Design system consumers:** Kipo team developers building `kipo-landing` (marketing Astro) and `kipo-dashboard` (React app). They expect CSS tokens, typed React components, and clear conventions.

## Product Purpose

Kipo is a CFDI 4.0 e-invoicing and POS SaaS platform for the Mexican market. The design system (`@kipo/theme` + `@kipo/ui-react`) is the shared visual foundation between the marketing landing page and the web app — same tokens, same components, one identity.

Success looks like this: a freelancer can issue a CFDI invoice in under 90 seconds without reading a manual, and the landing converts visitors into users because the product looks trustworthy from the first scroll.

## Brand Personality

Modern · Agile · Human

The confidence of a serious tool, the warmth of a Mexican brand. Not aspirational corporate, not bureaucratic government. The voice is direct and unadorned — like a knowledgeable colleague who explains things without condescending.

## References

- **Mercury / Linear** — product-first, no noise. Interfaces where the visual identity is so strong it needs no decoration. Typography as protagonist. Every pixel justified.
- What specifically applies to Kipo: well-resolved information density, color used as signal (not decoration), and the feel of a serious tool that doesn't take itself too seriously.

## Anti-references

- **SAT / IMSS / Mexican government portals** — heavy, outdated, institutional blue, no typographic hierarchy, intimidating forms. Kipo exists precisely as an alternative to that experience.
- **Generic American SaaS** — hero-metric with big number, navy/gold gradient, stock photos of "happy team", uppercase eyebrows above every section. The template LLMs generate by default. Kipo has its own color identity (red → lime) and doesn't surrender it.

## Design Principles

1. **Visible precision** — financial data (RFC, amounts, folios, stamp dates) deserves special visual treatment: monospaced font, tabular numerals, zero ambiguity. The interface cannot leave any doubt about which number you're reading.

2. **Warm authority** — competent without being cold. The red-magenta palette plus warm cream gives character; components must reinforce that temperature, not wash it out with neutral grays.

3. **Task velocity** — the primary user is invoicing, not exploring. The shortest path to the goal is the good design. Zero welcome screens, zero unnecessary confirmations.

4. **One identity, two surfaces** — landing and app share tokens and components. A user who arrives from the landing to the dashboard should not feel they switched products.

5. **Mexican by default** — es-MX, pesos, SAT tax logic, Spanish plurals. Never English loan words where a natural Mexican Spanish equivalent exists.

## Accessibility & Inclusion

- **WCAG AA minimum** — the target user may not be a digital native; contrast clarity and typographic hierarchy are part of the product, not extras.
- **Mexican Spanish text** — labels, errors, hints: never "Invoice", always "Factura".
- **Reduced motion**: every entrance animation requires a `prefers-reduced-motion` alternative.
- **Real mobile** — field users invoice from their phones. Tap targets ≥ 44px, large inputs.

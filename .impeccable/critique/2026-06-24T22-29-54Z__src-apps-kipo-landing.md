---
target: kipo-landing
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-06-24T22-29-54Z
slug: src-apps-kipo-landing
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No active nav state on current page |
| 2 | Match System / Real World | 3 | "Constancia de Situación Fiscal" assumes familiarity |
| 3 | User Control and Freedom | 3 | Clear exits; no traps |
| 4 | Consistency and Standards | 3 | Hero secondary CTA raw <a>, not Button component |
| 5 | Error Prevention | 3 | "Empieza gratis" doesn't disclose the 1-timbre limit |
| 6 | Recognition Rather Than Recall | 3 | Labels visible; TrustStrip icons unlabeled |
| 7 | Flexibility and Efficiency of Use | 2 | Landing page by nature; smooth-scroll anchor only accelerator |
| 8 | Aesthetic and Minimalist Design | 3 | 3× alternating FeatureBlock fatigue; thin LandingCTA |
| 9 | Error Recovery | 2 | Dead footer links (docs, blog, ayuda, privacidad) |
| 10 | Help and Documentation | 2 | FAQ only on /precios; footer links dead |
| **Total** | | **26/40** | **Acceptable** |

### Anti-Patterns Verdict
Deterministic scan: 0 findings. Brand palette and copy voice are non-generic. Page scaffold (Hero→TrustStrip→How It Works→Features×3→Pricing→CTA) is fully predictable SaaS template.

### Priority Issues
P1: No social proof — zero testimonials/user count for high-stakes financial product
P1: "Empieza gratis" undisclosed — free tier (1 timbre) buried; headline creates false expectation
P2: Page scaffold is fully predictable template structure
P2: Dead footer links (/docs /blog /ayuda /terminos /privacidad /contacto) — trust killer
P2: PricingTeaser shows 3/6 packs, no indication 3 more exist; hides the "Más popular" anchor

### Persona Red Flags
Jordan: "Constancia de Situación Fiscal" undefined; no timbre quantity guidance; micro-copy below CTAs missed
Casey: Mobile hero loses illustration (hidden md:flex); secondary CTA equal visual weight to primary on mobile
Riley: 4+ dead footer links; cancellation not listed in comparison table rows

### Minor Observations
LandingCTA section too thin; badge + lime CTA competing in hero; TrustStrip icons unlabeled; uniform section padding lacks rhythm

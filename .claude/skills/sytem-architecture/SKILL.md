---
name: kipo-architecture
description: Development Standard: Skill Structure in a Split Monorepo
---

This skill defines the architectural rules for implementing **Domain-Driven Design (DDD)**
and **Screaming Architecture** within our project.
Since our repository roots frontend and backend into separate main directories,
we enforce a **Symmetric Mapping per Skill** strategy. This ensures the codebase loudly
reflects **Kipo's** business domain, eliminating generic and uninspired technical folders.

## 📂 Project Architecture

The project is organized into two primary root directories. Folders containing core business features must share identical names across both frontend and backend to preserve the cohesion of the Skill (example using the `billing` module):

```text
Project Root/
│
├── backend/                           # BACKEND CODEBASE (FastAPI)
│   └── billing/                       # Billing module on the Backend
│       ├── __init__.py
│       ├── domain/                    # Pure business rules (Models, Repositories ABC)
│       │   ├── models.py
│       │   └── repositories.py
│       ├── application/               # Use cases / Orchestration (Emit, Cancel)
│       │   └── emit_invoice_use_case.py
│       └── infrastructure/            # Technical implementations and adapters
│           ├── pac_client.py          # External connection with the PAC API
│           └── api/                   # FastAPI HTTP Delivery Mechanism
│               ├── endpoints.py
│               └── schemas.py
│
└── src/                               # FRONTEND CODEBASE (React App)
    └── billing/                       # Billing Skill on the Frontend (Symmetric Mirror)
        ├── components/                # Atomic visual components exclusive to this Skill
        │   ├── InvoicePreview.tsx
        │   └── StampCounter.tsx
        ├── hooks/                     # Local state & module-specific endpoint consumption
        │   └── useInvoiceEmission.ts
        └── pages/                     # Full-page layouts (Mobile-First)
            └── BillingDashboard.tsx

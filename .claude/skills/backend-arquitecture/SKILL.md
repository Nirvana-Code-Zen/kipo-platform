---
name: Backend Architecture
description: estructura de carpetas grite **qué hace nuestro negocio** (conceptos y acciones) en lugar de **qué herramientas técnicas usamos** (evitando sufijos como `_service`, `_model`, `_repository` o `utils.py`).
---

## 🗺️ Architectural Directory Blueprint

```text
kipo-platform/
│
├── run.py                       # Simple web server runner
├── app_factory.py               # Central Flask setup and extension configuration
│
├── api/                         # 🚚 DELIVERY MECHANISM LAYER (HTTP Transport)
│   ├── __init__.py              # Central registration for API versions
│   └── v1/
│       ├── endpoints/           # Pure HTTP routes (Network interactions)
│       └── validation/          # Network blueprints for input (payload) and output (serialization)
│
├── [domain]/                    # 💼 DOMAIN LAYER (e.g., auth, billing, shipping)
│   ├── __init__.py              # Clean public interface for the domain module
│   ├── [concept].py             # Core entity object DDD concepts 
│   ├── [almacen].py             # Persistence engines (Pure queries, e.g., store.py, vault.py)
│   └── operations/              # Actions / Business use cases (e.g., creation.py, processing.py)
│
└── shared/                      # 🛠️ TRANSVERSAL CONCEPTS LAYER (Reusable elements)
    ├── database.py              # The core ORM engine initialization
        ├── cipher.py                # Concept: Data encryption and credential hashing
            ├── token.py                 # Concept: Creation and validation of JWT keys
                └── exceptions.py            # Concept: Base business errors and violations
                ```

## 💎 Core Design Principles

### 1. Technical Suffixes are Prohibited
We do not name files or classes based on their technical framework role. We name them exactly after **what they are** or **what they do**.
*   ❌ `billing_service.py` ➡️ Canonic path: 📁 `billing/operations/` ➡️ `creation.py`
*   ❌ `user_model.py` ➡️ Canonic path: 📄 `auth/identity.py`
*   ❌ `invoice_repository.py` ➡️ Canonic path: 📄 `billing/store.py`
*   ❌ `utils.py` (Code dumping ground) ➡️ Canonic path: 📄 `shared/cipher.py` or `shared/clock.py`

### 2. Unidirectional Dependency Flow
Information flows strictly from the outside in. The core business engine must never know what web framework is running on top of it.

[ HTTP Client ] ➡️ [ api/ (Flask Layer) ] ➡️ [ [domain]/operations/ ] ➡️ [ shared/database ]*   **The `api/` layer** is allowed to import concepts and operations from the `[domain]`.
*   **The `[domain]` layer** **NEVER** imports anything from the `api/` folder. Flask `request` payloads, `jsonify` methods, and HTTP status codes are strictly forbidden inside a business domain folder.

### 3. Semantic and Conversational Namespacing
Code imports must read like a natural sentence. We eliminate redundant repetitions such as `billing_repository.save_billing_data()`.

```python
# Clean semantic importing pattern
from billing import store
from billing.operations import creation

# Executes like an expressive English sentence:
store.save(invoice)
creation.execute(user_id, amount)
```

---

## 🛠️ Implementation Template (End-to-End Flow)

When building a new feature, follow this strict three-step development lifecycle:

### Step 1: Define the Concept and its Persistence (Domain)
Design your core business object inside its own conceptual file, and set up its storage layer without any network overhead.

`billing/invoice.py` (Pure Business Concept / Model):
```python
from shared.database import db

class Invoice(db.Model):
    __tablename__ = "invoices"

            id = db.Column(db.Integer, primary_key=True)
                amount = db.Column(db.Numeric(10, 2), nullable=False)
                    status = db.Column(db.String(20), default="unpaid")
                    ```

                    `billing/store.py` (Persistence Layer / Warehouse):
                    ```python
                    from billing.invoice import Invoice
                    from shared.database import db

                    def save(invoice: Invoice) -> Invoice:
                        db.session.add(invoice)
                            db.session.commit()
                                return invoice
                                ```

### Step 2: Write the Operation / Business Case (Logic)
Represent business rules through singular action files inside the `operations/` package directory. Every file should do **one thing only**.

`billing/operations/creation.py` (Business Action):
```python
from billing.invoice import Invoice
from billing import store
from shared import exceptions

def execute(user_id: int, amount: float) -> Invoice:
    if amount <= 0:
                raise exceptions.BusinessRuleViolation("The invoice amount must be positive.")

                            new_invoice = Invoice(user_id=user_id, amount=amount)
                                return store.save(new_invoice)
                                ```

### Step 3: Expose via the Delivery Mechanism (API)
The Flask endpoint serves strictly as a translator: it receives raw JSON payloads, delegates execution to the domain operation, intercepts business violations, and formats them into clean HTTP outputs.

api/v1/endpoints/cashier.py` (Network Transport Layer):
```python
from flask import Blueprint, request, jsonify
from billing.operations import creation
from shared import exceptions

cashier_bp = Blueprint("cashier", __name__, url_prefix="/api/v1/cashier")

@cashier_bp.route("/charge", methods=["POST"])
def charge_customer():
    data = request.get_json() or {}

            try:
                # Straightforward execution of the use case
                invoice = creation.execute(
                user_id=data.get("user_id"),
                    amount=data.get("amount")
                )
                return jsonify({"id": invoice.id, "status": invoice.status}), 201

            except exceptions.BusinessRuleViolation as err:
                return jsonify({"error": str(err)}), 400
```

## 🧩 Structural Rules for the `shared/` Directory
The `shared/` directory **is not a generic helper folder**. It only hosts modules that represent abstract, foundational concepts of infrastructure, time, or security:
*   Every file must adhere to the **Single Responsibility Principle**.
*   It must remain fully domain-agnostic (files inside `shared/` can never import elements from folders like `billing/` or `auth/`).

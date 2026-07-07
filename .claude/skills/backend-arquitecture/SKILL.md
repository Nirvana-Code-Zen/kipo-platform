---
name: Backend Architecture
description: estructura de carpetas que grita **qué hace nuestro negocio** (conceptos y acciones) en lugar de **qué herramientas técnicas usamos** (evitando sufijos como `_service`, `_model`, `_repository` o `utils.py`). Incluye repository pattern, commands, execute dispatcher y value objects.
---

## 🗺️ Architectural Directory Blueprint

```text
kipo-platform/
│
├── run.py                         # Web server entry point
├── app.py                         # create_app() — Flask setup, blueprint registration
│
├── api/                           # 🚚 DELIVERY MECHANISM LAYER (HTTP Transport)
│   ├── __init__.py                # register_blueprints(app)
│   └── v1/
│       ├── endpoints/             # Pure HTTP routes — translate JSON ↔ commands
│       └── validation/            # Input/output schemas (per domain)
│
├── [domain]/                      # 💼 DOMAIN LAYER (e.g., auth, billing)
│   ├── __init__.py
│   ├── [concept].py               # Core entity / dataclass (e.g., identity.py, invoice.py)
│   ├── repository.py              # IXxxRepository — abstract interface (ABC), no Supabase/SQL
│   ├── commands.py                # Immutable command dataclasses (one per use case)
│   ├── execute.py                 # execute(command) — dispatcher, resolves repo from g
│   ├── value_objects/             # Validated, immutable types (Email, PhoneNumber, etc.)
│   │   └── [value_object].py
│   ├── operations/                # Pure functions: execute(repo, args) → result
│   │   └── [action].py            # One file per use case (sign_in.py, creation.py, …)
│   └── infrastructure/            # Concrete repo implementations (Supabase, SQL, etc.)
│       └── [provider]_repository.py
│
└── shared/                        # 🛠️ TRANSVERSAL LAYER — domain-agnostic infrastructure
    ├── database.py                # SQLAlchemy db instance
    ├── supabase.py                # Supabase singleton client
    ├── providers.py               # get_xxx_repo() — creates repos in Flask g (once per request)
    ├── exceptions.py              # BusinessRuleViolation, NotFound
    └── config.py                  # Config classes (Development, Production, Testing)
```

---

## 💎 Core Design Principles

### 1. Technical Suffixes are Prohibited
Name files after **what they are** or **what they do**, not their framework role.

| ❌ Avoid | ✅ Correct |
|----------|-----------|
| `billing_service.py` | `billing/operations/creation.py` |
| `user_model.py` | `auth/identity.py` |
| `invoice_repository.py` | `billing/repository.py` (interface) + `billing/infrastructure/supabase_repository.py` |
| `utils.py` | `shared/cipher.py`, `shared/clock.py` |

### 2. Unidirectional Dependency Flow

```
[ HTTP Client ]
      ↓
[ api/endpoints/ ]          ← only layer that touches Flask request/response
      ↓
[ [domain]/execute.py ]     ← resolves repo, dispatches to operation
      ↓
[ [domain]/operations/ ]    ← pure functions (repo, value objects) → result
      ↓
[ [domain]/repository.py ]  ← abstract interface only
      ↓
[ [domain]/infrastructure/ ] ← Supabase / SQLAlchemy / etc.
```

- `operations/` **never** imports Flask, Supabase SDK, or `shared/providers.py`
- `repository.py` **never** imports infrastructure or Flask
- `execute.py` is the only domain file that may import from `shared/providers`
- `shared/` **never** imports from any domain folder

### 3. Semantic and Conversational Namespacing

```python
from auth.execute import execute as auth_execute
from auth.commands import SignInWithEmailCommand

auth_execute(SignInWithEmailCommand(email=..., password=...))
```

---

## 🛠️ Implementation Template (End-to-End Flow — 5 Steps)

### Step 1: Define the Entity

`[domain]/[concept].py` — pure dataclass, no ORM, no framework:

```python
from dataclasses import dataclass
from [domain].value_objects.user_id import UserId
from [domain].value_objects.email import Email

@dataclass(frozen=True)
class Identity:
    id: UserId
    email: Email | None
    provider: str
```

### Step 2: Define Value Objects

`[domain]/value_objects/[name].py` — subclass `str` or `int`, validate in `__new__`, raise `BusinessRuleViolation`:

```python
import re
from shared.exceptions import BusinessRuleViolation

_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

class Email(str):
    def __new__(cls, value: str) -> "Email":
        normalized = value.strip().lower() if value else ""
        if not _PATTERN.match(normalized):
            raise BusinessRuleViolation(f"'{value}' is not a valid email address.")
        return super().__new__(cls, normalized)
```

Rules:
- Inherit from `str` (or `int`) so they pass type checks and serialize naturally
- Validate in `__new__`, never in `__init__`
- Always normalize (strip, lowercase) before validating
- Raise `BusinessRuleViolation`, never `ValueError`

### Step 3: Define the Repository Interface + Commands

`[domain]/repository.py` — abstract contract, zero infrastructure knowledge:

```python
from abc import ABC, abstractmethod
from [domain].[concept] import Identity
from [domain].value_objects.email import Email

class IAuthRepository(ABC):

    @abstractmethod
    def sign_in_with_email(self, email: Email, password: str) -> dict: ...

    @abstractmethod
    def sign_out(self, access_token: str) -> None: ...
```

`[domain]/commands.py` — one frozen dataclass per use case, raw strings only (validation happens in operations):

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class SignInWithEmailCommand:
    email: str
    password: str

@dataclass(frozen=True)
class SignOutCommand:
    access_token: str
```

### Step 4: Write Operations + Concrete Repository + Execute Dispatcher

`[domain]/operations/[action].py` — pure function, receives repo + raw args, builds value objects, calls repo:

```python
from [domain].repository import IAuthRepository
from [domain].value_objects.email import Email
from [domain].value_objects.password import Password

def with_email(repo: IAuthRepository, raw_email: str, raw_password: str) -> dict:
    email = Email(raw_email or "")
    password = Password(raw_password or "")
    return repo.sign_in_with_email(email, password)
```

`[domain]/infrastructure/supabase_repository.py` — implements the interface, only file that imports the SDK:

```python
from supabase import Client
from [domain].repository import IAuthRepository

class SupabaseAuthRepository(IAuthRepository):

    def __init__(self, client: Client) -> None:
        self._client = client

    def sign_in_with_email(self, email, password) -> dict:
        response = self._client.auth.sign_in_with_password(
            {"email": str(email), "password": password}
        )
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        }
```

`shared/providers.py` — creates repo once per Flask request using `g`:

```python
from flask import g
from shared import supabase
from auth.infrastructure.supabase_repository import SupabaseAuthRepository

def get_auth_repo() -> SupabaseAuthRepository:
    if "auth_repo" not in g:
        g.auth_repo = SupabaseAuthRepository(supabase.get_client())
    return g.auth_repo
```

`[domain]/execute.py` — resolves repo from `g`, dispatches to operations via `match`:

```python
from typing import Any
from [domain].commands import SignInWithEmailCommand, SignOutCommand
from [domain].operations import sign_in, sign_out
from shared.providers import get_auth_repo
from shared.exceptions import BusinessRuleViolation

def execute(command: Any) -> Any:
    repo = get_auth_repo()
    match command:
        case SignInWithEmailCommand(email, password):
            return sign_in.with_email(repo, email, password)
        case SignOutCommand(access_token):
            return sign_out.execute(repo, access_token)
        case _:
            raise BusinessRuleViolation(f"Unknown command: {type(command).__name__}")
```

### Step 5: Expose via HTTP Endpoint

`api/v1/endpoints/[name].py` — only builds commands from JSON and calls execute. No business logic:

```python
from flask import Blueprint, request, jsonify
from auth.execute import execute as auth_execute
from auth.commands import SignInWithEmailCommand
from shared.exceptions import BusinessRuleViolation

session_bp = Blueprint("session", __name__, url_prefix="/api/v1/auth")

@session_bp.route("/sign-in/email", methods=["POST"])
def login_email():
    data = request.get_json() or {}
    try:
        session = auth_execute(SignInWithEmailCommand(
            email=data.get("email", ""),
            password=data.get("password", ""),
        ))
        return jsonify(session), 200
    except BusinessRuleViolation as err:
        return jsonify({"error": str(err)}), 400
```

---

## 🧩 Layer Responsibility Summary

| File | Imports allowed | Never imports |
|------|----------------|---------------|
| `api/endpoints/` | `execute`, `commands`, Flask | domain internals, repos, Supabase |
| `[domain]/execute.py` | `commands`, `operations`, `shared/providers` | Flask `request`, Supabase SDK |
| `[domain]/operations/` | `repository` interface, value objects, `shared/exceptions` | Flask, Supabase SDK, `providers` |
| `[domain]/repository.py` | entity, value objects | infrastructure, Flask, Supabase |
| `[domain]/infrastructure/` | `repository` interface, Supabase/SQLAlchemy SDK | Flask, other domains |
| `shared/providers.py` | `shared/supabase`, infrastructure repos, Flask `g` | domain operations, domain entities |
| `shared/` (rest) | stdlib only | any domain folder |

## 🔁 Adding a New Domain Checklist

```
1. [domain]/[concept].py          ← entity dataclass
2. [domain]/value_objects/        ← one file per validated type
3. [domain]/repository.py         ← IXxxRepository ABC
4. [domain]/commands.py           ← one dataclass per use case
5. [domain]/operations/[action].py ← pure functions per use case
6. [domain]/infrastructure/[provider]_repository.py ← concrete impl
7. shared/providers.py            ← add get_xxx_repo()
8. [domain]/execute.py            ← dispatcher with match/case
9. api/v1/endpoints/[name].py     ← blueprint, commands only
10. api/__init__.py               ← register new blueprint
```

# Kipo Platform

Monorepo de Kipo: dashboard web, landing y API backend, con un design system propio compartido entre apps.

## Stack

- **Monorepo**: pnpm workspaces
- **Dashboard** (`src/apps/kipo-dashboard`): Next.js (App Router) + Tailwind
- **Landing** (`src/apps/kipo-landing`): Astro
- **Backend** (`src/apps/kipo-platform`): Flask (Python), gestionado con `uv`
- **Base de datos / Auth / Storage**: Supabase (local vía Supabase CLI + Docker)
- **Design system** (`src/packages/*`): `@kipo/ui-react`, `@kipo/theme`, `@kipo/fonts`, `@kipo/tokens`

## Estructura

```
src/
  apps/
    kipo-dashboard/   ← Next.js, dashboard de la app
    kipo-landing/     ← Astro, landing pública
    kipo-platform/    ← Flask, API backend
  packages/
    ui-react/         ← Design system (@kipo/ui-react)
    theme/
    fonts/
    fonts-kipo/
    tokens/
supabase/             ← Config de Supabase local (config.toml, migraciones)
```

Las convenciones de arquitectura de dominios, hooks, y patrones de UI están documentadas en [`CLAUDE.md`](./CLAUDE.md).

## Requisitos

- Node.js >= 22 y pnpm >= 10 (ver `engines` en `package.json`)
- Python >= 3.14 y [`uv`](https://docs.astral.sh/uv/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- Docker Desktop corriendo (Supabase local levanta contenedores)

## Instalación

```bash
pnpm install          # instala dependencias de todos los workspaces
pnpm install:py       # instala dependencias de Python del backend (uv sync)
```

## Variables de entorno

Hay tres `.env` distintos, cada uno gitignored salvo los `.env.example`:

| Archivo | Para qué |
|---|---|
| `.env` (raíz) | Providers de auth de Supabase local: SMS (Twilio) y social login (Google/Facebook/Apple). Ver `.env.example` |
| `src/apps/kipo-platform/.env` | Conexión del backend a Supabase (`PROJECT_URL`, `DATABASE_URL`, `AUTH_KEY_*`, `STORAGE_*`, `CORS_EXTRA_ORIGINS`, `CORS_WILDCARD_DOMAIN`) |
| `src/apps/kipo-dashboard/.env.local` | `NEXT_PUBLIC_API_URL` — URL del backend que consume el dashboard. `NEXT_PUBLIC_APP_DOMAIN` — dominio base para routing por subdominio (ej. `localhost` en dev, `kipo.com.mx` en prod) |

### Variables clave para subdomain routing en local

El dashboard rutea cada tenant a su propio subdominio (`tenant.kipo.com.mx` en prod). Para que funcione en local:

1. **`src/apps/kipo-dashboard/.env.local`** — agrega:
   ```
   NEXT_PUBLIC_APP_DOMAIN=localhost
   ```

2. **`src/apps/kipo-platform/.env`** — agrega:
   ```
   CORS_WILDCARD_DOMAIN=localhost
   ```
   Esto permite que el backend acepte requests desde `http://<tenant>.localhost:3000`.

> Los browsers modernos resuelven `*.localhost` a `127.0.0.1` sin configuración adicional de DNS.  
> **Reinicia el dev server de Next.js** después de cambiar `.env.local` — los cambios no se hot-reload.

El `.env` de la raíz **no se carga automáticamente** por el CLI de Supabase — hay que exportarlo antes de levantar el stack:

```bash
export $(grep -v '^#' .env | xargs) && supabase start
```

Si no configuras un provider de SMS real, el login por teléfono sigue funcionando en local usando los números de prueba definidos en `supabase/config.toml` bajo `[auth.sms.test_otp]` (código fijo, sin enviar SMS real).

## Levantar todo en local

1. **Supabase** (desde la raíz del repo):
   ```bash
   export $(grep -v '^#' .env | xargs) && supabase start
   ```
   Guarda los valores que imprime (`API_URL`, `ANON_KEY`/`PUBLISHABLE_KEY`, `SERVICE_ROLE_KEY`/`SECRET_KEY`, credenciales S3) — son los que van en `src/apps/kipo-platform/.env`.

2. **Backend** (Flask, puerto 8000):
   ```bash
   pnpm dev:api
   ```

3. **Dashboard** (Next.js, puerto 3000):
   ```bash
   pnpm dev:dashboard
   ```

4. **Landing** (Astro):
   ```bash
   pnpm dev:landing
   ```

O todo junto (dashboard + landing + api en paralelo):
```bash
pnpm dev
```

## Scripts útiles

```bash
pnpm lint              # lint en todos los workspaces
pnpm typecheck         # typecheck en todos los workspaces
pnpm build             # build de packages + apps
pnpm build:packages    # solo build de @kipo/ui-react
pnpm storybook         # Storybook del design system
```

Backend (desde `src/apps/kipo-platform`, o vía filtro pnpm):
```bash
uv run pytest          # tests
uv run ruff check .    # lint
```

## Supabase local — referencia rápida

- Config del proyecto: `supabase/config.toml`
- Migraciones: `supabase/migrations`
- Studio local: `http://127.0.0.1:54323`
- Mailpit (captura de emails de auth): `http://127.0.0.1:54324`

```bash
supabase status   # ver URLs y keys actuales
supabase stop      # apagar contenedores
```

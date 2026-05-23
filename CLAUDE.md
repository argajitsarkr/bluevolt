# CLAUDE.md - Blue Volt Scientific

> **READ THIS BEFORE MAKING ANY CHANGES.**
>
> Single source of truth. Check the Changelog at the bottom first, update it before ending any session that changes code, schema, config, or deployment.

> **TYPOGRAPHY RULE (HARD):** Never use the em-dash. Always use a plain hyphen `-`. Applies everywhere - UI copy, code, commits, docs, this file.

---

## Project Overview

**Site:** Blue Volt Scientific (domain TBD - run on Ubuntu laptop, no domain yet)
**Type:** Scientific catalog + order-booking platform (no online payments)
**Owner:** Argajit Sen

Blue Volt Scientific lets researchers browse a discounted catalog of chemicals, glassware, equipment, and consumables, plus a separate services section (instrument repairs, servicing). Users sign up, add catalog items to a cart, or submit a free-text custom query. Orders capture name + phone + notes only - the team calls back to confirm. No money flows through the site.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind, NextAuth v5 (Credentials only) |
| Backend | FastAPI, SQLAlchemy async, Alembic |
| Database | PostgreSQL 15 |
| Cache | Redis 7 (used for rate-limits + sessions, no Celery yet) |
| Deployment | Docker Compose on the owner's Ubuntu laptop, accessed via SSH |

Mirrors GrantSetu's stack intentionally so deployment muscle memory transfers.

---

## Domain Model

- **User** - id, email, password_hash, full_name, phone, is_admin, created_at.
- **Category** - id, name, slug, kind (`product` | `service`).
- **Product** - id, slug, name, description, category_id, brand, sku, pack_size, mrp_paise, our_price_paise, in_stock, image_url, created_at.
- **Service** - id, slug, name, description, category_id, indicative_price_paise (nullable), turnaround_days, image_url.
- **Order** - id, user_id, status (`pending` | `confirmed` | `cancelled` | `fulfilled`), contact_name, contact_phone, notes, created_at.
- **OrderItem** - id, order_id, kind (`product` | `service` | `custom`), product_id (nullable), service_id (nullable), custom_text (nullable), quantity, unit_price_paise (nullable, snapshot).

Custom queries are first-class: a user can submit an order containing only `custom`-kind line items (no catalog item required).

---

## Roles

- **User** - browses catalog, manages cart, places orders, sees their own order history at `/dashboard`.
- **Admin** - `is_admin=true`. Sees `/admin` with: order list (filter by status), order detail (mark confirmed/cancelled/fulfilled), product CRUD, service CRUD, category CRUD. Three admin emails are seeded:
  - `argajit05@gmail.com`
  - `gowasimgo85@gmail.com`
  - Third slot: configure via `ADMIN_EMAILS` env var when ready.

Admin promotion is automatic: any user whose email is in `ADMIN_EMAILS` gets `is_admin=true` on signup/login.

---

## File Structure

```
Volt Scientific/
├── CLAUDE.md
├── docker-compose.yml
├── deploy.sh
├── README.md
├── bluevolt-frontend/
│   ├── Dockerfile
│   ├── package.json, next.config.js, tailwind.config.ts, tsconfig.json, postcss.config.js
│   ├── .env.local.example
│   └── src/
│       ├── app/
│       │   ├── layout.tsx, page.tsx, globals.css
│       │   ├── products/page.tsx, products/[slug]/page.tsx
│       │   ├── services/page.tsx, services/[slug]/page.tsx
│       │   ├── cart/page.tsx, checkout/page.tsx
│       │   ├── auth/signin/page.tsx, auth/signup/page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── admin/page.tsx
│       │   ├── admin/orders/page.tsx, admin/orders/[id]/page.tsx
│       │   ├── admin/products/page.tsx, admin/products/new/page.tsx, admin/products/[id]/edit/page.tsx
│       │   ├── admin/services/page.tsx, admin/services/new/page.tsx, admin/services/[id]/edit/page.tsx
│       │   └── api/auth/[...nextauth]/route.ts
│       ├── components/ (Navbar, Footer, ProductCard, ServiceCard, CartContext, Providers, CustomQueryForm, AdminGuard)
│       ├── lib/ (api.ts, auth.ts, cart.ts, format.ts)
│       ├── middleware.ts
│       └── types/index.ts
└── bluevolt-backend/
    ├── Dockerfile, requirements.txt, alembic.ini, .env.example
    ├── alembic/env.py, alembic/versions/001_init.py
    └── app/
        ├── main.py, config.py, database.py, auth.py
        ├── api/v1/ (router.py, auth.py, users.py, products.py, services.py, orders.py, admin.py, health.py)
        ├── models/ (user.py, category.py, product.py, service.py, order.py)
        ├── schemas/ (matching the models)
        └── utils/slug.py
```

---

## Environment Variables

### Frontend (`bluevolt-frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-char-string>
AUTH_TRUST_HOST=true
```

### Backend (`bluevolt-backend/.env`)

```
DATABASE_URL=postgresql+asyncpg://bluevolt:bluevolt@db:5432/bluevolt
REDIS_URL=redis://redis:6379/0
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
ADMIN_EMAILS=argajit05@gmail.com,gowasimgo85@gmail.com
NEXTAUTH_SECRET=<same-as-frontend>
DB_PASSWORD=bluevolt
```

Inside Docker, `db` and `redis` are the service hostnames (not localhost).

---

## Deployment

### Development

```
cd bluevolt-frontend && npm run dev          # localhost:3000
cd bluevolt-backend && uvicorn app.main:app --reload   # localhost:8000
```

### Production on the Ubuntu laptop

```
git clone <repo> ~/bluevolt && cd ~/bluevolt
# fill in .env files
bash deploy.sh up           # first run
bash deploy.sh update       # pull + rebuild + restart
bash deploy.sh logs
bash deploy.sh status
```

Migrations run automatically at container boot (`alembic upgrade head && uvicorn ...`).

---

## Key API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Email + password signup |
| POST | `/api/v1/auth/login` | Email + password login - returns JWT |
| GET | `/api/v1/users/me` | Current user |
| PUT | `/api/v1/users/me` | Update profile (name, phone) |
| GET | `/api/v1/products` | List products (filters: category, search, in_stock) |
| GET | `/api/v1/products/{slug}` | Product detail |
| GET | `/api/v1/services` | List services |
| GET | `/api/v1/services/{slug}` | Service detail |
| GET | `/api/v1/categories?kind=product\|service` | Categories |
| POST | `/api/v1/orders` | Place an order (cart items + optional custom queries) |
| GET | `/api/v1/orders/me` | User's own orders |
| GET | `/api/v1/admin/orders` | All orders (admin) |
| PATCH | `/api/v1/admin/orders/{id}` | Update order status |
| POST | `/api/v1/admin/products` | Create product |
| PUT | `/api/v1/admin/products/{id}` | Update product |
| DELETE | `/api/v1/admin/products/{id}` | Delete product |
| POST | `/api/v1/admin/services` | Create service |
| PUT | `/api/v1/admin/services/{id}` | Update service |
| DELETE | `/api/v1/admin/services/{id}` | Delete service |
| POST | `/api/v1/admin/categories` | Create category |
| GET | `/api/v1/health` | Healthcheck |

---

## Order Flow

1. User browses `/products` or `/services`, clicks "Add to cart".
2. Cart is held in client-side React Context, persisted to `localStorage` (no logged-in requirement to fill cart).
3. At `/checkout`, user must be signed in. Form pre-fills name + phone from profile.
4. User can add any number of free-text "custom query" lines (e.g. "Need 5kg sodium acetate, food grade").
5. Submit -> `POST /api/v1/orders` -> server creates an Order with status `pending` and the corresponding OrderItems.
6. User lands on `/dashboard` and sees the new order. Admin sees it on `/admin/orders`.
7. Admin calls the user, then marks the order `confirmed`, `cancelled`, or `fulfilled`.

---

## Categories (seeded)

- Product kind: Chemicals & Reagents, Glassware & Plasticware, Lab Equipment & Instruments, Consumables.
- Service kind: Instrument Repair, Annual Maintenance, Calibration, Custom Servicing.

---

## Known Issues & Pending Work

1. Domain not chosen yet - all envs use `localhost`.
2. Third admin email pending (`ADMIN_EMAILS` currently has 2).
3. No email notifications on order placement (intentionally deferred - admin checks the panel).
4. No image upload backend; product/service images are URL-only for v1.
5. No payment integration. By design.

---

## Changelog

| Date | Changes |
|---|---|
| 2026-05-24 | Initial scaffold - Next.js 14 frontend, FastAPI backend, Postgres + Redis via Docker Compose. Auth (credentials), products + services catalog with full /products and /services split, cart with custom queries, order placement, 3-admin panel for order management. ADMIN_EMAILS seeded with argajit05@gmail.com and gowasimgo85@gmail.com. |

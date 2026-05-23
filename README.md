# Blue Volt Scientific

Catalog + order-booking platform for scientific chemicals, glassware, equipment, and repair/servicing.

See [CLAUDE.md](CLAUDE.md) for the full architecture, deployment guide, and changelog.

## Quick start

```bash
# 1. Copy env templates and fill them in
cp bluevolt-backend/.env.example bluevolt-backend/.env
cp bluevolt-frontend/.env.local.example bluevolt-frontend/.env.local

# 2. Boot the stack
bash deploy.sh up

# 3. Visit
# Frontend:  http://localhost:3000
# API docs:  http://localhost:8000/docs
```

## Admins

Any user whose email is in `ADMIN_EMAILS` (backend `.env`) auto-becomes an admin on signup or next login. Seeded:
- argajit05@gmail.com
- gowasimgo85@gmail.com
- Third slot - add to `ADMIN_EMAILS` when ready.

## No payments

By design. Orders capture name + phone + notes. The team calls back to confirm.

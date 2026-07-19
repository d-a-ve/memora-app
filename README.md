# Memora monorepo

pnpm workspace: `apps/api` (Hono + Drizzle), `apps/web` (Vite SPA), `packages/shared`.

The web app was ported from the old repo: [d-a-ve/memora](https://github.com/d-a-ve/memora).

## Quick start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# set DATABASE_URL and other secrets in apps/api/.env

pnpm db:generate   # after schema changes
pnpm dev           # API + web together
```

- API docs: http://localhost:3000/docs  
- Web app: http://localhost:5173  

Migrations run automatically via Drizzle's migrator when the API starts (`src/db/run-migrations.ts`). You can still run them manually with `pnpm db:migrate`.

Appwrite → Postgres import runs on API start when `MIGRATE_APPWRITE=true` (idempotent via `data_migrations`).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | API + web (parallel) |
| `pnpm dev:api` | API only |
| `pnpm dev:web` | Web only |
| `pnpm build` | Build API + web |
| `pnpm build:api` | Build API only |
| `pnpm build:web` | Build web only |
| `pnpm db:generate` | Drizzle migration from schema |
| `pnpm db:migrate` | Apply migrations (also runs on API start) |
| `pnpm db:push` | Push schema (dev) |

## Deploy notes

- **Render (API):** root `apps/api`, build `pnpm install && pnpm --filter @memora/api build`, start `pnpm --filter @memora/api start`
- **Vercel (web):** root `apps/web`; set `VITE_API_URL` to the API origin
- Cross-origin cookies: set `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS` (comma-separated), `COOKIE_SECURE=true` in prod

# Memora monorepo

pnpm workspace: `apps/api` (Hono + Drizzle), `apps/web` (FE placeholder), `packages/shared`.

## API quick start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
# set DATABASE_URL and other secrets

pnpm db:generate   # after schema changes
pnpm dev           # applies migrations on start, then serves
```

- Docs: http://localhost:8000/docs  
- OpenAPI: http://localhost:8000/openapi.json  

Migrations run automatically via Drizzle's migrator when the API starts (`src/db/run-migrations.ts`). You can still run them manually with `pnpm db:migrate`.

Appwrite → Postgres import runs on API start when `MIGRATE_APPWRITE=true` (idempotent via `data_migrations`).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | API watch mode |
| `pnpm db:generate` | Drizzle migration from schema |
| `pnpm db:migrate` | Apply migrations (also runs on API start) |
| `pnpm db:push` | Push schema (dev) |

## Deploy notes

- **Render (API):** root `apps/api`, build `pnpm install && pnpm --filter @memora/api build`, start `pnpm --filter @memora/api start`
- **Vercel (web later):** root `apps/web`
- Cross-origin cookies: set `FRONTEND_ORIGIN`, `COOKIE_SECURE=true` in prod

# Memora web (Vite + React)

## Dev

```bash
# from repo root
pnpm dev         # API + web
pnpm dev:api     # API only (:3000)
pnpm dev:web     # web only (:5173)
```

Env: copy `.env.example` → `.env` and set `VITE_API_URL` to the API origin (e.g. `http://localhost:3000`).

## API client

Hono RPC + TanStack Query. Data access lives in `src/api/`; hooks keep calling the same helper names as before.

```ts
import { api } from "@api/client";
const me = await api.auth.me.$get();
```

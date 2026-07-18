# Placeholder for Memora Vite SPA.

When migrating the frontend here:

1. Copy from `/Users/dave/Dev/memora` into this package.
2. Use Hono RPC:

```ts
import { hc } from "hono/client";
import type { AppType } from "../../api/src/client";

const client = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});
```

3. Point Vercel root directory at `apps/web`.
4. Dev: Vite proxy to API for same-origin cookies, or keep cross-site cookie config.

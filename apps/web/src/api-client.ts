/**
 * Hono RPC client stub for when the Vite SPA lives here.
 *
 * Usage once FE is migrated:
 *
 * ```ts
 * import { createApiClient } from "./api-client";
 * const api = createApiClient(import.meta.env.VITE_API_URL);
 * const me = await api.auth.me.$get();
 * ```
 */
import { hc } from "hono/client";
import type { AppType } from "@memora/api/client";

export function createApiClient(baseUrl: string) {
  return hc<AppType>(baseUrl, {
    init: { credentials: "include" },
  });
}

import type { AppType } from "@memora/api/client";
import { hc } from "hono/client";

import { API_URL } from "@config/index";

export const api = hc<AppType>(API_URL, {
  init: { credentials: "include" },
});

export function getApiBaseUrl(): string {
  if (API_URL) return API_URL.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

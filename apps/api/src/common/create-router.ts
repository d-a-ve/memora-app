import { OpenAPIHono } from "@hono/zod-openapi";

import { validationHook } from "./handlers/validation-hook.js";
import type { AppEnv } from "../types.js";

export function createRouter() {
  return new OpenAPIHono<AppEnv>({
    defaultHook: validationHook,
  });
}

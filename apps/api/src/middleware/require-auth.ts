import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { logger } from "../common/utils/logger.js";
import type { AppEnv } from "../types.js";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    logger.warn("Unauthorized request", {
      path: c.req.path,
      method: c.req.method,
    });
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  await next();
});

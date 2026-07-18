import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { env } from "../env.js";

export const cronSecret = createMiddleware(async (c, next) => {
  const header =
    c.req.header("authorization") ?? c.req.header("x-cron-secret") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : header;

  if (!token || token !== env.CRON_SECRET) {
    throw new HTTPException(401, { message: "Invalid cron secret" });
  }
  await next();
});

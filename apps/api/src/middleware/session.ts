import { createMiddleware } from "hono/factory";

import { readSessionCookie } from "../common/utils/cookies.js";
import { getUserBySessionToken } from "../common/utils/session.js";
import type { AppEnv } from "../types.js";

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = readSessionCookie(c);
  if (!token) {
    c.set("user", null);
    await next();
    return;
  }
  const user = await getUserBySessionToken(token);
  c.set("user", user);
  await next();
});

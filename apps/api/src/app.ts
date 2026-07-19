import { swaggerUI } from "@hono/swagger-ui";
import { createRoute } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { cors } from "hono/cors";

import { createRouter } from "./common/create-router.js";
import { apiSuccess } from "./common/api-response.js";
import { notFoundHandler } from "./common/handlers/not-found.js";
import { SESSION_COOKIE } from "./common/utils/cookies.js";
import { db } from "./db/index.js";
import { env } from "./env.js";
import { errorHandler } from "./middleware/error.js";
import { sessionMiddleware } from "./middleware/session.js";
import { authRoutes } from "./routes/auth.js";
import { birthdayRoutes } from "./routes/birthdays.js";
import { cronRoutes } from "./routes/cron.js";
import { feedbackRoutes } from "./routes/feedback.js";
import { HealthSuccessSchema, RootSuccessSchema } from "./schemas/index.js";

const app = createRouter();

app.openAPIRegistry.registerComponent("securitySchemes", "sessionCookie", {
  type: "apiKey",
  in: "cookie",
  name: SESSION_COOKIE,
});

app.onError(errorHandler);
app.notFound(notFoundHandler);

app.use(
  "*",
  cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "X-Cron-Secret"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("*", sessionMiddleware);

const rootRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Meta"],
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: RootSuccessSchema } },
    },
  },
});

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Meta"],
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: HealthSuccessSchema } },
    },
    503: {
      description: "Degraded",
      content: { "application/json": { schema: HealthSuccessSchema } },
    },
  },
});

/** Client-callable surface for Hono RPC (`hc<AppType>`). */
const routes = app
  .openapi(rootRoute, (c) =>
    c.json(apiSuccess("This is Memora API", { ok: true }), 200)
  )
  .openapi(healthRoute, async (c) => {
    let databaseOperational = false;
    try {
      await db.execute(sql`SELECT 1`);
      databaseOperational = true;
    } catch (err) {
      console.error("Health check DB failed:", err);
    }

    const payload = apiSuccess(
      databaseOperational ? "OK" : "Degraded — database unavailable",
      {
        api: true,
        database: databaseOperational,
      }
    );

    return c.json(payload, databaseOperational ? 200 : 503);
  })
  .route("/auth", authRoutes)
  .route("/birthdays", birthdayRoutes)
  .route("/feedback", feedbackRoutes);

// Internal + docs: registered at runtime, omitted from AppType
routes.route("/internal/cron", cronRoutes);
routes.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Memora API",
    version: "1.0.0",
  },
});
routes.get("/docs", swaggerUI({ url: "/openapi.json" }));

export type AppType = typeof routes;
export { routes as app };

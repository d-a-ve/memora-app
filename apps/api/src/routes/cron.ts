import { createRoute } from "@hono/zod-openapi";

import { toCronRunDto } from "../db/mappers/index.js";
import { apiSuccess } from "../common/api-response.js";
import { createRouter } from "../common/create-router.js";
import { cronSecret } from "../middleware/cron-secret.js";
import { CronRunSuccessSchema, ErrorSchema } from "../schemas/index.js";
import { runDailyCron } from "../services/daily-cron.js";

export const cronRoutes = createRouter();

const dailyRoute = createRoute({
  method: "post",
  path: "/daily",
  tags: ["Internal"],
  middleware: [cronSecret] as const,
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: CronRunSuccessSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

cronRoutes.openapi(dailyRoute, async (c) => {
  const { run, alreadyRan } = await runDailyCron();
  return c.json(
    apiSuccess(
      alreadyRan ? "Cron already ran today" : "Cron completed",
      toCronRunDto(run, alreadyRan)
    ),
    200
  );
});

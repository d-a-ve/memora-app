import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "../common/create-router.js";
import { requireAuth } from "../middleware/require-auth.js";
import { ErrorSchema, FeedbackBodySchema } from "../schemas/index.js";
import { submitFeedback } from "../services/feedback.js";

const sessionSecurity = [{ sessionCookie: [] }];

const feedbackRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Feedback"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: { "application/json": { schema: FeedbackBodySchema } },
      required: true,
    },
  },
  responses: {
    204: { description: "No content" },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
    503: {
      description: "Feedback delivery unavailable",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

export const feedbackRoutes = createRouter().openapi(feedbackRoute, async (c) => {
  const user = c.get("user")!;
  const body = c.req.valid("json");

  await submitFeedback({
    name: user.name,
    email: user.email,
    type: body.type,
    message: body.message,
  });

  return c.body(null, 204);
});

import { createRoute, z } from "@hono/zod-openapi";

import { toUserDto } from "../db/mappers/index.js";
import { env } from "../env.js";
import { apiSuccess } from "../common/api-response.js";
import { createRouter } from "../common/create-router.js";
import {
  clearOAuthStateCookie,
  clearSessionCookie,
  readOAuthStateCookie,
  readSessionCookie,
  setOAuthStateCookie,
  setSessionCookie,
} from "../common/utils/cookies.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  ErrorSchema,
  ForgotPasswordBodySchema,
  LoginBodySchema,
  ResetPasswordBodySchema,
  SignupBodySchema,
  UpdateNameBodySchema,
  UserSuccessSchema,
} from "../schemas/index.js";
import * as authService from "../services/auth.js";

const sessionSecurity = [{ sessionCookie: [] }];

const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: SignupBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: UserSuccessSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
    409: {
      description: "Conflict",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: LoginBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: UserSuccessSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const meRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Auth"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: UserSuccessSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  tags: ["Auth"],
  responses: {
    204: { description: "No content" },
  },
});

const patchMeRoute = createRoute({
  method: "patch",
  path: "/me",
  tags: ["Auth"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: { "application/json": { schema: UpdateNameBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: UserSuccessSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const forgotRoute = createRoute({
  method: "post",
  path: "/forgot-password",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: ForgotPasswordBodySchema } },
      required: true,
    },
  },
  responses: {
    204: { description: "No content" },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const resetRoute = createRoute({
  method: "post",
  path: "/reset-password",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: ResetPasswordBodySchema } },
      required: true,
    },
  },
  responses: {
    204: { description: "No content" },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const googleOAuthRoute = createRoute({
  method: "get",
  path: "/oauth/google",
  tags: ["Auth"],
  responses: {
    302: { description: "Redirect to Google OAuth" },
    500: {
      description: "OAuth not configured",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

const googleOAuthCallbackRoute = createRoute({
  method: "get",
  path: "/oauth/google/callback",
  tags: ["Auth"],
  request: {
    query: z.object({
      code: z.string().optional(),
      state: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  responses: {
    302: { description: "Redirect to frontend" },
  },
});

export const authRoutes = createRouter()
  .openapi(signupRoute, async (c) => {
    const body = c.req.valid("json");
    const { user, sessionToken } = await authService.signup(body);
    setSessionCookie(c, sessionToken);
    return c.json(apiSuccess("Account created", toUserDto(user)), 201);
  })
  .openapi(loginRoute, async (c) => {
    const body = c.req.valid("json");
    const { user, sessionToken } = await authService.login(body);
    setSessionCookie(c, sessionToken);
    return c.json(apiSuccess("Logged in", toUserDto(user)), 200);
  })
  .openapi(meRoute, async (c) => {
    return c.json(apiSuccess("OK", toUserDto(c.get("user")!)), 200);
  })
  .openapi(logoutRoute, async (c) => {
    await authService.logout(readSessionCookie(c));
    clearSessionCookie(c);
    return c.body(null, 204);
  })
  .openapi(patchMeRoute, async (c) => {
    const body = c.req.valid("json");
    const current = c.get("user")!;
    const updated = await authService.updateName(current.id, body.name);
    return c.json(apiSuccess("Profile updated", toUserDto(updated)), 200);
  })
  .openapi(forgotRoute, async (c) => {
    const { email } = c.req.valid("json");
    await authService.forgotPassword(email);
    return c.body(null, 204);
  })
  .openapi(resetRoute, async (c) => {
    const body = c.req.valid("json");
    await authService.resetPassword(body);
    return c.body(null, 204);
  })
  .openapi(googleOAuthRoute, (c) => {
    const { url, state } = authService.beginGoogleOAuth();
    setOAuthStateCookie(c, state);
    return c.redirect(url);
  })
  .openapi(googleOAuthCallbackRoute, async (c) => {
    const query = c.req.valid("query");
    const cookieState = readOAuthStateCookie(c);
    clearOAuthStateCookie(c);

    if (
      query.error ||
      !query.state ||
      !cookieState ||
      query.state !== cookieState
    ) {
      return c.redirect(`${env.FRONTEND_URL}/login?error=oauth_state`);
    }

    const result = await authService.completeGoogleOAuth(query.code);
    if (result.status === "error") {
      return c.redirect(`${env.FRONTEND_URL}/login?error=${result.error}`);
    }

    setSessionCookie(c, result.sessionToken);
    return c.redirect(`${env.FRONTEND_URL}/oauth`);
  });

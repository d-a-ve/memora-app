import { createRoute, z } from "@hono/zod-openapi";

import { toBirthdayDto } from "../db/mappers/index.js";
import {
  apiPaginatedSuccess,
  apiSuccess,
} from "../common/api-response.js";
import { createRouter } from "../common/create-router.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  BirthdayListSuccessSchema,
  BirthdaySuccessSchema,
  CreateBirthdayBodySchema,
  ErrorSchema,
  ListBirthdaysQuerySchema,
  UpdateBirthdayBodySchema,
} from "../schemas/index.js";
import * as birthdayService from "../services/birthdays.js";

export const birthdayRoutes = createRouter();

const sessionSecurity = [{ sessionCookie: [] }];

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Birthdays"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: { query: ListBirthdaysQuerySchema },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: BirthdayListSuccessSchema } },
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

birthdayRoutes.openapi(listRoute, async (c) => {
  const user = c.get("user")!;
  const { limit, page, search } = c.req.valid("query");
  const { documents, totalCount, totalPages } =
    await birthdayService.listBirthdays({
      userId: user.id,
      limit,
      page,
      search,
    });

  return c.json(
    apiPaginatedSuccess("Birthdays retrieved", documents.map(toBirthdayDto), {
      currentPage: page,
      totalPages,
      perPage: limit,
      total: totalCount,
    }),
    200
  );
});

const createRouteDef = createRoute({
  method: "post",
  path: "/",
  tags: ["Birthdays"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: { "application/json": { schema: CreateBirthdayBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: BirthdaySuccessSchema } },
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

birthdayRoutes.openapi(createRouteDef, async (c) => {
  const user = c.get("user")!;
  const body = c.req.valid("json");
  const row = await birthdayService.createBirthday({
    userId: user.id,
    name: body.name,
    birthday: body.birthday,
  });
  return c.json(apiSuccess("Birthday added", toBirthdayDto(row)), 201);
});

const IdParam = z.object({
  id: z.string().uuid(),
});

const updateRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Birthdays"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: {
    params: IdParam,
    body: {
      content: { "application/json": { schema: UpdateBirthdayBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: BirthdaySuccessSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

birthdayRoutes.openapi(updateRoute, async (c) => {
  const user = c.get("user")!;
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const row = await birthdayService.updateBirthday({
    userId: user.id,
    id,
    name: body.name,
    birthday: body.birthday,
  });
  return c.json(apiSuccess("Birthday updated", toBirthdayDto(row)), 200);
});

const deleteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Birthdays"],
  security: sessionSecurity,
  middleware: [requireAuth] as const,
  request: { params: IdParam },
  responses: {
    204: { description: "No content" },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

birthdayRoutes.openapi(deleteRoute, async (c) => {
  const user = c.get("user")!;
  const { id } = c.req.valid("param");
  await birthdayService.deleteBirthday(user.id, id);
  return c.body(null, 204);
});

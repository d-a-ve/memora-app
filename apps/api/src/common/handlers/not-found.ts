import type { NotFoundHandler } from "hono";

import { apiError, ErrorCodes } from "../api-response.js";

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(apiError("Not found", ErrorCodes.RESOURCE_NOT_FOUND), 404);
};

import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { apiError, ErrorCodes } from "../common/api-response.js";
import { logger } from "../common/utils/logger.js";

function codeFromStatus(status: number): string {
  switch (status) {
    case 400:
      return ErrorCodes.BAD_REQUEST;
    case 401:
      return ErrorCodes.UNAUTHORIZED;
    case 403:
      return ErrorCodes.FORBIDDEN;
    case 404:
      return ErrorCodes.RESOURCE_NOT_FOUND;
    case 409:
      return ErrorCodes.CONFLICT;
    default:
      return ErrorCodes.INTERNAL_ERROR;
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      apiError(err.message, codeFromStatus(err.status)),
      err.status
    );
  }

  logger.error("Unhandled request error", {
    path: c.req.path,
    method: c.req.method,
    errorName: err instanceof Error ? err.name : "Unknown",
    errorMessage: err instanceof Error ? err.message : String(err),
  });

  return c.json(
    apiError("Internal server error", ErrorCodes.INTERNAL_ERROR),
    500
  );
};

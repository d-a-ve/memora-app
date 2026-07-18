import type { Hook } from "@hono/zod-openapi";

import { apiError, ErrorCodes } from "../api-response.js";
import { mapZodIssues } from "../utils/validation.js";
import type { AppEnv } from "../../types.js";

export const validationHook: Hook<unknown, AppEnv, string, unknown> = (
  result,
  c
) => {
  if (!result.success) {
    return c.json(
      apiError(
        "Validation failed",
        ErrorCodes.VALIDATION_ERROR,
        mapZodIssues(result.error.issues)
      ),
      400
    );
  }
};

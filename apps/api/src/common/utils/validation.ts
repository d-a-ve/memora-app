import type { ZodIssue } from "zod";

import type { ErrorDetail } from "../api-response.js";

export function mapZodIssues(issues: ZodIssue[]): ErrorDetail[] {
  return issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}

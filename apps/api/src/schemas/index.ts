import { z } from "@hono/zod-openapi";

import { isValidCalendarDate } from "../common/utils/birthday-date.js";

export const ErrorDetailSchema = z
  .object({
    field: z.string(),
    message: z.string(),
  })
  .openapi("ErrorDetail");

export const ErrorSchema = z
  .object({
    message: z.string(),
    details: z.array(ErrorDetailSchema).optional(),
    code: z.string(),
  })
  .openapi("Error");

export const UserDtoSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    isVerified: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("User");

export const BirthdayDtoSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    birthday: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("Birthday");

export const CronRunDtoSchema = z
  .object({
    id: z.string().uuid(),
    idempotencyKey: z.string(),
    datesUpdated: z.number().int(),
    emailsSent: z.number().int(),
    courierMessageIds: z.array(z.string()),
    createdAt: z.string().datetime(),
    alreadyRan: z.boolean(),
  })
  .openapi("CronRun");

export function successSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      message: z.string(),
      data: dataSchema,
    })
    .openapi("Success");
}

export const UserSuccessSchema = successSchema(UserDtoSchema).openapi(
  "UserSuccess"
);
export const BirthdaySuccessSchema = successSchema(BirthdayDtoSchema).openapi(
  "BirthdaySuccess"
);

export const PaginationSchema = z
  .object({
    currentPage: z.number().int(),
    totalPages: z.number().int(),
    perPage: z.number().int(),
    total: z.number().int(),
  })
  .openapi("Pagination");

export const BirthdayListSuccessSchema = z
  .object({
    message: z.string(),
    data: z.array(BirthdayDtoSchema),
    pagination: PaginationSchema,
  })
  .openapi("BirthdayListSuccess");
export const CronRunSuccessSchema = successSchema(CronRunDtoSchema).openapi(
  "CronRunSuccess"
);

export const HealthDataSchema = z
  .object({
    api: z.boolean(),
    database: z.boolean(),
  })
  .openapi("HealthData");

export const HealthSuccessSchema = successSchema(HealthDataSchema).openapi(
  "HealthSuccess"
);

export const RootDataSchema = z
  .object({
    ok: z.boolean(),
  })
  .openapi("RootData");

export const RootSuccessSchema = successSchema(RootDataSchema).openapi(
  "RootSuccess"
);

export const SignupBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
  })
  .openapi("SignupBody");

export const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi("LoginBody");

export const UpdateNameBodySchema = z
  .object({
    name: z.string().min(1),
  })
  .openapi("UpdateNameBody");

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
  })
  .openapi("ForgotPasswordBody");

export const ResetPasswordBodySchema = z
  .object({
    userId: z.string().uuid(),
    token: z.string().min(1),
    password: z.string().min(8),
  })
  .openapi("ResetPasswordBody");

const calendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
  .refine(isValidCalendarDate, "Invalid calendar date");

export const CreateBirthdayBodySchema = z
  .object({
    name: z.string().min(1),
    birthday: calendarDateSchema,
  })
  .openapi("CreateBirthdayBody");

export const UpdateBirthdayBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    birthday: calendarDateSchema.optional(),
  })
  .refine((body) => body.name !== undefined || body.birthday !== undefined, {
    message: "At least one of name or birthday is required",
  })
  .openapi("UpdateBirthdayBody");

export const ListBirthdaysQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  page: z.coerce.number().int().min(1).optional().default(1),
  search: z.string().optional(),
});

export const FeedbackBodySchema = z
  .object({
    type: z.enum(["issue", "feature", "message"]),
    message: z.string().min(1),
  })
  .openapi("FeedbackBody");

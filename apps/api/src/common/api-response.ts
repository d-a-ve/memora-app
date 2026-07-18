export type ErrorDetail = {
  field: string;
  message: string;
};

export type ApiErrorBody = {
  message: string;
  details?: ErrorDetail[];
  code: string;
};

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
};

export type ApiSuccessBody<T> = {
  message: string;
  data: T;
};

export type ApiPaginatedSuccessBody<T> = {
  message: string;
  data: T;
  pagination: PaginationMeta;
};

export function apiSuccess<T>(message: string, data: T): ApiSuccessBody<T> {
  return { message, data };
}

export function apiPaginatedSuccess<T>(
  message: string,
  data: T,
  pagination: PaginationMeta
): ApiPaginatedSuccessBody<T> {
  return { message, data, pagination };
}

export function apiError(
  message: string,
  code: string,
  details?: ErrorDetail[]
): ApiErrorBody {
  return details?.length ? { message, details, code } : { message, code };
}

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
} as const;

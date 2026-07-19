import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function readBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function unwrap<T>(res: Response): Promise<T> {
  const body = await readBody(res);

  if (!res.ok) {
    const err = body as ApiErrorBody | undefined;
    throw new ApiError(
      err?.message || res.statusText || "Request failed",
      res.status,
      err?.code
    );
  }

  return body as T;
}

export async function unwrapData<T>(res: Response): Promise<T> {
  const body = await unwrap<{ data: T }>(res);
  return body.data;
}

export async function unwrapPaginated<T>(res: Response): Promise<{
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  };
}> {
  return unwrap(res);
}

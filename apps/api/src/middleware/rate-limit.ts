import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { AppEnv } from "../types.js";

type RateLimitOptions = {
  /** Bucket namespace so different routes don't share a counter. */
  name: string;
  windowMs: number;
  limit: number;
  /** Defaults to client IP (honors X-Forwarded-For). */
  key?: (c: Context<AppEnv>) => string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function clientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return c.req.header("x-real-ip") ?? "unknown";
}

function pruneExpired(now: number) {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(options: RateLimitOptions) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const now = Date.now();
    pruneExpired(now);

    const identity = options.key?.(c) ?? clientIp(c);
    const storeKey = `${options.name}:${identity}`;

    let bucket = buckets.get(storeKey);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(storeKey, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, options.limit - bucket.count);
    const resetSec = Math.ceil(bucket.resetAt / 1000);

    c.header("X-RateLimit-Limit", String(options.limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(resetSec));

    if (bucket.count > options.limit) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      c.header("Retry-After", String(retryAfter));
      throw new HTTPException(429, { message: "Too many requests" });
    }

    await next();
  });
}

const FIFTEEN_MIN = 15 * 60_000;
const ONE_HOUR = 60 * 60_000;

export const signupRateLimit = rateLimit({
  name: "auth-signup",
  windowMs: ONE_HOUR,
  limit: 10,
});

export const loginRateLimit = rateLimit({
  name: "auth-login",
  windowMs: FIFTEEN_MIN,
  limit: 20,
});

export const forgotPasswordRateLimit = rateLimit({
  name: "auth-forgot-password",
  windowMs: FIFTEEN_MIN,
  limit: 5,
});

export const resetPasswordRateLimit = rateLimit({
  name: "auth-reset-password",
  windowMs: FIFTEEN_MIN,
  limit: 10,
});

export const oauthBeginRateLimit = rateLimit({
  name: "auth-oauth-begin",
  windowMs: FIFTEEN_MIN,
  limit: 30,
});

export const feedbackRateLimit = rateLimit({
  name: "feedback",
  windowMs: ONE_HOUR,
  limit: 10,
  key: (c) => c.get("user")?.id ?? clientIp(c),
});

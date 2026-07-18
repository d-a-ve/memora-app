import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { env, isDev } from "../../env.js";

export const SESSION_COOKIE = "memora_session";
export const OAUTH_STATE_COOKIE = "memora_oauth_state";

export function getSessionCookieOpts() {
  const maxAge = env.SESSION_DAYS * 24 * 60 * 60;
  if (isDev && !env.COOKIE_SECURE) {
    return {
      path: "/" as const,
      httpOnly: true,
      secure: false,
      sameSite: "Lax" as const,
      maxAge,
    };
  }
  return {
    path: "/" as const,
    httpOnly: true,
    secure: true,
    sameSite: "None" as const,
    partitioned: true,
    maxAge,
  };
}

function getClearCookieOpts() {
  const opts = getSessionCookieOpts();
  return {
    path: opts.path,
    secure: opts.secure,
    sameSite: opts.sameSite,
    ...(opts.sameSite === "None" ? { partitioned: true as const } : {}),
  };
}

function getOAuthStateCookieOpts() {
  const base = getSessionCookieOpts();
  return {
    ...base,
    maxAge: 10 * 60,
  };
}

export function setSessionCookie(c: Context, token: string) {
  setCookie(c, SESSION_COOKIE, token, getSessionCookieOpts());
}

export function clearSessionCookie(c: Context) {
  deleteCookie(c, SESSION_COOKIE, getClearCookieOpts());
}

export function readSessionCookie(c: Context): string | undefined {
  return getCookie(c, SESSION_COOKIE);
}

export function setOAuthStateCookie(c: Context, state: string) {
  setCookie(c, OAUTH_STATE_COOKIE, state, getOAuthStateCookieOpts());
}

export function clearOAuthStateCookie(c: Context) {
  deleteCookie(c, OAUTH_STATE_COOKIE, getClearCookieOpts());
}

export function readOAuthStateCookie(c: Context): string | undefined {
  return getCookie(c, OAUTH_STATE_COOKIE);
}

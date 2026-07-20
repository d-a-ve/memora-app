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

  // Cross-origin SPA → API needs SameSite=None; Secure.
  // Do NOT set Partitioned (CHIPS): OAuth sets the cookie on an API top-level
  // visit, but /auth/me is called from the SPA — different partition → 401.
  return {
    path: "/" as const,
    httpOnly: true,
    secure: true,
    sameSite: "None" as const,
    maxAge,
  };
}

function getClearCookieOpts() {
  const opts = getSessionCookieOpts();
  return {
    path: opts.path,
    secure: opts.secure,
    sameSite: opts.sameSite,
  };
}

/** Lax so Google → API top-level callback still sends the cookie. */
function getOAuthStateCookieOpts() {
  const secure = !(isDev && !env.COOKIE_SECURE);
  return {
    path: "/" as const,
    httpOnly: true,
    secure,
    sameSite: "Lax" as const,
    maxAge: 10 * 60,
  };
}

function getClearOAuthStateCookieOpts() {
  const opts = getOAuthStateCookieOpts();
  return {
    path: opts.path,
    secure: opts.secure,
    sameSite: opts.sameSite,
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
  deleteCookie(c, OAUTH_STATE_COOKIE, getClearOAuthStateCookieOpts());
}

export function readOAuthStateCookie(c: Context): string | undefined {
  return getCookie(c, OAUTH_STATE_COOKIE);
}

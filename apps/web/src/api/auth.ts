import type { UserType } from "@myTypes/index";

import { api, getApiBaseUrl } from "./client";
import { unwrap, unwrapData } from "./http";
import { toLegacyUser } from "./mappers";
import type { ApiUser } from "./types";

export async function createUserAccount(
  email: string,
  password: string,
  name: string
): Promise<UserType> {
  const res = await api.auth.signup.$post({
    json: { email, password, name },
  });
  const user = await unwrapData<ApiUser>(res);
  return toLegacyUser(user);
}

export async function createUserSession(
  email: string,
  password: string
): Promise<{ userId: string }> {
  const res = await api.auth.login.$post({
    json: { email, password },
  });
  const user = await unwrapData<ApiUser>(res);
  return { userId: user.id };
}

export async function getUserAccount(): Promise<UserType> {
  const res = await api.auth.me.$get();
  const user = await unwrapData<ApiUser>(res);
  return toLegacyUser(user);
}

export async function deleteSession(): Promise<void> {
  const res = await api.auth.logout.$post();
  await unwrap(res);
}

export function signInWithOAuth(providerName: "facebook" | "google") {
  if (providerName !== "google") {
    throw new Error("Only Google OAuth is supported");
  }
  window.location.assign(`${getApiBaseUrl()}/auth/oauth/google`);
}

export async function updateUserName(name: string): Promise<UserType> {
  const res = await api.auth.me.$patch({
    json: { name },
  });
  const user = await unwrapData<ApiUser>(res);
  return toLegacyUser(user);
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await api.auth["forgot-password"].$post({
    json: { email },
  });
  await unwrap(res);
}

export async function resetPassword(
  userId: string,
  token: string,
  password: string
): Promise<void> {
  const res = await api.auth["reset-password"].$post({
    json: { userId, token, password },
  });
  await unwrap(res);
}

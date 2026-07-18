import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "../db/index.js";
import { oauthAccounts, users, type User } from "../db/schema/index.js";
import { env } from "../env.js";
import { sendEmail } from "../common/utils/email.js";
import {
  consumeAuthToken,
  createAuthToken,
} from "../common/utils/auth-token.js";
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "../common/utils/password.js";
import {
  createSession,
  deleteSessionByToken,
  deleteSessionsByUserId,
} from "../common/utils/session.js";
import { verifyAppwritePassword } from "../lib/appwrite.js";

export async function signup(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: User; sessionToken: string }> {
  const email = input.email.toLowerCase();
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing[0]) {
    throw new HTTPException(409, { message: "Email already registered" });
  }

  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({
      email,
      name: input.name,
      passwordHash,
      passwordMigrated: true,
      isVerified: false,
    })
    .returning();

  const sessionToken = await createSession(user.id);
  void sendEmail("welcome", {
    to: user.email,
    data: { name: user.name },
  });

  return { user, sessionToken };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ user: User; sessionToken: string }> {
  const email = input.email.toLowerCase();
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  let user = rows[0];

  if (!user) {
    throw new HTTPException(401, { message: "Invalid email or password" });
  }

  let ok = false;
  if (user.passwordMigrated && user.passwordHash) {
    ok = await verifyPassword(user.passwordHash, input.password);
  } else {
    ok = await verifyAppwritePassword(email, input.password);
    if (ok) {
      const passwordHash = await hashPassword(input.password);
      const [updated] = await db
        .update(users)
        .set({
          passwordHash,
          passwordMigrated: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning();
      user = updated;
    }
  }

  if (!ok) {
    throw new HTTPException(401, { message: "Invalid email or password" });
  }

  const sessionToken = await createSession(user.id);
  return { user, sessionToken };
}

export async function logout(sessionToken: string | undefined): Promise<void> {
  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
  }
}

export async function updateName(
  userId: string,
  name: string
): Promise<User> {
  const [updated] = await db
    .update(users)
    .set({ name, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return updated;
}

export async function forgotPassword(email: string): Promise<void> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  const user = rows[0];

  if (!user) return;

  const token = await createAuthToken(user.id, "password_reset");
  const resetUrl = `${env.FRONTEND_ORIGIN}/reset-password?userId=${user.id}&token=${token}`;
  void sendEmail("reset-email", {
    to: user.email,
    data: { name: user.name, resetUrl },
  });
}

export async function resetPassword(input: {
  userId: string;
  token: string;
  password: string;
}): Promise<void> {
  const valid = await consumeAuthToken(
    input.userId,
    "password_reset",
    input.token
  );
  if (!valid) {
    throw new HTTPException(400, { message: "Invalid or expired token" });
  }

  const passwordHash = await hashPassword(input.password);
  await db
    .update(users)
    .set({
      passwordHash,
      passwordMigrated: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId));

  await deleteSessionsByUserId(input.userId);
}

export function beginGoogleOAuth(): { url: string; state: string } {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    throw new HTTPException(500, { message: "Google OAuth not configured" });
  }

  const state = generateToken(24);
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    state,
  };
}

export type GoogleOAuthResult =
  | { status: "error"; error: string }
  | { status: "success"; user: User; sessionToken: string };

export async function completeGoogleOAuth(
  code: string | undefined
): Promise<GoogleOAuthResult> {
  if (!code || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return { status: "error", error: "oauth" };
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return { status: "error", error: "oauth_token" };
  }

  const tokens = (await tokenRes.json()) as { access_token: string };
  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { authorization: `Bearer ${tokens.access_token}` },
    }
  );
  if (!profileRes.ok) {
    return { status: "error", error: "oauth_profile" };
  }

  const profile = (await profileRes.json()) as {
    id: string;
    email: string;
    name: string;
  };

  const linked = await db
    .select()
    .from(oauthAccounts)
    .where(
      and(
        eq(oauthAccounts.provider, "google"),
        eq(oauthAccounts.providerUserId, profile.id)
      )
    )
    .limit(1);

  let user: User | null = null;

  if (linked[0]) {
    user =
      (
        await db
          .select()
          .from(users)
          .where(eq(users.id, linked[0].userId))
          .limit(1)
      )[0] ?? null;
    if (!user) {
      return { status: "error", error: "oauth" };
    }
  } else {
    const email = profile.email.toLowerCase();
    const existing =
      (
        await db.select().from(users).where(eq(users.email, email)).limit(1)
      )[0] ?? null;

    if (existing) {
      user = existing;
      if (!user.isVerified) {
        const [updated] = await db
          .update(users)
          .set({ isVerified: true, updatedAt: new Date() })
          .where(eq(users.id, user.id))
          .returning();
        user = updated;
      }
    } else {
      const [created] = await db
        .insert(users)
        .values({
          email,
          name: profile.name || email,
          passwordHash: null,
          passwordMigrated: true,
          isVerified: true,
        })
        .returning();
      user = created;
    }

    await db
      .insert(oauthAccounts)
      .values({
        userId: user.id,
        provider: "google",
        providerUserId: profile.id,
      })
      .onConflictDoNothing({
        target: [oauthAccounts.provider, oauthAccounts.providerUserId],
      });
  }

  const sessionToken = await createSession(user.id);
  return { status: "success", user, sessionToken };
}

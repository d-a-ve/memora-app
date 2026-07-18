import { and, eq, gt } from "drizzle-orm";

import { db } from "../../db/index.js";
import { sessions, users, type User } from "../../db/schema/index.js";
import { env } from "../../env.js";
import { generateToken, hashToken } from "./password.js";

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + env.SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return token;
}

export async function getUserBySessionToken(
  token: string
): Promise<User | null> {
  const tokenHash = hashToken(token);
  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date()))
    )
    .limit(1);

  return rows[0]?.user ?? null;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function deleteSessionsByUserId(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

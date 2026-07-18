import { and, eq, gt } from "drizzle-orm";

import { db } from "../../db/index.js";
import { authTokens } from "../../db/schema/index.js";
import { generateToken, hashToken } from "./password.js";

export type AuthTokenType = "password_reset" | "email_verify";

const TOKEN_TTL_MS = 15 * 60 * 1000;

export async function createAuthToken(
  userId: string,
  type: AuthTokenType
): Promise<string> {
  const token = generateToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.transaction(async (tx) => {
    await tx
      .delete(authTokens)
      .where(and(eq(authTokens.userId, userId), eq(authTokens.type, type)));
    await tx.insert(authTokens).values({
      userId,
      type,
      tokenHash,
      expiresAt,
    });
  });

  return token;
}

export async function consumeAuthToken(
  userId: string,
  type: AuthTokenType,
  token: string
): Promise<boolean> {
  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.userId, userId),
        eq(authTokens.type, type),
        eq(authTokens.tokenHash, tokenHash),
        gt(authTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  const row = rows[0];
  if (!row) return false;

  await db.delete(authTokens).where(eq(authTokens.id, row.id));
  return true;
}

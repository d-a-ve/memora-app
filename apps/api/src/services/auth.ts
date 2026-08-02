import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import {
	consumeAuthToken,
	createAuthToken,
} from "../common/utils/auth-token.js";
import { sendEmail } from "../common/utils/email.js";
import { logger } from "../common/utils/logger.js";
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
import { db } from "../db/index.js";
import { oauthAccounts, users, type User } from "../db/schema/index.js";
import { env } from "../env.js";
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
		logger.warn("Signup failed", { reason: "emailAlreadyRegistered" });
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

	logger.info("User signed up", { userId: user.id });
	return { user, sessionToken };
}

export async function login(input: {
	email: string;
	password: string;
}): Promise<{ user: User; sessionToken: string }> {
	const email = input.email.toLowerCase();
	const rows = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);
	let user = rows[0];

	if (!user) {
		logger.warn("Login failed", { reason: "userNotFound" });
		throw new HTTPException(401, { message: "Invalid email or password" });
	}

	let ok = false;
	let passwordSource: "local" | "appwrite" = "local";
	if (user.passwordMigrated && user.passwordHash) {
		ok = await verifyPassword(user.passwordHash, input.password);
	} else {
		passwordSource = "appwrite";
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
			logger.info("Password migrated from Appwrite", {
				userId: user.id,
				appwriteUserId: user.appwriteUserId ?? undefined,
			});
		}
	}

	if (!ok) {
		logger.warn("Login failed", {
			userId: user.id,
			reason: "invalidPassword",
			passwordSource,
		});
		throw new HTTPException(401, { message: "Invalid email or password" });
	}

	const sessionToken = await createSession(user.id);
	logger.info("User logged in", { userId: user.id, passwordSource });
	return { user, sessionToken };
}

export async function logout(sessionToken: string | undefined): Promise<void> {
	if (sessionToken) {
		await deleteSessionByToken(sessionToken);
		logger.info("User logged out");
		return;
	}
	logger.info("Logout skipped", { reason: "noSession" });
}

export async function updateName(userId: string, name: string): Promise<User> {
	const [updated] = await db
		.update(users)
		.set({ name, updatedAt: new Date() })
		.where(eq(users.id, userId))
		.returning();
	logger.info("User name updated", { userId });
	return updated;
}

export async function forgotPassword(email: string): Promise<void> {
	const rows = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toLowerCase()))
		.limit(1);
	const user = rows[0];

	if (!user) {
		logger.info("Forgot password skipped", { reason: "userNotFound" });
		return;
	}

	const token = await createAuthToken(user.id, "password_reset");
	const resetUrl = `${env.FRONTEND_URL}/reset-password?userId=${user.id}&token=${token}`;
	void sendEmail("reset-email", {
		to: user.email,
		data: { name: user.name, resetUrl },
	});
	logger.info("Password reset requested", { userId: user.id });
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
		logger.warn("Password reset failed", {
			userId: input.userId,
			reason: "invalidOrExpiredToken",
		});
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
	logger.info("Password reset completed", { userId: input.userId });
}

export function beginGoogleOAuth(): { url: string; state: string } {
	if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
		logger.error("Google OAuth not configured");
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

	logger.info("Google OAuth started");
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
		if (!code) {
			logger.warn("Google OAuth failed", { reason: "missingCode" });
		} else {
			logger.error("Google OAuth not configured", { reason: "missingConfig" });
		}
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
		logger.error("Google OAuth token exchange failed", {
			statusCode: tokenRes.status,
			statusText: tokenRes.statusText,
			googleError: await tokenRes.text(),
		});
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
		logger.error("Google OAuth profile fetch failed", {
			statusCode: profileRes.status,
			statusText: profileRes.statusText,
			googleError: await profileRes.text(),
		});
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
	let oauthPath: "linked" | "existingEmail" | "created" = "linked";

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
			logger.error("Google OAuth linked account missing user", {
				providerUserId: profile.id,
			});
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
			oauthPath = "existingEmail";
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
			oauthPath = "created";
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
	logger.info("Google OAuth completed", {
		userId: user.id,
		oauthPath,
	});
	return { status: "success", user, sessionToken };
}

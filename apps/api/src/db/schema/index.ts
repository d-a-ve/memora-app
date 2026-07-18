import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  appwriteUserId: text().unique(),
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text(),
  passwordMigrated: boolean().notNull().default(false),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text().notNull().unique(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const authTokens = pgTable("otps", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text().notNull(),
  tokenHash: text("otp_hash").notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull(),
    providerUserId: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.provider, t.providerUserId)]
);

export const birthdays = pgTable("birthdays", {
  id: uuid().primaryKey().defaultRandom(),
  appwriteBirthdayId: text().unique(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  personName: text().notNull(),
  personBirthday: date().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const dataMigrations = pgTable("data_migrations", {
  id: text().primaryKey(),
  completedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  meta: jsonb().$type<Record<string, unknown>>(),
  conflictIds: jsonb().$type<string[]>().notNull().default([]),
  dedupedBirthdayIds: jsonb().$type<string[]>().notNull().default([]),
});

export const cronRuns = pgTable("cron_runs", {
  id: uuid().primaryKey().defaultRandom(),
  idempotencyKey: text().notNull().unique(),
  datesUpdated: integer().notNull(),
  emailsSent: integer().notNull(),
  courierMessageIds: jsonb().$type<string[]>().notNull().default([]),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type AuthToken = typeof authTokens.$inferSelect;
export type OauthAccount = typeof oauthAccounts.$inferSelect;
export type Birthday = typeof birthdays.$inferSelect;
export type DataMigration = typeof dataMigrations.$inferSelect;
export type CronRun = typeof cronRuns.$inferSelect;

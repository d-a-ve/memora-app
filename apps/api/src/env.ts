import { config } from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "../.env") });
config(); // also allow process cwd .env override

const optionalUrl = z.union([z.string().url(), z.literal("")]).default("");

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(8000),
    DATABASE_URL: z.string().min(1),

    FRONTEND_ORIGIN: z.string().url(),
    COOKIE_SECURE: z
      .string()
      .optional()
      .default("true")
      .transform((v) => v === "true"),
    SESSION_DAYS: z.coerce.number().default(30),

    CRON_SECRET: z.string().min(1),
    CRON_TZ: z.string().default("UTC"),

    APPWRITE_ENDPOINT: z.string().default("https://cloud.appwrite.io/v1"),
    APPWRITE_PROJECT_ID: z.string().default(""),
    APPWRITE_API_KEY: z.string().default(""),
    APPWRITE_DB_ID: z.string().default(""),
    APPWRITE_BIRTHDAYS_COLLECTION_ID: z.string().default(""),

    COURIER_AUTH_TOKEN: z.string().default(""),
    DEVELOPER_EMAIL: z.string().default(""),

    GOOGLE_CLIENT_ID: z.string().default(""),
    GOOGLE_CLIENT_SECRET: z.string().default(""),
    GOOGLE_REDIRECT_URI: optionalUrl,

    API_BASE_URL: z.string().url().default("http://localhost:8000"),
  })
  .transform((data) => ({
    ...data,
    GOOGLE_REDIRECT_URI:
      data.GOOGLE_REDIRECT_URI ||
      `${data.API_BASE_URL.replace(/\/$/, "")}/auth/oauth/google/callback`,
  }));

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export const isDev = env.NODE_ENV === "development";

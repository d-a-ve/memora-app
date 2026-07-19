import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "../env.js";

const migrationsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "../migrations"
);

export async function runMigrations() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle({ client, casing: "snake_case" });

  try {
    await migrate(db, { migrationsFolder });
    console.log("Migrations applied");
  } finally {
    await client.end();
  }
}

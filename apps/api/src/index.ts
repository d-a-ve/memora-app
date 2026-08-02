import { serve } from "@hono/node-server";

import { app } from "./app.js";
import { logger } from "./common/utils/logger.js";
import { runMigrations } from "./db/run-migrations.js";
import { env } from "./env.js";
import { runAppwriteMigration } from "./scripts/migrate-appwrite.js";

await runMigrations();

if (env.MIGRATE_APPWRITE) {
  await runAppwriteMigration();
}

const baseUrl = env.API_BASE_URL.replace(/\/$/, "");

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => {
    logger.info("Memora API listening", {
      baseUrl,
      port: env.PORT,
      docsUrl: `${baseUrl}/docs`,
    });
  }
);

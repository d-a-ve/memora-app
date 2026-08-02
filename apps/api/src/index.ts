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

const server = serve(
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

const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info("Shutting down", { signal });

  const forceTimer = setTimeout(() => {
    logger.error("Forced shutdown after timeout", {
      timeoutMs: SHUTDOWN_TIMEOUT_MS,
    });
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceTimer.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  } catch (err) {
    logger.error("Error closing HTTP server", {
      errorName: err instanceof Error ? err.name : "Unknown",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
  }

  clearTimeout(forceTimer);
  process.exit(0);
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

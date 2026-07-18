import { serve } from "@hono/node-server";

import { app } from "./app.js";
import { runMigrations } from "./db/run-migrations.js";
import { env } from "./env.js";

await runMigrations();

const baseUrl = env.API_BASE_URL.replace(/\/$/, "");

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => {
    console.log(`Memora API listening on ${baseUrl}`);
    console.log(`Docs: ${baseUrl}/docs`);
  }
);

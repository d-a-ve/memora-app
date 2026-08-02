import * as Sentry from "@sentry/hono/node";

import { shouldSendSentryLogs } from "./common/utils/sentry-logs-enabled.js";

Sentry.init({
	dsn: "https://35c4933fd236a1e12c4a4f46f1e7f0c5@o4511615062769664.ingest.us.sentry.io/4511841981497344",
	environment: process.env.NODE_ENV ?? "development",
	enableLogs: true,
	integrations: [
		Sentry.consoleLoggingIntegration({
			levels: ["log", "info", "warn", "error"],
		}),
	],
	beforeSendLog: (log) => {
		if (!shouldSendSentryLogs()) {
			return null;
		}
		return log;
	},
	dataCollection: {
		// To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
		// https://docs.sentry.io/platforms/javascript/guides/hono/configuration/options/#dataCollection
		userInfo: false,
		httpBodies: [],
	},
});

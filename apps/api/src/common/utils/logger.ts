import * as Sentry from "@sentry/hono/node";

import { shouldSendSentryLogs } from "./sentry-logs-enabled.js";

type LogAttribute = string | number | boolean;
type LogAttributes = Record<string, LogAttribute | undefined>;

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

function compactAttributes(
	attributes?: LogAttributes
): Record<string, LogAttribute> | undefined {
	if (!attributes) return undefined;

	const compact: Record<string, LogAttribute> = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (value !== undefined) {
			compact[key] = value;
		}
	}

	return Object.keys(compact).length > 0 ? compact : undefined;
}

function writeToConsole(
	level: LogLevel,
	message: string,
	attributes?: Record<string, LogAttribute>
): void {
	const payload = attributes ? [message, attributes] : [message];

	switch (level) {
		case "trace":
		case "debug":
			console.debug(...payload);
			break;
		case "info":
			console.info(...payload);
			break;
		case "warn":
			console.warn(...payload);
			break;
		case "error":
		case "fatal":
			console.error(...payload);
			break;
	}
}

function log(
	level: LogLevel,
	message: string,
	attributes?: LogAttributes
): void {
	const compact = compactAttributes(attributes);

	if (!shouldSendSentryLogs()) {
		writeToConsole(level, message, compact);
		return;
	}

	Sentry.logger[level](message, compact);
}

export const logger = {
	trace: (message: string, attributes?: LogAttributes) =>
		log("trace", message, attributes),
	debug: (message: string, attributes?: LogAttributes) =>
		log("debug", message, attributes),
	info: (message: string, attributes?: LogAttributes) =>
		log("info", message, attributes),
	warn: (message: string, attributes?: LogAttributes) =>
		log("warn", message, attributes),
	error: (message: string, attributes?: LogAttributes) =>
		log("error", message, attributes),
	fatal: (message: string, attributes?: LogAttributes) =>
		log("fatal", message, attributes),
};

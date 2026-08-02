/**
 * Whether application logs should be sent to Sentry.
 * - SENTRY_ENABLE_LOGS=true  → always send
 * - SENTRY_ENABLE_LOGS=false → never send (console only)
 * - unset → send only when NODE_ENV=production
 */
export function shouldSendSentryLogs(): boolean {
	const flag = process.env.SENTRY_ENABLE_LOGS;
	if (flag === "true") return true;
	if (flag === "false") return false;
	return process.env.NODE_ENV === "production";
}

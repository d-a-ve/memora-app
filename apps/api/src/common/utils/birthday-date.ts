import { formatInTimeZone } from "date-fns-tz";

import { env } from "../../env.js";

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True when `YYYY-MM-DD` is a real calendar date. */
export function isValidCalendarDate(value: string): boolean {
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

/**
 * Normalize a birth date to the next MM-DD occurrence in `CRON_TZ`
 * (today or a future date), matching cron reminder semantics.
 */
export function toNextOccurrenceDate(
  value: string,
  now = new Date(),
  timeZone = env.CRON_TZ
): string {
  const m = DATE_RE.exec(value);
  if (!m || !isValidCalendarDate(value)) {
    throw new Error(`Invalid calendar date: ${value}`);
  }

  const mm = m[2];
  const dd = m[3];
  const todayStr = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
  const year = Number(todayStr.slice(0, 4));

  const thisYear = occurrenceInYear(year, mm, dd);
  if (thisYear >= todayStr) return thisYear;
  return occurrenceInYear(year + 1, mm, dd);
}

function occurrenceInYear(year: number, mm: string, dd: string): string {
  const candidate = `${year}-${mm}-${dd}`;
  if (isValidCalendarDate(candidate)) return candidate;
  // Feb 29 → Feb 28 in non-leap years
  if (mm === "02" && dd === "29") return `${year}-02-28`;
  return candidate;
}

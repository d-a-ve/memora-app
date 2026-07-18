import { eq, sql } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";

import { sendEmail } from "../common/utils/email.js";
import { db } from "../db/index.js";
import { birthdays, cronRuns, users } from "../db/schema/index.js";
import { env } from "../env.js";

function arrayToCommaSeparatedString(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export async function runDailyCron() {
  const today = formatInTimeZone(new Date(), env.CRON_TZ, "yyyy-MM-dd");
  const idempotencyKey = `daily:${today}`;

  const [claimed] = await db
    .insert(cronRuns)
    .values({
      idempotencyKey,
      datesUpdated: 0,
      emailsSent: 0,
      courierMessageIds: [],
    })
    .onConflictDoNothing({ target: cronRuns.idempotencyKey })
    .returning();

  if (!claimed) {
    const [existing] = await db
      .select()
      .from(cronRuns)
      .where(eq(cronRuns.idempotencyKey, idempotencyKey))
      .limit(1);
    return { run: existing, alreadyRan: true };
  }

  const rolled = await db.execute<{ id: string }>(sql`
    UPDATE birthdays
    SET
      person_birthday = (person_birthday + INTERVAL '1 year')::date,
      updated_at = NOW()
    WHERE person_birthday < ${today}::date
    RETURNING id
  `);

  const datesUpdated = rolled.count ?? rolled.length ?? 0;

  const todays = await db
    .select({
      userId: birthdays.userId,
      personName: birthdays.personName,
      email: users.email,
      name: users.name,
    })
    .from(birthdays)
    .innerJoin(users, eq(birthdays.userId, users.id))
    .where(eq(birthdays.personBirthday, today));

  type Group = {
    email: string;
    name: string;
    birthdays: string[];
  };
  const byUser = new Map<string, Group>();
  for (const row of todays) {
    const g = byUser.get(row.userId);
    if (!g) {
      byUser.set(row.userId, {
        email: row.email,
        name: row.name,
        birthdays: [row.personName],
      });
    } else {
      g.birthdays.push(row.personName);
    }
  }

  const courierMessageIds = (
    await Promise.all(
      [...byUser.values()].map((group) =>
        sendEmail("birthday-reminder", {
          to: group.email,
          data: {
            recipientName: group.name,
            birthdayNames: arrayToCommaSeparatedString(group.birthdays),
          },
        })
      )
    )
  ).filter((id): id is string => Boolean(id));

  const [run] = await db
    .update(cronRuns)
    .set({
      datesUpdated,
      emailsSent: courierMessageIds.length,
      courierMessageIds,
    })
    .where(eq(cronRuns.id, claimed.id))
    .returning();

  return { run, alreadyRan: false };
}

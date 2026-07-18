import { and, asc, count, eq, sql, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { toNextOccurrenceDate } from "../common/utils/birthday-date.js";
import { db } from "../db/index.js";
import { birthdays, type Birthday } from "../db/schema/index.js";

function escapeIlikePattern(value: string): string {
  return value.replace(/([\\%_])/g, "\\$1");
}

export async function listBirthdays(input: {
  userId: string;
  limit: number;
  page: number;
  search?: string;
}): Promise<{
  documents: Birthday[];
  totalCount: number;
  totalPages: number;
}> {
  const offset = (input.page - 1) * input.limit;
  const filters: SQL[] = [eq(birthdays.userId, input.userId)];

  if (input.search?.trim()) {
    const pattern = `%${escapeIlikePattern(input.search.trim())}%`;
    filters.push(sql`${birthdays.personName} ILIKE ${pattern} ESCAPE '\\'`);
  }

  const where = and(...filters);

  const [[{ value: total }], documents] = await Promise.all([
    db.select({ value: count() }).from(birthdays).where(where),
    db
      .select()
      .from(birthdays)
      .where(where)
      .orderBy(asc(birthdays.personBirthday))
      .limit(input.limit)
      .offset(offset),
  ]);

  const totalCount = Number(total);
  const totalPages = Math.max(1, Math.ceil(totalCount / input.limit));

  return { documents, totalCount, totalPages };
}

export async function createBirthday(input: {
  userId: string;
  name: string;
  birthday: string;
}): Promise<Birthday> {
  const [row] = await db
    .insert(birthdays)
    .values({
      userId: input.userId,
      personName: input.name,
      personBirthday: toNextOccurrenceDate(input.birthday),
    })
    .returning();
  return row;
}

export async function updateBirthday(input: {
  userId: string;
  id: string;
  name?: string;
  birthday?: string;
}): Promise<Birthday> {
  const existing = await db
    .select()
    .from(birthdays)
    .where(and(eq(birthdays.id, input.id), eq(birthdays.userId, input.userId)))
    .limit(1);

  if (!existing[0]) {
    throw new HTTPException(404, { message: "Birthday not found" });
  }

  const [row] = await db
    .update(birthdays)
    .set({
      personName: input.name ?? existing[0].personName,
      personBirthday: input.birthday
        ? toNextOccurrenceDate(input.birthday)
        : existing[0].personBirthday,
      updatedAt: new Date(),
    })
    .where(eq(birthdays.id, input.id))
    .returning();

  return row;
}

export async function deleteBirthday(
  userId: string,
  id: string
): Promise<void> {
  const deleted = await db
    .delete(birthdays)
    .where(and(eq(birthdays.id, id), eq(birthdays.userId, userId)))
    .returning({ id: birthdays.id });

  if (!deleted[0]) {
    throw new HTTPException(404, { message: "Birthday not found" });
  }
}

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "../src/db/index.js";
import {
  birthdays,
  dataMigrations,
  users,
} from "../src/db/schema/index.js";
import {
  listAllAppwriteBirthdays,
  listAllAppwriteUsers,
} from "../src/lib/appwrite.js";

const MIGRATION_ID = "appwrite_import";

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractMmDd(isoDate: string): { mm: string; dd: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!m) return null;
  return { mm: m[2], dd: m[3] };
}

function yearForMmDd(mm: string, dd: string, now = new Date()): number {
  const year = now.getFullYear();
  const candidate = new Date(year, Number(mm) - 1, Number(dd));
  const today = new Date(year, now.getMonth(), now.getDate());
  return candidate >= today ? year : year + 1;
}

function earlierDate(a: Date, b: Date): Date {
  return a <= b ? a : b;
}

function laterDate(a: Date, b: Date): Date {
  return a >= b ? a : b;
}

async function main() {
  const existing = await db
    .select()
    .from(dataMigrations)
    .where(eq(dataMigrations.id, MIGRATION_ID))
    .limit(1);

  if (existing[0]) {
    console.log("Appwrite import already completed at", existing[0].completedAt);
    process.exit(0);
  }

  console.log("Fetching Appwrite users…");
  const awUsers = await listAllAppwriteUsers();
  console.log(`Fetched ${awUsers.length} users`);

  console.log("Fetching Appwrite birthdays…");
  const awBirthdays = await listAllAppwriteBirthdays();
  console.log(`Fetched ${awBirthdays.length} birthday docs`);

  const userRows = awUsers.map((u) => ({
    id: randomUUID(),
    appwriteUserId: u.$id,
    email: u.email.toLowerCase(),
    name: u.name || u.email,
    passwordHash: null as string | null,
    passwordMigrated: false,
    isVerified: u.emailVerification,
    createdAt: new Date(u.$createdAt),
    updatedAt: new Date(u.$updatedAt),
  }));

  const appwriteToLocal = new Map(
    userRows.map((u) => [u.appwriteUserId!, u.id] as const)
  );

  type Deduped = {
    appwriteBirthdayId: string;
    userId: string;
    personName: string;
    mm: string;
    dd: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const deduped = new Map<string, Deduped>();
  const conflictIds = new Set<string>();
  const dedupedBirthdayIds: string[] = [];
  let orphaned = 0;

  for (const doc of awBirthdays) {
    const localUserId = appwriteToLocal.get(doc.user_id);
    if (!localUserId) {
      orphaned += 1;
      continue;
    }
    const mmdd = extractMmDd(doc.person_birthday);
    if (!mmdd) continue;

    const createdAt = new Date(doc.$createdAt);
    const updatedAt = new Date(doc.$updatedAt);
    const key = `${doc.user_id}::${normalizeName(doc.person_name)}`;
    const prev = deduped.get(key);
    if (prev) {
      dedupedBirthdayIds.push(prev.appwriteBirthdayId);
      if (prev.mm !== mmdd.mm || prev.dd !== mmdd.dd) {
        conflictIds.add(prev.appwriteBirthdayId);
        conflictIds.add(doc.$id);
        console.warn(
          `MM-DD conflict for ${doc.person_name} (user ${doc.user_id}): ${prev.mm}-${prev.dd} vs ${mmdd.mm}-${mmdd.dd}`
        );
      }
      deduped.set(key, {
        appwriteBirthdayId: doc.$id,
        userId: localUserId,
        personName: doc.person_name.trim(),
        mm: mmdd.mm,
        dd: mmdd.dd,
        createdAt: earlierDate(prev.createdAt, createdAt),
        updatedAt: laterDate(prev.updatedAt, updatedAt),
      });
      continue;
    }

    deduped.set(key, {
      appwriteBirthdayId: doc.$id,
      userId: localUserId,
      personName: doc.person_name.trim(),
      mm: mmdd.mm,
      dd: mmdd.dd,
      createdAt,
      updatedAt,
    });
  }

  const birthdayRows = [...deduped.values()].map((d) => {
    const year = yearForMmDd(d.mm, d.dd);
    return {
      id: randomUUID(),
      appwriteBirthdayId: d.appwriteBirthdayId,
      userId: d.userId,
      personName: d.personName,
      personBirthday: `${year}-${d.mm}-${d.dd}`,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  });

  console.log(
    `Prepared ${userRows.length} users, ${birthdayRows.length} birthdays (orphaned: ${orphaned}, deduped out: ${dedupedBirthdayIds.length}, conflicts: ${conflictIds.size})`
  );

  await db.transaction(async (tx) => {
    if (userRows.length) {
      await tx.insert(users).values(userRows);
    }
    if (birthdayRows.length) {
      await tx.insert(birthdays).values(birthdayRows);
    }
    await tx.insert(dataMigrations).values({
      id: MIGRATION_ID,
      conflictIds: [...conflictIds],
      dedupedBirthdayIds,
      meta: {
        users: userRows.length,
        birthdaysRaw: awBirthdays.length,
        birthdaysKept: birthdayRows.length,
        orphaned,
        conflictCount: conflictIds.size,
        dedupedOutCount: dedupedBirthdayIds.length,
      },
    });
  });

  console.log("Import committed.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

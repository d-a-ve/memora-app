import { Account, Client, Databases, Query, Users } from "node-appwrite";

import { env } from "../env.js";

function serverClient() {
  return new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
}

export async function verifyAppwritePassword(
  email: string,
  password: string
): Promise<boolean> {
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID);

  const account = new Account(client);
  try {
    await account.createEmailPasswordSession(email, password);
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.warn("Failed to delete Appwrite verify session:", err);
    }
    return true;
  } catch {
    return false;
  }
}

export type AppwriteUser = {
  $id: string;
  email: string;
  name: string;
  emailVerification: boolean;
  $createdAt: string;
  $updatedAt: string;
};

export async function listAllAppwriteUsers(): Promise<AppwriteUser[]> {
  const users = new Users(serverClient());
  const all: AppwriteUser[] = [];
  let offset = 0;
  const limit = 100;

  for (;;) {
    const page = await users.list([Query.limit(limit), Query.offset(offset)]);
    all.push(
      ...page.users.map((u) => ({
        $id: u.$id,
        email: u.email,
        name: u.name,
        emailVerification: u.emailVerification,
        $createdAt: u.$createdAt,
        $updatedAt: u.$updatedAt,
      }))
    );
    if (page.users.length < limit) break;
    offset += limit;
  }

  return all;
}

export type AppwriteBirthdayDoc = {
  $id: string;
  user_id: string;
  person_name: string;
  person_birthday: string;
  user_email?: string;
  hasBirthdayDateUpdated?: boolean;
  $createdAt: string;
  $updatedAt: string;
};

export async function listAllAppwriteBirthdays(): Promise<
  AppwriteBirthdayDoc[]
> {
  const databases = new Databases(serverClient());
  const all: AppwriteBirthdayDoc[] = [];
  let offset = 0;
  const limit = 100;

  for (;;) {
    const page = await databases.listDocuments(
      env.APPWRITE_DB_ID,
      env.APPWRITE_BIRTHDAYS_COLLECTION_ID,
      [Query.limit(limit), Query.offset(offset)]
    );
    all.push(
      ...page.documents.map((d) => ({
        $id: d.$id,
        user_id: String(d.user_id),
        person_name: String(d.person_name),
        person_birthday: String(d.person_birthday),
        user_email: d.user_email ? String(d.user_email) : undefined,
        hasBirthdayDateUpdated: Boolean(d.hasBirthdayDateUpdated),
        $createdAt: d.$createdAt,
        $updatedAt: d.$updatedAt,
      }))
    );
    if (page.documents.length < limit) break;
    offset += limit;
  }

  return all;
}

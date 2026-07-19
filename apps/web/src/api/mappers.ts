import type { birthdayDataType, documentType, UserType } from "@myTypes/index";

import type { ApiBirthday, ApiUser } from "./types";

/** Map API user → legacy Appwrite-shaped user used across the UI. */
export function toLegacyUser(user: ApiUser): UserType {
  return {
    $id: user.id,
    $createdAt: user.createdAt,
    $updatedAt: user.updatedAt,
    name: user.name,
    email: user.email,
    emailVerification: user.isVerified,
    registration: user.createdAt,
    status: true,
    passwordUpdate: "",
    phone: "",
    phoneVerification: false,
    prefs: {},
  };
}

/** Map API birthday → legacy Appwrite document shape used across the UI. */
export function toLegacyBirthdayDoc(birthday: ApiBirthday): documentType {
  return {
    $id: birthday.id,
    $collectionId: "",
    $databaseId: "",
    $createdAt: birthday.createdAt,
    $updatedAt: birthday.updatedAt,
    $permissions: [],
    person_name: birthday.name,
    person_birthday: birthday.birthday,
  };
}

export function toLegacyBirthdayList(
  documents: ApiBirthday[],
  total: number
): birthdayDataType {
  return {
    total,
    documents: documents.map(toLegacyBirthdayDoc),
  };
}

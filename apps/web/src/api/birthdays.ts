import type {
  birthdayDataType,
  birthdaysAttrType,
  documentType,
} from "@myTypes/index";

import { api } from "./client";
import { unwrap, unwrapData, unwrapPaginated } from "./http";
import { toLegacyBirthdayDoc, toLegacyBirthdayList } from "./mappers";
import type { ApiBirthday } from "./types";

export async function createDocInBirthdaysCol(
  _docId: string,
  data: {
    person_name: string;
    person_birthday: string;
    user_id?: string;
    user_email?: string;
  }
): Promise<documentType> {
  const res = await api.birthdays.$post({
    json: {
      name: data.person_name,
      birthday: data.person_birthday,
    },
  });
  const birthday = await unwrapData<ApiBirthday>(res);
  return toLegacyBirthdayDoc(birthday);
}

export async function listUserDocFromBirthdaysCol(
  _userId: string | undefined,
  queryLimit = "25"
): Promise<birthdayDataType> {
  const res = await api.birthdays.$get({
    query: {
      limit: Number(queryLimit),
      page: 1,
    },
  });
  const body = await unwrapPaginated<ApiBirthday[]>(res);
  return toLegacyBirthdayList(body.data, body.pagination.total);
}

export async function searchForBirthday({
  name,
  userId: _userId,
}: {
  name: string;
  userId: string;
}): Promise<birthdayDataType | undefined> {
  if (name.length === 0) return;

  const res = await api.birthdays.$get({
    query: {
      search: name,
      limit: 100,
      page: 1,
    },
  });
  const body = await unwrapPaginated<ApiBirthday[]>(res);
  return toLegacyBirthdayList(body.data, body.pagination.total);
}

export async function updateBirthdayDocument(
  docId: string,
  data: { [k in keyof Omit<birthdaysAttrType, "user_id">]?: string }
): Promise<documentType> {
  const res = await api.birthdays[":id"].$patch({
    param: { id: docId },
    json: {
      name: data.person_name,
      birthday: data.person_birthday,
    },
  });
  const birthday = await unwrapData<ApiBirthday>(res);
  return toLegacyBirthdayDoc(birthday);
}

export async function deleteBirthdayDocument(docId: string): Promise<void> {
  const res = await api.birthdays[":id"].$delete({
    param: { id: docId },
  });
  await unwrap(res);
}

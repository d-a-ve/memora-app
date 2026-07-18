import type { Birthday, CronRun, User } from "../schema/index.js";

export type UserDto = {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BirthdayDto = {
  id: string;
  name: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
};

export type CronRunDto = {
  id: string;
  idempotencyKey: string;
  datesUpdated: number;
  emailsSent: number;
  courierMessageIds: string[];
  createdAt: string;
  alreadyRan: boolean;
};

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toBirthdayDto(row: Birthday): BirthdayDto {
  return {
    id: row.id,
    name: row.personName,
    birthday: row.personBirthday,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toCronRunDto(row: CronRun, alreadyRan: boolean): CronRunDto {
  return {
    id: row.id,
    idempotencyKey: row.idempotencyKey,
    datesUpdated: row.datesUpdated,
    emailsSent: row.emailsSent,
    courierMessageIds: row.courierMessageIds ?? [],
    createdAt: row.createdAt.toISOString(),
    alreadyRan,
  };
}

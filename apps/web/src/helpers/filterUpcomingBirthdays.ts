import { isFuture, isToday } from "date-fns";

import { documentType } from "@myTypes/index";

export default function filterUpcomingBirthdaysFromCurrentDate(
  arr: documentType[] | undefined
): documentType[] | undefined {
  if (arr === undefined) return;

  return arr.filter((birthday) => {
    const birthdayDate = new Date(birthday.person_birthday);

    return isToday(birthdayDate) || isFuture(birthdayDate);
  });
}

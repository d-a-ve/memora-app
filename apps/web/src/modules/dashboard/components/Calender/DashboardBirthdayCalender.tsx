import { birthdayDataType } from "@myTypes/index";

import { InlineBirthdayDatePicker } from "../BirthdayDatePicker/InlineBirthdayDatePicker";

export function DashboardBirthdayCalender({
  birthdays,
}: {
  birthdays: birthdayDataType | undefined;
}) {
  const birthdayDates = birthdays?.documents.map(
    (doc) => new Date(doc?.person_birthday)
  );

  return (
    <div>
      <InlineBirthdayDatePicker dates={birthdayDates} />
    </div>
  );
}

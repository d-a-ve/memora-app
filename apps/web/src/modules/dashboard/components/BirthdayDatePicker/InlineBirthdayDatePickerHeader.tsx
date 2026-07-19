import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

import { getMonth } from "date-fns";

import { calenderMonths } from "@constants/index";

import {
  DatePickerHeaderSelector,
  DatePickerHeaderWrapper,
} from "@components/Date";

type InlineBirthdayDatePickerHeaderPropsType = Pick<
  ReactDatePickerCustomHeaderProps,
  "date" | "changeMonth"
>;

export function InlineBirthdayDatePickerHeader({
  date,
  changeMonth,
}: InlineBirthdayDatePickerHeaderPropsType) {
  return (
    <DatePickerHeaderWrapper>
      <div className="flex items-center justify-center gap-2">
        <p className="text-fs--1 font-medium">Birthdays in{"  "}</p>
        <DatePickerHeaderSelector
          selectValue={calenderMonths[getMonth(date)]}
          options={calenderMonths}
          onChangeHandler={({ target: { value } }) =>
            changeMonth(calenderMonths.indexOf(value))
          }
        />
      </div>
    </DatePickerHeaderWrapper>
  );
}

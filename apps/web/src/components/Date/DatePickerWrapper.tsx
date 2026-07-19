import { useState } from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./date-styles.css";

type DatePickerWrapperProps = Omit<
  ReactDatePickerProps,
  | "selected"
  | "onChange"
  | "className"
  | "yearDropdownItemNumber"
  | "showYearDropdown"
  | "dateFormat"
  | "dateFormatCalendar"
  | "fixedHeight"
  | "scrollableYearDropdown"
> & {
  isReadOnly: boolean;
  selectedDate?: Date;
};

export function DatePickerWrapper({
  isReadOnly,
  selectedDate = new Date(),
  ...props
}: DatePickerWrapperProps) {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      readOnly={isReadOnly}
      className="input"
      yearDropdownItemNumber={12}
      showYearDropdown
      dateFormat="dd/MM"
      dateFormatCalendar="LLLL"
      fixedHeight={true}
      scrollableYearDropdown={true}
      {...props}
    />
  );
}

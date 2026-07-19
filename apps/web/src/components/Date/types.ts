import { ChangeEvent, ReactNode } from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

export type DatePickerHeaderPropsType = Omit<
  ReactDatePickerCustomHeaderProps,
  | "monthDate"
  | "customHeaderCount"
  | "decreaseYear"
  | "increaseYear"
  | "prevYearButtonDisabled"
  | "nextYearButtonDisabled"
>;

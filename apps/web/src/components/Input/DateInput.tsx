import { ReactNode } from "react";
import "react-datepicker/dist/react-datepicker.css";

import { getMonth, getYear } from "date-fns";

import range from "@helpers/range";

import { calenderMonths } from "@constants/index";

import {
  DatePickerHeaderSelector,
  DatePickerHeaderWrapper,
  DatePickerIcon,
  DatePickerWrapper,
} from "../Date";

const leftArrow = (
  <svg
    width="12"
    height="16"
    viewBox="0 0 18 32"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.2595 1.15052C17.792 1.68305 17.8405 2.51638 17.4047 3.10361L17.2595 3.27184L4.32085 16.2112L17.2595 29.1505C17.792 29.6831 17.8405 30.5164 17.4047 31.1036L17.2595 31.2718C16.727 31.8044 15.8937 31.8528 15.3064 31.4171L15.1382 31.2718L1.13819 17.2718C0.60566 16.7393 0.557247 15.906 0.992956 15.3188L1.13819 15.1505L15.1382 1.15052C15.724 0.564735 16.6737 0.564735 17.2595 1.15052Z"
      fill="#6e2588"
    />
  </svg>
);

const rightArrow = (
  <svg
    width="12"
    height="16"
    viewBox="0 0 18 32"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.962411 31.1844C0.429878 30.6519 0.381466 29.8186 0.817175 29.2314L0.962411 29.0631L13.9011 16.1238L0.962411 3.18444C0.429878 2.65191 0.381466 1.81858 0.817175 1.23136L0.962411 1.06312C1.49494 0.530586 2.32827 0.482174 2.91549 0.917883L3.08373 1.06312L17.0837 15.0631C17.6163 15.5957 17.6647 16.429 17.229 17.0162L17.0837 17.1844L3.08373 31.1844C2.49794 31.7702 1.5482 31.7702 0.962411 31.1844Z"
      fill="#6e2588"
    />
  </svg>
);

export function DateInput({
  isReadOnly,
  customInput,
  selectedDate,
}: {
  isReadOnly?: boolean;
  customInput?: ReactNode;
  selectedDate?: Date;
}) {
  const years = range(1900, getYear(new Date()) + 1, 1);

  return (
    <DatePickerWrapper
      isReadOnly={isReadOnly || false}
      customInput={customInput}
      selectedDate={selectedDate}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <DatePickerHeaderWrapper className="flex items-center justify-between">
          <div className="flex gap-2">
            <DatePickerHeaderSelector
              selectValue={calenderMonths[getMonth(date)]}
              options={calenderMonths}
              onChangeHandler={({ target: { value } }) =>
                changeMonth(calenderMonths.indexOf(value))
              }
            />
            <DatePickerHeaderSelector
              selectValue={getYear(date)}
              options={years}
              onChangeHandler={({ target: { value } }) =>
                changeYear(Number(value))
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <DatePickerIcon
              clickHandler={decreaseMonth}
              isDisabled={prevMonthButtonDisabled}
            >
              {leftArrow}
            </DatePickerIcon>
            <DatePickerIcon
              clickHandler={increaseMonth}
              isDisabled={nextMonthButtonDisabled}
            >
              {rightArrow}
            </DatePickerIcon>
          </div>
        </DatePickerHeaderWrapper>
      )}
    />
  );
}

import { ChangeEvent } from "react";

type DatePickerHeaderSelectorPropsType = {
  onChangeHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | number[];
  selectValue: number | string;
};

export default function DatePickerHeaderSelector({
  onChangeHandler,
  selectValue,
  options,
}: DatePickerHeaderSelectorPropsType) {
  return (
    <div className="relative">
      <select
        className="text-lg text-center font-medium bg-background/50 px-2 py-1 rounded border border-gray-300 appearance-none focus-ring-visible outline-none focus-visible:ring-offset-0 cursor-pointer"
        value={selectValue}
        onChange={onChangeHandler}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        icn
      </select>
    </div>
  );
}

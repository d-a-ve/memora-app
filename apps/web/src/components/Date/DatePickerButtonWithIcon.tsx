import { ReactNode } from "react";

type DatePickerIconPropsType = {
  clickHandler: () => void;
  isDisabled: boolean;
  children: ReactNode;
};

export default function DatePickerIcon({
  clickHandler,
  isDisabled,
  children,
}: DatePickerIconPropsType) {
  return (
    <button
      type="button"
      className="w-4 outline-none focus-ring-visible focus-visible:ring-offset-0 focus-visible:rounded"
      onClick={clickHandler}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

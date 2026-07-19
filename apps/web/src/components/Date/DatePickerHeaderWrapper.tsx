import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type DatePickerHeaderWrapperPropsType = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: ReactNode;
};

export function DatePickerHeaderWrapper({
  children,
  className,
  ...divProps
}: DatePickerHeaderWrapperPropsType) {
  return (
    <div
      className={`w-[calc(100%-24px)] mx-auto py-2 ${className}`}
      {...divProps}
    >
      {children}
    </div>
  );
}

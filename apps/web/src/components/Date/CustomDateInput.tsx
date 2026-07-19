import { forwardRef, LegacyRef } from "react";

type DateInputPropsType = {
  value: string;
  onClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  id: string;
  type: string;
  name: string;
};

export const CustomDateInput = forwardRef(function DateInput(
  {
    value,
    onClick,
    onChange,
    className,
    id,
    type,
    name,
  }: Partial<DateInputPropsType>,
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  return (
    <input
      name={name || "Date"}
      className={className || "input"}
      value={value}
      onClick={onClick}
      onChange={onChange}
      type={type || "text"}
      id={id}
      required={true}
      ref={ref}
      // value={inputValue}
      // placeholder={placeHolder}
    />
  );
});

// export function DateInput({
// 	id,
// 	className,
// }: {
// 	id: string;
// 	className?: string;
// }) {
// 	return (
// 		<input
// 			name="Date"
// 			className={className || "input"}
// 			type="text"
// 			id={id}
// 			required={true}
// 			// value={inputValue}
// 			// placeholder={placeHolder}
// 		/>
// 	);
// }

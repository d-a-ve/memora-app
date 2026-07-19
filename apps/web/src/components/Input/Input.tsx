import { cn } from "@helpers/cn";

import { InputPropsType } from "./types";

export function Input({
  changeHandler,
  blurHandler,
  labelFor,
  inputType,
  required,
  inputValue,
  placeHolder,
  displayError,
  className,
  disabled,
  inputRef,
}: InputPropsType) {
  return (
    <input
      onChange={changeHandler}
      onBlur={blurHandler}
      name={labelFor}
      className={cn("input", { className, "border-red-500": displayError })}
      type={inputType}
      id={`${labelFor}-input`}
      required={required}
      disabled={disabled}
      value={inputValue}
      placeholder={placeHolder}
      ref={inputRef}
      aria-describedby={displayError ? `${labelFor}-error` : undefined}
    />
  );
}

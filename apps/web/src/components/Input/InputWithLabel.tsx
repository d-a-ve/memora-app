import { useState } from "react";

import getInputError from "@helpers/getInputError";

import { Input } from "./Input";
import InputError from "./InputError";
import { InputWithEyeIcon } from "./InputWithEyeIcon";
import { InputWithLabelPropsType } from "./types";

export function InputWithLabel({
  labelText,
  inputType,
  labelFor,
  required,
  placeHolder,
  isPassword,
  disabled,
  defaultValue = "",
}: InputWithLabelPropsType) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const { isValid, errorMessage } = getInputError(labelFor, inputValue);
  const displayError = touched && !isValid;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-medium" htmlFor={`${labelFor}-input`}>
        {labelText}
      </label>
      {!isPassword ? (
        <Input
          changeHandler={(e) => setInputValue(e.target.value)}
          blurHandler={() => setTouched(true)}
          labelFor={labelFor}
          inputType={inputType}
          required={required}
          inputValue={inputValue}
          placeHolder={placeHolder}
          displayError={displayError}
          disabled={disabled}
        />
      ) : (
        <InputWithEyeIcon
          changeHandler={(e) => setInputValue(e.target.value)}
          blurHandler={() => setTouched(true)}
          labelFor="password"
          inputType="password"
          required={true}
          inputValue={inputValue}
          displayError={displayError}
          disabled={disabled}
        />
      )}
      {displayError && (
        <InputError name={labelFor} errorMessage={errorMessage} />
      )}
    </div>
  );
}

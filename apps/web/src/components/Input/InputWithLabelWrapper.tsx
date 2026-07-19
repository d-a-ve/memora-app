import { useState } from "react";

import getInputError from "@helpers/getInputError";

import { Input } from "./Input";
import InputError from "./InputError";
import { InputWithEyeIcon } from "./InputWithEyeIcon";
import { InputWithLabelWrapperPropsType } from "./types";

export function InputWithLabelWrapper({
  labelText,
  inputType,
  labelFor,
  children,
  required,
  placeHolder,
  isPassword,
}: InputWithLabelWrapperPropsType) {
  const [inputValue, setInputValue] = useState("");
  const [touched, setTouched] = useState(false);
  const { isValid, errorMessage } = getInputError(labelFor, inputValue);
  const displayError = touched && !isValid;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-base" htmlFor={`${labelFor}-input`}>
          {labelText}
        </label>
        {children}
      </div>
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
        />
      )}
      {displayError && (
        <InputError name={labelFor} errorMessage={errorMessage} />
      )}
    </div>
  );
}

import { useState } from "react";

import getInputError from "@helpers/getInputError";

import { InputWithEyeIcon } from "../InputWithEyeIcon";
import InputError from "./../InputError";
import { usePassword } from "./hooks/usePassword";
import { useSetPassword } from "./hooks/useSetPassword";

export function PasswordInput() {
  const [inputValue, setInputValue] = [usePassword(), useSetPassword()];
  const [touched, setTouched] = useState(false);
  const { isValid, errorMessage } = getInputError("password", inputValue);
  const displayError = touched && !isValid;

  return (
    <div className="flex flex-col gap-2">
      <label
        className="font-medium text-base grid gap-1"
        htmlFor="password-input"
      >
        <span>Password</span>
        <span className="font-normal text-sm text-gray-500">
          It must contain one uppercase letter, one lowercase letter, one
          number, one special character, and be at least 8 characters long
        </span>
      </label>
      <InputWithEyeIcon
        changeHandler={(e) => setInputValue(e.target.value)}
        blurHandler={() => setTouched(true)}
        labelFor="password"
        inputType="password"
        required={true}
        inputValue={inputValue}
        displayError={displayError}
      />
      {displayError && (
        <InputError name="password" errorMessage={errorMessage} />
      )}
    </div>
  );
}

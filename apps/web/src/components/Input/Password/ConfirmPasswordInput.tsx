import { useState } from "react";

import { InputWithEyeIcon } from "../InputWithEyeIcon";
import InputError from "./../InputError";
import { usePassword } from "./hooks/usePassword";

export function ConfirmPasswordInput() {
  const passwordValue = usePassword();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isValid = passwordValue === value;
  const errorMessage = !isValid
    ? "Passwords do not match. Please re-enter the same password in both fields."
    : "";
  const displayError = touched && !isValid;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-base" htmlFor="c-password-input">
        Confirm Password
      </label>
      <InputWithEyeIcon
        changeHandler={(e) => setValue(e.target.value)}
        blurHandler={() => setTouched(true)}
        labelFor="c-password"
        inputType="password"
        required={true}
        inputValue={value}
        displayError={displayError}
      />
      {displayError && (
        <InputError name="c-password" errorMessage={errorMessage} />
      )}
    </div>
  );
}

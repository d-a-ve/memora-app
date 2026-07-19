import { ElementRef, useRef, useState } from "react";

import getSVGFromString from "@helpers/getSVGFromString";

import { Input } from "./Input";
import { InputPropsType } from "./types";

const eyeIcon = getSVGFromString("eye", 24, 24);

const eyeWithSlashIcon = getSVGFromString("eyeWithSlash", 24, 24);

export function InputWithEyeIcon({
  changeHandler,
  blurHandler,
  labelFor,
  inputType,
  required,
  inputValue,
  placeHolder,
  displayError,
}: InputPropsType) {
  const ref = useRef<ElementRef<"input">>(null);
  const [isShown, setIsShown] = useState(false);

  const handleIconToggle = () => {
    setIsShown((prev) => !prev);
    ref?.current?.focus();
  };

  return (
    <div className="w-full h-full relative">
      <Input
        changeHandler={changeHandler}
        blurHandler={blurHandler}
        labelFor={labelFor}
        inputType={isShown ? "text" : inputType}
        required={required}
        inputValue={inputValue}
        placeHolder={placeHolder}
        displayError={displayError}
        inputRef={ref}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black focus-visible:outline-primary"
        onClick={handleIconToggle}
        title={isShown ? "Password shown" : "Password hidden"}
      >
        {isShown ? eyeIcon : eyeWithSlashIcon}
      </button>
    </div>
  );
}

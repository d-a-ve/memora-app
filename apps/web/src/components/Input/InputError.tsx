import { InputErrorType } from "./types";

export default function InputError({ name, errorMessage }: InputErrorType) {
  return (
    <span role="alert" id={`${name}-error`} className="text-red-500 text-fs--1">
      {errorMessage}
    </span>
  );
}

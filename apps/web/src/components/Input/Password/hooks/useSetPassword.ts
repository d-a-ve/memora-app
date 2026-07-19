import { useContext } from "react";

import { SetPasswordContext } from "../PasswordProvider";

export function useSetPassword() {
  const setPassword = useContext(SetPasswordContext);
  if (setPassword === null) {
    throw new Error(
      "usePassword must be used in a decendent of PasswordProvider"
    );
  }
  return setPassword;
}

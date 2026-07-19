import { useContext } from "react";

import { PasswordContext } from "../PasswordProvider";

export function usePassword() {
  const password = useContext(PasswordContext);
  if (password === null) {
    throw new Error(
      "usePassword must be used in a decendent of PasswordProvider"
    );
  }
  return password;
}

import { ConfirmPasswordInput } from "./ConfirmPasswordInput";
import { PasswordInput } from "./PasswordInput";
import { PasswordProvider } from "./PasswordProvider";

export function Password() {
  return (
    <PasswordProvider>
      <PasswordInput />
      <ConfirmPasswordInput />
    </PasswordProvider>
  );
}

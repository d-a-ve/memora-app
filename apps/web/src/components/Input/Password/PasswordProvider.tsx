import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

export const PasswordContext = createContext<string | null>(null);
export const SetPasswordContext = createContext<Dispatch<
  SetStateAction<string>
> | null>(null);

export function PasswordProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState("");

  return (
    <PasswordContext.Provider value={password}>
      <SetPasswordContext.Provider value={setPassword}>
        {children}
      </SetPasswordContext.Provider>
    </PasswordContext.Provider>
  );
}

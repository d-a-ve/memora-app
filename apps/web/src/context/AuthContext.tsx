import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

import { UserType } from "../myTypes";

export const AuthContext = createContext({} as UserType | undefined);
export const AuthSetterContext = createContext<
  Dispatch<SetStateAction<UserType | undefined>>
>(undefined as unknown as Dispatch<SetStateAction<UserType | undefined>>);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserType>();

  return (
    <AuthContext.Provider value={currentUser}>
      <AuthSetterContext.Provider value={setCurrentUser}>
        {children}
      </AuthSetterContext.Provider>
    </AuthContext.Provider>
  );
}

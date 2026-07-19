import { useContext } from "react";

import { AuthSetterContext } from "../context/AuthContext";

export default function useAuthApi() {
  const setCurrentUser = useContext(AuthSetterContext);

  return { setCurrentUser };
}

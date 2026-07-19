import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  const currentUser = useContext(AuthContext);

  return { currentUser };
}

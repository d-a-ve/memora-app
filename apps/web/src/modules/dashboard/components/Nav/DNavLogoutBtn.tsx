import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import useUserMutation from "@hooks/useUserMutation";

import { deleteSession } from "@api/auth";

import getSVGFromString from "@helpers/getSVGFromString";
import { toastError } from "@helpers/toastNotifs";

export default function DNavLogoutBtn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logUserOut, isPending: isUserLoggingOut } = useUserMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
      navigate("/login", { replace: true });
    },
    onError: () => {
      toastError("Something went wrong, could not log out!!!");
    },
  });

  return (
    <button
      disabled={isUserLoggingOut}
      onClick={() => logUserOut()}
      className="grid grid-flow-col items-center justify-start gap-3 w-full text-red-500 py-2 px-4 outline-none hover:text-white hover:bg-red-500 focus-ring-visible focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {getSVGFromString("logout", 16, 16)}
      <span>{isUserLoggingOut ? "Logging out..." : "Log out"}</span>
    </button>
  );
}

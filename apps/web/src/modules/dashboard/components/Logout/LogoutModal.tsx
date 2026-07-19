import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import useUserMutation from "@hooks/useUserMutation";

import { deleteSession } from "@api/auth";

import { toastError } from "@helpers/toastNotifs";

import Button from "@components/Button";
import { ModalLayout } from "@components/Layout";

type LogoutModalProps = {
  modal: {
    isOpen: boolean;
    close: () => void;
  };
};
export default function LogoutModal({ modal }: LogoutModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logUserOut, isPending: isUserLoggingOut } = useUserMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
      modal.close();
      navigate("/login", { replace: true });
    },
    onError: () => {
      toastError("Something went wrong, could not log out!!!");
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        modal.isOpen
      ) {
        modal.close();
      }
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [modal.isOpen]);

  return (
    <ModalLayout isModalOpen={modal.isOpen}>
      <div className="bg-white py-12 px-8 rounded-lg" ref={containerRef}>
        <h2 className="mb-6 font-semibold text-fs-1">
          Are you sure you want to log out?
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:flex sm:flex-col-reverse">
          <Button
            intent="secondary"
            label="Cancel"
            onClick={() => modal.close()}
          />
          <Button
            intent="danger"
            label="Logout"
            isLoading={isUserLoggingOut}
            onClick={() => logUserOut()}
          />
        </div>
      </div>
    </ModalLayout>
  );
}

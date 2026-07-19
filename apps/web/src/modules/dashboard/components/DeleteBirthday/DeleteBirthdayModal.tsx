import { useEffect, useRef } from "react";

import useDeleteBirthdayMutation from "@modules/dashboard/hooks/useDeleteBirthdayMutation";

import useBodyOverflow from "@hooks/useBodyOverflow";

import Button from "@components/Button";
import { ModalLayout } from "@components/Layout";

type DeleteBirthdayModalProps = {
  docId: string;
  modal: {
    isOpen: boolean;
    close: () => void;
  };
};
export default function DeleteBirthdayModal({
  modal,
  docId,
}: DeleteBirthdayModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    mutationResult: { mutate: deleteBirthday },
  } = useDeleteBirthdayMutation();
  const { resetBodyOverflow } = useBodyOverflow();

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        modal.isOpen
      ) {
        modal.close();
        resetBodyOverflow();
      }
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [modal.isOpen, resetBodyOverflow]);

  const handleDelete = () => {
    deleteBirthday({ docId });
    modal.close();
  };

  return (
    <ModalLayout isModalOpen={modal.isOpen}>
      <div className="bg-white py-12 px-8 rounded-lg" ref={containerRef}>
        <h2 className="mb-6 font-semibold text-fs-1">Delete Birthday</h2>
        <p>
          Are you sure you want to delete this birthday? This action cannot be
          undone.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:flex sm:flex-col-reverse">
          <Button
            intent="secondary"
            label="Cancel"
            onClick={() => modal.close()}
          />
          <Button
            intent="danger"
            label="Delete"
            onClick={() => handleDelete()}
          />
        </div>
      </div>
    </ModalLayout>
  );
}

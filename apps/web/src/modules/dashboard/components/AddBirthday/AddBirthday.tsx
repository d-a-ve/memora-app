import { useState } from "react";

import useBodyOverflow from "@hooks/useBodyOverflow";

import { ShowMode } from "../../types";
import AddBirthdayModal from "./AddBirthdayModal";
import ShowAddBirthday from "./ShowAddBirthday";

export default function AddBirthday({ showMode }: { showMode: ShowMode }) {
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const { resetBodyOverflow, hideBodyOveflow } = useBodyOverflow();
  const openModal = () => {
    setIsBirthdayModalOpen(true);
    hideBodyOveflow();
  };
  const closeModal = () => {
    setIsBirthdayModalOpen(false);
    resetBodyOverflow();
  };

  return (
    <div>
      {isBirthdayModalOpen ? (
        <AddBirthdayModal
          modal={{
            open: openModal,
            close: closeModal,
            isOpen: isBirthdayModalOpen,
          }}
        />
      ) : (
        <ShowAddBirthday
          showMode={showMode}
          modal={{
            open: openModal,
          }}
        />
      )}
    </div>
  );
}

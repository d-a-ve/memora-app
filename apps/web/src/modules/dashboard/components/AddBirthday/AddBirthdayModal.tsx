import { FormEvent, useEffect, useRef } from "react";

import useAddBirthdayMutation from "@modules/dashboard/hooks/useAddBirthdayMutation";

import useBodyOverflow from "@hooks/useBodyOverflow";

import getValidFormData from "@helpers/getValidFormData";

import Button from "@components/Button";
import { CustomDateInput } from "@components/Date";
import { FormWrapper } from "@components/Form";
import { InputWithLabel } from "@components/Input";
import { DateInput } from "@components/Input/DateInput";
import { ModalLayout } from "@components/Layout";

export default function AddBirthdayModal({
  modal,
}: {
  modal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resetBodyOverflow } = useBodyOverflow();

  const {
    mutationResult: { mutate: addBirthday },
  } = useAddBirthdayMutation();

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

  const addBirthdaySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { formData } = getValidFormData(e);
    const [name, birthdayDate] = formData;
    addBirthday({ name, birthdayDate });
    modal.close();
  };

  return (
    <ModalLayout isModalOpen={modal.isOpen}>
      <div className="bg-white py-12 px-8 rounded-lg" ref={containerRef}>
        <h2 className="mb-6 font-semibold text-fs-1">Add birthday </h2>
        <FormWrapper
          submitFunction={async (e) => {
            addBirthdaySubmit(e);
          }}
        >
          <InputWithLabel
            labelText="Name"
            labelFor="bday name"
            inputType="text"
            required={true}
            placeHolder="John Doe"
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium text-base" htmlFor="birthdayDate">
              Select birthday
            </label>
            <DateInput customInput={<CustomDateInput id="birthdayDate" />} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 sm:flex sm:flex-col-reverse">
            <Button
              intent="secondary"
              label="Cancel"
              onClick={() => modal.close()}
            />
            <Button
              // isLoading={isBirthdayAdding}
              label="Add Birthday"
              type="submit"
            />
          </div>
        </FormWrapper>
      </div>
    </ModalLayout>
  );
}

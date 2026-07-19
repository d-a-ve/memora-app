import { ChangeEvent, FormEvent, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import useUserMutation from "@hooks/useUserMutation";
import { useUserQuery } from "@hooks/useUserQuery";

import { updateUserName } from "@api/auth";

import { cn } from "@helpers/cn";
import { extractErrorMessage } from "@helpers/index";
import { toastError } from "@helpers/toastNotifs";

import { ErrorType } from "@myTypes/index";

import Button from "@components/Button";
import { FormWrapper } from "@components/Form";
import { Input } from "@components/Input/Input";

import CardSectionLayout from "../components/Layout/CardSectionLayout";

type UpdateCurrentUserNameMutationFn = { name: string };

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useUserQuery();
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(
    currentUser ? currentUser.name : ""
  );
  const {
    mutate: updateCurrentUserName,
    isPending: isCurrentUserNameUpdating,
  } = useUserMutation<unknown, ErrorType, UpdateCurrentUserNameMutationFn>({
    mutationFn: ({ name }) => updateUserName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setIsFormEditable(false);
    },
    onError: (error) => {
      toastError(extractErrorMessage(error.message));
    },
  });

  const hasUserNameChanged = nameInputValue !== currentUser?.name;

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormEditable) {
      setIsFormEditable(true);
      return;
    }

    // there is really no need for this as the button will be disabled if there is no change but for the future
    if (!hasUserNameChanged) return;

    updateCurrentUserName({ name: nameInputValue });
  };

  return (
    <CardSectionLayout>
      <h1 className="font-semibold text-fs-1 sm:mb-1 mb-1">Profile</h1>
      <p className="text-fs--1">Manage settings for your account</p>
      <div className="mt-8 relative before:w-full before:h-[1px] before:bg-gray-300 before:absolute before:-top-4">
        <div className="max-w-lg">
          <FormWrapper submitFunction={submitHandler}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name-input" className="font-medium text-base">
                Name
              </label>
              <Input
                inputType="text"
                inputValue={nameInputValue}
                disabled={!isFormEditable}
                labelFor="name"
                required={false}
                changeHandler={(e: ChangeEvent<HTMLInputElement>) =>
                  setNameInputValue(e.target.value)
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className={cn(
                  "disabled:bg-gray-400 disabled:cursor-not-allowed",
                  {
                    "hover:border-transparent hover:text-white":
                      isFormEditable && !hasUserNameChanged,
                  }
                )}
                type="submit"
                label={
                  isFormEditable
                    ? isCurrentUserNameUpdating
                      ? "Saving..."
                      : "Save Changes"
                    : "Edit"
                }
                disabled={isFormEditable && !hasUserNameChanged}
              />
              {isFormEditable && (
                <Button
                  size="sm"
                  intent="secondary"
                  label="Cancel"
                  onClick={() => setIsFormEditable(false)}
                />
              )}
            </div>
          </FormWrapper>
        </div>
      </div>
    </CardSectionLayout>
  );
}

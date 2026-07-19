import { useMutationState, useQueryClient } from "@tanstack/react-query";

import { useUserQuery } from "@hooks/useUserQuery";

import { updateBirthdayDocument } from "@api/birthdays";

import { getDateFromSlashSeparatedString } from "@helpers/getDate";
import { toastSuccess } from "@helpers/toastNotifs";

import { ErrorType } from "@myTypes/index";

import useBirthdayMutation from "./useBirthdayMutation";

type MutationFnType = {
  name: [string, FormDataEntryValue];
  birthdayDate: [string, FormDataEntryValue];
  docId: string;
};

type BirthdaysDataType = Awaited<ReturnType<typeof updateBirthdayDocument>>;

function useEditBirthdayMutation() {
  const { data: currentUser } = useUserQuery();
  const query = useQueryClient();
  const mutation = useBirthdayMutation<
    BirthdaysDataType,
    ErrorType,
    MutationFnType
  >({
    mutationFn: ({ name, birthdayDate, docId }) =>
      updateBirthdayDocument(docId, {
        person_name: name[1] as string,
        person_birthday: getDateFromSlashSeparatedString(
          birthdayDate[1] as string
        ),
      }),
    mutationKey: ["editBirthday"],
    onSettled: async () => {
      toastSuccess("Yayyy, Birthday has been updated successfully!");
      return await query.invalidateQueries({
        queryKey: ["birthdays", currentUser?.$id],
      });
    },
  });

  const variables = useMutationState<MutationFnType>({
    filters: { mutationKey: ["editBirthday"], status: "pending" },
    select: (mutation) => mutation.state.variables as MutationFnType,
  });

  return { mutationResult: mutation, mutationVariables: variables };
}

export default useEditBirthdayMutation;

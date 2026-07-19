import { useMutationState, useQueryClient } from "@tanstack/react-query";

import { useUserQuery } from "@hooks/useUserQuery";

import { createDocInBirthdaysCol } from "@api/birthdays";

import { getDateFromSlashSeparatedString } from "@helpers/getDate";
import { toastSuccess } from "@helpers/toastNotifs";

import { ErrorType } from "@myTypes/index";

import useBirthdayMutation from "./useBirthdayMutation";

type MutationFnType = {
  name: [string, FormDataEntryValue];
  birthdayDate: [string, FormDataEntryValue];
};

type BirthdaysDataType = Awaited<ReturnType<typeof createDocInBirthdaysCol>>;

function useAddBirthdayMutation() {
  const { data: currentUser } = useUserQuery();
  const query = useQueryClient();
  const mutation = useBirthdayMutation<
    BirthdaysDataType,
    ErrorType,
    MutationFnType
  >({
    mutationFn: ({ name, birthdayDate }) =>
      createDocInBirthdaysCol("", {
        user_id: currentUser?.$id,
        person_name: name[1] as string,
        person_birthday: getDateFromSlashSeparatedString(
          birthdayDate[1] as string
        ),
        user_email: currentUser?.email,
      }),
    mutationKey: ["addBirthday"],
    onSettled: async () => {
      toastSuccess("Yayyy, Birthday has been added successfully!");
      return await query.invalidateQueries({
        queryKey: ["birthdays", currentUser?.$id],
      });
    },
  });

  const variables = useMutationState<MutationFnType>({
    filters: { mutationKey: ["addBirthday"], status: "pending" },
    select: (mutation) => mutation.state.variables as MutationFnType,
  });

  return { mutationResult: mutation, mutationVariables: variables };
}

export default useAddBirthdayMutation;

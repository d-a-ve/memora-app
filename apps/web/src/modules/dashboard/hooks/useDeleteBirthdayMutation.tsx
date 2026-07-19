import { useQueryClient } from "@tanstack/react-query";

import { useUserQuery } from "@hooks/useUserQuery";

import { deleteBirthdayDocument } from "@api/birthdays";

import { toastError } from "@helpers/toastNotifs";

import { ErrorType, birthdayDataType } from "@myTypes/index";

import useBirthdayMutation from "./useBirthdayMutation";

type MutationFnType = {
  docId: string;
};

type BirthdaysDataType = Awaited<ReturnType<typeof deleteBirthdayDocument>>;

function useDeleteBirthdayMutation() {
  const { data: currentUser } = useUserQuery();
  const query = useQueryClient();

  const mutation = useBirthdayMutation<
    BirthdaysDataType,
    ErrorType,
    MutationFnType
  >({
    mutationFn: ({ docId }) => deleteBirthdayDocument(docId),
    onMutate: async ({ docId }) => {
      await query.cancelQueries({ queryKey: ["birthdays", currentUser?.$id] });

      const previousBirthdays = query.getQueryData([
        "birthdays",
        currentUser?.$id,
      ]) as birthdayDataType;

      query.setQueryData(["birthdays", currentUser?.$id], {
        ...previousBirthdays,
        total: previousBirthdays?.total - 1,
        documents: previousBirthdays?.documents.filter(
          (birthday) => birthday.$id !== docId
        ),
      });

      // this is returned as context to onError and onSettled
      return { previousBirthdays };
    },
    onError: (err, newTodo, context) => {
      query.setQueryData(
        ["birthdays", currentUser?.$id],
        (context as { previousBirthdays: birthdayDataType }).previousBirthdays
      );
      toastError("Failed to delete birthday!");
    },
    onSettled: () => {
      query.invalidateQueries({
        queryKey: ["birthdays", currentUser?.$id],
      });
    },
  });

  return { mutationResult: mutation };
}

export default useDeleteBirthdayMutation;

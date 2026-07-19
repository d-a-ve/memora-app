import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { ErrorType } from "@myTypes/index";

const useCustomMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationOptions: UseMutationOptions<TData, ErrorType, TVariables, TContext>
) => {
  const mutation = useMutation(mutationOptions);

  return mutation;
};

export default useCustomMutation;

import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";

const useUserMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  mutationOptions: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const userMutation = useMutation<TData, TError, TVariables, TContext>(
    mutationOptions
  );

  return userMutation;
};

export default useUserMutation;

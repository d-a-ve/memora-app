import { useQuery } from "@tanstack/react-query";

import { getUserAccount } from "@api/auth";

export const useUserQuery = (retry?: boolean | number) => {
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getUserAccount,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    retry: retry === undefined ? 3 : retry,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15,
    refetchIntervalInBackground: true,
  });

  return userQuery;
};

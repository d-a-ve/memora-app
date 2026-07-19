import { Navigate } from "react-router-dom";

import { useUserQuery } from "@hooks/useUserQuery";

export function OAuthRedirectRoute() {
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError,
  } = useUserQuery(0);

  if (isCurrentUserLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Something went wrong, please try again.
      </div>
    );

  if (!currentUser)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user was found. Sign up did not work, please try again later
      </div>
    );

  return <Navigate to={`/dashboard/${currentUser.$id}/`} />;
}

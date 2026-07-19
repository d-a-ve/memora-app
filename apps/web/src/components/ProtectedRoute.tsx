import { Navigate, Outlet } from "react-router-dom";

import { useUserQuery } from "@hooks/useUserQuery";

import { PageLoader } from "./Loader";

export function UserProtectedRoute() {
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useUserQuery(1);

  if (isCurrentUserLoading) return <PageLoader />;

  if (!currentUser) return <Navigate to="/login" replace={true} />;

  return <Outlet />;
}

export function ProtectedRouteFromAuthenticatedUser() {
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useUserQuery(0);

  if (isCurrentUserLoading) return <PageLoader />;

  if (currentUser)
    return <Navigate to={`/dashboard/${currentUser.$id}/`} replace={true} />;

  return <Outlet />;
}

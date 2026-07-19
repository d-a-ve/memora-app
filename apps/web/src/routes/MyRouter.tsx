import { Suspense, lazy } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Error404Page from "@pages/Error404Page";

import { DashboardLayout } from "@modules/dashboard";
import DashboardErrorBoundary from "@modules/dashboard/components/Error";

import { PageLoader } from "@components/Loader";
import { OAuthRedirectRoute } from "@components/OAuthRedirectRoute";
import {
  ProtectedRouteFromAuthenticatedUser,
  UserProtectedRoute,
} from "@components/ProtectedRoute";

const Login = lazy(() => import("@pages/Login"));
const Signup = lazy(() => import("@pages/Signup"));
const ForgotPassword = lazy(() => import("@pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/ResetPassword"));
const DashboardOverview = lazy(() => import("@pages/dashboard/Overview"));
const DashboardUpcomingBirthdays = lazy(
  () => import("@pages/dashboard/UpcomingBirthday")
);
const Home = lazy(() => import("@pages/Home"));
const Profile = lazy(() => import("@pages/dashboard/Profile"));
const Feedback = lazy(() => import("@pages/dashboard/Feedback"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <ScrollRestoration
            getKey={(location) => {
              return location.pathname;
            }}
          />
          <Outlet />
        </>
      }
      errorElement={<Error404Page />}
    >
      <Route path="/" element={<Outlet />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRouteFromAuthenticatedUser />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="oauth" element={<OAuthRedirectRoute />} />
      </Route>

      <Route element={<UserProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* I did it this way so that the dashboard layout shows even when an error occurs */}
          <Route errorElement={<DashboardErrorBoundary />}>
            <Route path="/dashboard/:userId" element={<DashboardOverview />} />
            <Route
              path="/dashboard/:userId/upcoming-birthdays"
              element={<DashboardUpcomingBirthdays />}
            />
            <Route path="/dashboard/:userId/profile" element={<Profile />} />
            <Route path="/dashboard/:userId/feedback" element={<Feedback />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

function MyRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
export default MyRouter;

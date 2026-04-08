import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { LoadingScreen } from "./ui/loading-screen";
import { useAppSelector } from "../store/hooks";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isBootstrapping } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isBootstrapping) {
    return <LoadingScreen fullScreen message="Loading" spinnerClassName="h-12 w-12" />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        replace
      />
    );
  }

  return <>{children}</>;
}


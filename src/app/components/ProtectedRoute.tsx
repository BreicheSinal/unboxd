import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "./ui/spinner";
import { useAppSelector } from "../store/hooks";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isBootstrapping, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isBootstrapping || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}


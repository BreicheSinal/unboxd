import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../store/hooks";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isBootstrapping, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isBootstrapping || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}


import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { LoadingScreen } from "../../web/components/ui/loading-screen";
import { useAdminSelector } from "../store/hooks";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isBootstrapping } = useAdminSelector((state) => state.adminAuth);
  const location = useLocation();

  if (isBootstrapping) {
    return <LoadingScreen fullScreen message="Loading admin" spinnerClassName="h-12 w-12" />;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (!user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h1 className="text-xl font-semibold text-red-400">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is authenticated but does not have the required admin claim.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

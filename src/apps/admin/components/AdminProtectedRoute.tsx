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
      <div className="admin-surface flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md border border-[var(--brand-vivid-red)]/35 bg-[var(--brand-vivid-red)]/12 p-6 text-center">
          <h1 className="text-xl font-semibold uppercase tracking-[0.06em] text-[var(--brand-vivid-red)]">Access denied</h1>
          <p className="mt-2 text-sm text-[var(--brand-light-purple)]/75">
            Your account is authenticated but does not have the required admin claim.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

import { useEffect, type ReactNode } from "react";
import { subscribeAdminAuth } from "../store/slices/adminAuthSlice";
import { useAdminDispatch } from "../store/hooks";

export function AdminAuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAdminDispatch();

  useEffect(() => {
    const unsubscribe = subscribeAdminAuth(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

import { createBrowserRouter } from "react-router";
import { AdminLayout } from "./components/AdminLayout";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { AdminSignInPage } from "./pages/AdminSignInPage";
import { AdminOverviewPage } from "./pages/AdminOverviewPage";
import { AdminOrdersPage } from "./pages/AdminOrdersPage";
import { AdminOrderDetailsPage } from "./pages/AdminOrderDetailsPage";
import { AdminTransactionsPage } from "./pages/AdminTransactionsPage";
import { AdminListingsPage } from "./pages/AdminListingsPage";
import { AdminTradesPage } from "./pages/AdminTradesPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";

const adminBasename = (() => {
  if (typeof window === "undefined") {
    return "/";
  }

  const { pathname } = window.location;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "/admin";
  }

  if (pathname.startsWith("/admin.html")) {
    return "/admin.html";
  }

  return "/";
})();

export const adminRouter = createBrowserRouter([
  { path: "/signin", Component: AdminSignInPage },
  {
    path: "/",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, Component: AdminOverviewPage },
      { path: "orders", Component: AdminOrdersPage },
      { path: "orders/:orderId", Component: AdminOrderDetailsPage },
      { path: "transactions", Component: AdminTransactionsPage },
      { path: "listings", Component: AdminListingsPage },
      { path: "trades", Component: AdminTradesPage },
      { path: "users", Component: AdminUsersPage },
    ],
  },
], { basename: adminBasename });

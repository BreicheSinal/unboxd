import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { adminStore } from "./store";
import { adminRouter } from "./routes";
import { AdminAuthBootstrap } from "./components/AdminAuthBootstrap";

export default function AdminApp() {
  return (
    <Provider store={adminStore}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        <AdminAuthBootstrap>
          <RouterProvider router={adminRouter} />
        </AdminAuthBootstrap>
      </ThemeProvider>
    </Provider>
  );
}

import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthBootstrap } from "./store/AuthBootstrap";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </ThemeProvider>
    </Provider>
  );
}

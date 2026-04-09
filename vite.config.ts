import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:3000";

  // Use an explicit app root so outputs are always written to `apps/web/dist`
  const appRoot = path.resolve(__dirname, "apps", "web");

  return {
    root: appRoot,
    publicDir: path.resolve(__dirname, "public"),
    envDir: path.resolve(__dirname),
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used - do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the app's src directory
        "@": path.resolve(appRoot, "./src"),
      },
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname)],
      },
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: path.resolve(appRoot, "dist"),
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});

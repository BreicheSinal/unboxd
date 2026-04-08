import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:3000";

  return {
    root: path.resolve(__dirname, "apps/admin"),
    publicDir: path.resolve(__dirname, "public"),
    envDir: path.resolve(__dirname),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
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
      outDir: path.resolve(__dirname, "dist-admin"),
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});

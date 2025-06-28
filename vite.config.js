import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // if you use one
    include: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}" // ✅ This covers all common test file names
    ],
    exclude: [...configDefaults.exclude, "dist"],
  },
});

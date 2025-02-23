// vite.config.js
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// For React projects
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(), // Include this line for React projects
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

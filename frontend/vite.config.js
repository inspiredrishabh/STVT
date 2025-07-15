import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow network access
    port: 5173,
    proxy: {
      "/api": {
        target: "http://192.168.244.85:5000", // Adjust the target as needed
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

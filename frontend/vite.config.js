import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const backendIP = process.env.VITE_BACKEND_IP || "localhost";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: `http://${backendIP}:5000`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import os from "os";

import react from "@vitejs/plugin-react";

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { address, family, internal } = iface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
  return "localhost"; // Fallback
};

const localIp = getLocalIpAddress();
const ip = `http://${localIp}:5000`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow network access
    port: 5173,
    proxy: {
      "/api": {
        target: ip, // Adjust the target as needed
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

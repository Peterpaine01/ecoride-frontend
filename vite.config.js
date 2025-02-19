import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react()],

  optimizeDeps: {
    include: ["@mapbox/mapbox-sdk", "mapbox-gl"],
    exclude: [],
  },
  resolve: {
    alias: {
      "mapbox-gl": "mapbox-gl/dist/mapbox-gl.js",
    },
  },
});

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://ecoride--ecoride-backend--hbtbyqs8v9w2.code.run",
        changeOrigin: true,
        secure: false,
      },
    },
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
})

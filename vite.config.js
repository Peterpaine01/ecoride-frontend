import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"

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
  plugins: [
    react(),
    visualizer({
      filename: "bundle-report.html",
      template: "treemap", // possible: sunburst, treemap, network
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  optimizeDeps: {
    include: ["@mapbox/mapbox-sdk", "mapbox-gl"],
    exclude: [],
  },
  resolve: {
    alias: {
      "mapbox-gl": "mapbox-gl/dist/mapbox-gl.js",
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          mapbox: ["mapbox-gl", "@mapbox/mapbox-sdk"],
        },
      },
    },
    chunkSizeWarningLimit: 800, // optionnel : augmente la limite avant warning
  },
})

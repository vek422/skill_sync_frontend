import { fileURLToPath, URL } from "node:url"
// @ts-expect-error - Module resolution issue with bundler mode
import tailwindcss from "@tailwindcss/vite"
// @ts-expect-error - Module resolution issue with bundler mode
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
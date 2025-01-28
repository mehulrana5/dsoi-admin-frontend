import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  base: "/dsoi-frontend",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define:{
    "process.env.VITE_BASE_URL":JSON.stringify(process.env.VITE_BASE_URL)
  },
})

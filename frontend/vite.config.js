import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_INTERFACE
// Vite configuration enabling React plugin for fast refresh and JSX transform.
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.REACT_APP_PORT || 5173)
  }
});

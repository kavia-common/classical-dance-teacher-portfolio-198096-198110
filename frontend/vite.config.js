import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * PUBLIC_INTERFACE
 * Vite configuration enabling React plugin for fast refresh and JSX transform.
 * - Reads port from REACT_APP_PORT or VITE_PORT to align with existing env usage.
 * - Defaults to 3000 (requested) if not provided.
 */
export default defineConfig(({ mode }) => {
  // Load .env files and expose only VITE_* to client, but we still can read server envs here.
  const env = loadEnv(mode, process.cwd(), "");
  // Prefer REACT_APP_PORT (given in container env) then VITE_PORT, else default to 3000
  const portRaw = env.REACT_APP_PORT || env.VITE_PORT || "3000";
  const port = Number(portRaw) || 3000;

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
      host: true,
    },
    preview: {
      port,
      strictPort: true,
      host: true,
    },
  };
});

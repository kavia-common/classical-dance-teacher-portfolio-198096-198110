import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for React SPA.
 * - Dev server and preview always bind to 0.0.0.0:3000 with strictPort.
 * - No process.env, dotenv, or shell expansions used for server config.
 * - HMR always connects to 3000.
 * - No auto-open browser on start or preview.
 * - All .env reloads are ignored for server restarts.
 * - No watcher or plugin watches or triggers server reloads for .env.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
    hmr: {
      clientPort: 3000,
      port: 3000
    },
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/vite.config.*'
      ] // Hard ignore of env file and vite config changes
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false
  }
});

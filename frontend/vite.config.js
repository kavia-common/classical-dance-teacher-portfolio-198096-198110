import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for React SPA.
 * - Dev server and preview always bind to 0.0.0.0:3000 with strictPort.
 * - No process.env, dotenv, or shell expansions used for server config.
 * - HMR always connects to 3000.
 * - No auto-open browser on start or preview.
 * - All .env and vite.config.* reloads are ignored for server restarts.
 * - Plugins/handlers must not react to .env or config changes (forced static).
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
    hmr: {
      clientPort: 3000
    },
    // Prevent Vite dev server from restarting on changes to .env* or vite.config.*
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/vite.config.js',
        '**/vite.config.mjs',
        '**/vite.config.ts',
        '**/vite.config.cjs'
      ]
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false
  }
});

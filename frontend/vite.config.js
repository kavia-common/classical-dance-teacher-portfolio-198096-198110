import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for Classical Dance Teacher Profile frontend.
 * - Static: server and preview always bind to 0.0.0.0:3000 (host: true, port: 3000)
 * - No env expansion or dynamic shell commands.
 * - server.watch.ignored includes ['**/.env*', '**/vite.config.*'] for full stability.
 * - No custom plugins causing restarts or reloads on config/env file changes.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
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

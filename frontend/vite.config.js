import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite config for Classical Dance Teacher Profile frontend.
 * - Static: server and preview always bind to 0.0.0.0:3000 (host: true, port: 3000)
 * - server.watch.ignored includes ['**/.env*', '**/vite.config.*'] for full stability.
 * - No dynamic shell commands or inline prose, only valid JS/TS config.
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
        '**/.env*',
        '**/vite.config.*'
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

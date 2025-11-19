import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/** Vite config for React SPA.
 *  - Dev server/preview binds strictly to 0.0.0.0:3000, no .env port expansion.
 *  - Hot Module Replacement (HMR) pinned to port 3000.
 *  - No auto-open browser on start.
 *  - .env changes do not trigger reloads (dotenv not used for server port or reload)
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
      port: 3000,
    },
    // Remove all references to dotenv or environment for dev server config
    watch: {
      ignored: [
        '**/.env',
        '**/.env.*'
      ] // no reload on .env change
    }
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
  },
});

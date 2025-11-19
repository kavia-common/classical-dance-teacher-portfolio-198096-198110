import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/** Vite config for React SPA.
 *  - Dev server/preview binds strictly to 0.0.0.0:3000, no .env port expansion.
 *  - Hot Module Replacement (HMR) pinned to port 3000.
 *  - No auto-open browser on start.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
    hmr: {
      port: 3000,
    },
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
  },
});

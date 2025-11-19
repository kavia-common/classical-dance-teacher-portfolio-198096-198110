import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Vite configuration for Classical Dance Teacher Profile frontend.
 * Configures server/preview to use port 3000 and bind all interfaces.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
  },
  preview: {
    host: true,
    port: 3000,
  },
});

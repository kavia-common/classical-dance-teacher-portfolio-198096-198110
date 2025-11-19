import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
/**
 * Minimal Vite configuration for React app.
 * - Uses @vitejs/plugin-react
 * - Dev server binds to 0.0.0.0:3000 (strictPort: true, open: false)
 * - Preview on same host/port.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});

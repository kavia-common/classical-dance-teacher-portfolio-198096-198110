import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite 5 configuration
 * - Preserves preview host/port and allowedHosts
 * - server.host true binds to 0.0.0.0 (same behavior as previous)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: ['vscode-internal-33160-beta.beta01.cloud.kavia.ai']
  }
});

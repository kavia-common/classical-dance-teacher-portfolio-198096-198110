import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for development server and preview.
 * - server: development dev server
 * - preview: built preview server. We bind to 0.0.0.0 and allow the CI preview host.
 */
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000, strictPort: true, open: false },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['vscode-internal-42370-beta.beta01.cloud.kavia.ai']
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000, strictPort: true, open: false },
  // Ensure preview uses the correct host/port and allows the preview domain
  preview: {
    host: true,
    port: 3000,
    allowedHosts: ['vscode-internal-33160-beta.beta01.cloud.kavia.ai']
  }
});
